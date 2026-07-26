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


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 281:** 👆📖 **แตะคำอังกฤษในผลพจนานุกรม = ค้นคำนั้นต่อทันที** (ไอเดียต่อยอดรอบ 280 ผู้ใช้อนุมัติ) — `dictTapWords` (ui.js) ห่อคำในนิยาม+ตัวอย่างเป็น `.di-w` (regex ข้าม entity · `&#39;` นับในคำ เช่น don't) · click delegation ใน dict-list: `.di-say`=🔊 เดิม / `.di-w`=ค้นต่อ+sync ช่อง lobby · CSS เส้นประใต้คำ (lobby.css) · ยืนยัน browser: fine→แตะ good ได้ 3 คำ · 🔊 ไม่ trigger ค้น · entity/apostrophe ถูก · ไม่มี console error · ⚠️ commit `1e21741` **stage เฉพาะ hunk พจนานุกรม** (`git apply --cached` patch) — งานค้าง session คู่ขนาน (refactor alertBox `.ab-*` + ปุ่มรักษาใน feedPet) **ยังไม่ commit อยู่ใน working tree ตามเดิม** ไม่ถูกกวาด · ค้าง: ผู้ใช้ลองจริงบนมือถือ


## ⏬ ย้ายเมื่อ 2026-07-17 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 283:** 💗 **น้องเด้งดีใจ + หัวใจลอยตอนรักษาหาย** (ไอเดียต่อยอดรอบ 282 ผู้ใช้อนุมัติ) — `cureCelebrateFx()` (ui.js เรียกท้าย curePet หลัง renderDashboard): หัวใจ 10 ดวงลอยจาก `.hero-scene .pet-stage` (rect กว้าง 0 = รักษาจากหน้าเกม → ลอยกลางจอแทน) + คลาส `heal-bounce` 1.3s ทับ idle ชั่วคราว (`.pet-stage.heal-bounce .pet-wrap` ชนะ petIdle — lobby.css) · เคารพ `html.no-anim` = ข้ามทั้งหมด · ยืนยัน browser: dashboard เด้ง+หัวใจ 10 / จบแล้วคืน petIdle หัวใจลบหมด / หน้าเกมหัวใจกลางจอ / no-anim = 0 ดวง / ไม่มี console error · ค้าง: ผู้ใช้ลองจริง (ดูจังหวะเด้งสวยไหม)
- **รอบ 282:** 🩺 **ปุ่ม "รักษาเลย (🪙100)" ในกล่องแจ้งน้องป่วย + กรอบ clamp ไร้ scrollbar** (ผู้ใช้สั่ง 17 ก.ค.) — `alertBox(html,okText,extraBtn)` รับปุ่มที่สองสีเขียว (util.js) · ใส่ทั้งกล่องเข้าเกมจับคู่ (game.js startGame — กด=curePet+อัปเดต `#game-coin-count`) และกล่องป้อนอาหาร (ui.js feedPet — ok เปลี่ยนเป็น "ไว้ก่อน") · เนื้อกล่อง inline style → คลาส `.ab-emoji/.ab-title/.ab-desc/.ab-btns` clamp ตาม vh (lobby.css) · ยืนยัน browser: รักษา 500→400 หายป่วย / เหรียญไม่พอ=toast ยังป่วยเล่นต่อได้ / 812×375 กล่อง 560×220 ฟิตจอ noScroll / ไม่มี console error (วัด rect ต้อง `getAnimations().finish()` ก่อน — popIn ค้าง 0.4x ตอนแท็บ hidden) · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 284:** 🚗🧭 **ขับรถ 3D: คอนโซลเลื่อนลงไม่บังทาง + GPS เลิกสั่งเลี้ยวนอกถนน** (ผู้ใช้สั่ง 17 ก.ค.) — คอนโซล `#adv-cardash` bottom −20vh · พวงมาลัยเหลือขอบบน 8vh (`bottom:calc(8vh - min(50vh,50vw))`) · เกจ clamp ไม่หลุดจอ (จอวิทยุ/ตุ๊กตาตาม rect เอง — ยืนยัน radio 310-358 ในจอ 812×375) · ต้นตอ GPS: กริดถนนทาสี่เหลี่ยมเผื่อกว้าง (±12ม. vs ถนนจริง ~5ม.) A* เจอมุมเลี้ยว/ทางเชื่อมนอกถนน → เพิ่ม `ngrid` ทาวงกลมรัศมี w/2+1 (ขั้นต่ำกากบาท 1 ช่อง กันถนนเฉียงขาดจากกฎกันตัดมุม) ใช้เฉพาะ `cellDrivable` ฟิสิกส์ใช้ grid เดิม (adventure3d.js) · ยืนยัน browser: BFS จากรถถึงตัวอักษรครบ 73/73 · GPS HUD ขึ้น "เลี้ยวขวา 45ม." · ไม่มี console error · commit `bd023ad` · ค้าง: ผู้ใช้ขับจริงดูจุดเลี้ยวตรงแยก


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 285:** 🧭📖 **เส้นทางไล่ศัพท์ + นับคำวันนี้ + ภารกิจ dict** (ไอเดียต่อยอดรอบ 281 ผู้ใช้อนุมัติ) — breadcrumb `#dict-trail` ใต้ช่องค้นบนแผงพจนานุกรม (`__dictTrail` ≤20 คำ session-based · แตะ crumb ย้อน=ตัดหาง · โชว์เมื่อ ≥2 คำ · เลื่อนแนวนอน scrollbar ซ่อน) · ชิป `#dict-today` "📚 วันนี้ N คำ" หัวแผง · `dictRecordLookup` (ui.js) นับเฉพาะคำใหม่ที่เจอผล (`state.dictDaily` {date,n,w≤300}) → `questEvent('dict')` · QUEST_POOL เพิ่ม `dict5` 5 คำ +80🪙 (state.js) · ยืนยัน browser: trail fine›good›quality ย้อน fine ตัดหางถูก · คำซ้ำไม่นับ n · patch questsToday จำลอง → ครบ 5 ได้ +80 questDone · 812×375 การ์ดในจอ trail 8 คำไม่ดันกว้าง · ไม่มี console error · commit `158b9e3` · ค้าง: ผู้ใช้ลองจริง (ภารกิจ 📖 จะสุ่มโผล่ตามวัน)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 286:** 💗🍽️ **หัวใจลอยตอนป้อนอาหารสำเร็จ** (ไอเดียต่อยอดรอบ 283 ผู้ใช้อนุมัติ) — refactor: แยก `heartsFx(anchor,n)` ออกจาก cureCelebrateFx (ui.js) ใช้ร่วมกัน · showFeedResult ท้ายฟังก์ชัน: หน่วง 450ms (รอ popIn) ยิงหัวใจจากรูปน้อง `.feed-pet` ในกล่องกินเสร็จ — มื้อดี 8 ดวง / มื้อพิษปน (gotToxin) 4 ดวง / ป่วยคามื้อ (toxinSick) 0 · `.heal-heart` z 95→9500 ให้ลอยทับ dialog (lobby.css) · ยืนยัน browser ครบ 4 เคส (ดี/พิษ/ป่วย/รักษาหายยัง 10 ดวง+เด้ง) · ไม่มี console error · ⚠️ เทสหัวใจต้อง feed+วัดใน eval เดียว (ต่าง eval ห่างกันหลายวิ หัวใจหมดอายุก่อน) · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 287:** ✕ **ปุ่มปิดแผงชุดข้อสอบ band มองไม่เห็น** (ผู้ใช้ส่งภาพ 17 ก.ค.) — ปุ่ม `#bsp-close`/`#rts-close` มีอยู่แล้วแต่สไตล์กลาง `.pl-close` ขาวโปร่งบนกล่องพื้นขาว=ล่องหน · แก้ style.css เพิ่ม `.bsp-box .pl-close,.rts-box .pl-close` ปุ่มแดงขอบขาว (idiom เดียวกับ dict-card) · ยืนยัน browser ด้วย rect: ปุ่ม 30px มุมขวาบนในกล่อง ไม่ทับหัว กดแล้วปิด · 812×375 noScroll · ไม่มี console error · commit `def1507` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 288:** 📒 **สมุดคำศัพท์ของฉัน + ข้อสอบทบทวนส่วนตัว** (ผู้ใช้สั่ง 17 ก.ค.) — ไฟล์ใหม่ `js/vocabbook.js`: ทุกคำที่เจอ (จับคู่ถูก/ผิด + ข้อสอบทุกแบบรวม band) ลง `state.vocabBook` {en:{th,c,w,t,lw}} เพดาน 500 คำ · แบ่ง 3 กลุ่ม 💪ต้องทบทวน(ล่าสุดผิด/ผิด>ถูก)/🌱เรียนรู้/⭐แม่น(ถูก≥3) · กล่อง `.vb-box` แบ่งหน้า ◀▶ วัด offsetTop จริง ไม่มี scrollbar · สอบทบทวน=คำอ่อน ≤10 ข้อเข้า startQuiz เดิม (id `vbreview` ผ่านแรก+50🪙 จบสอบเด้งสมุดกลับ) · จุดเข้า: ปุ่ม 📒 แถบล่าง lobby + การ์ดท้ายหน้าหมวด (⚠️ ปุ่มการ์ดห้ามใช้คลาส practice/quiz — renderCats ผูก listener ทุกปุ่ม) · hook: checkMatch ถูก/ผิด + quiz รายข้อ → `vbRecord` normalize ตัวเล็ก · ยืนยัน browser ครบ: hook จับคู่ผิด→w:1 / สอบ 7 ข้อผิด 1 กลุ่มเลื่อนถูก / แบ่งหน้า 127 คำ 6 หน้าครบ / 812×375 noScroll / กันสมุด<4 คำ=toast / ไม่มี console error · commit `a635230` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 289:** 🛒 **เสียงแคชเชียร์ "ชิ้ง!" ตอนซื้อสินค้าสำเร็จ** (ผู้ใช้สั่ง 17 ก.ค.) — `sfx.cashier`+`playCashier` (util.js): ไฟล์ `sound/cashier.mp3` มาก่อน → ไม่มีไฟล์ใช้ `cashierSynth` (แกร๊กลิ้นชัก+กระดิ่งกริ๊งกริ๊ง 2093Hz+เหรียญท้าย) · showCollectReveal (ui.js): ซื้อ (price!=null,!produced — โรงงาน+ตลาดเพื่อน) = แคชเชียร์ / ผลิตเอง = rankup เดิม · prompt เจนเสียงใน `PROMPTS_SOUND.md` ข้อ 5 + Artifact ปุ่มคัดลอกส่งผู้ใช้แล้ว · ยืนยัน browser: spy 3 เคส cashier/rankup/rankup ถูก · fallback synth ทำงาน (fileMiss=true) · ไม่มี console error · commit `fea24ee` (stage เฉพาะ hunk — ui.js มีงาน session คู่ขนานค้าง @2964) · ค้าง: ผู้ใช้เจนไฟล์เสียงจริงวาง `sound/cashier.mp3` (ไม่วางก็มีเสียงสังเคราะห์ใช้เลย)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 290:** 🌳💖 **สวนผลไม้+เล็งของ ปัดแนวนอนสไตล์ SimCity BuildIt** (ผู้ใช้สั่ง 17 ก.ค. — ปุ่ม "เสร็จแล้ว" โดนตัด+ลิสต์แนวตั้งธรรมดาไป) — `.panel-box` 880→1180px (lobby.css) · เล็งของ: ปุ่มย้ายขึ้นหัวขวา `.wl-head` + การ์ด 2 แถว grid-auto-flow:column ในถาด `.strip-x` น้ำเงินเข้ม + `.wl-box` max-width 1020 (ต้อง override ใน lobby.css — levelup-box 600 ชนะ style.css) · สวน: ร้าน=hq-card + ต้นปลูก=การ์ดตั้ง `.farm-tree` ปัดขวางทั้งคู่ · `.farm-cols` 2 โซนเคียงข้าง (<700px ซ้อน) · `bindStripArrows` (ui.js) ลูกศรเลื่อน+ซ่อนเองเมื่อไม่ล้น (⚠️ ใช้ setTimeout ไม่ใช่ rAF — rAF ไม่ยิงตอนแท็บ hidden) · ยืนยัน browser ด้วย rect: 1000×640 + 812×375 ไม่มี scroll แนวตั้งทั้งสองแผง · ซื้อ/ขาย/เล็ง/sellAll ทำงาน · ไม่มี console error · commit `03bd14b` (stage เฉพาะ hunk — ui.js @2964 ของ session คู่ขนานไม่ถูกกวาด) · ค้าง: ผู้ใช้ลองจริง (ปัดบนมือถือจริง)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 291:** 📒 **สมุดคำศัพท์ต่อยอด 3 ข้อ (ผู้ใช้อนุมัติจากไอเดียรอบ 288)** — (1) โลก 3D ทุกโลก (`wordDone`+mecha kill ใน adventure3d.js) + Word Search (`commit` ใน wordsearch.js) เจอคำ → `vbRecord(...,true)` ลงสมุดถาวร (2) QUEST_POOL เพิ่ม `vbreview1` ev `vbquiz` +120🪙 — ยิงจาก `onFinish` ของ vbReviewCat (นับตอนสอบจบ ไม่ต้องผ่าน) (3) รายงานความก้าวหน้า (showProgressReport game.js): หมวด 📒 นับ 3 กลุ่ม + ชิปคำติดบ่อย ≤8 (คลาส `.vb-word g-review` เดิม — ไม่แตะ CSS เลย เลี่ยงชน WIP คู่ขนาน) แตะฟังเสียง · ยืนยัน browser: WS พบ READ→read c:1 / quest จำลอง questsToday → done+120 (8→178 ตรง) / รายงานชิปส้ม+speakWord ยิงถูก / ไม่มี console error · ⚠️ commit `b825eed` **stage adventure3d.js เฉพาะ 2 hunk vbRecord** (patch ผ่าน python — ห้าม text-mode เขียน patch บน Windows CRLF ทำ apply fail ต้อง `newline=''`) — งาน navline คู่ขนานอยู่ working tree ตามเดิม · ค้าง: ผู้ใช้ลองจริง (โดยเฉพาะเก็บคำในโลก 3D จริง — hook ยืนยันแค่ pattern+โหลดไฟล์ ไม่ได้เข้าโลกจริง)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 291ข:** 🛒 **วางไฟล์เสียงจริง `sound/cashier.mp3`** (ผู้ใช้เจน 73KB/3วิ) — commit `8fa7bbf` · deploy `.283` ยืนยัน HTTP 200 บน live · เกมสลับใช้ไฟล์แทน synth อัตโนมัติ


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 292:** 🏭🏪 **โรงงาน+ตลาด แถบปัดแนวนอน SimCity** (ต่อยอดรอบ 290 ผู้ใช้อนุมัติ) — โรงงาน: เลิกแบ่งหน้า 5 ชิ้น (ลบ pager/dots/factoryPage/FACTORY_PAGE_SIZE) → ทั้ง 50 ชิ้นใน `.strip-x` เดียว + `.fc-cols` 2 โซน ซ้าย=jobUI+`.craft-toolbar`(ชิป+ตัวกรองซ้อนกัน) ขวา=แคตตาล็อก (<700px ซ้อน · จอเตี้ยบังคับ 2 คอลัมน์) · ตลาด: ชั้นเพื่อน+คลังของฉัน hq-grid→strip · `.strip-x .hq-card` w168/pic112 (จอเตี้ย 128/62 + ซ่อน collect-sub/craft-text) · ยืนยัน browser rect: โรงงาน idle+producing scrollV=0 ทั้ง 1000×640 และ 812×375 · กรองหมวด/ซื้อ/ตั้งราคา/regression สวน+เล็งของผ่าน · ไม่มี console error · commit `3de26de` (stage เฉพาะ hunk เว้น @2964 คู่ขนาน) · ค้าง: ผู้ใช้ลองจริง · 💡 เหลือโชว์รูมรถ/หุ่นในตลาดยังเป็นตารางเดิม


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 293:** 🏍️ **โลก 3D ใหม่ "มอเตอร์ไซค์บ้านโพธิ์สวัสดิ์" บนเครื่องเกมพกพา** (ผู้ใช้สั่ง 18 ก.ค. พร้อมภาพเครื่องเกม+มอไซค์) — ไฟล์ใหม่ `js/moto3d.js` (โลกแยก self-contained ไม่แตะ adventure3d.js · CSS ฉีดเอง) + `js/data/moto_phosawat.js` (ถนนจริง OSM 30 กม.รอบโรงเรียน 1,407 เส้น/หมู่บ้าน 202 ป้าย/บ้านพาสเทล · bake_moto.py ใน scratchpad สูตรเดียว city_kpp) · third-person เอียงรถเข้าโค้ง คนขี่หมวกแดง · เครื่องเกมพกพาเต็มจอ: จอเกม aspect 1.6 กลาง สไลเดอร์ส้มลาก=เลี้ยว ปุ่มฟ้า=เร่ง ปุ่มแดงบน=ปิดเครื่อง (hint จางบนปุ่ม) · เก็บอักษรประกอบคำ 🪙45 + GPS ลูกศร + มินิแมพ + questEvent word3d + vbRecord · ตั๋ว `motoTicket` 🪙35000 (ต้องมีตั๋วขับรถ · การ์ด `moto-card` + แถว WORLD3D) · ยืนยัน browser: rect จอ 1.6/ปุ่มครบ 1000×640+812×375 noScroll · ฟิสิกส์ step() 104 กม./ชม. เลี้ยว/เก็บ/จบคำ/+45/สมุดศัพท์/ออกโลก toast ครบ · ไม่มี console error · commit `b901e00` (ui.js stage 4 hunk เว้น @2961 petPatFx คู่ขนาน) · ⚠️ rAF ไม่ยิงตอนแท็บ hidden → เทสต์ใช้ `MotoWorld._t.step(dt,n)` · ค้าง: ผู้ใช้ลองจริง (โดยเฉพาะลากสไลเดอร์บนมือถือจริง + ภาพเรนเดอร์จริง — screenshot preview เสีย)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 294:** 🏍️ **มอไซค์ภาพจริง + เอียงเข้าโค้ง + เครื่องเกมดำ** (ผู้ใช้ส่งภาพใหม่ 2 ใบ วางไว้ `img/moterbike/`) — ใช้ `bike.webp` (trim+ย่อจาก moterbike.png RGBA — ต้นฉบับไม่แตะ) เป็นสไปรต์ DOM ล่างกึ่งกลางจอ ลบโมเดล 3D `makeBike` ทิ้ง · กลับทิศเอียง: `leanTgt=+steer` เอียงเข้าโค้ง (เดิมกลับด้าน ผู้ใช้ทัก) + `camera.rotateZ(lean*.3)` · เครื่อง=ภาพ `console_crop.webp` (crop จาก blackConsole.png วัด % ปุ่มจากพิกเซล: จอ 25.1/18/44.4/53 · knob ส้ม · บอลฟ้า 72/32.5/19.5/48) ยืด 100%/100% เต็มจอ · ยืนยัน rect ทั้ง 2 จอ: เลี้ยวขวา +22.5° ซ้าย −22.5° ตรง 0° · sw ไม่ต้องบัมพ์ (js network-first · webp ไฟล์ใหม่) · commit `375ebf4` · เทสต์แท็บ hidden ใช้ `MotoWorld._t.step(dt,n)` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 295:** 🏫 **เครื่องเกมภาพใหม่พื้นดำ + โรงเรียน 3D ตามคลิปจริง** — ผู้ใช้วาง `BlackConsole.png` ใหม่ (พื้นดำ) → เจน `console_crop.webp` ใหม่ + วัด % ใหม่ (จอ 25.2/20/46.4/60.5 · knob 2.5/45 · บอล 74.5/40) · ดูคลิปโรงเรียนจริงผ่าน YouTube thumbnail (`img.youtube.com/vi/<id>/0-3.jpg` — ดูวิดีโอตรงไม่ได้แต่ thumb 4 เฟรมพอเห็นสภาพ) → `buildSchool()` ใน moto3d.js: อาคารม่วง 2 ชั้น+ระเบียง+บันไดกระเบื้องลายไม้ Phong มันวาว+ราวโครเมียม+ช้างน้ำเงิน+สนามเด็กเล่น+ธงไตรรงค์+ภาพวาดผนัง+ลานคอนกรีต วางฝั่งไม่ทับถนนหันหน้าเข้าถนน · ยืนยัน: rect ตรง % ใหม่ / ขับ 360 เฟรมผ่านฉากไม่มี error · commit `74fcdbc` · ค้าง: ผู้ใช้ลองจริง (ดูหน้าตาโรงเรียน+ปุ่มตรงภาพเครื่องใหม่)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 296:** 🛣️ **บั๊กถนนล่องหนโลกมอไซค์ (ผู้ใช้รายงาน "ไม่มีถนนเลย มีแต่ minimap รถอืด")** — ต้นตอ: ribbon ถนน winding คว่ำ+FrontSide โดน backface culling ทั้งแผนที่ (minimap รอดเพราะ 2D · เทสต์รอบก่อนจับไม่ได้เพราะ screenshot เสีย เช็คแต่ฟิสิกส์) · แก้ moto3d.js: `side:DoubleSide` + ยกถนน y .15/.18 + พื้น polygonOffset + camera near .4 กัน z-fight · **พิสูจน์ด้วย `gl.readPixels` เฟรมจริง: พิกเซลถนน 35.1% ของจอ** (เทคนิคใหม่ — ใช้แทน screenshot ได้ ต้องอ่านใน eval เดียวกับ render) · commit ดู `git log` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 296ข:** 🖼️ ผู้ใช้ทัก "แถบอัพเดทไม่เด้ง แน่ใจนะว่าอัพแล้ว" — ยืนยัน live จริงด้วย curl (.288+DoubleSide อยู่บนเว็บ) · แถบอัพเดท (index.html:354) เด้งเฉพาะเมื่อ v เปลี่ยน "ระหว่างเปิดเกมค้าง" — เปิดใหม่หลัง deploy = ได้ของใหม่เลยไม่มีแถบ (พฤติกรรมถูก) · แต่ไล่โค้ดเจอบั๊กจริง: `console_crop.webp` เปลี่ยนเนื้อไฟล์ใน URL เดิม + sw cache-first รูป → เครื่องที่เคยเข้าโลกจะติดรูปเครื่องเกมเก่า ปุ่มเหลื่อม → เพิ่ม `?v=295` ใน CSS url (moto3d.js) · **กฎใหม่: แก้รูปใน img/moterbike/ ต้องบัมพ์ ?v= เสมอ** · deploy `.289`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 297:** 🏍️ **ถนนกว้าง 1.8× + เอียงแมนวล** (ผู้ใช้: ถนนแคบไป + ไม่เอาเด้งกลับอัตโนมัติ) — `ROAD_WIDE=1.8` คูณ hw ตอน buildRoads (ภาพ+ระยะ onRoad พร้อมกัน) · ระบบเลี้ยวใหม่: `steerCtl` ค้างค่าตามผู้เล่น (สไลเดอร์ปล่อยแล้ว knob ไม่คืนกลาง · lean=steerCtl*LEAN_MAX ตรงๆ ไม่ผูกความเร็ว · A/D ค่อยๆ ปรับ ±1.6/วิ ปล่อยคีย์ค้าง) วิ่งตรง=เลื่อนกลับกลางเอง · ยืนยัน browser: segHw 8.1 / knob ค้าง 76% เอียงค้าง 30° เลี้ยวต่อเนื่อง 3 วิ / กลับกลาง=0.5° / คีย์ D ผ่าน / ไม่มี error · deploy `.290` · ค้าง: ผู้ใช้ลองจริง (ฟีลอาจต้องจูน — ถ้าคุมยากไป ค่าปรับอยู่ที่ 1.6*dt กับ *2.4 ใน setSteer)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 298:** 🏍️ **จูนเลี้ยวหนืดขึ้น** (ผู้ใช้: ไวไป) — moto3d.js: yaw ตัวคูณ 1.5→0.85 (เลี้ยวช้าลง 46% ยืนยันด้วย step: 1.68→0.91 rad/1.5วิ) · สปริง lean 10*dt→6*dt + damp exp(-6)→exp(-5) (คืนตัวนุ่ม overshoot เล็กน้อยแบบรถจริง) · คีย์ A/D 1.6→1.0/วิ · สไลเดอร์ตัวคูณ 2.4→2.05 · deploy `.291` · ค้าง: ผู้ใช้ลองจริง (จูนต่อได้ที่ 4 ค่านี้)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 299:** 🏍️ **เปลี่ยนภาพมอไซค์เป็น riderWithGlove.png** (คนขี่หมวกดำ+เป้ลายพราง — ผู้ใช้วางไฟล์) — trim+ย่อทับ `bike.webp` (520×750 77KB) + `<img src>` เพิ่ม `?v=299` bust cache ตามกฎรูป · ยืนยัน: โหลดจริง กึ่งกลาง-ชิดขอบล่าง · deploy `.292` ยืนยัน HTTP 200


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 300:** 🟠 **ไฟเลี้ยวกะพริบบนภาพมอไซค์** (ไอเดียต่อยอด ผู้ใช้อนุมัติ "ทำได้เลย") — moto3d.js: ห่อ img ใน `#moto-bikewrap` (transform+คลาสย้ายมาที่ wrapper) + `.m-tl` จุดเรืองแสง radial ซ้อนไฟส้มในภาพ (พิกเซล y63 x36/64 → CSS top57.5 left29.5/57.5 w13%) · เอียงเกิน ±0.12 → `sig-l/sig-r` กะพริบ keyframes `mblink` .7s · ยืนยัน browser: ขวา/ซ้าย/กลาง สลับคลาสถูก animationName=mblink · deploy `.293` · ค้าง: ผู้ใช้ลองจริง (ตำแหน่งไฟบนจอจริง)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 301:** 🏍️ **เลี้ยวนิ่ง Ride 4 + ถนนกว้าง ×2 + กำแพงขอบถนน** (ผู้ใช้สั่ง 3 ข้อ) — moto3d.js: (1) เลิกสปริง leanV → `lean+=(tgt-lean)*(1-exp(-3.5dt))` ไม่ overshoot (ยืนยัน step: ramp 1.7→29.8° ทางเดียว · คืน 28→0 ไม่เด้ง) (2) `ROAD_WIDE 1.8→3.6` (hw เฉลี่ย 9.7→19.45) (3) กำแพงขอบ: clamp ตำแหน่งเข้า `hw-EDGE_M(0.55)` ทุกเฟรม + ครูดขอบ spd×(1-1.5dt) ไถลตามการ์ดเรลได้ไม่ติดตาย + ribbon ขอบขาวรองใต้ถนน (+1m/ฝั่ง y.12) — ยืนยัน: เลี้ยวเต็ม 10 วิ d สูงสุด −0.55 ไม่หลุด · ตรง 108-115 กม./ชม. ปกติ · ขอบขาวเห็นจริง (readPixels 0.61%) · ไม่มี error · deploy `.294` · ⚠️ ผลข้างเคียง: ขี่เข้าลานโรงเรียน (รอบ 295) ไม่ได้แล้ว — ถ้าผู้ใช้อยากได้คืน ต้องเจาะช่องขอบตรงหน้าโรงเรียน · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 302:** 🌤️ **ภาพจริงพื้นถนน+หญ้า+ฟ้าโลกมอไซค์** (ผู้ใช้เจนภาพตาม prompt Artifact แล้ววาง road/grass/sky.png ใน img/moterbike/) — แปลง webp (road/grass 512 · sky 1536 รวม 295KB) · moto3d.js: ถนนปูลาย UV พิกัดโลก (u=x/16 v=z/16 ทางแยกเนียน · minor tint ขาว/major เข้ม) · หญ้า repeat ทั้งผืน 64km · โดมฟ้า SphereGeometry ครึ่งบน r1400 MirroredRepeat x2 (ขอบภาพไม่ seamless) ตามผู้เล่นทุกเฟรม · fog เปลี่ยน 0x9fdcf7→0xcfe8f8 กลืนขอบฟ้าภาพ · ยืนยัน readPixels: เกรนถนน texVar 20.3 / หญ้าเขียว 25.9% / ฟ้า+เมฆ / ไม่มี error · deploy `.295` · ค้าง: ผู้ใช้ลองจริง (ความสวย/ความเนียนบนมือถือ)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 303:** 🚧 **เงามอไซค์ + หลักเขตทางขาว-แดง** (ไอเดียต่อยอด ผู้ใช้อนุมัติ) — moto3d.js: `#moto-shadow` วงรี radial ใต้ล้อ z1 นอก wrapper (ไม่หมุนตามรถ) เอียง=เลื่อน lean*14% + scaleX ลด · หลักเขต: InstancedMesh ต้นขาว+หัวแดง POST_N=400 `postTick()` ทุก 1 วิ วางตามขอบถนน (hw+0.9) ทุก POST_SP=42m รัศมี 380m deterministic ตามเส้น ไม่สุ่ม · เว้นจุดทับถนนอื่น (roadInfo d<.4) · ยืนยัน: posts 38→56 ตอนขับ / เงา transform ตอบ lean / readPixels เจอหัวแดง 2 ฝั่งถนน / 0.83ms/เฟรม / ไม่มี error · deploy `.296` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 304:** 🛞 **ล้อหมุน** (ผู้ใช้สั่ง "ยางให้ดูเหมือนล้อหมุน") — moto3d.js: `.m-wheel` ellipse ซ้อนหน้ายางใน bikewrap (พิกเซลจริงวัดด้วย PIL: x37-63% y73.5-84%) repeating-gradient period 22px + blur .6px · frame(): `wheelOff+=spd*dt*90` set backgroundPosition + opacity `min(.8,spd*.05)` (จอด=0 มองไม่เห็น) · ยืนยัน browser: จอด op0 / 115กม.ชม. op.8 bp วิ่ง / rect ตรง 37/73.5/26/10.5% / ไม่มี error · deploy `.297` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 305:** 💨 **ควันท่อ + เส้นสปีด** (ไอเดียต่อยอด ผู้ใช้อนุมัติ) — moto3d.js: `.m-smoke` ก้อนควัน radial spawn ใน bikewrap ปลายท่อคู่ (ซ้าย20%/ขวา80% y71%) ทุก 90ms ตอน thr สลับข้าง `--dx` พุ่งออก 0.8s ลบตัวเอง **cap 12 ก้อน** · `#moto-speedfx` ::before/::after แถบเส้นวิ่งลง 2 ฝั่งจอ mask จางเข้ากลาง opacity=`(kmh-90)/45` max .8 · ยืนยัน browser: จอด 0 ควัน/115กม.ชม. fxOp .56 ควัน 12/ปล่อยคันเร่งดับหมด/ไม่มี error · deploy `.298` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 306:** 🔊 **เสียงเครื่องยนต์จริง** (ผู้ใช้อัด `sound/MotorbikeSound.m4a` 15นาที มือถือ — ห้าม commit ไฟล์ต้นฉบับ/sound ทั้งโฟลเดอร์ มี github-recovery-codes.txt) — วิเคราะห์ RMS+spectral centroid (numpy+imageio-ffmpeg ติดตั้งแล้ว) เลือกช่วงนิ่งสุด: idle 248.7s / cruise 129.2s / accel 377.2s / decel 393.7s → กรอง 60Hz-7.5kHz ตัดลม/ซ่า · 16kHz mono · ลูป bake crossfade 80ms → `sound/moto/eng_*.wav` รวม 540KB · moto3d.js: แทน Eng สังเคราะห์ทั้งก้อน = ลูป idle↔cruise crossfade `mix=spd/7` + cruise pitch `.8+(spd/VMAX)*.55` + one-shot accel/decel ที่ขอบ thr (decel เฉพาะ spd>8) · ยืนยัน browser: 4 buf โหลด/gain สลับตาม spd/rate ไต่/shots ยิงตรงขอบ/ไม่มี error · **⚠️ Eng.tick เช็ก running — เทสต์ต้อง T.running=true** · deploy `.299` · ค้าง: ผู้ใช้ฟังจริง (ความดัง/สมดุลปรับได้ที่ gain .75/.55/.35 กับ shot .85/.75)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 307:** 🔉 **หรี่เสียงปล่อยคันเร่งมอไซค์** (ผู้ใช้: ดังเหมือนเสียงรบกวน) — moto3d.js Eng.tick: `shot('decel',.75→.3)` · ยืนยัน browser: ปล่อยคันเร่งที่ 115กม.ชม. → decel ยิงที่ v=0.3 (accel ยังคง .85) ไม่มี error · deploy `.300` · **หมายเหตุ:** ผู้ใช้เคยสั่งให้เอาเสียงมอไซค์ไปใส่โลกขับรถ (adventure3d) แต่**ยกเลิก**แล้ว — โลกขับรถใช้ CarSound สังเคราะห์เดิม (adventure3d.js diff เหลือแค่ navLine รอบ 286 ที่ค้างมาก่อน ไม่เกี่ยวเสียง)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 307b:** 🔊 **เสียงเร่งเครื่องมอไซค์ช่วงสะอาด** (ผู้ใช้: accel มี noise จริงติดมา เดินเบา/decel โอเคแล้ว) — วิเคราะห์ spectral flatness ทั้งไฟล์ (feat3.npy): accel เดิม 377.2s flatness 0.013-0.047 = broadband noise · หาช่วงเบิ้ลรอบสะอาด → **93.65s** (centroid 296→445 ไต่เรียบ 2.05s flatness 0.0008 เท่า idle) ตัดใหม่ทับ `eng_accel.wav` 64KB · **⚠️ .wav = sw cache-first (sw.js:69)** → บัมพ์ URL `eng_accel.wav?v=307` ใน ENG_FILES กันเครื่องเก่าติดไฟล์เดิม · ยืนยัน browser: buf 2.05s / ZCR 469Hz (ฮาร์มอนิก ไม่ใช่ซ่า) / ยิงตอน thr / ไม่มี error · deploy `.301` · **เครื่องมือ:** moto.npy(raw) + feat3.npy(db/cen/flat) ใน scratchpad — หาเสียงช่วงอื่นใช้ flatness เป็นเกณฑ์ noise ได้


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 308:** 🔘 **ปุ่มเร่งยุบ/เด้ง** (ผู้ใช้: ปุ่มวงกลมขวาให้เหมือนถูกกดลง+คลายตัวตอนปล่อย) — moto3d.js CSS: `#moto-throttle.pressing` = `scale(.84)`+เงา inset จม+ไอคอนเลื่อนลง · กด snap เร็ว (.08s ease-out) ปล่อยเด้งสปริง (.2s bezier overshoot) · frame() `thrEl.classList.toggle('pressing',!!thr)` ครอบทั้งแตะ+คีย์ W · ยืนยัน (ปิด transition วัดค่าปลายทาง เพราะแท็บ throttle): กด scale .84 เงา .45 inset ไอคอน translateY+ย่อ / ปล่อย scale 1 เงา none / ไม่มี error · deploy `.302`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 309:** 🎛️ **knob ยกนูน+haptic · LED เทอร์โบ · ย้ายคำศัพท์กลางจอ** (ผู้ใช้สั่ง 2 ข้อ) — moto3d.js: (1) `#moto-knob.grab` ยก translateY-6%+scale1.06+เงาลึก เพิ่มตอน pointerdown สไลเดอร์ + `navigator.vibrate(15)` (2) `#moto-throttle::after` วง LED ฟ้า opacity=`var(--charge)` · frame() charge `+dt/1.4` กดค้าง/`-dt*3` ปล่อย · เต็ม→`.charged` keyframes `mturbo` เต้น (3) `#moto-word` มุมบนซ้าย→กลางบน `left:50% top:9%` chip 3.6→5.2vmin+คำแปล 3vmin+พื้นเข้มโปร่ง · **ย้าย GPS ไปบนซ้าย** (เดิมกลางบน ชนคำ) · ยืนยัน browser 1000×640+812×375: คำ center 50% top9% inScreen ไม่ทับ GPS · คำ 9 ตัวwrap 2 แถวไม่ล้น · charge 0.12→เต็ม1.0→charged→คาย0 · knob grab on/off · ไม่มี error · deploy `.303`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 310:** 🔉 หรี่เสียงปล่อยคันเร่งมอไซค์อีกครั้ง (ผู้ใช้ขอ) — moto3d.js Eng.tick `shot('decel',.3→.1)` · ยืนยัน browser: ปล่อยที่ 115กม.ชม. decel ยิง v=0.1 (accel คง .85) · deploy `.304`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 311:** 🔤 **คำศัพท์ไม่ตกบรรทัด** (ผู้ใช้ส่งภาพ NEGOTIATE ตัว E ตกแถวล่าง) — moto3d.js: `#moto-word` เป็น column · `.m-chips` flex `nowrap`+`.m-chip{flex:none}` (อักษรแถวเดียวเสมอ) · คำแปลไทยย้ายบรรทัดล่าง (เลิก margin-left) · `renderWordHud` ห่อ chips ใน `.m-chips` + เรียก `fitWord()` · `fitWord()` วัด offsetWidth เทียบ screen*0.96 → `scale(k)` ย่อถ้าเกิน (transform-origin top center คงกลาง) เรียกใน fit() ตอน resize ด้วย · ยืนยัน browser 1000×640+812×375: negotiate(9)/extravagant(11)/responsibility(14) แถวเดียว scale 1.0 กลาง 50% ไม่ล้น · คำ 24 ตัว scale 0.67 ยังแถวเดียวไม่ล้น · ไม่มี error · deploy `.305`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 314:** 🔤 **ตัวอักษรเลนซ้าย + ใหญ่ขึ้น** (ผู้ใช้: ห้ามอยู่กลาง อยู่เลนซ้ายเท่านั้น + ตัวใหญ่กว่านี้) — moto3d.js `randomRoadPoint` (ใช้ทั้ง spawnLetters+relocTick): เยื้องจากกลางถนนเข้าเลนซ้าย `lane=min(hw*.55,3.6)` ทิศซ้าย=`(-fz,fx)` โดย fx,fz จัดให้ชี้ออกจากผู้เล่น (ซ้ายตอนขับเข้าหา) · sprite scale 3→4.6 y1.7→2.3 · `COLLECT_R 2.8→3.6` · ยืนยัน browser: 6 ตัว distFromCenter=3.6 leftDot=+3.6(ซ้ายล้วน) scale4.6 · ขับในเลนซ้ายเก็บได้ / ขับกลางถนนเก็บไม่ได้ (ต้องอยู่เลนซ้าย) · ไม่มี error · deploy `.307`
- **รอบ 312-313:** 🏍️ **โลกมอไซค์ 5 งาน** (ผู้ใช้สั่ง · ข้อ 5 ถอนภายหลัง) — moto3d.js: (1) เส้นประขาวกลางถนนแบ่งเลน `posLine` วาดตามระยะสะสม `dashAcc` (DASH_LEN4/GAP5/W.28) — คิดทั้งเส้นกัน segment โค้งสั้นกลายเป็นทึบ (2) `VMAX 32→55.6`(=200กม./ชม.)+`ACCEL 10→13` (cap แบบ decay 14/วิ ไม่ใช่ snap → เร่งจริงเสถียรที่ 200) (3) 🐕 `makeDog/spawnDog/dogTick/dogHit` — หมากล่องน้ำตาลโผล่ข้างถนนหน้ารถ 25-55m วิ่งตัด DOG_SPD11 ทุก ~9-15วิ(spd>6) ชน<2.7m ปรับ `DOG_HIT_COIN500` (clamp ไม่ติดลบ)+banner+haptic (4) 🧭 GPS: ป้ายเปลี่ยนเป็น column—บรรทัดบน label "ตอนนี้คุณอยู่ห่าง…" + แถวล่างลูกศร **SVG ชี้ขึ้น(=หน้า) มีก้าน**ชัด+ตัวเลข · rotation=`rel=atan2(dx,dz)-yaw` (ยืนยัน gpsTick isolated: หน้า0/ขวา+90/ซ้าย-90/หลัง180 เป๊ะ) (5) 🛣️ **ถนนเส้นตรงต่อกัน→โค้ง** `smoothPts()` Chaikin 2รอบ เก็บปลาย (ต่อทางแยกไม่หลุด) เฉพาะ≥3จุด · segs 9330→38067 build 512ms 2.46ms/เฟรม · **⚠️ ข้อ 5 (เตือน>100m/respawn 200m) ผู้ใช้สั่งถอน — คืนค่าเดิมหมด (SPAWN 110/430)** · ยืนยัน browser: ถนนเรนเดอร์ 48% เส้นประ 2.6% หมา spawn ได้ ไม่มี error · deploy `.306` · ค้าง: ผู้ใช้ลองจริง (ความสวยเส้นโค้ง+เจอหมา+ความเร็ว)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 315:** 🕳️⛰️ **หลุม/เนิน + เหิน + สปริง + เสียงกระแทก** (ผู้ใช้สั่ง 3 ข้อ ~60% เส้นทาง) — moto3d.js: **ภูมิประเทศ** `feats[]`+`featBuckets` วางตามถนน `genFeatures` ทุก FEAT_SP=16m โอกาส 0.9 (เนิน h+0.55-1.85 / หลุม h−0.4-0.95 · r5-9) · `terrainAt(x,z)` cos-falloff รวม feature ใกล้ (แฮช FEAT_CELL18) · `roadGroundY` = terrain ที่แนวกลางถนน · **buildRoads แยก 2 pass**: pass1 smooth+segs+buckets+features · pass2 geometry sample terrainAt ต่อจุด (ถนนยุบ/นูน 3D จริง · reuse ta/tB ครึ่ง terrainAt) · **ฟิสิกส์ดิ่ง** frame(): airborne เมื่อ `followVY<prevFollowVY−GRAV*dt`&spd>5 · `bikeVY=min(prevFollowVY,LAUNCH_VMAX9)` (เพดาน~1.8m กันพุ่ง) · ลงพื้น impact>3.5 → เตะสปริง `suspV` + `Eng.thud()`(เบสตก+กรวด สังเคราะห์)+haptic · สปริง SUSP_K55/D9/KICK.22 damped · กล้อง+bikeY+suspY·.5 · bikeEl scaleY squash · เงาเล็ก/จางตอนเหิน · reset ใน start() · ยืนยัน browser: coverage 61% / feats 119k / build 2.06s (ครั้งเดียว) / **perf 0.5ms/เฟรม** / เหิน maxY1.86 / susp .115 / thud ยิง / ถนนยุบ+1.4 หลุม−0.88 / road 49.8% เส้นประ 2.19% / ไม่มี error · deploy `.308` · ค้าง: ผู้ใช้ลองจริง (ฟีลเหิน+เสียง+ความหนาแน่นหลุม)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 316:** 🛣️ **คืนถนนแบน + หลุม/เนิน 10% + decal** (ผู้ใช้: เส้นขาว/หญ้าไม่แนบพื้นถนน + ลดเหลือ 10%) — ต้นตอ: รอบ 315 ยุบ/นูน mesh ถนน → ขอบถนนลอยเหนือหญ้า/ทะลุใต้หญ้า + เส้นประไม่แนบ · แก้: **buildRoads pass2 คืนแบนราบ** (yb/0.12/0.21 คงที่ ไม่ sample terrainAt) เส้นขาว+หญ้าแนบสนิท · `FEAT_FILL 0.9→0.10` (~10%) · **ยังคงฟิสิกส์เหิน/สปริง/thud เดิม** (terrainAt เป็น "ภูมิ invisible" ขยับแค่รถ+กล้อง — กล้อง base +2.6 สูงพอ ตกหลุม -0.95 ไม่ทะลุถนน) · เพิ่ม **decal ภาพหลุม(วงมืด+ก้อนหิน)/เนิน(mound น้ำตาล)** `makeDecals`/`decalTick` pool 48 ใบ PlaneGeometry แบนราบ y0.2 polygonOffset รีไซเคิลรอบผู้เล่น 110m (ทุก 450ms) แปะที่ feature · ยืนยัน browser: ถนน 50% เส้นขาว 2.67% หญ้า 11.8% แนบ · feats 13k coverage ~10% · เหิน/thud/decal โผล่(y0.2 scale ตรง feature) · build 560ms perf 1ms · ไม่มี error · deploy `.309` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 317:** 🪙🚗 **เหรียญ+โบนัสตัวอักษร + รถยนต์มาเล่นแผนที่บ้านโพธิ์สวัสดิ์ร่วมกัน** (ผู้ใช้สั่ง 4 ข้อ) — moto3d.js: (1) เก็บตัวอักษร **+🪙1 ทันที** (`LETTER_COIN`) + ป้ายลอย `.m-cfx`/วงประกาย `.m-cring`/`#moto-coins.pop`/`sfx.coin`/สั่น (2) **เหรียญทอง ★ บนถนน 120 เหรียญ** รอบผู้เล่น (`makeCoins`/`coinTick` pool รีไซเคิลรัศมี 320m เติม 12/400ms · เก็บได้ 🪙1) (3) **โหมด `vehicle:'car'`** — `MotoWorld.start({vehicle:'car'})` ซ่อนสไปรต์มอไซค์ โชว์รถ 3D (`makeVehicle`) กล้องถอย 8.4/สูง 3.2 เอียงแค่โคลง · ui.js `pickDriveMap()` หน้าเลือกแผนที่ใน `enterDrive3D` + `enterMotoMapAsCar()` (ตั๋วขับรถ+มีรถพอ ไม่ต้องมีตั๋วมอไซค์) · **เกิดหน้าโรงเรียนไม่ซ้อนทับ** `spawnSlot()` ไล่ช่องถอยตามแนวถนนทีละ 9m สลับเลน + เช็กซ้ำที่ 1.2 วิ (4) **เพื่อนใน `/world/moto`** เห็นยานพาหนะตรงกับที่แต่ละคนขับ (ส่งผ่าน field `av`='moto'/'car' — ไม่มี field ใหม่) · ยืนยัน browser: เหรียญ on 120 · เก็บ +1 (5000→5001) HUD/fx/ring/pop ครบ · ตัวอักษร F +1 · โหมด car ซ่อนมอไซค์+รถโชว์ yaw ตรง · peer car 10 ชิ้น/moto 8 ชิ้น + ป้ายชื่อ · สลับพาหนะกลางคันได้ · spawnSlot เลี่ยงคนยืน 18m · dialog จอเตี้ย 812×375 ไม่มี scroll · 0.32ms/เฟรม ไม่มี error · deploy `.310` · **⏳ ค้าง: ผู้ใช้ publish rules เพิ่ม `$map==='moto'`** (ยังไม่ publish = เล่นคนเดียวปกติ แค่ไม่เห็นเพื่อน) — Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/fadad014-9d4e-4397-b4c7-2145829b2a1b


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 318:** 🏆💬💎 **ต่อยอดโลกมอไซค์ 3 อย่าง** (ผู้ใช้: "ทำต่อยอดได้เลย") — moto3d.js: (1) **กระดานคะแนนสด** `#moto-board` ขวาบน (`renderBoard()` เรา+เพื่อน เรียงตามคำรอบนี้ Top5 · ใช้ field `w` เดิม · วาดใหม่เมื่อ sig เปลี่ยน) (2) **แชทลอยหัว** ปุ่ม `#moto-chat` 💬 + `CHAT_PRESETS` 8 ข้อความสำเร็จรูป (ไม่มีช่องพิมพ์ = ไม่ต้องกรองคำหยาบ) ส่งผ่าน field `c`/`ct` เดิม · `showPeerBubble` สไปรต์ป้ายคำพูดติดกับ group เพื่อน 5 วิ · ของตัวเองโชว์ `#moto-selfmsg` ล่างจอ (3) **เหรียญพิเศษ** `COIN_TIERS` ★ทางตรง🪙1 / ◆ทางโค้ง🪙5 / 💎หลุม-เนิน🪙20 (สีเทกซ์เจอร์+ขนาด+เสียงต่างกัน · เพชรมี banner) — **ต้นตอที่ต้องรู้: สุ่มจุดถนนแบบเดิมตกบน "ช่วงตรงยาว" เกือบตลอด** (จุดสุ่มถ่วงตามพื้นที่ · median seg len 42m curv~0.04) → เก็บ `seg.curv` ตอน build (มุมหักกับ segment ถัดไปในถนนเส้นเดียวกัน) + `curvyRoadPoint()` ไล่ segment จาก bucket โดยตรงทุก 6 ใบ · ได้สัดส่วนจริง 93/24/3 (ทอง/โค้ง/เพชร) · แก้ HUD ชนกัน: chatbar กึ่งกลางกว้าง 50% (พ้นมินิแมพซึ่งเป็น vmin) + `#moto-gps` max-width 30vmin→26% · ยืนยัน browser: เก็บครบ 3 ระดับ (+1/+5 "โค้งสวย!"/+20 "เหรียญเพชร!"+banner) · กระดานเรียง 🥇เพื่อนบี5 🥈เพื่อนเอ2 🥉เรา · ครบคำแล้วกระดานขึ้นเป็น 1 · แชทส่งได้ + เพื่อนพูดขึ้นป้าย y4.1 + ct ซ้ำไม่เด้งซ้ำ · **1000×640 และ 812×375: HUD ไม่ชนกันเลย ไม่หลุดจอ** · 0.87-1.5ms/เฟรม ไม่มี error · deploy `.311` · ค้าง: ผู้ใช้ลองจริง 2 เครื่อง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 319:** 👻 **ผีโลกผีสิงโผล่ครั้งละ 3 วิ** (ผู้ใช้สั่ง) — adventure3d.js `MODES.haunt.ghostLife 20000→3000` · `tickGhosts` fade เดิม 600ms คงที่ (=40% ของอายุใหม่ จะจางเกือบตลอด) → `fade=min(600,ghostLife*.12)`=360ms · แก้ข้อความ intro + comment "20 วิ"→"3 วิ" · HUD นับถอยหลัง/respawn ใช้ M.ghostLife อยู่แล้วไม่ต้องแตะ · ยืนยัน `node --check` ผ่าน · deploy `.312` · ค้าง: ผู้ใช้ลองจริง (ผีเปลี่ยนที่ถี่ขึ้นมาก ~7 ตัว/3 วิ — ถ้าหลอนเกิน/น้อยไปบอกปรับได้)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 320:** 🐾 **แตะตัวน้องในล็อบบี้แล้วเข้าหน้าโปรไฟล์ได้** (ผู้ใช้: ตอนสัตว์ขยายขนาดคลิกเข้าโปรไฟล์ไม่ได้) — **ต้นตอจริง: handler `#pet-tap` เรียก `petPatFx()` ที่ไม่เคยถูกนิยามในโค้ดเลย** (grep เจอที่เดียว) → ReferenceError ทุกครั้งที่แตะน้อง ทุกขนาด/ทุกร่าง บรรทัดถัดไปเลยไม่ทำงาน = แตะแล้วเงียบ · แก้ ui.js:2971 เป็น `heartsFx(tap,3)` (ตัวเดียวกับฉลองรักษาหาย) + `setTimeout(...,200)` เปิด `openPetInfoOverlay()` (กันซ้อนด้วย `window.__piOverlay`) · ยืนยัน browser 1000×640 giant 0/3/4: คลิกโดนตัวน้อง → หัวใจ 3 ดวง + โปรไฟล์เปิด 1 ใบ มีรูปใหญ่ `.pi-portrait` · คลิกพื้นเวทียังเปิดแผงแรงค์เหมือนเดิม (ไม่เด้งโปรไฟล์) · deploy `.313` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 321:** 🔎 **เอากล่องค้นหาพจนานุกรมออกจากหน้า Lobby** (ผู้ใช้ส่งภาพชี้ `.dict-box` ในแถวแท็บน้อง) — ui.js `renderPetTabs` ตัด `<div class="dict-box">` + listener `dict-input`/`dict-go` ทิ้ง (แถวเหลือแท็บน้อง/➕/🍚) · `openDictOverlay()` + ช่องค้นในตัว overlay (`#dict-input-ov`) ยังใช้ได้ปกติ (โค้ด sync `#dict-input` มี `if(li)` กันไว้แล้ว ไม่พัง) · CSS `.pet-tabs .dict-box` ปล่อยไว้ (การ์ด `.dict-card` ยังใช้ `.dict-box` อยู่) · ยืนยัน browser: ไม่มี dict-box/dict-input ในล็อบบี้ · แถวแท็บสูง 34px ปกติ · เปิด dict overlay ไม่มี error · deploy `.314`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 322:** 🐾🔊🕵️ **แตะน้องมีเสียง + ลูบยาวได้ EXP + tool ตรวจ "ฟังก์ชันผี"** (ผู้ใช้เลือก 3 ข้อ) — (1) util.js `sfx.petVoice(type)`/`petVoiceSynth` สังเคราะห์ WebAudio: แมว=เหมียว (saw 520→760→430 + lowpass ปิดลง) · หมา=โฮ่ง 2 พัลส์ (square 300→140 + noise) · มังกร=คำรามต่ำ (saw 110→78 + noise) · ชนิดใหม่ตกไป beep กลาง (2) ui.js `bindPetTap(tap,p)` ใช้ pointer event — แตะสั้น=ร้อง+เด้ง+หัวใจ3+เปิดโปรไฟล์ · **กดค้าง `PAT_HOLD_MS`=800ms = ลูบยาว** หัวใจ10+สั่น+`addExp(PAT_EXP=12)` วันละครั้งต่อตัว (`p.patDay`, state.js เพิ่ม field) ไม่เปิดโปรไฟล์ · ⚠️ ห้ามเรียก renderDashboard ตอนนิ้วยังจิ้ม (DOM ใหม่กลางคัน → pointerup หลุด) (3) **`tools/check_undefined_calls.py`** สแกนเรียกฟังก์ชันที่ไม่มีนิยาม (บั๊กแบบ petPatFx รอบ 320) — ต้องตัด comment/string/**regex literal**/template แต่เก็บโค้ดใน `${}` ไว้ (ไม่งั้นกลืนไฟล์ทั้งก้อน) · เก็บนิยามจาก js/data+vendor ด้วย แต่ตรวจการเรียกเฉพาะ 16 ไฟล์เกม · **ผลรัน: 0 จุด** · self-test (ใส่ ghost fn ชั่วคราว) จับได้จริง · ยืนยัน browser: cat/dog/dragon เสียงต่างกันจริง (ดัก oscillator) · แตะสั้น→โปรไฟล์เปิด · ค้าง 1 วิ→EXP 0→12 + toast · ค้างซ้ำ→ไม่ได้ EXP ซ้ำ+toast บอก · ลากออก (pointerleave)→ไม่เปิดอะไร · ไม่มี error · deploy `.315`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 323:** 🚧🐾🎭 **ด่านกันฟังก์ชันผีตอน deploy + เข็มเพื่อนซี้ + เสียงร้องตามอารมณ์** (ผู้ใช้สั่ง 3 ข้อ) — (1) `tools/deploy_firebase.sh` รัน `check_undefined_calls.py --path "$STAGE/public"` **กับสำเนา staged (git HEAD) หลัง git archive** = ตรงกับของที่ผู้เล่นได้เป๊ะ · scanner คืน **exit 2** เมื่อเจอ → `set -e` หยุด deploy + ลบ stage (ทดสอบจริง: ใส่ ghost fn → exit 2 บล็อก · เอาออก → exit 0) · ถ้าเป็น global ไลบรารีให้เติมใน `BUILTINS` (2) 🐾 **เข็มเพื่อนซี้** — `patStreakTick(day)` ui.js นับ**วันละครั้ง ระดับผู้เล่น** (ลูบตัวที่ 2 ของวันเดิมไม่นับซ้ำ) · ต่อจากเมื่อวาน=+1 · ขาดวัน=รีเซ็ตเป็น 1 **แต่เข็มไม่หาย** · `BFF_TIERS` 7=🐾+🪙500 / 30=💞+🪙2000 / 100=🫶+🪙8000 (game.js · `bffEmoji` เข้า `badgeSuffix()` ท้ายชื่อ + แถวในตู้เข็ม `bffHtml` โชว์สตรีค/ดีสุด/อีกกี่วัน — **เข็มถัดไปเลือกจาก `t[1]>bffBadge` ไม่ใช่ `bffNow<t[0]`** ไม่งั้นสตรีคขาดแล้วโชว์เข็มที่ได้ไปแล้ว) · state.js เพิ่ม 4 field + migration (3) 🎭 **เสียงตามอารมณ์** `petVoiceSynth(type, mood)` + `PET_MOOD` ตัวคูณ 3 ตัว (pitch/ดัง/ยาว): happy 1.12/1.15/.88 · hungry .86/.72/1.25 · sick .74/.55/1.45 · sleep .8/.4/1.1 · หมาป่วย/หลับเห่าครั้งเดียว (ไม่มีแรงเห่ารัว) · `petMood(p)` ui.js เรียง ป่วย>หลับ>หิว>อิ่มดี · ยืนยัน browser: ความถี่/gain จริงต่างกันครบ 4 อารมณ์ (582/.138 → 447/.086 → 385/.066 → 416/.048) · ลูบวันที่ 7 → streak 7 + เข็ม 🐾 + เหรียญ 1000→1500 + แบนเนอร์ฉลอง + badgeSuffix "🐾" · ลูบซ้ำวันเดิม=null · ขาด 3 วัน→รีเซ็ต 1 เข็มยังอยู่ · scanner 0 จุด · deploy `.316`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 324 (ด่านใหม่จับได้ทันทีวันแรก):** 🚨 **`js/data/word_new.js` ไม่เคยถูก commit → เว็บจริง 404 มานาน** — index.html โหลดไฟล์นี้ แต่ deploy ใช้ `git archive HEAD` → ไฟล์ไม่ขึ้นเว็บ → `newWordPool()` (ui.js:164) ReferenceError บน live = แถบ 🆕 New Word หน้า Lobby พังเงียบสำหรับผู้เล่นจริง (ในเครื่อง dev ปกติดี เลยไม่มีใครเห็น) · **ด่านตรวจก่อน deploy รอบ 323 บล็อก deploy ให้เอง** → commit ไฟล์ (95 บรรทัด ข้อมูลล้วน) แล้ว deploy ผ่าน · ยืนยัน live: `word_new.js` 200 (เดิม 404) · version `.316` · 💡 บทเรียน: ไฟล์ใหม่ที่ index.html อ้าง **ต้อง commit** ไม่งั้นขึ้นเว็บไม่ได้ (เจอซ้ำกับ img/anim/*.webp มาแล้ว)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 325:** 📦📅🐾 **ด่านไฟล์ขาด + ปฏิทินลูบ 30 วัน + ทักทายน้องข้ามเครื่อง** (ผู้ใช้สั่ง 3 ข้อ) — (1) **`tools/check_missing_assets.py`** อ่าน src/href ทุกตัวใน `*.html` เทียบกับไฟล์จริงในชุด staged → `deploy_firebase.sh` เรียกก่อนด่าน scanner (exit 2 = หยุด) · โหมด `--git` เช็ก "มีในเครื่องแต่ยังไม่ commit" ได้ด้วย · ทดสอบ: ลบ word_new.js จาก stage → exit 2 (2) 📅 `state.patDays` เก็บวันลูบ 30 วันล่าสุด + `patCalendarHTML()` จุด 30 ดวงในหน้าโปรไฟล์น้อง (ทึบ=ลูบแล้ว · วงฟ้า=วันนี้) + หัวข้อสตรีค/ดีสุด/เข็ม · CSS `.pi-streak/.pi-dots` ใช้ clamp+vh ทั้งหมด (3) 🐾 **ทักทายน้อง** — ปุ่ม `.pl-greet` ในการ์ดโปรไฟล์เพื่อน → `openGreetPicker` เลือก 1 ใน `GREETS` 6 คำสำเร็จรูป (ไม่มีช่องพิมพ์ = ไม่ต้องกรองคำหยาบ) · `greetSend()` online.js ใช้**ท่อของขวัญเดิม** `/gifts/<to>/<from>` k='greet' (ไม่มีโซน/field ใหม่) · จำกัด **คนละ 1 ครั้ง/วัน** (`state.greetSent`) · ผู้รับ: `acceptGift` แยกเคส greet → ไม่เข้าห้องของขวัญ แต่ `addExp(GREET_EXP=8)` + `showGreetReveal` (น้องร้องเสียง happy + หัวใจ 6) · **✅ ผู้ใช้ publish rules แล้ว 18 ก.ค. (ตรวจ rules สดผ่าน CLI: `k` รับ 'greet' จริง + ทั้งไฟล์ตรงกับ RULES.md ครบ 19 โซน + ของค้างเก่า ba/hs/chattheme/typing ติดมาครบ)** → ปุ่ม 🐾 ใช้งานได้จริงแล้ว · ค้าง: ทดสอบ 2 เครื่องจริง (A กด 🐾 → B เห็นในกล่องของขวัญ กดรับแล้วน้องได้ EXP) · ยืนยัน browser: จุด 30 ดวง on 4 today 1 · โปรไฟล์ที่ **812×375 ไม่มี scroll** (353/353 อยู่ในจอครบ) · แผงคำทัก 6 ปุ่ม ไม่ล้น · ส่งแล้วบันทึกวัน + กดซ้ำวันเดิมโดนกัน · ฝั่งรับ EXP 0→8 + ฉากดีใจ + ไม่เข้ากล่องของขวัญ · ไม่มี error · deploy `.317`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 326:** 🆕 **ย้ายแบนเนอร์ New Word ขึ้นบนสุด กึ่งกลางภาพ Rank + เปลี่ยนคำทุก 2 นาที** (ผู้ใช้ส่งภาพ+สั่ง) — index.html: `#newword-banner` ขึ้นก่อน `#pet-tabs` · **`alignNewWord()`** วัดกึ่งกลาง `.stage-hero` เทียบ `.lobby-stage` → `--nw-left` + `transform:translateX(-50%)` (เวทีอยู่คอลัมน์ขวา ไม่ใช่กลางจอ · หารด้วย scale แบบ alignPetTabs) — **⚠️ ต้องเรียกหลังการ์ดน้องถูกสร้าง**: `renderNewWord()` ถูกเรียกที่ ui.js:2759 ตอน `.stage-hero` ยังไม่มีในหน้า → วัดไม่ได้ (เจอจริง: เหลื่อม 93px) เลยเรียกซ้ำท้าย renderDashboard + `requestAnimationFrame` + on resize · **คิวคำไม่ซ้ำ** `newWordNext()` + `state.nwQueue` (สลับทั้งพูลแล้วหยิบทีละคำ · หมด=สลับใหม่วนต่อ · กรองคำนอกพูลออกเมื่อเปลี่ยนระดับชั้น) + `state.nwAt` · **`startNewWordTimer()` เช็กทุก 5 วิ** (ไม่ใช้ setTimeout 2 นาทีเดียว — เครื่องหลับ/สลับแท็บกลับมาแล้วคำเปลี่ยนตามเวลาจริง) เปลี่ยนเมื่อครบ `NEW_WORD_MS=120000` **เฉพาะตอน `#screen-dashboard` active** · `.nw-swap` วาบตอนเปลี่ยน (เคารพ no-anim) · ยืนยัน browser 1000×640 + 812×375: อยู่เหนือแถวชื่อสัตว์ · **ห่างจากกึ่งกลาง Rank = 0px** ทั้ง 2 ขนาดจอ · วน 3 รอบพูล (12 คำ) ไม่ซ้ำในรอบเดียวกันเลย + ลำดับแต่ละรอบต่างกัน · ครบ 2 นาที คำเปลี่ยนเอง + วาบ · อยู่หน้าอื่นคำไม่เปลี่ยน · ไม่มี error · deploy `.318`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 327:** 🪙 **อ่านคำใหม่ได้ 1 เหรียญ + เสียง/ภาพเหรียญเข้าชัดเจน** (ผู้ใช้สั่ง) — ui.js `newWordReward()` **ให้คำละ 1 เหรียญ** ยึด `state.nwPaidAt === state.nwAt` (nwAt = เวลาที่คำขึ้น = ตัวระบุคำ) → กดรัวคำเดิมไม่ได้เหรียญซ้ำ แต่คำใหม่ทุก 2 นาทีรับได้อีก · **ภาพ:** `coinFlyFx()` เหรียญ 5 ใบบินจากแบนเนอร์ → กระเป๋าเหรียญมุมขวาบน (คำนวณ `--dx/--dy` จาก `getBoundingClientRect` ทั้งต้นทาง/ปลายทาง — **ยืนยันปลายทางตรงกลางตัวเลขเหรียญคลาดเคลื่อน 0px**) + ป้าย `+🪙1` ลอยขึ้น + `.coin-pill.coin-pop` เด้งเรืองแสง + สั่น · ป้าย `🪙 +1` กะพริบบนแบนเนอร์ (รับแล้ว→`✅` จาง) + บรรทัดในป๊อปอัปบอกได้/รับไปแล้ว · **เสียง:** `sfx.coinGet()` util.js กรุ๊งกริ๊งไต่ 880→1175→1568 + ปิดท้าย 2093 (ยืนยันสร้าง oscillator 4 ตัวจริง) · ทุกเอฟเฟกต์เคารพ `html.no-anim` · ยืนยัน browser 1000×640 + 812×375: กดครั้งแรก 100→101 + fx ครบ · กดซ้ำไม่ขึ้น · คำใหม่กดได้อีก 101→102 · แบนเนอร์ยังตรงกลาง Rank 0px ไม่ล้นจอ · ไม่มี error · deploy `.319`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 328:** ⏳🐾 **นับถอยหลังบนแถบคำใหม่ + เตือนอ่อนๆ ตอนเย็นให้มาลูบน้อง** (ผู้ใช้สั่ง 2 ข้อ) — (1) `nwCountdownTick()` โชว์ `⏳ m:ss` จางๆ ในแบนเนอร์ + `.nw-bar/.nw-bar-fill` แถบเวลาบาง 2px ขอบล่าง (อัปเดตเฉพาะ textContent/width ไม่ render ใหม่ = ไม่กระพริบ) · `startNewWordTimer` เปลี่ยน interval 5 วิ → **1 วิ** (2) `patRemindTick()` หลัง `PAT_REMIND_HOUR=17` ถ้าวันนี้ยังไม่มีใน `state.patDays` → toast อ่อนๆ **วันละครั้ง** (`state.patRemindDay`) + `applyPatRemindGlow()` แสงส้มนุ่มที่ตัวน้องจนกว่าจะได้ลูบ — **⚠️ 2 หลุมที่เจอจริง:** (ก) ข้อความ toast เดิมมีคำ "ยังไม่ได้" ตรง `TOAST_WARN_RE` (util.js) → กลายเป็น toast แบบคำเตือน **ค้างจอรอกดปิด + เสียงเตือน + สั่น** ไม่ใช่เตือนอ่อนๆ → เปลี่ยนถ้อยคำเลี่ยงคำในลิสต์ (ข) ทาคลาส `.pat-remind` ตอน patRemindTick อย่างเดียวไม่พอ — `renderDashboard` เขียน `card.innerHTML` ใหม่แล้วคลาสหาย → ต้องเรียก `applyPatRemindGlow()` **หลัง** `bindPetTap` ทุกครั้ง · ยืนยัน browser 1000×640 + 812×375: นับถอยหลังเดินจริง (1:49→1:46) แถบโต 12.2% · ครบเวลาคำเปลี่ยน + รีเซ็ตเป็น 2:00/0.8% · toast เป็นแบบหายเอง (ไม่ใช่ toast-warn) เตือนครั้งเดียว/วัน · แสงติดทน rerender + หายทันทีที่ลูบ · แบนเนอร์แถวเดียว 33px ตรงกลาง Rank 0px · ไม่มี error · deploy `.320`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 329:** 🎯📒 **โบนัสอ่านครบ 10 คำ/วัน + เก็บคำที่อ่านเข้าสมุดคำศัพท์อัตโนมัติ** (ผู้ใช้สั่ง 2 ข้อ) — (1) vocabbook.js **`vbSeen(en,th)`** เพิ่มคำเข้า `state.vocabBook` โดย**ไม่แตะ c/w** (ต่างจาก `vbRecord` ที่นับถูก/ผิด) → คำอยู่กลุ่ม 🌱 `learn` และถูกหยิบเข้าข้อสอบทบทวนก่อนใคร (vbReviewCat เรียง "ฝึกน้อยสุดก่อน") · คำที่เคยตอบแล้วไม่โดนรีเซ็ตสถิติ (2) ui.js `newWordReward()` เรียก `vbSeen` + **`nwDailyTick()`** นับ `state.nwReadCount/nwReadDay` (นับเฉพาะคำที่ได้เหรียญจริง = คำละครั้ง) ครบ `NW_DAILY_GOAL=10` → `addCoins(NW_DAILY_BONUS=20)` + `celebrateBadge('📚',...)` + เหรียญบิน · กัน `state.nwBonusDay` รับซ้ำ · ป๊อปอัปเพิ่มแถบ `🎯 อ่านวันนี้ x/10` + บรรทัด 📒 บอกว่าเก็บเข้าสมุดแล้ว · **⚠️ เจอบั๊กเก่าติดมา: ป๊อปอัปคำศัพท์ล้นจอเตี้ยอยู่แล้วตั้งแต่ก่อนรอบนี้ (342/315 ที่ 812×375)** → `@media (max-height:520px)` จัดเป็น **2 คอลัมน์** (ซ้าย=คำ/คำอ่าน/ประโยค/คำแปล · ขวา=เหรียญ/เป้าหมาย/สมุด/ปุ่ม) + ฟอนต์ clamp → **พอดีจอ 299/299** ตามกฎ dialog · ยืนยัน browser: อ่าน 10 คำ → เหรียญ 0→30 (10×1 + โบนัส 20) + แบนเนอร์ฉลอง + สมุดมี 10 คำ กลุ่ม learn ครบ · คำที่ 11 ได้ +1 ไม่มีโบนัสซ้ำ · กดซ้ำคำเดิมไม่นับ · เปิดสมุดจริงเห็นคำ + ข้อสอบทบทวนพร้อม 10 ข้อ · จอ 1000×640 ยังเป็นคอลัมน์เดียวปกติ · ไม่มี error · deploy `.321`


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 319:** 🪙 **เหรียญผูกกับตัวอักษร** (ผู้ใช้สั่ง: ทองอยู่หลังตัวอักษร ตัวละ 1 · พิเศษอยู่หน้าตัวสุดท้ายของคำ) — moto3d.js: เลิกโปรยเหรียญสุ่ม 120 ใบ (`coinPool`/`curvyRoadPoint` ลบทิ้ง) → `addCoin(l,tier,side)` ผูกกับ letter object · `randomRoadPoint` คืน `fx,fz` (ทิศที่ผู้เล่นวิ่งผ่าน) → ทอง side+1 หลังตัวอักษรทุกตัว `COIN_GAP 5.2m` · `placeSpecialCoin()` เรียกตอนเหลือตัวสุดท้าย วาง side−1 ด้านหน้า (บนหลุม/เนิน=💎20 ไม่งั้น=◆5 · `specialDone` กันซ้ำ) · relocTick ย้ายเหรียญตามตัวอักษร · ยืนยัน browser: คำ 5 ตัว→ทอง 5 ใบ along=+5.2 ทุกใบ · เหลือตัวสุดท้าย→◆ along=−5.2 · ขับผ่านจริงได้ +1(ตัวอักษร)แล้ว +1(เหรียญหลัง) · จบคำรวม +55 · โหมดรถยนต์เหมือนกัน · ออก/เข้าใหม่ไม่มีเหรียญค้าง · ไม่มี error · **⚠️ ยังไม่ขึ้นเว็บ:** ตัวตรวจก่อน deploy บล็อกเพราะ HEAD ของ session คู่ขนานเรียก `newWordPool()` (js/ui.js:164) ที่ยังไม่ได้ commit นิยาม → deploy ใหม่หลัง session นั้น commit ครบ (โค้ดรอบนี้ push แล้ว · version.json = .316 คืนให้เดินหน้าจาก .315 ที่เขา deploy ไป)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 330:** 🛸🧱🌀 **โลกโดรน: เทกซ์เจอร์ภาพจริง + ใบพัดซ้าย-ขวา** (ผู้ใช้สั่ง 2 ข้อ) — adventure3d.js: (1) **`applyTex(mat,key,rx,ry)`** probe `img/tex/<key>.jpg`→`.png` ไม่มีไฟล์=คงลาย canvas เดิม (แพตเทิร์นเดียวกับ `applySky`) · drone ใช้ `tex_concrete`(2×2) `tex_asphalt`(24×2) `tex_ground`(26×26) · **⚠️ ชื่อ `texCache` ชนของเดิม (บรรทัด 384) → ตัวใหม่ชื่อ `imgTexCache`** (2) **`#adv-props`** ใบพัดซ้าย-ขวา (แขน+มอเตอร์+จาน conic-gradient เบลอ · `perspective rotateX(56deg)` ให้ได้มุม FPV) โชว์เฉพาะ `.adv-drone` · `tickDrone` ตั้ง `--pspin` = .34→.12s ตาม load (ความเร็วราบ .75 + ไต่ขึ้น .4) เขียน DOM เฉพาะตอนค่าขยับ >.012 · **prompt ภาพ: `PROMPTS_TEXTURE.md` + Artifact ปุ่มคัดลอก https://claude.ai/code/artifact/15d34bb2-c199-4741-a4d6-9aa65f18a57e** · ยืนยัน browser 1000×640 + 812×375: ใบพัดสมมาตรซ้าย-ขวา ไม่ทับ HUD (inst/map/exit) `pointer-events:none` · แอนิเมชันหมุนจริง (ตั้ง currentTime 25% → rotate 90°) · ใส่ไฟล์เทสต์ใน `img/tex/` แล้ว network เห็น `tex_concrete.jpg 200` (fallback .png ทำงาน ที่เหลือ 404 เงียบ ไม่มี error) · **⚠️ ที่เทสต์ไม่ได้: แท็บ preview เป็น hidden → rAF หยุด วัดช่วง --pspin ตอนบินจริงไม่ได้ (ได้ค่าเดียว .184s) และภาพเทกซ์เจอร์บนตึกจริงต้องให้ผู้ใช้ดู** · deploy `.322` · ค้าง: ผู้ใช้เจนภาพวาง `img/tex/` แล้วบอก commit (img/ อยู่ใน git ต้อง commit ถึงขึ้นเว็บ)


## ⏬ ย้ายเมื่อ 2026-07-18 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 331:** 🖼️ **ผู้ใช้เจนภาพเทกซ์เจอร์ครบ → เข้าเกมแล้ว** — รับ png 4 ไฟล์ (1024² ×3 + sky 1536×1024) **ต้องแปลงก่อนใช้ 2 เรื่อง:** (1) รอยต่อกระเบื้องไม่เนียน (wrap diff ~1.6-1.9× เพื่อนบ้าน) → `wrap_blend` numpy cross-fade ขอบ 96px (sky 120px แนวนอนอย่างเดียว) แล้ววัดใหม่ได้ ≈ เพื่อนบ้าน = เนียนจริง (2) **sky เป็น 3:2 ไม่ใช่ 2:1** ที่ equirect ต้องการ → ยืดเป็น 2048×1024 (เมฆยืด 33% ยอมรับได้ · ถ้าพี่อยากเป๊ะต้องเจนใหม่ที่ 2:1) · แปลง jpg q88: **11.7MB → 1.4MB** · ต้นฉบับ png ยังอยู่ใน `img/tex/`+`img/sky/` (ไม่ commit · โค้ด probe .jpg ก่อนอยู่แล้ว) · สำรอง scratchpad/tex_orig · ยืนยัน browser: patch `THREE.Texture` ดักตอนสร้างฉาก → เห็นครบ 4 ไฟล์ `tex_asphalt/tex_ground/tex_concrete/sky_storm` ถูกทำเป็น texture จริง · ไม่มี error · live 200 ทุกไฟล์ · deploy `.323` · ค้าง: ผู้ใช้บินดูของจริง (ลายซ้ำถี่/ห่างปรับที่ค่า repeat ใน `applyTex`)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 332:** 🌀🛸🧱 **ต่อยอดโลกโดรน 3 ข้อ** (ผู้ใช้เลือก) — adventure3d.js: (1) **ใบพัดสตอลตอนชน** `propStall(now)` เรียกจากสาขาชนใน `tickDrone` (crashSpd>9) → `PROP_STALL_MS=420` ตั้ง `--pspin` เป็น .95s (จากปกติ .34→.12s) + class `hit` = `propShake` สะบัด + เบลอหนัก/สีจาง · รีสตาร์ตแอนิเมชันด้วย remove→`offsetWidth`→add (ชนรัวๆ สะบัดทุกครั้ง) (2) **ขอบตัวโดรน** `.dframe` ล่างกลางจอ = ตัวเครื่อง + คานล่าง + ขาลงจอด 2 ข้าง (min-height กันจอเตี้ยยุบ) (3) **`applyTex` รับพารามิเตอร์ที่ 5 = tint** → โลกเฮลิฯ `tex_ground`(26²)+`tex_asphalt`(22×2) · โลกผี `tex_ground`(20²) tint `0x7d8490` ให้หม่นเข้ากับกลางคืน (ตึกเฮลิฯ ยังใช้ facade หน้าต่างเดิม ไม่ทับ) · ยืนยัน browser 812×375: dframe 297-515×323-375 ไม่ชนใบพัด/HUD · patch THREE.Texture เห็นโลกเฮลิฯโหลด ground+asphalt · โลกผีโหลด ground (ต้องมี `state.hauntTicket` ถึงเข้าได้) · class `hit` ให้ propShake .42s + blur 2.2px จริง · ใบพัดซ่อนนอกโหมดโดรน · ไม่มี error · deploy `.324` · **⚠️ ยังเทสต์อัตโนมัติไม่ได้: แท็บ preview hidden → rAF หยุด ชนจริงเพื่อดู propStall ทำงานไม่ได้ (ยืนยันได้แค่ฝั่ง CSS + โค้ดเรียกถูกจุด) → ผู้ใช้ลองจริง**


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 333:** 🌀🔋🪟 **ต่อยอดโดรนอีก 3 ข้อ** (ผู้ใช้สั่ง) — adventure3d.js: (1) **ใบพัดหัก** ชน >`PROP_BREAK_SPD`18 → `propBreak(side)` (ข้างจากทิศสไลด์เทียบหัวโดรน) ใบหยุดหมุน+เอียง+มอเตอร์กะพริบแดง · `powMul` `PROP_BROKEN_MUL`.72 คูณทั้ง VMAX+CLIMB · เก็บตัวอักษร→`propFix()` (2) **แบต** `droneBat` ไหลลง `BAT_DRAIN`=100/210วิ · ตัวอักษร +8 · บินเฉียด +4 (ใน `nearMissTick` เช็ก `M.drone`) · <20 เตือนทุก 6 วิ + OSD แดงกะพริบ (`#adv-inst.bat-low`) · 0 = `BAT_EMPTY_MUL`.55 ไม่ตัดจบเกม (3) **หน้าต่างแตก+ประตูสนิม** `brokenWindowTexture()`/`rustyDoorTexture()` วาด canvas เป็น fallback + `applyTex(...,pngFirst=true)` รับ `tex_window`/`tex_door` .png · วางใน `buildAbandoned` เป็น Plane ล้วน **ไม่มี solid = บินลอดเหมือนเดิม** · **⚠️ ต้องใช้ `alphaTest:.35` ห้าม `transparent:true`** (200 ชิ้นโปร่งทำเฟรมพุ่ง 6.1→เรียงลำดับทุกเฟรม · เปลี่ยนเป็น cutout เหลือ 5.0ms = เท่าปิดหน้าต่างทั้งหมด) · **เทคนิคเทสต์ใหม่: patch `window.requestAnimationFrame`→setTimeout ก่อนโหลดสคริปต์ ทำให้ลูปเกมเดินได้แม้แท็บ hidden** (เทสต์ end-to-end ได้จริงครั้งแรก) · ยืนยัน: แบต 100→98→96 ตามเวลา · ตั้ง 18 → 🪫+bat-low+แบนเนอร์ · 0 → ความเร็ว 8.3 vs เต็ม 15 (=.553) · ชนจริง 26m/s → `broken-l`+แบนเนอร์+HUD "🌀 ใบพัดหัก" → ชนตัวอักษร → ซ่อม+แบตเต็ม · หน้าต่าง 199 บาน/ประตู 21 บาน (21 ตึก) · ไม่มี error · deploy `.325` · **prompt ภาพใหม่ 2 แบบ (หน้าต่าง/ประตู ต้องเป็น PNG โปร่ง) อยู่ใน Artifact เดิม** https://claude.ai/code/artifact/15d34bb2-c199-4741-a4d6-9aa65f18a57e


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 334:** 🪟🚪 **ภาพหน้าต่างแตก/ประตูสนิมของผู้ใช้เข้าเกม** — รับ png โปร่งครบ (ตรวจอัลฟาแล้ว: หน้าต่างกลางโปร่ง 78.7% ✔ ประตูกลางทึบ ขอบโปร่ง ✔) · **สูตรย่อไฟล์ png โปร่ง (จำไว้ใช้ซ้ำ): ครอปตาม bbox อัลฟา → อัลฟาเป็น 0/255 (เกมใช้ alphaTest อยู่แล้ว) → `quantize(FASTOCTREE, dither=Image.NONE)`** — **dither คือตัวทำไฟล์บวม** (ประตู 448×884: dither 797KB → ไม่ dither 206KB) · รวม 5.6MB→275KB · **ปรับขนาดบานให้ตรงสัดส่วนภาพ** (บาน 3.54×2.64 = 1.34 ตาม 704×525 · ประตู 1.72×3.4 ตาม 448×884) ไม่งั้นภาพยืดบิด · ยืนยัน browser: โหลดครบ 6 เทกซ์เจอร์ (3 พื้นผิว+ฟ้า+หน้าต่าง+ประตู) · 199 บาน/21 ประตู · **เฟรม 2.4ms (ดีขึ้นจาก 5.0 เพราะบานเล็กลง overdraw น้อยลง)** · ไม่มี error · deploy `.326` · ค้าง: ผู้ใช้บินดูของจริง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 335:** ⚡🏁📸 **โดรน 3 ฟีเจอร์ใหม่** (ผู้ใช้สั่ง) — adventure3d.js: (1) **สถานีชาร์จ** ดาดฟ้าตึก index%4===0 (วง+แท่น+ไอคอนสายฟ้า `chargeIconTexture`) · `droneChargers` เก็บใน `worlds.drone.chargers` · ลอยในรัศมี `CHG_R`3.4 สูงไม่เกิน `CHG_H`7 เหนือดาดฟ้า → `CHG_RATE`26%/วิ + HUD "⚡ กำลังชาร์จ" (2) **โหมดแข่งเวลา** ปุ่ม `#adv-race` → `raceStartRun()` แบตเต็มแล้วจับเวลา · ห่วง torus 6 ห่วงเดิมกลายเป็นด่าน (`worlds.drone.gates`) ต้องผ่าน**ตามลำดับ** (`raceIdx` · ห่วงถัดไป scale 1.25 สีขาว · ผ่านแล้วหรี่เทา) ห่วงละ +3🪙 · ครบ 6 = +`RACE_REWARD`40🪙 + `celebrateBadge` + สถิติ `state.droneRaceBest` · แบตหมดกลางทาง = จบรอบ (3) **กล้อง** ปุ่ม `#adv-shot` ตั้ง `shotWanted` → **`grabShot()` เรียกท้าย `loop()` ทันทีหลัง `renderer.render` เท่านั้น** (WebGL ล้างบัฟเฟอร์หลังจบ task · เรียกทีหลัง=ภาพว่าง) → แฟลช+การ์ดพรีวิว `#adv-photo` + ปุ่มบันทึก (`<a download>` jpeg .88 · ไม่อัปโหลดที่ไหน) · ปุ่มวาง `top:164/212px` มุมขวา **พ้นปุ่มออก(จบ157) และพ้นจานใบพัดขวา(เริ่ม265)** · exitWorld ล้าง raceOn+การ์ดภาพ · ยืนยัน browser 812×375: ชาร์จ 40→45% ตอนลอยเหนือแท่น (ตกออกนอกโซนก็หยุดชาร์จจริง) · ห่วงผิดลำดับไม่นับ · ไล่ครบ 6 → +58🪙 (18+40) + best 8.1 วิ + HUD ซ่อนเอง · ถ่ายภาพได้ dataURL 812×375 การ์ดพอดีจอ · เฟรม 3.2ms · ไม่มี error · deploy `.327` · **⚠️ กับดัก: ถ่ายภาพตอนเกมหยุด (`running=false` เช่นหลังการ์ดฉลอง/ออกโลก) จะไม่มีภาพ เพราะ loop ไม่เดิน** · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 336:** ⛈🪟🚪 **โดรน 3 ฟีเจอร์ (ผู้ใช้สั่ง)** — adventure3d.js: (1) **ฟ้าแลบ** ทุก `BOLT_MIN/MAX` 11-24 วิ → `lightningBolt()` `#adv-bolt` วาบ 2 จังหวะ (keyframe advBolt) + `droneGlassMat` สว่างวับ 200ms + `DroneSound.thunder()` (noise + lowpass 1400→160Hz) หน่วง 0.3-1 วิ ให้เหมือนเสียงมาทีหลังแสง (2) **กระจกแตกได้** บาน `(li+fi)%3===0` ใช้ `glassMat` (transparent .82) แทน `winMat` — **แพตเทิร์นคงที่ ห้ามใช้ rnd() ในนี้** (จะทำผังเมือง seed เพี้ยน) · ชน `GLASS_HIT_R`1.9 → `smashGlass` สลับ material เป็นบานโล่ง + `DroneSound.glass()` (noise highpass + เม็ดเศษกระจก) + 2🪙 + แบต 3% · `done` กันซ้ำ (3) **ประตูเปิดได้** บานอยู่ใน `Object3D` pivot ที่ขอบบานพับ (บานเลื่อน +dw/2 ใน local) → ชนในรัศมี `DOOR_R`2.6 ที่ y<4.2 → `openDoor` แกว่ง `ang`→−1.55 rad ที่ 2.6rad/วิ + 8🪙 + แบต 15% · **⚠️ ฉากถูก cache ต่อโหมด → เข้าโลกใหม่ต้องรีเซ็ต `glass.done`/material + `door.open/ang/rotation` เอง** (ทำใน start แล้ว) · ยืนยัน browser: 67 บานกระจก/21 ประตู · ชนกระจก +2🪙 material เปลี่ยนจริง ชนซ้ำไม่ได้ซ้ำ · ประตูเปิด +8🪙 แบต 40→55 บานแกว่งถึง −1.55 · ฟ้าแลบ animation advBolt ทำงาน · ออก-เข้าใหม่ กระจก 0 แตก ประตู 0 เปิด rotation คืน 0 · เฟรม 4.3ms · ไม่มี error · deploy `.328` · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 337:** 🪟🔤🌧️ **โดรน 3 ฟีเจอร์ (ผู้ใช้สั่ง)** — (1) **เข็มจอมทุบกระจก** `GLASS_TIERS` 20=🪟 50=💥 100=🥽 · **ต้องแตะ 4 จุดเสมอเวลาเพิ่มเข็มใหม่:** `state.js` (field+migration) · `game.js` (TIERS/TIER_UI/emoji + `badgeSuffix` + `BADGE_META` + `trophyDefs` ตู้เข็มโปรไฟล์) · `adventure3d.js` (`awardGlass()` แพตเทิร์นเดียวกับ `awardDaredevil` + ต่อชื่อใน `sendPos.n` และ `renderBoard` rows) (2) **ตัวอักษรลับหลังประตู** `neededLetter()` หาตัวที่ยังขาดจริง (หักของในมือ+ที่วางในโลกแล้ว) → เปิดประตูวาง sprite ที่ `dr.z+dr.inz*2.8` (`inz`=ทิศเข้าตัวตึก เก็บตอน build) + push เข้า `letters` เก็บได้ปกติ (3) **ฝนบนเลนส์** `#adv-rain` เปิด 9-15 วิ หลังฟ้าแลบ — ริ้วฝน `:before` repeating-linear-gradient เลื่อน + หยดน้ำ 14 หยดสุ่มตำแหน่ง (สร้าง DOM ครั้งเดียว) · `stopRain` ทั้งตอนหมดเวลาและตอน exitWorld · ยืนยัน browser: ทุบ 20 บาน → badge=1 emoji 🪟 เข้า `badgeSuffix()` จริง · ประตู→ตัว s (คำแรก sea) โผล่ในห้อง เก็บเข้ากระเป๋าได้ · ฝน 14 หยด anim advDrop/advRain หยุดเองที่ ~16 วิ · ออก-เข้าใหม่ กระจก/ประตู/ฝน คืนสภาพ เข็มคงอยู่ · เฟรม 3.3ms · ไม่มี error · deploy `.329` · **⚠️ บทเรียน: เขียน while-loop รอสถานะในหน้าเทสต์ทำแท็บค้างถาวร (ต้อง preview_stop/start ใหม่) — ใช้ for-loop มีเพดานเสมอ**


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 338:** 🪙 **เหรียญภาพจริง (ผู้ใช้ขอ prompt ให้เหรียญดูหรูหรา)** — moto3d.js: `COIN_TIERS` เพิ่ม field `key` (`coin_gold`/`coin_sapphire`/`coin_diamond`) · `loadCoinImg(i,key)` โหลด `img/coins/<key>.png` แล้ว **สลับ texture ให้เหรียญที่วางอยู่ในโลกด้วย** (`coins.forEach` เช็ก `c.tier===i`) · ไม่มีไฟล์ = ใช้ canvas เดิม · **prompt + ปุ่มคัดลอก: `PROMPTS_COINS.md` + Artifact https://claude.ai/code/artifact/0f0cc3eb-905d-4398-85ba-a0dffd334ead** (ทอง=ดาว+พวงมาลัย · ไพลิน=แพลตินัมฝังพลอย art-deco · เพชร=ทองคำขาวลายมงกุฎฝังเพชร · ต้อง PNG โปร่ง 1024²) · ยืนยัน browser: ใส่ไฟล์เทสต์ → network โหลด `coins/coin_gold.png` + สร้าง THREE.Texture จริง · tier อื่นยังใช้ลายวาด ไม่พัง · ไม่มี error · **⚠️ เข้าโลกมอไซค์ในเทสต์ต้องโหลด `js/data/moto_phosawat.js` ก่อน `js/moto3d.js`** ไม่งั้น buildRoads พังที่ `.r` · deploy `.330` · ค้าง: ผู้ใช้เจนภาพวาง `img/coins/` แล้วบอก commit


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 339:** 🪙 **เหรียญภาพจริงของผู้ใช้เข้าเกม** — รับ png โปร่ง 3 ไฟล์ 1024² (มุมภาพโปร่ง 100% ✔) → **ย่อด้วยสูตรเดิม + เพิ่มขั้น "แพดเป็นจัตุรัสก่อน resize"** (bbox 854×834/831×823/883×902 ไม่จัตุรัส ถ้า resize ตรงๆ เหรียญจะรีบิด) → 512² quantize 192 สี ไม่ dither: **6.1MB → 321KB** · ยืนยัน browser: โหลดครบ 3 ไฟล์ 512×512 สร้าง THREE.Texture จริง · เหรียญทองในโลกใช้ภาพจริง (tier 0 วางบนถนน 6-7 ใบ) · ไม่มี error · live 200 ทุกไฟล์ · deploy `.331` · **⚠️ ที่ยังไม่ได้เห็นกับตา: เหรียญ tier 1-2 (ไพลิน/เพชร) ในโลกจริง** — สคริปต์เทสต์เร่งเก็บตัวอักษรทำให้จบคำก่อนถึงจังหวะวางเหรียญพิเศษทุกครั้ง (ยืนยันได้แค่ระดับ texture โหลดแล้ว) → ผู้ใช้ขับผ่านโค้ง/หลุมจริงช่วยดูให้


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 340:** 🪙🍀🖼️ **ต่อยอดเหรียญ 3 ข้อ (ผู้ใช้สั่ง)** — moto3d.js: (1) **เหรียญหมุน** `coinTick` บีบ `scale.x = size*max(COIN_EDGE_MIN .11, |cos(now*COIN_SPIN_SPD+phase)|)` — สไปรต์หันหน้าเข้ากล้องเสมอ การบีบแกน x จึงอ่านเป็นการหมุนจริง **ไม่ต้องทำสไปรต์ชีต** · `COIN_SPIN_SPD .0045` (~1.4 วิ/รอบ) · ทุกใบมี `phase` สุ่ม + `material.color` วาบตอนหันหน้าเต็มใบ (2) **เหรียญมรกต tier 3** 🪙50 `EMERALD_TIER` — ธง `cleanWord` (รีเซ็ตตอน spawnLetters · false เมื่อ `dogHit` หรือ impact>`HARD_LAND`7.5) → จบคำแบบสะอาด `setTimeout 900ms` (รอคำใหม่ spawn ก่อน) วาง `addFreeCoin` บนถนนข้างหน้า · **`clearCoins` ต้องเว้นเหรียญ `keep:true`** ไม่งั้นโดนล้างทันทีตอนขึ้นคำใหม่ · relocTick เพิ่ม `c.l &&` กัน free coin (3) **ไอคอนเหรียญจริงในหน้าเกม** `.coin-ic` แทน 🪙 ใน `.coin-pill` 4 จุด (index.html) + เหรียญบิน `coinFlyFx` (ui.js) · มี `onerror` กลับไปใช้อีโมจิ · ยืนยัน browser: scale.x วน 0.25↔2.30 เต็มรอบจริง · มรกต keep รอดข้ามคำใหม่ (tiers [4,0,0,2]) · ไอคอนในกระเป๋า 19×19 อยู่ในเม็ดยา 86×33 · ไม่มี error · deploy `.332` · **⚠️ ยังไม่เห็นกับตา: จังหวะ "เก็บ" เหรียญมรกต (+50 + ป้าย 🍀)** — เทสต์ย้ายตำแหน่งผู้เล่นไม่ได้ (`_t.pos` เป็น getter) · **⚠️ บทเรียนสำคัญ: `io.open(p,'w')` แล้ว write พังกลางคัน = ไฟล์ว่างเปล่า** (index.html โดนล้างจริง กู้ด้วย `git checkout --`) → เขียนไฟล์ต้อง **เขียน .tmp แล้ว `os.replace`** หรือใช้ Edit tool เท่านั้น


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 341:** 🚁🔊 **เสียง Bell 212 จริงเข้าโลกเฮลิฯ (ผู้ใช้สั่ง "startup เอามาให้ครบ")** — ตัดจาก `sound/helicopter/Bell_212_...mp3` (5 นาที) ด้วย `tools/cut_heli.py` เป็น 3 ไฟล์ที่โค้ดรองรับอยู่แล้ว: `heli_start` 28.8s (ต่อ 3 ท่อน 2-21.5s สปูล+จุดระเบิด → 99-104s รอบกลาง → 157.5-164s รอบเต็ม · crossfade equal-power) · `heli_rotor` 9.0s · `heli_rotor_high` 7.0s (ช่วงเทคออฟจริง 228s) รวม 584KB · **ลูปตัดให้ยาวลงตัวกับคาบใบพัด 10.7Hz + crossfade หางทับหัว** (วัดจากไฟล์จริง: blade rate ไต่ 6.7→10.7Hz ตลอด 160 วิแรก = สปูลจริงของ Bell 212) · **แก้ 3 บั๊กในโค้ดเดิม:** (1) `Math.min(dur,9000)` ตัดไฟล์สตาร์ทเหลือ 9 วิ (2) **เข้าโลกครั้งแรกไฟล์ยัง decode ไม่เสร็จ → ตกไปใช้เสียงสังเคราะห์ทุกครั้ง** แก้ด้วย `loading` promise + `PRELOAD_WAIT` 6s แล้วค่อย `fileOrSynthStart()` (3) `stop()` ปิด `master.gain=0` ค้าง → เข้าโลกรอบ 2 เงียบสนิท (เพิ่งโผล่เพราะย้ายไฟล์มาผ่าน master) · **เปลี่ยน HTMLAudio → AudioBuffer/WebAudio** (HTMLAudio loop สะดุดทุกรอบจาก encoder padding ของ mp3) · `playBuf()` + `setTargetAtTime` ไล่ volume/playbackRate นุ่ม · เพิ่ม **ปุ่ม `#adv-skipstart` ⏭ ข้ามการสตาร์ท** (โชว์เฉพาะระหว่างสตาร์ท) + **HUD บอกขั้นตอนจริง** `HELI_PHASES`/`heliStartPhase()` (แบต→IDLE→กดสตาร์ท→จุดระเบิด→ใบพัดไต่รอบ→พร้อมบิน + นับถอยหลัง) · ยืนยัน browser: ไฟล์ decode ครบ 3 (28.8/8.97/7.01s · หัว-ท้ายลูปต่างกัน 5-8%) · ซีเควนซ์เดินจริง 0→27.7s แล้วสลับเข้าลูปเอง · ข้อความ HUD ไล่ครบทุกช่วงตรงกับเสียง · กดข้าม→ready ทันที ปุ่มซ่อน · เร่งเต็ม crossfade rotor .317/high .433 rate 1.21/1.13 · กลับ idle high→0 · **วัด AnalyserNode ที่ master: มีสัญญาณจริง idle .028 → เต็มกำลัง .046** · ออก-เข้าใหม่ master คืนเป็น 1 ใช้ไฟล์จริง (ไม่ตกไป synth) · ปุ่มพอดีจอ 812×375 ไม่ทับปุ่มอื่น · ไม่มี error · deploy `.333` · ⚠️ ค้าง: **ผู้ใช้ฟังจริง** (ถ้าอยากให้สตาร์ทสั้นลง แก้ท่อนใน `tools/cut_heli.py` แล้วรันใหม่)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 342:** 🎛️🌬️🛬 **ค็อกพิตใหม่ + เข็มพอดีหน้าปัด + เสียงเฮลิฯ 3 ข้อ (ผู้ใช้สั่ง)** — (1) **ภาพ `new_heli_cockpit.png` → `img/new_heli_cockpit.jpg`** (`tools/cockpit_prep.py` ตัด y400-1024 เหลือแผงหน้าปัด + ย่อ 1200px q86: **3.3MB→159KB**) · code probe .jpg ก่อน ไม่มี→.png→CSS จำลอง (2) **เลิกวาดหน้าปัดยักษ์ลอยจอ (R=56 แถบ 560px) → วาดเฉพาะ "เข็ม" ทับหน้าปัดที่วาดอยู่ในภาพ** พิกัด `CP_GAUGES` วัดจากภาพจริง (spd 330,146 · att 391,121 · alt 447,125 · rpm 392,191 · vs 453,191 · r 23-26) · `layoutCockpit()` คำนวณ cover transform เอง (`cpMap {scale,ox,oy}`) + **คำนวณ `objectPosition` แนวตั้งอัตโนมัติให้กลุ่มเข็มอยู่กลางแถบทุกขนาดจอ** · เข็มยาว .78r หนา .11r = สมจริง ไม่ล้นเบเซล (3) 🎚️ **เสียงตามสภาพแวดล้อม** `envUpdate()` — สูง 8→55m เบาลงถึง 42% + lowpass 20k→1.8kHz (ทุ้มไกล) · ใกล้ตึก <9m ดังขึ้นถึง 28% (เสียงสะท้อน) (4) 🌬️ **ลมปะทะ** brown-noise→bandpass ดังตาม spd² (เต็มที่ 26m/s = .17 · 420→1320Hz) (5) 🛬 **ดับเครื่องตอนออกจากโลก** `shutdown()` ใบพัด playbackRate 1.15→.16 + วอลุ่ม→0 ใน 4.2 วิ แทนตัดห้วน · **⚠️ 4 กับดักที่แก้แล้ว:** `master.gain` ถูกโหมดสังเคราะห์ใช้อยู่ → ต้องแทรก `envG`/`envLp` คั่น ไม่ใช่แตะ master · แหล่งเสียงลมถูก stop() ไปกับ nodes ต้องล้าง `windG=null` ไม่งั้นรอบหน้าไม่มีลม · เข้าโลกใหม่ระหว่างยังดับไม่สุด ต้อง `clearTimeout(_downTm)` กัน stop() ค้างคิวมาฆ่าเสียงใหม่ · **ห้ามตั้ง `cv.style.height` เอง** (ค้างค่าเก่าตอนหมุนจอ → เข็มหลุดตำแหน่ง) ให้ CSS 36vh คุมทั้งคู่ + drawGauges เช็ก `cpBox` วัดใหม่เองเมื่อกล่องเปลี่ยน · ยืนยัน browser: ประกอบภาพจริง(ภาพ+canvas)ดูด้วยตา **เข็มอยู่บนหน้าปัดตรงทุกตัว** · canvas ทับภาพเป๊ะ (aligned) ทั้ง 812×375 (objPos 19.5%) และ 1280×720 (14.1%) · สลับขนาดจอแล้วจัดตัวเองใหม่ถูก · env: ต่ำ/ช้า env 1.0 lp 20k → สูง 55m env .581 lp 1830 → เร็ว 26m/s wind .170 hz 1319 → เฉียดตึก 1m env 1.248 · shutdown ไล่ลง 1.149→.16 ใน 4.2 วิ แล้วล้างครบ · ไม่มี error · deploy `.334` · 📌 **`img/heli_cockpit.png` (2.8MB) ยัง track ใน git แต่ไม่ได้ใช้แล้ว** — ถ้าอยากลดขนาด deploy ให้ `git rm --cached` (ไฟล์ในเครื่องยังอยู่) แต่ต้องถามผู้ใช้ก่อน


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 344:** 🚁🪟 **ค็อกพิตเป็น "กรอบมองทะลุกระจก" + 3 ฟีเจอร์ (ผู้ใช้สั่ง — ของเดิมตัดเป็นเส้นตรง "ดูไม่มีคุณภาพ")** — (1) **`img/heli_frame.png`** สร้างด้วย `tools/cockpit_prep.py`: **flood fill จาก 6 seed หาช่องกระจกแต่ละบาน → ทำ alpha โปร่ง** (โปร่ง 28.7% · ที่ปัดน้ำฝนยังอยู่) + MaxFilter/MinFilter ปิดรู + GaussianBlur 1.2 ขอบนุ่ม + **`GLASS_MAX_Y=780` กันรั่วลงไปโดนเบาะ** · ครอป (0,150,1536,900) ได้สัดส่วน 2.05 ใกล้จอเกม · 3.3MB→159KB (2) **CSS เต็มจอ** `inset:0` + `object-fit:cover;object-position:center bottom` (**ไม่ยืดภาพให้เพี้ยน** จอเตี้ยก็แค่กินขอบเพดาน แผงหน้าปัดอยู่ครบ) → **โลก 3D โผล่ผ่านกระจกจริง** (3) **เข็มวาดด้วยพิกัดในภาพ** `c.setTransform(s,0,0,s,ox,oy)` แล้ววาดด้วย CP_GAUGES ตรงๆ (พิกัดใหม่ในภาพ 1100×537) (4) 🎧 **สเตอริโอตามทิศตึก** `StereoPannerNode` — หมุนเวกเตอร์ไปหาตึกใกล้สุดด้วย `-yaw` แล้วเอาแกน x เป็น `wallSide` (-1 ซ้าย/+1 ขวา) × echo × `PAN_MAX .65` (5) 🚨 **หวอรอบเกิน** `overspeed()` สองโทนสลับ 930/1240Hz ทุก 230ms ที่ rpm ≥ `OD_RPM 1.25` + เข็มเปลี่ยนเป็นสีแดง (6) 📳 **เข็มสั่น** `heliShake()` — rpm > `SHAKE_RPM 1.15` สั่นตามรอบ · ชนแล้วสั่นแรง `SHAKE_HIT 2.6` จางใน 650ms · **สั่นที่มุมเข็ม ไม่ใช่ขยับทั้งหน้าปัด** · แต่ละเข็มคนละ phase · ยืนยัน browser: ประกอบภาพจริงดูด้วยตา **เข็มอยู่กลางวงหน้าปัดทุกตัว ทั้ง 812×375 และ 1280×720** · มองทะลุกระจกเห็นตึก/ป้ายโฆษณาจริง · สั่น: rpm 1.0 เฟรมนิ่ง 0/6 → rpm 1.2 สั่น 6/6 → rpm 1.4 สั่น+หวอ · หวอ +14.7dB ในย่าน 900-1300Hz (ดังกว่าเสียงเครื่อง) · แพน ซ้าย -0.563 / ขวา +0.546 / ไกลตึก 0.015 · ไม่มี error · deploy `.336` · **⚠️ 3 กับดักที่เสียเวลา: (ก) service worker เสิร์ฟ png เก่าค้าง** → ต้อง `getRegistrations().unregister()` + `caches.delete()` (ข) **`_t.running=true` ไม่ทำให้ลูปเดินต่อ** (rAF ตายไปแล้ว) ต้อง `Adventure3D.start()` ใหม่ (ค) เทสต์เข็มสั่นต้อง **pin rpm ทุกเฟรม** ไม่งั้น physics ทับ · 🗑️ `img/new_heli_cockpit.jpg` เลิกใช้แล้ว เอาออกจาก git


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 345:** 🔠🪙 **เก็บตัวอักษร 1 ตัว = 1 เหรียญ + ภาพ/เสียงชัดเจน (ผู้ใช้สั่ง)** — เดิม 4 โลกเขียนโค้ดเก็บตัวอักษร**ซ้ำกัน 4 ที่** (เดิน 4621 · โดรน 4858 · ขับรถ 5579 · เฮลิฯ 6238) → **ยุบเป็น `pickUpLetter(i)` ที่เดียว** (adventure3d.js:1848) ทำครบ: `inv` + `addCoins(LETTER_COIN=1)` + `sessionCoins+=` + `letterPop()` + `letterChime()` + `speakLetter()` + `renderHudTop()` · **`letterPop(worldPos,ch)`** = ป้าย DOM ฉาย `.project(camera)` ไปตำแหน่งตัวอักษรในโลก 3D · `.letter-pop` = **ตัวอักษรตัวใหญ่ในเหรียญทองไล่สี 46px + "+1🪙"** ใช้ keyframe `scPop` เดิม · **⚠️ ถ้า `v.z>1` (ตัวอักษรชิดตัว/หลังกล้อง) ต้อง fallback เด้งกลางจอ ห้าม return เฉยๆ** ไม่งั้นเก็บแล้วไม่มี feedback · **`letterChime()`** = 2 โน้ตไล่ขึ้น 880→1320Hz triangle (คนละเสียงกับ `sfx.levelup()` ตอนจบคำ) · ยืนยัน browser: โลกเดิน เก็บ "a" → เหรียญ 100→101 + ป้าย "A +1🪙" อยู่ในจอ + สร้าง oscillator 2 ตัวจริง · **เก็บครบคำ "arm" (3 ตัว) ได้ 18 เหรียญ = 3 ตัวอักษร + 15 รางวัลคำ (ซ้อนกันถูกต้อง ไม่ทับกัน)** + เข้าสมุดคำศัพท์ 1 คำ · โลกเฮลิฯ (ต้องจอดก่อนเก็บ) ได้ +1 + ป้าย "G +1🪙" · CSS ติดครบ (วงกลม 46px radial-gradient ขอบ #fff2c4 · anim scPop) · ไม่มี error · deploy `.337`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 346:** 🌧️☀️🎚️ **ที่ปัดน้ำฝน + แสงแดดสาดกระจก + ปรับมุมนั่ง (ผู้ใช้สั่ง)** — เพิ่ม **`#adv-glass` canvas z-index 2** = "ชั้นบนกระจก" · **⚠️ ต้องอยู่ใต้กรอบค็อกพิต (z3) แต่เหนือ `#adv-canvas` (ไม่มี z-index)** → เสา/หลังคาบังที่ปัดกับแสงได้เองอัตโนมัติ ไม่ต้อง mask (1) 🌧️ **ที่ปัด** `drawBlade()` วาดด้วยพิกัดในภาพผ่าน cpMap · จุดหมุน `WIPER.pivot (404,126)` ยาว 145 = **ทับที่ปัดที่วาดไว้ในภาพเป๊ะ (วัดได้ x257-407 vs ภาพ x260-404)** → ตอนปิด = ท่าจอดในภาพ ตอนเปิดก็กวาดออกจากจุดเดียวกัน ไม่เห็นเป็น 2 ชุด · ปุ่มวน ปิด→ช้า(1.5rad/s)→เร็ว(3.1) · **⚠️ บั๊กที่เจอ: `rotate(a-π)+scale(-1,1)` ทำใบซ้ายชี้กลับเข้ากลางจอ** → ใช้ `rotate(a)` ตรงๆ (a=π คือชี้ซ้าย · ฝั่งขวา = π-a) (2) ☀️ **แสงแดด** radial-gradient + ริ้วคราบ 7 เส้น โผล่เฉพาะเมื่อ `|sunDir-yaw| < 1.15` เข้มตามความตรง (ตรงหน้า 351k px → 1.0rad 5k px → 1.4rad 0) (3) 🎚️ **มุมนั่ง 3 ระดับ** `SEAT_P=[1,.62,.26]` + `SEAT_ZOOM 1.12` (ซูมนิดเดียวเพื่อให้มีระยะเลื่อนทุกสัดส่วนจอ) · เปลี่ยนกรอบจาก `<img>` เป็น **background-image คุม backgroundSize/Position เอง** ให้ตรง cpMap · จำลง `state.heliSeat` · **⚠️ `setSeat` ต้องเรียก `layoutCockpit()` ทันที ห้ามรอ drawGauges** (ลูปหยุดอยู่ = เบาะไม่ขยับเลย) · **⚠️ คอลัมน์ปุ่มขวาเต็มถึง y~317 (ออก/แชท/ไมค์/ลำโพง/โหมดเสียง)** → ปุ่มใหม่ต้องชิดล่างขวา (bottom:10) + **เพิ่มใน exclusion list ของ touch handler** ไม่งั้นนิ้วที่กดปุ่มกลายเป็นลากคันเร่ง · ยืนยัน browser: ที่ปัด ปิด=0px วาด · เปิด=~4090px + กวาดลง y122→247 (อยู่ในกระจก y95-330) กลับไปกลับมา · เบาะ 3 ระดับ bgPos -69/-42.8/-17.9 ภาพคลุมเต็มจอทุกระดับ เข็มยังอยู่ในจอ · ปุ่มไม่ทับปุ่มอื่นแล้ว · seat เซฟลง localStorage · ไม่มี error · deploy `.338` · 🧪 testkit ใหม่ใน `_t.heli`: `setWiper/wiper · setSeat/seat · setSun/yaw`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 347:** ✂️🎚️ **ตัดหัวเสียงสตาร์ทที่เงียบ + มุมบิน "แผงล่างอย่างเดียว" (ผู้ใช้สั่ง)** — (1) **เสียง:** ต้นฉบับ 0-12 วิ ดังแค่ **-40dB = แทบไม่ได้ยิน** (ผู้ใช้บอก "ว่าง 7-8 วิ") → `cut_heli.py` เริ่มท่อนแรกที่ **12.5s แทน 2.0s** + `HEAD_GAIN 3.2` ไล่ลงเป็น 1.0 (ดันเทอร์ไบน์ช่วงต้นให้ได้ยิน) + เฟดหัวสั้นลง 1.2→0.45 วิ · ผล **28.8→18.3 วิ · 0.5 วิแรกจาก -45dB เป็น -27dB** · **ต้องไล่ `HELI_PHASES` ใหม่ทุกครั้งที่แก้ไฟล์เสียง** (จุดระเบิดขยับมาที่ 8 วิ) (2) **มุมบิน:** `img/heli_dash.png` = ตัด `heli_frame.png` ที่ **y=228 (ขอบบนแผงบังแดด → ขอบเป็นเส้นโค้งธรรมชาติ ไม่ใช่เส้นตรง)** ถึง y=415 + **เฟดอัลฟาขอบบน 26px กลบรอยตัดตรงเสา/ประตู** · 63KB · `seatLevel` เปลี่ยนความหมายเป็น **มุมมอง 0=เต็มลำ(ตอนสตาร์ท) 1=มุมบิน 2=บินต่ำ** · **ตัดอัตโนมัติไปมุมบินเมื่อ `HeliSound.ready`** (`hViewSwitched` กันซ้ำ) · เห็นท้องฟ้า 63%/74% ของจอ (เดิม ~35%) · **กุญแจ: ทุกโหมดยังวาดเข็ม/ที่ปัดด้วย "พิกัดกรอบเต็ม" เหมือนเดิม — `layoutCockpit` แปลง `oy = bgY - DASH_OFF_Y*s` ให้เอง** จึงไม่ต้องมีพิกัดเข็มชุดที่ 2 · ซ่อนปุ่มที่ปัดตอนมุมบิน (ไม่มีกระจก) · **🐛 เจอบั๊กจริงระหว่างเทสต์: `shutdown()` ไม่ปลด `on` → ผู้เล่นที่กลับเข้าโลกภายใน 4.2 วิ โดน `if(this.on) return` ใน `start()` เตะออก = ไม่มีเสียงเครื่อง + `ready` ค้าง false = บินไม่ได้ตลอดรอบ** แก้โดยตั้ง `this.on=false` ใน shutdown ทันที · ยืนยัน browser: สตาร์ท 18.3 วิ มุมเต็มลำ → ready แล้วตัดเป็น heli_dash.png อัตโนมัติ · เข็มตรงวงทุกโหมด (วาดจริง y268-340 vs คาด 283/330) · ปุ่มวน มุมบิน→บินต่ำ→เต็มลำ→วนกลับ · กลับเข้าโลกระหว่างเครื่องดับ เสียงสตาร์ทใหม่เล่นจริงและไม่โดน stop() เก่าฆ่า · ไม่มี error · deploy `.339`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 348:** 💧🌅🕶️📹 **หยดน้ำ + แดดตามเวลา + ม่านบังแดด + กล้องใต้ท้องเครื่อง (ผู้ใช้สั่ง)** — (1) 💧 **หยดน้ำบนกระจก** `drops[]` เกิดตอนฝนตก (`rainTick` ตกเอง ทุก 42-95 วิ นาน 14-26 วิ + ATC เตือนให้เปิดที่ปัด) · **ที่ปัดกวาดผ่าน = หยดหายจริง** (`wipeDrops` ทดสอบ: ฝน 2 วิ→90 หยด · ปัด 2 วิ→เหลือ 46) · **⚠️ 2 จุดที่ต้องระวัง: (ก) ต้องกวาด "ตลอดเส้นทางจากมุมเดิม→มุมใหม่" ไม่ใช่เช็กมุมปัจจุบัน** ไม่งั้นเฟรมตกแล้วใบปัดกระโดดข้ามหยด (ข) **หยดต้องเกาะนาน** (vy cap 16, decay .035) ถ้าไหลเร็วจะหลุดพ้นแนวที่ปัดก่อนโดนกวาด · หยดเกิดในโซน `DROP_ZONE` ที่ที่ปัดถึง 82% + นอกโซน 18% · บินเร็วหยดปลิวเอง (2) 🌅 **แดดตามเวลาจริง** `sunUpdate()` 06:00→ทิศ -1.6 · 12:00→0 สูงสุด · 18:00→+1.6 · สีอุ่นขึ้นเช้า/เย็น (`sunWarm`) · วัดจริง: เที่ยง 74k px (แดดสูง โดนหลังคาบัง) · เย็น 122k px (แยงตาสุด) · หันหลัง 0 (3) 🕶️ **ม่านบังแดด** ปุ่ม `#adv-visor` ดึงแผ่นทึบลงถึง y=168 · `VISOR_CUT .32` ลดแสงจ้า (วัดครึ่งบนจอ สว่างลด 21%) (4) 📹 **กล้องใต้ท้องเครื่อง** `drawBellyCam()` เรนเดอร์ฉากซ้ำด้วย `bellyCam` (มองดิ่งลง หมุนตาม yaw) ผ่าน `setScissorTest+setViewport` · HUD กรอบ/ชื่อ/ความสูง/วงเล็งที่หดตามความสูง วาดบน canvas เข็ม · **⚠️ บั๊กสำคัญ: กล้องเรนเดอร์ลง canvas ฉาก (ชั้นล่างสุด) → ถ้าวางทับแผงหน้าปัด ภาพโดนภาพค็อกพิต (z3) บังหมด เห็นแต่กรอบ** → ต้องวางเหนือ `cpPanelTop` เสมอ (คำนวณใน layoutCockpit ทั้งมุมเต็มลำ/มุมบิน) · ยืนยัน: สีในกรอบ = พื้นดิน (182,168,147) ต่างจากนอกกรอบ = ท้องฟ้า (159,216,247) ต่าง 171 = เป็นภาพคนละมุมจริง · **⚠️ viewport ของ WebGL นับจากล่างซ้าย ไม่ใช่บนซ้ายแบบ DOM** · HUD 2D ทั้งหมด 0.1 ms/เฟรม · ไม่มี error · deploy `.340` · 🧪 testkit เพิ่ม: `rain/drops/clearDrops · setVisor/visor · sunAt(ชม.) · bellyRect · redraw(dt)` (**`redraw` จำเป็นมาก — แท็บที่ถูก throttle ลูปแทบไม่เดิน อ่าน canvas จะได้ภาพค้าง**)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 349:** 🎯📏🌫️ **วงเป้าลงจอด + แถบเตือนดิ่ง + หมอกเช้า (ผู้ใช้สั่ง)** — ทั้งหมดวาดบน `#adv-gauges` (screen coords ผ่าน `setTransform(dpr..)` แบบเดียวกับ drawBellyHud) เรียกใน tickHeli หลัง drawGauges (1) 🎯 **`drawLandingTargets()`** จับกลุ่มตัวอักษรตาม "ดาดฟ้าเดียวกัน" (key=round(x),round(z)) → วงเป้าเต้นจังหวะ+กากบาท+ป้ายตัวอักษร+ระยะ · ใกล้/ต่ำ(dxz<7,alt<16)=เขียว "🛬 ลงจอดเก็บได้" · **หลุดจอ=ลูกศรที่ขอบชี้ทาง** (ใช้ camera space `applyMatrix4(matrixWorldInverse)` เช็ก inFront · หลังกล้องพลิก dir) · **⚠️ HUD นี้วาดก่อน `renderer.render` → ต้อง `camera.updateMatrixWorld()+matrixWorldInverse.invert()` เองต้นฟังก์ชัน ไม่งั้นเป้าlag 1 เฟรม** · ยืนยัน: 20 ดาดฟ้า on-screen 7 off 13 · cyan pixels วาดจริง (2) 📏 **`drawDescentBar()`** แถบแนวตั้งซ้ายจอ map vy +10..-10 · เขียว/เหลือง(≤-3)/แดง(≤-6) · **ดิ่ง≤-6 + สูงจากพื้น<12m → กรอบจอ 4 ด้านกะพริบแดง** (gradient แยกทีละด้าน anchor ที่ขอบ) · ยืนยัน: ดิ่งแรงใกล้พื้น edgeRed 212k(ขอบ)/center 1.3k · ร่อนนุ่ม vy-2=11 · สูง 20m=199 · จอด=แถบหาย (3) 🌫️ **`fogUpdate(now)`** ต่อจาก sunUpdate (เวลาจริง) — เช้า 04-09 หมอกโค้งหนาสุด 05:48 · พลบค่ำ 17.5-20 บางๆ · ปรับ `scene.fog.near/far` (150→39) + สีฟ้า→ขาวนวล lerp · throttle 800ms กัน GC · HUD เตือน "🌫️ หมอกลง พึ่งกล้อง" เมื่อ fog>.35 → ดันให้พึ่งกล้องใต้ท้อง · ยืนยัน: 05:48 fog1.0 far39 · เที่ยง fog0 far150 · (เครื่องเทสต์เวลาจริง 4:20 = fog.46 far99 ทำงานจริง) · ไม่มี error · deploy `.341` · 🧪 testkit `_t.heli` เพิ่ม: `fog/fogFar · set landed · get/set vy` + redraw เรียก fogUpdate/drawLandingTargets/drawDescentBar


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 350:** 🎯💡🏆 **ช่วยจัดกึ่งกลางเป้า + ไฟส่องหมอก + โบนัสลงนุ่ม (ต่อยอดรอบ 349 ผู้ใช้สั่ง "ทำเลย")** — (1) 🎯 **`HeliSound.assist`** ติ๊ดแบบเซนเซอร์ถอยรถ (ใกล้=ถี่ · ตรงเป้า d<`ASSIST_PAD`3 =รัว+โทนสูง 1560Hz) เป้า=`assistTgt` คำนวณใน tickHeli (ดาดฟ้าตัวอักษรใกล้สุด dxz<14 alt<26) · **⚠️ เสียงต่อตรง destination ไม่ผ่าน master** (master โดน envLp ทุ้มตามความสูง) · จุดเป้าในกล้องใต้ท้อง: **ฉายด้วย `_tgtV.project(bellyCam)` ตรงๆ** (เมทริกซ์จาก render เฟรมก่อน lag มองไม่ออก) เขียว=ตรงเป้า/เหลือง=เยื้อง+ระยะ (2) 💡 **`setHeliLight`** SpotLight จริง (ตึก Lambert รับแสง) ตามเครื่องทุกเฟรม ส่องหน้า-ลง · เปิด=`heliFog*=.62` ใน fogUpdate (`_fogAt=0` บังคับคำนวณทันที) · ปุ่ม `#adv-light` right:206 แถวเดียว seat/wiper/visor · ATC เตือนเปิดไฟเมื่อ fog>.5 (คูลดาวน์ 2 นาที) (3) 🏆 **`softLandBonus`** แตะพื้น ≤1.3=+10 Perfect(+sfx.levelup+ATC ชม) · ≤3=+4 ลงนุ่ม · **กันฟาร์ม: ต้องบิน >3 วิ (`hAirAt` ตั้งตอนเทคออฟ)** (4) 🐛 **แก้บั๊กแถม: `#adv-visor` ตกหล่นจาก touch exclusion list รอบ 348** (กดม่านบนมือถือ=นิ้วกลายเป็นลากคันเร่ง) +เพิ่ม #adv-light ด้วย · ยืนยัน browser: โบนัส 4 เคส (10/4/0/กันฟาร์ม 0) · assist เป้า d=6 ติ๊ดจริง/ตรงเป้า centered/ไกล 30m+สูง 40m ไม่มีเป้า · จุดกล้อง เขียว 792px ตรงเป้า/เหลือง 582px เยื้อง · ไฟ fog .58→.36 far 85.6→109.6 ปิดคืนเดิม · ไม่มี error · deploy `.342` · 🧪 testkit เพิ่ม `_t.heli`: `assistTgt · light/setLight/lightObj · airAt · softLand(impact) · tick(dt)` (รัน tickHeli 1 สเต็ป) + redraw เรียก drawBellyCam ด้วย (bellyRect ได้แม้ลูปตาย) · **⚠️ กับดักเทสต์: state ถูกรีเซ็ตหลัง authOnLogin (จอลงทะเบียน) — ตั้ง `state.heliTicket=true` แล้วต้องตั้งซ้ำก่อน `Adventure3D.start` ไม่งั้นเด้งเงียบที่เช็กตั๋ว (mode เปลี่ยนแล้วแต่ overlay ไม่สร้าง)**


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 351:** 🪶📊🌙 **เข็มมือนุ่ม + สรุปท้ายรอบบิน + บินกลางคืน (ต่อยอดเฮลิฯ — ผู้ใช้อนุมัติต่อยอดโลกนี้ถาวรแล้ว ทำได้เลยไม่ต้องถาม)** — (1) 🪶 **เข็ม Perfect landing** `state.perfLandCount/perfLandBadge` 10=🪶/25=🕊️/50=🦅 (`SOFTLAND_TIERS` game.js · `awardPerfLand` adventure3d แพตเทิร์น awardGlass) เข้า badgeSuffix+ตู้เข็ม report+BADGE_META · **🐛 แก้บั๊กแฝง: `NAME_BADGE_RE`+BADGE_META ขาดเข็มกระจก(รอบ337)+เพื่อนซี้(รอบ323)** — เข็มพวกนี้เคยโดนมองเป็นส่วนหนึ่งของชื่อ เติมครบแล้ว (2) 📊 **สรุปท้ายรอบบิน** `sLandTot/Perf/Soft` นับใน softLandBonus รีเซ็ตตอนเข้าโลก → exitWorld toast "🚁 จบรอบบิน! 🛬..🏆..👍..📖..🪙" (3) 🌙 **บินกลางคืน** fogUpdate คำนวณ `heliNight` (มืด 20:00-04:30 ไล่ 18:30/06:00) → ฟ้า lerp `_nightSky 0x0d1322` + หรี่ `worlds.heli.lights` hemi 1→.28 sun .7→.11 (**เก็บ ref ตอน buildScene**) · ป้ายโฆษณา/วง helipad เป็น MeshBasic ไม่โดนหรี่=ป้ายไฟกลางคืนอัตโนมัติ · ATC เตือนเปิดไฟตอนกลางคืน+HUD "🌙 บินกลางคืน" · **⚠️ `scene.background` อาจเป็น Texture (applySky) — เช็ก `.isColor` ก่อน copy สี ไม่งั้นพัง** · ยืนยัน browser: ครบ 10→🪶 badgeSuffix ติด · ครบ 25→ป้ายฉลอง 🕊️ เด้งจริง · splitNameBadges แยก 🪶/🪟/🐾/🦅 ออกจากชื่อถูก · 22:00 night=1 แสง .28/.11 · เที่ยงคืน 1.0/.7 · toast สรุป "ลงจอด 4 · เพอร์เฟกต์ 3 · นุ่ม 1 · +34🪙" ตรงสถิติจริง · ไม่มี error · deploy `.343` · 🧪 testkit เพิ่ม: `night · lightLv · landStats`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 352:** 📍 **ย้ายกล้องใต้ท้องไปมุมซ้ายบน (ผู้ใช้สั่ง — ของเดิมกลางจอบังวิวหน้า)** — `BC={x:10,y:30}` แทนคำนวณกลางจอ/เหนือแผง (y เว้น 16px ให้แถบชื่อกล้อง) · กระดาน "🏆 ประกอบคำรอบนี้" หลบลงใต้กล้อง: CSS `.adv-heli #adv-board{top:calc(26vh + 38px)}` (สูตร = y30 + สูงกล้อง 26vh + ช่องไฟ 8 — **แก้ BC ต้องแก้ CSS นี้ด้วย**) · ยืนยัน browser 812×375: กล้อง (10,30,187×98) กระดาน top136=ใต้กล้อง+8 อยู่ในจอ · 1280×720: กระดาน 225 ใต้กล้อง 217 สูตร vh สเกลตาม · พิกเซลในกรอบ=พื้นเมือง (87,98,108) นอก=ฟ้า (159,217,247) ต่าง 330 = กล้องเรนเดอร์จริงที่มุมใหม่ ไม่โดนกรอบบัง · ไม่มี error · deploy `.344`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 353:** ⭐🚨🛩️ **ดาว+พระจันทร์ · ไฟกันชนยอดตึก · ภารกิจไปรษณีย์กลางคืน (ต่อยอดเฮลิฯ ตามคำอนุมัติถาวร)** — (1) ⭐ **ดาว 190 ดวง (Points โดมฟ้า R170) + พระจันทร์** สร้างใน buildScene เก็บใน `worlds.heli.night` · fogUpdate คุม visible เมื่อ night>.35 + opacity ตาม night×(1-fog×.6) · **ต้อง `fog:false`+`depthWrite:false` ไม่งั้นหมอกกลืน/บังกัน** (2) 🚨 **ไฟแดงกะพริบบนยอดตึกสูงสุด 6 หลัง** `worlds.heli.beacons` · tickHeli วาบสั้น 16% ของคาบ 0.9 วิ **คนละเฟส (ph=i×.37)** โผล่เมื่อ night>.25 (3) 🛩️📦 **ไปรษณีย์กลางคืน** (night>.5 เท่านั้น): `mailTick` สุ่มดาดฟ้า → เสาแสงเขียวพัลส์ (`mailMk` สร้างครั้งเดียว ย้าย/ซ่อนเอา) + ATC + HUD ระยะ 📦 · ลงจอดบนตึกเป้า (เช็ก footprint+`|floor-h|<.5`) = +`MAIL_COIN`25 → พัก 9 วิ สุ่มใหม่วนทั้งคืน · ฟ้าสว่าง = mailStop เอง · นับรวมใน recap ท้ายรอบ ("📦 ส่งพัสดุ N") · ยืนยัน browser: ตี 5:22 จริง night=.42 ดาวโผล่ (op ลดตามหมอก) + beacon 6 ดวงวาบสลับเฟส (op 1/0.12) · mock 22:00 → mailGo → บินลงเป้า 8 tick → "📦 ส่งพัสดุสำเร็จ! +25🪙" +36 เหรียญ (25+10 perfect+1 ตัวอักษร ซ้อนกันถูก) mail.on→false count→1 · ไม่มี error · deploy `.345` · 🧪 testkit เพิ่ม: `sky · beacons · mail · mailGo/mailEnd`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 354:** 🚶🛗🚁🪂 **โลกเฮลิฯ เริ่มแบบเดินเท้า: เข้าตึก→ลิฟต์→นั่งริมหน้าต่าง→วิงสูท (ผู้ใช้สั่ง)** — state machine `hPhase` walk/lift/ride/wing/pilot · dispatch 2 จุด (loop+step) แยก tickHeli(pilot)/tickHeliFoot · (1) **buildHeliFoot** (เก็บใน `worlds.heli.foot`): ตึกเทอร์มินัล=ตึกใกล้ลานกลาง h≥12 · เจาะประตูฝั่งหันเข้าลาน + ป้าย 🛗 + **ล็อบบี้จริง** (พื้น/เพดาน/ผนังใน MeshBasic ผนังประตูเว้นช่อง G=1.3) + แผ่นลิฟต์เขียว (ล็อบบี้+ดาดฟ้า) + เฮลิฯ low-poly 2 ลำ (แดง=ขับเอง ลานกลาง · ฟ้า=โดยสาร ดาดฟ้า) (2) **เดิน**: WASD+จอย+look ปกติ · **⚠️ ต้องใช้ `footFloorAt(x,z,py)` ไม่ใช่ heliFloorAt — นับดาดฟ้าเฉพาะ py>h-1.2 ไม่งั้นก้าวเข้าล็อบบี้โดนดีดขึ้นดาดฟ้า** · ตึกเทอร์มินัลทะลุได้เฉพาะ `inDoorZone` (เช็ก wasIn≠willIn) · ราวกันตกขอบดาดฟ้า (drop>2 บล็อก) (3) **ลิฟต์**: ยืนบนวง <1.2 → เฟดดำ `#adv-liftfx` 1.3 วิ → เด้งขึ้น/ลง (4) **ride**: เฮลิฯ ฟ้าบินทัวร์ waypoint 6 จุด · กล้อง=ที่นั่งข้างขวา ลากมองได้ · กรอบหน้าต่าง `drawCabinWindow` (evenodd เจาะช่อง) บน #adv-gauges · เสียงใบพัดเบา playBuf vol .15 (ตัดตอน exitWorld ด้วย!) (5) **wing**: W ก้ม=เร่ง S เชิด=ร่อน A/D เลี้ยว · ไต่ไม่ได้ (ฟิสิกส์ร่อนจริง) · เก็บตัวอักษรเฉียด <3.4 ไม่ต้องจอด (จุดขาย!) · ชนตึกเจ็บ 12 · ลง spd>21 เจ็บ 10 · ถึงพื้น→walk (6) **pilot**: เดินชิดเฮลิฯ แดง <2.1 → `beginPilot()` = init เดิมครบ (HeliSound.start/setSeat(0)/cockpit) · ปุ่ม `#adv-wing`(ride+บนดาดฟ้า)/`#adv-tour` + CSS `.hfoot` ซ่อนชุดนักบิน+กระดานกลับบนสุด + touch exclusion + touch collective เฉพาะ pilot · ยืนยัน browser ครบสาย: ผนังกัน/ประตูเข้า/ล็อบบี้ y1.55/ลิฟต์→ดาดฟ้า 26.5/เดินชนเฮลิฯ ฟ้า→ride ลอย+ปุ่ม 2 ใบ+กรอบวาด/คลิก 🪂 →wing ร่อนดิ่งเก็บ 9 ตัวอักษรกลางอากาศ→ลงดาดฟ้าอื่น→walk→เดินชิดแดง→pilot ค็อกพิตโชว์+ซีเควนซ์สตาร์ทเดิน · ไม่มี error · deploy `.346` · 🧪 testkit: `phase · foot · goPilot/goRide/goWing · rideEnd · footTick(dt) · wing · setYaw`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 355:** 💫🪂🧑‍🤝‍🧑 **แหวนโบนัส + เข็มนักดิ่งพสุธา + เพื่อนเห็นเฟส (ต่อยอดวิงสูท ผู้ใช้สั่ง)** — (1) 💫 **แหวนทอง 8 วง** ลอยกลางอากาศ (Torus seed 7741 คงที่ทุกเครื่อง · เว้นตึก+3 · y 9-21 · หมุนช้า) สร้างใน buildHeliFoot `foot.rings` · ลอดรัศมี <2.4 = `WRING_COIN`5×คอมโบ (5,10,15..) · ≥3 วงติด sfx.levelup · **คอมโบรีเซ็ตตอนแตะพื้น · แหวนคืนครบทุกครั้ง goWing** (2) 🪂 **เข็มนักดิ่งพสุธา** `state.airLetterCount/airLetterBadge` 25=🪂/60=🛫/120=🦸 (`AIRL_TIERS` game.js + `awardAirLetter` adventure3d) นับเฉพาะตัวอักษรที่เก็บกลางอากาศ (call site วิงสูท ไม่แตะ pickUpLetter กลาง) · เข้า badgeSuffix/ตู้เข็ม/BADGE_META/NAME_BADGE_RE ครบ (3) 🧑‍🤝‍🧑 **เพื่อนเห็นเฟสเรา** — **ยัดเฟสลง field `av` เดิม ('h_w/r/g/p') ผ่าน rules เดิม ไม่ต้อง publish!** (makePeerSprite โหมดบินไม่เคยใช้ av · แพตเทิร์นเดียวกับ blk รถ) · ฝั่งรับ: heli av เปลี่ยน → สร้าง sprite ใหม่ อีโมจิตามเฟส 🚶/💺/🪂/🚁 · `sendPos(true)` ทุกจุดเปลี่ยนเฟส (⚠️ lastSent เทียบแค่ x/z/yaw — av เปลี่ยนเฉยๆ ไม่ส่งเอง ต้อง force) · ยืนยัน browser: แหวน 8 วง ลอด 2 วงติด +5/+10 แบนเนอร์ ×2 ถูก · เก็บกลางอากาศครบ 25 → เข็ม 🪂 ติด suffix + splitNameBadges แยกถูก · peer จำลอง av h_w→h_g sprite ถูกสร้างใหม่จริง · ไม่มี error · deploy `.347` · 🧪 testkit เพิ่ม: `rings · ringCombo` · **⏸️ ค้างรอผู้ใช้ตอบ: "ปุ่มซ้ายมือในหน้า lobby" คือปุ่มอะไร (ถามแล้วผู้ใช้ปิด dialog — ยังไม่ทำ)**


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 356:** 🗺️🚁 **แผนที่โลกเดิน→เมืองเฮลิฯ + ทรง Bell 212 สมจริง (ผู้ใช้สั่ง · ให้ดูวิดีโอ Bell 212 Landing เป็นแบบ)** — (1) 🗺️ **ไม่สร้างปุ่มใหม่** — `enterAdventure3D` (ui.js) เด้ง `pickAdvMap()` เลือก 2 การ์ด: 🌳 ทุ่งเดิม / 🚁 เมืองเฮลิฯ · เลือกเฮลิฯ → `Adventure3D.start('heli',{walkIn:true})` **เข้าได้โดยไม่มีตั๋วเฮลิฯ** (เช็กตั๋วย้ายไป `beginPilot` — เดิน/นั่งโดยสาร/วิงสูทฟรี ขับเองไม่มีตั๋วโดนป้ายบอก+คูลดาวน์ 4 วิ `_pilotDenyAt`) · กล่อง clamp ตาม vh พอดีจอเตี้ย (2) 🚁 **heliMeshBuild ใหม่ทรง Bell 212**: จมูกกระจกมน+กระจกคาง 2 บาน · หน้าต่างประตูสไลด์ · ฝาครอบ Twin-Pac+ช่องรับลม+ท่อไอเสีย · **ใบพัดหลัก 2 กลีบ+flybar ถ่วง** (เอกลักษณ์ Bell) · บูมหางเรียว+แพนหาง+ครีบเฉียง · **ใบพัดหาง 2 กลีบฝั่งซ้าย** (`_trotor` หมุนตอนทัวร์) · สกี 2 รางปลายงอน+ขา 4 จุด · คาดขาวใต้ท้องทูโทน · ยืนยัน browser 812×375: กล่องแผนที่ sh=ch=178 fit · เลือกเฮลิฯ ไม่มีตั๋ว → phase walk จริง · เดินชิดลำแดง → ป้าย "🎫 ขับเองต้องมีตั๋ว..." ไม่เปลี่ยนเฟส · ขึ้นนั่งลำฟ้าฟรี → ride · พิกเซลลำแดง 14k+ใบพัดเข้ม 2.5k = เรนเดอร์จริง · ไม่มี error · deploy `.348` · ⏸️ ปุ่มซ้าย lobby: ผู้ใช้บอกไม่ต้องทำแล้ว (ใช้ทางเข้าแผนที่แทน)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 357:** 🚪🌪️🎨 **ประตูสไลด์ + ใบพัดเร่ง/ฝุ่นตลบ + สีเทศกาล (ต่อยอด Bell 212)** — (1) 🚪 heliMeshBuild เพิ่ม `_door` group ฝั่งขวา (บาน+หน้าต่าง+ราง) · `doorLerp(h,target,k)` เลื่อน z 0→1.15 · **เดินใกล้บานเปิดเอง** (ฟ้า: บนดาดฟ้า<4.5 · แดง: <4+มีตั๋ว) · ปิดระหว่างเร่งใบพัด (2) 🌪️ `dustBurst/dustTick` สไปรต์ฝุ่น (CanvasTexture แชร์ — **ห้าม dispose map**) พุ่งวง+ลอย+จาง ลบตัวเอง · จุดยิง: goRide เครื่องติด · ใบพัดเต็มรอบ (`rideSpin` 0→1 ใน 2.6 วิ **ลำจอดนิ่งจนครบรอบค่อยบิน**) · beginPilot · HeliSound.ready (pilot) · dustTick ทั้ง tickHeli+tickHeliFoot (3) 🎨 `festivalPaint(d)`: 20 ธ.ค.–5 ม.ค.=ปีใหม่ทอง-แดง · 11–16 เม.ย.=สงกรานต์ฟ้า-ชมพู · ตัดสินตอน buildScene ส่ง col+accent เข้า heliMeshBuild (คาดใต้ท้องเปลี่ยนสีตาม) · ยืนยัน browser: fest วันนี้ null/25 ธ.ค. ปีใหม่/13 เม.ย. สงกรานต์/5 ม.ค. ปีใหม่ ครบ · ประตูฟ้าใกล้ .99 ไกล 0 · ประตูแดง 3.4m+ตั๋ว .99 · spin 0→.58 (ลำนิ่ง y26.3)→1 แล้วบินจริง · ฝุ่น 20→17 (จาง)→+28 (เต็มรอบ)→0 (เก็บหมด) · ไม่มี error · deploy `.349` · 🧪 testkit เพิ่ม: `doors · dustN · rideSpin · fest · festAt(iso)`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 358:** 🔊🖼️ **เสียงประตูสไลด์ + เตรียม texture ลำจริง (ผู้ใช้สั่ง)** — (1) 🔊 `doorSlideSfx(open)`: "ชึ่ก" noise ผ่าน bandpass กวาด (เปิด 700→1350Hz · ปิดกลับทาง) + "กึก" sine 150→70Hz ที่ 0.26s · trigger ใน doorLerp เมื่อ `_doorTgt` เปลี่ยน (เฟรม init แรกเงียบ by design) · ต่อตรง destination ไม่ผ่าน master (envLp ทุ้ม) (2) 🖼️ heliMeshBuild probe `applyTex`: `tex_heli_body` (tint ตามสีลำ — **ภาพต้องเทาอ่อนเกือบขาว ลายเดียวย้อมได้ทุกสี/เทศกาล**) + คาด accent + `tex_heli_metal` (ใบพัด/สกี) · ไม่มีไฟล์=สีพื้นเดิมเงียบๆ · **prompt 3 ชุด**: `PROMPTS_HELI_TEXTURE.md` + Artifact ปุ่มคัดลอก **https://claude.ai/code/artifact/c6a437cb-9b89-41e9-95dc-269efae1328e** · ยืนยัน browser: ประตูปิด 1 ทรานซิชัน = สร้าง buf1+osc1 จริง (spy นับ) · probe ยิง .jpg→.png ครบ 4 ไฟล์ 404 แล้ว fallback ลำยังเรนเดอร์ปกติ · ไม่มี error · deploy `.350` · **ค้างผู้ใช้: เจนภาพ 2-3 ไฟล์วาง `img/tex/` แล้วบอก commit** (ไฟล์ที่ 3 กระจก ต้องบอก Claude ต่อสายเพิ่ม)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 359:** 📢 **ป้ายโฆษณาเฮลิฯ ย้ายจากยอดตึก→แนบผนัง (ผู้ใช้สั่ง — เดิมลอยบนเสาค่อมตัวอักษรบนดาดฟ้า)** — adventure3d.js บล็อกสร้างป้ายใน buildScene heli: เลิก lookAt+เสา 2 ต้น → ติดผนังฝั่งหันเข้ากลางเมือง (แกน |x|≥|z| เลือกผนัง · offset w/2+.08) ชิดใต้ขอบดาดฟ้า (top=h-.5) · กว้างตามผนัง `min(faceW-.8,11)` · `panel.name='adpanel<n>'` ไว้เทสต์ · ผังเมือง seed ไม่เปลี่ยน (ไม่แตะลำดับ rnd) · ยืนยัน browser: ครบ 10 ป้าย below-roof/on-wall/fit/faces-center ทุกใบ · ไม่มี error · deploy `.351` SW v79


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 360:** 🌙📢 **แสงเรืองขอบป้ายผนังตอนกลางคืน (ต่อยอดรอบ 359 ผู้ใช้สั่ง "ทำเลย")** — glow plane (pw+.9) AdditiveBlending สีทองอ่อน เป็นลูกของ panel (z-.03 หมุนตาม) เก็บ `worlds.heli.adGlows` · fogUpdate: ติดเมื่อ `night>.3` · `op=night*.55*(1-fog*.4)` · ยืนยัน browser mock ชม.: เที่ยง 0/10 ดับ · 22:00 10/10 op .55 · ตี 5 (หมอกหนา) 10/10 op .263 ตรงสูตรเป๊ะ · ไม่มี error · deploy `.352` SW v80


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 361:** ✨📢 **ป้ายผนัง 3 ป้ายกะพริบหายใจกลางคืน (ต่อยอดรอบ 360 ผู้ใช้อนุมัติ)** — ป้าย n%4===1 (1/5/9) ตั้ง `glow.userData.ph=n*2.1` · `adGlowPulse(now)` คูณ base ด้วย `.35+.65*(.5+.5*sin(now/446+ph))` คาบ ~2.8 วิ · fogUpdate เก็บ `userData.base` ให้ · เรียกคู่ไฟกันชนทั้ง tickHeli+tickHeliFoot · ยืนยัน browser mock 22:00 + footTick 3 จุดเวลา: ป้าย 1 ขึ้น .35→.55 · ป้าย 5 ลง .53→.31 · ป้าย 9 แกว่งต่ำ · ป้าย 2 นิ่ง .55 · ไม่มี error · deploy `.353` SW v81


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 362:** 🪧 **ระบบเช่าป้ายโฆษณาเมืองเฮลิฯ (backlog รอบ 183 ผู้ใช้อนุมัติ)** — ปุ่ม 🪧 เฟสเดิน (`show-adshop` toggle ใน tickHeliFoot) → dialog grid 5×2 ป้าย 1-10 (ว่าง=เช่า `AD_RENT_COIN`300 · มีผู้เช่า=ชื่อ+วันเหลือ · `_adHasImg`=🔒ผู้สนับสนุน) · DB `/ads/<n>`={uid,n,ts} เช่า `AD_RENT_MS` 7 วัน · adBoardTexture วาดชื่อผู้เช่าเมื่อไม่มีไฟล์ลูกค้า (`_adTexDraws` redraw ทีหลัง) · **หักเหรียญหลัง set สำเร็จเท่านั้น** deny=toast ไม่เสียเหรียญ · ยืนยัน browser 812×375: dialog fit sh=ch=158 · ซื้อจริง 500→200+ชื่อขึ้น "✅ ของฉัน เหลือ 7 วัน" · deny เหรียญไม่หด+ปุ่มคืน · ไม่มี error · deploy `.354` SW v82 · **✅ rules /ads publish แล้ว 19 ก.ค. ตรวจสดผ่านครบ** (REST + เทียบทั้งไฟล์ identical 20 โซน · ของค้างเก่า 186/187/241/255-256 ติดมาครบ — ดู RULES.md) · ระบบเช่าป้ายเปิดใช้จริงบน live แล้ว รอผู้ใช้ลองเช่าจริงในเกม · testkit: `_t.heli.adShop.{open,buy,fetchAds,render,renters,el,redraw}`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 363:** 📻🪧 **ATC ประกาศป้ายใหม่ + sync ผู้เช่าสด + 🐛 แก้บั๊กร้ายแรงรอบ 362** — (1) 🐛 **guard `window.Online` ใช้ไม่ได้จริง!** online.js ประกาศ `const Online` = global lexical ไม่มีบน window → adsFetch/adRentBuy รอบ 362 return เงียบทุกครั้งบนโปรดักชัน (เทสต์รอบก่อนผ่านเพราะ fake `window.Online` ค้างจาก attempt แรก) → แก้เป็น `Online.ready&&Online.db` ตรงๆ ทั้ง 3 จุด · **⚠️ บทเรียน: เทสต์ mock Online ต้อง mutate ตัวจริง (`Online.ready=true; Online.db=fake`) ห้ามตั้ง window.Online** (2) `adsWatch()` on child_added/changed/removed หลัง adsFetch เติม adRenters (ชุดแรกข้อมูลเท่าเดิม=ไม่ประกาศ) · ป้าย/dialog อัปเดตสดทุกเครื่อง · `adsStop()` ใน exitWorld (3) ผู้เช่าใหม่จริง (ไม่ใช่ตัวเอง · ts สด <2 นาที) → `ATC.say` วิทยุอังกฤษ + toast "🪧 ป้าย n มีเจ้าของใหม่: ชื่อ" · ยืนยัน browser 4 เคส: เพื่อนใหม่=วิทยุ+toast ✓ · ข้อมูลเดิม/ตัวเอง/เก่า 5 นาที=เงียบ (renters ยังอัปเดต) · exitWorld ตัด listener ครบ · ไม่มี error · deploy `.355` SW v83 · testkit เพิ่ม: `adShop.{changed,watch,stop,watching}`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 364:** 🖼️🏙️ **texture ลำเฮลิฯ เข้าเกม + prompt ผนังตึกสมจริง (ผู้ใช้วางไฟล์+ขอ)** — (1) ผู้ใช้วาง `img/tex/tex_heli_{body,metal,glass}.png` → แปลง .jpg (q86 · 5.4MB→518KB · แพตเทิร์นเดียว asphalt: jpg เข้า git, png ใหญ่อยู่ local) + **ต่อสายกระจก `applyTex(gl,'tex_heli_glass')`** (รอบ 358 ค้างไว้) · ยืนยัน browser: ลำจอด 2 ลำ map ติด body16(ย้อมแดง/ฟ้า/ขาวจากลายเดียว)/glass10/metal38 · ไม่มี error · live .jpg 200 ครบ 3 · deploy `.356` SW v84 (2) 🏙️ **prompt ผนังตึก photorealistic 6 แบบ** (ผู้ใช้ขอ "สมจริง" — ชุดเดิมใน PROMPTS_BUILDINGS.md เป็นการ์ตูน) → Artifact ปุ่มคัดลอก **https://claude.ai/code/artifact/597a2937-aefe-486e-877a-15885d3bfd66** + สำรองท้าย PROMPTS_BUILDINGS.md · **ค้างผู้ใช้: เจน facade_1..6.png วาง `img/buildings/` แล้วบอก commit** (เกม probe เองอยู่แล้ว ไม่ต้องแก้โค้ด)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 365:** 🪧💰 **ค่าเช่าป้ายโฆษณา 300→1,000 เหรียญ (ผู้ใช้สั่ง)** — `AD_RENT_COIN` adventure3d.js + จัดรูป `fmtNum` ในปุ่ม/toast · ยืนยัน browser: ปุ่ม "เช่า 1,000🪙" · ซื้อหัก 1500→500 · เหรียญ 500 ไม่พอ=ไม่เช่าไม่หัก · deploy `.357` SW v85


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 366:** 🪧💰 **โบนัสบินผ่านป้ายตัวเอง (ต่อยอดรอบ 365 ผู้ใช้อนุมัติ)** — `adFlybyTick(now)` ใน tickHeli (โหมดนักบิน): ผ่านป้ายที่ตัวเองเช่า (dxz<14 · y∈[h-9,h+7]) = +`AD_FLYBY_COIN`2 เพดาน `AD_FLYBY_CAP`10🪙/วัน (`state.adFlyby={d,n}` เซฟปกติ) · กันฟาร์ม: ต้องออกโซนก่อน (hysteresis `_adFlybyNear`) + คูลดาวน์ 30 วิ/ป้าย · **🐛 เจอตอนเทสต์: default `_adFlybyAt||0` ทำ 30 วิแรกหลังโหลดหน้าไม่ได้รางวัล → ใช้ `||-1e9`** · ยืนยัน browser: เข้าโซน +2 · ค้างโซน/กลับเร็ว=0 · ครบ 30 วิ +2 · เพดาน 10=0 · ป้ายคนอื่น=0 · ไม่มี error · deploy `.358` SW v86 · testkit: `adShop.{flybyTick,flybyNear,clearFlyby}`


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 367 (เอกสาร ไม่ deploy):** 🌅🎬 **prompt ท้องฟ้า+เพลง Suno แบบหนัง (ผู้ใช้ขอ)** — Artifact ปุ่มคัดลอก **https://claude.ai/code/artifact/37b31b7f-d44a-4f9c-a2b3-5f0e27a990cb** · ฟ้า 2 อารมณ์ (A รุ่งอรุณทอง/B เมฆยักษ์) → `img/sky/sky_dawn.jpg` equirect 2:1 (สำรองท้าย PROMPTS_SKY.md) · เพลง instrumental 3 เพลง (ธีมหลัก/ลอยรุ่งอรุณ/ภารกิจกลางคืน) → `sound/bgm/bgm_01..03.mp3` music.js probe เอง (สำรอง PROMPTS_MUSIC_SUNO.md ใหม่) · ✅ ผู้ใช้วางไฟล์แล้ว → รอบ 368


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 368:** 🌅🎵 **ฟ้าจริง+เพลงหนังเข้าเกม (ผู้ใช้เจนวางครบ)** — sky_dawn.png ผู้ใช้ 1536×1024 (ratio 1.5 ผิดสเปก 2:1) → PIL resize 2048×1024 เซฟ `img/sky/sky_dawn.jpg` 238KB (png ใหญ่อยู่ local ไม่ commit) · bgm_01..03.mp3 (~12MB) commit ตรงๆ แพตเทิร์น SongsInCar · ยืนยัน browser: เข้าเฮลิฯ `scene.background` เป็น Texture sky_dawn.jpg mapping equirect(303) จริง · Music probe HEAD 01→200,02→200,03→200,04→404 หยุดถูก = เจอ 3 เพลง (เล่นจริงรอ user gesture ตาม autoplay policy) · **⚠️ เจอ dev server ตายกลางเทสต์ SW เสิร์ฟ cache เงียบ (gotcha 167 อีกรอบ) — preview_start ใหม่+unregister SW แก้ได้** · deploy `.359` (ไม่บัมพ์ SW — ไม่แตะไฟล์ shell)


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 369:** 🎬🎵 **เพลงตามฉากโลกเฮลิฯ (ต่อยอดรอบ 368 ผู้ใช้อนุมัติ)** — music.js เพิ่ม `Music.sceneBg(name|null)` (ล็อกเพลงชื่อนั้นวนลูป · ยังไม่ probe เสร็จ=ไม่เก็บชื่อให้เกมเรียกซ้ำติดเอง · ปล่อย=loop off หมุนต่อปกติ) + `curScene/bgReady` · adventure3d: `heliMusicTick()` ใน tickHeli+tickHeliFoot → `night>.5`=bgm_03 (สายลับ) · pilot/wing=bgm_01 (ทะยาน) · walk/lift/ride=bgm_02 (ล่องลอย) · exitWorld ปล่อย sceneBg(null) · ยืนยัน browser (Audio spy): เดินกลางวัน=bgm_02 · mock 22:00=bgm_03 · goWing กลางวัน=bgm_01 (bg เดียว loop:true src ตามฉาก) · ออกโลก scene=null loop=false · ไม่มี error · deploy `.360` SW v87


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 370:** 🏙️ **ผนังตึกภาพจริงเข้าเกม (ผู้ใช้แจ้ง "วางภาพแล้วตึกไม่เปลี่ยน")** — ต้นตอ: ไฟล์วางถูกครบ (facade_1..6.png 1024² · 9.4MB) แต่**ยังไม่ commit+deploy = live 404** เกม fallback หน้าต่างวาดเอง · แก้: แปลง .jpg q85 (รวม 1.1MB · png ใหญ่อยู่ local) + **buildingFacadeTexture probe .jpg ก่อน .png** (เดิมหา .png อย่างเดียว) · ยืนยัน browser: ตึก 20 หลัง map เป็น facade_1..6.jpg ครบ 0 หลัง procedural · ไม่มี error · deploy `.361` SW v88


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 371:** 🚁 **เฮลิฯ ลำโค้งมนสมจริง (ผู้ใช้ขอ "สมจริงกว่านี้")** — `heliMeshBuild` เลิกทรงกล่อง: ลำตัว ellipsoid+ท้อง accent มน+โดมกระจกหน้า (SphereGeometry) · Lambert→**Phong** (specular/มันเงา · กระจก shininess150) · เพิ่มแคปซูลฝาเครื่อง+ไอเสียคู่+swashplate+ใบพัดแยก 2 กลีบ coning+endplate แพนหาง+กันหางกระแทก+ไฟ nav แดง/เขียว+บีคอน+pitot+เสาอากาศ (49 mesh/ลำ) · คง `_door/_rotor/_trotor` + applyTex เดิม (body repeat 2,1 กัน UV ยืด) · ยืนยัน browser: 2 ลำประกอบครบ Phong 45/45 มี texture map · ประตูสไลด์ 0→.99 (z 1.14) · ไม่มี console/GL error (screenshot tool ค้าง — ตรวจตัวเลขตามกฎ) · deploy `.362` SW v89 · **ค้าง: ผู้ใช้ดูภาพลำจริงในเกมแล้ว feedback**


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 372 (tools/เอกสาร ไม่ deploy):** 🗂️ **สารบัญโซนไฟล์อ้วน (ผู้ใช้สั่ง "ไฟล์โลก 3D บวม ทำสารบัญ+กลไกกำกับ")** — `gen_code_map.py` สแกน banner `/* ==== */` → เจน "🗂️ สารบัญโซน" (`st-end ชื่อโซน`) ต่อไฟล์ ≥1,200 บรรทัดใน CODE_MAP + เตือนโซน >900 บรรทัดทุก rotate (ค้าง 2 จุด: buildDom · โชว์รูมรถ ui — แตะครั้งถัดไปคั่น banner ย่อย) · กฎใหม่ใน HANDOFF กฎทอง #2 + skill: งานทั้งระบบ/โลก 3D → Grep ชื่อโซน ทำเฉพาะช่วง · ระบบใหม่ต้องครอบ banner · ยืนยัน: Grep "เฮลิ" ได้ช่วงถูก


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 373 (tools ไม่ deploy):** 🚨🪓 **ยามโซนโตเร็ว+เกณฑ์ผ่าไฟล์ (ต่อยอดรอบ 372 ผู้ใช้อนุมัติ)** — `gen_code_map.py`: `parse_old_toc()` เทียบขนาดโซนชื่อเดิมกับ CODE_MAP เจนครั้งก่อน → โต ≥150 บรรทัดโดยไม่มี banner ใหม่ = 🚨 เตือนให้ครอบ banner ก่อน commit (จับตอน rotate ทุกรอบ) · ไฟล์ ≥12,000 บรรทัด = 🪓 แจ้งถึงเกณฑ์ผ่าไฟล์ ปรึกษาผู้ใช้ก่อน · ยืนยัน: เคสปกติเงียบ / จำลองหด baseline โซน Texture → 🚨 +282 ถูกต้อง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 374:** 🚪 **เจาะทางเข้าเทอร์มินัลเป็นประตูจริง (ผู้ใช้ส่งภาพ "เป็นผนังหน้าต่าง")** — เดิมทางเข้า=เดินทะลุ facade ไม่มีช่องให้เห็น · เพิ่มซุ้มประตูใน `buildHeliFoot`: ช่องมืด+วงกบ+กันสาด+ธรณี+บานกระจก 2 บาน `entLerp` สไลด์แยกซ้าย-ขวาอัตโนมัติ (เดินใกล้ <3.6 เปิด · เสียง `doorSlideSfx` เดิม · เรียกใน tickHeliFoot) · testkit `foot.ent` · ยืนยัน browser: ใกล้=.99 ไกล=0 กลับมา=.99 ไม่มี error · ⚠️ บทเรียนเทสต์: ตั้ง `state.heliTicket=true` ใน eval เดียวกับ authOnLogin จะโดน state ทับ → start() abort เงียบ (mode ค้างเป็น heli ก่อน guard) ต้องตั้งหลัง login settle · deploy `.363` SW v90 · ค้าง: ผู้ใช้ดูภาพจริง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 375:** 🏢🚶 **ดาดฟ้าพื้นทึบ + ปุ่มลงจากเฮลิฯ (ผู้ใช้ส่งภาพ+ขอ)** — (1) ตึกเมืองเฮลิฯ facade ห่อทั้งกล่องรวมหน้าบน → material array `[wall×2,roofM×2,wall×2]` roofM=`tex_concrete` probe (ไม่มีไฟล์=เทา 0x565b63) · ยืนยัน: ตึก 20 หลัง roof=tex_concrete.jpg ผนัง=facade ✓ (2) ปุ่ม `#adv-dismount` โชว์เฉพาะจอดสนิท (toggle `show-dismount` ใน tickHeli) → `endPilot()`: ลำแดงย้ายมาจอดตรงจุดลง+หาที่ยืนข้างลำระดับพื้นเดียวกัน (กันตกขอบ/ในตึก) → เฟสเดิน · ขึ้นต่อ: dPilot/doorLerp วัดจาก `pilotH.position`+ระดับ `pLv` (ไม่ใช่ origin/y<3) · beginPilot เริ่มจากตำแหน่งลำจริง · ยืนยัน browser: จอด=ปุ่มโชว์ บิน=ซ่อน · ลงบนดาดฟ้าตึก h21 ยืนข้างลำ · เดินใกล้ประตูเปิด .99 · ชิด=phase pilot camY ถูก · ไม่มี error · testkit เพิ่ม `heli.tick` `goFoot` · deploy `.364` SW v91 · ค้าง: ผู้ใช้ลองจริง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 376:** 👟🔠🚁 **3 ต่อยอดรอบ 375 (ผู้ใช้ "ทำได้เลย")** — (1) `footStepSfx(hard)` ฝีเท้า synth ตามจังหวะก้าว (`_stridePh` ทุก 1.55m): ดาดฟ้า/ล็อบบี้=ก้องแหลม · ถนน=ทุ้มนุ่ม (2) เฟสเดินชนตัวอักษรเก็บได้ (dxz<1.7 + ระดับสูง <2.4 กันเก็บทะลุชั้น) · ยืนยัน: บนดาดฟ้าเก็บได้ 54→49 · พื้นล่าง=ไม่เก็บ (3) field `hp`="x,z,y,yaw" ลำแดงจอดทิ้งไว้ (ส่งเมื่อพ้นลาน >4m · fallback แพตเทิร์น tl `netHpOk`) · ฝั่งรับ tickPeers วาด `p.heliSpr` heliMeshBuild+เก็บเมื่อ hp หาย+`disposeHeliMesh` ใน removePeer · ยืนยัน 3 เคส: วาดตรงตำแหน่ง/เก็บ/ค่าเพี้ยนไม่ crash · ไม่มี error · **⏳ รอผู้ใช้ publish rules เพิ่ม "hp" — Artifact ปุ่มคัดลอก https://claude.ai/code/artifact/15c56471-3c45-4425-81ae-f6cb1b6d858d (สำรองใน RULES.md)** · testkit เพิ่ม `peersTick` · deploy `.365` SW v92


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 377:** 🚁 **ลำทรง Bell 212 ตามภาพอ้างอิงผู้ใช้ (N212KA)** — `heliMeshBuild`: ลำตัว `LatheGeometry` โปรไฟล์หยดน้ำหัวแหลมมน (รัศมี 0→.51→.82→เรียวท้าย .28) เอียง -.07 หัวก้มท้ายเชิด · **สลับโทน: ขาว(accent)บน + สี(col)ล่าง** แถบสีหุ้มปลายหัว/บานประตูขาว+แถบสี · บูมยกสูง y1.85 ต่อแนวหลังคา + แฟริ่งเชื่อม · ครีบตั้งสี col · ไอเสียใหญ่เดี่ยวแบบ 212 · ยืนยัน browser: lathe จริง รัศมีวัดจาก vertex ✓ · ประตูสไลด์ .99 ✓ · ลำเพื่อน (hp) ใช้ mesh ใหม่ ✓ · ไม่มี error · deploy `.366` SW v93 · ค้าง: ผู้ใช้ดูภาพจริงเทียบ reference


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 378:** 📏✅ **(1) rules `hp` ผู้ใช้ publish แล้ว — ตรวจสดผ่าน** (CLI `/.settings/rules` ผ่าน MSYS_NO_PATHCONV=1: validate ≤28 ตรง · 20 โซนครบ) ลำเพื่อนจอดเปิดใช้จริง **(2) ลำขนาดสัดส่วนจริงเทียบคน (ผู้ใช้ขอ)** — `HELI_MESH_SCALE=1.6` `g.scale.setScalar` ท้าย heliMeshBuild → ยาว ~11.7ม. สูง ~5.2ม. (Bell 212 จริง 12.9/4.5 · คน 1.7) · ขยายระยะโต้ตอบตาม: ประตู pax<6.4 pilot<5.8 · ขึ้นนั่ง<3.7 · ขึ้นขับ<3.0 (hint<5.2) · ลงเดินยืนห่าง 3.2 · กล้อง ride ริมหน้าต่าง 1.3/+.55 · endRide +2.3 · ยืนยัน browser: box 11.7×5.2 · ประตูเปิดที่ 4.5 ไม่ขึ้น · 2.5=ขึ้นขับ · ลงเดินยืน 3.2 พ้นลำ · ไม่มี error · deploy `.367` SW v94 · ค้าง: ผู้ใช้ดูภาพจริง+ลอง 2 เครื่องดูลำเพื่อนจอด


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 379:** 🪟 **หน้าต่าง 1 แถว = 1 ชั้นจริง (ผู้ใช้ทัก "2 บาน = 1 ชั้น ขัดความจริง")** — เดิม repeat.y=h/6 เท่ากันทุกภาพ แต่ facade แต่ละภาพมีชั้นใน tile ไม่เท่ากัน → ชั้นสูงแค่ 0.75-1.5ม. · แก้: `FACADE_ROWS={1:8,2:6,3:5,4:4,5:8,6:5}` (นับจากภาพจริง — เปลี่ยนภาพต้องนับใหม่) + `repeat.y=floors/rows` โดย floors=round(h/3) จำนวนเต็ม = ขอบบนตัดตรงรอยต่อชั้น ไม่หั่นกลางหน้าต่าง · ยืนยัน browser: ตึก 20 หลัง สูงต่อชั้น 2.8-3.45ม. ครบ 0 หลังหลุดช่วง · ไม่มี error · deploy `.368` SW v95 · ค้าง: ผู้ใช้ดูภาพจริง


## ⏬ ย้ายเมื่อ 2026-07-19 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 380:** 🚁 **ลำตัว/หางตามเส้นขอบภาพ Bell 212 จริง (ผู้ใช้ทัก "ยังไม่เหมือน ลากขอบเทียบ")** — เปิดภาพลากขอบ: เลิก lathe หยดน้ำ → `Shape` ข้างลำ+`ExtrudeGeometry` bevel: จมูกสั้นมนระดับต่ำ · กระจกหน้าลาดชัน · หลังคาแบน · ท้องแบน · **ท้ายลำท้องกวาดขึ้นสอบเข้าโคนบูม** (เอกลักษณ์ 212) · โทนใหม่ตามภาพ: ลำสี col ทั้งลำ + แถบท้องขาว 2 ท่อน (ตรง+เอียงตามท้าย) · ผนังหนา ±.84 → ขยับหน้าต่างข้าง/ไฟ nav พ้นผิว · ยืนยัน browser: vertex ขอบล่าง .42 แบน→กวาดขึ้น .93 · หลังคา 2.08 แบน · ขึ้นขับ/ประตูปกติ · ไม่มี error · deploy `.369` SW v96 · ค้าง: ผู้ใช้เทียบภาพจริง


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 382:** 🚁 **เปลี่ยนลำเฮลิฯ เป็นโมเดลจริง `img/models/helicopter.glb` (ผู้ใช้สั่ง)** — heliMeshBuild โหลด GLB ครั้งเดียว cache→clone ต่อลำ (Tripo 28 ชิ้น 48K tris ลาย แดง-ขาว baked) · ครอบ pivot node ใบพัดหลัก(part_2/7/8)+หาง(9/10/19/24) คง API `_rotor.rotation.y`/`_trotor.rotation.x` เดิม · หมุนหัว -X→-Z + สเกลยาว 12.3ม. จมูก z=-3.92 ตรงลำเดิม สกีแตะพื้น · ลำโค้ดเดิม=fallback (heliMeshBuildLegacy) · disposeHeliMesh ข้ามลำ `_glbShared` (แชร์ geometry กับ cache) · texture encoding→Linear ให้โทนตรงเกม · ⚠️ ประตูสไลด์/สีทูโทน per ลำ/สีเทศกาล หายไป (โมเดลไม่มีบานแยก+ลายอบตายตัว — doorLerp/testkit กันไว้ไม่ crash) · ยืนยัน browser: ลำจอด 2 ลำ+ลำเพื่อน(hp) เป็น GLB · ใบพัดหมุนถูกแกน (หลัก=แกนตั้ง หาง=ระนาบตั้ง) · removePeer ไม่พังลำอื่น · ไม่มี error (screenshot tool ค้างทั้ง session — ตรวจตัวเลขตามกฎ) · deploy `.370` SW v97 · ค้าง: ผู้ใช้ดูภาพลำจริงในเกม


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 383:** 🔵 **ลำโดยสารลายฟ้ากลับมาแยกจากลำแดง (ต่อยอด (1) รอบ 382 ผู้ใช้สั่ง)** — ไม่เจน Tripo ใหม่: ย้อม texture เดิมด้วย Python (HSV: hue แดงจัด→211° ฟ้า 0x2f7fd4 · ขาว/เทา/ส้มคงเดิม) → `img/models/helicopter_tex_blue.jpg` · โค้ด: `heliMatBlueGet` clone material กลางครั้งเดียว cache แชร์ทุกลำฟ้า (⚠️ TextureLoader ต้อง `flipY=false` ตาม UV ของ glTF + encoding Linear) · เลือกลาย: ช่องสี b>r ของ col (pax 0x2f7fd4/สงกรานต์=ฟ้า · pilot/peer/ปีใหม่=แดง) · ยืนยัน browser: paxH ใช้ tex_blue 1024px flipY=false ✓ pilot/peer material แดงเดิมแชร์กัน ✓ ไม่มี error · deploy `.371` SW v98 · ค้าง: ผู้ใช้ดูภาพจริง 2 ลำ


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 384:** 🟢 **วงลิฟต์บนดาดฟ้าย้ายมุมไกลลำ (ผู้ใช้ส่งภาพ: วงจ่อข้างลำฟ้า เดินเบียดแล้วเหยียบวงโดนส่งกลับชั้น 1)** — ต้นตอ: วงดาดฟ้าใช้จุดเดียวกับลิฟต์ล็อบบี้ (`liftIn` ชิดผนังหลัง) แต่ลำ GLB กว้าง 6ม. จอดห่างแกนตึกแค่ 2.2ม. · แก้ buildHeliFoot: เพิ่ม `liftRoof` เลือกมุมดาดฟ้าไกล paxPos สุดจาก 4 มุม (เยื้องขอบ 1.6) ย้าย padR ไป · trigger ขาลง `dLiftR` แยกจากขาขึ้น (ล็อบบี้ใช้ liftIn เดิม) · ขาขึ้นโผล่ liftRoof+1.6 เข้าหากลางดาดฟ้า (พ้นรัศมีวง 1.2 ไม่เด้งกลับ) · testkit `foot.liftRoof` · ยืนยัน browser: วงใหม่ห่างลำ 7.6ม.(เดิม 5.37 จ่อข้างลำ) · จุดเก่าบนดาดฟ้าไม่ trigger แล้ว · ขึ้น=โผล่ (-1.7,26.5,24.7) ห่างลำ 4.7 · ลงจากวงใหม่=ถึงล็อบบี้ตรงเป๊ะ · ไม่มี error · ⚠️ บทเรียน testkit: เฟสลิฟต์/เดิน จบใน `footTick` ไม่ใช่ `tick` (tick=ฟิสิกส์บิน) · deploy `.372` SW v99 · ค้าง: ผู้ใช้ลองเดินจริง


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 385:** 🚁 **ลำเพื่อนที่กำลังบิน = โมเดล 3D หันตาม yaw (ผู้ใช้ทัก "ยังเป็นภาพแบน")** — tickPeers โซน M.heli: อ่านเฟส `p.av` (`h_p`=ขับ→ลำแดง · `h_r`=นั่ง→ลำฟ้า · เดิน/วิงสูทคง sprite) สร้าง `p.flySpr`=heliMeshBuild ตาม x/z + y-2.2 (y ที่ส่ง=ระดับสายตานักบิน) + rotation.y lerp ทางสั้นเข้าหา yawTgt · ใบพัดหมุนเร็ว 28/46 · makePeerSprite เฟส p/r ไม่วาด emoji (เหลือป้ายชื่อ ยกลอย +4.6 พ้นใบพัด) · removePeer เก็บ flySpr · ยืนยัน browser: peer h_p=แดง 28 mesh yaw ตรง · h_r=tex ฟ้า · เปลี่ยนเฟส h_w ลำหาย/กลับ h_p ลำโผล่ yaw converge · ไม่มี error · deploy `.373` SW v100 · ค้าง: ผู้ใช้ลองจริง 2 เครื่อง


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 386:** 🛩️🔊🔦 **3 ต่อยอดลำเพื่อนบิน (ผู้ใช้ "ทำทั้ง 3 ข้อ")** — (1) เอียงลำเข้าโค้งตามอัตราเลี้ยว (order YZX · clamp ±.32) + ก้มจมูกตามความเร็ว (จมูก -Z → pitch ติดลบ) (2) `peerRotorTick/Stop`: เสียงใบพัดต่อลำ แชร์ buffer `HeliSound.files.rotor` ต่อตรง destination (ไม่ผ่าน master ที่โดน env หรี่) gain ตามระยะ 3 แกน เงียบ ~85ม. พิตช์สุ่มต่อลำ · หยุดเมื่อเปลี่ยนเฟส/removePeer (3) `heliGlbAssemble` เพิ่มไฟเดินอากาศ `_nl` (nav แดง/เขียว+บีคอนกะพริบบนบูม+ไฟท้าย) `heliNavTick` โชว์เมื่อ `heliNight>.15` — ลำเพื่อนบิน/ลำเพื่อนจอด(hp)/ลำจอดฉาก(pilotH,paxH) ครบ · ยืนยัน browser: บินตรง pitch -.12 เลี้ยว bank .26 · gain .26@38ม. · sunAt(22)→ไฟติด บีคอนกะพริบ .25↔1 · เปลี่ยนเฟสเดิน=ลำ+เสียงหยุด · ไม่มี error · deploy `.374` SW v101 · ค้าง: ผู้ใช้ลองจริง 2 เครื่อง (โดยเฉพาะฟังเสียง+ดูไฟกลางคืน)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 387:** 🎵🐛 **เพลงฉากโลกเฮลิฯ ไม่เคยดัง (ผู้ใช้ทัก "เตรียมไฟล์เพลงแล้วทำไมไม่ได้ยิน")** — ตรวจก่อน: `sound/bgm/bgm_01-03` ขึ้นเว็บครบ (HTTP 200 ขนาดตรง) → ต้นตอไม่ใช่ไฟล์ แต่เป็นบั๊กตั้งแต่รอบ 369: เข้าโลก 3D เรียก `Music.suspendBg()` → `bgAllowed()` เห็น bgSuspended=true บล็อก `sceneBg` ที่ฉากขอเอง → play ไม่เคยถูกเรียก · แก้ music.js 3 จุด: `bgAllowed`/`setMusic`/`onSound` ยอมเล่นเมื่อ `sceneName` ตั้งอยู่ (ฉากขอเพลงเอง=ตั้งใจดังในโลก) · ยืนยัน browser: patch `HTMLMediaElement.play` → เข้าโลกเฮลิฯ play("bgm_03.mp3") ถูกเรียกจริง (กลางคืน=เพลงถูกแทร็ก) · ไม่มี error · deploy `.375` SW v102 · ค้าง: ผู้ใช้ฟังจริง (เดิน=bgm_02 บิน/วิงสูท=bgm_01 กลางคืน=bgm_03) · ⚠️ พบ `sound/github-recovery-codes.txt` untracked ในโฟลเดอร์เว็บ — เตือนผู้ใช้ย้ายออกแล้ว (ยังไม่เคยถูก commit/deploy ปลอดภัยอยู่)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 388:** 🚁 **หัวกดต่ำตามความเร็วจริง (ผู้ใช้ขอ "เอียงซ้ายขวาดีแล้ว ขอหน้าหลัง เดินหน้า=หัวกด")** — เดิม tiltIn=fw คันบังคับล้วน (ปล่อยคันแต่ลำยังพุ่ง=หัวเงยกลับ ไม่จริง) · แก้ tickHeli: `vFwd`=องค์ประกอบความเร็วตามหัวลำ → `tiltIn=clamp(fw*.6+vFwd/13,-1.2,1.5)` + กล้อง `.12→.15` (เข็มขอบฟ้าหน้าปัดใช้ hTiltF เดิมขยับตามอัตโนมัติ) · ลำเพื่อน pitT `.008/cap.16→.012/cap.22` เห็นชัดขึ้น · ยืนยัน browser: บิน 16m/s ปล่อยคัน=พิตช์ค้าง -0.18(-10°) · ถอย=+.18 เชิด · ลอยนิ่ง=0 · ลำเพื่อนเร็ว=-0.20 · ไม่มี error · deploy `.376` SW v103 · ค้าง: ผู้ใช้ลองบินจริง (ฟีลแรงไป/เบาไป จูน `.15`/`/13` ได้)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 390:** 🚁 **เพดานก้มหัว 30° (ผู้ใช้ขอ "กดถึง 30 องศา + ภาพนอกเครื่องกดตาม")** — กล้อง `-hTiltF*.35` (clamp 1.5×.35≈.52rad=30° · ภาพโลกกดตามอัตโนมัติเพราะเป็นกล้องเดียวกัน) · ลำเพื่อน `pitT=-min(.52,spdF*.027)` สูตรเดียวกัน สูงสุด ~30° · ยืนยัน browser: ท็อปสปีด+กดคัน=ชนเพดาน 30° · ไหลเฉื่อย ~26° · 16m/s=24° · นิ่ง=0 · ลำเพื่อนเร็ว -28.6° · ไม่มี error · deploy `.378` SW v105 · ค้าง: ผู้ใช้ลองบินจริง (จูน `.35`/`/13` ได้)
- **รอบ 389:** 💥 **ขับชนเฮลิฯ ผู้เล่นอื่น = ปรับ 500🪙 + เกิดใหม่ลานจอด (ผู้ใช้สั่ง · ฝ่ายถูกชนบินต่อปกติ)** — tickHeli หลังชนตึก: เช็กระยะกับ `peers[].flySpr` (dxz<6.2 · Δy กลางลำ<3.2) · **ตัดสินฝ่ายชนฝั่งใครฝั่งมัน: ต้องวิ่ง >3.5 m/s ถึงนับ** (ลอยนิ่งโดนพุ่งใส่=เครื่องเพื่อนปรับเอง ไม่มีการ sync ข้ามเครื่อง) · ปรับ `HELI_CRASH_FINE=500` clamp เหรียญไม่ติดลบ · วาร์ป (0,0) `hLanded=true`+`sendPos(true)` เพื่อนเห็นวาร์ป · คูลดาวน์ `_heliCrashAt` 3วิ · ควัน dustBurst+thud+banner ชื่อคู่กรณี+ATC · ยืนยัน browser 4 เคส: ชน 800→300+วาร์ป (0,1.4,0) · คูลดาวน์ไม่ปรับซ้ำ · ลอยนิ่งซ้อนลำ=ไม่ปรับ · เหรียญ 120→0 ไม่ติดลบ · ไม่มี error · deploy `.377` SW v104 · ค้าง: ผู้ใช้ลองจริง 2 เครื่อง (บินชนกันจริง)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 391:** 🔩 **เสียงเหล็กกระทบตอนชน (ผู้ใช้ทัก "ไม่ได้ยินเสียงตอนชน")** — ต้นตอ: `HeliSound.thud` เป็นไซน์เบส 70→35Hz **ลำโพงมือถือ/โน้ตบุ๊กเปล่งไม่ได้** · เพิ่ม `heliCrashSfx(hard)` สังเคราะห์ 3 ชั้น: "คลัง" พาร์เชียลโลหะ inharmonic 326-1780Hz detune สุ่ม + "ครืด" noise bandpass 2.4kHz + "ตุ้บ" 180→55Hz · ต่อตรง destination (ไม่โดน master/env หรี่) · เรียก 3 จุดชนของเฮลิฯ: ชนตึกข้าง/กระแทกพื้นแรง(vy<-7)/ชนลำเพื่อน (คง thud เดิมไว้เป็นเบสเสริม) · ยืนยัน browser: ดัก createOscillator/BufferSource → ชนลำเพื่อน osc+10 noise+3 ✓ ไม่มี error · deploy `.379` SW v106 · ค้าง: ผู้ใช้ฟังจริงบนมือถือ


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 392:** 🔵💺🏢 **ลำฟ้า: เลือกขับเอง/นั่งชมวิว + ทัวร์ไม่ทะลุตึก + กฎชนตึก (ผู้ใช้สั่ง 3 ข้อ ก่อนเปิด session ใหม่)** — (1) เดินชิดลำฟ้า <3.0 → กล่อง `#adv-paxchoice` (สร้าง on-demand แบบ adShopEl · เดินห่าง ≥3.6/เปลี่ยนเฟส=ปิดเอง คูลดาวน์ 2.5วิ): **🧑‍✈️ ขับเอง (ฟรีไม่ต้องมีตั๋ว)** = `beginPilot('blue')` — beginPilot รับ ship, `pilotShip` ทั้ง endPilot จอด/ซ่อนลำ/ระยะขึ้นลำวัดจาก `paxH.position`+ระดับ (แบบลำแดงรอบ 375) · **💺 นั่งชมวิว** = beginRide เดิม (2) ทัวร์: waypoint ทุกจุดที่เพดาน `maxตึก+6` ขึ้นตรง→วน→ตั้งลำเหนือเทอร์มินัลค่อยหย่อน — เลิกทะลุตึก (3) ชนตึกสะสม `state.heliWallHits` (persist) ครบทุก 10 ครั้ง หัก 100🪙 (เตือนตั้งแต่ 7/10) · เพื่อนเห็นเราขับลำฟ้า: av ใหม่ `h_b` → flySpr ฟ้า (makePeerSprite/flyCol รองรับ · client เก่าเห็น 🚁 emoji จน refresh) · hp ลำแดงจอดส่งต่อแม้กำลังขับลำฟ้า · ยืนยัน browser ครบ: กล่องเด้ง/ปิดเอง ✓ ขับฟรีไม่มีตั๋ว ✓ ลงเดิน ✓ ทัวร์เพดาน 34>ตึกสูงสุด 27.4 ✓ ชนครั้งที่ 10 หัก 700→600+ดันออก ✓ peer h_b=ลำฟ้า GLB ✓ ไม่มี error · deploy `.380` SW v107 · ค้าง: ผู้ใช้ลองจริง (กล่องเลือกบนมือถือ/ขับลำฟ้า 2 เครื่อง/นั่งทัวร์ดูไม่ทะลุตึก)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 393:** 🚙 **รถเพื่อนโลกขับรถ = โมเดลจริง `img/models/car_01.glb` ย้อม 10 สีตามคันที่ขับ + ล้อหน้าหักเลี้ยวตามพวงมาลัย (ผู้ใช้สั่ง 3 ข้อ)** — texture ย้อมด้วย `tools/retint_car.py` (HSV แบบรอบ 383 · ขาว/ดำ/รุ้งพาสเทลมีสูตรพิเศษ) → `img/models/car_tex_02-10.jpg` · โค้ดโซนใหม่ใน adventure3d.js (carGlbEnsure/carGlbBuild หลัง disposeBlockPeer): clone จาก cache · **ผ่า triangle ล้อหน้าขวาออกจาก tripo_part_1 ที่ Tripo รวมล้อ+กันชนไว้ก้อนเดียว** (ศูนย์ล้อเก็บเองตอนผ่า — Box3 เชื่อไม่ได้เพราะ position แชร์) · pivot ล้อ: หน้า steer+spin หลัง spin · ไฟเลี้ยว/ถอย/เบรคชุดเดิมต่อ userData เดิม · รุ่นรถส่งพ่วง av=`blk2c05` (≤8 ตัวผ่าน rules เดิม ไม่ต้อง publish · client เก่าเห็นรถบล็อกสุ่ม) · ล้อเพื่อนเลี้ยว=ย้อน bicycle model จาก yaw rate (steer=atan(yawRate·WB/v) ไม่มี field ใหม่ · จอด=คืนตรง) · ยืนยัน browser ครบ: av ส่งถูก ✓ ล้อ 4 มุม (±1.1,±1.1) แตะพื้น ✓ tex_07 เหลืองตรงคัน ✓ เลี้ยวขวา steer -0.25 ทั้งคู่ทิศถูก ✓ ล้อหมุน 50rad ✓ ไฟเลี้ยวกะพริบ ✓ raycast โดนตัวถัง ✓ ไม่มี error · deploy `.381` SW v108 · ค้าง: ผู้ใช้ลองจริง 2 เครื่อง (ดูสีรถตรงคันเพื่อน+ล้อเลี้ยว · จูนตำแหน่งไฟท้ายได้ใน carGlbBuild)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 394:** 👁️🛞🚗 **3 ต่อยอดรถ (ผู้ใช้ "ทำเลย")** — (1) **มุมมองที่ 3 โลกขับรถ**: ปุ่ม 👁️ เดียวกับ soccer / คีย์ V · เห็นรถ GLB คันเราเอง ล้อเลี้ยว/หมุน/ไฟเลี้ยว-เบรค-ถอยครบ กล้องลอยหลัง 7.4m · ซ่อนชิ้นห้องคนขับด้วย class `cam3` · ฟิสิกส์ยึด camera.position เดิม → ต้นเฟรมคืนกล้องมาที่ตัวรถก่อน + **sendPos ส่งตำแหน่งตัวรถไม่ใช่กล้อง** (2) **รอยยางดำ**: ทริกเกอร์ slipPerp เดียวกับเสียงยาง · pool 90 decal วนใช้ จาง 6 วิ ทิ้งคู่ที่ล้อหลังทุก .5m (3) **รถ GLB ใน moto map**: moto3d.js มี loader ตัวเอง (mCarEnsure/mCarBuild — โซนใหม่หลัง makeVehicle · หน้ารถ +Z ไม่ต้องหมุน) ทั้งรถเรา+เพื่อน · av=`carc05` (client เก่าเห็นเป็นมอไซค์จน refresh · av='car' เก่ายังรองรับ=รถแดง) · ยืนยัน browser ครบทุกข้อ (testkit ใหม่ `_t.drive.tick/toggle/setYaw/setSpeed` — ⚠️ แท็บ preview เป็น hidden rAF ไม่ยิง ลูปหลักแช่แข็ง ต้อง step เฟรมเอง) · deploy `.382` SW v109 · ค้าง: ผู้ใช้ลองจริง (กดปุ่ม 👁️ บนมือถือ/ดริฟท์ดูรอยยาง/ขับรถเข้า moto map 2 เครื่อง)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 395:** 📊 **ราคาตลาดสวนผลไม้ตามอุปทาน — กันเหรียญเฟ้อ (ผู้ใช้สั่ง "ปรับกลไกราคาใหม่")** — เดิมต้นไม้ปลูกไม่จำกัด+ขายราคาคงที่ตลอดกาล=ทบต้นโตทวีคูณ · ใหม่: ขาย 1 ต้น ราคาชนิดนั้นตก 10% (floor 25%) · supply ลดครึ่งทุก 10 ชม. ราคาฟื้นเอง · เครื่องยนต์ใน `js/data/fruits.js` (fruitMktSupply/fruitPriceMult/fruitSellNow/fruitMktAdd/fruitMktLabel) · state ใหม่ `fruitMkt:{}` (sanitize เซฟเก่า) · ui.js: การ์ดร้าน+ต้นสุกโชว์ % ตลาด ปุ่มขายโชว์ราคาจริง sellAll ขายราคาตอนกดแล้วค่อยกดอุปทาน · ยืนยัน browser: ขาย 3 ต้น +1,600 ตรงปุ่ม · สแปม 13 ส้ม ราคาไหล 300→240→…→75 ชน floor · ชนิดอื่นไม่กระทบ · ฟื้น 40 ชม.=257 · dialog ฟิต 812×375 · ไม่มี error · deploy `.383` SW v110 · ค้าง: ผู้ใช้ลองจริง (จูน DROP .10 / FLOOR .25 / HALF 10ชม. ได้ที่ fruits.js)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 396:** ⚽🎨 **soccer ยกเครื่องภาพ+ฟิสิกส์แบบ PES (ผู้ใช้มอบหมาย "ให้สมจริงที่สุด")** — ฟิสิกส์: drag∝v² + Magnus (ω×v) + **after-touch กด A/D ระหว่างบอลลอย=จับโค้งแบบ PES** + ชนเสา/คานสะท้อนจริง + ตาข่ายอุ้มบอล/กระเพื่อม + สปินกัดพื้นตอนเด้ง + บอลหมุนตามวิ่ง + เงาบอลตามสูง · ภาพ: หญ้าลายตัด+เส้นสนามมาตรฐานแยกชั้น (1024²) + อัฒจันทร์ 2 ชั้นหลังคา + สปอตไลต์ 4 มุม + ป้าย LED + บอลลายห้าเหลี่ยม · เสียง SoccerAudio สังเคราะห์ (ฮัมฝูงชนลูป/เตะตามพลัง/เสาปิ๊ง/ตาข่าย/เชียร์กระหึ่ม — stopAmb ใน exitWorld) · ทุกผิวรองรับภาพจริง `img/tex/soccer_{grass,crowd,ball,ads}.jpg` (applyTex probe) — **prompt เจนภาพอยู่ Artifact https://claude.ai/code/artifact/85fe5663-ea90-4619-9bd0-b041f04307d5 +`PROMPTS_SOCCER_TEX.md`** · โค้ด: โซน soccer adventure3d.js (banner ⚽🎨 รอบ 396) + scene build + testkit `_t.soccer.{spin,tick,nets,shadow,audio}` · ยืนยัน browser step เฟรม: drag 28.5→12.9 ✓ โค้ง D x0→2.07 ✓ เสาเด้ง vz -20→+11.4+ปิ๊ง ✓ inNet หยุด -20.6 ✓ เงา scale .54 ✓ ไม่มี error · deploy `.384` SW v111 · ค้าง: ผู้ใช้ลองจริง (เตะโค้ง/ฟังเสียง) + เจนภาพ 4 ไฟล์วาง `img/tex/`


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 397:** ⚽🧤🎯🎬 **3 ต่อยอด soccer + ภาพสนามจริงจากผู้ใช้ (ผู้ใช้สั่ง "ทำได้เลย" + เจนภาพครบ 4)** — (1) **น้อง GK**: สัตว์ตัว active (`activePet()`) ยืนเฝ้าประตูเป็นสไปรต์อบจาก `img/anim/` (texture offset 24 เฟรม · แมว/หมา/มังกร) วิ่งตามบอลเมื่อเข้าใกล้ ~9m ปัดบอลสะท้อน+เอียงตัว+เสียง `SoccerAudio.save` · **จูนให้ชนะได้**: `GK_REACH_X=.9` วิ่งไม่ถึงเสา (clamp ±1.5 จากเสา) → ยิงเบียดเสา/โด่งข้ามหัวเข้าได้ (2) **โหมดจุดโทษ 60 วิ** ปุ่ม 🎯: ยืนจุดโทษ `PK_SPOT_Z`(-12) ซ่อนป้ายคำ · HUD นับถอยหลัง+สกอร์ · จบแจก `PK_COIN`×ประตู + สถิติ `state.soccerPKBest` · นกหวีดเปิด/ปิด (3) **รีเพลย์สโลว์ 0.35×**: บันทึก `repTrace` ทุกเฟรม ยิงเข้ามุมสวย (ชิดเสา>50%/สูง>55%/สปิน>3.5) → หน่วง 750ms ฉายซ้ำ กล้อง TV ข้างประตู + แถบดำ cinematic (นาฬิกาจุดโทษหยุดระหว่างฉาย) · **ภาพจริง 4 ไฟล์ผู้ใช้**: บีบ PNG 9.78MB→JPG 0.85MB (-91%) ด้วย `tools/pack_tex.py` (POT บังคับสำหรับ repeat + auto-crop: ป้าย LED ดึงแถบออกจากพื้นดำ · ฝูงชนตัดหญ้าขอบล่าง) · แก้ repeat ให้ตรงภาพจริง (หญ้า 3,2 · ฝูงชน 2,1) · **🐛 แก้บั๊กป้าย LED: applyTex เป็น async แต่โค้ดเดิม clone material ก่อน → ป้ายไม่มีวันได้ภาพจริง** ต้อง applyTex ต่อใบ · จูนฟิสิกส์: friction พื้น 1.7→.5 + drag .022→.018 (ลูกเรียดวิ่งถึงประตูแบบ PES) · ยืนยัน browser: ภาพจริงติดครบ 4 (หญ้า1/ฝูงชน8/ป้าย4/บอล1 · repeat ถูกทุกใบ) ✓ GK เซฟลูกกลาง vz→+4.1 ✓ เบียดเสาเข้า x=-3.38 + คิวรีเพลย์ ✓ รีเพลย์ 243 เฟรมจบ+ปิด overlay+รีเซ็ตบอล ✓ จุดโทษ 2/2 +4🪙 คืนป้าย/จุดยืน ✓ เสียง save/whistle ครบ ✓ ไม่มี error · deploy `.385` SW v112 · ค้าง: ผู้ใช้ลองจริง · ⚠️ `img/tex/soccer_*.png` ต้นฉบับ 9.8MB **ไม่ commit** (เกมใช้ .jpg) เก็บไว้ในเครื่องเฉยๆ ลบได้ตามสะดวก


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 398:** 🕹️ **บังคับสนามบอลแบบ PES (ผู้ใช้เลือกผัง "PES แท้: ซ้ายสติ๊ก + ขวาปุ่มแอ็กชัน" · ปุ่มแอ็กชันเอาแค่ ⚽ ยิงชาร์จพลัง ไม่เอาจ่าย/ชิพ/โค้ง)** — เดิมเล็งด้วยแป้น ▲▼◀▶ มุมซ้ายล่าง · ใหม่: **ลากนิ้วครึ่งซ้าย = สติ๊กอนาล็อก** (ใช้ `#adv-joy` ตัวเดียวกับโลกอื่น · dx=หันซ้ายขวา dy=เงย-ก้ม · `AIM_STICK`=1.35 ตัวคูณความไว) — ดันเบา=เล็งละเอียด ดันสุด=หมุนไว ปล่อยนิ้ว=ค้างมุมเดิมไม่เด้งกลับ · **after-touch ด้วยสติ๊ก**: ดันซ้าย/ขวาระหว่างบอลลอย=จับโค้ง · ค้างสติ๊กตอนปล่อยเตะ=ออกโค้งตั้งแต่แรก · ลบแป้น ▲▼◀▶ (DOM+binding+ตัวแปร sPad*) เหลือ CSS ไว้เผื่อย้อนกลับ · เปิดทาง soccer เข้าระบบ touch (เดิม `if(M.soccer) return` ตัดทิ้งทั้งก้อน) แต่กันครึ่งขวาไม่ให้เป็น look-drag (`!M.soccer`) + เพิ่ม `#adv-pk` ในลิสต์ปุ่มที่นิ้วไม่กลายเป็นสติ๊ก · testkit ใหม่ `_t.soccer.stick` · ยืนยัน browser 812×375: ดันขวาสุด yaw 0→.583 · ดันเบา .3 ได้ -.175 (สัดส่วนตรงเป๊ะ=อนาล็อกจริง) · ดันขึ้น pitch .34→.794 · ปล่อย=ค้าง ✓ · โค้งด้วยสติ๊ก x 0→2.2 · ค้างซ้ายตอนเตะ spin +4.95 ✓ · ผังปุ่มไม่ทับกันเลย (joy/kick/pk/scam) อยู่ในจอครบ ✓ ไม่มี error · deploy `.386` SW v113 · ⚠️ **บทเรียน: เครื่องมืออ่านไฟล์แสดง `/*` เป็น `\*`** — เผลอคัดลอกสไตล์นั้นไปเขียนคอมเมนต์ CSS พังไป 1 จุด (ตรวจด้วย `grep | cat -A` เทียบไบต์จริง) · ค้าง: ผู้ใช้ลองจริงบนมือถือ (จูนความไวที่ `AIM_STICK`)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 399:** ⚽ **แผงคำบังป้ายตัวอักษรในสนามบอล (ผู้ใช้ส่งภาพหน้าจอ — เห็นชัดว่าแผง "DECISION/การตัดสินใจ" ทับป้ายที่ต้องเตะพอดี)** — ต้นตอ: `#adv-words` ตั้ง `top:82px` ซึ่งบนมือถือแนวนอนจอเตี้ย (~306-375 CSS px) กลายเป็น**กลางจอ** ตรงแนวป้ายตัวอักษรที่ลอยหน้าประตูพอดี · แก้เฉพาะโหมด soccer: `.adv-soccer #adv-words{top:auto;bottom:38px;max-width:66vw}` วางเหนือแถบ `#adv-inv`(bottom:8px) + ย่อชิปตัวอักษร clamp(15,3.2vw,22) และไทย clamp(11,2.4vw,14) — เป็นข้อมูลอ้างอิงไม่ใช่จุดโฟกัส · **66vw กันไปทับสติ๊กเล็งซ้ายล่าง/ปุ่มเตะขวาล่าง** · แถม: ข้อความแถบเก็บตัวอักษรตอนว่างเดิมเขียน "เดินชนตัวอักษรเพื่อเก็บ" ซึ่ง**ผิดสำหรับสนามบอล** → soccer โชว์ "⚽ เตะบอลใส่ป้ายตัวอักษรเพื่อเก็บ" · ยืนยัน browser 2 จอ: 812×375 words y269-337 เหนือ inv y339-367 ไม่ทับ joy/kick ✓ · จอแคบสุด 568×320 + คำยาว 12 ตัว x142-426 ยังไม่ทับ joy(≤128)/kick(≥458) และอยู่ในจอครบ ✓ ไม่มี error · deploy `.387` SW v114 · ค้าง: ผู้ใช้ดูจริงว่าเห็นป้ายโล่งแล้ว


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 400:** 🌀 **ลูกปั่นโค้ง "ตั้งก่อนเตะ" + เส้นประโค้งให้เห็น (ผู้ใช้สั่ง "ทำให้ลูกบอลปั่นโค้งได้")** — ⚠️ ฟิสิกส์โค้งมีมาตั้งแต่รอบ 396 แล้ว **แต่ผู้เล่นมองไม่เห็น/กดไม่ถูก**: (ก) `updateSoccerGuide` จำลองแค่ drag+แบ็คสปิน **ไม่มีไซด์สปิน → เส้นประวาดตรงตลอด** ไม่มีทางรู้ว่าปั่นได้ (ข) ท่าเดิมต้องดันสติ๊กตอนบอลลอยเท่านั้น เด็กเดาไม่ถูก · **ใหม่:** ตัวแปร `sCurl`(-1..1) ตั้งก่อนเตะ — มือถือ **กดปุ่มเตะค้างแล้วปัดนิ้วซ้าย/ขวา** (`CURL_SWIPE`=70px · ชาร์จ+ปั่นท่าเดียวแบบ PES) · คอม **Q/E** · ป้าย `#adv-curl` เหนือปุ่มเตะโชว์ 🌀◀◀◀ ตามแรง · **เส้นประจำลอง Magnus ครบ = เห็นเส้นโค้งจริงก่อนเตะ** · after-touch ขยายจาก 1.2วิ→ตลอดที่ลอย · **ลูกเรียดกลิ้งพื้นก็โค้ง** (Magnus 45% ตอนกลิ้ง + สปินจางช้าลง 2.2→.9) · รีเซ็ต `sCurl=0` ทุกลูก · **🐛 เจอ+แก้ปัญหาฟิสิกส์: ω×v เต็มสูตรทำให้แรงตั้งฉากความเร็วเสมอ → สปินสูง = บอลวนเป็นวงกลม** (วัดจริง โค้ง .8 ได้ **-0.55m คือเลี้ยวกลับ** · ค่าไม่เป็นเชิงเส้น .4→3.07 แต่ .5→1.68) เด็กเล็งไม่ถูก → **ตัดพจน์ไซด์สปินที่ดึงแกนลึกทิ้ง เหลือแรงด้านข้างล้วน** · จูนแรง: `CURL_SPIN`=3.5 `SB_SPIN_MAX` 9→4.5 (เดิมโค้งเต็มเบน 8.26m เลยขอบประตู ±4m ยิงไม่มีทางเข้า) · ยืนยัน browser: เบนที่เส้นประตู **เชิงเส้น+สมมาตรเป๊ะ** โค้ง±.5→±1.47m · ±1→±2.94m **เข้าประตูทุกระดับ** ✓ ลูกเรียดโค้งเต็ม 1.78m ✓ โค้ง 0 = ตรง 0.00 ✓ เส้นประ vs บอลจริงต่างแค่ .26m ✓ ป้ายโชว์/หายถูก + ไม่ทับปุ่ม ✓ รีเซ็ตหลังเตะ ✓ ไม่มี error · deploy `.388` SW v115 · ค้าง: ผู้ใช้ลองจริง (จูน `CURL_SPIN` ถ้าอยากโค้งมาก/น้อยกว่านี้)


## ⏬ ย้ายเมื่อ 2026-07-20 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 401:** 🎱🎀💥 **หน้าต่างซูมเลือกจุดสัมผัสบอล (สนุกเกอร์) + ริบบิ้นไกด์ + เตะแรงสะใจ (ผู้ใช้สั่ง 3 ข้อ)** — (1) **แพดซูม** ปุ่ม `🎱 จุดสัมผัส` เปิด `#adv-spinpad`: ลูกบอลซูม 112px ลาก/แตะเลือกจุด (คลิปในวงรัศมี 1) · **แนวนอน = ไซด์สปิน ตามฟิสิกส์จริง "เตะขวาของลูก → โค้งซ้าย"** · **แนวตั้ง = เตะใต้ลูก(`HIT_LIFT` .20 ยกมุม + แบ็คสปิน `HIT_SPIN_X` 2.6 → ลอยโด่ง) / เตะบนลูก(ท็อปสปิน → พุ่งจิก)** · ป้ายอธิบายผลเป็นภาษาเด็ก (2) **ริบบิ้นไกด์** แทนจุดกลม 14 จุดเดิม: mesh แถบกว้าง `GUIDE_W` .62m เรียวปลาย 44 จุด · เทกซ์เจอร์ไล่เฉดทอง-ขาว ขอบจางนุ่ม + ลายขีดวิ่งไหล (offset.x ทุกเฟรม) · AdditiveBlending (3) **เตะแรงขึ้น** `KICK_SPD_MAX` 32→44 + กล้องกระตุกถอย `sKickPunch` + สั่นเป็นจังหวะเมื่อ power>75 · **`kickLaunch()` ตัวเดียวใช้ทั้งไกด์และตอนเตะจริง** → บอลวิ่งตรงตามริบบิ้นเสมอ · **🐛 แก้ 3 บั๊ก:** ① `spinPadPick` ตอนแพดปิด rect=0 → หารศูนย์ได้ **NaN ทำสปิน/บอลพังทั้งเกม** ② **รีเพลย์ crash ทั้งโลก 3D** ถ้าเตะซ้อนระหว่างฉาย (repTrace ถูกล้าง → `repTrace[i0].x` undefined) → กัน 2 ชั้น (soccerKick return ถ้า repOn + repTick กันตัวเอง) ③ ไกด์เดิม h=.035 และไม่จำลองช่วงบอลติดพื้น → **คลาดจากวิถีจริง 1.2m** แก้เป็น h=.016 (เท่า dt จริง) + ลอกตรรกะเด้ง/กลิ้ง/สปินจางมาครบ · ยืนยัน browser (เทียบเฟรมต่อเฟรมเวลาเดียวกัน): **ริบบิ้นคลาดจากบอลจริงแค่ 0.006m ทุกแบบ** (ตรง/โค้งซ้าย-ขวา/เตะใต้-บนลูก) ✓ เตะใต้ลูกสูงสุด 6.43m · กลาง 2.23 · บนลูก 0.48 ✓ ซัดพลัง 100 (44m/s) ลูกที่เข้ากรอบหยุดที่ตาข่าย z=-20.9 ทุกลูก **ไม่ทะลุ** ✓ pick ตอนแพดปิด=ปลอดภัยไม่ NaN ✓ ผัง 812×375 + **จอเตี้ย 568×320 ย่อชุดด้วย @media max-height:400px** (ช่องซ้ายเหลือ 135px ระหว่างกระดานคะแนน-สติ๊ก) แพดจบ 192 = สติ๊กเริ่ม 192 พอดี ไม่ทับ ✓ ลากบนแพดเล็กยังได้ ✓ ไม่มี error · deploy `.389` SW v116 · ค้าง: ผู้ใช้ลองจริง (จูน `CURL_SPIN` 3.5 / `HIT_LIFT` .20 / `KICK_SPD_MAX` 44 / `GUIDE_W` .62)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 402:** 🎨🎯🧱 **3 ต่อยอดสนามบอล (ผู้ใช้ "ทำได้เลย")** — (1) **ริบบิ้นไล่สีตามพลังชาร์จ**: `guideMat.color.setHSL` เขียว→เหลือง→ส้ม→แดงเพลิง + opacity เพิ่มตามพลัง · ⚠️ ต้องเปลี่ยนเทกซ์เจอร์ริบบิ้นจากทองเป็น**ขาวล้วน**ก่อน ไม่งั้นย้อมสีแล้วขุ่น · วัดจริงขณะชาร์จ: 20→`#8bf812` 40→`#f4f91e` 60→`#f9ac2a` 80→`#f96e36` 100→`#fa4241` ✓ (2) **วงจุดตกลูก** `landRing` (วงแหวนคู่เต้นเบาๆ สีตามริบบิ้น) วางตรงจุดที่วิถีแตะพื้นครั้งแรก — เตะใต้ลูกตก z=-25.8 · กลาง -14.6 · บนลูก 0.4 ✓ ซ่อนพร้อมริบบิ้นตอนบอลลอย ✓ (3) **โหมดฟรีคิกกำแพงคน** ปุ่ม 🧱: `makeSoccerPlayer` 5 คนเรียงห่าง .78m ยืน **9.15m ตามกติกาจริง** หันหน้าเข้าคนเตะ · จุดตั้งเตะ `FK_SPOT_Z`(GOAL_Z+18) · ชนกำแพง=เด้งกลับ+เสียง+แบนเนอร์สอน (เช็กทรงกระบอก `FK_MAN_R`.42/`FK_MAN_H`1.92) · เปิดจุดโทษ=เก็บกำแพงอัตโนมัติ (กัน 2 โหมดชนกัน) · ล้าง fkWall/fkMen ตอน exit+start (ฉากสร้างใหม่ทุกรอบ) · ยืนยัน browser: ยิงตรงกลาง=ชนเด้งกลับ ✓ **ปั่นอ้อมข้าง=ผ่าน** ✓ **เตะใต้ลูกข้ามหัว=ผ่าน** ✓ (ระบบจุดสัมผัสรอบ 401 ได้ใช้จริง) · ผังปุ่ม: เจอ 🧱 ทับ 🎯 5px บนจอเตี้ย → ย่อทั้งคู่ใน `@media max-height:400px` · ตรวจ 9 ชิ้น UI ทั้ง 812×375 และ 568×320 **ไม่ทับกันเลย อยู่ในจอครบ** ✓ ไม่มี error · testkit ใหม่ `_t.soccer.{charge(setter),ribbonColor,landRing,landPt,fk}` · deploy `.390` SW v117 · ค้าง: ผู้ใช้ลองจริง (จูน `FK_WALL_GAP` 9.15 / `FK_WALL_N` 5 / `FK_SPOT_Z`)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 403:** 🎱🌿 **2 ข้อจากภาพหน้าจอผู้ใช้** — (1) **แพดจุดสัมผัสเปิดค้างตลอด เต็มขนาด** (ผู้ใช้: "ไม่ต้องปิดหรือย่อ"): ลบปุ่ม `#adv-spinbtn` ทิ้งทั้ง DOM+binding+CSS · แพดโชว์ด้วย `.adv-soccer #adv-spinpad{display:block}` · ลบ media query ที่เคยย่อลูกบอลเหลือ 72px → **คงเต็ม 112px ทุกจอ** · แลกด้วยการ**ย่อวงสติ๊กแทน**บนจอเตี้ย (84px bottom:8) + ดันแพด top:60 · จอผู้ใช้ 651×306: กระดานคะแนนจบ 57 · แพด 60-210 · สติ๊ก 214-298 พ้นกันหมด (2) **หญ้า 3D มีมิติ** (ผู้ใช้: "พื้นหญ้าดูแบนเรียบเกินไป"): ① เปลี่ยน `MeshLambertMaterial`→**`MeshPhongMaterial` + `normalMap`** สร้างเอง (`grassNormalTexture` 256²: สุ่มขีดใบหญ้า 14,000 เส้นเป็น height field → sobel → encode normal RGB · repeat 26×34 · normalScale 1.15 · shininess 4) = แสงจับใบหญ้าเป็นร่องเงา ② **กอหญ้า 3D จริง** `buildGrassTufts`: 1,100 กอ × แผ่นไขว้กากบาท 2 แผ่น ติดเทกซ์เจอร์ใบหญ้าโปร่ง (`alphaTest .45`) **รวมเป็น BufferGeometry เดียว = 1 draw call 4,400 tris** สูง .20-.36m (เตี้ยพอไม่บังเส้นสนาม) · ยืนยัน browser: ผังไม่ทับกันเลยทั้ง 651×306 / 568×320 / 812×375 ✓ ลากเลือกจุดได้ทันทีไม่ต้องกดเปิด ✓ หญ้าเป็น MeshPhongMaterial+normalMap ✓ กอหญ้า 1 mesh 4,400 tris ✓ **ทั้งฉากรวม 8,926 tris (เบามากสำหรับมือถือเด็ก)** ✓ ไม่มี error · ⚠️ เครื่องมือ screenshot ของ Claude ยังใช้ไม่ได้ (timeout) → ตรวจด้วยตัวเลข ให้ผู้ใช้ยืนยันภาพ · deploy `.391` SW v118 · ค้าง: ผู้ใช้ดูจริงว่าหญ้ามีมิติพอไหม (จูนความหนาแน่นกอที่ `N=1100` / ความสูง .20-.36 / `normalScale` ใน buildScene)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 404:** 🎯💙🎲 **3 ข้อสนามบอล (ผู้ใช้สั่ง)** — (1) **ป้ายตัวอักษรทีละตัวในกรอบประตู**: `SOCCER_TILES` 14→1 · `soccerLetterPos` เปลี่ยนจากลอยเกลื่อนหน้าประตู (x±9, z สุ่ม 11m) เป็น**ในกรอบเสาจริง** (x ±(GOAL_HW-.95) · y .85-(GOAL_H-.65) · z=GOAL_Z+.55) · ฟังก์ชันใหม่ `soccerNextTile()`: เก็บได้/เตะโดนแล้ว → เปลี่ยนเป็นตัวที่ยังต้องการตัวถัดไป + ย้ายจุดใหม่ (กันสุ่มใกล้เดิม <2.2m สุ่มซ้ำสูงสุด 8 รอบ) → ต้องเล็งใหม่ทุกครั้ง (2) **ริบบิ้นเป็นแสงสีฟ้าไล่ระยะ**: ใช้ **vertex color** (material.color เดียวไล่ตามความยาวไม่ได้) ต้นทาง `0x0b3fd6` น้ำเงินเข้ม → ปลายทาง `0xb6ecff` ฟ้าอ่อน (lerp กำลัง .7) · **พลังชาร์จเลิกเปลี่ยนสี (รอบ 402) → เปลี่ยนเป็นคุมความสว่าง/ทึบแทน** (setScalar .72+pw*.5 · opacity .78+pw*.22) เพราะสีถูกจองให้ระยะแล้ว · วงจุดตกใช้โทนฟ้าปลายริบบิ้น (3) **สุ่มจุดยืนผู้เตะทุกครั้ง** `soccerNewSpot()` เรียกใน `soccerResetBall`: x ±13 · z PLAYER_Z-3+สุ่ม 11 · **หันหน้าเข้าประตูอัตโนมัติ** (`aimYaw=atan2(-sBaseX, sBaseZ-GOAL_Z)`) ไม่งั้นเด็กงงว่าประตูอยู่ไหน · **มุมยกตั้งต้นตามระยะ** `clamp(.30-dist*.006, .10, .30)` — วัดจริงพบระยะ ~30m ต้อง pitch ~.12 ไม่งั้นข้ามคานตลอด (ค่าเดิม .34 คงที่ = ยิงไม่เข้าเลย) · เพิ่มตัวแปร `sBaseX` แทนที่ x=0 ทุกจุด (ไกด์/กล้อง 1st+3rd/ผู้เตะ/บอล/oob) · จุดโทษ+ฟรีคิกยังยืนกลางตายตัว ไม่สุ่ม · ยืนยัน browser: ป้าย 1 ใบอยู่ในกรอบ ✓ เก็บแล้วเปลี่ยนตัว+ย้ายที่ ✓ สีริบบิ้นต้น RGB(.04,.25,.84)→ปลาย(.71,.93,1) ฟ้าจริง+ปลายอ่อนกว่า ✓ สุ่ม 6 จุดไม่ซ้ำ ผู้เตะตรงกับบอล เล็งเข้าประตู dot=1.000 ทุกครั้ง ✓ **ยิงค่าตั้งต้นพลัง 70 เข้าประตู 5/6** ✓ ไม่มี error · deploy `.392` SW v119 · ค้าง: ผู้ใช้ลองจริง (จูนช่วงสุ่มที่ `soccerNewSpot` · ความสูงป้ายที่ `soccerLetterPos`)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 405:** ⚽🐛 **[บั๊กจริง ผู้ใช้ส่งภาพ] ลูกลอยข้ามคานแต่ขึ้น "เข้าประตู เก่งมาก"** — **ต้นตอ:** โค้ดเดิมเช็ก `b.z<GOAL_Z && |b.x|<GOAL_HW && b.y<GOAL_H` เป็น**การทดสอบ "อยู่ในกล่องประตูไหม" ทุกเฟรม** → ลูกที่ข้ามคานไป (y>3 ตอนผ่านเส้น) แล้วตกลงหลังประตู พอ y ต่ำกว่า 3 ก็เข้าเงื่อนไขทันที · **แก้:** ตัดสิน**ตอนตัดผ่านเส้นประตูเท่านั้น** — จับจังหวะ `pZ>GOAL_Z && b.z<=GOAL_Z && sbVel.z<0` แล้ว interpolate หา x,y ณ จุดตัดจริง (`t=(pZ-GOAL_Z)/(pZ-b.z)`) · ตั้ง `sbGoaled=true` ทันทีทั้งเข้า/ไม่เข้า (ตัดสินครั้งเดียวจบ) · เก็บตำแหน่งก่อนขยับ `pX,pY,pZ` ไว้ก่อนบรรทัด `b.x+=...` · **ตาข่ายอุ้มบอลก็มีบั๊กเดียวกัน** (ลูกข้ามคานตกหลังประตูโดนตาข่ายดูดหน่วง) → เพิ่มธง `sbInGoal` ให้อุ้มเฉพาะลูกที่ผ่านเส้นในกรอบจริง · **แถม UX:** พลาดแล้วบอกสาเหตุให้เด็กปรับเป็น — "ข้ามคานไป! ลองเตะบนลูก(พุ่งจิก) หรือลดพลัง" / "ออกข้างเสา!" / ทั้งคู่ · ยืนยัน browser (ดัก `SoccerAudio.goal`): ลูกข้ามคานผ่านเส้นที่ y=**8.75m → ไม่นับประตูแล้ว** ✓ ออกข้างเสา x=8.34 → ไม่นับ + ข้อความถูก ✓ **เบียดเสาซ้าย/ขวา x=±3.53 y=0.37 → นับประตูปกติ + ตาข่ายอุ้ม** ✓ (ไม่ได้แก้จนยิงไม่เข้า) · ลูกกลางโดน GK เซฟ = ไม่ถึงเส้น ✓ ไม่มี error · deploy `.393` SW v120


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 406:** 🌱 **ใบหญ้าเส้นตั้งฉากกับพื้นเต็มสนาม (ไอเดียผู้ใช้เอง — ได้ผลดีมาก)** — `buildGrassBlades(sc,N,x0,x1,z0,z1,hMin,hMax)`: `THREE.LineSegments` ก้อนเดียวต่อชั้น · โคนเข้ม→ยอดสว่างด้วย vertex color (lerp `0x2c6b28`→`0x8fd350`) + เฉดสลับตามแถบตัดหญ้า (`sin(z*.42)`) + เอียงสุ่ม ±.05 · สูง .09-.26m · **หมอกฉากทำให้ไกลๆ จางเอง = เห็นชัดราว 3 แถบตัดหญ้าตามที่ผู้ใช้คิดไว้พอดี** · **2 ชั้น:** โซนหน้าประตู (x±15, z GOAL_Z..+22) **90,000 ต้น = 136 ต้น/ตร.ม.** (กล้องจ้องโซนนี้เกือบตลอด) + ทั่วสนาม 30,000 กันขอบเขตดูตัดกัน · **วัดผลจริงด้วย renderer ชั่วคราวเทียบเปิด/ปิด: +0.28ms/เฟรม · +2 draw calls · 5.49MB** (เส้นไม่กินค่า fill เลย จึงใส่ได้เป็นแสน — ทดลองครั้งแรก 42,000 ต้นได้แค่ +0.1ms เลยเพิ่มความหนาแน่นอีก 3 เท่า) · ลดชั้นทั่วสนาม 46k→30k เพื่อ margin แรมมือถือเก่า · ไม่มี error · ⚠️ screenshot ของ Claude ยังใช้ไม่ได้ → ยืนยันด้วยตัวเลข ผู้ใช้ต้องดูภาพเอง · deploy `.394` SW v121 · ค้าง: ผู้ใช้ดูจริง (จูนจำนวน/ความสูง/สีที่ `buildGrassBlades` ใน buildScene โซน soccer)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 407:** 🌱 **ใบหญ้าสั้นลงครึ่งหนึ่ง + เอาที่ประหยัดได้ไปโรยในพื้นที่โล่ง (ผู้ใช้สั่ง)** — ความยาวใบ `.09-.26` → `.045-.13` (วัดจริงเฉลี่ย **7.2 ซม.โซนประตู / 8.7 ซม.รอบสนาม** = ครึ่งเดิมพอดี) · ชั้นรอบสนาม **30,000 → 130,000 ต้น** · เพิ่มพารามิเตอร์ `skip` ใน `buildGrassBlades` = rejection sampling ข้ามโซนหน้าประตูที่หนาอยู่แล้ว (สุ่มใหม่สูงสุด 12 ครั้ง) → **ยืนยันชั้นนอกตกในโซนประตู 0 จาก 130,000 (0.0%)** ต้นที่เพิ่มไปลงพื้นที่โล่งจริงทั้งหมด · รวม **220,000 ต้น · 10.07 MB · +2 draw calls** · ⚠️ **วัดเวลาเรนเดอร์ในเครื่องนี้เชื่อถือไม่ได้** — ค่าแกว่ง/ติดลบ (เปิด 0.72ms vs ปิด 13.6ms ซึ่งเป็นไปไม่ได้) เพราะแท็บ preview ถูก throttle + WebGLRenderer ทดสอบแย่ง GPU กับ renderer หลัก · รอบ 406 ที่ 120,000 ต้นเคยวัดได้ +0.28ms ตอน context ยังสะอาด → **ต้องให้ผู้ใช้ลองบนมือถือจริง ถ้ากระตุกให้ลดเลข 90000/130000 ใน buildScene โซน soccer** · ไม่มี error · deploy `.395` SW v122


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 408:** 🌱 **หญ้ารวมทุกต้นไว้ "3 แถบรอบผู้เล่น" เลื่อนตามจุดยืน (ผู้ใช้: ไกลๆ ไม่ต้อง ดูรก)** — เลิกโรยทั้งสนาม (2 ชั้น) → เหลือ **ก้อนเดียว 220,000 ต้นในแถบ 36×22.5m** (= 3 แถบตัดหญ้า · แถบละ ~7.5m) **272 ต้น/ตร.ม.** (หนากว่าเดิม 2 เท่า) · **สร้างในพิกัด local รอบ (0,0) แล้วเลื่อนทั้งก้อนด้วย `grassBand.position.set(sBaseX,0,sBaseZ)` ใน `soccerResetBall`** — ย้ายแค่ position ไม่สร้าง geometry ใหม่ (ฟรี) · ครอบคลุมทุกโหมด: สุ่มจุดยืน/จุดโทษ(-12)/ฟรีคิก(-1) ✓ · **ขอบแถบไล่จาง** (ใบเตี้ยลงที่ขอบข้าง 3.5m / ขอบไกล 4.5m / ขอบหลัง 2m) กันเห็นเป็นขอบพรมตัดตรง — วัดจริง กลางแถบ 8.7cm vs ขอบไกล 3.4cm ✓ · ยืนยัน browser: 1 ชั้น 220,000 ต้น ✓ แถบ 36×22.5m ✓ สุ่มจุดยืน 5 ครั้งแถบตามทุกครั้ง (ตรงกัน 100%) ✓ หญ้าคลุมถึง z −3.4..−12.8 ส่วนประตูอยู่ −19 = **ไกลๆ โล่งตามที่ผู้ใช้ต้องการ** ✓ ไม่มี error · ⚠️ วัดเวลาเรนเดอร์ในเครื่องนี้ยังเชื่อถือไม่ได้ (ค่าแกว่ง/ติดลบ · แท็บ throttle + renderer ทดสอบแย่ง GPU) → ผู้ใช้ต้องลองมือถือจริง ถ้ากระตุกลดเลข 220000 ที่ `buildGrassBlades` ใน buildScene · deploy `.396` SW v123


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 409:** 🌱❌ **ถอดหญ้า 3D ออกทั้งหมด (ผู้ใช้ตัดสินใจ: "ความสวยที่ไม่สมบูรณ์ ไม่คุ้มกับความเสี่ยงที่ตั้งอยู่บนความไม่แน่นอน")** — ลบ `grassTuftTexture` + `buildGrassTufts` (กอหญ้าไขว้ รอบ 403) + `buildGrassBlades` (ใบหญ้าเส้นตั้ง 220,000 ต้น รอบ 406-408) + ตัวแปร `grassBand` + การเลื่อนแถบใน `soccerResetBall` · **เหลือ "ภาพสนามหญ้า" ล้วน = เทกซ์เจอร์ + normal map บน MeshPhongMaterial** (แสงจับผิวหญ้าให้ไม่แบน แต่ไม่เพิ่ม geometry เลย ไม่มีความเสี่ยงเรื่องเฟรมเรต) · ยืนยัน browser: เส้นหญ้าเหลือ 0 · กอหญ้าเหลือ 0 · ไม่มีอ้างอิงค้างในไฟล์ · **สามเหลี่ยมทั้งฉาก 8,926 → 4,500** · พื้นยังเป็น MeshPhongMaterial+normalMap · เกมเดินปกติ ไม่มี error · deploy `.397` SW v124 · 💡 **บทเรียนไว้เตือนรอบหน้า: อย่าใส่ของหนักที่ "วัดผลจริงไม่ได้" ลงเกมเด็ก** — เครื่องมือวัดเวลาเรนเดอร์ใน preview นี้เชื่อถือไม่ได้ (แท็บ throttle + renderer ทดสอบแย่ง GPU) ถ้าจะทำเอฟเฟกต์หนักอีก ต้องให้ผู้ใช้ทดสอบบนมือถือจริงก่อนขยายสเกล


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 410:** 🌿 **ยกเครื่องพื้นสนามให้เหมือนภาพตัวอย่าง PES (ผู้ใช้ให้วิเคราะห์ว่าทำไมไม่ผ่านมาตรฐาน)** — **วินิจฉัย 3 ข้อ:** ① **สเกลผิด** ภาพหญ้า 1024px ถูกยืดคลุม 23×45 เมตร (repeat 3×2) ใบหญ้าจึงกว้างเป็นเมตร เห็นเป็นรอยเบลอ/ด่าง ② **แถบตัดหญ้าติดมาในภาพ** จึงปูถี่ไม่ได้ (แถบจะถี่ตามจนลายมั่ว) — สเกลใบหญ้ากับสเกลแถบ**ผูกติดกันในไฟล์เดียว** ③ **สีจัดเกิน** ภาพเป็นเขียวนีออน + HemisphereLight 1.05 = เรืองแสง · **แก้แบบแยกชั้น:** ⓐ `soccerTurfTexture()` โหลดภาพผู้ใช้แล้ว **"รีดแถบออก"** (normalize ความสว่างรายแถว) + เกรดสี (SAT .62 · BRI .74) → ปูถี่ **repeat 24×30 = 2.9×3.0 m/กระเบื้อง** ด้วย **MirroredRepeatWrapping** (ครอปภาพถ่ายมาปูได้ไร้รอยต่อ) ⓑ **แถบตัดหญ้าย้ายไปวาดในชั้น `soccerLinesTexture`** แยกอิสระ — 10 แถบตามแกน x = **แถบพุ่งเข้าหาประตูเหมือนภาพตัวอย่าง** (เดิมแถบขวางจอ) ขอบไล่จางแบบรอยล้อรถตัดหญ้า ⓒ ลดไฟ hemi 1.05→.80, sun .85→.95 (เพิ่มคอนทราสต์แดด), fill .28→.20, normalScale 1.15→.85 · **ยืนยันด้วยการอ่านพิกเซลจาก framebuffer จริง: หญ้าในเกม RGB(112,151,80) lum 131 — ตรงช่วงภาพตัวอย่าง PES RGB(95-120,130-160,70-90) lum~125 พอดี** ✓ เทกซ์เจอร์หลังรีด: แถบเหลือ 8.8/255 (เกือบหมด) ✓ แถบชั้นใหม่สลับ 5 แถบไล่จาง 0→.086→0 ✓ ไม่มี error · deploy `.398` SW v125 · ค้าง: ผู้ใช้ดูภาพจริง (จูน SAT/BRI ใน `soccerTurfGrade` · ความเข้มแถบ .085 · repeat 24×30)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 411:** 📐 **เส้นสนามสัดส่วนจริง + จุดเกิดในครึ่งสนาม (ผู้ใช้ทัก 3 ข้อ — ต้นตอเดียวกันหมด)** — **ต้นตอ:** สนามที่วาดเส้นเดิมเป็น**เกือบจัตุรัส** กว้าง 40 × ยาวแค่ 38m (z −19..+19) ทั้งที่สนามจริงยาว/กว้าง = 1.54 → ทุกอย่างอัดกัน + โค้ดเดิมวาดเขตโทษ **2 ฝั่ง** (mirror) เส้นฝั่งตรงข้ามจึงโผล่มาพาดใกล้วงกลมกลาง (= "เส้นที่ไม่ควรมี" ที่ผู้ใช้เห็น) · **แก้: วาดเป็น "ครึ่งสนามจริง" ย่อส่วนจาก FIFA 105×68** (K=40/68=.588) — เส้นประตู z=−19 · เส้นกลาง z=**+11.9** (52.5m ย่อ) · เขตโทษ 40.3×16.5 → ขอบที่ −9.3 · เขตประตู 18.32×5.5 · จุดโทษ 11m → −12.5 · โค้ง/วงกลมกลาง r=9.15m ย่อ (คำนวณมุมตัดโค้งเขตโทษด้วย acos จากระยะจริง) · **ลบเขตโทษฝั่งตรงข้าม + ขอบสนามฝั่งไกลทิ้ง** เหลือเส้นข้าง 2 เส้น + วงกลมกลางครึ่งเดียวตามความจริง · **ผลลัพธ์: ช่องว่างโค้งเขตโทษ→วงกลมกลาง 13.6m (เดิม ~0 = ชนกัน)** · อัตราส่วนสนาม **1.54 ตรงของจริงเป๊ะ** · **จุดเกิดผู้เล่น** เดิม z 5..16 (ล้ำเส้นกลาง) → **z −4..+10 อยู่ในครึ่งสนามฝั่งยิงประตูเสมอ** พ้นเขตโทษ ระยะยิง 15–29m · ยืนยัน browser (สแกนพิกเซลหาเส้นขาวตามแนวกลางสนาม): พบเส้น −19.1/−15.9/−12.5/−9.4/−7.1/+6.4/+11.9 ครบถูกต้อง · **เส้นเขตโทษฝั่งตรงข้ามหายแล้ว (false)** ✓ จุดเกิด 12 ครั้งอยู่ในครึ่งสนาม+พ้นเขตโทษ+ในความกว้างทุกครั้ง ✓ ยิงค่าตั้งต้นยังเข้า 5/6 ✓ ไม่มี error · deploy `.399` SW v126


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 412:** ⚡ **โหมดพลังโอเวอร์ไดรฟ์ — ขายเส้นไกด์เป็นไอเทม (ผู้ใช้ออกแบบ)** — **ร่างธรรมดา = ไม่มีเส้นไกด์/วงจุดตก ต้องกะระยะเองแบบดั้งเดิม** (`updateSoccerGuide` เช็ก `auraActive()`) · **ปุ่ม ⚡ 500🪙 → แปลงร่าง 60 นาที** (`AURA_COST`/`AURA_MS` · เก็บใน `state.soccerAuraUntil` = **อยู่ข้ามการปิดเกม** · ซื้อซ้ำ = ต่อเวลาจากของเดิม · เหรียญไม่พอ = เตือน ไม่หักเงิน) · **ออร่าออกแบบเอง (เลี่ยงลิขสิทธิ์การ์ตูนดัง):** โทนฟ้า-ขาว = วงแหวนพลัง 3 วงไหลขึ้นวนซ้ำ + แกนแสงเย็นทรงกรวย + ประกาย 7 ดวงโคจร (ไม่ใช่เปลวทองแบบซูเปอร์ไซย่า) · **แถบนับถอยหลัง** `#adv-aurabar` บนกลางจอ (อัปเดตทุก .5 วิ) · **🌀 ลำแสงควงสว่าน** `drillTick`: ริบบิ้นเกลียวพันรอบเส้นไกด์เดิม (คำนวณ frame ตั้งฉาก tangent ทุกจุด · 5.5 รอบ · รัศมี .34-.64 ตามพลังชาร์จ) **หมุนตลอด + หัวแสงสว่างวิ่งต้น→ปลายทุก 0.9 วิ** (vertex color) โผล่เฉพาะตอนกดชาร์จ+แปลงร่าง · ปล่อยมือ = ยิงปกติ สว่านหาย · ยืนยัน browser: ร่างธรรมดาไม่มีเส้น/ออร่า ✓ ซื้อแล้วหัก 500 ได้ 60 นาที เส้น+ออร่า+แถบมาครบ ✓ เกลียวพันรอบเส้นไกด์รัศมี .41 โทนฟ้า (B.71>R.26) ✓ **หัวแสงวิ่ง 17→26→35→1→10 (วนจริงตามเวลาจริง)** ✓ ปล่อยมือบอลวิ่ง+สว่านหาย ✓ หมดเวลากลับร่างธรรมดาครบ ✓ เหรียญไม่พอซื้อไม่ได้ ✓ · **🐛 แก้บั๊ก CSS:** `@media` ของปุ่มพลังอยู่**ก่อน**การประกาศ `top:176px` → โดนเขียนทับ (specificity เท่ากัน ตัวหลังชนะ) ทำให้ปุ่มทับปุ่มเตะบนจอ 651×306 → ย้าย media query ไปไว้หลัง · ตรวจ 12 ชิ้น UI ทั้ง 812×375 และ 651×306 ไม่ทับกันเลย ✓ ไม่มี error · deploy `.400` SW v127 · ค้าง: ผู้ใช้ลองจริง (จูน `AURA_COST`/`AURA_MS` · ความเร็วหมุน 7.5 · รอบเกลียว TURNS 5.5)


## ⏬ ย้ายเมื่อ 2026-07-21 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 413:** 🛸 **โลก 3D ใหม่ "ยานแม่บุกโลก" (Invasion) — FPS ทะเลทรายสไตล์ Delta Force + ID4 (ผู้ใช้ออกแบบ)** — **engine แยกไฟล์ `js/invasion3d.js` (~1,400 บรรทัด) ไม่แตะ `adventure3d.js`** (ไฟล์นั้น 11,521 บรรทัด ใกล้เพดาน 12,000 · ใช้แพตเทิร์นเดียวกับ `moto3d.js` โหลดขี้เกียจผ่าน `enterInvasion3D` ใน ui.js) · **กติกา:** ยานแม่ลอยเต็มฟ้าโชว์ช่องตัวอักษร 1 คำ → ยานลูกบินออกมา = จำนวนตัวอักษร → ยิงตกทีละลำ ตัวอักษรลำนั้นกะพริบ+เปลี่ยนแดง→เขียว (+5🪙) → ครบทุกลำ ตัวอักษรกะพริบทั้งแถว เกราะยานแม่เปิด → ระดมยิง/มิสไซล์จนระเบิด (+60🪙) → คำใหม่ · **อาวุธ:** ปืนกลมีระบบความร้อน/โอเวอร์ฮีต + มิสไซล์นำวิถี 6 นัด (ล็อกเป้าอัตโนมัติ · เติมเองใน 9 วิ) · เห็นปืนในมือแบบ FPS (view model + รีคอยล์ + ไฟปากลำกล้อง) · **👥 พันธมิตร AI (ผู้ใช้สั่งเพิ่ม):** หน่วยรบภาคพื้น 10 นาย (เล็งตามเป้าจริง ยิง tracer ทำดาเมจจริง) + เฮลิคอปเตอร์ 3 ลำติดมิสไซล์ (ใบพัดหมุน เอียงเข้าโค้ง ยิงมิสไซล์นำวิถี) · **ไม่มีเกมโอเวอร์** พลังหมด = ถอยไปตั้งหลัก+ฟื้นเต็ม (ตามกฎรอบ 255) · เสียงสังเคราะห์ WebAudio ครบ (ปืน/มิสไซล์/ระเบิด/ลำแสงเอเลี่ยน/เสียงหึ่งยานแม่) · **ตั๋ว `INVASION_PRICE` 45,000🪙** (ล็อกหลังตั๋วมอไซค์) + การ์ดร้าน `invasion-card` + ปุ่มรางเมนู 🛸 · state: `invasionTicket/invasionDone/invasionBest`
  - **🐛 บั๊กที่เจอตอนเทสต์ (อ่านก่อนจูนต่อ — วัดด้วยการอ่านพิกเซลจาก framebuffer จริง เพราะ screenshot ยังใช้ไม่ได้):** ① **ยานแม่จมพื้น** MS_Y 210 กับ MS_R 560 = ท้องยาน+หนามทะลุลงใต้ดิน → MS_Y 340 · MS_Z −300 · หนามใต้ท้องสั้นลง (0.34→0.20) ② **แผงตัวอักษรโคจรหนีไปหลังยาน** เพราะเป็นลูกของลำยานที่หมุนช้าๆ ตลอด → **ย้ายแผงเป็นลูกของ scene แล้วตามตำแหน่ง Y เองใน `tickMother`** (ต้องสั่ง visible เองด้วยตอนยานระเบิด/คำใหม่) ③ **`board.rotation.x` ใส่เครื่องหมายผิด** ลบ = แผงเงยขึ้นฟ้า ตัวอักษรถูกมองเฉียงจนแบน (วัด dot ได้ 0.50) → **ต้องเป็นบวก 0.52** (dot 1.000) ④ **พื้นทรายสว่างจ้าจนแดงตัน 255** (สีวัสดุอุ่นคูณภาพ+ไฟแรง) → สีวัสดุขาวล้วน + hemi .48 sun .62 ⑤ **แถบสถานะทับจอยเดิน** ทุกขนาดจอ → ย้ายไปซ้ายบนใต้ปุ่มออก
  - **ยืนยัน browser:** ยานแม่กินจอ **100% กว้าง / ~70% สูง** (เกือบเต็มฟ้าตามที่ผู้ใช้ขอ) ✓ แถวตัวอักษรอยู่กลางจอ y .37-.46 แยกเป็นคอลัมน์ครบทุกตัว ✓ ยิงตก 1 ลำ = ตัวอักษรนั้น down ตัวเดียว ✓ ครบทุกลำ = กะพริบทั้งแถว (opacity .15 กลางจังหวะ) + เกราะเปิด ✓ เล่นวน 3 คำติด เหรียญ 100→190→270 ถูกต้อง ✓ ลำยานหมุน 2.4 rad แล้วแผงยังอยู่ที่เดิม หันเข้าผู้เล่น dot 1.000 ✓ ผังไม่ทับกันเลยทั้ง 1280×720 / 812×375 / 651×306 ✓ fx คืนหน่วยความจำครบ (1,161→23 หลังเดินเฟรม · ที่ค้างเพราะแท็บ hidden ไม่ใช่ leak) ✓ ฉาก **874 ชิ้น 29,011 สามเหลี่ยม** (ลดบ้าน 120→80 · อินทผลัม 64→34 · หิน 70→45) ✓ ไม่มี console error
  - **ค้าง: ผู้ใช้ลองจริงบนมือถือ** (จูนใน `js/invasion3d.js` หัวไฟล์: `MS_Y/MS_Z/MS_R` ตำแหน่งยานแม่ · `F_HP`(3) `F_SPEED`(17) `F_SHOT_GAP`(2600) ยานลูก · `GUN_GAP`(95) `MIS_MAX`(6) อาวุธ · `SQUAD_N`(10) `HELI_N`(3) พันธมิตร · จำนวนบ้าน/ต้นไม้ใน `buildTown`) · **📸 prompt ภาพ/โมเดล 6 ไฟล์อยู่ใน `PROMPTS_INVASION.md`** (วางไฟล์แล้วเกมสลับใช้เอง ไม่ต้องแก้โค้ด)


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.463` · SW v165) — เก่ากว่า
- **รอบ 475:** 🔫 **ลดปืนไรเฟิลลง 5% ของความสูงจอ (ผู้ใช้สั่งจากภาพ)** — ปลายลำกล้อง **73.1% → 78.1%** ของจอ · `rifle: p[1] −0.245 → −0.339` (R93 ไม่แตะ) · จูนด้วย `GunLab.tune({y:…})` 2 ครั้งจบ
  - ⚠️ **commit นี้กวาดงาน session คู่ขนานไปด้วย** (ไฟล์เดียวกัน แยก pathspec ไม่ได้): 🌙 ของเล่นกลางคืน 3 อย่าง — **ทดสอบครบแล้วโดย session นั้น** ดูบูลเล็ตถัดไป
- **รอบ 475 (ชุดกลางคืน — คนละ session กับข้อบน เลขรอบชนกันโดยบังเอิญ):** 🔦🔥🌠 · ① **ไฟค้นหาจากยานลูก** (`tickSearchBeams`) กรวยแสง+วงแสงพื้นกวาดรอบตัวลำ (เฟสต่างกันทุกลำ ไม่กวาดพร้อมกันเป็นแถว) · **โดนจับ = วงแดง + ลำนั้นเร่งยิงเร็วขึ้น + ป้ายเตือน** (ไม่หักพลังเพิ่ม ไม่ล็อกตัว — บีบให้ขยับหนี ไม่ใช่ลงโทษ) ② **ถังไฟ 5 ใบตามตรอก** (`buildBarrelFires`) เปลวไหวตลอด วงแสงพื้นเฉพาะตอนมืด = หมุดนำทาง ③ **ดาวตก** (`tickShootingStar`) พาดฟ้าเฉพาะกลางคืน ทุก 9–22 วิ
  - **⚠️ ลำแสงต้องอยู่ใน `scene` ห้ามเป็นลูกของ `f.grp`** — ตอนโมเดล `.glb` ยานลูกโหลดเสร็จ `makeFighter` ล้างลูกทั้งหมดของ grp ทิ้ง ลำแสงจะหายตามไปด้วย (ใช้วิธีเดียวกับไฟถนน: ตามตำแหน่งเองทุกเฟรม)
  - **ยืนยัน browser:** 3 ลำ = ลำแสง 3 ชุด · **วาร์ปเข้าไปยืนในวง → แดง + opacity .11→.20 + ป้าย "🚨 ไฟค้นหาจับเราได้!" · เดินออก → กลับเป็นฟ้า** ✓ · ถังไฟ กลางวัน pool 0 / กลางคืน .37 ✓ · ดาวตกไล่ opacity ขึ้นแล้วหายเอง ✓ · **กลางวันดับหมดทุกอย่าง** ✓ ไม่มี error
  - 🧪 hooks: `_t.beamInfo / caught / barrelInfo / starInfo / starAt(เซ็ตได้)` · เทสต์ยานลูก: `_t.pickWord(); _t.startWave();` แล้ววาร์ป `_t.pos={x,z}`
  - 🛡️ **วิธีแก้ไฟล์ตอนมี session คู่ขนาน (ใช้ได้ผลจริง):** แพตช์ด้วยสคริปต์ที่ **อ่าน→แก้→เช็ก md5 ซ้ำ→ค่อยเขียน ในกระบวนการเดียว** (md5 เปลี่ยน = อีก session เพิ่งเขียน → ยกเลิก ไม่ทับ) + commit ทันทีที่เทสต์ผ่าน · ห้ามถือเนื้อไฟล์ไว้ใน context นาน ๆ แล้วเขียนทับทีหลัง
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.462` · SW v165) — เก่ากว่า
- **รอบ 473:** 🔎📝📊 **ต่อยอดเป้าฝึกยิง 3 อย่าง (ผู้ใช้: "ทำต่อยอดได้เลย")** — ① **คำอังกฤษพิมพ์บนหัวกระดาษเป้าทุกใบ** (คำไม่ซ้ำกันทั้ง 12 ใบ · ล้มแล้วตั้งใหม่ = สุ่มคำใหม่) ② **โจทย์แปลไทย** แถบ `#inv-quiz` ซ้ายบน "🔎 ยิงเป้าที่แปลว่า …" เลือกคำตอบจากเป้าที่**มองเห็นจริง** (≤110 ม. · ต้องมีให้เลือก ≥2 ใบ) — ยิงถูก **+12 🪙** + เสียงสำเร็จ · ยิงผิด +3 🪙 ตามเดิม + บอกใบ้โจทย์เดิม (ไม่หักคะแนน ไม่ดุเด็ก) ③ **สถิติความแม่นยำ** นับนัดยิง/เข้าเป้า โชว์ตอนออกจากสมรภูมิ
  - **⚠️ กันชนแถบโจทย์:** ตั้ง `max-width:28vw` + ellipsis — คำแปลไทยยาว ๆ ไม่ล้นไปชนแผงคำยานแม่ (`#inv-word`) · วัดจริง 812×375 ขอบขวา 315 vs word 325 ✓ · 1280×720 = 454 vs 542 ✓
  - **ยืนยัน browser:** 12 เป้าได้คำไม่ซ้ำ ✓ · ยิงเป้าโจทย์ → "✅ ถูกต้อง! WHITE = สีขาว" **+12 🪙** + โจทย์ใหม่เด้งเอง ✓ · ยิงผิดใบ → "🎯 เข้าเป้า! ARM = แขน · โจทย์ยังเป็น ตา นะ" +3 🪙 โจทย์คงเดิม ✓ · เท็กซ์เจอร์หน้าเป้าอ่านออกชัด (ดัมป์ภาพจริง: "TREE" เหนือวงแหวน) ✓ · ออกจากสมรภูมิ → "🎯 เข้าเป้า 1/3 นัด (33%)" ✓ แถบโจทย์ดับตอนออก ✓ ไม่มี error
  - 🧪 hooks: `_t.trgWords / quiz / newQuiz() / trgStat`
- **รอบ 474 (session คู่ขนาน · ขึ้นเว็บพร้อมกันใน `.462`):** 🔄💡 **ต่อยอดกลางคืน — เวลาเดินเอง + ไฟถนน** · ปุ่ม 🌙 เดิม (คีย์ N) กดวน **☀️ กลางวัน → 🌙 กลางคืน → 🔄 อัตโนมัติ** (ไม่เพิ่มปุ่มใหม่ จอเด็กไม่รก · จำโหมดไว้ใน `state.invDayMode`) · โหมด 🔄 หมุนรอบละ **4 นาที** พร้อมแบนเนอร์บอกตอนข้ามช่วง (🌇 ตะวันตกดิน / 🌅 ฟ้าสาง) · เพิ่ม **สีส้มช่วงตะวันตกดิน** ใน `applyNightLook()` (คิดที่เดียว ได้ทั้งโหมดออโต้และตอนกดปุ่ม) · 💡 **ไฟถนน 6 ดวง** บนเสาที่ `buildWarStreet` มีอยู่แล้ว — ติดเองตามค่า `nightK`
  - **⚠️ ตั้งใจไม่ใช้ PointLight จริงกับไฟถนน** — ไฟ 6 ดวงบังคับ three.js คอมไพล์เชเดอร์ใหม่ทุกวัสดุ มือถือตก FPS → ใช้ Sprite additive + วงแสงบนพื้น (แผ่นกลม additive) = ไม่มีต้นทุนแสงเลย
  - **⚠️ หลอดเสียห้ามกะพริบถี่** — ลองครั้งแรก 2 ครั้ง/วิ จอวูบตลอด ไม่เหมาะกับเด็ก → เหลือวูบสั้น ๆ ทุก ~13 วิ (ต้นที่ 3 ต้นเดียว)
  - **ยืนยัน browser (วัดพิกเซลจริง):** วนโหมด ☀️→🌙→🔄→☀️ ไอคอน/สถานะตรงทุกจังหวะ ✓ · รอบเวลา 4 นาที: 0 นาที `#d8c0a0` สว่าง 120 → 1 นาที **`#b7714f` ส้มตะวันตกดิน** 80 → 2 นาที `#091124` 47 ไฟถนน 0.94 → 3 นาที ส้มอีกครั้ง → ครบรอบ ✓ · แบนเนอร์ 🌇/🌅 เด้งตอนข้ามช่วงทั้งสองทาง ✓ ไม่มี error
  - 🧪 hooks: `_t.dayMode / setDayMode / cycT (เซ็ตได้ กระโดดเวลาไปทดสอบ) / lampInfo`
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.461` · SW v165) — อ่านก่อน
- **รอบ 472:** 🔫 **ยกปลายลำกล้องไรเฟิลขึ้นมาอยู่ระดับจุดเล็ง (ผู้ใช้ขีดเส้นแดงบนภาพ)** — เส้นที่ขีดพาดผ่าน **จุดเล็ง (73% ความสูงจอ = AIM_OFF)** พอดี → เป้าหมาย = ปลายลำกล้องอยู่ระดับเดียวกับจุดเล็ง · `rifle: p[1] −0.46 → −0.245` (R93 ไม่แตะ)
  - **📐 บทเรียนใช้ต่อได้:** ยก "ปลายลำกล้อง" ด้วย pitch **ไม่ได้** — จุดหมุนของโมเดลอยู่ใกล้ปากกระบอก (origin ฉายที่ 59.6% ของจอ · ปากกระบอก 50.0% = แขนโยกสั้นมาก) ต้องยกทั้งกระบอกด้วยแกน y · อัตราแปลง: y 1 หน่วย ≈ 1.1 NDC ที่ z −0.95
  - **ยืนยัน browser:** ปลายลำกล้อง (muzzleAnchor ฉายผ่าน vmCam) **84.9% → 72.9% ของจอ** = ระดับจุดเล็ง 73% ✓ · เห็นตัวปืนในเฟรม 100% (เดิม 91%) · มุมเงา 5.1° → 7.1° · R93 คงเดิมเป๊ะ (4.9° · yAtX0 −0.325) ✓ ยิงได้ปกติ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.460` · SW v165) — เก่ากว่า
- **รอบ 471 (🎯 เป้าฝึกยิง — เทสต์ครบแล้ว · ปิดข้อค้างที่รอบกลางคืนฝากไว้):** เป้ากระดาษบนเสาไม้ **12 จุดค่าตายตัว** (ปากตรอกริมถนน 8 + ริมกำแพงในเมือง 4) · ยิงโดน = **+3 🪙 + คำศัพท์ 1 คำพร้อมคำแปล** (คลังเดียวกับ `pickWord` · อ่านออกเสียง + ลงสมุดคำศัพท์) · ล้มหงายแล้วตั้งใหม่เองใน 7 วิ · `Snd.hitTarget` (ไม้+กระดาษ+กระดิ่ง) แยกจาก hitWall/hitSand · โซน `🎯📝 รอบ 471: เป้าฝึกยิง` ใน `js/invasion3d.js`
  - **⚠️ กับดักที่เจอ (จดไว้ใช้ต่อ):** จะกัน "ยิงทะลุกำแพงโดนเป้า" ด้วย `envHit` ไม่ได้ — `solids` เก็บตึกเป็น **วงกลม r=ด้านยาว/2 ซึ่งล้นคลุมผิวถนน** วัดจริงแล้ว **9 ใน 12 เป้าถูกตีว่าโดนบังทั้งที่มองเห็นเต็มตา** → เหลือกันเฉพาะ `kind==='sand'` (เนิน/พื้นบัง) · เป้าที่ไปตรงกับตึกสุ่มของ `buildTown` ถูกดันออกตอนสร้าง
  - **ยืนยัน browser:** ยิงเป้าที่ 20 ม. และ 34 ม. → เป้าล้ม (`rx` 0→1.35) · +3 🪙 · แบนเนอร์ "🎯 เข้าเป้า! MOTHER = แม่" / "DOG = สุนัข" / "HEAD = หัว" (สุ่มคำไม่ซ้ำ) ✓ · ครบ 7 วิ ตั้งกลับเอง (`up=true`, `rx=0`) ✓ · LOD ซ่อนเป้าไกล 189–322 ม. เหลือวาด 9 ตัว ✓ · ฐานเป้าเกาะพื้นตามเนินจริง (y 2.1–13.2) ✓ ไม่มี error
  - 🧪 hooks ใหม่ใน `_t`: `targets/hitTarget(i)/tickTargets/targetWord/rayTarget/envHit/solids`
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.459` · SW v165) — เก่ากว่า
- **รอบ 471 (🌙 โหมดกลางคืน):** ปุ่ม 🌙 มุมซ้ายล่าง (คีย์ **N** · จำค่าไว้ใน `state.invNight`) ไล่แสงนุ่ม 2 วิ — ฟ้า/หมอกเป็นสีคืน · ⭐ โดมดาว 620 ดวง + ดวงจันทร์ · ยานแม่ดัน emissive ให้เรืองแสงเด่น · **🔦 SpotLight ติดปากลำกล้อง อยู่ใน scene หลัก** (ปืนอยู่ vmScene ส่องไม่ถึงพื้น) · แก้ที่โซน `🌙 รอบ 471: โหมดกลางคืน` ใน `js/invasion3d.js`
  - **ยืนยัน browser (วัดพิกเซลจริง):** ความสว่างจอกลางวัน 97 → กลางคืน 43 (ยังเห็นทางเดิน ไม่ดำสนิท) · **ลำไฟฉาย: กลางจอสว่างกว่าขอบจอ 2.38 เท่า** (กลางวัน 1.01 = ไม่มีลำ) ✓ · ยิง 1 นัด → ฉากวาบ 46→161 (3.5 เท่า) แล้วดับใน ~4 เฟรม ✓ · ส่องกล้อง = ไฟฉายดับเอง (0) กลับมา 2.9 เมื่อเลิกส่อง ✓ · ปุ่มไม่ทับใครทั้ง 1280×720 / 812×375 / 780×560 ✓ ไม่มี error
  - ⚠️ **3 งานรอบ 471 อยู่ในไฟล์เดียวกัน (invasion3d.js) แยก pathspec ไม่ได้** → commit `5c22173` กวาด 📣 ตะโกนบอกทิศ + 🎯 เป้าฝึกยิง ของ session คู่ขนานไปด้วย · ก่อน deploy บูตเกมใหม่ทดสอบรวมแล้ว: เป้า 12 ตัว · ทหารตะโกนได้ · กลางคืนครบ · **ไม่มี error**
  - 🧪 hooks ใหม่ใน `_t`: `night/nightK/setNight/lightInfo/flashInfo/worldFlashInfo` + **`stepFrame(dt)`** (เดินเฟรมเองได้ — แท็บ preview ที่ไม่ได้อยู่หน้าจอ `document.hidden=true` rAF ไม่วิ่ง เจอกับดักนี้มาแล้ว)
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.458` · SW v165) — เก่ากว่า
- **รอบ 470:** 🔄 **สลับมุมก้ม/เงยของไรเฟิล (ผู้ใช้สั่ง เฉพาะกระบอกนี้ · R93 ไม่แตะ)** — วัดของเดิม: ปากกระบอกอยู่ **ต่ำกว่า** พานท้าย 0.42 หน่วยจอ → ค่าใหม่ ปากกระบอก **สูงกว่า** พานท้าย 0.16 · `rifle: {p:[.22,−.46,−.95], r:[−.44,.46,.09], s:1.146}`
  - **วิธีที่ใช้:** มุมก้มอย่างเดียวทำไม่ได้ (ลดก้มแล้วเงาปืนชันขึ้นเป็น 20–40°) → ต้องผสม 3 ค่า: ลดก้ม (−.504→−.44) + **หันเข้าใน yaw .46** + ลดตัวปืนลง (y −.46) จึงได้ทั้งสลับด้านและคงแนวแบน
  - **ยืนยัน browser:** ไรเฟิล มุม 4.9° · เห็นในเฟรม 92% · ปากกระบอกสูงกว่าพานท้าย 0.16 ✓ ยิงปกติ ✓ · R93 ไม่เปลี่ยน (5.3°) ✓
  - **🔍 ยืนยันทิศโมเดลไรเฟิลด้วยภาพเรนเดอร์แยก:** ด้าน −z = ลำกล้อง+การ์ดมือ (ถูกแล้ว) · ด้าน +z = พานท้าย → การกลับด้านรอบ 468 ถูกต้อง
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.457` · SW v165) — เก่ากว่า
- **รอบ 469:** 🎯🕳️🔥 **กระสุนมีปลายทางจริงแล้ว** — เดิมยิงไม่โดนยาน = ไม่เกิดอะไรเลย · ตอนนี้ ① **`envHit()`** เดินตามวิถีหาจุดตกบน **กำแพงตึก / พื้นทราย** (คัดตึกใกล้แนวยิงก่อน = 0.15 ms/นัด) ② **เสียงตามวัสดุ** `Snd.hitSand` (ตุบนุ่ม+ฝุ่น) · `Snd.hitWall` (แคร็กแหลม+เศษปูน) · โลหะยานใช้ ping เดิม — ดังตามระยะทั้งหมด ③ **รอยกระสุนค้างบนพื้นผิว** `bulletHole()` (ทราย=หลุมฟุ้ง · ปูน=รูเข้มขอบสว่าง · หมุนสุ่มไม่ให้ซ้ำแบบ · เก็บสูงสุด 44 รอย เก่าสุดหลุดก่อน) + ฝุ่นฟุ้ง `dustPuff()` ④ **`worldFlash`** ไฟแฟลชปากลำกล้องส่อง **ฉากจริง** (พื้น/กำแพงสว่างวาบตอนยิง · คนละดวงกับ `muzzleLight` ที่ส่องเฉพาะตัวปืน)
  - **ยืนยัน browser:** ยิงพื้น → เสียง sand ที่ 3 ม. + รอยเพิ่มทีละนัด ✓ · ยิงตึก → เสียง wall ที่ 18–19 ม. ✓ · `worldFlash` 0 → 4.68 ตอนยิง → จางลง ✓ · สเปรย์ 60 นัด: รอยหยุดที่ 44 (cap ทำงาน) ✓ ไม่มี error · `envHit` 0.149 ms/นัด (มือถือรับไหว)
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.456` · SW v165) — เก่ากว่า
- **รอบ 468:** 🔄 **ไรเฟิลหันปากกระบอกเข้าหาตัวเอง — กลับด้านให้ถูก (ผู้ใช้ทักจากภาพ)** — ต้นตอ: `alignGunMuzzle()` เดิมถือว่า "จุดที่ z น้อยสุด = ปากกระบอก" ซึ่งผิดถ้าโมเดลกลับหลัง (ของไรเฟิลกลับ) → ทั้งไฟ/ควัน/แกนลำกล้องเลยไปอยู่ฝั่งพานท้าย
  - **วิธีตรวจใหม่ (ใช้ได้กับปืนทุกกระบอกในอนาคต):** วัด **รัศมีเฉลี่ยของสแลบหัว-ท้าย** — ปลายลำกล้อง "เรียว" เสมอ ส่วนท้าย (พานท้าย/แม็ก) อ้วนกว่า · ถ้าหน้าอ้วนกว่าท้าย >1.35 เท่า = โมเดลกลับหลัง → `rotateY(π)` แล้ววัดซ้ำ (ติดธง `userData.flipped`)
  - จูนท่าไรเฟิลใหม่หลังกลับด้าน: `rifle: {p:[.22,−.386,−.95], r:[−.504,.004,.09], s:1.146}`
  - **ยืนยัน browser:** `flipped=true` · ควันปากลำกล้องออกที่พิกัดกล้อง z≈−1.6 (อยู่หน้าเรา ไม่ใช่หลัง) ✓ · ไรเฟิล 5.7° / R93 5.5° · yAtX0 −0.327 ทั้งคู่ (แนวปืนพาดผ่านจุดเล็งเท่ากัน) ✓
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.455` · SW v165) — เก่ากว่า
- **รอบ 467:** 🚀🔥🔓 **ต่อยอดปืนอีก 3 อย่าง** — ① **กระสุนมีเวลาเดินทาง** (`bullets[]` + `tickBullets()`) — วิถีคำนวณตอนยิงเหมือนเดิม (เล็งไม่ยากขึ้น) แต่ประกาย/ดาเมจ/เสียงโดน มาถึงตาม **ระยะ ÷ ความเร็ว** (R93 760 · ไรเฟิล 420 ม./วิ) · `tracer()` วาดเป็น "ขีดสั้นวิ่งไปตามวิถี" (kind `trace`) ② **ปืนร้อน = ควันลอยจากลำกล้อง** (`tickBarrelHeat` เริ่มที่ heat 55% · โอเวอร์ฮีตถี่ขึ้น) เตือนด้วยภาพโดยไม่ต้องอ่านแถบ ③ **ลูกเลื่อนค้างเปิดตอนกระสุนหมด** (bolt catch) — ค้างจนบรรจุเสร็จแล้วดันกลับพร้อมเสียงล็อก
  - **ยืนยัน browser:** ยิงยานแม่ระยะ ~415 ม. → ผลกระทบมาถึงที่ **547 ms** (ตรงสูตร) ✓ · ตั้ง heat 80 โดยไม่ยิง → มีควันเกิดใหม่ (idle 0 → 1) ✓ · ยิงจนหมดแม็ก → `boltHeld=true` คันรั้งยก −1.05 ถอย −0.147 · บรรจุเสร็จ → ammo 10, held=false, คันรั้งกลับ 0 ✓
  - **🧪 กับดักเทสต์ (จดไว้):** ปุ่มยิง R93 ต้องส่ง `window.dispatchEvent(new MouseEvent('mouseup'))` (ไม่ใช่ document) ไม่งั้น `firedThisPress` ค้าง ยิงไม่ออก · เพิ่ม `_t.heat` แบบเซ็ตได้ + `_t.bullets/boltHeld` ไว้เทสต์
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.454` · SW v165) — เก่ากว่า
- **รอบ 466:** 🔔💥🌤️ **ต่อยอดปืนอีก 3 อย่าง** — ① **ปลอกกระสุนตกพื้นมีเสียง** `Snd.shell(dist)` ("กริ๊ง" 2 ชั้น ดังตามระยะ · เกิน 9 ม. แทบไม่ได้ยิน) + ปลอกเด้งอีกทีก่อนนิ่ง ② **แพตเทิร์นแรงถอย (ฝึกได้)** `RECOIL_PAT` 15 ขั้น — ยิงรัวติดกันดีดขึ้น+ส่ายเป็นแบบเดิมทุกครั้ง (เว้นยิงเกิน 420ms = เริ่มชุดใหม่) · ยิ่งรัวยิ่งดีดแรงขึ้นถึง 1.6 เท่า ③ **เงาตัวเรา+ปืนบนพื้น** `selfShadow` (แผ่นเงานุ่ม 1 mesh ไม่ใช่ shadow map = ไม่กินเฟรม) ทอดตามทิศแดดจริง (sun 70,90,120) เห็นตอนก้มมอง
  - **⚠️ กับดักที่เจอ:** เสียงปลอกกระสุนดันไปดังกับ **เศษระเบิดทุกชิ้น** เพราะใช้ `fx kind:'bit'` ร่วมกัน → ติดธง `metal:true` เฉพาะปลอกจริง + ตัดระยะ >12 ม. (จาก 28 เสียง/นัด เหลือ 2)
  - **ยืนยัน browser:** ยิง 1 นัด → เสียงปลอก 2 ครั้ง (ตก+เด้ง) ที่ 2.4/2.5 ม. ✓ · ยิงรัว 2 ชุด ทิศส่ายนัดที่ 2–9 ตรงกันเป๊ะ (ฝึกจำได้จริง) ✓ · เงาอยู่ในเฟรมตอนก้มมอง NDC (−0.41,−0.43) และหลุดจอตอนเงยหน้า = ถูกต้องตามฟิสิกส์แดด ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.453` · SW v165) — เก่ากว่า
- **รอบ 465:** 🔊👁️🔥 **ต่อยอดปืนอีก 3 อย่าง (ผู้ใช้สั่ง "ทำเลย ไม่ต้องรออนุมัติ")** — ① **เสียงเปลี่ยนปืน 2 จังหวะ** `Snd.swapDown` (ผ้า+โลหะหน่วง ตอนเริ่มลดปืน) / `Snd.swapUp` ("คลิก" ล็อกแม็ก ตอนยกกระบอกใหม่) ผูกกับ `tickSwap` ที่ p=.02 และ .72 ② **eye-relief** — หันจอเร็ว ๆ ขอบดำเลนส์เลื่อนบังมาข้างหนึ่งชั่วครู่ (ใช้ `lagYaw/lagPitch` ชุดเดียวกับที่ปืนโยก จึงตรงจังหวะ) ③ **ไฟแฟลชปากลำกล้อง** `muzzleLight` (PointLight ใน vmScene ตามปากกระบอกจริง) สว่างวาบตอนยิงแล้วดับ — ตัวปืนรับแสงส้มจริง เห็นชัดมากในเงา/กลางคืน
  - **ยืนยัน browser:** เสียงเรียกที่ 64ms (down) และ 345ms (up) ในอนิเมชัน 420ms ✓ · จุดศูนย์กลางหน้ากากเลนส์ 50% → 50.70% ตอนหัน → กลับ 50.00% ✓ · ไฟแฟลช intensity 7.58 ตอนยิง → 0 หลังจากนั้น ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.452` · SW v165) — เก่ากว่า
- **รอบ 464:** 🌀🔁📏 **ต่อยอดปืน 3 อย่างรวด (ผู้ใช้อนุมัติทำทุกไอเดียจนกว่าจะสั่งหยุด)** — ① **ปืนโยกตามการหันจอ** (`lagYaw/lagPitch` สปริงกลับ · เพดาน .14 rad · ตอนส่องกล้องเหลือ 25% ให้เล็งนิ่ง) ② **ท่าเปลี่ยนปืน** (`swapAt/tickSwap` · ลดปืน-ยกขึ้นรูประฆัง 420ms · **สลับโมเดลจริงตอนต่ำสุด** ผ่าน `applyWeapon()` ที่แยกออกมา · กดรัวไม่ได้ระหว่างเปลี่ยน) ③ **เรติเคิลวัดระยะ** — จุด mil-dot 4 จุด + เลข 1–4 ใต้กึ่งกลาง + ป้าย **"📏 ระยะ ม."** อ่านจากเรย์จริงทุก 6 เฟรม (ไม่โดนยาน → ไล่หาจุดตัดพื้นดินให้แทน)
  - **⚠️ บั๊กที่เจอ+แก้ระหว่างทาง:** ① เข้าโลกครั้งแรกปืนสะบัด เพราะ `lastPitch` เริ่มที่ 0 แต่เกมเริ่ม pitch .30 → seed ค่าใน `start()` ② เครื่องมือ dev เดิมสลับปืนด้วย `swapWeapon()` รัว ๆ ซึ่งตอนนี้มีอนิเมชัน+กันกดซ้ำ → เปิด `_t.applyWeapon()` (สลับทันที) ให้ GunLab ใช้แทน
  - **ยืนยัน browser:** หันจอ → ปืนเอียงตาม (yaw −0.087) แล้วไหลกลับเข้าที่ครบ ✓ · เปลี่ยนปืน: y ลง −0.756 ตอนกลางทาง สลับเป็น r93 ตอนต่ำสุด จบที่ท่าปกติ 0.62 วิ ✓ · เรติเคิล 4 จุด/4 เลข ✓ ระยะอ่านได้จริง (เล็งไกล 142 ม. · เล็งพื้น 3–8 ม.) ✓ ยิง 10→9 ✓ ไรเฟิล 5.9° / R93 5.3° เท่าเดิม ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.451` · SW v165) — เก่ากว่า
- **รอบ 463:** 🔫 **ปืนกระบอกอื่นตั้งค่าภาพให้เหมือน R93 + ได้กล้องซูมของตัวเอง (ผู้ใช้สั่ง)** — ① ค่าท่าถือแยกตามกระบอกใน **`GUN_VIEW`** (`useGunView()` คัดมาใช้ตอนสลับปืน) · ไรเฟิลจูนด้วย `GunLab.match()` จนได้ **มุม 5.7° · แนวปืนพาดผ่านจุดเล็ง (−0.325 เท่ากับ R93 −0.326) · ขนาดใกล้เคียง** ② ไรเฟิลได้ **ศูนย์เล็ง 2× ระดับเดียว** (`RIFLE_MAGS` · `magList()/curMag()` เลือกตามปืน) วงเลนส์เล็กกว่า R93 (R 87 vs 158) · ปุ่มเลือกกำลังขยายโชว์เฉพาะปืนที่มีหลายระดับ ③ **`adsPosNow()`** เลื่อนท่าแนบไหล่ตาม AIM_OFF ทุกเฟรม (ไม่งั้นส่องกล้องแล้วตัวปืนลอยเหนือวงเลนส์)
  - **🆕 เครื่องมือ:** `GunLab.match(w, GunLab.target('r93'))` = จับปืนกระบอกใหม่ให้หน้าตาเท่า R93 อัตโนมัติ (คุม 3 ค่า: มุม/ความยาวเงา/แนวพาดจุดเล็ง) · `GunLab.pair()` = เทียบ 2 กระบอกในภาพเดียว · `gunSil()` คืน `len` + `yAtX0` เพิ่ม
  - **ยืนยัน browser:** ไรเฟิล 5.7° / R93 4.9° · yAtX0 −0.325 vs −0.326 ✓ ยิงได้ ✓ ไรเฟิล ADS 2× (mag btn ซ่อน) · R93 ยัง 4×/6×/8× (mag btn โชว์) ✓ วงเลนส์ทั้งคู่อยู่ที่จุดเล็ง (50%,73%) ✓ ไม่มี error
  - **⚖️ ผู้ใช้อนุมัติล่วงหน้า: ไอเดียต่อยอดเรื่องปืนในโลกนี้ ทำได้เลยไม่จำกัด จนกว่าจะสั่งยกเลิก**
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.450` · SW v165) — เก่ากว่า
- **รอบ 462:** 🔭🫁 **วงเลนส์โตตามกำลังขยาย + ขอบเลนส์หายใจ (ผู้ใช้อนุมัติไอเดียต่อยอด)** — ① `SCOPE_MAGS` เพิ่มฟิลด์ `r` แล้วคิดเป็น **สัดส่วนของพื้นที่ว่างจริง** (จุดเล็งอยู่ 73% ของจอ พื้นที่ถึงขอบล่างเป็นตัวจำกัด): 8×=เต็มที่ · 6×=85% · 4×=73% ② `layoutScope(now)` ทำขอบเลนส์ขยับ ±3px + ความเข้มขึ้นลงตามจังหวะหายใจเดียวกับที่กล้องแกว่ง · **กลั้นหายใจ = แทบนิ่ง + ขอบเข้มขึ้น · ลมใกล้หมด = แกว่งแรง/ถี่ขึ้นถึง 2 เท่า** · เรียกทุกเฟรมจาก `frame()` เมื่อ `adsT>0.02`
  - **ยืนยัน browser:** รัศมี 4×/6×/8× = **136/158/186 px** ต่างกันชัด · ทุกกำลังขยายวงอยู่กึ่งกลางที่ 73% และไม่ล้นขอบล่าง (เหลือ 60/38/10 px) ✓ ขนาดวงแกว่ง 7px ตอนหายใจปกติ → **1px ตอนกลั้นหายใจ** ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.449` · SW v165) — เก่ากว่า
- **รอบ 461:** 🔭 **กล้องส่องขยาย "จุดที่เล็งอยู่" (ผู้ใช้: ตอนนี้ยังขยายจุดเดิม)** — เดิม ADS จางจุดเล็งกลับกลางจอ + วงเลนส์อยู่กลางจอเสมอ → แก้ 3 จุด: ① `aimOffNow()` **ไม่คืนกลับกลางจอตอน ADS แล้ว** ② `renderScopePass()` หมุนกล้องตาม AIM_OFF ก่อนเรนเดอร์ + ย้าย viewport/scissor ไปครอบจุดเล็ง (คืนค่า quaternion ท้ายฟังก์ชัน) ③ `layoutScope()` ย้ายวง CSS (mask+ring+เรติเคิล) ไปที่จุดเล็ง
  - **⚠️ ผลข้างเคียงที่ต้องแก้ด้วย:** จุดเล็งอยู่ 73% ของจอ → วงเลนส์รัศมีเดิม (216px) ล้นขอบล่าง → `scopeRadius()` จำกัดรัศมีไม่ให้เกินระยะถึงขอบใกล้สุด−8px (ได้ 186px · เหลือขอบล่าง 8px พอดี)
  - **ยืนยัน browser:** วงเลนส์อยู่ที่ (50%, 73%) ✓ กระสุนตอน ADS ตกที่ (0,−0.46) = กลางเลนส์ ✓ อ่านพิกเซล: บริเวณในวงเปลี่ยนเป็นภาพขยาย ✓ ไม่มี error · quaternion กล้องคืนค่าเดิมหลังเรนเดอร์ ✓
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.448` · SW v165) — เก่ากว่า
- **รอบ 460:** 🎯 **ยกจุดเล็งสูงขึ้น (ผู้ใช้ขีดเส้นแดงรอบสาม: −0.60 ต่ำไป)** → `AIM_OFF=[0,−.46]` = **73% ความสูงจอ** · ยืนยันเรย์: กระสุนตกที่ (0, −0.46) ตรงจุดเล็ง ✓ (คำสั่งเดียว `GunLab.aim(-0.46)`)
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.447` · SW v165) — เก่ากว่า
- **รอบ 459:** 🎯 **จุดเล็งลงมานั่งบนแนวตัวปืนพอดี** — ผู้ใช้ขีดเส้นแดงรอบสอง (ตรงกับแนวกึ่งกลางปืนที่วัดไว้ −0.578) → `AIM_OFF=[0,−.60]` = **80% ความสูงจอ** · ยืนยันเรย์: กระสุนตกที่ (0, −0.60) ตรงจุดเล็ง ✓ (จูนด้วย `GunLab.aim(-0.6)` คำสั่งเดียว ไม่ต้องถ่ายภาพ ตามกฎใหม่ของผู้ใช้)
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.446` · SW v165) — เก่ากว่า
- **รอบ 458:** 🎯 **ย้าย "จุดเล็ง" ลงมาบนแนวปืน (ผู้ใช้ขีดเส้นแดงบนภาพชี้จุดที่ต้องการ)** — เพิ่ม `AIM_OFF=[0,−.39]` (หน่วย NDC · 0=กลางจอ) · `aimDir()` คิด offset ให้ **ทุกระบบที่ยิง/ล็อกเป้าอ่านทิศจากที่นี่ที่เดียว** → กระสุนไปตรงจุดเล็งเป๊ะ · `layoutCross()` เลื่อน `#inv-cross` ตามทุกเฟรม
  - **โหมดที่ไม่ใช้ offset:** ส่องกล้อง (จางเป็น 0 ตาม `adsT` ไม่งั้นยิงผ่านเลนส์แล้วต่ำ) · บนเฮลิ · พลปืนประจำประตู — ทั้งหมดเล็งกลางจอเหมือนเดิม
  - **ยืนยัน browser:** จุดเล็งอยู่ที่ 69.5% ความสูงจอ ✓ ยิงเรย์ตาม `aimDir` ฉายกลับลงจอ = (0, −0.39) ตรงจุดเล็งเป๊ะ ✓ ส่องกล้องกลับเป็น (0,0) ✓ ยิง 10→9 ✓
  - **📐 ตัวเลขอ้างอิงถ้าจะขยับอีก:** แนวกึ่งกลาง "ตัวปืนจริง" ตัดแกนกลางจอที่ **−0.578** (ต่ำกว่าที่ผู้ใช้ขีดไว้ −0.39) · จูนสั้น ๆ: `GunLab.aim(-0.5)` แล้วก๊อปบรรทัด AIM_OFF ไปวาง
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.445` · SW v165) — เก่ากว่า
- **รอบ 457:** 💰 **ยกเครื่องวิธีจูนท่าปืนให้ประหยัด token (ผู้ใช้ทัก: แค่ปรับองศาใช้ไป 3.4k tokens/รอบ)** — ต้นตอ: ทุกครั้งต้องส่งโค้ด boot+วัดมุม+ค้นหา+จับภาพยาว ๆ เข้าไปใหม่ · แก้ 3 ชั้น: ① `js/invasion3d.js` เพิ่ม `gunSil()` (วัดมุมเงาปืนบนจอด้วย PCA) + `setGunPose({x,y,z,s,roll,deg})` (กวาดหา pitch ให้ได้องศาที่สั่ง แล้วคืน **3 บรรทัดพร้อมก๊อปวางทับ**) เปิดผ่าน `_t` ② ไฟล์ dev ใหม่ **`tools/gunlab.js`** (boot/tune/big/fwd/shot/done — หัวไฟล์มีวิธีใช้ครบ) ③ รวมค่าคงที่ท่าปืนเป็น **TUNE ZONE 3 บรรทัด** ในไฟล์เกม + ย้ายคอมเมนต์ประวัติ 6 รอบ (450–456) ออกไปไว้ที่นี่ (ไฟล์เล็กลง 2.2KB)
  - **▶️ วิธีจูนรอบต่อไป (ใช้แทนของเดิมทั้งหมด):** eval ครั้งเดียว → `const t=await(await fetch('tools/gunlab.js?b='+Date.now())).text();(0,eval)(t);await GunLab.boot()` แล้วสั่งสั้น ๆ: `GunLab.tune({deg:5})` · `GunLab.big(1.2)` · `GunLab.fwd(.15)` · `GunLab.shot()` → ก๊อป line1–3 วางทับ TUNE ZONE
  - **⚠️ กับดักที่เจอตอนทำ:** มุมเงาปืน **ไม่ใช่ฟังก์ชันขาเดียวกับ pitch** (กดลงเรื่อย ๆ มุมลดถึงจุดต่ำสุดแล้วชันกลับ) → bisection หลุดไปปลายช่วง ต้องใช้ "กวาดหยาบ + ละเอียดรอบจุดดีสุด"
  - **ยืนยัน browser:** `tune({deg:9})`→8.9° · `tune({deg:5.5})`→5.3° · `big(1.15)`→scale 1.552 คงมุม ✓ ท่าที่ deploy เหมือนเดิมทุกอย่าง (5.5° vis 71%) ✓ ยิง 10→9 ✓ ADS=1 ✓ ไม่มี error
  - **เพิ่มเติม (ผู้ใช้สั่งต่อ):** `GunLab.shot()` เปลี่ยนค่าเริ่มต้นเป็น **ครอปเฉพาะโซนปืน** 320px q.45 = **9KB** (เดิมเต็มจอ 16–30KB) — ยังเห็นกากบาทมุมซ้ายบนไว้เทียบตำแหน่งได้ · อยากได้เต็มจอใช้ `GunLab.shot({full:true})` (ไฟล์ tools อย่างเดียว ไม่ต้อง deploy)
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.444` · SW v165) — เก่ากว่า
- **รอบ 456:** 🔭 **ดันปืนไปข้างหน้าให้เห็นกล้องส่อง + ยกพานท้ายอีก 5° (ผู้ใช้สั่งจากภาพ: scope ตกขอบจอ)** — `GUN_POS[.22,−.17,−.95] · GUN_ROT[−.645,.004,.09] · SCALE 1.35` · เงาปืน 10° → **5.5°** · ตัวปืนอยู่ในเฟรม **71%** (เดิม ~45% กล้องส่องตกขอบล่าง) · ขยาย 1.15→1.35 ชดเชยระยะ ขนาดบนจอเท่าเดิมราว 96%
  - **⚖️ กฎที่เจอซ้ำ 3 รอบ (จดไว้เลย):** *ดึงเข้าใกล้ = เห็นน้อยลง · ดันออกไกล = เห็นครบแต่เล็กลง* → ถ้าผู้ใช้ขอ "เห็นชิ้นส่วนที่ตกขอบ" ให้ **เพิ่มระยะ z + ขยาย scale ตามสัดส่วน** พร้อมกันเสมอ
  - **ยืนยัน browser:** มุม 5.5° ✓ vis 71% ✓ ยิง 10→9 ✓ ภาพจริงเห็นกล้องส่อง+ลำกล้อง+โครงปืนครบในเฟรม ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.443` · SW v165) — เก่ากว่า
- **รอบ 455:** 🔍 **ปืนใหญ่ขึ้นอีก + ยกพานท้ายขึ้น 5° (ผู้ใช้สั่งต่อจากรอบ 454)** — `GUN_POS[.26,−.20,−.66] · GUN_ROT[−.538,.004,.09] · SCALE 1.15` · เงาปืนบนจอ **15° → 10.1°** · ขนาด .85 → 1.15 (เทียบรอบ 453 ที่ .57 = ใหญ่ขึ้น 2 เท่า)
  - **วิธีจูนที่ใช้ซ้ำได้:** bisection หา `GUN_ROT[0]` ที่ทำให้มุมแกนหลัก (PCA) ของจุดตัวปืนที่อยู่ในเฟรม = องศาที่ผู้ใช้สั่งพอดี → สั่งเป็นตัวเลของศาได้เลยทุกครั้ง
  - **ยืนยัน browser:** มุม 10.1° ✓ scale 1.15 ✓ ยิง 10→9 ✓ ภาพจริงเห็นปืนใหญ่วางเกือบขนานพื้นมุมขวาล่าง เห็นกล้องส่อง ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.442` · SW v165) — เก่ากว่า
- **รอบ 454:** 📐 **ปืนใหญ่ขึ้น + แนวปืนบนจอ 15° ตามที่ผู้ใช้สั่งเป็นตัวเลข** (จากภาพจริง: "ปืนเล็กดูไกลตัว · กดปากกระบอกลงจนเป็น 15° ตอนนี้ ~70°") — `GUN_POS[.22,−.16,−.58] · GUN_ROT[−.52,.004,.09] · SCALE .85` (ใหญ่ขึ้น 1.5 เท่า) · วัดมุมด้วย **PCA ของเงาปืนที่อยู่ในเฟรม** (ของเดิม 65° → ใหม่ **14.9°** ✓)
  - **⚠️ ข้อแลกเปลี่ยนที่ผู้ใช้รับทราบแล้ว:** ท่าถือสะโพก **ลำกล้องไม่ชี้เข้ากากบาทแล้ว** (กดลง 30°) → กฎรอบ 452 ใช้กับท่านี้ไม่ได้ · **แต่กระสุนยังไปที่กากบาทเสมอ** (ยิงตามแนวเล็งกล้อง ไม่ใช่ทิศโมเดล) · ADS ยังยกเข้าแนวสายตาปกติ
  - **ยืนยัน browser:** silAngle 14.9° ✓ scale .85 ✓ ยิง 10→9 ✓ ADS adsT=1 ✓ ภาพจริง (readPixels→download→Read) เห็นปืนวางเกือบขนานพื้นมุมขวาล่าง เห็นกล้องส่อง+โครงปืนเต็ม ✓ ไม่มี error
  - **🧪 กับดัก preview:** หลัง `location.reload()` ต้อง `await fetch('js/invasion3d.js',{cache:'reload'})` **ก่อน** `loadScriptOnce` ไม่งั้นได้ไฟล์เก่าจาก HTTP cache (เสียเวลา 2 รอบ) · ถ้ายังเก่าอีก = dev server ตาย ให้ `preview_start` ใหม่
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.441` · SW v165) — เก่ากว่า
- **รอบ 453:** 🖼️ **จัดท่าปืนตามภาพอ้างอิงที่ผู้ใช้ส่ง (หน้าจอ Tripo: เห็นทั้งกระบอก+กล้องส่อง มองจากหลัง-เยื้องบน)** — ท่ารอบ 451 ดึงเข้าใกล้เกินจนโครงปืน/กล้อง/พานท้ายบานหลุดขอบขวา เหลือเป็น "ก้อนดำ" · เรนเดอร์เทียบจริง 8 ท่าแล้วเลือก `GUN_POS[.19,−.12,−.78] · SCALE .57` (ถอยออก+ไปขวา-ล่าง+ย่อลง) · GUN_ROT แก้เป็น `[.002,.004,.09]` (แก้สมการเล็งใหม่ตามตำแหน่งใหม่ ยังชี้เข้ากากบาทที่ 50 ม.)
  - **⚠️ กฎที่ได้: "ดึงเข้าใกล้ ≠ เห็นชัด"** — ยิ่งใกล้ตา ส่วนท้ายยิ่งบานหลุดจอ เหลือให้เห็นน้อยลง
  - **🆕 วิธีดูภาพเกมเอง (สำคัญมาก · เครื่องมือ screenshot ของ browser ค้างกับฉาก 3D นี้เสมอ):** `gl.readPixels` → วาดใส่ canvas 2D ย่อ → `toDataURL('image/jpeg')` → `<a download>` คลิกเอง → ไฟล์ไปโผล่ `C:\Users\rober\Downloads\` (รอ ~4 วิ ให้ .tmp เปลี่ยนชื่อ) → Read ไฟล์นั้นดูภาพได้เลย · เรนเดอร์เทียบหลายท่าในภาพเดียว: สร้าง `THREE.WebGLRenderer` ของตัวเอง เรนเดอร์ `_t.scene` แล้ว `clearDepth()` + `_t.vmScene` ต่อ = ได้ภาพเกมจริงทุกท่าโดยไม่ต้องแก้ไฟล์
  - **ยืนยัน browser:** ท่าใหม่ยังเล็งตรง — เส้นจากปากกระบอกที่ 50 ม. = (0.000, 0.000) ✓ ปากกระบอก (0.138,−0.148) ต่ำกว่ากากบาท ✓ ภาพจริงเห็นลำกล้อง–กล้องส่อง–คันรั้ง–โครงปืนครบ ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.440` · SW v165) — เก่ากว่า
- **รอบ 452:** 🎯 **ลำกล้องเล็งเข้ากากบาทจริง (ผู้ใช้: "ลากเส้นตรงจากปลายกระบอก ปลายเส้นต้องอยู่กลางกากบาท")** — คำนวณตรง: ปากกระบอกอยู่ที่ M · เป้าอยู่บนแกนสายตาที่ `ZERO_DIST=50` ม. → ทิศลำกล้อง `d=normalize(เป้า−M)` แปลงกลับเป็น Euler ได้ `GUN_ROT[.002,.003,.09]` (ของเดิมหันเข้าใน .17 = 9.7° ชี้ออกนอกแนวกระสุนไปไกล) · **การเอียงให้เห็นตัวปืนย้ายไปพึ่ง roll + ตำแหน่ง x แทน**
  - **⚖️ กฎถาวรที่จดไว้ในโค้ด:** ห้ามเพิ่ม pitch/yaw ให้กลุ่มปืนเพื่อความสวยอีก — เพิ่มเมื่อไหร่ = ปืนเล็งผิดทางทันที (roll ไม่กระทบทิศลำกล้อง ใช้ได้)
  - **ยืนยัน browser:** ฉายเส้นจากปากกระบอกตามแกนลำกล้อง → 1 ม.(0.056,−0.074) · 5 ม.(0.016,−0.021) · **50 ม.(0.000, 0.000) = กลางกากบาทเป๊ะ** ทั้ง R93 และไรเฟิล ✓ ปากกระบอกยังต่ำ-ขวาของกากบาท (0.125,−0.165) ✓ อ่านพิกเซลจริง: ช่องกากบาทโล่ง ปืนไม่บัง ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.439` · SW v165) — เก่ากว่า
- **รอบ 451:** 🎥 **ดึงปืนเข้ามาใกล้ตัว + ปากกระบอกต่ำกว่าศูนย์เล็ง (ผู้ใช้สั่ง)** — ต้นตอ 2 อย่าง: ① **near plane กล้องหลัก 0.1 ม.** บล็อกไม่ให้ดึงปืนเข้ามา (รอบ 450 ติดกำแพงนี้) → ทำ **view model pass** ปืนอยู่ `vmScene`+`vmCam` near .01 วาดทับฉาก (`renderViewModel()` เรียกหลัง `renderer.render`) ② **จุดหมุนโมเดล R93 อยู่ต่ำกว่าลำกล้อง 0.28** ปากกระบอกจึงลอยเหนือกากบาท → `alignGunMuzzle()` เลื่อนทุกโมเดลให้แกนลำกล้องมาที่ `MUZZLE_Y=.012` (ไฟ/ควันปากลำกล้องเลยไปโผล่ตรงปากกระบอกจริงด้วย) · ค่าใหม่ `GUN_POS[.13,−.10,−.44] · SCALE .66` (เข้ามา 12% ใหญ่ขึ้น = เห็นราว 1.2 เท่า)
  - **ยืนยัน browser:** ปากกระบอก R93 **NDC (0.069, −0.112) = ต่ำกว่ากากบาทเขียว** ✓ ไรเฟิล (0.109,−0.243) ✓ ไฟปากลำกล้องทับปากกระบอกพอดี (0.066,−0.102) ✓ ท้ายปืนอยู่ที่ 0.066 ม. (ทะลุ near เดิมแล้วแต่ไม่โดนตัด) ✓ อ่านพิกเซลจริง: จุดปากกระบอกเป็นสีปืน พื้นหลังเมื่อซ่อนปืน ✓ ADS โมเดลคืนตำแหน่งเดิมเป๊ะ (ค่า ADS_POS เดิมยังตรง) ✓ ยิง 10→9 + ควัน 4 ก้อนห่างตา ~1.0 ม. ✓ ไม่มี error
  - **⚠️ จดไว้:** ปืนอยู่คนละ scene แล้ว → โค้ดที่อ่านพิกัดโลกของปืนต้องผ่าน `vmToWorld()` (ควัน/ปลอกกระสุนแก้แล้ว) · `attachBoltHandle` เดิมวัดกรอบด้วย `matrixWorld` → แก้เป็นพิกัดโมเดลเอง ไม่งั้นคันรั้งไปโผล่ใต้ปืน
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.438` · SW v165) — เก่ากว่า
- **รอบ 450:** 🎯 **ปืนลู่เข้าหาจุดเล็ง + ดึงเข้ามาประทับไหล่ (ผู้ใช้เทียบภาพ CoD: "ของเค้าวางปืนเป็นมุมที่เล็งจากจุดเล็งได้ ของเราจุดเล็งโคตรห่าง")** — ⚖️ **กฎใหม่ที่ใช้ตัดสินท่าปืนต่อจากนี้: ปากกระบอกต้อง "ลู่เข้าหาจุดเล็ง" ไม่ใช่ชี้ออกนอกทาง** (ปืนอยู่ต่ำกว่าตา+อยู่ขวา → ลำกล้องต้องเงยขึ้นเล็กน้อย + หันเข้าในเล็กน้อย จึงจะชี้ไปจุดเดียวกับที่กระสุนไป) · `GUN_POS[.14,−.11,−.50] · GUN_ROT[.09,.17,.09] · SCALE .62`
  - **⚠️ ทางที่ผิดที่เพิ่งลองแล้วผู้ใช้ทัก:** กดปากกระบอกลง 12.6° ตามภาพอ้างอิงแบบตรงตัว → ยิ่งชี้ออกห่างจุดเล็ง (0.40) ผิดหลักการเล็ง
  - **ยืนยัน browser:** ปากกระบอกห่างจุดเล็ง **0.40 → 0.15** (R93) · 0.19 (ไรเฟิล) · ส่องกล้อง 0.12 (x=0.00 ทุกจุด) · **ท้ายปืน 0.21 → 0.13 ม. (ระดับประทับไหล่)** ไม่โดน near plane (0.1) ตัด ✓ ไม่มี error
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.437` · SW v164) — อ่านก่อน
- **รอบ 449:** 🔊💨🫁 **เสียงลูกเลื่อน 2 จังหวะ + ควันปากลำกล้อง + เหนื่อยตอนวิ่งนาน (ผู้ใช้สั่งต่อยอด 3 ข้อ)** — ① `Snd.boltPull` ("แชะ" ยิงที่ 16% ของรอบ = ตอนเริ่มถอย) / `Snd.boltPush` ("คลิก" ที่ 70% = ตอนล็อก) **ตรงจังหวะกับแอนิเมชันคันรั้ง** (เดิมมีเสียงเดียวเล่นตอนเริ่ม ไม่ตรงภาพ) ② **`muzzleSmoke()`** ควัน 4 ก้อน (R93) / 2 ก้อน (ไรเฟิล) ลอยขึ้นตามทิศเล็ง บานออกแล้วจางหาย — เพิ่ม fx kind ใหม่ `'smoke'` ③ **วิ่งนาน = เหนื่อย** `fatigue` เริ่มที่ 2.6 วิ · เต็มที่ 7 วิ · จอโยกตามจังหวะหายใจ + เสียงหายใจแรง (`Snd.pant`) · หยุดพัก 5 วิ ฟื้นเต็ม (ฟื้นเร็วกว่าสะสม 1.7 เท่า ไม่ทรมานเด็ก)
  - **ยืนยัน browser:** ยิง → ควัน 0→4 ก้อน ✓ เดินเกม 1.5 วิ → จางหมด 0 ก้อน (ไม่ค้าง) ✓ วิ่ง 3/4/5/6/7 วิ → เหนื่อย 0.10/0.36/0.62/0.87/1.0 ✓ หยุดพัก 5 วิ → 0 ✓ ไม่มี error
  - **⚠️ กับดักตอนวัดผล (จดเพิ่ม):** fx อายุตาม **เฟรมที่เดิน** (`f.t+=dt`) ไม่ใช่เวลาจริง → เทสต์ต้อง `step(1/60,90)` ไม่ใช่ `await 1.5s`
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.436` · SW v163) — อ่านก่อน
- **รอบ 448:** 🎯 **ฟีลสไนเปอร์แบบ SV-98 ครบ 4 ข้อ (ผู้ใช้สั่ง)** — ① **จังหวะชักลูกเลื่อนไวขึ้น** (ยกคันรั้งที่ 0.16s แทน 0.3s · กระชากแรง · ค้างตอนถอยสุด) → ไทม์ไลน์เวลาจริง: 0.16s ยก 45° → 0.31s 66°+ถอย 7.8 ซม. → **0.46s ถอยสุด 18.5 ซม.+ปลอกดีด** → 0.78s ดันกลับ → 1.09s ล็อกเสร็จ ② **แรงถอย** `REC_R93 .052→.088` + สั่นจอ (`shake+.34`) + ปืนกระชาก ×1.25 (วัดได้ pitch 0.080) ③ **เสียงยิงก้องไกล** — หางสะท้อน 4 ชั้น (ตึกใกล้ .13s → ตึกไกล .34s → ทุ่งกว้าง .62s → หางสุดท้าย 1.05s) ยิ่งชั้นหลังยิ่งเบา-ทึบ ④ **ท่าลดปืนตอนวิ่ง** (`sprintT` · `SPRINT_POS/ROT`): วิ่ง=ปืนก้มลงข้างตัว+โยกตามจังหวะ · **ยิง/เล็ง = ยกกลับทันที** (`sprintHold` 520ms หลังยิง)
  - **ยืนยัน browser:** วิ่ง → sprintT=1 ✓ ยิงระหว่างวิ่ง → 0 ทันที ✓ หยุดวิ่ง → 0 ✓ วิ่ง+ส่องกล้อง → ไม่ลดปืน (adsT=1.00) ✓ ไม่มี error
  - **⚠️ กับดักตอนวัดผล:** `_t.step()` ส่ง `performance.now()` เป็นเวลาจริงเสมอ → แอนิเมชันที่อิงนาฬิกา (bolt/ADS) **วัดด้วยการนับเฟรมไม่ได้** ต้อง `await setTimeout` แล้วค่อยอ่านค่า
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.435` · SW v162) — อ่านก่อน
- **รอบ 447:** 🔩 **แอนิเมชันชักลูกเลื่อน R93 แบบ SV-98 + ปลอกกระสุนดีด (ผู้ใช้อ้างอิงคลิป Delta Force)** — โมเดล `.glb` ใหม่เป็นก้อนเดียวไม่มีชิ้นคันรั้ง → **สร้างคันรั้งเสริมเอง** วางจากกรอบโมเดล (ขวาของโครงปืน ค่อนไปทางท้าย · `attachBoltHandle`) ใช้ได้กับปืนโมเดลไหนก็ได้ · **ลำดับ (`tickBolt`)**: เอียงปืนเข้าหาตัว → ยกคันรั้ง → ดึงถอยหลัง → ปลอกดีด → ดันกลับ → กดคันรั้งลง → คืนท่า · ปลอกกระสุนใช้ระบบ `fx kind:'bit'` เดิม (พุ่งขวา-บน + แรงโน้มถ่วง + ตกค้างบนพื้น)
  - **ยืนยัน browser (ไทม์ไลน์จริง):** 0.3s ยก 14° → 0.4s 41° → 0.5s 66°+เริ่มถอย → 0.7s ถอย 14.7 ซม. → **0.8s ถอยสุด 18.7 ซม. + 🟡 ปลอกดีด** → 0.9–1.1s ดันกลับ → 1.2s กดคันรั้งลง 39°→0 ครบรอบพอดีกับจังหวะยิง (1.2 วิ) ✓ ไม่มี error
  - **⚠️ กับดักตอนเทสต์:** R93 เป็น bolt-action มีธง `firedThisPress` → เรียก `_t.fire()` ซ้ำจะไม่ออกกระสุน ต้อง `dispatchEvent(new MouseEvent('mouseup'))` ก่อนทุกนัด · และ `swapWeapon()` เป็น **toggle** (ใส่ชื่อปืนไปไม่มีผล) ต้องวนจนกว่า `_t.weapon==='r93'`
### 📌 สรุปสถานะล่าสุด (21 ก.ค. · deploy `.434` · SW v161) — อ่านก่อน
- **รอบ 446:** ❌ **ถอด "มือซ้ายประคองลำกล้อง" ออกทั้งหมด (ผู้ใช้: "เอาสิ่งที่อยู่ใต้ปืนออก ไม่มีประโยชน์")** — ทำมา 2 รอบ (443 ท่อนแขนยักษ์ → 444 เหลือถุงมือ) ผู้ใช้ยังอ่านเป็น **ก้อนเขียวใต้ปืน** ไม่ใช่มือ → ลบ `buildSupportHand`/`attachSupportHand` ทิ้งหมด · โมเดลปืนจริงมีด้ามจับ/การ์ดมือครบอยู่แล้ว ปล่อยให้เห็นตัวปืนล้วนๆ สะอาดกว่า
  - **⚠️ จดเตือน session หน้า (อยู่ในโค้ดตรงจุดที่ลบด้วย):** ถ้าจะทำมืออีก **ห้ามประกอบจากกล่อง/ทรงกระบอก** — ต้องเป็นโมเดล `.glb` มือที่ rig มาพร้อมปืนแบบเกมจริงเท่านั้น ไม่งั้นผลลัพธ์วนกลับมาที่เดิม
  - **ยืนยัน browser:** view model เหลือ Sprite(ไฟปากลำกล้อง) + Group(ตัวปืน) เท่านั้น · มือเหลือ 0 ชิ้น ✓ ยิงปกติ (10→9) ✓ ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.465` · SW v165) — อ่านก่อน
- **รอบ 477:** 🪟 **ตัวอักษรย้ายไปนั่งใน "บานหน้าต่าง" ของยานแม่ (ผู้ใช้สั่ง)** — เดิมแถวตัวอักษรห้อยลอยใต้ท้องยาน · ตอนนี้เป็น **แถวหน้าต่าง 8 บานตายตัว** (`WIN_N` · ขอบบาน+กระจก+ตัวอักษร บานละตัว) แนบลำหน้า · คำสั้นกว่า 8 → **บานที่เหลือปล่อยว่าง (กระจกเปล่า)** ตามที่สั่ง · `BOARD_Y 150 → 198`
  - **⚠️ ทำไมต้องสร้างบานเอง:** ยานแม่คือโมเดล Tripo **เมชเดียว 21,129 tris — หน้าต่างเป็นลายในเทกซ์เจอร์** ไม่มีวัตถุบานหน้าต่างให้เกาะ (traverse แล้วเจอ mesh เดียวจริง ๆ)
  - **⚠️ เพดานความสูงของแถว:** ยกสูงกว่านี้จะไปมุดใต้ **แผงคำ HUD (`#inv-word`)** กลางจอบน · จอเตี้ย 812×375 คับสุด (แผงจบที่ 66px) — ที่ 198 เหลือช่องว่าง **9px** ✓ (จอ 1280×720 เหลือ 43px)
  - **ยืนยัน browser:** เปลี่ยนคำ 4 รอบติด (candy/rain/big/walk) บานเติมตรงความยาวคำทุกครั้ง ส่วนที่เหลือว่าง ✓ · `msBoard` มีลูก 24 ชิ้นคงที่ (8 บาน × 3) ไม่รั่ว ✓ · ตัวอักษรติดไฟ/กะพริบตอนยิงยานลูกตกยังทำงาน (`down:true` ครบทุกตัว) ✓ ไม่มี error
  - ⚠️ **commit นี้กวาดงาน session คู่ขนานไปด้วย** (ไฟล์เดียวกัน): 🌙 บรรยากาศกลางคืน (ลม/จิ้งหรีด · ระบบย่องดับไฟ · ปุ่มไฟฉาย) — โหลด/เล่นผ่าน ไม่มี error แต่ยังไม่ได้ทดสอบตรง ๆ
### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.464` · SW v165) — เก่ากว่า
- **รอบ 476:** 🔫 **ไรเฟิล 3 อย่างรวดเดียว (ผู้ใช้สั่ง)** — ลงทั้งกระบอก 3% + **กดเฉพาะท้ายปืนลงอีก 3%** + ขยาย 2% → `rifle: {p:[.22,−0.386,−.95], r:[−0.459,.46,.09], s:1.169}` (R93 ไม่แตะ)
  - **📐 บทเรียนใช้ต่อได้:** "เลื่อนปืนลงเฉย ๆ" **ไม่ได้ลงเท่ากันทั้งกระบอก** — ท้ายปืนอยู่ใกล้ตากว่า จึงตกบนจอเร็วกว่าปลายลำกล้อง ~2.9 เท่า (วัดจริง: ปลาย −3.0 → ท้าย −8.8) · อยากได้ "ลงเท่ากัน" ต้องแก้ **y คู่กับ pitch** (แก้สมการ 2 ตัวแปรด้วย Newton 2 รอบ)
  - **🧰 วิธีวัดปลายทั้งสองข้าง (ใช้ซ้ำได้):** ฉายจุดยอดโมเดลทั้งหมดเป็น NDC แล้วเฉลี่ย y ของ 3% ซ้ายสุด (=ปลายลำกล้อง) กับ 3% ขวาสุด (=ท้ายปืน) — แม่นกว่า `gunSil()` ที่ให้แค่มุม/แนวกลาง
  - **ยืนยัน browser:** ปลายลำกล้อง 78.2% → **81.1%** · ท้ายปืน 83.8% → **89.4%** · s 1.169 ✓ · R93 คงเดิม (5.0° · yAtX0 −0.326) ✓ ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.465` · SW v165) — อ่านก่อน
- **รอบ 477:** 🌫️🔇👤 **กลางคืนครบเครื่อง — หมอกดึก · เสียงกลางคืน · ระบบย่อง** · ① **หมอกระดับพื้น** 10 แผ่นเกาะรอบตัวผู้เล่น (โผล่ตอน `nightK>.45`) ทำให้ลำไฟฉาย/ไฟถนนเห็นเป็นลำเด่นขึ้น ② **เสียง** ลมแผ่วลูปดังตาม `nightK` (`Snd.startNightAir`) + **จิ้งหรีด** ร้อง 3 พยางค์ทุก 1.4–4.2 วิ ③ **ระบบย่อง** — ปุ่ม 🔦 ใหม่ (โผล่เฉพาะตอนฟ้ามืด) ดับไฟฉายได้ · **ดับไฟ + ไม่ยิง 2.2 วิ = ย่อง** → ยานลูกเว้นช่วงยิงนานขึ้น 2.8 เท่า + ยิงจริงแค่ 35% ของครั้ง
  - **⚠️ ห้ามแก้ความมืดด้วยการเพิ่ม `fog`** — fog แน่นขึ้นแล้วยานแม่/ตัวอักษรจมหาย (เคยพลาดมาแล้ว) → ใช้แผ่นหมอก additive เกาะรอบตัวแทน แค่ 10 ชิ้นก็พอทั้งแมป
  - **⚠️ เสียงลมต้องหยุดตอนออกจากโลก** — `exitWorld` เรียก `Snd.stopNightAir()` คู่กับ `stopHum/stopRotor` ไม่งั้นเสียงค้างในแท็บ
  - **ยืนยัน browser:** กลางวัน หมอก 0 ชิ้น ปุ่ม 🔦 ซ่อน / กลางคืน หมอก 10 ชิ้น ปุ่มโผล่ ✓ · **กดดับไฟ → ความสว่างพื้นหน้าเรา 130 → 93 · ไฟฉาย 2.9 → 0 · ครบ 2.5 วิ ป้าย "👤 กำลังย่อง" ขึ้น + แบนเนอร์สอน · ยิง 1 นัด → เลิกย่องทันที · เปิดไฟกลับ → ไฟ 2.9 เหมือนเดิม** ✓ · เสียงลม gain กลางคืน .045 / กลางวัน 0 · วนกลางคืน-กลางวัน-กลางคืน 400 เฟรม ไม่มี error ✓ · ปุ่มแถวล่างไม่ทับกันทั้ง 1280×720 / 812×375 · แถบแชทเลื่อนพ้นปุ่ม 🔦 แล้ว ✓ · ป้ายย่องอยู่ในจอ ไม่ทับแถบคำศัพท์/แถบพลัง ✓
  - 🧪 hooks: `_t.flashOn(เซ็ตได้) / sneaking / mistInfo / torchShown / nightAirGain`


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.466` · SW v165) — อ่านก่อน
- **รอบ 478:** 🔫 **จูนไรเฟิลอีก 3 ค่า (ผู้ใช้สั่ง)** — ท้ายปืนลง 2% · ปลายกระบอกขึ้น 2% · ใหญ่อีก 3% → `rifle: {p:[.22,−0.375,−.95], r:[−0.407,.46,.09], s:1.204}` (R93 ไม่แตะ · 4.9° เท่าเดิม)
  - **ยืนยัน browser:** ปลายลำกล้อง 81.2% → **79.2%** · ท้ายปืน 89.9% → **91.8%** · s 1.204 ✓ ไม่มี error
  - 🪤 **กับดักที่เจอ 2 รอบติด (ระวังรอบหน้า):** เติมคอมเมนต์ประวัติเหนือบรรทัด `rifle:` แล้วเผลอทิ้ง `*/` ค้างกลางบล็อก → ไฟล์ทั้งไฟล์พังเงียบ ๆ (อาการเดียวคือ `InvasionWorld is not defined`) · แก้คอมเมนต์ใน TUNE ZONE เสร็จ **ต้องรีโหลด preview เช็ก `typeof InvasionWorld` ทุกครั้ง**



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.467` · SW v165) — อ่านก่อน
- **รอบ 479:** 🌪️🔭🏮 **พายุทราย · กล้องมองกลางคืน · แท่งไฟเรืองแสง** · ① **พายุทราย** โผล่เอง (ครั้งแรกที่ 1–2 นาที · อยู่ 32 วิ · เว้น 2.5–4.5 นาที) ฟ้าขุ่นสีทราย + มองไกลลดเหลือ 45% + ลมดังขึ้น + ม่านทรายใช้แผ่นหมอกชุดเดิม (ไม่สร้างของใหม่) ② **กล้องมองกลางคืน (NV)** — **ปลดล็อกเมื่อยิงเป้าฝึกโดนครบ 5 ครั้ง** (ต่อยอดระบบเป้ารอบ 473) · ดันแสง+ย้อมเขียว **เฉพาะพาสที่เรนเดอร์ภาพในเลนส์** แล้วคืนค่าทันที → ในวงเลนส์สว่างเขียว นอกวงยังมืดตามจริง ③ **แท่งไฟเรืองแสง** ปุ่ม 🏮 (โผล่เฉพาะตอนมืด) วางได้ 12 แท่ง มีตัวเลขคงเหลือบนปุ่ม · ครบ 12 แท่งเก่าสุดดับเอง
  - **⚠️ คืนค่าแสงหลังพาส NV ด้วย `applyNightLook(nightK)`** — ไม่ต้องจำค่าเก่าเอง (แหล่งความจริงเดียว กันลืมคืนทีละค่า)
  - **⚠️ พายุห้ามบังจนเล่นไม่ได้** — คุมหมอกไกลสุดไม่ต่ำกว่า ~208 ม. ตอนกลางคืน (วัดจริง) ยังเห็นทางเดิน/ยานลูกใกล้
  - **ยืนยัน browser:** พายุ: fog far **462→208** · near 38→25 · ฟ้า `#091124→#655443` · ม่านทราย opacity .10→.20 · จบพายุคืนค่าเป๊ะ (462/38) ✓ · NV: ยิงเป้า 0 ครั้ง = ล็อก · 7 ครั้ง = ปลดล็อก · ส่องกล้องแล้วขอบเลนส์ติดคลาส `nv` · **วัดพิกเซล: ในวงเลนส์ สว่าง 180 (เขียว 202) · นอกวง 36** ✓ · แท่งไฟ: วาง 3 → ป้ายเหลือ 9 · วางเกิน 12 → คงที่ 12 · กลางวันปุ่มซ่อน+แท่งหรี่ (.94→.32) ✓ · ปุ่มแถวล่าง 6 ปุ่มไม่ทับกันทั้ง 1280×720 / 812×375 · แถบแชทเลื่อนพ้นปุ่มสุดท้ายและไม่ล้นจอ ✓ ไม่มี error
  - 🧪 hooks: `_t.stormK / startStorm() / stormAt(เซ็ตได้) / fogNow / nvReady() / nvClass / dropGlowStick() / glowInfo`


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.468` · SW v165) — เก่ากว่า
- **รอบ 479 (จูนปืน · คนละรอบกับพายุทรายด้านล่าง เลขชนกันเพราะ 2 session):** 🔫 **ปลายกระบอกไรเฟิลขึ้น 3%** → `rifle: {p:[.22,−0.348,−.95], r:[−0.346,.46,.09], s:1.204}`
  - **ยืนยัน browser:** ปลายลำกล้อง 79.2% → **76.2%** · ท้ายปืนคงที่ **91.9%** · มุมเงาปืน 4.8° → 7.8° · R93 ไม่แตะ (5.2°) ✓ ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.469` · SW v165) — เก่ากว่า
- **รอบ 480:** 🔫 **ดึงปืนไรเฟิลถอยหลัง 10% (ผู้ใช้สั่ง)** → `rifle: {p:[.296,−0.312,−0.815], r:[−0.346,.46,.09], s:0.946}`
  - **📐 บทเรียน (สำคัญ ใช้ต่อรอบหน้า):** "ถอยหลัง" ต้องเลื่อนตาม **แนวลำกล้องของปืนเอง** (วัดทิศจากจุดยอดจริง ท้าย→ปาก) ไม่ใช่แค่ลด z · และต้อง **หด scale ชดเชยพร้อมกัน** เพราะถอยแล้วปืนเข้าใกล้ตา ภาพจะโตขึ้นเอง — ถ้าไม่ชดเชยจะได้ "ปืนโตขึ้น" แทน "ปืนถอย" (ลองแล้วเห็นชัด) · แก้ 2 ค่าคู่กันด้วย Newton (ระยะถอย d + s) 4 รอบลู่เข้า
  - **⚠️ ทางที่ลองแล้วไม่ได้ผล:** เลื่อน x/y เฉย ๆ ให้ภาพ "ไถลไปตามแนวปืน" — ไม่ได้ เพราะท้ายปืนอยู่ใกล้ตากว่ามาก ภาพจะยืด (len 1.79 → 2.01) ไม่ใช่การเลื่อนทั้งก้อน
  - **ยืนยัน browser:** ปากกระบอก x **49.2% → 52.9%** ของจอ (= 10% ของความยาวปืนบนจอ) · ยังอยู่บนแนวปืนเดิม (y 76.3 → 77.0) · ขนาดบนจอเท่าเดิม (len 1.785 → 1.79) · R93 ไม่แตะ (5.0°) ✓ ยิงได้ปกติ ไม่มี error


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.470` · SW v165) — เก่ากว่า
- **รอบ 481:** 🔫 **ขยับปืนไรเฟิลลงทั้งกระบอก 3%** → `rifle: {p:[.295,−0.342,−0.815], r:[−0.387,.46,.09], s:0.946}` · ปลายลำกล้อง 77.1% → **80.0%** · ท้ายปืน 92.2% → **95.1%** · แนวนอนคงที่ (x 52.9%) · R93 ไม่แตะ ✓ ไม่มี error
  - 💡 **สูตรจูนที่ใช้ซ้ำได้ทุกรอบ (รวมไว้ที่นี่):** วัดปลาย 2 ข้างจากจุดยอดโมเดลจริง (3% ซ้ายสุด/ขวาสุดของเงาบนจอ) แล้วแก้ **y คู่กับ pitch** ด้วย Newton 2 ตัวแปร — "เลื่อน y เฉย ๆ" ท้ายปืนจะตกเร็วกว่าปลายลำกล้อง ~3 เท่า (perspective)


## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.471` · SW v165) — เก่ากว่า
- **รอบ 482:** 🔫 **หมุนไรเฟิลรอบแกนตั้งกลางปืน 20° (ปากกระบอกไปขวา · ท้ายปืนมาซ้าย)** → `rifle: {p:[0.282,−0.339,−0.812], r:[−0.348,0.134,−0.041], s:0.946}`
  - **📐 บทเรียนใช้ต่อ:** ห้ามบวก `yaw` ตรง ๆ — Euler เรียง XYZ (pitch มาก่อน) แกนหมุนจะเอียงตาม pitch ไม่ใช่แกนตั้งของจอ · ต้องคูณ `T(C)·Ry(a)·T(−C)` ทับเมทริกซ์เดิม (C = จุดศูนย์กลางมวลโมเดลใน view space) แล้ว decompose เป็น Euler ใหม่ → ค่า p/r เปลี่ยนพร้อมกันทั้งชุด
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** ปากกระบอก x **53.5% → 57.2%** · ท้ายปืน **98.2% → 88.0%** · ศูนย์กลางปืนอยู่ที่เดิม (0.276,−0.353,−0.846) · เงาปืนหดตามการหมุนจริง (len 1.69→1.26 · deg 6.8→14.4) · R93 ไม่แตะ (4.9°) · ยิงได้ ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.472` · SW v165) — เก่ากว่า
- **รอบ 483:** 🔫 **ไรเฟิลใหญ่ขึ้น 10% + เงยปากกระบอกอีก 10°** → `rifle: {p:[0.291,−0.351,−0.807], r:[−0.151,0.143,−0.078], s:1.041}`
  - **📐 บทเรียนใช้ต่อ:** ปืนถูก yaw ไว้แล้ว (รอบ 482) → "เงยปากกระบอก" ต้องหมุนรอบ **แกนนอนที่ตั้งฉากกับแนวลำกล้อง** `u=(dz,0,−dx)` ไม่ใช่แกน X ของจอ (หมุนรอบแกนจอได้แค่ 9.0° จาก 10°) · ขยายขนาดใช้ `S(k)` รอบจุดศูนย์กลางปืน ปืนจะ "โตอยู่กับที่" ไม่ไถลออกนอกจอเหมือนแก้ `s` เฉย ๆ
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** มุมลำกล้องจริง 3D **−14.76° → −4.76° (เงยขึ้น 10.00° เป๊ะ)** · ปากกระบอก y 79.1% → **74.5%** · s 0.946 → **1.041** (+10%) · ท้ายปืนเลื่อนลงพ้นขอบล่าง เห็นตัวปืน 93% → 84% (ปกติของท่า FPS) · R93 ไม่แตะ (4.8°) · ยิงได้ ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.473` · SW v165) — เก่ากว่า
- **รอบ 484:** 🔫 **กดปากกระบอกไรเฟิลลง 5°** → `rifle: {p:[0.296,−0.347,−0.808], r:[−0.254,0.139,−0.058], s:1.041}` (ใช้แกน u เดิมของรอบ 483 · ขนาดไม่แตะ)
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** มุมลำกล้องจริง 3D **−4.76° → −9.75° (ลง 4.99°)** · ปากกระบอก y 74.3% → **76.7%** · ท้ายปืนกลับเข้าเฟรม (เห็นตัวปืน 84% → 87–89%) · R93 ไม่แตะ (4.7°) · ยิงได้ ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.474` · SW v165) — เก่ากว่า
- **รอบ 485:** 🔫 **ไรเฟิลใหญ่ขึ้นอีก 10%** → `rifle: {p:[0.295,−0.346,−0.804], r:[−0.254,0.139,−0.058], s:1.145}` (ขยายรอบจุดศูนย์กลางปืน มุมไม่แตะ)
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** s 1.041 → **1.145** · ปากกระบอกอยู่จุดเดิม (57.1%,76.9% → 56.7%,76.5%) · มุมลำกล้อง −9.7° คงที่ · ท้ายปืนยาวพ้นขอบมากขึ้น (เห็นตัวปืน 89% → 84%) · R93 ไม่แตะ (4.9°) · ยิงได้ ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.475` · SW v165) — เก่ากว่า
- **รอบ 486:** 🔫 **ดึงไรเฟิลถอยหลัง 10% ให้พานท้ายพ้นขอบจอ (ผู้ใช้: "ปืนดูลอย เพราะไม่มีมือจับ")** → `rifle: {p:[0.312,−0.330,−0.707], r:[−0.254,0.139,−0.058], s:1.014}`
  - **🪤 กับดักที่ควรจำ:** อย่าใช้ `gunSil().len` คุมขนาดตอนถอยปืน — มันวัดเฉพาะจุดที่ **อยู่ในเฟรม** พอท้ายปืนหลุดขอบ len สั้นลงเอง ลูปชดเชยจะขยายปืนไม่หยุด (s พุ่ง 1.38 · ท้ายปืนไป 304% ของจอ) → ชดเชยด้วย **อัตราส่วนระยะลึกของจุดศูนย์กลาง** (s×depth₂/depth₁) แทน
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** ปากกระบอกไถลตามแนวปืน 56.6%,76.6% → **58.5%,78.3%** · ท้ายปืน 106% → **116%** (พ้นขอบ) · เห็นตัวปืน 86% → **80%** · ขนาดบนจอเท่าเดิม (s 1.145→1.014 ชดเชยระยะ) · มุมลำกล้อง −9.5° คงที่ · R93 ไม่แตะ (5.2°) · ยิง 2 นัดผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.476` · SW v165) — เก่ากว่า
- **รอบ 487:** 🎯 **เฉพาะ R93 (สไนเปอร์): ใหญ่ขึ้น 10% + เงยปากกระบอก 5°** → `r93: {p:[0.209,−0.124,−0.964], r:[−0.558,0.008,0.085], s:1.485}` (ไรเฟิลไม่แตะ)
  - **⚠️ วัด R93 ด้วยการฉายลงจอไม่ได้** — พานท้ายอยู่ **หลังระนาบกล้อง** (z +0.14) ค่าที่ฉายเพี้ยนหลักพัน% (ปากกระบอกโชว์ −1688%) → ต้องหาแนวลำกล้องด้วย **PCA 3 มิติของจุดยอด** แล้วค่อยฉายเฉพาะปลายที่อยู่หน้ากล้อง
  - **⚠️ วัดผลต้องทำก่อนยิง/ก่อนส่องกล้อง** — `fire()`/`setScoped()` ใส่ recoil+ADS ทับ `gunGrp` ชั่วคราว อ่านค่าตอนนั้นจะเพี้ยน (เคยอ่านได้ −2.09° ทั้งที่จริง −4.16°)
  - **ยืนยัน browser (โหลดจากไฟล์จริง ก่อนยิง):** มุมลำกล้อง 3D **−9.16° → −4.16° (เงย 5.00° เป๊ะ)** · ปากกระบอก 55.0%,77.7% → **54.4%,72.7%** · s 1.35 → **1.485** (+10%) · เห็นตัวปืน 71% → 70% · ยิง+ส่องกล้อง+เลิกส่องผ่าน ไม่มี error · ไรเฟิลไม่แตะ (23°)



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.477` · SW v165) — เก่ากว่า
- **รอบ 488:** 🎯 **ยกจุดเล็งขึ้นมาอยู่บนแนวลำกล้อง R93 (ผู้ใช้ขีดเส้นแดง)** → `const AIM_OFF=[0,-.274];` (จาก −0.46) = จุดเล็ง **73% → 63.7% ของจอ**
  - **วิธีหาเลข (ใช้ซ้ำได้):** ค่าที่ถูกคือ `gunSil().yAtX0` ของกระบอกนั้น = จุดที่แนวลำกล้องตัดแกนกลางจอ (R93 หลังรอบ 487 = −0.274) ไม่ต้องเดาจากภาพ
  - **⚠️ AIM_OFF เป็นค่ากลางใช้ร่วมทุกกระบอก** (ไม่ได้แยกตามปืน) — เช็กก่อนเสมอว่าอีกกระบอกยังพอดี: ไรเฟิลตัดแกนกลางที่ −0.250 ห่างแค่ **1.2% ของจอ** จึงใช้ค่าเดียวกันได้
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** กากบาทวาดจริงที่ **63.7%** ตรงกับ AIM_OFF · แนวลำกล้อง R93 −0.273 vs จุดเล็ง −0.274 (**อยู่บนเส้นแล้ว**) · **กระสุนไปตรงจุดเล็งทั้ง 2 กระบอก** (hitNDC = [0,−0.274]) · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.478` · SW v165) — เก่ากว่า
- **รอบ 489:** ↩️ **ย้อนคืนรอบ 488 ทั้งหมด** → `const AIM_OFF=[0,-.46];` (จุดเล็งกลับไป 73% ของจอเหมือนเดิม)
  - **❌ ความผิดพลาดรอบ 488 (ห้ามซ้ำ):** ผู้ใช้สั่ง "เฉพาะ R93" แต่ไปแก้ `AIM_OFF` ซึ่งเป็น **ค่ากลางใช้ร่วมทุกกระบอก** → **การเล็งของไรเฟิลเสียไปด้วย** · ตอนนั้นประเมินเองว่า "ไรเฟิลห่างแค่ 1.2% น่าจะโอเค" = เดาแทนผู้ใช้ ทั้งที่คำสั่งจำกัดขอบเขตไว้ชัด
  - **🏆 กฎที่ได้:** คำสั่งระบุ "เฉพาะ X" → **ห้ามแตะค่าที่ Y ใช้ร่วม** ไม่ว่าจะคิดว่าผลกระทบน้อยแค่ไหน · ถ้าจำเป็นต้องแตะของกลาง ให้ **แยกค่าตาม weapon** หรือถามก่อน
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** จุดเล็งกลับมา 73% (กากบาทวาดจริงที่ 73%) · กระสุนไป [0,−0.46] ทั้ง 2 กระบอก · ท่าถือไรเฟิลคงเดิมของรอบ 486 · R93 ยังเป็นค่ารอบ 487 (ใหญ่ขึ้น 10% + เงย 5° ซึ่งเป็นงานเฉพาะ R93 จริง ไม่ต้องย้อน)
  - **▶️ ค้างต่อ:** จูนจุดเล็งของ **R93 อย่างเดียว** ให้ตรงแนวลำกล้อง (−0.274) โดยไม่กระทบไรเฟิล → ต้องทำ AIM_OFF แยกตามกระบอกก่อน



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.479` · SW v165) — เก่ากว่า
- **รอบ 490:** 🎯 **จุดเล็งแยกตามกระบอก + ย้ายจุดเล็ง R93 ไปจุดที่ผู้ใช้ขีดเส้นตัด** → `const AIM_BY_GUN={ r93:[-0.154,-0.178] };` (R93 = **42.3%, 58.9% ของจอ**) · กระบอกที่ไม่มีในตาราง → ใช้ `AIM_OFF` ค่ากลางเหมือนเดิมเป๊ะ (ไรเฟิล 50%,73% ไม่ขยับ)
  - **โครงสร้างใหม่:** `aimOffNow()` เลือก `AIM_BY_GUN[weapon] || AIM_OFF` · `setAimOff()` (= `GunLab.aim`) เขียนลง **ช่องของกระบอกที่ถืออยู่** และคืนฟิลด์ `shared:true/false` บอกว่ากำลังแตะค่ากลางอยู่ไหม → กันพลาดซ้ำแบบรอบ 488
  - **วิธีอ่านพิกัดจากภาพที่ผู้ใช้ขีด (ใช้ซ้ำได้):** ภาพผู้ใช้มัก **ครอป/ซูม** → ห้ามแปลง px ตรง ๆ · ให้ resize preview เป็น **อัตราส่วนเดียวกับภาพ** แล้วใช้ของที่รู้พิกัดจริง 2 อย่างเป็นไม้บรรทัด (กากบาท + ยอดปืน/ปากกระบอก) แล้วเทียบสัดส่วน
  - **ยืนยัน browser (โหลดจากไฟล์จริง · 852×638):** R93 กากบาทวาดจริงที่ **42.3%,58.9%** · กระสุนไป [−0.154,−0.178] ตรงจุดเล็ง · **สลับไปไรเฟิล → กลับเป็น 50%,73% + กระสุน [0,−0.46] + ท่าถือรอบ 486 ครบ** · สลับกลับมา R93 ได้ค่าเดิม · ยิง+ส่องกล้อง+เลิกส่องผ่าน ไม่มี error
  - **⚠️ ค่า x ของ R93 มาจากการวัดภาพที่ครอบ (คลาดได้ ±3% ของความกว้างจอ)** — ถ้าผู้ใช้บอก "ซ้าย/ขวาอีกนิด" ปรับที่ `AIM_BY_GUN.r93[0]` ตัวเดียว (−0.02 ≈ ซ้าย 1% ของจอ)



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.480` · SW v165) — เก่ากว่า
- **รอบ 491:** 🎯 **เฉพาะ R93: เบนปากกระบอกไปขวา 5° (ท้ายปืนมาซ้าย)** → `r93: {p:[0.235,−0.125,−0.968], r:[−0.559,−0.066,0.039], s:1.485}` · หมุนรอบแกนตั้งผ่านจุดศูนย์กลางปืน −5° (สูตรเดียวกับไรเฟิลรอบ 482)
  - **ยืนยัน browser (โหลดจากไฟล์จริง ก่อนยิง):** ทิศลำกล้องแนวราบ **+4.41° → −0.58° (เบนขวา 5.0° เป๊ะ)** · มุมก้ม-เงยคงที่ −4.14° · ปากกระบอก x 55.7% → **58.9%** · จุดศูนย์กลางปืนอยู่ที่เดิม · **ไรเฟิลไม่ถูกแตะ** (ท่าถือ+จุดเล็ง [0,−0.46] เดิมครบ) · ยิง+ส่องกล้องผ่าน ไม่มี error
  - หมายเหตุ: จุดเล็ง R93 ยังเป็น [−0.154,−0.178] ตามรอบ 490 (ไม่ได้ขยับตามลำกล้อง — ถ้าอยากให้ตามด้วยต้องสั่ง)



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.481` · SW v165) — เก่ากว่า
- **รอบ 492:** 🎯 **เฉพาะ R93: เบนปากกระบอกไปขวาเพิ่มอีก 5°** → `r93: {p:[0.261,−0.126,−0.970], r:[−0.564,−0.140,−0.008], s:1.485}`
  - **ยืนยัน browser (โหลดจากไฟล์จริง ก่อนยิง):** แนวราบ **−0.58° → −5.60° (เบนขวา 5.02°)** · ปากกระบอก x 58.7% → **61.9%** · มุมก้ม-เงยคงที่ −4.15° · **ไรเฟิลไม่ถูกแตะ** (ท่าถือรอบ 486 + จุดเล็ง [0,−0.46]) · ยิง+ส่องกล้องผ่าน ไม่มี error
  - 👍 ผู้ใช้ยืนยันวิธีรอบ 491 ว่า "ทำถูกต้องแล้ว" → สูตรนี้ (หมุนรอบแกนตั้งผ่านจุดศูนย์กลาง + แก้เฉพาะกระบอกที่สั่ง) ใช้ต่อได้เลย



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.482` · SW v165) — เก่ากว่า
- **รอบ 493:** 🎯 **เฉพาะ R93: หันคืนซ้าย 3° + กดปลายกระบอกลง 3°** → `r93: {p:[0.240,−0.138,−0.980], r:[−0.613,−0.094,0.018], s:1.485}` (ทำ 2 จังหวะรอบจุดศูนย์กลางเดียวกัน: แกนตั้ง +3° แล้วแกนนอนตั้งฉากลำกล้อง −3°)
  - **ยืนยัน browser (โหลดจากไฟล์จริง ก่อนยิง):** แนวราบ **−5.60° → −2.58°** (ซ้าย 3.0°) · มุมก้ม **−4.15° → −7.14°** (ลง 3.0°) · ปากกระบอก 61.8%,72.9% → **59.9%,75.2%** · **ไรเฟิลไม่ถูกแตะ** (ท่าถือรอบ 486 + จุดเล็ง [0,−0.46]) · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.483` · SW v165) — เก่ากว่า
- **รอบ 494:** 🎯 **เฉพาะ R93: เบนปากกระบอกไปขวาเพิ่มอีก 2°** → `r93: {p:[0.253,−0.138,−0.981], r:[−0.615,−0.122,−0.002], s:1.485}`
  - **ยืนยัน browser (โหลดจากไฟล์จริง ก่อนยิง):** แนวราบ **−2.58° → −4.55°** (ขวา ~2.0°) · มุมก้มคงที่ −7.13° · ปากกระบอก x 59.9% → **61.1%** · **ไรเฟิลไม่ถูกแตะ** (ท่าถือรอบ 486 + จุดเล็ง [0,−0.46]) · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.484` · SW v165) — เก่ากว่า
- **รอบ 495:** 🎯 **เฉพาะ R93: ย้ายจุดเล็งไปจุดตัดเส้นแดงใหม่** → `AIM_BY_GUN={ r93:[-0.096,-0.069] }` = **45.2%, 53.4% ของจอ** (เดิม 42.3%,58.9%)
  - **✅ ภาพรอบนี้เป็นเฟรมเต็ม (เห็น HUD) วัดง่ายกว่าภาพครอป** — เทียบ "กากบาทในภาพ" กับ "กากบาทจริงในเกม" เป็นหมุด แล้วใช้ **ระยะต่าง (Δpx)** ไปบวกกับพิกัดจริง → ไม่ต้องเดา scale (Δ = +44,−39 px บน 1512×717)
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** กากบาท R93 วาดที่ (683,383) = 45.2%,53.4% · กระสุนไป [−0.096,−0.069] ตรงจุดเล็ง · `setAimOff` คืน `shared:false` (แตะเฉพาะช่อง R93) · **ไรเฟิลยัง 50%,73% + [0,−0.46] + ท่าถือรอบ 486 ครบ** · สลับไป-กลับค่าคืนถูก · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-22 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.485` · SW v165) — เก่ากว่า
- **รอบ 496:** 🎯 **เฉพาะ R93: ปรับปลายปืนขึ้น 3°** → `r93: {p:[0.256,−0.118,−0.971], r:[−0.562,−0.124,0.002], s:1.485}`
  - **ยืนยัน browser (โหลดจากไฟล์จริง ก่อนยิง):** มุมก้ม **−7.13° → −4.11°** (ขึ้น 3.0°) · ทิศแนวราบคงที่ −4.52° · ปากกระบอก y 75.1% → **72.3%** · **ไรเฟิลไม่ถูกแตะ** (ท่าถือรอบ 486 + จุดเล็ง [0,−0.46]) · จุดเล็ง R93 ยัง [−0.096,−0.069] · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-23 — จาก handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)

### 📌 สรุปสถานะล่าสุด (22 ก.ค. · deploy `.486` · SW v165) — เก่ากว่า
- **รอบ 497:** 🎯 **เฉพาะ R93: ย้ายจุดเล็งไปจุดตัดเส้นแดงใหม่ (หลังปรับปลายปืนขึ้นรอบ 496)** → `AIM_BY_GUN={ r93:[-0.016,-0.018] }` = **49.2%, 50.9% ของจอ** (เกือบกลางจอ · เดิม 45.2%,53.4%)
  - **ยืนยัน browser (โหลดจากไฟล์จริง · 1520×725):** กากบาทวาดที่ (748,369) ตรงเป้า · กระสุนไป [−0.016,−0.018] ตรงจุดเล็ง · `shared:false` (แตะเฉพาะช่อง R93) · **ไรเฟิลยัง 50%,73% + [0,−0.46] + ท่าถือรอบ 486** · สลับไป-กลับค่าคืนถูก · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 523:** 🎨💬 **ต่อยอด (แชทเดิม) — flash KSR โทนฟ้าพลังงาน + ทหารตะโกนชนิดปืน/สถานะรบ · deploy `.501`**
  - **①สี flash แยกตามปืน** `FLASH_COLOR={r93:0xffe0a0, rifle:0x7fe6ff}` — KSR-77 = ฟ้า cyan (เข้าธีมแถบเรืองแสง) · R93 = ส้ม-เหลืองเดิม · ยืนยัน render จริง flash KSR = `#7fe6ff` ตรงปากกระบอก
  - **②`tickSquadChatter(now)`** (เรียกใน tickSquad ต่อจาก tickSquadCalls) — ทหารตะโกนบทประจำปืน/ปลุกใจ (`CHAT_LINES.r93`/`.rifle`/`.any` · 60% ตามปืน 40% ทั่วไป) · ใช้ bubble+เสียง+`squadShout` ชุดเดียวกับเตือนทิศ · แชร์ `callAllAt` กันตะโกนซ้อน + `chatAllAt` (7s) คุมความถี่ · ยืนยันเดินเฟรมจริง (`_t.step`) ~10s ได้ทั้ง chatter ("ระวังตัวด้วยเพื่อน!") + เตือนทิศ อยู่ร่วมกันได้ ไม่รก
  - ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก · syntax OK · ปิด preview กันเสียงค้าง
- **รอบ 522:** 🪖🔫🔥 **ต่อยอด peer/KSR-77 (แชทเดิม) — squad ผสมปืน + ไฟปากลำกล้องโมเดล baked + ยืนยัน strip · deploy `.500`**
  - **①squad ผสม R93/KSR-77 ~50/50** — `makeSoldier(x,z,crouch,kind,weapon)` รับ weapon · kind 'c' เลือกไฟล์ผ่าน `bakedSoldierGlb(weapon)` (เปลี่ยนชื่อจาก `peerSoldierGlb` ใช้ร่วม peer+squad) · spawn สุ่ม `rnd(0,1)<0.5?'rifle':'r93'` (~invasion3d.js:6235,6238)
  - **②ไฟปากลำกล้อง** (หายตอนลบปืนโค้ดเก่ารอบ 521 · โมเดล baked ไม่มี flash ในตัว) — `MUZZLE_BY_WEAPON` + `makeSoldierFlash(weapon)` sprite แปะที่ปลายปืน · squad โชว์ตอน `s.flashUntil` (ยิง) · peer โชว์ตอน `p.shotUntil` · เปลี่ยนปืน reposition flash ใน setPeerWeapon
  - **③ยืนยัน strip ในเกมจริง** (เข้าโลกยานแม่ · `_t.fakePeer`/`_t.poseSoldier` · own renderer→readPixels→download→Read): **KSR-77 เดิน/วิ่งขาสลับเนียน ปืนแช่แข็งไม่หลุด · ไม่มีช่องเป้า** · **วัดปลายลำกล้องจริงจาก geometry** (grp-local · path fitInto จริงผ่าน fakePeer) → **KSR `[0.705,1.281,-0.449]` · R93 `[1.398,1.317,-0.520]`** flash ตรงปากทั้งคู่ · ปิด preview กันเสียง/peer ค้าง
  - ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก · syntax OK
- **รอบ 521:** 🪖🔫 **wire peer มุมมองที่3 ใช้โมเดล baked ถือปืนตามที่เพื่อนถือ (R93→soldier_c · KSR-77→soldier_c_KSR-77) + legOnly — เสร็จ deploy `.499`**
  - **①โมเดลใหม่ `img/models/soldier_c_KSR-77.glb`** (ผู้ใช้เจน Tripo ถือปืน KSR-77 ท่าเล็ง) ลดโพลีสูตรรอบ 519: 3.28MB→**934KB** · tris 80k→**38.6k** · tex 2K→1K jpeg · **20 ชิ้นแยก** (drop NORMAL→weld→simplify 0.45 per-primitive→resize 1024 jpeg→prune · สคริปต์ ESM ชั่วคราวใน cli dir ลบแล้ว · ต้นฉบับ backup ใน scratchpad) · **untracked → git add ตรง**
  - **②peer (invasion3d.js ~5254-5400):** เปลี่ยน foot peer จาก `soldier_b`+ปืนโค้ด(`attachPeerGun`/`peerRifle`) → `loadPeerSoldier(rig,weapon)` โหลด baked ตามปืน · `peerSoldierGlb(weapon)` แมป r93/rifle→ไฟล์ · `peerBody(kind,color,weapon)` รับ weapon · `buildPeer` ส่ง `p.weapon` · `onPeer` ตั้ง `p.weapon` ตั้งแต่สร้าง (กัน load ซ้ำ) · `setPeerWeapon` เปลี่ยนปืน=reload โมเดล · peerTick ตั้ง `p.anim.legOnly=true` + `mode=moved>0.4?'run':(moved>0.12?'walk':'idle')`
  - **③ลบ dead code 3 ฟังก์ชัน:** `peerRifle`/`attachPeerGun`/`peerInCover` (ปืนแยกแบบเก่า+จำลองเล็ง/ยิงต่อ peer ทุกเฟรม — ถูกแทนด้วยโมเดล baked หมด) · ตัดวน `fighters` ต่อ peer ทุกเฟรม (legOnly ไม่ใช้ lookUp/fireT)
  - **④ยืนยัน headless (แม่นกว่า strip สำหรับความเสี่ยงขารวมข้าง):** จำลอง autoRigSoldier bin ขา → **KSR-77 = 4/4 leg joints ขาสองข้างครบ เหมือน soldier_c เป๊ะ** (legUL:2 LL:2 UR:1 LR:1) → ก้าวออกไม่นิ่ง · legCx Δ0.033 · syntax OK · ไม่แตะ FP/ค่าปืนล็อก · **ยังไม่ได้ render strip ภาพจริงในเกม (peer ต้องมี 2 client)** — ถ้าอยากเห็นภาพขอผู้ใช้สั่ง
- **รอบ 520:** 🏷️ **เปลี่ยนชื่อโชว์ปืน rifle → `KSR-77 จู่โจม`** (ผู้ใช้เลือกจาก 4 ตัวเลือก · เดิม 'ไรเฟิลจู่โจม' กลางไป) — แก้จุดเดียว `WEAPONS.rifle.name` (invasion3d.js:76) · **key ยังเป็น `'rifle'` คงค่าปืนล็อกทั้งหมด** · โชว์จริงที่ toast สลับปืน (invasion3d.js:3372) · deploy `.498`
- **รอบ 519:** 🪖🔫 **ทหารมุมมองที่3 ถือ R93 อบมาในตัว "วิ่งขยับเฉพาะขา" (soldier_c.glb) — เสร็จ+ผู้ใช้อนุมัติ+deploy `.497`**
  - **①ลดโพลี** `img/models/soldier_c.glb` 80.8k→36.3k tris · tex 2K→1K · 3.1MB→**882KB** (สคริปต์ strip: ตัด NORMAL→weld→simplify ratio 0.45 per-primitive คง 23 ชิ้นแยก→resize 1024→prune · เครื่องมือใน `~/bin/node/.../@gltf-transform/cli/`) · ต้นฉบับ 3MB backup ใน scratchpad · **untracked ต้อง git add ตรง** (deploy อัปให้)
  - **②แก้ `autoRigSoldier` (~invasion3d.js:2200)** — R93 ยื่นซ้ายดัน global cx เพี้ยน → เท้าซ้าย bin ไปขาขวา ขารวมข้างเดียว(หุ่นก้าวไม่ออก) · แก้: หา **legCx=กึ่งกลางกลุ่มชิ้นระดับขา** (ny<0.42 · เท้าซ้าย/ขวาสมมาตร) แยกซ้าย-ขวาจากแกนนี้ · ท่อนบนหา nn จาก UPPER 7 ข้อ (ไม่รวมขา) · backward-safe (โมเดลไม่มีปืนยื่น→legCx≈cx) · ผล: **ขาแยกครบ 4 ข้อต่อ** legUL:2/legLL:1/legUR:2/legLR:1
  - **③โหมด `legOnly` ใน `poseSoldier` (~:2286)** — `s.legOnly=(kind==='c')` · ขยับเฉพาะขา (run:amp0.55 knee0.9 freq1.5× · walk:0.55/0.7/1× · idle:ขาตรง) `return` ก่อนแตะ torso/head/arms/lookUp/fireT → **ท่อนบน+R93 แช่แข็งคงท่าเล็งที่อบมา ปืนไม่หลุด** · ⚠️amp 0.85 เดิมทำ "เป้า"โหว่ตอนก้าวกว้าง (ผู้ใช้เจอ)→ลด 0.55 ปิดสนิท
  - **④squad→kind='c'** (spawn ~:6265-6268 · ไม่แตะ soldier_a/b · loader `soldier_'+kind`) · **⚠️ squad ยืนกับที่** (loop ไม่ขยับ grp.position) → ในเกมเห็น "ยืนถือ R93 ท่าเล็ง" ขาวิ่งพร้อมทำงานเมื่อ**เคลื่อนที่**
  - **⑤ยืนยัน strip** (mini-renderer เอง + readPixels→download→Read · screenshot ค้างในโลก3D): R93 นิ่งทุกเฟรม · ขาสลับเนียน · เป้าปิด · ไม่มี console error
  - **▶️ งานต่อ (ผู้ใช้กำลังเจนโมเดลตัวที่2 ถือปืน rifle):** ①wire **peer มุมมองที่3** (ที่ผู้เล่นอื่นเห็น) ให้เลือกโมเดลตาม**ปืนที่ถือ** — R93→soldier_c · rifle→โมเดลใหม่ · ตั้ง `legOnly`+mode run เมื่อ peer เคลื่อนที่ (จุด peer ~:5345 `moved>0.12?'walk'`) · ปัจจุบัน peer ยังใช้ soldier_b+attachPeerGun (~:5255) ②**มุมมองที่1 คงเดิม ค่าปืนล็อกห้ามแตะ** · ผู้ใช้ยืนยัน "ยังไม่เปิดทางการ" deploy ได้
- **รอบ 518:** 🧤➡️🪖 **มือมุมมองที่ 1 (GLB) ทำเสร็จ+จูนแล้ว แต่ผู้ใช้สั่งพักไว้ → กลับเป็น "เห็นแค่ปืน" · แล้วเปลี่ยนโฟกัสเป็น "ท่าทหารมุมมองที่ 3"** (งานยังไม่จบ — ทำต่อ session ใหม่)
  - **มือ FP (พักไว้ ห้ามลบโค้ด):** โหลด `img/models/hand_grip.glb` (ผู้ใช้เจนเอง Tripo · หมัดกำ+แขนเสื้อ · แกนแขน=X หมัด−X) → mirror ทำมือซ้าย → วาง 2 จุด (ด้าม/การ์ดมือ) · **draw-on-top depthTest=false** กันจมปืน · ท่าแยกกระบอก `HAND_POSE{rifle,r93}` (เพราะโดน `GUN_SCALE` คูณต่างกัน) · ต่อท่อนแขน `FOREARM` ยื่นตกขอบจอ · **ผู้ใช้บอก "แขนที่วาดเองไม่โปร"** เลยจะไปเจน GLB แขนยาวเอง — แต่ตอนนี้ **สั่งพักมือ FP ทั้งหมด** · โค้ดอยู่ครบ (`buildArms/buildFist/loadHandModel/applyHandPose/fitArmsToWeapon/HAND_POSE/FOREARM/addForearm`) แค่ `buildGun` ตั้ง `gunArms.visible=false` + **ไม่เรียก `loadHandModel()`** → รื้อคืนแค่ visible=true + เรียก loadHandModel · ⛔ ไม่แตะค่าปืนล็อกเลย
  - **🎯 งานใหม่ (โฟกัสหลัก) = ท่า GLB ทหารมุมมองที่ 3 ให้สมจริง (วิ่ง/เดินถือปืน) ที่ผู้เล่นอื่นเห็น** — ผู้ใช้จะไป **เจน GLB ทหารที่ "ถือปืนมาในตัว" เลย** (ง่ายกว่าจัดแขนถือปืนแยก) แล้วคุยต่อ session ใหม่
  - **สำรวจแล้ว (พร้อมให้ session ใหม่):** `poseSoldier()` (invasion3d.js ~บรรทัด 2285) มี mode `walk/crouch/aim/idle` — **ยังไม่มี `run`** · ปัญหาท่า walk: ขาสวิงโอเคแต่ **แขนซ้ายแกว่งอิสระเหมือนเดินเปล่า ไม่ได้ประคองปืน** + ตัวตรงเกิน ไม่โน้ม · ทหาร rig ติดจริง (`_t.squad0` → `static:false, glb:true, 11 joints`) · peer (soldier_b.glb) ติดปืนผ่าน `attachPeerGun()` แขวนที่ torso (`peerRifle` .20,.40,-.26) · squad (soldier_a.glb) ปืนหายตอน rig (mesh ใต้ joint โดนถอด) · set mode ที่ peer=บรรทัด 5345 (`moved>0.12?'walk'`) / squad=5535
  - **🔧 tool debug (คงไว้):** เพิ่ม `_t.squad0` (คืน squad[0]) · เทคนิค render สตริปวงจรก้าว: freeze → ย้าย `s.grp` เข้าซีนเปล่า+พื้น → `poseSoldier(s, 1000+i*step)` หลายเฟรม → คืน grp (ดู `__cleanStrip` ที่ใช้รอบนี้)
  - **ทำต่อ session ใหม่:** ①รับ GLB ทหารถือปืนตัวใหม่ เสียบแทน soldier_a/b (หรือเพิ่ม) ②ปรับ `poseSoldier`: walk เนียนขึ้น (โน้มตัว/ก้าวธรรมชาติ) + เพิ่ม mode `run` (โน้มแรง ก้าวใหญ่/ถี่) ③ตั้ง run ตอน peer เคลื่อนเร็ว ④ยืนยันด้วย `__cleanStrip`
- **รอบ 517:** 🔧➕ **ต่อยอดรอบ 516 (แชทเดิม) — `tools/gunlab.js` +2 เครื่องมือ** — `diffLive('p')` เทียบ "ท่าที่ถืออยู่ตอนนี้" (สด) กับ preset โดยไม่ต้อง savePreset ก่อน (freeze อ่านท่าฐาน แล้วเรียก `_diffCore` ที่แยกออกจาก `diff` · ป้ายคอลัมน์ live/ชื่อ preset) · `exportProfile('c')`/`importProfile('c',json)` คัดลอก profile เป็น JSON ก้อนเดียวย้ายข้ามเครื่อง — export ไม่ใส่ชื่อ=รวมทุกอัน · import รับ string/object, profile เดี่ยว (มี key `guns`) หรือก้อนรวม (กระจายคืนตามชื่อ), JSON เสีย=คืน err ไม่ throw
  - **ยืนยัน browser (1280×720 · boot r93):** `node -c` ผ่าน · diffLive: นัดจ์ s1.6+yaw3 → ตารางโชว์ dScale −0.115, dYaw 2.98 (≈3°) ตรง · export ได้ json มี `guns` · del→import เดี่ยว/ก้อนคืนครบ + loadProfile ใช้ทั้ง 2 กระบอก held=r93 · JSON เสีย=err สวย · ค่าล็อกไม่ขยับ · ล้าง localStorage+reload ปิดเสียง · **ไม่แตะไฟล์เกม → ไม่บัมพ์/ไม่ deploy**
- **รอบ 516:** 🔧 **`tools/gunlab.js` +3 เครื่องมือลด token รอบจูน (คิวต่อยอด #5–7)** — `diff('a','b')` เทียบ 2 preset เป็นตารางเดียว (Δตำแหน่ง/Δขนาด/Δองศาลำกล้องจริง yaw+pitch/Δจุดเล็ง + `muzzleShiftPct` ปากกระบอกเลื่อนกี่%ของจอ) · `snapAim({fit:true})` กลับด้าน snapAim = ไล่ yaw/pitch รอบจุดศูนย์กลางจนแนวลำกล้องพาดจุดเล็งเดิม คืนบรรทัด GUN_VIEW (default ดูอย่างเดียว·คืนท่าเดิม · `apply:true` ค้างค่า) · `saveProfile/loadProfile` เก็บ/สลับ preset **ทุกกระบอกพร้อมกัน** เป็นชุดเดียว (+`profiles`/`delProfile`)
  - **ต้นตอที่ต้องระวัง:** `setGunPose` เขียนทับ `GUN_VIEW[weapon]` ในหน่วยความจำ (invasion3d.js:3109) → เครื่องมือที่แตะหลายกระบอกมี `_snapAll/_restoreAll` คืนค่า **ทุกกระบอกที่แตะ** กันค่าล็อกอีกกระบอกค้างเพี้ยน · fit look-only + diff คืนค่าให้ครบ
  - **ยืนยัน browser (1280×720 · boot r93):** `node -c` ผ่าน · diff ออกตารางครบ · **fit ลู่ 6 รอบ err=0** (ดูอย่างเดียว→ค่าล็อก r93/rifle กลับเป๊ะบิตต่อบิต incl r93 `[-0.562,-0.124,0.002]`) · fit apply:true ค้างจริง · saveProfile/loadProfile คืน **ทั้ง 2 กระบอกเป๊ะ** + คงกระบอกที่ถืออยู่ (r93) + เตือนค่าล็อก · profiles/delProfile ทำงาน · ล้าง localStorage+reload ปิดเสียง · **ไม่แตะไฟล์เกม → ไม่บัมพ์ version/ไม่ deploy**
- **รอบ 515:** 🔇 **ต่อยอด 513 (แชทเดิม) — boot เงียบขึ้น: ซ่อนบรรทัด 🗑️ (worktree ที่รวม main แล้ว) ตอน SessionStart** เหลือเฉพาะ ⚡ active + base/version ลด noise ทุกบูต · บรรทัด 🗑️ (พร้อมคำสั่งเก็บกวาด) โผล่เฉพาะตอน **เรียก `sh tools/check_parallel.sh` เอง (manual)** · กลไก: `report_worktrees()` รับ `$1=show_dead` · dispatch แยก `boot`(=0 เงียบ)/manual(=1 default) · `MODE` default=manual · **SessionStart hook (`~/.claude/settings.json`) ส่ง arg `boot`** · **ยืนยัน:** boot=⚡ecstatic ไม่มี 🗑️ · manual=⚡+🗑️2อัน · round 514ชน/515ว่าง (pre-commit/round ไม่กระทบ) · settings.json valid UTF-8 · สคริปต์เก่ารับ arg `boot`=ตกเข้า default เดิม (backward-safe) · ไม่แตะไฟล์เกม→ไม่บัมพ์/ไม่ deploy
- **รอบ 514:** 🧹➕ **ต่อยอด 513 (แชทเดิม) — `tools/clean_worktrees.sh` ลบ branch ที่ค้างด้วย** (ไม่ให้เหลือ branch ลอยหลังลบ worktree) · ลบ branch ใช้ **`git branch -d`** (ไม่ใช่ `-D`): ลบเฉพาะที่ merge เข้า main แล้ว · ข้าม main/master · ทำ **หลังเอา worktree ออกสำเร็จเท่านั้น** (ไม่งั้น git ไม่ให้ลบ branch ที่ยัง checkout อยู่) · dry-run โชว์ `+branch <ชื่อ>` ให้เห็นก่อน · **ยืนยัน:** dry-run ลิสต์ busy/cranky พร้อม `+branch claude/...` · worktree 4 + branch ครบ (ไม่ลบจริง) · ไม่แตะไฟล์เกม→ไม่บัมพ์/ไม่ deploy
- **รอบ 513:** 🧹 **ต่อยอด 512 (แชทเดิม) — จัด worktree report ใหม่ + สคริปต์เก็บกวาด** — boot: ⚡ worktree active (นำ main >0) โชว์เด่น+subject · 🗑️ worktree ที่รวม main แล้ว **รวบเหลือบรรทัดเดียว** (ลด noise เมื่อค้างเยอะ) ชี้ไป `tools/clean_worktrees.sh` · **สคริปต์ใหม่ `tools/clean_worktrees.sh`** ลบ worktree "นำ 0" — **default = dry-run** (โชว์เฉย ๆ), ลบจริงต้อง `--yes` · ไม่แตะ primary/อันปัจจุบัน/active · **ไม่ใช้ `--force`** (มีไฟล์ค้าง=ข้าม+เตือน กันทิ้งงานที่ยังไม่ commit) · **ยืนยัน:** boot โชว์ ⚡ecstatic(นำ2)+🗑️2อันบรรทัดเดียว · dry-run ลิสต์ busy/cranky ไม่แตะ ecstatic, worktree ครบ 4 (ไม่ลบจริง) · ไม่แตะไฟล์เกม→ไม่บัมพ์/ไม่ deploy
- **รอบ 512:** 🌿🧹 **ต่อยอดรอบ 511 (แชทเดิม) — ยก UX worktree scan ใน `tools/check_parallel.sh` (`report_worktrees()` จุดเดียว, boot เท่านั้น)** — ⚡ worktree "นำ main >0" (session กำลังทำ) โชว์ **หัวข้อ commit ล่าสุด (subject)** รู้ว่าเขาทำเรื่องอะไร กันเริ่มซ้ำ · 🗑️ worktree "นำ 0" (commit รวม main แล้ว/session ตาย) ขึ้นคำสั่ง `git worktree remove <path>` พร้อมก๊อป (**ไม่ใส่ `--force`** กันเผลอทิ้งงานที่ยังไม่ commit) · **ยืนยัน:** ⚡ecstatic(นำ2)=โชว์ subject · 🗑️busy/cranky(นำ0)=โชว์ remove cmd · base/version ยังเงียบเมื่อทันสมัย · ไม่กระทบโหมด pre-commit/round · ไม่แตะไฟล์เกม→ไม่บัมพ์/ไม่ deploy
  - **🆕 กฎทองข้อ 5 เพิ่ม (ผู้ใช้สั่ง 23 ก.ค.):** ทุก "ข้อเสนอต่อยอด" ท้ายคำตอบต้องติดป้าย **"แชทเดิม/แชทใหม่"** อันไหนประหยัด token กว่า · แชทใหม่ถูกกว่า → **แนบ prompt พร้อมใช้ให้เลย** (แก้ `HANDOFF.md` ข้อ5 + memory `token-efficient-session-choice` + skill `vocab-world`)
- **รอบ 511:** 🚦➕ **ต่อยอดรอบ 510 — ยุบทุกตรรกะเตือน session คู่ขนานไว้ที่ `tools/check_parallel.sh` จุดเดียว** (ผู้ใช้อนุมัติล่วงหน้า · แก้สคริปต์กลางที่เดียว ให้ทั้ง boot/pre-commit/commit-msg ใช้ร่วม ห้ามเขียนซ้ำ) — เพิ่มโหมด `boot`(default)/`pre-commit`/`round <N>` · **①เตือน version.json ตั้งแต่บูต** (main ใหม่กว่า HEAD → บอกเลขที่ต้องบัมพ์เลย · ใช้ `num()` เดียวกับ pre-commit ② เดิม · boot=`-lt` เท่ากันเงียบ / pre-commit=`-le`) · **②สแกน `git worktree list`** โชว์เฉพาะอันที่ HEAD ต่าง/ตามหลัง main + คอลัมน์ "นำ main >0"=session กำลังทำอยู่ (กันเริ่มงานซ้ำ) · **③`.githooks/commit-msg` เรียกผ่านสคริปต์กลาง** (เดิม grep `rotate_handoff.py --check-round` เอง) · `.githooks/pre-commit`/`commit-msg` เหลือแค่ wrapper บาง ๆ · **guard เดิม (grep `--check-round` ก่อนเรียก) ยกมาไว้ในสคริปต์กลาง** กัน rotate_handoff.py เวอร์ชันเก่าเผลอรันหมุน
  - **ยืนยัน:** boot บน main ทันสมัย=เงียบ base/version โชว์แค่ worktree · worktree ตามหลัง main (busy .494/r506 rotate เก่า)=เตือน base9+บัมพ์ .496 + **ไม่มี round line + version.json ไม่ถูกแตะ (guard ทำงาน)** · worktree r509 (rotate ใหม่)=โชว์ round line 510→511 · round 511=ผ่าน / 510,508=ชน exit1 · pre-commit ② stage .494=บล็อก / .496=ผ่าน · SessionStart hook (`~/.claude/settings.json`) เรียก boot อยู่แล้ว ไม่ต้องแก้ · ไม่แตะไฟล์เกม → ไม่บัมพ์ version/ไม่ deploy
- **รอบ 510:** 🚦🕐 **เตือน "session คู่ขนาน" ตั้งแต่วินาทีบูต (ไม่ใช่ตอน commit ซึ่งสายไป)** (ต่อยอดรอบ 507 · ผู้ใช้อนุมัติล่วงหน้า) — แยกตรรกะ "main/origin/main นำหน้า HEAD" ที่ซ้ำใน `.githooks/pre-commit` ออกเป็นสคริปต์กลาง **`tools/check_parallel.sh`** (ที่เดียว) แล้วให้ทั้ง pre-commit เดิม + **SessionStart hook** (`~/.claude/settings.json`) เรียกใช้ · รายงาน = base นำหน้ากี่ commit + หัวข้อ 3 อันล่าสุด + **เลขรอบล่าสุดบน main** (รู้ว่าต้องเริ่มรอบไหน) · **เงียบสนิทเมื่อทันสมัย** (ไม่มี noise ทุกบูต) · ใช้ ref ในเครื่อง **ไม่ fetch** (ไม่หน่วงบูต) · scope ด้วย guard `[ -f tools/check_parallel.sh ]` → ยิงเฉพาะเกมนี้/worktree ของมัน
  - 🛡️ **กันพลาด:** เลขรอบดึงจาก `rotate_handoff.py --check-round 0` แต่ **grep เช็กก่อนว่าสคริปต์รองรับแฟลกนี้** — เช็กเอาต์เก่า (ก่อนรอบ 509) ไม่มี → ถ้าเรียกจะตกไป default = "รันหมุน handoff จริง" (side effect) → guard ไว้แล้ว
  - **ยืนยัน:** ทันสมัย=เงียบ exit0 · ตามหลัง main=เตือน exit1 (N commit+3 หัวข้อ+รอบ 509→510) · **worktree จริงที่ตามหลัง main 1 commit → เตือนถูกจาก cwd ของ worktree** (ref แชร์) · guard กันหมุน: รันบนเช็กเอาต์เก่า → ไม่มี backup ใหม่/ไฟล์ไม่เปลี่ยน · pre-commit ที่ refactor แล้ว commit รอบนี้ผ่านเอง (510>509) · settings.json valid · ไม่แตะไฟล์เกม → ไม่บัมพ์/ไม่ deploy
- **รอบ 509:** 🔢 **เลิกเดาเลขรอบเอง — ให้ `tools/rotate_handoff.py` บอกเลขให้ตรง ๆ** (ผู้ใช้สั่งหลังรอบ 505 ชนกัน 2 session) — เพิ่ม 2 โหมด: `--next-round` พิมพ์ "เลขว่างถัดไป" ตัวเดียว (สแกน TASKS.md + `archive/` + git log main → max+1 · ไว้ใช้ในสคริปต์) · `--check-round N` คืน exit 0=ว่าง/1=ชน + พิมพ์เลขสูงสุดที่ commit แล้ว · **ยุบตรรกะ grep ที่ฝังใน `.githooks/commit-msg` มาไว้ที่เดียว** (hook เรียกสคริปต์แทน) · รันเปล่ายังทำงานเดิมเป๊ะ
  - **ยืนยัน:** 3 โหมดรันจริงผ่าน (`--next-round`→509 · `--check-round 509`→exit0 · `508`→exit1 · `--check` report เท่าเดิม) · hook เทสต์ 4 เคส: บล็อก "รอบ 508/505" (exit1) · ผ่าน "รอบ 509" (exit0) · `SKIP_PARALLEL_CHECK=1` ผ่าน · **เจอ session คู่ขนานลงรอบ 508 (คนละเรื่อง=GASP) → FF ทับแล้ววัดผลซ้ำ + ขยับเป็น 509** · อัปเดต HANDOFF ข้อ10 + skill vocab-world ("ขอเลขด้วย --next-round อย่าเดา")

- **รอบ 508:** 🫁💨 **"ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืน/กล้องตกวูบ + หอบแรงชั่วครู่ ก่อนคืนปกติ** (ต่อยอดรอบ 504 ข้อ 3/3 · ผู้ใช้อนุมัติล่วงหน้า) — สอนเด็กให้ "เล็งให้จบก่อนลมหมด" · เพิ่มโซน `GASP`+`tickGasp/gaspMul/gaspPitchNow/applyGasp` ใน `js/invasion3d.js` เป็น **ออฟเซ็ตบวกทับล้วน** (แบบ SWAY 501 / ADS_BOOST 504 / SWAY_MAG 506) · **ไม่แตะค่าล็อก** `ADS_BY_GUN`/`GUN_VIEW`/`AIM_OFF`/`AIM_BY_GUN`/`ADS_BREATH`/`SWAY`
  - **ทริกเกอร์:** ใน `tickAds()` — `drain = holdBreath&&adsT>.5&&breathLeft>0` (คิดก่อนหักลม) → ถ้า `drain && breathLeft===0` เฟรมนั้น = `fireGasp()` · **ปล่อยปุ่มเอง/เลิกส่องกล้องก่อนลมหมด → drain=false → ไม่มีทางเข้า (ไม่มีโทษ = รางวัลคนจับจังหวะเป็น)**
  - **การตก = ใส่ที่กล้อง (`applyGasp` หลัง `applyBreath`) เหมือนแรงถอย** → `gaspPitchNow()` แปลง "% ของความสูงจอ" กลับเป็นมุมด้วย fov หลัก (คงที่ 68 ทุกซูม → ตกเท่ากันบนจอ · ในเลนส์อ่านชัดกว่าตอนซูมแรง เหมือน recoil) + เติมให้ตัวปืนจิ้มลงอีกนิด (`gunY/gunPitch`) · **หอบ = ต่อยอด `fatigue` เดิม** (บวก `gaspShake*GASP.fat` ใน `tickSway`) + คูณแอมป์ `gaspMul()` ใน `applyBreath` → ไม่มีคลื่นหายใจชุด 2 ซ้อน
  - **ยืนยัน browser (1280×720 · ขับเฟรมเอง `_t.step` + patch `performance.now` · A/B differential หักเฟสหายใจ):** ตกสุด **0.8% ของความสูงจอ ที่ 0.25 วิ · คืนเข้าที่ ~0.95 วิ** (จากยอด ~0.70 วิ) · แกว่งช่วงหอบ **1.80×** (0–1 วิ) แล้วคลายเอง (1.35× ช่วง 1–1.7 วิ → 1.00× หลัง 1.7 วิ) · **จบซองคืนบิตต่อบิต: dPitch 0 · gunY 0 · gun roll 0 · aimDir ในสเปซกล้อง `[−0.001079,−0.001214,−0.999999]` เท่ากันเป๊ะ ก่อน/หลัง** · มุมตกคงที่ทุกซูม (4/6/8× ใช้ fov หลักเดียว) · rifle 2× ทริกเกอร์+ตกได้ · **ปล่อยเองที่ลมเหลือ 0.397 = ไม่เกิด · เลิกส่องกล้องกลางคัน = ไม่เกิด · กดค้างจนหมด = เกิดที่ breathLeft 0 (5.02 วิ)** · ยิงระหว่างหอบ (r93+rifle) ไม่มี error · console ไม่มี error · **ค่าล็อก r93 `[0.256,−0.118,−0.971]/1.485` ไม่ขยับ**
  - 🔧 จูนสด: `_t.setGasp({drop,dropIn,dropOut,mul,hold,ease,fat,gunY,gunPitch})` · ดูค่า `_t.gasp` · ยิงเองตอนวัด `_t.fireGasp()` · เคลียร์ `_t.clearGasp()`
  - 🪤 กับดักวัดผล: eval เกิน ~200 เฟรม render จะ timeout 30 วิ **และถ้าตัดกลาง `renderScopePass` จะทิ้ง `camera.fov` ค้างที่ fov เลนส์** (gaspPitchNow อ่านมุมเพี้ยน 10×) → ซอย eval สั้น + `T.camera.fov=68;updateProjectionMatrix()` ก่อนวัดทุกครั้ง · ทดสอบทริกเกอร์แยกจากระยะตกด้วย `_t.fireGasp()` (drain จริงจากลมเต็ม = 300 เฟรม หนักไป)
- **รอบ 507:** 🚦🤖 **git hook กัน "commit ทับงาน session คู่ขนาน"** (ผู้ใช้สั่งหลังเจอเคสจริงรอบ 505/506) — บังคับใช้ **กฎทองข้อ 10** อัตโนมัติ ไม่ต้องพึ่งความจำของแต่ละ session
  - `.githooks/pre-commit` — ① `main`/`origin/main` นำหน้า HEAD → บล็อก + โชว์ 3 commit ล่าสุดที่ตามไม่ทัน + สั่ง "ซ้ำ=หยุด · ไม่ซ้ำ=rebase แล้ววัดผลซ้ำ" · ② `version.json` ที่จะ commit ไม่ใหม่กว่าของ main → บล็อก + บอกเลขที่ควรบัมพ์
  - `.githooks/commit-msg` — เลขรอบในหัวข้อ commit ≤ เลขรอบสูงสุดใน `handoff/TASKS.md` ของ main → บล็อก + บอกเลขถัดไปที่ว่าง (เคสรอบ 505 ชนกันเป๊ะ ๆ)
  - **เปิดใช้:** `git config core.hooksPath .githooks` (ตั้งให้แล้ว · worktree ใช้ค่าเดียวกันอัตโนมัติ · clone ใหม่ต้องสั่งเอง 1 ครั้ง) · ข้ามเองระหว่าง rebase/merge/cherry-pick · ⛔ `SKIP_PARALLEL_CHECK=1` มีไว้เป็นทางออกฉุกเฉิน **ห้าม session ใช้เอง**
  - **ทดสอบ 5 เคส:** ผ่าน 2 (อยู่บน main ทันสมัย + เลขรอบใหม่ · บัมพ์ `.495` ถูกต้อง) · บล็อก 3 (เลขรอบ 506 ชน · worktree ตามหลัง main 2 commit = เคสจริงเช้านี้ · `version .493 ≤ .494`) · **hook ทำงานจริงตอน commit รอบนี้เอง** (ผ่านเพราะ 507 > 506)
- **รอบ 506:** 🔭🫨 **"กำลังขยาย" มีผลกับความนิ่งของภาพแล้ว — ซูมแรงยิ่งสั่น ต้องกลั้นหายใจจริงตอนยิงไกล** (ต่อยอดรอบ 504 ข้อ 1/3) — เพิ่ม `SWAY_MAG` + `tickSwayMag()` ใน `js/invasion3d.js` เป็น **ตัวคูณบวกทับ** (แบบ SWAY รอบ 501 / ADS_BOOST รอบ 504) · แตะโค้ดเดิมแค่ 3 จุด: `applyBreath()` (steady/amp) · `tickSway()` (adsK) · `tickAds()` (เรียก tick) · **ไม่แตะตัวเลขฐานใน `ADS_BY_GUN`/`GUN_VIEW`/`AIM_OFF`/`AIM_BY_GUN`/`ADS_BREATH`/`SWAY`**
  - **สูตร (จดไว้ใช้ซ้ำ):** คิดเป็น **"การแกว่งที่อ่านได้ในเลนส์" = มุมจริง × กำลังขยาย** เทียบฐาน 4× → ตั้ง `read {4:1.00, 6:1.12, 8:1.25}` แล้วถอยกลับเป็นมุมจริง **`k(m)=read[m]×baseMag/m`** · กลั้นหายใจ **`steady(m)=hold/read[m]`** (hold 0.12) → นิ่ง "เท่ากันทุกซูม" · ปืนที่มีกำลังขยายระดับเดียว (ไรเฟิล 2×) ไม่ถูกแตะเลย · `gun:1` = ตัวโมเดลปืนโยกตามตัวคูณเดียวกัน
  - **ยืนยัน browser (โหลดไฟล์จริงหลังรีโหลด · 1280×720 · วัดซ้ำอีกรอบหลัง rebase ทับรอบ 505 ได้เลขเดิมเป๊ะ):** p-p พิตช์ **4× 0.690° · 6× 0.515° · 8× 0.430°** = อ่านได้ในเลนส์ **+0.0% / +11.8% / +24.5%** (ของเดิม +50%/+100% — วัดเทียบแล้ว 4.121°/5.476° readable) · %ของวงเลนส์ 6.93/6.67/6.29 · **กลั้นหายใจ readable 0.330/0.331/0.330° เท่ากันเป๊ะทุกซูม** (เดิม 0.331/0.495/0.659) · ไรเฟิล 2× 0.687°/0.083° = ไม่เปลี่ยน · **dPitch 0.005° dYaw 0.001° roll 0 ทุกซูม · ทิศกระสุนในสเปซกล้อง `[−0.019181,−0.012138,−0.999742]` เท่ากันบิตต่อบิต = ต่าง 0.000000°** · ปากกระบอก 49.3/53.7% ทุกซูม · สลับซูมเข้าที่ ~0.75 วิ (Δ gain/เฟรม ≤0.041 ≈ 0.014°) ไม่กระตุก · เดิน+ส่องกล้อง roll ปืน 4× .016 (=ฐานรอบ 501) → 8× .010 · ท่าถือ/เดินปกติเท่ารอบ 501 เป๊ะ (x .040 y .032 roll .090) · **ค่าล็อกไม่ขยับ** (r93 `[0.256,−0.114,−0.971]/1.485`) · ยิงครบ 4×/6×/8×/2× × กลั้น-ไม่กลั้น ไม่มี error
  - 🔧 จูนสด: `_t.setSwayMag({r4,r6,r8,hold,gun,lerp})` · ดูค่า `_t.swayMag` (ang/hold/read/readHold) · `_t.snapSwayMag()` ข้ามการไล่นุ่มตอนวัด
  - 🪤 **กับดักวัดผล (จดไว้ กัน session หน้าเสียเวลา):** แท็บ preview เป็น `document.hidden` → **rAF ไม่เดิน** วัดคลื่นหายใจไม่ได้ (sway อิง `performance.now()` ไม่ใช่ dt สะสม → `_t.step()` รัวๆ = เฟสค้าง) → แก้ด้วย **patch `performance.now` เป็นนาฬิกาเสมือน** แล้ว `_t.step(1/60,1)` ทีละเฟรม · กลั้นหายใจได้แค่ 5 วิ (`BREATH_MAX`) → หน้าต่างวัดต้อง ≤4.2 วิ (คาบพิตช์ 3.93 วิ ครบพอดี · ยอว์ 5.7 วิ ไม่ครบ ใช้พิตช์เป็นเกณฑ์) · eval เดียวเกิน ~350 เฟรมจะ timeout 30 วิ → ซอยเป็นหลายคำสั่งเก็บสถานะไว้ใน `window`
- **รอบ 505:** 🫁🌑 **สัญญาณรับรู้ลมหายใจตอนส่องกล้อง** (ต่อยอดรอบ 504 ข้อ 2/3) — เด็กรู้จังหวะเล็งโดยไม่ต้องอ่านตัวเลข · เพิ่มโซน `BREATH_FX`+`tickBreathFx()` และเมธอด `Snd.breathIn/breathOut/breathStrain/breathAir` ใน `js/invasion3d.js` (สังเคราะห์ล้วน ไม่มีไฟล์เสียงใหม่) · **ไม่แตะค่าล็อกปืนทั้งหมด**
  - **ภาพ = ต่อยอดของเดิม ไม่ซ้อนระบบ:** บวกทับ `dark` เดิมใน `layoutScope()` + เพิ่ม "เลเยอร์ที่ 2" ในหน้ากาก `.so-mask` ใบเดิม · จุดเริ่มมืดอิงด้านสั้นของจอ แต่ถูกบังคับ **≥ วงเลนส์+34px เสมอ** → ไม่มีทางบังกากบาท · ปุ่ม 🫁 ใช้ `opacity` เดิม เพิ่มแค่ `brightness` ตอนอึดอัด
  - **ยืนยัน browser (โหลดไฟล์จริงหลังรีโหลด · ขับเฟรมเองด้วย `_t.step` เพราะ pane ไม่ compositing):** ขอบเลนส์ `dark` **0.94→0.99** และขอบจอ alpha **0.016→0.60** ไล่ตาม breathLeft 0.9→0.02 (1000×640) · **จอเตี้ย 812×375**: เริ่มมืดที่ 107→89px ห่างขอบเลนส์ 64→46px ขอบจอที่ใกล้สุด (101px) มืดจริงตอนลมต่ำ · ผ่อนแล้ว vig→0 ใน ~0.75 วิ · เสียง: นับ source จริง (patch `createBufferSource/createOscillator`) **สร้าง 20 หยุด 16** (ที่ไม่ stop คือ noise() เดิมของเสียงอื่น) · `in/out` เท่ากันทุกครั้ง (3/3) รวมถึงกรณี **เลิกส่องกล้องกลางคัน = มีเสียงผ่อนออก** · เสียงสั่น **0 ครั้งตอนลม >0.30 · เกิดเฉพาะ <0.25** · ยิง 6 นัด (ตอนมืดสุด+หลังผ่อน) ไม่มี error
  - 🔧 จูนสด: `_t.setBreathFx({vig,vigIn,vigGap,darkAdd,lerp,strainAt,gapHi,gapLo})` · ดูสถานะ+ตัวนับเสียง `_t.breathFx` · `_t.snapBreathFx()` ข้ามการไล่นุ่มตอนวัด
  - 🪤 กับดักรอบนี้: **พอร์ต 8765 เป็น dev server ของ session อื่น (คนละโฟลเดอร์)** เสิร์ฟไฟล์เก่าตลอด → ของโฟลเดอร์นี้อยู่ **8642** (เช็กด้วย `curl localhost:<port>/js/invasion3d.js | grep <ชื่อใหม่>`)
- **รอบ 504:** 🔍🫁 **ท่าเล็ง ADS: ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ** (ผู้ใช้สั่ง) — เพิ่ม `ADS_BOOST` + `tickAdsBoost()` ใน `js/invasion3d.js` เป็น **ตัวคูณบวกทับ** (แบบ SWAY รอบ 501) · **ไม่แตะตัวเลขใน `ADS_BY_GUN`/`GUN_VIEW`/`AIM_OFF`/`AIM_BY_GUN`**
  - **สูตร:** เพิ่ม `s` อย่างเดียว (p เท่าเดิม → ไม่กระทบ `adsPosNow()` และท้ายปืนไม่เข้าใกล้ near plane เพิ่ม) แล้วดึง `y` ลงด้วย `yFix` ชดเชยปลายลำกล้องที่ลอยขึ้น · ค่าที่วัดได้: **เงากว้าง ≈ 4.3 × %ที่เพิ่มใน s** · `mag {4:0, 6:0.0117, 8:0.0226}` · `breath 0.0082` · `yFix {r93:0.148, rifle:0.108}`
  - **ยืนยัน browser (โหลดไฟล์จริงหลังรีโหลด · `GunLab.freeze()` ก่อนวัด · วัดก่อนยิง):** เงากว้าง R93 **4× 14.456% (=ฐานรอบ 503) · 6× 15.177 (+5.0%) · 8× 15.900 (+10.0%)** · กลั้นหายใจ **+3.46/+3.55/+3.64%** (ไรเฟิล 18.750→19.388 = +3.40% · ขนาดฐานไม่เปลี่ยน zoom gain=0) · **ปลายลำกล้องใต้จุดเล็ง 3.962% ทุกเคสเป๊ะ** (ไรเฟิล 3.802%) · dPitch/dYaw 0.005/0.001° (ไรเฟิล 0.018/0) · roll 0 · nearestZ ≤ −0.268 (near 0.01) ไม่มีจุดยอดหลุด · ไล่ค่านุ่ม: สลับซูมเข้าที่ ~0.45 วิ (Δ/เฟรม ≤0.0022) กลั้นหายใจเข้า ~1 วิ ปล่อยคืน ~0.55 วิ · ยิงครบทุกซูม+กลั้นหายใจ 2 กระบอก ไม่มี error · **ค่าล็อกไม่ขยับ** (hip pose r93 `[0.256,−0.118,−0.971]/1.485` · aim ไรเฟิล `[0,−0.46]`)
  - 🔧 จูนสด: `_t.setAdsBoost({m4,m6,m8,breath,yFix,lerp,breathIn,breathOut})` · ดูค่า `_t.adsBoost` · `_t.snapAdsBoost()` ข้ามการไล่นุ่มตอนวัด
- **รอบ 503:** 🔍 **ส่องกล้องแล้ว "ปืนอัดเข้ามาใกล้ตา + ใหญ่ขึ้น 16–18%"** (ผู้ใช้สั่ง) — แก้เฉพาะ `ADS_BY_GUN` ใน `js/invasion3d.js` · `r93 {p:[0.012,−0.221,−1.378], s:1.643}` · `rifle {p:[0.006,−0.144,−0.713], s:1.215}` (r ไม่ขยับ)
  - **สูตรที่ได้มา (จดไว้ใช้ซ้ำ · เขียนในคอมเมนต์เหนือ `ADS_BY_GUN` ด้วย):** ภาพบนจอขึ้นกับ **อัตราส่วน `s/|p|` เท่านั้น** → คูณ `p` กับ `s` ด้วยเลขเดียวกัน ภาพเท่าเดิมเป๊ะ (วัดยืนยัน: s1.550@z−1.300 vs s1.643@z−1.378 = เงากว้าง 14.30 vs 14.31%) → ใช้ตัวคูณนี้ "ดัน z ออกหน้า" กันท้ายปืนชน near plane ได้ฟรี · เงากว้างโตเร็วกว่า s มาก (s +4.4% → เงา +18%) · เพิ่ม s แล้วปลายลำกล้องขยับขึ้น ต้องดึง y ลงชดเชย
  - **ยืนยัน browser (โหลดไฟล์จริงหลังรีโหลด · วัดก่อนยิง):** เงากว้าง **r93 12.10→14.30% (+18.2%)** · **rifle 15.83→18.42% (+16.4%)** · dPitch/dYaw r93 0.01/0.00° rifle 0.02/0.00° · roll 0 ทั้งคู่ · ปลายลำกล้องใต้จุดเล็งเท่าก่อนแก้เป๊ะ (r93 53.7 vs 50.9 = 2.8% · rifle 76.8 vs 73.0 = 3.8%) · ไม่มีจุดยอดหลุด near plane (nearestZ −0.301/−0.144 · near 0.01) · เห็นตัวปืน 98%/91% เท่าเดิม · **ค่าล็อกไม่ขยับ** (hip pose + จุดเล็งทั้ง 2 กระบอกตรงเป๊ะ) · ยิงส่องกล้องทั้ง 2 กระบอก แรงถอยคืนเข้าท่าเดิม ไม่มี error
  - 🪤 หมายเหตุ: มาตรวัดปลายลำกล้องของ r93 อ่านได้ 2.8% (รอบ 499 จด 3.9% — คนละสภาพจอ/รอบวัด) → **ยึด "เท่าก่อนแก้" เป็นเกณฑ์** ไม่ไล่ตามตัวเลขเก่า

- **รอบ 502:** 🔧 **เพิ่ม 4 เครื่องมือใน `tools/gunlab.js` เพื่อลด token รอบจูนปืนถัดไป** (ไฟล์ dev ไม่ถูกโหลดในเกม · **ไม่แตะ `js/invasion3d.js` เลย**)
  - `GunLab.snapAim()` ดูดจุดเล็งไปบนแนวลำกล้องจริงที่ระยะ zero 50 ม. — หาแนวด้วย **PCA 3 มิติของจุดยอด** (ฉายลงจอไม่ได้ พานท้าย R93 อยู่หลังระนาบกล้อง) · **ค่าเริ่มต้นดูอย่างเดียวไม่แตะของจริง** ต้อง `{apply:true}` ถึงเปลี่ยนในหน่วยความจำ · `GunLab.yaw(±d)/pitch(±d)` หมุนรอบแกนผ่านจุดศูนย์กลางปืน (สูตรซ้ำรอบ 482–497 · yaw+ = ปากไปขวา · pitch+ = เงยขึ้น) · `savePreset/loadPreset/presets/delPreset` เก็บท่าถือ+จุดเล็งใน localStorage · `barrel()` ทิศลำกล้องเป็นองศา · `freeze()` หยุดคลื่น sway ตอนวัด (เรียกให้เองอัตโนมัติ · คืนด้วย `freeze(false)`)
  - 🔒 **กันแตะค่าล็อก:** ทุกคำสั่งคืน `locked:true` + คำเตือนเมื่อเป็น rifle/r93 และคืน `shared:true` เมื่อกระบอกนั้นใช้ `AIM_OFF` ค่ากลาง (ไรเฟิล — กับดักรอบ 488)
  - **ยืนยัน browser ทั้ง 2 กระบอก (โหลดไฟล์จริง):** `yaw(5)/pitch(3)` วัดได้ **5.00°/3.00° เป๊ะ** จุดศูนย์กลางปืนไม่ขยับ (0.265,−0.32,−0.644) · หมุนไป-กลับคืนค่าล็อกเป๊ะทั้งคู่ (r93 `[0.256,−0.118,−0.971]/[−0.562,−0.124,0.002]/1.485` · rifle `[0.312,−0.33,−0.707]/[−0.254,0.139,−0.058]/1.014`) · `snapAim()` แบบ dry ไม่ขยับจุดเล็ง (r93 ยัง `[−0.016,−0.018]` · rifle ยัง `[0,−0.46]`) · แบบ apply แล้ว `check()` ยิงเรย์ตรงจุดใหม่พอดี · ก้มปืน 2° จุดเล็งเลื่อนลง 2.1° (ตามแนวจริง) · `loadPreset` คืนท่า+จุดเล็งเป๊ะ และสลับกระบอกให้เองเมื่อ preset คนละกระบอก · ยิงทั้ง 2 กระบอก + คืนคลื่น sway แล้ว ไม่มี error
  - 🪤 **กับดัก:** ตั้งแต่รอบ 501 มี sway ตลอดเวลา → อ่าน `gunPose`/วัดมุมตรง ๆ จะเพี้ยน (เคยวัด 3° ได้ 3.49°) ต้อง `freeze()` ก่อนเสมอ · แนวลำกล้อง "ที่ตาเห็น" (PCA −9°) ไม่เท่ากับแกน −Z ของโมเดล (−32°) — snapAim ใช้แนวที่ตาเห็นเพราะเป็นเรื่องภาพ (กระสุนยิงตามกากบาทอยู่แล้ว)

- **รอบ 501:** 🤝 **แก้อาการ "ปืนลอย" ด้วย weapon sway/bob** — เพิ่มบล็อกจูน `SWAY` + `tickSway(dt,now)` ใน `js/invasion3d.js` (เรียกจาก `tickAds` หลังตั้งท่าถือ) · ปืนโยกตามจังหวะก้าว (แกนซ้ายขวา 1 รอบ/ก้าวคู่ · ขึ้นลง 2 เท่า · โรล/พิตช์/ยอว์ตาม) + หายใจตอนยืนนิ่ง (ยิ่งเหนื่อยยิ่งชัด) · เพิ่มหน่วงตอนหันกล้อง `LAG_GAIN .55→.72 / MAX .14→.17 / BACK 7.5→6.2` · ย้ายคลื่น sway เดิมใน `tickPlayer` มารวมที่เดียว (กันคลื่นซ้อน)
  - **เป็นออฟเซ็ต "บวกทับ" ท่าถือล้วน ๆ** — ไม่แตะ `GUN_VIEW`/`AIM_OFF`/`AIM_BY_GUN` ที่ล็อก · กระสุนใช้ `aimDir()` (กล้อง) จึงไม่ขึ้นกับ sway
  - **ยืนยัน browser (โหลดไฟล์จริง · วัด `_t.gunPose` ต่อเฟรมด้วย `_t.step`):** ยืนนิ่ง p-p = y .010 / pitch .018 / roll .011 (หายใจล้วน) · **เดิน y .032 x .040 roll .090 rad (5.2°)** · วิ่ง roll .193 (รวมท่าลดปืน) · **ส่องกล้องขณะเดิน roll เหลือ .016 (ลด 82%)** · หยุดเดิน 1 วิ → `amp=0` ปืนกลับท่าฐาน `[0.312,−0.334,−0.707]/[−0.254,0.139,−0.064]` (ต่างจากค่าล็อกแค่ระลอกหายใจ ≤.006) · **ทิศกระสุนตอนเดินเทียบยืนนิ่งต่างกัน 0.0000°** · R93 pose/aim ยังตรงค่าล็อก (`[−0.016,−0.018]`) ไรเฟิล `[0,−0.46]` · ยิง 5 นัดถือ + 3 นัดส่องกล้อง ไม่มี error
  - 🔧 จูนสด: `_t.setSway({x,y,z,roll,pitch,yaw,walkHz,runHz,breathY,ads,...})` · ดูสถานะ: `_t.sway` (amp/phase/off/cfg)

- **รอบ 500:** 💥 **แรงสะบัดตอนยิงแยกตามกระบอก** — เพิ่ม `REC_BY_GUN` + `recCfg()` ใน `js/invasion3d.js` (โครงเดียวกับ `GUN_VIEW`/`AIM_BY_GUN`/`ADS_BY_GUN`) แทน `REC_RECOVER`/`REC_RIFLE`/`REC_R93` · ช่อง: `up/side/recover/climb/climbMax/ads/gun/gunBack` · ตัวคูณ `W.recoil*1.25` ของ R93 ย้ายมาอยู่ช่อง `gun` · ปืนประจำประตูเฮลิ (`riding`) ใช้ `REC_DEFAULT` เสมอ
  - **ค่าใหม่:** `rifle {up:.0088, side:.0062, recover:9.0, climb:.12/1.80, ads:.72, gun:.95, gunBack:10}` · `r93 {up:.115, side:.026, recover:2.5, climb:0, ads:.55, gun:1.30, gunBack:4.5}`
  - **ยืนยัน browser (โหลดจากไฟล์จริงหลังรีโหลด · เทียบก่อน-หลัง):** R93 ดีด **5.04°→6.59°** คืนตัว (ถึง 10%) **0.43→0.92s** ตัวปืนคืนท่า 0.46→0.75s (สั้นกว่าจังหวะชักลูกเลื่อน 1.2s) · ไรเฟิลดีด **0.66°→0.50°** ส่าย .84→1.01° ยิงรัว 10 นัดไต่ **2.47°→1.23°** คืนตัว 0.43→0.25s · **ส่องกล้องอ่านออกชัดกว่าถือปกติ ~5 เท่า** (ไรเฟิล 0.7%→4% ของเลนส์ · R93 9.7%→47%) ทั้งที่มุมจริงน้อยกว่าตอนถือ (ads<1) → ไม่แรงจนเล็งไม่ได้ · R93 ที่ 4×/6×/8× = 36%/47%/53% ของเลนส์ (ไม่หลุดวงเลนส์) · **ค่าล็อกไม่ขยับ** (GUN_VIEW/AIM_BY_GUN/ADS_BY_GUN เท่าเดิมทั้ง 2 กระบอก) · ยิงครบ 4 เคส (ถือ/ส่อง × 2 กระบอก) มุมคืนเข้าเป้า ~0 ไม่มี error
  - 🔧 **จูนสด:** `_t.setRecoil({up,side,recover,climb,climbMax,ads,gun,gunBack})` คืนบรรทัดพร้อมวางทับ · `_t.recCfg` ดูค่าปัจจุบัน · `_t.resetRecoil()` ล้างก่อนวัด
  - 🪤 **กับดัก:** วัดแรงถอยห้ามใช้ `_t.step()` วนพันเฟรม (เรนเดอร์ 3D จริง → eval timeout) → เรียก `addRecoil()`+`applyRecoil(dt)` ตรง ๆ · R93 เป็น `auto:false` ยิงซ้ำต้อง `dispatchEvent(new MouseEvent('mouseup'))` ก่อน (ไม่งั้น `firedThisPress` บล็อก)

- **รอบ 499:** 🎯 **ท่าเล็ง ADS แยกตามกระบอก** — เพิ่ม `ADS_BY_GUN` + `adsView()` ใน `js/invasion3d.js` (โครงเดียวกับ `AIM_BY_GUN` · ค่ากลาง `ADS_POS/ROT/SCALE` เหลือเป็น fallback ของปืนใหม่) · `tickAds`/`adsPosNow` ดึงค่าจากตารางนี้แทนค่ากลาง
  - **ต้นตอ:** ท่าถือถูกจูนยกชุดรอบ 482–497 (s 1.014/1.485) แต่ ADS ยังเป็นชุดรอบ 450 (s .72) → ยกเล็งแล้ว **ปืนหดครึ่งหนึ่ง** + ไรเฟิลชี้ขึ้น 1° ทั้งที่จุดเล็งอยู่ล่างจอ 73% (ต้องก้มลง ~21°)
  - **ค่าใหม่:** `r93 {p:[0.011,−0.201,−1.300], r:[−0.415,−0.009,0], s:1.485}` · `rifle {p:[0.005,−0.123,−0.620], r:[−0.374,0,0], s:1.014}` (เงื่อนไข: แนวปืนขนานแนวเล็ง · ปลายลำกล้องใต้จุดเล็ง 3.9% · s เท่าท่าถือ · roll 0)
  - **ยืนยัน browser (โหลดจากไฟล์จริงหลังรีโหลด · วัดก่อนยิง):** R93 dPitch/dYaw **0.00°** ปลายลำกล้อง (49.2,54.8) เทียบจุดเล็ง (49.2,50.9) · ไรเฟิล 0.02°/0.00° ปลาย (50,76.9) เทียบ (50,73) · เห็นตัวปืน 99%/91% เงากว้าง 12%/16% ของจอ · **ค่าล็อกไม่ขยับ** (hip pose + aim ตรงเป๊ะทั้ง 2 กระบอก) · ยิงทั้งเล็ง/ไม่เล็ง แรงถอยคืนเข้าท่าเดิม ไม่มี error
  - 🪤 **กับดักรอบหน้า:** ปืนขนานแนวเล็ง = มองจากท้ายปืน ส่วนใกล้ตาบานเร็วมาก · เพิ่ม s หรือดึง z เข้าใกล้นิดเดียวปืนเต็มจอทันที (z −0.62 s .85 → เงากว้าง 31%) → อยากให้ใหญ่ต้อง **เพิ่ม s พร้อมดัน z ออกหน้า** คู่กัน · จูนสด: `_t.setAdsPose({x,y,z,rx,ry,rz,s})`

- **รอบ 498:** 🔒 **ล็อกค่าปืนทั้ง 2 กระบอกตามคำสั่งผู้ใช้** — ใส่กล่อง `🔒 LOCKED` เหนือ `GUN_VIEW` + หมายเหตุที่ `AIM_BY_GUN` (คอมเมนต์อย่างเดียว ไม่แตะตัวเลข) · จดคิวไอเดียต่อยอด 4 ข้อไว้ด้านบน (ทำใน session ใหม่)
  - **ยืนยัน browser (โหลดจากไฟล์จริง):** `typeof InvasionWorld = object` (ไฟล์ไม่พังจากคอมเมนต์ — กับดักรอบ 478) · R93 pose/aim [−0.016,−0.018] กากบาท 49.2%,50.9% · ไรเฟิล pose/aim [0,−0.46] กากบาท 50%,73% · กระสุนตรงจุดเล็งทั้งคู่ · ยิง+ส่องกล้องผ่าน ไม่มี error



## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 524:** 🎯🪖 **ทหารมุมมองที่3 (soldier_c / soldier_c_KSR-77) ก้มเงยที่เอวเล็งตามทิศเป้าจริง — เดิมยิงทิ่มลงล่างตลอด · deploy `.502`**
  - **ต้นตอ:** `poseSoldier` โหมด `legOnly` (kind 'c') `return` ตั้งแต่ขยับขาเสร็จ ไม่เคยแตะ torso → `s.lookUp` ที่ tickSquad คำนวณถูก (invasion3d.js:5542) **ไม่เคยถูกใช้** ท่อนบน+ปืน baked แช่แข็งท่าหน้าตรง/ก้มลง
  - **แก้ (invasion3d.js legOnly branch ~2318):** เพิ่มก้มเงยที่ **เอว** = `J.torso.rotation.x=pitch` (`pitch=clamp(lookUp,-0.55,1.05)`) · จุดหมุน torso = ขอบล่างกล่องลำตัว(เอว)อยู่แล้ว · torso เป็นแม่ของ head/arm/ปืน → หมุนจุดเดียวท่อนบนเอียงก้อนแข็ง "ปืนไม่หลุด" · ขาเป็นลูก hips ไม่ขยับ · recoil `+=` เด้งปากขึ้น
  - **⚠️ sign กลับด้าน:** โมเดล baked หันหน้า −Z → **torso.x บวก = เชิดขึ้น** (ตรงข้าม path rig วาดเองที่ใช้ −up) — ยืนยันด้วย strip (torso +0.70=ปากปืนขึ้น / −0.35=ลง)
  - **flash ปากกระบอก:** ย้ายจาก grp → ห้อยใต้ `J.torso` (makeSoldier ~2406 · แปลง MUZZLE เดิมเป็น torso-local) → เอียงตามปลายปืนตอนเงย ไม่ค้างที่เดิม
  - **ยืนยัน end-to-end:** โหลดโค้ดใหม่ · fighters จริง 4 ลำบนฟ้า → squad0 `lookUp=0.612` → `torso.x=0.644`(+เชิดขึ้น) · unit: lookUp 0.6→+0.6, 1.4→+1.05(clamp), −0.4→−0.4 · syntax OK · ปิด preview กันเสียง · ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 525:** 🩹🪖 **กลบ "รอยตัดที่ท้อง" ตอนทหารก้มเงย (ต่อรอบ 524) — ผู้ใช้เจอ · deploy `.503`**
  - **อาการ:** โมเดล baked เป็นก้อนแข็ง "ไม่ยืด" → พอหมุน torso ที่เอวเล็งขึ้น ฐานลำตัวเผยอห่างสะโพก เห็นเป็นช่องโหว่/รอยตัดที่ท้อง
  - **แก้ (poseSoldier legOnly ~2330):** หลังหมุน torso เลื่อนฐานลำตัวกลบรอยต่อ — `J.torso.position.y-=0.11*|pitch|` (จมแนวดิ่ง) + `.z-=0.09*pitch` (เงยดันหน้า/ก้มดันหลัง ปิดฝั่งที่อ้า) · เก็บฐานเดิม `s._torsoY0/_torsoZ0` ครั้งเดียวกัน error สะสม
  - **+ลด clamp เงยสูงสุด 1.05→0.85** (~49° · เฮลิ/ยานไม่เคยเหนือหัว 60° · เกินนั้นเอวหักดูแข็ง)
  - **ยืนยัน strip แยกฉาก (เทียบ ไม่กลบ vs กลบ):** pitch 0.35(เคสจริง)/0.85/ก้ม−0.45 → ท้องปิดสนิทไม่มีรอยตัดทั้ง 3 องศา · runtime จริง: lookUp 0.071→torso.x 0.097 · torso.position เลื่อนตามสูตรครบ ไม่มี error · ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 526:** 🎯🛸 **เกราะยานแม่เปิด → ทหาร "บางส่วนรุมยิงแกนแดง" (ผู้ใช้เลือกจาก 3 ตัวเลือก) · deploy `.504`**
  - **ที่มา:** ผู้ใช้ถามว่าทหารเล็งแกนแดงถูกไหม → **วัดจริง: กลไกเล็งถูก** (บังคับเล็งแกน lookUp 24.1° vs จริง 23.9° คลาดแค่ 0.2°) · KSR ลำกล้องท่าพัก **≈ระดับ ไม่มี offset** (vertex-scan หลอกว่า +9.7° เพราะโดนสโคป/มือ · ภาพมุมข้างยืนยันราบ)
  - **ต้นตอที่ดูไม่เล็งยานแม่:** `tickSquad` เดิมยิงแกนเฉพาะตอน **fighter หมดเกลี้ยง** → ช่วง msOpen ที่ยังมี fighter ทหารมัวยิงยานลูกบินต่ำ (~5°) ไม่หันหาแกน (24°) ขัดป้าย "ระดมยิงยานแม่"
  - **แก้:** เพิ่ม `s.coreBias=(rnd<0.5)` (makeSoldier ~2402) · tickSquad (~5560): `coreOpen&&coreBias`→เล็งแกน · else มี fighter→เล็ง fighter · else coreOpen→เล็งแกน (tgt=null → damageMother ทำงานเดิม)
  - **ยืนยัน:** msOpen เปิดจริง (killAll→openMothership) · squad0 เล็งแกน lookUp=24° · render เห็นทหารเชิดปืนขึ้นหาแกนแดง · 2 เส้นทาง (fighter 5-7° / core 24°) แยกกันชัด · syntax OK · ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 527:** 🎯 **ปรับสัดส่วน coreBias 0.5→0.3 (ผู้ใช้เลือก ~30%)** — ทหารส่วนใหญ่ยังกดยานลูก ~30% แยกไปรุมแกนแดง · แก้เลขเดียว makeSoldier (~2402) · syntax OK · deploy `.505`


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 528:** 🎯🔫 **tracer ทหารมุมมองที่3 ออกจาก "ปลายลำกล้องจริง" (ต่อ 524-526) · deploy `.506`→ขึ้นจริงพร้อม .507**
  - **ต้นตอ:** `tickSquad` (invasion3d.js:5586) ยิง tracer จาก `grp.position + ความสูงคงที่ (1.0/1.4)` → เส้นพุ่งจากกลางลำตัว ไม่ตรงปากปืน โดยเฉพาะตอนทหารเงยเล็งยานบนฟ้า
  - **แก้:** ใช้ `s.flash.getWorldPosition()` เป็นจุดเริ่ม — flash sprite ถูกผูกใต้ `J.torso` ที่ตำแหน่ง `MUZZLE_BY_WEAPON` ตั้งแต่รอบ 524 (จุดเดียวกับไฟปากกระบอกที่ผู้ใช้ยืนยันแล้วว่าตรงปากปืน) → world matrix ของ torso ที่เงยแล้ว = ปากกระบอกจริง · มี fallback grp+ความสูงถ้าไม่มี flash (kind อื่น)
  - **+ย้าย `poseSoldier(s,now)` มาก่อนบล็อกยิง** เพื่อให้ torso เงยตามเป้าเฟรมนี้ ก่อนอ่าน getWorldPosition (recoil เลื่อน 1 เฟรม—มองไม่เห็น)
  - **ยืนยัน:** node -c syntax OK · จุดเริ่ม = node เดียวกับ muzzle flash ที่ผู้ใช้ยืนยันตรงปากปืนรอบ 524-526 (การันตีโดยโครงสร้าง) · internals อยู่ใน module closure ตรวจ runtime ไม่ได้ · ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 529:** 💬🛸 **ต่อยอด 526 — เกราะยานแม่เปิด (msOpen) ทหารสาย coreBias ตะโกน "ระดมยิงแกน!/รุมมันเลย!" · deploy `.507`**
  - **ทำ:** เพิ่ม `CHAT_LINES.core=['ระดมยิงแกน!','รุมมันเลย!','แกนแดงเปิดแล้ว รุมเลย!','อัดแกนให้จม!']` (invasion3d.js ~5703) · ใช้ระบบ `tickSquadChatter` เดิม (bubble+เสียง+`squadShout` ชุดเดียวกับรอบ 522/523)
  - **เงื่อนไข:** `tickSquadChatter` เดิม return ถ้า `!fighters.length` → เพิ่ม `coreOpen=(msOpen&&msCore&&!msDead)` ให้ตะโกนได้แม้ยานลูกหมด · เลือกบท: `coreOpen&&who.coreBias`→`CHAT_LINES.core` · ไม่งั้น→บทประจำปืน/ทั่วไปเดิม (คุมความถี่ chatAllAt/callAllAt เดิม ไม่รก)
  - **ยืนยัน:** node -c syntax OK · logic: เกราะเปิด+สายรุมแกน = บทระดมยิงแกน / ทหารอื่นยังปลุกใจเดิม · ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก · commit รวมงานรอบ 528 (tracer, session คู่ขนาน) ไปด้วยเพราะไฟล์เดียวกัน (ผู้ใช้อนุมัติ)


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 530:** 🏃🪖 **หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้: "อย่าปักหลักยืนทื่อ ให้วิ่งหาที่กำบัง เคลื่อนที่ หันปลายกระบอกไปเป้า") · deploy `.508`**
  - **ต้นตอ:** ทหาร squad ยืนกับที่ตลอด (`grp.position` ตั้งครั้งเดียวตอน spawn) — `tickSquad` แค่หมุนเล็ง+ยิง ไม่เคยขยับตำแหน่ง
  - **แก้ (invasion3d.js ~5606 zone 🏃🪖):** เพิ่ม `tickSquadMove(s,dt,now,active)` เรียกต้น `tickSquad.forEach` — ตอนมีศัตรู (`fighters||coreOpen`) ทหารสุ่ม "วิ่งไปหลบหลังกระสอบทราย" (60% จาก `squadCoverSpots` 3 จุดใกล้สุด → crouch) หรือย่องสลับที่สั้น ๆ (40%) แล้วปักหลักยิง (`holdUntil` 2.6-6.2s · `repoAt` 3.8-8.2s คุมไม่ให้รก)
  - ระหว่างวิ่ง: `mode='run'`(ไกล>5)/`'walk'` (poseSoldier เดินขา baked อยู่แล้ว) หันหน้าตามทางวิ่ง `lookUp=0` ไม่ยิง (return true ข้ามบล็อกเล็ง) · ถึงที่/อยู่กับที่ → กลับเล็งเป้าเดิม (หมุนตัว+เงย torso = ปลายกระบอกชี้เป้า รอบ 524) ยิงตามเดิม · `SQUAD_RUN=6.4 SQUAD_WALK=2.7`
  - **ยืนยัน runtime (preview + `_t.step`):** (A) สั่ง moveTgt ไกล 14u → sawRun+sawWalk, arrived, crouch on arrival, เกาะพื้นไม่ลอย · (B) ย้ายทหารพ้นกำบัง+ล้าง timer → AI เลือก dest เอง+เข้าโหมดวิ่ง · ไม่มี error · ปิด preview กันเสียง · ⛔ ไม่แตะมุมมองที่1/ค่าปืนล็อก


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 531:** 🚁 **เฮลิคอปเตอร์โลกยานแม่ "เหมือนโลก helicopter" (ผู้ใช้สั่งเป็นชุด · deploy `.509`) — ทำ 10/11 ข้อ**
  - **เสียง:** พอร์ต `HeliSnd` (invasion3d.js ~1200) โหลด `sound/heli_start|rotor|rotor_high.mp3` ชุดเดียวกับโลกเฮลิฯ · สตาร์ท→crossfade ลูปบิน · ปรับ rpm/ลม/หวอทุกเฟรม (wire ใน enterHeli/tickHeliFlight/exitHeli/world-exit) · **`HeliChorus`** = เสียงเฮลิทุกลำรอบตัว (บอท/เพื่อน) ดังตามระยะ+แพนซ้ายขวา (1 voice/ลำ)
  - **มิสไซล์:** ควันพ่นเป็นทาง (`spawnSmoke`/`tickSmoke` sprite จางๆ) + พุ่งสมจริง Modern Warship (loft+boost แล้ว homing โค้งเข้าเป้า) · **ฝุ่นฟุ้งใต้เฮลิตอนขึ้น/ลง** (`spawnDust`/`tickHeliDust` สปอว์นใต้เฮลิทุกลำใกล้พื้น = ทุก client เห็นของกันเอง)
  - **บอทเฮลิ dogfight:** `tickHelis` ไล่ล่ายานลูก (ไล่ท้าย+ส่ายหลบ+ยิงจรวดนำวิถีถี่ `heliFireAt`) · ไม่มียานลูก=ลาดตระเวนเดิม · **สี:** `heliDesertMat.map=null` ทิ้งลายแดง เหลือสีทะเลทรายล้วน (คุมลำจอด/บอท/เพื่อน)
  - **UI:** พวงมาลัย `#inv-wheel` ลอยเตือนตอนเข้าใกล้ลำ→กดขึ้นเครื่อง · `.fly` ซ่อนปุ่มภาคพื้น (fire2/glow/torch/night/gunner) เหลือชุดเฮลิ + ปุ่มมิสไซล์ 🚀 เด่นขึ้น · **ยืนยัน preview:** เข้า/ออกเฮลิ+ยิงมิสไซล์(12→10)+step หลายร้อยเฟรม = ไม่มี console error
  - ~~**⏳ ค้าง:** ข้อ 11~~ ✅ **ปิดจบรอบ 532** (ดูด้านบน) — เดิมเขียนไว้ว่า: ข้อ 11 = มุมมองภาพ cockpit จริง (`img/heli_cockpit.png`/`heli_dash.png`+เกจเข็ม พอร์ตจาก `drawGauges`/`cpNeedle`/`layoutCockpit` adventure3d ~8247-8810) **แทน** canopy CSS + เพิ่มกล้องภายนอก (seat ที่ 4) — ผู้ใช้เลือก "ทั้งสอง"


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 532:** 🎛️🎥 **ปิดจบข้อ 11 ที่ค้างจากรอบ 531 — ห้องนักบินภาพจริง + เกจเข็ม + มุมมองภายนอก (ผู้ใช้เลือก "ทั้งสอง") · deploy `.510`**
  - **ภาพค็อกพิต:** เลิกใช้กรอบ CSS `#inv-canopy` → ใช้ภาพชุดเดียวกับโลกเฮลิฯ ผ่าน `#inv-cockpit`+`#inv-gauges` (โซนใหม่ 🎛️🚁 ใน `js/invasion3d.js`) · ⚠️ **ไฟล์จริงคือ `img/heli_frame.png` (เต็มลำ ช่องกระจกโปร่ง) + `img/heli_dash.png` (มุมบิน/บินต่ำ) — `img/heli_cockpit.png` อยู่ใน .gitignore ไม่เคย deploy** · โหลดภาพไม่ได้ = ไม่ใส่คลาส `.cockpit` → ตกกลับไปใช้ canopy เดิมอัตโนมัติ
  - **เข็มเกจ:** พอร์ต `CP_NAT/CP_GAUGES/cpNeedle/drawInvGauges/layoutInvCockpit` จาก adventure3d ป้อนค่าบินจริง (spd=hypot(phVel.x,z)·alt=py−terrain−SKID·vs=phVel.y·rpm=HeliSnd.rpm) + ขอบฟ้าเทียมเอียง/ก้มจาก `cpTiltS/cpTiltF` (หน่วงแบบไจโร)
  - **มุมมองที่ 4 "ภายนอก" (seat3):** กล้อง `dy 4.6 · dz −14.5 · look .26` + หน่วง pitch ×.55 → ลำอยู่กลางจอ 45–69% ทุกมุมเงย · โชว์ `myPad.grp` + เอียง `rotation.z` เข้าโค้งจริง · **มุมมองภายในซ่อน myPad.grp เฉพาะจอเราเอง** (เพื่อนยังเห็นเราผ่าน peers)
  - 🧹 **(กฎทองข้อ 9) ซ่อม `tools/rotate_handoff.py` รอบสอง:** ตัวหมุน bullet ใช้ `find_section` = จับ **หัวข้อสรุปสถานะแรกในไฟล์** เท่านั้น แต่ session ใหม่เติม bullet ลงหัวข้อที่อยู่ล่างกว่า → หัวข้อแรกมี bullet เดียวตลอด รายงาน "ไม่ต้องหมุน" ทุกครั้งทั้งที่หัวข้อเดียวโต **46KB** และไฟล์รวม 89KB เกินงบ · แก้ด้วย `rotate_status_bullets()` ไล่ **ทุก** หัวข้อ เก็บรวม 10 รอบล่าสุด ที่เหลือเข้า archive + ตัดหัวข้อที่ว่างทิ้ง → **89KB → 28KB** (ประวัติครบใน `handoff/archive/TASKS_STATUS.md`)
  - **ยืนยัน preview (1280×720 · ภาพจริง 4 ใบ):** เต็มลำ=กรอบ Bell กระจกโปร่งเห็นสนามรบ+เข็มขึ้นครบ · มุมบิน/บินต่ำ=แผงชิดล่าง (บินต่ำดันลงอีก 30%) · ภายนอก=เห็นลำทั้งลำ เกจ/ค็อกพิตซ่อน · เข็มขยับตามค่าจริง (spd −135°→−10° · vs 0°→65.7° ตรงสูตร) · ออก/เข้าเครื่องใหม่ไม่มี state ค้าง ลำจอดคืนสภาพครบ 5 ลำ · ไม่มี console error · ปิดเสียงด้วย reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-24 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 533:** 🎥 **จูนกล้องภายนอก (seat3) เป็น chase cam จริง — ผู้ใช้สั่งต่อยอดจาก 532 · deploy `.511`**
  - **ต้นตอความรู้สึกแข็ง:** กล้องติดตายกับลำ (`px+(-sin)*dz` คำนวณใหม่ทุกเฟรมจาก yaw ปัจจุบัน) → หันหัวปุ๊บกล้องหันตามทันที ไม่มีน้ำหนัก
  - **แก้ (`js/invasion3d.js` · TUNE ZONE `EXT_CAM` เหนือ `seatCamera`):** ตำแหน่งกล้อง **ไล่ตามแบบหน่วง** (`extPos` lerp `lag 3.4` · มุมยืนหลังลำ `extYaw` หน่วง `yawLag 4.2` ผ่าน `angDiff` ทางสั้นสุด) · **ยิ่งเร็วยิ่งถอยห่าง** (13m ลอยนิ่ง → 19.5m เต็มสปีด) · เล็งด้วย `camera.lookAt` ที่ตัวลำเสมอ (ต่อให้ตามไม่ทัน ลำก็ไม่หลุดกลางจอ) · **กันกล้องมุดดิน** ยกเหนือ terrain ≥ `minUp 2.4`
  - **ยืนยัน runtime (preview 1280×720 + ภาพจริง 2 ใบ):** บินตรง=ลำอยู่ 49–50%,57% ระยะนิ่งที่ 13.0m เป๊ะ · เลี้ยว Q=กล้องเหวี่ยงออกเป็นมุมเฉียงท้าย (x 55% · `dYaw` ขึ้น 0.33 rad) แล้วกลับเข้าที่ 50%/dYaw 0 เอง · ลงจอด clearance 5.95m · ทดสอบ clamp ด้วย `minUp=12` → clearance = 12.00 เป๊ะ · วน seat 0→3→0 + ออกเครื่อง = ไม่มี state ค้าง ไม่มี console error
  - `SEAT_VIEWS[3]` เหลือแค่ `{label,ext:true}` (ค่ากล้องย้ายไป `EXT_CAM` หมด) · test hook ใหม่: `_t.EXT_CAM` / `_t.extCam`


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 534:** ⛽🌡️🚨 **เกจ/ไฟเตือนในค็อกพิตเฮลิโลกยานแม่ (ผู้ใช้สั่งต่อจาก 532) · deploy `.512`**
  - **เพิ่มในโซน 🎛️🚁 (`js/invasion3d.js`):** `CP_GAUGES` 2 หน้าปัดใหม่บนวงจริงในภาพ (⛽ `fuel` 302,356 · 🌡️ `tmp` 492,310) + `CP_LAMP` แผงไฟเตือน 4 ดวงบนแถบเรียบเหนือหน้าปัด (น้ำมัน/ร้อน/รอบเกิน/เสียหาย · เหลือง=ระวัง แดงกะพริบถี่=วิกฤต · ปกติเป็นป้ายจางกลืนกับแผง) · helper ใหม่ `cpArc/cpRoundRect/cpLamps/tickHeliGauges`
  - **โมเดลค่า:** เชื้อเพลิงกินตามรอบใบพัด+คันเร่ง (เต็มถัง ~5 นาที) **จอดนิ่ง = ฐานเติมให้เอง · หมดถังเครื่องไม่ดับ** (เป็นมาตรวัดล้วน ไม่เปลี่ยนวิธีเล่นเดิม เตือนด้วย toast ทุก 26 วิ) · อุณหภูมิร้อนตามรอบ/คันเร่ง ลมปะทะตอนบินเร็วช่วยระบาย (ลอยนิ่งดันคันเร่ง = ร้อนขึ้นจริง)
  - 🔧 **ซ่อมของเดิมไปด้วย:** เข็มรอบใบพัดรอบ 532 อ่าน `HeliSnd.rpm` ที่ขยับเฉพาะตอน "เปิดเสียง+โหลด mp3 เสร็จ" → คนปิดเสียงเห็นเข็มค้าง 0 ตลอด · เพิ่ม `cpRpm`/`cpRpmNow()` คำนวณรอบเชิงกลด้วยสูตรเดียวกับ `HeliSnd.update` เป็นตัวสำรอง (ใช้กับ shake/เข็ม rpm/ไฟเตือนทั้งหมด)
  - **ยืนยัน preview (1280×720 + 812×375 · ภาพจริง 3 ใบ):** ไต่เต็มคันเร่ง 6 วิ = rpm 1.45 → ไฟ "รอบเกิน" แดง + อุณหภูมิ .84 ไฟ "ร้อน" เหลือง · บินตรง 25 วิ = เย็นลง .41 ไฟดับหมด น้ำมัน 100→90.6 · ทดสอบครบ 4 ดวงตามเกณฑ์ (fuel .22/.07 · tmp .85/.97 · hp 33%/15%) · seat3=ล้างเกจ (pix 0) กลับ seat1=วาดใหม่ · ออกเครื่อง=ล้างจอ ขึ้นใหม่=ถังเต็ม/เครื่องเย็น · ไม่มี console error · ปิดเสียงด้วย reload+stop server แล้ว
  - test hook ใหม่: `_t.heliGauges` (ค่า+สถานะไฟ 4 ดวง) · `_t.setHeliGauges(fuel,eng)` · ⛔ ไม่แตะค่าปืนล็อก/มุมมองที่ 1


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 535:** 🌧️☀️ **ชั้นกระจกห้องนักบิน "มุมเต็มลำ" โลกเฮลิฯ มีชีวิต (ผู้ใช้สั่ง) · `js/adventure3d.js` โซน 🌧️☀️ (~8318) · deploy `.513`**
  - **ที่ปัด:** เดินมุมที่ `tickWiper()` ที่เดียว → ปิดกลางคันแล้ว **กวาดกลับเข้าท่าจอดเอง** (`wiperPark`) · ใบยางลากตามหลังก้านตามความเร็วกวาด (flex) + สั่นตามลำ · **รอยฟิล์มน้ำที่เพิ่งรีดผ่าน** (`smears` จางใน .72 วิ · อัลฟ่าต้องเบามาก เพราะซ้อนได้ ~20 ชั้น)
  - **แสงแดด:** 🐛 เดิม `k` ไม่ดูเวลาเลย → **เที่ยงคืนยังมีดวงส้มลอยกลางกระจก** · ตอนนี้คูณกลางวัน/ความสูงดวง/หมอก + **ใบพัดตัดแสงเป็นจังหวะ** (`rotorChop` ตาม rpm) · เพิ่มแฉกแสง/ริ้วยาว/เงาผีเลนส์/ฝุ่นจับกระจก · **หนีบดวงไว้ในช่องกระจกจริง y 104-286** (เดิมเที่ยงวัน sy≈60 ไปซ่อนหลังหลังคา) · ของใหม่: **ฝ้าไอน้ำตอนหมอกหนา** (ที่ปัดรีดออกได้จริง) · **แสงจันทร์** ตอนกลางคืน · หยดน้ำลากเป็นทาง+ไหลเฉียงตอนเอียงลำ+วิบวับตอนต้องแดด
  - **ยืนยัน preview 1280×720 (ภาพจริง 3 ใบ):** ท่าจอดกลับถึง π พอดี 15 เฟรม · ปัดแล้วหยด 61→33 · ฝ้า .2→0 หลังปัด · พลังงานที่วาด แดดกลางวัน 3639 vs กลางคืน 138 (ดับจริง) vs แสงจันทร์ 515 · **มุมบิน (seat1) ไม่วาดอะไรเลย (0)** · ไม่มี console error · testkit ใหม่ `_t.heli.glass/setMist/setNight/setFog` (⚠️ setNight/setFog ถูก `fogUpdate` ทับทุก 800ms — ต้อง redraw อุ่น 1 เฟรมก่อนตั้งค่า)
  - ⚠️ **เลขรอบ 533/534 ถูก session คู่ขนาน (invasion3d) ใช้ไปแล้ว** — คนละระบบ ทำต่อได้ตามกฎทองข้อ 10 · deploy รอบนี้พาโค้ดรอบ 534 ขึ้นเว็บไปด้วย (commit อยู่บน main แล้ว)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 537:** 🏢🔊 **ต่อยอด 535 ตามที่ผู้ใช้สั่ง "ทำข้อ 1-2" — แดดวูบตอนบินหลังตึก + เสียงที่ปัดน้ำฝน · `js/adventure3d.js` โซน 🌧️☀️ · deploy `.515` · SW v168**
  - **🏢 แดดวูบ (`sunRayBlocked/sunShadeTick`):** ยิงรังสีจากกล้องไปหาดวงอาทิตย์ 13 จุด ระยะ 95m เทียบกล่อง `buildings` → บังอยู่ = หรี่แดดเหลือ 22% หน่วงเข้า-ออก ~0.11 วิ (คิดใหม่ทุก 70ms พอ) · ⚠️ **หนีบมุมเงยรังสีไว้ ~46°** ไม่งั้นเที่ยงวันรังสีพุ่งพ้นยอดตึกทันที ผู้เล่นไม่มีวันเจอเอฟเฟกต์เลย
  - **🔊 เสียงที่ปัด (`wSnd`/`wiperSndTick`, สังเคราะห์ล้วนต่อตรง `ctx.destination` แบบ `doorSlideSfx`):** มอเตอร์หึ่งดังตามความเร็วกวาด (≤.055) · "ตุบ" ทุกจุดกลับทิศ + ตอนเข้าท่าจอด · **"เอี๊ยด" เฉพาะกระจกแห้ง** (ฝนหยุด+หยด<10+ไม่มีฝ้า) · ⚠️ จุดพลาดที่แก้แล้ว: การกวาดแบบโคไซน์ **ไม่เคย "ข้าม" จุดปลาย** (ชะลอแล้วย้อน) → ต้องจับ *ความเร็วเปลี่ยนเครื่องหมาย* ไม่ใช่การข้ามค่า · ปิดเสียงครบทุกทาง (ปิดสวิตช์/จอดเสร็จ/สลับมุมบิน/ลงจากเครื่อง/ออกจากโลก/`state.sound` ปิด)
  - **ยืนยัน preview 1280×720 (ภาพเทียบ 2 ช่อง):** ลอยเหนือเมือง shade 1.00 พลังงานแสง 5828 → บินหลังตึกสูง shade 0.22 เหลือ 1417 (−76%) → ลอยขึ้น กลับมา 5828 เท่าเดิม · เสียง: เปียก=ตุบ 2 เอี๊ยด 0 · แห้ง=ตุบ 2 เอี๊ยด 2 · จอดเสร็จ gain 0 เฟรมถัดไป node ถูกทิ้ง · ลงจากเครื่อง=เงียบ · ไม่มี console error · reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 540:** 🕒🏢 **ต่อยอดตามที่ผู้ใช้สั่ง "ทำ 1-2" — ที่ปัดโหมดหน่วง (INT) + เงาตึกหรี่ทั้งห้องนักบิน · `js/adventure3d.js` โซน 🌧️☀️ · deploy `.518` · SW v169**
  - **🕒 โหมดหน่วง = โหมดที่ 1** (ปุ่ม 🌧️ วน ปิด→หน่วง→ช้า→เร็ว · `WIPER_SPD`/`WIPER_LABEL` ยาว 4 ช่องแล้ว): ปัด 1 เที่ยวแล้ว **นอนพัก 3.4-5.2 วิ** (`wiperWaitAt`) ระหว่างพักใบนิ่งท่าจอด+มอเตอร์เงียบ มี "ตุบ" ตอนนอนจบเที่ยว
  - **🌦️ ฝน 2 ระดับ (`rainHeavy`):** พรำ = หยดแค่ 40% หอ ATC แนะ *"Intermittent wipers are enough"* · หนัก = แนะ *"Set your wipers to fast"* (เด็กได้ศัพท์อังกฤษจริงจากสถานการณ์)
  - **🏢 เงาพาดถึงในห้อง (`applyCockpitShade`):** ใส่ CSS `filter: brightness/saturate` ตาม `sunShade` **ทั้งภาพกรอบ (z3) และ canvas เข็ม (z4)** · ย้าย `sunShadeTick` ไปเรียกใน `drawGauges` → **ทำงานทุกมุมมอง ไม่ใช่แค่มุมเต็มลำ** · dt อิง**เวลาจริง** (ลูปเทสต์ที่ไม่หน่วงจริงจะไม่เห็นผล — ต้อง `await sleep(16)`) · กลางคืนไม่หรี่ซ้ำ · ลงจากเครื่อง/ออกจากโลกคืนค่าเอง
  - **ยืนยัน preview 1280×720 (ภาพเทียบ 2 ช่อง):** ปุ่มวน 4 โหมดถูกลำดับ · INT ปัด→พัก 3420ms นับถอยหลัง→ปัดใหม่ (โหมดช้า waitFrames 0) · หลังตึก `brightness(.73) saturate(.86)` ทั้งกรอบ+เข็ม ทั้ง seat0/seat1 · พ้นตึกล้างฟิลเตอร์ · กลางคืนไม่ใส่ฟิลเตอร์ · ไม่มี console error · reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 541:** 💦🏢➡️ **ต่อยอดตามที่ผู้ใช้สั่ง "ทำ 1-2" — ที่ฉีดน้ำล้างกระจก (กดปุ่มค้าง) + ขอบเงาตึกกวาดผ่านกระจก · `js/adventure3d.js` โซน 🌧️☀️ · deploy `.519` · SW v170**
  - **💦 ที่ฉีดน้ำ:** กดปุ่ม 🌧️ **ค้าง ≥420ms** = พ่นน้ำ 900ms + ปัดเร็ว 3 ที แล้วคืนโหมดเดิม · **แตะสั้น = วนโหมดปกติ** (เปลี่ยน handler เป็น `pointerdown/up` + timeout จับ hold · `washStart/washTick/washSpraySfx` เสียง "ฟู่~") · `grime` = คราบสะสมช้าๆ ตอนแห้ง (เต็ม ~80 วิ) ฝนล้างบางส่วน · **ริ้ว/ฝุ่นที่เห็นตอนต้องแดดสเกลตาม grime → ล้างแล้วจางจริง**
  - **🏢➡️ ขอบเงากวาด:** เดิมหรี่ทั้งบานพร้อมกัน · เพิ่ม `shadowSweepTick` = `shEdge` 0→1 ไล่จากด้านที่ลำไถลเข้าหา (ทิศจาก `hVel` ด้านข้าง) วาดแถบมืดนุ่มไล่ข้ามกระจกใน `drawGlass` (เฉพาะมุมเต็มลำ) = รู้สึกพุ่งผ่านเงาจริง ไม่ใช่แค่มืดวูบ
  - **ยืนยัน preview 1280×720 (ภาพ 3 ช่อง):** กดค้าง→`washing` mode3 grime .9→.02 คืนโหมด0 · แตะสั้น→mode1 ไม่ล้าง · เข้าเงา shEdge 0→.91→1 dir+1 · ออกเงากลับ 0 · ริ้วจางลงหลังล้างเห็นชัดในภาพ · ไม่มี console error · reload ปิดเสียงแล้ว · testkit ใหม่ `_t.heli.glass.{grime,washing,washLeft,shEdge,shDir}` + `washNow()`/`setGrime()`
  - ⚠️ **เลข 538-540 ถูก session คู่ขนาน (invasion3d) ใช้ไปแล้ว** งานนี้จึงเป็นรอบ 541 (คนละระบบ ทำต่อได้ตามกฎทองข้อ 10)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 542:** 🚰🌃 **ต่อยอดตามที่ผู้ใช้สั่ง "ทำ 1-2" — ถังน้ำยาล้างกระจกจำกัด + ไฟเมืองสะท้อนกลางคืน · `js/adventure3d.js` โซน 🌧️☀️ · deploy `.520` · SW v171**
  - **🚰 ถังน้ำยา (`washFluid` เต็ม 5):** ล้าง 1 ครั้งกิน 1 หน่วย · **หมดถัง = กดค้างไม่พ่น** (ATC เตือน + toast ให้ลงเติม) · **จอดสนิทเติมเอง** 1.1/วิ · เกจ 5 ขีดข้าง `#adv-wiper` (`.wfuel` · เหลือ ≤2 เหลือง ≤1 แดง) → เด็กต้องวางแผนใช้/หาที่ลงจอด · `renderWashGauge()` เรียกตอนล้าง/เติม/เข้าโลก
  - **🌃 ไฟเมืองสะท้อน (`drawCityGlow`/`cityRefl`):** เห็นเฉพาะ **กลางคืน + บินต่ำ (<32m)** — เม็ดแสงเกิดขอบล่างกระจก ลอยขึ้น เลื่อนข้างสวนการเลี้ยว (parallax จาก lateral vel) สีคละส้ม/ขาว/ฟ้า จางตามความสูง+หมอก · `composite='lighter'` ≤26 เม็ด · บินสูง/กลางวัน = ว่างเปล่า (`glow=heliNight*low`)
  - **ยืนยัน preview 1280×720 (ภาพจริง):** ล้าง 5 ครั้งสำเร็จ ครั้งที่ 6 ถูกปฏิเสธ (fluid 0 washing=false) · จอด→เติมเต็ม 5 · บินไม่จอด=คงเดิม · เกจ 3 ขีดฟ้า+2 ว่าง · กลางคืนต่ำ refl 13-24 glow .85 · บินสูง/กลางวัน refl 0 · ไม่มี console error · reload ปิดเสียงแล้ว · testkit ใหม่ `_t.heli.glass.{fluid,refl,glow}` + `washNow/setFluid/setGrime`
  - ⚠️ **เลข 538-541 ถูก session คู่ขนาน (invasion3d) ใช้ไปแล้ว** งานนี้จึงเป็นรอบ 542 (คนละระบบ ทำต่อได้ตามกฎทองข้อ 10)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 536:** 🧱🎥 **กล้องภายนอกเฮลิ (seat3) กันมุดตึก + สรุปว่า "ค่ากล้องเดิมดีแล้ว ไม่ต้องขยับ" · `js/invasion3d.js` TUNE ZONE `EXT_CAM` · deploy `.514`**
  - **ผู้ใช้สั่งจูนค่ากล้องต่อ → วัดจริง 9 ชุดค่า + ภาพจริง 4 ใบแล้วสรุปว่า "ไม่ควรเปลี่ยน"** · ⚠️ **บทเรียน: อย่าเชื่อ AABB ในการวัดกรอบภาพ** — `Box3.setFromObject` กินรัศมี**ใบพัดที่กำลังหมุน**เข้าไปด้วย รายงานว่า "ลอยนิ่งลำล้นจอ 150%×168% กล้องชิดหาง 4.2m" ทั้งที่**ภาพจริงลำอยู่กลางจอ ~55% สวยพอดี** · ชุดที่ถอยเป็น 17-20m กลับทำให้ลำเล็กจนดูไม่ออก (กฎทองข้อ 1: ภาพก่อนโค้ด)
  - **ของจริงที่ต้องแก้ (เจอระหว่างวัด): กล้องมุดตึก** — บินในซอย/จอดข้างตึก กล้องหลังลำไปโผล่ในผนัง เห็นแต่สีทึบ · เพิ่ม `extCamClear(ux,uz,want,camY)` = ยิงรังสีจากลำไปทางกล้อง หาจุดเข้าวงตึกต้นแรก (ray–circle 2D) แล้ว**ดึงกล้องเข้าหาลำ**จนพ้น (มาตรฐาน chase cam · ดันออกจะทะลุตึกอื่นต่อ) · ค่าใหม่ `wallTop 14 · wallPad 1.8 · minDist 5.5` (wallTop ตรงกับกันชนตอนบินชนตึก = ทำงานเฉพาะตอนบินต่ำกว่าหลังคา ตรงตามที่ควร)
  - **ยืนยัน runtime:** จอดข้างตึกที่ลานจอด → ดึงเข้า 5.5m **ภาพจริงยืนยันเดิมกล้องจะอยู่ในผนัง** · สไลด์ผ่านตึกที่ alt 5.5m → ระยะไล่ 5.4→9.2→14.2→16.5 **ไม่มีกระโดดเกิน 1.5m เลย (0/110 เฟรม · step สูงสุด 1.09m)** · บินสูงพ้นหลังคา = กลับเป็น 13→18.9m ปกติ · ต้นทุน `extCamClear` **6.2µs/เฟรม** (108 solids) ทิ้งได้ · วน seat 0-3 + ออกเครื่อง ไม่มี state ค้าง ไม่มี console error
  - 📌 มุมภายนอก draw call 443→480 (+8%) · tris 272k→391k (+44%) เพราะเห็นฉากกว้างกว่า (เวลาเฟรมวัดไม่ได้ pane ถูก throttle แกว่ง 13-100ms ทั้งสองมุม)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 538:** 🎬 **มุมกล้องภายนอกหลายมุมในโลกยานแม่ (ผู้ใช้สั่งต่อจาก 536) · `js/invasion3d.js` TUNE ZONE `EXT_VIEWS` · deploy `.516`**
  - **5 มุม:** ท้ายลำ / ข้างขวา / ข้างซ้าย / หน้าลำ / มุมสูง · สลับด้วยปุ่ม 🎬 `#inv-extcam` (โผล่เฉพาะตอนอยู่มุมมองภายนอก seat3 · วนกลับมาที่ท้ายลำเอง) หรือปุ่ม **C** (อยู่ในห้องนักบินกด C = เด้งออกมามุมภายนอกก่อน) · จำมุมล่าสุดใน `state.heliExtView`
  - **ค่าที่ไม่ระบุใน `EXT_VIEWS` = ตกไปใช้ `EXT_CAM`** → **มุมท้ายลำคงค่าที่จูน+ผู้ใช้ตรวจแล้วรอบ 533/536 เป๊ะ ไม่มีการคัดลอกค่าซ้ำให้หลุดกัน** · กันมุดตึก (`extCamClear`) + กันมุดดิน (`minUp`) ตัวเดิมทำงานกับทุกมุมอัตโนมัติ · ⚠️ มุมหน้าลำต้องใช้ `lag` สูง (6.0) เพราะกล้องยืนข้างหน้า ถ้าหน่วงมากลำจะพุ่งเข้าใส่กล้อง (วัดจริง lag 2.6 = เหลือ 7.2m ชิดไป → 6.0 = 9.9m)
  - **ยืนยัน runtime (1280×720 + ภาพจริง 2 ใบ 5 ช่อง · เฟรมเดินเองด้วย `_t.stepFrame` เพราะ pane ถูกซ่อน rAF หยุด):** มุมกางออกตรงองศาทุกมุม (0/90/−90/180/25.5°) · ลำอยู่กลางจอ 50% ทุกมุมแม้ตอนเลี้ยว (step กล้องสูงสุด 0.44m/เฟรม ไม่มีกระโดด) · จอดชิดตึกวนหัว 12 ทิศ = ดึงเข้า 5.5m ทุกมุมแนวราบ (มุมสูงไม่ต้องดึง เพราะกล้องพ้นหลังคา) · `minUp=12` ทดสอบ = ยกจริงทุกมุม · วน seat 0-3 + ลง/ขึ้นเครื่องใหม่ ปุ่มโผล่-หายถูก ไม่มี state ค้าง · จอเตี้ย 812×375 ปุ่มอยู่ในจอไม่ทับปุ่มอื่น · ไม่มี console error · reload ปิดเสียงแล้ว
  - ⚠️ เลข **537 ถูก session คู่ขนาน (adventure3d) ใช้ไปก่อน** → รอบนี้ขยับเป็น 538 ตามกฎทองข้อ 10 (คนละระบบ ทำต่อได้)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 539:** 👁️🎖️ **พลปืนประจำประตูสลับ "มุมมองภายนอก" ได้เหมือนนักบิน (ผู้ใช้สั่งต่อจาก 536/538) · `js/invasion3d.js` · deploy `.517`**
  - **ปุ่ม 👁️ `#inv-seat` โผล่ตอนเป็นพลปืน** = สลับ "ประตูลำ ↔ ภายนอก" (ปุ่ม **C** ก็ได้) · อยู่มุมภายนอกแล้วปุ่ม 🎬 วน 5 มุมเดิมได้ครบ · มุมภายนอก **ซ่อนปืนในมือ + ซ่อนกรอบ canopy** (คลาสใหม่ `.gunext`) · ค็อกพิต/เกจเป็นของนักบิน พลปืนไม่เห็น (บังคับด้วย `.gunner`)
  - **โครงโค้ด:** แยกกล้องภายนอกเป็น `extCamera(now,dt,cx,cy,cz,hy,spd,rollZ,opt)` ใช้ร่วมกัน 2 ฝั่ง + `extCamClear` รับจุดตั้งต้น (ox,oz) แทนการอ่าน `px,pz` — **`EXT_CAM`/`EXT_VIEWS` ที่จูนไว้รอบ 533/536/538 ไม่ถูกแตะเลย** · กล้องพลปืนอิง `host.obj` (จุดจ้อง = ตำแหน่งลำ+1.8 · ทิศ = `host.obj.rotation.y`) เพราะพลปืนไม่ได้บังคับทิศบิน · ความเร็วลำวัดจากตำแหน่งจริง (ไม่มี `phVel` ของลำเพื่อน/บอท)
  - ⚠️ **ต้นตอที่ต้องชดเชย: ลำบอทบินเร็วกว่าเพดานเฮลิผู้เล่น (วัดจริง ~25 vs 17 m/s)** → ใช้ค่ากล้องนักบินตรง ๆ กล้องค้างไกล 28m ลำกว้างแค่ 14% ของจอ (ภาพจริงยืนยัน เล็กจนดูไม่ออกว่าเกาะลำไหน) · เพิ่ม `EXT_RIDE={spdMul:0.25, catchUp:1.8}` (ลดการถอยตามความเร็ว + เร่งความไวไล่ตามตามส่วนที่เร็วเกินเพดาน) → ท้ายลำ 18.5m · ข้าง 14.6 · หน้า 9.2 · มุมสูง 20.9
  - **ยืนยัน runtime (1280×720 + ภาพจริง 2 ใบ 4 ช่อง · เดินเฟรมด้วย `_t.stepFrame`):** ลำอยู่กลางจอทุกมุม (sx 50-51% · sy 49-56%) · step กล้องนิ่ง ≤0.36 m/เฟรม · กดปุ่มจริง 👁️/🎬/คีย์ C ครบวง (จำมุมลง `state.heliExtView`) · กระโดดลง = คลาส/ปุ่ม/ปืนในมือคืนหมดไม่มีค้าง · นักบิน seat3 ยังได้ 12.5m เท่าเดิม (ไม่กระทบ) · `extCamClear` หลัง refactor ยังดึงกล้องเข้า 8.7m ตอนมีตึกขวางและปล่อย 18m ตอนกล้องพ้นหลังคา · จอเตี้ย 812×375 ปุ่มวางเท่าฝั่งนักบินเป๊ะ · ไม่มี console error · reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 543 (26 ก.ค.):** 💰 **ยุบพิธีจบรอบเหลือคำสั่งเดียว + เครื่องมือจับภาพกลาง (ผู้ใช้สั่งหาวิธีประหยัด token/รอบ) · ไม่แตะไฟล์เกม ไม่ deploy**
  - ใหม่ `tools/finish_round.sh` = บัมพ์ version→commit pin pathspec→rotate→deploy (ย่อ output)→curl ยืนยัน live→commit handoff→push ในก้อนเดียว (`--sw "โน้ต"` บัมพ์ SW · `--no-deploy` งานเอกสาร/tools · `--dry` ซ้อม) + ใหม่ `tools/snaplab.js` = `Snap.shot()` ภาพย่อ 820px / `Snap.grid([...])` หลายมุม/สถานะในภาพเดียว — เลิกเขียนโค้ด readPixels/composite ใหม่ทุกรอบ
  - อัปเดตกฎทอง #4 + แถว router ใน `HANDOFF.md` และขั้น "จบงาน" ใน skill `vocab-world` ให้ชี้คำสั่งใหม่
  - **ยืนยัน:** `--dry` 2 โหมดผ่าน · `node --check` ผ่าน · เทสต์จริงใน preview (GunLab.boot → Snap.shot 39KB + Snap.grid r93/rifle 2 ช่อง 35KB ป้ายชื่อ/ปืนต่างกันถูกต้อง) · ล้างเซฟ+reload ปิดเสียงแล้ว · รอบนี้ปิดด้วย `finish_round.sh --no-deploy` = เทสต์เส้นทาง commit จริง


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 544 (26 ก.ค.):** 🪓 **ผ่าไฟล์เฟส 1 — แยก CSS ยักษ์ 1,051 บรรทัดออกจาก `js/adventure3d.js` (12,010→10,959) เป็นไฟล์ใหม่ `js/adv3d_css.js` (`window.ADV3D_CSS` data ล้วน)** · `js/ui.js` เพิ่ม `loadAdv3d()` (โหลด part ก่อนไฟล์หลัก) แทนที่ 7 จุดโหลดตรง · `sw.js` precache เพิ่มไฟล์ใหม่
  - **ยืนยัน:** สคริปต์ตรวจก่อนตัด = ก้อน CSS ไม่มี `${}`/backtick/backslash · ในเกม `<style>` === `window.ADV3D_CSS` เป๊ะทุกไบต์ · เข้าโลกเฮลิฯ overlay/HUD (เหรียญ/คำศัพท์) ขึ้นครบตำแหน่งถูก (getBoundingClientRect) · ไม่มี console error · `node --check` ผ่านทั้ง 4 ไฟล์ · ล้างเซฟ+reload ปิดเสียงแล้ว
  - **เฟสถัดไป (2-4) อนุมัติแล้ว** → ดูหัวข้อ "🪓 คิวผ่าไฟล์" ด้านบน (เปิดแชทใหม่ทีละเฟส)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 545 (26 ก.ค.):** 🪓 **ผ่าไฟล์เฟส 2 — ดูด `INTRO` (data การ์ดวิธีเล่น 7 โลก · 66 บรรทัด 10410-10475) จาก `js/adventure3d.js` (10,959→10,894) เป็น `js/adv3d_intro.js` (`window.ADV3D_INTRO` data ล้วน)** · ไฟล์หลักเหลือ alias 1 บรรทัด · `loadAdv3d()` ใน `js/ui.js` เพิ่มโหลด part + `sw.js` precache
  - **ยืนยัน:** สแกนก้อนก่อนตัด ไม่มี `` ` ``/`${}`/`\` · JSON เก่า===ใหม่เป๊ะ (3,749B ทั้งคู่ ผ่าน node) · `node --check` ผ่าน 4 ไฟล์ · preview: การ์ด adv+heli ขึ้นถูก (h2/goal/3 แถวคีย์ตรง data · การ์ดอยู่ในจอเต็มใบ getBoundingClientRect) · ปุ่มเริ่มเล่น → `pvadv_intro_v1={"adv":1}` ถูก · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - **เฟสถัดไป: 3 (tex) / 4 (sfx)** — ดูหัวข้อ "🪓 คิวผ่าไฟล์" (เปิดแชทใหม่ทีละเฟส)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 546 (26 ก.ค.):** 🪓 **ผ่าไฟล์เฟส 3 — ดูดโซน Texture (letter/emoji/ผีไทย/ป้ายโฆษณา/ผนังตึก/ป้ายชื่อ peer) จาก `js/adventure3d.js` (10,894→10,694) เป็น `js/adv3d_tex.js` (225 บรรทัด IIFE `window.Adv3dTex`)** · ไฟล์หลักคง alias ชื่อเดิม + `Adv3dTex.bind({adRenterActive, adSeqBase})` inject ของ closure · `ghostGen`/`adRenters`/logic โฆษณา DB (adsFetch/adShop/flyby บรรทัด ~513-629) พัวพัน closure ไม่ย้าย · `loadAdv3d()` + `sw.js` precache เพิ่มไฟล์ใหม่
  - **ยืนยัน:** สคริปต์ตัดเช็ก anchor ทุกช่วง+replacement ครบ 6 จุด+assert ไม่เหลือ closure ref · `node --check` ผ่าน · preview: เข้าโลกเฮลิฯ (facade หน้าต่าง+ป้าย "ติดต่อโฆษณา"+เลขป้ายขึ้นถูก — ภาพยืนยัน) + โลก adv (แผ่นตัวอักษรสี+ป้ายตั้งพื้น ringAds ขึ้นถูก — ภาพยืนยัน) · เช็กตัวเลข: cache hit / adTexDraws ครบ 10 ป้าย / FACADE_ROWS / peer sprite scale 1.7&2.4 ถูก · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - **เฟสถัดไป: 4 (sfx — ตรวจ coupling ก่อนลงมีด)** — ดูหัวข้อ "🪓 คิวผ่าไฟล์" (เปิดแชทใหม่)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 547 (26 ก.ค.):** 🪓⛔ **ผ่าไฟล์เฟส 4 (sfx) — ตรวจ coupling แล้วตัดสินใจ "ไม่ผ่า"** ตามเงื่อนไขในแผนเอง (พัวพัน closure เยอะเกิน) · ไม่แตะไฟล์เกม ไม่ deploy · รายละเอียด `### รอบ 547` · **คิวผ่าไฟล์ปิดจ๊อบ** (adventure3d.js เหลือ 10,694 บรรทัด พ้นเกณฑ์ 12,000 แล้ว)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 548 (26 ก.ค.):** 🦵 **ท่าเดิน/วิ่ง/นั่งชันเข่า ทหาร peer+squad สมจริงแบบมนุษย์** (ผู้ใช้ติง "ขาแท่งตรงไม่มีเข่า") — ต้นตอ 2 ชั้น: ① โมเดล baked ขาข้างละชิ้นเดียว geometry ไม่มีรอยเข่า → หมุน joint ยังไงเข่าก็ไม่งอ ② สูตรเดิมเข่าพับผิดทิศ (rotation.x บวก=แข้งพับไปหน้า) · แก้ `js/invasion3d.js`: ใหม่ `skinSoldierLimb()` เย็บขาเป็น SkinnedMesh 3 กระดูก/ข้าง (สะโพก+เข่า+เชิงกรานไล่น้ำหนักกันขาหนีบฉีก) ใน `autoRigSoldier` · gait ชีวกลศาสตร์ใหม่ใน `poseSoldier` legOnly (เข่างอหนักช่วงเหวี่ยง-เหยียดตอนส้นแตะ · ย่อรับน้ำหนัก · สะโพกบิด/ถ่ายน้ำหนัก · เดิน=ตัวสูงสุดกลาง stance · วิ่ง=ลอย flight+โน้มตัว · เฟสสะสม+ครอสเฟดทุกการเปลี่ยนท่า ~0.25s) · นั่งชันเข่า 1 ข้าง (ก้นบนส้น เข่าหน้าสูงกว่าสะโพก — มุมคำนวณจากสัดส่วนจริง ต้นขา 0.365/แข้ง 0.513) · `fitSoldierGround` วัดขา skinned จาก bone (Box3 ไม่รู้จัก deform) · peer ยืนนิ่ง >4 วิ → นั่งชันเข่าอัตโนมัติ (เกมไม่มีปุ่มหมอบให้ซิงก์)
  - **ยืนยัน:** กริด 12 ท่า × 2 โมเดล (soldier_c + KSR-77) เข่างอถูกทิศทุกเฟส · เลขจุดแตะพื้นคุกเข่า: เข่าคุก 0.08–0.13 / เท้าหน้า 0.03–0.07 ✓ · ครอสเฟด hipsY ไล่เนียนไม่กระตุก · console สะอาด · `node --check` ผ่าน · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 549 (26 ก.ค.):** 🛸 **ย่อป้ายตัวอักษรบานหน้าต่างยานแม่ 4 เท่า** (ผู้ใช้ส่งภาพ: ป้าย "GRAVITY" บังจอ) — ต้นตอ: `BOARD_CELL=42` (ม.) วางใกล้ผู้เล่นแค่ 100ม. (`BOARD_Z=-100`) ทำให้แผ่นตัวอักษรจอเกือบเต็มจอ · แก้ `js/invasion3d.js` บรรทัด `BOARD_CELL` เหลือ `10.5` (÷4) เท่านั้น ไม่แตะ `BOARD_Y`/`BOARD_Z` (เคยจูนกันชนแผง HUD บนแล้ว)
  - **ยืนยัน:** preview เข้าโลกยานแม่ (mock ticket + `enterInvasion3D()`) → `InvasionWorld._t` ตั้งคำ "moon" + คำนวณขนาดป้ายจริงด้วย `camera.project()` บน mesh จริงในฉาก = สูง ~34px จากแคนวาส 720px (~4.7% จอ, เดิมจะ ~4 เท่า ≈19%) · `node --check` ผ่าน · screenshot ใช้ไม่ได้ (browser pane ปิดฝั่งผู้ใช้) ใช้ตัวเลข projection แทน


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 550 (26 ก.ค.):** 🛸 **ขยายยานแม่ 5 เท่า + ตัวอักษรพอดีหน้าต่างยาน** — `MS_R` 520→2600, `MS_Y` 360→1800, `MS_Z` -260→-1300 (ลำกว้าง 5,200ม. คลุมฟ้า 113% จอ) · `BOARD_CELL` 2.1→10.5 (×5 ตามลำ) ตำแหน่งแผงคงเดิม (y=198 z=-100 อ่านได้จาก pitch เริ่มต้น) · CORE คงเดิม (ต้องเล็งยิงได้) · แก้ z-offset ใน `buildWindowBar` จาก `MS_R*fraction` เป็น `cell*fraction` กัน z-fighting ที่ scale ใหญ่ · breathe ยาน 18→90 (สัดส่วนเดิม) แผง/แกนคงเดิม 3
  - **ยืนยัน:** `node --check` ผ่าน · preview เข้าโลกยานแม่ projection วัดจริง: board screenY=126 (visible), cell 22px (2.4%H), row 17%W, mother screenY=29 (visible), core screenY=337 (visible) · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 551 (26 ก.ค.):** 🛸 **ซ่อมบั๊กรอบ 550 "เข้าเกมแล้วไม่เห็นยานแม่เลย" + ดึงลงต่ำให้รู้สึกมหึมา** (ผู้ใช้ส่งภาพ ฟ้าโล่ง) — ต้นตอ: รอบ 550 ×5 ทั้ง Y/Z/R ทำให้**ท้องลำเงย 34°** พอดีขอบบนสุดที่จอเห็นได้ (FOV 68 = ±34°) → มองตรงไม่เจอ ต้องแหงนสุดถึงเห็น · แก้ `js/invasion3d.js`: `MS_Y` 1800→**1180**, `MS_Z` -1300→**-700** (MS_R คง 2600) + ใหม่ `MS_FLAT`/`MS_BELLY` (ท้องลำจริง 307 ม.) · ลำสำรองตอนรอ GLB ห่อกลุ่ม `hull` บีบ `scale.y=MS_FLAT/0.50` — ไม่งั้นหนามใต้ท้องยาวถึง y −260 ทิ่มทะลุพื้นทรายตอนเน็ตช้า · ลำแสงยานยิงจาก `MS_BELLY` แทน `MS_Y-MS_R*0.30` (เดิมเกิดกลางตัวลำ)
  - **⚠️ บทเรียนวางยาน (เขียนกันไว้ในโค้ดแล้ว):** ลำเป็น **ลิ่มแบน** กว้าง 5,200 หนาแค่ 1,237 → ต้องคิดจาก **ขอบหน้าลำ (MS_Z+618)** ไม่ใช่กึ่งกลาง · คิดจากกึ่งกลางพลาดมาแล้ว 2 ครั้งติด (รอบ 550 หลุดจอ · แก้ครั้งแรกได้แค่ "แถบมืดบาง" 15% จอ)
  - **ยืนยัน (raycast 25×25 วัดเงายานบนจอจริง ครบ 8 มุมหมุน — ยานหมุน `dt*.02` ตลอด เงาเปลี่ยนตลอด):** กลางจอโดนยาน **0%→40–52% ทุกมุม** (มองตรงเห็นเสมอ) · กว้าง 0–100% จอตอนหันด้านยาว, แคบสุด 28–72% · ท้องลำ 307 ม. > แถวตัวอักษร 198 > เนิน 49 ✓ · ตัวอักษรคอนทราสต์ 80–83 อ่านออกบนพื้นลำมืด ครบ 6 ตัว @จอ 26% · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 552 (26 ก.ค.):** 🛸 **ลดยานแม่ลงต่ำสุด ให้ท้องลำแผ่คลุมเมือง** (ผู้ใช้ติงรอบ 551: "สูงเกินไป เห็นใต้ท้องไม่ทั่ว ต้องต่ำกว่านี้ให้ทั่ว จะได้เห็นว่าคุมเมืองจริงๆ") — แก้ `js/invasion3d.js` `MS_Y` 1180→**1000**, `MS_Z` −700→**−1200** (MS_R คง 2600) · ท้องลำ 334→**156 ม.** (ต่ำลงกว่าครึ่ง)
  - **🔑 กฎใหม่ที่วัดได้ (สวนสามัญสำนึก — เขียนกันไว้ในโค้ดแล้ว):** ลำเป็นแผ่นแบนลอยขนานพื้น → **ยิ่งต่ำ+ยิ่งไกล ท้องลำยิ่งแผ่คลุมจอ** · **ดึงเข้าใกล้ = ลำหลุดขึ้นเหนือหัว กินจอน้อยลง** (วัดจริง Y1000: Z−500 กิน 22% · Z−1200 กิน 34% · Z−2500 กิน 16%) — กวาดตาราง Y×Z ด้วย raycast เลือกยอดสูงสุด
  - **ยืนยัน (raycast 17×17 ครบ 8 มุมหมุน):** กลางจอโดนยาน **0→59–65% ทุกมุม** (เดิมรอบ 551 = 0–44/47%) · กินจอ 19–49% (เดิม 20–22%) · กว้างเต็มจอ 0–100% ตอนหันด้านยาว · ท้องลำ 156 > เพดานยานลูก 80 > เนิน 49 ✓ · แผงตัวอักษร z−100 อยู่นอกเงาลำ (ลำกิน z −1818..−582) จึงไม่ชนแม้ท้องลำต่ำกว่า BOARD_Y=198 · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - **🚨 บทเรียนเครื่องมือ (สำคัญ — อย่าเสียเวลาซ้ำ): `Snap.grab()`/readPixels ใน `tools/snaplab.js` เชื่อไม่ได้ในโลกยานแม่** — ทดสอบชี้ขาดโดยทาสีลำเป็นบานเย็นทั้งลำแล้ว **พิกเซลไม่เปลี่ยนเลย** + ภาพเพี้ยนคนละแบบทุกครั้งที่ grab (เกม render หลาย pass · `step()` ยังรีเซ็ต `visible` ด้วย) · **ให้วัดด้วย `THREE.Raycaster().setFromCamera` ยิงตารางจุดใส่ `_t.mother` แทน** (ใช้กล้องจริง+เรขาคณิตจริง = สิ่งที่ผู้เล่นเห็นจริง) · ตรงกับกฎ HANDOFF "เชื่อตัวเลข ไม่เชื่อ screenshot"


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 553 (26 ก.ค.):** 🔒 **ตรึงยานแม่นิ่ง เลิกลอยขึ้นลง** (ผู้ใช้สั่ง "ไม่ต้องขยับยานขึ้นลง ให้ค้างต่ำไว้ก่อน ให้เห็นใต้ท้องยานที่กว้างใหญ่") — ต้นตอ: รอบ 550 ขยายแอมพลิจูดลอยหายใจตามลำที่โต 5 เท่า (18→**±90 ม.**) พอรอบ 552 ลดลำลงต่ำ ท้องลำเลย**วืดขึ้นลงช่วง 66–246 ม.** — จังหวะต่ำสุดหลุดใต้เพดานยานลูก (80) จังหวะสูงสุดลอยพ้นเฟรม เห็น ๆ หาย ๆ · แก้ `js/invasion3d.js` `tickMother`: `mother.position.y=MS_Y` เฉย ๆ (ตัด `Math.sin(...)*90` ทิ้ง) · แผง/แกนยังหายใจ ±3 ม. ตามเดิม (เล็กมาก ไม่กวน)
  - **ยืนยัน:** เดินเกม 240 เฟรม ความสูงลำ = 1000.0 ทุกช่วง **นิ่งสนิท** · ท้องลำคงที่ **154 ม.** ทุกเฟรม (เดิมแกว่ง 66–246) · raycast 8 มุมหมุน: กลางจอโดนยาน 0→59–65% · กินจอ 19–49% · กว้างเต็มจอ 0–100% ตอนหันด้านยาว (เท่ารอบ 552 — ตำแหน่งไม่เปลี่ยน แค่หยุดแกว่ง) · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ **ถ้าจะเอาการลอยหายใจกลับมา**: คุมให้ท้องลำไม่ต่ำกว่า ~120 ม. = แกว่งได้ไม่เกิน ±35 (คอมเมนต์เตือนไว้ในโค้ดแล้ว)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 554 (26 ก.ค.):** 🚨 **เจอต้นตอจริงของ "ยานแม่หายทั้งลำ ฟ้าโล่ง" — โดมท้องฟ้าบังยาน** (ผู้ใช้ส่งภาพ 2 รอบติด "ไม่เห็นอะไรเลย") — `skyDome` เป็น `SphereGeometry(WORLD*1.9)` = **รัศมีแค่ 798 ม.** BackSide + เขียน depth ตามปกติ · พอรอบ 552 ย้ายยานไป z−1200 (ไกล ~1,231 ม.) ตัวยาน **อยู่นอกโดม** → โดมวาดทับมิดทั้งลำ (รอบ 551 ที่ z−700 ยังอยู่ในโดมจึงพอเห็นเป็นก้อน) · แก้ `js/invasion3d.js` แบบ skybox มาตรฐาน: `dome.material.depthWrite=false; dome.renderOrder=-1` (โดมวาดก่อนใครและไม่จองความลึก → ทุกอย่างวาดทับได้ ไม่ว่าไกลแค่ไหน) · **หน้าตาโดมเหมือนเดิมเป๊ะ** ไม่ได้ขยายรัศมี
  - **🧭 บทเรียนวิธีวัด (สำคัญกว่าตัวบั๊ก — ผมวัดผิดมา 2 รอบ):** `raycaster.intersectObject(mother)` บอกได้แค่ **"ยานอยู่ตรงนั้น"** ไม่ได้บอกว่า **"มองเห็น"** — รังสีทะลุ geometry โดยไม่สนใจ depth/การบัง · **วิธีที่ถูก: `intersectObjects(scene.children,true)` แล้วเช็กว่าชิ้นแรกที่ "เขียน depth + ไม่โปร่งใส" คือยานหรือไม่** (ต้องกรอง Points/Sprite/โดม ที่ `depthWrite:false` ออก ไม่งั้นนับเป็นตัวบังผิด ๆ) · ฟังก์ชัน `visShip()` ที่ใช้วัดรอบนี้อยู่ในบันทึกรอบ 554
  - **ยืนยัน:** ไล่รังสีกลางจอบนได้ลำดับ: ดาว(depthWrite:false) → โดม 927 ม.(depthWrite:false, renderOrder −1) → **ยานแม่ 1,231 ม.(depthWrite:true)** = ยานเป็นผิวทึบชิ้นแรก ✓ · วัด 4 มุมหมุน: **เห็นยาน 16–25% ของจอ · กลางจอ 0–59% ทุกมุม** (ก่อนแก้ = 0% ทุกมุม) · ตัวบังที่เหลือเป็นตึก/สายไฟ ซึ่งถูกต้อง · ท้องลำคงที่ 154 ม. ลำนิ่ง 1000.0 · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ **ห้ามเอา `depthWrite=false; renderOrder=-1` ออก** ไม่งั้นทุกอย่างที่ไกลเกิน 798 ม. จะหายเงียบ ๆ (คอมเมนต์เตือนไว้ในโค้ดแล้ว)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 555 (26 ก.ค.):** 🔠 **แผงตัวอักษรยานแม่ → 2 แผงขนาบซ้าย-ขวา ใหญ่ขึ้น ~10 เท่า (เนื้อที่บนจอ)** + 🚁 **เดินเข้าไปในเฮลิ = ขึ้นเครื่องเลย ไม่ต้องแตะปุ่ม** — แก้ `js/invasion3d.js` ที่เดียว
  - แผง: `BOARD_CELL` 10.5→**35** · `BOARD_Y/Z` 198/−100→**300/−290** · ใหม่ `BOARD_SIDE_X=242` `BOARD_TILT=0.624` `BOARD_TOE=0.533` · `buildWindowBar` สร้าง 2 กลุ่มซ้าย-ขวา **ใช้ material ร่วมกันต่อบาน** (เปลี่ยนตัวอักษร/ไฟกะพริบทีเดียวติดทั้ง 2 แผง — `layoutLetterPanels` แค่สลับ `visible` เป็น array)
  - 🚨 **ทำ "ขยายชิ้นงาน ×10 จริง" ไม่ได้ (วัดแล้ว 4 รอบ — อย่าย้อนรอย):** cell 105 = แผงกว้าง 1,002 ม. ต้องถอยไป ~1,180 ม. ถึงพอดีจอ 2 แผง · ที่ระยะนั้นถ้ายกสูงจะ**จมในลำยาน** (ลำหมุน `dt*.02` กระดูกงูกวาดบัง 14–42% ของบาน) ถ้ากดต่ำก็**โดนตึกบัง 30%** (เห็นชัดในภาพเรนเดอร์) → ทางออก = **วางใกล้เหมือนเดิม (หน้าลำ ลำจึงบังไม่ได้เลย) แล้วขยาย cell เท่าที่จอรับไหว** = แผงละ 41% ของจอ (เดิมแผงเดียว 13.3%) ×2 แผง ≈ เนื้อที่ตัวอักษรรวม 10 เท่า
  - เฮลิ: ใหม่ `AUTO_BOARD_DIST=5.5` + `autoBoardLock` + `tickAutoBoard()` (เรียกใน `updateGunnerBtn`) · ล็อกตอน `enterHeli/exitHeli/dismountGunner` ปลดเมื่อเดินพ้นรัศมี 10 ม. — กันเด้งขึ้นซ้ำตอนกด 🪂 ลงมาแล้วยังยืนคาลำ · ป้ายพวงมาลัยเปลี่ยนเป็น "🚁 เดินเข้ามาขึ้นเครื่อง" (ปุ่มยังกดได้เป็นทางสำรอง)
  - **ยืนยัน (raycast จากกล้องจริง 5–10 จุดยืน × 8 มุมหมุนลำ):** ลำบังตัวอักษร **0%** · ตึกบังเฉลี่ย **6%** · มีตัวลำเป็นพื้นหลัง **73%** (ดูเหมือนแปะบนลำจริง) · หน้าแผงหันหาผู้เล่น dot **0.997** · แผงซ้าย x7..44% ขวา x56..93% y12..35% (พ้นแผงคำ HUD x41..59% y1..12%) · เฮลิ: ห่าง 9 ม. ไม่ขึ้น → 3 ม. ขึ้นเอง → ลงแล้วยืนคาลำ **ไม่เด้งขึ้นซ้ำ** → เดินออก 40 ม. กลับมา 2 ม. ขึ้นได้อีก · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 556 (26 ก.ค.):** 🔤 **กติกาใหม่โลกยานแม่ทั้งระบบ (ผู้ใช้สั่งเปลี่ยนแผน — แทนแผงตัวอักษร+แกนพลังงานเดิม)** — แก้ `js/invasion3d.js` ที่เดียว: ❌ถอดแผงแดง 2 แผง (BOARD_*/buildWindowBar/msBoard) + แกนพลังงาน (msCore/msGlow/damageMother/msOpen) ออกถาวร · ✅ยานลูก **26 ลำ = a-z ครบชุด** (ลำที่อยู่ในคำ=ป้ายเขียวใหญ่ 8.5 หน่วย · ลำอื่นป้ายฟ้า 7.0) · เกราะยานแม่=สัดส่วนช่องคำที่ยังไม่ติด ยิงลำตรงตัวอักษร→ติดทุกช่องซ้ำพร้อมกัน→เกราะลด · ครบคำ=เกราะ 0→ระเบิด=+`REWARD` 100 · ยิงยานลูกตกลำละ `LETTER_COIN` 1 · ⏰`WORD_TIME` 90 วิ/คำ หมดเวลา→หัวหน้าห้อง pickWord ใหม่+เวฟ 26 ลำใหม่ (`tickWordTimer` ใน frame) · sync ออนไลน์: บิต `myKill` เปลี่ยนความหมายเป็นดัชนี a-z (0..25) ช่องดาเมจใน payload ส่ง 0 คงรูปแบบ · ถ่วงช่วงยิงยานลูก ×(จำนวน/8) กันโดนรุม 26 ลำ · HUD คำเป็นเขียวหม่น→ติดเขียวสว่าง + โชว์เกราะ%+จำนวนลำ+วินาทีตลอด
  - **ยืนยัน (preview จริง):** เกิด 26 ลำ · คำ sun: ยิง 21 ลำได้ 21 เหรียญ เกราะ 100→66.7(n)→33.3(s)→0(u ครบคำ) ระเบิดทั้งที่เหลือ 5 ลำ · +100 โบนัส (21→121) · เวฟใหม่ car มาเอง 26 ลำ เกราะ 100 · จำลองเวลา +95 วิ → เปลี่ยนคำ foot + เติมครบ 26 · ป้ายเขียว 3 ใบ=f,o,t (วัด rgb 125,255,171) ฟ้า 23 · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ **เฝ้าดู perf มือถือ:** ยานลูก 26 ลำ (โมเดล lite 8.2k tris/ลำ) — ถ้าเด็กบ่นกระตุก ค่อยลด poly/ใช้ LOD · ⚠️ preview session นี้: dev server quota เต็ม (5 entry ค้างของ session อื่น ไม่มีตัวไหนฟัง port จริง) → ใช้ `python -m http.server 8788` ชั่วคราวแล้ว kill ทิ้งแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 557 (26 ก.ค.):** ❤️🧱📢 **6 คำสั่งต่อยอดกติกายานแม่** — แก้ `js/invasion3d.js` ที่เดียว: ①แถบพลังใต้ป้ายตัวอักษรยานลูก (`drawFighterBar` canvas sprite วาดเฉพาะตอน hp เปลี่ยน · >60% เขียว/30-60% เหลือง/≤30% แดง) ②`F_HP` 3→**20** = ไรเฟิล(dmg1) 20 นัด · `MIS_DMG`/`PH_MIS_DMG` →**10** = 2 นัด · R93 →dmg 5 (4 นัด เลิกวันช็อต — อัปเดตการ์ดวิธีเล่นแล้ว) · ทหาร 0.5→2 · จรวดพันธมิตร dmg 4 ③`MS_HP` 100 = 5×F_HP ④**กันชนกล่องหมุนได้** `solidPushOut` (วงกลมเดิม r=0.55·ด้านยาว < ครึ่งทแยง → เดินทะลุ "มุมตึก" ได้) · solids เก็บ `hw/hd/rot/top/tall` ⑤เฮลิชนตึกจริงตามยอด `top` = **พังทันที** (`heliCrash`: boom+exitHeli+ตายถอยตั้งหลัก · ของเตี้ยไม่นับ) + **GPWS "Terrain! Terrain!"** (`tickGpws`: ต่ำ<12 ม. หรือพื้นข้างหน้า 1.2 วิ <9 ม. · toast แดง+เสียงพูด อังกฤษ · คูลดาวน์ 4 วิ) ⑥`REWARD` 100→**500**
  - **ยืนยัน (preview จริง):** แถบพลังเปลี่ยนสีจริง เขียว(58,255,122)@80% เหลือง(255,210,58)@50% แดง(255,74,58)@20% · เดินกด a ชนกำแพงตึกหยุดที่ x−10.66 นิ่ง 400 เฟรม ไม่ทะลุ · วางตัวในตึกแล้ว 1 เฟรมถูกดันออก · เฮลิเทคออฟ→ GPWS ขึ้น "⚠️ TERRAIN! TERRAIN!" → พาเข้า footprint ตึก = เครื่องพัง inHeli=false เกิดใหม่แนวหลัง (−19,231) · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ กระสุน/มิสไซล์ทดสอบ e2e เต็มไม่ได้ในแท็บ throttled (เวลาบิน missile ใช้เวลาจริง) — ค่าดาเมจต่อสายตรงกับค่าคงที่ ยืนยันระดับโค้ด · บอทเฮลิ/ยานลูกยังบินทะลุตึกได้ (ไม่ได้สั่ง+เปลืองเฟรม AI หลบ — จดไว้เผื่อผู้ใช้อยากได้)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 558 (26 ก.ค.):** 📢🔊 **เสียง beep เตือนบินต่ำ (GPWS) ในโลกยานแม่** — แก้ `js/invasion3d.js` ที่เดียว: เพิ่ม `Snd.gpws(urg)` ในโซนเสียงสังเคราะห์ (บี๊บ square+ฮาร์โมนิก sine ผ่าน lowpass กันบาดหู · urg 0→1 ยิ่งใกล้พื้นยิ่ง **ถี่/สูง/ดัง**: 3 ครั้ง 900Hz gap .16 → 4 ครั้ง 1200Hz gap .11) · `tickGpws` คำนวณ urg จากระยะพ้นพื้นเทียบเพดาน 12 ม. → บี๊บก่อน แล้ว **หน่วงเสียงพูด "Terrain! Terrain! Pull up!" ให้ตามหลังชุดบี๊บพอดี** (เดิมพูดทับ) · เสียงพูดถูกกั้นด้วย `Snd.on()` แล้ว (เดิมปิดเสียงในเกมแต่ยังพูด) + `exitWorld` เคลียร์คิวพูดค้าง
  - **ยืนยัน (preview จริง · ดักจับ AudioContext.createOscillator + speechSynthesis.speak):** alt 10 ม.→urg .167 = 3 บี๊บ 950/1900Hz gap .152 · alt 1 ม.→urg .917 = 4 บี๊บ 1175/2350Hz gap .114 · เสียงพูดยิงที่ +500 ms = หลังบี๊บครบพอดี · คูลดาวน์ 4 วิ กันซ้ำได้จริง · `state.sound=false` → 0 oscillator + ไม่พูดเลย · alt 11.9 ม. ยังเตือน (ขอบเพดาน) · ป้ายแดง `#inv-ban` โชว์ปกติ · `exitWorld` ตอนมีคิวพูดค้าง = ไม่มีเสียงหลุด · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ preview: dev server quota เต็ม (5 entry ของ session อื่น) → ใช้ `python -m http.server 8790` ชั่วคราวแล้ว kill ทิ้งแล้ว (เหมือนรอบ 556)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 559 (26 ก.ค.):** ⛽🌡️🚨 **เสียงบี๊บเตือนของเกจเฮลิในโลกยานแม่ (น้ำมันต่ำ/เครื่องร้อน/รอบเกิน)** — แก้ `js/invasion3d.js` ที่เดียว: `Snd.gauge(kind,lv)` ใช้โครงเดียวกับ `Snd.gpws` (square+ฮาร์โมนิก sine ผ่าน lowpass) แต่ **แยกเสียงประจำดวง** ⛽520Hz ต่ำช้าเสียงตก · 🌡️700Hz ไล่เสียงขึ้น · 🚨1150Hz ถี่รัว · lv1 เหลือง = 2-3 ครั้งเบา/ห่าง · lv2 แดง = ความถี่ ×1.12 ดังขึ้น 1.45 เท่า เพิ่มอีก 1 ครั้ง ถี่ขึ้น · ใหม่ `heliLampLv()` = แหล่งความจริงเดียวของระดับไฟ (เดิมสูตรก๊อป 2 ที่: `cpLamps` กับ `_t.heliGauges`) ใช้ร่วมทั้งวาดไฟ/เสียง/เทสต์ · `tickHeliAlarm(now)` เรียกท้าย `tickHeliGauges` (ดังเฉพาะตอนอยู่ในเฮลิ) ดัง **ทีละดวง** เลือกวิกฤตสุด เรียง รอบเกิน→ร้อน→น้ำมัน · ไฟแรงขึ้นดังทันที · ย้ำ เหลือง 7 วิ/แดง 2.8 วิ · ไฟ "เสียหาย" ไม่มีเสียง (มีเสียงโดนยิงอยู่แล้ว) · `resetHeliAlarm()` ตอนขึ้นเครื่องใหม่
  - **ยืนยัน (preview จริง · ดักจับ AudioContext.createOscillator):** ⛽ 24%→เหลือง 2 บี๊บ 520Hz gap .26 · 9%→แดง 3 บี๊บ 582.4Hz gap .19 **ดังทันทีทั้งที่ยังไม่พ้นคูลดาวน์** (ยกระดับ) · ย้ำภายใน 7 วิ = 0 oscillator · พ้น 7 วิ = ดังใหม่ · 🌡️ .85→700Hz ×2 · .95→784Hz ×3 gap .14 · 🚨 1.18→1150Hz ×3 gap .11 · 1.30→1288Hz ×4 gap .08 · ย้ำแดงภายใน 2.8 วิ เงียบ / เกิน = ดังใหม่ · **3 ดวงแดงพร้อมกัน = ได้ยินแค่รอบเกิน** พอรอบตกเหลือ 1.0 → ร้อนขึ้นมาดังทันที · ขอบเกณฑ์เดิมไม่เพี้ยนหลังรวมสูตร (rpm 1.169=ดับ/1.17=เหลือง/1.249=เหลือง/1.25=แดง) · `state.sound=false` → 0 oscillator แต่สถานะยังเดิน · หน้าปัดยังวาดปกติ (gaugePix 16197→19168 ตอนไฟเตือนติด) · เข้าเครื่องใหม่ = รีเซ็ตครบ · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ **ทดสอบขับบินจริงไม่ได้ในรอบนี้** — Browser pane ไม่ถูกแสดง → ไม่ compositing → `requestAnimationFrame` ไม่เดิน (เข้าเฮลิได้แต่เกจไม่ขยับ) จึงขับผ่าน `_t.setHeliGauges(f,t,r)` (เพิ่มพารามิเตอร์ที่ 3 = รอบเชิงกล `cpRpm`) + เรียก `_t.tickHeliAlarm(now)` เอง · การต่อสายในไฟล์ที่เสิร์ฟจริงยืนยันด้วย regex (`tickHeliAlarm(now);` อยู่ท้าย `tickHeliGauges`) · dev server quota เต็มอีก → ใช้ `python -m http.server 8792` แล้ว kill ทิ้งแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 560 (26 ก.ค.):** 🔥🚁 **ไฟเตือน "ร้อน" ดวงแดงมีผลกับการบินจริง (ผู้ใช้สั่ง)** — แก้ `js/invasion3d.js` ที่เดียว: ใหม่ `cpHot` 0..1 = "ความล้าจากความร้อน" · ไฟแดงค้าง (`cpEngT≥ENG_HOT`) → ไต่เต็มใน `HOT_FULL` 8 วิ · ฟื้นเมื่อเย็นพ้นโซนเหลือง (`<ENG_WARN`) ใน `HOT_RECOVER` 6 วิ · **อยู่ช่วงเหลืองค้างไว้เท่าเดิม (hysteresis) — แตะผ่อนแป๊บเดียวไม่พอ** · `heliLift()=1−cpHot×(1−HOT_PWR_MIN .35)` คูณเฉพาะ **แรงยกขาขึ้น** ใน `tickHeliFlight` (`colUp`) + แรงทะยานตอนเทคออฟ · 🛡️ **ขาลง/ลอยนิ่งไม่ถูกแตะ = ไม่มีวันร่วงจากฟ้า** (ปลอดภัยกับเด็ก) · เพิ่มแรงสั่นเครื่องเมื่อ `cpHot>.3` + ตัวเลข **"ยก xx%"** ใต้ป้ายความร้อนบนหน้าปัด + toast เตือน "ผ่อนคันเร่ง" ตอนเริ่มตก / toast "เย็นแล้ว กำลังยกเต็ม" ตอนฟื้น · รีเซ็ตตอนขึ้นเครื่องใหม่
  - **ยืนยัน (preview จริง · บินจริงด้วย `_t.stepFrame` + ยิง keydown Space/Shift):** กดคันเร่งเต็ม → วิ 1-3 ไต่ 5.0 ม./วิ ไฟดับ · วิ 4 เหลือง · วิ 5 **แดง** เริ่มสะสม · วิ 13 `hot=1 lift .35` ไต่เหลือ **1.75 ม./วิ (=35% เป๊ะ)** · ผ่อนคันเร่ง: อยู่โซนเหลือง 2 วิ **`hot` ค้าง 1.0 ไม่ฟื้น** (hysteresis ทำงาน) → พ้นเหลืองวิที่ 4 เริ่มฟื้น → เต็ม 100% ใน 6 วิ + toast "เครื่องเย็นลงแล้ว" · **ตลอดช่วงผ่อน dY=0.00 ทุกวินาที = ลอยนิ่ง ไม่ตก** · toast เตือนเด้งที่ `hot=.121` (เกณฑ์ .12) · เทคออฟตอนร้อนเต็ม = แรงทะยาน 0.0146 vs เย็น 0.0417 = **ratio .350 เป๊ะ** · หน้าปัดวาด "ยก xx%" เฉพาะตอนร้อน (gaugePix 8859→9126) · เข้าเครื่องใหม่ = `hot` กลับ 0 · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว
  - ⚠️ preview: dev server quota เต็ม (5 entry ของ session อื่น) → ใช้ `python -m http.server 8795` แล้ว kill ทิ้งแล้ว · rAF ไม่เดินในแท็บที่ไม่ได้แสดง → ขับเฟรมเองด้วย `_t.stepFrame(dt)` (ช่วงสตาร์ท 10 วิ ใช้เวลาจริง ต้อง `await` คู่กับการ step)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 561 (26 ก.ค.):** 🚁🎨 **เปลี่ยนโมเดลเฮลิในโลกยานแม่เป็น `heli_ca.glb` (ผู้ใช้สั่ง)** — ตรวจแล้วเป็น **ลำเดียวกับของเดิมเป๊ะ** (48,011 tris · bbox 0.789×0.19×0.485 · node `tripo_part_*` ครบ 29 เท่ากัน) ต่างแค่ **เทกซ์เจอร์ = ลายพรางทะเลทราย** (ของเดิมลายแดง/น้ำเงิน) → สเกล/ทิศ/ชื่อ node ใบพัดใช้สูตรเดิมได้หมด ไม่ต้องจูนใหม่
  - **⚡ ทำตัวลดโพลีตามสูตร `handoff/NOTES.md`** → `img/models/heli_ca_lite.glb` **10,113 tris / 446KB** (พอ ๆ กับ `helicopter_lite.glb` เดิม 9,579/442KB — สนามรบมีได้ 5 ลำ+ลำเพื่อน) · ต้นฉบับ 2.3MB เข้า `.gitignore` เก็บในเครื่องอย่างเดียว · **โลกเฮลิฯ ยังใช้ `helicopter.glb` เดิม ไม่ถูกแตะ**
  - **🎨 เลิก "ตัด map ทิ้งแล้วทาสีทับ" (สูตรรอบ 531)** — ลำใหม่พ่นลายพรางมาในเทกซ์เจอร์แล้ว ถ้ายัง null map ไว้จะเห็นเหมือนเดิมเป๊ะ = เปลี่ยนโมเดลแล้วไม่มีผล · ตอนนี้เก็บ `map` + คูณสีขาว (เห็นลายจริง) · มี fallback ถ้าโมเดลไม่มีเทกซ์เจอร์ → ถอยไปทาสี `HELI_DESERT` แบบเดิม กันลำขาวโพลน
  - **ยืนยัน (preview จริง · snaplab 4 มุม + วัดตัวเลข):** ลำจอดครบ 5 `ready:true` · ภาพ 4 มุม (ข้าง/หัว/ท้าย/มุมสูง) เห็น **ลายพรางทราย-น้ำตาลเข้ม** ชัด ทิศหัวถูก สกีแตะพื้น กลืนทะเลทราย · กลุ่มมีใบพัด 6 ก้อนในฉาก **`_rotor` 3 ชิ้น / `_trotor` 4 ชิ้นครบทุกลำ** (ชื่อ node รอดจากการลดโพลี) · สตาร์ทเครื่องแล้วใบพัดหมุนจริง (main +92 rad/2 วิ · tail หมุนตาม) · บอท/ลำพันธมิตรใช้ `heliModel()` ตัวเดียวกัน = เปลี่ยนตามหมด · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 564 (26 ก.ค.):** 🎯🔒 **ล็อกหลายเป้าพร้อมกัน + ยิงมิสไซล์รัวทีละชุด + ปืนเฮลิแรง 3 เท่า (ผู้ใช้สั่ง)** — ต่อยอดเรดาร์รอบ 563 แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🎯🔒 รอบ 564` เหนือ `radarPick`): เดิมล็อกได้ทีละลำ → ใหม่ **กวาดหัวลำเก็บได้สูงสุด 4 ลำ** (`RDR_MAX_LOCK`) แต่ละลำนับเวลาจ่อ **ของใครของมัน** (`rdrLocks[{f,since,on}]` แทน `rdrTgt/rdrLocked`) ครบ 850 ms ก็ติด 🔴 LOCK เอง · กด 🚀 ครั้งเดียว = คิว `misQ` ยิง **ชุดละ 2 ลูกต่อลำ** (`SALVO_PER_TGT` — พอฆ่า F_HP 20) ห่างในชุด 110 ms ห่างระหว่างชุด 280 ms · ยิงแล้วปลดล็อกชุดนั้นให้กวาดจับใหม่ทันที · **เป้าที่ตกก่อนถึงคิว = ข้าม ไม่เปลืองลูก** · ลูกไม่พอ = ยิงเท่าที่มี · **ยิงตอนไม่ล็อก = ของเดิมเป๊ะ (2 ลูก ไม่นำวิถีแรง)**
  - **ของใหม่บนจอ:** กรอบล็อก 4 ใบ (`#inv-locks` > `.inv-lk` สร้างตอน init) ป้าย ①②③④ เหลืองประ=จับเป้า → แดงทึบ=LOCK · จอเรดาร์เพิ่มตัวเลข **"LOCK x N"** ใต้วง (จุดแดง=ล็อก เหลือง=กำลังจับ เขียว=ยานลูกอื่น) · toast บอกจำนวนลำที่ล็อก/จำนวนชุดที่ยิง
  - **🔫🚁 ผู้ใช้สั่งกลางรอบ:** ปืนกลติดเฮลิแรงกว่าปืนคนถือ 3 เท่า → `HELI_GUN_MUL=3` · `PH_GUN_DMG=GUN_DMG*3=3` (ยานลูกตกใน **7 นัด** แทน 20) · ปืนคนถือ/พลปืนประจำประตูไม่ถูกแตะ (`GUN_DMG` ยังเป็น 1)
  - **ยืนยัน (preview จริง · `_t.stepFrame` เดินเฟรมเอง):** จ่อฝูง → รับเป้า 4 ลำใน 478 ms → **ล็อกครบ 4 ที่ 1,379 ms** (`q🔴 d🔴 e🔴 k🔴`) · ล็อก 4 แล้วกด 🚀 → คิว 8 ลูก ออกจริงตามจังหวะ `v@0 v@108 k@388 k@498 m@778 m@888 e@1168 e@1278` ธง `hard` ครบ · ล็อก 2 ลำ → ยิง 4 ลูก เป้าตกจริง (เหรียญ +3 ยานลูก 25→22) · **ฆ่าเป้าลำสุดท้ายกลางคิว → ยิงแค่ 4 จาก 6 ลูก (ประหยัดไป 2)** · ไม่ล็อกแล้วกดยิง = 2 ลูก `hard:false lock:null` คิวว่าง · กรอบ 4 ใบวางบนตัวยานจริงคนละจุด (`getBoundingClientRect` 599/563/647/707 px) 2 ใบ `.on` · จอเรดาร์วาด "LOCK x3" (พิกเซลแถบล่าง 408→1,304 · แดง 0→801 · เซฟภาพดูแล้ว) · ปืนเฮลิยิงยานลำ HP 20 **ตกใน 7 นัด** เป๊ะตามสูตร · ลงจากเครื่อง = เรดาร์ดับ กรอบหาย คิวยิงถูกล้าง · เดินเท้าไม่มีเรดาร์ · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว

- **รอบ 563 (26 ก.ค.):** 🎯📡 **เรดาร์ล็อกเป้ายิงมิสไซล์แบบ Ace Combat ในเฮลิโลกยานแม่ (ผู้ใช้สั่ง)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🎯📡 รอบ 563` เหนือ `lockTarget`): จ่อหัวลำใส่ยานลูก → 🔶 จับเป้า → ค้าง `RDR_LOCK_MS` 850 ms → 🔴 **LOCK** → กด 🚀 มิสไซล์ **ดิ่งเข้าลำที่ล็อกเอง** · เดิมมิสไซล์ "เดาเป้า" ตอนกดยิง (`lockTarget`) ผู้เล่นไม่รู้ล่วงหน้า + เบนอ่อน (lerp 2.6) จนพลาดบ่อย
  - **กติกาเรดาร์:** ระยะ `RDR_RANGE` 200 ม. · กรวย**ค้นหา** ~17° (`RDR_FIND .955`) แคบ = ต้องจ่อจริง · กรวย**คาเป้า** ~37° (`RDR_KEEP .80`) กว้างกว่า = เลี้ยวตามได้ล็อกไม่หลุดง่าย · **คาเป้าเดิมไว้ก่อนเสมอ** สลับเป้าเฉพาะตอนหลุดจริง (กันล็อกกระโดดไปมาเวลามีลำตัดหน้า) · เป้าตาย/พ้นระยะ/พ้นกรวย = ปลดล็อก
  - **ของใหม่บนจอ:** 📡 จอเรดาร์กลมมุมซ้ายบน (`#inv-radar` canvas · วงระยะ 3 ชั้น + ลำกวาด + จุดเป้า เขียว=ยานลูก เหลือง=กำลังจับ แดงโต=ล็อก · หัวลำเราชี้ขึ้นเสมอ) · กรอบล็อก `#inv-lock` ทาบบนตัวยานลูกจริง (ฉาย 3D→จอ) เหลืองประ→**แดงทึบเต้น** + ป้าย "🔴 LOCK V · 109 ม." · เสียง `Snd.lock()` ตุ๊บช้า 760Hz ตอนจับ → ถี่ 1180Hz ตอนล็อก · toast บอกวิธียิง
  - **มิสไซล์:** ยิงตอนล็อก = ธง `hard` → เบนแรง (lerp 5.2 + เร่งอีกเมื่อเข้าใกล้ รวมสูงสุด ~10.7) · อายุ 9 วิ (เดิม 6.5) · จุดชนวน 6.6 ม. (เดิม 5.4) · **ยิงตอนไม่ล็อก = ของเดิมเป๊ะ ไม่แตะ** · ล็อกเฉพาะ `heliPiloting()` — เดินเท้า/พลปืนไม่มีเรดาร์
  - **ยืนยัน (preview จริง):** จับเป้า→ล็อกที่ **1,050 ms** (เกณฑ์ 850) ป้ายเปลี่ยนเป็น 🔴 LOCK จริง เสียงเปลี่ยน seek→lock · ล็อกค้างได้ตอนเป้าถอยห่าง 105→127 ม. · **ยิงชุด 2 ลูก `hard:true` ล็อก v → ระยะ 125→98→65→32→เข้าเป้า ยานลูกตกจริง (26→25 ลำ · เหรียญ +1)** · ยิงตอนไม่ล็อก = `hard:false lock:null` (ลูกธรรมดา) · กรวยคาเป้า: ตรงเป้า✓ เบน 17°✓ เบน 43°✗ หันหลัง✗ · ลงจากเครื่อง = เรดาร์ดับ กรอบหาย `display:none` · เดินเท้าไม่มีเรดาร์ · จอเรดาร์วาดจริง 4,103 พิกเซล (เซฟภาพดูแล้ว เห็นวงระยะ+จุดเป้า) · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว
- **รอบ 562 (26 ก.ค.):** 🕹️🚁 **ถอดปุ่ม ▲▼ ในเฮลิออกถาวร → บังคับแบบโลกเฮลิฯ "ลากนิ้วมือขวาขึ้น-ลง" (ผู้ใช้สั่ง)** — แก้ `js/invasion3d.js` ที่เดียว: ลบ `#inv-up`/`#inv-down` ครบทุกที่ (markup + CSS 3 breakpoint + ตัวแปร `upBtn/downBtn` + `hold()` 2 ตัว) · ในตัวจับ `touchmove` ครึ่งขวา **แนวตั้งกลายเป็นคันเร่ง** `phClimb=clamp(phClimb−dy×HELI_COL_SENS,−1,1)` (`.012`/พิกเซล = ค่าเดียวกับ `hCol` โลกเฮลิฯ เป๊ะ) · **ปล่อยนิ้ว = คันเร่งกลับศูนย์ = ลอยนิ่ง** · แนวนอนยังหันหัวลำเหมือนเดิม · คอมยังใช้ Space/Shift ได้
  - **ยาม (`heliPiloting()` = `inHeli && !riding && heliReady`):** เดินเท้า/พลปืนประจำประตู **ลากแนวตั้ง = เล็งขึ้น-ลงเหมือนเดิม** · ระหว่างสตาร์ทเครื่อง 10 วิ ยังลากดูรอบ ๆ ได้ · พอเครื่องพร้อมบิน `pitch=0` (ตั้งกล้องมองตรงก่อนสลับโหมด กันค้างมุมเงย)
  - **ยืนยัน (preview จริง · ยิง TouchEvent จริงเข้า `#inv-wrap`):** ปุ่ม `inv-up`/`inv-down` **หายจาก DOM** (ตอนบินเหลือ 🔫🚀🪂👁️🗺️💬) · ลากขึ้น 50px → climb **.60 เป๊ะ** (50×.012) · ลากต่อ → 1.0 · ลากเกิน → **ตัน 1.0** · ลากลง 200px → −1.0 · ปล่อยนิ้ว → 0 · **pitch ไม่ขยับเลยตอนขับ** · บินจริง: ลากขึ้นค้าง 1 วิ **+4.24 ม.** → ปล่อย +2.14 → +0.34 (ลอยนิ่งตาม `HELI_DAMP`) · ลากลง −2.68 ม. · คอม Space +2.44/Shift −0.89 ม. ยังใช้ได้ · เดินเท้า+ช่วงสตาร์ท ลากแนวตั้ง = pitch +0.252 (60px×.0042) climb คง 0 · แก้ข้อความช่วยเหลือ/toast ที่อ้าง ▲▼ ครบ · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 565 (26 ก.ค.):** 🔥🌀 **ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี (ผู้ใช้สั่ง ต่อยอดเรดาร์ 563/564)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🔥🌀 รอบ 565` เหนือ `tickMissiles`): เดิมล็อกแล้วยิง = เข้าเป้า 100% ยานลูกบินวนเฉย ๆ · ใหม่ ลำที่มี **จรวดของผู้เล่น** ล็อกพุ่งเข้าหาจะรู้ตัวและตอบโต้ ① 🌀 **บิดหนี** (`startEvade` — เลี้ยวสวนทางเดิม ×`EVA_SPIN_MUL` 2.4 + ม้วนตัว `EVA_ROLL` + เปลี่ยนระดับกะทันหัน 10–20 ม. · สลัดตัวออกข้างไวขึ้น 1.6→2.9) เมื่อจรวดใกล้ `EVA_WARN` 110 ม. ② 🔥 **ปล่อยแฟลร์** เมื่อใกล้ `EVA_FLARE_D` 68 ม. (7 ดวง พาความเร็วลำติดไปด้วยแล้วร่วงรั้งท้าย + ควันตาม) — จรวดที่เฉียดในรัศมี `FLARE_TRAP` 26 ม. มีโอกาส `FLARE_CH` **35%/ลูก** หลงเป้า → `lock=null` วิ่งเข้าดวงแฟลร์แล้วระเบิดกลางอากาศ
  - **⚖️ กันยากเกินสำหรับเด็ก:** แฟลร์จำกัด **`FLARE_PODS` 2 ชุด/ลำ หมดแล้วหมดเลย** + คูลดาวน์ 4.6 วิ · ดาเมจสะสมข้ามชุด (F_HP 20 / PH_MIS_DMG 10) ยิงซ้ำก็จบ · **สุ่มครั้งเดียวต่อชุดแฟลร์** (`m.rolled=fl.sid`) ไม่ใช่ทุกเฟรม · **ไม่นับจรวดของเฮลิบอทพันธมิตร** (`m.ally`) — วัดจริงตอนแรกนับด้วยแล้วยานลูก 3 ลำเผาแฟลร์ทิ้งฟรีก่อนผู้เล่นได้ยิงสักนัด · ป้ายกรอบล็อกขึ้น **🌀หนี!** + toast บอกวิธีเอาชนะ + เสียง `Snd.flare()`
  - **🐞 บั๊กที่เจอ+แก้ระหว่างทาง:** ตั้งความไวเลี้ยวเป็นค่าคงที่ 2.6 rad/วิ → วงโคจร F_R 190 ม. = **494 ม./วิ เร็วกว่าจรวด (MIS_SPD 95) จรวดตามไม่ทันเลยสักลูก** → เปลี่ยนเป็นตัวคูณ + เพดาน `EVA_SPD_MAX` 78 ม./วิ · แฟลร์เดิมค้างอยู่กับที่ ลำบินหนีไปไกล จรวดไม่เคยเฉียดแฟลร์เลย → ให้แฟลร์พาความเร็วลำไป 75%
  - **ยืนยัน (preview จริง · `_t.stepFrame` เดินเฟรมเอง):** `luck=1` → ล็อก+ยิง → หนีที่จรวดห่าง 89 ม. → แฟลร์ 7 ดวงที่ 46 ม. (pods 2→1) → **จรวดเข้ากับดักที่ระยะเฉียด 24.2 ม. `decoy:true lock:null` ทั้ง 2 ลูก ยานรอด hp ไม่ลด** · `luck=0` → ไม่มีลูกไหนหลง เข้าเป้าครบ **hp 12→−8 ยานตกจริง** · **pods=0 = ไม่มีแฟลร์อีกเลย** (เสียงแฟลร์ 7→7 นิ่ง) แต่ยังบิดหนี (roll 10.67) ป้ายขึ้น `🔴 LOCK ① D · 200 ม. 🌀หนี!` และจรวดยังไล่ทันจนตก (hp 18→−4) = หนีอย่างเดียวไม่อมตะ · **พิสูจน์แฟลร์ขึ้นจอ:** หยุดโลก `stepFrame(0)` เทียบพิกเซลก่อน/หลัง `clearFlares` = ต่าง **30,021 px (2.08% ของจอ)** อมส้ม 9,562 px · ยิงจากภาคพื้น (ไม่มีเรดาร์) ยานลูกก็หลบ+ปล่อยแฟลร์ · ลงจากเครื่อง = เรดาร์ดับ กรอบหาย · `clearFlares` 7→0 · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว



## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 566 (26 ก.ค.):** 🔓 **เปลี่ยน default "เปิดเผยกิจกรรมในโปรไฟล์" จากปิดทุกหมวด → เปิดทุกหมวด (ผู้ใช้สั่ง)** — แก้ `js/state.js` (`DEFAULT_STATE.feedShare` all `true` + migration fallback เซฟเก่าที่ field เสียก็ตั้ง `true` แทน `false`), `js/util.js`+`js/ui.js` (ข้อความหน้าตั้งค่า/โปรไฟล์ที่พูดถึง default ปิด → แก้เป็นเปิด) · ผู้เล่นยังปิดเองรายหมวดได้ตามเดิมในตั้งค่า ⚙️
  - **ยืนยัน (preview จริง · mock login ผู้เล่นใหม่):** เปิดหน้าตั้งค่า → ทั้ง 5 สวิตช์ (เหรียญพิเศษ/ผ่านทดสอบ/ได้สินค้าเพิ่ม/ความเคลื่อนไหวอื่นๆ/เปิดเผยทรัพย์สิน) ขึ้น **"เปิด" ทันทีโดยไม่ต้องแตะ** · `state.feedShare` = all true · `node --check` ผ่านทั้ง 3 ไฟล์ · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 567 (26 ก.ค.):** 📰 **เพิ่มกล่องแจ้งเหตุผล "เปิดเผยความก้าวหน้าเป็นค่าเริ่มต้น" ในหน้าลงทะเบียน (ต่อยอดรอบ 566 ตามผู้ใช้สั่ง)** — เพิ่ม `.reg-privacy` ใน `index.html` ใต้ช่องเลือกชั้น อธิบายว่าเปิดเผยไว้ช่วยสร้างแรงบันดาลใจให้เพื่อนมีเป้าหมายฝึกคำศัพท์ + บอกว่าปิดเองได้ทีหลังในตั้งค่า · CSS ใหม่ใน `css/style.css` (โทนฟ้า แยกจากกล่องเตือนสีส้ม `.reg-safety`)
  - **บั๊กที่เจอ+แก้ระหว่างทาง:** กล่องแรกที่เขียนดันฟอร์ม `#screen-register` ล้นจอ (`scrollHeight` 811 จาก 694 — ปุ่ม "เริ่มผจญภัย!" หลุดจอที่ 1280×720) → ย่อข้อความ+บีบระยะห่างเฉพาะสโคป `#screen-register` (h1/subtitle/label/input/reg-safety margin) **ไม่แตะ `.login-card` ที่ใช้คลาส `register-card` ร่วม** จนพอดีจอ (695≈694) · จอเตี้ย 812×375 ยังต้องเลื่อนดู (ของเดิมก็ล้นอยู่แล้วตั้งแต่ก่อนแก้ — `#screen-register` มี `overflow-y:auto` มาแต่ต้นเพื่อกรณีนี้)
  - **ยืนยัน (preview จริง 1280×720 + 812×375):** ข้อความขึ้นถูกต้อง · `node`/CSS โหลดไม่มี error · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 568 (26 ก.ค.):** 🔫↩️ **ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น (ผู้ใช้สั่ง ต่อยอด 563/564/565)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🔫↩️ รอบ 568` ใต้ `tickMissiles`): เดิมการล็อกไม่มีต้นทุน จ่อค้างนานแค่ไหนก็ได้ · ใหม่ ลำที่ติด 🔴 LOCK รู้ตัว (RWR) → ป้ายกรอบล็อกขึ้น **🔫สวน!** + เสียง `Snd.rwr()` + toast บอกทางแก้ (`CTR_WARN` 380 ms หลังล็อก) → ครบ `CTR_REACT` 900 ms **ยิงชุดละ 3 นัด** (`CTR_BURST_MS` 140) แบบ**เผื่อนำทิศที่เฮลิบิน** (`phVel`×`CTR_LEAD` .75 · กระจาย = ระยะ×`CTR_SPREAD` .10×(1−lead) → ยิ่งไกลยิ่งพลาด) ดาเมจ `CTR_DMG` 5 (น้อยกว่ากระสุนปกติ 9) คูลดาวน์ `CTR_GAP` 3000 ต่อลำ · กระสุนสีแดงชมพู 0xff5a6e ขนาด 1.45 เท่า (พุ่งเข้าหน้า = เห็นเป็นจุด ต้องโตกว่าปกติ)
  - **⚖️ กันยากเกินสำหรับเด็ก (ทางแก้มีเสมอ):** ยิงสวนเฉพาะลำที่ล็อกจริง 🔴 (🔶 จับเป้ายังไม่ยิง) · **สะบัดหัวให้ล็อกหลุด = หยุดยิงทันที** · พร้อมกันมากสุด `CTR_MAX` 2 ลำ ต่อให้ล็อกครบ 4 · **ลำที่กำลังบิดหนีมิสไซล์ (รอบ 565) ยิงสวนไม่ได้** = ยิง 🚀 ใส่ก่อนคือปิดปากมัน · ลงจากเครื่อง/ล็อกหลุด = ล้างคิวกระสุนที่ค้าง (`resetRadar`)
  - **🔧 ปรับค่าจากที่วัดจริง:** ค่าแรก DMG 6/GAP 2600 → ลอยนิ่งข้างฝูงเสียพลัง **45 หน่วย/6 วิ** (ระยะ 57 ม. กระจายแค่ 1.4 ม. < รัศมีโดน 2.6 ม. = เข้าเกือบทุกนัด) → ลดเป็น 5/3000
  - **ยืนยัน (preview จริง · `_t.stepFrame` เดินเฟรมเอง · `_t.counter`/`_t.ctrBolts` ใหม่):** ไทม์ไลน์ 1 ล็อก = ล็อก 5535 ms → ป้าย 🔫สวน!+RWR ที่ 5910 (=375 หลังล็อก) → **นัดแรก 6457 (=922 หลังล็อก)** → ชุด 3 นัดห่าง 133/128 ms → ลำที่ 2 ยิงชุดของตัวเองต่อ · **ล็อก 4 ลำ = ยิงแค่ 12 นัด/6 วิ (2 ลำ) ไม่ใช่ 24** · **สะบัดหัวออก 4 วิ = 0 นัดใหม่ คิวว่าง กระสุนหมดจอ** · **ยิงมิสไซล์ใส่ → ลำนั้นบิดหนี 167 เฟรม `arming` = 0 ตลอด** (ยิงสวนไม่ได้จริง) · **ลงจากเครื่อง = คิว 0 ไม่มีนัดใหม่ กรอบล็อกหาย** · กระสุนขึ้นจอจริง 3/3 นัด `onScreen` และ**วิ่งเข้าหาเฮลิ 102→75.3 ม.** (เซฟภาพซูมดูเห็นจุดแดงชมพูพุ่งเข้าหน้า) · ลอยนิ่งโดนล็อก 9 วิ = 14 นัด/เสียพลัง 37 · **สไลด์หลบ 9 วิ = ล็อกหลุด เหลือ 3 นัด/เสียพลัง 5** · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 569 (26 ก.ค.):** 🔥🛡️ **แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก (ผู้ใช้สั่ง ต่อยอดรอบ 565)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🔥🛡️ รอบ 569` ใต้โซน 568): เดิมฝั่งศัตรูมีแต่กระสุนวิ่งตรง เราเลยไม่มีอะไรให้หลอก · ใหม่ ยานลูกที่ติด 🔴 LOCK ของเราและรู้ตัวแล้ว (`ctrArming` รอบ 568) จะ **ล็อกกลับ** → เสียงเตือนใหม่ `Snd.spike()` ตุ๊บถี่ขึ้นเรื่อย ๆ + แถบแดง `#inv-spike` กลางจอบน + toast บอกทางแก้ → ครบ `SPK_MS` 1900 ms **ยิงจรวดนำวิถี** (`AMIS_SPD` 54 ช้ากว่าจรวดเรา 95 · `AMIS_TURN` 2.0 เลี้ยวช้ากว่ามาก · `AMIS_DMG` 14) · เราตอบโต้ด้วย **ปุ่ม 🔥 `#inv-flare` (คีย์ X)** โปรยพลุ 9 ดวง — จรวดที่เฉียดในรัศมี `PH_TRAP` 30 ม. หลงเป้า `PH_FLARE_CH` 75% · **กดตอนยังไม่ยิง = ตัดล็อกทิ้งทันที**
  - **⚖️ กันยากเกินสำหรับเด็ก:** แฟลร์เรา **เติมคืนเอง** 1 ชุด/`PH_FLARE_RE` 9 วิ (สูงสุด 4 — ไม่หมดถาวรแบบยานลูก) · จรวดศัตรูลอยพร้อมกันมากสุด `AMIS_MAX` 2 · เว้นระหว่างการล็อกเรา `SPK_WORLD_GAP` 5.2 วิ + ต่อลำ `SPK_GAP` 9 วิ · **ยิงเฉพาะลำที่เราล็อกไว้ก่อน** = ไม่จ่อล็อกก็ไม่โดนจรวด · ลงจากเครื่อง/ล็อกหลุด = ล้างหมด
  - **🐞 บั๊กที่เจอ+แก้ระหว่างทาง:** แฟลร์ชุดแรกวางห่างตัวแค่ 4 ม. → พลุ additive 9 ดวงกอง**หน้าเลนส์ ขาววาบทั้งจอ 24%** (พิสูจน์ด้วยภาพ) → ย้ายไปท้ายลำตาม `aimDir()` `PH_FLARE_BACK` 13 ม./`PH_FLARE_DOWN` 3.2 ม. + ลด scale 3.2→2.6 opacity .95→.85 · **แยกฝั่งแฟลร์ด้วย `fl.side`** ('foe' รอบ 565 · 'ph' รอบ 569) ทั้งสองทาง ไม่งั้นจรวดเราโดนแฟลร์ตัวเองหลอก
  - **ยืนยัน (preview จริง 1280×720 + 812×375 · `_t.spike`/`_t.stepFrame`):** ไทม์ไลน์ = ล็อกเป้าได้ 901 ms → แถบ 🔒 ถูกล็อก + เสียง spike ที่ 1291 → **ยิงจรวดที่ ~1.9 วิ** → จรวดวิ่งเข้า 174→6 ม. แล้วชน · **luck=1 กดแฟลร์ที่ 90 ม. → จรวดหลงเป้าที่ 35 ม. hp ไม่ลด** · **luck=0 = โดนจริง วัดดาเมจ 14 เป๊ะ** (ยิง 12 ลูก/20 วิ เข้าแค่ 1 = หลบทันจริง) · **กดแฟลร์ตอนยังไม่ยิง: locking 'c' → null** · **74 เฟรมที่มีแฟลร์เรา 9 ดวงลอยอยู่ จรวดของเราเอง 0 ลูกโดนหลอก** · ปุ่มดับที่ 0 ชุดแล้วเติมคืนเองครบ · คีย์ X ทำงาน · ลงจากเครื่อง = จรวด 1→0 แถบ/ปุ่มหาย · 812×375 ปุ่มไม่ทับปุ่มอื่นและอยู่ในจอ แถบเตือนไม่ล้น · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 572 (26 ก.ค.):** 🧭🚀 **ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์ (ผู้ใช้สั่ง ต่อยอดรอบ 569)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🧭🚀 รอบ 572` ใต้ `drawRadar` + เรียก `drawAMisMarks()` ท้าย `drawRadar`): เดิมรอบ 569 บอกแค่ "อีกกี่เมตร" ไม่บอกว่า **มาจากทางไหน** เด็กเลยหักเลี้ยวมั่ว · ใหม่ ทุกลูกใน `aMissiles` ขึ้นเรดาร์ 2 อย่าง ① จุดแดงตำแหน่งจริง (เฉพาะที่อยู่ใน `RDR_RANGE` 200 ม.) ② 🔺 **ลูกศรที่ขอบวง ชี้เข้าหาจุดกลาง (ตัวเรา)** + เรืองแดงที่ขอบ → **ยิงมาจากข้างหลังก็เห็น** ทั้งที่มองไม่เห็นตัวจรวด · กะพริบถี่ขึ้นตามระยะ (`AMK_BEEP` 300/460/680 ms) ให้ตรงจังหวะเสียง `Snd.spike` · **จรวดที่หลงแฟลร์แล้ว → เทาจาง เล็กลง ไม่กะพริบ** (สอนเด็กว่าแฟลร์ได้ผลจริง) · วาดท้ายสุด = ไม่โดนป้าย `LOCK xN` บัง
  - **ยืนยัน (preview จริง · หลักฐานระดับพิกเซล ไม่ใช่ screenshot):** `_t.amisRel` ให้ทิศเป๊ะ หน้า/ขวา/หลัง/ซ้าย/45° = 0/90/180/270/45 องศา · เทียบ **กลุ่มพิกเซลที่วาดจริง** (diff เฟรมมี/ไม่มีจรวด) กับ `_t.misMarks` ทุกเคส: จรวดหน้าซ้าย 346.6° → ลูกศรที่ขอบ 346.5° (395 px) · **ไกลเกินระยะเรดาร์ 217 ม. = ไม่มีจุด แต่ลูกศรยังขึ้น** ✔ · **2 ลูกพร้อมกัน**: ลูกโดนแฟลร์ (17.9 ม./11.7°) วาด**เทา** ที่ 11.5° + ลูกที่ยังไล่ (109.7 ม./6.1°) วาด**แดง** ที่ 5.5° จุดตรงกับ x/y ที่คำนวณ · **จรวดข้างหลัง 179.5° → ลูกศรอยู่ขอบล่างจริง (x 88.4, y 174.2 จากศูนย์กลาง 90,90)** ✔ · จุดวิ่งเข้าศูนย์กลางตามระยะ 136.8→5.8 ม. ทิศคงที่ 21.6° · **812×375: ลูกศรวาดถูกที่ (26.8°) เรดาร์อยู่ในจอครบ** · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - ⚠️ **ยังไม่ deploy** — ตอนทำมี session คู่ขนานกำลังแก้ `js/invasion3d.js` ไฟล์เดียวกัน (ระบบ `🔵💀 รอบ 571` ลำแสงยานแม่) ค้างอยู่ใน working tree · deploy ตอนนั้น = ดันของที่ยังทำไม่เสร็จขึ้นเว็บจริง → commit เฉพาะ hunk ของตัวเอง (`git apply --cached`) ไม่ deploy · **ของรอบนี้จะขึ้นเว็บพร้อม deploy ของรอบ 571** (หรือสั่ง `bash tools/deploy_firebase.sh` เมื่อ 571 เสร็จ)
- **รอบ 570 (26 ก.ค.):** 🪙 **ยกเครื่องกติกาเหรียญโลกยานแม่ — "เหรียญต้องมาจากฝีมือเราเท่านั้น" (ผู้ใช้แจ้งบั๊ก: ยังไม่ได้ยิงอะไรเลย เหรียญขึ้น +539 เอง)** — ต้นตอ 2 จุดใน `js/invasion3d.js`: ① `tickSquad` (ทหารบอท) และ ② `tickMissiles` (จรวดเฮลิบอท `m.ally`) เรียก `damageFighter()` **ไม่ส่งพารามิเตอร์ `byMe`** → `byMe!==false` = จริง → ระบบนับเป็น "เรายิง" แจกเหรียญให้ทุกลำที่บอทยิงตก ③ `completeWord()` แจกโบนัสยานแม่ตก 500 ให้ทุกเครื่องแม้ไม่ได้ยิงสักนัด
  - **กติกาใหม่:** `damageFighter(f,dmg,now,byMe)` รับ 3 ค่า — `true/undefined`=เรายิง · **`'ally'`=บอทฝ่ายเรา (ลำตกจริง+ส่งบิต `myKill` ให้เพื่อน sync แต่ไม่ให้เหรียญ)** · `false`=เพื่อนยิง · **เหรียญเข้าส่วนตัว +1 เฉพาะตัวอักษรที่ "เรายิงเอง และอยู่ในคำปัจจุบัน"** (ยิงตัวนอกคำ = 0 เหรียญ + toast บอกให้ยิงป้ายเขียว) · **ครบคำ = `WORD_COIN` 10 ให้ทุกคนในแมพ** (ทุกเครื่องรัน `completeWord` พร้อมกันจากเกราะที่ sync กันอยู่แล้ว ไม่ต้องเขียน DB) · ❌ ลบ `REWARD` 500 ทิ้ง · เป้าฝึกยิงลดเป็น 1 เหรียญ (`TRG_COIN` 3→1, `QUIZ_COIN` 12→1 · ผู้ใช้เลือก) · `INVASION_REWARD` ในการ์ดร้าน (`js/ui.js`) 60→10 ให้ตรงกัน
  - **ยืนยัน (preview จริง · hook ใหม่ `_t.killLetter(ch,by)`):** คำ `eleven` → ยิงเอง `z` (นอกคำ) **+0** · ยิงเอง `e` (ในคำ) **+1** เกราะ 100→50 · **บอทยิง `l` +0** เกราะ→33 (ตัวอักษรยังติด) · เพื่อนยิง `v` +0 · ยิง `n` ครบคำ +1 แล้ว **+10 ตอน completeWord (ไม่ใช่ 500)** รวม 9000→9012 · **ปล่อยเกมเดินเอง 1,174 เฟรม (บอทยิงยานลูกตกจริง 3 ลำ + เปลี่ยนคำ 1 รอบ) เหรียญนิ่งที่ 9012 ไม่ขยับเลย** · `node --check` ผ่าน · ⚠️ แท็บ preview ที่ซ่อนอยู่ rAF หยุด — ต้องเดินเฟรมด้วย `_t.step()` เอง


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 575 (26 ก.ค.):** 📡⬇️🔭🚫 **2 งานที่ผู้ใช้แจ้งพร้อมภาพ — (ก) เรดาร์ทับแถบซ้าย (ข) ซูมปืนค้างแล้วขึ้นเฮลิ ภาพเลนส์ค้างทับห้องนักบิน** (แก้ `js/invasion3d.js` ที่เดียว · โซนใหม่ `📡⬇️ รอบ 575` ใต้ `drawAMisMarks` + `🔭🚫 รอบ 575` เหนือ `enterHeli`)
  - **(ก) `layoutRadar()`** — เดิม CSS ตรึง `#inv-radar{top:58px}` ทับแผง `#inv-stat` (จริง ๆ ยาวถึง y161 ตอนขับเฮลิ เพราะมีแถวลูกจรวด) · ใหม่ **วัด `getBoundingClientRect` จริงแล้ววางใต้แผงเสมอ** (ห้ามฮาร์ดโค้ด — ความสูงแผงเปลี่ยนตาม media query + จำนวนลูกจรวด) · จอเตี้ยช่องแคบ → **ย่อขนาดเรดาร์** (92→ต่ำสุด 62) · เตี้ยมากจนย่อไม่พอ → **ย้ายไปขวาแผง** (`RDR_SIZE_SIDE` 80) ไม่ยอมให้ทับจอยเดินเด็ดขาด · เพิ่ม `pointer-events:none` (จอโชว์อย่างเดียว ห้ามกินสัมผัส) · เรียกจาก `resizeFn` + `updateGunnerBtn` (ทุก 0.4 วิ) + **`renderMissiles()`** (ตัวที่ทำให้แผงสูงขึ้นตอนขึ้นเครื่อง — ไม่ใส่จะทับ ~0.4 วิ หลังขึ้นเครื่อง)
  - **(ข) `zoomBlocksBoard()`** — ต้นตอ: คลาส `scoped` บน `#inv-wrap` ถูกสลับใน `tickAds` **เฉพาะตอนเดินเท้า** พอ auto-board (รอบ 555) พาขึ้นเครื่องทั้งที่ยังซูม คลาสเลยค้าง → `#inv-scopeov` โชว์ทับค็อกพิต · ตามที่ผู้ใช้สั่ง = **กันไม่ให้ขึ้นเครื่องตั้งแต่แรก** + toast บอกวิธีแก้ · กันครบทุกทางเข้า: `enterHeli` (ปุ่ม 🚁/คีย์ H/พวงมาลัย) · `boardGunner` · `tickAutoBoard` (**เช็กก่อนตั้ง `autoBoardLock`** ไม่งั้นเลิกซูมแล้วยังขึ้นไม่ได้จนกว่าจะเดินออก) · ใช้ได้ทั้ง 2 กระบอก (rifle + r93 มี `scope:true` ทั้งคู่ → ตัวแปร `scoped` ตัวเดียวกัน)
  - **ยืนยัน (preview จริง · วัดด้วย `getBoundingClientRect` ไม่ใช่ screenshot):** เรดาร์ **1280×720** top 58→169 (ใต้แผงที่จบ y161 เว้น 8px) ขนาดเต็ม 92 · **812×375** ย่อเหลือ 73 (156–229) เว้นแผง 8 เว้นจอย 8 · **740×320** ช่องเหลือแค่ 36px → เด้งไปขวาแผง (170,40) ขนาด 80 · **ทั้ง 3 จอ ชนกับ element อื่นใน `#inv-wrap` = 0 ชิ้น และอยู่ในจอครบ** · เฟรมแรกหลังขึ้นเครื่องก็ไม่ทับแล้ว · ซูมค้าง **rifle** → กดขึ้นเครื่อง/นั่งพลปืน = บล็อกทั้งคู่ + toast · **r93** เหมือนกัน · **เลิกซูม → ขึ้นได้ทันที** · **auto-board: ซูมค้างยืนคาลานจอด 1.3 วิ ไม่เด้งขึ้น → พอเลิกซูมโดยไม่ต้องเดินออก เด้งขึ้นเองทันที** (พิสูจน์ว่าไม่ได้ล็อกค้าง) · หลังขึ้นเครื่อง `#inv-scopeov` = `none` (บั๊กเดิมเกิดไม่ได้แล้ว) · `node --check` ผ่าน · console สะอาด
  - ⚠️ **ยังไม่ deploy (เหตุผลเดียวกับรอบ 572)** — session คู่ขนานถือ `js/invasion3d.js` อยู่ (รอบ 573 ท่าปืนไรเฟิล + รอบ 574 ลำแสงยานแม่) ยังไม่ commit · commit เฉพาะ hunk ตัวเองด้วย `git apply --cached` · **ของรอบ 572+575 จะขึ้นเว็บพร้อม deploy ของ session นั้น** (หรือสั่ง `bash tools/deploy_firebase.sh` เมื่อเขาเสร็จ)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 576 (26 ก.ค.):** 🔵💀 **ยานแม่ยิง "ลำแสงสีฟ้า" ลงข้างตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง+เด้งออกจากเกม (ผู้ใช้สั่ง)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🔵💀 รอบ 576` เหนือ 🔁 ลูปหลัก + CSS/DOM `#inv-msb`/`#inv-dead`) · เล็ง `MSB_WARN` 2.6 วิ (วงฟ้าบนพื้นห่างตัว `MSB_NEAR` 7–11 ม. + ลำแสงจาง + เสียงตุ๊บถี่ขึ้น + แถบนับถอยหลัง) → **ขยับเกิน `MSB_FLEE` 10 ม. = หนีทัน ลำแสงลงเฉียดที่เดิม ไม่โดน + ล้างเคาน์เตอร์** · ไม่หนี = เตือน 1→2→3 (ดาเมจ 0) · **ครั้งที่ 4 ล็อกตัวเรา (ตามติด หลบไม่ได้) → hp=0 → การ์ด ☠️ 5 วิ → `exitWorld()` ต้องกดเข้าโลกใหม่**
  - **⚠️ นี่คือ "ทางตายทางเดียวของโลกนี้"** — `hurtPlayer` ยังไม่มีตายเหมือนเดิม (ถอยไปตั้งหลัก) จึงต้องฆ่าผ่าน `msbKill()` ตรง ๆ + กด `lastHurt=now` ทุกเฟรมระหว่างค้างการ์ด ไม่งั้นสูตรฟื้นพลัง 3.5 วิ ดันพลังกลับ · 🧒 ทางรอดชัดเสมอ: เตือนล่วงหน้าทุกครั้ง · ครั้งสังหารเตือนนานกว่า (`MSB_KILL_WARN` 3 วิ) + แถบแดง · **ขึ้นเฮลิ/เป็นพลปืน = ยกเลิกทันที นับว่าหนีสำเร็จ** · อยู่บนเครื่อง/ยานแม่ตาย/การ์ดวิธีเล่นเปิด = ไม่ยิง
  - **🐞 บั๊กที่เจอ+แก้ระหว่างทาง:** ① ลำแสงกว้าง 12.8 ม. ตกห่างแค่ ~8 ม. + `boom` sc 2.6 + `flashScreen` = **จอขาวโพลน 16–20% ค้างยาวเกินลำแสงหาย** (บั๊กเดียวกับแฟลร์รอบ 569 — ของใกล้เลนส์ต้องเบากว่าที่คิดเสมอ) → opacity .95→.55 · boom 2.6→.55 · `flashScreen` เหลือเฉพาะครั้งสังหาร → ขาว 10% แค่เฟรมเดียว หายใน 150 ms ② แถบเตือนตั้ง `top:%` เท่าไหร่ก็ชนของเดิมสักจอ (1280×720 ชน toast · 812×430 ชนแถบคำศัพท์) → **`msbBarPos()` เกาะก้นแถบคำศัพท์เป็น px ทุกเฟรม**
  - **ยืนยัน (preview จริง · `_t.msb`/`_t.msbFire()`/`_t.msbStay` ใหม่ · เดินเฟรมเองด้วย `_t.stepFrame`):** ไทม์ไลน์เต็ม = เตือนลง 7.6/9.8/10.9 ม. (hp ไม่ลดเลย ฟื้นขึ้นระหว่างนั้นด้วยซ้ำ) → ครั้งที่ 4 ล็อก d=0 → **hp 120→0 การ์ดขึ้น → เด้งออกที่ 5.0 วิ** กลับหน้าหลัก `running=false` + toast บอกให้เข้าใหม่ · **หนีทัน: ขยับ 21.7 ม. → ลำแสงลงห่าง 22.5 ม. hp ไม่ลด เคาน์เตอร์ 0** · ขึ้นเฮลิระหว่างเล็ง = ยกเลิกใน 1 เฟรม · บินอยู่ 4 วิ ยิง 0 ครั้ง · เข้าโลกใหม่ = เคาน์เตอร์ 0/hp เต็ม/การ์ด+ขอบแดง+วงเล็งไม่ค้าง · แถบเตือนเว้นแถบคำศัพท์ 2px เว้น toast 1px ครบทั้ง **1280×720 · 812×430 · 812×375** · การ์ดตายไม่มีสกรอลล์ที่ 812×375 (194/194 ปุ่มอยู่ในจอ · กฎ #7) · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - 🚦 **หมายเหตุ session คู่ขนาน:** บันทึกรอบ 575 เรียกงานนี้ว่า "รอบ 574" — เลขจริงคือ **576** (`--next-round` ตอน commit) · commit เฉพาะ hunk ตัวเองด้วย `git apply --cached` · **ตอน deploy ไฟล์ยังมีของเขาค้างอยู่ 1 จุดที่ยังไม่ commit = ท่าปืนไรเฟิล `GUN_VIEW.rifle` y −0.144→−0.344 (งาน "รอบ 573" ที่ผู้ใช้สั่งพร้อมภาพ)** → **ค่านี้ขึ้นเว็บไปด้วยแล้ว แต่ยังไม่อยู่ใน git** ให้ session นั้น commit ตามมา (ค่าปืนล็อกตามรอบ 498 — ผมไม่แตะเอง)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 578 (26 ก.ค.):** 🧱 **"เข้าที่กำบัง = ยานแม่ยิงไม่โดน ยิงแค่เฉียด ๆ" (ผู้ใช้สั่ง ต่อยอดรอบ 576)** — แก้ `js/invasion3d.js` ที่เดียว (ในโซน `🔵💀` เดิม) · `msbCoverAt(x,z)` เช็กของที่ฉากมีอยู่แล้วครบ 4 แบบ: `houses`→**ในบ้าน** · `solids` กล่องหมุนได้→**ข้างอาคาร** · `solids` วงกลม (ซากรถ/กระสอบ/ถัง)→**หลังที่กำบัง** · `pads`→**ข้างเฮลิคอปเตอร์** (ยานพาหนะ) · **วัดถึง "ขอบ" ไม่ใช่จุดกลาง** (`MSB_COVER_R` 3.4 ม. · เฮลิ `MSB_PAD_R` 9) — ตึกกว้าง 20 ม. ถ้าวัดจุดกลางต้องยืนกลางตึกถึงจะนับ
  - **กติกา:** อยู่ในกำบัง = **รอดทุกกรณีรวมครั้งสังหาร** + ล้างเคาน์เตอร์เหมือนวิ่งหนีสำเร็จ · ครั้งสังหารที่กำลังล็อกตัวเรา **เลิกล็อกทันทีที่เข้ากำบัง** แล้วเบนจุดตกไปข้าง ๆ (`msbAimBeside`) = เห็นชัดว่า "ยิงเฉียด" · เช็ก **ณ วินาทีที่ยิงจริง** ไม่ใช่ตอนเริ่มเล็ง → มุดเข้ากำบังวินาทีสุดท้ายก็รอด · **ออกจากกำบังกลางคัน = กลับมาล็อกตัวและตายตามเดิม** · แถบเตือน+toast เปลี่ยนเป็นโทนฟ้า "🧱 อยู่ในที่กำบัง — ปลอดภัย" (ตัดคลาส `hot` สีแดงออก)
  - **ยืนยัน (preview จริง · `_t.msb.coverNow`/`covered` ใหม่ · สแกนกริดหาพิกัดกำบังจริงในฉาก):** **ครั้งสังหารครบทั้ง 4 ชนิดกำบัง = ไม่ตายสักแบบ** (hp 120 เต็ม · ลำแสงลงห่าง 7.7–10.1 ม. · เคาน์เตอร์ 0) · **กลางแจ้ง = ยังตายเหมือนเดิม** (d=0 → hp 0 การ์ดขึ้น) · **มุดกำบังตอนเหลือ 487 ms = รอด** (ลำแสงเบนไปลง 8.4 ม.) · **เริ่มในกำบังแล้ววิ่งออกที่โล่ง = ลำแสงกลับมาล็อก d=0 แล้วตายจริง** · ยิงเตือน 3 ครั้งรวดขณะอยู่กำบัง = `stay` คา 0 ไม่มีวันถึงครั้งสังหาร · แถบเตือนที่ 812×375 เว้นแถบคำศัพท์ 2px เว้น toast 17px อยู่ในจอ · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - 🚦 **session คู่ขนาน:** `js/invasion3d.js` ยังมีของ session อื่นค้างไม่ commit 2 ก้อน = **ท่าปืนไรเฟิล (รอบ 573)** + **คลื่นเร่งยานลูก TURBO (รอบ 577)** → ผม commit เฉพาะ hunk ตัวเองด้วย `git apply --cached` แต่ **deploy อัปไฟล์จากโฟลเดอร์จริง → ของเขาขึ้นเว็บไปด้วยแล้ว ยังไม่อยู่ใน git** ให้ session นั้น commit ตามมา


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 579 (26 ก.ค.):** ⚡👾 **ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วิ แล้ววนลูป (ผู้ใช้สั่ง)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `⚡👾 รอบ 579` เหนือ 🔁 ลูปหลัก + ตัวคูณ `tb` ใน `tickFighters` + `resetTurbo()` ตอนเข้าโลก) · `TURBO_EVERY` 300000 / `TURBO_MS` 10000 / `TURBO_MUL` 10 / `TURBO_N` 10 · สุ่มด้วยเมล็ด `srnd(battleRound*911+wave*37)` **ไม่ใช่ `Math.random`** → ทุกเครื่องในห้องเห็นลำเดียวกันเร่ง · ลำที่เร่ง = ไฟท้ายส้มโต 1.75 เท่า + toast บอกตัวอักษร + เสียง `Snd.rwr` · หมดเวลา toast 🐢 · **ไม่แตะจังหวะยิง `f.shotAt`** (ผู้ใช้สั่งแค่ความเร็วบิน — ยิงถี่ 10 เท่าจะโหดเกินเด็ก)
  - **🐞 2 กับดักที่เจอตอนวัดจริง (จดไว้ใช้ซ้ำกับระบบที่ "เร่งความเร็ว" อื่น ๆ):** ① คูณแค่ `f.ang` ไม่พอ — ตัวลำไล่ตามเป้าแบบ lerp (`lat`) เลยตามหลังจนได้ความเร็วพื้นแค่ **9.2 เท่า** และวงบินหดเข้า → ต้องคูณ `lat` (+`TURBO_TRACK` 4) และ lerp แนวตั้งด้วย ② พอ `lat` แรงจน `min(1,dt*lat)=1` ลำเกาะเป้าสนิท → `atan2(tx−p.x,tz−p.z)`=`atan2(0,0)`=0 **หัวลำค้างทิศเดียวทั้งที่บินเป็นวง** → ตอนเร่งหันหัวตาม "ระยะที่ขยับจริงเฟรมนี้" (`p0x/p0z`) แทน
  - **ยืนยัน (preview จริง · เดินเฟรมเอง `_t.stepFrame` · hook ใหม่ `_t.turbo`/`_t.turboFire()`/`_t.fpos`):** วัด **ความเร็วเชิงมุมจริง** ก่อน/ระหว่างเร่ง = **10.13–10.38 เท่า** ครบทั้ง 10 ลำ · อีก 16 ลำนิ่งที่ **1.01–1.03 เท่า** · ครบ 10 วิ `on` 10→0 ความเร็วกลับมาช่วงเดียวกับลำปกติเป๊ะ (0.172–0.30 vs 0.162–0.318 rad/s) · คลื่นถัดไปตั้งใหม่ **300.0 วิ** ทุกครั้ง (คลื่น 1→2→3 ได้คนละชุด ไม่มีหลุด) · ออกจากโลกกลางคลื่นแล้วเข้าใหม่ = `wave` 0 · ไม่มีลำค้างเร่ง · หัวลำหมุนตามทางบินจริง (`ry` ขยับ 0.88–4.78 rad/0.5 วิ) · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว
  - 🚦 **session คู่ขนาน:** ทำพร้อมรอบ 578 (คนละระบบ ไฟล์เดียวกัน) → รอเขา commit+deploy จบก่อน แล้ว commit เฉพาะ hunk ตัวเองด้วย `git apply --cached` · **working tree ยังมีของ session อื่นค้าง 1 จุด = ท่าเล็ง `ADS_BY_GUN.rifle` y −0.344 ("รอบ 573")** ขึ้นเว็บไปแล้วแต่ยังไม่อยู่ใน git — ไม่แตะ ปล่อยเจ้าของ commit เอง


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 580 (26 ก.ค.):** 🎆🧱🌳 **4 งานที่ผู้ใช้สั่งรวด (แก้ `js/invasion3d.js` ที่เดียว + ไฟล์โมเดลใหม่)**
  - **① ระเบิดเลิกเป็นสี่เหลี่ยม** — ต้นตอ: `SpriteMaterial` ไม่ใส่ `map` = จัตุรัสทึบขอบคม → ทำชุด texture วงกลมไล่โปร่งแคชไว้ (`fxGlow/fxFire/fxRing/fxDisc/fxStar`) แล้วเปลี่ยนทุกดวงไฟในโลกนี้ให้ใช้ (ลูกไฟ/ประกาย/ไฟท้ายยานลูก/ไฟท้ายจรวด/แฟลชปากลำกล้อง/ดวงจันทร์/ไฟถนน) · `boom()` เป็น 5 ชั้น (วาบ→ลูกไฟไล่สีขาวร้อน→สีระเบิด→คล้ำ→ควันดำ→คลื่นกระแทก→สะเก็ด+ถ่านไฟ) + `boomLight` PointLight ดวงเดียวใช้ซ้ำ (เพิ่มดวงต่อลูก = มือถือคอมไพล์เชเดอร์ใหม่)
  - **② "ยิงทะลุอาคาร" (ผู้ใช้ทัก)** — `envHit` เดิมเช็กตึกเป็น**วงกลมอ้วน**เลยกล้าใช้บล็อกแค่เป้าฝึกยิง + **บ้าน house_01 ไม่ได้อยู่ใน solids เลย** → เปลี่ยนเป็นกล่องจริง (hw/hd/rot/top) + เช็กตารางกันชนบ้าน และให้บล็อก **ทุกเป้าหมาย** (ยานลูก/ยานแม่/เป้า) ทั้งเดินเท้าและบนเฮลิ · ลำแสงยานลูกก็โดนกำแพงกั้นแล้ว (`solidAt` ใน `tickAlienShots`)
  - **③ "อยู่ใกล้อาคารห้ามยิงโดน" (ผู้ใช้สั่งย้ำ)** — เพิ่ม "ข้างบ้าน" เข้า `msbCoverAt` (เดิมนับเฉพาะ*เข้าไปใน*บ้าน ยืนแนบผนังไม่นับ = ต้นตอที่ผู้ใช้เจอ) และ **อยู่ในที่กำบัง = ยานแม่ไม่เริ่มเล็งเลย** (ไม่มีวงฟ้า/แถบเตือน/เคาน์เตอร์ · เช็กใหม่ทุก 900 ms)
  - **④ ต้นไม้ทุกต้นเป็นโมเดลจริง** `img/models/tree_lite.glb` — ต้นฉบับ `tree.glb` 61 MB/1.1M verts → ลดตามสูตร `handoff/NOTES.md` เหลือ **803 KB/26k verts** (ตัด NORMAL→weld→simplify 0.012→tex 512→prune) · 34 ต้นใช้ **InstancedMesh** (1 draw call) + วาดเฉพาะต้นในระยะ `TREE_LOD` 190 ม. · Tripo ให้ metalness .28 ทำใบดำ → ปิดเป็น 0
  - **🐞 กับดักที่เสียเวลาไล่ (จดไว้กันพลาดซ้ำ):** ① ผนังบ้านหนาแค่ 1 ช่องตาราง (0.45 ม.) แต่ `envHit` เดินทีละ 1.2 ม. → **กระโดดข้ามผนัง** ต้องซอย 4 ก้าวย่อยช่วงที่ผ่านบ้าน ② `_t` มี key `envHit` ดิบอยู่แล้ว 2 ที่ → hook ทดสอบชื่อซ้ำถูกทับ เรียกได้แต่ตัวดิบ (ได้ null ตลอด) เปลี่ยนชื่อเป็น `_t.probeEnv` ③ วาบระเบิด/ไฟระเบิดแรงเกิน = จอขาวทั้งซอย (บทเรียนซ้ำรอบ 569/576 — ของใกล้เลนส์ต้องเบากว่าที่คิด)
  - **ยืนยัน (preview จริง · hook ใหม่ `_t.fxInfo`/`_t.boomAt`/`_t.probeEnv`/`_t.solidAt`/`_t.cover`/`_t.treeInfo`):** สไปรต์ไม่มี texture (= สี่เหลี่ยม) เหลือ **0 ชิ้น** ทุกจังหวะรวมตอนเล่นจริง 6 วิ · ความสว่างจอตอนระเบิดใหญ่ 110→173 แล้วคืนตัว (ขาวจัด ≤4.4% แม้ sc 8) · `envHit` ตรงกับการสแกนจริง **24/24 เส้น** (ผนังบ้าน 12.0 ม. = สแกน 12.0) · ยิงจ่อกำแพง = เกิดรอยกระสุน ยิงขึ้นฟ้า = ไม่เกิด · กำบัง: ในบ้าน/ข้างผนัง 2 ม./3.2 ม. = นับหมด · ยืนชิดบ้าน 50 เฟรม **ยานแม่ไม่เริ่มเล็งเลย** (stay 0) · ออกที่โล่ง = เล็งทันที · ต้นไม้ GLB โหลดจริง 12–16 ต้นในระยะ **114 fps** · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 581 (26 ก.ค.):** 🛡️🔵 **"เกราะยานแม่ที่มองไม่เห็น" + 🚀 กด R ยิงจรวด (ผู้ใช้สั่ง 2 งาน)** — แก้ `js/invasion3d.js` ที่เดียว (โซนใหม่ `🛡️🔵 รอบ 581` ใต้ tickFx)
  - **เกราะ:** เกราะยังไม่ 0 = กระสุน**ทุกชนิด**ไปไม่ถึงตัวลำ แตกเป็น **วงกลมฟ้าซ้อนหลายวง**บนโดม · ทรงเกราะ = ellipsoid ตามตัวลำ (`MS_R`×`MS_R*MS_FLAT`×`MSH_PAD 1.035`) แก้สมการกำลังสองครั้งเดียวต่อนัด (`msShieldRay`) · จรวดใช้ `msShieldPt` (เช็กจุดอยู่ในโดม) · **ขนาดวง = `msShieldPow(dmg)`** ไรเฟิล 1.05 · ปืนกลเฮลิ 1.55 · R93 2.05 · จรวด 3.30 (กว้างจริง ~50 ม./กำลัง 1) · toast สอนวิธีที่ถูก (ยิงยานลูกป้ายเขียว) คุมความถี่ 6 วิ · เพดาน `MSH_FX_MAX` 30 ชิ้น (เกินแล้วลดเหลือวงเดียว)
  - **ปุ่ม R:** ตรวจแล้ว **R ยิงจรวดได้อยู่เดิม** (`KeyR`→`fireMissile`) — ต้นตอที่ผู้ใช้รู้สึกว่า "กดแล้วไม่ยิง" คือ **จรวดหมด/กำลังบรรจุแล้ว `return` เงียบ ๆ** → เพิ่ม toast บอก "อีกกี่วินาที" ทั้งเดินเท้าและบนเฮลิ (`misBusyHint`)
  - **ยืนยัน (preview จริง · hook ใหม่ `_t.shield`/`shieldRay`/`shieldPow`/`shieldBurstAt`/`bulletQ`):** ไรเฟิล/R93/ปืนกลเฮลิ/จรวด **เข้าเกราะครบ 4 ชนิด** ค่ากำลังตรงตาราง · เรย์ตรงกับคณิตศาสตร์ (ยิงขึ้นตรง = 244.2 ม. ที่ y 248.5) · ยิงลงดิน/ยิงราบ = `null` (ไม่กระทบของเดิม) · **เกราะ 0 = ปิดสนิท** (`on:false`, ray `null`, ไม่มีวงเกิด) · ยิงรัว 25 นัด = 25 วง เพดานเอฟเฟกต์คา 47 ชิ้น 56 fps · toast อยู่ในจอที่ 812×375 · R ยิงได้ 6 นัดแล้วขึ้น "อีก 9 วิ" · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 583 (26 ก.ค.) 🚨 hotfix เว็บล่ม (ผู้ใช้แจ้ง "ค้างที่ กำลังเปิดสมรภูมิทะเลทราย"):** คอมเมนต์ CSS ของรอบ 582 ใส่ **backtick** ไว้ใน `const CSS=\`…\`` (template string) → สตริงขาด **`node --check` ยัง "ผ่าน"** แต่รันจริงโยน TypeError → `window.InvasionWorld` ไม่เกิด เกมค้างหน้าโหลด · แก้ 1 บรรทัด (เลิกใช้ backtick ในคอมเมนต์ในบล็อก CSS) commit เฉพาะ hunk ด้วย `git apply --cached` แล้ว deploy `2026-07-26.552` — ยืนยันบนเว็บจริงว่า `InvasionWorld.start` มีแล้ว
  - ✅ **ตัวสแกนทำแล้วรอบ 585** (`tools/check_template_backtick.py` เสียบใน `deploy_firebase.sh` แล้ว — ดูบนสุด)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 584 (26 ก.ค.) = ปิดงาน "รอบ 582" ให้ครบ:** ⌨️🚁 **ป้ายบอกปุ่มลูกศร ↑/↓ ค้างไว้ทางขวา + ลูกศรบังคับเครื่องขึ้น/ลงจริง (ผู้ใช้สั่ง — คนเล่นด้วยคอมพิวเตอร์)** — แก้ `js/invasion3d.js` ที่เดียว: `#inv-keyhint` (โผล่เมื่อคลาส `kbd`+`fly` ไม่ใช่ `gunner` · `kbd` เช็ก `(hover:hover) and (pointer:fine)` ตอน buildDom) · แยก `keys.up/keys.dn` ออกจาก `keys.w/keys.s` → **เดินเท้า ↑/↓ = เดินหน้า/ถอยหลังเหมือนเดิม · บนเฮลิ = คันเร่งขึ้น/ลง** (Space/Shift/ลากนิ้วยังใช้ได้) · ปุ่มบนป้ายไฮไลต์ตอนกดจริง
  - **จอเตี้ยตามกฎ #7:** วัดคอลัมน์ขวาแล้วช่องว่างจริง = y180 ถึง H−296 → **จอสูง ≥620 วางแผงตั้งชิดขวา (top 44%) · เตี้ยกว่านั้นยุบเป็นแถบเดียวแนวนอน y106 ขยับซ้ายพ้นกระดานคะแนน**
  - 🚦 **บทเรียน session คู่ขนาน (สำคัญ):** อีก session commit `js/invasion3d.js` **ทั้งไฟล์ระหว่างที่งานนี้ยังแก้ค้างอยู่** → โค้ดครึ่งเดียวขึ้นเว็บไปกับรอบ 581/583 (keydown แยกแล้วแต่ keyup ยังไม่แยก = ลูกศรไม่ทำงานเลยทั้งเดินเท้าและบนเฮลิ) · รอบนี้เป็นตัวปิดให้ครบ — **ห้าม commit ไฟล์ทั้งไฟล์ที่ session อื่นกำลังแก้ ให้ commit เฉพาะ hunk ตัวเอง**
  - **ยืนยัน (preview จริง · เดินเฟรมเอง `_t.step`):** ↑ ค้าง 1 วิ = ทะยานขึ้น **+3.83 ม.** (vy +4.59 · `landed` false) · ↓ = **−1.91 ม.** (vy −3.9) · ↑ ไม่ทำให้บินหน้า (ไถลแค่ 0.43 ม.) · W ยังบินหน้า 4.28 ม. · Space +1.85 / Shift −1.13 ยังใช้ได้ · เดินเท้า ↑ 4.23 ม. / ↓ 6.6 ม. · ป้ายซ่อนตอนเดินเท้า+ตอนเป็นพลปืน โผล่ตอนเป็นนักบิน · ไม่ทับ UI ใด ๆ ที่ **375 / 500 / 620 / 720 / 1080** (รวมตอนเปิดกระดานคะแนน + มุมกล้องภายนอกที่มีปุ่ม 🎬) · `node --check` ผ่าน · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 585 (26 ก.ค. · ไม่แตะไฟล์เกม ไม่ต้อง deploy):** 🧵 **ด่านกันบั๊ก "backtick หลงในบล็อก `const CSS=`…``" ก่อน deploy** (ปิดช่องที่ทำเว็บล่มรอบ 583 · `node --check` จับไม่ได้) — ตัวใหม่ `tools/check_template_backtick.py` + เสียบเป็น **ด่านที่ 3** ใน `tools/deploy_firebase.sh` (เจอ → exit 2 → `set -e` หยุด deploy เหมือน `check_undefined_calls.py`)
  - **วิธีตรวจ:** หาบล็อกหลายบรรทัด `const/let/var ชื่อ = \`` → เดินอักขระแบบที่ JS ตีความ (ข้าม `\\`escape + `${...}` ซ้อน) → เจอ backtick ตัวแรก = จุดที่สตริง**จบจริง** → ถ้าท้ายมันไม่ใช่ตัวปิดที่สมเหตุสมผล (`;` `)` `,` `+` `.method(` หรือ backtick ลำพังต้นบรรทัด) = ตัวหลง · ชั้นสอง: บล็อกชื่อ *CSS* ต้องมีปีกกาครบคู่ (กันเคส backtick หลงที่บังเอิญตามด้วย `;`)
  - **ยืนยัน:** ไฟล์เสียจริงของรอบ 583 (`git show 2a02194^:js/invasion3d.js`) → `node --check` **ผ่าน** แต่ตัวใหม่จับได้ที่ **บรรทัด 691** ตรงจุด · HEAD ปัจจุบันสแกน 21 ไฟล์/3 บล็อก **ผ่านสะอาด** · จำลองด่านในสคริปต์จริงทั้งเคสเสีย (exit 2 + ล้าง staging) และเคสดี (exit 0 เดินต่อ) · `bash -n` ผ่าน · เคสทดสอบ false positive (template ซ้อนใน `${}`, `content:"}"`) ไม่ถูกจับผิด


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 586 (26 ก.ค. · ผู้ใช้ส่งคลิป "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ"):** 🧘🪖 **ทหารในหมู่เลิกกระตุก — ล็อกเป้า + หันตัวจำกัดความเร็ว + ไล่มุมเงยแบบนุ่ม** (แก้ `js/invasion3d.js` โซนใหม่ `🧘🎯 รอบ 586` เหนือ `tickSquadMove`)
  - **ต้นตอ (ในลูป `tickSquad`) = กระโดดค่าทุกเฟรม 3 จุด:** ① `tgt=fighters[random]` **สุ่มเป้าใหม่ทุกเฟรม** ② `s.grp.rotation.y=atan2(...)` เซ็ตมุมทันที (สแนปได้ 180°/เฟรม) ③ `s.lookUp` กระโดด → torso+ปืนกระตุกขึ้นลง · ตอนวิ่ง (`tickSquadMove`) ก็สแนปมุม + ตัด `lookUp=0` ทันที
  - **แก้:** `squadTarget()` ล็อกเป้า 2–3.5 วิ (สุ่มจาก 3 ลำใกล้สุด · เป้าตาย=เลือกใหม่) · `turnTo()` จำกัด `SQ_TURN` 3.4 rad/s (วิ่ง 4.6) · `easeLook()` ไล่มุม 6/วิ · **ยิงเฉพาะเมื่อคลาดเป้า <20° (`SQ_FIRE_ARC`)** · วิ่งขณะยังหันไม่ทัน = ก้าวช้าลง+ท่า `walk` (ไม่ไถลข้าง) · hook ใหม่ `_t.squadAim`
  - **ยืนยัน ① harness node (รันโค้ดจริงที่ตัดจากไฟล์ เทียบเก่า-ใหม่):** Δyaw/เฟรม **87.6° → 0.45°** · สลับทิศหมุน **275 → 2 ครั้ง/10 วิ** · เปลี่ยนเป้า **532 → 3 ครั้ง/10 วิ** · Δมุมเงยสูงสุด 44° → 3.6° · หันกลับหลัง 180° ใช้ 0.70 วิ
  - **ยืนยัน ② เว็บจริง `vocabworld.web.app` (deploy `.554` · ทหาร 10 นาย · เดินเฟรมเอง `_t.step` + hook `_t.squadAim`):** อัตราหมุนสูงสุด **263.7°/วิ = เพดาน SQ_TURN_RUN เป๊ะ ไม่เกินเลยแม้เฟรมเดียว** (300 เฟรม) · Δyaw เฉลี่ย 0.95°/เฟรม · สลับทิศ 9 ครั้ง/3 วิ ทั้ง 10 นาย (≈0.3 ครั้ง/นาย/วิ) · เป้าล็อกค้าง (hold เหลือ 0.4–2.7 วิ) · ยังยิงปกติ (tracer พีค 307 ชิ้น · ยานลูก 25→23 ลำจากกระสุนบอทเอง) · โหมดครบ aim/crouch/walk/run · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 588 (26 ก.ค. · ผู้ใช้สั่ง 3 ข้อในเกม Word Search):** 🔎 **กระดานเกือบเต็มจอ + แถบคำขึ้นไปบนสุดกึ่งกลาง + เลิกกระพริบที่คำที่เจอ** (แก้ `css/lobby.css` โซน `.ws-*` + `js/wordsearch.js` โครง DOM)
  - **① กระดานใหญ่ขึ้น:** `#ws-board` `min(96vw,1000px)` → `min(99vw,1900px)` + บีบ padding/แถบล่าง · **② แถบคำ:** ป้าย "🔤 หาคำเหล่านี้ให้เจอ" + ความคืบหน้า ย้ายเข้าหัวแถบ `grid-template-columns:1fr auto 1fr` (กึ่งกลางเป๊ะ) · ชิปคำเรียง flex-wrap กึ่งกลาง แถวเดียว กว้างเท่ากัน (เดิมเป็นคอลัมน์ขวา 2 หลัก) · **③ เลิกกระพริบ:** ลบ `animation:wsFlow` + `@keyframes wsFlow` จาก `.ws-cell.found` เหลือไฮไลต์เขียวนิ่ง
  - **ยืนยันด้วย `getBoundingClientRect` บนเกมจริง (mock login · ม.6):** จอ 1890×910 กระดาน **1000→1871px** · กริด **560→740px (+32% ด้าน / +75% พื้นที่)** เซลล์ 67px ฟอนต์ 26.4px · แถบคำ **1 แถว 7 ใบ ห่างจากกึ่งกลาง 1px** · ไม่มี scroll ทั้งแผง · จอเตี้ย 812×375 (กฎทอง #7) ทุกชิ้นอยู่ในจอครบ ไม่ต้องเลื่อน · ลากเลือกจริงยังหาคำเจอ (BACTERIA/OXYGEN) `animationName:none` ที่เซลล์ found · console สะอาด · ล้างเซฟ+reload แล้ว
  - หมายเหตุ: แสงวาบทั้งกระดาน 0.5 วิ (`.ws-flash`) + ป๊อปเหรียญ ยังอยู่เหมือนเดิม — ที่เอาออกคือไฟกระพริบค้าง "ที่ตัวคำ" ตามที่สั่ง
- **รอบ 587 (26 ก.ค. · ผู้ใช้สั่ง "เฮลิให้แรง/เร็วขึ้น 3 เท่า · รอบเครื่องเพดานต่ำเกินไป ไม่สนุก"):** 🚁🚀 **เฮลิโลกยานแม่แรงขึ้น 3 เท่า + ยกเพดานรอบเครื่องพ้นการบินปกติ** (แก้ `js/invasion3d.js` ที่เดียว)
  - **ต้นตอจริงของ "ไม่แรง" ไม่ใช่แค่ตัวเลขความเร็ว:** อัดคันเร่งเต็มค้าง = เครื่องร้อนไฟแดงเสมอ → กลไกรอบ 560 ตัดแรงยกเหลือ 35% → **อัตราไต่จริงเหลือ 1.75 หน่วย/วิ (ไต่ถึงเพดาน 95 ใช้ 35 วิ!)** · และเส้นแดงรอบอยู่ที่ 1.25 ขณะคันเร่งเต็มปั่นได้ 1.45 → **เร่งเกิน 56% ก็หวอ** (คนเล่นคอมกดลูกศร = คันเร่ง 100% เต็มตลอด จึงหวอแทบทุกครั้ง)
  - **แก้ 3 ชั้น:** ① `HELI_ACCEL/VMAX/CLIMB` ×3 (39/51/27) + `HELI_YAWSP` 1.9 · `HELI_LAND_VY=16`/`HELI_TAKEOFF_VY=6` ขยับตามขาลงที่เร็วขึ้น (ไม่งั้นลดระดับปกติ = เจ็บทุกครั้ง) ② รอบเครื่อง: คันเร่งเต็ม 1.45→**1.75** · เหลือง/แดง 1.17/1.25 → **1.80/1.88** · ไฟ "รอบเกิน" ย้ายไปผูกกับ `cpHot` (`HELI_OD_HOT`) = **ผลต่อเนื่องของการฝืนไฟ 🌡️ แดง ไม่ใช่แค่เร่งแรง** ③ ความร้อน: ลมปะทะระบายเทียบ `HELI_CRUISE` (ความเร็วเดินทางจริง = ACCEL/DRAG) แทนเพดานที่แตะไม่ถึง · คูลลิ่ง .16→.26 · คันเร่ง .22→.28 · สเกลหน้าปัด rpm/spd/vs ขยายตาม (`CP_RPM_MAX/CP_SPD_MAX/CP_VS_MAX`) ไม่งั้นเข็มตันสุดตลอด · hook ใหม่ `_t.heliPower`
  - **ยืนยัน ① harness node** (`tools`-style ตัดโค้ดจริงจากไฟล์มารัน เทียบเก่า-ใหม่): ความเร็วสูงสุด **9.07 → 27.21 หน่วย/วิ = ×3.00 เป๊ะ** · ระยะ 5 วิ 39 → 117 · อัตราไต่ **1.75 → 15** · ไต่ถึงเพดาน **35.4 → 6.9 วิ** · ขาลงเต็มพิกัด −15 ยังต่ำกว่าเกณฑ์เจ็บ 16 ✅
  - **ยืนยัน ② เกมจริงในเบราว์เซอร์** (เข้าโลก → `_t.enterHeli` ที่ pad จริง → เดินเฟรมเอง `_t.step` + คีย์จริง): ↑ 1 วิ = **+10.58 ม.** (เดิมรอบ 584 วัดได้ +3.83) · ถึงเพดาน 6.03 วิ · W 5 วิ = **117.1 ม. · 98 กม./ชม.** · **บินเร็วเต็มสปีด+คันเร่งเต็มค้าง 30 วิ = ไฟดับหมดทุกดวง แรงยก 1.00 (เดิมแดง+แรงยก 0.35)** · ลอยนิ่งอัดคันเร่ง = ลำดับเตือนยังครบ 🌡️เหลือง 1.5 วิ → แดง 4.6 → แรงยกเริ่มตก 5.8 → 🚨รอบเกินเหลือง 7.6 → แดง 10.8 (rpm 1.94/สเกล 1.95 เข็มไม่ตัน) · ผ่อนคันเร่ง 10 วิ = ฟื้นเต็ม 100% · ร่อนลงจากเพดานเต็มพิกัด 5.8 วิ **ลงจอดไม่เจ็บ (HP ไม่ลด)** · ภาพหน้าปัดจริง: ไฟ 4 ดวงดับ เข็มรอบอยู่ปลายโซนเขียว · console สะอาด · ล้างเซฟ+reload ปิดเสียงใบพัดแล้ว
  - ⚠️ **ค่าปืนที่ล็อกไว้ไม่ถูกแตะ** · บินเร็วขึ้น 3 เท่า = โอกาสชนตึก (รอบ 557 ชน=พัง) สูงขึ้นตามธรรมชาติ — ยังไม่ได้ปรับอะไรเพิ่ม ถ้าเล่นแล้วชนบ่อยเกินค่อยผ่อน


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 589 (26 ก.ค. · ต่อยอดจากรอบ 588 · ผู้ใช้สั่งเพิ่มระหว่างทาง "10 แถวบนมือถือตัวเล็กมาก → เหลือ 5 แถว ช่องต้องใหญ่ขึ้น"):** 🔎📐 **Word Search กระดานเตี้ยกว้าง 5 แถว + เลือกขนาดได้ + กดชิปคำเพื่อฟังเสียง/ขอใบ้** (แก้ `js/wordsearch.js` + `css/lobby.css`)
  - **① กระดาน 5 แถวเสมอ · เลือกคอลัมน์ 5×10 / 5×13 / 5×16** (ปุ่ม 📐 ในแถบล่าง · ตั้งต้นตามชั้น: ต่ำกว่าประถม-ป.3=10 · ป.4-6=13 · ม.=16 · จำใน `state.wsSize`) · **② กดชิปคำ = `speakWord` + ใบ้ "เส้นที่คำวางอยู่"** ลากยาวสุดขอบ (แนวนอน=ทั้งแถว · แนวตั้ง=ทั้งหลัก · ทแยง=ทั้งเส้น) จางหายเองใน 2.2 วิ ไม่ทับเซลล์ที่เจอแล้ว · คำที่เจอแล้วกด = พูดอย่างเดียว
  - **⚠️ กับดักที่เจอ (จดไว้กันพลาดซ้ำ):** `aspect-ratio` + `height:100%` **ตีกัน** — `max-width` หนีบความกว้างแต่ความสูงไม่ยุบ → ช่องยืดเป็นสี่เหลี่ยมผืนผ้า (106×136) · แก้ด้วย `fitGrid()` คำนวณ px เอง (min ของกว้าง/สูง แล้วตั้ง width/height/`--ws-fs`) + เรียกตอน render/open/resize
  - **🐛 บั๊กเก่าที่เจอระหว่างทาง:** `takeWords()` คืนเท่าที่เหลือในคิว → กระดานได้คำแค่ 1 คำ (โผล่ตอนขอคำเยอะ) · แก้ให้สับคิวใหม่แล้ววนต่อจนครบ · และ 5 แถวทำให้คำยาว >5 ตัวลงได้เฉพาะแนวนอน → `generate()` ปั้นกระดานซ้ำได้ 12 ใบ เอาใบที่คำครบ
  - **ยืนยันบนเกมจริง (mock login · `getBoundingClientRect`):** ช่องใหญ่ขึ้นจริง — จอ 1890×910 **67→132-136px** · **มือถือแนวนอน 812×375: 18→39px (×2.2)** ช่องเป็นจัตุรัสเป๊ะทุกขนาด/ทุกจอ · คำครบตามที่ประกาศ **25/25 ใบ ทั้ง ม.6 และ ป.2 ทั้ง 3 ขนาด** (0.1-0.5 ms/ใบ) · ลากเลือกยังหาคำเจอ · ใบ้ครอบคำครบ 100% · เซฟกระดานเก่าแบบจัตุรัส 10×10 เปิดต่อได้ไม่พัง (`normalize()` เติม rows/cols) · ไม่มี scroll + ทุกชิ้นอยู่ในจอที่ 812×375 (กฎทอง #7) · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 590 (26 ก.ค. · ผู้ใช้สั่ง "ทำ tab อันดับเพิ่มอีก 1 แท็บให้เกม Word Search — Top 10 ผู้สะสมคะแนนสูงสุด of all time"):** 🔎🏆 **แท็บอันดับที่ 4 "ค้นหาคำ" เชื่อมระบบอันดับเดิม** (แก้ `js/wordsearch.js` `js/ui.js` `js/online.js` `js/state.js` `css/lobby.css` + `handoff/RULES.md`)
  - **แต้ม** = ความยาวคำ×2 ต่อคำที่หาเจอ (เท่าเหรียญ) + โบนัสจบกระดาน 20 → สะสมถาวร `state.wsScore/wsWords/wsBoards` → ดันขึ้น `/leaderboard` **field ws** (fallback 3 ชั้น กันช่วงยังไม่ publish rules) · UI: แท็บ `ws` ทั้งการ์ดเล็ก (`lbWordSearchHtml`) และกระดานเต็มจอ (`lbRankRows('ws')` · cap 10 · หัวข้อ "Top 10 (all time)") · แถบแท็บรางข้างห่อ 2 บรรทัด + แท็บกระดานเต็มจอเลิกถูกบีบจนขึ้น 2 บรรทัด (`.lbf-tabs .lb-tab{flex:0 0 auto}`) · แก้ bug เดิม: กดแท็บในกระดานเต็มจอเคยรีเซ็ตการ์ดเล็กเป็นแท็บเหรียญ (listener ไม่เช็ก `data-tab`)
  - **ยืนยันบนเกมจริง (mock login · `getBoundingClientRect`):** เล่นจริงเก็บครบ 6 คำ = **74 แต้มเป๊ะตามสูตร** (54+20) · แต้มรอด reload (normalize เซฟเก่า) · จำลอง 12 คน → โชว์ Top 10 เรียงถูก · ตัวเราติด/ไม่ติด Top 10 ข้อความบอกอันดับจริงถูกทั้ง 2 เคส · สลับแท็บครบ 4 แท็บทั้ง 2 ที่ · จอเตี้ย 812×375 (กฎทอง #7) ทุกชิ้นอยู่ในจอ ไม่มี scroll · แท็บไม่ล้นราง 238px · console สะอาด · ล้างเซฟ+reload แล้ว
  - ✅ **rules publish แล้ว (ผู้ใช้กดเอง 26 ก.ค.) · ตรวจสดผ่าน:** rules ทั้งไฟล์ = identical กับ `handoff/RULES.md` ครบ 20 โซน + มี `ws` validate จริง · ผู้เล่นจริงเขียน `ws:38` ขึ้น /leaderboard ได้แล้ว → แท็บนี้เห็นแต้มเพื่อนครบระบบ (Artifact: https://claude.ai/code/artifact/529eb9e8-b60b-4bc0-89e7-0e5699423745)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 591 (26 ก.ค. · ผู้ใช้สั่งล็อกขนาดกระดาน Word Search ตามระดับชั้น "เท่านั้น"):** 🔒📐 **เลิกให้ผู้เล่นเลือกขนาดเอง — ล็อกตามชั้นอย่างเดียว** (แก้ `js/wordsearch.js` + `css/lobby.css`)
  - **ตารางล็อก:** ต่ำกว่าประถม + ป.1-ป.3 → **5×10 (5 คำ)** · ป.4 → **5×13 (6 คำ)** · **ป.5 ขึ้นไปจนถึงปริญญา → 5×16 (8 คำ)** (ป.5-ป.6 · ม.1-ม.6 · ปริญญาตรี · สูงกว่าปริญญาตรี) — 2 ชั้นที่ผู้ใช้ไม่ได้ระบุ ตีความตามลำดับชั้น: *ต่ำกว่าประถม*=10 (ต่ำกว่า ป.1) · *สูงกว่าปริญญาตรี*=16 (ต่อจากปริญญาตรี)
  - **เอาปุ่มเลือก 3 ขนาดออก** เหลือป้ายบอกขนาดอ่านอย่างเดียว (`.ws-size-now`) · `curSize()` เลิกอ่าน `state.wsSize` แล้ว (คืนค่าจาก `defaultSize()` เสมอ) · **บังคับตอน `open()`:** กระดานที่เซฟค้างไว้ถ้าขนาดไม่ตรงชั้น (เช่นเคยเลือก 5×16 ไว้ตอน ป.2 หรือเซฟเก่าจัตุรัส 10 แถว) → ทิ้งแล้วสุ่มใหม่ให้ถูกขนาด
  - **ยืนยันบนเกมจริง (mock login):** map **ครบทั้ง 15 ตัวเลือกใน `#reg-grade`** ตรงตารางเป๊ะ · ปุ่มเลือกขนาดเหลือ 0 ปุ่ม · เคสผู้เล่นเดิม ป.2 ที่เซฟ 5×16 ไว้ → เปิดมาได้ 5×10 อัตโนมัติ · ป.3/ป.4/ป.5/ม.3/ปริญญาตรี สุ่มใหม่ได้ขนาด+จำนวนคำถูกทุกชั้น · **ระบบแต้มรอบ 590 ยังทำงาน** (AUDIENCE = 16 แต้มตามสูตร) · จอเตี้ย 812×375 (กฎทอง #7) ทุกชิ้นอยู่ในจอ ไม่มี scroll ปุ่มแถวเดียว · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 592 (26 ก.ค. · ผู้ใช้สั่ง 5 ข้อ: รางวัลเหรียญ Top 10 ทุกวันที่ 1 · โชว์เงินรางวัลต่อท้ายชื่อ · ตัดสิน 00:01 วันที่ 1 เท่านั้น · กระดานข้อความแจ้งผู้ได้รางวัล · แต้มไม่รีเซ็ต):** 🏆🎁 **ระบบรางวัลรายเดือนของแท็บ 🔎 ค้นหาคำ** (ไฟล์ใหม่ `js/wsaward.js` + แก้ `js/ui.js` `js/state.js` `css/lobby.css` `index.html` `sw.js` · โซน rules ใหม่ `wsAward`)
  - **กลไก "ตัดรอบครั้งเดียว ทุกคนเห็นชุดเดียวกัน" (ไม่มีเซิร์ฟเวอร์):** snapshot `/wsAward/<YYYY-MM>` เขียนได้ครั้งเดียวตาม rules (`!data.exists()`) → **เครื่องแรกที่เปิดเกมหลัง 00:01 ของวันที่ 1 เป็นคนตัดรอบ** ที่เหลืออ่าน snapshot เดียวกัน · จ่ายเหรียญเข้าอัตโนมัติตอนเปิดเกม (`state.wsAwardPaid` กันจ่ายซ้ำ · `wsAwardSeen` กันยิง DB ซ้ำ · `wsAwardLog` = ประกาศส่วนตัว) · รางวัล 10,000/9,000/…/1,000 (`WsAward.PRIZES`) · **แต้ม `state.wsScore` ไม่ถูกล้างเลย** (ข้อ 5)
  - **UI:** ชิป 🎁 เงินรางวัลต่อท้ายชื่อทุกอันดับ (การ์ดเล็ก + โพเดียม + กริดกระดานเต็มจอ) · แถบ "⏰ ตัดสินทุกวันที่ 1 เวลา 00:01 น. เท่านั้น + นับถอยหลัง" ทั้ง 2 ที่ กดเข้า **📜 กระดานประกาศรางวัล** (3 คอลัมน์: ประกาศถึงหนู/กติกา · ผู้ได้รับรางวัลเดือนนี้ หรือ "ถ้าตัดรอบตอนนี้" · ตารางเงินรางวัล 10 อันดับ) + ป๊อปอัพเด้งตอนได้รับรางวัลบอก "ได้เท่าไหร่ · เพราะอะไร"
  - **ยืนยันบนเกมจริง (mock login + fake RTDB ที่บังคับ create-only เหมือน rules):** ① ยังไม่มีใครตัดรอบ → เราตัดรอบเอง snapshot ได้ครบ **10 คน อันดับ/รางวัลตรงเป๊ะ** เรารับ **+5,000 (อันดับ 6)** ② มีคนตัดรอบไว้แล้ว (เราอันดับ 2) → รับ **+9,000 และ snapshot ไม่ถูกเขียนทับ** ③ เรียก check ซ้ำ **ไม่จ่ายซ้ำ + ไม่ยิง DB เลย** ④ ไม่ติด Top 10 → ไม่ได้เหรียญ แต่ mark seen ⑤ หลังจ่ายรางวัล **wsScore/wsWords/wsBoards เดิมครบ** · `pastCut` เดือนหน้า = false (ก่อน 00:01 ไม่ตัด) · กด 3 ทาง (แถบการ์ด/แถบกระดานเต็มจอ/ปุ่มในป๊อปอัพ) เปิดกระดานถูก ไม่เปิดกระดานอันดับทับ · Esc ปิดได้ · **จอเตี้ย 812×375: ทั้ง 3 หน้าต่างไม่มี scroll ทุกชิ้นอยู่ในจอ** (กฎทอง #7 · กระดานยุบเป็น 2 คอลัมน์) · การ์ดเล็กไม่ล้นราง · console สะอาด · ล้างเซฟ+reload แล้ว
  - ⏳ **รอผู้ใช้ publish rules โซน `wsAward`** (Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/6f886d30-28c9-4951-ad61-d85795c35500) — ยังไม่ publish = ยังไม่จ่ายเหรียญ แต่ทุกหน้าจอโชว์ได้ครบ
  - 📌 **ข้อจำกัดที่ควรรู้ (จดกันเข้าใจผิด):** ถ้า 00:01 ไม่มีใครออนไลน์ อันดับที่บันทึกคือ "ตอนเครื่องแรกเปิดเกมหลัง 00:01" (ใกล้เคียงที่สุดที่ทำได้แบบไม่มีเซิร์ฟเวอร์ · แต้มเป็นยอดสะสมตลอดกาล เลื่อนช้า ผลต่างจึงน้อยมาก)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 593 (26 ก.ค. · ผู้ใช้สั่ง 3 ข้อ: รางวัลสอบ 10 ข้อ 100→500 · จ่ายย้อนหลังให้คนที่สอบผ่านไปแล้ว · เลิกเด้งข้อถัดไปเอง ให้กด Next):** 💰▶️ แก้ `js/data/vocab.js` (40 หมวด `reward:500`) `js/dictband.js` (`BAND_SET_REWARD` 500) `js/state.js` (`QUIZ_PASS_REWARD`+`quizRewardVer`+migration) `js/main.js` (`showQuizBackPay`) `js/game.js`+`css/style.css`+`css/lobby.css` (ปุ่ม Next)
  - **จ่ายย้อนหลัง** คิดใน `loadState()`: เซฟที่ยังไม่มี `quizRewardVer` = เรตเก่า 100 → เติม (500−100)×จำนวนหมวดใน `quizPassed` เข้า `coins`+`lifetimeCoins` (ไม่แตะ `daily`) แล้วตั้ง `quizBackPay` ให้ `bootGame` เด้งป๊อปอัพบอกครั้งเดียว · **นับเฉพาะ id หมวดจริง (`ALL_CATS`) + ชุด `bandXsY`** ตัด `vbreview` (เรต 50) กับ `bandXretake` (เรต 0) ออก · ⚠️ ต้องอ่าน `old.quizRewardVer` (เซฟดิบ) ไม่ใช่ `s.` — `Object.assign` ทับด้วย default 500 ไปแล้ว (พลาดตอนเทสต์รอบแรก)
  - **ปุ่ม Next** อยู่ในการ์ดคำโจทย์ (`#quiz-next` มุมขวา) โผล่หลังตอบเท่านั้น · ลบ `setTimeout` เด้งข้อใหม่ (950/2400ms) ทิ้ง → `quizNext()` + คีย์ Enter/Space/→ · ข้อสุดท้ายป้ายเป็น "ดูผลสอบ" · การ์ดเว้น padding ซ้าย-ขวา `clamp(64px,13vw,120px)` กันคำยาวชนปุ่ม
  - **ยืนยันบนเกมจริง (mock login · เซฟจำลองเรตเก่า):** เหรียญ 1,000→3,000 (+400×5 หมวดถูกตัว) `lifetimeCoins` +2,000 `daily` ไม่ขยับ · ป๊อปอัพข้อความครบ กดปิดแล้ว **reload ไม่จ่ายซ้ำ** · การ์ดหมวดโชว์ "🎁 รางวัล 500 🪙" · band "ชุดละ 500 🪙" · สอบจริงผ่านครั้งแรกได้ **+500 เป๊ะ** · กด Next ก่อนตอบไม่ไปไหน · รอข้ามเวลาแล้ว **ไม่เด้งข้อใหม่เอง** · คำยาว 19 ตัวห่างปุ่ม 148px · จอเตี้ย 812×375 ทั้งข้อสอบ+กล่องประโยคตัวอย่าง+ป๊อปอัพ ไม่มี scroll อยู่ในจอครบ · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 594 (26 ก.ค. · ผู้ใช้สั่ง: มุมขวาล่างล็อบบี้แออัด):** 🥇 **ถอดกลุ่มอันดับออกจากคอลัมน์ขวา → เหลือปุ่มเดียวในรางซ้าย** — ลบ `.side-sec` ที่มี `#lb-label`/`#lb-tabs-out`/`#leaderboard-card` ใน `index.html` + เพิ่มปุ่ม `#btn-rail-rank` (🥇 อันดับ) ถัดจาก 🔎 ค้นหาคำ (ช่วงบนของราง เห็นโดยไม่ต้องเลื่อน) · ผูกคลิกใน `js/main.js` → `openLeaderboardFull()` (กระดานเต็มจอเดิม ไม่ได้แก้หน้าตา)
  - `js/ui.js`: ย้าย `bindLbTabs()` เข้า `openLeaderboardFull()` (เดิมผูกจากการ์ดเล็กที่ถูกถอด — ไม่งั้นแถบ `.wsa-open` กระดานประกาศรางวัลรอบ 592 จะกดไม่ติด) + กันเปิดซ้อนด้วยการลบ `.lbf-overlay` เก่าก่อน · `renderLeaderboardCard()` คงไว้แต่ไม่ทำงาน (คืนทันทีเพราะไม่เจอ element) ให้ผู้เรียกเดิม online.js/wsaward.js/wordsearch.js ปลอดภัย
  - **ยืนยันบนเกมจริง (mock login + fake board):** ปุ่มอยู่ในจอ 1280×720 ไม่ต้องเลื่อนราง · กดแล้วเปิดกระดานเต็มจอ แท็บครบ 4 (เหรียญ/เข็ม/ล้มบอส/ค้นหาคำ) โพเดียม 5 + กริดที่เหลือ · แท็บ 🔎 → แถบรางวัลกด **เปิดกระดานประกาศรางวัลได้** · ออฟไลน์กดแล้ว **ไม่เปิด overlay** ขึ้น toast "📡 ต่ออินเทอร์เน็ตก่อน" · กด 2 ครั้งได้ overlay เดียว · คอลัมน์ขวาเหลือภารกิจ+เพื่อนออนไลน์ ว่างล่าง 366px (โล่งตามที่สั่ง) · จอเตี้ย 812×375 กระดานไม่มี scroll อยู่ในจอ · console สะอาด · ล้างเซฟ+reload แล้ว
