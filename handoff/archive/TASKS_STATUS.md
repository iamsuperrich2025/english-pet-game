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


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 251:** 🏭 **โรงงานซื้อด้วยเหรียญได้เลย** (ผู้ใช้สั่ง 16 ก.ค.) — การ์ดแคตตาล็อก: เหรียญพอ=ปุ่มทอง "🪙X ซื้อเลย" (`buyCollectible` ui.js: askConfirm→หักเหรียญ→เข้า `state.collection`→`showCollectReveal(id,price,false)` · ไม่บวก producedCount/เควสต์ผลิต) · เหรียญไม่พอค่อยโชว์ปุ่มเขียว "🎮 ไปเล่นเกมเก็บแต้มผลิต" (= `startProduce(id,true)` เริ่มผลิตแล้วเด้งเข้าเกมทันที) · การ์ดที่ผลิตอยู่ยังโชว์ ⏳ · CSS `.craft-buy`/`.hq-play` ใน lobby.css · ยืนยัน browser (mock login): coins 0→ปุ่มเกมทุกใบ · 1000→2 ใบแรกซื้อได้ · ซื้อจริงหัก 500+เข้าคลัง+ฉากฉลอง · กดปุ่มเกม→producing ตั้ง+เข้า screen-game · ไม่มี console error · ปุ่มไม่ล้นการ์ด (rect)


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 252:** 👥 **การ์ดผู้เล่น: แยกปุ่ม "Unfollow เลิกติดตาม"** (ผู้ใช้สั่ง 16 ก.ค. — เดิมซ่อนในปุ่มเดียว คนไม่กล้าคลิกมั่วเลยหาไม่เจอ) — ปุ่มแดง 2 บรรทัด อังกฤษ+คำแปลไทย วาง**หน้า**ปุ่มสถานะ "✓ ติดตามแล้ว" · ui.js `showPlayerCard`: เพิ่ม `.pl-unfollow` (โชว์เฉพาะตอนติดตามอยู่) · กดปุ่มสถานะขณะติดตาม = toast แนะให้กดปุ่มแดง ไม่ unfollow เงียบๆ แล้ว · CSS `.pl-unfollow` lobby.css · ยืนยัน browser (stub follow): ยังไม่ติดตาม→ปุ่มเดียว · ติดตาม→ปุ่มแดงโผล่ซ้ายของสถานะ (rect) · กดแดง→เลิก+ซ่อน · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 253:** 🎟️ **แต้มส่วนลดโรงงาน** (ต่อยอดรอบ 251 ผู้ใช้อนุมัติ) — ตอบคำศัพท์ถูกสะสม `state.wordCredit` (บวกใน `addCraft` state.js ก่อนเช็ก producing → ได้ทั้งเกมจับคู่+ข้อสอบ แม้ไม่ตั้งงานผลิต · เพดาน 9,999) · ใช้เป็นส่วนลดซื้อ: 1 แต้ม=🪙1 สูงสุดครึ่งราคา/ชิ้น ใช้แล้วหมดไป (`craftDiscount` ui.js · `buyCollectible` คิดใหม่ตอนยืนยัน) · UI: ชิป `.craft-credit` ในแผงโรงงาน + ปุ่มซื้อโชว์ `<s>ราคาเต็ม</s> ลด 🎟️X` + กล่องยืนยันแจกแจง + toast แต้มคงเหลือ · ยืนยัน browser: แต้ม150→500 จ่าย350 หัก coins/credit ถูก · เพดาน: แต้ม5000→500 ลดแค่250 · addCraft ไม่ผลิต→credit+ คืน null · ผลิตอยู่→progress+credit เดินคู่ · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 254:** 🪪📖 **หัวจอใหม่ + Dictionary** (ผู้ใช้สั่ง 6 ข้อ 16 ก.ค.) — (1) คลิกเหรียญแรงค์ใหญ่กลางเวที=เปิด panel-rank (ผูกที่ `.stage-hero` กรอง target pet/ปุ่ม) (2) ถอด `#rank-mini` (index/lobby.js/renderRankCard) ชื่อ+เวลาเลื่อนไปแทน · alignPetTabs ยึด `.profile-plate` แทน (3) `alignCureBtn` ดัน margin-top ปุ่ม 💊 ให้แนวบนตรง `#btn-pet-info` (เรียกใน renderDashboard+resize) (4) มุมซ้ายบน `#pass-photo` รูป blk ครึ่งตัวสไตล์ passport (img 170% โชว์ครึ่งบนพอดี · `lobbyBlk()`) (5) กล่องค้นหา `#dict-input` ในแถว pet-tabs ถัด ➕ (แถวโชว์เสมอเมื่อ state.student) (6) แผงผล `openDictOverlay` 1 คำ=5 บรรทัด (หัวคำ+ชนิด+IPA+คำอ่าน+🔊 / นิยาม / แปล / ตัวอย่าง / แปลตัวอย่าง) · โหลดขี้เกียจ dict_001-057 ครั้งแรกที่ค้น + เรียง a-z + ค้นคำไทยได้ · **ซ่อม `dict_046.js` ถูกตัดกลางบรรทัด (เจนไม่จบ)** — ปิด array แล้ว ⚠️ ช่วงคำ special→subject ยังขาด รอเจนเติม · **commit `js/data/dict/` ทั้งโฟลเดอร์แล้ว (เดิม untracked — ไม่ commit ไม่ขึ้นเว็บ)** · ยืนยัน browser: photo crop 50% พอดี · cure/info top 171=171 · คลิกเวที→แรงค์ คลิกน้อง→ข้อมูลน้อง · "cat"เจอ 15 (5 บรรทัดตรงสเปก) · "แมว"เจอ cat · จอเตี้ย 812×375 กล่องอยู่ในจอ · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 255:** 🌍🪪 **โลก 3D ไม่มีตาย/เกมโอเวอร์ + การ์ดผู้เล่นโชว์ blk เต็มตัว** (ผู้ใช้สั่ง 17 ก.ค.) — (1) `knockedOut` = ฟื้น hp เต็ม+banner เล่นต่อ (ไม่ตัดจบ/ไม่จ่ายค่ารักษา) · `caught` โลกผี = jump scare เต็มจอเหมือนเดิมแล้ว**ฟื้นหัวใจ 3 ดวง + ผี respawn ไกล** เล่นต่อ · เลิก `state.advHurt` (ไม่ set แล้ว + migration state.js ล้าง flag ค้างเซฟเก่า + ปลด gate เข้าโลก adventure3d.js) · แก้ intro/goal/banner โลกผีตามกติกาใหม่ · **ค่าปรับจราจรโลกขับรถคงเดิม** (คนละระบบ ไม่แตะ) · คำศัพท์เติมเองอยู่แล้ว (completeWord +1 · wordPool หมด→ล้าง doneKey วนใหม่ สเปก 8.6 เดิม) · ยืนยัน browser (Adventure3D._t): adv damagePlayer(999)→hp กลับ 100 running ต่อ ไม่มี KO · haunt caught→scare→❤️❤️❤️ ผี 7 ตัวย้ายไกล เล่นต่อ · advHurt=false ตลอด (2) การ์ดผู้เล่น: `ba` (blk ที่เลือก) ใน `/leaderboard` (onlinePushScore ส่ง + fallback ถอย 2 ขั้นถ้า rules เก่า · fetchPlayerStats อ่าน+me) → `.pl-blk` รูปเต็มตัว 140-220px ใต้ชื่อ (showPlayerCard ui.js · lobby.css) · **⚠️ รอ publish rules (Artifact: https://claude.ai/code/artifact/107ef295-bb7f-4bb1-a381-82b24ab80184 · RULES.md อัปเดตแล้ว)** — ยังไม่ publish การ์ดคนอื่นไม่มีรูป (ของตัวเองเห็นเลย) · ยืนยัน browser: การ์ดตัวเอง blk1 · stub เพื่อน blk3 ใต้ชื่อ · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 256:** ⏱👻 **สถิติ "หนีผีรอดนานสุด"** (ไอเดียต่อยอดรอบ 255 ผู้ใช้อนุมัติ) — จับเวลารอดต่อเนื่องในโลกผี (`hauntRunStart` adventure3d.js · เริ่มตอนเข้าโลก/ฟื้นหลังโดนจับ · จบตอนโดนจับ/ออกโลก = `hauntSurviveFinish` เก็บ `state.hauntSurviveBest` วินาที) · HUD `#adv-survive` ใต้หัวใจ "⏱ รอด X · 🏆 best" (อัปเดตใน tickGhosts) · แซงสถิติเดิมกลางเกม = banner 🏆 สถิติใหม่ (ครั้งเดียว/รอบ) · แชร์เพื่อน: field `hs` ใน /leaderboard (onlinePushScore+fetchPlayerStats) → แถว "👻 หนีผีรอดนานสุด" ในการ์ดผู้เล่น (format X นาที Y วิ) · **rules ba+hs รวม Artifact เดียว (ลิงก์เดิม) รอ publish:** https://claude.ai/code/artifact/107ef295-bb7f-4bb1-a381-82b24ab80184 · ยืนยัน browser (_t.step จำลองเฟรม): HUD เดิน · best=1→banner เด้ง · caught→เซฟ 23 วิ+จับเวลาใหม่ · exit run สั้น→best คงเดิม · การ์ด me "23 วิ" / stub เพื่อน hs95 "1 นาที 35 วิ" · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 257:** 📖 อัปโหลด `dict_001.js` ที่**ผู้ใช้แก้เอง** (เพิ่ม agricultural + agriculture) — ตรวจ syntax ผ่าน · commit+deploy · บัมพ์ SW v40 กันแคชเสิร์ฟไฟล์เก่า · ยืนยัน curl ไฟล์ live มีทั้ง 2 คำ


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 258:** 📐 รางปุ่มซ้าย Lobby — **แนวบนปุ่ม 💊 รักษา ตรงขอบบนแถวชื่อสัตว์ (#pet-tabs)** (ผู้ใช้สั่ง 17 ก.ค. · เดิมรอบ 254 ยึด #btn-pet-info) · `alignCureBtn` ui.js เปลี่ยน anchor เป็น pet-tabs (fallback btn-pet-info ตอนแถวซ่อน) · ยืนยัน browser: cureTop=tabsTop=83 · ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 259:** 📐🚗 **กล่อง "เลือกรถออกขับ" เกือบเต็มจอ ไม่มี scrollbar แม้ครบ 10 คัน** (ผู้ใช้สั่ง 17 ก.ค.) — `pickDriveCar` ui.js เพิ่ม class `dcp-box` + คำนวณ `--dcp-cols/--dcp-rows` (≤5 คัน=1 แถว · 6-10=2 แถว) · lobby.css: กล่อง flex column `min(96vw,1240px)×min(93vh,820px)` grid ห้าม overflow การ์ดยืด-หด (รูปรถ=ส่วน flex · ฟอนต์/ระยะ clamp ตาม vh) · ยืนยัน browser: 1000×640 กล่อง 89% จอ 5×2 · 812×375 ทุกส่วนในจอ noScroll ทุกชั้น · 3 คัน=แถวเดียว · คลิกเลือก/ออกขับ ตั้ง carIdx ถูก · ไม่มี console error (วัดด้วย offsetWidth เพราะ popIn ค้าง 0.4x ตอนแท็บ hidden)


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 260:** 🏷️ **ชื่อน้องจำกัด 1–9 ตัวอักษร กันแท็บตก 2 บรรทัด** (ผู้ใช้สั่ง 17 ก.ค.) — `renamePet` + ตั้งชื่อตอนรับน้อง (ui.js) `max:15→9` + แก้ desc · style.css `.pet-tab` เพิ่ม nowrap+ellipsis (max-width:170px) กันชื่อเก่ายาวในเซฟเดิมตกบรรทัด · ยืนยัน browser: maxlength=9 · checkName 10 ตัว→error "1–9" · ชื่อเก่า 14 ตัวแท็บสูง 34px บรรทัดเดียว · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 261:** 🪙 **เหรียญทองกระพริบใน pill โบนัสออนไลน์** (ผู้ใช้สั่ง 17 ก.ค.) — index.html `#net-pill` แทรก `<span class="net-coin">🪙</span>` ระหว่าง 🌐 กับ + · style.css `netCoinBlink` 1.1s (drop-shadow+brightness+scale) · หยุดตาม `.off` (โบนัสพัก) และ `html.no-anim` · ยืนยัน browser: เหรียญอยู่ตำแหน่งถูก · สถานะ on=กระพริบ infinite / off=หยุด · ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 262:** ✂️ **สคริปต์แยกไฟล์ก้อนรวม band** `tools/split_band.py` (ไอเดียต่อยอด ผู้ใช้อนุมัติ 17 ก.ค.) — อ่านก้อนรวม .json (รองรับหลาย array ต่อกัน) ตัดคำที่แยกแล้ว เรียง a-z หั่นไฟล์ละ 75 คำ ชื่อ `{base}_{คำแรก}-{คำสุดท้าย}.js` ไม่ทับของเดิม · ใช้: `python tools/split_band.py --all` (+`--dry-run/--size/--lower`) · รันจริง: academic แยกครบอยู่แล้ว 1,230 คำ (14 ไฟล์เดิม) · **business แยกใหม่ 399 คำ → 6 ไฟล์** ตรวจ parse/นับ/ไม่ซ้ำผ่าน · band/ untracked (staging ผู้ใช้) commit เฉพาะสคริปต์ ไม่ deploy (ไม่แตะไฟล์เกม) · ⚠️ กฎถาวร: ห้ามอ่านไฟล์ก้อนรวม อ่านได้เฉพาะไฟล์มีช่วงคำต่อท้าย (NOTES.md)


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 263:** 📖✂️ **แปลงคลัง dict 57 ไฟล์ → `js/data/dict_band/` แยกตาม band 1-5** (ผู้ใช้สั่ง 17 ก.ค. · เลิกทำ Dictionary เพราะ Gemini ลิสต์คำไม่ครบ → เอาข้อมูลมาทำข้อสอบตัวเลือก+เกมจับคู่แทน) — `tools/split_dict_band.py`: รวม 3,381 entry ตัดซ้ำเหลือ 3,220 · เติมช่องขาดครบ 8 (dict_009 มี 601 entry แบบ 6 ช่อง ไม่มีประโยคตัวอย่าง) · จัด band: คำแกน vocab.js+vocab/band*.js ปักหมุด 326 คำ ที่เหลือเรียง wordfreq zipf แบ่ง 10/15/20/25/30% → **45 ไฟล์ (366/491/644/794/925 คำ) + manifest.js 5.6KB** ไฟล์ละ ≤75 คำ ≤20KB ชื่อ `db<band>_<คำแรก>-<คำสุดท้าย>.js` ตรวจ parse/นับ/ไม่ซ้ำผ่าน · ยัง untracked (commit ตอนเชื่อมโค้ด — บทเรียนรอบ 254 ไม่ commit ไม่ขึ้นเว็บ) · Claude อ่านแค่ manifest.js ห้ามอ่านไฟล์ db ทั้งไฟล์


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 264:** 📖🎮 **เชื่อม dict_band เข้าเกม: จับคู่+ข้อสอบ band 1-5** (งานค้างรอบ 263) — `js/dictband.js` ใหม่: manifest โหลดตอนบูต + ชิ้น db ขี้เกียจตอนกดเล่น → หมวดเสมือน band1-5 (normalize en ตัวเล็ก · กันซ้ำ en/th · แปลTH ตัดท่อนแรกด้วย `bandShortTH`) ต่อเข้า `startGame`/`startQuiz` เดิม · การ์ด 5 ใบท้าย screen-cats + ⭐ ระดับของผู้เล่น · ข้อสอบ band โชว์ IPA+คำอ่าน `.quiz-phon` + เฉลยตัวอย่าง `#quiz-extra` ค้าง 2.4 วิ (คำไม่มีตัวอย่างจาก dict_009 → ข้ามเฉลย ไป 950ms เดิม · scrollIntoView กันหลุดจอเตี้ย — smooth โดน throttle ตอนแท็บพัก ใช้ instant) · รางวัลผ่านครั้งแรก 200🪙 (`state.quizPassed` id `band1..5`) · commit dict_band 46 ไฟล์แล้ว · ยืนยัน browser: การ์ด 5 ใบ · จับคู่ band1 342 คำ +10🪙 · ข้อสอบ band3 ช้อยส์ไม่ซ้ำ 4 ตัว ผ่าน 10/10 +200 · การ์ดอัปเดต ✅/คะแนน · หมวดปกติไม่กระทบ · 812×375 เฉลยอยู่ในจอ · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 265:** 🎮 **ปุ่มส้ม "เล่นเกมจับคู่คำศัพท์" หน้า lobby ใช้คลังศัพท์ band ตามชั้น** (ผู้ใช้สั่ง 17 ก.ค. — เดิมยังใช้คลังเก่า 80 คำ) — `bandPlayLobby` (dictband.js) + main.js btn-play เรียกแทน `startGame(null)` · โหลดพลาด=ถอยคลังเดิม · sw.js เพิ่ม dictband.js+manifest เข้า shell · ยืนยัน browser: ป.5→band3 620 คำ · ป.2→band1 342 คำ · จับคู่ถูก +10🪙 · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 266:** 📝 **ข้อสอบ band แบ่งชุดตายตัว ชุดละ 10** (ผู้ใช้สั่ง 17 ก.ค. — เศษท้ายรวมชุดสุดท้าย ≤19 เช่น band5 895 คำหลัง dedupe = 88×10+ชุดท้าย 15 = 89 ชุด) — `bandSets/bandSetCat/openBandSetPicker` (dictband.js) · **bandCat ต้องเรียง a-z ก่อน dedupe** (ชิ้นไฟล์โหลด async → ไม่เรียง=ชุดสลับคำทุกครั้ง) · แผงชิปทุกชุดจอเดียวไม่มี scroll (คอลัมน์คำนวณจากพื้นที่ · ✓ผ่าน/เหลือง=ชุดถัดไป · จบสอบเด้งแผงกลับ) · game.js: `cat.quizCount`+`distractPool` (ตัวลวงจากทั้งระดับ) · เกณฑ์ผ่าน `ceil(len*0.8)` · hook `cat.onPass` · รางวัลชุดแรก 100🪙 + ครบทุกชุดโบนัส 500🪙 (`state.bandComplete`) · ยืนยัน browser: 89 ชุดผลรวมคำครบ · ชุดท้าย 15 ข้อเกณฑ์ 12 · ผ่าน→ชิป✓+แผงเด้งกลับ+การ์ดนับชุด · โบนัสครบชุด +500 เด้งถูก · 812×375 แผง 89 ชิปไม่มี scroll · ไม่มี console error · ⚠️ กล่อง authAskLink ใช้ class `.levelup-overlay` เหมือนผลสอบ — สคริปต์เทสต์ต้อง match ข้อความ · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 267:** 📝🔓📴 **สอบเลื่อนขั้น + ปลดล็อกระดับ + เล่นออฟไลน์** (ผู้ใช้สั่ง 17 ก.ค.) — (1) ปุ่มม่วง `#btn-band-exam` ข้างปุ่มส้ม → `bandExamLobby` เปิดแผงชุดระดับตัวเอง (2) `bandUnlocked`: band ≤ ชั้นตัวเองเปิดเสมอ · สูงกว่าต้องมี `state.bandComplete[b-1]` · การ์ดล็อกเทา+🔒+เงื่อนไข กันทั้ง bandPlay/openBandSetPicker (3) ออฟไลน์: ปุ่ม 📴 `#btn-offline-play` หน้า login (โชว์เฉพาะ mode offline) → `authEnterOffline` bootGame ไม่มี Auth.user · ไม่มีเน็ตตอนเปิด=ประตูเด้งทันทีไม่รอ watchdog 20 วิ · เน็ตกลับ→`onlineLoadSDK` (refactor เรียกซ้ำได้ retry online event+60วิ) → onAuthStateChanged ครั้งหลัง boot → `authLateSync` (ownerUid ตรง=push เซฟ+onlineStart · ต่างบัญชี=ไม่เขียนทับ · Online.started กันรันซ้ำ) · ยืนยัน browser: ปุ่มออฟไลน์โชว์/ซ่อนตาม mode · enterOffline บูตได้ user=null · lateSync บัญชีตรง push+onlineStart / ต่างบัญชีเงียบ · ป.1 ล็อก 2-5 + ผ่านครบ b1→b2 เปิด · ม.5 เปิดหมด · ปุ่มเลื่อนขั้น ป.1→แผง 34 ชุด · boot ออนไลน์ปกติไม่พัง · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง (โดยเฉพาะปิด wifi เปิดเกม)


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 268:** 📴📊 **ป้ายออฟไลน์ + คืบหน้าใต้ปุ่มสอบเลื่อนขั้น** (ไอเดียต่อยอดรอบ 267 ผู้ใช้อนุมัติ) — `#offline-pill` หัว lobby (updateOfflinePill auth.js: โชว์ตอน authEnterOffline ซ่อนตอน authLateSync) · ปุ่มม่วง `.exam-sub` "ผ่านแล้ว k/n ชุด"/"🏆 ครบ n ชุด!" (`updateBandExamBtn`+`bandLobbyTick` เรียกใน renderDashboard · พรีโหลดคลังระดับตัวเอง 2.5 วิหลังเข้า lobby) · ⚠️ .exam-sub ต้อง nowrap — ตัด 2 บรรทัดแล้วปุ่มล้นจอเตี้ย · ยืนยัน browser: pill โชว์/ซ่อนตาม state · ป้าย 0/34→5/34→🏆 34 · 812×375 ปุ่ม 57px ในจอ · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 270:** 🔁 **สอบซ่อมรวมชุดสีส้ม** (ไอเดียต่อยอดรอบ 269 ผู้ใช้อนุมัติ) — ปุ่ม `#bsp-retake` หัวแผงชุด (โผล่เมื่อส้ม ≥2) · `bandTriedSets` เรียงคะแนนต่ำก่อน หยิบ ≤3 ชุด (`BAND_RETAKE_MAX`) · `bandRetakeCat` สอบรวมทุกคำ ตัดเกรด**รายชุด** ≥80% ของคำชุดนั้น → ผ่าน +100/ชุด (กันเคลียร์หลายชุดด้วยข้อสอบสั้น) · game.js: `quiz.results` ผลรายข้อ + hook `cat.onFinish` · refactor โบนัส→`bandCheckComplete` · ยืนยัน browser: หยิบ 3 จาก 4 ชุดถูกลำดับ · สอบ 30 ข้อ ชุด2,3 เคลียร์/ชุด4 ยังส้ม best ไม่ลด · ปุ่มอัปเดต/ซ่อนเมื่อส้ม<2 · ไม่มี console error · ⚠️ กล่อง "หนูป่วย" (dailyTick) ใช้ .levelup-overlay เด้งซ้อนได้ระหว่างเทสต์ยาว — จับผลต้อง match ข้อความ · ค้าง: ผู้ใช้ลองจริง
- **รอบ 269:** 💬📊 **กล่องอธิบายป้ายออฟไลน์ + คะแนนสูงสุดบนชิปชุดข้อสอบ** (ไอเดียต่อยอดรอบ 268 ผู้ใช้อนุมัติ) — แตะ `#offline-pill` → `openPillInfo('offline')` (ui.js) · ชิปแผงชุด: `.bsp-best` คะแนนสูงสุดจาก `state.quizLog` + ชิปส้ม `.tried` = เคยสอบยังไม่ผ่าน (สอบซ่อม) + คำอธิบายใน foot · ⚠️ `.bsp-best` ต้อง clamp เอง ไม่อิง em (จอเตี้ยเหลือ 5.8px) · ยืนยัน browser: กล่องอธิบายฟิตจอ · ชิปเขียว 10/10 / ส้ม 6/10+next / ว่างไม่มีเลข · 812×375 band5 89 ชิป noScroll · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 271:** 📋 **สรุปผลสอบซ่อมละเอียด** (ไอเดียต่อยอดรอบ 270 ผู้ใช้อนุมัติ) — `bandShowRetakeSummary` (dictband.js) เด้งหลังปิดกล่องผลสอบ (game.js เรียกคู่เปิดแผงชุด): หัวเคลียร์กี่ชุด/+🪙 · แถวรายชุด ✅/❌+คะแนน · การ์ดคำผิด en—th แตะฟัง 🔊 · `onFinish` เก็บ `__retakeLast` แทน toast (นับเฉพาะข้อที่ออกจริง) · ยืนยัน browser: ✅10/10+❌0/10+การ์ด 10 ใบ · เคสหนัก 30 คำผิด 812×375 ฟิตจอ noScroll · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 272:** 🌤️➖ **เอาป้ายอากาศออกจาก footer lobby** (ผู้ใช้สั่ง 17 ก.ค. — ปุ่มแถวล่างจะได้ไม่ตัด 2 บรรทัด) — ลบ `#weather-banner` (index.html + บล็อกใน renderDashboard ui.js + CSS ทั้ง style.css/lobby.css) · อากาศยังดูได้ในการ์ดบ้าน (renderHomeCard ใช้ weatherNow อยู่) · `.lobby-bottom .big-btn` เพิ่ม nowrap · ยืนยัน browser 812×375: ปุ่ม 4 ตัวสูง 33-39px บรรทัดเดียว ไม่มี scroll/console error (screenshot tool ค้าง ใช้ rect ตามกฎ) · ค้าง: ผู้ใช้ดูภาพจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 273:** 🎀📝 **overlay ข้อมูลน้อง: คำบรรยายรูปร่าง + ปุ่มแต่งตัว** (ผู้ใช้สั่ง 17 ก.ค.) — ใต้รูปน้อง `.pi-shape-cap` บอกทำไมผอม/อ้วน/ล่ำ/สมส่วน (ui.js shapeWhy ใน renderDashboard) · ปุ่ม `#btn-pi-dress` มุมบนขวาแผงรูป → ปิด overlay + openPanel('panel-shop') ซื้อ/สวมได้เลย · ไข่=ซ่อนทั้งคู่ · ยืนยัน browser 812×375: caption ครบ 4 ร่าง · ปุ่มเปิดร้าน 8 ไอเทม · info plate noScroll · ไม่มี console error (care plate เกิน 94vh ~6px เป็นของเดิม จอเตี้ยมาก เลื่อนได้ scrollbar ซ่อน) · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 274:** 👗 **ห้องลองชุด** (ไอเดียต่อยอดรอบ 273 ผู้ใช้อนุมัติ) — ซื้อ/สวมจากร้านที่เปิดผ่านปุ่ม 🎀 → เด้งกลับหน้าข้อมูลน้องเห็นชุดใหม่ทันที (`__dressFromPetInfo` ตั้งใน btn-pi-dress · เช็กท้าย click handler ของ renderShop · closePanel ล้าง flag) · เข้าร้านทางเมนูปกติ/ปิดร้านเองไม่ซื้อ = ไม่เด้ง · เหรียญไม่พอ = ค้างในร้าน · ยืนยัน browser ครบ 3 เคส ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 275:** 👤 **คลิกรูป/ชื่อตัวเองมุมซ้ายบน lobby → เปิดการ์ดโปรไฟล์** (ผู้ใช้สั่ง 17 ก.ค.) — `#pass-photo` + ก้อนรูป+ชื่อใน `#student-chip` เป็น `.pl-click` (data uid/n/g · badgeSuffix ต่อท้ายชื่อ) → showPlayerCard เดิม (renderDashboard ui.js) · ปุ่ม ✏️ อยู่นอก span ไม่ชนกัน · ยืนยัน browser: คลิกชื่อ+รูปเด้งการ์ด · ✏️ ยังเปิดกล่องแก้ชื่อ · ไม่มี console error · ⚠️ โค้ดติดไปกับ commit `43e8109` ของรอบ 274 (session คู่ขนาน commit ui.js ทั้งไฟล์) — ขึ้นเว็บ `.268` แล้ว curl ยืนยัน · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 276:** 💬🐾 **การ์ดโปรไฟล์: ปุ่มแชท + คลิกน้องดูข้อมูล** (ไอเดียต่อยอดรอบ 275 ผู้ใช้อนุมัติ) — ปุ่ม `💬 แชท` ใน pl-head เฉพาะเป็นเพื่อนกัน (`Online.myFriends`) → ปิดการ์ด+openChat · คลิกน้องใน `.pl-pets` → `openPetPeek` (ui.js) การ์ดย่อ ชนิด/วัย/หุ่น/ไอเทมสวม จาก descriptor {t,s,sh,e,nm} (SHAPE_UI ไม่มี normal → fallback "✨ สมส่วน") · ทรัพย์สินยัง lightbox เดิม · ยืนยัน browser: เพื่อน=มีปุ่ม→เปิดแชทถูกคน · คนแปลกหน้า/ตัวเอง=ไม่มีปุ่ม · ชิปครบ 3 เคส (โต+ล่ำ+แว่น / ไข่ / สมส่วน) · 812×375 ฟิตจอ noScroll · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 277:** 📝 **หน้าข้อสอบฟิตจอเดียว ไม่ต้องเลื่อน** (ผู้ใช้สั่ง 17 ก.ค.) — เดิมตัวเลือก 4 ปุ่มเรียงลงล่าง+ขนาด px คงที่ จอเตี้ยปุ่มหลุดจอ → lobby.css เพิ่มบล็อก `#screen-quiz.screen.active` (clamp ตาม dvh แบบร้านสัตว์เลี้ยง) + `#quiz-choices` เป็นตาราง **2×2** + บีบ `#quiz-extra` ด้วย · ยืนยัน browser ด้วย rect: 812×375 noScroll ทั้งเคสปกติ (แผง 18→283px) และ band มีคำอ่าน+กล่องเฉลย (bottom 348<375) · 1280×720 ฟอนต์กลับเต็ม 34/19px · ไม่มี console error (screenshot tool ค้างเหมือนเดิม ใช้ตัวเลขแทน) · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 278:** ⌨️ **ยุบแป้นพิมพ์มือถือหลังค้นหาพจนานุกรม** (ผู้ใช้สั่ง 17 ก.ค. — แป้นบังผลค้นหา) — ต้นตอ: `dGo` เปิด overlay แต่โฟกัสค้างที่ `#dict-input` · แก้: เพิ่ม `dIn.blur()` ใน dGo (ui.js) · แตะช่องใหม่ = focus ปกติ แป้นเด้งกลับเอง · ยืนยัน browser: กด 🔍 + Enter หลุดโฟกัสทั้งคู่ · overlay เปิดปกติ ("define" พบ 1 คำ) · แตะช่องโฟกัสกลับ · ไม่มี console error · ⚠️ commit `888a5e9` พ่วงงาน ui.js ค้างของ session คู่ขนาน (รอบ 277 ส่วนขยาย: ปุ่ม 🎁 ใน openPetPeek + กดค้าง story ≥550ms เปิดโปรไฟล์) ติดมาด้วย — โค้ดสมบูรณ์มีคอมเมนต์ครบ ขึ้นเว็บพร้อมกัน · ค้าง: ผู้ใช้ลองจริงบนมือถือ


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 279:** 🎁📇 **ปุ่มส่งของขวัญในการ์ดน้อง + กดค้างวงกลมออนไลน์เปิดโปรไฟล์** (ไอเดียต่อยอดรอบ 276 ผู้ใช้อนุมัติ · โค้ดติดไปกับ commit `888a5e9` ของรอบ 278 — session คู่ขนาน commit ui.js ทั้งไฟล์ ดู ⚠️ ในรอบ 278) — `openPetPeek(d, opts)`: opts.giftFriend → ปุ่มชมพู `.pp-gift` ปิดการ์ดน้อง+โปรไฟล์ (onGift — gift-pick z 85 < pl-overlay 90) แล้ว `openGiftPicker` · inbox story circle: แตะ=แชทเดิม · กดค้าง 550ms=`showPlayerCard` (pointerdown timer + กัน contextmenu/click ซ้ำ + title บอกวิธี) · ยืนยัน browser: เพื่อน→🎁 เปิดกล่องถูกคน 22 การ์ด · น้องตัวเอง=ไม่มีปุ่ม · กดค้าง→โปรไฟล์ / แตะสั้น→แชท · 812×375 ฟิตจอ noScroll · ไม่มี console error · ค้าง: ผู้ใช้ลองจริง (โดยเฉพาะกดค้างบนมือถือจริง)


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 280:** 🔍📖 **ช่องค้นคำถัดไปบนหัวแผงผลพจนานุกรม** (ไอเดียต่อยอดรอบ 278 ผู้ใช้อนุมัติ) — `#dict-input-ov`+`#dict-go-ov` ใต้หัว dict-card (openDictOverlay ui.js): ค้นใหม่ได้เลยไม่ต้องปิดแผง · Enter/🔍 → blur ยุบแป้น + sync ค่ากลับช่อง lobby · เปิดแผงเติมคำที่ค้นให้ · CSS โทนสว่าง `.dict-card .dict-box` (lobby.css) · ยืนยัน browser: fine→define→fine ผลเปลี่ยนถูก blur ทุกทาง overlay ไม่ซ้อน · 812×375 การ์ดในจอ (h345) ช่องค้นหาโผล่ครบ · ไม่มี console error · ค้าง: ผู้ใช้ลองจริงบนมือถือ
