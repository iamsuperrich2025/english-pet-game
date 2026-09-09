# TASKS.md — งานถัดไป + ประวัติรอบ (เปิดตอนเลือกงาน / ตามบั๊ก)

> 📂 ราก `C:\Users\rober\english-pet-game\` · เปิดไฟล์ใช้ path เต็ม · สถานะย่อ + กฎ + testkit อยู่ใน `HANDOFF.md` (อ่านนั่นก่อน)
>
> 🧭 **โครงไฟล์นี้แยก 3 ชั้นเสมอ** — กันไม่ให้ session หน้าหลงเดา:
> **① อาการ (ยืนยันแล้ว)** = เห็นจริง/reproduce ได้ · **② เดา (ยังไม่พิสูจน์)** = สมมติฐาน ห้ามลงมือแก้จนพิสูจน์ · **③ งานถัดไป**

## 🟢 ไม่มีบั๊กค้าง
บั๊ก "ของขวัญโดนบัง" ปิดจบรอบ 31 · **ผู้ใช้ทดสอบจริงยืนยันแล้ว 7 ก.ค.** (กล่องยืนยันเด้งหน้าแผง picker ถูกต้อง ไม่บวม)

> ประวัติ Frontline 1372–1373: `handoff/archive/frontline-1372-1373.md`

### 📌 สรุปสถานะล่าสุด

- **รอบ 1384 · คริสตัล A–Z + MEGA 5 ครั้ง:** แท่นตกแต่ง6จุดเปลี่ยนเป็นคริสตัลเก็บได้/เกิดใหม่18วินาทีเกม; รวมคริสตัลจากศัตรู เก็บครบ5ได้MEGA5ครั้ง ใช้ครั้งละ1และตัวอักษรยังอยู่ครบ ใช้หมดเริ่มสะสมชุดใหม่
- วงธาตุตามฮีโร่รัศมี18 โจมตีจริง3ระลอกเฉพาะในวง; ป้ายเหลือ N แยกคูลดาวน์ N วิ; กระเป๋าเต็มไม่กินคริสตัล/ไม่เติมเกจ, ตัวอักษรทำตกไม่เติมเกจซ้ำ; ลงสนามใหม่หรือล้มล้างเกจและจำนวนครั้ง; admin-only/บ้าน/HPเดิม
- Crystal/MEGA53 checks บน dist + Arena26 + Elements50 + HomeV2/build9,490files614.6MiB/web validator/syntax/diff ผ่าน; predeploy undefined/template บน HEAD+3JS patch ผ่านunknown0, missing-assets306ครบ; no production test writes, ไม่มี asset/network schema ใหม่
- พร้อมส่ง manifest เฉพาะ8ไฟล์ผ่าน COMMIT_DEPLOY.bat; ยังไม่ยืนยัน deploy1384; รายละเอียด docs/ARENA_FIELD.md และ tools/test_arena_crystals.cjs, ภาพตัวอย่าง outputs/mega-five-uses.webp ของแชทนี้

- **รอบ 1383 · แก้ Deploy ติด async():** ยืนยันตัวตรวจ undefined-call เข้าใจ async arrow callback ใน `js/ui.js:7284` เป็นฟังก์ชันไม่มีนิยาม; เปลี่ยนเป็น named async function `preloadArenaScene` โดยไม่แก้หรือข้ามตัวตรวจ และคง preload/cancel/entry behavior
- ด่าน undefined-call/template-backtick ผ่านบน git HEAD JavaScript + UI patch (unknown0), missing-assets --git306ครบ, syntax/diff + hero browser31 checks + build9,490files614.6MiB + web validator ผ่าน; เตรียม SHIP เฉพาะ ui.js/TASKS.md และเปิด launcher รอบใหม่; ยังไม่ยืนยันผล deploy1383

- **รอบ 1382 · ชื่อฮีโร่ภาษาอังกฤษ:** เปลี่ยนชื่อแสดงผล 8 ตัวใน `js/arena-heroes.js` เป็น Zevrakin/Kirevon/Vaelkorin/Oryndel/Elyzavia/Lyravyn/Nirelya/Zirelia ตามภาพผู้ใช้; เอาไอคอนซ้ำหน้าชื่อบนการ์ดออกให้ชื่อยาวพอดีมือถือ โดยคง ID/save/พลังเดิม
- Syntax/diff + hero browser31 checks (4 viewports) + build9,490files614.6MiB + web validator ผ่าน; hash source/dist ตรงกัน; เตรียม SHIP เฉพาะ js/arena-heroes.js และ TASKS.md, ยังไม่ยืนยัน deploy รอบ1382


- **รอบ 1381 · Arena ธาตุ + เลือกฮีโร่:** พลังธาตุใหม่ 8 ชนิด/คลัง 10 พลัง, HP เหนือหัวและดาเมจลอยจาง; หน้าเลือกชาย4หญิง4 ภาพเจนเต็มตัว WebP, ผม/ผ้าคลุม/ธาตุขยับเฉพาะภาพที่เลือก; คง admin-only
- ฮีโร่มีพลังเริ่มต้นต่างกัน+คูลดาวน์ธาตุประจำตัวลด20%; preload ไฟล์สนามระหว่างเลือก, cancel/retry/ลดแอนิเมชัน/cleanup; ตัวในสนามยังเล็กและเบา; รายละเอียด+prompt/asset bytes: docs/ARENA_FIELD.md, docs/ARENA_HERO_ASSETS.json
- Source/dist ผ่าน Arena26+ธาตุ50+ฮีโร่31 checks, HomeV2, syntax/diff, build9,490files614.6MiB และ web validator; ไม่มี browser error; pixel QA ใบหน้า/เท้าคงที่ ผม/ผ้าคลุม/ไฟขยับ; ไม่เขียนข้อมูลทดสอบ production
- พร้อมส่งผ่าน COMMIT_DEPLOY.bat ตาม FILE manifest; ยังไม่ยืนยัน deploy รอบ1381. คงไฟล์เปลี่ยนค้างนอก scope รวม docs/PROJECT_MAP.md+CURRENT_STATE.md ไว้ในเครื่อง (มีงาน Frontline อื่นปนอยู่); mapping Arena อัปเดตในเครื่องและ docs/ARENA_FIELD.md มี routing ครบ

- **รอบ 1380 · Arena Field (โลกผจญภัยเฉพาะแอดมิน):** ตัวละคร articulated ขนาดเล็ก/กดโจมตีค้าง + กล้องกว้าง + pooled เวท/สายฟ้า/โดม; `arena-field-visuals.js` ใหม่ โหลดก่อน `arena3d.js`; ไม่มี raster/GLB/audio asset ใหม่
- เก็บอักษรได้ 6 ตัว → ขนกลับวงบ้านเพื่อฝาก/ประกอบคำ, `state.arenaHome` จำคลัง+ของที่ขนข้ามเข้าเกม; ล้มทำของตกแต่คลังไม่หาย; มี H กลับบ้าน/บ้านเพื่อน และคง boss/revive/รางวัลเดิม; guard isAdmin ทั้ง entry+engine
- source browser 24 / dist browser 26 checks ผ่าน (touch+hold/เซฟ/ซ้ำ/ลงบ้าน/low-power/812×375,667×320,1366×768), Home V2 + syntax + build9,470files612.9MiB + validator ผ่าน; สกิลใหญ่ old/new peak402/138 draws (ไม่ใช่ FPS มือถือจริง); รายละเอียด `docs/ARENA_FIELD.md`
- เปิด COMMIT_DEPLOY แล้ว 1 ครั้ง; รอผู้ใช้ตอบ y / หลักฐาน [SUCCESS] ยังไม่ยืนยัน commit/deploy. `SHIP.txt` pin8ไฟล์ Arena; PROJECT_MAP/CURRENT_STATE ปรับ route ในเครื่องแต่ไม่รวมส่งเพราะมี diff Frontline เดิม. ภาพ/รายงาน `work/arena-field-dist/`; ไม่ทดสอบบัญชีจริงหรือเขียน production DB

## 🤖 งานที่มอบ Codex (ChatGPT) ทำอยู่ตอนนี้ — เช็กก่อนเริ่มงานทุกครั้งกันชนกัน
- **รอบ 1376 · แก้กดเข้า Vocab World Racing จาก Home V2 ไม่ได้:** ต้นเหตุ Home V2 เรียก `enterF1_3D()` ตรง ๆ จึงข้าม pipeline ที่ตั้ง `f1Ticket` และทิ้งผล async ทำให้ปุ่มดูเหมือนไม่ตอบสนอง; เปลี่ยนให้ delegate ไป `#btn-world-f1` ซึ่งเป็นทางเข้ากลางของ Classic
- เพิ่ม regression guard ใน `test_f1_lobby_lock.js` และ `test_home_v2_mobile_preview.js`; syntax + free-entry + F1 ทั้ง 19 ไฟล์ + Home V2 ผ่าน
- browser smoke ทั้ง source และ dist ผ่านที่ 812×375: ปุ่มเปิดกล่องยืนยันครบในจอ, ยืนยันแล้ว `f1Ticket=true` และ engine start; build 9,463 files/612.8 MiB + web validator ผ่าน
- **รอบ 1375 · Frontline รถถังชน/ดันกัน:** collision module แยก, equal-mass bumpers/substeps, ป้อม/ขอบกั้นแรงดัน, spawn หลบรถ/รถตายไม่กั้น, ไม่ลด HP; bumpSeq ป้องกัน mailbox เก่าลบแรงชน + client reconcile + เสียงชน synth
- ผ่าน 58 unit checks, server auth/economy, native public 2-browser และ Android long-poll Local ชน/dัน peer/ไม่มีทะลุ (ระยะต่ำสุด 3.3)/FIRE+BOMB; build9,463files612.8MiB+validator ผ่าน
- ส่งครบด้วย commit fdeb4210 + handoff91928c6e; Firebase Functions/Hosting deploy สำเร็จและ push main แล้ว; live **2026-09-09.1228** → https://vocabworld.web.app/frontline/index.html (COMMIT_DEPLOY เปิด1ครั้ง แต่ไม่มี tty ข้าม stale files; กู้ครบด้วย finish_round pin manifest)
- ตรวจ live จริง: หน้า200/login gateผ่าน/ไม่มี pageerror, callable401เมื่อไม่ล็อกอิน, collision+audio scripts200 immutable1ปี, dev endpoints404; namespace production `frontline_v1_live/v1`/Local `frontline_v1_dev/<token>` แยก; หลายผู้เล่น+รางวัลทดสอบใน preview กับ backend reducer ไม่เขียน test data ใน production
- **รอบ 1374 · Frontline public + เสียงต้นฉบับ:** ผู้ใช้ยืนยันยกเลิก Local-only และสั่ง commit/deploy จริง; ปุ่มรางซ้าย Classic/Home V2 ทุกบัญชี → `/frontline/index.html`; ไม่มี admin gate
- เพิ่ม callable `frontlineV1` คำนวณ controls/movement/combat/คำบน server, ห้อง 4 คน/บอท/overflow; namespace `frontline_v1_live/v1/{rooms,claims}` default-deny เดิม, จ่าย 1,000 เข้าก้อน save หลักแบบ receipt+private ledger; dev namespace แยกเหมือนเดิม
- เสียง synth/score/audio แยกโมดูล: เพลง+เครื่องยนต์+FIRE/BOMB/fuse/impact/pickup/drop/bank/HP/respawn/win/control; gesture init, immutable cache, mute จำค่า, hidden suspend, dispose; ทดสอบ waveform จริง/ปิดเสียงศูนย์/ไม่มี audio download และ peak12จาก cap24 ผ่าน
- ผ่าน preview public-adapter2-browser (server movement, peer FIRE/BOMB+เสียง, winner1000, wallet11000, reentryไม่ซ้ำ), auth/cap4/receipts/shared49/Home suite/build; เผยแพร่รวม1375แล้ว ดูผลliveด้านบน; รายละเอียด tools/frontline-v1/README.md
> ผู้ใช้เริ่มใช้ Codex ช่วยงานคู่ขนานกับ session Claude (4 ส.ค. 2026 เหตุ: Claude ติด rate limit) — Codex ไม่เห็น `img/`/`sound/` (ไม่อยู่ใน git) และ **deploy Firebase เองไม่ได้** ต้องรอผู้ใช้รันบนเครื่องเอง
- **รอบ 1372 · แก้ซื้อสัตว์แล้วโตทันที + ยืนตรงแท่น:** ต้นเหตุ `testerBoost()` เร่งทุกตัวเป็น Lv.3/EXP 0; ยกเลิก hook หลังซื้อและคืนลายเซ็นสัตว์ที่ถูกเร่งให้ Lv.1 หนึ่งครั้ง โดยไม่ลดตัวที่มี EXP จริง
- Home V2 วัดขอบ alpha ภาพจริงเพื่อชดเชยฐาน/กึ่งกลาง แล้ววางผิวแท่น responsive; ครอบคลุมสัตว์เดิม 3 + สัตว์ใหม่ 6 ชนิด ทุกวัยโดยไม่เพิ่ม/แก้ asset
- regression/syntax/Home suite/build 9,384 ไฟล์/611.9 MiB + validator ผ่าน; visual source+dist 54 เคส (9×3×2 viewport) ฐาน/กลาง 0 px, ผิวแท่นคลาดสูงสุด 0.74 px, ไม่ล้นจอ
- **รอบ 1371 · Frontline DROP การ์ด (Local only):** เพิ่ม `frontline-drop.js` และปุ่มส้ม DROP เหนือ BOMB (จอเตี้ยวางข้างกัน); Q/แตะครั้งเดียว, ไม่มีการ์ด/ตาย/หลุดเน็ต/รอ ACK กดไม่ได้, hint ตัวอักษรไม่ต้องใช้รองรับตัวซ้ำในคำ
- Host รับ `dropSeq` + ตัวอักษร/`carriedRevision` แบบครั้งเดียว กันคำสั่งเก่าทิ้งใบใหม่; วางหลังรถและหลบขอบ/ป้อม, เจ้าของเก็บซ้ำไม่ได้ 1,250 ms, คนอื่นเก็บได้ทันที; การ์ดวางไม่ทับกัน สูงสุด 32 ใบแล้วคงใบในรถ; bank/เหรียญไม่เปลี่ยน
- ผ่าน unit 47 (DROP 12/input 5/economy 7/gameplay 23), native DROP 10 (Android long-poll +180 ms/peer pickup/Q), 5-client 27, visual 8/4 viewport, resume 14, syntax 30 modules; build 9,384 files/611.9 MiB + validator + production exclusion ผ่าน
- เล่น `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1371`; namespace เดิม `frontline_v1_dev/508363967c0dd1ef480273d9/{rooms,inputs}`; hotload rules เฉพาะ localhost emulator ไม่รีเซ็ต R1001; รายงาน/ภาพ WebP `Documents/Codex/2026-09-08/create-a-new-vocab-world-frontline/work/frontline-1371-*`; ไม่ได้ deploy/commit หรือเปิดเมนู production
- **รอบ 1370 · Frontline กล้องสูงและกว้างขึ้น (Local only):** `frontline-scene.js` ยกมุมมอง 53.1° → 66.2°, view 18/23 → 25/31 world units (กว้างขึ้นราว 35–39%); cap จอ ultrawide 68.4 units; ขนาด HUD/ปุ่มคงเดิม
- `frontline-map.js` ใช้ nearest-chunk รอบจุดที่กล้องมอง (local.z-3) กันขอบสนามขาดโดยคง 15 chunks; `frontline-shapes.js`/`frontline-garden.js` รวมกลีบดอกไม้ cache เดียวจาก 5 เป็น 1 draw/ดอก ลดภาระภาพกว้าง; ไม่มี asset runtime ใหม่
- ตรวจผ่าน visual 8 checks (4 viewport + FIRE/BOMB จริง), HP 7 checks, syntax 4 modules, build 9,384 files/611.9 MiB + validator + production exclusion; sample 275 draws/53,161 triangles; ตรวจคณิตศาสตร์ coverage ถึง 2400×1080 พร้อมทบทวนโมดูลโดย sub-agent
- เล่น `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1370`; emulator token เดิม `508363967c0dd1ef480273d9`; ภาพ WebP/รายงาน `Documents/Codex/2026-09-08/create-a-new-vocab-world-frontline/work/frontline-1370-*`; ไม่ได้ deploy/commit หรือเปิดเมนู production
- **รอบ 1369 · Frontline ภาพสวนของเล่น + เหรียญ session (Local only):** เพิ่ม meadow/garden/flora/icons/lighting/particles แยกโมดูล; HUD ครีม ปุ่มเงาวาว หญ้า/ดอกไม้/ลัง/รั้ว ถนนต่อเนื่อง; GLB 130,640 B ไม่มี image texture, เงา 512px อัปเดต 10 Hz; เอฟเฟกต์ลูกกระสุน/ควัน/ชนวน/ระเบิดทองใช้ pool 44 ชุด
- แสดง “รอบนี้” เริ่ม 0 ชนะคำละ 1,000; journal กันซ้ำ ฝากผ่าน `addCoins`/`saveState` ตอน EXIT/pagehide และกู้เมื่อ reload; แก้ preview ขาด shared ranks ทำให้ `loadState` ทิ้งยอดเดิมโดยไม่แตะ shared source; ระบบ HP 5,000/ห้องตัวเลข/4 seats/Thai/ช่องว่างปุ่มยังอยู่
- ตรวจผ่าน: unit 33, 5-client 27, visual 8 (4 viewport + ภาพ FIRE/BOMB จริง), session 7, weapons 7, HP 7, resume 14; build 9,384 files/611.9 MiB + validator + production exclusion ผ่าน; ไม่มี deploy/commit/finish script
- เล่น `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1369`; namespace `frontline_v1_dev/508363967c0dd1ef480273d9/{rooms,inputs}/R<4 digits>`; รายงานและภาพ WebP ที่ `Documents/Codex/2026-09-08/create-a-new-vocab-world-frontline/work/frontline-1369-*`; ภาพอ้างอิงยังรอผู้ใช้ตรวจในเกมจริง
- **รอบ 1368 · Frontline HP 5,000 + แถบเลือด:** ผู้เล่น/บอท/guard เริ่มและเกิดใหม่ 5,000 HP; ปรับ config และ rules เฉพาะ emulator; เพิ่ม `frontline-health.js` 1,207 bytes ให้แถบเหนือรถเขียว >50%, เหลือง >25–50%, แดง ≤25%
- แถบ CSS 54×10 px ตามรถ อยู่เหนือตัวอักษรที่แบก 8.5 px ไม่รับ touch; ซ่อนเมื่อรถตาย/นอกจอ และลบเมื่อ dispose; ไม่มี asset/texture หรือ network state ใหม่; guard และผู้เล่นแสดงตรงกันบนสอง client
- unit/input 26, Chromium 5 clients 26, health 7, mobile weapons 7 checks ผ่าน; ตรวจภาพเขียว/เหลือง/แดงจริงบน 812×375; ปรับ speed test วัดตาม simulation dt เพื่อลดผลเฟรมตก; build 9,384 files + web validator + production exclusion ผ่าน
- รีสตาร์ต local preview + demo emulator แล้ว: `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1368`; namespace session ใหม่ `frontline_v1_dev/626ed850ce795ce29cd1258e/{rooms,inputs}`; ไม่ได้ commit/deploy production
- **รอบ 1367 · แก้ FIRE/BOMB ค้างหลังพักหน้าจอ:** จำลองโค้ดเดิมแล้ว FIRE ไม่ได้รับ ack เมื่อ heartbeat ห้องหมดอายุ; เปลี่ยนเลือก host จาก mailbox เจ้าของจริงที่ส่งภายใน 2.5 วินาที เพื่อฟื้น simulation และส่งต่อ host เมื่อมือถือพัก
- ตรวจ uid ของที่นั่งก่อนรับเป็นรถตัวเอง; หากถูกบอทแทน ให้หยุดควบคุมแล้ว re-admit อัตโนมัติ; คง session เมื่อ pagehide แบบ bfcache; AUTO แยกจาก LEFT/RIGHT 40–72 CSS px (812×375 = 45 px)
- unit/input 26, Chromium หลายผู้เล่น 26, mobile latency 7, recovery 14 checks ผ่าน; ตรวจภาพและ geometry 812×375, 667×320, 1000×500; build 9,384 files + production exclusion ผ่าน; ยังไม่ได้ยืนยันบนมือถือจริงของผู้ใช้
- local `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1367`; namespace เดิม `frontline_v1_dev/<preview-session>/{rooms,inputs}`; ไม่มี asset ใหม่ และไม่ได้ commit/deploy production
- **รอบ 1366 · แก้ FIRE/BOMB มือถือ + ห้องล้นอัตโนมัติ:** ต้นเหตุ tap สั้นหายก่อน RAF, network busy ทิ้งคำสั่ง และหลาย client แข่ง transaction ทั้งห้อง; เพิ่ม input latch/ack + mailbox ต่อที่นั่ง ให้ host เขียน simulation คนเดียว และ local conditional admission; ห้องระบบ R1001→R1002 เมื่อครบ 4 คน ไม่มีชื่อห้องอิสระ
- กระสุน/ระเบิดไม่จำกัดจำนวน คูลดาวน์ 450/700 ms วางระเบิดพร้อมกันได้; เพิ่ม pooled muzzle/กระสุนเรืองแสง/ดาว/คลื่นระเบิด/วงเตือน+นับถอยหลัง, สวนและป้อมของเล่น, status บนปุ่ม; ใช้ GLB เดิม 129,852 bytes ไม่มี texture/audio asset ใหม่
- ใช้คู่คำ+คำแปลจาก `js/data/vocab.js`/`vocabForStudent()` เช่นเกมยิงเป้าคำ; ผู้ประกอบครบก่อนคนเดียวได้คำละ 1,000 ผ่าน economy กลางใน test save พร้อมป้ายและเสียงฉลอง; แก้ fresh WebGL canvas เวลาออกแล้วเข้าห้องใหม่
- unit 21 + input 3, Chromium 5 clients/26 checks, mobile latency 7 checks ผ่าน; local build 2026-09-08.1225 (9,384 files) + production exclusion ผ่าน; local `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1366` · namespace dev/inputs แยกจาก production และไม่ได้ deploy
- **รอบ 1365 · เปลี่ยนรถ Frontline เป็น GLB 3D น่ารัก:** สร้างใหม่จาก geometry เป็น `tank-cute.glb` แบบ texture-free 129,852 bytes, 3,732 vertices, 5,084 triangles, 13 PBR material primitives; ไม่มี PNG/runtime texture
- รถถังทุกคัน clone โมเดลเดียวและหมุนลื่นตาม hull ครบ 360°; เพิ่มทรงของเล่น หน้ายิ้ม แก้มชมพู ตีนตะขาบ ล้อ ม้วนสัมภาระและดาว พร้อม antialias+sRGB; ลบ WebP 8 ทิศเดิม
- unit 16 + syntax 24 files + Chromium 5 clients/24 checks ผ่าน; GLB magic/size และไม่มี WebP request, page error 0; production exclusion scan ผ่าน
- local preview `http://192.168.1.38:19444/__dev/frontline?room=APPLE&v=1365`; namespace `frontline_v1_dev/<random-session>/rooms/<CODE>`; ไม่ได้ deploy production
- **รอบ 1364 · ปิดบั๊กมือถือยังค้าง Opening landscape battlefield:** ภาพจริงยืนยัน transport realtime ไม่สำเร็จ; บังคับ Firebase HTTP long-poll สำหรับ Android/iPhone และพบ `/.lp` ตอบ 404 เพราะ preview ขาดจุดเรียก HTTP proxy
- เพิ่ม `proxyEmulatorHttp()` ใน request path จริง; mobile ใช้ long-poll ผ่าน `19444`, desktop ใช้ WebSocket ได้, emulator ยัง bind `127.0.0.1:19445`; CSP same-origin และ namespace allowlist เดิม
- LAN smoke 2 mobile clients ผ่าน: 86 long-poll requests, 0 WebSocket, 0 browser request ไป 19445; full mixed Chromium 5 clients/25 checks + unit 16 ผ่าน, page error 0
- preview เปิดที่ `http://192.168.1.38:19444/__dev/frontline?room=APPLE&v=1364`; production exclusion scan ผ่าน และไม่ได้ deploy
- **รอบ 1363 · แก้มือถือค้าง Opening landscape battlefield:** ต้นเหตุคือหน้าเว็บใช้ LAN `19444` แต่ Firebase emulator เปิดอีกพอร์ต `19445` ซึ่งมือถือ/Firewall อาจเข้าไม่ได้ แม้เครื่อง host ทดสอบพอร์ตตัวเองผ่าน
- เพิ่ม `preview-proxy.mjs` เป็น same-origin gateway จำกัดเฉพาะ `/.ws`/`/.lp` และ namespace demo; browser ใช้ HTTP+WebSocket ผ่าน `19444` เท่านั้น ส่วน emulator bind `127.0.0.1:19445`; ปรับ dev gate+CSP เป็น single-port
- LAN smoke 2 mobile clients ห้องเดียวกันผ่าน: 4 seats/2 humans, WebSocket `ws://192.168.1.38:19444/.ws`, request ไป 19445 = 0; full Chromium 5 clients/25 checks + unit 16 ผ่าน
- preview ใหม่เปิดที่ `http://192.168.1.38:19444/__dev/frontline`; production exclusion scan ผ่าน ไม่มี route/menu/test namespace และไม่ได้ deploy
- **รอบ 1362 · Frontline V1 เปลี่ยนเป็นเกมชิงอักษร competitive (dev/test เท่านั้น):** 4 ที่นั่ง+บอทแทนคน, guard กลาง 2 ตัวนอกโควตากดดันผู้นำ, A-Z เกิดวน, ชนรับ/ขน/ฝาก/แย่งอักษร, ป้อมส่วนตัว 5,000 HP, รถ 1,000 HP, ผู้ประกอบคำครบคนแรกได้ 1,000 เหรียญคนเดียวผ่าน economy กลางใน save ทดสอบ
- กระสุนเป็นลูกมี impact explosion/PvP+ทำอักษรตก, ระเบิดเวลา BOMB แบบ Bomberman, สนามเต็มแนวนอนจาก 15 chunk รีไซเคิล, AUTO ซ้ายเหนือ LEFT/RIGHT, ความเร็ว 3 ระดับ, กัน text selection; รถน่ารัก WebP 8 ทิศ โดยแก้ `up-left/up/up-right` เป็นภาพท้ายรถและใช้ hysteresis กันภาพสั่น
- syntax/Rules JSON/no-PNG + unit 16 ผ่าน; Chromium 5 clients ที่ 812×375 ผ่าน 25 checks: cap 4, bot replace, 2 guards, multitouch, movement, chunks, shell/base/bomb, A-Z/APPLE/1,000 coins, host migration, 8 directions และ production request=0
- local build `2026-09-08.1225` 9,384 files + web/PWA/cache/TWA validator + Frontline production-exclusion scan ผ่าน; LAN `http://192.168.1.38:19444/__dev/frontline` เปิดอยู่, namespace `frontline_v1_dev/<random-session>/rooms/<CODE>`; ไม่มี public route/menu และไม่ได้ commit/deploy production
- **รอบ 1361 · แก้ปุ่มเข้า Frontline ผ่านมือถือ LAN:** ต้นเหตุ HTTP ผ่าน IP เป็น non-secure context จึงไม่มี `crypto.randomUUID()`; เปลี่ยนรหัสผู้เล่น/รอบเป็น `crypto.getRandomValues()` ที่รองรับ LAN โดยคง random UUID bits
- ทดสอบ URL `http://192.168.1.38:19444/__dev/frontline` ที่ 390x844 จริงใน Chromium: `isSecureContext=false`, `randomUUID=undefined` แต่กดเข้า/RTDB connected/1 player สำเร็จ, page error=0; unit 12 + syntax ผ่าน · local เท่านั้น ไม่ deploy
- **รอบ 1360 · Frontline 1944 V1 ใหม่จาก current source (dev/test เท่านั้น):** เพิ่ม `tools/frontline-v1/` แบบแยกโมดูล; รถถัง/สนาม procedural, zombie ตัวอักษรเรียงคำ, auto forward/reverse+เลี้ยว+ยิง, ไม่มี PvP/friendly fire
- ใช้ Firebase RTDB emulator `demo-vocab-frontline-v1` / `frontline_v1_dev/<session>/rooms/<CODE>`; บังคับ 4 seats ทั้ง transaction+Rules, host failover/reconnect; `addCoins/saveState` กลางลง test save แยก ไม่มี production write
- unit 11 + Chrome 4 clients/คนที่ 5 ถูกปฏิเสธ/real multi-touch/APPLE+duplicate payout/host exit/reconnect ผ่าน; 812×375 และ 390×844 ไม่ล้น/ปุ่มไม่ชน; build 9,384 ไฟล์ + PWA validator + production exclusion ผ่าน
- ไม่มีภาพ asset ใหม่/ไม่มี legacy code; แก้เฉพาะเอกสาร map/state/handoff นอกโฟลเดอร์ใหม่; ยังไม่ commit/deploy และไม่เปิด COMMIT_DEPLOY ตามคำสั่งห้าม production deploy; วิธี preview/ทดสอบอยู่ README ในโฟลเดอร์ใหม่
- **รอบ 1359 · Home V2 ไม่โชว์ข้อความ/ภาพสัตว์ชั่วคราว:** ถ้ายังไม่มีสัตว์ ซ่อน speech bubble + ชื่อ/สถานะใต้เวที และลบมาสคอต SVG สำรองออกจาก runtime
- ทุกชนิดสัตว์เริ่มจากเวทีว่างระหว่างโหลด ค่อยเผยเฉพาะภาพจริงหลัง `load`; โหลดพลาดกลับเป็นเวทีว่าง ไม่ค้างภาพเก่าหรือ fallback
- syntax + regression Home V2 เดิม/ใหม่ผ่าน; isolated production build `2026-09-08.1224` 9,401 files และ PWA/cache/TWA validator ผ่าน (แยกจาก dirty files รอบ 1357)
- **รอบ 1358 · ทุกเกมเข้าเล่นฟรี:** ตั้ง `WORLD_ENTRY_FEE=0`, ให้ `worldEntryInfo()` คืน free ทุกโหมด และตัดการตรวจ/หัก `state.coins` ออกจาก `startWorldEntry()` แม้ได้รับ fee เก่า; ระบบเหรียญอื่นและ legacy refund คงเดิม
- Lobby/Home V2/ข้อความคืนตั๋วแสดง “ฟรี/ไม่มีการหักเหรียญ”; โบนัสชวนเพื่อน 100 เหรียญยังอยู่แต่เปลี่ยนคำจาก “เงินคืน” เป็น “โบนัส” · แก้ `items/calendar/ui/home-v2/main/online` + `GAME_RULES`
- Regression ค่าเข้าครบ 11 โลก + hostile fee, Home V2, Sky beta/character, syntax/diff ผ่าน; production build 9,384 ไฟล์และ PWA/cache/TWA validator ผ่าน พร้อม audit hashed dist ไม่พบ fee 500/ทางหักเหรียญ
- **รอบ 1357 · ลบโมดูลสนามรบปี 1944 เดิมทั้งชุด (ไม่สร้างใหม่/ไม่ deploy):** ถอด runtime/CSS/route/admin buttons/build aliases+guard, 61 assets, 30 tests, 4 reports และล้าง generated caches/maps
- `state.js` ลบ namespace เก่าจาก local/cloud hydrate + 4 control-position localStorage keys; คง MAIN coins/login/profile/Firebase/launcher/shared games ทุกตัว
- asset/undefined refs + representative game regressions + syntax + isolated build 9,385 files + official PWA validator + Chrome primary/classic login smoke ผ่าน; `worlds3d`/`netroom` เป็น browser harness ไม่ใช่ standalone Node
- ปิดงานโดยไม่ commit/deploy ตามคำสั่งผู้ใช้; ย้าย stale generated `dist` ออกแล้ว canonical build ปกติสำเร็จ 9,384 รายการ + PWA validator และสแกน runtime/assets/routes เก่าเป็นศูนย์
- **รอบ 1356 · แก้ถูกป้ายตอนเข้าโรงแรม + จัดคำเป้าหมายใหม่ตามภาพ:** ต้นเหตุป้ายหายคือทางเข้าเรียก generic `showBanner()` ซึ่ง CSS จางใน 2.4 วินาที ไม่ใช่ป้าย login ที่แก้รอบก่อน
- เปลี่ยนป้ายเข้าโรงแรมเป็น persistent entry hint: หยุดเกม, ไม่มีกากบาท, Escape/คลิกฉากหลังไม่ปิด และเริ่มเล่นต่อเมื่อกด “รับทราบ”; แก้คำแนะนำเก่า 4 คำ/ไม่มี Game Over ให้ตรงกติกา 5 คำ/10 ครั้ง
- ย่อคำเป้าหมายเฉพาะโรงแรมและวางเป็น HUD ด้านบน: 1372×627 = top 62px/238×74, 812×375 = top 94px/170×56; ไม่ชน HP/ปุ่ม/ป้ายภารกิจ/กระดาน/แผนที่และไม่บังกลางฉาก
- special mission + Haunted regressions/syntax/build `2026-09-04.1222`/PWA validator ผ่าน; Chrome visual+DOM QA 2 ขนาดยืนยัน overlap=false, no scroll และป้ายยังอยู่หลัง 8 วินาที+Escape+backdrop ก่อนกดรับทราบ
- **รอบ 1352 · แก้ปุ่มซื้ออาหารไม่เปิดโลก + รถแฟชั่นฟรี:** พิสูจน์ต้นตอว่าเมื่อรถที่เลือกค้างค่างวด `enterPetShopping3D` หยุดก่อน dialog/world จึงดูเหมือนปุ่มไม่ทำงาน
- ทริปอาหาร/แฟชั่นฟรีทั้งหมด; ไม่มีรถหรือรถค้างงวดใช้ `car_01` ของระบบอัตโนมัติโดยไม่เพิ่มคลัง/ไม่หักเหรียญ พร้อมป้าย “กำลังเปิดหน้าขับรถ...” และปุ่มแฟชั่นระบุรถฟรี
- Chrome 812×375 คลิกปุ่มจริงจากหน้าข้อมูลน้องผ่านทั้ง food+รถค้างงวด และ fashion+ไม่มีรถ บน source/hashed dist; โลก/GPS ขึ้น, เหรียญ 43,133→43,133, page error 0
- shopping integration/3D/pantry/bulk, syntax/undefined/template/assets, production build 2026-09-03.1218 และ PWA/cache/TWA validator ผ่าน
- **รอบ 1351 · ทริปซื้ออาหารฟรีและซื้อได้แม้น้องป่วย:** รถระบบไปตลาดอาหารฟรี 0 เหรียญเมื่อไม่มีรถส่วนตัว; ทริปแฟชั่นยังคิดค่าเช่า 500 เหรียญ และ failure copy ยืนยันว่าไม่เสียค่ารถ
- แคตตาล็อกร้านใช้ stock id ที่ `buyFood` รองรับจริงทุกใบ; การป่วยบล็อกเฉพาะการกิน ไม่บล็อกซื้อเข้าชั้น และ route 3D ตรวจถนนตามปลายทาง food/fashion ที่เลือก
- หน้าข้อมูลน้องใช้ตัวอักษรขั้นต่ำ 14px, แผงซ้าย/ขวาเลื่อนแนวตั้งโดยซ่อน scrollbar, ปุ่ม `✕ ปิด` บน 84×44 และล่าง 360×44 คงอยู่ชัดบนจอ 812×375
- pantry/shopping3D/integration/bulk regressions, syntax/undefined/template/assets, Chrome headless ซื้อจริงขณะป่วย และ production build 2026-09-02.1217 + PWA/cache/TWA validator ผ่าน
- **รอบ 1350 · ตัวอักษรแผงให้อาหารอ่านง่าย + เลื่อนซ่อน scrollbar:** ขยายข้อความหัว/สัตว์/อาหาร/ปุ่มจากเดิม 7.5–11px เป็น 11–28px ตาม viewport; เนื้อหากลางเลื่อนแนวตั้งเฉพาะเมื่อพื้นที่ไม่พอ โดยหัวและ footer อยู่คงที่
- เพิ่มปุ่ม `✕ ปิด` ชัดเจนบน–ล่าง รักษา scrollTop และแก้ `tools/ship.sh` ให้รับ y/yes จาก Windows console แม้มี CR แฝง; ไฟล์ UI คือ `js/ui.js`, `css/style.css`, `tools/test_bulk_feeding.js`
- Chrome source QA: 1320×622 ไม่ต้องเลื่อน; 812×375 เลื่อน 141px, scrollbar none, ไม่มีแนวนอนล้น, กล่องอยู่ใน viewport; ปุ่มปิดทั้งคู่และ scroll preservation ผ่าน
- syntax/regression + production build 2026-09-02.1216 (9,386 ไฟล์), source/hashed dist contract และ Bash CR-input regression ผ่าน; recovery deploy ต่อหลัง console ปฏิเสธ y รอบแรก
- **รอบ 1348 · Dragon Sky Siege แตะจอแล้วเพลงดังอัตโนมัติ:** หาก browser บล็อก play แรก การแตะ/คลิกที่ใดก็ได้ในเกมหรือกดคีย์จะ retry ทันที ไม่ต้องแตะปุ่มเพลง; ปุ่มเพลงไม่ถูก gesture handler แย่ง event
- ปุ่มแสดงสามสถานะไม่กำกวม: `🎵 เปิดอยู่` สีเขียว, `🔇 ปิดอยู่` สีแดง, `▶ รอแตะจอ` สีเหลือง พร้อม ARIA/คำอธิบาย; คงขนาดเดิมและ geometry gap เดิม
- เพิ่ม regression จำลอง NotAllowedError→แตะพื้นที่เกม→เล่นสำเร็จ; BGM/Dragon/syntax/diff, built JS/CSS contract และ production build/PWA/cache/TWA ผ่าน (browser audio QA ถูก Windows sandbox บล็อก)
- **รอบ 1347 · Dragon Sky Siege แก้เพลงไม่ดังจริง:** ต้นเหตุอ่าน `state.musicOff` ที่บันทึกค้างและเรียก `Audio.play()` หลังรอภาพจนพ้น user gesture; เปลี่ยนเป็นเปิดเพลงใหม่ทุก session และสั่งเล่นทันทีจากคลิกเข้าเกม
- ปุ่มเพลงควบคุมเฉพาะ Dragon session ไม่แก้ค่า Lobby/SFX; ยังคง Audio เดิม, lazy `preload=metadata`, loop, immutable disk cache และ fade 1.1 วินาทีเมื่อออก
- MP3 ยาว 154.6 วินาที/peak -1.3 dB; BGM+Dragon regression, syntax, production build 9,384 ไฟล์ และ PWA/cache/TWA validator ผ่าน (browser audio QA ถูก Windows sandbox บล็อก)
- **10 ส.ค. 2026 — รอบ 1096 Account deletion ผ่าน production แล้ว:** Rules ใหม่ publish/ตรวจสดตรง source และบัญชีทดสอบ `parkerhulk2020@gmail.com` ถูกลบสำเร็จ; รอ COMMIT_DEPLOY ส่ง client fix ที่ตัดพาธ reaction ว่างขึ้นเว็บ
- **รอบ 1346 · เมนูสัตว์ปลอดภัย + Dragon Sky Siege:** ใช้ `foodSafeForPetMenu` ตัดอาหารคน/`badFor` จากแผงให้อาหารและร้านทุกชนิด; ของอันตรายจากเซฟเก่าเฉื่อยและ `feedWith` ปฏิเสธก่อนหัก stock
- ปุ่ม Lobby เปลี่ยนจาก Letter Cannon เป็น `🐉🔥 Dragon Sky Siege`; Home V2/Classic ใช้ชื่อและสัญลักษณ์มังกรตรงกับเกม
- เพิ่มไอเท็มบินเก็บ `DRAGON BARRAGE` ยิง 5 สาย และ `MISSILE RAIN` เติมจรวด +4/ยิง salvo 3 ลูก; จรวดโบนัสคงอยู่จนใช้และจำกัด 12 ลูก
- pantry/bulk/Dragon regressions + syntax/undefined + production build/PWA ผ่าน; Chrome 812×375 ได้ 9 pets/4 safe foods, harmful cards=0, noScroll+inside=true, stockDelta=7
- **รอบ 1345 · ให้อาหารสัตว์ทุกตัวในคราวเดียว:** เปลี่ยนปุ่มรายตัวเป็นแผงวางแผนรวม เห็นสัตว์ที่เลี้ยงครบ เลือกเมนูรายตัว/จัดปลอดภัยอัตโนมัติ แล้วหัก stock ทั้งชุดแบบ atomic
- อาหาร 18 เมนูใช้ WebP sprite RGBA 1080×540 ไฟล์เดียว 175,920 bytes; ทุกการ์ดบอก `บนชั้น ×จำนวน` และของหมดพาไปเลือกซื้อชั้น/ขับรถซื้อเติม
- ถอดน่องไก่ติดกระดูก: คง stock id `chicken` แต่เปลี่ยนเป็นอกไก่ต้มสุกไร้กระดูก พร้อมข้อความ “กระดูกไก่อาจทิ่มลำไส้สัตว์ได้” ใน data/UI/GAME_RULES
- syntax + pantry/bulk regression + undefined-call + production build/PWA/cache/TWA ผ่าน; Chrome source viewport 812×375 ได้ 9 pets/10 foods, noScroll+inside+sprite=true และคลิกจริง stockDelta=7

- **รอบ 1341 · Home V2 portrait lower HUD:** ย้าย New Word + wallet 7 ใบจากด้านบนลง dock สองแถวเหนือ Bottom Rail เฉพาะจอแนวตั้ง ≤700px; หมุนแนวนอนแล้วคืน DOM เดิมอัตโนมัติ
- จอง shell row แยกให้ dock/Bottom Rail จึงไม่ทับกัน, แถบสถิติยังปัดแนวนอนและเปิดมาเห็น 3 ใบ; บีบ top controls เป็นไอคอนกะทัดรัด
- **แก้ไขรอบ 1342:** รอบ 1341 จับเป้าหมายผิดหน้าจอ จึงย้อน Home V2 lower HUD ออกทั้งหมดและแก้ Dragon Sky Siege (`lc-wordbox` + `lc-stats`) ตามภาพจริง
- ย้ายแผงคำศัพท์/สถานะจาก `top:55/132px` ลง dock ล่างสูง 110px แยก 60px + 46px มี gap 4px; ปุ่มเพลง/เสียง/Missile/พัก/ออกยังอยู่ด้านบน
- ขยับ AUTO FIRE และแถบกระสุนขึ้นเหนือ dock ไม่ให้ UI ทับกัน; เพิ่ม geometry regression และผ่าน `test_letter_cannon`, Home V2 regression, syntax และ production build
- การตรวจภาพผ่าน in-app browser ถูก Windows sandbox ปฏิเสธก่อนเปิดหน้า จึงยังต้องยืนยันภาพบนเครื่องจริงหลัง deploy
- **รอบ 1343 · Dragon Sky Siege HUD auditor hotfix:** ตามคำสั่งล่าสุดคืนเฉพาะคำเป้าหมาย+คำแปล+ช่องตัวอักษรไว้ด้านบน และคงสถานะ 6 ช่องไว้ด้านล่าง
- ต้นเหตุภาพแหว่ง/คำหายคือ inherited grid row ชนกัน + fixed 46/60px พร้อม overflow hidden; เปลี่ยนสถานะเป็น auto height/ไม่ตัด และคำแปลยาวขึ้นบรรทัดได้
- ResizeObserver วัดความสูงสถานะจริงเพื่อยก AUTO FIRE/แถบกระสุนให้พ้นอัตโนมัติ; ยกชั้นเกมเหนือปุ่ม admin แบบ fixed ซึ่งไม่ควรลอยทับเกมอื่น
- `test_letter_cannon`, syntax, Home V2 regression, production build และ source/dist contract ผ่าน; Browser/Computer Use visual QA ยังถูก Windows ACL บล็อก ต้องยืนยันภาพจริงหลัง deploy
- **รอบ 1344 · คืนเพลง Beyond the Stars:** ต้นเหตุ BGM ถูกผูกผิดกับ `state.sound`; ปิดเสียงยิงจึงทำให้ปุ่มขึ้น “เพลง ปิด” และเพลงหยุดทั้งที่ music preference ยังเปิด
- แยก BGM จาก SFX สมบูรณ์, ปุ่ม autoplay-blocked แตะแล้ว retry โดยไม่สลับ preference เป็นปิด; ยัง lazy `preload=metadata`, ใช้ Audio เดิม, loop และ fade/rewind ตอนออก
- production ใช้ content-hash `.a114de51abfe93d1.mp3`, ไม่เข้า SW precache; live Range 0–1023 ตอบ 206/1,024 bytes จาก 3,788,707 พร้อม cache 1 ปี immutable
- BGM regression (รวม SFX-off/retry/no-precache), เกม regression, syntax, build/PWA/cache/TWA validator และ diff ผ่าน


- **รอบ 1340 · ShootWord เพลง Fairgame Fun แบบ lazy Range/cache:** เข้าเกมจึงสร้าง Audio `preload=metadata` เล่นวน มีปุ่มเพลงมุมขวาบนแยกจาก Exit และออกเกมเฟด 1.1 วินาทีก่อน pause+rewind/คืนเพลง Lobby
- ปุ่มเปิด–ปิดสี/ข้อความ/ARIA ชัดและ touch target 42px/34px; Chrome QA source+dist ที่ 1365×610/812×375 ยืนยัน HUD overlap 0, toggle ใช้ Audio/request เดิม และ fade ลดเสียงก่อนหยุด
- build ฉีด hashed URL `Fairgame_Fun.503ec17b85a7e6c3.mp3` โดยไม่ใส่ SW precache; Range test ได้ 206/1,024 bytes จาก 1,833,726 bytes พร้อม immutable disk cache
- แก้ `js/shootword.js`, `tools/build_web.mjs`, เพิ่ม `tools/test_shootword_bgm.js` + เพลง; syntax/ShootWord regressions/production build/PWA/cache/TWA validator ผ่าน
- **รอบ 1339 · โลกฟุตบอล Match-day + Stadium Celebration:** เปลี่ยนท้องฟ้าเมฆ/อัฒจันทร์คนดูเต็มสนาม/ไฟส่อง/ป้าย/สีหญ้า/มุมกล้องให้ใกล้ภาพต้นแบบ โดย runtime ใช้ AVIF จริง 10-bit (sky 27KB + crowd 498KB) ไม่มี PNG ใหม่
- เพลง `sound/football/Stadium_Celebration.mp3` เริ่มหลังแตะลงสนามเท่านั้น วนซ้ำ มีปุ่มเปิด–ปิดชัดเจน และออกโลกเฟด 1.1 วินาทีแล้ว pause+rewind ก่อนคืนเพลง Lobby
- ประหยัดข้อมูลด้วย `preload=metadata` + HTTP Range + hashed immutable URL/disk cache; ทดสอบขอ 1KB ได้ 206/1,024 bytes จาก 4,123,363 bytes และ toggle ใช้ Audio/request เดิม
- Visual QA ด้วยตา source+dist แบบ touch ที่ 1365×610 / 812×375 / 608×283: ภาพได้สัดส่วนต้นแบบ, asset 200/206, HUD overlap 0; soccer regression + syntax/diff + production build/PWA/cache/TWA validator ผ่าน

- **รอบ 1336 · Letter Cannon เพลง + seamless sky:** เพิ่ม Beyond the Stars แบบ lazy stream/loop ใช้ content-hash disk cache ปุ่มเพลงมุมซ้าย และ fade 1.1 วินาทีก่อนคืนเพลง Lobby
- ฉากเกาะลอยฟ้า 3 ภาพ pan/cross-fade A→B→C→A ไม่มีขอบ tile; ทยอยโหลด 1→2→3 หลังเข้าเกม และใช้ AVIF 10-bit 200,441 bytes แทน PNG 5,282,145 bytes (ลด 96.21%)
- แก้ `js/lettercannon.js`, `css/lettercannon.css`, `tools/build_web.mjs` + regression; syntax/เกม/เสียง/geometry/AVIF และ production build/PWA/cache/TWA validator ผ่าน
- **รอบ 1337 · Racing เพลงเริ่มเมื่อ GO:** ตั้งเพลง Racing เป็นเปิดทุกครั้งที่เข้าโลก แต่ระหว่างเลือกรถ/ไฟแดงยัง pause; เริ่มเล่นตรงจังหวะไฟดับและรถปลดล็อกเท่านั้น กรณีจั๊มพ์สตาร์ทรอจนโทษหมด
- ปุ่มเพลงเป็นสถานะเฉพาะ session Racing ไม่เขียนทับ preference เพลง Lobby; lazy metadata, content-hash disk cache และ fade 1.1 วินาทีตอนออกยังคงเดิม
- แก้ `js/f1_3d.js`, `tools/test_f1_race_bgm.js`; F1 regression ทั้งชุด + syntax/diff + production build และ Chrome QA source/dist ยืนยัน wait/red=paused+locked, GO=playing+unlocked
- **รอบ 1338 · Letter Cannon hotfix ฉากหลังเลื่อนลงไม่สั่น:** ต้นตอคือ pan เดิมซูมเพียง 4.5% พร้อม `sin()` แกว่งข้าง และ screen shake ครอบทั้ง canvas จึงเห็นสั่นมากกว่าเลื่อน
- เปลี่ยนเป็นเลื่อนแนวดิ่งลง 28% ต่อ 12 วินาที, cross-fade 2 วินาที และวาดฉากหลังก่อน gameplay shake; แก้ `js/lettercannon.js` + regression ใน `tools/test_letter_cannon.js`
- syntax/Letter Cannon/BGM/diff + production build `.1204` และ PWA/cache/TWA validator ผ่าน; built asset ยืนยันไม่มี horizontal sway และฉากหลังไม่รับ screen shake
- **รอบ 1319 · Home V2 swipe HUD + raised New Word:** รวม เหรียญ/วันนี้/ออนไลน์/จากคอม/มูลค่ารวม/กราฟอันดับ/อันดับ เป็นราง 7 การ์ดที่ปัดซ้ายขวาและ snap ได้ โดยเปิดมาเห็น 3 การ์ดหลักก่อน; route กราฟ/อันดับยังใช้ระบบเดิม
- ยก New Word ไปแทนช่องแถวรองเดิมตาม desktop/compact/จอเตี้ย และขยายปุ่มสัตว์เป็นรางกว้างพร้อม safe area/ตัวอักษรสีขาว contrast สูง; syntax + Home V2 regression + production build + PWA/cache/TWA validator ผ่าน
- **รอบ 1320 · ซ่อนป้ายติดต่อโฆษณาทุกโลก:** ป้ายว่างไม่วาดข้อความและซ่อนทั้งแผ่น/เสา รวมป้ายผนังโลกเฮลิฯ กับป้ายชื่อเชิญบนตึก; ป้ายผู้เช่าหรือภาพผู้สนับสนุนจริงยังแสดงตามเดิม
- แก้ `js/adv3d_tex.js`, `js/adventure3d.js`; syntax + regression 11 เงื่อนไข + production build `.1187` + PWA/cache/TWA validator ผ่าน (ว่าง/เช่า/หมดอายุ/ภาพจริง/ทุกชนิดป้าย)
- **รอบ 1322 · Home V2 ปุ่มยาว + สัตว์ไม่ลอย:** ขยายปุ่มสัตว์บนจอ landscape/มือถือเป็น 236–264px (มือถือ 244px) ให้ข้อความไทยไม่ตกขอบ และลด `bottom` ของภาพสัตว์เหลือ 10%/9% ให้แตะแท่นมากขึ้น
- แก้ `css/home-v2.css`, `index_classic.html`, `tools/test_home_v2_mobile_preview.js`; syntax + Home V2 regression + production build ผ่าน; Browser visual QA ยังถูก Windows ACL บล็อก
- **รอบ 1323 · Home V2 ปุ่มสัตว์ responsive จริง:** ต้นตอคือ device-profile selector เก่าบีบปุ่มกลับเหลือ 104–142px เพราะ specificity สูงกว่า; override ใหม่ชนะครบ desktop/tablet/phone และคง safe copy 76% บนปุ่ม 236–270px
- ข้อความแต่ละชั้นเป็นบรรทัดเดียว พร้อม fit จาก `scrollWidth/getBoundingClientRect` หลัง resize/ชื่อ/จำนวนสัตว์/เว็บฟอนต์เปลี่ยน; syntax + regression 4 profiles ผ่าน, Browser QA ยังถูก Windows ACL บล็อก
- **รอบ 1325 · Home V2 ปุ่มสัตว์สูงและวางแนวเท่ากัน:** ล็อก hitbox ทั้ง 4 ปุ่มให้สูง 100% ของรางและ center บนฐานเดียว ใช้ gap responsive 8–10px พร้อม scroll padding สมมาตร; แยกภาพกรอบเป็น pseudo-layer แล้วชดเชย alpha bounds ของกรอบม่วง/ส้ม/ชมพูให้ขอบที่มองเห็นตรงกัน
- เพิ่ม metrics วัด height/top/bottom/gap spread จาก getBoundingClientRect; R39 regression + JS syntax + diff check ผ่าน และ full production build จาก clean snapshot ผ่านเป็น .1191; Browser visual QA ยังถูก Windows ACL บล็อก
- **รอบ 1330 · ยกเลิกผล/รายงานผิด:** เข้าใจ “รุ่นใหม่” กลับด้านและเปิด GLB เก่ารอบ 898 คืน ทั้งที่รุ่นที่ผู้ใช้อนุมัติคือ VR-X1 faceted รอบ 1210/1216; QA เดิมบังคับสีผ่าน hook จึงไม่ตรวจเส้นทางกดจริง
- **รอบ 1331 · คืน VR-X1 และสีเขียวจริง:** ถอด GLB เก่าออกจาก runtime/build, รถเราใช้ `buildPeerF1Car` รุ่นใหม่, บันทึกสีทันทีเมื่อแตะ swatch และ Garage แสดงรุ่น+สีชัด (`js/f1_3d.js` + build/preflight/regression)
- QA กด UI จริง: เขียว→ยืนยัน→cockpit→มุมรถ ทั้ง source/dist ได้ `stored=green`, cockpit green hashed และ `kind=vrx1-faceted-low-poly`; F1 12 ชุด + build/PWA/assets ผ่าน
- **รอบ 1332 · ถอด cockpit แดงรุ่นเก่าที่ทับสี:** ต้นตอภาพผู้ใช้ตรงกับ `cockpit.webp` fallback เป๊ะ และโหมดประหยัดยังใช้ `cockpit_body.webp`; ย้ายทุกโหมดไปชุด `cockpit_turn_*` WebP ตามสี พร้อมป้าย VR-X1/สีบนสนาม
- QA กดฟ้าจริง source+dist: cockpit/มุมรถเป็นฟ้า, `stored=blue`, hashed blue ถูกต้อง; F1 18/18 + build/PWA/assets ผ่าน และ manifest มีรถสีใหม่ 15/15, cockpit เก่า 0
- **รอบ 1333 · hotfix ล้อ 3D ยักษ์ซ้อน cockpit:** ต้นตอคือชุด `F1_FP_WHEELS` เก่ายังถูกเปิดเฉพาะ Battery Saver จึงไม่ปรากฏในการ QA รอบ 1332 ที่บังคับ Quality; ถอดระบบล้อหน้าซ้อนนี้ออกจาก runtime ทุกโหมดและเพิ่ม regression ห้าม marker กลับมา
- QA กดฟ้าจริงแล้วตรวจภาพด้วยตาก่อน deploy ครบ Source/Dist × Battery/Quality ทั้ง cockpit และมุมรถ: เป็น VR-X1 ฟ้า ไม่มีล้อ/รถรุ่นเก่าซ้อน; F1 18/18 + syntax + build/PWA validator ผ่าน
- **รอบ 1335 · Racing เพลง Velocity Vocabulary แบบ lazy/cache:** เข้าโลก Racing จึงสร้าง `HTMLAudioElement` แบบ `preload=metadata` + loop; build ฉีด URL content hash และไม่ใส่เพลงใน SW precache
- ปุ่ม `🎵 เพลง เปิด` / `🔇 เพลง ปิด` อยู่ใต้เวลาในคอลัมน์ขวา ใช้ preference เพลงเดิม; ออกโลกเฟด 1.1 วินาทีแล้ว pause+rewind ก่อนคืนเพลง Lobby
- Regression เสียง/HUD/F1 + build `.1201` ผ่าน; Chrome QA 1365×610/812×375 ไม่ชน HUD, เปิดซ้ำได้ HTTP 206 จาก disk cache และ fade ลด 0.42→0 ก่อนหยุด
- **รอบ 1334 · ย้ายแถบอันดับเข้ากรอบบน:** เปลี่ยนสมอจากกล่องรอบด้านขวาเป็นช่องระหว่างการ์ดอันดับสดกับกล่องคำศัพท์ พร้อมจำกัดความกว้างตามพื้นที่จริงและ fallback จอแคบ (`js/f1_3d.js`, `tools/test_f1_board_layout.js`)
- Visual QA source/dist ที่ 1322×625 และ 812×375: แถบอยู่ช่องบน ไม่ชนอันดับ/คำศัพท์/เวลา; F1 regression ทั้งชุด + syntax + production build/PWA/assets ผ่าน
- **รอบ 1317 · Home V2 HUD + ตลาดสัตว์:** แถวรอง 4 ช่องสูงเท่าแถวหลัก 56px/49px และ New Word มี safe gap 5/7/6px ตาม desktop/compact/จอเตี้ย; ถอดปุ่มและ route Classic พร้อมจัดเครื่องมือ 6 ปุ่มเต็มกรอบ
- ตลาดต่อท้ายหุ่นยนต์เพิ่มสัตว์ครบ 9 ชนิดจาก `PETS`; ร้านเดิมกับตลาดใช้ `openPetPurchase()` จุดเดียว จึงคงราคา/ห้ามชนิดซ้ำ/ตั้งชื่อ/ยอดขายเดิม
- syntax + ตลาด/สัตว์/Home V2 + production build/validate ผ่าน; Browser visual QA ยังถูก Windows ACL บล็อก (`apply deny-read ACLs`)
## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)

### 🔫 คิวงานปืน/โลกยานแม่/โลกใหม่ที่รออยู่ (ผู้ใช้อนุมัติล่วงหน้าแล้ว ทำได้เลยไม่ต้องถาม)
- **รอบ 1316 · Home V2 HUD + hidden music pause:** จัดแถวรอง 4 ช่องเท่ากันเป็น จากคอม → มูลค่ารวม → กราฟอันดับ → อันดับ; สองปุ่มหลังเรียก `openRankGraph()` / `#btn-rail-rank` เดิม
- เมื่อหน้า hidden พักเพลง Lobby, วิทยุรถ, AudioContext และ duck polling; เมื่อกลับมาคืนเสียงเฉพาะเมื่อผู้ใช้ยังเปิดเพลง/เสียงและไม่ติดเงื่อนไขโลกหรือหน้าสอบ
- syntax + Home V2 + music lifecycle regression + production build ผ่าน; hashed assets มี marker ครบ, Browser runtime ยังถูก Windows ACL บล็อก
- **รอบ 1315 · Dragon Sky Siege enemy/boss loop:** เพิ่มเครื่องบินศัตรู HP จริงสูงสุด 3 ลำ ยิงกระสุนเล็งกลับ; โดนผู้เล่นลดพลังมังกรหนึ่งดวงและยิงทำลายได้
- บอสออกทุก 30 วินาทีของเวลาเล่น ยิงกระจาย 3 นัด มีแถบ HP; เมื่อชนะจะเพิ่มคลื่น/HP บอส เติม Missile หนึ่งลูก และวนบอสถัดไปอีก 30 วินาทีโดยไม่จบภารกิจ
- ใช้ `f1VocabForStudent()` ร่วมกับเกม F1 โดยตรง: 5 ช่วงชั้น × 500 คำตรงระดับ ไม่ทำข้อมูลซ้ำ; สำรับสับใหม่เมื่อครบ 500 และกันคำซ้ำติดขอบชุด
- syntax + Dragon Sky Siege/F1 vocab regression + clean production build/validate ผ่าน; ศัตรูและบอสวาดด้วย Canvas ไม่มี raster asset ใหม่ และแคชจำนวนคำไม่สร้าง pool ซ้ำใน HUD
- **รอบ 1314 · Home V2 Classic left rail:** คืนเฉพาะรางเมนูซ้ายเป็นปุ่มกรมท่าทรงมนแบบ Classic และอ่านไอคอนจริงจาก `.rail-ico` ของปุ่มต้นทาง พร้อม fallback ชุดเดิมครบ 29 ปลายทาง
- คืนป้ายเลื่อน `▲ บนสุด` / `▼ มีอีก` แบบกดได้; Profile, Global Feed, stage, New Vocab และ Bottom Rail ไม่เปลี่ยน
- syntax + Home V2 regression + production build ผ่าน; marker อยู่ทั้ง unhashed/hashed build, Browser runtime ถูก Windows ACL บล็อก
- **รอบ 1313 · New Vocab royal balance:** ยกระดับกรอบเป็น jewel frame สีม่วง–ทองหลายชั้น พร้อมเหรียญอัญมณีซ้ายขวาโดยไม่เพิ่ม animation/asset ใหม่
- แบ่ง badge/คำศัพท์/reward เป็น 3 lane ที่สองข้างกว้างเท่ากัน ทำให้คำศัพท์อยู่กึ่งกลางจริง; มี geometry แยก desktop/landscape จอเตี้ย/≤760px
- syntax + Home V2 regression + production build ผ่าน; Browser runtime ถูก Windows ACL บล็อกจึงยืนยันด้วย geometry contract และ cache/runtime markers
- **รอบ 1312 · Dragon Sky Siege coin feedback:** เปลี่ยน HUD/ผลภารกิจจาก “คะแนน” เป็นเหรียญจริงที่เข้ากระเป๋า และย้ายสถิติรองเป็นจำนวนทำลาย/ยิงพลาด
- เหรียญ +1 และโบนัสจบคำ +50 บินจากเป้าเข้าตัวนับ พร้อมเสียงรับเงินแบบหน่วงไม่ให้เสียงยิงกลบ และการ์ดผลลัพธ์ย้ำยอดเข้า
- ใช้เหรียญ lossless WebP โปร่งใสแทน PNG พร้อม production include; เอฟเฟกต์จำกัดสูงสุด 6 ชิ้นต่อโบนัสเพื่อรักษาความลื่น
- syntax + coin/mission/performance regression + clean production build/validate ผ่าน; compact result รองรับจอเตี้ย 812×375
> ⚖️ **กฎผู้ใช้ (22 ก.ค. 2026):** *ไอเดียต่อยอดใด ๆ ในโลก 3D ให้ไป **เปิด session ใหม่** ทำ ไม่ต้องต่อท้าย session เดิม (คุม token)* · อนุมัติทุกกรณีจนกว่าจะสั่งหยุด · จูนค่าปืนใช้ `tools/gunlab.js` เท่านั้น (ดู TUNE ZONE ใน `js/invasion3d.js`)

- **รอบ 1311 · Home V2 idle thermal guard:** ต้นตอร้อนทันทีคือ Chrome QA เก่าค้างด้วย WARP software renderer; ปิดเฉพาะโปรไฟล์ QA แล้ว และแก้ runtime ไม่ให้ Classic ที่ถูกซ่อนยังทำงาน
- Home V2 ใช้ adaptive timeout 3s/10s และหยุดเมื่อแท็บซ่อน, ตัด forced layout sync, pause/resume วิดีโอ+Lobby3D และลด filter/backdrop บนอุปกรณ์ low-power
- syntax + Home V2 regression + production build/validate ผ่าน; scope css/home-v2.css, js/home-v2.js, js/lobby3d.js, index_classic.html, tools/test_home_v2_mobile_preview.js
- **รอบ 1309 · Home V2 profile/feed polish:** ขอบแผงโปรไฟล์ผูกแนวเดียวกับ Global Feed, ขยายภาพจริงเป็นกรอบสี่เหลี่ยม jewel และบัง halo วงกลมเดิม
- คืนปุ่มใต้สัตว์เป็นการ์ดกว้างแบบ swipe; จัด bottom slice ของกรอบ Global Feed ให้จบตรงฐาน และคืน auto-flow ทีละรายการพร้อมพัก 10 วินาทีเมื่อผู้ใช้เลื่อนเอง
- `node --check`, Home V2 regression และ production build ผ่าน; browser visual QA ติด Windows ACL จึงคง regression geometry/cache/runtime markers ครบ
- **รอบ 1307 · แก้ Dragon Sky Siege ค้าง/ไม่หมุนแนวตั้ง:** ย้าย `resetFrameClock()` ออกจาก scope ของ `queueCloudSave()` หลังรอบ 1306 วางผิดจน `startGame()` เกิด ReferenceError หลังสร้าง HUD
- รีเซ็ต/เริ่ม frame clock จาก timestamp ของ rAF โดยตรงเพื่อกัน WebView คนละ time origin; ขอ fullscreen และลองล็อก `portrait-primary` → `portrait` ทุกอุปกรณ์ที่รองรับโดยไม่ตัดสินจาก coarse pointer
- syntax + regression first-frame/portrait + production build/validate ผ่าน; scope `js/lettercannon.js`, `tools/test_letter_cannon.js`
#### 🔫 งานยานแม่ (จบแล้ว)
1. **ทหารฝ่ายเราตะโกนบอกทิศศัตรู** ✅ รอบ 471
2. **เป้าฝึกยิงในสมรภูมิ** ✅ รอบ 471
3. **โหมดกลางคืน** ✅ รอบ 471 / 474

✅ **รอบ 474 (เวลาเดินเอง + ไฟถนน) ขึ้นเว็บแล้ว deploy `.462`**

#### 🏍️ งานโลกใหม่: ขับมอเตอร์ไซค์/รถยนต์ (30 ก.ค.)
- ✅ ชนหมา = ปรับ 10 เหรียญ ต่อครั้ง — เสร็จรอบ 830

### ### 📌 สรุปสถานะล่าสุด (31 ส.ค.) — อ่านก่อน
- **รอบ 1379 · Kart ขอบถนนจริง + เปิดทุกคน + ป้ายครั้งเดียว:** แก้ corridor ซ้อนที่ทำให้ทะลุกำแพง ใช้ 1,286 segment ชุดเดียววาด/ชน + swept capsule/grid + เผื่อทั้งคัน 2.85 m; 12,404 crossings (4,957 oblique), route raycast 2,025, bounce 146 ผ่าน; ไม่มี portal เฉพาะ Kart
- เปิด Classic/Home V2/solo/NetRoom/rank ให้ผู้เล่นทั่วไป; คง auth/UID validation และ namespace แยก F1; rules สดเผยแพร่แล้วและตรง payload ครบ 44 zones เปลี่ยนเฉพาะ wroom/winfo/kartAccess/kartRank
- ป้ายเชิญชวนใช้ WebP รถเดิม ไม่เพิ่ม asset; UID local+cloud seen marker เมื่อแสดงจริง ข้ามผู้เคยเล่น/รอ dialog/ไม่ขึ้นกลางแข่ง; invitation 24, lobby 13, entry 28, gameplay 29, rules 45+peers 7, F1 19 programs/Home V2/build ผ่าน รวม dist tests
- เผยแพร่/commit/push สำเร็จผ่าน COMMIT_DEPLOY เปิดครั้งเดียว: live **2026-09-09.1232**; ตรวจ hash Kart/icon immutable ตรง HEAD, public Home button, invitation/played marker, portal guards, anonymous RTDB 401 และ browser ไม่มี error; rules สดตรงครบ 44 zones; docs/KART_PREVIEW.md; QA/Rules HTML: Documents/Codex/2026-09-09/new-chat-2/{work,outputs}
- **รอบ 1378 · Kart ถนนโล่ง/ขอบแข็ง/ไอคอนรถ:** ฉากข้างโค้งเดิมทับถนนอีกช่วง; ตรวจ footprint กับทุก track+pit segment และย้ายเกาะประภาคารออกจนพ้นถนน; ซ่อนกองแจ้งเตือน lobby/ปิดทั้งหมดระหว่าง Kart แล้วคืนเมื่อออกโดยไม่ลบข้อความเงิน
- ตัด portal เฉพาะ Kart; ขอบสนามคิดขนาดรถ+sweep≤0.75ม./step สะท้อนแรงชน48%; Racingเดิมยังวาร์ปได้; ปุ่ม Classic/HomeV2 ใช้ภาพรถจริง WebP96×96 alpha10,534B (เล็กกว่าAVIF14,602B), lazy+immutableและผู้เล่นทั่วไปไม่โหลดภาพ
- ผ่าน Three.js raycast2,025ช่วงไม่ชนฉาก/footprintครบ92กลุ่ม, collision146ทั้งสองฝั่ง+ฟิสิกส์เด้งจริง+F1portalเดิม, notification lifecycle2viewport, lobby/icon12 source+dist, gameplay29, F1ทั้ง19+entry17+HomeV2+build9,469files612.9MiB+validator; รายละเอียด `docs/KART_PREVIEW.md` และ `tools/kart/clearance.mjs`
- COMMIT_DEPLOY เปิด1ครั้งสำเร็จ; live **2026-09-09.1231**, source6920bf7c/handoff4156ec06 pushแล้ว; live code+icon200/hashตรง/immutable, menuซ่อนและ5privatepaths401, ไม่มีJSerror

- **รอบ 1377 · Vocab World Kart (admin preview):** แยกเกมจาก Racing ด้วย shared engine/profile; รถของเล่น 5 สี+cockpitจริง, สนามเกาะ/ปาล์ม/ประภาคาร/น้ำตก, 110 กม./ชม.; room/save/ghost/rank แยก F1; รายละเอียด `docs/KART_PREVIEW.md`
- ปุ่มรางซ้าย Classic/Home V2 เฉพาะ verified admin; fresh server admission + RTDB rules คุม kartAccess/wroom/kart/winfo/kart/kartRank และปิด legacy; publish rules สำเร็จและเทียบสดครบ44โซนแล้ว; ไม่มี runtime raster/model/audio ใหม่ ใช้ lazy hashed modules+geometry batching/cache
- ผ่าน entry17/browser29 (5สี, touch, speed109.91, CAT66coins, F1เดิม)/rules45/สองbrowser7/lobby8 source+dist; F1ทั้ง19+HomeV2+build9,467files612.9MiB+validatorผ่าน; COMMIT_DEPLOY เปิด1ครั้งและผู้ใช้เห็น[SUCCESS]; Hosting live **2026-09-09.1230**, source48636383/handoffafde5e43 pushแล้ว; rulesสดตรงครบ44โซน; live匿名5paths401/menuซ่อน/hashedassets200+immutable/noJSerror

- **รอบ 1329 · ด่านซื้ออาหาร/แฟชั่นไม่มีค่าปรับ:** ถอดการสะสม/หักเหรียญจากไม่คาดเข็มขัด ขับเกิน 90 และชนทั้งหมด; ยังคงไฟเตือน เสียง/แรงเด้ง และป้ายย้ำว่าไม่เสียค่าปรับ
### 🔒 สีธีมล็อบบี้ถูกล็อกแล้ว (4 ส.ค. 2026 · รอบ 1002) — อ่านก่อนแตะสี/ธีม/พาเลตต์ใด ๆ
- ค่า navy ที่ล็อก: `--navy:#0a1f3c` · `--navy-2:#123a6b` · `--glass:rgba(7,25,52,.78)` · gradient `rgba(5,22,48,.58/.14/.20/.72)`; ค่าเริ่มต้นห้าม override/ห้าม veil/ห้ามเปลี่ยนความสว่าง
- งานสีในอนาคตเปลี่ยนเฉพาะปุ่ม/ป้าย/แถบโดยทับสีตรงเท่านั้น; รายละเอียดคำสั่งผู้ใช้ บทเรียน และประวัติรอบ 993–1002 อยู่ `handoff/archive/TASKS_THEME_LOCK_AND_ROUNDS_993_1002.md`

### รอบ 640 — รายละเอียดระบบหลายสนาม (multiplayer โลก 3D)
📦 ย้ายเข้า archive แล้ว (รอบ 781 — สเปกยาว 40KB กินครึ่งไฟล์ ทำให้ทุก session บูตแพงโดยเปล่าประโยชน์)
**Grep** `รอบ 640` หรือ `รอบ 641` ใน `handoff/archive/TASKS_ROUNDS.md` ก่อนแตะ multiplayer/หลายสนาม/ระบบ `/winfo`

### 🔒 ค่าปืนถูกล็อกแล้ว (22 ก.ค. 2026 · รอบ 498) — อ่านก่อนแตะอะไรเกี่ยวกับปืน
ผู้ใช้ตรวจแล้วบอก "สมบูรณ์แบบ" และ **สั่งล็อกพิกัดปืนทั้ง 2 กระบอก**:
| กระบอก | ท่าถือ (GUN_VIEW) | จุดเล็ง |
|---|---|---|
| rifle | `{p:[0.313,−0.330,−0.707], r:[−0.254,0.139,−0.058], s:1.014}` | `AIM_OFF [0,−0.46]` = 50%,73% |
| r93 | `{p:[0.256,−0.118,−0.971], r:[−0.562,−0.124,0.002], s:1.485}` | `AIM_BY_GUN.r93 [−0.016,−0.018]` = 49.2%,50.9% |
⛔ **ห้ามแก้เอง** ไม่ว่าจะเพื่อจัดภาพ/ปรับ ADS/เพิ่มปืนใหม่/refactor — แก้ได้เฉพาะผู้ใช้สั่งตรง ๆ ในรอบนั้น
⛔ ปืนใหม่ → **เพิ่ม key ใหม่** ใน `GUN_VIEW` / `AIM_BY_GUN` ห้ามยืมหรือขยับค่าของ 2 กระบอกนี้ · กล่อง 🔒 LOCKED อยู่เหนือ `GUN_VIEW` ใน `js/invasion3d.js`

### 🆕 คิวไอเดียต่อยอด — ให้เปิด **session ใหม่** ทำ (ผู้ใช้อนุมัติล่วงหน้าแล้ว)
> ทำได้เลยไม่ต้องถาม · ห้ามแตะค่าปืนที่ล็อกไว้ด้านบน
1. ~~ท่าเล็ง ADS แยกตามกระบอก~~ ✅ **ทำแล้วรอบ 499** (`ADS_BY_GUN` · deploy `.488`)
2. ~~มือจับปืน (แก้อาการ "ปืนลอย")~~ ✅ **ทำแล้วรอบ 501 ด้วย weapon sway/bob** (`SWAY`+`tickSway()` · deploy `.490`) — *ยังไม่ได้แปะมือจริงจาก `SOLDIER_PARTS`* (ผู้ใช้สั่งรอบ 438 ว่ามุมมองที่ 1 ไม่โชว์มือ · `gunArms` มีอยู่แล้วแต่ `visible=false`) → ถ้าจะทำมือต้องขอผู้ใช้ยืนยันก่อน
3. ~~แรงสะบัดตอนยิงให้สมขนาดปืนใหม่ (recoil)~~ ✅ **ทำแล้วรอบ 500** (`REC_BY_GUN` · deploy `.489`)
4. ~~`GunLab.snapAim()` + preset ท่าถือ~~ ✅ **ทำแล้วรอบ 502** (`tools/gunlab.js` · ไม่ต้อง deploy)
5. ~~`GunLab.diff('a','b')`~~ ✅ **ทำแล้วรอบ 516** (`tools/gunlab.js` · ไม่ต้อง deploy)
6. ~~`GunLab.snapAim({fit:true})`~~ ✅ **ทำแล้วรอบ 516**
7. ~~`GunLab.saveProfile/loadProfile`~~ ✅ **ทำแล้วรอบ 516** (+`profiles`/`delProfile`)

### 🪓 คิวผ่าไฟล์ adventure3d.js (ผู้ใช้อนุมัติทั้งแผน รอบ 544 · เปิด session ใหม่ทีละเฟส)
> ทำไม: ไฟล์ชนเกณฑ์ 12,000 บรรทัด (กฎทองข้อ 2) · ไฟล์เป็น IIFE closure เดียว → **ผ่าตามโซนตรง ๆ ไม่ได้** ใช้วิธี "ดูดก้อน data/จบในตัว" ออกเป็นไฟล์ข้าง ๆ แทน (ไม่มี build step)
> วิธีเดียวกับเฟส 1: เขียนสคริปต์ python ตัดบรรทัด (**ห้าม Read ก้อนใหญ่ผ่าน token**) · ไฟล์ part โหลดผ่าน `loadAdv3d()` ใน `js/ui.js` (เพิ่มบรรทัด await ก่อนไฟล์หลัก) + เพิ่มชื่อไฟล์ใน `sw.js` precache · เทสต์: node --check + preview เข้าโลก + เทียบผลลัพธ์เก่า/ใหม่ต้องเป๊ะ + console สะอาด → `finish_round.sh --sw`
> ⚠️ เลขบรรทัดโซนเลื่อนทุกเฟส — Grep banner โซนใน CODE_MAP ที่ rotate เจนใหม่แล้วเสมอ อย่าใช้เลขเก่า
1. ~~เฟส 2: data การ์ดวิธีเล่น (`INTRO`) → `js/adv3d_intro.js`~~ ✅ **ทำแล้วรอบ 545** (ก้อนจริง 66 บรรทัด ไม่ใช่ 350-450 ตามที่แผนเดา — ที่เหลือในโซน ❓ เป็น logic `showIntro`/`start()` ผ่าไม่ได้)
2. ~~เฟส 3: โซน Texture → `js/adv3d_tex.js`~~ ✅ **ทำแล้วรอบ 546** (ย้ายได้จริง ~212 บรรทัด — logic โฆษณา DB adsFetch/adShop/flyby พัวพัน closure ทิ้งไว้ไฟล์หลัก · ตัวข้ามฝั่ง inject ผ่าน `Adv3dTex.bind`)
3. ~~เฟส 4 (sfx)~~ ⛔ **ตรวจแล้วรอบ 547 — ไม่ผ่า (พัวพัน closure เกินเกณฑ์ ตามเงื่อนไขในแผนเอง)** — รายละเอียดใน `### รอบ 547` ด้านล่าง · คิวผ่าไฟล์จบแค่นี้ (ไฟล์เหลือ 10,694 พ้นเกณฑ์ 12,000 แล้วตั้งแต่เฟส 1-3)
📋 **Prompt พร้อมใช้ (วางในแชทใหม่ เปลี่ยนเลขเฟส):** `ทำเฟส 2 ของคิวผ่าไฟล์ adventure3d.js ตามแผนหัวข้อ "🪓 คิวผ่าไฟล์" ใน handoff/TASKS.md (โปรเจกต์ english-pet-game)`

## ⚠️ ค้างฝั่งผู้ใช้ (ทดสอบจริง — rules publish ครบแล้ว 8 ก.ค. ✅)
1. **ทดสอบจริง 2 บัญชี/2 เครื่องบน Pages:** ส่ง-รับของขวัญเต็มวง (ค้างตั้งแต่รอบ 28) + แชท + self-heal เพื่อน · **โลก 3D:** เห็นตัวกันใน map · แชทลอยหัว+quick chat · คำชวน+เงินคืน 2,000 · voice จริง (ไมค์-ลำโพง-โหมดเพื่อน-ระยะเสียง) · ครูปิดเสียงห้อง (บัญชีครู freddommun@gmail.com) · พิธีแชมป์ 🏁 โบนัสเข้า 2 ฝั่ง
2. ~~เจนเสียงหลอนจาก Suno~~ ✅ **เสร็จรอบ 112 (10 ก.ค.)** — haunt 3 ไฟล์ + spark ขึ้น live แล้ว (version .103) · เหลือเสียงที่ยังไม่เจน (ถ้าต้องการ): `drone_loop.mp3` + เฮลิฯ 3 ไฟล์

## 📌 ประวัติรอบล่าสุด (เก่ากว่านี้อยู่ `handoff/HISTORY.md`)

ประวัติรอบเก่าทั้งหมดถูกย้ายไป `handoff/archive/TASKS_ROUNDS.md` และ `handoff/HISTORY.md` — ค้นด้วย Grep `รอบ <เลข>`
## รอบ 954 (ป้องกันแคชรูป collectibles + gifts)

**บั๊ก:** Firebase Hosting cache 7 วัน + sw.js cache-first ทำให้ player เห็นรูปเก่า เหมือนบั๊กเหรียญรอบ 953 แต่ collectibles/gifts ยังไม่มี query string

**ตรวจสอบ:** 
- Grep ประวัติ TASKS_ROUNDS → เจออย่าง collectibles/gifts (รอบ 500) "ตัดรูปใหม่: 85MB+83MB → 19MB"
- Grep โค้ด → img/collectibles + img/gifts ไม่มี query string (เหมือน badge เก่า)

**แก้:**
- เพิ่ม COLLECTIBLES_IMG_V=954 + GIFTS_IMG_V=954 ใน js/images.js
- แก้ probeImages() รับ version parameter (ต่อท้าย path ถ้ามี)
- แก้ probeCollectImages() + probeGiftImages() ส่ง version
- Bump CACHE_VERSION v231 → v232 ใน sw.js (trigger ล้างแคช)
- ไม่แก้ img/home/ (ไม่เจอประวัติ "เคยเปลี่ยนไฟล์")

**commit:** 25132dd

## รอบ 1301 — Dragon Sky Siege

- เปลี่ยน Letter Cannon จากป้อมยึดฐานเป็นมังกรติดปืนที่บินอิสระ 8 ทิศในสนามแนวตั้ง 9:16; มือถือลากนิ้วและขอ portrait/fullscreen เฉพาะเกมนี้ คอมใช้ WASD/ลูกศร
- เพิ่มสไปรต์มังกรพื้นหลังโปร่งที่เจนใหม่ พร้อมแยกชั้นหางให้แกว่งตามเวลา/ความเร็ว; ฉากหลังเป็นสมรภูมิเลื่อนหลายชั้น มีเกาะ เมฆ และเครื่องบินไกลแบบ procedural
- เพิ่มหัวใจ 10 ดวง, กระสุน TRACER/HEAVY/PIERCER ที่มีภาพหัวกระสุนโลหะและเสียง noise transient, Missile ล็อกเป้า 3 ลูก (+1 เมื่อครบคำ) พร้อมรัศมีระเบิด
- QA ผ่าน: `node tools/test_letter_cannon.js`, `node --check js/lettercannon.js`, production build `2026-08-30.1171`; hash สไปรต์ source/dist ตรงกัน

## รอบ 1303 — กฎเหล็กภาพเบา + WebP lossless

- บันทึกกฎถาวรใน Global AGENTS.md: ห้าม PNG เป็น final/runtime โดยปริยาย; ใช้ SVG/AVIF/WebP ตามประเภท และต้องตรวจ codec, dimensions, alpha, visual quality และ bytes
- แปลงมังกรจาก PNG 1,269,791 bytes เป็น WebP lossless 958,794 bytes (ลด 24.49%) โดย RGBA/alpha ตรงกันทุกพิกเซล; ลบ PNG runtime และเปลี่ยน code/build/docs/test เป็น .webp
- QA ผ่าน: VP8L 1254×1254 มี alpha, regression ผ่าน, production build 2026-08-30.1173, source/dist SHA-256 ตรงกัน ABAB132E...09B4, ไม่มี PNG ทั้ง source/dist
