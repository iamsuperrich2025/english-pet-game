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
