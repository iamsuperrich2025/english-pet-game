/* ============================================================
   adv3d_css.js — CSS ของ DOM overlay โลก 3D ทุกโหมด (adv/haunt/heli/drone/
   drive/soccer/mecha) — 🪓 รอบ 544 เฟส 1: ผ่าออกจาก js/adventure3d.js
   ไฟล์นี้เป็น "ข้อมูลล้วน" ห้ามมี logic — ประกาศ window.ADV3D_CSS อย่างเดียว
   ▶ ต้องโหลดก่อน js/adventure3d.js เสมอ (ดู loadAdv3d() ใน js/ui.js)
   ============================================================ */
window.ADV3D_CSS=`  #adv-overlay{position:fixed;inset:0;z-index:95;background:#000;display:none;touch-action:none}
  #adv-overlay.on{display:block}
  #adv-canvas{width:100%;height:100%;display:block}
  .adv-hud{position:absolute;pointer-events:none;font-family:inherit}
  #adv-topbar{top:8px;left:50%;transform:translateX(-50%);display:flex;gap:10px;align-items:center}
  .adv-hp{width:150px;height:16px;background:rgba(0,0,0,.45);border:2px solid #fff;border-radius:10px;overflow:hidden}
  .adv-haunt .adv-hp{display:none}
  .adv-hp-fill{height:100%;background:#66bb6a;transition:width .25s}
  .adv-hp-fill.low{background:#ef5350}
  #adv-coin{color:#fff;font-weight:800;font-size:14px;text-shadow:0 1px 3px #000;white-space:nowrap}
  #adv-board{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.5);border-radius:12px;
    padding:6px 9px;min-width:132px;max-width:190px;pointer-events:none}
  /* 🚁 รอบ 352: กล้องใต้ท้องย้ายไปมุมซ้ายบน (ไม่บังวิวหน้า) → กระดานอันดับหลบลงมาอยู่ใต้กล้อง
     สูตร: y กล้อง 30px + สูงกล้อง 26vh (BC.h) + ช่องไฟ 8px — แก้ BC ต้องแก้ตรงนี้ด้วย */
  .adv-heli #adv-board{top:calc(26vh + 38px)}
  .adv-b-title{color:#ffd54f;font-weight:800;font-size:12px;margin-bottom:2px;white-space:nowrap}
  .adv-b-row{color:#fff;font-size:12px;font-weight:600;display:flex;gap:8px;justify-content:space-between;line-height:1.4}
  .adv-b-row.me{color:#8ef7a5}
  .adv-b-nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px}
  .adv-b-more{color:#bbb;font-size:10px;line-height:.7;text-align:center}
  /* คำเป้าหมายใหญ่ทีละคำ กลางบนจอ (แทนลิสต์ 10 คำเดิม) — ตัวอักษรเก็บแล้วไฮไลต์เขียว จบคำแล้วเด้งคำถัดไปเอง
     · top:82 เลี่ยงชนแถบ "👻 หนี!" (top:52) + topbar · pointer-events:none ไม่บังนิ้ว · อยู่เหนือ crosshair/คอนโซล */
  #adv-words{top:82px;left:50%;transform:translateX(-50%);text-align:center;background:rgba(0,0,0,.4);
    border-radius:16px;padding:7px 16px;pointer-events:none;max-width:94vw}
  .adv-fword{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}
  .adv-fch{display:inline-block;min-width:30px;text-align:center;font-size:clamp(20px,5.5vw,34px);font-weight:800;
    color:#fff;background:rgba(255,255,255,.15);border-radius:9px;padding:3px 8px;text-shadow:0 2px 4px #000;transition:background .2s,box-shadow .2s}
  .adv-fch.got{background:#66bb6a;box-shadow:0 0 13px #66bb6a}
  .adv-fth{color:#ffe082;font-size:clamp(13px,3.4vw,18px);font-weight:700;margin-top:4px;text-shadow:0 1px 3px #000}
  /* ⚽ รอบ 399 (ผู้ใช้ส่งภาพ): จอมือถือเตี้ย top:82px กลายเป็นกลางจอ = แผงคำบังป้ายตัวอักษรที่ต้องเตะพอดี
     → ย้ายลงล่างสุดตรงกลาง วางเหนือแถบตัวอักษรที่เก็บ (#adv-inv bottom:8px) + ย่อขนาดให้เป็นข้อมูลอ้างอิง
     กว้างไม่เกิน 66vw กันไปทับสติ๊กเล็งซ้ายล่าง/ปุ่มเตะขวาล่าง */
  /* 🪞📝 รอบ 967 (ผู้ใช้ส่งภาพ): กระจกมองหลังเลื่อนขึ้นไปแทนที่ป้ายเตือน+ป้ายความเร็ว (top:82→52)
     → ป้ายทั้ง 2 ลงมาเรียงใต้กระจกแบบไม่ซ้อนกัน (ดู .adv-drive #adv-inst/#adv-warn/#adv-junc/#adv-lawwarn ท้ายไฟล์)
     → คำเป้าหมายย้ายไปช่องว่าง "ระหว่างกระจกมองหลังกับปุ่ม 👁️ มุมกล้อง" ย่อตัวอักษรให้พอดีช่อง ไม่ทับของอื่น
     left = 50% + 130(ครึ่งกระจก) + 8 · right = 100(ปุ่มมุมกล้อง) + 16 → กว้าง 386px ที่จอ 1280 · 152px ที่จอ 812 */
  .adv-drive #adv-words{top:48px;left:calc(50% + 138px);right:116px;transform:none;max-width:none;
    width:fit-content;margin-left:auto;margin-right:auto;   /* กล่องหดพอดีคำ แล้วจัดกลางช่องว่าง (left+right+width:auto margins) */
    box-sizing:border-box;padding:3px 7px;border-radius:12px}
  .adv-drive #adv-words .adv-fword{gap:3px}
  .adv-drive #adv-words .adv-fch{font-size:clamp(10px,1.6vw,16px);min-width:0;padding:1px 3px;border-radius:6px;line-height:1.25}
  .adv-drive #adv-words .adv-fth{font-size:clamp(9px,1.4vw,12px);margin-top:2px;line-height:1.3}
  .adv-mirror{position:absolute;pointer-events:none;z-index:4;border-radius:6px;overflow:hidden;display:none;
    border:3px solid rgba(18,20,24,.94);box-shadow:0 2px 8px rgba(0,0,0,.5),inset 0 0 14px rgba(0,0,0,.4)}
  .adv-drive .adv-mirror{display:block}
  .adv-drive.cam3 .adv-mirror{display:none}
  .adv-mirror::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;
    background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,0) 35%)}
  #adv-mirror-rear{left:50%;top:52px;transform:translateX(-50%);width:260px;height:74px}   /* 🪞 รอบ 967: 82→52 (⚠️ ต้องตรงกับ MIRROR_REAR.t ใน adventure3d.js) */
  #adv-mirror-l{left:8px;top:38%;width:130px;height:84px}
  #adv-mirror-r{right:8px;top:38%;width:130px;height:84px}
  /* 🔎 รอบ 969 (ผู้ใช้สั่ง): ปุ่มย่อ/ขยายกระจกมองหลัง มุมล่างขวาของกรอบกระจก
     — ขนาด .mini ต้องตรงกับ MIRROR_REAR_MINI ใน adventure3d.js (สัดส่วนภาพ WebGL ที่เรนเดอร์จริง) */
  #adv-mirror-rear.mini{width:150px;height:43px}
  #adv-mirror-toggle{position:absolute;right:2px;bottom:2px;width:19px;height:19px;padding:0;
    border-radius:5px;border:1px solid rgba(255,255,255,.55);background:rgba(10,10,14,.72);color:#fff;
    font-size:12px;font-weight:900;line-height:1;font-family:inherit;display:flex;
    align-items:center;justify-content:center;pointer-events:auto;z-index:1;cursor:pointer}
  #adv-mirror-toggle:active{background:rgba(60,60,70,.85)}
  /* 🪞🧑‍🤝‍🧑 รอบ 973: ป้ายชื่อเพื่อนที่ขับตามมา — ลอยเหนือรถเขาในกระจกมองหลัง
     กรอบนี้ JS ตั้ง left/top/width/height เอง (สูตรเดียวกับ scissor ของ mirrorPass) จึงทับภาพกระจกพอดี
     ไม่เกาะ #adv-mirror-rear เพราะกรอบนั้นมี border 3px = ขอบเหลื่อมภาพ WebGL จริง */
  #adv-mirror-tags{position:absolute;z-index:4;display:none;overflow:hidden;pointer-events:none;border-radius:6px}   /* z เท่ากรอบกระจกแต่ต่อท้าย DOM = อยู่เหนือกระจก · ยังต่ำกว่าแถบแจ้งเตือน #adv-banner(5) ที่พาดผ่านตอนจอเตี้ย */
  .adv-drive.cam3 #adv-mirror-tags{display:none!important}
  /* ⚠️ ป้ายต้อง "เล็กจริง" — กรอบกระจกสูงแค่ 74px ป้ายอ้วนบังถนนหลังรถจนดูกระจกไม่ได้ (เจอตอนทดสอบรอบนี้)
     พื้นหลังกึ่งโปร่ง + ดาวระดับชั้นบีบชิด = อ่านชื่อออกแต่ยังมองทะลุเห็นรถที่ตามมา */
  .adv-mtag{position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;
    font-size:8px;font-weight:800;line-height:1.25;color:#fff;padding:0 4px;border-radius:6px;
    background:rgba(8,10,14,.58);border:1px solid rgba(255,255,255,.26);
    text-shadow:0 1px 2px rgba(0,0,0,.95);box-shadow:0 1px 3px rgba(0,0,0,.5)}
  .adv-mtag i{font-style:normal;opacity:.78;margin-left:2px;font-size:7px;font-weight:700}
  .adv-mtag .gmark{font-size:6px;margin-left:2px;letter-spacing:-1px;vertical-align:1px;opacity:.95}
  #adv-mirror-tags.mini .adv-mtag{font-size:7px;padding:0 3px;border-radius:5px}
  #adv-mirror-tags.mini .adv-mtag i{display:none}
  /* 📯🚦 รอบ 975: ไฟเลี้ยว/แตรของเพื่อนที่ตามมา — ทั้งคู่ยืมช่องเน็ตที่มีอยู่แล้ว (tl/แชทลอยหัว) ไม่ต้องแก้ rules
     ไฟเลี้ยว: ลูกศรกะพริบหน้าชื่อ (เรตใกล้เคียงไฟเลี้ยวจริง ~0.5s) · แตร: ป้ายทั้งใบเรืองส้ม+เด้งสั้นๆ ตอนกด */
  .mt-turn{display:inline-block;margin-right:2px;color:#ffb020;text-shadow:0 0 3px rgba(255,176,32,.9);
    animation:mtagTurnBlink .5s steps(1) infinite}
  @keyframes mtagTurnBlink{0%,49%{opacity:1}50%,100%{opacity:.15}}
  /* ⚠️ ห้ามใส่ transform ใน keyframe นี้ — ตัว .adv-mtag ใช้ inline style transform:translate(...) วางตำแหน่งจาก JS
     ทุกเฟรมอยู่แล้ว (mirrorTagsTick) ถ้า animation ไปแตะ transform ด้วยจะ "แย่งชนะ" inline style แล้วป้ายกระโดดไปมุมจอ */
  .adv-mtag.honk{animation:mtagHonk .5s ease-in-out infinite;
    background:rgba(255,140,20,.65)!important;border-color:rgba(255,200,90,.85)!important;
    box-shadow:0 0 7px rgba(255,150,30,.85)!important}
  @keyframes mtagHonk{0%,100%{filter:brightness(1)}50%{filter:brightness(1.5)}}
  html.no-anim .mt-turn,html.no-anim .adv-mtag.honk{animation:none}   /* โหมดลดแอนิเมชัน */
  .adv-soccer #adv-words{top:auto;bottom:38px;max-width:66vw;padding:4px 12px}
  .adv-soccer #adv-words .adv-fch{font-size:clamp(15px,3.2vw,22px);min-width:22px;padding:2px 6px;border-radius:7px}
  .adv-soccer #adv-words .adv-fth{font-size:clamp(11px,2.4vw,14px);margin-top:2px}
  #adv-hearts{display:none;left:10px;top:42px;font-size:24px;letter-spacing:3px;pointer-events:none;
    filter:drop-shadow(0 1px 3px rgba(0,0,0,.85))}
  #adv-survive{display:none;left:10px;top:78px;font-size:14px;font-weight:800;color:#c6f6d5;pointer-events:none;
    background:rgba(0,0,0,.45);border-radius:10px;padding:3px 10px;text-shadow:0 1px 3px #000}
  #adv-map{top:8px;right:8px;pointer-events:auto;cursor:pointer}  /* รอบ 144: แตะ = เปิดแผนที่ขยาย */
  #adv-exit{top:118px;right:8px;pointer-events:auto;background:rgba(211,47,47,.92);color:#fff;border:2px solid #fff;
    border-radius:12px;font-weight:800;font-size:14px;padding:7px 12px;font-family:inherit}
  #adv-hunt{top:52px;left:50%;transform:translateX(-50%);color:#ff5252;font-weight:900;font-size:18px;
    text-shadow:0 1px 4px #000;background:rgba(0,0,0,.5);border-radius:12px;padding:4px 14px;display:none;
    animation:advHuntPulse .6s infinite}
  @keyframes advHuntPulse{0%,100%{opacity:1}50%{opacity:.55}}
  /* 🏨 รอบ 684: โรงแรมผีสิง — ป้าย "กด E", ป้ายสอนไฟฉาย 2 ภาษา, ปุ่มจอสัมผัส */
  #adv-act{display:none;left:50%;transform:translateX(-50%);bottom:96px;color:#ffe9a8;font-weight:800;
    font-size:clamp(12px,2.6vh,15px);background:rgba(0,0,0,.58);border:1px solid rgba(255,214,120,.5);
    border-radius:12px;padding:5px 14px;pointer-events:none;text-shadow:0 1px 3px #000}
  #adv-torchhint{display:none;left:50%;top:56%;transform:translateX(-50%);text-align:center;color:#fff;
    font-weight:800;font-size:clamp(13px,3vh,19px);line-height:1.5;background:rgba(0,0,0,.55);
    border:2px solid rgba(255,225,140,.6);border-radius:14px;padding:8px 18px;pointer-events:none;
    text-shadow:0 2px 6px #000;animation:advTorchPulse 1.5s ease-in-out infinite}
  #adv-torchhint i{opacity:.85;font-size:.86em}
  @keyframes advTorchPulse{0%,100%{opacity:1;box-shadow:0 0 0 rgba(255,220,140,0)}50%{opacity:.72;box-shadow:0 0 22px rgba(255,220,140,.35)}}
  #adv-torch,#adv-use{display:none;position:absolute;z-index:6;flex-direction:column;align-items:center;
    justify-content:center;width:62px;height:62px;border-radius:50%;border:2px solid rgba(255,255,255,.7);
    background:rgba(20,16,10,.6);color:#fff;font-size:22px;font-family:inherit;cursor:pointer;pointer-events:auto}
  #adv-torch small,#adv-use small{font-size:9px;font-weight:800;line-height:1}
  /* ⚠️ วางชิดล่างเสมอ — เคยตั้ง bottom:176px แล้วบนจอเตี้ย 812×375 ปุ่ม "ใช้" เลื่อนขึ้นไปทับปุ่ม 🚪 ออก */
  #adv-torch{right:14px;bottom:20px}
  #adv-use{right:14px;bottom:92px}
  #adv-torch.on{background:rgba(255,214,120,.85);color:#2b1c00;border-color:#fff5d0;box-shadow:0 0 18px rgba(255,220,140,.7)}
  .adv-touch.adv-haunt #adv-torch,.adv-touch.adv-haunt #adv-use{display:flex}
  #adv-inv{bottom:8px;left:50%;transform:translateX(-50%);max-width:70vw;background:rgba(0,0,0,.42);
    border-radius:12px;padding:5px 10px;display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
  .adv-inv-ch{color:#fff;font-weight:800;font-size:13px;background:rgba(255,255,255,.18);border-radius:6px;padding:1px 6px}
  .adv-inv-empty{color:#eee;font-size:12px}
  #adv-cross{top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;
    background:rgba(255,255,255,.9);box-shadow:0 0 4px #000}
  .adv-haunt #adv-cross{display:none}
  #adv-dmg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(255,0,0,.55));opacity:0}
  #adv-dmg.on{animation:advDmg .5s ease-out}
  @keyframes advDmg{0%{opacity:1}100%{opacity:0}}
  .adv-hunted #adv-dmg{animation:advHuntVig 1.1s ease-in-out infinite}
  @keyframes advHuntVig{0%,100%{opacity:.25}50%{opacity:.6}}
  #adv-banner{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#fff;
    font-size:20px;text-shadow:0 2px 6px #000;opacity:0;pointer-events:none;background:rgba(0,0,0,.55);
    border-radius:16px;padding:12px 22px;max-width:86vw;z-index:5}
  #adv-banner.show{animation:advBan 2.4s ease-out}
  #adv-banner.stay{opacity:1;animation:none;pointer-events:auto}
  /* 🕯️ รอบ 1060: ข้อความภารกิจโรงแรมต้องอ่านง่ายแต่ไม่บังฉากหลอน */
  .adv-haunt #adv-banner{font-size:clamp(13px,2.6vh,17px);line-height:1.35;padding:8px 14px;
    max-width:min(72vw,620px);border-radius:11px;background:rgba(3,3,5,.68)}
  .adv-haunt #adv-banner small{font-size:.82em;font-weight:560;color:#e8e1d6}
  .adv-ban-coin{color:#ffd54f;font-weight:900}
  @keyframes advBan{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}
    20%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
  .adv-ko{font-size:22px;font-weight:800}
  .adv-ko small{font-size:14px;font-weight:600;color:#ffcdd2}
  .adv-ko-btn{margin-top:10px;background:#43a047;color:#fff;border:2px solid #fff;border-radius:12px;
    font-weight:800;font-size:16px;padding:9px 20px;font-family:inherit}
  #adv-scare{position:absolute;inset:0;pointer-events:none;z-index:9;display:none;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at center,rgba(120,0,0,.85),#000 78%)}
  #adv-scare.on{display:flex;animation:advScare 1.5s ease-out forwards}
  #adv-scare span{font-size:56vh;line-height:1;filter:drop-shadow(0 0 40px #f00)}
  #adv-scare img{display:none;max-width:100vw;max-height:100vh;object-fit:contain;
    filter:drop-shadow(0 0 55px #f00) contrast(1.12) saturate(1.15)}
  #adv-scare.has-img img{display:block}
  #adv-scare.has-img span{display:none}
  @keyframes advScare{0%{opacity:0;transform:scale(.25)}8%{opacity:1;transform:scale(1.15)}
    16%{transform:scale(.95)}24%{transform:scale(1.08)}70%{opacity:1}100%{opacity:0;transform:scale(1.35)}}
  .adv-shake{animation:advShake .12s linear 9}
  @keyframes advShake{0%{transform:translate(0,0)}25%{transform:translate(-12px,6px)}50%{transform:translate(10px,-8px)}
    75%{transform:translate(-8px,-6px)}100%{transform:translate(9px,7px)}}
  #adv-joy{position:absolute;bottom:18px;left:18px;width:110px;height:110px;border-radius:50%;
    background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.4);pointer-events:none;display:none}
  #adv-joy-dot{position:absolute;left:50%;top:50%;width:44px;height:44px;border-radius:50%;
    background:rgba(255,255,255,.5);transform:translate(-50%,-50%)}
  #adv-shoot{position:absolute;bottom:26px;right:22px;width:76px;height:76px;border-radius:50%;pointer-events:auto;
    background:rgba(255,167,38,.9);border:3px solid #fff;font-size:32px;display:none}
  .adv-touch #adv-joy{display:block}
  .adv-touch #adv-shoot{display:block}
  .adv-touch.adv-haunt #adv-shoot{display:none}
  .adv-touch.adv-heli #adv-shoot{display:none}
  .adv-touch.adv-drone #adv-shoot{display:none}
  .adv-touch.adv-mecha #adv-shoot{display:none}   /* รอบ 221: โลกหุ่นใช้ #mecha-fire (🔫) แทน — ซ่อนปุ่มยิงส้ม 🔥 ที่เผลอโผล่มาทับ ▼ มุมขวาล่าง */
  .adv-heli #adv-cross{display:none}
  /* 🛸 โหมดโดรน FPV: OSD สีเขียวเรือง + เรติเคิลกรอบ + ขอบจอมืด (ฟีลกล้อง FPV) */
  .adv-drone #adv-inst{display:block;color:#7cff9d;font-family:'Courier New',monospace;letter-spacing:.5px;
    background:rgba(0,22,8,.4);border:1px solid rgba(124,255,157,.4);text-shadow:0 0 6px rgba(124,255,157,.75)}
  .adv-drone #adv-gauges,.adv-drone #adv-cockpit{display:none}
  .adv-drone #adv-cross{width:22px;height:22px;background:none;border:2px solid rgba(124,255,157,.85);
    border-radius:0;box-shadow:0 0 5px rgba(0,0,0,.85)}
  #adv-overlay.adv-drone:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;
    box-shadow:inset 0 0 130px 34px rgba(0,0,0,.5)}
  /* 🌀 ใบพัดโดรนซ้าย-ขวา (รอบ 323) — แขน+มอเตอร์+จานใบพัดเบลอหมุน เอียงตามมุมกล้อง FPV
     ความเร็วหมุนผูกกับคันเร่งจริงผ่านตัวแปร --pspin (ตั้งใน tickDrone) */
  #adv-props{position:absolute;inset:0;pointer-events:none;display:none;z-index:2;overflow:hidden}
  .adv-drone #adv-props{display:block}
  #adv-props .prop{position:absolute;bottom:4vh;width:34vmin;height:34vmin;
    transform:perspective(420px) rotateX(56deg)}
  #adv-props .prop-l{left:-8vmin}
  #adv-props .prop-r{right:-8vmin}
  #adv-props .prop i{position:absolute;inset:0;border-radius:50%;
    background:conic-gradient(rgba(226,235,245,.34) 0deg 14deg,rgba(226,235,245,.05) 14deg 172deg,
      rgba(226,235,245,.34) 180deg 194deg,rgba(226,235,245,.05) 194deg 360deg);
    filter:blur(1.1px);animation:advProp var(--pspin,.3s) linear infinite;
    box-shadow:inset 0 0 26px rgba(0,0,0,.28),0 0 12px rgba(0,0,0,.25)}
  #adv-props .prop b{position:absolute;left:50%;top:50%;width:17%;height:17%;transform:translate(-50%,-50%);
    border-radius:50%;background:radial-gradient(circle at 35% 30%,#79808a,#22252a 72%);
    box-shadow:0 0 9px rgba(0,0,0,.65)}
  #adv-props .prop:after{content:'';position:absolute;left:50%;top:50%;width:60%;height:8%;border-radius:5px;
    background:linear-gradient(180deg,#454b55,#181b20);box-shadow:0 2px 6px rgba(0,0,0,.5);transform-origin:0 50%}
  #adv-props .prop-l:after{transform:translateY(-50%) rotate(38deg)}
  #adv-props .prop-r:after{transform:translateY(-50%) rotate(142deg)}
  @keyframes advProp{to{transform:rotate(360deg)}}
  html.no-anim #adv-props .prop i{animation:none}
  /* 💥 ชนกำแพง: ทั้งชุดสะบัด + ใบพัดหมุนช้าลง (ตั้ง --pspin เป็นค่าสตอลใน tickDrone) */
  #adv-props.hit{animation:propShake .42s ease-out}
  #adv-props.hit .prop i{filter:blur(2.2px) saturate(.5) brightness(.8)}
  @keyframes propShake{0%{transform:translate3d(0,0,0)}18%{transform:translate3d(-7px,5px,0)}
    42%{transform:translate3d(6px,-4px,0)}68%{transform:translate3d(-4px,2px,0)}100%{transform:none}}
  html.no-anim #adv-props.hit{animation:none}
  /* 🌀 ใบพัดหัก: ข้างที่หักหยุดหมุน เอียงตก สีมืด + มอเตอร์กะพริบแดง (ซ่อมด้วยการเก็บตัวอักษร) */
  #adv-props.broken-l .prop-l i,#adv-props.broken-r .prop-r i{animation:none;opacity:.5;
    filter:blur(.4px) saturate(.25) brightness(.55);transform:rotate(24deg)}
  #adv-props.broken-l .prop-l b,#adv-props.broken-r .prop-r b{background:radial-gradient(circle at 40% 35%,#ff8a80,#5b1a15 72%);
    animation:propWarn .7s ease-in-out infinite}
  @keyframes propWarn{0%,100%{box-shadow:0 0 9px rgba(0,0,0,.65)}50%{box-shadow:0 0 16px 4px rgba(255,82,82,.75)}}
  html.no-anim #adv-props .prop b{animation:none}
  /* 🪫 แบตต่ำ: แถบ OSD เปลี่ยนเป็นแดงกะพริบ */
  .adv-drone #adv-inst.bat-low{color:#ff8f8f;border-color:rgba(255,120,120,.6);
    background:rgba(40,0,0,.42);text-shadow:0 0 6px rgba(255,120,120,.8);animation:batLow 1.1s ease-in-out infinite}
  @keyframes batLow{0%,100%{opacity:1}50%{opacity:.55}}
  html.no-anim .adv-drone #adv-inst.bat-low{animation:none}
  /* 🏁📸 ปุ่มโหมดแข่ง + กล้อง (โชว์เฉพาะโลกโดรน · ซ้อนกันมุมขวาล่าง เหนือปุ่มยิงที่ซ่อนอยู่แล้ว) */
  #adv-race,#adv-shot{position:absolute;right:14px;display:none;pointer-events:auto;z-index:5;
    width:62px;padding:6px 0 4px;border-radius:12px;border:1px solid rgba(124,255,157,.5);
    background:rgba(0,26,12,.62);color:#9dffc4;font-size:19px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,255,157,.6)}
  #adv-race small,#adv-shot small{display:block;font-size:9.5px;letter-spacing:.02em}
  /* วางใต้ปุ่ม 🚪ออก มุมขวาบน — พ้นจานใบพัดขวา (เริ่มที่ ~265px) และพ้นจอยสติ๊กมุมล่างซ้าย */
  #adv-race{top:164px} #adv-shot{top:212px}
  .adv-drone #adv-race,.adv-drone #adv-shot{display:block}
  #adv-race:active,#adv-shot:active{background:rgba(124,255,157,.28)}
  #adv-race.on{background:rgba(255,214,79,.22);border-color:#ffd54f;color:#ffe9a3;text-shadow:0 0 6px rgba(255,213,79,.7)}
  /* 🌧️🎚️ ปุ่มที่ปัดน้ำฝน + ปรับมุมนั่ง (เฉพาะโลกเฮลิฯ · วางใต้ปุ่มออก มุมขวาบน) */
  /* ⚠️ คอลัมน์ขวาเต็มถึง y~317 (ออก/แชท/ไมค์/ลำโพง/โหมดเสียง) → วางคู่นี้ "ชิดล่างขวา" แทน
     ยึดจากขอบล่าง จอเตี้ยแค่ไหนก็ไม่หลุด */
  #adv-wiper,#adv-seat{position:absolute;bottom:10px;display:none;pointer-events:auto;z-index:6;
    width:58px;padding:5px 0 3px;border-radius:12px;border:1px solid rgba(124,200,255,.5);
    background:rgba(0,18,32,.72);color:#a9dcff;font-size:17px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,200,255,.6)}
  #adv-wiper small,#adv-seat small{display:block;font-size:9px;letter-spacing:.02em}
  /* 🚰 เกจน้ำยาล้างกระจก (รอบ 542) — 5 ขีดใต้ป้ายชื่อปุ่มที่ปัด */
  #adv-wiper{position:relative}
  #adv-wiper .wfuel{display:flex;gap:2px;justify-content:center;margin-top:2px}
  #adv-wiper .wfuel i{width:6px;height:3px;border-radius:1px;transition:background .2s}
  #adv-visor{position:absolute;bottom:10px;right:142px;display:none;pointer-events:auto;z-index:6;
    width:58px;padding:5px 0 3px;border-radius:12px;border:1px solid rgba(124,200,255,.5);
    background:rgba(0,18,32,.72);color:#a9dcff;font-size:17px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,200,255,.6)}
  #adv-visor small{display:block;font-size:9px;letter-spacing:.02em}
  .adv-heli #adv-visor{display:block}
  #adv-visor:active{background:rgba(124,200,255,.28)}
  #adv-visor.on,#adv-wiper.on,#adv-light.on{background:rgba(124,255,157,.2);border-color:#7cff9d;color:#c6ffd8}
  /* 💡 ปุ่มไฟส่องหมอก (รอบ 350) — ต่อแถวล่างขวา: seat 14 · wiper 78 · visor 142 · light 206 */
  #adv-light{position:absolute;bottom:10px;right:206px;display:none;pointer-events:auto;z-index:6;
    width:58px;padding:5px 0 3px;border-radius:12px;border:1px solid rgba(124,200,255,.5);
    background:rgba(0,18,32,.72);color:#a9dcff;font-size:17px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(124,200,255,.6)}
  #adv-light small{display:block;font-size:9px;letter-spacing:.02em}
  .adv-heli #adv-light{display:block}
  #adv-light:active{background:rgba(124,200,255,.28)}
  /* 🚶 รอบ 375: ปุ่มลงจากเฮลิฯ — โชว์เฉพาะตอนขับ+จอดสนิท (คลาส show-dismount จาก tickHeli) */
  #adv-dismount{position:absolute;bottom:10px;right:270px;display:none;pointer-events:auto;z-index:6;
    width:64px;padding:6px 0 4px;border-radius:12px;border:1px solid rgba(185,255,221,.65);
    background:rgba(0,40,24,.78);color:#b9ffdd;font-size:19px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(57,255,178,.6)}
  #adv-dismount small{display:block;font-size:9px;letter-spacing:.02em}
  #adv-dismount:active{background:rgba(57,255,178,.3)}
  .adv-heli.show-dismount #adv-dismount{display:block}
  /* ⌨️🚁 รอบ 818 (ผู้ใช้สั่ง): ป้ายบอกปุ่ม Space/Shift ขึ้น-ลง ค้างไว้ทางขวา — เฉพาะคนเล่นด้วยคอมพิวเตอร์
     โผล่เมื่อ: มีเมาส์/แป้นพิมพ์จริง (คลาส kbd จาก HAS_KBD) + กำลังขับเอง (ไม่ใช่เฟสเดิน/นั่ง/วิงสูท = ไม่มี .hfoot) */
  #adv-keyhint{position:absolute;right:12px;top:44%;transform:translateY(-50%);z-index:6;display:none;
    pointer-events:none;background:rgba(6,16,28,.74);border:1.5px solid rgba(120,220,255,.42);
    border-radius:12px;padding:7px 9px;box-shadow:0 4px 14px rgba(0,0,0,.45)}
  .adv-heli.kbd:not(.hfoot) #adv-keyhint{display:block}
  .adv-drone.kbd #adv-keyhint{display:block}   /* 🛸⌨️ รอบ 821: โดรน FPV บังคับขึ้น-ลงด้วย Space/Shift เหมือนกัน — ไม่มีเฟสเดินเท้าจึงไม่เช็ก .hfoot */
  #adv-keyhint>b{display:block;font-size:10px;color:#9fd8ff;font-weight:800;margin-bottom:5px;
    white-space:nowrap;text-align:center}
  #adv-keyhint .kh-row{display:flex;align-items:center;gap:7px;margin-top:4px}
  #adv-keyhint .kh-key{min-width:38px;height:22px;flex:none;border-radius:6px;display:flex;align-items:center;
    justify-content:center;padding:0 6px;font-size:10.5px;font-weight:900;color:#0e2136;line-height:1;
    background:linear-gradient(180deg,#eaf6ff,#a9d3f2);box-shadow:0 2px 0 rgba(0,0,0,.45)}
  #adv-keyhint .kh-key.on{background:linear-gradient(180deg,#ffe9a8,#ffc44d);transform:translateY(2px);
    box-shadow:0 0 9px rgba(255,200,90,.85)}
  #adv-keyhint .kh-tx{font-size:11.5px;color:#dff4ff;font-weight:700;white-space:nowrap;text-shadow:0 1px 3px #000}
  #adv-keyhint .kh-tx b{color:#ffd98a}
  @media (max-height:430px){
    .adv-heli.kbd:not(.hfoot) #adv-keyhint,.adv-drone.kbd #adv-keyhint{display:flex;align-items:center;gap:9px}
    #adv-keyhint{right:12px;top:auto;bottom:66px;transform:none;padding:4px 8px}
    #adv-keyhint>b{display:none}
    #adv-keyhint .kh-row{margin-top:0;gap:5px}
  }
  /* 🚶🪂 รอบ 354: เฟสเดินเท้าในโลกเฮลิฯ */
  #adv-wing,#adv-tour{position:absolute;bottom:10px;display:none;pointer-events:auto;z-index:7;
    width:64px;padding:6px 0 4px;border-radius:12px;border:1px solid rgba(255,213,79,.65);
    background:rgba(40,28,0,.78);color:#ffe9a8;font-size:19px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(255,213,79,.6)}
  #adv-wing{right:14px} #adv-tour{right:86px}
  #adv-wing small,#adv-tour small{display:block;font-size:9px;letter-spacing:.02em}
  #adv-wing:active,#adv-tour:active{background:rgba(255,213,79,.3)}
  .adv-heli.show-wing #adv-wing{display:block}
  .adv-heli.show-tour #adv-tour{display:block}
  /* 🪧 รอบ 362: ปุ่ม+หน้าต่างเช่าป้ายโฆษณา (เฟสเดินเท้าเท่านั้น) */
  #adv-adshop{position:absolute;bottom:10px;right:158px;display:none;pointer-events:auto;z-index:7;
    width:64px;padding:6px 0 4px;border-radius:12px;border:1px solid rgba(255,213,79,.65);
    background:rgba(40,28,0,.78);color:#ffe9a8;font-size:19px;line-height:1.1;
    font-family:'Courier New',monospace;text-shadow:0 0 6px rgba(255,213,79,.6)}
  #adv-adshop small{display:block;font-size:9px;letter-spacing:.02em}
  #adv-adshop:active{background:rgba(255,213,79,.3)}
  .adv-heli.show-adshop #adv-adshop{display:block}
  #adv-adshop-dlg{position:absolute;inset:0;display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.55);z-index:9;pointer-events:auto}
  #adv-adshop-dlg .ash-card{background:#10202f;border:1px solid #3d5a75;border-radius:14px;
    padding:8px 10px;width:min(92vw,560px);max-height:92vh;color:#dceeff}
  #adv-adshop-dlg .ash-head{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  #adv-adshop-dlg .ash-head b{font-size:14px;white-space:nowrap}
  #adv-adshop-dlg .ash-head small{color:#9fc0da;font-size:10px;line-height:1.25;flex:1}
  #adv-adshop-dlg .ash-x{background:none;border:none;color:#9fc0da;font-size:17px;cursor:pointer;padding:2px 4px}
  #adv-adshop-dlg .ash-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
  #adv-adshop-dlg .ash-it{background:#182c40;border:1px solid #31506b;border-radius:10px;
    padding:4px 3px;text-align:center;font-size:11px;min-height:52px;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:2px}
  #adv-adshop-dlg .ash-it b{font-size:12px}
  #adv-adshop-dlg .ash-nm{color:#ffe9a8;font-weight:700;max-width:100%;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}
  #adv-adshop-dlg .ash-st{color:#9fc0da;font-size:9px}
  #adv-adshop-dlg .ash-rent{border:1px solid #ffd54f;background:rgba(255,213,79,.14);color:#ffe9a8;
    border-radius:8px;padding:2px 5px;font-size:10px;cursor:pointer}
  /* เฟสเดิน/นั่ง/วิงสูท = ไม่ใช่นักบิน → ซ่อนกรอบค็อกพิต/กระจก/ปุ่มนักบินทั้งชุด */
  .adv-heli.hfoot #adv-cockpit,.adv-heli.hfoot #adv-glass,.adv-heli.hfoot #adv-wiper,
  .adv-heli.hfoot #adv-seat,.adv-heli.hfoot #adv-visor,.adv-heli.hfoot #adv-light,
  .adv-heli.hfoot #adv-skipstart,.adv-heli.hfoot #adv-dismount{display:none}
  .adv-heli.hfoot #adv-board{top:8px}                /* ไม่มีกล้องใต้ท้องมุมซ้ายบน — กระดานกลับขึ้นบนสุด */
  #adv-liftfx{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:8;
    display:flex;align-items:center;justify-content:center;color:#b9ffdd;font-weight:800;font-size:18px;
    transition:opacity .35s ease}
  #adv-liftfx.on{opacity:1;pointer-events:auto}
  #adv-wiper{right:78px} #adv-seat{right:14px}
  .adv-heli #adv-wiper,.adv-heli #adv-seat{display:block}
  #adv-wiper:active,#adv-seat:active{background:rgba(124,200,255,.28)}
  #adv-wiper.on{background:rgba(124,255,157,.2);border-color:#7cff9d;color:#c6ffd8}
  /* ⏭ ปุ่มข้ามซีเควนซ์สตาร์ทเฮลิฯ (โชว์เฉพาะระหว่างสตาร์ท · บินรอบ 2-3 ไม่ต้องรอครบ) */
  #adv-skipstart{position:absolute;display:none;left:50%;bottom:74px;transform:translateX(-50%);z-index:6;
    pointer-events:auto;padding:7px 16px;border-radius:14px;border:1px solid rgba(255,213,79,.6);
    background:rgba(38,26,0,.72);color:#ffe9a3;font-size:13px;font-family:'Courier New',monospace;
    text-shadow:0 0 6px rgba(255,213,79,.6)}
  #adv-skipstart.on{display:block}
  #adv-skipstart:active{background:rgba(255,213,79,.28)}
  #adv-racehud{display:none;top:64px;left:50%;transform:translateX(-50%);z-index:5;
    background:rgba(0,22,8,.62);border:1px solid rgba(124,255,157,.45);border-radius:8px;
    padding:4px 12px;color:#9dffc4;font-family:'Courier New',monospace;font-size:13px;white-space:nowrap}
  #adv-racehud b{color:#fff}
  /* 📸 แฟลชตอนกดชัตเตอร์ + การ์ดพรีวิวภาพ */
  /* 🌧️ ฝนบนเลนส์กล้อง FPV — ริ้วฝนเฉียงวิ่งลง + หยดน้ำเกาะเลนส์ (CSS ล้วน · เปิดตอนพายุเท่านั้น) */
  #adv-rain{position:absolute;inset:0;pointer-events:none;z-index:6;opacity:0;transition:opacity 1.4s ease}
  #adv-rain.on{opacity:1}
  /* 🌧️ รอบ 962 (ผู้ใช้: ฝนล็อบบี้เส้นขาวดูไม่ professional → ให้แก้ระบบฝนโลกโดรนแบบเดียวกันด้วย):
     ถอด stripe ทแยงขาว (repeating-linear-gradient + @keyframes advRain) ออกทั้งหมด
     แทนด้วยละอองฝนเบลอขอบจอ (vignette) — สื่อว่าฝนตกโดยไม่ต้องมีเส้น */
  #adv-rain:before{content:'';position:absolute;inset:-4%;
    background:radial-gradient(ellipse at 50% 50%,transparent 54%,rgba(160,195,230,.26) 100%);
    filter:blur(9px);animation:advVignette 5s ease-in-out infinite}
  @keyframes advVignette{0%,100%{opacity:.7}50%{opacity:1}}
  /* 💧 รอบ 962: ลดความทึบหยดน้ำ ~2.5 เท่า (.62/.28/.10→.24/.11/.04 · เงา .45/.28→.18/.12 · keyframe .85/.7→.32/.26)
     ให้เหมือนหยดน้ำจริงที่แค่บิดแสงเบา ๆ ไม่ใช่จุดขาวทึบแปะเลนส์ (สอดคล้องกับฝนในล็อบบี้ รอบ 961) */
  #adv-rain i{position:absolute;display:block;border-radius:52% 48% 46% 54%;
    background:radial-gradient(circle at 34% 30%,rgba(255,255,255,.24),rgba(190,215,235,.11) 58%,rgba(120,150,175,.04));
    box-shadow:inset 0 -1px 2px rgba(255,255,255,.18),0 1px 3px rgba(0,0,0,.12);
    backdrop-filter:blur(1px);animation:advDrop 3s ease-in infinite}
  @keyframes advDrop{0%{transform:translateY(0) scale(1);opacity:.32}
    72%{transform:translateY(16px) scale(1.04);opacity:.26}
    100%{transform:translateY(46px) scale(.7);opacity:0}}
  html.no-anim #adv-rain:before,html.no-anim #adv-rain i{animation:none}
  /* ⛈ ฟ้าแลบ — วาบ 2 จังหวะแบบสายฟ้าจริง (ขาวอมฟ้า ไม่ใช่ขาวล้วนแบบแฟลชกล้อง) */
  #adv-bolt{position:absolute;inset:0;pointer-events:none;z-index:7;opacity:0;
    background:linear-gradient(180deg,rgba(226,240,255,.92),rgba(150,190,230,.35) 55%,rgba(60,80,110,0))}
  #adv-bolt.on{animation:advBolt .42s ease-out}
  @keyframes advBolt{0%{opacity:0}6%{opacity:.9}16%{opacity:.12}28%{opacity:.75}48%{opacity:.06}100%{opacity:0}}
  html.no-anim #adv-bolt.on{animation:none}
  #adv-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:8}
  #adv-flash.on{animation:advFlash .26s ease-out}
  @keyframes advFlash{0%{opacity:.85}100%{opacity:0}}
  #adv-photo{position:absolute;inset:0;display:none;place-items:center;z-index:9;
    background:rgba(0,0,0,.68);pointer-events:auto;padding:12px}
  #adv-photo.on{display:grid}
  #adv-photo .ph-card{display:flex;flex-direction:column;gap:8px;max-width:min(88vw,560px);
    background:#10151a;border:1px solid rgba(124,255,157,.35);border-radius:12px;padding:10px}
  #adv-photo img{display:block;width:100%;max-height:58vh;object-fit:contain;border-radius:7px;background:#000}
  #adv-photo .ph-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  #adv-photo button{pointer-events:auto;border:1px solid rgba(124,255,157,.5);border-radius:9px;
    padding:8px 14px;font-size:14px;font-weight:700;background:rgba(0,26,12,.7);color:#9dffc4}
  #adv-photo #adv-photo-save{background:#1f7a4d;border-color:#2fae6d;color:#eafff2}
  /* 🛸 ขอบตัวโดรน+ขาลงจอด ล่างจอ — ให้รู้สึกเหมือนนั่งอยู่บนเครื่องจริง (ไม่บังทางบิน) */
  #adv-props .dframe{position:absolute;left:50%;bottom:0;transform:translateX(-50%);
    width:min(58vmin,420px);height:8.5vh;min-height:52px}
  #adv-props .dframe:before{content:'';position:absolute;left:50%;bottom:3.4vh;transform:translateX(-50%);
    width:38%;height:2.2vh;min-height:14px;border-radius:16px 16px 7px 7px;
    background:linear-gradient(180deg,#39404a,#12161b 78%);
    box-shadow:0 -1px 0 rgba(255,255,255,.09),0 6px 16px rgba(0,0,0,.5)}
  #adv-props .dframe:after{content:'';position:absolute;left:12%;right:12%;bottom:.6vh;height:1vh;min-height:6px;
    border-radius:5px;background:linear-gradient(180deg,#333a43,#0d1115);box-shadow:0 3px 10px rgba(0,0,0,.55)}
  #adv-props .skid{position:absolute;bottom:1vh;width:1.1vh;min-width:7px;height:4.4vh;min-height:26px;
    border-radius:4px;background:linear-gradient(180deg,#39404a,#0f1317)}
  #adv-props .skid-l{left:33%;transform:rotate(11deg)}
  #adv-props .skid-r{right:33%;transform:rotate(-11deg)}
  /* 🚗 โหมดขับรถกำแพงเพชร: แผงหน้าปัด+ฝากระโปรง (img/car/dash.png) + พวงมาลัยขวาหมุนจริง (img/car/wheel.png)
     รถพวงมาลัยขวาแบบเมืองไทย · ไม่มีภาพ → CSS จำลองทั้งคู่ (พวงมาลัยยังหมุนได้) */
  .adv-drive #adv-inst{display:block}
  .adv-drive #adv-cross{display:none}
  .adv-drive #adv-gauges,.adv-drive #adv-cockpit{display:none}
  /* 🚗 รอบ 284 (สเปกผู้ใช้): คอนโซลสูงบังเส้นทาง → เลื่อนทั้งแผงลง 20vh (จอวิทยุ/ตุ๊กตา/เกจ ผูกกับ rect ของภาพ เลื่อนตามเอง) */
  #adv-cardash{position:absolute;left:0;right:0;bottom:-20vh;pointer-events:none;display:none;z-index:3}
  .adv-drive #adv-cardash{display:block}
  /* 🚗 รอบ 231: แดชบอร์ดชุดใหม่ — object-position 65% ตัดกระจกหน้า(ถนนวาดในภาพ)ทิ้งให้หมด เหลือเฉพาะแผงหน้าปัด
     · max-height 46vh (เตี้ยลง ไม่บังทางมองเห็นฉาก 3D จริง) — ยืนยันตัดกระจกครบทุกคัน (กระจกจบ ~40% ของภาพ) */
  #adv-cardash img{width:100%;display:block;max-height:46vh;object-fit:cover;object-position:50% 65%}
  /* เข็มหน้าปัดวิ่งจริง — canvas ทับตำแหน่งวงเกจของภาพ dash.png (อยู่เหนือแผง ใต้พวงมาลัย) */
  #adv-cargauges{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none;z-index:3}
  .adv-drive #adv-cargauges{display:block}
  #adv-cardash .cd-css{height:36vh;background:linear-gradient(180deg,#262a31,#101216);
    border-top:5px solid #343943;border-radius:26px 26px 0 0;margin:0 -2vw}  /* รอบ 284: แผงเลื่อนลง 20vh → เพิ่มสูงชดเชยให้เหลือแถบ 16vh */
  /* 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่เลือก (blkN.png) ยืนบนแผงหน้าปัด หัวส่ายตามแรงเลี้ยว
     JS ตั้ง left/top/size ตามพิกัดภาพ dash (BOBBLE_FOOT) · img หมุนรอบฐาน (เท้า) ด้วยสปริงใน bobbleTick */
  #adv-bobble{position:absolute;display:none;z-index:4;pointer-events:auto;cursor:pointer;
    perspective:560px;will-change:transform}
  .adv-drive #adv-bobble{display:block}
  #adv-bobble img{width:100%;height:100%;display:block;object-fit:contain;object-position:50% 100%;
    transform-origin:50% 96%;filter:drop-shadow(0 3px 5px rgba(0,0,0,.55));will-change:transform}
  /* 👆 รอบ 193: เด้งตอนถูกสะกิด */
  @keyframes bobPoke{0%{transform:scale(1)}28%{transform:scale(1.13)}62%{transform:scale(.95)}100%{transform:scale(1)}}
  #adv-bobble.poke{animation:bobPoke .42s ease-out}
  html.no-anim #adv-bobble.poke{animation:none}
  /* 🪆 รอบ 193: สกินตุ๊กตาพิเศษ (ใช้ทั้งตัวจริง #adv-bobble + พรีวิว .dp-prev · เอฟเฟกต์ filter ล้วน)
     ต้องมี #adv-bobble นำหน้าเพื่อชนะ specificity ของ base rule (#adv-bobble img) */
  #adv-bobble.bskin-glow img,.dp-prev.bskin-glow img{filter:drop-shadow(0 0 5px #7ff) drop-shadow(0 0 11px #12d6ff) brightness(1.06);animation:bskGlow 1.5s ease-in-out infinite}
  @keyframes bskGlow{0%,100%{filter:drop-shadow(0 0 4px #7ff) drop-shadow(0 0 8px #12d6ff) brightness(1.04)}50%{filter:drop-shadow(0 0 9px #bff) drop-shadow(0 0 18px #29e0ff) brightness(1.14)}}
  #adv-bobble.bskin-gold img,.dp-prev.bskin-gold img{filter:sepia(1) saturate(3.4) hue-rotate(-16deg) brightness(1.14) drop-shadow(0 0 7px #ffcf4d)}
  #adv-bobble.bskin-rainbow img,.dp-prev.bskin-rainbow img{animation:bskRainbow 3s linear infinite}
  @keyframes bskRainbow{0%{filter:hue-rotate(0deg) saturate(1.6) drop-shadow(0 0 6px #f9a)}100%{filter:hue-rotate(360deg) saturate(1.6) drop-shadow(0 0 6px #9af)}}
  #adv-bobble.bskin-ghost img,.dp-prev.bskin-ghost img{filter:brightness(1.35) grayscale(.25) drop-shadow(0 0 9px #aef);opacity:.5}
  html.no-anim #adv-bobble.bskin-glow img,html.no-anim #adv-bobble.bskin-rainbow img,html.no-anim .dp-prev.bskin-glow img,html.no-anim .dp-prev.bskin-rainbow img{animation:none}
  /* 🪆 รอบ 193: หน้าต่างเลือก/ปลดล็อกสกินตุ๊กตา */
  #adv-dollpick{position:absolute;inset:0;display:none;align-items:center;justify-content:center;z-index:9;
    background:rgba(4,12,26,.55);pointer-events:auto}
  #adv-dollpick .dp-box{width:min(540px,94vw);box-sizing:border-box;background:rgba(10,22,42,.97);
    border:2px solid #4fc3f7;border-radius:18px;padding:13px 16px 15px;color:#e6f3ff;box-shadow:0 0 26px rgba(79,195,247,.45)}
  #adv-dollpick .dp-head{display:flex;align-items:center;justify-content:space-between;font-size:17px;font-weight:800;color:#8fd6ff}
  #adv-dollpick .dp-x{border:none;background:rgba(255,255,255,.12);color:#cfe4fa;border-radius:8px;width:28px;height:28px;font-size:14px;cursor:pointer}
  #adv-dollpick .dp-coin{text-align:center;font-size:13px;color:#ffe08a;margin:5px 0 9px}
  #adv-dollpick .dp-grid{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
  #adv-dollpick .dp-cell{flex:0 0 auto;width:92px;background:rgba(18,40,72,.6);border:2px solid rgba(95,200,255,.3);
    border-radius:13px;padding:7px 5px 8px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:3px}
  #adv-dollpick .dp-cell.sel{border-color:#ffd54a;box-shadow:0 0 12px rgba(255,213,74,.5)}
  #adv-dollpick .dp-cell:active{transform:scale(.95)}
  #adv-dollpick .dp-prev{position:relative;width:100%;height:62px;display:flex;align-items:flex-end;justify-content:center}
  #adv-dollpick .dp-prev img{height:60px;object-fit:contain}
  #adv-dollpick .dp-prev b{position:absolute;top:-2px;right:6px;font-size:15px}
  #adv-dollpick .dp-name{font-size:12px;font-weight:700;color:#dcefff}
  #adv-dollpick .dp-cell i{font-size:11.5px;font-style:normal;font-weight:800;padding:2px 8px;border-radius:9px}
  #adv-dollpick .dp-cost{background:rgba(255,205,80,.16);color:#ffd76a}
  #adv-dollpick .dp-use{background:rgba(90,200,255,.16);color:#8fd6ff}
  #adv-dollpick .dp-on{background:#ffd54a;color:#5a4300}
  #adv-dollpick .dp-hint{text-align:center;font-size:11px;color:#9ec8e8;margin-top:10px}
  /* ปุ่มเปิดหน้าแต่งตุ๊กตา ในแผงเตรียมออกรถ */
  #cs-doll{display:block;margin:10px auto 0;background:rgba(79,195,247,.16);color:#bfe8ff;border:1.5px solid #4fc3f7;
    border-radius:12px;font-family:inherit;font-weight:800;font-size:14px;padding:8px 18px;cursor:pointer}
  #cs-doll:active{transform:scale(.96)}
  #adv-bobble .bob-base{position:absolute;left:50%;bottom:-3px;width:46%;height:9px;transform:translateX(-50%);
    background:radial-gradient(50% 60% at 50% 50%,rgba(0,0,0,.5),transparent 72%);border-radius:50%;pointer-events:none}
  /* ขดสปริงเล็กๆ ใต้ตุ๊กตา (โผล่จากใต้เท้า) ให้ดูเหมือนตั้งบนสปริงจริง */
  #adv-bobble .bob-coil{position:absolute;left:50%;bottom:1px;width:16%;height:12%;transform:translateX(-50%);
    background:repeating-linear-gradient(180deg,rgba(200,200,210,.85) 0 2px,rgba(90,95,110,.35) 2px 4px);
    border-radius:0 0 40% 40%;opacity:.7;pointer-events:none}
  /* 🎵 รอบ 181: จอวิทยุ head-unit — วางทับจอดำกลางคอนโซล (JS ตั้ง left/top/size ตามภาพ dash) */
  #adv-radio-screen{position:absolute;display:none;z-index:5;cursor:pointer;overflow:hidden;
    border-radius:3px;box-shadow:0 0 0 1px rgba(90,190,255,.25) inset,0 0 12px rgba(70,160,255,.22)}
  #adv-radio-viz{position:absolute;inset:0;width:100%;height:100%;display:block}
  #adv-radio-hint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:2px;text-align:center;pointer-events:none;line-height:1.1}
  #adv-radio-hint b{color:#8fe0ff;font-size:clamp(9px,1.5vw,13px);letter-spacing:1px;
    text-shadow:0 0 8px rgba(80,180,255,.8);animation:radioPulse 1.8s ease-in-out infinite}
  #adv-radio-hint span{color:#bcd7f0;font-size:clamp(7px,1.1vw,10px)}
  @keyframes radioPulse{0%,100%{opacity:.55}50%{opacity:1}}
  #adv-radio-screen.playing{box-shadow:0 0 0 1px rgba(120,220,255,.5) inset,0 0 18px rgba(80,190,255,.4)}
  /* แผงเลือกเพลง sci-fi — วางเหนือจอ (JS ตั้ง left/width/bottom) */
  #adv-radio-list{position:absolute;z-index:9;display:none;padding:9px 10px;
    background:linear-gradient(165deg,rgba(18,44,80,.97),rgba(6,18,40,.98));
    border:1px solid rgba(95,200,255,.5);border-radius:12px;color:#dcebfb;
    box-shadow:0 10px 30px rgba(2,10,28,.7),inset 0 0 22px rgba(80,180,255,.08);backdrop-filter:blur(3px)}
  #adv-radio-list .rl-head{display:flex;align-items:center;justify-content:space-between;
    font-size:12px;font-weight:800;color:#eaf7ff;margin-bottom:7px;letter-spacing:.5px}
  #adv-radio-list .rl-x{border:none;background:rgba(255,255,255,.1);color:#cfe4fa;border-radius:7px;
    width:22px;height:22px;cursor:pointer;font-size:12px}
  #adv-radio-list .rl-tracks{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:9px;max-height:26vh;overflow-y:auto;scrollbar-width:none}
  #adv-radio-list .rl-tracks::-webkit-scrollbar{display:none}
  #adv-radio-list .rl-track{display:flex;align-items:center;gap:5px;cursor:pointer;
    padding:5px 11px;border-radius:8px;font-size:12px;font-weight:700;font-family:inherit;
    background:rgba(11,31,66,.6);color:#bdd8f2;border:1px solid rgba(95,200,255,.28)}
  #adv-radio-list .rl-track .rl-eq{font-size:10px;color:#7fd0ff}
  #adv-radio-list .rl-track.on{background:linear-gradient(180deg,#2a7fd0,#1a5296);color:#fff;
    border-color:rgba(150,225,255,.8);box-shadow:0 0 10px rgba(80,180,255,.5)}
  #adv-radio-list .rl-modes{display:flex;gap:6px;margin-bottom:8px}
  #adv-radio-list .rl-mode{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;
    padding:6px 4px;border-radius:9px;font-size:11px;font-weight:800;font-family:inherit;line-height:1.1;
    background:rgba(11,31,66,.55);color:#a9c8e8;border:1px solid rgba(95,200,255,.3)}
  #adv-radio-list .rl-mode small{font-size:9px;font-weight:600;color:#8fb3d8}
  #adv-radio-list .rl-mode.on{background:linear-gradient(180deg,#37b6ff,#2160c8);color:#fff;
    border-color:rgba(150,225,255,.85);box-shadow:0 0 12px rgba(80,180,255,.55)}
  #adv-radio-list .rl-mode.on small{color:#dcefff}
  #adv-radio-list .rl-power{width:100%;cursor:pointer;padding:6px;border-radius:9px;
    font-size:11.5px;font-weight:800;font-family:inherit;
    background:rgba(70,20,32,.7);color:#ffc9cf;border:1px solid rgba(255,140,150,.5)}
  #adv-radio-list .rl-power:active,#adv-radio-list .rl-mode:active,#adv-radio-list .rl-track:active{transform:scale(.96)}
  /* 🚗 รอบ 230: พวงมาลัยขวาแบบไทย (ภาพชุดใหม่ ต่อคัน · โปร่งใส) · โผล่จากขอบล่างขวาแบบมองจากที่นั่งคนขับ
     ภาพ aspect ~1.5 (กว้างกว่าสูง) → คงสัดส่วนไม่บิด · เกจวิ่งจริงลอดช่องบนพวงมาลัย (drawCarGauges อิงตำแหน่งนี้) */
  /* รอบ 284 (สเปกผู้ใช้): กดพวงมาลัยลงจนขอบบนเกือบแตะขอบล่างจอ — bottom=calc(8vh-สูง) = เห็นขอบบน 8vh พอดีทุกจอ */
  #adv-carwheel{position:absolute;left:76%;bottom:calc(8vh - min(50vh,50vw));transform:translateX(-50%);
    height:min(50vh,50vw);width:auto;aspect-ratio:1.5;pointer-events:none;display:none;z-index:4;will-change:transform}
  .adv-drive #adv-carwheel{display:block}
  #adv-carwheel img{width:100%;height:100%;display:block;object-fit:contain}
  #adv-carwheel .cw-css{width:100%;height:100%;border-radius:50%;border:2.6vh solid #23262c;
    box-shadow:0 0 0 5px #14161a inset,0 5px 16px rgba(0,0,0,.55);position:relative;background:transparent}
  #adv-carwheel .cw-css:before{content:'';position:absolute;left:50%;top:50%;width:80%;height:11%;
    background:#23262c;transform:translate(-50%,-50%);border-radius:8px}
  #adv-carwheel .cw-css:after{content:'';position:absolute;left:50%;top:50%;width:11%;height:46%;
    background:#23262c;transform:translateX(-50%);border-radius:8px}
  #adv-horn{position:absolute;bottom:26px;right:22px;width:76px;height:76px;border-radius:50%;pointer-events:auto;
    background:rgba(66,165,245,.9);border:3px solid #fff;font-size:30px;display:none}
  .adv-touch.adv-drive #adv-horn{display:block}
  /* 🎛️ รอบ 127: ปุ่มจางๆ บนคอนโซลโหมดขับรถ (มือถือ) — ซ้าย=บังคับซ้าย-ขวา · ขวา=คันเร่งกดค้าง ปล่อยแล้วรถชลอเอง */
  #adv-steerpad,#adv-gaspad,#adv-brakepad,#adv-gearbtn,#adv-gearrev{display:none;position:absolute;pointer-events:auto;z-index:6;
    -webkit-user-select:none;user-select:none;touch-action:none;opacity:.34;transition:opacity .15s}
  #adv-steerpad.on,#adv-gaspad.on,#adv-brakepad.on{opacity:.68}
  .adv-touch.adv-drive #adv-steerpad{display:flex}
  .adv-touch.adv-drive #adv-gaspad{display:flex}
  .adv-touch.adv-drive #adv-brakepad{display:flex}
  .adv-touch.adv-drive #adv-gearbtn{display:flex}
  .adv-touch.adv-drive #adv-gearrev{display:flex}
  /* รอบ 143: ยืดแถบพวงมาลัยขึ้นบน+ลงล่างอย่างละ 1 ช่วง (64→192px สูง 3 เท่า จุดกึ่งกลางเดิม) — นิ้วลอยขึ้นลงไม่หลุดปุ่ม */
  #adv-steerpad{left:2.5%;bottom:calc(max(20vh,104px) - 64px);width:min(42vw,290px);height:192px;border-radius:34px;
    background:rgba(18,22,30,.6);border:2px solid rgba(255,255,255,.55);box-sizing:border-box;
    align-items:center;justify-content:space-between;padding:0 16px;color:#fff;font-size:24px}
  /* วงจอยสำรองมุมล่างซ้ายโดนแถบพวงมาลัยสูงขึ้นทับ → โหมดขับรถซ่อนตอนพัก โชว์เฉพาะตอนลากใช้งานจริง (.live) */
  .adv-touch.adv-drive #adv-joy{display:none}
  .adv-touch.adv-drive #adv-joy.live{display:block}
  .adv-touch.adv-mecha #adv-joy{display:none}   /* รอบ 222: โลกหุ่นใช้ปุ่มบังคับเอง ไม่ใช้จอย — ซ่อนวงกลมขาว (จอยเบส) ที่โผล่หลัง ◀▶ */
  #adv-steerdot{position:absolute;left:50%;top:50%;width:42px;height:42px;border-radius:50%;
    transform:translate(-50%,-50%);background:rgba(255,255,255,.78);box-shadow:0 0 10px rgba(0,0,0,.45);
    pointer-events:none}
  #adv-gaspad{right:20px;bottom:max(20vh,104px);width:94px;height:94px;border-radius:50%;flex-direction:column;
    background:rgba(40,165,88,.55);border:2px solid rgba(255,255,255,.6);
    align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:26px;line-height:1.05}
  #adv-gaspad small{font-size:12.5px;font-weight:700}
  /* 🦶 รอบ 139: ปุ่มเบรคแดง ซ้ายคันเร่งแบบแป้นรถจริง (กดค้าง=เบรคอย่างเดียว ไม่ถอย) */
  #adv-brakepad{right:124px;bottom:max(20vh,104px);width:84px;height:84px;border-radius:50%;flex-direction:column;
    background:rgba(198,45,45,.5);border:2px solid rgba(255,255,255,.6);
    align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:23px;line-height:1.05}
  #adv-brakepad small{font-size:12px;font-weight:700}
  /* ⚙️ รอบ 144 (สเปกผู้ใช้): แยกเกียร์เป็น 2 ปุ่ม — D เหนือปุ่มเบรค · R ตำแหน่งก้านไฟเลี้ยวเดิม (right:224 แถวล่าง)
     แตะปุ่มไหน = เข้าเกียร์นั้น (radio) · D ติด=เขียว · R ติด=เหลืองกะพริบ + คันเร่งเปลี่ยนเป็น "ถอย" ส้ม */
  #adv-gearbtn,#adv-gearrev{box-sizing:border-box;flex-direction:column;border-radius:14px;
    background:rgba(18,22,30,.6);border:2px solid rgba(255,255,255,.55);
    align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:19px;line-height:1}
  #adv-gearbtn{right:124px;bottom:calc(max(20vh,104px) + 96px);width:84px;height:52px}
  #adv-gearrev{right:224px;bottom:max(20vh,104px);width:64px;height:84px}
  #adv-gearbtn small,#adv-gearrev small{font-size:10.5px;font-weight:700;margin-top:2px}
  #adv-gearbtn.on{opacity:1;background:rgba(20,90,45,.75);border-color:#7dffb0;color:#c4ffd9}
  #adv-gearrev.on{opacity:1;background:rgba(120,70,0,.75);border-color:#ffb300;color:#ffd54f;
    animation:tlBlink .8s steps(1) infinite}
  #adv-gaspad.rev{background:rgba(230,126,20,.6)}
  /* รอบ 129→135: ปุ่มเร่ง/เลี้ยวลดลงมาระดับล่าง (20vh — ผู้ใช้ลองจริงแล้ว 40vh สูงไป) · แตรมุมล่างขวาเดิม */
  .adv-touch.adv-drive #adv-horn{bottom:26px;right:22px;width:64px;height:64px;font-size:26px;opacity:.8}
  /* 🚦 รอบ 135: ก้านไฟเลี้ยวแนวตั้งฝั่งขวา (แทนปุ่ม ⬅️➡️ รอบ 132) — ดันขึ้น=ไฟซ้าย ดันลง=ไฟขวา
     knob ค้างตำแหน่งจนรถเลี้ยวเสร็จแล้วเด้งกลับเองเหมือนก้านไฟรถจริง (tlTick หน่วง ~0.9 วิ) */
  #adv-tlpad{display:none;position:absolute;pointer-events:auto;z-index:6;right:20px;bottom:calc(max(20vh,104px) + 100px);  /* รอบ 144: ย้ายไปเหนือคันเร่ง (สเปกผู้ใช้) · เตี้ยลง 150→110 กันชนแถวปุ่มบนจอเตี้ย */
    width:60px;height:110px;border-radius:999px;background:rgba(18,22,30,.6);border:2px solid rgba(255,255,255,.55);
    box-sizing:border-box;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 0;
    font-size:17px;line-height:1;opacity:.34;transition:opacity .15s;
    -webkit-user-select:none;user-select:none;touch-action:none}
  .adv-drive #adv-tlpad{display:flex}
  #adv-tlpad.on{opacity:.85}
  #adv-tlpad.sig{opacity:1;border-color:#ffb300;animation:tlBlink .8s steps(1) infinite}
  #adv-tldot{position:absolute;left:50%;top:50%;width:40px;height:40px;border-radius:50%;
    transform:translate(-50%,-50%);background:rgba(255,255,255,.78);box-shadow:0 0 10px rgba(0,0,0,.45);
    pointer-events:none;transition:top .18s}
  #adv-tlpad.sig #adv-tldot{background:rgba(255,179,0,.95)}
  @keyframes tlBlink{0%,49%{filter:brightness(1.5)}50%,100%{filter:brightness(.55);opacity:.5}}
  /* 🗺️ รอบ 144 (สเปกผู้ใช้จาก screenshot จริง): minimap ไปบนซ้ายสุด · กระดานคะแนนขยับขวาต่อจาก map ·
     ปุ่มออกแทนที่ปุ่มแชทเดิม (top:8 right:140) · ปุ่มบนขวาจัดกริด 2 คอลัมน์แถวละ 50px เป็นระเบียบ · ? ไปมุมขวาสุด */
  .adv-drive #adv-map{left:8px;right:auto}
  .adv-drive #adv-board{left:136px;max-width:120px;min-width:0}   /* 🩹 รอบ N: min-width:132 ของ base rule ชนะ max-width:120 (สเปก CSS ให้ min ชนะ) ทำให้กระดานกว้างเกิน ทับ topbar/กระจกหลังอยู่ก่อนแล้วทุกจอ */
  .adv-drive #adv-topbar{left:276px;transform:none}  /* ตรึงลงช่องว่างระหว่างกระดาน (จบ 268) กับปุ่มแชท (เริ่ม ~489) */
  .adv-drive .adv-hp{width:80px}   /* รอบ 147: ย่ออีกขั้น เปิดทางแถวปุ่มเดียวด้านขวา */
  /* รอบ 147 (สเปกผู้ใช้): ปุ่มขวาบนแถวเดียวทั้งหมด ย่อขนาดให้พอดี — ซ้าย→ขวา: ทุกคน·ปิด·ปิด·แชท·?·ออก(ริมขวาสุด)
     ต้อง min-width:0 ทับ .adv-vbtn (base fix 86px) ไม่งั้นชนกันเอง · speed pill เลื่อนลง top:52 หลบแถวปุ่ม */
  .adv-drive #adv-exit{top:8px;right:8px;font-size:12.5px;padding:5px 9px}
  .adv-drive #adv-help{top:8px;right:74px;width:30px;height:30px;font-size:14px}
  .adv-drive #adv-chat-btn{top:8px;right:108px;font-size:12px;padding:5px 8px}
  .adv-drive #adv-mic{top:8px;right:172px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-drive #adv-spk{top:8px;right:224px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-drive #adv-vmode{top:8px;right:276px;font-size:11px;padding:4px 6px;min-width:0}
  /* 🪧 รอบ 967 (ผู้ใช้ส่งภาพ): กระจกมองหลังยึด 52-126 แล้ว → ป้ายทุกใบเรียงลงมาใต้กระจก ห่างกันพอไม่ซ้อนกันเอง
     ความสูงจริงที่วัดได้ (1280×720): ป้ายความเร็ว 21px · ป้ายเตือน 28px · ป้ายทางแยก 32px · ป้ายใบสั่ง ~2 บรรทัด */
  .adv-drive #adv-inst{top:132px}
  .adv-drive #adv-warn{top:158px}
  .adv-drive #adv-junc{top:192px}
  .adv-drive #adv-lawwarn{top:230px}
  /* 👩‍🏫 ปุ่มครู/จบรอบแข่ง: รอบ 967 ย้ายจากแถวขวา (top:52 right:108/200) มาซ้อนใต้กระดานคะแนนฝั่งซ้าย
     — ที่เดิมเป็นช่องว่างข้างกระจกมองหลังที่คำเป้าหมายย้ายมาอยู่ (จอ 812 ปุ่มเดิมยังทับตัวกระจกด้วย) */
  .adv-drive #adv-tmute{top:62px;left:136px;right:auto;font-size:11px;padding:4px 6px;min-width:0}
  .adv-drive #adv-podbtn{top:94px;left:136px;right:auto;font-size:11px;padding:4px 6px;min-width:0}
  /* 📱 รอบ 972 (ต่อยอดรอบ 967 — ผู้ใช้ชี้จุดเดิม "ป้ายทางแยก/ใบสั่งยังเฉี่ยวแป้นเบรก/เกียร์ถอยบนจอ 812×375"):
     วัด getBoundingClientRect ไล่ทุกคู่ทั้ง HUD โลกขับรถ (28 element) แล้วแก้ 3 จุดเฉพาะจอเตี้ย (ไม่กระทบจอปกติ):
     ① ย่อป้าย junc/lawwarn (padding/font/line-height เล็กลง) + ขยับสต็อกป้ายให้แน่นขึ้น
     ② ดันแป้นเบรก/เกียร์ถอยลงชิดขอบล่างอีก (bottom offset เฉพาะจอเตี้ย)
     ③ ซ่อนกระจกข้าง/ขวา (mirror-l/r) — top:38% ไม่ปรับตามจอเตี้ย เดิมทับปุ่มบังคับซ้าย-ขวาทั้งชุด + GPS อยู่แล้ว (มีกระจกหลังพอ)
     ⚠️ เหลือค้าง: ป้าย junc/lawwarn ยังเฉี่ยวแป้นบังคับซ้าย #adv-steerpad เล็กน้อย (พวงมาลัยกว้างเกือบ 40% จอ ไม่มีที่ให้หลบทั้ง 2 ฝั่งพร้อมกัน) — pointer-events:none ป้ายไม่บังกดปุ่ม ไม่ได้แก้รอบนี้ */
  @media (max-height:430px){
    .adv-drive #adv-junc{top:190px;padding:3px 12px;font-size:12px}
    .adv-drive #adv-lawwarn{top:220px;padding:5px 12px;line-height:1.2;font-size:clamp(10.5px,2.1vw,12.5px)}
    .adv-touch.adv-drive #adv-brakepad,.adv-touch.adv-drive #adv-gearrev{bottom:6px}
    .adv-drive #adv-mirror-l,.adv-drive #adv-mirror-r{display:none}
  }
  /* 🤖 รอบ 216: HUD โลกหุ่น (mecha) — เลย์เอาต์เฉพาะที่ "พอดีจอมือถือแคบ" (568×320 ก็ไม่ทับ)
     ผู้ใช้รอบก่อนสั่งย้ายขึ้นบนเหมือนโลกขับรถ แต่แถวเดียวแบบ drive ยาวเกินจอแคบ → ปุ่มทับปุ่มยิง
     แก้: minimap บนซ้าย · HP+เหรียญ ต่อขวา map · ปุ่มยูทิลิตี้ 2 แถวมุมบนขวา (เหนือปุ่มยิงเสมอ) · ซ่อนกระดานคะแนน (จอแคบไม่พอ)
     ยืนยัน getBoundingClientRect 480–844 กว้าง = ไม่มีปุ่มทับกัน + ไม่ทับปุ่มยิง/ปุ่มเดิน */
  /* 🤖 รอบ 237 (ผู้ใช้ screenshot): ปุ่มบนขวาเดิม 3 แถว โดนขอบกรอบห้องนักบิน (mh-frame z:5 ทึบมุมบนขวา) บังจนกดยาก
     แก้: (1) ปุ่มยูทิลิตี้ "แถวเดียว" ริมบนขวา (เหมือนโลกขับรถ) (2) map+เหรียญ/HP ซ้อนเป็นคอลัมน์ซ้าย (map บน · pill ใต้ map)
          เปิดที่บนขวาทั้งแถบให้ปุ่มเรียงแถวเดียวไม่ชน (3) ทุกตัว z-index:6 (>กรอบ 5) → ขอบ HUD บังไม่ได้อีก */
  .adv-mecha #adv-map{top:8px;left:8px;right:auto;z-index:6}
  .adv-mecha #adv-board{display:none}
  .adv-mecha #adv-topbar{top:134px;left:8px;transform:none;z-index:6}   /* เหรียญ/HP ลงใต้ minimap (คอลัมน์ซ้าย) เปิดที่บนขวาให้ปุ่มแถวเดียว */
  .adv-mecha .adv-hp{width:80px}
  /* ปุ่มยูทิลิตี้แถวเดียวบนขวา (ซ้าย→ขวา: ทุกคน·เปิด·ปิด·แชท·?·ออก) — ระยะเดียวกับโลกขับรถที่พิสูจน์แล้วไม่ทับกัน */
  .adv-mecha #adv-exit{top:8px;right:8px;font-size:12px;padding:5px 9px;z-index:6}
  .adv-mecha #adv-help{top:8px;right:74px;width:30px;height:30px;font-size:14px;z-index:6}
  .adv-mecha #adv-chat-btn{top:8px;right:108px;font-size:12px;padding:5px 8px;z-index:6}
  .adv-mecha #adv-mic{top:8px;right:172px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  .adv-mecha #adv-spk{top:8px;right:224px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  .adv-mecha #adv-vmode{top:8px;right:276px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  .adv-mecha #adv-tmute{top:46px;right:8px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}    /* ปุ่มครู/podium (โชว์เฉพาะบางกรณี) แถวสองริมขวา */
  .adv-mecha #adv-podbtn{top:46px;right:100px;font-size:11px;padding:4px 6px;min-width:0;z-index:6}
  /* 👻 รอบ 851 (ผู้ใช้ส่งภาพ: ปุ่มขวามือซ้อนทับกัน) — ต้นตอ: คอลัมน์ปุ่มแชท/ไมค์/ลำโพง (ออก·?·แชท·ปิด·ปิด ขวา:8px top:118-282)
     ไม่เคยมี override เฉพาะโลกผีสิงเหมือนโลกขับรถ/หุ่น → ลงมาชนปุ่มจอสัมผัส #adv-torch/#adv-use (ขวา:14px วางชิดล่างเสมอ)
     บนจอเตี้ย (812×375 ทั่วไป) โซนล่างขวาไม่พอ 2 ระบบซ้อนกัน → ย้ายขึ้นแถวบนเดียวกันแบบโลกขับรถที่พิสูจน์แล้วไม่ทับกัน */
  .adv-haunt #adv-exit{top:8px;right:8px;font-size:12.5px;padding:5px 9px}
  .adv-haunt #adv-help{top:8px;right:74px;width:30px;height:30px;font-size:14px}
  .adv-haunt #adv-chat-btn{top:8px;right:108px;font-size:12px;padding:5px 8px}
  .adv-haunt #adv-mic{top:8px;right:172px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-haunt #adv-spk{top:8px;right:224px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-haunt #adv-vmode{top:8px;right:276px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-haunt #adv-tmute{top:52px;right:108px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-haunt #adv-podbtn{top:52px;right:200px;font-size:11px;padding:4px 6px;min-width:0}
  /* 🗺️ รอบ 144: แผนที่ขยายเกือบเต็มจอ — แตะ minimap เปิด · โชว์ตำแหน่งตัวอักษรชัดเจน + ปุ่มปิดใหญ่ */
  #adv-bigmap{position:absolute;inset:10px;z-index:60;display:none;flex-direction:column;pointer-events:auto;
    background:rgba(6,12,24,.96);border:2px solid #4fc3f7;border-radius:16px;
    box-shadow:0 0 34px rgba(0,0,0,.65);overflow:hidden}
  #adv-bigmap.on{display:flex}
  #adv-bigmap-head{display:flex;align-items:center;justify-content:space-between;gap:10px;
    padding:8px 12px;flex:0 0 auto}
  #adv-bigmap-title{color:#8fd6ff;font-weight:800;font-size:clamp(14px,2.6vw,17px);text-shadow:0 1px 3px #000;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #adv-bigmap-title b{color:#ffd54f}
  #adv-bigmap-x{background:#e53935;color:#fff;border:2px solid #fff;border-radius:12px;font-family:inherit;
    font-weight:800;font-size:15px;padding:8px 18px;cursor:pointer;flex:0 0 auto}
  #adv-bigmap-x:active{background:#b71c1c}
  #adv-bigmap-cv{flex:1;width:100%;min-height:0}
  /* 🚔 รอบ 128: ป้ายเตือนขับเร็วผิดกฎหมาย — แดงกะพริบกลางบน */
  #adv-lawwarn{position:absolute;top:120px;left:50%;transform:translateX(-50%);display:none;z-index:7;
    background:rgba(160,20,20,.88);border:2px solid #ff6b5e;border-radius:14px;color:#fff;
    font-size:clamp(12px,2.6vw,15px);line-height:1.45;text-align:center;padding:8px 18px;max-width:92vw;
    box-shadow:0 0 18px rgba(255,60,40,.65);animation:lawBlink 1s ease-in-out infinite;pointer-events:none}
  @keyframes lawBlink{0%,100%{opacity:1}50%{opacity:.55}}
  /* 🚔 แผงเตรียมออกรถ — สวิตช์สไตล์เดียวกับหน้า setting (reuse .set-switch จาก style.css) */
  #adv-carstart{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;z-index:8;
    width:min(420px,92vw);box-sizing:border-box;background:rgba(10,22,42,.93);border:2px solid #4fc3f7;
    border-radius:20px;padding:16px 20px 18px;color:#e6f3ff;pointer-events:auto;
    box-shadow:0 0 30px rgba(79,195,247,.4)}
  #adv-carstart h3{margin:0 0 10px;text-align:center;font-size:20px;color:#8fd6ff}
  /* รอบ 148: ภาพตัวละครที่เลือกนั่งในรถ — โชว์เฉพาะมีไฟล์จริง (โหลดสำเร็จ) */
  #cs-avatar{display:none;margin:0 auto 8px;max-height:min(100px,18vh);max-width:82%;border-radius:12px}
  #adv-carstart .cs-row{display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:10px 2px;border-bottom:1px dashed rgba(120,180,230,.35)}
  #adv-carstart .cs-lab{font-size:15.5px;font-weight:700}
  #adv-carstart .cs-lab small{display:block;font-size:11.5px;font-weight:400;color:#9ec8e8;margin-top:2px}
  #cs-go{display:block;margin:14px auto 0;background:linear-gradient(135deg,#43a047,#2e7d32);color:#fff;
    border:0;border-radius:14px;font-family:inherit;font-weight:800;font-size:18px;padding:11px 34px;cursor:pointer}
  #cs-go:disabled{background:#4a5a6a;opacity:.6;cursor:default}
  /* 🚔 แผงกฎหมายพื้นฟ้า sci-fi (สไตล์กระจกเรือง + scanline แบบแผงสถานะรอบ 63) */
  /* รอบ 146: ยืดกว้าง 94vw + กฎหมาย 3 ก้อนเรียง 3 คอลัมน์ → เตี้ยพอใส่ปุ่มรับทราบไม่มี scrollbar */
  #adv-lawinfo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;z-index:9;
    width:min(94vw,920px);max-height:92vh;overflow-y:auto;box-sizing:border-box;pointer-events:auto;
    background:linear-gradient(160deg,rgba(14,52,96,.96),rgba(8,30,60,.96));
    border:2px solid #56c8ff;border-radius:18px;padding:12px 18px 14px;color:#dff2ff;
    box-shadow:0 0 34px rgba(86,200,255,.5),inset 0 0 60px rgba(86,200,255,.08);
    font-size:13.5px;line-height:1.55}
  #adv-lawinfo .li-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-items:stretch}
  #adv-lawinfo:before{content:'';position:absolute;inset:0;border-radius:16px;pointer-events:none;
    background:repeating-linear-gradient(0deg,rgba(140,220,255,.05) 0 2px,transparent 2px 5px)}
  #adv-lawinfo h3{margin:0 0 8px;color:#7fe0ff;font-size:17.5px;text-align:center;
    text-shadow:0 0 12px rgba(127,224,255,.7)}
  #adv-lawinfo .li-sec{margin:8px 0;padding:8px 11px;border-left:3px solid #56c8ff;
    background:rgba(86,200,255,.08);border-radius:0 10px 10px 0}
  #adv-lawinfo .li-grid .li-sec{margin:0}
  #adv-lawinfo .li-ok{display:block;margin:12px auto 0;background:linear-gradient(135deg,#29b6f6,#0288d1);
    color:#fff;border:0;border-radius:12px;font-family:inherit;font-weight:800;font-size:16px;
    padding:10px 30px;cursor:pointer}
  /* กล่องแจ้งโดนปรับ (ใช้ทั้งเข็มขัด + สรุปใบสั่งตอนออก) */
  .adv-lawnotice{position:fixed;inset:0;z-index:130;background:rgba(8,10,18,.72);
    display:flex;align-items:center;justify-content:center;font-family:inherit}
  .adv-lawnotice .ln-box{width:min(400px,92vw);box-sizing:border-box;background:#fff;border-radius:18px;
    border:3px solid #e53935;padding:18px 20px;text-align:center;color:#39414d;font-size:15.5px;line-height:1.6}
  .adv-lawnotice .ln-box b{color:#c62828}
  .adv-lawnotice button{margin-top:14px;background:#e53935;color:#fff;border:0;border-radius:12px;
    font-family:inherit;font-weight:800;font-size:16px;padding:10px 30px;cursor:pointer}
  /* 💨 ป๊อปโบนัสบินเฉียด (heli/drone) — เด้งขึ้นจางหายเหนือ crosshair */
  #adv-nearmiss{top:43%;left:50%;transform:translateX(-50%);pointer-events:none;opacity:0;z-index:6;
    color:#fff;font-weight:900;font-size:clamp(15px,3.6vw,21px);text-shadow:0 2px 6px #000;white-space:nowrap;
    background:rgba(0,0,0,.42);border-radius:12px;padding:4px 15px}
  #adv-nearmiss .nm-coin{color:#ffd54f}
  #adv-nearmiss .nm-rec{color:#8ef7a5;font-size:.82em;text-shadow:0 0 8px rgba(142,247,165,.8)}
  #adv-nearmiss.show{animation:advNm 1.15s ease-out}
  @keyframes advNm{0%{opacity:0;transform:translate(-50%,8px) scale(.8)}
    15%{opacity:1;transform:translate(-50%,-4px) scale(1.1)}
    30%{transform:translate(-50%,-10px) scale(1)}
    78%{opacity:1;transform:translate(-50%,-24px)}
    100%{opacity:0;transform:translate(-50%,-38px)}}
  /* 🔥 คอมโบร้อน: ป๊อปเรืองแสงส้ม/แดง + ตัวใหญ่ขึ้น */
  #adv-nearmiss.combo-hot{background:rgba(60,20,0,.55);color:#ffe0a3;
    text-shadow:0 0 10px rgba(255,140,20,.9),0 2px 5px #000;box-shadow:0 0 18px rgba(255,120,20,.6)}
  #adv-nearmiss.combo-fire{background:rgba(70,10,0,.6);color:#ffd0a0;font-size:clamp(17px,4.2vw,25px);
    text-shadow:0 0 14px rgba(255,80,10,1),0 2px 6px #000;box-shadow:0 0 26px rgba(255,70,10,.8)}
  #adv-nearmiss.combo-fire .nm-coin{color:#fff2b0}
  /* ไฟลุกวาบขอบจอตอนคอมโบร้อน (ไม่บังนิ้ว) */
  #adv-combofx{position:absolute;inset:0;pointer-events:none;z-index:5;opacity:0}
  #adv-combofx.on.lv1{animation:advCombo .7s ease-out;
    background:radial-gradient(ellipse at center,transparent 52%,rgba(255,160,30,.5))}
  #adv-combofx.on.lv2{animation:advCombo .85s ease-out;
    background:radial-gradient(ellipse at center,transparent 44%,rgba(255,70,10,.72))}
  @keyframes advCombo{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
  #adv-inst{top:34px;left:50%;transform:translateX(-50%);color:#fff;font-weight:800;font-size:13px;
    text-shadow:0 1px 3px #000;background:rgba(0,0,0,.4);border-radius:10px;padding:2px 12px;display:none;white-space:nowrap}
  .adv-heli #adv-inst{display:block}
  #adv-warn{top:60px;left:50%;transform:translateX(-50%);display:none;color:#fff;font-weight:900;font-size:15px;
    background:rgba(198,40,40,.92);border:2px solid #fff;border-radius:12px;padding:3px 14px;white-space:nowrap;
    text-shadow:0 1px 3px #000}
  #adv-warn.warn1{animation:advWarnBlink 1s infinite}
  #adv-warn.warn2{animation:advWarnBlink .5s infinite}
  #adv-warn.warn3{animation:advWarnBlink .22s infinite;background:rgba(255,23,23,.98);font-size:17px}
  @keyframes advWarnBlink{0%,100%{opacity:1}50%{opacity:.35}}
  /* 🚦 รอบ 182: ป้ายเตือนใกล้ทางแยก (เปิดไฟเลี้ยว) — แถบเหลืองอำพันบนกลางจอ กะพริบเบาๆ */
  #adv-junc{top:96px;left:50%;transform:translateX(-50%);display:none;z-index:6;
    color:#241a00;font-weight:900;font-size:13.5px;white-space:nowrap;
    background:linear-gradient(180deg,#ffe08a,#ffc23d);border:2px solid #fff;border-radius:12px;
    padding:4px 15px;box-shadow:0 3px 12px rgba(120,80,0,.4);animation:juncBlink .9s infinite}
  @keyframes juncBlink{0%,100%{opacity:1}50%{opacity:.55}}
  /* 🚦 รอบ 185: แสงไฟเลี้ยวส้มกระพริบมุมบนซ้าย/ขวา (ตรงตำแหน่งลูกศร) — โชว์ตอนเปิดไฟเลี้ยวฝั่งนั้น */
  .adv-tlglow{position:absolute;top:0;width:34vw;max-width:230px;height:46vh;pointer-events:none;
    display:none;opacity:0;z-index:5}
  #adv-tlglow-l{left:0;background:radial-gradient(120% 88% at 0% 20%,rgba(255,160,30,.9),rgba(255,120,0,.34) 40%,transparent 72%)}
  #adv-tlglow-r{right:0;background:radial-gradient(120% 88% at 100% 20%,rgba(255,160,30,.9),rgba(255,120,0,.34) 40%,transparent 72%)}
  .adv-tlglow.on{display:block;animation:tlGlowBlink .8s steps(1,end) infinite}
  @keyframes tlGlowBlink{0%{opacity:.95}50%{opacity:0}100%{opacity:.95}}
  /* 🚦 รอบ 187 (A3): แสงสะท้อนบนกระจก/ฝากระโปรง — แถบส้มด้านล่าง blend screen ให้เหมือนแสงสะท้อน */
  .adv-tlreflect{position:absolute;bottom:0;width:54vw;max-width:440px;height:36vh;pointer-events:none;
    display:none;opacity:0;z-index:4;mix-blend-mode:screen}
  #adv-tlreflect-l{left:0;background:radial-gradient(88% 72% at 10% 100%,rgba(255,150,25,.62),rgba(255,120,0,.18) 46%,transparent 74%)}
  #adv-tlreflect-r{right:0;background:radial-gradient(88% 72% at 90% 100%,rgba(255,150,25,.62),rgba(255,120,0,.18) 46%,transparent 74%)}
  .adv-tlreflect.on{display:block;animation:tlGlowBlink .8s steps(1,end) infinite}
  /* 🌧️☀️ ชั้น "บนกระจก" — ที่ปัดน้ำฝน + แสงแดดสาด
     ⚠️ ต้องอยู่ "ใต้" กรอบค็อกพิต (z3) เพื่อให้เสา/หลังคาบังได้เอง แต่ "เหนือ" โลก 3D (canvas ไม่มี z-index) */
  #adv-glass{position:absolute;inset:0;pointer-events:none;display:none;z-index:2}
  .adv-heli #adv-glass{display:block}
  #adv-cockpit{position:absolute;inset:0;pointer-events:none;display:none;z-index:3}
  .adv-heli #adv-cockpit{display:block}
  /* 🚁 กรอบค็อกพิตเต็มจอ — ช่องกระจกในไฟล์ png โปร่งใส จึงมองทะลุเห็นโลก 3D ผ่านกระจกจริงๆ
     ⚠️ ใช้ background-image ไม่ใช่ <img> เพราะต้องคุมสเกล/ตำแหน่งเองให้ตรงกับ cpMap (ปรับมุมนั่งได้) */
  #adv-cockpit{background-repeat:no-repeat}
  /* canvas เข็ม: ทับกรอบพอดีเป๊ะ วาดด้วยพิกัดในภาพผ่าน transform */
  #adv-gauges{position:absolute;inset:0;width:100%;height:100%;
    pointer-events:none;display:none;z-index:4}
  .adv-heli #adv-gauges{display:block}
  #adv-radio{position:absolute;bottom:calc(1vh + 14vh);left:50%;transform:translateX(-50%);max-width:82vw;
    pointer-events:none;display:none;z-index:5;background:rgba(6,14,8,.78);color:#8ef7a5;
    border:1px solid rgba(142,247,165,.45);border-radius:10px;padding:5px 14px;
    font-size:13.5px;font-weight:700;letter-spacing:.3px;text-shadow:0 0 7px rgba(142,247,165,.7);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #adv-radio.show{display:block;animation:advRadioIn .25s ease-out}
  @keyframes advRadioIn{0%{opacity:0;transform:translateX(-50%) translateY(8px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}
  #adv-reply{position:absolute;bottom:calc(1vh + 14vh + 40px);left:50%;transform:translateX(-50%);
    display:none;z-index:5;text-align:center;pointer-events:auto}
  #adv-reply.show{display:block;animation:advRadioIn .25s ease-out}
  .adv-reply-hint{color:#d7ffe2;font-size:12px;font-weight:700;text-shadow:0 1px 4px #000;margin-bottom:5px;
    background:rgba(6,14,8,.6);border-radius:8px;padding:2px 10px;display:inline-block}
  .adv-reply-row{display:flex;gap:7px;justify-content:center;flex-wrap:wrap}
  .adv-rp{background:rgba(6,20,10,.88);color:#8ef7a5;border:1.5px solid rgba(142,247,165,.55);
    border-radius:11px;padding:5px 13px;font-family:inherit;font-weight:900;font-size:14px;line-height:1.15;
    text-shadow:0 0 6px rgba(142,247,165,.6)}
  .adv-rp small{display:block;color:#b8d9c2;font-size:10.5px;font-weight:600;text-shadow:none}
  .adv-rp:active{background:rgba(142,247,165,.25)}
  /* ไม่มีภาพ (ยังไม่เจนจาก PROMPTS_HELI.md) → cockpit จำลองด้วย CSS: แผงหน้าปัด+เสากรอบ */
  #adv-cockpit .cp-css{height:15vh;background:linear-gradient(180deg,#2a2f38,#14171d);
    border-top:4px solid #3d4450;border-radius:24px 24px 0 0;margin:0 -2vw;position:relative}
  #adv-cockpit .cp-css:before{content:'';position:absolute;left:50%;top:-11vh;transform:translateX(-50%);
    width:3vw;height:11vh;background:linear-gradient(180deg,rgba(40,44,52,.0),#2a2f38);border-radius:8px}
  #adv-cockpit .cp-dash{position:absolute;top:10px;left:50%;transform:translateX(-50%);
    display:flex;gap:14px;color:#8fe3a0;font-weight:800;font-size:12px;font-family:monospace}
  #adv-cockpit .cp-dash span{background:#0d0f13;border:2px solid #3d4450;border-radius:8px;padding:3px 10px}
  #adv-hint{bottom:8px;right:8px;color:#fff;font-size:11px;text-shadow:0 1px 3px #000;text-align:right;opacity:.85}
  .adv-touch #adv-hint{display:none}
  #adv-chat-btn{position:absolute;top:160px;right:8px;pointer-events:auto;background:rgba(33,150,243,.92);
    color:#fff;border:2px solid #fff;border-radius:12px;font-weight:800;font-size:14px;padding:7px 12px;font-family:inherit}
  .adv-vbtn{position:absolute;right:8px;pointer-events:auto;background:rgba(67,160,71,.92);color:#fff;
    border:2px solid #fff;border-radius:12px;font-weight:800;font-size:13px;padding:6px 10px;font-family:inherit;min-width:86px}
  .adv-vbtn.v-off{background:rgba(97,97,97,.92)}
  .adv-vbtn.v-lock{background:rgba(230,126,34,.92)}
  #adv-mic{top:202px} #adv-spk{top:242px} #adv-vmode{top:282px;background:rgba(123,31,162,.92)}
  #adv-tmute{top:322px;background:rgba(198,40,40,.92);display:none}
  #adv-tmute.v-muting{background:rgba(46,125,50,.92)}
  #adv-podbtn{top:362px;background:rgba(249,168,37,.95);color:#5d3a00;display:none}
  #adv-podium{position:absolute;inset:0;display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.74);z-index:8;pointer-events:auto}
  #adv-podium.on{display:flex}
  .adv-pd-box{text-align:center;max-width:88vw}
  .adv-pd-title{color:#ffd54f;font-weight:900;font-size:20px;text-shadow:0 2px 6px #000;margin-bottom:14px}
  .adv-pd-row{display:flex;align-items:flex-end;gap:12px;justify-content:center}
  .adv-pd-col{display:flex;flex-direction:column;align-items:center;gap:6px;animation:advPdRise .7s ease-out}
  .adv-pd-name{color:#fff;font-weight:800;font-size:15px;text-shadow:0 1px 4px #000;max-width:120px;
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .adv-pd-name small{color:#ffe082;font-weight:700;white-space:normal}
  .adv-pd-stand{width:92px;border-radius:9px 9px 0 0;color:rgba(0,0,0,.55);font-weight:900;font-size:26px;
    display:flex;align-items:center;justify-content:center}
  .adv-pd-stand.s0{background:linear-gradient(180deg,#ffe082,#f9a825)}
  .adv-pd-stand.s1{background:linear-gradient(180deg,#e8e8e8,#9e9e9e)}
  .adv-pd-stand.s2{background:linear-gradient(180deg,#ffab91,#8d6e63)}
  .adv-pd-me{margin-top:14px;color:#8ef7a5;font-weight:900;font-size:17px;text-shadow:0 1px 4px #000}
  .adv-pd-hint{display:block;margin-top:8px;color:#ccc;font-size:11px}
  @keyframes advPdRise{0%{opacity:0;transform:translateY(42px)}100%{opacity:1;transform:translateY(0)}}
  #adv-chat-box{position:absolute;bottom:56px;left:50%;transform:translateX(-50%);display:none;flex-direction:column;gap:6px;
    background:rgba(0,0,0,.6);border-radius:14px;padding:8px;pointer-events:auto;width:min(420px,86vw)}
  .adv-chat-row{display:flex;gap:6px}
  #adv-quick{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}
  .adv-qc{background:rgba(255,255,255,.92);border:none;border-radius:9px;padding:5px 10px;
    font-size:13px;font-weight:700;font-family:inherit;color:#333}
  .adv-qc:active{background:#ffe082}
  #adv-chat-input{flex:1;border:none;border-radius:9px;padding:8px 10px;font-size:15px;font-family:inherit;outline:none}
  #adv-chat-send{background:#43a047;color:#fff;border:none;border-radius:9px;font-weight:800;font-size:14px;
    padding:8px 14px;font-family:inherit}
  #adv-selfmsg{position:absolute;bottom:96px;left:50%;transform:translateX(-50%);max-width:70vw;
    background:rgba(255,255,255,.95);color:#333;border-radius:14px;padding:5px 13px;font-size:14px;font-weight:600;
    display:none;pointer-events:none}
  #adv-selfmsg.on{display:block}
  .adv-haunt #adv-selfmsg{background:rgba(8,8,20,.92);color:#7cffb0;border:1px solid rgba(124,255,176,.6);
    text-shadow:0 0 8px rgba(124,255,176,.8)}
  .adv-haunt .adv-qc{background:rgba(20,20,38,.95);color:#7cffb0;border:1px solid rgba(124,255,176,.4)}
  /* ❓ ปุ่มวิธีเล่น (ซ้ายมินิแมป) + การ์ดวิธีเล่นตอนเข้าโลกครั้งแรก — โชว์คอนโทรลจอสัมผัสที่เดิมมือถือไม่มีบอกเลย */
  #adv-help{top:8px;right:132px;pointer-events:auto;background:rgba(0,0,0,.5);color:#fff;
    border:2px solid rgba(255,255,255,.82);border-radius:50%;width:36px;height:36px;
    font-size:17px;font-weight:900;font-family:inherit;line-height:1;padding:0}
  #adv-help:active{background:rgba(255,255,255,.25)}
  #adv-intro{position:absolute;inset:0;z-index:12;display:none;align-items:center;justify-content:center;
    background:rgba(4,8,16,.82);pointer-events:auto;padding:12px;overflow:auto}
  #adv-intro.on{display:flex;animation:advIntroIn .28s ease-out}
  @keyframes advIntroIn{0%{opacity:0}100%{opacity:1}}
  .adv-intro-card{background:linear-gradient(180deg,rgba(24,32,48,.98),rgba(12,16,28,.98));
    border:2px solid rgba(120,200,255,.55);border-radius:20px;padding:14px 20px;max-width:min(640px,94vw);
    box-shadow:0 8px 40px rgba(0,0,0,.6),0 0 30px rgba(80,160,255,.25);text-align:center;max-height:96vh;overflow:auto}
  .adv-intro-emoji{font-size:34px;line-height:1;margin-bottom:0}
  .adv-intro-card h2{color:#fff;font-size:19px;font-weight:900;margin:0 0 10px;text-shadow:0 2px 6px #000}
  .adv-intro-body{display:flex;gap:16px;text-align:left;margin-bottom:12px}
  .adv-intro-side{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:9px;justify-content:center}
  .adv-intro-goal{color:#dbe8ff;font-size:13.5px;line-height:1.45;margin:0;
    background:rgba(80,140,255,.14);border-radius:12px;padding:8px 12px}
  .adv-intro-goal b{color:#ffe082}
  .adv-intro-ctrl-h{color:#8fd4ff;font-size:12.5px;font-weight:800;letter-spacing:.3px;text-align:left;margin:0}
  .adv-intro-list{list-style:none;margin:0;padding:0;text-align:left;display:flex;flex-direction:column;gap:7px}
  .adv-intro-list li{display:flex;align-items:center;gap:10px;color:#eef4ff;font-size:13px;line-height:1.32}
  .adv-intro-list .ic{flex:0 0 32px;height:32px;display:flex;align-items:center;justify-content:center;
    font-size:17px;background:rgba(255,255,255,.08);border-radius:9px}
  .adv-intro-list b{color:#ffe082}
  .adv-intro-tip{color:#bcd0e8;font-size:12px;line-height:1.4;margin:0}
  .adv-intro-tip b{color:#ffe082}
  @media (max-width:560px){.adv-intro-body{flex-direction:column;gap:9px}}
  @media (max-height:430px){.adv-intro-emoji{font-size:26px}.adv-intro-card{padding:11px 18px}.adv-intro-card h2{font-size:17px;margin-bottom:8px}.adv-intro-body{margin-bottom:9px}}
  #adv-intro-go{background:linear-gradient(180deg,#5eb7ff,#2f7fe0);color:#fff;border:none;border-radius:14px;
    font-family:inherit;font-weight:900;font-size:17px;padding:11px 30px;box-shadow:0 4px 14px rgba(47,127,224,.55)}
  #adv-intro-go:active{transform:scale(.96)}
  .adv-haunt .adv-intro-card{border-color:rgba(124,255,176,.5);box-shadow:0 8px 40px rgba(0,0,0,.7),0 0 30px rgba(60,255,140,.2)}
  .adv-haunt .adv-intro-goal{background:rgba(40,255,140,.1)}
  .adv-haunt .adv-intro-ctrl-h{color:#7cffb0}
  .adv-haunt #adv-intro-go{background:linear-gradient(180deg,#3ddc84,#1f9e5a)}
  /* 📖 สมุดคำศัพท์รอบนี้ (ตอนออก/จบเกม) — ทบทวนคำที่ประกอบสำเร็จ */
  .adv-recap{margin:9px auto 2px;max-width:340px}
  .adv-recap-h{color:#ffe082;font-size:12.5px;font-weight:800;margin-bottom:5px;text-shadow:0 1px 3px #000}
  .adv-recap-list{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;max-height:96px;overflow-y:auto}
  .adv-recap-w{display:flex;flex-direction:column;align-items:center;line-height:1.15;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:9px;padding:3px 9px;
    color:#fff;font-weight:800;font-size:12.5px}
  .adv-recap-w small{color:#bcd0e8;font-weight:600;font-size:10.5px}
  .adv-haunt .adv-recap-w{background:rgba(40,255,140,.1);border-color:rgba(124,255,176,.3)}
  .adv-haunt .adv-recap-w small{color:#9fe8bf}
  /* ⚽ โหมดสนามฟุตบอล — ปุ่มเล็ง (ซ้าย) · ปุ่มเตะกดค้าง (ขวา) · แถบพลัง · ปุ่มสลับกล้อง · แผงเลือกชุด */
  .adv-soccer #adv-cross,.adv-soccer #adv-gauges,.adv-soccer #adv-cockpit{display:none}
  /* 🕹️ รอบ 398: แป้น ▲▼◀▶ เลิกใช้แล้ว (เล็งด้วยสติ๊ก #adv-joy มือซ้ายแบบ PES) — CSS เก็บไว้เผื่อย้อนกลับ */
  #adv-aimpad{position:absolute;display:none;left:16px;bottom:20px;width:150px;height:150px;z-index:6;
    pointer-events:none;-webkit-user-select:none;user-select:none}
  .adv-touch.adv-soccer #adv-aimpad{display:block}
  #adv-aimpad .apb{position:absolute;width:52px;height:52px;border-radius:14px;pointer-events:auto;
    background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.5);color:#fff;font-size:22px;
    display:flex;align-items:center;justify-content:center;touch-action:none}
  #adv-aimpad .apb:active{background:rgba(255,255,255,.4)}
  #adv-aimpad .ap-u{left:49px;top:0}#adv-aimpad .ap-d{left:49px;bottom:0}
  #adv-aimpad .ap-l{left:0;top:49px}#adv-aimpad .ap-r{right:0;top:49px}
  #adv-kick{position:absolute;display:none;bottom:26px;right:22px;width:88px;height:88px;border-radius:50%;
    z-index:6;pointer-events:auto;background:rgba(46,158,74,.92);border:3px solid #fff;color:#fff;
    font-size:20px;font-weight:900;line-height:1.05;flex-direction:column;align-items:center;justify-content:center;
    touch-action:none;-webkit-user-select:none;user-select:none}
  #adv-kick small{font-size:11px;font-weight:700}
  #adv-kick:active{transform:scale(.94)}
  .adv-touch.adv-soccer #adv-kick{display:flex}
  #adv-power{position:absolute;display:none;right:12px;top:50%;transform:translateY(-50%);width:20px;height:180px;
    z-index:6;background:rgba(0,0,0,.45);border:2px solid #fff;border-radius:12px;overflow:hidden;pointer-events:none}
  /* 🧹 รอบ 851: แถบชาร์จย้ายลงข้างปุ่มเตะ (เดิมลอยกลางขอบขวา โดนคอลัมน์ปุ่มทับบนจอเตี้ย) */
  .adv-soccer #adv-power{display:block;top:auto;transform:none;bottom:96px;right:132px;height:120px}
  #adv-power-fill{position:absolute;left:0;bottom:0;width:100%;height:0%;
    background:linear-gradient(0deg,#43a047,#ffd54f,#e53935);transition:height .04s linear}
  #adv-scam{position:absolute;display:none;top:56px;right:8px;z-index:6;pointer-events:auto;
    background:rgba(0,0,0,.5);color:#fff;border:2px solid #fff;border-radius:12px;
    font-family:inherit;font-weight:800;font-size:13px;padding:6px 10px}
  .adv-soccer #adv-scam,.adv-drive #adv-scam{display:block}
  /* 🎱 รอบ 401: หน้าต่างซูมเลือกจุดสัมผัสบอล (สไตล์สนุกเกอร์) — ลอยฝั่งซ้ายเหนือสติ๊ก ลากเลือกจุดได้
     รอบ 403 (ผู้ใช้สั่ง): เปิดค้างตลอดเต็มขนาด ไม่มีปุ่มเปิด/ปิด และไม่ย่อบนจอเตี้ย */
  #adv-spinpad{position:absolute;display:none;top:62px;left:10px;z-index:7;pointer-events:auto;
    background:rgba(8,20,10,.72);border:2px solid rgba(255,214,102,.85);border-radius:16px;padding:7px;
    box-shadow:0 6px 18px rgba(0,0,0,.5);touch-action:none;-webkit-user-select:none;user-select:none}
  .adv-soccer #adv-spinpad{display:block}
  #adv-spinpad .sp-ball{position:relative;width:112px;height:112px;border-radius:50%;
    background:radial-gradient(circle at 34% 30%,#ffffff 0%,#f2f2f2 42%,#c9c9c9 78%,#9a9a9a 100%);
    box-shadow:inset -6px -8px 16px rgba(0,0,0,.28),0 2px 6px rgba(0,0,0,.5)}
  #adv-spinpad .sp-cross{position:absolute;inset:8px;border-radius:50%;
    background:linear-gradient(rgba(0,0,0,.16) 0 0) 50% 0/1px 100% no-repeat,
               linear-gradient(rgba(0,0,0,.16) 0 0) 0 50%/100% 1px no-repeat;
    border:1px dashed rgba(0,0,0,.16)}
  #adv-spinpad .sp-dot{position:absolute;left:50%;top:50%;width:26px;height:26px;border-radius:50%;
    transform:translate(-50%,-50%);background:radial-gradient(circle at 36% 32%,#fff6d0,#ff9f1c 70%,#e2600a);
    border:2px solid #fff;box-shadow:0 0 10px rgba(255,170,40,.9)}
  #adv-spinpad .sp-lbl{margin-top:6px;text-align:center;color:#ffe082;font:800 11px system-ui;
    text-shadow:0 1px 3px #000;min-height:14px;white-space:nowrap}
  /* จอเตี้ย: แพดคงขนาดเต็ม (ผู้ใช้สั่ง "ไม่ต้องย่อ") → ย่อ "วงสติ๊ก" ลงแทน + ดันแพดขึ้นให้พ้นกัน
     จอ 306px: กระดานคะแนนจบ 57 · แพด 60..210 · สติ๊ก 214..298 (พ้นกันทั้งบนและล่าง) */
  @media (max-height:400px){
    .adv-soccer #adv-spinpad{top:60px}
    .adv-soccer #adv-joy{width:84px;height:84px;bottom:8px}
    .adv-soccer #adv-joy-dot{width:34px;height:34px}
  }
  /* 🌀 รอบ 400: ป้ายความโค้ง — ลอยเหนือปุ่มเตะ (โผล่เฉพาะตอนตั้งโค้งไว้) */
  #adv-curl{position:absolute;display:none;right:22px;bottom:120px;width:88px;z-index:6;pointer-events:none;
    text-align:center;color:#fff;font:800 13px system-ui;text-shadow:0 1px 3px #000;
    background:rgba(20,40,20,.55);border-radius:9px;padding:2px 0}
  .adv-touch.adv-soccer #adv-curl.on{display:block}
  #adv-pk{position:absolute;display:none;top:88px;right:8px;z-index:6;pointer-events:auto;
    background:rgba(20,40,20,.62);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:10px;
    padding:6px 10px;font:700 13px system-ui;cursor:pointer}
  .adv-soccer #adv-pk{display:block}
  #adv-pk.on{background:rgba(200,60,30,.8)}
  /* 🧱 รอบ 402: ปุ่มโหมดฟรีคิก (ใต้ปุ่มจุดโทษ) */
  #adv-fk{position:absolute;display:none;top:128px;right:8px;z-index:6;pointer-events:auto;
    background:rgba(20,40,20,.62);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:10px;
    padding:6px 10px;font:700 13px system-ui;cursor:pointer}
  .adv-soccer #adv-fk{display:block}
  #adv-fk.on{background:rgba(200,60,30,.8)}
  /* จอเตี้ย: ย่อปุ่มลง (ตำแหน่ง top ใช้ชุดเดียวกับจอปกติ — รอบ 851 จัดคอลัมน์ให้ห่างพอแล้ว) */
  @media (max-height:400px){
    #adv-pk{padding:4px 8px;font-size:11px}
    #adv-fk{padding:4px 8px;font-size:11px}
  }
  /* ⚡ รอบ 412: ปุ่มซื้อพลังโอเวอร์ไดรฟ์ + แถบนับถอยหลัง */
  #adv-aura{position:absolute;display:none;top:168px;right:8px;z-index:6;pointer-events:auto;
    background:rgba(18,52,74,.72);color:#cdefff;border:1px solid rgba(120,220,255,.55);border-radius:10px;
    padding:6px 10px;font:700 13px system-ui;cursor:pointer}
  .adv-soccer #adv-aura{display:block}
  #adv-aura.on{background:rgba(0,150,210,.9);color:#fff;border-color:#bdeeff;
    box-shadow:0 0 12px rgba(90,220,255,.7)}
  #adv-aurabar{position:absolute;display:none;top:34px;left:50%;transform:translateX(-50%);z-index:6;
    width:190px;height:17px;border-radius:9px;pointer-events:none;overflow:hidden;
    background:rgba(4,26,38,.72);border:1px solid rgba(120,220,255,.6)}
  #adv-aurabar.on{display:block}
  #adv-aurabar .ab-fill{position:absolute;left:0;top:0;bottom:0;
    background:linear-gradient(90deg,#0a6ea8,#4fd8ff);transition:width .5s linear}
  #adv-aurabar .ab-txt{position:absolute;inset:0;text-align:center;line-height:17px;
    color:#eaffff;font:800 11px system-ui;text-shadow:0 1px 2px #000}
  /* ⚠️ media query ของปุ่มพลังต้องอยู่ "หลัง" การประกาศด้านบน ไม่งั้นโดน top เขียนทับ (specificity เท่ากัน = ตัวหลังชนะ) */
  @media (max-height:400px){ #adv-aura{padding:4px 8px;font-size:11px} }
  /* 🧹 รอบ 851 (ผู้ใช้ส่งภาพปุ่มทับกันมั่ว): จัดฝั่งขวาโลกฟุตบอลใหม่ทั้งชุด
     เดิม exit(118)/แชท(160)/ไมค์(202..282) ตำแหน่ง global ทับ จุดโทษ(100)/ฟรีคิก(138)/พลัง(176) + แถบชาร์จกลางขวา
     ใหม่: แถวบน = ปุ่มระบบ (ออก/?/แชท/ไมค์/ลำโพง/ทุกคน) แบบเดียวกับโลกขับรถ · คอลัมน์ขวา = ปุ่มโหมดฟุตบอลล้วน
     (มุมกล้อง 48 → จุดโทษ 88 → ฟรีคิก 128 → พลัง 168) · แถบเหรียญ/HP ตรึงซ้ายถัดจากกระดาน เปิดทางแถวปุ่มบน */
  .adv-soccer #adv-topbar{left:206px;transform:none}
  .adv-soccer .adv-hp{width:80px}
  .adv-soccer #adv-exit{top:8px;right:8px;font-size:12.5px;padding:5px 9px}
  .adv-soccer #adv-help{top:8px;right:74px;width:30px;height:30px;font-size:14px}
  .adv-soccer #adv-chat-btn{top:8px;right:108px;font-size:12px;padding:5px 8px}
  .adv-soccer #adv-mic{top:8px;right:172px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-soccer #adv-spk{top:8px;right:224px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-soccer #adv-vmode{top:8px;right:276px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-soccer #adv-tmute{top:48px;right:108px;font-size:11px;padding:4px 6px;min-width:0}
  .adv-soccer #adv-scam{top:48px}
  .adv-soccer #adv-aurabar{top:40px}   /* หลบใต้แถวปุ่มบน (เดิม 34 เฉี่ยวปุ่ม 🌐 บนจอแคบ 2px) */
  /* 👁️ รอบ 394: มุมมองที่ 3 โลกขับรถ — ซ่อนชิ้นส่วนห้องคนขับ (ปุ่มบังคับ/GPS คงอยู่) */
  .adv-drive.cam3 #adv-cardash,.adv-drive.cam3 #adv-carwheel,.adv-drive.cam3 #adv-cargauges,
  .adv-drive.cam3 #adv-bobble,.adv-drive.cam3 #adv-tlglow-l,.adv-drive.cam3 #adv-tlglow-r,
  .adv-drive.cam3 #adv-tlreflect-l,.adv-drive.cam3 #adv-tlreflect-r{display:none}
  /* 👕 รอบ 939: ห้องแต่งตัวนักเตะเต็มจอ — ทุกอย่างต้องเห็นครบไม่มี scroll แม้จอเตี้ย 812×375 (กฎทอง #7) */
  #adv-soccerstart{position:absolute;inset:2vh 2vw;display:none;z-index:8;box-sizing:border-box;
    background:linear-gradient(160deg,rgba(6,38,22,.97),rgba(3,16,10,.98) 55%,rgba(10,26,40,.97));
    border:2px solid #e8c35a;border-radius:22px;padding:1vh 1.6vw;color:#e6fff0;pointer-events:auto;
    box-shadow:0 0 44px rgba(232,195,90,.35), inset 0 0 90px rgba(67,209,122,.10)}
  #adv-soccerstart.on{display:flex;flex-direction:column}
  #adv-soccerstart h3{margin:.2vh 0 .8vh;text-align:center;font-size:clamp(16px,3.6vh,26px);color:#ffe08a;
    text-shadow:0 0 14px rgba(255,215,120,.55);letter-spacing:.5px}
  #adv-soccerstart .ss-body{flex:1;display:flex;gap:1.6vw;min-height:0}
  #adv-soccerstart .ss-left{flex:0 0 clamp(110px,23vw,230px);display:flex;flex-direction:column;align-items:center;
    justify-content:center;background:radial-gradient(ellipse at 50% 30%,rgba(67,209,122,.16),rgba(0,0,0,.28) 75%);
    border:1px solid rgba(232,195,90,.4);border-radius:16px;padding:.6vh .4vw}
  #adv-soccerstart #ss-prev{width:auto;height:min(78%,44vh);max-width:100%}
  #adv-soccerstart .ss-patname{font-size:clamp(11px,2.2vh,15px);font-weight:800;color:#ffe08a;margin-top:.4vh;text-align:center}
  #adv-soccerstart .ss-right{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;min-width:0}
  #adv-soccerstart .ss-lab{font-size:clamp(11px,2.4vh,15px);font-weight:800;color:#a9e8c4;margin:0 0 .4vh}
  #adv-soccerstart .ss-shirts{display:flex;flex-wrap:wrap;gap:clamp(4px,.9vw,10px);align-items:center}
  #adv-soccerstart .ss-shirt{width:clamp(30px,6.4vh,46px);height:clamp(26px,5.6vh,40px);border-radius:8px;
    border:2px solid rgba(255,255,255,.28);cursor:pointer;padding:1px;background:rgba(255,255,255,.06);line-height:0}
  #adv-soccerstart .ss-shirt svg{width:100%;height:100%}
  #adv-soccerstart .ss-shirt.sel{border-color:#ffe08a;box-shadow:0 0 12px rgba(255,224,138,.8);transform:scale(1.1)}
  #adv-soccerstart .ss-row{display:flex;align-items:center;gap:clamp(8px,1.6vw,20px);flex-wrap:nowrap}
  #adv-soccerstart .ss-num{display:flex;align-items:center;gap:clamp(6px,1vw,14px)}
  #adv-soccerstart .ss-num button{width:clamp(30px,6vh,44px);height:clamp(30px,6vh,44px);border-radius:10px;
    border:2px solid #43d17a;background:rgba(67,209,122,.16);color:#c9ffdf;
    font-size:clamp(16px,3.4vh,24px);font-weight:900;font-family:inherit;cursor:pointer}
  #adv-soccerstart .ss-num button:active{transform:scale(.92)}
  #adv-soccerstart #ss-no{font-size:clamp(18px,4.2vh,30px);font-weight:900;color:#fff;min-width:1.6em;text-align:center}
  #adv-soccerstart #ss-go{margin-left:auto;background:linear-gradient(135deg,#f6c026,#e8940a);
    color:#3a2400;border:0;border-radius:14px;font-family:inherit;font-weight:900;
    font-size:clamp(14px,3.4vh,20px);padding:clamp(6px,1.4vh,12px) clamp(16px,3vw,36px);cursor:pointer;
    box-shadow:0 3px 14px rgba(246,192,38,.45)}
  #adv-soccerstart #ss-go:active{transform:scale(.96)}
  /* 🪙 ป๊อปเหรียญตอนเตะโดนตัวอักษรที่ประกอบคำได้ — เด้งใหญ่แล้วลอยขึ้นจาง (หวือหวาเหมือนจับคู่คำศัพท์) */
  #adv-coinpop{position:absolute;inset:0;pointer-events:none;z-index:7;overflow:hidden}
  #adv-coinpop .sc-pop{position:absolute;transform:translate(-50%,-50%);font-weight:900;
    font-size:clamp(20px,4.4vw,30px);color:#ffdf4d;white-space:nowrap;
    text-shadow:0 0 10px rgba(255,190,30,.9),0 2px 5px #000;animation:scPop .9s ease-out forwards}
  @keyframes scPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}
    22%{opacity:1;transform:translate(-50%,-58%) scale(1.25)}
    38%{transform:translate(-50%,-62%) scale(1)}
    100%{opacity:0;transform:translate(-50%,-150%) scale(1)}}
  html.no-anim #adv-coinpop .sc-pop{animation:none;opacity:0}
  /* 🔠 ป้ายตอนเก็บตัวอักษร: โชว์ตัวอักษรตัวใหญ่ในวงกลม + เหรียญที่ได้ (รอบ 345) */
  #adv-coinpop .letter-pop{display:flex;align-items:center;gap:7px;font-size:clamp(15px,3vw,20px);
    color:#fff8d6;text-shadow:0 0 8px rgba(255,190,30,.85),0 2px 5px #000}
  #adv-coinpop .letter-pop b{display:inline-flex;align-items:center;justify-content:center;
    width:1.85em;height:1.85em;border-radius:50%;font-size:1.25em;line-height:1;
    background:radial-gradient(circle at 35% 28%,#fff3ad,#f7b733 62%,#c8801a);
    color:#4a2c00;border:2px solid #fff2c4;text-shadow:none;
    box-shadow:0 0 12px rgba(255,200,60,.85),0 2px 6px rgba(0,0,0,.5)}
  /* 🤖 โหมดหุ่นยนต์นักรบ — ปุ่มบังคับใสๆ (เดินหน้า/ถอย/หัน/ยิง) + ไฮไลต์ตัวอักษรตัวถัดไปที่ต้องยิง */
  .adv-mecha #adv-cross{width:26px;height:26px;background:none;border:2px solid rgba(120,230,255,.9);
    border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,.7),0 0 10px rgba(80,200,255,.5)}
  .adv-mecha #adv-cross:after{content:'';position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;
    transform:translate(-50%,-50%);background:rgba(140,240,255,.95)}
  .adv-mecha .adv-fch.mnext{background:rgba(80,200,255,.4);box-shadow:0 0 12px rgba(80,200,255,.8);
    outline:2px solid #7fe6ff}
  .mecha-btn{position:absolute;display:none;z-index:6;pointer-events:auto;-webkit-user-select:none;user-select:none;
    touch-action:none;background:rgba(120,200,255,.14);border:2px solid rgba(150,220,255,.5);color:#dff2ff;
    border-radius:16px;align-items:center;justify-content:center;font-size:26px;font-weight:800;backdrop-filter:blur(2px)}
  .mecha-btn:active{background:rgba(120,200,255,.34)}
  .adv-touch.adv-mecha .mecha-btn{display:flex}
  /* รอบ 220 (ผู้ใช้ · แก้ชนบนจอแคบ): 3 คลัสเตอร์แยกกันชัด — ◀▶ ซ้ายล่าง · ▲▼ ขวาล่าง · ปุ่มยิงกลางใต้คำ
     (รอบ 219 ปุ่มยิงใต้ตัวท้าย H ค่อนขวา → ชน ▲▼ ขวาล่างบนจอ ~480px · ย้ายปุ่มยิงมากลางจอ = ช่องกลางกว้างพอ ไม่ชนทั้ง 2 ฝั่ง) */
  #mecha-fwd{right:22px;bottom:104px;width:76px;height:70px}       /* ▲ เดินหน้า (ขวาล่าง) */
  #mecha-back{right:22px;bottom:24px;width:76px;height:70px}       /* ▼ ถอย (ขวาล่าง) */
  #mecha-left{left:22px;bottom:24px;width:70px;height:70px;border-radius:50%}    /* ◀ เลี้ยวซ้าย (ซ้ายล่าง) */
  #mecha-right{left:100px;bottom:24px;width:70px;height:70px;border-radius:50%}  /* ▶ เลี้ยวขวา (ซ้ายล่าง) */
  #mecha-fire{right:146px;top:186px;width:92px;height:92px;border-radius:50%;font-size:34px;
    background:rgba(255,90,110,.32);border-color:rgba(255,150,160,.7)}   /* รอบ 221 (ผู้ใช้): ย้ายไปขวา ให้อยู่คอลัมน์เดียวกับปุ่ม "ทุกคน"/vmode (right:162+ครึ่ง60 −ครึ่ง92 = right:146) */
  #mecha-fire2{left:24px;top:138px;width:84px;height:84px;border-radius:50%;font-size:30px;
    background:rgba(255,90,110,.32);border-color:rgba(255,150,160,.7)}   /* รอบ 223 (ผู้ใช้): ปุ่มยิงตัวที่ 2 ใต้ minimap ซ้าย (ยิงได้สองมือ) */
  #mecha-fire:active,#mecha-fire2:active{background:rgba(255,90,110,.55)}
  /* 🤖 รอบ 224: กรอบ HUD ห้องนักบินตามหุ่นแต่ละตัว (img/robots/hud/robotHUD_NN.png) + เอฟเฟกต์ไล่เฉดสี + ค่าตัวเลขเรียลไทม์
     --mh = สีประจำอาวุธของหุ่น (ตั้งตอนเข้าเกมจาก MECHA_WEAPONS) · กรอบเจาะกลางให้มองทะลุเห็นสนามรบ */
  #mecha-hud{position:absolute;inset:0;z-index:5;pointer-events:none;display:none;
    --mh:#7fe6ff;--mh-soft:rgba(127,230,255,.85)}
  .adv-mecha #mecha-hud{display:block}
  #mecha-hud .mh-frame{position:absolute;inset:0;background-size:cover;background-position:center;
    -webkit-mask-image:radial-gradient(ellipse 41% 53% at 50% 47%,transparent 55%,#000 80%);
            mask-image:radial-gradient(ellipse 41% 53% at 50% 47%,transparent 55%,#000 80%)}
  #mecha-hud .mh-tint{position:absolute;inset:0;mix-blend-mode:screen;opacity:.32;
    background:radial-gradient(ellipse 72% 72% at 50% 50%,transparent 40%,var(--mh) 125%)}
  #mecha-hud .mh-sweep{position:absolute;inset:0;mix-blend-mode:screen;opacity:.5;
    background:linear-gradient(115deg,transparent 40%,var(--mh-soft) 50%,transparent 60%);
    background-size:260% 100%;animation:mhSweep 5.5s linear infinite}
  @keyframes mhSweep{0%{background-position:180% 0}100%{background-position:-90% 0}}
  #mecha-hud .mh-scan{position:absolute;inset:0;opacity:.12;
    background:repeating-linear-gradient(0deg,transparent 0 2px,#000 2px 3px)}
  html.no-anim #mecha-hud .mh-sweep{animation:none;opacity:.28}
  /* แถบเทเลเมทรีบาง ๆ กลางล่าง (โซนเดียวที่ปลอดปุ่มทุกจอ — ต่ำกว่าปุ่มยิงกลาง เหนือ ◀▶/▲▼ ไม่ชน) */
  #mecha-hud .mh-tele{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);
    display:flex;gap:5px;flex-wrap:nowrap;justify-content:center;max-width:96vw;pointer-events:none}
  #mecha-hud .mh-chip{display:flex;align-items:center;gap:4px;padding:2px 8px;border-radius:14px;
    background:linear-gradient(160deg,rgba(6,16,26,.74),rgba(4,10,18,.56));border:1px solid var(--mh);
    box-shadow:0 0 9px rgba(0,0,0,.45),inset 0 0 8px rgba(0,0,0,.35);white-space:nowrap;
    font-family:'Segoe UI',system-ui,sans-serif;color:#dff5ff;text-shadow:0 0 5px rgba(0,0,0,.7)}
  #mecha-hud .mh-chip span{opacity:.68;font-size:8.5px;font-weight:700;letter-spacing:1px}
  #mecha-hud .mh-chip i{opacity:.6;font-size:8.5px;font-style:normal}
  #mecha-hud .mh-chip b{font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums;
    color:var(--mh);text-shadow:0 0 7px var(--mh)}
  #mecha-hud .mh-id{background:linear-gradient(160deg,rgba(10,22,34,.82),rgba(6,14,24,.66))}
  #mecha-hud .mh-id b{background:linear-gradient(90deg,var(--mh),#fff,var(--mh));background-size:200% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
    letter-spacing:1.5px;animation:mhShine 3.4s linear infinite;text-shadow:none}
  @keyframes mhShine{0%{background-position:0 0}100%{background-position:200% 0}}
  html.no-anim #mecha-hud .mh-id b{animation:none;-webkit-text-fill-color:var(--mh);color:var(--mh)}
  #mecha-hud .mh-bar{width:30px;height:7px;border-radius:4px;background:rgba(255,255,255,.13);
    overflow:hidden;box-shadow:inset 0 0 3px rgba(0,0,0,.6)}
  #mecha-hud .mh-bar i{display:block;height:100%;width:0;border-radius:4px;transition:width .18s ease;font-size:0}
  #mecha-hud .mh-heat i{background:linear-gradient(90deg,#ffd24d,#ff5a3a)}
  /* ป้าย "ล็อกเป้า" ใต้เป้าเล็ง (โผล่เมื่อเล็งตรงตัวอักษรตัวถัดไป) */
  #mecha-hud .mh-lock{position:absolute;top:calc(50% + 26px);left:50%;transform:translateX(-50%);
    display:none;padding:2px 10px;border-radius:12px;font-family:'Segoe UI',system-ui,sans-serif;
    font-size:11px;font-weight:800;letter-spacing:1.5px;white-space:nowrap;color:#fff;
    background:rgba(8,16,26,.55);border:1px solid var(--mh);text-shadow:0 0 6px var(--mh);
    box-shadow:0 0 12px var(--mh)}
  #mecha-hud.locked .mh-lock{display:block;animation:mhBlink 1s steps(1) infinite}
  @keyframes mhBlink{50%{opacity:.35}}
  html.no-anim #mecha-hud.locked .mh-lock{animation:none}
  /* 🤖 รอบ 225: เรดาร์เข็มกวาดกลางจอ (ชี้ทิศเอเลี่ยน · เจาะกลางไว้ไม่บังเป้าเล็ง) */
  #mecha-hud .mh-radar{position:absolute;left:50%;top:50%;width:150px;height:150px;
    transform:translate(-50%,-50%);pointer-events:none}
  #mecha-hud .mh-rr{position:absolute;inset:2px;border-radius:50%;border:1px solid var(--mh);opacity:.28}
  #mecha-hud .mh-rr2{inset:28px;opacity:.2}
  #mecha-hud .mh-rsweep{position:absolute;inset:0;border-radius:50%;opacity:.5;
    background:conic-gradient(from 0deg,transparent 0deg 322deg,var(--mh) 356deg,transparent 360deg);
    -webkit-mask:radial-gradient(circle,transparent 24%,#000 26%);mask:radial-gradient(circle,transparent 24%,#000 26%);
    animation:mhRadar 3.2s linear infinite}
  @keyframes mhRadar{to{transform:rotate(360deg)}}
  html.no-anim #mecha-hud .mh-rsweep{animation:none;opacity:.32}
  #mecha-hud .mh-blip{position:absolute;left:75px;top:75px;width:7px;height:7px;border-radius:50%;
    background:var(--mh);box-shadow:0 0 7px var(--mh);transform:translate(-50%,-50%);display:none}
  #mecha-hud .mh-blip.boss{width:12px;height:12px;background:#ff3b6b;box-shadow:0 0 10px #ff3b6b}
  #mecha-hud .mh-blip.tgt{width:11px;height:11px;background:#fff;box-shadow:0 0 10px var(--mh),0 0 4px #fff;
    animation:mhBlip .7s ease-in-out infinite}
  @keyframes mhBlip{50%{transform:translate(-50%,-50%) scale(1.5)}}
  html.no-anim #mecha-hud .mh-blip.tgt{animation:none}
  /* 🔥 โอเวอร์ฮีต — ปืนล็อกชั่วคราวเมื่อ HEAT เต็ม */
  #mecha-hud.overheat .mh-heatchip{border-color:#ff5a3a;animation:mhBlink .5s steps(1) infinite}
  #mecha-hud.overheat .mh-heat i{background:#ff3b3b}
  #mecha-hud.overheat #mh-heatlbl{color:#ff8a6a;opacity:1;letter-spacing:.5px}
  html.no-anim #mecha-hud.overheat .mh-heatchip{animation:none}
  /* 🚨 กะพริบแดง + เตือน เมื่อโดนเอเลี่ยนโจมตี / พลังงานต่ำ */
  #mecha-hud .mh-alarm{position:absolute;inset:0;pointer-events:none;opacity:0;
    background:radial-gradient(ellipse 75% 75% at 50% 50%,transparent 42%,rgba(255,40,40,.6) 118%)}
  #mecha-hud.hit .mh-alarm{animation:mhHit .5s ease-out}
  @keyframes mhHit{0%{opacity:.95}100%{opacity:0}}
  #mecha-hud.lowhp .mh-alarm{opacity:.3;animation:mhLow 1.1s ease-in-out infinite}
  @keyframes mhLow{50%{opacity:.55}}
  html.no-anim #mecha-hud.hit .mh-alarm,html.no-anim #mecha-hud.lowhp .mh-alarm{animation:none;opacity:0}
  /* 👾 รอบ 227: แถบพลังบอส (บนกลาง · โผล่เฉพาะตอนมีบอส · โซน y44-70 ปลอดปุ่ม) */
  #mecha-hud .mh-boss{position:absolute;top:44px;left:132px;display:none;
    align-items:center;gap:6px;padding:2px 9px;border-radius:13px;max-width:200px;
    background:linear-gradient(160deg,rgba(40,6,16,.8),rgba(24,4,12,.66));border:1px solid #ff3b6b;
    box-shadow:0 0 12px rgba(255,59,107,.5);font-family:'Segoe UI',system-ui,sans-serif}
  #mecha-hud.bosson .mh-boss{display:flex}
  #mecha-hud .mh-boss-ttl{font-size:10px;font-weight:800;letter-spacing:.5px;color:#ff7a9c;text-shadow:0 0 6px #ff3b6b;white-space:nowrap}
  #mecha-hud .mh-boss-bar{width:clamp(78px,26vw,120px);height:9px}
  #mecha-hud .mh-boss-bar i{background:linear-gradient(90deg,#ff3b6b,#ff9a3a);width:100%}
  /* 🔥 คอมโบ — ป๊อปกลางบน (ใต้คำ เหนือเป้าเล็ง) */
  #mecha-hud .mh-combo{position:absolute;top:104px;left:50%;transform:translateX(-50%);
    font-family:'Segoe UI',system-ui,sans-serif;font-weight:900;white-space:nowrap;opacity:0;
    color:#fff;text-shadow:0 0 10px var(--mh),0 1px 3px #000}
  #mecha-hud .mh-combo.pop{animation:mhCombo .8s ease-out}
  @keyframes mhCombo{0%{opacity:0;transform:translateX(-50%) scale(.6)}25%{opacity:1;transform:translateX(-50%) scale(1.12)}
    45%{transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(1)}}
  html.no-anim #mecha-hud .mh-combo.pop{animation:none;opacity:0}
  /* 🛡️ โล่พลังงาน — บับเบิลเรืองรอบจอตอนกันกระสุน */
  #mecha-hud .mh-shield{position:absolute;inset:0;pointer-events:none;opacity:0;border-radius:0;
    background:radial-gradient(ellipse 74% 74% at 50% 50%,transparent 48%,rgba(120,220,255,.28) 96%,rgba(160,240,255,.5) 118%);
    box-shadow:inset 0 0 60px rgba(120,220,255,.4)}
  #mecha-hud.shielded .mh-shield{opacity:1;animation:mhShield .9s ease-in-out infinite}
  @keyframes mhShield{50%{opacity:.55}}
  html.no-anim #mecha-hud.shielded .mh-shield{animation:none;opacity:.8}
  /* 🔫 รอบ 228: ปุ่มยิงเปลี่ยนสีตามสถานะ (feedback) — โอเวอร์ฮีต/คอมโบ/ร้อน/โล่ */
  #mecha-fire.fs-hot,#mecha-fire2.fs-hot{background:rgba(255,150,60,.4);border-color:rgba(255,190,120,.85)}
  #mecha-fire.fs-over,#mecha-fire2.fs-over{background:rgba(255,60,60,.5);border-color:#ff5a5a;
    box-shadow:0 0 14px rgba(255,60,60,.7);animation:mhBlink .5s steps(1) infinite}
  #mecha-fire.fs-combo,#mecha-fire2.fs-combo{background:rgba(255,205,70,.45);border-color:#ffd24d;
    box-shadow:0 0 16px rgba(255,210,80,.8)}
  #mecha-fire.fs-shield,#mecha-fire2.fs-shield{background:rgba(120,215,255,.45);border-color:#8fe6ff;
    box-shadow:0 0 16px rgba(120,215,255,.75)}
  html.no-anim #mecha-fire.fs-over,html.no-anim #mecha-fire2.fs-over{animation:none}
  /* 📊 รอบ 228: บรรทัดสถิติในหน้าจบเกม */
  .adv-ko-stat{margin:6px auto 2px;padding:5px 10px;border-radius:10px;font-size:13px;font-weight:700;
    color:#ffe9a8;background:rgba(255,180,60,.14);border:1px solid rgba(255,200,90,.4);display:inline-block}
  /* 🧭 GPS นำทาง (โหมดขับรถ) — การ์ดสไตล์ Google Maps: ลูกศรชี้ + คำสั่งเลี้ยว + ระยะทาง + ตัวอักษรเป้า */
  #adv-gps{position:absolute;display:none;left:8px;top:150px;z-index:6;pointer-events:none;
    background:linear-gradient(160deg,rgba(20,120,86,.95),rgba(10,78,58,.96));
    border:2px solid #35d17e;border-radius:14px;padding:8px 12px 9px;min-width:130px;color:#eafff4;
    box-shadow:0 4px 16px rgba(0,0,0,.42)}
  .adv-drive #adv-gps{display:block}
  #adv-gps .gps-top{display:flex;align-items:center;gap:9px}
  #adv-gps .gps-arrow{font-size:26px;line-height:1;display:inline-block;transition:transform .3s ease;
    color:#8effc4;filter:drop-shadow(0 0 5px rgba(80,255,170,.75))}
  #adv-gps .gps-turn{font-size:15px;font-weight:800;white-space:nowrap}
  #adv-gps .gps-bot{display:flex;align-items:baseline;gap:8px;margin-top:4px}
  #adv-gps .gps-bot b{font-size:22px;color:#ffe082;line-height:1}
  #adv-gps .gps-lab{font-size:11px;color:#bfe8d4;font-weight:700}
  #adv-gps .gps-dist{font-size:14px;font-weight:800;color:#dffbee;margin-left:auto}
  /* จอเตี้ย: ย้าย GPS ลงนิดไม่ให้ชนแถวปุ่มบน */
  @media (max-height:430px){ #adv-gps{top:138px;padding:6px 10px} #adv-gps .gps-arrow{font-size:22px} }`;
