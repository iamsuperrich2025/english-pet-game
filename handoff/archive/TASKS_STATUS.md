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
