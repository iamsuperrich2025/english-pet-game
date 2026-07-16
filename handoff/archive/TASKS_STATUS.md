# archive (ย้ายอัตโนมัติโดย tools/rotate_handoff.py — ค้นด้วย Grep เท่านั้น ห้ามอ่านทั้งไฟล์)


## ⏬ ย้ายเมื่อ 2026-07-16 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 240:** ตัดแถว "🦸 ตัวละครของหนู ชาย/หญิง" ในตั้งค่าทิ้ง → ใช้ **"ตัวละครในล็อบบี้" (blk1..8 · `state.blockAv`) เป็นรูปโปรไฟล์หลัก** ทุกที่ (`playerAvatarHTML` คืนภาพ blk เสมอ) · แถว blk เปลี่ยน label เป็น "🦸 ตัวละครของหนู · เป็นรูปโปรไฟล์ด้วย" · quiz cheer avatar โชว์เสมอ · registration ยังตั้ง `playerAvatar` male/female เป็น seed default (male→blk1 · female→blk6)


## ⏬ ย้ายเมื่อ 2026-07-16 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 241:** 🎨 ธีมแชท "ร่วมกันทั้งคู่" — ใครเปลี่ยนธีม อีกฝ่ายเห็นเปลี่ยนตามผ่าน DB (เดิมจำแยกในเครื่อง) · โซนใหม่ `/chattheme/<pairId>` = themeId (string) · online.js `chatSetTheme`/`chatWatchTheme` · ui.js openChat: `applyTheme(th,fromRemote)` + watcher (fromRemote ไม่เขียนซ้ำ กัน echo) · unsubscribe ใน close() · **⚠️ ต้อง publish rules (Artifact) ก่อน sync ข้ามเครื่องถึงทำงาน** — ยังไม่ publish = ตกไปใช้ธีมในเครื่องเดิม · ยืนยัน browser (stub Online): local pick เขียน DB + box เปลี่ยน · remote change → box ตามทันที · ไม่มี echo loop · close ปลด watcher · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-16 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 242:** 🐛 fix รูปตัวละคร (blk1-8) ในตั้งค่า "ตัวละครของหนู" **ยุบเหลือกว้าง 0px** (เห็นเป็นวงม่วงเปล่า) · ต้นตอ: `.blk-mini img{width:100%}` ใน `.blk-grid{repeat(4,1fr)}` ที่ซ้อนใน flex → % คำนวณไม่ได้ยุบเป็น 0 · แก้ css: คอลัมน์ `repeat(4,52px)` (กว้างคงที่) + img `width:auto;height:46px` (ห้ามใช้ %) · ยืนยัน browser จริง (CSS ไฟล์จริง): รูปครบ 8 (31×46) · 4คอลัมน์×2แถว · ไม่มี error · **หมายเหตุ:** ผู้ใช้เห็นแถวชาย/หญิงเดิม+วงเปล่า = แคชเก่า (รอบ 240-241 ขึ้น live แล้ว) รีเฟรชรับ SW v27 จะหาย


## ⏬ ย้ายเมื่อ 2026-07-16 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 243:** 🦸 กริดเลือกตัวละครในตั้งค่า = **เต็มความกว้างทั้ง 2 คอลัมน์** (4 บน/4 ล่าง) รูปใหญ่ขึ้น ~2 เท่า (46px→96px) · css lobby.css: `.settings-box .set-blk-row{grid-column:1/-1;display:block}` + `.blk-grid{repeat(4,1fr)}` + img `width:auto;height:clamp(96px,17vh,150px);aspect-ratio:341/512` (aspect-ratio จองที่กันยุบ 0px ก่อนรูปโหลด) · ยืนยัน 900×560 + 812×375: เต็มกว้าง · รูปครบ 8 (64×96) · 4×2 · ไม่ล้นกรอบ · box อยู่ในจอ · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 244:** 🔎 Word Search — (1) **เอากล่อง "เพื่อนออนไลน์" ออก** (ลบ HTML/JS: ws-friends-head, #ws-friends, renderFriends, friendTimer, handler เชิญ + CSS .ws-fr*) (2) **คำศัพท์เต็มแผงเรียบร้อย** — `#ws-words` เดิมโดน `max-height:clamp(52px,17%,108px)` (บีบเพื่อเปิดที่ให้กล่องเพื่อน) เลยดูพัง → เปลี่ยนเป็น `flex:1 1 auto` กินเต็มแผง · ตัวใหญ่ขึ้น 13.5→15px · 2 คอลัมน์ · ยืนยัน browser (โหลดสด port ใหม่): เพื่อนหาย · 7 คำมีข้อความครบ (ไม่ว่าง) · 2คอล×4แถว · เต็มแผง 458/509px ไม่ต้องเลื่อน · จอเตี้ย 812×375 ก็ครบ · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 245:** 🐾 หน้าข้อมูลน้อง (`openPetInfoOverlay`) — **คอลัมน์ซ้าย = รูปน้องตัวใหญ่เต็มคอลัมน์ · ตัวหนังสือทั้งหมดย้ายไปคอลัมน์ขวา** (รวมกับการดูแล) · ui.js: แยก `infoText` (ชื่อ/lv/exp/ความสามารถ/ร่างยักษ์+ปุ่มขยาย) ออกจาก `info` → ยัดเข้า `care` · `info` เหลือแค่ title+รูป · เพิ่มคลาส `pi-plate-img` · lobby.css: `.pi-plate-img{flex column}` + รูป `flex:1;max-height:none;max-width:100%` (เต็มคอลัมน์) · ยืนยัน browser (mock dragon adult): รูป 409px เต็มคอลัมน์ (เดิม cap 260) · text อยู่ขวาครบ · ปุ่มขยาย/rename/feed ยังผูก (bindPetPlateButtons scope ov) · จอเตี้ย 812×375 box อยู่ในจอ ขวา scroll · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 246:** ❌ หน้าข้อมูลน้อง — เพิ่มปุ่มปิดมุมบนซ้ายสุด (คู่กับมุมบนขวาเดิม) · ui.js: เพิ่มปุ่ม `.pi-close-left` + bind ทุก `.pi-close` (querySelectorAll) · lobby.css: `.pi-close-left{left:6px;right:auto}` · ยืนยัน browser: 2 ปุ่ม · ซ้ายมุมบนซ้าย(L2 T2) ขวามุมบนขวา · ทั้งคู่กดปิดได้ · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 247:** ❌ ปุ่มปิดหน้าข้อมูลน้อง **เด่นชัดขึ้น** — ผู้ใช้บอก "ไม่เห็นปุ่ม" เพราะ `.pi-close` เดิม bg `rgba(255,255,255,.25)` จางมากบนแผงเข้ม → เปลี่ยนเป็น **วงกลมแดง กากบาทขาว ขอบขาว** (34px z6) ทั้ง 2 มุม (ซ้าย+ขวา) · ยืนยัน browser (ปิด consent-gate): 2 ปุ่มอยู่มุม 8,8 · 34×34 · แดง · อยู่บนสุดคลิกได้ · **หมายเหตุ debug:** ในเทสต์ `#consent-gate` (z100000) บังทั้งจอ = artifact เฉพาะตอนยังไม่กดยอมรับ ไม่ใช่บั๊ก


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 248:** ❌ ปุ่มปิดหน้าข้อมูลน้อง **เหลืออันเดียวมุมซ้ายบน** (เอาปุ่มมุมขวาบนออก — บังข้อความในคอลัมน์ขวา) · ui.js: ลบปุ่ม `.pi-close` ตัวขวา เหลือ `.pi-close-left` · ยืนยัน browser: ปุ่มปิด 1 อัน (ซ้าย) · กดปิดได้ · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 249:** 🐾 ล็อบบี้ — **แก้หมา moonwalk + ให้มังกรเคลื่อนที่เหมือนแมว** · ต้นตอ moonwalk: สไปรต์หมาอบมาหัน**ขวา** (ตรงข้ามแมว/มังกรที่หันซ้าย = ค่ามาตรฐานที่ `petRoam` สมมติ) → เพิ่ม `flip:true` ใน `PET_ANIM.dog` (ui.js) + petAnimHTML ใส่ `transform:scaleX(-1)` ที่ `.pet-anim` เมื่อ flip → parent×child scaleX ทำให้หันตรงทิศเดิน · มังกร: `roam:false→true` (ลอยเคลื่อนที่+เลี้ยวขอบ) · ⚠️ คลิปมังกรยังเป็น **idle** (ไม่มีท่าเดินขา) → ดูเป็น "ลอย/บินเลื่อน" ถ้าอยากได้ขาเดินจริงต้องอบคลิป Walk ใหม่จาก Tripo (โมเดล `pet_dragon.glb` มีคลิปเดียว) · ยืนยัน `tools/anim_preview.html` (3 ตัว · lobby.css จริง): dog มี scaleX(-1) · ทั้งสาม petRoam+petWalk ทำงาน · ที่จังหวะเดินขวา net-orientation หันขวาตรงทิศ · ⚠️ ผู้ใช้ยืนยันภาพในล็อบบี้จริงเอง (ล็อกอิน Google)


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 250:** 💰 **ระบบ Handoff Lean ประหยัด token** (docs/tools/comment เท่านั้น ไม่แตะ logic เกม ไม่ deploy) — บูตเดิมกิน >100K tokens (HANDOFF 190KB+TASKS 540KB) → `tools/rotate_handoff.py` ย้ายรอบเก่าเข้า `handoff/archive/` อัตโนมัติ (verbatim+สำรอง `backups/handoff_rotate/`) · สถานะรอบเขียน**ที่เดียว**ในไฟล์นี้ (HANDOFF เหลือ pointer) · กฎทอง #8 + skill `vocab-world` (~/.claude/skills) · `tools/gen_code_map.py` เจน `handoff/CODE_MAP.md` (ฟังก์ชัน js + CSS selector `:บรรทัด` — บั๊ก UI เริ่มหา selector ที่นี่) + บล็อก AUTO-FILES ใน ARCHITECTURE.md (จาก comment หัวไฟล์ · เขียน header css 2 ไฟล์ใหม่ให้บอกโซน) · deploy_firebase.sh รัน rotate ให้เองทุกครั้ง + เตือนบรรทัดยาว >1,000 ตัวอักษร · ⚠️ comment css ติดไปกับ deploy รอบถัดไป (ไม่มีผลหน้าตา)
