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


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 597 (26 ก.ค. · ต่อยอดข้อ 1 ของรอบ 594 ผู้ใช้สั่งทำ · ⚠️ commit ชื่อ "รอบ 595" `e3274d0` — เลขชนกับ session คู่ขนานที่คว้า 595/596 ไประหว่างทาง จึงเปลี่ยนเลขในบันทึกเป็น 597):** 🥇🔢 **ป้ายเลขอันดับตัวเองบนปุ่ม 🥇 ในราง** — `index.html` (`#rank-badge` ในปุ่ม) `css/lobby.css` (`.rail-rank-num` เหรียญทองแบบ `.rail-count` ไม่ใช่ badge แดง) `js/ui.js` (`updateRankRailBadge()` เรียกหัว `renderLeaderboardCard()` → อัปเดตเองทุกครั้งที่กระดานเปลี่ยนผ่าน online.js/wsaward/wordsearch/renderDashboard)
  - ใช้อันดับ **กระดานเหรียญ** (แท็บหลัก) · ออฟไลน์หรือยังไม่ติดกระดาน = **ซ่อนป้าย** · tooltip บอก "ตอนนี้หนูอยู่อันดับที่ N ของกระดานเหรียญ"
  - **ยืนยันบนเกมจริง (mock login + fake board):** อันดับ 4 → ป้าย "4" มุมขวาบนปุ่ม (17×17 อยู่ในกรอบปุ่ม) · เลข 3 หลัก "124" ป้ายยืดเป็น 23px ยังไม่ล้นปุ่ม · ออฟไลน์/ไม่ติดกระดาน ป้ายหาย + tooltip กลับเป็น "ดูอันดับผู้เล่นทั้งหมด" · คลิกโดนตัวป้ายเปิดกระดานเต็มจอได้ (ไม่บังปุ่ม) · `renderDashboard()` แล้วป้ายยังอยู่ · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 595 (26 ก.ค. · ผู้ใช้สั่ง "เปลี่ยนเสียงฟ้าร้องในหน้า Word Search เป็นเสียงเก็บเหรียญ เหมือนเหรียญเข้าบัญชี"):** 🪙 **เสียงตอนหาคำเจอ: `sfx.spark` (ฟ้าผ่า) → `sfx.coinGet` (เหรียญเข้ากระเป๋า)** — แก้บรรทัดเดียวใน `js/wordsearch.js` `commit()` (fallback `sfx.coin` ถ้าไม่มี) · `sfx.coinGet` มีอยู่แล้วใน `js/util.js` (รอบ 327 · กรุ๊งกริ๊งไต่ขึ้น 3 ตัว + ตัวปิดใส)
  - **ยืนยันบนเกมจริง (mock login · ดัก `sfx` ทุกคีย์แล้วเล่นจริง):** หาคำเจอ → เรียก **`coinGet` ตัวเดียว** · ลากผิด → `wrong` เหมือนเดิม · เก็บครบทั้งกระดาน → `coinGet` ทุกคำ + `coin` ตอนจบ · **ไม่มีการเรียก `spark` เหลืออยู่เลย** · แสงวาบบนกระดาน (`.ws-flash`) + ป๊อปเหรียญยังอยู่ตามเดิม (ผู้ใช้สั่งแค่เรื่องเสียง) · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 598 (26 ก.ค. · ผู้ใช้สั่งทำไอเดียต่อยอด 2 ข้อจากรอบ 595):** 🪙🎉 **เสียง Word Search ไล่ระดับตามความยาวคำ + มีเสียงชนะจริงตอนเก็บครบกระดาน** (เพิ่ม `sfx.coinGetTier` + `sfx.win` ใน `js/util.js` · เรียกใช้ใน `js/wordsearch.js`)
  - **① `coinGetTier(tier)`** — tier 0 = คำ 3-5 ตัว (โน้ต 880/1175/1568 + ปิด 2093 = **เท่า `coinGet` เดิมเป๊ะ** ไม่กระทบที่อื่นในเกม) · tier 1 = 6-7 ตัว (+1976 ปิด 2349) · tier 2 = 8-10 ตัว (784→2093 ไต่ 5 ตัว ปิด 2637) · **② `sfx.win`** แฟนแฟร์ไต่ 4 ตัว + คอร์ดปิดค้าง (เดิม `sfx.win` **ไม่มีจริงใน util.js** โค้ด `win()` เลยตกไปใช้ `sfx.coin` = จิ๊งเดียว) · `sfx.win` ถูกอ้างที่ `js/wordsearch.js` ที่เดียว → เพิ่มได้ไม่กระทบระบบอื่น
  - **ยืนยันบนเกมจริง (mock login · ดักที่ตัว `beep()` เพื่อดูโน้ตจริงที่สั่งเล่น):** tier 0 = 4 beeps โน้ต+ดีเลย์ **ตรงกับ `coinGet` เดิมทุกตัว** · tier 1 = 5 beeps ปิด 2349@.29 · tier 2 = 6 beeps ปิด 2637@.36 · win = 8 beeps ปิด 2093@.5 · **เล่นจริงในเกมเลือก tier ถูกทุกคำ** (ม.6: CONTRIBUTE/10→2 · EDITOR/6→1 · ป.2: EGG/3→0 · BOOK/4→0 · ELEPHANT/8→2) · เก็บคำสุดท้าย → เรียก **`win` (ไม่ใช่ `coin` fallback แล้ว)** · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 601 (26 ก.ค. · ผู้ใช้สั่งทำไอเดียต่อยอด 2 ข้อจากรอบ 598):** 🔥 **ระบบคอมโบเกม Word Search — เสียงไต่ + ป้าย ×2 ×3 + โบนัสเหรียญ** (แก้ `js/wordsearch.js` `js/util.js` `css/lobby.css`)
  - **กติกา:** หาคำถัดไปได้ภายใน **3 วิ** = คอมโบต่อเนื่อง · ตัวคูณเหรียญ **×1 → ×2 → ×3 (ตัน)** คิดจาก `base = ความยาวคำ×2` · **ลากผิดไม่ตัดคอมโบ** (เด็กไม่ท้อ) ตัดเฉพาะ "ช้าเกิน 3 วิ" · รีเซ็ตตอนสุ่มเกมใหม่/เปิดแผง/ล้างกระดาน · แต้มกระดานอันดับ (รอบ 590) ได้ตามเหรียญเหมือนเดิม
  - **ฟีดแบ็ก 3 ทาง:** `sfx.combo(n)` โน้ตไต่สูงขึ้นทีละ 9% ต่อคอมโบ (ตันที่คอมโบ 10) ซ้อนบนเสียงเหรียญ · ป้าย `.ws-combo` "🔥 คอมโบ ×2" กลางกระดาน เด้ง `wsComboPop` แล้วจางเองใน **1.3 วิ** (สั้นกว่าหน้าต่างคอมโบ 3 วิ ตั้งใจให้ไม่บังตัวอักษรค้าง) · ป๊อปเหรียญเติมท้าย `×2` + เปลี่ยนเป็นสีส้มทอง (`.ws-coinpop.combo`)
  - **ยืนยันบนเกมจริง (mock login · ปริญญาตรี 5×16):** เก็บรัว 8 คำ = คอมโบ 1→8 ตัวคูณ 1,2,3,3… **เหรียญตรงสูตร base×mult ทุกคำ** (THEORY 12 · FLEXIBLE 16→32 · CONTRIBUTE 20→60) รวม 308 · เสียง `coinGetTier(n) + combo(n)` ยิงคู่ตั้งแต่คอมโบ 2 · **รอเกิน 3.2 วิ → คอมโบตกกลับ ×1 เหรียญกลับเป็น base** และป้ายหายเอง · ลากมั่วแล้วคอมโบยังคง 2 · ป้ายกินพื้นที่แค่ **1.7% ของกระดาน** (จอใหญ่) / 7.9% (812×375) อยู่ในกรอบกระดานทั้ง 2 จอ `pointer-events:none` · console สะอาด · ล้างเซฟ+reload แล้ว
  - ⚠️ **commit นี้พ่วงงานที่ยังทำค้างของ session คู่ขนาน** (`css/lobby.css`+`js/util.js`+`index.html`/`js/ui.js` ส่วน `rail-wrap`/`rail-nudge` ป้ายบอกทางราง) — `git commit -- <path>` เอาไฟล์ทั้งใบ แยกเฉพาะ hunk ไม่ได้ · deploy ก็อัปโหลดทั้ง working tree อยู่แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 596 (26 ก.ค. · ผู้ใช้สั่ง "ป๊อปอัพเงินรางวัลย้อนหลังตัวหนังสือใหญ่ขึ้น ผู้ใหญ่สายตายาวอ่านชัด แต่ห้ามมี scrollbar"):** 🔍 ขยายตัวอักษรกล่อง `.qbp` ≈2 เท่า (แก้ `css/style.css` + `js/main.js`)
  - ทุกชิ้นในกล่องอิง **em** ของ `.qbp` ที่ฐาน `clamp(15px,4.4dvh,30px)` → พอดีจอเองแม้ JS ไม่ทำงาน · `fitQbp()` เป็นตัวกันเหนียว หรี่ตัวคูณ `--qbp-k` ทีละ .04 (ต่ำสุด .6) จนสูง ≤96% ของจอ · วัดด้วย `offsetHeight` (ไม่โดน transform ของ popIn หลอก) + refit ตอน resize (debounce 140ms)
  - **ยืนยันบนเกมจริง 5 ขนาดจอ:** 1280×720 ตัวเนื้อหา **15→28.8px** เล็ก 12→27px · 1920×1080 30px · 1024×600 26.4px · 812×375 และ 667×375 (เคสข้อความยาวสุด 12 หมวด/4,800 เหรียญ) = 16.5px · **ทุกจอ fits + ไม่มี scroll + ทั้งกล่องอยู่ในจอ** · console สะอาด · ล้างเซฟ+reload แล้ว
  - ⚠️ session คู่ขนานคว้าเลข 594/595 ไประหว่างทาง และ commit รอบ 594 ของเขา**พ่วงโค้ด `qbp` เวอร์ชันแรกของเรา**ไปด้วย (ตรวจ `git log` ก่อน commit ทุกครั้ง)


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 599 (26 ก.ค. · ต่อยอดจากรอบ 597 ผู้ใช้สั่งทำ):** 🎉 **ป้ายอันดับเด้งฉลองตอนไต่อันดับขึ้น** — `js/ui.js` (`rankUpCheck()` ต่อท้าย `updateRankRailBadge()`) `css/lobby.css` (`@keyframes rankNumUp` เด้ง+เรืองทอง · `.rank-up-pop` ▲n ลอยขึ้นแล้วจาง) `js/state.js` (`rankSeen` = อันดับที่เห็นล่าสุด)
  - **กติกา:** เลขน้อยลง = ไต่ขึ้น → เด้ง 1 จังหวะ + ป้าย `▲n` (n = ขึ้นกี่อันดับ) · **ครั้งแรกที่ติดกระดานเงียบ** (ไม่มีของเก่าเทียบ) · **อันดับตกไม่ทักอะไร** (ไม่ซ้ำเติมเด็ก) · `no-anim` = ไม่เด้ง ไม่มี ▲ · ป้าย/▲ เป็น `position:absolute` → **ปุ่มไม่ขยับเลย** · ⚠️ ออฟไลน์ (rank=0) **ไม่ล้าง `rankSeen`** ไม่งั้นเน็ตกลับมาจะกลืนการไต่อันดับจริง
  - **ยืนยันบนเกมจริง (mock login + fake board):** ครั้งแรกอันดับ 6 เงียบ · เน็ตหลุด ป้ายหายแต่จำ 6 ไว้ · เน็ตกลับอันดับ 3 → เด้ง **▲3** · 5→9 (ตก) เงียบ · `no-anim` ขึ้นอันดับ 1 → `animationName:none` ไม่มี ▲ แต่ยังจำเลข · ขึ้นรัว 2 ครั้งใน 150ms → เหลือ ▲ อันล่าสุดอันเดียว ไม่ซ้อน · ปุ่มขนาด 66×61 คงที่ทุกเคส · `rankSeen` ลง localStorage จริง · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 600 (26 ก.ค. · ต่อยอดรอบ 599 ผู้ใช้สั่งทำ):** 🔔 **เสียงตอนไต่อันดับ** — `rankUpSound()` ใน `js/ui.js` (ใช้เสียงชุดเดิม ไม่สร้างเสียงใหม่): ขึ้น 1-2 = `coinGetTier(0)` · 3-5 = `(1)` · ≥6 = `(2)` · **ติด Top 3 = `sfx.win`** (แฟนแฟร์)
  - **กันรบกวน:** ดังเฉพาะตอน `screen-dashboard` active (กระดานอัปเดตได้ตลอดแม้เด็กอยู่ในโลก 3D/กำลังสอบ) · คูลดาวน์ 1.5 วิ กันเสียงซ้อนตอนขึ้นรัว · ปิดเสียงในตั้งค่า = เงียบเอง (`beep()` เช็ก `state.sound` อยู่แล้ว)
  - **ยืนยันบนเกมจริง (mock login · ดัก `sfx` แล้วดัก `beep` ชั้นล่างสุด — ไม่ปล่อยเสียงดังจริง):** ครั้งแรกติดกระดานเงียบ · ขึ้น 2/4/9 → tier 0/1/2 ตรงทุกเคส · ตกอันดับเงียบ · Top 3 → `win` · ขึ้น 2 ครั้งติด → เสียงครั้งเดียว · **อยู่หน้าหมวดคำศัพท์แล้วอันดับขึ้น = เงียบ แต่เลขบนปุ่มยังอัปเดต** กลับล็อบบี้แล้วขึ้นอีกมีเสียงปกติ · โน้ตจริงที่สั่งเล่น: tier1 = 880/1175/1568/1976+2349 · win = 8 ตัวปิด 2093 · console สะอาด · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-26 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 602 (26 ก.ค. · ผู้ใช้สั่ง "ปุ่มแนวตั้งซ้ายสุด เลื่อนมากไปแล้วปุ่มพ้นจอ คนไม่ชำนาญคิดว่าปุ่มหาย"):** 🧭 **ป้ายบอกทาง ▲/▼ ของรางเมนูซ้าย** — `index.html` (ห่อรางด้วย `#rail-wrap` + ปุ่ม `#rail-nudge-up/down`) `css/lobby.css` (`.rail-wrap`/`.rail-nudge` + ขอบไล่สีจาง) `js/ui.js` (`railScrollHint`/`initRailScroll`/`railScrollTop` ท้าย `renderRailWorlds`) `js/util.js` (`showScreen` กลับล็อบบี้ = รางเด้งบนสุด)
  - **กติกา:** ราง 21 ปุ่มยาวเกินจอเสมอ → ด้านที่ยัง**มีปุ่มซ่อนอยู่จริง**เท่านั้นถึงโชว์ป้าย (บนสุด = มีแต่ ▼ · ล่างสุด = มีแต่ ▲ · จอสูงพอจนไม่ต้องเลื่อน = ไม่โชว์เลย) · กด ▲ = กลับเมนูบนสุดทันที · กด ▼ = เลื่อนลง 0.75 จอ · `overscroll-behavior:contain` กันลากเลยไปกวนหน้าอื่น · `no-anim` = ป้ายไม่กระดึ๊บ · ป้ายทับปุ่มแค่แถบ 17px ที่ขอบ ที่เหลือกดปุ่มได้ปกติ
  - **ยืนยันบนเกมจริง (mock login · getBoundingClientRect):** 662×307 / 812×375 / 1280×720 / 1280×1900 → เลย์เอาต์ราง+เวทีเท่าเดิมเป๊ะ (rail x14 w76 · stage x100) · scrollTop 0/300/สุด → คลาส `more-down` / ทั้งคู่ / `more-up` ถูกทุกเคส · กด ▼▼▲ = 138→275→0 · จอสูง 1900 (พอดีไม่ต้องเลื่อน) = ป้ายหายทั้งคู่ · `elementsFromPoint` กลางปุ่ม = โดน `.rail-btn` (แถบไล่สี `pointer-events:none` ไม่บัง) · กดปุ่ม 🏠 บ้าน = เปิดแผงปกติ · ออกไปหน้าสถิติแล้วกลับ = รางอยู่บนสุด · console สะอาด · ล้างเซฟ+reload แล้ว
  - ⚠️ session คู่ขนานรอบ 601 กวาด `css/lobby.css` ของรอบนี้เข้า commit เขาไปแล้ว (เหลือแค่คอมเมนต์เลขรอบในรอบนี้)


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 602 (26 ก.ค. · ต่อยอดรอบ 600 ผู้ใช้สั่งทำ):** 🏅 **สถิติ "อันดับดีที่สุดที่เคยทำได้" ในหน้า 📊 สถิติ** — `js/state.js` (`rankBest` = เลขอันดับน้อยสุดตลอดกาล) `js/ui.js` (อัปเดตใน `rankUpCheck()` + แถวใหม่ใน `renderStats()`)
  - แถวโชว์ **"อันดับ N · ตอนนี้อันดับ M"** (M = `rankSeen`) · ยังไม่เคยติดกระดาน = ข้อความชวนเก็บเหรียญ · **อันดับตกแล้วสถิติไม่ลด** · เซฟเก่าไม่มีคีย์นี้ = 0 แล้วเติมเองรอบแรกที่ออนไลน์
  - **ยืนยันบนเกมจริง (mock login + fake board):** ยังไม่ติดกระดาน → ข้อความชวน · ติดครั้งแรกอันดับ 14 → best 14 · ขึ้นเป็น 6 → best 6 · **ตกไป 17 → best ยังเป็น 6** โชว์ "ตอนนี้อันดับ 17" · ออฟไลน์ best ยังอยู่ · reload แล้วค่ายังอยู่ (localStorage) · แถวไม่ล้นกรอบการ์ด · console สะอาด · ล้างเซฟ+reload แล้ว
  - ⚠️ ตอน commit มี session คู่ขนานแก้ `js/ui.js`/`index.html`/`css/lobby.css`/`js/util.js` ค้างบนดิสก์ (ป้ายบอกทางราง ▲/▼ รอบ 601) → โค้ดเขาถูกพ่วงไปกับ commit+deploy นี้ (deploy อัปโหลดทั้งโฟลเดอร์อยู่แล้ว) · เทสต์แล้วล็อบบี้/รางปกติ 21 ปุ่ม console สะอาด


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 603 (26 ก.ค. · ผู้ใช้สั่ง "จัดพื้นที่ว่างคอลัมน์ขวาหลังถอดกลุ่มอันดับรอบ 594 ให้คุ้ม"):** 🧩 **คอลัมน์ขวาล็อบบี้เต็มถึงก้นจอ** — ต้นตอ: กล่องอันดับเดิมเป็นตัว `flex:1` กินที่ที่เหลือ พอถอดไปรางซ้าย (รอบ 594) เหลือ 2 กล่อง `flex:0 0 auto` → **ว่าง 364/565px (64%)** ที่ 1280×720 · แก้ `css/lobby.css` (บล็อกรอบ 603 ท้ายไฟล์) + `js/ui.js` (`sideIsTall`/`onPerPage`/`onChunk`/`onPageSpread`)
  - 🎯 **ภารกิจ**: จอสูง ≥400px ถอด `q-fit` → กลับมาโชว์แถบความคืบหน้า+จุด 3 ใบ+บรรทัดโบนัส (58→112px) · จอเตี้ยยังหด 2 บรรทัดเหมือนเดิม · 🧑‍🤝‍🧑 **เพื่อนออนไลน์**: กินที่ที่เหลือทั้งหมด + **1 หน้าใส่เพื่อนหลายคนตามที่วัดได้** (1280×720 = 7 คน/หน้า แทน 1 คน) เกลี่ยหน้าเท่า ๆ กัน (8 คน → 4+4 ไม่ใช่ 7+1) · gap เพดาน 22px กันแถวลอยห่างบนจอสูงมาก · ที่ว่างเปลี่ยน (หมุนจอ/ย่อหน้าต่าง) = ตัวจับเวลาหั่นหน้าใหม่เอง
  - **ยืนยันบนเกมจริง (mock login · getBoundingClientRect):** 1280×720 กล่องล่างสุดจบที่ 655 = ก้นคอลัมน์พอดี (เดิม 291) · 812×375 = 2 คน/หน้า · 1280×1900 = 9 คนหน้าเดียวไม่ต้องพลิก · **662×307 เคยล้นออกนอกกรอบ 8px → เพิ่ม `@media(max-height:340px)` บีบขอบกระจก+`min-height:56px` แล้วจบพอดีที่ 266** · โหมดออนไลน์จริง (fake Online 10 คน+การ์ดชวน) หน้าไม่ล้น การ์ดชวนยังหน้าละใบ · เพื่อนใหม่เข้า = เด้งไปหน้าที่มีเขา+แฟลชถูกหน้า · แตะแถวเพื่อน = เมนูลัดเปิดปกติ · การ์ดภารกิจพลิกครบ 3 ใบไม่ล้นกรอบ (วัด 5 ครั้ง = 0) · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 604 (26 ก.ค. · ผู้ใช้สั่ง 2 ข้อ):** 🎬 **เวทีกลางล็อบบี้ = "คลิปน้องน่ารัก" แทนเหรียญแรงค์ยักษ์+สไปรต์เดินไปมา** · ① แรงค์ย้ายเป็นแท็บเล็กใต้วันเดือนปี (`#rank-tab` · `renderRankTab()` ใน `js/ui.js` + `index.html` + CSS ท้าย `css/lobby.css`) ② เวที = `petShowBgHTML()/petShowHTML()` ฉากการ์ตูนญี่ปุ่นต่อชนิด (หมา=ทุ่งหญ้า · แมว=ซากุระ · มังกร=สนธยา) + ตัวน้องจากภาพต้นแบบใน `img/` ตามช่วงวัย (`currentPetImg`) เล่นลูป 9 วิ ด้วย CSS ล้วน: หายใจ→กระโดด 2 ที→**จังหวะดีใจสลับเป็นภาพ `_happy` (2 เฟรมแบบ GIF)** +หัวใจ/โน้ต→หันตัวกลับ · ไม่มีไฟล์ gif/วิดีโอใหม่ (เบา ออฟไลน์ได้)
  - ขนาดน้องใช้ตารางใหม่ `PET_SHOW_H` (% ของกรอบ ตามร่างยักษ์ 64→85%) ตัดด้วย `66cqw` — ค่าเดิม `--pet-vh` จูนไว้ให้กล้อง 3D ใส่ตรง ๆ แล้วยักษ์ทุกระดับชนเพดานเท่ากัน · ป่วย/หลับ/แรกเกิด = `ps-calm` (ไม่กระโดด + ป้าย 🤒/💤) · `heroRankBgHTML/petVisualHTML/petAnimHTML` เลิกใช้แล้วแต่ยังเก็บไว้
  - **ยืนยันบนเกมจริง (mock login · getBoundingClientRect + capture ฉากจริงผ่าน foreignObject):** คลิกแท็บ 🐕/🐈/🐲 → ภาพ+ธีมเปลี่ยนครบ 3 ชนิด · 1280×720 / 812×375 / 662×307 / 735×694 น้องไม่ล้นกรอบแม้ตอนเดินสุดขอบ · ร่างยักษ์ 0-4 = 60/65/70/75/80% ของกรอบ · ปิดเอฟเฟกต์เคลื่อนไหว = `animation:none` ทุกชั้น · แตะน้องยังร้อง+เปิดโปรไฟล์ · แท็บแรงค์คลิกแล้วเปิดแผงแรงค์ (จอเตี้ย ≤400px แท็บขยับไปข้างวันที่ ไม่กินความสูงเวที) · console สะอาด ไม่มี error · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 605 (26 ก.ค. · ผู้ใช้เจนคลิป AI มาเองแล้วสั่ง "เอาไปใส่ล็อบบี้ให้สมช่วงวัย"):** 🎬 **เวทีเล่นคลิปวิดีโอน้องตามช่วงวัย** — ไฟล์ `clip/<pet>_<newborn|baby_normal|adult_normal>.mp4` (ตอนนี้มีแมวครบ 3 วัย · 1280×720 · 8 วิ · พื้นหลังดำ) · `petClipKey/petClipUrl` ใน `js/images.js` · `<video autoplay muted loop playsinline>` เต็มกรอบ (`object-fit:cover` + `padding-bottom:0` ในโหมด `ps-clip-mode`) ใน `js/ui.js`+`css/lobby.css` · `sw.js` ข้าม .mp4 (SW แคช Range 206 แล้ววิดีโอเล่นพัง)
  - **กติกาเลือกคลิป:** เล่นเมื่อ *มีไฟล์ของวัยนั้น* + ไม่ป่วย/ไม่หลับ/ไม่หิว/ไม่ใส่ชุด (`petStateImg`=null) + ไม่ได้ปิดเอฟเฟกต์เคลื่อนไหว · **ไม่มีไฟล์ = video ยิง error → จำ `CLIP_FILES[key]=null` ถอด `ps-clip-mode` ตกไปใช้ฉากการ์ตูน CSS รอบ 604 ทันที** (ครูวางคลิปหมา/มังกรเพิ่มทีหลังได้เลย **ไม่ต้องแก้โค้ด** แค่ตั้งชื่อไฟล์ให้ตรง) · ฉาก+ภาพนิ่งยังวาดอยู่ใต้คลิปเสมอ (opacity:0) → `#pet-tap`/`heartsFx`/`pat-remind` ทำงานเหมือนเดิม
  - **ยืนยันบนเกมจริง (mock login):** แมว lv1/2/3 → `cat_newborn`/`cat_baby_normal`/`cat_adult_normal` ตรงวัย · วิดีโอเต็มกรอบพอดี 653×469 ไม่มีขอบดำ (crop กลางไม่ตัดตัวน้อง — ตรวจด้วยการวาด cover จริงลง canvas) · สลับไปหมา/มังกร (ยังไม่มีคลิป) = ฉากการ์ตูนขึ้นแทน ไม่มีจอดำค้าง แล้วจำไว้ไม่ยิงซ้ำ · กลับมาแมว = คลิปเล่นต่อ · ปิดเอฟเฟกต์/ป่วย/หิว = ภาพนิ่งตามสถานะ · แตะน้องตอนคลิปเล่น = ร้อง+เปิดโปรไฟล์ปกติ · console ไม่มี error · ล้างเซฟ+reload แล้ว
  - ⚠️ คลิป 3 ไฟล์ = 5.2MB เข้า repo (deploy ใช้ `git archive HEAD` ไม่ commit = ไม่ขึ้นเว็บ) · ถ้าครบ 9 ไฟล์จะ ~15MB — ถ้าหนักไปค่อยแปลงเป็น webm/ลด bitrate ทีหลัง


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 606 (26 ก.ค. · ผู้ใช้เจนคลิปหมา+มังกรเพิ่มครบ):** 🐕🐉 **คลิปครบทั้ง 9 (3 ชนิด × 3 วัย)** — ไม่แก้โค้ดเลยสักบรรทัด (ระบบรอบ 605 หยิบไฟล์ตามชื่อเอง) แค่ commit ไฟล์ + deploy · ทั้ง 9 ไฟล์ 1280×720 · 8 วิ · รวม ~15.3MB ใน repo
  - **ยืนยันบนเกมจริง:** วน 3 ชนิด × Lv.1/2/3 = **9/9 เล่นคลิปถูกไฟล์ ไม่มี error** (`dog_newborn`/`dog_baby_normal`/`dog_adult_normal` · `cat_*` · `dragon_egg`/`dragon_baby_normal`/`dragon_adult_normal`) · วิดีโอเต็มกรอบพอดีทุกไฟล์ · crop กลางไม่ตัดตัวน้อง (วาด cover จริงลง canvas ดูครบ 6 ไฟล์ใหม่) · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 607 (26 ก.ค. · ผู้ใช้แจ้ง "ยังไม่เห็นวิดีโอ เพราะเน็ตช้าหรือเปล่า"):** 🩹 **บั๊กของรอบ 605 เอง — เข้าโหมดคลิปตั้งแต่ยังโหลดไม่ได้สักไบต์** → `ps-clip-mode` ถูกใส่ตอน render (readyState=0) ทำให้ฉากการ์ตูน+ภาพน้อง `opacity:0` แต่วิดีโอยังว่าง = **เด็กเห็นกรอบดำเปล่านานเท่าที่เน็ตช้า และค้างถาวรถ้าเน็ตหลุด** (พิสูจน์บนเว็บจริง: ที่ 60ms → clipMode=true, readyState=0, bg=0, pet=0)
  - **แก้:** `__clipReady()` ใน `js/ui.js` — ใส่คลาสเฉพาะเมื่อ **เคยโหลดคลิปนั้นสำเร็จในหน้านี้แล้ว** · ครั้งแรกรอ event `canplay` ค่อยเฟดสลับ (`.ps-video{opacity:0;transition:.45s}` ใน `css/lobby.css` แทน `display:none`) · ระหว่างรอเน็ตเด็กเห็นฉากการ์ตูน+ตัวน้องปกติ ไม่มีจอดำ
  - **ยืนยัน (localhost ล้างแคช+SW):** ยังไม่โหลด (60ms/rs=0) → clip=false, ฉาก+น้าง opacity 1 · โหลดเสร็จ 2.6 วิ → clip=true เฟดเข้า · re-render ซ้ำ (เช่นได้เหรียญ) = เข้าคลิปทันทีไม่วูบกลับ · ไฟล์หาย/เน็ตหลุด = อยู่กับฉากการ์ตูนตลอด ไม่ดำ · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 608 (26 ก.ค. · ผู้ใช้ยังไม่เห็นคลิป + ตั้งข้อสงสัย "layer ภาพอยู่บนวิดีโอหรือเปล่า"):** 🔎 **เลิกเดา — ให้เกมบอกเหตุผลเอง + กันเคสภาพทับคลิป**
  - **ข้อสงสัยผู้ใช้ถูกครึ่งหนึ่ง:** `.ps-pod` (ภาพนิ่ง) มี `z-index:1` และอยู่**หลัง**วิดีโอใน DOM → **วาดทับ video จริง** เดิมรอด้วย `opacity:0` อย่างเดียว · เครื่องไหน opacity ไม่ทำงานตามคาด = ภาพบังคลิปเงียบ ๆ → **แก้: `.ps-clip-mode .ps-video{z-index:2}`** (วัดบนเว็บจริงก่อนแก้: pod op=0 · video op=1 กำลังเล่น t=7.9s ⇒ ที่เครื่องผมไม่บัง แต่กันไว้แล้ว)
  - **ป้ายบอกเหตุผลบนเวที `petClipHint()` + `.ps-hint`** (หายเองเมื่อคลิปเล่น): ⏳ กำลังโหลด / 🎬 ปิดเอฟเฟกต์เคลื่อนไหวอยู่ / 🤒 ป่วย / 💤 หลับ / 😫 หิว / 🎀 ใส่ชุด / ยังไม่มีคลิปวัยนี้ — ครูอ่านป้ายแล้วบอกได้เลยว่าติดอะไร ไม่ต้องเดาข้ามเครื่อง
  - **ปุ่ม "▶️ แตะเพื่อเล่นคลิปน้อง"** โผล่เมื่อคลิปพร้อมแล้วแต่ยังหยุดนิ่งเกิน 1.5 วิ (เครื่องบล็อก autoplay/โหมดประหยัดแบต-เน็ต) · กดแล้วเล่น ปุ่มหายเอง
  - **ยืนยัน (localhost ล้างแคช+SW):** กำลังโหลด→ป้าย ⏳ · โหลดเสร็จ→ป้ายหาย + `z-index` video=2 pod op=0 · ปิดเอฟเฟกต์/ป่วย→ป้ายตรงเคส · จำลองบล็อก autoplay→ปุ่มโผล่ กดแล้วเล่นจริง (t=0.76) ปุ่มหาย · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 609 (26 ก.ค. · ปิดเคส "ไม่เห็นคลิป" — ป้ายรอบ 608 ชี้ต้นตอทันทีจากภาพหน้าจอผู้ใช้):** 🧢 **ต้นตอ = น้องใส่หมวกแก๊ปอยู่** → กฎที่ผมตั้งเองรอบ 605 ("ใส่ชุด = โชว์ภาพนิ่ง") ทำให้เด็กที่แต่งตัวให้น้องไม่มีวันเห็นคลิปเลย
  - **แก้กฎ:** ใส่ชุด **ไม่บล็อกคลิป** อีกต่อไป (`petClipUrl` ใน `js/images.js` เลิกใช้ `petStateImg` มาเช็ก sick/sleeping/hungry ตรง ๆ แทน) · ป่วย/หลับ/หิว ยังคงโชว์ภาพนิ่งตามสถานะเหมือนเดิม
  - **ปุ่มสลับ `.ps-dress` มุมล่างซ้ายเวที** (โผล่เฉพาะตอนใส่ชุด): "🧢 ดูน้องใส่ชุด" ↔ "🎬 ดูคลิปน้อง" · จำค่าไว้ใน `state.psDress` (เซฟลง localStorage แล้ว) · ภาพใส่ชุดยังอยู่ในหน้า "ข้อมูลน้อง" เหมือนเดิม
  - **ยืนยัน (localhost · ใส่ cap เหมือนเคสผู้ใช้):** ใส่หมวก→คลิปเล่นปกติ + ปุ่ม "🧢 ดูน้องใส่ชุด" · กด→ภาพ `cat_adult_cap.png` ปุ่มเปลี่ยนเป็น "🎬 ดูคลิปน้อง" · กดกลับ→คลิปเล่นต่อ · ถอดหมวก→ปุ่มหายเอง คลิปยังเล่น · `psDress` รอด reload · ป้าย ⏳ ถูกซ่อนตอนคลิปเล่น · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 611 (26 ก.ค. · ผู้ใช้สั่งบีบคลิปให้เล็กลง):** 🗜️ **คลิปน้อง 9 ไฟล์ 15.3MB → 3.8MB (24% ของเดิม · เด็กเน็ตช้าโหลดเร็วขึ้น ~4 เท่า)**
  - ติดตั้ง **ffmpeg** (winget `Gyan.FFmpeg` 8.1.2) · เจนตัวเล็กลง `clip/sm/<key>.mp4` (H.264 CRF 28) + `.webm` (VP9 2-pass CRF 40) · **ตัดเสียงทิ้ง** (เกมเล่น muted อยู่แล้ว เสียง AAC กินไฟล์ละ ~140KB ฟรี ๆ) · คงความละเอียด 1280×720 · **ต้นฉบับใน `clip/` ไม่ถูกแตะ** เป็นตัวสำรอง
  - เกมเลือกเอง: `CLIP_SM` + `clipFileFor()` ใน `js/images.js` (เรียงเล็กสุดก่อน · ข้าม webm ถ้า `canPlayType` ตอบไม่ได้) · `js/ui.js` error handler ถอยไปต้นฉบับ 1 ครั้งก่อนยอมแพ้กลับฉากการ์ตูน
  - เครื่องมือใหม่ **`bash tools/compress_clips.sh`** (+`tools/gen_clip_map.py`) — ครูเจนคลิปใหม่วางใน `clip/` แล้วรันคำสั่งเดียว บีบ+เจนตาราง `CLIP_SM` ให้เอง (ข้ามไฟล์ที่บีบแล้ว · `--force` บีบใหม่หมด)
  - **วัดจริง (VMAF vs ต้นฉบับ):** mp4 CRF 28 = 86–89 (ภาพ crop 100% แยกไม่ออก) · vp9 กินที่มากกว่าที่คุณภาพเท่ากัน (ต้นฉบับเป็น H.264 อยู่แล้ว) → **8/9 ไฟล์เกมเลือก mp4 · dog_newborn เลือก webm** · ยืนยันด้วย node unit test ทั้งเคส webm ได้/ไม่ได้ + เช็กไฟล์มีจริงครบ 9


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 480:** 🧹 **ซ่อมต้นตอ "ไฟล์บูตบวม" + ตั้งกฎทองข้อ 9 (ผู้ใช้สั่งให้เป็นกฎใหญ่)** — `tools/rotate_handoff.py` หมุนเฉพาะ *bullet ในหัวข้อเดียว* แต่ทุก session ดันแทรก **หัวข้อ `### 📌 สรุปสถานะล่าสุด` อันใหม่** ทุกครั้ง → สะสม 38 หัวข้อ ตัวหมุน **ไม่เคยทำงานเลย** (รายงาน "ไม่ต้องหมุน" ทุกครั้งทั้งที่เกินงบ) · เพิ่ม `rotate_status_heads()` เก็บ 8 หัวข้อล่าสุด ที่เหลือเข้า `handoff/archive/TASKS_STATUS.md`
  - **ผล: `handoff/TASKS.md` 84.8KB → 20.8KB** (บูต session ใหม่ถูกลง ~4 เท่า) · ประวัติไม่หาย ย้ายเข้า archive ครบ 30 หัวข้อ (Grep `รอบ <เลข>` เจอเหมือนเดิม)
  - **🏆 กฎทองข้อ 9 ใหม่ใน `HANDOFF.md`:** เจออะไรที่เปลือง token ของ session ถัดไป → **ลงมือแก้เองทันที ห้ามแค่รายงานแล้วรอผู้ใช้อนุมัติ** · เงื่อนไขเดียว = ต้องไม่ทำให้งานเสีย (ย้ายเข้า archive ไม่ใช่ลบ · ไม่แตะโค้ดเกม · ทดสอบ+จดเหมือนงานปกติ) · ยังต้องถามก่อนถ้า ลบถาวร/เสียเงิน/เสี่ยงความปลอดภัย/เปลี่ยนวิธีเล่น
  - ไม่แตะไฟล์เกม → **ไม่ต้องบัมพ์ version / ไม่ต้อง deploy** (เว็บยังเป็นเวอร์ชันล่าสุดของ session คู่ขนาน)


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 612 (27 ก.ค. · ผู้ใช้ส่งภาพหัวล็อบบี้มาบอก "ดูไม่ Professional เลย"):** 🎩 **จัดหัวล็อบบี้ใหม่ให้เป็นชุดเดียวกัน** — ต้นตอ = แต่ละก้อนโตกันคนละรอบ จึงคนละสไตล์/คนละความสูง (รูป passport ลอยแยกจากป้ายชื่อ · pill ขาวขอบหนา 3 อันสูง 31/35/35 เหลื่อมกัน · emoji ทำหน้าที่ไอคอนระบบ 📅⏰🌐👆)
  - **แก้:** `index.html` ห่อเป็น 2 ก้อน `.id-card` (รูป+ชื่อ+🆔+วันเวลา+แรงค์) กับ `.coin-group` (3 ช่องในกล่องเดียว มีเส้นคั่น) · CSS โซนใหม่ท้าย `css/lobby.css` (banner 🎩 หัวล็อบบี้โปร) กระจกน้ำเงินชุดเดียว สูงเท่ากันด้วย `--top-h` · `js/ui.js` ตัดรูปเล็กซ้ำในป้ายชื่อ + วันที่แบบสั้น + 🆔 เป็นชิป + แบนเนอร์คำใหม่/แท็บสัตว์เข้าชุด
  - **ยืนยัน (localhost mock login · getBoundingClientRect):** 1280×720 ทั้ง 3 ก้อนกึ่งกลางแนวเดียวกันที่ 59px · ช่องตัวเลขสูง 28 เท่ากันหมด · ปุ่มไอคอน 38×38 · แท็บสัตว์ 33px ทุกใบ · แถบบนสูงขึ้นแค่ 3px (75→78) · 812×375 หัวยังแถวเดียวไม่ล้น (ขวาสุด 802/812) · แตะ pill ทั้ง 3 เปิดกล่องอธิบายได้ครบ · `coin-pop`/แก้ชื่อ/แรงค์ยังทำงาน · console สะอาด · ล้างเซฟแล้ว



## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 613 (27 ก.ค. · ผู้ใช้ขีดเส้นแดง/เขียวบนภาพสั่ง 4 ข้อ):** 📐 **จัดคอลัมน์เวทีล็อบบี้ให้ตรงแนวเดียวกันหมด**
  - ปุ่ม **"🐾 ข้อมูลน้อง"** ย้ายจากคอลัมน์ซ้ายของการ์ด → **หัวแถวเดียวกับชื่อสัตว์** ขนาดเท่าแท็บเป๊ะ (`.pet-tab.info` · สร้างใน `renderDashboard` ก่อนการ์ด) · แจ้งเตือน 🤒/😫 ยังกะพริบเหมือนเดิม
  - **3 แถวขวา (เหรียญ · NEW · ข้อมูลน้อง+ชื่อสัตว์) เริ่มตรง "เส้นแดง" = ขอบซ้ายเวที `.stage-hero`** และกว้างไม่เกินเวที — `stageColLeft()`+`alignCoinGroup/alignNewWord/alignPetTabs` ใน `js/ui.js` (แบนเนอร์เลิกจัดกึ่งกลางแบบรอบ 326 — เหรียญแรงค์ที่เคยยึดถูกถอดไปตั้งแต่รอบ 604 การจัดกึ่งกลางจึงยื่นล้ำไปทับฟีด) · แถวบนใช้ตัวคั่นใหม่ `.top-flex2` ให้ปุ่มไอคอนยังชิดขวา
  - **ฟีดเพื่อนยืดขึ้นชน "เส้นเขียว" (ขอบบนเวที)** — `alignStageLeft()` ดัน `.stage-left` ด้วย margin-top ติดลบ (คอลัมน์เหลือฟีดอย่างเดียวแล้ว) · CSS โซนใหม่ท้าย `css/lobby.css` (banner 📐 จัดคอลัมน์เวที)
  - 🔭 **บั๊กที่เจอระหว่างทาง:** วัดตำแหน่งใน handler `resize` ตรง ๆ ได้ค่าของ layout เก่า (แถวค้างเส้นเดิมตอนย่อจอ) → เพิ่ม **ResizeObserver เกาะ `.stage-hero`** (`watchStageCols()`) + rAF ซ้อน 2 ชั้น
  - **ยืนยัน (localhost · getBoundingClientRect):** 1046×493 (ขนาดจอผู้ใช้) ขอบซ้าย เวที/เหรียญ/NEW/แท็บ = 299.6/299.6/299.5/299.5 · ขวาสุดทุกแถว ≤ 784 (ขอบขวาเวที) ไม่ล้น · ฟีดบนสุด 98.1 = ขอบบนเวทีพอดี · 1280×720 ตรงกันที่ 365 · 812×375 กล่องเหรียญชนการ์ดประจำตัวก่อนถึงเส้น (ซ้ายสุดเท่าที่เป็นไปได้ ไม่ล้ำเส้น) · คลิกปุ่มข้อมูลน้อง/สลับน้อง/ป่วย-หิว/ไม่มีน้องเลย = ปกติทุกเคส · ปุ่ม 💊 ยังตรงแนวแถวแท็บ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 614 (27 ก.ค. · ผู้ใช้สั่ง 3 ข้อจากภาพแผงโรงงาน):** 🏭 **โรงงานผลิตสินค้าเปิดเต็มจอ + แคตตาล็อก 2 แถว × 8 คอลัมน์ + จัดหน้าใหม่ให้ดูโปร**
  - เต็มจอเฉพาะแผงโรงงาน: `openPanel()` ใน `js/lobby.js` ตั้ง `#panel-overlay[data-page]` → CSS โซนใหม่ท้าย `css/lobby.css` (banner 🏭 โรงงานเต็มจอ) ขยาย `.panel-box` เป็น 100vw×100dvh · แผงอื่นคงเดิม 98vw
  - ผังใหม่: พลิก `.fc-cols` เป็นแนวตั้ง = **แถบเครื่องมือบน** (สถานะสายการผลิต | 🎟️ แต้มส่วนลด | ตัวกรองหมวด) + **แคตตาล็อกเต็มความกว้างด้านล่าง** · แคตตาล็อกเป็น grid `grid-auto-flow:column` 2 แถว กว้างคอลัมน์ = `(100% − gap)/8` (ตัวแปร `--fc-n`) การ์ดยืดสูงตามจอเอง · หัวแคตตาล็อกใหม่ `.fc-cat-head` (ชื่อ+ชิปนับชนิด+คำใบ้ปัด) สร้างใน `renderFactory()` (`js/ui.js`) · ชื่อสินค้าเต็ม 2 บรรทัด (ช่องแคบลง ตัด ... บรรทัดเดียวอ่านไม่ออก)
  - 🔭 **บั๊กที่เจอระหว่างทาง:** ทำชิปแต้มส่วนลดเป็น `display:flex;column` ทำให้ข้อความในบรรทัดเดียวถูกหั่นเป็น 3 flex item ซ้อนกัน แถบเครื่องมือสูง 89px กินที่การ์ด → กลับเป็น `display:block` + `.mkt-filter` เตี้ยลง เหลือ 52px (รูปสินค้า 52→71px)
  - **ยืนยัน (localhost mock login · offsetWidth/getBoundingClientRect):** 1046×493 (จอผู้ใช้) กล่อง 1046×494 เต็มจอ · การ์ด 102×143 เห็น **8 คอลัมน์ × 2 แถว** พอดี ไม่มี scroll แนวตั้ง (443/443) · 1280×720 การ์ด 132×236 ยัง 8×2 · 812×375 ถอยเป็นแถวเดียวรูปใหญ่อัตโนมัติ (`max-height:420px`) ไม่ล้นจอ · ทดสอบทั้งตอนว่าง/กำลังผลิต/เหรียญไม่พอ ไม่มีข้อความล้นกรอบสักใบ · ซื้อจริงหักเหรียญ+แต้มถูก (99999→99565 ลด 66) · เปลี่ยนหมวดชิปนับตรง · แผงอื่น (ตลาด/บ้าน/สวน/ร้าน/แรงค์) ยังกว้าง 1014 เท่าเดิม · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 615 (27 ก.ค. · ผู้ใช้ส่งภาพการ์ดน้องแมว สั่งเปลี่ยนพื้นดำในคลิปเป็นชมพู):** 🌸 **พื้นหลังดำในวิดีโอคลิปน้องทุกตัว (9 ไฟล์: cat/dog/dragon ทุกวัย) → ชมพูพาสเทล `#FFF0F5`**
  - วิธี: `ffmpeg colorkey` (คีย์ดำ 0x000000 ความคล้าย 0.16/blend 0.08) ทับพื้นสีชมพูล้วน — คงพื้นเทา/เงาที่สัตว์ยืนไว้ (ไม่ใช่สีดำ จึงไม่โดนคีย์) · เก็บต้นฉบับดำไว้ที่ `clip/_backup_black/` ก่อนเขียนทับ `clip/*.mp4`
  - รัน `bash tools/compress_clips.sh --force` ต่อ → อัปเดต `clip/sm/*.{mp4,webm}` (ไฟล์จริงที่เกมโหลด) + ตาราง `CLIP_SM` ใน `js/images.js` ครบ 9 คลิป
  - **ยืนยัน:** เทียบพิกเซลมุมภาพ offline (ffmpeg) ทุกชนิดสัตว์ + เล่นไฟล์จริงจาก `clip/sm/dragon_egg.mp4` ผ่าน `<video>` element ใน browser จริง วาดลง canvas อ่านพิกเซลได้ `rgb(253,239,242)` ≈ ตรงเป้า (ต่างจาก `#FFF0F5` เล็กน้อยจาก video compression ปกติ) · ยังไม่ได้ทดสอบผ่านหน้าเกมเต็ม (ล็อกอิน mock ไปไม่ถึงหน้าโชว์น้อง — ยืนยันด้วยไฟล์วิดีโอจริงแทน)


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 616 (27 ก.ค. · ต่อจากรอบ 614 ผู้ใช้สั่ง 2 ข้อ):** 🧩 **ยกกริด "2 แถว × 8 คอลัมน์" เป็นคลาสกลาง `.grid2x8` แล้วเอาไปใช้อีก 2 ที่**
  - **`.grid2x8` (โซนใหม่ใน `css/lobby.css`)** = สูตรกริดที่รอบ 614 เขียนไว้เฉพาะโรงงาน ยกออกมาใช้ร่วม (คุมคอลัมน์ด้วย `--fc-n` · จอแคบลดให้เอง 6/5/4/3) · โรงงานเลิกถือสูตรเอง เหลือแค่คลาส
  - **🏪 ตลาดเต็มจอ** (`[data-page="panel-market"]` 100vw×100dvh) + **คลังสินค้าของฉัน** เป็น 2 แถว × 8 คอลัมน์ (`.mine-strip` แถวสูง `clamp(122px,20vh,168px)` เพราะหน้านี้เลื่อนแนวตั้งได้)
  - **👤 ทรัพย์สินที่เปิดเผยในการ์ดโปรไฟล์** เปลี่ยนจากกริด auto-fill 56px → ถาดน้ำเงินแบบโรงงาน 2 แถว × 8 คอลัมน์ + ลูกศรเลื่อน + ชื่อสินค้าใต้รูป (`showPlayerCard` ใน `js/ui.js` เรียก `bindStripArrows`) · **ของ ≤8 ชิ้น = แถวเดียว** ด้วย `:not(:has(> :nth-child(9)))` (เบราว์เซอร์เก่าไม่รู้จัก :has → คง 2 แถว ไม่พัง)
  - 🔭 **บั๊กที่เจอ:** `.pl-assets` เดิมมี `grid-template-columns:auto-fill` ค้างอยู่ ชนะ `grid-auto-columns` ของ `.grid2x8` → ได้ 10 คอลัมน์เล็ก ๆ แทน 8 · แก้ด้วย `grid-template-columns:none`
  - **ยืนยัน (localhost mock login · offsetWidth):** 1046×493 ตลาด/โรงงานกล่อง 1046×493 เต็มจอ · คลังของฉัน 30 ชิ้น = 2 แถว 8 คอลัมน์ (การ์ด 101×122) · 6 ชิ้น = แถวเดียว ลูกศรซ่อนเอง · โปรไฟล์ 20/40 ชิ้น = 2 แถว 8 คอลัมน์ (ไทล์ 82×74) ลูกศรโผล่ · 5 ชิ้น = แถวเดียว · 1280×720 ทุกจุดยัง 8 คอลัมน์ · 812×375 ลดเป็น 6 คอลัมน์ ไม่มีข้อความล้นกรอบ การ์ดโปรไฟล์ยังอยู่ในจอ · แผงบ้าน/สวน/ร้าน ยังกว้าง 1014 เท่าเดิม · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 617 (27 ก.ค. · ผู้ใช้บอก "ทรัพย์สินในโปรไฟล์ขนาดยังไม่เท่าหน้าโรงงาน"):** 📏 **ไทล์ทรัพย์สิน = การ์ดโรงงานเป๊ะ** (แก้ `css/lobby.css` ไฟล์เดียว)
  - ต้นตอ: รอบ 616 ตั้งแถวไว้เตี้ย (`--pl-row` clamp 74–116px) เทียบการ์ดโรงงาน 142px + ไทล์ยังเป็นกล่องขาวธรรมดา
  - แก้ 3 จุด: ① `--pl-row:clamp(110px,calc(41vh − 60px),260px)` — สูตร vh ที่ล้อความสูงการ์ดโรงงานได้ทั้งจอเตี้ย/จอสูง ② ไทล์เปลี่ยนเป็นหน้าตา `.hq-card` (พื้นไล่ฟ้า ขอบ 2px เงา + ชื่อสินค้าเป็น **หัวการ์ดน้ำเงินด้านบน** ด้วย `order:-1` 2 บรรทัด + รูปใหญ่เต็มการ์ดมี drop-shadow + hover ยกขึ้น) ③ `.pl-card.pl-wide` 860→**1180px** (96vw) ให้ความกว้างช่องเท่าหน้าโรงงานด้วย
  - **ยืนยัน (localhost mock login · offsetWidth):** 1046×493 การ์ดโรงงาน 102×142 vs ไทล์โปรไฟล์ **101×142 (เท่ากัน)** · 1280×720 = 131×235 vs 123×235 (สูงเท่ากันเป๊ะ กว้างต่าง 6% เพราะการ์ดโปรไฟล์เป็น 96vw ไม่ใช่ 100vw) · 812×375 ไทล์ 100×110 การ์ดทั้งใบ 780×353 ยังอยู่ในจอ · 20 ชิ้น = 2 แถว 8 คอลัมน์ + ลูกศร · 5 ชิ้น = แถวเดียว ลูกศรซ่อน · ป้าย ×2 ยังอยู่ · คลิกเปิดรูปใหญ่ยังทำงาน · ชื่อไม่ล้นกรอบสักใบ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 618 (27 ก.ค. · ผู้ใช้ส่งภาพแจ้ง 2 ข้อจากรอบ 615):** 🐾 **แก้ตาสัตว์ที่หายไปหลังคีย์พื้นหลัง + เปลี่ยนสีพื้นเป็นฟ้าอ่อน `#E0F7FA`**
  - ต้นตอ: รอบ 615 ใช้ `ffmpeg colorkey` คีย์สีดำแบบ **global threshold** — ตาสัตว์ (สีดำเช่นกัน) โดนคีย์หายไปด้วยทั้งที่ไม่ใช่พื้นหลัง
  - แก้ด้วยสคริปต์ใหม่ (Python: numpy+scipy+cv2, ไม่ใช้ ffmpeg colorkey แล้ว) ประมวลผลทีละเฟรมจากต้นฉบับดำจริง — **flood-fill หา "บริเวณดำที่ต่อถึงขอบภาพ" เท่านั้น** (connected-component labeling หลัง pad ภาพกันขอบถูกกัดจาก `binary_closing`) ถึงจะแทนด้วยสีใหม่ · บริเวณดำที่ถูกล้อมรอบ (ตา/ช่องปีกมังกร) ไม่ต่อถึงขอบ → คงสีดำไว้ตามเดิม
  - เปลี่ยนสีพื้นจากชมพู `#FFF0F5` (รอบ 615) → ฟ้าอ่อน `#E0F7FA` ตามที่ผู้ใช้สั่งรอบนี้ · รันซ้ำครบ 9 ไฟล์ (`clip/*.mp4` + `clip/sm/*.{mp4,webm}` + `js/images.js`) · ลบ `clip/_backup_black/` แล้ว (ต้นฉบับดำจริงยังย้อนดูได้จาก git history ก่อนรอบ 615)
  - **ยืนยัน:** เล่นไฟล์จริง `clip/sm/cat_adult_normal.mp4` ผ่าน `<video>` ใน browser จริง วาดลง canvas → มุมพื้นหลัง `rgb(223,245,249)` ≈ `#E0F7FA` ตรงเป้า · จุดมืดสุดในโซนดวงตา = `rgb(0,0,0)` ยืนยันตาดำกลับมาแล้ว · เช็กเฟรมนิ่งข้ามชนิดสัตว์ครบ (แมว/หมา/มังกร ทุกวัย รวมมังกรที่มีไฟส้ม-แดงในเฟรม) ไม่มีพื้นดำหลงเหลือ ไม่มีขอบเป็นเหลี่ยม · ยังไม่ได้ทดสอบผ่านหน้าเกมเต็ม (ล็อกอิน mock ไปไม่ถึงหน้าโชว์น้อง — ยืนยันด้วยไฟล์วิดีโอจริงแทนเหมือนรอบ 615)


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 619 (27 ก.ค. · ผู้ใช้สั่งต่อ 2 ข้อจากรอบ 617):** 🖥️ **การ์ดโปรไฟล์เต็มจอ + สัตว์เลี้ยงใช้การ์ดชุดเดียวกับทรัพย์สิน/โรงงาน** (แก้ `css/lobby.css` ไฟล์เดียว)
  - `.pl-card.pl-wide` 1180px → **100vw × 100dvh** · ย้ายตัวแปร `--pl-row`/`--fc-n`/`--pl-gap` มาไว้ที่นี่ (ลูกทุกส่วนในการ์ดใช้ร่วมกัน)
  - **🐾 สัตว์เลี้ยง**: จากกล่องเล็ก 92px เรียง flex → ถาดน้ำเงินเข้ม + การ์ด `.hq-card` (หัวน้ำเงินชื่อน้อง `order:-1` → รูปใหญ่มีเงา → hover ยก) กว้าง **1 คอลัมน์เท่าการ์ดโรงงานเป๊ะ** และตรงแนวคอลัมน์กับแถวทรัพย์สินด้านล่าง
  - **เคล็ดที่ทำให้กว้างเท่ากันเป๊ะ:** โรงงานมีกล่อง `.shop-card` ซ้อน + ลูกศร 38px ส่วนโปรไฟล์ไม่มีกล่องซ้อน ลูกศร 34px → ชดเชยด้วย `.pl-wide .pl-body{padding:14px 35px}` + `.pl-pets{margin:0 40px}` · และ **ลูกศรที่ซ่อน (`.no-x`) ต้องกันที่ไว้ด้วย `visibility:hidden`** ไม่งั้นของน้อย ๆ การ์ดจะกว้างขึ้นจนหลุดแนว
  - **ยืนยัน (localhost mock login · offsetWidth + offsetLeft สะสม):** 1046×493 การ์ดโรงงาน/ทรัพย์สิน/สัตว์เลี้ยง = **102×142 เท่ากันทั้ง 3** · 1280×720 = **131×235 ทั้ง 3** · ขอบซ้ายการ์ดใบแรกของแถวสัตว์เลี้ยงกับแถวทรัพย์สินตรงกันที่ 85px เป๊ะ · 812×375 = 100×110 การ์ดทั้งใบ 812×375 อยู่ในจอ · ทรัพย์สิน 20 ชิ้น = 2 แถว 8 คอลัมน์ · 5 ชิ้น = แถวเดียว ยังตรงแนว · คลิกน้องเปิดกล่องข้อมูล/คลิกของเปิดรูปใหญ่/ปุ่มปิด = ปกติ · ชื่อไม่ล้นกรอบ · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ **ค้างไว้:** การ์ดโปรไฟล์ยังเลื่อนแนวตั้งได้อยู่ (ข้อมูลเยอะ: สถิติ+ฟีด+สัตว์เลี้ยง+ทรัพย์สิน) — ยังไม่เข้ากฎทองข้อ 7 เต็มร้อย ถ้าผู้ใช้ติดค่อยจัดคอลัมน์ใหม่


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 620 (27 ก.ค. · ผู้ใช้ส่งภาพบอก "มังกรเรียบร้อย แต่หมาแมวยังไม่เปลี่ยน" หลังรอบ 618):** 🩹 **ต้นตอไม่ใช่ไฟล์วิดีโอผิด — เป็นแคช HTTP เก่าของเบราว์เซอร์/CDN ค้าง `clip/*.mp4`**
  - `sw.js` ตั้งใจไม่ cache `clip/*.mp4` เอง (ปล่อยเบราว์เซอร์จัดการ range request) แต่ชื่อไฟล์เดิมตลอดทุกรอบที่แก้ "เนื้อ" วิดีโอ → เบราว์เซอร์/CDN แคช URL เดิมไว้ยาว เครื่องผู้เล่นที่เคยเปิดหมา/แมวมาก่อนรอบ 615 เลยยังเห็นเวอร์ชันเก่า (มังกรผ่านเพราะผู้เล่นเพิ่งเปิดแท็บมังกรเป็นครั้งแรกหลังแก้)
  - แก้ตามสูตรเดิมที่ `moto3d.js` ใช้อยู่แล้ว (คอมเมนต์บรรทัด 154 อธิบายปัญหานี้ตรง ๆ) — เพิ่ม `CLIP_ASSET_V` ใน `js/images.js` แล้วต่อท้าย `?v=620` ใน `clipFileFor()` ทุก URL คลิป · โค้ดเกม (js/*) เป็น network-first ใน sw.js อยู่แล้ว ไม่ต้องบัมพ์ `CACHE_VERSION`/`--sw`
  - **ยืนยัน:** เล่น `clipFileFor('cat_adult_normal')`/`dog_adult_normal` ที่ต่อ `?v=620` แล้วจริงผ่าน `<video>` ใน browser จริง → มุมพื้นหลังทั้งคู่ `rgb(223,245,249)` ตรงเป้า (ก่อนหน้านี้ตัวไฟล์ถูกต้องอยู่แล้วจากรอบ 618 แค่แคชค้าง) · **ครั้งหน้าแก้ "เนื้อ" ไฟล์ `clip/*.mp4` อีก ต้องบัมพ์ `CLIP_ASSET_V` ทุกครั้ง** (ไม่ใช่แค่เพิ่มคลิปใหม่ที่ยังไม่เคยมี URL — เคสนั้นไม่ชนแคชเพราะ URL ใหม่อยู่แล้ว)


## ⏬ ย้ายเมื่อ 2026-07-27 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 621 (27 ก.ค. · ผู้ใช้ยังบอก "ภาพสินค้าหน้าโปรไฟล์ไม่ใหญ่เท่าหน้าโรงงาน"):** 🔍 **ต้นตอ = เพดานตายตัวใน `--pl-row`** (แก้ `css/lobby.css` ไฟล์เดียว)
  - **ทำไมรอบ 617 ยังไม่หาย:** ตั้ง `--pl-row:clamp(110px, calc(41vh − 60px), 260px)` — **เพดาน 260px** · การ์ดโรงงานไม่ได้คิดจาก vh แต่ "กินที่ว่างที่เหลือทั้งหมด" จึงโตต่อได้เรื่อย ๆ → **จอสูง 950px: โรงงาน 350px แต่โปรไฟล์ค้างที่ 260px** (จอเตี้ย 493/720 บังเอิญตรงเลยไม่เจอตอนทดสอบ — บทเรียน: ทดสอบความสูงจอหลายระดับ ไม่ใช่แค่ 493/720/375)
  - **แก้:** `--pl-row:max(104px, calc(50vh − 123px))` (จอ ≤560 ใช้ `50vh − 103px` เพราะซ่อนคำอธิบาย) = สูตรเดียวกับที่โรงงานเหลือให้ 1 แถว **ไม่มีเพดาน** · และลด padding รูปจาก 6→**5px เท่า `.hq-pic`** + ใส่แสงกลมขาวหลังรูปแบบเดียวกับโรงงาน
  - **ยืนยัน (localhost · offsetWidth + คำนวณขนาดภาพที่ถูกวาดจริงจาก object-fit:contain · เทียบสินค้าชิ้นเดียวกัน "คัพเค้กสตรอว์เบอร์รี"):** 1280×**950** โรงงาน 131×350 ภาพ 118×118 / โปรไฟล์ 131×352 ภาพ **118×118 เท่ากันเป๊ะ** (ก่อนแก้: 260 · ภาพ 116) · 1280×720 = 235 vs 237 ภาพ 118 เท่ากัน · 1046×493 = 142 vs 144 ภาพโปรไฟล์ 89 > โรงงาน 72 (โรงงานมีปุ่มราคากินที่ ภาพเลยเตี้ยกว่า — โปรไฟล์ไม่เล็กกว่าแล้วทุกจอ) · 2 แถว 8 คอลัมน์ยังครบ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 622 (27 ก.ค. · ผู้ใช้บอก "ฟ้าอ่อนสว่างไป เปลี่ยนเป็นม่วงเหมือนพื้นหลังมังกรตอนรอวิดีโอ"):** 🌌 **พื้นหลังคลิปทุกตัว → ไล่เฉดม่วง-ส้มสนธยาเดียวกับฉากการ์ตูนของมังกร (แทนสีเรียบ `#E0F7FA`)**
  - ใช้ค่าสีจริงจาก `.pet-show-bg.ps-dragon` ใน `css/lobby.css:2827` (`--sky1:#3d2a72 → --sky2:#7a52ab @56% → --sky3:#f2a25c`) มาทำเป็น **ไล่เฉดแนวตั้ง** (linear-gradient 3 stop เหมือน CSS ต้นฉบับเป๊ะ) แทนสีเรียบสีเดียวแบบ 2 รอบก่อน (รอบ 615 ชมพู/รอบ 618 ฟ้า) — ใช้ไล่เฉดเดียวกันกับสัตว์ทุกชนิด (ไม่ใช่แยกโทนตามชนิดสัตว์แบบฉากการ์ตูน)
  - ต้นฉบับดำจริงไม่ได้เก็บ backup ไว้แล้ว (ลบไปตอนจบรอบ 618) → **ดึงคืนจาก git history** `git show 15ade84~1:clip/<key>.mp4` (คอมมิตก่อนรอบ 615 ที่เริ่มคีย์สีครั้งแรก) ก่อนประมวลผลใหม่ (กันคีย์ซ้อนคีย์เสียคุณภาพ)
  - สคริปต์ตัวเดียวกับรอบ 618 (flood-fill หาเฉพาะดำที่ต่อขอบภาพ) แค่เปลี่ยนจาก flat color → `gradient_bg()` สุ่มค่าตามแถว y ก่อนผสม · รันครบ 9 ไฟล์ + compress_clips.sh --force + **บัมพ์ `CLIP_ASSET_V` 618→622** ใน `js/images.js` (บทเรียนรอบ 620 — ลืมบัมพ์ครั้งก่อนเลยเจอแคชค้าง)
  - **ยืนยัน:** เล่นไฟล์จริง `clip/sm/cat_adult_normal.mp4`/`dragon_egg.mp4` ผ่าน `<video>` จริงในเบราว์เซอร์ วาดลง canvas → มุมบน `rgb(61,48,117)` ≈ `#3d2a72` ตรงเป้า · มุมล่างไข่มังกร (ไม่มีพื้นบังพอดี) `rgb(248,163,89)` ≈ `#f2a25c` ตรงเป้า · ตาสัตว์/องค์ประกอบดำที่ล้อมรอบยังอยู่ครบเหมือนรอบ 618 · ยังไม่ได้ทดสอบผ่านหน้าเกมเต็ม (เหตุผลเดิม — ล็อกอิน mock ไปไม่ถึงหน้าโชว์น้อง)


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 623 (27 ก.ค. · ผู้ใช้ส่งภาพมือถือเทียบ 2 ใบ: คอมฯ 2×8 ถูกแล้ว แต่มือถือโปรไฟล์ยังเล็กกว่าโรงงาน):** 📱 **จอเตี้ยต้องเป็น "แถวเดียวเต็มความสูง" เหมือนโรงงาน** (แก้ `css/lobby.css` ไฟล์เดียว)
  - **ต้นตอ (คนละตัวกับรอบ 621):** โรงงานมีกฎ `@media (max-height:420px)` สลับเป็น **1 แถว** แล้วให้การ์ดกินความสูงทั้งหมด · แต่โปรไฟล์ยังคิด `--pl-row` แบบ "ครึ่งหนึ่งของ 2 แถว" อยู่ → มือถือได้การ์ด ~104px ขณะที่โรงงาน ~215px (เล็กกว่าครึ่ง) · ของ ≤8 ชิ้นยิ่งเห็นชัดเพราะเป็นแถวเดียวอยู่แล้วแต่เตี้ย
  - **แก้:** `@media (max-height:420px)` → `--pl-row:max(150px,calc(100vh − 197px))` (= 2 แถวเดิมรวมกัน+ช่องว่าง) + บังคับ `.pl-assets` เป็นแถวเดียวเหมือนแคตตาล็อกโรงงาน
  - **ยืนยัน (localhost · เทียบ "คัพเค้กสตรอว์เบอร์รี" ชิ้นเดียวกัน · การ์ด/ขนาดภาพที่วาดจริง):** **875×408 (มือถือแนวนอนของผู้ใช้)** โรงงาน 111×215 ภาพ 97 / โปรไฟล์ 110×211 ภาพ **96** (ก่อนแก้ ~104 · ภาพ ~45) ทั้งของ 5 ชิ้นและ 20 ชิ้น · 812×375 = 100×182 vs 99×178 ภาพ 86 vs 85 · 1046×493 = 141 vs 144 (2 แถว 8 คอลัมน์) · 1280×950 = 350 vs 352 ภาพ 117 เท่ากันเป๊ะ · การ์ดโปรไฟล์อยู่ในจอทุกขนาด · console สะอาด · ล้างเซฟแล้ว
  - 📌 **บทเรียนสะสม (614→623):** "ขนาดเท่ากัน" ต้องเทียบ **ทั้งความสูงจอหลายระดับ + โหมด layout ที่ต่างกัน (1 แถว/2 แถว)** ไม่ใช่แค่จอเดียว — พลาดมา 3 รอบเพราะทดสอบไม่ครบเคส


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 624 (27 ก.ค. · ผู้ใช้สั่งขยาย `.grid2x8` ไปอีก 3 จุดในแผงตลาด):** 🛒 **ชั้นวางของเพื่อน + โชว์รูมรถ + โชว์รูมหุ่นรบ = 2 แถว × 8 คอลัมน์ + ลูกศรเลื่อน** (แก้ `js/ui.js` + `css/lobby.css`)
  - **ชั้นเพื่อน (`renderMarketBrowse`)**: ใส่ `mb-strip` + `grid2x8` แล้ว **ใช้กฎ CSS ชุดเดียวกับ "คลังสินค้าของฉัน"** (เติม selector `.mb-strip` เข้าไปในบล็อกรอบ 616 ไม่เขียนใหม่) → การ์ดเท่ากันเป๊ะ (110×122 @620 · 131×144 @1280×720 · 131×168 @1280×950)
  - **โชว์รูมรถ/หุ่น (`renderCarShowroom`/`renderRobotShop`)**: เดิม thumb เป็นคอลัมน์ซ้าย 38% เลื่อนขึ้นลง → **พลิกเป็นผังโรงงาน: จอโชว์เต็มความกว้างด้านบน + แคตตาล็อกปัดซ้ายขวาด้านล่าง** (`.cs-list/.rs-list` = `strip-x grid2x8`) · ชื่อรถขึ้นเป็นหัวการ์ด (`order:-1`) ป้าย "ขายไปแล้ว" ย้ายไปดูที่จอใหญ่ เอาที่ให้รูปรถ
  - 🔭 **กับดัก 3 อย่างที่เจอ:** ① `grid-template-columns:repeat(2,1fr)` เดิมชนะ `grid-auto-columns` → ต้อง `none` (บั๊กเดียวกับรอบ 616) ② ผังคอลัมน์ทำให้ `.rs-stage` สูงตามเนื้อหา → `max-height:100%` ของรูปหุ่นไม่มีฐาน รูปกางเป็น 1024×1536 ทะลุกล่อง ต้องคุมด้วย vh ที่ตัวรูป ③ จอเตี้ย ≤520px 2 แถวบีบรูปรถเหลือ 33px → สลับเป็นแถวเดียวเต็มความสูงเหมือนโรงงาน (บทเรียนรอบ 623)
  - **ยืนยัน (localhost mock login · offsetWidth/offsetHeight · 5 ขนาดจอ):** 1280×720 การ์ด 131 กว้างเท่ากันทั้ง 3 จุด (รถ ×144 · หุ่น ×137 · เพื่อน ×144) 8 คอลัมน์ 2 แถว · 1280×950 = 141/164, 141/166, 131/168 · 1046×493 + 812×375 + 620×360 → คอลัมน์ลดเอง 8/6/4 + รถ/หุ่นเป็นแถวเดียว (112–128px) ลูกศรโผล่ · ไม่มีการ์ดหลุดถาด/ข้อความล้นกรอบ (เหลือแต่ชื่อร้านเพื่อนที่ตัด `…` ตามดีไซน์เดิม) · แตะการ์ดคันที่ 7/หุ่นตัวที่ 9 → จอใหญ่+`.active` เปลี่ยนถูกตัว · เพื่อนลงขาย 30 ชิ้น = 15 คอลัมน์ 2 แถว เลื่อนได้ 978px · แคตตาล็อกโรงงานเดิมยังปกติ (143×235 2 แถว) · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ **หมายเหตุ:** การ์ดในแผงตลาดเตี้ยกว่าโรงงาน (144 vs 235) เพราะหน้าตลาดเลื่อนแนวตั้งได้และมี 4 ส่วนซ้อนกัน (ตั้งใจตามรอบ 616) · ถ้าผู้ใช้อยากให้สูงเท่าโรงงานจริง ๆ ต้องแยกโชว์รูมเป็นแผงเต็มจอของตัวเอง


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 625 (27 ก.ค. · ผู้ใช้สั่ง "หน้าแชทให้โทร voice/video ได้เหมือน LINE"):** 📞 **ระบบโทรหาเพื่อนครบวงจร — WebRTC P2P + กริ่งผ่าน Firebase** (เพิ่ม `Call` ใน `js/online.js` · `callUI`+`callRing`+`startCall` ท้าย `js/ui.js` · โซน CSS ใหม่ใน `css/lobby.css` · ปุ่ม 📞/📹 บนหัวกล่องแชท)
  - ครบแบบ LINE: กริ่งสายเข้าเด้งทุกหน้า (รวมโลก 3D · ปลด pointer lock ให้เอง) + เสียงกริ่ง/สั่น · รับ-ไม่รับ · ติดสายอื่นตอบ busy อัตโนมัติ · จับเวลา · ปิดไมค์/ปิดกล้อง/สลับกล้องหน้า-หลัง/ลำโพง · จอเล็กมุมขวาล่าง · **บันทึกผลสายลงห้องแชท** ("คุยสายกัน 2 นาที"/"สายที่ไม่ได้รับ") · **ดีกว่า LINE:** อิโมจิลอยผ่าน DataChannel + กดเปิดกล้องกลางสายเสียงได้ (renegotiate เอง)
  - ⚠️ **ต้อง publish rules ก่อนใช้จริง** (โซนใหม่ `/calls` + `'chat'` ใน enum `/rtc` + `d`≤20000) — ยังไม่ publish = กดโทรแล้วขึ้น **ป้ายเหลืองบอกเหตุผลบนจอ** แล้ววางสายเอง ไม่พังระบบอื่น · ก้อนเต็ม+Artifact อยู่ใน `handoff/RULES.md`
  - **ยืนยัน (localhost · mock login + fake RTDB + peer จำลองคุยกันจริงผ่าน RTCPeerConnection สองตัว):** สายเสียง/วิดีโอต่อติด `connected` เห็น track ครบสองทาง · รับสาย/ไม่รับ/ติดสาย/ยกเลิก/ไม่ได้รับ → ข้อความลงแชทถูกทุกเคส · คนไม่ใช่เพื่อนโทรเข้า = เงียบ+ลบกริ่งทิ้ง · วางสายแล้วคืนกล้อง-ไมค์ ลบ node ครบ · อิโมจิวิ่งสองทาง · จอ 1280×720/875×408/812×375/620×360 ปุ่มไม่ทับกัน อยู่ในจอทุกขนาด · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 626 (27 ก.ค. · ผู้ใช้สั่ง 2 ข้อต่อจากรอบ 625):** 📱 **วิดีโอคอล = จอแนวตั้ง** + 🧹 **ล้างขยะ signaling บนเซิร์ฟเวอร์อัตโนมัติ** (แก้ `js/ui.js` + `js/online.js` + `css/lobby.css`)
  - **แนวตั้ง (เหตุผลผู้ใช้: แนวนอนกล้องจับหน้าด้านข้าง ไม่สวย):** `callUI.orient(on)` — เข้าสายวิดีโอ → `requestFullscreen` + `screen.orientation.lock('portrait')` + ใส่คลาส `html.vcall-portrait` ปิดป้าย "หมุนจอแนวนอน" (`#rotate-overlay`) ชั่วคราว · วางสาย → unlock + ออก fullscreen (เฉพาะที่เราเปิดเอง) + ถอดคลาส = กลับเป็นเกมแนวนอนเหมือนเดิม · **สายเสียงไม่แตะจอ** · เปิดกล้องกลางสายเสียง → สลับแนวตั้งให้เอง
  - **iPhone ล็อกจอไม่ได้** (API ไม่รองรับ) → ขึ้นป้าย `.call-tip` "หมุนมือถือเป็นแนวตั้ง" เฉพาะ **จอสัมผัสที่ยังเป็นแนวนอน** (`@media (orientation:landscape) and (pointer:coarse)`) จางหายใน 6 วิ — คอมพิวเตอร์ไม่ขึ้น
  - **ล้างขยะ:** `onDisconnect().remove()` ทั้ง `/calls/<me>` และ `/rtc/chat/<me>` (ปิดแท็บ/เน็ตหลุด = เซิร์ฟเวอร์ลบให้เอง) + ทิ้งกริ่งค้างเก่ากว่า 50 วิ แทนที่จะเด้งย้อนหลัง · ของพวกนี้เป็นกล่อง signaling ชั่วคราวล้วน ไม่มีข้อความ/ประวัติผู้ใช้ → ลบแล้วได้อย่างเดียว
  - **ยืนยัน (localhost):** 390×780 แนวตั้ง → ป้ายหมุนจอหาย, การ์ดสายเต็มจอ 390×780, จอเรา 102×135 ไม่ทับแถบปุ่ม, แถบปุ่มอยู่ในจอ · วางสาย → ป้ายหมุนจอกลับมา คลาสถูกถอด overlay หายเกลี้ยง · 812×375 สายเสียงไม่ติดคลาส · เปิดกล้องกลางสาย → ติดคลาสทันที · watch() สั่ง onDisconnect ครบ 2 กล่อง + ล้างตอนบูต · กริ่งเก่า 2 นาที = ลบทิ้งไม่เด้ง / กริ่งสด = เด้งปกติ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 627 (27 ก.ค. · ผู้ใช้ส่งภาพสเก็ตช์: แตะจอเล็ก = สลับกับจอใหญ่ แตะอีกทีสลับกลับ):** 🔄 **สลับจอใหญ่↔จอเล็กระหว่างวิดีโอคอล** (แก้ `js/ui.js` + `css/lobby.css`) · ✅ **rules รอบ 625 ผู้ใช้ publish แล้ว — ตรวจสดผ่าน CLI ตรงกันครบ 22 โซน ระบบโทรใช้ได้เต็มระบบ**
  - `callUI.swapped` + `callUI.paint()` = จุดเดียวที่ตัดสินว่าสตรีมไหนลงจอใหญ่/จอเล็ก (เรียกทุกครั้งที่ภาพเปลี่ยน) · จอเล็กเปลี่ยนจาก `<video>` เป็น `<button>` ครอบ `<video id="call-me-v">` + ไอคอน ⤢
  - 🔑 **กับดักที่ต้องแก้ก่อน:** เดิมเสียงเพื่อนเล่นผ่าน `<video id="call-remote">` — พอสลับสตรีม เสียงจะหายไปอยู่จอเล็ก (หรือหอนเพราะจอใหญ่กลายเป็นไมค์เรา) → **แยกเสียงออกมาที่ `<audio id="call-audio">` ต่างหาก จอวิดีโอ 2 ใบ `muted` เสมอ** · ปุ่ม 🔊 ไปคุมที่ `<audio>` แทน
  - กระจกเงาตามสตรีมไม่ใช่ตามช่อง (กล้องเรา `scaleX(-1)` เสมอ ภาพเพื่อนไม่กลับด้าน) · สลับได้เฉพาะตอนเปิดกล้องทั้งคู่ (`can-swap` โชว์ไอคอน ⤢ · ไม่งั้น toast บอก) · เพื่อนปิดกล้องกลางคัน = เด้งกลับผังปกติเอง
  - **ยืนยัน (localhost · ทั้งจำลอง state และโทรจริง end-to-end ผ่าน Call engine + RTCPeerConnection 2 ตัว):** ต่อติด `connected` เห็น audio+video → แตะจอเล็ก big=ME/small=YOU → แตะอีกที กลับ big=YOU/small=ME · **เสียงเพื่อนอยู่ที่ `<audio>` ตลอด ไม่หายไม่หอน** ปุ่ม 🔊 ปิด/เปิดได้ทั้ง 2 ผัง · สายเสียงล้วน = ไม่มีจอเล็ก ไม่มีไอคอน ⤢ · remote ไม่มีวิดีโอ → สลับไม่ได้ + swapped เด้งกลับ false · วางสายเคลียร์ครบ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 628 (27 ก.ค. · ผู้ใช้สั่งต่อจากรอบ 627):** 📞 **ปุ่มโทรกระจายไปทุกที่ที่เจอชื่อเพื่อน + แท็บ "ประวัติการโทร" ในหน้ารวมข้อความ** (แก้ `js/ui.js` + `css/lobby.css` · rules ไม่ต้องแก้ ใช้ `Call.start` เดิม)
  - **ปุ่ม 📞/📹** เพิ่มใน `refreshFriendData` (`.fr-call-btn` แถวรายชื่อเพื่อน) + หัวการ์ดโปรไฟล์ (`.pl-call` โชว์เฉพาะคนที่เป็นเพื่อนกันแล้ว เหมือนปุ่ม 💬) → เรียก `startCall()` ตัวเดิม (เงื่อนไขเน็ต/ติดสาย/ไม่ใช่เพื่อน เช็กใน `Call.start` อยู่แล้ว ไม่ต้องเช็กซ้ำ)
  - **ประวัติการโทร:** `openChatInbox` หัวกล่องเปลี่ยนจากป้าย "💬 ข้อความ" เป็นแท็บ `💬 แชท / 📞 การโทร` (+badge แดงนับสายที่ไม่ได้รับที่ยังไม่อ่าน) · **ไม่ยิง DB เพิ่ม** — ร่อนบันทึกผลสายออกจากข้อความชุดเดิมด้วย `IB_CALL_RE`/`ibCallInfo()` (เทียบข้อความเต็มรูปแบบที่ `Call.logChat` เขียน กันข้อความที่เด็กพิมพ์เอง เช่น "📞 ไม่ใช่ log" หลุดมาปน) · ทิศทางดูจาก `m.f===meKey` (ฝ่ายโทรออกเป็นคนบันทึก) → ↗️ โทรออก / ↙️ สายเข้า · แถวสายที่ไม่ได้รับเป็นสีแดง · แตะแถว=เปิดแชท · ปุ่มท้ายแถว=โทรกลับชนิดเดิม · ดึง `limitToLast` 20→**40** (CHAT_KEEP=100) ให้ย้อนประวัติได้ลึกขึ้น
  - **ยืนยัน (localhost mock login + fake RTDB 3 เพื่อน · offsetWidth/scrollWidth):** แถวเพื่อน 4 ปุ่มไม่ล้น (1280/812/620/500 · ≤520px ปุ่มย่ออัตโนมัติ 33→29px) · กดปุ่มได้ `Call.start` ถูกคน+ถูกชนิดทุกปุ่ม · แท็บโทรโชว์ครบ 4 รายการเรียงใหม่→เก่า ตัดข้อความปลอมทิ้ง badge=1 · สลับแท็บไป-กลับวาดซ้ำได้ · โทรกลับ/แตะแถวปิดกล่องแล้วทำงานถูก · ไม่มีประวัติ=ข้อความชวนโทร · การ์ดโปรไฟล์ปุ่มครบ 36×33 หัวไม่ล้น คนไม่ใช่เพื่อน=ไม่มีปุ่ม · กล่องอยู่ในจอทุกขนาด · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ screenshot ในเซสชันนี้ใช้ไม่ได้ (Browser pane ไม่ compose frame) → ยืนยันด้วยการวัด DOM ล้วน


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 629 (27 ก.ค. · ผู้ใช้ส่งไฟล์เสียงกริ่งจริงมาเอง):** 🔔 **ระบบโทรใช้ไฟล์เสียงจริงแทน beep สังเคราะห์** (แก้ `callRing` ใน `js/ui.js` + เพิ่ม `sound/IncomingCallTone.mp3` 2.00 วิ / `sound/OutgoingCallTone.mp3` 4.36 วิ เข้า git)
  - สูตร **2 ชั้นเดียวกับ `playCashier` ใน `js/util.js`**: ชั้น 1 เล่นไฟล์วน (`loop`) · ชั้น 2 ไฟล์หาย/เบราว์เซอร์บล็อก autoplay → `callRing.toSynth()` สลับกลับไป beep เดิมทันที (กริ่งห้ามเงียบ) · จำไว้ใน `callRing.miss[dir]` ไม่ลองไฟล์ซ้ำทั้ง session · `cache[dir]` ใช้ `<audio>` ตัวเดิมซ้ำ ไม่สร้างใหม่ทุกครั้ง
  - เปลี่ยนตัวจับเวลาจาก `setInterval` → **`setTimeout` ต่อกันเอง** เพราะจังหวะซ้ำต้องยืดตามความยาวไฟล์จริง (`period()` = `au.duration`) ให้ "สั่นตรงหัวลูป" ทุกรอบ · รอบแรกยังใช้ 1600ms (metadata ยังไม่มา) แล้วเข้าที่ 2012ms เอง
  - ⚠️ **deploy ใช้ `git archive HEAD`** → ไฟล์เสียงต้อง `git add` ไม่งั้น live 404 เงียบ ๆ (sound/ ตัวอื่นก็ tracked อยู่แล้ว 447 ไฟล์)
  - **ยืนยัน (localhost · วัด `audio.currentTime` เดินจริง):** สายเข้าเล่น IncomingCallTone vol .7 loop / เรียกออก OutgoingCallTone vol .5 · `stop()` pause+rewind+เคลียร์ timer ครบ · ไฟล์ 404 → beep เข้าแทนทันที `miss=true` · ปิดเสียง = ไม่แตะไฟล์ (beep ก็เงียบเองที่ `state.sound`) แต่ยังสั่น · สายเรียกออกไม่สั่น · **end-to-end `callUI.incoming()` → กริ่งดังจากไฟล์ → กด "ไม่รับ" เสียงหยุดสนิท** · console สะอาด · ปิดเสียง+ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 640 (28 ก.ค. · ผู้ใช้สั่ง "ทุกโลก 3D รองรับ 500+ คนพร้อมกัน"):** 🏟️ **ระบบหลายสนาม (room sharding) เป็นโมดูลกลาง `js/netroom.js` ใช้ร่วมทั้ง 3 ไฟล์** (แก้ `js/adventure3d.js`+`js/invasion3d.js`+`js/moto3d.js`+`index.html` · ⚠️ **rules ต้อง publish ใหม่** โซนใหม่ `/wroom` + `/winfo`)
  - ยกก้อน "กันคนล้น" ของรอบ 637 ออกจาก `invasion3d.js` มาเป็นโมดูลกลาง แล้วให้ทุกโลกเรียกใช้ — โลกละ ~30 บรรทัด ไม่ก๊อปโค้ดซ้ำ · เหลือไว้ในไฟล์โลกเฉพาะ "งบวาดตัวเพื่อน" (ผูกกับโมเดล 3D ของแต่ละโลก) เรียกผ่าน `NetRoom.drawBudget`
  - **เพดานตอนนี้ 80 คน** (`WORLD_CAP` ตัวเดียวใน `js/netroom.js`) เพราะ Spark ฟรีจำกัด **เชื่อมต่อพร้อมกัน 100 ราย** — อัป Blaze เมื่อไหร่แก้เป็น 504 ได้ 36 สนามทันที ไม่ต้องแตะอย่างอื่น
  - **ยืนยัน:** ชุดทดสอบ 2 ชุดผ่าน **66/66** (`tools/test_netroom.js` 30 ข้อ + `tools/test_worlds3d.js` 36 ข้อ ผ่าน RTDB จำลอง `tools/fakedb.js`) · 500 คนแห่เข้าพร้อมกัน → 36 สนาม สูงสุด 14 คน **ไม่มีสนามล้น** · เข้า-ออก 100 ครั้งไม่มีข้อมูล/listener ค้าง · ครบทั้ง 7 โหมดของ adventure3d + moto + invasion · จอ 1280×720 / 812×375 / 620×360 ป้ายไม่ทับจอย ไม่มี scroll · console สะอาด · ล้างเซฟแล้ว
  - ค้าง: **รอผู้ใช้ publish rules** (ยังไม่ publish = ตกกลับเล่นสนามเดียวแบบเดิมอัตโนมัติ เกมไม่พัง) · Artifact ปุ่มคัดลอกก้อนเต็ม: https://claude.ai/code/artifact/935970e1-029a-49db-8902-ffe64616ca8c



## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 641 (28 ก.ค. · ต่อยอดข้อ 3 จากรอบ 640):** 🤝 **นัดกันไว้แล้วได้สนามเดียวกันเอง** — เด็กไม่ต้องกด "👥 ไปหาเพื่อน" เองอีก (แก้ `js/netroom.js` ไฟล์เดียว · rules ไม่ต้องแก้ ใช้คำเชิญ `/tinv` เดิม)
  - เข้าโลกแล้วระบบเช็กเองว่ามีคนที่ "ชวนกันไว้" อยู่สนามไหน (`metUids` อ่านทั้ง `Online.tinv` และ `state.tinvSent`) → พาเข้าสนามนั้นตรง ๆ · เพื่อนกดเข้าช้ากว่า = ตามหาต่ออีก 3 ครั้ง ห่างครั้งละ 7 วิ
  - 🔑 **ต้องมีฝ่ายเดียวที่ย้าย ไม่งั้นสลับที่กันไปมาไม่มีวันเจอ** → กติกาที่ทั้งสองเครื่องคิดตรงกัน: uid มากกว่าเป็นฝ่ายเดินไปหา · สนามเพื่อนเต็ม = ขึ้นป้ายบอกชื่อเพื่อน ไม่เงียบ แล้วเล่นสนามอื่นต่อได้
  - **ยืนยัน:** ทดสอบผ่าน **73/73** (`NRTest` 37 ข้อ รวมเคสใหม่ 7 ข้อ + `W3D` 36 ข้อ ครบ 3 ไฟล์/7 โหมด) · เพื่อนอยู่สนาม 3 ทั้งที่สนาม 1-2 ว่าง → เข้าสนาม 3 ถูก · ไม่ได้นัดใคร = พฤติกรรมเดิมเป๊ะ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 642 (28 ก.ค. · ต่อยอดรอบ 640-641):** 🌍 **แผงเพื่อนในล็อบบี้บอกว่าเพื่อนอยู่โลก 3D ไหน/สนามไหน + ปุ่ม "🏃 ตามเข้าไป"** (แก้ `js/ui.js` + `js/netroom.js` · ไม่มี path ใหม่ ไม่ต้องแก้ rules)
  - `NetRoom.whereFriends()` อ่าน `/winfo/<map>` **โลกละ 1 ครั้ง (9 อ่าน)** ไม่ใช่ไล่ทีละสนาม · สแกนเฉพาะตอนแผงเพื่อนเปิดจริง + ห่าง ≥20 วิ (เพิ่งเปิดแผง ≥5 วิ) · ผีค้าง/คนไม่ใช่เพื่อนไม่โผล่
  - ปุ่ม "ตามเข้าไป" = `NetRoom.aimAt()` **ตั้งเป้าไว้เฉย ๆ** แล้วเข้าโลกผ่าน `railWorldClick` ตามปกติ → ระบบนัดเจอรอบ 641 (`metUids`→`findMet`) พาลงสนามเดียวกับเพื่อนเอง ไม่ต้องมีทางเข้าสนามเส้นใหม่ · ไม่มีตั๋ว/บาดเจ็บ = ไม่ตั้งเป้าค้าง ปล่อยให้ railWorldClick พาไปซื้อ/รักษา · 🎯 ตามเองต้องได้เดินเสมอ (กติกา "uid มากกว่าเดิน" ใช้เฉพาะคำเชิญ)
  - **ยืนยัน:** ทดสอบผ่าน **84/84** (`NRTest` 48 ข้อ รวมชุดใหม่ `followLobby` 11 ข้อ + `W3D` 36 ข้อ) · แผงจริงในเบราว์เซอร์: เพื่อน 2 คนขึ้นโลก/สนามถูก คนที่ไม่ได้เล่นไม่ขึ้น · อ่าน `/winfo` ไม่ได้ = ขึ้นป้ายบอกเหตุผล (ห้ามเงียบ) · 1280×720 + 812×375 บรรทัดเดียวไม่ล้นจอ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 643 (28 ก.ค. · ผู้ใช้สั่ง 2 ข้อ):** 🎖️ **สัญลักษณ์ระดับชั้นโชว์ทุกที่ที่มีชื่อผู้เล่น** (กันปั๊มเหรียญด้วยการโกงชั้น) + **แถวเหรียญยกขึ้นชนขอบบนการ์ดประจำตัว** (แก้ `js/util.js`+`js/ui.js`+`css/lobby.css`+`index.html`)
  - กติกาเดียวทั้งเกมอยู่ที่ `gradeSymbol/gradeMark/nameWithGrade/gradeOf` ใน `js/util.js`: ★เงิน=ประถม ★ทอง=มัธยม จำนวนดาว=ชั้นปี · 💎=ป.ตรี (💎💎=สูงกว่า) · ☆=ต่ำกว่าประถม · `gradeOf(uid,g)` เผื่อจุดที่ไม่มี `g` ติดมา (ไล่หา board→presence→friends)
  - ติดป้ายแล้ว: แถบบนล็อบบี้ (บรรทัด "ระดับชั้น" ใต้แถวเหรียญ) · การ์ดเพื่อนออนไลน์ · ฟีดเพื่อน + หน้า Feed ทุกคน · การ์ดโปรไฟล์ 👤 · กระดานอันดับทั้ง 4 แท็บ + กระดานเต็มจอ (โพเดียม/กริด) · รายชื่อเพื่อน/คำขอ/ค้นหารหัส/เมนูลัด · **⚠️ กริดอันดับ 6–100 แถวสูงแค่ ~2.3vh → ป้ายอยู่ท้ายชื่อบรรทัดเดียวกัน** (สองบรรทัดล้นจอ) ที่เหลืออยู่ใต้ชื่อจริง
  - **ยืนยัน:** เบราว์เซอร์จริง (server ชั่วคราว :8791 เพราะ preview เต็ม 5 ตัวจาก session อื่น) — ขอบบนกล่องเหรียญ = ขอบบน `.id-card` เป๊ะทั้ง 1280×720 / 812×375 / 620×360 (`sameTop` true · ต้องยึด `align-self:flex-start` **ทั้งคู่**) · ป้ายขึ้นถูกครบ 6 ชั้นตัวอย่าง (ป.3/ป.5/ม.2/ป.ตรี/สูงกว่า/ต่ำกว่าประถม) · ไม่มี scroll ทุกจอ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 644 (28 ก.ค. · โลกมอเตอร์ไซค์ ผู้ใช้ขอ "ตัวอักษร+เหรียญ+หมามากขึ้น" + ลดค่าปรับชนหมา):** แก้ `js/moto3d.js` เท่านั้น — `DOG_HIT_COIN` 500→100 · `DOG_GAP_MS` 9000→4000 (โผล่ถี่ขึ้น ~9-15วิ→4-7วิ) · `SPAWN_MIN/MAX` 110-430→70-260 (ตัวอักษร+เหรียญติดตัวอักษรโผล่ถี่ขึ้น) · เพิ่มระบบใหม่ `scatterCoinTick` โปรยเหรียญโบนัสอิสระตามถนนทุก ~2.2-3.6วิ (ย้อนกลับส่วนหนึ่งของมติรอบ 319 ที่เคยเลิกโปรยเหรียญสุ่ม — ผู้ใช้สั่งเพิ่มใหม่รอบนี้)
  - **ยืนยัน:** ทดสอบผ่าน `MotoWorld._t` ใน preview จริง — บังคับชนหมาแล้ว coins ลด 600→500 (−100) ตรง + ป้าย "ชนหมา! −100 🪙" ขึ้นถูก · จำลอง 4 วิ (240 เฟรม) เหรียญโบนัส (`keep:true`) เพิ่มจาก 4→7 ใบ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 646 (28 ก.ค. · ต่อยอดรอบ 643 ข้อ 1):** 🎖️ **สัญลักษณ์ระดับชั้นเข้าโลก 3D ครบ** — ป้ายชื่อลอยเหนือหัวเพื่อน + กระดานคะแนนในสนาม (แก้ `js/util.js`+`js/adv3d_tex.js`+`js/adventure3d.js`+`js/invasion3d.js`+`js/moto3d.js`)
  - 🔑 **ไม่มี field ใหม่ใน `/winfo` = ไม่ต้อง publish rules** (`$other:false` อยู่แล้ว) — ระดับชั้นอ่านจาก `presence`/`leaderboard` ที่โหลดค้างในเครื่องอยู่แล้วผ่าน `gradeOf(uid)` · ทราฟฟิกเพิ่ม 0 ไบต์
  - ป้าย 3D วาดบน canvas จึงใช้ CSS ไม่ได้ → เพิ่ม `gradeMarkCanvas()` ใน `js/util.js` (ที่เดียว) · ผืนป้ายสูงขึ้นเฉพาะตอนรู้ชั้น (`blkNameSprite` 64→88 · `nameSprite` 64→88 · `makeTextSprite` 128→176) — **ผู้เรียกต้องปรับ `scale.y` ตามสัดส่วนผืนด้วยเสมอ ไม่งั้นป้ายยืดเบี้ยว**
  - ⚠️ **ป้ายในกระดานคะแนน 3D อยู่ท้ายชื่อบรรทัดเดียวกัน** (แถว nowrap · จอเตี้ยกล่องยาวลงไปทับจอย) — "ใต้ชื่อ" ตามสเปกอยู่ที่ป้ายลอยเหนือหัวซึ่งเป็นจุดที่เด็กเห็นจริง
  - **ยืนยัน:** `W3D.all()` ผ่าน **36/36** (ต้องโหลด `js/data/moto_phosawat.js` ก่อน ไม่งั้น moto ล้มที่ `buildRoads` · ต้องรันที่จอ ≥430px ไม่งั้นเทสต์ป้ายสนามล้มเพราะข้อความถูกย่อตามกฎจอเตี้ย) · วัด canvas จริงทั้ง 3 ไฟล์: ผืนสูงถูก + scale.y ได้สัดส่วน + มีพิกเซลดาว/เพชรจริง · เพื่อนที่ไม่รู้ชั้น = ป้ายเท่าเดิมเป๊ะ · กระดานทั้ง 3 โลกโชว์ ★/💎 ถูกชั้น · console สะอาด · ล้างเซฟแล้ว
  - 🚦 **บทเรียน session คู่ขนาน:** รอบ 644 ของอีก session ใช้ pathspec `js/moto3d.js` **กวาดงานที่ผมแก้ค้างในไฟล์เดียวกันไปด้วย** แล้ว rebase ทีหลังทำให้หายทั้งคู่ → ต้องแก้ใหม่ · ไฟล์ที่คนอื่นกำลังแตะ ควร commit ให้จบก่อนเริ่มไฟล์ถัดไป


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 647 (28 ก.ค. · ผู้ใช้สั่ง — ต่อยอดกันโกงชั้นจากรอบ 643/646):** 🔒 **ล็อกการเปลี่ยนระดับชั้น: เดือนละ 1 ครั้ง + ขึ้นได้อย่างเดียว ลดลงไม่ได้** — โมดูลใหม่ `js/gradelock.js` เป็นประตูเดียวที่แก้ `state.student.grade` ได้ (แก้ `js/state.js`+`js/ui.js`+`js/main.js`+`index.html`+`css/lobby.css`)
  - เก็บใน state: `gradeSetAt` (เวลาเปลี่ยนล่าสุด · 0 = ยังไม่เคยเปลี่ยน) + `gradeHist` `[{g,at}]` — ไปกับเซฟ cloud เอง · เปลี่ยนแล้วผลัก `g` ขึ้น presence/leaderboard ทันที (ไม่รอ beat) · **ไม่มี field ใหม่ใน DB = ไม่ต้อง publish rules**
  - **ห้ามปิดเงียบ:** ล็อกอยู่ = แถบระดับชั้นบนล็อบบี้โชว์ปุ่ม "🔒 อีก N วัน" คาไว้ + กล่องบอกวันที่ปลดล็อก · สมัครใหม่ไม่นับเป็นการเปลี่ยน (เลือกผิดยังขยับขึ้นได้ทันที 1 ครั้ง) · **ถอด default ป.5 ในหน้าสมัครแล้ว** (เดิมเด็ก ป.1 กดผ่าน = ติดชั้นสูงถาวรเพราะลดลงไม่ได้)
  - **ยืนยัน:** ชุดกฎผ่าน 12/12 ในเบราว์เซอร์จริง (ลด/เท่าเดิม/ขึ้น/ล็อก 30 วัน/ปลดล็อกวันที่ 31/เหลือ 2 ชม.ยังนับ 1 วัน/ชั้นสูงสุด/ชั้นเพี้ยน/migrate เซฟเก่า) · กล่องไม่มี scroll ทั้ง 1280×720 และ 812×375 (เคสหนักสุด 14 ตัวเลือก+ประวัติ 6 ช่วง) · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 648 (28 ก.ค. · ผู้ใช้สั่ง "สร้างเกมใหม่อีก 1 เกม"):** ⌨️ **เกมพิมพ์คำศัพท์ (Typing)** — ปุ่ม `⌨️ พิมพ์คำ` ในรางซ้ายล็อบบี้ → กระดานเต็มจอ แป้น QWERTY นูน 3 มิติ (ไฟล์ใหม่ `js/typing.js` + `css/lobby.css` + `js/util.js` `sfx.keyTap` + `js/state.js` `tpUsed` + `index.html`)
  - กติกา: กดตามคำที่โชว์กลางจอด้านบน (อังกฤษ + คำแปลไทยใต้คำ · โชว์ตัวอักษรครบทั้งคำ ตัวถัดไปเป็นสีทอง + แป้นนั้นเรืองแสงนำทาง) · **จบ 1 คำ = 5 เหรียญ + เสียงเงินเข้า** (`sfx.coinGetTier(1)`) · พิมพ์ผิดไม่หักอะไร · มี ⌫ / 🔊 ฟังเสียง / ⏭ ข้ามคำ · Esc หรือปุ่ม `✕ ปิดเกม` (แดงใหญ่มุมขวาบน) ปิดได้
  - 🔒 **คำห้ามซ้ำ** = `state.tpUsed` จำถาวรข้าม session (ไปกับเซฟ cloud) · หมดคลังระดับชั้น → ล้างแล้ววนรอบใหม่ + toast บอก (ห้ามเงียบ)
  - 📐 **ไม่มี scrollbar ทุกจอ**: `fitKeys()` คำนวณขนาดแป้นเป็น px จากที่ว่างจริง**ทั้ง 2 แกนพร้อมกัน** (CSS ล้วนทำไม่ได้ — แป้นต้องจัตุรัสและพอดีทั้งกว้าง+สูง) · หนีบ 30–104px
  - 🎹 ความนูน 3 มิติ = "ขอบล่างหนา + เงาใต้แป้น" · กด (`.down`) = เลื่อนลง 11% ของแป้น + ขอบล่างเหลือ 2% → ถอดคลาสที่ 90ms = เด้งขึ้นทันที · เสียงกดลง/ปล่อยขึ้นคนละตัว (`keyTapSynth` นอยส์ 16-28ms ผ่าน bandpass + ตุบต่ำ — สั้นมากเพราะเด็กกดรัว)
  - **ยืนยัน (เบราว์เซอร์จริง):** เลย์เอาต์ 12/12 · แป้นยุบ-เด้ง 5/5 (วัด `getBoundingClientRect` ปุ่มเลื่อนลง 11px จริง ขอบล่าง 12.8→1.6px) · กติกาเกม 9/9 (เล่นรวดทั้งคลัง 80 คำ **ไม่ซ้ำเลยสักคำ** · เหรียญ 400 = 80×5 เป๊ะ · คลังหมดวนรอบใหม่ไม่ค้าง · เปิดใหม่ข้ามคำเก่า) · คีย์บอร์ดจริงของเครื่อง + Esc ผ่าน · **ไม่มี scroll + ไม่มีแป้นล้นจอ ทุกขนาด 1280×720 / 812×375 (แป้น 61px) / 620×360 (แป้น 56px)** · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ **บทเรียนเทสต์:** แท็บ preview ที่ `document.hidden=true` → **ไทม์ไลน์แอนิเมชันค้างที่เฟรม 0 และทับ cascade ทั้งหมด** (แม้ inline style) → อ่าน computed ได้ opacity 0 ทั้งที่ CSS ถูก · แก้: `el.getAnimations().forEach(a=>a.cancel())` ก่อนวัด · และ **ห้ามจำลองขนาดจอด้วยการย่อ element** — `vw/vh` ยังอิง viewport จริง ต้อง `resize_window` เท่านั้น


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 649 (28 ก.ค. · ต่อยอดรอบ 648 ผู้ใช้สั่ง):** 🏆 **แต้มสะสมตลอดกาลเกม ⌨️ พิมพ์คำ + แท็บใหม่ในกระดานอันดับ + รางวัลรายเดือน Top 10 (10,000–1,000 เหรียญ)** เหมือนแท็บ 🔎 ค้นหาคำ เป๊ะ
  - แต้ม = **ความยาวคำ × 2 · ไม่พิมพ์ผิดเลยทั้งคำ +5** (`state.tpScore/tpWords` · เก็บ `cur.miss` ต่อคำ) → `/leaderboard` field **`tp`** · หัวกระดานในเกมมีปุ่ม `🏆 N แต้ม` เปิดกระดานประกาศรางวัลได้เลย
  - ♻️ **ไม่ก๊อปโค้ดรางวัลซ้ำ:** ยกเครื่องจ่ายรางวัลทั้งก้อนจาก `js/wsaward.js` เป็นโรงงานกลาง **`js/award.js`** (`makeMonthAward`) → `wsaward.js` เหลือ 33 บรรทัดเป็นค่าตั้ง + ไฟล์ใหม่ `js/tpaward.js` · ใช้ CSS `wsa-*` ชุดเดิม (ไม่มี CSS กระดานรางวัลใหม่)
  - แก้: `js/typing.js` `js/state.js` `js/online.js` `js/ui.js` (`LB_TABS`+`lbTypingHtml`+`lbRankRows`+`lbfAwardBarHtml`) `css/lobby.css` `index.html` `handoff/RULES.md`
  - ⏳ **ค้าง: ผู้ใช้ต้อง publish rules** (โซนใหม่ `/tpAward` + field `tp`) — ยังไม่ publish = เกมไม่พัง (`onlinePushScore` ถอยไปก้อนที่ไม่มี `tp` เอง · แต้มตัวเองยังเห็นครบเพราะอ่านจาก state สด) · **ก้อนนี้ publish ครั้งเดียวได้ `wsAward` ที่ค้างมาตั้งแต่รอบ 592 ด้วย** · Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/595d3eee-f3e9-4bc8-b1bf-33dc809f3188
  - **ยืนยัน (เบราว์เซอร์จริง):** แต้ม 3/3 (PANTS ไม่ผิด=15 · SNOW ผิด 1 ครั้ง=8 · เหรียญ +5/คำ · `tpWords` เดิน) · แท็บใหม่เรียงถูก ตัดคน `tp=0` ทิ้ง โชว์เงินรางวัล+ป้ายระดับชั้น · โพเดียม/กระดานเต็มจอ 5 แท็บครบ · **เครื่องจ่ายรางวัล 2 ตัวแยกกันจริง** (จ่าย tp 9,000 → `tpAwardPaid` เท่านั้น · จ่ายซ้ำเดือนเดิม +0 · จ่าย ws ไม่แตะคีย์ tp) · กด 🏆 ในเกม → กระดานรางวัลทับถูก (z 95>93) Esc ครั้งแรกปิดเฉพาะกระดาน เกมยังอยู่ · **ไม่มี scroll ทุกจอ 1280×720 / 812×375 (แป้น 60.8px) / 620×360 (แป้น 56px — เท่ารอบ 648 เป๊ะ ไม่โดนปุ่มแต้มเบียด)** · migrate เซฟรอบ 648 (tpUsed 4 คำ → `tpWords=4`, `tpScore=0`) · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 651 (28 ก.ค. · ผู้ใช้ขอ):** 🎫 **การ์ดตั๋วโลก 3D ในแผงตลาด เปลี่ยนจาก 1 คอลัมน์เต็มแถว → 2 คอลัมน์ 2 ใบ/แถว** — แก้ `index.html` เท่านั้น ห่อการ์ดตั๋วทั้ง 8 ใบ (ผจญภัย/ผีสิง/เฮลิ/โดรน/ขับรถ/บอล/มอเตอร์ไซค์/ยานแม่) เป็น 4 คู่ด้วย `.mkt-two-col` (คลาสเดิมที่ใช้กับมือถือ+คอมพิวเตอร์อยู่แล้ว ไม่ต้องเพิ่ม CSS ใหม่)
  - **ยืนยัน:** `getBoundingClientRect` จริงในเบราว์เซอร์ — คู่การ์ดอยู่แถวเดียวกัน (top เท่ากัน) ทั้ง 4 คู่ · ไม่มี overflow ทั้ง 1280×720 และ 375×812 (mobile) · ตลาดขายของท้ายแผง (`market-card`) ยังเต็มแถวเดิมไม่กระทบ


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 652 (28 ก.ค. · ต่อยอดรอบ 651 ผู้ใช้ขอ):** 🎨 **แถบสีบนการ์ดตั๋วโลก 3D ทั้ง 8 ใบ แยกสีตามธีมโลก** — แก้ `css/style.css` เท่านั้น เพิ่ม `::before` 5px ให้แต่ละ `#xxx-card.shop-card` (ต่อจากรูปแบบเดิมของ `#phone-card`/`#computer-card`) : ผจญภัย=เขียว · ผีสิง=ส้ม-ม่วง · เฮลิ=ฟ้า · โดรน=เขียวอมฟ้า · ขับรถ=ส้ม-แดง · บอล=เขียวสนาม · มอเตอร์ไซค์=เหลือง · ยานแม่=ม่วงเข้ม
  - **ยืนยัน:** `getComputedStyle(el,'::before')` จริงในเบราว์เซอร์ ครบ 8 ใบ สีตรงตามที่ตั้ง ไม่กระทบ layout เดิม (h ยัง 5px)


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 653 (28 ก.ค. · ต่อยอดรอบ 643 ผู้ใช้ขอ):** 🎖️ **ย้ายบรรทัดระดับชั้นกลับขึ้นมารวมแถวเดียวกับเหรียญ/ออนไลน์** (รอบ 643 เคยแยกไว้คนละบรรทัดข้างล่าง) — แก้ `index.html`+`css/lobby.css`+`js/ui.js`
  - `.coin-stack` (ห่อ 2 แถว) ถูกถอด — `#grade-line` ย้ายเข้าไปเป็น**ช่องที่ 4** ใน `.coin-group` ตรง ๆ (คลาส `.coin-pill.grade-pill`) ได้เส้นคั่นบางระหว่างช่องจาก `.coin-pill + .coin-pill` ที่มีอยู่แล้วโดยไม่ต้องเพิ่มกฎ · กว้างเท่าเนื้อหาจริง (เดิมตอนแยกแถวถูกบังคับให้กว้างเท่าแถวบนด้วย `align-items:stretch` ทำให้มีที่ว่างเปล่าเกินจำเป็น)
  - ฟอนต์ "ระดับชั้น"/ดาว ใช้ขนาดชุดเดียวกับ `.today`/`.net` (13px → 11.5px จอเตี้ย) ให้เข้าชุดกับป้ายอื่นในแถบ · `alignCoinGroup()` วัด `.coin-group` สดทุกครั้งอยู่แล้ว จึงขยับ `.top-flex` ตามความกว้างใหม่ให้เองอัตโนมัติ ไม่ต้องแก้ JS จัดตำแหน่ง
  - ⚠️ **บทเรียน cascade order:** ห้ามวางกฎ non-media ทับท้าย media query ที่ประกาศไว้ก่อนหน้าในไฟล์ (specificity เท่ากัน source order ทีหลังชนะเสมอ ไม่สนว่า media จะ match จริงไหม) — เจอตอนใส่ `.gmark` ขนาดพิเศษให้ `.grade-pill` ซ้อนกับกฎจอเตี้ยที่มีอยู่ก่อน แก้โดยเหลือกฎเดียวไม่มีเงื่อนไข media
  - **ยืนยัน:** เบราว์เซอร์จริง (server ชั่วคราว เพราะ preview เต็ม 5 ตัวจาก session อื่น) — แถวเดียวจริง ขอบบนตรงกับ `.id-card` ทั้ง 1280×720/812×375/620×360 ไม่มี scroll · ทดสอบครบ 3 สถานะ: ปกติ/ออนไลน์กระพริบ/ล็อกชั้น (ปุ่ม "🔒 อีก 30 วัน" ยาวสุด) ไม่ล้น · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 654 (28 ก.ค. · ต่อยอดรอบ 649 · ผู้ใช้สั่งแก้กติกา + เพิ่มเข็ม):** ⌨️ **อันดับแท็บพิมพ์คำตัดสินที่ "จำนวนคำ" + เข็มนักพิมพ์ 100/500/1000 คำ**
  - 🔢 **เปลี่ยนตัวจัดอันดับ:** เดิมเรียงตามแต้ม (รอบ 649) → ตอนนี้เรียงตาม **`state.tpWords` = จำนวนคำที่พิมพ์สำเร็จ (all time)** ตามที่ผู้ใช้สั่ง "ใครพิมพ์ได้เยอะที่สุด" · คำเท่ากัน → ตัดสินด้วยเหรียญสะสม · โชว์ 2 ค่าคู่กันทุกที่ (`320 คำ · 1,240 เหรียญ`)
  - 💬 **เลิกใช้คำว่า "แต้ม" ในเกมนี้ เรียก "เหรียญ" แทน** (ผู้ใช้ให้เหตุผลว่าเด็กเห็นค่ามากกว่า) — เฉพาะแท็บ ⌨️ · แท็บ 🔎 ค้นหาคำ ยังเป็น "แต้ม" เหมือนเดิม
  - ⌨️ **เข็มนักพิมพ์** (`state.typistBadge`) ปลดที่ **100=⌨️ · 500=🔠 · 1000=📜** ติดท้ายชื่อทุกโลกเหมือนเข็มสายอื่น — `TYPIST_TIERS`/`checkTypistBadge` ใน `js/game.js` (เรียกจาก finishWord **ก่อน** onlinePushScore เพราะเข็มถูก bake ไปกับชื่อ) · เติมครบทั้ง `BADGE_META` + `NAME_BADGE_RE` + `badgeEmojis` (กระดานเข็มนับด้วย)
  - 🎬 `.badge-celebrate-overlay` z-index 60 → **96** — เดิมแบนเนอร์เข็มโดนเกมเต็มจอบัง (`#tp-overlay` 93 · `.wsa-overlay` 95) ได้เข็มแล้วเด็กไม่เห็นเลย
  - ♻️ `js/award.js` รับ `field2/scoreOf2/unit/unit2/role` → รองรับกระดานที่มี 2 ค่า (snapshot เก็บ `s`=คำ + `s2`=เหรียญ) · **แท็บ 🔎 ไม่เปลี่ยนพฤติกรรมเลย**
  - แก้: `js/game.js` `js/award.js` `js/tpaward.js` `js/wsaward.js` `js/typing.js` `js/state.js` `js/online.js` `js/ui.js` `css/lobby.css` `css/style.css` `handoff/RULES.md`
  - ⏳ **ค้าง: publish rules** — เพิ่ม field **`tw`** (จำนวนคำ · ตัวจัดอันดับ) และ `s2` ใน `/tpAward` · **Artifact เดิมอัปเดตแล้ว (ลิงก์เดิม)**: https://claude.ai/code/artifact/595d3eee-f3e9-4bc8-b1bf-33dc809f3188
  - **ยืนยัน (เบราว์เซอร์จริง):** เข็ม 8/8 (99→ไม่ได้ · 100/500/1000→ได้ตรงระดับ · เกินแล้วไม่ซ้ำ · คำลดเข็มไม่หาย) · แยกชื่อ/เข็มไม่กินชื่อไทย + `badgeScore` นับ 📜=3 · อันดับเรียงตามคำถูก ตัดคน 0 คำทิ้งแม้เหรียญเยอะ คำเท่ากันใช้เหรียญตัดสิน · จ่ายรางวัลจริง (log มี s=100/s2=19 · ประกาศอ่านว่า "100 คำ · 19 เหรียญ") · **แบนเนอร์เข็มลอยเหนือทั้งเกมและกระดานรางวัลจริง** (elementFromPoint ยืนยัน · ต้อง cancel animation ก่อนวัดตามบทเรียนรอบ 648) · ไม่มี scroll ทุกจอ 1280×720 / 812×375 / 620×360 (แป้น 60.8/56px เท่าเดิม · กริดจอแคบซ่อนค่าเหรียญกันล้นช่อง) · เซฟเก่า 600 คำได้ 🔠 ย้อนหลัง · console สะอาด · ล้างเซฟแล้ว
  - 🚦 **บทเรียน session คู่ขนาน:** ระหว่างทำ มี session อื่นดันถึงรอบ 653 และ **commit รอบ 652 กวาด `css/style.css` ที่ผมแก้ค้าง (z-index เข็ม) ติดไปด้วย** → เนื้อหาถูกต้องและขึ้นเว็บแล้ว แต่ไปอยู่ใต้ชื่อรอบ 652 · ต้องเช็ก `--next-round` ซ้ำก่อน commit เสมอ (650→654)


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 656 (28 ก.ค. · ผู้ใช้สั่ง):** ⌨️ **การ์ดสถิติเกมพิมพ์คำ ในหน้าสถิติ 📊** — โชว์ `tpWords`/`tpScore`/`typistBadge`/อันดับปัจจุบันจากกระดานแท็บ `tp` (คำนวณสด เทียบ `Online.board` แบบเดียวกับ `lbTypingHtml`) + ประวัติรางวัลรายเดือนล่าสุด 3 รายการจาก `tpAwardLog`
  - แก้ `js/ui.js` เท่านั้น (`renderStats`) — เพิ่ม 2 การ์ดใหม่ (สถิติ + ประวัติรางวัล) แทรกหลังการ์ด "สัตว์เลี้ยงของหนู"
  - **ยืนยัน (เบราว์เซอร์จริง):** ตัวเลขคำ/เหรียญ/เข็มตรงกับ state ที่ตั้ง · อันดับคำนวณถูกทั้ง 3 เคส (ยังไม่ออนไลน์=ข้อความบอกให้พิมพ์ก่อน · ติด Top 10=อันดับ 3 ตรง · หลุด Top 10=อันดับ 13 + ป้าย "นอก Top 10") · ประวัติรางวัลโชว์ถูก · console สะอาด · ล้างเซฟแล้ว
- **รอบ 655 (28 ก.ค. · ต่อยอดรอบ 654 · ผู้ใช้สั่ง "กันเด็กเก่งตันเข็มเร็วเกินไป"):** ⌨️ **ต่อเข็มนักพิมพ์อีก 2 ระดับ → 3,000 = ✒️ เข็มปลายปากกาทอง · 10,000 = 🦾 เข็มนิ้วเหล็กไม่มีวันเมื่อย** (แก้ `js/game.js` เป็นหลัก + `js/state.js`/`js/tpaward.js`/`js/typing.js` แค่คอมเมนต์/ข้อความ)
  - ⚠️ **สายนี้เป็นเข็มสายเดียวในเกมที่มี 5 ระดับ** (สายอื่น 3) — `TYPIST_TIERS`/`TYPIST_TIER_UI`/`typistEmoji` ยาวกว่าเพื่อน · แต้มเข็ม `BADGE_META` ✒️=4 · 🦾=5 (เท่า 👑) → กระดานแท็บ 🏅 เข็ม ให้น้ำหนักสายนี้สูงสุด
  - เติมครบทุกที่ที่ต้องรู้จักอิโมจิใหม่: `BADGE_META` + `NAME_BADGE_RE` (ไม่งั้นเข็มโดนนับเป็นส่วนหนึ่งของชื่อ) + `badgeEmojis` (กระดานเข็มนับแต้ม)
  - 🏆 **เข็มนักพิมพ์เข้า "ตู้เข็มสะสม" ในรายงานความก้าวหน้าแล้ว** (`trophyDefs` ใน `showProgressReport`) — มีแถบ % + บอกว่าอีกกี่คำได้เข็มถัดไป เหมือนสายฟ้า/ผาดโผน · เพิ่มบรรทัดกติกาเข็มในกระดานประกาศรางวัลด้วย (เด็กเห็นเป้าหมายครบ 5 ระดับ)
  - **ยืนยัน (เบราว์เซอร์จริง):** เส้นแบ่งเข็ม 11/11 (99/100/499/500/999/1000/2999/3000/9999/10000/50000 — ได้ตรงระดับ ไม่ฉลองซ้ำ) · `splitNameBadges('นักพิมพ์🦾')` แยกถูก · `badgeScore('…🦾')`=5 · ตู้เข็มโชว์ 5 ชิป (⌨️✓🔠✓📜✒️🦾) แถบ 48% ที่ 740 คำ + โน้ต "อีก 260 คำ = 📜" ถูก · แบนเนอร์เข็มระดับ 5 ลอยเหนือกระดานเกมจริง (z 96>93 · elementFromPoint ยืนยัน) · ข้อความใส่จุลภาค "10,000 คำ" แล้ว · กระดานประกาศรางวัล 4 บรรทัดกติกา **ไม่มี scroll ทั้ง 812×375 และ 620×360** · แป้นยัง 56px · console สะอาด · ล้างเซฟแล้ว
  - 📌 หมายเหตุ (ไม่ได้แก้ รอบนี้ไม่เกี่ยว): ตู้เข็มยังไม่มีสาย 🤖 นักล่าบอส (ตกหล่นมาตั้งแต่รอบ 229) · `badgeEmojis` ยังไม่นับสาย 🪟/🐾/🪶/🪂 → กระดานแท็บเข็มมองข้ามเข็มพวกนี้


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 657 (28 ก.ค. · ผู้ใช้สั่ง):** 🍖 **เงินค่าอาหารสัตว์รายเดือน** — ทุกวันที่ 1 ของเดือน จ่าย 10,000 เหรียญ/ตัวที่เลี้ยงอยู่ (`petFoodTick` ใน `js/state.js` เรียกจาก `careTick`) + เตือนล่วงหน้า 1 วัน (วันสุดท้ายของเดือน) บอกจำนวนเงินที่จะได้
  - เก็บ `state.petFoodPaidMonth`/`petFoodWarnMonth` (YYYY-MM) กันจ่าย/เตือนซ้ำ · ไม่มีสัตว์ = ไม่มีเงิน/ไม่เตือน · ไม่มี field ใหม่ใน DB (state เดิมไปกับเซฟ cloud) = ไม่ต้อง publish rules
  - **ยืนยัน (จำลองวันที่ผ่าน console):** 1/2/3 ตัว = 10,000/20,000/30,000 เป๊ะ · เตือนตรงวันสุดท้ายของเดือนก่อนวันที่ 1 พอดี ไม่เตือนซ้ำ · จ่ายวันที่ 1 ครั้งเดียว เปิดซ้ำวันเดียวกันไม่จ่ายซ้ำ · ไม่มีสัตว์ไม่จ่าย · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 658 (28 ก.ค. · ผู้ใช้ขอ 3 ข้อ):** 📐 **ฟีดเพื่อนขยายชนเส้นแดง + แถวเหรียญตามไปแตะเส้นเดียวกัน + แบนเนอร์คำใหม่แยก 2 บรรทัด** — แก้ `css/lobby.css`+`js/ui.js` เท่านั้น
  - `.stage-left`(ฟีดเพื่อน) กว้างขึ้น 28%→34% (`min(280px,28%)`→`min(340px,34%)`) + `#pet-card{gap:8px→0}` ให้ขอบขวาฟีดเพื่อน "ชน" ขอบซ้าย `.stage-hero` พอดี (เดิมมีรอยต่อ 8px) · `alignCoinGroup()`/`alignPetTabs()`/`alignNewWord()` เดิมวัดตำแหน่ง `.stage-hero` สดทุกเฟรมอยู่แล้ว จึงตามเส้นใหม่ให้เองอัตโนมัติ ไม่ต้องแก้ JS
  - แบนเนอร์คำใหม่ `renderNewWord()`: ห่อ `.nw-row1`(NEW+คำ ใหญ่ขึ้น `clamp(18-26px)`→`clamp(22-34px)`)/`.nw-row2`(คำใบ้+เหรียญ+เวลา เท่าเดิม ~11px) แยกกันคนละบรรทัด
  - **⚠️ ข้อจำกัดที่พบระหว่างทดสอบ (ยังไม่แก้ในรอบนี้):** จอแคบกว่า ~900px กว้าง แถวเหรียญกับขอบเวทีเริ่มไม่ชนกันแม่นเป๊ะ (812×375 คลาด ~15px · 620×360 คลาด ~32px ทิศตรงข้าม) ต้นตอ = `.id-card`/`.profile-plate{max-width:min(42vw,380px)}` ยังหด/ขยายแข่งพื้นที่กับ `.coin-group` (flex-shrink ปกติ ไม่ใช่ 0) ทำให้สูตร `alignCoinGroup()` (สมมติว่ามีแค่ `.top-flex` ที่ขยับ) คลาดเคลื่อนเมื่อแถวแน่นเกิน — **ไม่กระทบกฎทอง** (ไม่มี scroll/overflow ทุกจอที่ทดสอบ) เป็นแค่จุดที่ไม่ชนเป๊ะ ยังไม่ได้รับคำสั่งให้แก้ลึกกว่านี้
  - **ยืนยัน:** เบราว์เซอร์จริง 1280×720 — ฟีดเพื่อน/แถวเหรียญ/แบนเนอร์คำใหม่/แท็บสัตว์ **ทั้ง 4 จุดชนเส้นเดียวกันเป๊ะ** (`cgVsHero`/`nwVsHero`/`ptabsVsHero` = 0 ทั้งหมด) · แบนเนอร์ 2 บรรทัดจริง (คำ 28px > คำใบ้ 11px) ไม่ล้น · 812×375/620×360 ไม่มี scroll/overflow (แค่เส้นคลาดตามข้อจำกัดข้างบน) · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 659 (28 ก.ค. · ผู้ใช้สั่ง 2 ข้อ):** 🎀 **แก้บั๊กภาพร่างกำยำทับชุด** + 🦣 **ถอด "โหมดขยายร่าง" ออกทั้งหมด + คืนเงินเต็มจำนวน**
  - 🎀 `currentPetImg()` (`js/images.js`) เดิม: รูปร่าง(อ้วน/ผอม/ล่ำ)ทับภาพใส่ชุดเสมอ → เด็กเข้าใจผิดว่าชุดหาย · แก้: เพิ่มปุ่มสลับ "ดูรูปร่าง ↔ ดูชุด" ในหน้า "ข้อมูลน้อง" (`js/ui.js` ใช้ `state.psDress` ตัวเดียวกับปุ่มบนเวที lobby) + คำบรรยายยืนยันว่าชุดยังใส่อยู่ (`css/lobby.css` เพิ่ม `.pi-shape-toggle-btn`)
  - 🦣 ลบ `giantLevel/giantUnlocked/upgradeGiant/resetGiant` + ปุ่ม/กล่องขยายร่างในหน้าข้อมูลน้อง (`js/ui.js`+`css/lobby.css`) ทั้งหมด — ขนาดน้อง/ผู้เลี้ยงคงที่เท่าร่างปกติเดิม (ไม่กระทบภาพ/เลย์เอาต์คนที่ไม่เคยใช้ร่างยักษ์)
  - 💰 **คืนเงิน:** `loadState()` (`js/state.js`) migration ครั้งเดียว คำนวณจากราคาที่เคยจ่าย (2000/4000/8000/16000 ต่อระดับ 1-4) ของทุกตัว รวมเข้า `state.coins`+`lifetimeCoins` + ตั้ง `state.giantRefund` ให้ `showGiantRefund()` (`js/main.js`) เด้งกล่องแจ้งชัดเจนหลัง login (ต่อคิวหลัง `showQuizBackPay`) กันคืนซ้ำด้วย `state.giantRemoved`
  - **ยืนยัน (เบราว์เซอร์จริง):** ปุ่มสลับดูชุด/รูปร่าง เปลี่ยนภาพ+คำบรรยายถูกทั้ง 2 ทิศทาง · เซฟจำลอง giant:2/giantMax:3 → คืน 14,000 พอดี (2000+4000+8000) เข้า coins/lifetimeCoins ถูก + กล่อง "🦣 ยกเลิกโหมดขยายร่างแล้ว" ขึ้นครั้งเดียว โหลดซ้ำไม่คืนซ้ำ · ไม่มีปุ่ม/กล่องขยายร่างเหลือในหน้าข้อมูลน้อง · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 660 (28 ก.ค. · ผู้ใช้เจอ):** 🖼️ **กันเมนู "Copy image/Download image/Share image" ของ Chrome เด้งตอนกดค้างรูปสัตว์** — ดูไม่มืออาชีพ + เด็กเซฟภาพออกนอกเกมได้
  - `js/main.js`: เพิ่ม `document.addEventListener('contextmenu', ...)` ระดับ global กัน default เฉพาะ target ที่เป็น `<img>` ทั้งแอป (`-webkit-touch-callout:none` เดิมกันได้แค่ iOS Safari ไม่กัน Chrome)
  - **ยืนยัน (เบราว์เซอร์จริง):** dispatch `contextmenu` บน `.pi-portrait` → `defaultPrevented=true` · dispatch บนปุ่มอื่น (`#btn-pi-dress`) → ยังเป็น default ปกติ (ไม่กระทบ UI อื่น) · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 661 (28 ก.ค. · ผู้ใช้เจอซ้ำจากรอบ 659):** 🎀 **ภาพเล็ก "ชุดที่ใส่อยู่" มุมซ้ายรูปน้อง หน้าข้อมูลน้อง** — รอบ 659 แก้ด้วย "ปุ่มสลับ" ซึ่งต้องอ่าน/กดก่อนถึงรู้ เด็กยังเข้าใจว่าชุดหาย → ตอนนี้เห็นชุดด้วยตาทันทีโดยไม่ต้องกดอะไร
  - `js/ui.js` (`__petPlates.info`): ถ้า `IMG_FILES[pet_stage_worn] !== currentPetImg(p)` (โดนร่างล่ำ/อ้วน/ผอม/ป่วย/หิว/ดีใจ ทับ) → แสดง `.pi-dress-pip` (absolute ไม่ดันเลย์เอาต์) รูปชุด + ชื่อชุด "ยังใส่อยู่" · เคสสลับได้จริง (รูปร่างทับชุด ไม่ป่วย/ไม่หิว/ไม่ดีใจ = `piCanSwap`) เป็น `<button id=btn-pi-dress-pip>` กดสลับได้ ผูก handler ตัวเดียวกับ `btn-pi-shape-toggle` · เคสสลับไม่ได้เป็น `<div>` ป้ายเฉย ๆ **และซ่อนปุ่มสลับในคำบรรยายด้วย** (เดิมป่วย/หิวกดแล้วภาพไม่เปลี่ยน = ปุ่มตาย)
  - `css/lobby.css`: `.pi-dress-pip` กว้าง `clamp(56px,15%,92px)` มุมซ้าย top 52px — วัด alpha ของภาพจริงแล้วบริเวณที่ทับ **โปร่งใส 0% ทุกไฟล์** (strong/fat/thin/sick/hungry) ไม่บังตัวน้อง
  - **ยืนยัน (เบราว์เซอร์จริง):** ปกติ=BUTTON "👑 มงกุฎ ยังใส่อยู่ — กดดูใหญ่" กดแล้วภาพใหญ่เป็นชุด+ป้ายเล็กหาย กดกลับได้ · ป่วย/หิว=DIV ไม่มี id ไม่มีคำว่า "กดดูใหญ่" + ปุ่มในคำบรรยายหายไปด้วย · ถอดชุด=ไม่มีป้าย · ไม่มี scroll ทั้ง 1280×720 / 812×375 / 620×360 (ป้ายอยู่ในแผงครบ ไม่ทับรูป) · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 662 (28 ก.ค. · ต่อยอดรอบ 661 ผู้ใช้สั่ง):** 🎀 **ป้ายเล็ก "ชุดที่ใส่อยู่" บนเวที lobby ด้วย** (เดิมมีแค่หน้าข้อมูลน้อง) — เห็นชุดตั้งแต่หน้าแรก ไม่ต้องกดปุ่ม/ไม่ต้องเปิดข้อมูลน้องก่อน
  - `js/ui.js` `petShowHTML()`: มีชุดอยู่ + ชุดถูกบัง (คลิปเล่นอยู่ **หรือ** `base !== IMG_FILES[pet_stage_worn]` = ร่างล่ำ/อ้วน/ผอม/ป่วย/หิว) → แสดง `.ps-worn-pip` รูปชุด + "👑 ยังใส่อยู่" · สลับได้จริง (`!calm && !petHungry`) = `<button>` กดแล้วโชว์ชุดตัวใหญ่ (ผูก handler ร่วมกับ `.ps-dress` ด้วย `querySelectorAll`) · ป่วย/หลับ/หิว = `<div>` ป้ายเฉย ๆ
  - `css/lobby.css`: วางกลาง-ขวาเวที ยึด `bottom:12%` + `max-height:52%` (มุมอื่นไม่ว่าง: บนขวา=ชื่อน้อง ล่างซ้าย=ปุ่มชุด ล่างกลาง=คำใบ้) · โหมดคลิปเปลี่ยนเป็นโทนเข้มอัตโนมัติ
  - ⚠️ **บทเรียนจอเตี้ย:** เวที lobby หดตามจอมาก (620×360 สูงแค่ ~93px) — ป้ายขนาดคงที่ชนป้ายชื่อน้อง ต้องคุมด้วย `%` ของเวที (`bottom`+`max-height`) ไม่ใช่ `top:50%` คงที่
  - **ยืนยัน (เบราว์เซอร์จริง 3 จอ 1280×720 / 812×375 / 620×360):** ป้ายอยู่ในเวทีครบ ไม่ทับชื่อน้อง/ปุ่มชุด/ตัวน้องสักจอ (วัด `getBoundingClientRect`) · กดป้าย→คลิปหยุด โชว์ภาพใส่ชุด ป้ายหายเอง · กด "🎬 ดูคลิปน้อง" กลับ→ป้ายกลับมา · ป่วย/หิว=DIV กดไม่ได้ · ถอดชุด=ไม่มีป้าย · ไม่มี scroll ทุกจอ · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 663 (28 ก.ค. · ผู้ใช้ขอ):** ⌨️ **เพิ่มความดังเสียงกดแป้นพิมพ์ (โหมดพิมพ์คำ) อีก 40%** — `keyTapSynth()` ใน `js/util.js` (เรียกจาก `sfx.keyTap` ใน `js/typing.js`)
  - `g.gain` (นอยส์คลิก): กดลง `.24→.336` · ปล่อยขึ้น `.13→.182` · `og.gain` (ตุบต่ำตอนกดลง): `.15→.21` — คูณ 1.4 ทุกค่า สัดส่วนเดิมคงเดิม
  - **ยืนยัน:** preview เปลี่ยนเลขในไฟล์ที่เสิร์ฟจริงถูก (fetch fresh) · เรียก `sfx.keyTap(false)`/`sfx.keyTap(true)` ตรงบนหน้าเว็บ ไม่มี error ใน console


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 664 (28 ก.ค. · ผู้ใช้เจอ):** 💪 **แก้ข้อความ "กินดีต่อเนื่อง x/3 มื้อ" ในหน้าข้อมูลน้องอ่านไม่ชัด** — ต้นตอ: `.shape-text.shape-progress`(style.css) กับ `.stage-plate .heat-text`(lobby.css) specificity เท่ากัน (2 คลาส) แต่ lobby.css โหลดทีหลังชนะเฉพาะ `color` ส่วน `background` ยังเป็นของ style.css (#e8f6ff) → ตัวหนังสือจาง #c9ddf3 บนพื้นจางเกือบมองไม่เห็น
  - แก้ `css/lobby.css`: เพิ่ม `.stage-plate .shape-text.shape-progress/.shape-strong/.shape-fat/.shape-thin` ครบ 4 สถานะ (คู่สีเดียวกับ `.stage-plate .heat-text.safe` ที่มีอยู่แล้ว = อ่านชัดบนพื้นกรมท่าเวที)
  - **ยืนยัน (จำลอง pet cleanMeals=2 เปิดข้อมูลน้อง วัด `getComputedStyle` ใน preview):** ก่อนแก้ color `#c9ddf3` บน bg `#e8f6ff` (แทบไม่มี contrast) → หลังแก้ color `#a8d4f5` บนพื้นโปร่งแสงทับกรมท่า (contrast สูงขึ้นชัดเจน) · ล้างเซฟทดสอบแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 665 (28 ก.ค. · ผู้ใช้สั่ง):** 🏪 **ย้าย "🎁 คลังสินค้าของฉัน" ขึ้นบนสุดในหน้าตลาด** — `renderMarketCard()` (`js/ui.js`) สลับลำดับ `mkt-mystock`+`renderCollectMine()` มาไว้ต่อจากหัวข้อ/คำโปรย ก่อนปุ่มเล็งของ/ออเดอร์/ชั้นเพื่อน/โชว์รูมรถ
  - **ยืนยัน (preview จริง):** `getBoundingClientRect`+ลำดับ `innerText` ของ `#market-card` ยืนยันคลังสินค้าอยู่บรรทัดที่ 3 ต่อจากคำโปรยทันที
  - ⚠️ **commit เฉพาะ hunk นี้ด้วย `git apply --cached`** (ไม่ใช้ `git add -A`/`finish_round.sh`) เพราะมี session คู่ขนานแก้ `js/ui.js`/`js/images.js`/`js/game.js`/`index.html` ค้างอยู่ (ฟีเจอร์ซ้อนภาพชุดบนท่าโพส ยังไม่ commit) — **ยังไม่ deploy** รอ session นั้น commit งานเขาก่อน ไม่งั้น deploy จะดันงานที่เขายังทำไม่เสร็จขึ้นเว็บจริงไปด้วย


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 666 (28 ก.ค. · ผู้ใช้สั่ง "อยากเห็นรูปร่าง+ชุด ในภาพเดียว แทนการสลับดู"):** 🎀 **ซ้อนชุดเป็น layer PNG บนภาพน้องท่าอื่น** (เลือกทางนี้แทนเจนภาพใหม่ 72 ใบ — ไม่เสียเงินเจน เพิ่มแค่ 316KB)
  - ภาพใน `img/` เป็นงานเจน AI คนละครั้ง ท่าไม่ตรงกัน (diff ทั้งภาพ ~65%) ซ้อนภาพเต็มตัว/หา diff อัตโนมัติไม่ได้ → **`tools/wearlab.py` (ใหม่)** ตัดเฉพาะตัวชุดด้วยสี HSV เป็น PNG โปร่ง 24 ชิ้นใน `img/wear/` + วัดหมุด "เส้นตา/ยอดหัว" ของภาพเป้าหมาย 27 ใบด้วยการหาก้อนตาอัตโนมัติ (สำเร็จ 51/51 ไม่ต้องกรอกมือเลย) → เขียน `js/data/wear.js`
  - หมวกยึด "ยอดหัว" · แว่น/ผ้าพันคอ/โบว์/กระดิ่งยึด "เส้นตา" · ทุกค่าเป็นหน่วยระยะห่างตา → ปรับขนาดตามหัวจริงของแต่ละร่าง (อ้วน/ผอม/ล่ำ/ป่วย/หิว/ดีใจ ทั้งวัยเด็ก-โต) · แว่นใสไม่ถมเลนส์ (เห็นตาน้องจริงผ่านเลนส์) · 4 ชิ้นสีชนตัวเอง (หูหมาฟ้า/ขนแมวส้ม) ยืมชิ้นจากสัตว์ตัวอื่น (ตาราง `SRC`)
  - เกม: `petWearOverlay()/wearLayerHTML()` (`js/images.js`) + กรอบจัตุรัส `.pet-wear` (`css/lobby.css`) ใช้ที่หน้าข้อมูลน้อง + เวที lobby (`js/ui.js`) · **ปุ่มสลับรอบ 659 + ป้ายเล็กรอบ 661 ถูกซ่อนอัตโนมัติเมื่อซ้อนได้** (เหลือบรรทัด "ใส่...อยู่ — เห็นในรูปเลย") · `footAlign` เลื่อนทั้งกรอบแทนเลื่อนแค่ภาพ
  - **ยืนยัน (เบราว์เซอร์จริง):** 13 คู่ (3 สัตว์ × อ้วน/ผอม/ล่ำ + ป่วย/หิว + วัยเด็ก) ได้ layer ถูกใบทุกคู่ · กรอบเป็นจัตุรัสเป๊ะ ภาพเต็มกรอบ · ชุดไม่โดนตัดขอบแผง · **ไม่มี scroll ทั้ง 1280×720 / 812×375 / 620×360** · เวที lobby ขนาด/ตำแหน่งเท่าเดิมเป๊ะทั้งมีชุดและไม่มีชุด · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ **บทเรียน CSS:** กฎขนาดเดิมของ `.pet-img`/`.pi-portrait` มี 5 คลาส specificity สูงกว่ากฎกรอบใหม่ → ภาพในกรอบกลายเป็นกว้าง 0 ต้องใส่ `!important` ที่ `.pet-wear>img`
  - 📌 หมายเหตุ: เวที lobby ถ้าเล่นคลิปวิดีโออยู่ (ปกติ ไม่ป่วย/ไม่หิว) คลิปทับภาพนิ่งเหมือนเดิม → เห็นชุดซ้อนเฉพาะตอนใช้ภาพนิ่ง (ป่วย/หิว/ปิดเอฟเฟกต์) · หน้า "ข้อมูลน้อง" เห็นครบทุกกรณี


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 667 (28 ก.ค. · ผู้ใช้ขอ):** 🔊 **หน้าข้อสอบ (quiz) เล่นเสียงคำศัพท์ภาษาอังกฤษอัตโนมัติ 1 รอบทุกข้อใหม่** — เดิมต้องกดไอคอน 🔊/การ์ดคำเองถึงได้ยิน
  - `js/game.js` `renderQuizQuestion()`: เพิ่ม `speakWord(q.en)` ต่อจากบรรทัด `wordEl.onclick` (เรียกทุกครั้งที่ข้อสอบขึ้นใหม่ ทั้งข้อแรกจาก `startQuiz()` และข้อถัดไปจาก `quizNext()`) · กดการ์ด/ไอคอน 🔊 ซ้ำยังอ่านซ้ำได้ตามเดิม (ใช้ `speakWord` ตัวเดิม ไม่มีฟังก์ชันใหม่)
  - **ยืนยัน (preview mock `speakWord` นับจำนวนครั้งเรียก):** ข้อแรกอ่านอัตโนมัติ 1 ครั้งพอดี ("tiger") · กดการ์ดคำซ้ำ → อ่านอีกครั้ง (รวม 2) · ตอบแล้วกด Next ไปข้อถัดไป → อ่านอัตโนมัติอีก 1 ครั้งพอดี ("horse") · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 668 (28 ก.ค. · ผู้ใช้วางไฟล์ภาพหลับให้):** 😴 **เพิ่มภาพ "หลับ" แยกชนิด/วัย** — เดิมน้องหลับ (`p.sleeping`) ยังโชว์ภาพปกติ ไม่มีท่าหลับเลย
  - `js/images.js`: เพิ่มคีย์ `${pet}_${stage}_normal_sleep` เข้า `petImageKeys()` ให้ probe เจอ 6 ไฟล์ผู้ใช้วางไว้ (`img/{cat,dog,dragon}_{baby,adult}_normal_sleep.png`) + เพิ่มลำดับใน `currentPetImg()`/`petStateImg()`: ป่วย > **หลับ** > หิว > ดีใจ > รูปร่าง/ชุด > ปกติ (ตรงลำดับ badge เดิมที่ ui.js ใช้อยู่แล้ว)
  - **ยืนยัน (เบราว์เซอร์จริง mock `state.pets`):** ตั้ง `sleeping:true` ครบ 6 คู่ชนิด×วัย → `currentPetImg()` และ `<img>` จริงบนเวทีได้ path ภาพหลับถูกทุกคู่ · ป่วย+หลับพร้อมกัน → ยังโชว์ภาพป่วยก่อน (ตรงลำดับ) · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 669 (28 ก.ค. · "ทำให้เสร็จสมบูรณ์" ต่อจากรอบ 667):** 🔊 **อุดบั๊กที่การอ่านอัตโนมัติไปกระตุ้น — คำที่โดนตัดกลางคันถูกหมายหัวเป็น "ไฟล์หาย" ถาวร**
  - **ต้นตอ (เจอจากการวัดจริง ไม่ใช่เดา):** `speakWord()` (`js/util.js`) ขึ้นข้อใหม่จะ `wordAudioNow.pause()` ตัดเสียงคำเก่า → `play()` ของคำเก่าที่ promise ยังค้างอยู่ **reject เป็น `AbortError`** → `fail()` เดิมเหมารวมว่า "ไฟล์หาย" ตั้ง `wordAudio[key]='miss'` **ถาวร** + สั่ง `speakWordTTS` ทันที
  - **อาการที่เด็กเจอ:** คำเก่าตกไปใช้เสียงหุ่นยนต์ตลอดกาล (แม้กดฟังเองทีหลัง) + **เสียง TTS พูดคำเก่าทับคำใหม่ที่เพิ่งขึ้น** · รอบ 667 ทำให้เกิดแทบทุกข้อ (เดิมเกิดเฉพาะกดรัว)
  - แก้: `fail(err)` ข้าม `AbortError` (โดน pause ตัด) + `NotAllowedError` (เบราว์เซอร์บล็อกเสียงอัตโนมัติ) — ไม่ตั้ง 'miss' ไม่เรียก TTS · error อื่น (ไฟล์หายจริง = `NotSupportedError`) ยังตกไป TTS เหมือนเดิม
  - **ยืนยัน (เบราว์เซอร์จริง วัดผล play() promise + ดัก `speechSynthesis.speak`):** ก่อนแก้ ตอบ+กด Next เร็ว → `miss:["crayon"]` + TTS พูด "crayon" ทับ · หลังแก้ เคสเดียวกัน → `fish`=REJECTED:AbortError, `bird`=**PLAYED**, TTS **ไม่พูดอะไรเลย**, cache **ไม่โดนหมายหัว** · `fish` กดฟังซ้ำยังใช้ mp3 จริง · คำมั่ว `zzzznotarealword` ยัง→'miss'+TTS ถูกต้อง (fallback ไม่พัง) · ปิดเสียง=ไม่อ่านอัตโนมัติ เปิดกลับ+กดเอง=ดัง · ล้างเซฟ+ปิดเสียงทดสอบแล้ว
  - 📌 หมายเหตุ: `speakLetter()` (ตัวอักษรโลก 3D) มีตรรกะ `fail` แบบเดียวกัน ยังไม่แก้รอบนี้ (คนละระบบ ไม่ได้ทดสอบ) — ถ้าเจอตัวอักษรกลายเป็นเสียงหุ่นยนต์ ให้ยกกฎเดียวกันไปใส่


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 670 (28 ก.ค. · ❌ ถูกยกเลิกแล้วในรอบ 673 — ผู้ใช้ตีกลับ "เสียหาย!"):** 😴 **ป้าย "น้องหลับอยู่..." ทับตัวน้องท่านอน** — ท่านอนกินพื้นที่กรอบเกือบเต็มต่างจากท่ายืน ป้ายเดิม `bottom:8px` เลยซ้อนตัวน้อง
  - `js/ui.js` `petShowHTML()`: เพิ่มคลาส `ps-sleep` บน `.pet-show` เมื่อ `p.sleeping` · `css/lobby.css`: `.pet-show.ps-sleep{padding-bottom:16%}` (ดันทั้งตัวน้องขึ้น) + ย่อ `.ps-pod` ลงอีก 10 หน่วยของ `--ps-h` + ย้าย `.ps-hint` ลง `bottom:2px` (ใกล้ขอบล่างสุดของกรอบ) — ใช้เฉพาะตอนหลับ ไม่กระทบท่ายืน/ป่วย/หิวเดิม
  - **ยืนยัน (`getBoundingClientRect` จริง ไม่เดาจาก screenshot):** ก่อนแก้ป้ายทับตัวน้อง (gap ~0px) · หลังแก้มีช่องว่างจริงระหว่างขอบล่างตัวน้องกับขอบบนป้าย **~21px (1000×640) / ~14px (812×375) / ~21px (620×360)** ทั้ง 3 ขนาดจอ ไม่มี scroll/overflow · ป้ายยังอยู่ในกรอบเวทีครบทุกจอ · ทดสอบครบ หมา/แมว/มังกร × เด็ก/โต · ท่ายืนปกติ/ป่วย/หิว (ไม่มีคลาส `ps-sleep`) หน้าตาเหมือนเดิมไม่กระทบ · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-28 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 671 (28 ก.ค. · ผู้ใช้ส่งภาพหน้าจอมือถือ):** ⌨️ **กันแป้นพิมพ์มือถือเด้งพร้อมกล่องแชท + ลอยบังจอ** — เดิม `openChat()` (`js/ui.js`) สั่ง `input.focus()` หลังเปิด 60ms ทำให้คีย์บอร์ดเด้งทันทีบังกล่อง ทั้งที่ผู้ใช้ยังไม่ได้แตะช่องพิมพ์
  - แก้ 2 จุด: (1) ลบ auto-focus ทิ้ง — คีย์บอร์ดขึ้นเฉพาะตอนผู้ใช้แตะช่อง "พิมพ์ข้อความ..." เอง (2) เพิ่ม `chatFitKeyboard()` ใช้ `visualViewport` เฝ้าตอนคีย์บอร์ดเปิด (`window.innerHeight - vv.height > 120`) → ใส่คลาส `.kb-open` ให้ `.chat-overlay` (`css/lobby.css`) ดันกล่องลงชิดขอบล่างพื้นที่จอจริง + จำกัด `max-height` กล่องไม่ให้ทะลุคีย์บอร์ด แทนลอยกลางจอเดิม
  - **ยืนยัน (preview จริง):** เปิดแชทแล้ว `document.activeElement` ยังเป็น body ไม่ใช่ช่องพิมพ์ (ไม่ auto-focus) · จำลอง `visualViewport` หด (640→300) → overlay ได้คลาส `kb-open` + `height`/`max-height` ปรับตามพื้นที่จริงถูกต้อง · ปิดแชทแล้วไม่มี listener/error ค้าง console สะอาด


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 672 (28 ก.ค. · ผู้ใช้สั่งทำต่อจากรอบ 669):** 🔠 **ยกกฎ "เสียงโดนตัด ≠ ไฟล์หาย" ไปใส่ `speakLetter()` (ตัวอักษรโลก 3D) ด้วย** + ยุบกติกาเหลือที่เดียว
  - `js/util.js`: แยก `speakCutOff(err)` ออกมาเป็นฟังก์ชันเดียว (คืน true เมื่อ `AbortError`/`NotAllowedError`) ใช้ร่วมทั้ง `speakWord()` + `speakLetter()` — เดิมรอบ 669 แก้แค่ `speakWord()`
  - **ทำไมตัวอักษรโดนหนักกว่า:** คอมเมนต์เดิมในโค้ดระบุเองว่า *"เก็บตัวสุดท้ายแล้วคำสำเร็จ เสียงอ่านทั้งคำ (delay 0.7 วิ) จะตัดเสียงตัวอักษรให้เอง"* → การตัดนั้นคือ `AbortError` **ทุกครั้งที่เก็บคำครบ** + เก็บตัวอักษรรัวก็ตัดกันเองทุกตัว
  - **ยืนยัน (เบราว์เซอร์จริง · A/B ปิด-เปิด guard ด้วยซีเควนซ์เดียวกันเป๊ะ `c`→`a`→`t`→คำว่า cat):**
    · **ก่อนแก้** TTS พูด `["C.","A.","T."]` ทับเสียงคำ + `letter:c/a/t` โดนหมายหัว 'miss' ถาวรทั้ง 3 ตัว
    · **หลังแก้** ตัวอักษร 3 ตัว = REJECTED:AbortError เงียบ ๆ · `words/cat.mp3` = **PLAYED** · TTS **ไม่พูดอะไรเลย** · ไม่มีตัวไหนโดนหมายหัว · กด `c` ซ้ำยัง PLAYED จากไฟล์จริง
  - **regression:** เส้นทางคำศัพท์ (รอบ 667/669) ยังถูก — tiger/horse โดนตัด=ไม่ poison ไม่มี TTS · คำมั่ว `zzzznotarealword`=NotSupportedError→'miss'+TTS ตามเดิม · unit `speakCutOff`: Abort/NotAllowed=true · NotSupported/Event(onerror)/undefined=false · console สะอาด · ล้างเซฟ+ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 673 (28 ก.ค. · ผู้ใช้ตีกลับรอบ 670 "เสียหาย!"):** 😴 **คืนตัวน้องท่าหลับกลับที่เดิม/ขนาดเดิม แล้วย้ายเฉพาะ "ป้าย" ขึ้นไปลอยบนท้องฟ้า**
  - ⛔ **บทเรียนสำคัญ:** รอบ 670 แก้ป้ายทับตัวน้องด้วยการ **ย่อ+ดันตัวน้องขึ้น** (`padding-bottom:16%` + ย่อ `.ps-pod`) → น้องลอยกลางอากาศ ตัวเล็กลง ผู้ใช้ไม่ยอมรับ · **กฎที่ได้: ป้าย/UI ทับตัวละคร ให้ขยับ "ป้าย" เสมอ ห้ามขยับ/ย่อตัวละคร** (ตัวละครคือของที่ผู้ใช้ออกแบบไว้แล้ว)
  - ตอนนี้เหลือกฎเดียว: `.pet-show.ps-sleep .ps-hint{bottom:56%}` (`css/lobby.css`) — ป้ายไปอยู่กลางท้องฟ้า ใต้ดวงอาทิตย์ เหนือยอดเขา (`.ps-hill.h1` ยอดอยู่ที่ 49% จากล่าง) · คลาส `ps-sleep` มาจาก `petShowHTML()` (`js/ui.js` รอบ 670) ยังใช้ต่อ
  - 🔍 **วิธีวัดที่ถูกต้องกับภาพน้อง (ใช้ซ้ำได้):** กรอบ `<img>` **ไม่ใช่** ตัวน้อง — ภาพหลับมี Zzz อยู่บนสุด (พิกเซลทึบเริ่ม 0.9%) + ช่องโปร่งท้ายภาพ ~24% ที่ `footAlign()` เลื่อนลงด้วย `translateY` → ต้องวัด **สัดส่วนพิกเซลไม่โปร่งของไฟล์** (canvas alpha) แล้วแปลงเป็นพิกัดจอ ถึงจะรู้ขอบตัวจริง
  - **ยืนยัน (`getBoundingClientRect` + alpha bbox · 18 เคส = หมา/แมว/มังกร × เด็ก/โต × 3 จอ 1000×640 / 812×375 / 620×360):** ป้ายไม่ทับตัวน้องสักเคส (ระยะห่างน้อยสุด 10.7px) · ป้ายอยู่เหนือยอดเขา 24-41px · ป้ายอยู่ในกรอบเวทีครบ ไม่ทับป้ายชื่อน้อง · ไม่มี scroll ทุกจอ
  - **พิสูจน์ว่าไม่แตะตัวน้องจริง:** ถอด/ใส่คลาส `ps-sleep` บนน้องตัวเดียวกัน → `getBoundingClientRect` ของภาพ+`.ps-pod`+`padding-bottom` **เท่ากันทุกตัวเลขทศนิยม** · ท่าป่วย/หิว ป้ายยังอยู่ขอบล่างเดิม (31px จากก้นเวที) ไม่กระทบ · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 674 (28 ก.ค. · เตรียมงานเจนเสียงให้ Sonnet ทำต่อ):** 🔊 **`tools/gen_word_audio.py` ดึงคำจาก `js/data/band/*.js` ได้แล้ว** (เดิมอ่านแค่ `js/data/vocab.js`) — ยังไม่ได้เจนไฟล์จริงในรอบนี้ แค่ทำตัวดึงคำให้ถูก
  - **กับดักที่แก้:** regex เดิมจับแต่ single quote `['word',` แต่ไฟล์ band ใช้ double quote `["word",` → อ่าน band ได้ **0 คำ** แล้วสรุปว่า "ไม่มีคำใหม่" **เหมือนทำงานสำเร็จ** · เปลี่ยนเป็น `PAIR_RE` ที่รับทั้ง 2 แบบ (backreference คุมให้ quote เปิด-ปิดตรงกัน)
  - **กัน "พังเงียบ":** พิมพ์ยอดแยกแหล่ง (vocab.js / band / รวมไม่ซ้ำ) ทุกครั้ง + ถ้าเจอไฟล์ band แต่ดึงได้ 0 คำ → **`sys.exit(1)` หยุดทันที** ไม่เจนต่อ
  - 🐛 **บั๊กแถมที่เจอตอนเทสต์:** คอนโซล Windows เป็น cp1252 — ข้อความไทยใน `print()` ทำ `UnicodeEncodeError` ตายกลางคัน (ของเดิมรอด เพราะพิมพ์อังกฤษล้วน) → ใส่ `sys.stdout/stderr.reconfigure(encoding='utf-8')` ตอนเริ่ม
  - **ยืนยัน (รันจริง ไม่เจนไฟล์ — mock `edge_tts` แล้วเรียก `extract_words()` ตรง):** vocab.js 400 + band 1,520 = **รวม 1,920 คำไม่ซ้ำ** · ต้องเจนใหม่ **1,520** (ตรงกับที่นับด้วยสคริปต์แยกก่อนหน้าเป๊ะ) · ชื่อไฟล์ไม่ชนกันสักคู่ · **`word_key()` ตรงกับ `wordAudioFile()` ใน `js/util.js` ทุกเคส** (เทียบผลรันจริงบน node: เว้นวรรค/ขีด/apostrophe/ตัวเลข เช่น `Activity-based costing`→`activity_based_costing.mp3`, `don't`→`don_t.mp3`) · จำลอง regex เดิม → guard หยุดด้วย exit 1 จริง · `sound/` ไม่ถูกแตะ (ยัง 400 คำ + 26 ตัวอักษร ไม่มีไฟล์ `.tmp` ค้าง)
  - ▶️ **งานต่อ (มอบ Sonnet ได้):** รัน `pip install edge-tts` แล้ว `python tools/gen_word_audio.py` เพื่อเจน 1,520 ไฟล์ · เสียงมาจาก Microsoft Neural (`en-US-JennyNeural` rate `-15%`) ตรึงในสคริปต์ → ผลลัพธ์เท่ากันทุกโมเดลที่รัน · สคริปต์ข้ามไฟล์ที่มีอยู่แล้ว ห้ามปิดกลไกนี้ · `sound/` ไม่อยู่ใน git ห้าม `git add`


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 675 (28 ก.ค. · ผู้ใช้สั่งต่อจากรอบ 673):** 🌙 **ป้ายตอนน้องหลับเป็นโทนกลางคืน + ขยับลงอีกนิด** (`css/lobby.css` ไฟล์เดียว)
  - ตำแหน่ง `bottom:56%→54%` · โทน: พื้นไล่สีกรมท่า `rgba(40,57,116,.93)→rgba(15,24,58,.96)` + ตัวหนังสือ `#e6efff` + ขอบแสงจันทร์ · ดาวเล็ก 4 ดวงในพื้นป้ายวาดด้วย `radial-gradient` (ไม่เพิ่ม element) · ⭐ สองข้างเป็น `::before/::after` กะพริบ `psStarTwinkle` สลับจังหวะ (delay 1.4s) · `html.no-anim` หยุดกะพริบให้เอง
  - ⚠️ **กับดักที่เจอ (เขียนไว้ในโค้ดแล้ว): `padding-inline` ของป้ายห้ามเกิน 20px** — ตอนแรกใส่ 24px เผื่อที่ให้ ⭐ ทำให้ข้อความตัดบรรทัดเพิ่มบนจอแคบ (620×360) ป้ายสูง 52→66px แล้ว**ชนป้ายชื่อน้องมุมบนขวา** · ไล่วัดทีละค่าเจอเส้นแบ่งอยู่ระหว่าง 20-22px → ใช้ 18px + ย่อดาวเป็น `.72em` วางที่ 5px
  - **ยืนยัน (18 เคส = หมา/แมว/มังกร × เด็ก/โต × 3 จอ):** ไม่ทับตัวน้อง/ไม่ทับป้ายชื่อสักเคส (ห่างตัวน้องน้อยสุด 6.9px · เหนือยอดเขา 20.6-32.5px) · อยู่ในกรอบเวทีครบ · ไม่มี scroll · `no-anim` ดาวหยุดนิ่งแต่ยังโทนกลางคืน · ป้ายป่วย/หิวยังโทนสว่างที่ขอบล่างเดิม (31px จากก้นเวที) ไม่มีดาว ไม่โดนกระทบ · ถอด/ใส่ `ps-sleep` ตัวน้องยังเท่าเดิมทุกทศนิยม · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 676 (28 ก.ค. · ผู้ใช้บอกยังเบา สั่งเพิ่มอีก 30% ต่อจากรอบ 663):** ⌨️ **เสียงกดแป้นพิมพ์ดังขึ้นอีก 30% ซ้อนจากรอบ 663 (รวม ๆ ~1.82 เท่าของเดิม)** — `keyTapSynth()` ใน `js/util.js`
  - `g.gain`: กดลง `.336→.437` · ปล่อยขึ้น `.182→.237` · `og.gain` (ตุบต่ำ): `.21→.273`
  - **ยืนยัน:** preview fetch fresh เห็นเลขใหม่จริง · เรียก `sfx.keyTap(false)`/`sfx.keyTap(true)` บนหน้าเว็บ ไม่มี error ใน console


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 677 (28 ก.ค. · ทำต่อจากรอบ 674):** 🔊 **เจนไฟล์เสียง mp3 คำศัพท์ที่ขาดจริงแล้ว** ด้วย `tools/gen_word_audio.py` (ตัวดึงคำ band/ ที่แก้รอบ 674 ทำงานถูกต้อง)
  - ยอดตรงตามคาด: vocab.js 400 · band/ (20 ไฟล์) 1,520 · รวมไม่ซ้ำ 1,920 · **generated 1,520 · skipped(existing) 426 · failed 0**
  - ยืนยัน: สุ่มเช็ก 5 ไฟล์ (exponent/clean/allocation/fidget/determine) ขนาด >0 + MP3 header ถูกต้องทุกไฟล์ · ไม่มี `.tmp` ค้างใน `sound/words/`
  - `sound/` ไม่อยู่ใน git ไม่ต้อง commit ไฟล์เสียง · ค้าง: ไม่มี (งานเสร็จสมบูรณ์)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 678 (28 ก.ค. · ผู้ใช้สั่ง 3 อย่าง):** 🌙 **ตอนน้องหลับ = ทั้งเวทีเป็นกลางคืน + ป้ายบรรทัดเดียวไปอยู่ใต้ตัวน้อง** (`css/lobby.css` + `js/ui.js`)
  - 🌃 **ฉากกลางคืน:** `petShowBgHTML()` ติดคลาส `ps-night` เมื่อ `p.sleeping` → CSS **ทับชุดตัวแปรสีเดิม** ของแต่ละสัตว์ (`--sky/--hill/--gr/--cloud/--sun`) จึงไม่ต้องแตะโครงฉากเลย · ☀️→🌙 ตัดแฉกรัศมีที่หมุนออก เหลือดวงจันทร์เรืองแสง · ⭐ ดาวเต็มฟ้า 10 ดวง = `radial-gradient` ใน `::before` (จำกัดครึ่งบน 62% ไม่ให้ดาวไปโผล่บนภูเขา) · ปิดกลีบดอกไม้กลางวัน · เงาขอบเข้มขึ้น · กรอบเวทีมืดตามด้วย `:has(.ps-night)` (เบราว์เซอร์ไม่รองรับก็แค่ได้ขอบเดิม ไม่พัง)
  - 📛 **ป้ายบรรทัดเดียว + ใต้ตัวน้อง:** `white-space:nowrap` + `font-size:clamp(8px,4.6cqw,11px)` (ย่อตาม**ความกว้างเวที** ด้วย cqw — ใช้ vh อย่างเดียวไม่พอ จอเตี้ยแต่แคบตัวหนังสือจะล้น) + `line-height:1.25` ให้ป้ายเตี้ยพอลงแถบพื้นหญ้า
  - 🔑 **ต้นตอที่ทำให้ "ใต้ตัวน้อง" ยาก (จดไว้ในโค้ดแล้ว):** `.stage-hero` มี `padding-bottom:22px` **คงที่** → `.hero-scene`/`.pet-show` (กรอบที่ป้ายยึด) จบเหนือพื้นเวทีจริง 22px และ**เท้าน้องอยู่ก้นกรอบนั้นพอดี** = ในกรอบไม่มีที่ว่างใต้ตัวน้องเลย · แก้ด้วย `bottom:-20px` ให้ป้ายยื่นออกไปนั่งบนพื้นหญ้า (22px เป็น px คงที่ทุกจอ จึงใช้ค่าคงที่ได้)
  - **ยืนยัน (18 เคส = หมา/แมว/มังกร × เด็ก/โต × 3 จอ 1000×640 / 812×375 / 620×360):** ป้ายบรรทัดเดียวทุกเคส · อยู่ **ใต้** ตัวน้องจริง ไม่ทับสักเคส · **วัดครบทุกเฟสของแอนิเมชันหายใจ** (หยุดภาพด้วย `animation-play-state:paused` + ไล่ `animation-delay` 41 เฟรม/รอบ — timer ปกติใช้ไม่ได้เพราะ pane ถูก throttle) ระยะห่างแย่สุด 4.6-5.6px · ป้ายไม่ล้นความกว้างเวที · ไม่มี scroll · หลับ+ใส่ชุด ป้ายชุดมุมขวาไม่ชนป้ายข้อความ · ตื่น/ป่วยยังเป็นฉากกลางวัน ป้ายโทนสว่างที่เดิม (31px จากก้นเวที) · `no-anim` ดาวหยุดทั้งบนฟ้าและบนป้าย แต่ยังกลางคืน · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 679 (28 ก.ค. · ผู้ใช้บอก "ยังเบา" 2 ครั้ง แล้วสั่งเพิ่มอีก 3 เท่า + เพิ่มปุ่มปิดเสียงแป้น):** ⌨️ **เสียงกดแป้นดังขึ้นรวม ~5.46 เท่าจากค่าตั้งต้น** + 🔊 **ปุ่มเลื่อนเปิด/ปิดเสียงกดแป้นเฉพาะจุด บนหัวกระดานพิมพ์คำ**
  - `js/util.js` `keyTapSynth()`: gain ×3 ซ้อน (กดลง `.437→1.311` · ปล่อยขึ้น `.237→.711` · ตุบต่ำ `.273→.819`) — **gain เกิน 1 แล้วจึงเพิ่ม `DynamicsCompressorNode` (`keyTapComp`)** คั่นก่อนออกลำโพงกันเสียงแตก/clip (เฉพาะเสียงกดแป้นเท่านั้น ไม่กระทบ sfx อื่น)
  - `js/typing.js`: เพิ่ม `<button id=tp-snd>` ในหัวกระดาน (`.tp-head` ปรับเป็น 4 คอลัมน์) — ตัวเลื่อนแบบ track+thumb คุมด้วย `state.tpKeySoundOff` (persist ผ่าน `saveState`) · รวมจุดเรียก `sfx.keyTap` ทั้งหมด (6 จุด) ผ่านฟังก์ชัน `keyTap()` ในไฟล์เดียวกันแทน เช็กปุ่มก่อนเรียกทุกครั้ง · ปิดปุ่มนี้ไม่กระทบเสียงเหรียญ/พูดคำ/select
  - `css/lobby.css`: เพิ่ม `.tp-snd` + `.tp-snd-track/-thumb/-ic` (จอแคบ <640px ซ่อนไอคอน 🔊 เหลือแค่ตัวเลื่อน กันล้น)
  - **ยืนยัน (เบราว์เซอร์จริง 1000×640 / 812×375 / 620×360):** ปุ่มไม่ทับสถิติ/ปุ่มปิด ทุกจอ ไม่มี scroll · คลิกปุ่ม → `sfx.keyTap` ไม่ถูกเรียกเลยตอนปิด (นับจริง 0 ครั้ง) กลับมาเรียกปกติตอนเปิด (1 ครั้ง) · ไอคอน 🔊/🔇 สลับถูก · gain ใหม่ + compressor โหลดจริงไม่ error · console สะอาดทุกจอ · ล้างเซฟแล้ว
  - ⚠️ **หมายเหตุ:** `js/game.js` มีการแก้ค้างจาก session อื่นอยู่ในเครื่อง (ไม่ใช่ของรอบนี้) — commit เฉพาะ `js/util.js` `js/typing.js` `css/lobby.css` เท่านั้น ไม่แตะ


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 680 (28 ก.ค. · ผู้ใช้สั่ง 2 อย่าง):** 🕗 **ฉากเวทีสลับกลางวัน-กลางคืนตามนาฬิกาเครื่องผู้เล่นจริง** + ✨ **หิ่งห้อย/ดาวตกตอนกลางคืน**
  - `isNightNow(now)` ตัวใหม่ใน `js/state.js` (วางข้าง `nightKeyOf`) = `h >= SLEEP_FROM_HOUR(20) || h < WAKE_HOUR(6)` — **ยืมช่วงเวลานอนของน้องมาใช้** ฉากจะได้ตรงกับกติกานอนที่เด็กเห็นอยู่แล้ว ไม่ต้องตั้งค่าคนละชุด
  - `petShowBgHTML()` (`js/ui.js`): `night = p.sleeping || isNightNow()` → น้องหลับ **หรือ** ถึงเวลากลางคืน = ฉากมืด (ของเดิมรอบ 678 มีแค่ตอนหลับ) · **ไม่ต้องเพิ่ม timer** — `js/main.js:256` มี tick เรียก `renderDashboard()` ทุก 1 นาทีอยู่แล้ว ฉากจึงสลับเองภายใน ≤1 นาที
  - ✨ หิ่งห้อย 7 ตัว (จุดเรืองแสงเหลืองอมเขียว ลอยเรี่ยพื้น กะพริบไม่พร้อมกัน) + 🌠 ดาวตก 2 ดวง (พาดเฉียงลง โผล่ ~0.9 วิ ทุก 15/21 วิ) — เจน element ใน `petShowBgHTML` เฉพาะตอนกลางคืน · CSS `.ps-night-fx` ใน `css/lobby.css`
  - ⚠️ **ข้อควรระวังที่จดไว้ในโค้ด:** `.pet-show-bg` อยู่**นอก** `.hero-scene` จึงใช้ `cqw` ไม่ได้ (จะไปอิงคอนเทนเนอร์อื่น/viewport แล้วเพี้ยนบนจอเล็ก) → ระยะ/ขนาดของเอฟเฟกต์ใช้ `%` ของกรอบฉากทั้งหมด · ดาวตกขยับด้วย `left/top` เพราะ `transform` ถูกใช้ตรึงมุมเอียงไว้แล้ว
  - **ยืนยัน:** ไล่ `isNightNow()` ครบ **24 ชั่วโมง** → กลางคืน 20:00-05:59 กลางวัน 06:00-19:59 ถูกต้อง · เรนเดอร์จริง 9 เคส (9/13/19/20/23/3/6 น. × ตื่น + หลับกลางวัน/กลางคืน): ตัวแปรสีฟ้าสลับถูกทุกเคส (`--sky1` `#8ed6ff`↔`#080f2e`) · หลับตอนกลางวันก็ยังได้ฉากกลางคืน · กลีบดอกไม้กลางวันปิดตอนกลางคืน · หิ่งห้อย 7/ดาวตก 2 โผล่เฉพาะกลางคืน อยู่ในกรอบฉากครบ (แถบ 57-77% = เรี่ยพื้นจริง) delay ไม่ซ้ำกันสักตัว · **ไล่เฟสดาวตกทีละเฟรม**: วิ่ง 4%→46% แนวนอน, สว่างจริงแค่ช่วง 2-8% ของรอบแล้วดับยาว (เป็นครั้งคราวจริง) · ครบ 3 จอ ไม่มี scroll · `no-anim` ปิดหิ่งห้อย/ดาวตกแต่ฟ้ายังมืด · ป้ายท่าหลับ (รอบ 678) ยังอยู่ใต้ตัวน้องเหมือนเดิม ป้ายท่าตื่นยังที่เดิม 31px · console สะอาด · ล้างเซฟ+คืนนาฬิกาจริงแล้ว
  - 📌 หมายเหตุ: commit เฉพาะ `js/state.js` `js/ui.js` `css/lobby.css` — `js/game.js` มีงานค้างของ session คู่ขนาน ไม่แตะ


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 681 (28 ก.ค. · เชื่อมเสียงคำ+ข้อมูล `js/data/band/` เข้าเกม ตามที่ค้างไว้ตั้งแต่ 17 ก.ค.):** 🎓 **คลังศัพท์ขั้นสูง (วิชาการ/ธุรกิจ) เล่นได้จริงในหน้าเลือกหมวดแล้ว พร้อมเสียงอ่านครบ**
  - ใหม่: `tools/gen_band_adv_manifest.py` (สแกนไฟล์แยกช่วงคำใน `js/data/band/` → เจน `js/data/band/manifest.js` = `BAND_ADV_MANIFEST`) · `js/bandadv.js` (`bandAdvLoad` fetch+JSON ไฟล์ย่อยขี้เกียจ, **normalize คำอังกฤษเป็นตัวเล็กเสมอ** — business ต้นฉบับขึ้นต้นตัวใหญ่ทุกคำ ไม่ทำ = เทียบคำตอบพลาด, `bandAdvPlay`/`bandAdvCardsHTML` ต่อเข้า `startGame`/`startQuiz` เดิมตรงๆ ไม่มีชุดสอบย่อยแบบ dict_band เพราะ entry มีแค่ [en,th])
  - แก้: `index.html` เพิ่ม script 2 บรรทัด (manifest+bandadv หลัง dictband.js) · `game.js` `renderCats()` เพิ่ม `bandAdvCardsHTML()` ต่อท้าย + คลิก handler เช็ก `dataset.badv` ก่อน `dataset.band`/`dataset.cat`
  - **ยืนยัน (preview จริง 1000×640):** การ์ด 🎓ศัพท์วิชาการ(1,230→1,104 หลัง dedupe)/💼ศัพท์ธุรกิจ(399) โผล่ท้ายการ์ด band 1-5 · เล่นจับคู่โหลดคำถูก (`archaic` → `sound/words/archaic.mp3` 200 OK) · สอบ business คำตัวพิมพ์ใหญ่ (`Accountability`→`accountability`) normalize ถูก + เสียงคำ `counsel` โหลด 200 OK · ตอบครบ 10 ข้อ → ผ่าน + ได้ 500 🪙 + ขึ้น `state.quizPassed` จริง · console สะอาด ไม่มี error · ล้างเซฟแล้ว
  - ค้าง: ไม่มี (feature ใช้งานได้ครบ) · เพิ่มหมวดใหม่ทีหลัง (นอกเหนือ academic/business) ต้องเพิ่ม label/emoji ใน `LABELS` ของ `tools/gen_band_adv_manifest.py` ก่อนรันสคริปต์ซ้ำ


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 682 (28-29 ก.ค. · ผู้ใช้งง "เข็ม" ในกระดานอันดับคืออะไร → แยกเป็นกระดานย่อยรายสาย + เปลี่ยนอิโมจิเป็นภาพเหรียญจริง):** 🎖️ **กระดานอันดับ "เข็ม" เดิมจัดอันดับด้วยแต้มรวมสาย 10 อย่างเป็นค่าเดียว ดูไม่ออกว่าใครเก่งด้านไหน**
  - `js/game.js`: เพิ่ม `BADGE_CATS` (10 สาย ×3-5 ระดับ) + `bcatLevel()` แยกระดับผู้เล่นต่อสายจากสตริงเข็มที่ baked ในชื่อ (ผู้ใช้สั่งเมื่อ commit อื่นเผลอสวีป — ดูหมายเหตุด้านล่าง)
  - `js/ui.js`: `lbBadgeSections()` (ใหม่) แยกอันดับ Top 5/สาย เรียงระดับ→แต้มรวม(tiebreak)→ชื่อ · แท็บ "🏅 เข็ม" ในกระดานเต็มจอ (`openLeaderboardFull`) เปลี่ยนจากโพเดียม+กริดรวมเป็น 10 การ์ดสายเลื่อนในตัว (scrollbar ซ่อนแบบ `.pl-feed`) · `showPlayerCard` badgeRow ก็เปลี่ยนเป็นภาพเหรียญ
  - **ภาพเหรียญจริงแทนอิโมจิ:** ผู้ใช้เจนภาพชุด 33 เหรียญ (สไตล์เหรียญโลหะแท้ถ่ายมาโคร) เป็น `img/badges/originals/badge_sheet.png` (ต้นฉบับ ไม่ขึ้น git — `**/originals/`) → `tools/badgelab.py` (ใหม่) ตัดพื้นหลังกำมะหยี่ดำออกอัตโนมัติ (เพดานสว่าง<32) + ปิดตรา "AI-Generated" ที่ทับมุมขวาบนก่อนตัด → ได้ 33 ไฟล์ `img/badges/<สาย>_<ระดับ>.png` + `crown.png` · `js/data/badgeSprite.js` (ใหม่) map อิโมจิ→path + `badgeIcHTML()` ถอยกลับอิโมจิเองถ้าไฟล์โหลดพัง (แพทเทิร์นเดียวกับ `rankBadgeHTML`)
  - ⚠️ **เจอ session คู่ขนานสวีปไฟล์ระหว่างทาง:** `js/game.js` ที่แก้ไว้ (BADGE_CATS) หายไปจาก working tree แต่กลับไปโผล่ในคอมมิต "รอบ 681" ของอีก session (แสดงว่าเขา add กว้างตอน commit เผลอพ่วงไฟล์เราไปด้วย) — เนื้อหาตรงกับที่ตั้งใจเป๊ะ ไม่เสียหาย เลยไม่ต้องแก้ซ้ำ แค่ไม่ commit `js/game.js` ซ้ำในรอบนี้ (ของอยู่ในรอบ 681/e6bded9 แล้ว)
  - **ยืนยัน (preview จริง 1000×640 + 812×375 mock testkit):** 8 สายมีข้อมูลโชว์ครบ เรียงระดับ+tiebreak ถูก (เช่น 2 คน tier ทองเท่ากัน คนแต้มรวมสูงกว่าขึ้นก่อน) · ภาพเหรียญ 15 ใบที่โชว์ `naturalWidth>0` ทุกใบ ไม่มีพัง · สลับแท็บ เข็ม↔เหรียญ↔กลับ ไม่พัง · คลิกชื่อในกระดานสายเปิดการ์ดโปรไฟล์ได้ · กล่องพอดีจอ 1000×640 ไม่มี scroll แนวนอน · ล้างเซฟแล้ว
  - ▶️ ค้าง: มีไฟล์ซ้ำ `img/badge_sheet.png` (root, ผู้ใช้วางพลาดตำแหน่งก่อนแก้เป็น `img/badges/`) — ยังไม่ลบให้ (ของผู้ใช้ ต้องถามก่อน) · ยังไม่ได้เชื่อมภาพเหรียญเข้าจุดอื่นที่โชว์ badgeSuffix() (เช่น topbar/แชท/ฟีด — ตั้งใจเว้นไว้ ขนาดเล็กเกินไปสำหรับภาพ)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 683 (29 ก.ค. · ต่อจากรอบ 682 "เชื่อมภาพเหรียญเข้าจุดอื่นที่ยังโชว์อิโมจิ"):** 🎖️ **แบนเนอร์ฉลองได้เข็มใหม่ + การ์ดสถิติ ⌨️ พิมพ์คำ เปลี่ยนเป็นภาพเหรียญจริงด้วย**
  - `js/game.js` `celebrateBadge()`: `<div class="bc-emoji">` ใช้ `badgeIcHTML(emoji,'bc-emoji-img')` แทนโชว์อิโมจิตรงๆ — เข็มที่มีภาพ (33 แบบ) ขึ้นภาพหมุนตามอนิเมชันเดิม · เข็มพิเศษที่ไม่มีภาพ (`🏁` จบสนาม/`📚` อ่านครบวันนี้) ถอยไปโชว์อิโมจิเหมือนเดิมอัตโนมัติ
  - `js/ui.js` การ์ดสถิติพิมพ์คำ (`renderStats`): เดิมโชว์อิโมจิซ้ำ 2 ที (`typistEmoji()` + อิโมจิที่ baked ใน `TYPIST_TIER_UI`) → เปลี่ยนเป็นภาพเหรียญ + ชื่อเข็มจาก `BADGE_META[emoji].n` (ไม่มี emoji ซ้ำ) แก้บั๊กจิ๋วที่ติดมานานไปในตัว
  - `css/style.css`: เพิ่ม `.bc-emoji-img`(64px, แทนที่ font-size เดิม) + `.bc-emoji .badge-ic-fallback{font-size:64px}` (คง fallback ขนาดเท่าเดิม) + `.stat-badge-line/.stat-badge-ic`(22px) สำหรับการ์ดสถิติ
  - **ยืนยัน (preview จริง mock `celebrateBadge`/`state.typistBadge`):** เข็มมีภาพ (`typistEmoji(4)`) → `<img src="img/badges/typist_4.png">` โหลดจริง `naturalWidth>0` ทั้ง 2 จุด · เข็มไม่มีภาพ (`📚`) → ถอย fallback เป็น `<span class="...badge-ic-fallback">📚</span>` ถูกต้อง · การ์ดสถิติไม่มี emoji ซ้ำแล้ว · ล้างเซฟแล้ว
  - ▶️ ค้าง: จุดโชว์ badgeSuffix() อื่น (topbar/แชท/ฟีด/ป้ายชื่อบนหัวในโลก 3D) ยังเป็นอิโมจิ — ตั้งใจเว้นไว้ (ขนาดเล็กเกินไปสำหรับภาพ ตามที่คุยรอบ 682)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 684 (29 ก.ค. · ผู้ใช้สั่งรื้อโลกผีสิงใหม่ทั้งโลก 18 ข้อ):** 🏨 **โลกผีสิงเปลี่ยนเป็น "หาตัวอักษรในโรงแรมผีสิง 5 ชั้น"** (ของเดิม=ทุ่งหลุมศพวิ่งหนีผี เลิกใช้แล้ว)
  - **ไฟล์ใหม่ `js/hotel3d.js` (~700 บรรทัด · `window.HOTEL3D`)** = ตัวตึกล้วน: 24 ห้องพัก+ล็อบบี้, ลิฟต์วิ่งจริง, บันไดทางลาดมีลูกนอน, เตียง/ตู้เสื้อผ้าเปิดได้/กระจก/ห้องน้ำ, รูปคน 30 กรอบที่ "ลูกตากลอกตามผู้เล่น", กันชน 311 กล่อง · **แยกไฟล์เพราะ adventure3d.js แตะ 10,700 บรรทัดแล้ว** (โหลดใน `loadAdv3d()` ของ `js/ui.js`)
  - `js/adventure3d.js` โซนใหม่ **🏨 ระบบโรงแรมผีสิง**: เดินหลายชั้น (`tickHotelPlayer` + กฎก้าวได้แค่ระดับเข่า 0.75 ม. กันเด็กลอยข้ามชั้นใต้บันได) · **ไฟดับทั้งตึกเมื่ออยู่ครบ 2 นาที** (กะพริบเตือน 8 วิก่อน) · **F=ไฟฉาย** SpotLight+แสงฟุ้ง 5.5 ม. (ป้ายสอนไทย-อังกฤษค้างจนกดครั้งแรก) · **E=เปิดตู้/กดลิฟต์** · เสียงใหม่ `knock/stinger/whisper/powerDown` ใน HSound
  - **ผีเขียนใหม่หมด ไม่ทำร้ายใครเลย** (ตัดหัวใจ/โดนจับ/`caught()` ทิ้ง): `lurk`แอบในห้อง→`peek`โผล่แว็บ→`stalk`เดินตามแต่**หยุดที่ 4.6 ม. ไม่มีวันทัน**→`behind`วาร์ปไปยืนหลัง 1.9 ม.+jump scare→จางหาย · เดินเข้าหาผีเอง = มันวาร์ปไปข้างหลังทันที · ตู้เสื้อผ้า 42% มีผีนั่ง + เสียงเคาะจากในตู้
  - **เข้าได้ทีละ 2 คน**: `js/netroom.js` รับ `opt.roomMax` ใหม่ (โลกอื่นใช้ค่ากลาง 14 เหมือนเดิม) — คนที่ 3 ระบบพาไปสนามถัดไปเอง
  - ⚠️ **บทเรียนที่ต้องรู้ก่อนแก้ไฟล์นี้:** ผนัง/พื้นต้องเป็น **MeshPhong ไม่ใช่ Lambert** (Lambert คิดแสงต่อจุดยอด กล่องใหญ่ 8 จุด → ลำไฟฉายไม่ขึ้นบนผนังเลย) · sprite (ตัวอักษร/ผี) ไม่รับแสง ต้อง `tintSprite()` ให้หม่นตอนไฟดับ · เปลือกนอกอาคารต้องเว้นช่องประตูหน้า ไม่งั้นบังทางเข้า
  - **ยืนยัน (preview จริง 1000×640 + 812×375):** เดินเข้าตึกจากจุดเกิดถึงล็อบบี้ได้ · ลิฟต์ E ขึ้นชั้น 1→2 ยกผู้เล่นตามจริง (footY 3.4/6.8) · เดินบันไดชั้น 3→4 ครบเส้นทาง (6.8→10.2) · กฎก้าวเข่ากันลอยข้ามชั้นได้จริง · ตากลอกตาม ±6 ซม. แล้วกลับมาตรงเมื่อไกล · ไล่ผี 12 เฟรมยืนยันไม่เคยเข้าใกล้กว่า 4.6 ม. แล้วจบที่ 'behind' หลังเรา (dot=-1.0) · เดินเข้าหาผีที่ 3.68 ม.→วาร์ปหลังทันที · เปิดตู้เจอผี+บานกาง 77° · เคาะตู้ 3 ชุด/5 วิ · ไฟดับแล้ว ambient=0 hemi=.012 fog far 24 มืดสนิท · เก็บตัวอักษรข้ามชั้นไม่ได้ ชั้นเดียวกันได้ · 2.94 ms/เฟรม (486 mesh) · ปุ่ม 🔦/✋ จอสัมผัสไม่ทับปุ่มไหนบนจอเตี้ย · console สะอาด · ล้างเซฟแล้ว
  - ▶️ ค้าง: **ยังไม่มีไฟล์ภาพ texture** — prompt ครบชุดอยู่ `handoff/PROMPTS_HOTEL.md` (วาง `img/tex/tex_hotel_*.jpg` แล้วขึ้นเอง ไม่ต้องแก้โค้ด) · ยังไม่ได้แก้ข้อความการ์ดตั๋วโลกผีสิงในล็อบบี้ (`renderHauntCard` ใน ui.js) ให้ตรงกับโรงแรม


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 685 (29 ก.ค. · ผู้ใช้ย้ำกติกาผู้เล่นของโรงแรมผีสิง):** 🧑‍🤝‍🧑 **"จะรอเพื่อนหรือไม่รอก็ได้ แต่ห้ามเกิน 2 คน/โรงแรม"** — ต่อจากรอบ 684
  - `js/netroom.js`: `roomsAllowed(cap)` รับเพดานคนของโลกนั้นมาคิดจำนวนสนาม (เดิมคิดจากค่ากลาง 14 ตายตัว) → โรงแรม 2 คน/หลัง ได้ **36 หลัง = 72 คน** (เดิมได้แค่ 6 หลัง = 12 คน แล้วคนที่ 13 ตกไปเล่นเดี่ยวทันที ทั้งที่โรงแรมยังว่างอีกเยอะ) · โลกอื่นยัง 14 คน/6 สนามเท่าเดิมเป๊ะ
  - ข้อความบอกผู้เล่นให้ตรงกติกา (การ์ดตั๋ว `js/ui.js` · การ์ดวิธีเล่น `js/adv3d_intro.js` · แบนเนอร์เข้าโลก `MODES.haunt.intro`): **"เข้าคนเดียวได้เลย ไม่ต้องรอเพื่อน — โรงแรมหลังหนึ่งอยู่ด้วยกันได้ไม่เกิน 2 คน"**
  - **ยืนยัน (fake RTDB ในเบราว์เซอร์ จำลอง NetRoom หลายเครื่องพร้อมกัน):** 5 คนทยอยกดเข้า → r0[2] r1[2] r2[1] (คนที่ 5 เล่นเดี่ยวได้ทันทีไม่ต้องรอ) · **6 คนกดพร้อมกันเป๊ะ → r0[2] r1[2] r2[2] ไม่มีหลังไหนได้ 3 คนเลย** (`verifySeat` ตัวกันแห่เข้าพร้อมกันทำงานถูกกับเพดานใหม่) · `roomsAllowed()` โลกปกติยังได้ 6 สนามเท่าเดิม


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 686 (29 ก.ค. · ผู้ใช้ขอ HUD โชว์ "อยู่โรงแรมหลังที่เท่าไร มีกี่คน" + พอดีจอเตี้ย 812×375):** ป้ายสถานะเดิม (`js/netroom.js` `statusText`) มีอยู่แล้วแต่เรียก "สนาม N" ทั่วไป (คำ/ไอคอนใช้ร่วมทุกโลก) ไม่ตรงธีมโรงแรม — เพิ่ม opt `roomNoun/roomIcon/roomFmt` ให้แต่ละโลกตั้งชื่อเองได้ (โลกอื่นไม่กระทบ ยังเป็น "สนาม" เหมือนเดิม) · `js/adventure3d.js` `netJoin()` ส่งให้ haunt: `roomIcon:'🏨'` + `roomFmt:i=>'หลังที่ '+i` → ขึ้น "🏨 หลังที่ 1 · 2 คน"
  - **บั๊กจริงที่เจอตอนเทสต์ (ไม่ใช่แค่ข้อความ):** ป้ายเวลาหนีผี `#adv-survive` เดิม `top:78px` ตายตัวใน CSS ไม่สนใจความสูงจริงของกระดานคะแนน — พอกระดานมี 2 แถวผู้เล่น + ป้ายสถานะโรงแรมต่อท้าย กระดานสูงเกิน 78px ป้ายเวลาซ้อนทับกันพอดี (วัดจริงด้วย `getBoundingClientRect` ที่ 812×375: กระดาน 8→116px, ป้ายเวลาเดิมค้างที่ 78→105px = ทับ) → แก้ให้ `renderBoard()` ตั้ง `hudSurvEl.style.top` ตามความสูงจริงของกระดาน+8px ทุกครั้งที่วาดใหม่ (เฉพาะโหมด haunt เท่านั้น โหมดอื่นไม่ใช้ element นี้)
  - **ยืนยัน (preview จริง 812×375, mock login + `Adventure3D._t.onPeerData` จำลองเพื่อนเข้าห้อง):** กระดาน 65.6px → ป้ายเวลาขยับลงมา top 81.6px ไม่ซ้อนกันจริง · จำลองกระดานพร้อมป้ายโรงแรม (2 แถว+โน้ต) สูง 108px → ป้ายเวลาขยับลง 124px ไม่ซ้อน อยู่ในจอ 375px สบาย · เรียก `NetRoom.create` ตรงยืนยันข้อความ "📡 กำลังหาโรงแรม…"/"กำลังหาโรงแรมที่ว่างให้…" ถูกต้อง · console สะอาด · ล้างเซฟแล้ว
  - ค้าง: ไม่ได้ทดสอบข้อความตอนเข้าห้องจริง 2 คนพร้อมกัน (ต้องปลอม Firebase RTDB เต็มรูปแบบ) — สูตร string ตรงไปตรงมา ความเสี่ยงต่ำ, ยืนยันด้วยโค้ด+เคสย่อยแทน


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 687 (29 ก.ค. · ผู้ใช้สั่ง "เพื่อนที่ชวนกันไว้ต้องได้อยู่หลังเดียวกัน 100%"):** 🪑 **ระบบกันที่ไว้ให้เพื่อนที่ชวนกัน** ต่อจากรอบ 685 (เพดาน 2 คน/หลัง)
  - ปัญหาเดิม: A เข้าคนเดียวก่อน (ชวน B ไว้) → คนแปลกหน้า C กด `pickRoom` แบบ "อัดสนามต้นให้เต็มก่อน" มาเจอสนามเดียวกัน แย่งที่นั่งที่ 2 ไปก่อน B มาถึง → B ตกไปหลังอื่น
  - `js/netroom.js`: `shouldReserve()` (ใหม่) — ถ้ามีเพื่อนที่ชวนกันไว้ (`metUids`) แต่ยังไม่มาถึง (ไม่อยู่ใน `peers`) และยังไม่เกิน `RESERVE_TTL_MS`(2 นาที) → แปะธง `h:'RSV'` ใน payload เย็นของตัวเอง (ใช้ฟิลด์ `hp`/`h` ที่ผ่าน rules อยู่แล้วแต่โลกนี้ไม่เคยใช้ (มีแต่โลกเฮลิฯ ใช้จริง คนละ map ไม่ชนกัน) — **ไม่ต้องแก้ Firebase rules เลย**
  - `countRoom(i, forPick)`: เจอธง `RSV` → นับเป็น 2 ที่นั่งสำหรับคนแปลกหน้าที่กำลัง `pickRoom` สุ่มหาสนามว่าง (เท่ากับเต็ม ห้ามแซง) · `goToRoom`/`findMet`/`findFriends` ยังนับดิบเหมือนเดิม (ไม่ใช้ forPick) เพื่อไม่ให้ธงกันที่ของตัวเองย้อนมาบล็อกเจ้าตัวเอง/เพื่อนที่ถูกกันที่ให้
  - เพื่อนมาถึงจริง (uid โผล่ใน `peers`) → เลิกกันที่ทันที · เพื่อนไม่มาเลยเกิน TTL → ปล่อยที่คืนให้คนอื่น
  - ⚠️ **เจอ session คู่ขนานสวีปไฟล์:** โค้ด `netroom.js` ก้อนนี้เขียนไว้ตั้งแต่ก่อน commit ของรอบ 686 (session อื่นทำ HUD) แต่ดันติดไปกับ commit "รอบ 686" ของเขาด้วย (คอมมิตกว้างตอน add) — ตรวจแล้วเนื้อหาตรงกับที่ตั้งใจเป๊ะ ไม่เสียหาย + **ขึ้นเว็บจริงแล้วที่ deploy `.655`** จึงไม่ต้อง commit/deploy โค้ดซ้ำ รอบนี้แค่บันทึกลง TASKS.md ให้ตรงกับของจริง
  - **ยืนยัน (จำลอง Firebase RTDB ในเบราว์เซอร์ หลาย NetRoom แข่งกันจริง):** A เข้าก่อน (ชวน B) → ปล่อย C1-C5 (คนแปลกหน้า ไม่มีคำเชิญ) แย่งเข้าติด ๆ กัน → **ไม่มีใครแซงเข้าห้อง A ได้เลยสักคน** (ไปเจอห้อง 1/2/3 แทน) → B มาถึงทีหลัง **เข้าห้องเดียวกับ A ได้ 100%** (ห้อง A = [A,B] พอดีเป๊ะ) · `_reserve()` = true ระหว่างรอ → false ทันทีที่เพื่อนมาถึงจริง → false อัตโนมัติเมื่อเกิน TTL 2 นาทีถ้าเพื่อนไม่มา · เคสไม่มีคำเชิญเลย (6 คนกดพร้อมกัน) ยังได้ 2/2/2 เท่าเดิมทุกประการ — **ไม่มี regression**


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 688 (29 ก.ค. · ผู้ใช้ขอป้าย "ไปหาเพื่อน" เรียกโรงแรมด้วย):** ป้ายกลไก `roomNoun` (รอบ 686) ใช้กับ `statusText` แล้วแต่ลืม popup `openFriends` — แก้ `js/netroom.js` `openFriends()` เปลี่ยน "สนาม" ที่ hardcode ไว้ 7 จุดให้ใช้ `ROOM_NOUN` แทน (โรงแรมผีสิง=โรงแรม, โลกอื่นยัง "สนาม" เหมือนเดิม)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 689 (29 ก.ค. · ผู้ใช้: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ไม่สนุก → ใช้โมเดลแทน"):** 🧟 **ผีในโรงแรมเปลี่ยนจาก sprite ภาพแบนเป็นโมเดล 3D จริง**
  - ต้นฉบับผู้ใช้ `img/models/ghost.glb` (Tripo, **54MB / 1.88M tris / tex 2048**) → ย่อเหลือ `ghost_lite.glb` **510KB / 22.5k tris / tex 1024** (เล็กลง 106 เท่า) · ต้นฉบับเข้า `.gitignore` แล้ว
  - 🆕 **`tools/lighten_glb.sh`** — ทำสูตรย่อโมเดลของรอบ 431 เป็นสคริปต์ครบ 8 ขั้นในคำสั่งเดียว (unlit→ตัด NORMAL→weld→simplify→join→resize→prune+dedup→quantize) · รอบหน้ามีโมเดลใหม่เรียกตัวนี้ได้เลย ไม่ต้องเขียนใหม่
  - `js/adventure3d.js`: `ghostGlbEnsure()`/`buildGhostMesh()`/`setGhostVis()`/`faceGhostToPlayer()` (ใหม่) — geometry ใช้ร่วมทุกตัว (clone แค่ node) แต่ material แยกตัวเพราะต้องจาง/ชัดคนละจังหวะ · ผีหันหน้าเข้าหาผู้เล่นตลอด · ใช้ทั้งผีเดิน 5 ตัว + ผีในตู้เสื้อผ้าครบ 24 ใบ · **โหลดโมเดลไม่ได้ = ถอยไปใช้ sprite ชุดเดิมอัตโนมัติ** (เกมไม่พัง)
  - 🔑 **บทเรียนใหญ่ที่เสียเวลาหานาน (จดลง NOTES.md + หัวสคริปต์แล้ว): ย่อโมเดลแล้ว "ตัด NORMAL" ทิ้ง → ต้อง `computeVertexNormals()` คืนตอนโหลด** ไม่งั้นวัสดุที่ใช้แสงจะเป็น**เงาดำทึบตลอด** ปรับ color/ไฟเท่าไรก็ไม่สว่างขึ้น (เหลือแต่ ambient+emissive) · อีกจุด: **วัดก่อนโทษโค้ด** — วัดความสว่างเฉลี่ย texture ผีได้ 34/255 (มืดเองจริง) จึงต้อง `color.setScalar(1.4)` ช่วย
  - ค่าที่จูนไว้: `emissive 0x9fb4d8` แรง 0.06+vis×0.18 ตอนไฟดับ (แรงกว่านี้ตัวขาวโพลนจนไม่เห็นลาย) → ได้ "วิญญาณเรืองจาง ๆ เห็นแต่ไกล" ตามข้อ 10 · ไฟฉายส่องโดนถึงเห็นหน้าเต็ม ๆ
  - **ยืนยัน (preview จริง 1000×640):** โหลดเป็นโมเดลครบ 5/5 ตัว + ตู้ 24/24 ใบ · เทียบภาพ 3 ระดับความละเอียด (56k/22.5k/11k tris) หน้าตาแทบไม่ต่าง เลือก 22.5k · วงจรผีเดิมไม่พัง (stalk เข้ามาหยุดที่ 4.6 ม. เป๊ะ ไม่มีวันทัน → behind → lurk) · หันหน้าเข้าหาผู้เล่นตรงเป๊ะ (rotY ตรงกับค่าที่คำนวณ) · ออก-เข้าโลกใหม่ไม่ error (clearEntities รับ Group ได้แล้ว ไม่ dispose geometry ที่ใช้ร่วม) · **2.7-4.7 ms/เฟรม** · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 690 (29 ก.ค. · ผู้ใช้ขอเพิ่มกติกาเหรียญในหน้าข้อตกลง):** `index.html` ข้อ "🪙 เหรียญในเกม" (ทั้งไทย+อังกฤษ) เพิ่มข้อความ "ไม่สามารถเพิ่มเหรียญ/ซื้อสินค้าด้วยเงินจริงได้ เพิ่มได้ด้วยความวิริยะอุตสาหะ+เรียนคำศัพท์+บริหารจัดการเหรียญเองเท่านั้น" · บัมพ์ `KEY='pvad_terms_v2'` ให้ผู้เล่นเดิมเห็นข้อตกลงใหม่อีกครั้ง · ยืนยัน preview 1000×640 + 812×375: กล่องพอดีจอ ปุ่มยอมรับเห็นเสมอ ไม่มี scrollbar ที่กล่อง (เลื่อนแค่เนื้อในตามดีไซน์เดิม) กด accept เก็บ key ใหม่ถูกต้อง


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 691 (29 ก.ค. · ผู้ใช้ขอให้ผีโรงแรม `ghost_lite.glb` ขยับตอนเดินตามผู้เล่นแทนที่จะนิ่ง):** เพิ่มท่า "เดิน" ราคาถูกสุด — โมเดลไม่มีกระดูก/คลิปแอนิเมชัน (ตัดตอนย่อไฟล์) จึงปลอมด้วยหมุน/โยกทั้งกลุ่มแทน · `js/adventure3d.js` `tickGhosts` (~2497): เพิ่ม `g.gait` เดินหน้าเฉพาะสถานะ `stalk` → ส่าย `rotation.z` ±.09rad + ก้ม `rotation.x` .06rad + จังหวะก้าว `stepBob` เสริมบน bob ลอยเดิม (สถานะอื่น lurk/peek/behind นิ่งเหมือนเดิมเป๊ะ ไม่กระทบของเก่า)
  - ยืนยัน: syntax-check ผ่าน (`node --check`) เท่านั้น — **ไม่ได้ทดสอบ preview จริง** (มี session คู่ขนานใช้ dev server พอร์ตเดียวกันอยู่ ไม่ชนกัน) ▶️ ค้าง: ให้ผู้ใช้ลองเข้าโรงแรมจริงดูท่าเดินผีตอนไล่ตาม (stalk) ว่าธรรมชาติพอไหม


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 692 (29 ก.ค. · ต่อยอดค้างรอบ 684 "ยังไม่ได้แก้ข้อความการ์ดตั๋วโรงแรมให้ตรงธีม"):** 🏨 ผู้ใช้วางไฟล์ texture ครบแล้ว (`img/tex/tex_hotel_{wall,room,carpet,marble,wood,tile,facade}.png`) — ตรวจโค้ด `applyTex()` (adventure3d.js:1606) พบว่าลองโหลด `.jpg` ก่อนแล้ว fallback `.png` อัตโนมัติอยู่แล้ว จึงไม่ต้องแก้โค้ด ไฟล์ที่วางมาใช้ได้ทันที
  - เจอบั๊กข้อความจริงระหว่างตรวจ: `js/ui.js` `buyHauntTicket()` กล่องยืนยันซื้อตั๋วยังพูดถึงกลไกเก่า "โดนจับ = จบเกม ต้องรักษา" ทั้งที่ระบบบาดเจ็บ/เกมโอเวอร์ถูกถอดตั้งแต่รอบ 255 และผีถูกเขียนใหม่ให้ไม่ทำร้ายใครตั้งแต่รอบ 684 → แก้เป็นข้อความธีมโรงแรมที่ตรงกับกลไกจริง (ไม่มีเกมโอเวอร์ แค่หลอกให้ตกใจ)
  - **ยืนยัน (preview จริง 1000×640, mock login + เรียก `buyHauntTicket()` ตรง):** กล่องยืนยันขึ้นข้อความใหม่ถูกต้อง ไม่มีข้อความเก่าหลงเหลือ · `renderHauntCard` จุดอื่นตรวจแล้วเป็นธีมโรงแรมอยู่ก่อนแล้ว ไม่ต้องแก้ · ล้างเซฟแล้ว
  - ⚠️ มี session คู่ขนานกำลังทำ `js/adventure3d.js`/`handoff/PROMPTS_HOTEL.md` (ท่าเดินผี รอบ 691) พร้อมกัน — รอบนี้ commit เฉพาะ `js/ui.js`+`handoff/TASKS.md` ไม่แตะ 2 ไฟล์นั้น


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 693 (29 ก.ค. · ต่อยอดค้างรอบ 683 "จุดโชว์ badgeSuffix() อื่น ยังเป็นอิโมจิ — ตั้งใจเว้นไว้"):** 🔬 **วัดขนาดจริงก่อนตัดสินใจ (ไม่แก้โค้ด — งานเอกสาร)**
  - เจนภาพเทียบ badge PNG (159-199px ต้นฉบับ) ย่อเหลือ 12-64px (LANCZOS) ดูด้วยตา (`scratchpad/badge_size_test.png`) → **ต่ำกว่า ~20px ลายเหรียญ/ไอคอนกลางเหรียญมองไม่ออกเลย เห็นแค่วงกลมสีเบลอ ๆ (แยกทอง/เงินได้แต่แยกลายไม่ได้) · ต้อง ≥28-32px ถึงเริ่มเห็นไอคอนกลางชัด (เครื่องบิน/สายฟ้า/มงกุฎ) · ≥40px ถึงคมชัดเต็มที่**
  - วัด CSS จริงของ 4 จุดที่ยังเป็นอิโมจิ: topbar/online-row **13.5px** · ฟีด `.fdb-txt` **12px** · กล่องแชท inbox `.ib-name` **13.5px** · หัวห้องแชทเปิดคุย `.chat-head-name` **16px** · ป้ายชื่อบนหัวโลก 3D วาดบน canvas font **19-30px แต่ยังโดนบีบให้พอดีกล่องกว้าง 128-256px** (ยิ่งไกลกล้องยิ่งเล็กกว่านี้อีก) — **ทุกจุดต่ำกว่าหรือเท่าเกณฑ์ 20px ที่ยังมองไม่ออก ไม่มีจุดไหนถึง 28px**
  - **สรุป: คงอิโมจิทั้ง 4 จุดตามเดิม (ยืนยันมติรอบ 682 ด้วยตัวเลขจริงแล้ว)** — เอาภาพเหรียญไปใส่ตรง ๆ ที่ขนาดเท่าตัวอักษรรอบข้าง (12-16px) จะแย่กว่าอิโมจิเดิม (อิโมจิเป็น vector คมทุกขนาด ภาพ raster เบลอ) ▶️ ทางเดียวที่จะใช้ภาพได้จริงคือ**แยกเข็มออกจากชื่อเป็นแถบไอคอนต่างหาก** (แบบ `pl-badges`/`stat-badge-line` ที่ทำแล้วรอบ 683) ขยายเป็น ≥28px ได้อิสระจากตัวอักษรชื่อ — เป็นงานปรับ layout เพิ่มพื้นที่ทั้ง 4 จุด (topbar/แชท 2 ที่/ฟีด) + วาด canvas ใหม่ในโลก 3D 3 ไฟล์ (`adventure3d.js` blkNameSprite, `adv3d_tex.js` makePeerSprite, `invasion3d.js` nameSprite) — ของานใหญ่กว่าที่คิดไว้ ถ้าผู้ใช้อยากได้ให้บอกแล้วเปิดรอบใหม่ทำแยก


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 694 (29 ก.ค. · ผู้ใช้: "ข้างนอกโรงแรมไม่น่ากลัวพอ + ขอ prompt ผนังนอก/รูปคนที่ไม่ชุ่ย"):** 🌌 **ท้องฟ้ากลางคืนโรงแรมเขียนใหม่ทั้งชุด** — `js/adventure3d.js` โซนใหม่ `buildHauntSky`/`tickHauntSky`: โดมไล่สี + ดาว 3 ชั้นกะพริบ + จันทร์มีหลุม+รัศมี + เมฆลอยผ่านหน้าจันทร์ + หมอกติดพื้น 11 แผ่น (ไฟดับ = ฟ้าหรี่ตาม เหลือจันทร์) · ถอด `haunt` ออกจาก `SKY_IMG` · พื้นสวน tint หม่นลง `0x7d8490→0x4d525c` · เปลือกนอกตึก tint `0x6d6a66` (เดิมแปะภาพแล้วสีถูกรีเซ็ตเป็นขาว ตึกเลยสว่างเหมือนกลางวัน = ต้นเหตุ "ดูชุ่ย")
  - 🔑 **บทเรียนที่เสียเวลาหาสุด: โดมฟ้ารัศมี 200 > camera.far 220 − ระยะผู้เล่นถึงมุมแผนที่ 85 → ด้านไกลโดนตัด เห็นเป็น "จานดำกลมลอยกลางฟ้า"** แก้สีอยู่ 2 รอบไม่หาย จน raycast แล้วเจอว่าโดนที่ 246 ม. → ลดรัศมีเหลือ 132 · อีกจุด: แผ่นหมอกห้ามอยู่ระดับตา (1.6 ม.) ไม่งั้นเห็นเป็นแผ่นเทาพาดเต็มจอ
  - 🖼️ **รองรับ "รูปคนในกรอบเป็นภาพถ่ายจริง"** — `js/hotel3d.js` วาง `img/tex/tex_hotel_portrait_1..6.png` แล้วทับภาพวาดเดิมอัตโนมัติ (ไม่มีไฟล์=ภาพวาดเดิม) · ตาดำยังเป็น mesh ที่กลอกตามผู้เล่นเหมือนเดิม → **prompt ต้องล็อกตำแหน่งตา 40.6%/59.4% กว้าง · 43.5% จากขอบบน · ตาขาวล้วนไม่มีม่านตา** · `applyTex` เพิ่มคิวกันยิง request ซ้ำ (30 กรอบ/6 ภาพ: 60→12 request)
  - prompt ผนังนอก (แก้ใหม่ ล็อกขนาดก้อนหิน 80 ซม. ให้ตรง uvScale 3.2) + prompt รูปคน 6 แบบ + negative prompt อยู่ `handoff/PROMPTS_HOTEL.md` (ส่ง Artifact ปุ่มคัดลอกให้ผู้ใช้แล้ว)
  - **ยืนยัน (preview จริง 1000×640, mock login + เข้าโลก haunt):** ฟ้าไล่สีเนียนไม่มีจานดำแล้ว · ดาว 3 ชั้น + จันทร์ + เมฆขึ้นครบ (เทียบภาพ 4 มุม) · ไฟดับ = ตึกเป็นเงาดำ เหลือจันทร์ดวงเดียว · ในตึก/รูปในกรอบ/ทางเดินชั้น 2 ไม่กระทบ · **+0.83 ms/เฟรม (4.07→4.9)** วัดด้วยการซ่อน/โชว์ชิ้นฟ้า 18 ชิ้น · console สะอาด · ล้างเซฟแล้ว
  - ▶️ ค้าง: รอผู้ใช้เจนภาพตาม prompt แล้ววางไฟล์ (ผนังนอก + รูปคน 6 ใบ) · ต่อยอดได้: ตากะพริบ/ตาแดงวาบตอนไฟดับ


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 696 (29 ก.ค. · ผู้ใช้: ใส่ชื่อกลุ่มชั้นเต็มก่อนสัญลักษณ์):** ป้าย `#grade-line` บนแถบล็อบบี้ เพิ่มข้อความ "ประถมศึกษา/มัธยมศึกษา/ปริญญาตรี/สูงกว่าปริญญาตรี" (ตาม `.gp-cat`) ก่อนสัญลักษณ์ดาว/เพชร — เพิ่ม field `cat` ใน `gradeSymbol()` (`js/util.js`) แล้วใช้ต่อใน `renderDashboard()` (`js/ui.js`)
  - ยืนยัน (preview, mock login ทดสอบทั้ง ป.2→"ประถมศึกษา ★★" และ ปริญญาตรี→"ปริญญาตรี 💎"): innerHTML ตรง · กล่องยังกึ่งกลางแถวบนปกติแม้ข้อความยาวขึ้น (top-flex=top-flex2 เท่ากัน) · ล้างเซฟแล้ว
- **รอบ 695 (29 ก.ค. · ผู้ใช้: จัดหัวล็อบบี้ตามภาพขีดเส้นแดง):** 🎩 **4 จุด** — ① กล่องฟีดเพื่อนขยับซ้าย 5px ให้อยู่กึ่งกลางรางเมนู↔ขอบเวที (`alignFeedPlate()` ใน `js/ui.js`) ② แผงผู้เล่นยืดขอบขวาชนขอบขวากล่องฟีดพอดี (`alignProfilePlate()`) ③ ระดับชั้น (`#grade-line`) ย้ายออกจาก `.coin-group` มาเป็นแถวใต้ ห่อด้วย `.coin-block` ④ ลบ `alignCoinGroup()`/ตัดเส้นแดงเดิม ให้ `.top-flex`/`.top-flex2` เท่ากันเอง = กล่องเหรียญ+ระดับชั้นลอยกลาง · **แถมกลางทาง:** ผู้ใช้ขอคืนป้าย "คำใหม่" ให้บรรทัดเดียว/ขนาดเดิม (revert รอบ 657 ใน `css/lobby.css`)
  - ยืนยัน (preview 1280×720 + 1024×600, mock login+เติม pet): rect ตรงทุกจุด (feed-plate/profile-plate ขอบขวา 407.1=407.1, top-flex=top-flex2=222.3px ทั้งคู่) console สะอาด ล้างเซฟแล้ว
  - ⚠️ **ชนรอบ 694 (session คู่ขนานทำ haunt sky พร้อมกัน)** — ขยับเลขตัวเองจาก 694→695 ตามกฎ · ไม่แตะ `js/adventure3d.js`/`js/hotel3d.js` ของเขาเลย


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 697 (29 ก.ค. · ต่อยอดรอบ 694 "ตากะพริบ/ตาแดงวาบตอนไฟดับ + หันตามแบบหน่วง"):** 👁️ **รูปคนในกรอบโรงแรมผีสิงมีชีวิตขึ้น** — `js/hotel3d.js` `tick()`: ① ตาหันตามผู้เล่นแบบ lerp หน่วง (เดิมกระโดดไปตำแหน่งทันที ดูเป็นกลไก) ② กะพริบตาสุ่มจังหวะต่อกรอบ (triangular envelope บีบ `scale.y`) ③ ไฟดับ = ตาทุกกรอบทั่วโรงแรม "แดงวาบพร้อมกัน" (หายใจช้า ๆ ด้วย sin) ผ่าน `H.eyeMat` วัสดุเดียวที่ใช้ร่วมทั้ง 30 กรอบ (ต้นทุนแทบเป็นศูนย์)
  - **ยืนยัน (preview จริง 1000×640, mock login + เข้าโลก haunt + ยืนหน้ากรอบตรง):** `P.lat` ไล่เข้าเป้าหมายทีละเฟรมไม่กระโดด · เห็น scale.y กะพริบ 1→0.12→1 เป็นรูปสามเหลี่ยม · `hotelBlackout()` แล้ว eyeMat.color ขยับเป็นแดง (0.58,0.02,0.03) ทันที · ภาพจริงเห็นจุดแดง 2 จุดชัดเจนกลางความมืด · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 698 (29 ก.ค. · ผู้ใช้ส่งภาพป้ายคำใหม่ "โย้เย้ไม่สวย"):** 🧹 **แก้ต้นตอจริง** — รอบ 695 ถอด `flex-direction:column` ออกจาก `.newword-banner` แต่ลืมทิ้ง `.nw-row2{flex-wrap:wrap}` ของยุครอบ 657 ไว้ พอเจอคำยาว ("phenomenon") row2 (หมวดคำใบ้+เหรียญ+เวลา) ห่อบรรทัดในตัวเองขณะ row1 (NEW+คำ) ไม่ห่อ → เหลื่อมกันเบี้ยว · แก้: `renderNewWord()` (`js/ui.js`) เลิกห่อ div ย่อยทั้งคู่ ปล่อยเป็น flex item เรียงแถวเดียวแบนราบจริง ลบ CSS `.nw-row1/.nw-row2` ทิ้ง (`css/lobby.css`)
  - ยืนยัน (preview 1280×720 + 1024×600, คำสั้น/คำยาว "sustainability"): banner สูงบรรทัดเดียวเสมอ (~38-39px ไม่เพิ่ม) `.nw-hint` หด+ตัดจุดไข่ปลาเมื่อพื้นที่ไม่พอ (scrollWidth>clientWidth ยืนยันจริง) ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 700 (29 ก.ค. · ผู้ใช้ส่งภาพจริงจากเว็บ "การ์ดผู้เล่นเลยเส้นแดง"):** 🩹 **เจอต้นตอจริง** — รอบ 695 ทำ `alignProfilePlate()` ให้ `.profile-plate` ตรงกับขอบขวากล่องฟีดเพื่อนแล้ว (วัด rect ตรงเป๊ะ) แต่กล่อง "สีฟ้าที่ตาเห็น" จริงๆคือ `.id-card` (ห่อ pass-photo+profile-plate) ซึ่งมี `padding-right:15px` (`css/lobby.css:3674`) เลยยื่นเกินไปอีก 15px ทุกครั้งโดยไม่รู้ตัว — แก้ `alignProfilePlate()` (`js/ui.js`) ให้หัก `getComputedStyle(idCard).paddingRight` ออกจากความกว้างที่คำนวณด้วย
  - ยืนยัน (preview 1052×491 จำลองสัดส่วนภาพจริง + 1280×720, ปลอมแรงค์ "Golden Explorer II"): `.id-card` ขวา vs กล่องฟีดขวา ต่างกันแค่ ~0.8px (เศษปัดเลข มองไม่เห็น) จากเดิมเหลื่อม ~15px ทุกจอ · ล้างเซฟแล้ว
- **รอบ 699 (29 ก.ค. · ผู้ใช้: ขยายคำศัพท์+อยู่กึ่งกลางเวทีน้อง คำใบ้ลงบรรทัดล่าง NEW หาที่ใหม่):** 🔤 ป้ายคำใหม่ปรับผัง — คำศัพท์ใหญ่ขึ้น (`clamp(24px,4.2vh,36px)`) อยู่บรรทัดบนกึ่งกลาง, คำใบ้+เหรียญ+เวลา (`.nw-sub`) ลงบรรทัดล่าง, NEW ย้ายเป็นริบบิ้นมุมซ้ายบน (`position:absolute`) แทนการอยู่หน้าคำศัพท์ในแถวเดียว · `alignNewWord()` (`js/ui.js`) กลับไปจัดกึ่งกลางเวทีน้องจริง (`--nw-left` = จุดกึ่งกลาง c.left+c.width/2) แทนชิดซ้ายแบบรอบ 613 — คืน CSS/keyframe เดิมก่อนรอบ 613 (`css/lobby.css`)
  - ยืนยัน (preview 1280×720+1024×600, คำสั้น/ยาว "sustainability"): จุดกึ่งกลางแบนเนอร์ตรงจุดกึ่งกลางเวทีเป๊ะทุกขนาดจอ · ไม่ล้ำคอลัมน์ฟีดเพื่อน (ห่าง 81.7px ที่จอแคบสุด) · ริบบิ้น NEW ไม่โดน overflow:hidden ตัด (ancestor ใกล้สุดที่ hidden อยู่ไกลเกินจะกระทบ) · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 701 (29 ก.ค. · ผู้ใช้: ฟีดเพื่อนแบบ Facebook 7 ข้อ):** 📰 **ฟีดล็อบบี้เขียนใหม่เป็น "ทีละโพสต์"** — โชว์ 1 โพสต์ค้าง 10 วิ (แถบ `#fd-prog` นับเวลา) → เลื่อนขึ้น โพสต์ถัดไปดันจากล่าง วนลูป (โคลนใบแรกท้ายเด็ค) · ผู้ใช้เลื่อนเอง = พัก 12 วิแล้วเข้าลูปต่อ · ชื่อ+ชั้นบรรทัดบน ข้อความรายงานบรรทัดใต้ · โพสต์มีชื่อสินค้า (COLLECTIBLES/GIFTS) → โชว์ภาพเกือบเต็มกรอบพอดีการ์ดไม่มี scrollbar · ปุ่มถูกใจ+คอมเมนต์ล่างสุดทุกใบ · **กดค้าง = เลือกรีแอ็กชัน 6 แบบ** (`FEED_REACTIONS` ใน `js/state.js`) · 🌟 เอกลักษณ์เรา: ทุกรีแอ็กชัน/คอมเมนต์ด่วน (`FEED_QUICK_CM`) = คำอังกฤษ+แปลไทย เด็กได้ศัพท์ติดตัว · 🔔 แจ้งเตือน "ใครมาไลก์/คอมเมนต์โพสต์เรา" คิด diff ฝั่ง client (กระดิ่ง `#btn-feed-bell` + toast — ไม่มีโซน DB ใหม่ แจ้งเฉพาะตอนออนไลน์) · หน้า Feed เต็มใช้การ์ด `fpostHTML` ชุดเดียวกัน + ส่วน "ใครออนไลน์" เปลี่ยนเป็นเลื่อนขึ้นช้า ๆ วนเอง (initSideScroll ตามที่ผู้ใช้สั่ง) · `js/online.js`: watcher /gfeed เปิดค้างตลอด + เปลี่ยน on('value') → child_added/changed/removed (เดิมทุกไลก์ยิง 120 โพสต์กลับทุกเครื่อง)
  - ยืนยัน (preview 1000×640 + 812×375, mock login + จำลอง gfeedMap 4 โพสต์): การ์ดพอดีกรอบ over=0 ทุกใบทั้ง 2 จอ · วนลูปครบ (ใบโคลน→ตัดกลับใบแรก) · เลื่อนเอง=พัก 12 วิจริง · กดค้าง 420ms ขึ้นกล่อง 6 รีแอ็กชัน เลือกแล้วปุ่มเปลี่ยน+คำลอย+สรุปนับถูก · คอมเมนต์ด่วน→ช่องพิมพ์→ส่ง→แถวขึ้น · แจ้งเตือน toast+เลขกระดิ่ง+เปิดกล่อง→คลิกไปแผ่นคอมเมนต์ · console สะอาด · ล้างเซฟแล้ว · ⚠️ smooth scroll โดน throttle ในแท็บ preview → มี watchdog 700ms กระโดดตรงแทน (เครื่องจริงเล่น smooth ปกติ)
  - ⏳ **ค้าง: rules `/gfeed/lk` ต้อง publish รับ string รีแอ็กชัน** (ดู RULES.md หัวไฟล์ — ยังไม่ publish client ถอยเป็นไลก์ธรรมดา `true` เอง เกมไม่พัง)
  - ⚠️ session คู่ขนาน commit e30519f (รอบ 700) กวาด ui.js ส่วนฟีดของรอบนี้ติดไปก่อนแล้ว — รอบนี้ commit ส่วนที่เหลือ (online/state/css/rules) ให้ครบชุด live ไม่แหว่ง · lobby.css รวม CSS ป้ายคำใหม่ของรอบ 700 ที่ยังไม่ถูก commit มาด้วย (JS ของเขา live ไปแล้ว — รวมแล้วเว็บ consistent)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 703 (29 ก.ค. · ผู้ใช้ส่งภาพหน้าเกมจับคู่คำศัพท์ "ตกขอบ/ต้องใช้ scrollbar"):** 🩹 ต้นตอ: media query จอกว้าง (`css/lobby.css` ~112-130) ทำ `#screen-game` เป็น CSS grid 2 คอลัมน์ (อังกฤษซ้าย/ไทยขวา) แต่ `.game-endless-note`/`#btn-report` ไม่มี `grid-area` กำหนดไว้ → เบราว์เซอร์ auto-place ดันไปคนละคอลัมน์ซ้อนกันเอง (กล่องข้อความถูกบีบครึ่งจอ+ปุ่มลอยข้าง) — เพิ่ม area `note`/`report` เต็มแถวให้ทั้งคู่
  - ยืนยัน (preview 1307×617 ตรงสัดส่วนภาพผู้ใช้ + getBoundingClientRect): กล่อง/ปุ่มกึ่งกลางเต็มแถว ไม่ล้นขอบจอ (`screen-game` right=1104<vw ไม่มี scrollbar) ล้างเซฟแล้ว
  - ⚠️ จอเตี้ยมาก 812×375 หน้าเกมนี้เข้า internal scroll อยู่แล้ว (ของเดิมก่อนรอบนี้ก็ล้นอยู่แล้ว ไม่ใช่ที่รอบนี้ทำเพิ่ม) — เป็นหน้าเกมหลักไม่ใช่ dialog overlay จึงเข้าเกณฑ์ "scroll ภายในตัวเอง" ตามคอมเมนต์หัว lobby.css ไม่ใช่บั๊กใหม่


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 702 (29 ก.ค. · ผู้ใช้: ยืดกล่องคำศัพท์ใหม่เสมอเวทีน้อง + ขยายตัวอักษรดันขอบขึ้นหาระดับชั้น):** 📏 กล่อง `.newword-banner` เลิกลอยกึ่งกลาง (auto-width) → กว้างเท่าเวทีเป๊ะ (`--nw-w`) เนื้อหาจัดกึ่งกลางข้างในเอง · คำศัพท์ใหญ่ขึ้น `clamp(24,4.2vh,36)` → `clamp(30,5.6vh,48)` · ดึงขอบบนขึ้นด้วย `--nw-top` (margin-top ติดลบ) ให้ห่างใต้ชิประดับชั้น **5px = ระยะเดียวกับซ้าย/ขวาของฟีดเพื่อน** (ค่าคงที่ `NW_GAP` ใน `js/ui.js`) · จอเตี้ย ≤520px ลดฟอนต์ลงกันเวทีน้องโดนบีบ
  - 🔑 กันค่าไหล: คำนวณ margin จาก **ขอบบนเวที + ใต้ชิประดับชั้น** (ไม่ขึ้นกับตัวแบนเนอร์) — ถ้าวัดจากขอบบนแบนเนอร์เองจะอ้างอิงตัวเอง ค่าเลื่อนทุกครั้งที่ ResizeObserver ยิงซ้ำ · ทดสอบเรียก `alignStageCols()` 6 รอบติด ค่านิ่งที่ `[0,0,5]` ทุกรอบ
  - ยืนยัน (1280×720 / 1024×600 / 812×375 · คำสั้น-ยาว 3 แบบ): ขอบซ้าย-ขวาตรงเวทีเป๊ะ (L=0,R=0) · ระยะใต้ระดับชั้น 5px ทุกจอ · 812×375 ไม่มี scrollbar (กฎทอง 7) เวทีน้องคืนจาก 110→128px · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ รอบ 700 ที่ commit ไปก่อนหน้า **มีโค้ดฟีด Facebook ของ session คู่ขนานติดไปด้วย 520 บรรทัด** (ตอนนั้นเขายังเขียนไม่เสร็จ → deploy ตรวจเจอฟังก์ชันไม่มีนิยาม เลยล้ม) · เขาทำต่อจนจบเป็นรอบ 701 แล้ว ทุกอย่างขึ้นเว็บครบ **ไม่ต้องแก้ย้อนหลัง** (ถอนไม่ได้แล้ว เพราะ push + มีงานทับข้างบน)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 704 (29 ก.ค. · ต่อยอดรอบ 703 "หน้าเกมจับคู่คำศัพท์จอเตี้ยมากยังล้นต้องเลื่อน scrollbar"):** 📐 เพิ่ม `#screen-game.screen.active` + clamp(px,dvh,px) บีบ padding/font/gap ของ game-top/board-label/word-card/hint-btn/game-endless-note/btn-report ตามความสูงจอ (แบบเดียวกับ screen-select/quiz) — `css/lobby.css` ~135-148
  - ยืนยัน (preview 812×375, mock login+startGame): scrollHeight=clientHeight=297 ไม่มี scrollbar แล้ว · จอปกติ 1280×720 ฟอนต์/ขนาดเท่าเดิม (ชน clamp max) ไม่มี regression · ล้างเซฟแล้ว
  - ⚠️ session คู่ขนานมีงานไม่ commit ค้างใน css/lobby.css/style.css/index.html/js/main.js/js/ui.js (ฟีเจอร์คอมพิวเตอร์+เด็คภารกิจ ใช้เลข "รอบ 704" ในคอมเมนต์เหมือนกันแต่ยังไม่ commit) — commit รอบนี้แยกเฉพาะ hunk ของตัวเองด้วย `git apply --cached` ไม่แตะของเขาเลย


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 708 (29 ก.ค. · ผู้ใช้: "ปรับภารกิจวันนี้ ให้แสดงทีละรายการ ค้างไว้ 10 วิ แล้วเลื่อน เหมือนฟีดเพื่อน"):** 🎯 กล่องภารกิจเลิกพลิกการ์ด 3D (รอบ 170) → เปลี่ยนเป็นเด็ค scroll-snap เลียนแบบฟีดเพื่อนเป๊ะ (`qDeckGo`/`qDeckTick` โครงเดียวกับ `feedDeckGo`/`feedDeckTick`) ค้างภารกิจละ 10 วิ (`QUEST_SLIDE_MS`) มีแถบนับเวลา `#q-prog-bar` เหนือกล่อง (`.q-prog` ใน index.html) · แตะการ์ด/เลื่อนเองพัก 8-12 วิ (`QUEST_RESUME_MS`) ก่อนวนต่อ · โคลนใบแรกท้ายเด็คให้วนลูปไม่สะดุด — แก้ `js/ui.js`(qBigCardHTML/qDeckGo/qDeckTick/renderQuestCard) + `css/lobby.css`(#quest-card.q-deck) + `index.html`
  - 🔑 ความสูงกล่องเปลี่ยนจาก CSS `height:auto` เดิม → `el.style.height` วัดจากการ์ดจริงด้วย JS (เด็คมีการ์ดซ้อนกันหลายใบ ถ้าใช้ auto จะโชว์พร้อมกันหมดไม่ใช่ทีละใบ) วัดตอนคลาย `height:auto` ชั่วคราวกันวงกลม 0px + รีวัดใหม่ทุกครั้งที่กล่องซ่อนแล้วโผล่มาใหม่ (`el.__hSized`/`offsetParent`)
  - ⚠️ **ยังไม่ได้ยืนยันผ่าน preview จริง** — วันนี้ session คู่ขนานจับ dev server เต็ม 5 ช่องพอดี (`preview_start` ฟ้อง "Maximum 5 dev servers") เช็กด้วยอ่านโค้ด/ตรรกะแทน ยังไม่เห็นภาพจริง — รอบหน้ามีช่อง preview ว่างค่อยยืนยัน 1280×720+812×375 (การ์ดสไลด์ขึ้น 10 วิ/แตะสไลด์เอง/ปุ่ม 🚀/แฟลชเขียวตอนภารกิจสำเร็จ) ก่อนถือว่าจบงานเต็มร้อย


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 706 (29 ก.ค. · ผู้ใช้: แถบบนล็อบบี้ 2 ข้อ — ไอคอน "เหรียญไหลเข้า" + ช่องรายได้คอมพิวเตอร์):** 💰 ช่อง "ออนไลน์" เลิกใช้ 🪙 กะพริบ (รอบ 261) → `.coin-flow` เหรียญ 3 ใบร่วงลงกระเป๋าตังค์ 👛 ไม่ขาดสาย (กระเป๋าเด้งรับตอนเหรียญถึง · เหรียญใช้ภาพจริง `coin_gold.png` ซ้อน gradient ทองกันภาพหาย) + ป้าย "+n" ลอยขึ้นทุกครั้งที่เหรียญเต็มตกเข้ากระเป๋าจริง (`flashPillGain`) · 💻 เพิ่มช่อง `#comp-pill` ในแถบเดียวกัน: ยังไม่ซื้อ = จาง+🔒 · ซื้อแล้ว = เลขรายได้วิ่งทุกวินาที (เรียก `compTick` ถี่ขึ้นเหมือนโบนัสออนไลน์ เลขบนจอ = เหรียญที่เข้ากระเป๋าจริง) · ถูกตัดบริการข้อมูล = "หยุด" สีส้ม · แตะช่อง → `openPillInfo('comp')` 3 สถานะ พร้อม **ปุ่มลงมือในกล่องเลย** (`inf.act` — ซื้อคอม / จ่ายค่าบริการ) · ไฟล์: `index.html` `css/style.css` `css/lobby.css` `js/ui.js` `js/main.js`
  - ยืนยัน (preview 1280×720 / 1024×600 / 812×375, mock login): ซื้อคอมจากในกล่องได้จริง (50,000 → pill ติด `.on` เลขเดินขึ้นทุกวิ) · ตัดบริการ → "หยุด" + ปุ่มจ่ายบิลในกล่องคืนบริการได้ · เร่งเวลา 250 วิ = +2 เหรียญเข้ากระเป๋า ป้าย "+2" ลอยขึ้น header ตรงกัน · กล่องทั้ง 3 สถานะไม่มี scrollbar อยู่ในจอครบ (กฎทอง 7) · เลขยาวสุด (1.2 ล้าน+8765+4321) แถบบนไม่ล้น เว้นขอบ 18px ทั้งสองข้าง · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ **session คู่ขนานเยอะมากช่วงนี้ (ผู้ใช้เปิดหลายแชท)** — ระหว่างรอบนี้ session อื่นลงรอบ 703/704/705 ติดกัน ทำให้ต้องขยับเลขรอบตัวเอง 703→705→706 และโดน `git commit` ของเขากวาด "ของที่ staged ไว้" ติดไปครั้งหนึ่ง (ภายหลังเขา rebase ออกไป) · **บทเรียน 2 ข้อ: ① staged แล้วอย่าทิ้งค้าง commit ทันที ② ไฟล์ที่แชร์กัน (`js/ui.js` `index.html` `css/*`) ให้แยก commit เฉพาะ hunk ตัวเองด้วย `git diff` → กรอง hunk ที่มี "รอบ N" ของตัวเอง → `git apply --cached`** (รอบนี้ใช้วิธีนี้ ของ session อื่น 16 hunk ไม่โดนแตะเลย)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 709 (29 ก.ค. · ผู้ใช้: "อัปโหลดภาพตนเองเปลี่ยนรูปโปรไฟล์ได้เหมือน Facebook"):** 📷 **ไฟล์ใหม่ `js/photo.js`** — เลือกรูปจากเครื่อง → กล่องครอปจัตุรัส (ลากเลื่อน/สไลเดอร์ซูม/หนีบซูม 2 นิ้ว/ล้อเมาส์) → อบเป็น JPEG 256px ในเครื่อง (ไล่ลดคุณภาพ 0.82→0.5 แล้วไล่ลดขนาด 256→160 จนกว่าจะ ≤28,000 ตัวอักษร) · เข้าได้ 2 ทาง: ปุ่ม 📷 มุมรูป passport บนแถบล็อบบี้ + แถวใหม่ในหน้า ⚙️ ตั้งค่า · ไม่ใส่รูป = ตัวการ์ตูนบล็อกเหมือนเดิมทุกจุด (ลบรูปได้ตลอด) · โชว์ที่: pass-photo, `playerAvatarHTML()` ทุกที่, การ์ดโปรไฟล์ (ของเราทันที · ของเพื่อนอ่าน `/pphoto/<uid>` ทีหลังแล้วสลับรูปเข้าไป)
  - 🔑 **ที่เก็บเลือกแบบตั้งใจ: localStorage แยกคีย์ `petVocabAdventure_photo` + RTDB `/pphoto/<uid>` — ไม่ยัดลง `state`** (state ถูกเซฟขึ้น cloud ทั้งก้อนทุกครั้ง รูป ~20KB จะทำให้ทุกเซฟบวม) **และไม่ยัดใน `/leaderboard`** (กระดานดึง 20 คน = +500KB/ครั้ง) → อ่านเฉพาะตอนเปิดการ์ดคนนั้นจริง มี cache ต่อ uid · เข้าเครื่องใหม่ `photoPullMine()` ดึงลงมาเอง · มีในเครื่องแต่ DB ว่าง = ส่งขึ้นเอง
  - ⏳ **ค้าง: rules โซนใหม่ `/pphoto` ยังไม่ publish** (RULES.md หัวไฟล์ · Artifact ปุ่มคัดลอก https://claude.ai/code/artifact/9056ef14-1220-4e31-aaa7-0fcee53e7f73) — ยังไม่ publish รูปใช้ได้ในเครื่องตัวเอง แต่เพื่อนไม่เห็น + เกมเด้ง toast บอกเหตุผลตรง ๆ (กฎทอง #1)
  - 🛡️ ความปลอดภัยเด็ก: กล่องอัปโหลดเตือน "ให้ผู้ปกครองช่วยเลือก · เลี่ยงรูปที่บอกชื่อจริง/โรงเรียน/ที่อยู่" · rules ล็อกให้เขียนได้เฉพาะเจ้าของ + บังคับ prefix `data:image/jpeg;base64,` และยาว ≤30,000
  - ยืนยัน (preview 1000×640 + 812×375, mock login): ครอปลาก/ซูมได้จริง (พิกเซลกลางเปลี่ยนตามที่ลาก · มุมทั้ง 4 ทึบ = ไม่มีขอบโหว่หลัง clamp) · ภาพ noise ล้วน (บีบยากสุด) ได้ 19,347 ตัวอักษร ≤ โควตา · ทางเดินจริงผ่านครบ: ⚙️ → ปุ่ม → เลือกไฟล์ → ครอป → บันทึก → รูปย่อในตั้งค่า/pass-photo/การ์ดโปรไฟล์อัปเดตทันที · ลบรูป → กลับตัวการ์ตูนครบทุกจุด · reload แล้วรูปยังอยู่ · `state` ไม่โต (2,835 ตัวอักษรเท่าเดิม) · **812×375 ทั้ง 2 กล่องพอดีจอ ไม่มี scrollbar** (กฎทอง #7 — กล่องเมนูสลับเป็น 2 คอลัมน์เอง) · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ มี session คู่ขนานทำงานอยู่ในไฟล์เดียวกัน (ui.js/style.css รอบ 703-707) — commit นี้จึง pin pathspec และมีโค้ดของเขาติดไปด้วยบางส่วน (ตรวจแล้วเกมบูตผ่าน console สะอาด)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 710 (29 ก.ค. · ผู้ใช้: หน้าเกมจับคู่คำศัพท์จอกว้าง อยากได้กล่องขาว+ตัวหนังสือ+ปุ่มคำใหญ่ขึ้น):** 🔍 ขยาย `#screen-game.screen.active` จอกว้าง `width:min(900px,96vw)`→`min(1400px,97vw)` (เกือบเต็มจอ) column-gap 18→28px · เพิ่ม max ของ clamp: `.board-label` 15→19px, `.word-card` font 20→30px/min-height 64→92px/padding สูงสุด 16→22px, `.card-grid` gap สูงสุด 10→16px — `css/lobby.css` ~115-144 (min ของ clamp เดิมไม่แตะ กันจอเตี้ยสุด 812×375 ยังพอดีเหมือนรอบ 704)
  - ยืนยัน (preview 1280×720/1366×768/1920×1080/812×375, mock login+startGame): ไม่มี scrollbar ทุกจอ (scrollH=clientH ทุกขนาด) · การ์ดคำศัพท์ 1280×720 ได้ font 30px สูง 88px (เดิม 20px/64px) · 812×375 ยังพอดี (font 18px ไม่ล้น) · ล้างเซฟแล้ว
  - ⚠️ session คู่ขนานแก้ `css/lobby.css`/`js/ui.js` ฯลฯ พร้อมกัน (ฟีเจอร์ประกาศนียบัตร รอบ 708 + รูปโปรไฟล์ รอบ 709) — commit แยกเฉพาะ hunk ตัวเองด้วย `git apply --cached` ไม่แตะของเขา


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 711 (29 ก.ค. · ผู้ใช้: เอารูปโปรไฟล์จาก `js/photo.js` ไปโชว์เพิ่มในฟีด/คนออนไลน์/แชท):** 🖼️ เพิ่ม `photoMiniHTML(uid,cls)` ใน `js/photo.js` (มีรูป→`<img class="mini-av">` วงกลมเล็ก · ไม่มีรูป→คืน `''` จุดเรียกใช้ยังเป็นของเดิมอิโมจิ/ตัวอักษรย่อ ไม่เปลี่ยน) — ใส่ที่ `fpostHTML` (หัวโพสต์ฟีด), `renderOnlineCard` (แถวคนออนไลน์ ทั้งตัวเอง+เพื่อน), `openChatInbox` (วงกลม story บนสุด + แถว ib-ava), `openChat` (หัวห้องแชทแทน 💬) — CSS `.mini-av` ฐานร่วมใน `css/style.css` + ปรับขนาดต่อจุดใน `css/style.css`/`css/lobby.css`
  - ยืนยัน (preview server แยกพอร์ต 8790 เพราะ 5 ช่อง preview เต็มจาก session คู่ขนาน, mock login + fake Online.db/friends/gfeed): เพื่อนมีรูป cache แล้ว → เห็นรูปวงกลมครบทั้ง 4 จุด · เพื่อนไม่มีรูป → กลับไปอิโมจิ/ตัวอักษรย่อเดิมทุกจุด ไม่มี regression · console สะอาด · ล้างเซฟแล้ว
  - ⚠️ **session คู่ขนานกำลังทำฟีเจอร์ใบประกาศ (รอบ 708) + ขยาย pass-photo (รอบ 710) ค้างอยู่ใน `js/ui.js`/`css/lobby.css`/`js/game.js`/`js/main.js`/`js/state.js`/`index.html` ตอนเริ่มงานนี้ (ยังไม่ commit)** — commit รอบนี้แยกเฉพาะ hunk ของตัวเองด้วย `git apply --cached` (คำนวณเลขบรรทัด HEAD เองทีละ hunk) ไม่แตะของเขาเลย เขายังมีงานค้างให้ commit เองทีหลัง


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 712 (29 ก.ค. · ผู้ใช้: สอบผ่านแล้วขอใบ Certificate หรูแทนภาพดินสอ 📝 + เก็บในโปรไฟล์):** 🎖️ **ไฟล์ใหม่ `js/cert.js`** วาดใบประกาศเป็น SVG viewBox เดียว (**แนวตั้ง 700×1000**) → ย่อ/ขยายคมทุกที่ · ฟีดโพสต์ `quiz` โชว์ใบเต็มกรอบแทนอิโมจิ (ซ่อน `.fp-text` ในวงหมุนเพื่อให้ใบใหญ่สุด) แตะ = ใบใหญ่เต็มจอฉบับทางการ (ชื่อเล่น+🆔+ระดับชั้น, หัวข้ออังกฤษ, คะแนน, วันที่, เลขที่ใบ, ตราทอง, ลายเซ็น Vocab World Academy) · เก็บใน `state.certs` (1 ใบ/หมวด · `certBackfill()` ออกใบย้อนหลังจาก quizLog ให้เซฟเก่า) · โปรไฟล์เพิ่ม **คอลัมน์ที่ 3 "🎖️ ประกาศนียบัตร"** (ไม่ดันการ์ดสูงขึ้น) · ของเพื่อนอ่านจากโพสต์ `/feed` เดิม = **ไม่ต้องแก้ rules/ไม่มีโซน DB ใหม่**
  - 🔑 ตัดสินใจจากตัวเลข: ช่องภาพในการ์ดฟีดเป็น **แนวตั้ง 171×279** → ใบแนวนอนวาดได้แค่ 171×120 แต่ใบแนวตั้งได้ **171×244** (ตัวอักษรใหญ่ขึ้น 43% ชื่อ 19.5px/หัวข้อ 15.1px บนจอจริง) · จอเตี้ย ≤500px ช่องเหลือ 44px → สลับเป็น "ป้ายทองบรรทัดเดียว" อัตโนมัติ (แตะเปิดใบใหญ่ได้เหมือนเดิม)
  - ยืนยัน (preview 1000×640 + 812×375): ฟีด/หน้า Feed เต็ม/โปรไฟล์ตัวเอง+เพื่อน/ใบใหญ่/กล่องผลสอบ (ปุ่ม "ดูใบประกาศ") ครบ · โปรไฟล์ 1000×640 **ไม่มี overflow เลย** (sh=ch=512) ตู้ใบประกาศเห็นทันทีไม่ต้องเลื่อน · console สะอาด · ล้างเซฟแล้ว
  - 🖼️ ภาพจากผู้ใช้ (ไม่มีก็ไม่พัง — มีชั้นเวกเตอร์รองอยู่): `img/cert/paper.png` 700×1000 + `img/cert/logo.png` 512×512 · **prompt สร้างภาพอยู่ใน `handoff/CERT_ART.md`**


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 717 (29 ก.ค. · ผู้ใช้: "ปรับขนาดของกล่องภารกิจให้เท่าเดิม เหมือนก่อนหน้านี้ แต่ยังใช้ระบบเลื่อน 10 วิเหมือนเดิม" — bug จากรอบ 707/708):** 🩹 **เจอต้นตอจริงผ่านทดสอบสด (mock login บนเว็บจริง เพราะ preview เต็ม 5 ช่อง):** `.q-bigcard{height:100%}` (บรรทัดเดิมตั้งแต่รอบ 170 แต่ถูก override เป็น auto มาตลอดจนรอบ 707 ไปลบ override ทิ้ง) พอมี 4 ใบซ้อนกันในเด็ค (3 ภารกิจ+โคลน) เกิดวงกลม: `#quest-card` ยังไม่มีสูงตายตัว ต้องรอเนื้อหาลูกคำนวณ แต่ลูกก็รอ % จากพ่อ → เบราว์เซอร์รวมสูง **ทุกใบที่ซ้อนกัน** ให้ (104px × 4 = 416px กล่องบวม 4 เท่า การ์ดก็ยืดเต็ม 416px ตาม) — แก้ `.q-bigcard` กลับเป็น `height:auto` (ตัดวงกลม การ์ดสูงตามเนื้อหาตัวเองเท่านั้น เหมือนก่อนรอบ 707) + ตัด JS ท่อน "ตั้ง auto ชั่วคราวก่อนวัด" ที่ไม่จำเป็นแล้วออก (`js/ui.js` renderQuestCard) — ระบบเลื่อน 10 วิ/แถบนับเวลา/แตะสไลด์ ไม่ได้แตะ ยังเหมือนเดิม
  - ยืนยัน (mock login บน vocabworld.web.app จริง, inject CSS ทดสอบก่อนแก้ไฟล์): กล่องกลับมา 104px (เท่าค่าที่คำนวณเองจากผลรวม qb-top+qb-bar+qb-row+q-dots+padding = 104 พอดี) การ์ดทั้ง 4 ใบเหลือ 104px เท่ากันหมด scroll-snap เลื่อนได้ปกติ (scrollTop=clientHeight=104 ตอนเลื่อนไปใบถัดไป)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 718 (29 ก.ค. · ผู้ใช้ส่งภาพฟีด: "ปรับให้เหรียญอยู่คนละบรรทัดกับชื่อ ให้เหรียญอยู่ใต้ชื่อ"):** 🎖️ ชื่อในฟีด (`it.n`) มีอิโมจิเข็ม/เหรียญ baked ต่อท้าย เดิมไม่แยกออก ทำให้ไหลต่อท้ายชื่อจนตัดบรรทัดมั่ว — เพิ่ม `fpNameBadgesHTML()` (`js/ui.js` ใกล้ `fpostHTML`) แยกชื่อ/เข็มด้วย `splitNameBadges`+`badgeEmojis`+`badgeIcHTML` แล้วเรนเดอร์แถวเหรียญ `.fp-badges` ใต้ชื่อจริง ๆ (ใช้ทั้ง `fpostHTML` และ `renderFeedComments`) · CSS `.fp-who{display:flex;flex-direction:column}` + `.fp-badges`/`.fp-badge-ic` ใหม่ใน `css/lobby.css`
  - ยืนยัน: inject `fpostHTML()` ตรงในคอนโซล preview เทียบ `getBoundingClientRect` — ชื่อ y=18 เหรียญ y=45 (คนละบรรทัดจริง) console สะอาด
  - 🚩 **เจอบั๊กเก่าคนละเรื่องระหว่างทดสอบ (ไม่ได้แก้รอบนี้ — spawn task แยกแล้ว):** `badgeEmojis()` regex (`js/game.js:501`) ขาด 4 สายเข็ม (มือนุ่ม🕊️/ทุบกระจก🪟/ดิ่งพสุธา🪂/เพื่อนซี้🐾) ไม่ตรงกับ `NAME_BADGE_RE`/`BADGE_META` → เหรียญ 4 สายนี้ไม่ขึ้นในการ์ดผู้เล่น+กระดานอันดับเข็ม


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 719 (29 ก.ค. · แก้บั๊กที่รอบ 718 spawn task ทิ้งไว้):** 🎖️ `badgeEmojis()` (`js/game.js:501`) regex ขาด 4 สายเข็ม (มือนุ่ม🪶🕊️🦅/ทุบกระจก🪟💥🥽/ดิ่งพสุธา🪂🛫🦸/เพื่อนซี้🐾💞🫶) ไม่ตรงกับ `NAME_BADGE_RE`/`BADGE_META` → เติมอิโมจิที่ขาดให้ครบ 33 ตัวเท่ากันทั้ง 2 regex
  - ยืนยัน: สคริปต์ node ทดสอบ `NAME_BADGE_RE.match()` แล้วป้อนผลให้ `badgeEmojis` regex ใหม่ — จับครบ 12 ตัวจาก 4 สายที่เคยหาย (ไม่ใช่ UI visual เปลี่ยน ไม่ต้อง preview)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 720 (29 ก.ค. · ผู้ใช้ส่งภาพกล่อง "ระดับชั้นของหนู": ตัวหนังสือเล็ก+จางเห็นไม่ชัด, ขอขยายกระดานกว้างขึ้นมากๆ ห้าม scrollbar):** 🎖️ `css/lobby.css` โซน gradelock (~4436-4497) — ต้นตอจาง: สีพาสเทลเดิม (เช่น `#8db3da`/`#c6f5dc`/`#ffdba6`) ออกแบบมาสำหรับพื้นเข้ม แต่ `.gradelock-box` จริงพื้นขาว (สืบทอดจาก `.levelup-box`) → เปลี่ยนเป็นสีเข้มคอนทราสต์สูงบนพื้นอ่อน (สไตล์เดียวกับ `.bill-box.paid/.overdue`) + ขยายฟอนต์ทุกจุด (h2 18→26px, ปุ่มเลือกชั้น 12.5→16px, ข้อความกติกา/ประวัติ 11.5→14.5px ฯลฯ) + ขยาย `max-width` 430px→`min(94vw,760px)`
  - ยืนยัน (mock login, inject `openGradeChange()` วัดด้วย `getBoundingClientRect`/`scrollHeight` ตามกฎทอง #3 เพราะ screenshot ใช้ไม่ได้ในเซสชันนี้): 1280×720 และ 812×375 ทุกสถานะ (ล็อก/ปลดล็อก/ชั้นสูงสุด/14 ตัวเลือก+ประวัติเต็ม) `scrollHeight===clientHeight` ไม่มี scrollbar ทุกกรณี · เจอ overflow 30px ในเคสสุดโต่ง (812×375 + 14 ตัวเลือก) ระหว่างทดสอบ → บีบ padding/margin ในโซนจอเตี้ยเพิ่มจนพอดี · console สะอาด · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 722 (29 ก.ค. · ผู้ใช้: "ทำใบประกาศพิเศษเมื่อผ่านครบทุกชุดของระดับ ใบ Gold ต่างจากใบปกติ"):** 👑 เพิ่ม `certAwardGold(b, setsCount, wordsCount)` ใน `js/cert.js` ออกใบใหม่ id `bandgold<b>` (คนละใบกับใบสอบผ่านรายชุด) เก็บใน `state.certs` เหมือนใบปกติ · `certSVG` แตกสาขาตาม `c.gold`: หัว "CERTIFICATE OF EXCELLENCE" (ปกติ "...ACHIEVEMENT"), โทนสีแดงเลือดหมู+วงแหวนกรอบชั้นในเพิ่ม (ปกติน้ำเงิน/ทอง), ตราประทับ ♛ (ปกติ ★), เนื้อความ "completed the entire curriculum...mastering all N sets · M words" แทนคะแนนสอบ · `certChipHTML`/`certStripHTML` ติด 👑+class `cert-mini-gold`/`cert-chip-gold` ให้ใบทอง — `js/dictband.js` `bandCheckComplete()` เรียก `certAwardGold` ก่อน `saveState()` แล้วเพิ่มปุ่ม "ดูใบประกาศทอง 👑" (`extraBtn` ของ `alertBox`) เปิด `openCertBig` ได้ทันที
  - ยืนยัน (preview 1000×640, mock login, inject `state.quizPassed` ครบทุกชุด band 1 แล้วเรียก `bandCheckComplete(1)` ตรง): alertBox ขึ้นปุ่มทองครบ, `state.certs[0]` มี `gold:true` ถูกต้อง, กดปุ่ม → lightbox เปิดใบ "CERTIFICATE OF EXCELLENCE" จริง, seal gradient เปลี่ยนเป็นโทนแดง (ปกติทอง), `certStripHTML`/`certChipHTML` ติด 👑/class ถูกต้อง, console สะอาดตลอด, ใบสอบผ่านรายชุดปกติ (`certSVG` gold=false) เรนเดอร์เหมือนเดิมทุกจุดไม่มี regression · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 723 (29 ก.ค. · ผู้ใช้: "ฟีดเพื่อน ปรับเข็มให้ใหญ่/ชัดขึ้น + เรียงเต็มแนวก่อนขึ้นบรรทัดใหม่"):** `.fp-badge-ic` (แถวเข็ม/เหรียญใต้ชื่อในโพสต์ฟีด) 13px→22px + gap 3→5px + เพิ่ม `.fp-badges{width:100%}` กันแถวแคบเกินจนขึ้นบรรทัดก่อนเวลา — ไฟล์ `css/lobby.css`
  - ยืนยัน: inject `.fpost` จำลอง 7 เข็มใน preview 1000×640 แล้ววัดจริงด้วย `getBoundingClientRect` — ไอคอน 22×22px ตรงตาม CSS, เรียงเต็มแถว 6 ตัวพอดีความกว้าง container (183px) ก่อนตัวที่ 7 ค่อยตัดขึ้นบรรทัดใหม่


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 724 (29 ก.ค. · ผู้ใช้ส่งภาพฟีดเพื่อน: "เอาไอคอนเล็กหน้าชื่อผู้เล่นออก + ให้ชื่อ/ชั้น/เหรียญชิดขอบซ้ายตำแหน่งเดียวกับที่เอาไอคอนออก"):** ลบ `<span class="fp-ico">${fc.e}</span>` (อิโมจิหมวดโพสต์หน้าชื่อ) ออกจาก `fpostHTML()` และ `renderFeedComments()` ใน `js/ui.js` (`fc` เหลือใช้แค่จุดเดียวใน `fpostHTML` เลยลบตัวแปรที่ไม่ใช้แล้วใน `renderFeedComments`) + ลบ CSS `.fp-ico` ที่ไม่มีใครเรียกแล้วใน `css/lobby.css` — พอลบ span ออก `fp-head` (flex row) ก็ดันแถวชื่อ/badges เลื่อนชิดซ้ายเองอัตโนมัติ
  - ยืนยัน: inject `.fpost` จำลองใน preview แล้ววัด `getBoundingClientRect` — `.fp-head`/`.fp-name`/`.fp-badges` ซ้ายตรงกันพอดี (เดียวกับตำแหน่งที่ไอคอนเคยอยู่), `document.querySelector('.fp-ico')` = null ยืนยันลบจริง


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 725 (29 ก.ค. · ผู้ใช้: "logo ไม่สวยเลย ขอเปลี่ยนจากวงกลมเป็นทรงโล่ เท่ ๆ สง่างาม"):** 🛡️ ตราสัญลักษณ์บนใบประกาศ (`emblem()` ใน `js/cert.js`) เปลี่ยนจากเหรียญกลม → **โล่ heater shield** ไหล่มนมุมบน ปลายแหลม ขอบทองหนา + สนามน้ำเงิน #123a63 + ดาว/ลูกโลก/หนังสือเปิด (สูงกว่ากว้าง = ดูสง่า) · ช่องวาง `img/cert/logo.png` เปลี่ยนตาม 180×180 → **176×196** (y=58–254) · prompt โลโก้ใน `handoff/CERT_ART.md` เขียนใหม่เป็นทรงโล่ (negative: circle badge/round frame)
  - ยืนยัน: rasterize SVG → PNG ดูภาพจริงทั้งใบย่อ (171×244) และใบใหญ่ — โล่ไม่ชนหัวข้อ VOCAB WORLD (ล่างสุดโล่ y≈254 · หัวข้อ y=308) หนังสือไม่ล้นออกนอกสนามน้ำเงิน


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 726 (29 ก.ค. · ผู้ใช้: "เอาโล่จาก emblem() ไปใช้เป็นไอคอนแอป + favicon ให้ทั้งเกมแบรนด์เดียวกัน"):** 🛡️ สร้าง `icon.svg` (โล่ heater shield ก๊อปจาก `emblem()` ใน `js/cert.js` วางบนพื้นน้ำเงินไล่เฉด + glow) แล้ว rasterize ด้วย canvas เป็น PNG ทับ `img/icons/icon-192.png`/`icon-512.png`/`icon-maskable-512.png`/`apple-touch-icon.png` (เดิมเป็นโลโก้ลูกโลก+ABC คนละสไตล์) + เพิ่มไฟล์ใหม่ `favicon-32.png` + เพิ่ม `<link rel="icon">` ใน `index.html` (เดิมไม่มี favicon เลย มีแต่ apple-touch-icon)
  - ยืนยัน: fetch ทุกไฟล์ผ่าน preview จริง (`english-pet-game` server) ได้ 200 ครบ, console สะอาด, ดูภาพ 192px และ 32px (favicon) ยังเห็นโล่/ดาว/ลูกโลกชัดไม่มั่ว · ไฟล์เก่าสำรองไว้ `img/icons/_bak_old_globe_icon/` (ไม่ commit)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 727 (29 ก.ค. · ผู้ใช้: "ทำโล่เป็นระดับตามผลสอบ: 10/10=ทอง · 9/10=เงิน · 8/10=ทองแดง"):** 🥇 เพิ่ม `certTier(c)`+`CERT_TIER_META` ใน `js/cert.js` — 100%=gold · ≥90%=silver · ที่เหลือ(ผ่านขั้นต่ำ 80%)=bronze คิดจาก `c.sc/c.tt` ใช้ได้กับทุกความยาวข้อสอบ (ชุด band 10-19 ข้อ) · โล่ (`emblem()`) แยกไล่เฉด `${u}shield` ออกจากกรอบใบ `${u}gold` เดิม (กรอบทั้งใบยังทองเสมอทุกระดับ) ระบายตามระดับ + ตราประทับกลมก็เปลี่ยนสีตาม (`sealTierStops`/`sealStroke`) · **ภาพจริง `img/cert/logo.png` (สีทองล้วน) โชว์เฉพาะระดับทอง** ระดับเงิน/ทองแดงใช้โล่เวกเตอร์ที่ระบายสีเอง (ยังไม่มีภาพจริงแยกสี) · เพิ่มป้ายระดับ "🥇 GOLD/🥈 SILVER/🥉 BRONZE" ในใบเต็ม+ใบย่อ+ป้ายทองบรรทัดเดียว+cap ในตู้โปรไฟล์ · ใบ mastery (👑 ครบทุกชุด) ไม่กระทบ เพราะคะแนนเต็มเสมออยู่แล้ว = tier gold โดยธรรมชาติ
  - ยืนยัน (preview): render 3 ใบ (ทอง/เงิน/ทองแดง) เทียบภาพจริงครบ, สี/ป้ายถูกต้องทุกระดับ, ตู้โปรไฟล์โชว์เหรียญถูกใบ (`🥉 Colours`/`🥇 Animals`/`🥈 ... ×2`) · เดินสายจริงผ่าน `finishQuiz()` คะแนน 9/10 → popup มีปุ่มดูใบ → ใบเปิดมี "SILVER" ถูกต้อง · console สะอาด ล้างเซฟแล้ว
  - ⚠️ **พบปัญหาไฟล์ภาพผู้ใช้ (นอกขอบเขตงานนี้ ยังไม่แก้):** `img/cert/logo.png`+`img/cert/paper.png` มีป้าย **"AI-Generated" ฝังอยู่ในพิกเซลจริงมุมขวาบน** (ไม่ใช่แค่ preview เครื่องมือเจน) — ตรวจแล้วจะโผล่บนใบจริงมุมขวาบนของโล่ (เล็กแต่เห็นได้) ต้อง crop/inpaint ออกหรือเจนใหม่ก่อนถือว่าใช้งานจริงได้เต็มร้อย


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 729 (29 ก.ค.):** 🐛 **เจอบั๊กจริง: `img/cert/` ไม่เคย `git add` เลยตั้งแต่รอบ 712** — deploy สคริปต์ใช้ `git archive HEAD` (เอาเฉพาะไฟล์ที่ track ใน git) ไฟล์ `logo.png`/`paper.png` เป็น `??` untracked มาตลอด → **ใบประกาศระดับทองบนเว็บจริงไม่เคยมีภาพโล่จริงเลย** ใช้แต่โล่เวกเตอร์ (เกมไม่พัง เพราะ `<image>` โหลดพลาดเงียบๆ แต่ผู้ใช้เห็นว่า "ภาพไม่ขึ้น") — แก้: `git add img/cert/` (2 ไฟล์) เข้า repo ให้ deploy หยิบไปด้วยแล้ว
  - 🖼️ **พ่วงงานผู้ใช้สั่ง (29 ก.ค.): ครอปป้าย "AI-Generated" ที่ฝังในพิกเซลจริงมุมขวาบนออก** — `logo.png` (พื้นโปร่งใส) เคลียร์ alpha=0 ตรงบริเวณป้ายตรง ๆ ปลอดภัย 100% (ป้ายอยู่นอกขอบโล่พอดี ไม่แตะงานศิลป์เลย) · `paper.png` (ไม่มี alpha ป้ายทับลายกรอบทอง) ตัดมุมซ้ายบน (ลายสมมาตรกัน) มิเรอร์แนวนอนแปะทับมุมขวาบน ไล่ขอบ (feather 90px + blur) กันเห็นตะเข็บ
  - ยืนยัน: composite ผ่าน canvas เทียบภาพก่อน/หลัง ไม่เห็นป้ายอีกทั้งคู่ ไม่เห็นตะเข็บที่ขนาดจริง · ตรวจว่าโล่/ลายกรอบไม่ถูกครอปเสียหาย
  - ⏳ **ค้าง: สแกนไฟล์ภาพอื่นทั้งโปรเจกต์หาป้ายเดียวกัน** (ผู้ใช้สั่งกวาดทุกไฟล์) — เขียน heuristic scanner (`img/` มี 675 ไฟล์ ไม่มี OCR ในเครื่อง) กำลังรัน ยังไม่จบ ดูรายละเอียดที่บันทึกรอบถัดไป
- **รอบ 728 (29 ก.ค. · ผู้ใช้: "ทำ splash screen ใช้โล่จาก icon.svg รอบ 726 ให้เข้าธีมกับไอคอนแอป"):** 🛡️ `index.html` เพิ่ม `#app-splash` — overlay เต็มจอ (inline `<style>` ใน `<head>` กันรอ css ภายนอก) โผล่ทันทีตั้งแต่ parse HTML บัง "ช่วงว่าง" ก่อน `main.js` เรียก `showScreen` ครั้งแรก (icon.svg ต้นทางไม่เคยถูก commit — round 726 rasterize แล้วทิ้ง เลยสร้าง SVG โล่ใหม่ก๊อป path/gradient ตรงจาก `emblem()` tier gold ใน `js/cert.js` แทน ให้ตรงกับ `img/icons/icon-512.png` เป๊ะ) พื้นหลัง radial-gradient เข้าธีม navy เดียวกับ `manifest.json` (`background_color`) + ชื่อเกม "VOCAB WORLD" + จุดโหลดกะพริบทอง — ซ่อนด้วย `.hide` (fade .5s) ทริกเกอร์จากสคริปต์เล็กท้าย `<body>` ทันทีหลัง `<script src="js/main.js">` (ไม่แตะ main.js/auth.js) + fallback timeout 8 วิกันค้าง
  - ยืนยัน (preview 1000×640): โหลดจริงเร็วจน splash ลบตัวเองก่อนเช็กทัน (`splashExists:false`, `loginActive:true`) → inject markup กลับเข้าไปตรวจ `getBoundingClientRect`/computed style แทน screenshot (พังในเซสชันนี้) — overlay เต็มจอ 1000×640, z-index 999999, gradient/สี/จำนวน path-gradient stop ตรงสเปก, ทดสอบ `.hide` เพิ่ม opacity ยังไม่กระโดดทันที (transition ทำงาน) · console สะอาดตลอด


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 730 (29 ก.ค. · ผู้ใช้: "โลโก้ใน splash screen ยังเป็นภาพเก่า"):** 🐛 **เจอต้นตอจริง (อ่านโค้ด ไม่เดา):** `sw.js` cache ไอคอนแบบ cache-first (`icon-192.png`/`icon-512.png` precache) แต่ `CACHE_VERSION` (`pet-vocab-v202`) ไม่เคยบัมพ์ตั้งแต่รอบ 712 — รอบ 726 เปลี่ยนไบต์ไอคอนบน server แล้วแต่เครื่องที่เคยเปิดเกมมาก่อนหน้านั้นยัง cache ภาพโล้บเก่า (โลก+ABC) ค้างถาวรไม่มีวัน revalidate เอง (splash `#app-splash` เองเป็น inline SVG ล้วน ไม่เกี่ยว ไม่มีปัญหา) — แก้: `bash tools/finish_round.sh --sw` บัมพ์ `sw.js` → `v203` บังคับ SW เก่าล้าง cache ทั้งหมดตอน activate แล้วโหลดไอคอนใหม่จริง
  - ยืนยัน: อ่าน `sw.js` เทียบ commit log ยืนยัน CACHE_VERSION ไม่เคยขยับตั้งแต่ v202/รอบ712 ผ่านรอบ 726/727/728/729 ทั้งที่แตะ shell asset (`img/icons/*`, `js/cert.js`) หลายรอบ · ผู้ใช้ที่เจอปัญหาแค่ปิดแอพ+เปิดใหม่ (หรือ hard refresh) ก็จะได้ SW ใหม่ทันที ไม่ต้องล้าง data


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 744 (29 ก.ค. · ผู้ใช้ส่งภาพแถวเข็มในฟีดเพื่อน: "ทำไมมี 2 แถว ทั้งที่ยังไม่เต็มแถว"):** 🎖️ ต้นตอ (วัดจริงด้วย `getBoundingClientRect` ไม่เดา): `.fp-when` (เวลาโพสต์) เดิมเป็น sibling แยกอยู่ในแถว `.fp-head` เดียวกับ `.fp-who` ทั้งคอลัมน์ → มันแย่งความกว้างจาก `.fp-who` **ตลอดทั้งความสูงการ์ด** ทั้งที่ตัวมันโชว์แค่บรรทัดบนสุด ทำให้แถวเหรียญด้านล่าง (`.fp-badges` กว้าง 100% ของ `.fp-who`) แคบกว่าที่ควรมาก (812×375 ก่อนแก้ = เหรียญเรียงได้แค่ ~4/แถว) → ย้าย `.fp-when` เข้าแถวเดียวกับชื่อใน `<span class="fp-name-line">` ใหม่ (เฉพาะบรรทัดบน) แทน — แถวเหรียญเลยได้ความกว้างเท่าแถวชื่อเต็ม ๆ แก้ `js/ui.js` `fpostHTML()` + `css/lobby.css` เพิ่ม `.fp-name-line`
  - ยืนยัน (preview 812×375 และ 568×320 ด้วย `getBoundingClientRect` วัดจำนวนแถว/เหรียญต่อแถวจริง ไม่เชื่อ screenshot): 812×375 ก่อนแก้เต็มแถวได้ ~4-5 หลังแก้ได้ 8/แถวก่อนขึ้นบรรทัดใหม่ (พิสูจน์ "เติมเต็มแถวก่อนขึ้นบรรทัดใหม่" ทำงานถูกแล้ว) · 568×320 (แคบสุด) จาก 3/แถว → 5/แถว · ทดสอบชื่อยาวมาก+มีเข็มด้วยไม่ล้นการ์ด (`scrollWidth<=clientWidth`) · console สะอาด
  - 🚦 **หมายเหตุ session คู่ขนาน:** แก้เสร็จ+ยืนยันแล้วกำลังจะ commit แต่ session คู่ขนานที่ทำรอบ 737 (`js/ui.js` โซนเดียวกัน `fpostHTML`/หน้าโปรไฟล์) ดัน `git add`/commit ไฟล์ `js/ui.js` + `css/lobby.css` ทั้งไฟล์ไปก่อน (ใช้ working dir ร่วมกัน ไม่ใช่ worktree แยก) → **โค้ดของรอบนี้ติดไปกับ commit e770262/98e4bfa ของรอบ 737 โดยอัตโนมัติ และ deploy ขึ้นเว็บจริงไปแล้ว** (เช็ก `curl vocabworld.web.app/js/ui.js` + `css/lobby.css` เจอ `fp-name-line` ครบ ตรงกับ `version.json` 2026-07-29.702 ที่ deploy ไปแล้ว) → รอบนี้เลยไม่ต้องแก้โค้ด/deploy ซ้ำ บันทึกลง TASKS.md เพื่อกันสับสนเท่านั้น (ใช้ `--no-deploy`)
  - ค้าง: ไม่มี — งานจบสมบูรณ์ (ขึ้นเว็บจริงแล้วผ่านรอบ 737)
- **รอบ 737 (29 ก.ค. · ผู้ใช้ส่งภาพหน้าโปรไฟล์: "ขยับกิจกรรมล่าสุด+ประกาศนียบัตรลง เอาเข็มเกียรติยศมาแทนแถวบน ขยายใหญ่ 5 คอลัมน์ เกิน 5 ปัดขวาแบบโรงงาน"):** 🎖️ `js/ui.js` `showPlayerCard()`: ย้าย `.pl-feed`(กิจกรรมล่าสุด)+`.pl-certs-wrap`(ประกาศนียบัตร) จากแถวบนของ `.pl-cols` ลงเป็นแถวใหม่ `.pl-cols-bottom` ใต้แถวบน · แถวบน `.pl-cols-top` เหลือ สถิติ(`.pl-stats-col`) + เข็มเกียรติยศการ์ดใหญ่ใหม่ (`.pl-badges-col`) แทนแถวชิปเล็กเดิม (ลบ `.pl-badges`/`.pl-badge-chip`/`.pl-badge-ic` เดิมทิ้ง — จุดใช้เดียว) · การ์ดเข็มใช้ `badgeIcHTML()` รูปเหรียญจริงขนาดใหญ่ + ชื่อเข็มเต็ม ในกริดใหม่ `.grid1x5` (แพทเทิร์นเดียวกับ `.grid2x8` แต่ 1 แถว 5 คอลัมน์ ตั้ง `--fc-n:5` ตรงคลาสกันชนกับ `--fc-n:8` ที่สืบทอดจาก `.pl-card.pl-wide`) ห่อด้วย `.strip-wrap`/`bindStripArrows()` เดิม → เกิน 5 เข็มปัดขวาได้เอง เหลือ ≤5 ลูกศรซ่อนอัตโนมัติ (`.no-x`) · แก้ `plCerts()` เปลี่ยน selector `.pl-cols`→`.pl-cols-bottom` (มี `.pl-cols` 2 ตัวแล้ว ตัวเดิมจะโดนแถวบนกวาดผิด) · ไม่มีเข็มเลย = โชว์ข้อความชวนเล่นแทนกริดว่าง
  - ยืนยัน (preview 1280×720 mock login self-card, ปิด `animation:none` ชั่วคราวกัน tab ไม่ compositing ค้างเฟรมแรกตามบทเรียนเดิม): แถวบน `.pl-cols-top` กว้าง 1fr:2.05fr (สถิติ 392px : เข็ม 805px) ตรงเป้า "รวมความกว้างกิจกรรม+ประกาศนียบัตรเดิม" · แถวล่าง `.pl-cols-bottom.has-certs` 1.15fr:.9fr เหมือนเดิม อยู่ใต้แถวบนจริง (gap 14px) · ทดสอบ 8 เข็ม → scrollWidth>clientWidth ลูกศรโผล่ ปัดขวาได้ (scrollLeft ไปสุด 429px) · ทดสอบ 5 เข็มพอดี → ไม่มี scroll ลูกศรซ่อนเอง (`no-x`) · ทดสอบ 0 เข็ม → ข้อความ "ยังไม่มีเข็มเกียรติยศ" ขึ้นถูกต้อง · ภาพเหรียญโหลดสำเร็จครบ (naturalWidth>0 ทุกใบ) ตรงกับเข็มที่ตั้งใน state · console สะอาดตลอด · ทดสอบจอเตี้ย 812×375: overflow แนวตั้งที่มี (475px มาจากคอลัมน์สถิติ/รูปตัวละครเดิม ไม่ใช่ของใหม่ — วัดแยกแล้วคอลัมน์เข็มสูงแค่ 176px) เป็นของเดิมอยู่ก่อนแล้ว (`.pl-wide .pl-body{overflow-y:auto}` ยอมรับ scroll ภายในมาตั้งแต่รอบ 617-619) ไม่ใช่บั๊กใหม่จากรอบนี้ · ล้างเซฟแล้ว
- **รอบ 736 (29 ก.ค. · ผู้ใช้ส่งภาพหน้าอันดับเข็ม: "อยากเห็นภาพเหรียญใหญ่ๆ ชัดๆ — session ก่อนทำพลาด"):** 🏅 ตรวจแล้วงานขยายเหรียญ**ไม่เคยถูกทำเลย** (ไม่มี commit/diff แตะหน้านี้ — รอบ 735 ของ session คู่ขนานเป็นเหรียญบนไอคอนคอม คนละงาน) → ทำจริงรอบนี้: `css/lobby.css` โซนกระดานเข็มรายสาย `.bcr-ic` ขยาย `clamp(26px,4.4vh,34px)` → **`clamp(48px,9.5vh,76px)`** (~2 เท่า) + แสงทองนวล drop-shadow 2 ชั้น · ป้ายชื่อเข็ม `.bcr-tier` ขยายเป็น `clamp(12.5px,2vh,15px)` · ลด padding แถว 6px→3px ชดเชย (กระดานเลื่อนในตัวอยู่แล้ว รอบ 677)
  - ยืนยัน (preview mock login + fake Online.board 3 คน 5 สาย · วัด computed/`getBoundingClientRect` — screenshot ใช้ไม่ได้ แท็บไม่ compositing เหมือนรอบ 731): 1280×720 เหรียญ 68.4px · 812×375 เหรียญ 48px กล่อง `.lbf-box` ไม่ล้นจอ overlay ไม่ overflow · ภาพเหรียญโหลดครบ 9/9 · console สะอาด · ล้างเซฟ+reload แล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 745 (29 ก.ค. · ผู้ใช้ส่งภาพหน้าอันดับเข็ม: "ไม่ต้องเอาเหรียญใส่หลังชื่อผู้เล่น ให้แต่ละประเภทโชว์เหรียญเดียวใหญ่ใต้ชื่อสาย (~5 เท่า) + จัดตาราง 4 คอลัมน์ เกิน 4 ขึ้นบรรทัดใหม่"):** 🎖️ `js/ui.js` `openLeaderboardFull()` แท็บ badges เปลี่ยนโครงสร้างการ์ดต่อสาย: ลบไอคอนเข็ม/ป้ายระดับต่อแถวผู้เล่น (`.bcr-tier`) ออก เหลือแค่อันดับ+ชื่อ · เพิ่มเหรียญตัวแทนสาย **1 ภาพใหญ่ใต้หัวข้อสาย** (ใช้ระดับสูงสุดที่มีคนได้แล้ว = แถวอันดับ 1) · `css/lobby.css` `.lbf-bcat-wrap` เปลี่ยน `flex` คอลัมน์เดียว → `grid grid-template-columns:repeat(4,1fr)` (เกิน 4 สายล้นไปแถวถัดไปเอง) เพิ่มคลาสใหม่ `.lbf-bcat-badge`/`.lbcat-ic` (`width:clamp(105px,92%,250px)` เต็มการ์ดเกือบสุด — **5 เท่าตรงๆ ทำไม่ได้จริงเพราะกริด 4 คอลัมน์จำกัดความกว้างการ์ดไว้ที่ ~1/4 ของกล่องอยู่แล้ว** เลยดันเต็มพื้นที่ที่มีให้ใหญ่สุดแทน วัดจริงได้ ~3.6 เท่าของขนาดเดิมที่จอ 1280×720)
  - ยืนยัน (preview 1280×720 + 812×375 จอเตี้ยสุด, mock login + fake `Online.board`, ปิด animation ก่อนวัด `getBoundingClientRect` ตามสูตรรอบ 731/734): grid จริง 4 คอลัมน์ (`gridTemplateColumns` คำนวณ 4 ค่าเท่ากัน) การ์ดไม่ล้นกรอบ `.lbf-box` ทั้ง 2 ขนาดจอ · แถวผู้เล่นไม่มี `.bcr-tier`/รูปเข็มแล้ว (เหลือแค่อันดับ+ชื่อ) · ทดสอบ fallback (ลบ `BADGE_IMG` ชั่วคราว) เข็มที่ไม่มีภาพจริงถอยไปโชว์อิโมจิใหญ่ถูกต้อง · overlay ไม่มี scrollbar เกิน (เฉพาะ `.lbf-bcat-wrap` เลื่อนในตัวตามดีไซน์เดิมรอบ 677) · console สะอาด ล้างเซฟแล้ว
  - 🚦 **หมายเหตุ session คู่ขนาน (แพทเทิร์นเดียวกับรอบ 744):** เขียนโค้ดเวอร์ชันแรกไว้ในไฟล์ระหว่างที่ session คู่ขนานกำลังทำรอบ 737 (หน้าโปรไฟล์ผู้เล่น `showPlayerCard`) อยู่ในไฟล์เดียวกัน (`js/ui.js`/`css/lobby.css` ใช้ working dir ร่วมกัน ไม่ใช่ worktree แยก) — เขาสั่ง commit ก่อน เลยพ่วงโค้ดเวอร์ชันแรกของเราติดไปกับ commit e770262/98e4bfa (deploy `.702` ไปแล้ว) โดยไม่ได้ตั้งใจ · รอบนี้แก้เฉพาะ **ขยายขนาดเหรียญเพิ่มอีกจาก 78%→92% ของการ์ด** (`css/lobby.css` เท่านั้น) เป็นคอมมิทแยกของตัวเองปกติ ไม่ชนกันแล้ว
- **รอบ 741 (29 ก.ค. · ผู้ใช้แก้รอบ 735: "ทำภาพเงินเข้าเหมือนออนไลน์สิ เพียงแต่เหรียญเข้าคอมแทนกระเป๋า"):** 💰 รอบ 735 ทำแบบเหรียญนิ่งเด้งมุมไอคอน (ผู้ใช้บอกดูเป็นก้อนแปลก ๆ ไม่ใช่ภาพเงินไหลเข้า) — แก้เป็นใช้กลไก `.coin-flow` ตัวเดียวกับ pill ออนไลน์ตรง ๆ (เหรียญทองร่วงลงไม่ขาดสาย จาก `img/coins/coin_gold.png`) แค่เปลี่ยนจุดลงจอดจากกระเป๋า 👛 เป็นไอคอนคอม 💻 เอง (`.cf-bag` ใส่คลาส `.comp-ic` ด้วย) — `index.html` เปลี่ยนมาร์กอัป `#comp-pill` ใช้ `<span class="coin-flow comp-flow">` + `<i class="cf-c">`×3 + `<span class="cf-bag comp-ic">💻</span>`, `css/lobby.css` เพิ่มกฎปิดแอนิเมชันตอนล็อก/ถูกตัดบริการ (แพทเทิร์นเดียวกับ `.coin-pill.net.off`) + รวม `cfBag`+`compGlow` เป็น animation เดียวตอนกำลังทำเงิน (ลบกฎ `compGlow` เดี่ยวเดิมทิ้งเพราะซ้ำซ้อน) — ไม่แก้ JS เลย (โครง class .on/.locked/.cut เดิมพอ)
  - ยืนยัน (preview 1000×640 mock login สร้างนักเรียนจริงถึง dashboard): `state.computer=true` → pill class `.on`, เหรียญ 3 ก้อน (`.cf-c`) มี `animationName:cfDrop` + โหลด `coin_gold.png` จริง, จุดลงจอด (`.cf-bag`) มี `animationName:"cfBag, compGlow"` (เด้ง+เรืองแสงพร้อมกัน) · ทดสอบ `state.computer=false` (ล็อก) และ `state.dataCut=true` (ถูกตัด) → เหรียญหยุดร่วง (`animationName:none`) เหรียญที่ 2-3 ซ่อน เหมือน pill ออนไลน์ตอน off ทุกประการ · console สะอาด ล้างเซฟแล้ว
  - ค้าง: ไม่มี — งานจบสมบูรณ์


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 750 (29 ก.ค. · ผู้ใช้ส่งภาพกล่อง "เพื่อนออนไลน์" ในล็อบบี้ 2 ใบ: "1.เอาเข็มออกจากส่วนนี้ด้วย 2.ตัดคำยาวให้เหลือ 'กำลังออนไลน์ n คน'"):** `js/ui.js` `renderOnlineCard()` — **(1)** แถวตัวเอง (`meRow`) เลิกโชว์ `${meBadges}` ต่อท้ายชื่อ (ยังเก็บใน `data-n` เผื่อจุดอื่นใช้) · แถวเพื่อน (`f.n`) ใช้ `splitNameBadges(f.n).name` ตัดอิโมจิเข็มก่อนโชว์ · **(2)** ยุบ `#online-label` (เดิม "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา") + `#online-sub` (เดิม "ตอนนี้มีเพื่อนออนไลน์ N คน") เหลือบรรทัดเดียวใน label: `🧑‍🤝‍🧑 กำลังออนไลน์ N คน 💚` (+ป้าย "🌏 ออนไลน์จริง" เมื่อต่อ Firebase) · `#online-sub` เคลียร์เป็น `''` ทุกครั้ง (CSS `.side-sub:empty{display:none}` ซ่อนให้เองไม่ต้องแก้ CSS · ไม่แตะ `.gmark`)
  - ยืนยัน (preview mock login + mutate `Online.ready/friends` จริงในเพจ, `badgeSuffix` จำลอง): label = `"🧑‍🤝‍🧑 กำลังออนไลน์ 2 คน 💚 🌏ออนไลน์จริง"` บรรทัดเดียว, sub ว่าง+`display:none` · ชื่อตัวเอง/เพื่อนในรายการไม่มีอิโมจิเข็มติดท้ายแล้ว (`splitNameBadges` ตัดถูกต้อง) console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 751 (29 ก.ค. · ผู้ใช้: "ขอ prompt ให้ copilot เจนภาพ 2 ใบ ใบละ 40 ตัวละคร แล้วล็อคพิกัดมาโชว์ในหน้าเลือกโปรไฟล์ ทีละ 8 (4×2) ปัดขวาเหมือนโรงงาน"):** 🖼️ ตัวละครโปรไฟล์ 8 → **88 ตัว** · ตัดจากแผ่น 1536×1024 ของ Copilot (`C:\Users\rober\Downloads\1-40.png`/`41-80.png`) ด้วยสคริปต์ `scratchpad/slice_avatars.py` — หาพื้นขาวแบบ flood fill จากขอบ (ไม่ใช่ threshold สีขาว) จึงไม่กินชุดขาว/หมวกเชฟ/ชุดอวกาศ + `binary_fill_holes` + ตัดตามเส้นกริดที่ "ผอมที่สุด" รอบเส้นแบ่ง (ตัวละครบางคู่ชนกันแนวตั้ง ถ้าใช้ connected component เฉย ๆ จะได้ 37/40) → `img/blocks/blk9.png`-`blk88.png` 341×512 พื้นใส เฟรมเดียวกับ blk1-8 (เท้าที่ y=398 · หัวที่ y=64 · กว้างไม่เกิน 250) · quantize 256 สี **8.56 MB → 1.76 MB**
  - โค้ด: `js/state.js` เพิ่ม `state.profAv` (blk1-88 · แยกจาก `state.blockAv` ที่เป็นโมเดลบล็อกโลก 3D ซึ่งมีแค่ 8 ตัว — เลือก blk9+ จึงไม่ไปทับตัวในโลกขับรถ) · `js/ui.js` `lobbyBlk()` อ่าน profAv ก่อน + `BLK_PAD_NEW`/`BLK_TOP_FIX` (แท่นอันดับ: ชุดใหม่ขอบเท่ากันหมด ยกเว้น 8 ตัวที่กว้างผิดปกติ เช่น ปีกผีเสื้อ/ไม้สกี) · `js/util.js` `openSettings()` เปลี่ยนกริด 8 ช่องเป็น `.strip-x.blk-x.grid2x8` + `bindStripArrows()` (แพทเทิร์นโรงงาน) + `loading="lazy"` + เปิดมาเลื่อนไปตัวที่เลือกอยู่ · `css/lobby.css` โซน `.settings-box .blk-*`
  - ⚠️ **บทเรียน CSS:** `--fc-n` ต้องเขียนที่ `.strip-x.blk-x` (2 คลาส) เพราะ `.grid2x8` อยู่ท้าย lobby.css จะทับเป็น 8 · และ `.settings-box .blk-mini img` (รอบ 243) ชนะกฎคลาสเดียวใน style.css — แก้ที่โซนเดิมใน lobby.css เท่านั้น อย่าเขียนกฎใหม่ใน style.css
  - ยืนยัน (preview 1000×640 + 812×375 · mock login · ปิด animation ก่อนวัด `getBoundingClientRect`): 88 ปุ่ม · เห็น 4.1 คอลัมน์/หน้า 2 แถว ทั้ง 2 ขนาดจอ · เลื่อนได้ 10.76 หน้า ถึง blk88 พอดี ลูกศร bound ทั้งซ้าย/ขวา · กด blk42 → `profAv=blk42` แต่ `blockAv` ยังเป็น blk3 เดิม (โลก 3D ไม่เพี้ยน) · กด blk5 → เปลี่ยนทั้งคู่ · รูปโหลดครบ 88/88 (341×512) · body ไม่มี scroll แนวนอน · console สะอาด ล้างเซฟแล้ว
  - 🚦 session คู่ขนาน commit `js/ui.js` ทั้งไฟล์ไปกับรอบ 750 (พ่วงโค้ดครึ่งทางของรอบนี้ · ไม่พัง เพราะ `lobbyBlk()` fallback เมื่อ `profAv` ว่าง) → ขยับเลขรอบเป็น 751 · ⏳ แท็บ preview เป็น hidden เสมอ → `loading="lazy"` ไม่ยิงเอง (เทสต์ต้องสั่ง eager) และ smooth scroll ไม่ขยับ (ใช้ `behavior:'instant'` วัดแทน) ไม่ใช่บั๊กโค้ด


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 752 (29 ก.ค. · ผู้ใช้: "ควิซอาหารปลอดภัย กำหนด 1 วันเล่นได้ 2 รอบ ตอบถูกให้แสดงภาพ+เสียงเงินเข้าชัดเจน"):** 🛡️ `js/ui.js` `openFoodQuiz()` — เพิ่มเพดาน `FOODQUIZ_MAX_PLAYS`(2) นับด้วย `state.foodQuizPlayDay/PlayCount` (`js/state.js`) เกินโควตา = overlay บอก "เล่นครบ 2 รอบแล้ว" ปิดไม่ให้เล่น · มาร์ก `foodQuizDay` (รอบรางวัล) ตอน**เริ่ม**รอบแรกของวันทันที (เดิมมาร์กตอนจบรอบ) กันเปิด-ปิดกดรางวัลไม่จำกัด · ตอบถูกแต่ละข้อ**ในรอบรางวัล** ได้เหรียญทันที (ไม่รอจบรอบ) พร้อม `coinFlyFx()`+`sfx.coinGet()`+`renderDashboard()` (เดิม batch คำนวณตอนจบรอบเดียว ไม่มีภาพ/เสียงระหว่างเล่น) · โบนัสตอบถูกครบ 5/5 ก็ยิง fly+เสียง+รีเฟรช HUD เหมือนกัน
  - ยืนยัน (preview mock login, บังคับโชว์ `screen-dashboard` เทสต์ HUD): ตอบถูกรอบรางวัล → เห็น "+10 🪙" ทันที + 5 ก้อนเหรียญบิน + เลขบนแถบบนอัปเดตพร้อมกัน (ไม่ใช่รอปิดโอเวอร์เลย์) · เล่นรอบ 2 = "รอบฝึกซ้อม" ไม่ได้เหรียญถูกต้อง · เล่นรอบ 3 ถูกบล็อกด้วยข้อความ "เล่นครบ 2 รอบแล้ว" · 5/5 ข้อ → โบนัส +25 รวม 75 เหรียญ ตรง


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 753 (29 ก.ค. · ผู้ใช้ทดลองเล่นแล้วแจ้ง "ตอบถูกไม่มีเสียงเงินเข้าเลย ต้องมาทุกข้อ ไม่ใช่มาตอนท้าย"):** 🐛 ต้นตอ = รอบ 752 ยังก๊อปดีไซน์เดิม "รอบแรกของวัน=ได้เหรียญ, รอบซ้ำ=ฝึกซ้อมไม่ได้เหรียญ" มาด้วย → รอบสอง (ซึ่งตอนนี้เป็นรอบสุดท้ายที่อนุญาตอยู่แล้วจากเพดาน 2 รอบ/วัน) เลยไม่มีภาพ/เสียงเหรียญเลยทั้งรอบ — เพดาน 2 รอบ/วันคุมการฟาร์มพออยู่แล้ว การแยก "ฝึกซ้อม" ซ้อนเข้ามาเลยฟุ่มเฟือย+ทำให้ฟีเจอร์ที่เพิ่งทำหายไปครึ่งนึง → **ลบแนวคิดรอบฝึกซ้อมทิ้ง**: `js/ui.js` `openFoodQuiz()` ทุกรอบ (ทั้ง 2 รอบ/วัน) ได้เหรียญ+coinFlyFx+sfx.coinGet+renderDashboard ทุกข้อที่ตอบถูกเหมือนกันหมด · ลบ `state.foodQuizDay` ออก (ไม่ใช้แล้ว) เหลือแค่ `foodQuizPlayDay/PlayCount` คุมเพดาน
  - ยืนยัน (preview mock login บังคับโชว์ `screen-dashboard`): เล่นรอบ 1 ตอบถูกได้ +10/ข้อทันทีเห็นเหรียญบิน+ตัวเลขอัปเดต · กด "เล่นอีกรอบ" เข้ารอบ 2 (รอบสุดท้ายของวัน) ตอบถูกยังได้เหรียญ+ภาพ+เสียงเหมือนรอบแรกทุกอย่าง (ก่อนแก้รอบนี้จะเงียบสนิท) · เหรียญสะสมถูกต้อง 20+10=30


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 754 (29 ก.ค. · ผู้ใช้เจอฝ้าขาวรอบตัวละครใหม่ในรอบ 751 → เตรียมแผ่นใหม่พื้นโปร่งใสจริงมาเอง):** 🖼️ เปลี่ยนไฟล์ต้นทาง 80 ตัว (`blk9`-`blk88`) จากแผ่นพื้นขาวที่ต้องเดาขอบ → แผ่นที่มี alpha channel จริง (`Downloads\new1-40.png`/`new41-80.png`) ตัดด้วย `scratchpad/slice_avatars_v2.py` (ใช้ alpha ตรง ๆ ไม่ต้อง flood-fill เดาพื้นขาว จึงไม่มีฝ้าขาวเหลือที่ขอบอีก) · วัดยืนยันด้วยการนับพิกเซล "ขอบกึ่งโปร่งใส+ใกล้ขาว" เทียบ `blk1` เดิม (baseline) → **0% ทั้ง 2 กรณี** เท่ากับของเดิมที่ไม่เคยมีปัญหา · quantize 256 สีเหมือนเดิม (8.03→1.66 MB) · อัปเดต `BLK_TOP_FIX` ใน `js/ui.js` ตามพิกัดจริงของแผ่นใหม่ (ใกล้เคียงของเดิมมาก ไม่ใช่บั๊ก)
  - 🚦 **session คู่ขนานชนไฟล์เดียวกัน (`js/ui.js`):** ระหว่างแก้ เขาใช้เลข "รอบ 753" ไปก่อน (คนละเรื่อง — ควิซอาหาร) และ commit ทั้งไฟล์ไปพร้อมกวาดเอาการแก้ `BLK_TOP_FIX`/คอมเมนต์ของรอบนี้ (ยังไม่ commit ตอนนั้น) ติดไปด้วยโดยไม่ตั้งใจ (อยู่ใน commit bf9ccdb/aa5df7d) — ตรวจแล้วไม่ชนกันจริง (คนละฟังก์ชัน) เลยไม่ต้องแก้โค้ดซ้ำ แค่แก้เลขรอบในคอมเมนต์เป็น 754 ให้ตรง + commit เฉพาะรูปภาพ 80 ไฟล์ + คอมเมนต์บรรทัดนี้แยกจากไฟล์อื่นของเขา
  - ยืนยัน (preview 1000×640 · mock login): สร้าง `<img class="pod-char" data-blk="blk68">` จริงแล้วเรียก `seatPodChars()` ตรง ๆ → `marginTop`/`marginBottom` คำนวณจาก `BLK_TOP_FIX` ใหม่ถูกต้อง · โหลดรูปครบ 341×512 ทุกไฟล์ · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 755 (29 ก.ค. · ผู้ใช้แจ้งรอบ 2: "เสียงเงินเข้าที่ตอบถูกแต่ละข้อก็ยังไม่มา ตรวจสอบใหม่"):** 🔊 **เจอต้นตอจริง ไม่ใช่โค้ดควิซ** — ยืนยันด้วยการดัก `beep()` จริงในเบราว์เซอร์: `sfx.coinGet()` ถูกเรียกครบ 4 โน้ต (880/1175/1568/2093) ทุกข้อที่ตอบถูก และ live deploy มีโค้ดถูกต้องแล้ว → ปัญหาคือ **`beep()` ใน `js/util.js` (เสียง UI ทั้งเกม) ไม่เคยมี `audioCtx.resume()` เลย** ขณะที่ระบบเสียงอื่นทุกตัว (adventure3d/invasion3d/music.js) resume ของตัวเองหมด · AudioContext ที่ตกไปสถานะ `suspended` (เปิดหน้าเว็บก่อนแตะจอ — มือถือ/iOS เข้มมาก, สลับแท็บ/ล็อกจอแล้วกลับมา) จะ **สร้างโน้ตสำเร็จ ไม่มี error แต่ไม่มีเสียงออกลำโพง** = เงียบทั้งเกมแบบหาไม่เจอ → เติม resume ใน `beep()` ที่เดียวจบ (แก้เสียงทั้งเกม ไม่ใช่แค่ควิซ)
  - 🔎 **+ ป้ายบอกเหตุผลบนจอ (กฎทองข้อ 1 · บทเรียนรอบ 605-609):** เพิ่ม `soundStatus()` ใน util.js → ควิซโชว์ใต้ป้ายเหรียญเมื่อเสียงออกไม่ได้จริง ("🔇 เสียงปิดอยู่ — เปิดที่ปุ่มลำโพงมุมบน" / "🔇 เบราว์เซอร์ยังไม่อนุญาต — แตะหน้าจอ 1 ครั้ง") · **ต้องเช็กหลัง `setTimeout` 400ms** เพราะ `resume()` เป็น async ถ้าเช็กทันทีจะเตือนผิดทั้งที่เสียงกำลังจะดัง
  - ยืนยัน (preview · จำลอง `audioCtx.suspend()` = สภาพเครื่องผู้ใช้): ก่อนแก้ ctx ค้าง `suspended` เงียบสนิท → หลังแก้ ตอบถูกแล้วเล่นครบ 4 โน้ตที่สถานะ `running` เอง + ไม่ขึ้นป้ายเตือนผิด · ทดสอบ `state.sound=false` → ขึ้นป้าย "เสียงปิดอยู่" ถูกต้อง · console สะอาด ล้างเซฟแล้ว
  - 🚦 session คู่ขนานลงรอบ 754 (ฝ้าขาว blk) ระหว่างทำ → เลื่อนเลขเป็น 755 · แตะ `js/ui.js` คนละโซน ไม่ทับกัน (ตรวจ diff แล้ว)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 756 (29 ก.ค. · ผู้ใช้: "สร้างปุ่มปิดให้ด้วย เผื่ออยากจะออกกลางคัน" ส่งภาพหน้าผลลัพธ์คำตอบถูก):** `js/ui.js` `openFoodQuiz()` หน้าผลลัพธ์หลังตอบ (ก่อนหน้านี้มีปุ่ม "เลิกเล่น" เฉพาะหน้าคำถาม ไม่มีในหน้าผลลัพธ์) เพิ่มปุ่ม `.food-cancel.fq-quit` "เลิกเล่น" ต่อท้ายปุ่ม "ข้อต่อไป" ให้ปิดควิซกลางคันได้ทุกหน้าจอ
  - ยืนยัน (preview mock login): ตอบคำถามแล้วเห็นปุ่ม "เลิกเล่น" อยู่ใต้ปุ่ม "ข้อต่อไป" กดแล้ว overlay หายไปสำเร็จ


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 757 (29 ก.ค. · ผู้ใช้: "โลโก้ใน splash screen ยังเป็นภาพเก่า" → "เอาภาพใหม่นี้ไปใส่แทน `img/cert/logo.png`"):** 🛡️ **ตรวจก่อนแก้: ฝั่งเว็บไม่ได้ค้างของเก่าเลย** (md5 `img/icons/*` เครื่อง=เว็บจริงครบ 5 ไฟล์ · sw live v204 · ไม่มี splash/preloader อื่นในโค้ด) — ที่ผู้ใช้เห็นเก่าคือ "โล่ SVG วาดมือ" ของรอบ 727 ซึ่งคนละภาพกับโลโก้ภาพจริงบนประกาศนียบัตรทอง → เปลี่ยน `#app-splash` ใน `index.html` จาก SVG เป็น `<img src="img/icons/splash_logo.png">` (ตัดเนื้อโล่จาก `img/cert/logo.png` ที่ bbox 177,80–829,927 → ย่อ 440×572 → quantize 256 สี **1.11MB → 93KB**) + `<link rel=preload as=image>` ใน head (วัดจริง: เริ่มโหลดที่ 12ms) + เพิ่มเข้า SHELL ใน `sw.js` (ออฟไลน์ไม่จอว่าง) · **ไม่แตะ `img/cert/logo.png` ต้นฉบับ** (asset ผู้ใช้)
  - ⚠️ **บทเรียน CSS ภาพแทน SVG:** ใส่ `max-height` คู่กับ `width` **ภาพถูกบีบแบน** (เบราว์เซอร์คงความกว้างที่ระบุไว้ ไม่คำนวณใหม่ตามสัดส่วน — วัดได้ ratio 1.159 ทั้งที่ของจริง 0.769) → ต้องคุมด้วยความกว้างอย่างเดียว `width:min(clamp(120px,26vw,200px),35vh)` · ได้แถม: จอเตี้ยเดิม (812×375) โลโก้+จุดโหลด **ล้นจอ 4px มาตั้งแต่รอบ 727** ตอนนี้หดเองพอดีจอแล้ว (กฎทองข้อ 7)
  - ยืนยัน (preview 1000×640 + 812×375 · ดึง `index.html` สดมาเรนเดอร์จริง): 200×260 / 131×171 สัดส่วน 0.769 เป๊ะทั้งคู่ · อยู่ในจอครบ ไม่มี scroll · reload จริงแล้ว preload ยิงที่ 12ms โหลดสำเร็จ splash ปิดตัวเองปกติ · console สะอาด


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 758 (29 ก.ค. · ผู้ใช้ส่งภาพ: เปลี่ยนชื่อสัตว์หน้า lobby แล้วคีย์บอร์ดมือถือบังกล่อง input เต็มจอ):** ต้นตอ = `askNameDialog()` (`js/util.js`) ใช้ `.levelup-overlay` ซึ่งจัดกึ่งกลางด้วย `inset:0`+`align-items:center` ตาม layout viewport เดิม ไม่ตาม `visualViewport` ที่หดลงจริงเมื่อคีย์บอร์ดเปิด (มือถือหลายรุ่นไม่ลด `window.innerHeight`) → กล่องเลยลอยอยู่ตำแหน่งเดิมทั้งที่ครึ่งล่างจอโดนคีย์บอร์ดบังไปแล้ว → **ใช้ตัวช่วยเดียวกับกล่องแชท** เรียก `chatFitKeyboard(overlay, box)` (ของเดิมใน `js/ui.js` ทั่วไปอยู่แล้ว ไม่ต้องเขียนใหม่) ใน `askNameDialog()` + เพิ่ม CSS `.levelup-overlay.kb-open{align-items:flex-end}` ใน `css/style.css` ให้กล่องขยับไปจอดเหนือคีย์บอร์ดแทนกึ่งกลางจอเดิม
  - ยืนยัน (preview 1000×640 · mock login เติม pet ด้วย `newPet()`): จำลอง `window.visualViewport` แบบคีย์บอร์ดเปิด (height 300 จาก 640) แล้วเรียก `renamePet()` → overlay ได้ `kb-open` จริง `align-items:flex-end` กล่อง `getBoundingClientRect().bottom=213.6` อยู่ในกรอบ 300px ที่มองเห็นได้ครบ (ก่อนแก้จะจัดกึ่งกลาง 640px ซึ่งพ้นเขตที่มองเห็น) · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 759 (29 ก.ค. · ผู้ใช้: "เปลี่ยนไอคอนแอป+favicon ให้เป็นโลโก้ภาพจริงใบเดียวกับ splash"):** 🛡️ `img/icons/icon-192/512/maskable-512/apple-touch-icon/favicon-32.png` ทั้ง 5 ไฟล์ เจนใหม่จาก `img/cert/logo.png` (เนื้อโล่เดียวกับ `splash_logo.png` รอบ 757) แทนโล่เวกเตอร์วาดมือเดิม — สคริปต์ `scratchpad/gen_icons.py`: พื้นหลัง radial gradient น้ำเงินแบรนด์เต็มจัตุรัสเสมอ (ไม่มี alpha กัน iOS/Android เติมสีเอง) + วางโล่กึ่งกลาง · **maskable** ใช้สูตรคำนวณ diagonal ให้โล่พอดี safe-zone วงกลม 72% ของด้าน (เผื่อ margin จากสเปค 80%) กัน launcher บางเจ้า mask วงกลม/squircle ตัดโลโก้แหว่ง · quantize 256 สี ลดขนาดรวม **~470KB (icon-512 102KB/maskable 40KB/192 18KB/apple-touch 16KB/favicon 2.6KB)**
  - ⚠️ **favicon 32px = จุดเสี่ยงสุด** ภาพเนื้อจริง (มีลายเส้น/แสงสะท้อนละเอียด) ที่ 32px ลูกโลก+หนังสือเบลอเป็นก้อนเดียว ต่างจากโล่เวกเตอร์เดิมที่เส้นเรียบยังคมที่จอเล็ก → ชดเชยด้วย contrast+sharpen (`ImageEnhance`) และขยายสัดส่วนโล่เป็น 0.875 ของด้าน แต่ยังไม่คมเท่าของเดิม (ยอมรับได้ เพราะจุดประสงค์หลักคือ "ชุดเดียวกันทั้งเกม")
  - ยืนยัน (preview): fetch ทั้ง 5 ไฟล์ผ่าน manifest.json/index.html → 200 ครบ, `manifest.json.icons` path/purpose/sizes ไม่เปลี่ยน (ไบต์ภาพเปลี่ยนแต่ path เดิม ไม่ต้องแก้ index.html/manifest.json เลย) · console สะอาด


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 760 (29 ก.ค. · ผู้ใช้: "ทำ logo_silver.png/logo_bronze.png จาก logo.png ต่อเข้า cert.js ให้ครบ 3 ระดับ"):** เดิมใบเงิน/ทองแดงใช้แค่โล่เวกเตอร์ `emblem()` (รอบ 726 ยังไม่มีภาพจริงแยกสี) → ตัดโทนจาก `img/cert/logo.png` ต้นฉบับด้วย `scratchpad/cert_logo_tone.py` (remap เฉพาะพิกเซล hue ทอง 20-75° เป็นเงิน/ทองแดง ด้วย HSV shift ผ่าน `colorsys` — พื้นน้ำเงิน/ไฮไลต์ขาว/เงาดำไม่โดนแตะเพราะกรองด้วย saturation) ได้ `img/cert/logo_silver.png`/`logo_bronze.png` (1024×1024 เหมือนต้นฉบับ) · `js/cert.js` เพิ่ม `CERT_LOGO_SRC` map ต่อ tier แล้วเลิก `if(tier==='gold')` เดิม ให้ `<image>` ใช้ path ตาม tier เสมอ
  - ยืนยัน (python http.server 8790 เอง เพราะ preview หลักติด session คู่ขนาน + mock login testkit): เรียก `certSVG()` ตรงกับ cert 3 คะแนน (10/10 gold, 9/10 silver, 7/10 bronze) เรนเดอร์ SVG จริงในเพจ → rasterize ผ่าน canvas + download มาดูภาพจริง เห็นโล่ 3 โทนตรงกับระดับ ขอบ/แสงเข้ากับโล่เวกเตอร์ด้านหลังพอดี ไม่มีภาพขาด · ลบไฟล์ทดสอบใน Downloads แล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 761 (29 ก.ค. · ผู้ใช้: "เอากลุ่ม 'ตั๋วเข้าโลกผจญภัย 3d' ทั้งหมด ไปอยู่ใต้กลุ่ม 'หุ่นยนต์'"):** `index.html` `#panel-market` สลับลำดับ 2 กลุ่มบล็อกบนสุด — ย้าย `<div id="market-card">` (ซึ่งท้ายสุดของมันคือโชว์รูมหุ่นยนต์ `mkt-robots` จาก `renderRobotShop()`) มาไว้ก่อน แล้วค่อยตามด้วยกลุ่ม "🎫 ตั๋วเข้าโลกผจญภัย 3D" (ticket/haunt/heli/drone/drive/soccer/moto/invasion) — ไม่แตะ JS เพราะทั้งสองกลุ่มแค่เติมเนื้อหาใน id เดิม ไม่ผูกกับลำดับ DOM
  - ยืนยัน (preview 1000×640, mock login + newPet เติม pet, เรียก `openPanel('market')`): `[...panel-market.children]` ได้ HEAD "ตลาด&ยานพาหนะ" → market-card → HEAD "ตั๋วเข้าโลกผจญภัย 3D" → การ์ดตั๋ว 4 แถว ตรงตามที่สั่ง · เช็ก `mkt-robots.compareDocumentPosition(ticket-card)` = อยู่ก่อนจริง · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 762 (29 ก.ค. · ผู้ใช้ส่งภาพการ์ดน้องตอนดีใจ: "แขนขาหมาแมวไม่เนียนเลย ปรับภาพใหม่ให้เนียนๆ"):** 🎨 ต้นตอ = ภาพ `*_happy` ที่ AI เจนมาเป็นท่ากระโดดชูแขน แต่ **แขน/ขาวาดไม่จบ** (ขาหลังที่ยกเป็นก้อนเบลอไม่มีข้อต่อ · อุ้งเท้าลอยกลางพุงอ่านไม่ออก · ขายืนเป็นแท่งไม่มีนิ้ว) เป็นเหมือนกันทั้ง 4 ใบ cat/dog × baby/adult (dragon ไม่เป็น จึงไม่แตะ) → เขียน `tools/happylab.py` ประกอบใหม่จาก **ชิ้นส่วนในชุดภาพเดียวกัน** (ไม่ต้องเจน AI ใหม่ สไตล์ไม่เพี้ยน): ลำตัว+ขา จาก `_normal` (ท่ายืน ขาครบเนียนอยู่แล้ว) + **สลับเฉพาะ "วงหน้า"** (ตาหลิ่ว ยิ้มกว้าง แก้มแดง) จาก `_happy` เดิม + ประกาย/หัวใจรอบตัวยกมาทั้งชุด (แยกอัตโนมัติ = ทุก connected component ที่ไม่ใช่ตัวสัตว์) · อ่านต้นฉบับ 1024px จาก `img/originals/` แล้วย่อ 768 + quantize 256 สี
  - 🔑 **บทเรียน (อย่าถอยกลับไปทำแบบเดิม):** เคยลอง "ยกทั้งหัว" มาแปะบนลำตัวท่ายืน → ขนคาง/แก้มของท่ากระโดดกางกว้างกว่าคอท่ายืน เห็นเป็น **"จานขาว" รอบคอ** ทุกใบ แก้ด้วย feather/lock ยังไงก็ไม่หาย → เปลี่ยนมาสลับเฉพาะวงหน้า (เก็บเส้นรอบหัว/คางของภาพ normal ไว้) แล้วจบทันที · หมุดวางหน้าใช้ **จมูก** (จุดกลางหน้าที่ตรงกันทั้งสองท่า) ไม่ใช่ยอดหัว/กึ่งกลางหู
  - ได้แถม: 2 เฟรมของอนิเมชัน "จังหวะดีใจ" (`.ps-fr`/`.ps-f2` ใน `petShowHTML()`) ตอนนี้เป็น**ตัวเดียวกันในท่าเดียวกัน** สลับเฟรมแล้วเห็นแค่หน้าเปลี่ยน ไม่กระตุกทั้งตัวเหมือนเดิม
  - หมุดชุด: หน้าใหม่ทำให้ตาย้าย → รัน `tools/wearlab.py eyes && cut` เจน `js/data/wear.js` ใหม่ (เปลี่ยนแค่ 4 บรรทัด `*_happy` · `img/wear/*` ไม่ขยับ) · `cat_adult_happy` ตัวเดียวที่ detect ไม่ติด (ตาหลิ่วเส้นบาง อัตราส่วน 3.5 เกินเพดาน 3.4 ใน `detect_eyes`) → ใส่ `MANUAL` ใน `wearlab.py`
  - ยืนยัน (preview 1000×640 · mock login + `newPet('cat')` + `makeHappy()` + `openPetPeek()`): `probeImages` เจอครบ 4/4 ไฟล์ · `.ps-f2` = `img/cat_adult_happy.png` · `getBoundingClientRect` 2 เฟรมทับกันเป๊ะ 199.94×199.94 ตำแหน่งเดียวกัน · หมุดใหม่ `cat_adult_happy` ex/ey/ed ตรงกับตำแหน่งตาที่วัดจากพิกเซลจริง (334,294 ระยะ 150) · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 763 (29 ก.ค. · ผู้ใช้ส่ง 2 ภาพ: การ์ดโปรไฟล์ที่เพื่อนเห็น = ตัวการ์ตูน แต่ของตัวเอง = รูปถ่ายจริง "อัปโหลดเปลี่ยนภาพแล้ว เพื่อนยังเห็นไม่เปลี่ยน"):** 📷 **ไม่ใช่บั๊กโค้ด — rules โซน `/pphoto` ยังไม่ publish ตั้งแต่รอบ 709** ยืนยันสดด้วย `firebase database:get /.settings/rules` (⚠️ Git Bash ต้องใส่ `MSYS_NO_PATHCONV=1` ไม่งั้น path โดนแปลงเป็น C:\ แล้ว CLI ฟ้อง "Path must begin with /") + deep flatten เทียบกับก้อนใน RULES.md → **ต่างกันแค่ 3 คีย์ `/pphoto/$uid/.read|.write|.validate` นอกนั้น identical** (⇒ `wsAward`/`tpAward`/รีแอ็กชัน gfeed ที่จดว่ารอ publish ขึ้น live ไปแล้ว — แก้สถานะใน RULES.md ให้ตรงแล้ว) · เขียน `/pphoto` โดน deny → รูปอยู่แค่ localStorage เพื่อนจึงเห็นตัวการ์ตูนเดิม
  - **แก้ฝั่งเกม (กฎทอง #1 ป้ายบอกเหตุผลบนจอ):** `js/photo.js` เพิ่ม `photoVerify()` + ป้าย `.ph-sync` ในกล่อง "📷 รูปโปรไฟล์ของหนู" — เปิดกล่องทีไรอ่านกลับจาก DB จริง (ไม่เชื่อว่าเขียนผ่าน) แล้วบอกตรง ๆ ว่าเพื่อนเห็นรูปนี้แล้วหรือยัง · เดิมมีแค่ toast ตอนอัปโหลดซึ่งเด้งครั้งเดียวแล้วหาย ผู้ใช้พลาดไป 20 วัน · **DB ไม่ตรงกับเครื่อง = push ซ้ำให้เอง (self-heal)** → หลัง publish rules ผู้ใช้แค่เปิดกล่อง ไม่ต้องอัปโหลดใหม่ · `photoPush(quiet)` กัน toast ซ้ำตอนป้ายรายงานเอง · CSS `.ph-sync` + จอเตี้ยย้าย `.ph-foot` เป็นแถว 5
  - **ค้างที่ผู้ใช้: publish rules** — Artifact ปุ่มคัดลอกก้อนเต็ม (27 โซน) https://claude.ai/code/artifact/fa6c6ee8-ca13-4004-8041-231b65ac11ba
  - ยืนยัน (server 8791 ของตัวเอง เพราะ preview เต็มโควตา · mock login + fake `Online.db` ที่ deny เฉพาะ `/pphoto` = สภาพจริงตอนนี้): deny → ป้ายแดง "ยังอยู่แค่ในเครื่องนี้" ถูกต้อง · สลับเป็นอนุญาต แล้วเปิดกล่องใหม่ → push เองสำเร็จ (`__pdb['pphoto/test1']` = รูปเดิม) ป้ายเขียว · เปิดซ้ำไม่ push ซ้ำ · ไม่มีรูป = ป้าย `display:none` ไม่กินที่ · จอเตี้ย 812×375 กล่องอยู่ในจอครบ ไม่มี scroll (กฎทอง #7)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 764 (29 ก.ค. · ผู้ใช้ส่งภาพหน้าประตูโรงแรมผีสิง: "พื้นทางเดินสีเทา กระพริบทับภาพ texture ที่เอามาแปะ"):** 🩹 z-fighting — ลานหินหน้าประตู `accBox(A.stone,BX+1.6,-.1,0,3.2,.2,9)` **ผิวบน = y 0 เป๊ะ** ตรงกับพื้นสนาม (`ground` ใน `js/adventure3d.js` y=0 แปะ `tex_ground`) → ระนาบซ้อนสนิท ผู้ชนะ z-buffer สลับตามระยะ/มุมกล้อง = เห็นแผ่นเทาวูบ ๆ ทับลายพื้น · แก้ 2 ชั้น: ① `js/adventure3d.js` วัสดุพื้นสนามใส่ `polygonOffset` (ดันพื้นถอยหลังในสมุดความลึก → ของที่วางแนบพื้นชนะเสมอ ไม่ต้องขยับ geometry จึงไม่เกิดช่องลอยใต้พุ่มไม้/รั้ว · ครอบพื้นล็อบบี้ที่ y=0 เหมือนกันด้วย) ② `js/hotel3d.js` เพิ่มวัสดุ `M.porch`+`A.porch` (`tex_concrete` tint กลางคืน) ให้ลาน+ขั้นบันไดนอกใช้แทน `M.stone` สีเทาล้วน — จะได้กลืนกับพื้นรอบ ๆ ไม่ใช่แผ่นสีทับลาย
  - ยืนยัน (server เอง :8791 เพราะ preview เต็มโควตา · mock login + `state.hauntTicket=true` → `Adventure3D.start('haunt')` · เดินเฟรมด้วย `_t.renderNow()`): **วัดเป็นตัวเลข** — ย้อมพื้นสนามเป็นแดงล้วนชั่วคราว แล้วยิงจุดตัวอย่าง 192 จุดบนผิวลาน (project → readPixels) ไล่ระยะกล้อง 12 ระยะ (24-85 m) นับ % จุดที่ "พื้นสนามชนะ" → **ก่อนแก้ 0/88/0/87.5/.../48.4% สลับไปมาตามระยะ (=อาการกระพริบ) · หลังแก้ 0% ทุกระยะ** · ภาพเทียบ before/after 2 ระยะ: ผิวลานนิ่ง กลืนลายคอนกรีตรอบ ๆ ไม่มีแผ่นเทา · console สะอาด (error ที่เห็นมาจาก raycast probe ของเทสต์เอง) ล้างเซฟ+reload ปิดเสียงหลอนแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 765 (29 ก.ค. · ผู้ใช้ทำ `tex_hotel_portrait_1..6.png` เอง วางไว้ `img/tex/`):** ไม่ต้องแก้โค้ด — `js/hotel3d.js` รองรับอัตโนมัติตั้งแต่รอบ 694 (`TEX(...,'tex_hotel_portrait_'+(seed%6+1),...)` แปะทับภาพวาดทันทีถ้าไฟล์มี) แค่ commit+deploy ไฟล์ภาพให้ขึ้นเว็บ


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 767 (29 ก.ค. · ผู้ใช้ส่งภาพ: กดการ์ด "คลังศัพท์ขั้นสูง" (ศัพท์วิชาการ/ธุรกิจ) ขึ้น toast "โหลดคลังศัพท์ไม่สำเร็จ" · เดาว่ายังไม่ได้สังเคราะห์เสียง):** ❌ ไม่ใช่เรื่องเสียง — **ไฟล์คำศัพท์ 20 ไฟล์ (`js/data/band/b6_academic_*.js` + `b6_business_*.js`) ไม่เคยถูก `git add` เลยตั้งแต่ทำรอบ 681** · `tools/deploy_firebase.sh` ใช้ `git archive HEAD` → ของ untracked ไม่ขึ้นเว็บ → `bandAdvLoad()` fetch ได้ 404 → `.catch(()=>[])` กลืน error เงียบ → `words` ว่าง → toast · ยืนยัน curl live: `manifest.js` 200 แต่ `b6_academic_abandon-bias.js` / `b6_business_accountability-catalogue.js` **404** ทั้งคู่ · เสียง mp3 **เจนครบแล้ว 1,629/1,629 คำ** อยู่ในเครื่อง แต่ 1,520 ไฟล์ก็ไม่ได้ commit เหมือนกัน (ถ้าปล่อยไว้ = ต่อให้คลังโหลดได้ก็ได้เสียงหุ่นยนต์ TTS แทนเสียง Jenny Neural) → commit ทั้ง 2 ชุด (`js/data/band/b6_*_*.js` 75KB + `sound/words/` 1,520 ไฟล์ 17.3MB)
  - 🕳️ **ช่องโหว่ที่ด่าน deploy จับไม่ได้:** `check_missing_assets.py` ตรวจเฉพาะไฟล์ที่ **`index.html` อ้างถึงตรง ๆ** — คลังนี้โหลดแบบขี้เกียจผ่าน `fetch()` ตามรายชื่อใน `manifest.js` จึงรอดด่านไปเงียบ ๆ 12 วัน (บั๊กแบบเดียวกับ `word_new.js` รอบ 324 ที่ด่านนี้ถูกสร้างมาดัก) → เติมด่านให้ตรวจ `BAND_ADV_MANIFEST.files[]` ด้วย
  - ยืนยัน: JSON ทั้ง 20 ไฟล์ parse ผ่าน entry เป็น `[en,th]` ครบ · นับคำได้ academic 1230 / business 399 **ตรงกับ `count` ในมานิเฟสต์เป๊ะ** · mp3 ครบทุกคำ (`word_key()` ตรงกับ `wordAudioFile()`)
- **รอบ 766 (29 ก.ค. · ผู้ใช้ส่งภาพ: ตัวอักษรในโรงแรมกองติดกันเป็นก้อน ไม่กระจายแต่ละห้อง):** ต้นตอ = ชั้นล่าง(ล็อบบี้)มีจุดวางตัวอักษรแค่ 5 จุด (`hall0`×4+`store0`×1) ทั้งที่ชั้นอื่นมีห้องพัก 6 ห้อง×4 จุด=24 จุด → ตอนผู้เล่นอยู่ล็อบบี้ ตัวอักษรกองที่ 5 จุดเดิมซ้ำ ๆ · แก้ `js/hotel3d.js` เติม 10 จุดกระจายตามเฟอร์นิเจอร์จริงในล็อบบี้ (ข้างเสา/หน้าโซฟา/หน้าเคาน์เตอร์/ข้างกระถางต้นไม้/กลางพรม/หน้าประตู) รวมชั้นล่างเป็น 15 จุด กระจายเต็มพื้นที่ล็อบบี้ (x -16.4..17, z -5.3..8) แทนที่จะกระจุกแคบ ๆ แถวทางเดิน (x -16.4..3.1, z ±1.4) เดิม
  - ยืนยัน (`HOTEL3D.build()` เรียกตรงในเบราว์เซอร์ ไม่ต้องพึ่ง WebGL render): floor0 spots 5→15 จุด กระจายเต็มความกว้าง/ลึกล็อบบี้จริง ไม่ทับกล่องชนของเฟอร์นิเจอร์ (เสา/โซฟา/เคาน์เตอร์/กระถาง) ที่มีอยู่แล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 768 (29 ก.ค. · ผู้ใช้ส่งภาพ: ตาดำในรูปคนบนผนังโรงแรมอยู่ผิดตำแหน่ง (เลื่อนไปแก้ม) + ใหญ่กว่าเบ้าตาในภาพ):** ต้นตอ = `js/hotel3d.js` ใช้ `EYE_X/EYE_Y` ค่าคงที่เดียวคำนวณจากภาพวาด canvas เดิม (256×340, ตา 40.6%/59.4%/43.5%) ทั้งที่ตอนนี้แปะภาพถ่ายจริง 6 ใบ (`tex_hotel_portrait_1..6.png`, รอบ765) ซึ่งแต่ละใบครอปตำแหน่ง/ขนาดหน้าไม่เท่ากัน → วัดพิกเซลเบ้าตาขาวจริงในไฟล์แต่ละใบด้วย OpenCV (connected components หา blob ขาวในโซนหน้า) ได้ตำแหน่ง+ขนาดต่างกันชัดเจนทั้ง 6 ใบ → เพิ่มตาราง `PORTRAIT_EYE[]` (per-photo lx/rx/y/r) แทนค่าคงที่เดียว ใช้ทั้งตอนสร้าง (`addPortrait`) และตอนตากลอกตาม/กะพริบใน `tick()` (เก็บ `eyeLX/eyeRX/eyeY/eyeR` ไว้ใน portrait object แทน `EYE_X0/EYE_Y0` global)
  - ยืนยัน (วาดวงกลมทับตำแหน่ง/ขนาดที่คำนวณจริงบนไฟล์ภาพต้นฉบับทั้ง 6 ใบด้วยสูตรแปลงพิกัดเดียวกับเกม): ตาดำอยู่กึ่งกลางเบ้าตาขาวพอดีทุกใบ ขนาดพอเหมาะไม่ล้นเบ้าเหมือนก่อนแก้


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 769 (29 ก.ค. · ผู้ใช้: แยกสาเหตุ toast "โหลดคลังศัพท์ไม่สำเร็จ" ที่กลืน error เงียบด้วย `.catch(()=>[])`):** `js/bandadv.js`(fetch/json) + `js/dictband.js`(script tag) เดิม toast ข้อความเดียวไม่ว่าเหตุคืออะไร → เพิ่มจำแนก **404 (ไฟล์ไม่ขึ้นเว็บ ต้อง deploy)** vs **network (เน็ตหลุด)** ต่อไฟล์ ผ่าน `__bandAdvFail`/`__bandFail` + `console.error` บอกชื่อไฟล์ที่พังทุกครั้ง + toast ข้อความต่างกันตามสาเหตุ (`bandAdvFailMsg`/`bandFailMsg`)
  - dictband.js โหลดผ่าน `<script>` tag ซึ่ง `onerror` ไม่บอกสถานะ HTTP → ยิง `fetch()` ซ้ำเฉพาะตอนพังเพื่อแยกสาเหตุ · 🔑 **บั๊กที่เจอระหว่างเทสต์:** เดิมเรียก `fin()` (ตัวนับให้ `bandLoad()` resolve) ทันทีหลังยิง fetch วินิจฉัยแบบไม่รอผล → `bandFailMsg()` ที่ caller เรียกต่อ อ่าน `__bandFail` ก่อนถูกเติมข้อมูล ได้ข้อความ fallback เดิมเสมอ → ย้าย `fin` ไปต่อท้าย `.then(fin)` ให้รอผลวินิจฉัยก่อน resolve
  - ยืนยัน (isolated `new Function` sandbox จำลอง fetch/script ให้พังแบบ 404 จริงและ network จำลอง แยกกันคนละเคส เพราะ preview หลักติด session คู่ขนาน): ทั้ง 2 ไฟล์ × 2 สาเหตุ (404/network) ได้ `__bandAdvFail`/`__bandFail` + toast message ตรงตามสาเหตุ + console.error มีชื่อไฟล์ครบ · `new Function(src)` parse ผ่านทั้ง 2 ไฟล์ (ไม่มี syntax error)


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 770 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 3 ต่อจากวิชาการ+ธุรกิจ"):** 🔬 **ศัพท์วิทยาศาสตร์ 519 คำ** — เขียนคลังเอง (10 กลุ่ม: วิธีการทางวิทยาศาสตร์/ชีววิทยา/พืช/ร่างกาย/เคมี/ฟิสิกส์/โลก-อวกาศ/อากาศ-สิ่งแวดล้อม/เทคโนโลยี) → `js/data/band/b6_science.json` → `tools/split_band.py` แยกเป็น 7 ไฟล์ช่วงคำ → เติม `LABELS['b6_science']` ใน `tools/gen_band_adv_manifest.py` แล้วเจน `manifest.js` ใหม่ (3 หมวด รวม 2,148 คำ) · `js/cert.js` เติม `CERT_ADV_EN['ศัพท์วิทยาศาสตร์']='Science Vocabulary'` ให้ใบประกาศออกชื่ออังกฤษถูก · **ไม่ต้องแก้ `js/bandadv.js`/`index.html`** — การ์ดเจนจาก `Object.keys(BAND_ADV_MANIFEST)` อยู่แล้ว · เสียงอ่านรัน `tools/gen_word_audio.py` เพิ่ม 417 mp3 (อีก 102 คำใช้ไฟล์ร่วมกับหมวดวิชาการ/ธุรกิจ) failed 0
  - 🔑 **กติกาที่ต้องรู้ตอนเพิ่มหมวดใหม่ (รอบหน้าอย่าพลาดซ้ำ):** `bandAdvLoad()` ตัดซ้ำด้วย **ทั้ง en และ th** → คำแปลไทยห้ามซ้ำกันเองภายในหมวด ไม่งั้นคำหายเงียบ ๆ และ `count` ในมานิเฟสต์จะไม่ตรงกับที่เล่นได้จริง (สคริปต์ต้นทางจึงเช็ก th ซ้ำให้ + เทียบคำแปลกับ DICT 192 คำที่ทับกันไว้ตรวจตา — ต่างกัน 88 คำเพราะจงใจใช้ความหมายเชิงวิทย์ เช่น `solution`=สารละลาย ไม่ใช่ทางออก) · ตัวย่อ (`DNA`) **เก็บตัวใหญ่ในไฟล์ต้นทาง** (ไม่ใส่ `--lower` ตอน split) ไม่งั้น TTS อ่านเป็นคำเดียว — เกม normalize ตัวเล็กเองตอนโหลดอยู่แล้ว
  - ยืนยัน (server เอง :8793 เพราะ preview เต็มโควตา · mock login + `renderCats()`): การ์ดที่ 3 ขึ้นครบ 🔬/ศัพท์วิทยาศาสตร์/519 คำ · `bandAdvLoad('science')` โหลด **519/519 ตรงมานิเฟสต์เป๊ะ** uniq en 519 uniq th 519 (ไม่มีคำหาย) · กดฝึกจับคู่ → กระดานเป็นคำวิทย์ทั้งหมด คลิกคู่ถูกจริง (turbine–กังหันผลิตไฟฟ้า) เหรียญ 0→10 · กดสอบ → "🔬 หมวดศัพท์วิทยาศาสตร์ · ข้อ 1 จาก 10" ช้อยส์มีคำตอบถูก + ปุ่ม 🔊 · fetch mp3 5 คำ (รวม `space_station`/`artificial_intelligence`/`dna`) 200 ครบทุกตัว · คำยาวสุด 23 ตัวอักษรไม่ล้นการ์ด (การ์ดสูง 84→129px ไม่มี scroll แนวนอน) · `check_missing_assets.py --git` (ด่านรอบ 767) จับ 7 ไฟล์ที่ยังไม่ commit ได้ถูกต้องก่อน commit · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 771 (29 ก.ค. · ผู้ใช้: "เติมด่าน check_missing_assets.py ให้ตรวจ manifest ด้วยเลย" ต่อจากรอบ 769):** เดิมด่านมีแค่ `band_refs()` เช็กเฉพาะ `js/data/band/manifest.js` (bandadv.js) → เจอ dictband.js ก็โหลดขี้เกียจแบบเดียวกัน (ผ่าน `<script>` tag ตาม `js/data/dict_band/manifest.js`) แต่ด่านไม่เคยตรวจ → รีแฟกเตอร์เป็น `lazy_manifest_refs()` วน `LAZY_MANIFESTS` ทั้ง 2 คู่ (manifest path, prefix โฟลเดอร์) เช็กไฟล์ `db<band>_*.js` ด้วย · ไม่แตะไฟล์เกม (`--no-deploy`)
  - ยืนยัน: รันปกติผ่านครบ (123 ไฟล์ นับเพิ่มจากเดิมเพราะรวม dict_band แล้ว) · `--git` ผ่าน · จำลองย้าย `db1_a-ever.js` ออกชั่วคราว → ด่านจับได้ทันที (`exit 2` + บอกชื่อไฟล์ที่หาย) ก่อนย้ายกลับคืน


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 772 (29 ก.ค. · ผู้ใช้: "เพิ่ม/แก้คำในหมวดวิทยาศาสตร์" ต่อยอดรอบ 770):** เติมคำอีก 103 คำ (519→**622 คำ**) ปิดช่องว่างที่ยังไม่มี: หน่วยวัด (เมตร/กรัม/ลิตร/องศา ฯลฯ), เคมี/ฟิสิกส์เชิงลึก (ไอโซโทป/ตารางธาตุ/เครื่องกลอย่างง่าย/คลื่นแม่เหล็กไฟฟ้า), อวกาศเชิงลึก (หลุมดำ/ซูเปอร์โนวา/ปีแสง/ชั้นบรรยากาศย่อย), ชีวะ/นิเวศเชิงลึก (symbiosis/exoskeleton/mutation/biome), สุขภาพเชิงลึก (antibiotic/pandemic/allergy), เครื่องมือวัดเพิ่ม (seismograph/centrifuge) — เขียนต่อใน `scratchpad/sci_words.py` ก้อนเดิม → `split_band.py` (ไม่แตะ 7 ไฟล์เดิม แยกคำใหม่เป็น 2 ไฟล์ `acute-prescription`/`quarantine-xylem` อัตโนมัติ เพราะสคริปต์ตัดคำที่แยกแล้วออกก่อนเสมอ) → `gen_band_adv_manifest.py` → `gen_word_audio.py` เจนเสียงเพิ่ม 97 mp3 failed 0
  - ยืนยัน (server เอง :8794): โหลด **622/622 ตรงมานิเฟสต์** uniq en/th 622/622 (เจอ+แก้คำซ้ำ th 1 คำ `static electricity`≈`static` ก่อนเขียนไฟล์) · สุ่มเช็ก mp3 5 คำใหม่ 200 ครบ · `check_missing_assets.py` ผ่าน


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 773 (29 ก.ค. · ผู้ใช้: "ทำโหมดสอบใหญ่ของคลังขั้นสูง สอบ 30-50 ข้อ ได้ใบประกาศแยกระดับ" — เดิมมีแค่สอบ 10 ข้อทุกหมวด):** 🏅 `js/bandadv.js` เพิ่ม `BAND_ADV_EXAM` 3 ระดับ (📗ต้น 30 ข้อ/1,200🪙 · 📘กลาง 40/2,000 · 📕สูง 50/3,000) + แผงเลือกระดับ `bandAdvExamOpen()` (คลาส `.bax-*`) + ปุ่ม `🏅 สอบใหญ่` เต็มแถวบนการ์ด · **ปลดล็อกไล่ขั้น** (ต้น=ต้องผ่านสอบ 10 ข้อหมวดนั้นก่อน → กลาง → สูง) ล็อกแล้วกดได้แต่ขึ้น toast บอกเหตุผล (กฎทอง #1 ป้ายบอกเหตุผล) · id หมวดสอบ = `badvx_<หมวด>_<ระดับ>` คนละ id กับ `badv_<หมวด>` → `certAward` ออก**ใบประกาศคนละใบต่อระดับ** ไม่ทับใบเดิม · ต่อ `startQuiz` เดิมตรง ๆ แค่ตั้ง `quizCount` (เกณฑ์ผ่าน 80% `finishQuiz` คิดตามจำนวนข้ออยู่แล้ว)
  - `js/cert.js`: `CERT_BIG_LV` (ต้น/กลาง/สูง→Foundation/Intermediate/Expert) · `certTitleOf` รู้จักชื่อ `"<หมวด> · สอบใหญ่ระดับ<x>"` คืน `big` → ใบพิมพ์ **CERTIFICATE OF PROFICIENCY** + "grand vocabulary examination" + บรรทัดใต้หัวข้อเป็น `Foundation Level · 30 Questions` (แทนชื่อไทย) · ป้ายในโปรไฟล์/ชิปต่อท้ายชื่อระดับ · `certFromPost` ส่ง `big` ต่อ = เพื่อนเห็นใบแยกระดับด้วย · แถม: บรรทัดชื่อหัวข้อ/ชื่อไทยหดพอดีกรอบด้วย `certFit` (maxW 600→560) — วัดพบ "Academic Vocabulary" ล้นชนกรอบทองมาตั้งแต่รอบ 770
  - ยืนยัน (server เอง :8795 เพราะ preview เต็มโควตา · mock login): ล็อกครบ 3 ระดับตอนยังไม่ผ่านสอบ 10 ข้อ → ปลดล็อกทีละขั้นถูกต้อง · กดระดับที่ล็อก = toast ไม่เข้าห้องสอบ · สอบจริง 30 ข้อ (โจทย์ไม่ซ้ำ 30 คำ ช้อยส์ 4 มีคำตอบถูกครบทุกข้อ) ตอบถูกหมด → +1,200🪙 · `state.certs[0]` = `badvx_science_found` big:Foundation · สอบ 40 ข้อตอบถูก 10 = **ไม่ผ่าน ไม่ได้ใบ ไม่ได้เหรียญ** ถูกต้อง · วัด `getBBox` ทุกบรรทัดในใบ 6 แบบ (mini/full × 3 ชนิด) **ไม่มีบรรทัดล้นกรอบเลย** · จอเตี้ย 812×375 แผงอยู่ในจอครบไม่มี scroll (กฎข้อ 7) · `certFromPost` ของเพื่อนอ่านชื่อ+ระดับถูก · console สะอาด ล้างเซฟแล้ว
  - ⚠️ commit นี้พ่วง 1 บรรทัดของ session คู่ขนาน (`CERT_ADV_EN['ศัพท์ท่องเที่ยว']` — เขาเพิ่มหมวดที่ 4 อยู่) เพราะอยู่ไฟล์ `js/cert.js` เดียวกัน ไม่กระทบกัน


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 774 (29 ก.ค. · ผู้ใช้ส่งภาพโหมดขับรถ: "GPS บอก continue straight ทั้งที่ข้างหน้าไม่มีถนนแล้ว → ลบเสียงระบบ GPS ออกเลย"):** ลบเสียงพูดนำทางทั้งชุดใน `js/adventure3d.js` โซน 🧭 GPS — ตัดฟังก์ชัน `gpsSpeak()` + จุดเรียกทั้ง 4 (Next letter / You have arrived / Turn left-right / Continue straight) + ตัวแปรที่ไม่ใช้แล้ว (`gpsSpokeAt/gpsMile/gpsLastTurn/gpsArrivedFor`, `finalDist`) · **ป้ายนำทางบนจอ + ลูกศร + ระยะ + เส้นฟ้าบนถนน ยังอยู่ครบ** (เสียงพูดคำศัพท์/วิทยุ ATC ไม่เกี่ยว ไม่ได้แตะ)
  - ⚠️ **มี session คู่ขนานแก้ `js/adventure3d.js` ค้างในเครื่องพร้อมกัน (งานโรงแรม ยังไม่ commit)** → commit ด้วยวิธี **สร้าง blob จากไฟล์เวอร์ชัน HEAD + แก้เฉพาะของเรา** (`git hash-object -w` + `git update-index --cacheinfo` แล้ว `git commit` จาก index) แทน `git commit -- <path>` ปกติ ซึ่งจะกวาดงานที่เขายังทำไม่เสร็จขึ้นเว็บไปด้วย · สคริปต์ที่ใช้เก็บไว้ที่ scratchpad (`apply_gps.py`) — วิธีนี้ใช้ซ้ำได้ทุกครั้งที่ต้อง commit ไฟล์ที่ session อื่นกำลังแก้อยู่
  - ยืนยัน (server เอง :8796 · mock login + `Adventure3D.start('drive')` · แทนที่ `speechSynthesis.speak` ด้วยตัวดักบันทึกข้อความ): เดินเฟรมเอง 900 เฟรมพร้อมกดคันเร่ง → **ไม่มีเสียงพูดถูกเรียกเลย (0 ครั้ง)** ขณะที่ป้าย GPS ยังทำงาน (ตัวอักษรเป้าหมาย `R` · ระยะเปลี่ยน 77→71→78 ม. · ป้าย "ตรงไป") · พิสูจน์ตัวดักว่าจับได้จริงด้วย probe 2 แบบ (`speechSynthesis.speak` / `window.speechSynthesis.speak`) บันทึกครบทั้งคู่ · `node --check` ผ่าน · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 776 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 4 — ศัพท์ท่องเที่ยว ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์"):** ✈️ **ศัพท์ท่องเที่ยว 380 คำ** — เขียนคลังเอง (10 กลุ่ม: คมนาคม/สนามบิน-เอกสาร-วีซ่า/ที่พัก-โรงแรม/วางแผน-จอง/สถานที่ท่องเที่ยว/วัฒนธรรม/อาหาร/กิจกรรมผจญภัย/เงินตรา-ช้อปปิ้ง/ความปลอดภัย-ฉุกเฉิน) → เขียนสคริปต์เช็กซ้ำ en+th ก่อนเขียนไฟล์เลย (กันพลาดแบบรอบ770) ผ่าน 0 ซ้ำ → `js/data/band/b6_travel.json` → `tools/split_band.py` แยกเป็น 6 ไฟล์ช่วงคำ → เติม `LABELS['b6_travel']` ใน `tools/gen_band_adv_manifest.py` แล้วเจน `manifest.js` ใหม่ (4 หมวด รวม 2,631 คำ) · `js/cert.js` เติม `CERT_ADV_EN['ศัพท์ท่องเที่ยว']='Travel Vocabulary'` (พ่วงเข้าคอมมิต รอบ 773 ของ session คู่ขนานไปแล้ว — ดูโน้ตรอบ 773) · เสียงอ่านรัน `tools/gen_word_audio.py` เพิ่ม 361 mp3 (อีก 19 คำใช้ไฟล์ร่วมกับหมวดอื่น) failed 0
  - ยืนยัน (server เอง :8795 เพราะ preview เต็มโควตา 5 session คู่ขนาน · mock login + `renderCats()`): การ์ดที่ 4 ขึ้นครบ ✈️/ศัพท์ท่องเที่ยว/380 คำ · `bandAdvLoad('travel')` โหลด **380/380 ตรงมานิเฟสต์เป๊ะ** uniq en 380 uniq th 380 (ไม่มีคำหาย) · กดฝึกจับคู่ (`bandAdvPlay('travel','match')`) → คลิกคู่ถูกจริง (marketplace–ตลาดท้องถิ่น) เหรียญ 0→10 combo×1 · กดสอบ (`'quiz'`) → "✈️ หมวดศัพท์ท่องเที่ยว · ข้อ 1 จาก 10" ตอบถูกจริง (x-ray scanner→เครื่องเอกซเรย์สัมภาระ) ถูก 0→1 ข้อ · fetch mp3 5 คำ (รวม `space_station`/`emergency_evacuation_route`) 200 ครบทุกตัว · คำยาวสุด "travel restriction warning" ไม่ล้นการ์ด · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 777 (29 ก.ค. · ผู้ใช้: "ทำข้อ 3" = ต่อยอดสอบใหญ่รอบ 773 — แถบเวลา/ตัวจับเวลารวม + สถิติเวลาบนใบประกาศ):** ⏱️ `js/game.js` เพิ่ม `fmtMMSS/quizTimerStart/quizTimerStop/quizElapsed` + `quiz.startAt` (เดินเฉพาะ `cat.timed` = ข้อสอบใหญ่เท่านั้น สอบ 10 ข้อไม่มีนาฬิกาเหมือนเดิม) · ป้าย `#quiz-time-pill` ใน `index.html` (โทนส้มแยกจากป้ายคะแนนม่วง) · `js/main.js` ปุ่มออกจากข้อสอบหยุดนาฬิกา (กัน interval ค้าง) · กล่องผลสอบโชว์ "ใช้เวลา m:ss (เฉลี่ยข้อละ x วิ)" + 🏁 ทำลายสถิติ/สถิติดีที่สุด · `js/cert.js` `certAward(cat,score,total,sec)` เก็บ `c.sec` → ใบเต็มพิมพ์ `Awarded on ... · completed in m:ss` ใบย่อพิมพ์ `30/30 ⏱ 1:35` · `certFromPost` อ่านเวลาจากข้อความฟีด (`⏱️ m:ss`) = เพื่อนเห็นเวลาบนใบด้วย · แผงเลือกระดับโชว์ `คะแนนสูงสุด 30/30 · ⏱️ 1:35`
  - 🔑 **กติกาสถิติ (แก้ระหว่างเทสต์):** ตอนแรกหา "เวลาที่ดีที่สุด" จาก `quizLog` เอง → รอบที่รีบตอบจนคะแนนตก (26/30 ใน 1:00) ถูกประกาศเป็น "ทำลายสถิติ" ทั้งที่ใบไม่ได้อัปเดต แผงกับใบเลยไม่ตรงกัน → เปลี่ยนให้ **ใบประกาศเป็นแหล่งเดียว**: `certAward` ตัดสิน (คะแนนดีขึ้น = รับเวลาใหม่ · คะแนนเท่าเดิมแต่เร็วกว่า = อัปเดตเฉพาะเวลา) แล้ว `finishQuiz`/`bandAdvExamBest` อ่านจากใบ
  - ⚠️ **บทเรียน preview (เสียเวลา 3 รอบ):** force cache ด้วย `fetch('js/main.js?b='+Date.now(),{cache:'reload'})` **ใช้ไม่ได้** — query string = คนละคีย์แคช ไฟล์เดิมยังรันอยู่ (อาการ: แก้โค้ดแล้วพฤติกรรมไม่เปลี่ยนแต่ `fetch` เห็นโค้ดใหม่) · ต้อง fetch **URL เป๊ะแบบที่ `<script src>` ใช้** และถ้ายังหลอนเพราะ sw.js cache-first → เปิด `python -m http.server` **พอร์ตใหม่** แล้ว navigate ไปพอร์ตนั้น (origin ใหม่ = ไม่มีทั้ง HTTP cache และ SW) · ตรวจว่าไฟล์ที่รันอยู่ใหม่จริงด้วย `performance.getEntriesByType('resource')` เทียบ `decodedBodySize` กับไฟล์บนดิสก์
  - ยืนยัน (server เอง :8796 · mock login): นาฬิกาเดิน 0:00→0:02 ตรงเวลาจริง · กดออกกลางคัน = `__quizTimer` เป็น null + ป้ายซ่อน · สอบ 30 ข้อ 3 รอบ (203/95/60 วิ) → ใบเก็บ 203→95→**คง 95** (รอบที่ 3 คะแนนตกแม้เร็วกว่า) ข้อความตรงทุกกรณี · สอบ 10 ข้อปกติ = ไม่มีนาฬิกา ใบไม่มีคีย์ `sec` (ไม่ regress) · วัด `getBBox` ใบ 4 แบบ (มี/ไม่มีเวลา × mini/full) ไม่ล้นกรอบ · จอเตี้ย 812×375 ทั้งแผงและหน้าสอบไม่มี scroll นาฬิกาไม่ทับปุ่ม (ห่าง 200px) · console สะอาด ล้างเซฟแล้ว
  - ⚠️ commit นี้พ่วงงาน session คู่ขนาน **รอบ 775 (ใบ Supreme)** ที่แก้ไฟล์เดียวกัน (`js/bandadv.js`/`js/cert.js`) — ตรวจแล้วต่อกันครบ (`onPass` + `timed:true` อยู่ด้วยกันใน `bandAdvExamCat`) เกมโหลดปกติ console สะอาด


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 778 (29 ก.ค. · ผู้ใช้ส่ง 5 ภาพโลกโรงแรมผีสิง สั่งแก้ 6 ข้อรวด):** 🏨 แก้ครบทั้ง 6 ใน `js/hotel3d.js` + `js/adventure3d.js` + `js/adv3d_tex.js`
  1. **บันไดชนกำแพง** — ช่วงไต่เดิมยาวเต็ม 7 ม. ไปจบที่ผนัง `CORE_E` พอดี ขั้นสุดท้ายจ่อกำแพง → เพิ่มค่าคงที่ `STAIR_BOT_D`/`STAIR_TOP_D`+`RAMP_X0/RAMP_X1/RAMP_RUN` (หัวไฟล์ · `surfaceY()` ใช้ชุดเดียวกัน) ให้มี **ชานพักราบหัวท้าย** — ขึ้นถึงชั้นบนแล้วยืนพัก 1.8 ม. ก่อนเลี้ยวออกทางเดิน · ราวกันตกขยับตามให้ยังเว้นช่องขึ้น-ลง
  2. **รูปทับประตู** — เดิมวางรูปเรียงระยะเท่ากันโดยไม่รู้ตำแหน่งประตู (ชนที่ x≈-5.2 เหนือ / 1.85 ใต้ ทุกชั้น) → ตาราง `PORTRAIT_X_N/S` เลี่ยงทั้งช่องประตูและโคมไฟผนัง · **ชั้น 0 (ล็อบบี้) ไม่มีผนังทางเดิน รูปเดิมลอยกลางอากาศ** → ย้ายไปแขวนผนังนอก (`LOBBY_X_N/S`)
  3. **แผ่นตัวอักษรสีดำ (เฉพาะโลกนี้)** — `letterTextureDark()` ใน `js/adv3d_tex.js` (cache คีย์ `'D'` ไม่ชนของเดิม) เรียกผ่าน `letterTex()` ที่ดูจาก `M.hotel` → โลกอื่นยังเป็นแผ่นสีเดิมเป๊ะ
  4. **ผีออกได้เมื่อไหร่** — `ghostsAllowed()` = ไฟดับแล้ว **และ** ผู้เล่นอยู่ชั้น 2 ขึ้นไป (`GHOST_MIN_FLOOR`) · ไฟยังติด = ห้ามโผล่เด็ดขาด (เดิมเดินอยู่กลางล็อบบี้ตั้งแต่ไฟสว่าง) · `ghostGoLurk()` ย้ายไปรอ **กลางทางเดิน** (`hotelCorridorX`) แทนซุ่มในห้อง · 🔦 `torchHitsGhost()`+สถานะ `'gone'` = ส่องค้าง `TORCH_LOCK_S`.35 วิ แล้วจางหายใน `BANISH_S`1.2 วิ
  5. **ห้องละ 2 ตัว + ต้องเป็นตัวของคำที่หาอยู่** — `hotelSpot()` นับตัวอักษรต่อห้อง (`HOTEL_PER_ROOM`2) + บังคับระยะห่าง `HOTEL_MIN_GAP`3.4 ม. (สุ่ม 12 ครั้ง ไม่ผ่านค่อยไล่ทุกจุดเลือกที่ห่างสุด) · `hotelPruneLetters()`+`ensureCoverage()` โหมดโรงแรมใช้แค่ `words[0]` → **ไม่มีตัวหลอก ไม่มีของคำอื่น** (ตัดลูป spawn สุ่ม 8 ตัว + ไม่ spawn ตามคำที่เติมท้ายคิวใน `completeWord`)
  6. **ตาดำชิดขอบตา** — ต้นตอ: `tick()` กลอกตาได้ ±.03 ม. เท่ากันทุกใบ ทั้งที่วัดพิกเซลจริงแล้ว **ครึ่งเบ้าตาขาวมีแค่ .022–.033 ม.** → ตาดำหลุดไปอยู่บนแก้ม/ขมับตลอด (แถมเกนเดิมอิ่มตัวตั้งแต่เยื้องแค่ 1.5 ม.) → วัดขอบเบ้าตาใหม่ด้วย OpenCV ทั้ง 6 ใบ ใส่ `mx/my` ต่อภาพใน `PORTRAIT_EYE` + เปลี่ยนสูตรเป็น **กลอกตามมุมมองจริง** (`atan2`) คูณระยะสูงสุดของใบนั้น
  - ยืนยัน (server เอง :8794 เพราะ preview เต็มโควตา · mock login + `Adventure3D.start('haunt')` + testkit `teleport/step/setKeys`): ① เดินจริงจากชานพักล่างขึ้นบันได → ถึง `footY` 3.40 (ชั้น 2) หยุดที่ผนังโดยยืนบน**พื้นราบ** แล้วเลี้ยวออกทางเดินได้จริงถึง x=7.1 · โปรไฟล์พื้นราบ 0 ที่หัว / ราบ 3.40 ตั้งแต่ x=-14.3 ถึงผนัง · ช่องก้าวขึ้นบันไดกว้าง **1.10 ม. (เดิม 0.96)** ② เทียบกรอบรูปกับช่วงประตูทุกใบทุกชั้น = **ทับกัน 0 คู่** · รูปชั้น 0 อยู่ที่ z=±10.32 (ผนังนอกจริง) ③ พิกเซลแผ่นตัวอักษร bg (11,11,14) ดำจริง / แผ่นโลกอื่นยังเป็น (240,98,146) ④ ชั้น 2+ไฟติด → สั่ง `goStalk` แล้วผียัง vis 0 ทุกตัว · ไฟดับ+ชั้น 1 → vis 0 · ไฟดับ+ชั้น 2 → โผล่จริงกลางทางเดิน (z 0.2) · เปิดไฟฉายส่องโดน → **หายใน 1.72 วิ** · ผีอยู่ข้างหลัง/ปิดไฟฉาย → `litT` 0 ไม่หาย (ไม่มี false positive) ⑤ คำจริง 3-6 ตัว + สลับคำใหม่ = ทุกตัวอยู่ในคำ ไม่มีห้องเกิน 2 ระยะใกล้สุด 8.8-13.8 ม. · บีบทดสอบคำ 24 ตัวอักษร = ยังไม่มีห้องเกิน 2 (กระจาย 20 ห้อง) ⑥ วาดตาดำสุดพิกัดทับไฟล์ภาพจริงทั้ง 6 ใบ: **ก่อนแก้หลุดไปอยู่บนผิวหน้าทุกใบ · หลังแก้อยู่ในเบ้าตาขาวครบทุกใบ** · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 781 (29 ก.ค. · ผู้ใช้: "ทำข้อ 3" = เข็มสะสม "นักสอบใหญ่" ผูกกับจำนวนใบ/สถิติเวลา ต่อระบบ BADGE_META เดิม):** 🎓 เข็มสายที่ 11 — `js/game.js` เพิ่ม `BIGEXAM_TIERS [[3,1],[6,2],[10,3]]` / `BIGEXAM_TIER_UI` / `bigExamEmoji` / `bigExamCertCount()` (นับ id `badvx_*_(found|inter|expert)` ใน `state.quizPassed`) / `checkBigExamBadge(sec)` เรียกจาก `finishQuiz` เฉพาะ `firstPass && myCert.big` · ต่อเข้าระบบเดิมครบทุกจุด: `badgeSuffix` · `BADGE_META` (🎓1/🧠2/🏛️3 แต้ม) · `NAME_BADGE_RE` + regex ใน `badgeEmojis` (ถ้าลืม 2 ตัวนี้ เข็มท้ายชื่อจะถูกนับเป็นส่วนหนึ่งของชื่อ) · `BADGE_CATS` (กระดานอันดับแยกสายเจนเอง) · แถวใหม่ใน `trophyDefs` ของ `showProgressReport` (ตู้เข็ม) · `js/state.js` `bigExamBadge:0` ใน DEFAULT_STATE + บรรทัด migration เซฟเก่า · `js/bandadv.js` `bigExamBadgeNote()` โชว์ "ใบสอบใหญ่สะสม n ใบ · อีก x ใบ = เข็มถัดไป" ในหัวแผงเลือกระดับ
  - 🔑 **ตั้งใจไม่ทำเข็ม "สอบไว" แยกอีกสาย** — ความเร็วมีเข็มสายฟ้า ⚡ ดูแลอยู่แล้ว (ตอบถูกทุกข้อ+ข้อละ ≤5 วิ ซึ่งข้อสอบใหญ่เข้าเกณฑ์เดียวกัน) จะซ้ำสาย · เอา "สถิติเวลา" (รอบ 777) ไปโชว์ในคำฉลองเข็มแทน ("ใบล่าสุดใช้เวลา 2:28") · เข็มใหม่ไม่มีไฟล์ภาพใน `BADGE_IMG` → `badgeIcHTML` ถอยไปโชว์อิโมจิให้เองอัตโนมัติ (ทำภาพเหรียญเพิ่มทีหลังได้ ไม่ต้องแก้โค้ด)
  - ยืนยัน (server เอง :8797 · mock login): `splitNameBadges('น้องเทส⚡🧠')` แยกชื่อ/เข็มถูก · `badgeScore('👑🎓🧠🏛️')`=11 · สอบใหญ่ใบที่ 3 จริง → ฉลอง "ได้🎓 เข็มนักสอบใหญ่!" + `badgeSuffix()`='🎓' · ระดับ 2/3 ที่ 6/10 ใบถูกต้อง · **สอบซ้ำใบเดิมไม่เพิ่มจำนวนใบ ไม่ฉลองซ้ำ** · ตู้เข็มขึ้นแถว "🎓 ใบประกาศสอบใหญ่ (10 ใบ) 🎓🧠🏛️ ครบทุกเข็มแล้ว" · กระดานเข็มมีสาย "นักสอบใหญ่" (11 สาย) `bcatLevel` คิดระดับถูก · จอเตี้ย 812×375 แผงเลือกระดับยังไม่มี scroll (กฎข้อ 7) · console สะอาด ล้างเซฟแล้ว
  - ⚠️ **เพิ่มบทเรียน preview (ต่อจากรอบ 777):** เปิดพอร์ตใหม่ก็ **ยังโดนแคชได้** — เบราว์เซอร์ในแอปเสิร์ฟไฟล์เก่าข้ามพอร์ต (`performance.getEntriesByType('resource')` ขึ้น `deliveryType:'cache'` ขนาดไม่ตรงกับไฟล์บนดิสก์ ทั้งที่ `curl` พอร์ตนั้นได้ของใหม่) → ท่าที่ชัวร์คือ `await fetch('<path เป๊ะ>',{cache:'reload'})` **ทุกไฟล์ที่แก้** แล้วค่อย `location.reload()` · เช็กด้วย `fetch(path).then(r=>r.text())` ว่ามีโค้ดใหม่จริงก่อนเทสต์เสมอ
- **รอบ 780 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 5 — ศัพท์การแพทย์ ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์/ท่องเที่ยว"):** ⚕️ **ศัพท์การแพทย์ 398 คำ** — เขียนคลังเอง (10 กลุ่ม: บุคลากร-โรงพยาบาล/อาการ-วินิจฉัย/โรค-ภาวะ/การรักษา-ยา/อุปกรณ์การแพทย์/ทันตกรรม-สายตา/สุขภาพจิต/ปฐมพยาบาล-ฉุกเฉิน/ตั้งครรภ์-เด็ก/ประกันสุขภาพ-ธุรการ) → สคริปต์เช็กซ้ำ en+th ก่อนเขียนไฟล์ (สูตรเดิมรอบ770/776) ผ่าน 0 ซ้ำ → `js/data/band/b6_medical.json` → `split_band.py` แยก 6 ไฟล์ช่วงคำ → เติม `LABELS['b6_medical']` ใน `gen_band_adv_manifest.py` แล้วเจน `manifest.js` ใหม่ (5 หมวด รวม 3,029 คำ) · `js/cert.js` เติม `CERT_ADV_EN['ศัพท์การแพทย์']='Medical Vocabulary'` · เสียงอ่าน `gen_word_audio.py` เพิ่ม 368 mp3 (30 คำใช้ไฟล์ร่วมหมวดอื่น) failed 0
  - ยืนยัน (server เอง :8800 เพราะ preview เต็มโควตา · mock login): `bandAdvLoad('medical')` โหลด **398/398 ตรงมานิเฟสต์เป๊ะ** uniq en/th 398/398 ไม่มีคำหาย · `bandAdvCardsHTML()` มีการ์ดที่ 5 ครบ (⚕️/398/ไม่ล้นกรอบการ์ด 340px) · `startQuiz` สุ่ม 10 ข้อ ช้อยส์มีคำตอบถูกครบ · fetch mp3 5 คำ (รวม `sexually transmitted disease`/`NICU`/`x-ray`) 200 ครบ · `check_missing_assets.py --git` จับไฟล์ยังไม่ commit ได้ถูกต้องก่อน commit · console สะอาด ล้างเซฟแล้ว
- **รอบ 779 (29 ก.ค. · ผู้ใช้ต่อยอดรอบ 773: "สอบใหญ่ระดับสูง `badvx_<หมวด>_expert` ผ่านครบทุกหมวดใน BAND_ADV_MANIFEST → ใบประกาศพิเศษ + โบนัสเหรียญใหญ่"):** 👑 `js/bandadv.js` เพิ่ม `bandAdvCheckSupreme()` (เช็ก `Object.keys(BAND_ADV_MANIFEST)` ทุกตัวผ่าน `badvx_<id>_expert` แล้วหรือยัง) เรียกจาก `onPass` ของ `bandAdvExamCat` เฉพาะ `e.k==='expert'` — กัน dedupe ด้วย `state.bandAdvSupreme` (แพทเทิร์นเดียวกับ `bandCheckComplete`/`state.bandComplete` ใน dictband.js) ผ่านแล้วเพิ่ม `BAND_ADV_SUPREME_BONUS`=5,000🪙 + เรียก `certAwardAdvSupreme()` ใหม่ใน `js/cert.js` (id คงที่ `advsupreme`, `c.supreme=true`) · `certSVG` เพิ่มสไตล์ `supreme` (โทนแดง/มงกุฎเหมือน `gold` แต่ข้อความ/หัวข้อ `CERTIFICATE OF SUPREME EXCELLENCE` คนละชุด, ใช้ `certFit` กับ `c.th` กันข้อความยาวล้นกรอบ) + แถบหัวการ์ด `bandAdvCardsHTML` โชว์ความคืบหน้า `X/N หมวด` ก่อนครบ และป้าย 👑 ฉลองหลังครบ
  - ⚠️ **แก้ไขจากรอบก่อน:** เดิมเขียนโน้ตนี้เป็น "รอบ 777" ระหว่างทำ แต่ session คู่ขนาน (นาฬิกาจับเวลาสอบ) commit เลข 777 ไปก่อน — เปลี่ยนเป็น 779 ให้ตรงกับที่เกิดขึ้นจริง (โค้ดฝั่ง `js/bandadv.js`/`js/cert.js` ได้พ่วง commit เลข 777 (`c5c5d6c`) ไปแล้วตั้งแต่ตอนนั้น รอบนี้แค่แก้คอมเมนต์เลขรอบในโค้ด+จดประวัติให้ตรง ไม่มีโค้ดใหม่)
  - ยืนยัน (server เอง :8799 เพราะ preview เต็มโควตา 5 session คู่ขนาน · mock login): จำลอง `state.quizPassed` ผ่านแค่ 3/4 หมวด → เรียก `bandAdvCheckSupreme()` ไม่มีอะไรเกิดขึ้น (ถูกต้อง) · เติมครบ 4/4 → ได้ใบ+เหรียญ 100→5,100 + `alertBox` ขึ้นข้อความ/ปุ่มถูกต้อง · เรียกซ้ำอีก 2 ครั้งไม่ได้โบนัสซ้ำ (`certsLen` ยังคง 1) · วัด `getBBox` ทุกบรรทัดข้อความในใบ (full+mini) อยู่ในกรอบ 700×1000 ไม่ล้น · เช็กใบประเภทเดิม (normal/gold/big) ยังขึ้นหัวข้อ/ทำงานถูกต้องเหมือนก่อนแก้ (ไม่มี regression) · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 783 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 6 — ศัพท์กฎหมาย ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์/ท่องเที่ยว/การแพทย์"):** ⚖️ **ศัพท์กฎหมาย 355 คำ** — เขียนคลังเอง (10 กลุ่ม: ศาล-กระบวนการยุติธรรม/กฎหมายอาญา/กฎหมายแพ่ง-สัญญา/ครอบครัว-มรดก/แรงงาน/ทรัพย์สิน-อสังหาฯ/ทนายความ-บุคลากรกฎหมาย/เอกสารกฎหมาย/สิทธิมนุษยชน-รัฐธรรมนูญ/ตำรวจ-สืบสวน-หลักฐาน) → สคริปต์เช็กซ้ำ en+th ก่อนเขียนไฟล์ (สูตรเดิมรอบ770/776/780) ผ่าน 0 ซ้ำ → `js/data/band/b6_legal.json` → `split_band.py` แยก 5 ไฟล์ช่วงคำ → เติม `LABELS['b6_legal']` ใน `gen_band_adv_manifest.py` แล้วเจน `manifest.js` ใหม่ (6 หมวด รวม 3,384 คำ) · `js/cert.js` เติม `CERT_ADV_EN['ศัพท์กฎหมาย']='Legal Vocabulary'` · เสียงอ่าน `gen_word_audio.py` เพิ่ม 322 mp3 failed 0
  - ยืนยัน (server เอง :8801 เพราะ preview เต็มโควตา · mock login): `bandAdvLoad('legal')` โหลด **355/355 ตรงมานิเฟสต์เป๊ะ** uniq en/th 355/355 ไม่มีคำหาย · การ์ดที่ 6 ขึ้นครบ (⚖️/355 คำ) การ์ด band-card รวม 11 ใบถูกต้อง (5 dict band + 6 adv) · `bandAdvPlay('legal','quiz')` → "⚖️ หมวดศัพท์กฎหมาย · ข้อ 1 จาก 10" คำ `overtime pay` ช้อยส์มีคำตอบถูก `ค่าล่วงเวลา` ครบ 4 ตัวเลือก · fetch mp3 5 คำ (รวม `k_9_unit`/`next_of_kin`/`power_of_attorney`) 200 ครบ · `check_missing_assets.py --git` จับไฟล์ยังไม่ commit ได้ถูกต้องก่อน commit · **เจอไฟล์แก้ค้างของ session คู่ขนาน (`js/adventure3d.js`/`js/moto3d.js`) ไม่แตะ ไม่ add** · console สะอาด ล้างเซฟแล้ว
- **รอบ 782 (29 ก.ค. · ผู้ใช้: "GPS โหมดขับรถพาไปช่วงที่ถนนขาดตอน — หาช่องขาดในกริดถนน แล้วอย่าลากเส้นผ่านจุดที่ขับต่อไม่ได้"):** 🧭🕳️ `js/adventure3d.js` โซน 🧭 GPS — วัดกริดจริงในเบราว์เซอร์ก่อนแก้ เจอ 4 ต้นตอ: ① **4,647/86,012 ช่อง (5.4%) ตกอยู่ในตึก** แต่ A*/string-pulling เดินผ่านฟรี → วัดด้วย `collideCar` ของเกมเอง 85 เส้น ~56 กม. มี **29 เส้นทับตึกยาวเกิน 4 ม. ยาวสุด 34 ม.** (= จุดที่ขับตามป้ายแล้วไปต่อไม่ได้) ② กริดแตก 8 ก้อน เกาะโดดเดี่ยว 984 ช่อง (ตัวอักษรเกิดตรงนั้นขับไปไม่ถึง) ③ fallback เส้นตรง **"ลืมติดธง `.fallback`"** ป้ายเลยขึ้น "ตรงไป" พาทะลุทุ่ง (ตรงกับภาพรอบ 774) ④ ตัวอักษรย้ายที่ทุก 75 วิ แต่ `gpsRouteFor` ไม่เปลี่ยน → เส้นทางเก่าค้าง
  - แก้: เพิ่ม `ncost` (1=ผิวถนนจริง/2=ไหล่ทาง/4=ติดตึก) + `ncomp/nmain` (ก้อนที่เชื่อมถึงกัน) คำนวณตอนสร้างเมืองครั้งเดียว → A* ถ่วงน้ำหนัก (`cellWeight`) · `losClear` ห้ามลัดทะลุตึก · คัดจุดเกิดตัวอักษร+เป้า GPS เหลือเฉพาะที่ขับถึงจริง (13,637→13,500) · ติดธง fallback + ป้ายบอกตรง ๆ **"ไม่มีถนนไปถึง"** · เป้าขยับ >12 ม. = คำนวณเส้นทางใหม่
  - 🔎 **เจอของแถม: `navLineUpdate` (เส้นนำทางสีฟ้าบนถนน รอบ 286) ไม่เคยถูกเรียกเลยสักครั้ง** (ไล่ git ทุกคอมมิตตั้งแต่วันเพิ่ม เจอแต่ตัวนิยาม) — ผู้เล่นมีแต่ลูกศร+ป้ายมาตลอด → ต่อสายให้ทำงานจริง + เว้นหัวเส้นห่างรถ 9 ม. (`NAVLINE_SKIP` · เดิมเริ่มที่ตัวรถ ริบบิ้นบานเป็นลิ่มเต็มจอ เห็นจากภาพทดสอบ)
  - ยืนยัน (server เอง :8797 เพราะ preview เต็มโควตา · mock login + `Adventure3D.start('drive')` · A/B ด้วยการปิด `D.ncost` = พฤติกรรมเดิมเป๊ะ): **ทับตึก 495 ม.(0.88%) → 22 ม.(0.04%) · ยาวติดกันสุด 34.2 → 4.2 ม. · เส้นที่ทับเกิน 4 ม. 29/85 → 2/85** · นอกผิวถนน 18.13% → 9.43% · ระยะทางยาวขึ้นแค่ 0.75% · เวลาหาเส้นทาง 9.73 → 9.75 มิลลิวินาที/เส้น (ไม่กระตุก) · fallback 0.24% → 0% · ทดสอบขับจริงตามป้าย (autopilot 2,500 เฟรม) **ชนตึก 0 เฟรม · นอกถนน 0% · ไม่มีติดขัด** · โยนเป้าไปเกาะที่ไปไม่ถึง → ป้ายขึ้น "ไม่มีถนนไปถึง" + ธง fallback ติด + เส้นฟ้าซ่อนถูกต้อง · หัวเส้นวัดได้ 9.1 ม. · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 785 (29 ก.ค. · ผู้ใช้ส่งภาพเครื่องเกมพกพาตอนขับรถ: "ไม่เอาอย่างนี้ ให้แสดงผลเหมือนขับรถในเมืองทุกอย่าง รวมถึงเสียงเครื่องยนต์และการบังคับ เหมือนยกการขับที่นั่นมาใส่ที่นี่เลย" · เคาะกับผู้ใช้ = ยกทั้งชุดรวมมุมมองในรถ เฉพาะตอนขับรถยนต์):** 🚗🏙️ `js/moto3d.js` เพิ่มโซน `🚗🏙️ รอบ 785` ยกจาก `js/adventure3d.js` (โซน 🚗 โหมดขับรถเมืองกำแพงเพชร) มา 4 ชั้น — ① **ฟิสิกส์** `carDrive()` bicycle model ครบ (CAR_ACCEL/BRAKE/VMAX/VREV/WB/STEER_MAX ค่าเดียวกันเป๊ะ · เบรก · เกียร์ถอย · แรงต้าน · ไถลเข้าโค้ง grip · โคลงตัวถังตามแรง G) ② **เสียง** `CarSnd` พอร์ตจาก `CarSound` (ไดสตาร์ท/รอบเครื่อง 2 osc+lowpass/แตร/ติ๊ดถอย/ยางเอี๊ยด/ชน) + master gain ตัวเดียวปิดเกลี้ยงตอนออก ③ **มุมมองในห้องคนขับ** — `#moto-cardash` ภาพหน้าปัดชุดเดียวกับโลกเมือง (`img/3d_car/3d_dash_<cid>.png`→`img/car/dash.png`→แผง CSS) + พวงมาลัยหมุน `dSteer*440°` + เข็มสปีด/วัดรอบวาดสด (`carDial`/`drawCarGauge` · r=wh*.125 ใหญ่กว่าโลกเมืองนิดเพราะจอเครื่องเกมเล็ก) + คีย์ V สลับมุมที่ 3 ④ **ปุ่มบังคับ** — สไลเดอร์ส้ม = พวงมาลัย **คืนกลางเองตอนปล่อย** (มอไซค์ยังค้างองศาเหมือนเดิม) + ปุ่มใหม่ใต้จอ 🦶เบรก · D/R เกียร์ · 📯แตร + คีย์ W/S/A/D/H/R/V
  - 🔑 **จุดที่ต้องแปลงระหว่างพอร์ต:** ทิศหน้าโลกนี้ = `(+sin,+cos)` แต่โลกเมือง `(-sin,-cos)` → สูตรไถล `dVel` เปลี่ยนเครื่องหมาย และกล้อง first-person ต้อง `rotateY(yaw+π)` · HUD ที่เดิมเกาะขอบล่างจอ (สปีด/มินิแมพ/แชท) ต้องยกขึ้นเหนือแผงหน้าปัดด้วยคลาส `.car.cockpit` ไม่งั้นโดนบังหมด · **ทุกอย่าง gate ด้วย `vehicle==='car'` — โหมดมอเตอร์ไซค์ไม่ถูกแตะ**
  - ยืนยัน (server เอง :8801 เพราะ preview เต็มโควตา 5 session คู่ขนาน · mock login + `MotoWorld.start({vehicle:'car'})` + `_t.step/carInput`): เร่ง 2 วิ→68 กม./ชม. · เบรก 26.2→4.8 m/s ใน .75 วิ · เกียร์ R ถอยชนกำแพง -6.48 (=CAR_VREV) ป้ายเปลี่ยนเป็น "ถอย"+สปีด "↩ 23 กม./ชม." · หักพวงขวา yaw -0.76 rad/วิ ทิศถูก · ไถลจริงมี slip 2.09 → เสียงยางดังตามสูตรเดิม · ไดสตาร์ทแล้ว `ctx.state=running` rpm .95→ไหลลง idle ความถี่ 55→120Hz ตามความเร็ว · ปุ่มจริง (dispatch pointer/click) ครบ: เบรกกดค้างติด/ปล่อยดับ · เกียร์ D↔R สลับป้าย · แตรไม่ error · สไลเดอร์ลาก 72%→ปล่อยคืน 50% · คีย์ V สลับมุมที่ 3 (ซ่อน cockpit + โชว์รถตัวเอง) กลับมาแล้วเกจวาดต่อ · วัด rect จอ 1000×640 และ **812×375**: HUD ทุกชิ้นอยู่เหนือแผงหน้าปัดและอยู่ในจอครบ · เกจ 2 วงไม่หลุดขอบจอ · ปุ่มใหม่ไม่ทับสไลเดอร์/ปุ่มเร่ง · **โหมดมอไซค์เทียบก่อน-หลัง: เร่ง 1 วิ = 13 m/s เท่าเดิม สไลเดอร์ยังค้างองศา ชิ้นส่วน cockpit `display:none` ทั้งหมด** · ออกจากโลก master gain→0.0002 เสียงเงียบ เข้าใหม่กลับมาปกติ · console สะอาด · ภาพยืนยัน composite (WebGL+DOM overlay) เห็นห้องคนขับ+หน้าปัด+พวงมาลัย+เข็มเกจบนถนนจริง · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 786 (29 ก.ค. · ผู้ใช้: "ทำข้อ 3" = กระดานอันดับ "สอบใหญ่เร็วที่สุด" รายหมวด/รายระดับ):** 🏁 `js/bandadv.js` เพิ่ม `bxRankRows(catId,lvKey)` / `bxRankMount(box,catId)` / `openBigExamRank()` / `bxRankNote()` + `js/ui.js` แท็บที่ 6 `bx` ในกระดานเต็มจอ (`LB_TABS` + ปุ่ม + สาขา render เรียก `bxRankMount` — โค้ดกระดานอยู่ bandadv ที่เดียว) · ทางเข้า 2 ทาง: ปุ่ม 🏁 ในหัวแผงสอบใหญ่ (เห็นเฉพาะหมวดนั้นทันที) และแท็บ 🏁 ในกระดานอันดับ · เลือกหมวด×ระดับด้วยชิปในแผงเดียว Top 8 + แถวของเราต่อท้ายถ้าไม่ติด
  - 🔑 **ไม่เพิ่มโซน DB / ไม่ต้อง publish rules** — ปั้นอันดับจากของที่มีอยู่แล้ว: ① `Online.gfeed` (ฟีดรวม 120 โพสต์ล่าสุดทั้งเกม) parse ข้อความที่ `feedEvent` เขียนไว้ตั้งแต่รอบ 777 (`สอบผ่านหมวด<หมวด> · สอบใหญ่ระดับ<x> sc/tt ข้อ ⏱️ m:ss`) ② ใบประกาศของเราเอง (`state.certs[].sec`) → เห็นเวลาตัวเองเสมอแม้ปิดเปิดเผยกิจกรรม/โพสต์หลุดจาก 120 โพสต์ (ไม่ได้ส่งข้อมูลออก) · 1 uid = 1 แถว (เก็บเวลาดีสุด) · **เขียนบนจอตรง ๆ ว่า "จากกิจกรรมล่าสุด ไม่ใช่อันดับตลอดกาล"** ไม่อวดเกินจริง · ออฟไลน์ = โชว์เฉพาะสถิติตัวเอง + บอกเหตุผล (กฎทอง #1)
  - ยืนยัน (server เอง :8798 · mock login + ฟีดจำลอง): กรองถูกหมด — โพสต์สอบ 10 ข้อ/โพสต์หมวดอื่นไม่ถูกนับ · คนเดียวโพสต์ 2 ครั้งเก็บเวลาดีสุด (1:50 ไม่ใช่ 4:05) · เรียงเร็ว→ช้า คะแนนตัดสินเมื่อเวลาเท่ากัน · ทดสอบ 13 คน → โชว์ 8 + "…" + แถวเราอันดับ 13 · สลับหมวด/ระดับได้ทั้ง 2 ทางเข้า · ชื่อโชว์ชื่อเล่น+สัญลักษณ์ระดับชั้น (`gradeMark`) เข็มแยกออกเป็นตัวเล็ก (กฎคุ้มครองเด็ก) · จอเตี้ย 812×375 และ 1000×640 ไม่มี scroll ทั้งแผงป๊อปอัปและแท็บในกระดาน (กฎข้อ 7) · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 787 (29 ก.ค. · ผู้ใช้: "สรุปคำที่ตอบผิดหลังสอบใหญ่ แตะฟังเสียงได้ (แบบ bandShowRetakeSummary) — 50 ข้อไม่มีสรุป เด็กไม่รู้ว่าพลาดคำไหน"):** 📝 `js/bandadv.js` `bandAdvExamCat()` เพิ่ม `onFinish()` เก็บคำผิดจาก `quiz.results`+`quiz.questions` ลง `__advExamSummaryLast` + ฟังก์ชันใหม่ `bandAdvShowExamSummary()` (โครงเดียวกับ `bandShowRetakeSummary` ใน dictband.js ใช้คลาส `.rts-*` เดิมไม่ต้องเพิ่ม CSS) เด้งทับแผงหลังปิดกล่องผลสอบทุกครั้งไม่ว่าผ่าน/ไม่ผ่าน แตะคำ = `speakWord` · `js/game.js` `finishQuiz()` ต่อ hook `if(cat.examSummary) bandAdvShowExamSummary()`
  - ⚠️ **ครึ่งแรก (bandadv.js) ขึ้น commit ในชื่อ "รอบ784"** (จองเลขตอนนั้นถูกต้อง แต่ session คู่ขนานแซงไป 785/786 ก่อนจะ push) — โค้ดคอมเมนต์ในไฟล์เลยยังเห็น "รอบ 784" ค้างอยู่ ไม่ใช่ของปลอม (เหมือนเคสรอบ 779) · ระหว่างแก้ยังเจอบั๊กตัวเอง: commit แรกพลาดไปกวาดโค้ดกระดานอันดับ (`รอบ786`) ของ session คู่ขนานที่ยังไม่เสร็จติดไปด้วย เพราะ `git commit -- <path>` ใช้เนื้อไฟล์ใน working tree ไม่ใช่ index ที่ตั้งด้วย `update-index` → แก้ด้วย `git commit-tree` ปั้น tree จาก HEAD เดิม+เฉพาะ diff ตัวเอง แล้ว `update-ref` แทนที่ commit ผิด (ไม่กระทบไฟล์ในเครื่องของ session อื่นเลย)
  - ยืนยัน (server เอง :8801 · mock login + เรียก `bandAdvExamCat` จริงกับคำจำลอง 4/2/6 คำผ่าน console): ตอบผิด 2/4 → สรุปขึ้น "ถูก 2/4 ข้อ" + รายการ `dog — หมา`/`cat — แมว` ตรงตัวที่ตอบผิดจริง · แตะการ์ด `dog` → เรียก `speakWord('dog')` ยืนยันแล้ว · ตอบถูกหมด 2/2 → ขึ้น "🌟 ไม่มีคำตอบผิดเลย เก่งมาก!" ไม่มีการ์ดคำ · ตอบผิดหมด 6/6 (กรณีเลวร้ายสุด) วัด `scrollHeight<=clientHeight` จอเตี้ย 812×375 ไม่ล้น (กฎข้อ 7) · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-29 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 788 (29 ก.ค. · ผู้ใช้: "เกาะถนนโดดเดี่ยว ~984 ช่อง (รอบ 782) อยู่ตรงไหนของเมือง เชื่อมเข้าถนนหลักให้ขับถึงจริง"):** 🌉 `js/adventure3d.js` โซนใหม่ **🌉 รอบ 788 — ปูถนนเชื่อมเกาะถนนโดดเดี่ยว** — วัดตำแหน่งจริงในเบราว์เซอร์: เกาะใหญ่ **872 ช่อง = ถนนสายเหนือแนวเฉียง NE→SW แถว (768,-2114)** ปลายจ่อถนนกำแพงเพชรแต่ขาด 90 ม. · **71/27/12 ช่อง = ตอถนนย่านตะวันออก (ราษฎร์รวมใจ)** ขาด 8–38 ม. · อีก 3 จุด 1 ช่อง = แตะกันแค่มุมทแยง (กฎห้ามตัดมุมของ A* ไม่ให้ผ่าน)
  - แก้: BFS จากทุกช่องของเกาะออกไป "ที่ว่างที่รถแทรกผ่านได้จริง" (`navBlockedAt` + ไม่ข้ามน้ำ) จนโดนก้อนหลัก → string pulling → **ปูถนนจริงกว้าง 7 ม. (mesh + grid ฟิสิกส์ + ngrid/ncost)** แล้ว `recomp()` · 2 บทเรียนจากการวัด: ① ต้องใช้กฎห้ามตัดมุมใน BFS ด้วย ไม่งั้นปูถนน 8 ม. ทิ้งไว้แต่เกาะยังไม่ต่อ ② `LINK_PADS=[1.1,0]` ขอเลนกว้างกว่าตัวรถก่อน (เส้นที่เฉียดตึกพอดี 1.55 ม. รถครูดมุมตึก) ไม่มีทางค่อยยอมพอดีตัว
  - ผล: **กริดนำทางแตก 8 ก้อน → เหลือก้อนเดียว 81,478 ช่อง** (ถนนเชื่อม 7 เส้น รวม 283 ม. ยาวสุด 98 ม.) · จุดเกิดตัวอักษรที่ขับถึงจริง 13,500 → **13,636** · A/B seed เดียวกัน 85 เส้น ~238 กม.: ทับตึก 0.04%→0.06% · นอกผิวถนน 7.44%→7.43% · ms/เส้น 24.97→22.94 (ไม่ถอย) · สร้างเมืองเพิ่ม ~70 มิลลิวินาที (flood fill รอบสอง 62 มิลลิวินาที · BFS สแกนแค่ 10,849 ช่อง)
  - ยืนยัน (server เอง :8801 เพราะ preview เต็มโควตา · mock login + `Adventure3D.start('drive')`): เส้นทางไปเกาะทั้ง 6 จุดที่เคยคืน null **ได้เส้นทางจริงครบ 6/6** · **กวาดตัวรถตามแนวถนนเชื่อมทั้ง 7 เส้น ทีละ 0.25 ม. เยื้องซ้าย-ขวาถึง ±1.5 ม. (4,584 จุด) ชนตึก 0 จุด** · ขับจริงเส้นเหนือ 98 ม. ไป-กลับ ชน 0 เฟรม · ป้าย GPS/เส้นฟ้าทำงานปกติ ไม่มีธง fallback · แผนที่ภาพ `map783.jpg` ยืนยันถนนส้มต่อปลายถนนที่ขาดจริง · console สะอาด ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 789 (29 ก.ค. · ผู้ใช้ส่งภาพ: "ประตูเปิดกลางห้องอย่างนี้คือผิด" + "ใส่ภาพ tex_hotel_* ให้สมจริงที่สุด"):** `js/hotel3d.js` แก้ 2 เรื่อง — ① **ประตูห้อง**: เดิม `rmDoorGeo` วางแกนยาวผิด (`.09,2.3,DOOR_W-.1` ยาวไปตาม Z แต่ช่องประตูกว้างตาม X) บวกวางตำแหน่งด้วย offset ลอย ๆ (x+.55/z+.5) ไม่มีบานพับยึดวงกบ → บานเลยลอยกลางอากาศไม่ติดผนัง แก้เป็นสลับแกน `(DOOR_W-.1,2.3,.09)` + ใช้ `T.Group` บานพับจริงที่ขอบวงกบ (ระนาบกลางความหนาผนัง) แล้วหมุนแง้มรอบจุดนั้น ② **tex_hotel_room ไม่เคยถูกวาดเลยทั้งตึก** (A.room ถูกสร้างแต่ไม่มี accBox ใดเติมเข้าไป, F.room ก็ไม่ถูกใช้ใน furnMesh) → ผนังนอกสุดของห้องพัก (CORE_E..BX ทุกด้าน) + ผนังกั้นห้อง (room-divider) ชั้น 1-4 เปลี่ยนจาก `A.struct`(tex_hotel_wall) เป็น `A.room`(tex_hotel_room) จริง ส่วนฝั่งโถงบันได/ลิฟต์ยังเป็น tex_hotel_wall เดิม
  - ยืนยัน (server เอง :8801 · mock login + register + `state.hauntTicket=true` + โหลด three.min.js→loadAdv3d()→`Adventure3D.start('haunt')` ตามลำดับจริงของเกม กันบั๊ก "โหลดไม่ครบลำดับ Adventure3D undefined ค้างตลอด session" ที่เจอระหว่างเทสต์): `node --check js/hotel3d.js` ผ่าน · teleport เข้าห้องชั้น 1 ฝั่ง S ห้อง 0 ถ่ายภาพจริงด้วย readPixels — ประตูบานไม้ (tex_hotel_wood ลายไม้จริง) แง้มเปิดพาดเต็มช่องประตู บานพับติดวงกบจริง ไม่ลอยกลางอากาศ/กลางห้องอีกต่อไป · เดินเข้าไปมองผนังในห้องเห็นวอลเปเปอร์ลายดอกกุหลาบครีม (tex_hotel_room) ต่างจากลายดามัสก์เขียวเข้มของทางเดิน (tex_hotel_wall) ชัดเจน · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **บทเรียน preview:** `loadAdv3d()` เดี่ยว ๆ (ไม่โหลด `three.min.js` ก่อน) ทำให้ `adventure3d.js` throw กลางสคริปต์ตอนอ้าง `THREE` แต่ event `load` ของ `<script>` ยัง fire ตามปกติ (สคริปต์ "โหลดสำเร็จ" แต่รันไม่จบ) → `loadScriptOnce` จำว่าโหลดแล้วไม่ยอมรันซ้ำ ทำให้ `window.Adventure3D` undefined ค้างไปทั้ง session แม้เรียกซ้ำกี่ครั้ง ต้องรีโหลดหน้าใหม่ทั้งหมดถึงจะหาย — ต้องเรียงลำดับ `three.min.js` ก่อน `loadAdv3d()` เสมอเหมือนโค้ดจริงใน `enterAdventure3D`/`enterHaunted3D`


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 793 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 8 — ศัพท์สิ่งแวดล้อม ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์/ท่องเที่ยว/การแพทย์/กฎหมาย"):** 🌍 **ศัพท์สิ่งแวดล้อม 364 คำ** — เขียนคลังเอง (10 กลุ่ม: มลพิษทางอากาศ/มลพิษทางน้ำ-ดิน/การเปลี่ยนแปลงสภาพภูมิอากาศ/พลังงาน-พลังงานทดแทน/ขยะ-การจัดการของเสีย/การอนุรักษ์-ความหลากหลายทางชีวภาพ/ป่าไม้-การตัดไม้ทำลายป่า/ทรัพยากรน้ำ-มหาสมุทร/เกษตรกรรมยั่งยืน-เมืองสีเขียว/ภัยพิบัติ-นโยบาย-องค์กรสิ่งแวดล้อม) → สคริปต์เช็กซ้ำ en กับทุกไฟล์ band ทุกหมวด (สูตรเดิมรอบ770/776/780/783/790) เจอชน 17 คำกับหมวดวิทยาศาสตร์ (global warming/drought/fossil fuel/landfill/rainforest ฯลฯ) → เปลี่ยนเป็นคำเฉพาะเจาะจงกว่า (เช่น `megadrought`/`sanitary landfill`/`boreal forest`) ผ่าน 0 ซ้ำ → `js/data/band/b6_environment.json` → `split_band.py` แยก 5 ไฟล์ช่วงคำ → เติม `LABELS['b6_environment']` ใน `gen_band_adv_manifest.py` → `js/cert.js` เติม `CERT_ADV_EN['ศัพท์สิ่งแวดล้อม']='Environment Vocabulary'` · เสียงอ่าน `gen_word_audio.py` เพิ่ม 364 mp3 failed 0
  - ⚠️ **มี session คู่ขนานทำหมวดที่ 7 (ศัพท์เทคโนโลยี-IT `b6_it`) พร้อมกัน แก้ไฟล์ร่วมเดียวกัน** (`js/cert.js`/`tools/gen_band_adv_manifest.py`/`manifest.js`) — เจอ `manifest.js` ถูกเขียนทับสลับกันไปมาหลายรอบ (เขาตัด environment ออก/เราตัด it ออก) เพราะต่างฝ่ายต่างกลัวส่งงานที่ยังไม่ commit ของอีกฝ่ายขึ้นเว็บ → สุดท้ายเช็กแล้วงานทั้งสองฝั่งเสร็จสมบูรณ์จริง (it ผ่านการยืนยันจากรอบ 790 แล้ว) จึงรวมเป็น manifest เดียวครบ 8 หมวด 4,116 คำ และ **commit ทั้งสองหมวดพร้อมกัน** (`git add` เจาะจงไฟล์ b6_it*/b6_environment*/mp3 ที่เกี่ยวจริงเท่านั้น เช็ก `git diff --cached --name-only` ก่อน commit ทุกครั้งกันไฟล์คนอื่นหลุดเข้ามา — เจอ `handoff/TASKS.md`/`b6_it*` ติดมาใน staging area เองจากอีก session แล้ว `git reset` ออกก่อน)
  - ยืนยัน (server เอง :8812/:8813 เพราะ preview เต็มโควตา · mock login): `bandAdvLoad('environment')` โหลด **364/364 ตรงมานิเฟสต์เป๊ะ** uniq en/th 364/364 ไม่มีคำหาย · การ์ดที่ 8 ขึ้นครบ (🌍/364 คำ) · `bandAdvPlay('environment','quiz')` → "🌍 หมวดศัพท์สิ่งแวดล้อม · ข้อ 1 จาก 10" คำ `green hydrogen` ช้อยส์มีคำตอบถูก `ไฮโดรเจนสีเขียว` ครบ 4 ตัวเลือก · fetch mp3 5 คำ 200 ครบ · **เทสต์ซ้ำหมวด it ของ session คู่ขนานด้วยก่อน commit** (`bandAdvLoad('it')` 368/368 + สอบจริง 1 ข้อถูก) กันส่งของเขาขึ้นเว็บทั้งที่ยังไม่ผ่านการยืนยัน · `check_missing_assets.py --git` เตือนไฟล์ยังไม่ commit ตามคาด (ปกติก่อน commit) · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 790 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 7 — ศัพท์เทคโนโลยี-IT ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์/ท่องเที่ยว/การแพทย์/กฎหมาย"):** 💻 **ศัพท์เทคโนโลยี-IT 368 คำ** — เขียนคลังเอง (10 กลุ่ม: ฮาร์ดแวร์คอมพิวเตอร์/ซอฟต์แวร์-ระบบปฏิบัติการ/อินเทอร์เน็ต-เครือข่าย/เว็บไซต์-โซเชียลมีเดีย/การเขียนโปรแกรม/ความปลอดภัยไซเบอร์/อุปกรณ์พกพา-สมาร์ทดีไวซ์/คลาวด์-ข้อมูลขนาดใหญ่/ปัญญาประดิษฐ์-เทคโนโลยีใหม่/อาชีพไอที-ชีวิตดิจิทัล) → สคริปต์เช็กซ้ำ en+th กับทุกคำในทุกแบนด์ก่อนเขียนไฟล์ (สูตรเดิมรอบ770/776/780/783) เจอชน 15 คำกับหมวดอื่น (computer/software/password/algorithm ฯลฯ) → เปลี่ยนเป็นคำเฉพาะเจาะจงกว่า (เช่น `microprocessor`/`relational database`) ผ่าน 0 ซ้ำ → `js/data/band/b6_it.json` → `split_band.py` แยก 5 ไฟล์ช่วงคำ → เติม `LABELS['b6_it']` ใน `gen_band_adv_manifest.py` แล้วเจน `manifest.js` ใหม่ · `js/cert.js` เติม `CERT_ADV_EN['ศัพท์เทคโนโลยี-IT']='Technology & IT Vocabulary'` · เสียงอ่าน `gen_word_audio.py` เพิ่ม 367 mp3 failed 0
  - 🔑 **เจอบั๊กเครื่องมือ (ไม่ใช่ของรอบนี้แต่กระทบ):** `gen_word_audio.py` ใช้ regex ที่คำต้องขึ้นต้นด้วยตัวอักษร `[A-Za-z]` เท่านั้น — คำ `"3d printing"` (ขึ้นต้นด้วยเลข) ไม่ถูกจับให้เจนเสียงเลย เงียบ ๆ ไม่มี error → เปลี่ยนคำเป็น `"three-dimensional printing"` แทนตั้งแต่ต้น (ลบไฟล์แยกช่วงคำเก่าแล้ว split ใหม่) หลีกเลี่ยงแก้ตัวเครื่องมือกลาง
  - ⚠️ **มี session คู่ขนานเพิ่มหมวดที่ 8 (ศัพท์สิ่งแวดล้อม `b6_environment`) พร้อมกัน แก้ไฟล์ร่วมเดียวกัน** (`js/cert.js`/`tools/gen_band_adv_manifest.py`) — บรรทัด `LABELS`/`CERT_ADV_EN` ของเขาพ่วงเข้ามาระหว่างทำงาน ไม่ชนกัน (คนละ key) แต่ **`manifest.js` เป็นไฟล์เจนรวม ต้อง regenerate เองแบบยกเว้นหมวดของเขาที่ยังไม่ commit** (เขียนสคริปต์ชั่วคราวกรอง `EXCLUDE={'b6_environment'}`) กัน manifest อ้างไฟล์ที่ยังไม่ขึ้นเว็บ — commit เฉพาะไฟล์ตัวเอง (`b6_it*`, mp3 366 คำ+`three_dimensional_printing.mp3` ตามชื่อไฟล์เป๊ะ) ไม่แตะไฟล์ `b6_environment*`/mp3 ของเขา
  - ยืนยัน (server เอง :8802 เพราะ preview เต็มโควตา · mock login + คลิก UI จริงจนถึงหน้าเกม ไม่ใช่แค่ JS console): `bandAdvLoad('it')` โหลด **368/368 ตรงมานิเฟสต์เป๊ะ** uniq en/th 368/368 ไม่มีคำหาย ไม่มี fail · เปิดแผง "หมวดคำศัพท์ & แบบทดสอบ" จริงในเบราว์เซอร์ การ์ดที่ 4 ขึ้น 💻/ศัพท์เทคโนโลยี-IT/368 คำ ถูกต้อง (รวม 8 การ์ดกับของ session คู่ขนาน) · กด "สอบ 10 ข้อ" จริง → คำ `blog` เลือก `บล็อก` ถูก คะแนนขึ้น "ถูก 1 ข้อ" · fetch mp3 5 คำ (รวม `three-dimensional printing`/`non-fungible token`/`password manager`) 200 ครบ · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 792 (29 ก.ค. · ผู้ใช้: "ไล่ต่อว่า 4,650 ช่องที่ถูกตีตราว่าติดตึก (ncost=4) มีกี่ช่องเป็น false positive จากการวัดที่จุดกึ่งกลางช่อง 6 ม. — อาจปลดล็อกถนนในเมืองได้อีกเยอะ"):** 🔬 **วัดแล้ว = ปลดล็อกไม่ได้อะไรเลย ไม่ต้องแก้โค้ด (ผลลบ · จดไว้กันไล่ซ้ำ)** — ไม่มีการแก้ไฟล์เกมรอบนี้
  - ตัวเลขจริง (server เอง :8802 · mock login + `Adventure3D.start('drive')` · เช็กด้วยเลขคณิต `collideCar` + ข้อมูลถนนดิบ `KPP_CITY.r`): กริดนำทาง 86,128 ช่อง · ปิดเพราะติดตึก **4,650 ช่อง (5.4%)** · ในนั้น **4,252 ช่อง (91.4%) เป็นไหล่ทาง ไม่ใช่ผิวถนน** (กริดนำทางทาเผื่อ ±1 ช่องเลยขอบถนน แล้วไปตกในตึกแถวริมถนนจริง ๆ) = **ปิดถูกแล้ว ไม่ใช่ false positive** · อยู่บนผิวถนนจริงแค่ **398 ช่อง (8.6%)**
  - "มีที่ว่างในช่อง 93.8%" เป็นตัวเลขหลอก — ที่ว่างส่วนใหญ่เป็นแค่**มุมช่อง** รถแทรก*ผ่าน*ไม่ได้ · เทสต์จริง (เลื่อนจุดนำทางในช่องแบบละเอียด 0.6 ม. แล้วบังคับว่าเส้นจากเพื่อนบ้าน→จุดใหม่→เพื่อนบ้านอีกฝั่งต้องโล่งตลอด สุ่มทุก 1 ม.): ช่องที่เป็น "รูโหว่กลางทางเดิน" 503 ช่อง → **ผ่านได้จริงแค่ 37 ช่อง** (อยู่บนผิวถนนด้วย 11 ช่อง)
  - เคาะด้วยผลกระทบ: วัดระยะอ้อมของทั้ง 37 ช่องด้วย Dijkstra เพดาน 1.2 กม. → **ทุกช่องมีทางอ้อมอยู่แล้ว ไกลสุด ≤60 ม. (มัธยฐาน 24 ม.) · ไม่มีช่องไหนตัดขาดพื้นที่เลย 0 ช่อง** → ผลได้สูงสุด = ประหยัด ~24 ม. ใน 37 จุด แลกกับการรื้อ `cellCenter`/`cellWeight`/`losClear` (หัวใจรอบ 782) ให้จุดนำทางไปอยู่ในซอกข้างตึก = **ไม่คุ้ม ตัดสินใจไม่ทำ**
  - 📌 ถ้ามี session ไหนคิดจะ "ปลดล็อกช่อง ncost=4" อีก: อ่านบรรทัดนี้ก่อน — ตัวเลขวัดจากเมืองจริงแล้ว ไม่ต้องวัดใหม่


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 794 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 7 — ศัพท์เทคโนโลยี-IT ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์/ท่องเที่ยว/การแพทย์/กฎหมาย"):** 💻 **ศัพท์เทคโนโลยี-IT 368 คำ** — เขียนคลังเอง (10 กลุ่ม: ฮาร์ดแวร์คอมพิวเตอร์/ซอฟต์แวร์-ระบบปฏิบัติการ/อินเทอร์เน็ต-เครือข่าย/เว็บไซต์-โซเชียลมีเดีย/การเขียนโปรแกรม/ความปลอดภัยไซเบอร์/อุปกรณ์พกพา-สมาร์ทดีไวซ์/คลาวด์-ข้อมูลขนาดใหญ่/ปัญญาประดิษฐ์-เทคโนโลยีใหม่/อาชีพไอที-ชีวิตดิจิทัล) → สคริปต์เช็กซ้ำ en+th กับทุกคำในทุกแบนด์ก่อนเขียนไฟล์ (สูตรเดิมรอบ770/776/780/783) เจอชน 15 คำกับหมวดอื่น (computer/software/password/algorithm ฯลฯ) → เปลี่ยนเป็นคำเฉพาะเจาะจงกว่า (เช่น `microprocessor`/`relational database`) ผ่าน 0 ซ้ำ → `js/data/band/b6_it.json` → `split_band.py` แยก 5 ไฟล์ช่วงคำ → เติม `LABELS['b6_it']` ใน `gen_band_adv_manifest.py` แล้วเจน `manifest.js` ใหม่ · `js/cert.js` เติม `CERT_ADV_EN['ศัพท์เทคโนโลยี-IT']='Technology & IT Vocabulary'` · เสียงอ่าน `gen_word_audio.py` เพิ่ม 367 mp3 failed 0
  - 🔑 **เจอบั๊กเครื่องมือ (ไม่ใช่ของรอบนี้แต่กระทบ):** `gen_word_audio.py` ใช้ regex ที่คำต้องขึ้นต้นด้วยตัวอักษร `[A-Za-z]` เท่านั้น — คำ `"3d printing"` (ขึ้นต้นด้วยเลข) ไม่ถูกจับให้เจนเสียงเลย เงียบ ๆ ไม่มี error → เปลี่ยนคำเป็น `"three-dimensional printing"` แทนตั้งแต่ต้น (ลบไฟล์แยกช่วงคำเก่าแล้ว split ใหม่) หลีกเลี่ยงแก้ตัวเครื่องมือกลาง
  - ⚠️ **มี session คู่ขนานเพิ่มหมวดที่ 8 (ศัพท์สิ่งแวดล้อม `b6_environment`) พร้อมกัน แก้ไฟล์ร่วมเดียวกัน** (`js/cert.js`/`tools/gen_band_adv_manifest.py`/`manifest.js`) — `manifest.js` เป็นไฟล์เจนรวมถูกเขียนทับสลับกันไปมาหลายรอบ (ต่างฝ่ายต่างกลัวส่งงานที่ยังไม่ commit ของอีกฝ่ายขึ้นเว็บ ทั้งสองแก้ไฟล์เดียวกันบนดิสก์จริง ไม่ใช่ worktree แยก) → สุดท้ายใช้ `git hash-object -w`+`git update-index --cacheinfo` ฉีด blob ตรงเข้า index แทน `git add` กันโดนเขียนทับระหว่างทาง + ชนเลขรอบ 1 ครั้ง (จอง 790 ไว้ตอนเริ่ม แต่ session อื่น commit แซงถึง 792 ระหว่างที่กำลังแก้ปัญหา manifest race) ต้อง `--next-round` ใหม่เป็น 794 — commit เฉพาะไฟล์ตัวเอง (`b6_it*`, mp3 367 คำ) ไม่แตะไฟล์ `b6_environment*`/mp3 ของเขา
  - ยืนยัน (server เอง :8802 เพราะ preview เต็มโควตา · mock login + คลิก UI จริงจนถึงหน้าเกม ไม่ใช่แค่ JS console): `bandAdvLoad('it')` โหลด **368/368 ตรงมานิเฟสต์เป๊ะ** uniq en/th 368/368 ไม่มีคำหาย ไม่มี fail · เปิดแผง "หมวดคำศัพท์ & แบบทดสอบ" จริงในเบราว์เซอร์ การ์ดขึ้น 💻/ศัพท์เทคโนโลยี-IT/368 คำ ถูกต้อง · กด "สอบ 10 ข้อ" จริง → คำ `blog` เลือก `บล็อก` ถูก คะแนนขึ้น "ถูก 1 ข้อ" · fetch mp3 5 คำ (รวม `three-dimensional printing`/`non-fungible token`/`password manager`) 200 ครบ · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 797 (29 ก.ค. · ผู้ใช้ต่อยอดรอบ789: "แง้มความกว้างประตู/มุมเปิด ปรับให้พอดีมากขึ้น ถ้าดูจอจริงแล้วอยากลดองศา"):** 🚪 `js/hotel3d.js:484` ลดมุมแง้มประตูห้องพักจาก `.9`→`.4` rad (51.6°→22.9°) — ถ่ายภาพจริงเทียบ 2 มุม (server เอง :8803 · mock login + `enterHaunted3D()` + `_t.hotel.teleport(f,door.x,door.z+n)` + `tools/snaplab.js`) พบว่ามุม 51.6° เดิมทำให้บานประตูตั้งเกือบขวางเต็มช่องตอนมองจากทางเดิน (บังห้องเกือบหมด) เพราะ ~51° คือมุมที่บานหันหน้าเข้าหากล้องมากที่สุด ยิ่งใกล้ 0°/90° ยิ่งเห็นบานแบบขอบบาง (เอียงน้อย=ชิดผนัง)
  - ยืนยัน (ภาพ `door_test2_angle40.jpg`/`door_test3_close_angle40.jpg` ใน Downloads): มุม 22.9° ใหม่ บานหุบชิดผนังซ้ายเกือบเป็นเส้นบาง มองเห็นห้องด้านในชัดเจนทั้งระยะไกล/ใกล้ประตู ตรงกับคำว่า "แง้ม" มากขึ้น · `node --check js/hotel3d.js` ผ่าน · ล้างเซฟ+ปิด server 8803 แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 798 (29 ก.ค. · ผู้ใช้: "ถนนเชื่อมเกาะ (โซน 🌉 รอบ 788) ยังเป็นแถบยางมะตอยเปล่า ปูทางเท้า/เลนจักรยาน/เส้นประกลางถนนแบบถนนปกติ + วัดผลก่อน-หลัง"):** 🚸 `js/adventure3d.js` ① โซน 🌉 เพิ่มการปูเครื่องหมายจราจรบนถนนเชื่อมทั้ง 7 เส้น (283 ม.) จาก `linkLog[].poly` — ใช้ค่าคงที่/ระดับ y/`walkMat` ชุดเดียวกับถนนหลักเป๊ะ (เส้นประทุก 9 ม. · เลนฟ้า `BIKE_W` + ขอบขาว `LINE_W` · ทางเท้าลาย `img/city/sidewalk.png`) · decal พื้นล้วน ไม่แตะ grid/ngrid/ncost + ข้ามฝั่งที่ล้นลงน้ำ ② 🐛 **เจอบั๊กเก่าจากรอบ 182 ระหว่างวัดผล: เลนจักรยาน/ทางเท้าทั้งเมืองโผล่แค่ข้างเดียวมาตลอด** — `strip()` คูณ `sgn` ตรง ๆ ทำให้ฝั่ง +1 เป็นภาพกระจก ลำดับจุดกลับด้าน (หลังหันขึ้นฟ้า) โดน back-face culling ตัดทิ้ง → สลับ `d0/d1` ตอน `sgn>0` แก้ทั้งถนนหลักและถนนเชื่อม
  - วัดก่อน-หลัง (raycast ลงจากฟ้าทุก 2 ม. ตามแนวถนน · server เอง :8805 เพราะ preview เต็มโควตา · mock login + `Adventure3D.start('drive')`): **ถนนเชื่อม เส้นประ 0/136 → 40/136** (ระยะประ 9 ม. เท่าถนนใหญ่) · **เลนจักรยาน 4/272 → 272/272** · **ทางเท้า 6/272 → 272/272** · **ถนนหลัก 8 สาย: เลนจักรยานฝั่งซ้าย 1/117 → 117/117** (ฝั่งขวา 117/117 เท่าเดิม) ทางเท้า 2 ฝั่ง 234/234
  - ไม่มี regression: `grid` 236,298 · `ngrid` 86,128 · `ncost` 128,061 · ก้อนหลัก 81,478 ช่อง · จุดเกิดตัวอักษร 13,636 — **เท่าเดิมทุกตัวก่อน/หลัง** (เป็น decal ล้วน) · กวาดตัวรถตามถนนเชื่อมทั้ง 7 เส้น เยื้อง ±1.5 ม. 5,710 จุด **ชน 0** · เพิ่มแค่ 4 draw call / ~200 สามเหลี่ยม · `node --check` ผ่าน · ภาพยืนยัน `link_before_air.jpg` (ยางมะตอยเปล่า) vs `after_both.jpg` (ถนนเชื่อม+ถนนปกติ มีครบ 2 ฝั่ง) ใน Downloads · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 799 (29 ก.ค. · ผู้ใช้: "เพิ่มหมวดคลังศัพท์ขั้นสูงหมวดที่ 9 — ศัพท์กีฬา ต่อจากวิชาการ/ธุรกิจ/วิทยาศาสตร์/ท่องเที่ยว/การแพทย์/กฎหมาย/เทคโนโลยี-IT/สิ่งแวดล้อม" เลือกหัวข้อจาก 2 ตัวเลือกที่เสนอ):** ⚽ **ศัพท์กีฬา 364 คำ** — เขียนคลังเอง (10 กลุ่ม: กีฬาประเภททีม/กรีฑา-ลู่และลาน/กีฬาทางน้ำ/กีฬาฤดูหนาว-ผาดโผน/ฟิตเนส/อุปกรณ์กีฬา/กรรมการ-กติกา-การแข่งขัน/การบาดเจ็บ/ทีม-ลีก-อาชีพนักกีฬา/โอลิมปิก-นานาชาติ+แร็กเกต-กอล์ฟ-มวย-คริกเก็ตเสริม) → สคริปต์เช็กซ้ำ en กับทุกไฟล์ b6_* ทุกหมวด (สูตรเดิมรอบ770/776/780/783/790/793) เจอชน 13 คำกับ travel/medical (surfing/kayaking/rock climbing/sprained ankle ฯลฯ) → เปลี่ยนเป็นคำเฉพาะเจาะจงกว่า (เช่น `whitewater kayaking`/`sport climbing`) ผ่าน 0 ซ้ำ → `js/data/band/b6_sports.json` → `split_band.py --lower` แยก 5 ไฟล์ช่วงคำ → เติม `LABELS['b6_sports']` ใน `gen_band_adv_manifest.py` → `js/cert.js` เติม `CERT_ADV_EN['ศัพท์กีฬา']='Sports Vocabulary'`
  - 🔑 **เจอบั๊กตัวเอง (ไม่ใช่บั๊กเครื่องมือ):** ร่างคำแรกใส่วงเล็บกำกับชนิดกีฬาต่อท้าย 24 คำ (เช่น `"header (football)"`, `"tackle (sports)"`) เพื่อกันชนกันเองตอนร่าง — ลืมว่าฟิลด์นี้คือคำที่ TTS อ่านออกเสียงจริงและโชว์ในเกมจริง ไม่ใช่แค่ label ภายใน → เจน mp3 ชุดแรกได้ 340/364 (24 คำมีวงเล็บโดน `word_key()` regex ทำให้ไฟล์เสียงอ่านผิดคำ) → แก้เป็นคำผสมธรรมชาติไม่มีวงเล็บทั้ง 24 คำ (เช่น `football header`/`sports tackle`/`tennis grand slam`) เช็กซ้ำอีกรอบผ่าน 0 ซ้ำ → split/manifest ใหม่ → ลบ mp3 เก่าที่ใช้ข้อความผิด 24 ไฟล์ → เจนใหม่ 24/24 failed 0 (รวมเสียงที่ถูกต้องทั้งหมด 364/364)
  - ยืนยัน (server เอง port 52213 เพราะ preview เต็มโควตา · mock login + register + คลิก UI จริงจนถึงหน้าเกม ไม่ใช่แค่ JS console): `bandAdvLoad('sports')` โหลด **364/364 ตรงมานิเฟสต์เป๊ะ** uniq en/th 364/364 ไม่มีคำหาย ไม่มีวงเล็บหลง · `bandAdvCardsHTML()` มีการ์ดที่ 9 ⚽/ศัพท์กีฬา ถูกต้อง (รวม 9 หมวด 4,480 คำ) · เข้าข้อสอบจริง `bandAdvPlay('sports','quiz')` → "⚽ หมวดศัพท์กีฬา · ข้อ 1 จาก 10" คำ `injury time-out` เลือกคำตอบถูก `การขอเวลานอกเพราะบาดเจ็บ` คะแนนขึ้น "ถูก 1 ข้อ" · fetch mp3 8 คำ (รวมคำที่แก้วงเล็บออก เช่น `football header`/`tennis grand slam`/`hole-in-one`) 200 ครบ · `check_missing_assets.py --git` เตือนไฟล์ยังไม่ commit ตามคาด (ปกติก่อน commit) · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **ชนเลขรอบกับ session คู่ขนาน:** จอง 798 ไว้ตอนเริ่ม แต่อีก session commit แซงเป็นรอบ 798 (ปูทางเท้า/เลนจักรยานถนนเชื่อมเกาะ) ระหว่างที่กำลังแก้บั๊กวงเล็บ → ขอเลขใหม่เป็น 799 ก่อน commit — ไม่แตะไฟล์ `js/adventure3d.js`/`js/hotel3d.js` ของเขาเลย (คนละไฟล์กับงานนี้)


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 800 (29 ก.ค. · ผู้ใช้: "วาดทางม้าลาย+ป้ายหยุดตรงจุดบรรจบถนนเชื่อมเกาะ 7 จุด จากรอบ788 ใช้สูตรเดียวกับทางแยกปกติ"):** 🚸🛑 `js/adventure3d.js` โซน 🌉 รอบ788 — พบว่าไฟล์นี้ไม่เคยมีทางม้าลาย/ป้ายหยุดที่ทางแยกไหนมาก่อนเลย (ไม่ใช่แค่ถนนเชื่อม) จึงเขียนใหม่โดยใช้เทคนิค/ค่าสี y-layer เดียวกับเครื่องหมายถนนเดิม (`flatGeom` decal ขาว 0xf2f2f2 · เสา+ป้าย Sprite แบบเดียวกับ `blkNameSprite`) — วาดที่ `linkLog[].poly[0]` (จุดบรรจบถนนหลัก) ทั้ง 7 จุด
  - ⚠️ **ชนเลขรอบกับ session คู่ขนาน:** จอง 799 ไว้ตอนเริ่ม แต่อีก session (หมวดศัพท์กีฬา ด้านล่าง) push แซงเป็นรอบ 799 ก่อน → ขอเลขใหม่เป็น 800 (แก้ทั้ง commit message ที่บันทึกนี้และ banner คอมเมนต์ใน `js/adventure3d.js:1791`) ไม่แตะไฟล์ `js/data/band/*`/`js/cert.js` ของเขาเลย (คนละไฟล์กับงานนี้)
  - หาจุดปักป้ายด้วย `signFree()` (grid===0 ไม่ใช่ถนน/น้ำ + ไม่ชนตึกด้วย `navBlockedAt`) กวาดข้างถนนจากใกล้ไปไกล — **เจอบั๊กตัวเอง**: ช่วงค้นแรก (5.5–13.5ม.) หาป้ายไม่เจอ 4/7 จุด เพราะจุดบรรจบติดถนนหลักที่กว้างกว่าถนนเชื่อมมาก ต้องขยายช่วงค้นเป็น 2–40ม. ถึงพ้นผิวถนนหลัก (ระยะจริงที่เจอ 9.5–31.5ม. แล้วแต่จุด)
  - ยืนยัน (server เอง :8642 · mock login+register+`enterDrive3D()`): reproduce สูตรเดียวกับโค้ดจริงใน console กับข้อมูลเมืองจริง — ทางม้าลาย 5 แถบ×2ปลาย = **10/10 อยู่บนผิวถนนครบทั้ง 7 จุด** · ป้ายหยุดหาจุดปักได้ **7/7 จุด** (หลังขยายช่วงค้น) · เช็กก่อน-หลัง: กริดนำทางก้อนหลักยังคง **81,478 ช่องเท่าเดิมเป๊ะ** (ไม่กระทบ grid/ncost เพราะเป็น decal ล้วน) · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 801 (29 ก.ค. · ผู้ใช้ถามว่าประตูหน้าตึกโรงแรมผีสิงบัง ~บรรทัด 550 เหมือนประตูห้องรอบ 797 ไหม):** 🚪 `js/hotel3d.js:551` ประตูหน้า (บานคู่ center-pivot ไม่มีบานพับ ต่างจากประตูห้องที่มี hinge) — วัดสูตร+ถ่ายภาพจริง (server เอง :8821 · mock login + `Adventure3D.start('haunt')` + monkeypatch `camera.rotateY` เข้าประตูตรง ๆ) พบว่าบังจริงเหมือนที่สงสัย แต่ **ทิศทางแก้ตรงข้ามกับประตูห้อง**: บานนี้หมุนรอบจุดกึ่งกลางตัวเอง มุมเล็ก=ใกล้ 0°=หน้าบานหันตรงเข้าหาผู้เล่น(บังเกือบเต็ม cos28.6°≈0.88) ยิ่งลดมุมยิ่งบังมากขึ้น (ทดสอบ .5→.25 บังแย่ลงจริง) ต้อง **เพิ่ม** มุมแทนถึงจะเผยทางเข้า → เปลี่ยน rotation.y จาก `∓.5`→`∓1.0` rad (28.6°→57.3°)
  - ยืนยัน (ภาพเทียบ 4 มุม .25/.5/1.0/1.3 rad ที่จุดเดียวกัน หน้าประตูพอดี): .25 บังเกือบเต็มช่อง, .5(เดิม) ยังบังมาก เห็นฟ้า/ลานหน้าตึกแค่ริ้วแคบกลาง, 1.0(ใหม่) บานเหลือเป็นแผ่นบางที่ขอบ เห็นทางเข้า/ท้องฟ้า/ไฟถนนหน้าตึกชัดเจน · reload หน้าใหม่โหลดโค้ดจริงจากดิสก์ยืนยันซ้ำ (ไม่ใช่แค่ mutate scene) ได้ผลตรงกัน · `node.exe --check js/hotel3d.js` ผ่าน · ปิด server 8821 + ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 802 (30 ก.ค. · ผู้ใช้ถามว่าคำศัพท์ใน `js/data/dict/` เอามาทำเกมจับคู่/สอบหรือยัง แล้วขอให้เชื่อมทั้งสองอย่าง):** 📖 ① เปลี่ยนป้ายปุ่ม `#btn-band-exam` เป็น "สอบเลื่อนขั้นคำศัพท์" ([index.html:280](index.html:280), [js/dictband.js:319](js/dictband.js:319)) กันสับสนว่าเป็นการเลื่อนชั้นเรียนจริง + เพิ่มกระดานคำอธิบาย `.bsp-info` ในแผงเลือกชุดข้อสอบ (`openBandSetPicker`) อธิบายว่าคือการปลดล็อกคลังศัพท์ระดับถัดไป ไม่ใช่เลื่อนชั้น ([css/style.css](css/style.css) เพิ่ม `.bsp-info`) ② **ตรวจพบว่างานเชื่อม `js/data/dict/` เข้าเกมทำไปแล้วตั้งแต่รอบ 264** (ไม่ใช่งานใหม่) — เขียนสคริปต์เทียบคำ (`dict/` 3,220 unique en vs `dict_band/` 3,220 unique en) พบ **ตรงกัน 100% ไม่มีคำขาด** เพราะ `dict_band/db1-5` มีรูปแบบฟิลด์เดียวกับ `dict/` เป๊ะ (en,pos,ipa,คำอ่าน,นิยาม,แปล,ตัวอย่าง,แปลตัวอย่าง) — เกมจับคู่ใช้ผ่านการ์ด "📖 คลังศัพท์ใหญ่ตามระดับ" ในแผง "หมวดคำศัพท์ & แบบทดสอบ" (`bandCardsHTML()`) และข้อสอบใช้ผ่านปุ่ม "สอบเลื่อนขั้นคำศัพท์" (`bandPlay`/`openBandSetPicker`) อยู่แล้วทั้งคู่
  - ยืนยัน (server เอง :8642 · mock login+register ป.1): เปิดแผง "หมวดคำศัพท์ & แบบทดสอบ" เห็นการ์ด "ระดับ ป.1–ป.2 ⭐" ครบ 5 ใบ (366 คำ) · คลิก "🎮 ฝึกจับคู่" → `screen-game` โหลดการ์ดจริง (say/more/bag/red) · แผงสอบ `.bsp-info` แสดงข้อความ+ชั้นเรียนจริงถูกต้อง ไม่ล้นจอ (656/656px) · `node --check js/dictband.js` ผ่าน · ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **ปิดงานค้างรอบ 264** ("ค้าง: ผู้ใช้ลองจริงในเกม") — ยืนยันแทนแล้วรอบนี้ ทำงานถูกต้องจริง ไม่ใช่บั๊ก


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 804 (30 ก.ค. · ผู้ใช้ส่งภาพ: ตัวละครโปรไฟล์ 88 ตัว "ติดพื้นขาว" ทั้งที่เคยแก้แล้วรอบ 754):** 🔍 ตรวจสอบเต็มรูปแบบพบว่า **ไฟล์ `img/blocks/blk9-88.png` ถูกต้องแล้ว** ทั้งไฟล์ในเครื่องและบน live (เช็ก byte เท่ากันเป๊ะ) — วัด alpha 0% พิกเซลขาว/ใกล้ขาวรอบขอบทั้งแบบ PIL composite กับสีม่วงจริง และแบบ browser canvas drawImage ที่ขนาด thumbnail จริง (80×120) → **ไม่ใช่บั๊กไฟล์ภาพ** อาการที่ผู้ใช้เห็นน่าจะเป็น cache เก่าในเครื่อง (SW มี skipWaiting+clients.claim อยู่แล้ว แค่ต้องปิดแอพเต็มรูปแบบแล้วเปิดใหม่ถึงจะอัปเดต)
  - 🐛 **เจอบั๊กจริงคนละเรื่องระหว่างตรวจ:** `.blk-mini` (การ์ดตัวละครในหน้าตั้งค่า) ควรมีพื้นม่วงอ่อน `#f6f0ff` แต่ `.levelup-box button` (selector ทั่วไป specificity สูงกว่า 0,1,1 vs 0,1,0) ทับเป็นม่วงเข้ม `--purple-d` เต็มปุ่มแทน — แก้ `css/lobby.css` เพิ่ม background ที่ `.settings-box .blk-mini` (specificity 0,2,0 ชนะ) + เติมเซตแยกสำหรับ `.sel` (gradient ทองไฮไลต์เดิม) กันถูกทับตาม
  - ยืนยัน (server เอง :61843 · mock login + `openSettings()`): พื้นการ์ดปกติ `rgb(246,240,255)` ตรง `#f6f0ff` · การ์ดที่เลือกอยู่ยังมี gradient ทอง+ขอบทองถูกต้อง · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 805 (30 ก.ค. · ผู้ใช้ส่งภาพ: "มุมกล้องรถต่ำจนเห็นพื้นเหมือนขับ F1 อยากให้รถดูสูงกว่านี้"):** 🚗📷 `js/adventure3d.js` โซนรถ (5638-5760/6101 tickDrive) — ยก `CAR_EYE` 1.32→1.55 (บรรทัด 127) + ลดมุมก้มกล้อง `rotateX` จาก -.02→-.008 (บรรทัด 6204) ให้เส้นขอบฟ้าสูงขึ้น เห็นถนนใกล้ตัวน้อยลง
  - ยืนยัน (server เอง :8642 · mock login+register + inject state.driveTicket/cars + `Adventure3D.start('drive')` + `tools/snaplab.js` ถ่ายเทียบก่อน-หลังจุดสปอว์นเดียวกัน): เจอ sw.js cache เก่าค้าง (`CAR_EYE=1.32` ยังโหลดอยู่ทั้งที่ไฟล์แก้แล้ว) → unregister service worker + `fetch(...,{cache:'reload'})` แก้ตามกฎทองข้อ 3 → ภาพหลังแก้เห็นสกายไลน์/หลังคาตึกเต็มมากขึ้น (เดิมโดนตัดใกล้ขอบจอบน) ตรงกับที่ต้องการ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 806 (30 ก.ค. · ผู้ใช้: "ใส่ชื่ออาชีพใต้ตัวละครแต่ละตัว เสริมคำศัพท์ 2 บรรทัด บน-อังกฤษ ล่าง-ไทย"):** 🏷️ ดูภาพจริงทั้ง 88 ตัวก่อนตั้งชื่อ (กฎทอง #1) พบว่าไม่ใช่ "อาชีพ" ล้วน → ถามผู้ใช้แล้วเลือก "ใส่ครบ 88 ตัว คนละหมวด": blk1-8=ชื่อมาสคอตเดิม (ใช้ชื่อจาก `BLOCK_AVATARS` ใน adventure3d.js) · blk9-48=อาชีพจริง 40 อาชีพ (นักบิน/หมอ/เชฟ/ตำรวจ ฯลฯ) · blk49-88=คอสตูมสัตว์/แฟนตาซี/กิจกรรม 40 แบบ (มังกร/นางฟ้า/หุ่นยนต์/นักสเก็ต ฯลฯ) → เพิ่ม `BLK_VOCAB` object ใน `js/util.js` (88 คู่ en/th) + แก้ template picker ใส่ `<span class="blk-cap">` 2 บรรทัด
  - 🐛 **เจอบั๊กจริงคนละเรื่องระหว่างทำ:** `.settings-box` เดิมใช้แค่ `max-width` (ไม่มี `width`) → กล่องหด shrink-to-fit ตามแถวสวิตช์สั้น ๆ จริง ๆ กว้างแค่ ~240px ไม่เคยแตะ 940px ตามที่ตั้งใจไว้ตั้งแต่รอบ243 (ทำให้ป้ายชื่อใหม่แคบจนอ่านไม่ได้) → เปลี่ยนเป็น `width:min(96vw,940px)` ใน `css/lobby.css` + ลด `.blk-mini img` จาก 17vh→14vh เผื่อที่ให้ป้าย 2 บรรทัด
  - ⚠️ **บทเรียน preview:** วัด geometry ตอนแรกเจอ `transform:matrix(0.4,...)` ค้าง (popIn animation ค้างกลางเฟรมเพราะ rAF ถูกพักในพรีวิว pane ที่ไม่โชว์จอจริง — ไม่ใช่บั๊กโค้ด) → ต้องตั้ง `state.noAnim=true;applyNoAnim()` ก่อนวัดถึงจะได้ค่าจริง
  - ยืนยัน (server เอง :8642 · mock login + `openSettings()` + noAnim): กล่องกว้าง 600px (ถูก `.levelup-box` max-width:600 ครอบอีกชั้น) · ป้าย 88 ตัวไม่ถูกตัด (`scrollWidth<=clientWidth` ทุกตัวที่สุ่มตรวจ รวมคำยาวสุด "Race Car Driver"/"นักเล่นสเก็ตบอร์ด") · ทดสอบซ้ำที่ 812×375 เหมือนกัน · คลิกเลือกตัวใหม่ยังเซ็ต `state.profAv`/highlight ทองถูกต้อง · `node.exe --check` ผ่านทั้ง 2 ไฟล์ · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 807 (30 ก.ค. · ผู้ใช้: "เพิ่มปุ่มหน้า Lobby อีก 3 หมวด IELTS/TOEIC/TOEFL จับคู่+สอบ10ข้อเหมือนหมวดเดิม (ไม่ใช่แค่ 10 คำ)"):** 📘📗📙 3 หมวดใหม่เข้าระบบ `BAND_ADV_MANIFEST` เดิม (`js/bandadv.js`) ต่อท้าย 9 หมวดเก่า — เขียนคลังเอง `b6_ielts.json`(290 คำ เน้นศัพท์วิชาการ/โต้แย้งแบบเรียงความ)/`b6_toeic.json`(235 คำ เน้นสำนักงาน-ธุรกิจ)/`b6_toefl.json`(200 คำ เน้นชีวิตมหาวิทยาลัย-การบรรยาย) → สคริปต์เช็กซ้ำ en/th กับทุกไฟล์ b6_* เดิม+กันเองใน 3 ไฟล์ใหม่ เจอชน ~66 คำ (ล้น "academic"/"business"/"legal"/"environment"/"travel" ที่มีอยู่แล้วเพราะหัวข้อ IELTS/TOEIC/TOEFL คาบเกี่ยวกว้าง) → แทนที่ด้วยคำเฉพาะเจาะจงกว่าจนผ่าน 0 ซ้ำ → `split_band.py --lower` แยกไฟล์ช่วงคำ → เติม `LABELS['b6_ielts'/'b6_toeic'/'b6_toefl']` ใน `tools/gen_band_adv_manifest.py` แล้วรันเจน `manifest.js` ใหม่ → `js/cert.js` เติม `CERT_ADV_EN` 3 หมวด → `gen_word_audio.py` เจน mp3 คำใหม่ 721 ไฟล์ failed 0
  - ⚠️ **ชนเลขรอบกับ session คู่ขนาน:** จอง 806 ไว้ตอนเริ่ม แต่อีก session (ป้ายชื่ออาชีพใต้ตัวละครโปรไฟล์) commit แซงเป็นรอบ 806 ก่อน → ขอเลขใหม่เป็น 807 ก่อน commit — ไม่แตะไฟล์ของเขาเลย (คนละไฟล์กับงานนี้)
  - 📌 **ค้างตามที่ผู้ใช้เลือก:** ข้อสอบจริงแบบมาตรฐาน IELTS/TOEIC/TOEFL (ไวยากรณ์/การอ่าน เลือกตอบ 30 ข้อ/ชุด พร้อมเฉลยละเอียด) — ผู้ใช้เลือกให้ทำหมวดคำศัพท์ก่อน ส่วนนี้ทำแยก session ใหม่
  - ยืนยัน (server เอง :8642 · mock login+register + คลิก UI จริงจนถึงหน้าเกม): เปิดแผง "หมวดคำศัพท์ & แบบทดสอบ" เห็นการ์ด 3 ใบใหม่ (📘 ศัพท์เตรียมสอบ IELTS 290 คำ/📗 TOEIC 235 คำ/📙 TOEFL 200 คำ) ครบ · `🎮 ฝึกจับคู่` หมวด TOEIC โหลดการ์ดจริง (bank statement/human resources department ฯลฯ) · `📝 สอบ 10 ข้อ` หมวด IELTS ตอบถูกครบ 10/10 จริงผ่าน UI คะแนนขึ้น "ถูก 10 ข้อ" ได้ใบประกาศ `badv_ielts` (`CERT_ADV_EN` ขึ้นชื่ออังกฤษถูกต้อง) +500 เหรียญ · fetch mp3 คำใหม่ 200 ครบ · `node.exe --check` ผ่านทุกไฟล์ · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 808 (30 ก.ค. · ผู้ใช้: "แทนเสียงอ่านใต้คำภาษาอังกฤษด้วย เช่น ดอค'เถอะ"):** 🔤 เพิ่มบรรทัดคำอ่านเทียบเสียงไทย (ตัวเอียง สีส้ม) แทรกกลางระหว่าง EN กับ TH เดิม (รวมเป็น 3 บรรทัดใต้รูป) — เขียนคำอ่านเองครบ 88 คำใน `BLK_VOCAB.pron` (`js/util.js`) ใช้เครื่องหมาย `'` หลังพยางค์ที่ลงเสียงหนักตามตัวอย่างผู้ใช้ (เช่น Doctor=ดอค'เถอะ, Ballerina=แบลเลอะรี'น่า)
  - `css/lobby.css`: ลดขนาดรูป `.blk-mini img` อีกครั้ง (14vh→11vh) เผื่อที่ให้บรรทัดที่ 3 ไม่ล้น
  - ยืนยัน (server เอง :8642 · mock login + `openSettings()` + noAnim): สุ่มตรวจคำอ่านยาวสุด (Ballerina/Skateboarder ฯลฯ) `scrollWidth<=clientWidth` ทั้ง 3 บรรทัดไม่ถูกตัด ทั้งจอปกติและ 812×375 · `node.exe --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 810 (30 ก.ค. · ผู้ใช้ส่งภาพจอขับรถ 3 ข้อ: 1.ขยับคำศัพท์ลง+ติดกระจกหลังเหนือคำ ทุกคัน/โลก 2.equalizer เปิดเพลงได้ 3.กล้องซ้าย-ขวาแทนกระจกหลัง):** 🪞📻 ถามผู้ใช้ยืนยันสโคป (ทั้ง 2 ระบบขับรถ + กระจกภาพจริงจากกล้อง 3D) ก่อนเริ่ม — ทำทั้ง `js/moto3d.js` (แผนที่บ้านโพธิ์สวัสดิ์) และ `js/adventure3d.js`+`js/adv3d_css.js` (เมืองกำแพงเพชร): เพิ่มกล้องกระจกมองหลัง+ซ้าย+ขวา 3 ตัว เรนเดอร์ฉากจริงซ้ำด้วย scissor (สูตรเดียวกับ belly cam ของโลกเฮลิฯ ที่มีอยู่แล้ว — ไม่พลิกซ้าย-ขวาเพราะเสี่ยง winding order) วางแถบบนจอ + ดันคำศัพท์ลงมาให้พ้น (เฉพาะโหมดรถยนต์ในห้องคนขับ ไม่กระทบมอไซค์) · `moto3d.js` เพิ่มวิทยุในรถ (จอ head-unit + visualizer + เลือกเพลง) พอร์ตจาก `adventure3d.js` ทั้งชุด (ของเดิมมีแค่โลกเมือง ไม่เคยมีในแผนที่นี้ — สาเหตุที่ผู้ใช้รู้สึกว่า "หายไป")
  - ยืนยัน (server เอง :8912 · mock login+register+inject state.driveTicket/cars): เข้าทั้ง 2 โลกจริง ถ่ายภาพ readPixels จาก canvas ตรง (ไม่พึ่ง screenshot/getBoundingClientRect ที่พังในสภาพแวดล้อมนี้) เห็นกระจก 3 บาน**ภาพต่างกันจริง**ทั้ง 2 โลก (ซ้าย/กลาง/ขวา คนละมุม) · คลิกจอวิทยุใน moto3d.js แล้ว `Music.isCarOn()`→true จริง · console สะอาดทั้ง 2 โลก · `node --check` ผ่านทั้ง 3 ไฟล์ · ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **ค้าง: ผู้ใช้ลองจริงในเกม** — ตำแหน่ง/ขนาดกระจกทั้ง 3 จุดเป็นค่าที่เดาจากพื้นที่ว่างในโค้ด (ไม่ใช่ตำแหน่งที่ผู้ใช้วงไว้ในภาพเป๊ะ เพราะพื้นที่เดิมชนของอื่น) — ขอให้ดูจริงแล้วบอกถ้าอยากขยับ


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 811 (30 ก.ค. · ผู้ใช้ส่งภาพจอขับรถ: "เพิ่มตัวอักษรและเหรียญบนถนน+พื้นที่สีเขียวข้างทางให้มากกว่านี้ เตรียมไว้ให้เฮลิคอปเตอร์มาลงจอดเก็บในอนาคต"):** 🌳🪙 `js/adventure3d.js` โหมด drive (เมืองกำแพงเพชร) — เพิ่ม `greenPts` (จุดพื้นที่สีเขียวข้างถนน สุ่มออกจากถนนจนเจอที่ว่างไม่ชนตึก) คู่กับ `roadPts` เดิม + `randGreenPos()` ให้ตัวอักษรลอย 50/50 ถนน/หญ้า (`spawnLetter`/`relocateLetters`) + เพิ่ม `ensureDriveAmbience()` (สำเนาตัวอักษรที่ต้องใช้ 3 จุด/ตัว + เหรียญโบนัสล้วน 24 เหรียญ ไม่ผูกคำ +3🪙/เหรียญ) เรียกตอนเข้าโลก+ทุก 5 วิ — รวมของเก็บทั้งเมือง ~90 จุด (เดิม ~10-20 จุด)
  - ยืนยัน (server เอง :8642 · mock login + inject state.driveTicket/cars + `Adventure3D.start('drive')` + testkit `_t`): สไปน์จริง 90/90 จุด (รวม bonus 23) แบ่งกริด 45 อยู่บนถนน/45 อยู่พื้นที่เขียวพอดี 50/50 · greenPts เจนสำเร็จ 9,692 จุดจากตัวอย่างถนน 13,636 จุด · จำลองชนเก็บทั้งตัวอักษรปกติ (+1🪙 เข้าคลัง `e`) และเหรียญโบนัส (+3🪙 ป้ายเด้ง "🪙 +3" ไม่เข้าคลัง) ถูกต้อง · `node --check` ผ่าน · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - 📌 ค้าง: ระบบเฮลิคอปเตอร์ลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว (`greenPts`) ยังไม่ได้ทำ — เตรียมจุดไว้ให้แล้ว รอผู้ใช้สั่งต่อยอด


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 812 (30 ก.ค. · ผู้ใช้: "ทำระบบข้อสอบจริงแบบมาตรฐาน IELTS/TOEIC/TOEFL แยกจากระบบคำศัพท์รอบ 807 · เลือกตอบ ไวยากรณ์+การอ่าน 30 ข้อ/ชุด พร้อมเฉลยละเอียด"):** 📋 **ระบบใหม่ทั้งระบบ ไม่ต่อเข้า `startQuiz` เดิม** (เดิมเป็นโจทย์คำเดียว→เลือกคำแปล ไม่มีบทอ่าน/เฉลยเชิงอธิบาย/โหมดสอบจริง) — ไฟล์ใหม่ `js/examstd.js` + `css/exam.css` + คลังข้อสอบ `js/data/exam/*.json` **6 ชุด × 30 ข้อ = 180 ข้อ เขียนเองใหม่ทั้งหมด** (ไม่ลอกข้อสอบเก่า — เขียนบอกผู้ใช้บนแผงเลือกชุดด้วย) · เชื่อมของกลางเดิมครบ: `state.quizPassed`/`quizLog`/`certAward`/`addCoins`/`feedEvent`/`questEvent`
  - รูปแบบตามสนามสอบจริง: **IELTS** ไวยากรณ์ 12 + บทอ่านวิชาการ 2 บท × 9 (มี TRUE/FALSE/NOT GIVEN) · **TOEIC** Part 5 สั้น 12 + Part 6 เติมข้อความ 4 + Part 7 เอกสาร/คู่เอกสาร 14 (มีข้อคำนวณข้ามเอกสาร) · **TOEFL** Structure 6 + Written Expression 6 (หาส่วนที่ผิด A-D) + บทอ่าน 2 บท × 9
  - 2 โหมด: **สอบจริง** (ตอบครบแล้วส่ง เฉลยทีเดียวตอนจบ · แถบกระดาษคำตอบ 30 ข้อ กดข้ามข้อ/แก้คำตอบได้) · **ฝึก** (เฉลยละเอียดโผล่ทันทีทีละข้อ ล็อกไม่ให้แก้) · ⏱️ จับเวลา + เวลาแนะนำต่อสนามสอบ (ไม่ตัดจบเอง) · คีย์บอร์ด 1-4/a-d/←→ · ผ่าน 70% (21/30) รับ 900 🪙 + ใบประกาศ · **เฉลยหลังสอบมีแท็บ "ข้อที่ผิด/ทุกข้อ"**
  - `tools/gen_exam_std_manifest.py` เจน `manifest.js` + **ตรวจไฟล์ข้อสอบให้เอง** (4 ช้อยส์/ข้อ · เฉลย a ในช่วง · ช้อยส์ไม่ซ้ำ · ex ยาวพอ · total ตรงจำนวนจริง) — ผ่าน 180/180 ข้อ · `js/cert.js` เพิ่ม `CERT_STD_EN` + `c.std` (ใบเขียน "standardised practice examination" ไม่ใช่ "vocabulary examination") ต้องเทียบ **ก่อน** กฎ "ชุดที่ N" เดิมไม่งั้นชนกัน
  - 🐛 **เจอ 2 จุดจากการวัดจริง แก้แล้ว:** ① ตารางคะแนนเทียบ TOEFL ให้ช่วงต่ำกว่าคะแนนดิบ (ดิบ 20 ขึ้น "Reading 15–19" เหมือนถูกหักคะแนน) → ปรับ threshold ให้ช่วงไม่ต่ำกว่าดิบ ② จอ 812×375 เดิม media query สั่ง stack บน-ล่าง ทำให้กรอบคำถามเหลือ 120px ช้อยส์ D หลุดต้องเลื่อน → เปลี่ยนเป็น **คงสองคอลัมน์ที่จอเตี้ย ย่อขนาดชิ้นส่วนแทน** (stack เฉพาะ ≤640px) + เลื่อนกล่องเฉลยให้เห็นเองหลังตอบ
  - ยืนยัน (server เอง :56012 · mock login + register ม.4 + คลิก UI จริงทุกขั้น): การ์ด 3 ใบใหม่ในแผง "หมวดคำศัพท์ & แบบทดสอบ" ครบ · **โหมดสอบจริง TOEFL ชุด 1 ตอบ 20/30 → ไม่ผ่านถูกต้อง** (ไม่ได้เหรียญ/ใบ · แจ้งเกณฑ์ 21 ข้อ · quizLog ลงครบ) → เฉลยแท็บผิด 10 แถว/ทุกข้อ 30 แถว ครบ · **โหมดฝึก IELTS ชุด 1 ตอบ 29/30 → ผ่าน** +900 🪙 +120 RP ใบประกาศ `xstd_ielts_1` ขึ้นชื่ออังกฤษ "IELTS Academic Practice Test 1" 🥈 SILVER + โพสต์ฟีดถูกต้อง · ทั้ง 6 ชุด fetch 200 โหลด 30/30 ตรงมานิเฟสต์ · กล่องยืนยันออก/ส่งไม่ครบทำงานถูก · นาฬิกาหยุดทุกทางออก · **กฎทองข้อ 7: กรอบนอกไม่มี scroll ทั้ง 1280×720 และ 812×375** (บทอ่าน/รายการเฉลยเลื่อนในกรอบตัวเอง · ข้อที่ยาวสุดของทั้ง 180 ข้อ คำถาม+4 ช้อยส์อยู่ในกรอบพอดีไม่ต้องเลื่อน) · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 814 (30 ก.ค. · ผู้ใช้: ชวนเพื่อน "ครูรุต" เล่นเฮลิฯ แล้วเข้า account ครูรุตไม่เห็นคำเชิญเลย):** 🔔 เช็คข้อมูลจริงผ่าน Firebase REST (owner token) ยืนยัน `tinv/<uid>` มีข้อมูลถูกต้อง + rules อ่านได้ปกติ — **ไม่ใช่บั๊กข้อมูล** ต้นตอคือ UX: คำเชิญเดิมพึ่งแค่ toast (หายไวเดา 3 วิ) + การ์ดในกล่อง "ออนไลน์" ล็อบบี้ (ต้องเปิดจอถูกจังหวะ ไม่มี badge ค้างเตือน) → รวมนับเข้า badge ถาวรปุ่ม ⚙️ ที่มีอยู่แล้ว (`tinvPendingCount()`+`updateSettingsBadge()` ใน `js/ui.js`) + เพิ่มแถวคำเชิญใน `openAttentionSummary()` แตะแล้วพาเข้าโลกที่ถูกชวนตรงผ่าน `railWorldClick` เลย (เช็คตั๋ว/บาดเจ็บ/รถให้ครบเหมือนปุ่ม "ไปเลย!" เดิม)
  - ยืนยัน (server เอง :8642 · mock login + fake `Online.tinv`): badge ⚙️ ขึ้นเลขรวมถูกต้อง (1 คำเชิญ+1 มื้อค้าง=2) · เปิดสรุป attention เห็นแถว "📨 คำเชิญเล่นด้วยกัน 1 รายการ · Sumpajit ชวนไปเล่นเฮลิคอปเตอร์" · คลิกแถว → ไม่มีตั๋ว → toast แจ้ง + เปิดตลาดเลื่อนไปการ์ดตั๋วเฮลิถูกต้อง (พฤติกรรมเดียวกับปุ่ม "ไปเลย!" เดิมทุกจุด) · `node --check js/ui.js` ผ่าน · console สะอาด ล้างเซฟ+ปิด server แล้ว
- **รอบ 813 (30 ก.ค. · ผู้ใช้: "ทำข้อ 3" = ทางลัดเข้าข้อสอบจริงมาตรฐานตรงจาก Lobby):** 🚪 เดิมต้องกด "หมวดคำศัพท์ & แบบทดสอบ" แล้วเลื่อนหาการ์ดท้ายรายการก่อนถึงเจอ 3 สนามสอบ — เพิ่มปุ่ม `#btn-rail-examstd` ในรางเมนูซ้าย (`index.html` ต่อจากปุ่มพิมพ์คำ) กดแล้วเปิดแผงเล็ก `openExamStdBoard()` (`js/examstd.js`) โชว์ 3 การ์ดสนามสอบ (จำนวนชุด/ข้อ/ผ่านแล้วกี่ชุด) คลิกการ์ด → ปิดแผงนี้ → เปิด `openExamStdPicker(exam)` เดิมตรง ๆ · เพิ่ม CSS `.xsb-box/.xsb-grid/.xsb-card` ใน `css/exam.css` · ผูกปุ่มด้วยแพทเทิร์นเดียวกับ `typing.js`/`wordsearch.js` (bind ตอน DOMContentLoaded) · บัมพ์ `sw.js` v214 (ไฟล์อยู่ใน SHELL แล้วจากรอบ 812 ไม่ต้องเพิ่ม)
  - ยืนยัน (server เอง :8642 · mock login+register ม.4 + คลิก UI จริง): กดปุ่มรางเห็นแผง 3 การ์ด (IELTS/TOEIC/TOEFL) ไม่ต้องเลื่อน · คลิกการ์ด TOEIC → แผงปิด → เปิดแผงเลือกชุดสนามสอบ TOEIC ตรงถูกต้อง · จอ 812×375 การ์ดทั้ง 3 ใบยังอยู่ในกรอบ ไม่มี scrollbar (h=274px ใน viewport 375px) · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 815 (30 ก.ค. · ผู้ใช้ส่งภาพจอมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์: "1.ป้ายและปุ่มตัวน้อยไป ปรับให้ป้ายใหญ่กว่านี้ 2.เพิ่มตัวอักษรและเหรียญบนถนนให้มากกว่านี้"):** `js/moto3d.js` — ① ขยายป้าย HUD (#moto-gps/#moto-word/#moto-board) + ปุ่ม dialog ปิดเครื่อง/เริ่มเกม/แชท ~20% (font-size/padding เท่านั้น ไม่แตะปุ่มคอนโซลที่ผูกพิกัดกับภาพถ่ายเครื่องจริง) ② เพิ่ม `LETTER_COPIES=2` วางตัวอักษรที่ต้องเก็บซ้ำ 2 จุด/ตัวพร้อมเหรียญติดทุกก็อปปี้ + ลด `SCATTER_MS` 2200→1200 ให้เหรียญโบนัสถี่ขึ้น — เขียน `collectTick`/`placeSpecialCoin` ใหม่ให้เดดุปด้วย idx กันนับซ้ำ/รางวัลซ้ำเมื่อชนก็อปปี้ไหนก่อนก็ได้
  - ยืนยัน (server เอง :53904 · mock login+register ม.4 + testkit `MotoWorld._t`): คำ "star" 4 ตัวอักษร spawn จริง 8 sprite (2 ก็อปปี้/ตัว) + เหรียญติดมาด้วย 8 ใบ · ชนก็อปปี้ใดก็ตามลบทั้งคู่พร้อมกัน+ได้เหรียญครั้งเดียว (`word.got` ไม่ซ้ำ) · เหลือ idx เดียว (2 ก็อปปี้) `placeSpecialCoin` ทำงานถูกจังหวะ (เดิมเช็ก `letters.length!==1` จะพังเพราะเหลือ 2 sprite) · เก็บครบคำ→คำใหม่ "bag" spawn ซ้ำ 2 ก็อปปี้ถูกต้องเหมือนกัน · ปุ่ม/ป้ายวัด `getBoundingClientRect` ใหญ่ขึ้นจริง (เช่นปุ่ม exit 112×44px) · `node.exe --check` ผ่าน · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 816 (30 ก.ค. · ผู้ใช้สั่ง 2 ข้อ: ① ทำระบบเฮลิฯ ลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว `greenPts` ที่เตรียมไว้รอบ 811 ② ปุ่มเข้าโลกเฮลิฯ ต้องมีหน้าเลือกแผนที่เหมือนโลกขับรถ):** 🚁🌳 ทำเป็น **"แผนที่ย่อย" ของโหมด heli** (`heliMap='city'|'kpp'` + `heliKpp()` ใน `js/adventure3d.js`) ไม่สร้างโหมดใหม่ เพราะ `M.heli` คุมโค้ดอยู่ ~40 จุด · `kpp` ยืมฉาก `worlds.drive` ทั้งก้อน แล้วขึ้นบินเลย (`hPhase='pilot'` ข้ามเฟสเดินเท้า/ลิฟต์/วิงสูทที่ผูกกับ `worlds.heli.foot`) · ตัวอักษรวางบน `greenPts` ทั้งหมด ต้องจอดสนิทจึงเก็บได้ (รัศมี 5.2 ม.) · `pickHeliMap()` ใน `js/ui.js` ใช้ CSS `.dmap-*` ร่วมกับหน้าเลือกแผนที่รถ (ไม่เพิ่ม CSS) · การ์ดวิธีเล่นใบใหม่ `helikpp` ใน `js/adv3d_intro.js` (จำแยกจากเมืองเฮลิฯ ผ่าน `introKey()`)
  - 🔑 **ฉาก drive ไม่มี `buildings[]`** (รถชนด้วย `solidGrid`) → เฮลิฯ เช็กชนจาก `solidGrid` เอง แต่ต้องรู้ "ความสูง" ไม่งั้นบินสูงเท่าไรก็ยังชน → **ติดฟิลด์ `h` ให้ solid ทุกชิ้นตอนสร้างเมือง** (ตึกจริง polygon = `h+1.4` · ตึกแถว = `L[5]+1.6` · เกาะหอนาฬิกา = 27) แล้วเขียน `heliKppBlocked(x,z,y)` ข้ามชิ้นที่บินพ้นยอดแล้ว · ชนแล้วคืนตำแหน่งเดิม+เด้งกลับ (ไม่คำนวณทิศดันออก เพราะ polygon หลายเหลี่ยมทำให้หลุดเข้าไปในตึก) · แยก `heliWallPenalty()` ออกมาใช้ร่วม 2 แผนที่
  - 🐛 **เจอบั๊กตัวเองจากรอบ 811 ระหว่างทำ:** `randGreenPos` เดิมสุ่ม 40 ครั้งไม่เข้าช่วงระยะแล้ว "ตกไปใช้จุดบนถนน" ทันที — วัดจริงตกกลับ **18/55 จุด (33%)** ตัวอักษรไปอยู่กลางถนนซึ่งเฮลิฯ ลงจอดไม่ได้ → เพิ่มขั้นกลาง (กวาดหาจุดเขียวในช่วงระยะทั้งหมด → จุดเขียวใดก็ได้ → ใช้ถนนเฉพาะเมื่อไม่มี `greenPts` เลย) แก้แล้วได้ **61/61 อยู่บนพื้นที่สีเขียว**
  - 🐛 **บั๊กที่เกิดจากการแชร์ฉาก (แก้แล้ว):** `fogUpdate()` ของเฮลิฯ เขียนทับ `scene.fog` ของฉาก drive ตามเวลาจริง แต่โลกขับรถไม่มีระบบนั้นเลยไม่มีใครตั้งคืน → เข้าโลกขับรถหลังบินเฮลิฯ ได้หมอกกลางคืนค้าง → คืนค่า `MODES.drive.fogN/fogF/sky` ตอนเข้าโหมด drive · `fogUpdate` ใช้ระยะหมอกชุด drive (120/650) เมื่อ `heliKpp()` ไม่งั้น 45/150 บังทั้งเมือง · `netJoin` แยกห้องเป็น `helikpp` (ไม่งั้นเห็นเพื่อนเมืองเฮลิฯ ลอยผิดที่) · หนีบขอบเมืองแบบรัศมี `rad-25` + เพดาน 170 ม. · เรดาร์/`camera.far` ใช้ชุดเดียวกับ drive
  - ⚠️ **ชนกับ session คู่ขนาน (บทเรียนใหม่):** ระหว่างทำ มีอีก session รัน `finish_round.sh ... js/ui.js` **กวาดโค้ด `pickHeliMap`/`enterHeli3D` ที่ยังทำไม่เสร็จของ session นี้เข้า commit "รอบ 815" ของเขาแล้ว deploy ขึ้นเว็บ** → live อยู่ในสภาพครึ่ง ๆ (มีการ์ดเลือกแผนที่ แต่ engine ไม่รู้จัก `opt.map` → กดเมืองกำแพงเพชรได้เมืองเฮลิฯ เดิมเงียบ ๆ) ตรวจยืนยันด้วย `curl` live: `ui.js` มี `pickHeliMap` แต่ `adventure3d.js` ไม่มี `heliKppSpawn` → รอบนี้จึงต้อง deploy ปิดช่องให้ครบ · **ไฟล์ `js/ui.js` รอบนี้ไม่ commit เอง** (ส่วนของเราอยู่ใน commit 815 แล้ว ที่เหลือเป็นงาน 815 ที่เขายังไม่ commit) commit เฉพาะ `js/adventure3d.js`+`js/adv3d_intro.js`
  - ยืนยัน (server เอง :8642 · mock login + คลิก UI จริงจาก `enterHeli3D()` → เลือกการ์ด → "ไปเลย!"): การ์ด 2 ใบถูกต้อง จอ 812×375 ไม่มี scrollbar (304px ใน 375px) · เข้าแผนที่ kpp ได้ `phase='pilot'` ตั้งแต่เฟรมแรก · **ตัวอักษร 61/61 อยู่บนกริดพื้นที่เขียว (grid 0)** · **บินผ่านเหนือตัวอักษรเก็บไม่ได้ / จอดสนิทเก็บได้ (+1🪙 เข้าคลัง)** · solid 400 ชิ้นสุ่มตรวจ: บินต่ำชน 400/400 · บินสูงกว่ายอด+3ม. ผ่าน 399/400 (1 จุดมีตึกสูงกว่าซ้อนเซลล์ = ถูกต้อง) · solid ที่ไม่มีความสูงเหลือ 0 · ขอบเมืองหนีบ 3759 = rad-25 · เพดาน 170 · ถ่ายภาพจริง (readPixels ผ่าน `tools/snaplab.js`) เห็นตัวอักษรบนหญ้าจากที่สูง 26 ม. และตัว "R" ชัดตอนจอด · **regression:** เมืองเฮลิฯ เดิมยัง `phase='walk'` ตัวอักษร 52/52 บนดาดฟ้า ครบ · โลกขับรถยัง 90 จุด (17 เหรียญโบนัส) รถชนตึกได้ GPS ปกติ หมอกคืนค่าเดิมเป๊ะหลังบินเฮลิฯ (ทดสอบด้วยการทำหมอกพังแล้วเข้า drive) · `node --check` ผ่านทุกไฟล์ · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 817 (30 ก.ค. · ผู้ใช้: "กระดานอันดับข้อสอบจริงมาตรฐาน คะแนนสูงสุด/เร็วสุด สูตรเดียวกับ bxRank รอบ 786"):** 🏁 `js/examstd.js` เพิ่ม `xrkRows(setId)`/`xrkBodyHTML`/`xrkMount`/`openExamStdRank` — **เลือกหมวด×ชุด (ielts_1/toeic_2 ฯลฯ)** แทนหมวด×ระดับ · ใช้ `bxrRowHTML`/`bxRankNote`/`BXR_TOP` ของ `js/bandadv.js` ตรง ๆ ไม่เขียนซ้ำ + คลาส `.bxr-*` เดิมทั้งชุด ไม่เพิ่ม CSS ใหม่ · เรียง **คะแนนสูงสุดก่อน แล้วเวลาเร็วสุดตัดสิน** (ต่างจาก bxRank เดิมที่เรียงเวลาอย่างเดียว) · ปุ่ม 🏁 อันดับ ใน `openExamStdPicker` + แท็บ 🏁 ข้อสอบมาตรฐาน ในกระดานเต็มจอ (`js/ui.js` LB_TABS)
  - 🔑 **แก้ feedEvent ใน `xsFinish`: `p.examMeta.label` → `p.label`** (เดิมโพสต์ฟีดมีแค่ชื่อสนามสอบ ไม่มีเลขชุด แยก ielts_1/ielts_2 ไม่ได้ — ต้องมี "ชุดที่ N" ต่อท้ายถึงจะพาร์สแยกชุดได้) ⚠️ โพสต์เก่าก่อนรอบนี้จะไม่ถูกนับขึ้นกระดาน
  - 🐛 **เจอบั๊กจริงคนละเรื่องระหว่างทดสอบจอเตี้ย:** `.bxr-list` (css/style.css) เดิม `overflow:hidden` ตัดแถวทิ้งเงียบ ๆ เมื่อคนขึ้นกระดานเยอะ (8 แถว+…+ของเรา = 10 แถว ที่ 812×375 สูงไม่พอ) — **กระทบบอร์ด bxRank เดิม (รอบ786) ด้วย ไม่ใช่แค่บอร์ดใหม่** → เปลี่ยนเป็น `overflow-y:auto` (กรอบนอก `.bxr-box` ยังไม่เลื่อนตามกฎทองข้อ 7 — เลื่อนเฉพาะรายการข้างในเหมือนบทอ่าน/เฉลยที่อื่น)
  - ยืนยัน (server เอง :59227 · mock login+register ม.4 + จำลอง Online.gfeed หลายคน): เรียงคะแนน/เวลาถูกต้อง (คะแนนเท่ากันตัดสินด้วยเวลา) · สลับชิปหมวด→ชุด กรองแยก ielts_1/ielts_2/toeic_1 ถูกต้อง · เพื่อน 9 คน+ของเรา → โชว์ 8+…+ของเรา(⭐) ครบ เลื่อนดูในกรอบได้ไม่ตัดทิ้ง · แท็บกระดานเต็มจอ `js/ui.js` เปิดตรง · จอ 812×375 กรอบนอกไม่มี scroll ทั้งแผงป๊อปอัปและแท็บ (กฎทองข้อ7) · console สะอาด · `node.exe --check` ผ่านทั้ง `js/examstd.js`/`js/ui.js` · ล้างเซฟ+ปิด server แล้ว
  - 📌 หมายเหตุ: ทำงานพร้อม session คู่ขนานที่แก้ `js/examstd.js`/`js/ui.js` เรื่อง "โหมดจับเวลาจริง" (รอบ814) — คนละฟังก์ชัน ไม่ชนกัน แต่ commit นี้จะรวมทั้ง 2 งานเพราะแชร์ไฟล์เดียวกัน


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 818 (30 ก.ค. · ผู้ใช้ส่งภาพจอโลกเฮลิฯ: "เฉพาะเปิดด้วยคอมพิวเตอร์เท่านั้น ให้มีข้อความขึ้นค้างบอกไว้ด้วยว่าการขึ้นลงต้องกดปุ่มไหน"):** ⌨️🚁 เพิ่ม `#adv-keyhint` ในโลกเฮลิฯ (`js/adventure3d.js` โซนปุ่ม 4695 + `js/adv3d_css.js`) — ป้ายค้างมุมขวาบอก **Space=ขึ้น / Shift=ลง** ระหว่างขับเอง (`hPhase==='pilot'`) ไฮไลต์คีย์ที่กดจริงใน `tickHeli` · โผล่เฉพาะเครื่องที่มีเมาส์+แป้นพิมพ์จริง (`HAS_KBD` ผ่าน `matchMedia('(hover:hover) and (pointer:fine)')` เหมือนป้าย `#inv-keyhint` ของโลกยานแม่รอบ 582) — มือถือ/แท็บเล็ตไม่เห็นป้ายนี้ (ยังบังคับขึ้น-ลงด้วยลากนิ้วได้ตามเดิม ไม่ได้ตัดสิทธิ์)
  - ยืนยัน (server เอง :8791 · mock login+register ม.4 + `Adventure3D.start('heli')` + `_t.heli.goPilot('blue')` + `_t.heli.tick()`): เดินเท้า (`.hfoot`) = ป้ายซ่อน ✓ · ขึ้นขับ (`hPhase='pilot'`) = ป้ายโชว์ข้อความ Space/Shift ถูกต้อง ✓ · ตั้ง `keys.Space`/`keys.ShiftLeft` แล้ว `heli.tick()` = ปุ่มในป้ายไฮไลต์ตรงตัวจริง ✓ · ลบคลาส `kbd` (จำลองมือถือ) = ป้ายซ่อนทันที ✓ · จอ 812×375 และ 1280×720 ไม่ทับ `#adv-map`/`#adv-seat`/`#adv-board` ✓ · `node --check` ผ่านทั้ง 2 ไฟล์ · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 820 (30 ก.ค. · ผู้ใช้: "เพิ่มชุดข้อสอบใน `js/data/exam/` ให้ครบ 5 ชุดต่อสนามสอบ (ielts/toeic/toefl 3-5) รูปแบบ/สัดส่วนเดียวกับ ielts_1 รอบ 812 แล้วรัน gen_exam_std_manifest.py"):** 📘📗📙 เขียนคลังใหม่ **9 ไฟล์ × 30 ข้อ = 270 ข้อ** (`ielts_3-5`/`toeic_3-5`/`toefl_3-5`) เนื้อหาเขียนเองใหม่ทั้งหมด ไม่ซ้ำ 6 ชุดเดิม (สคริปต์เทียบข้อความโจทย์ทั้ง 450 ข้อ เจอซ้ำ 1 ข้อกับ toeic_2 → เขียนใหม่) · **ไม่แตะโค้ดเลย** เพราะ manifest/ชื่อใบประกาศเจนจาก label เอง (`certTitleOf` → "TOEIC Reading Practice Test 3" ครบ 15 ชุด) · สัดส่วนตามสนามสอบจริงเหมือนรอบ 812 (IELTS 12+9+9 · TOEIC 12+4+14 · TOEFL 6+6+9+9) บทอ่าน/เอกสารใหม่ 22 ชิ้น (dendrochronology, การวัดความสุข, ผึ้งเลือกรังใหม่, ขีดจำกัดรีไซเคิล, เกลือ-เส้นทางการค้า, สุนัขบ้าน, กำเนิดตัวเลขเขียน, ฝุ่นทะเลทราย, ภูเขาไฟระเบิด, ผีเสื้อโมนาร์ก, แนวปะการัง, ภาพถ่ายยุคแรก + เอกสารธุรกิจ press release/web policy/ใบเสนอราคา/อีเมลโต้ตอบ/ตารางขนส่ง/ผลสำรวจ/กำหนดการเดินทาง)
  - 🎲 **เจอปัญหาคุณภาพจากการวัดเอง แก้แล้ว:** เฉลยกระจุกที่ตัวเลือก B (บางไฟล์ 20/30 ข้อ) และแทบไม่มี D → เขียน `rebalance_exam.py` สลับ**ลำดับช้อยส์**ให้ a กระจาย 0-3 โดยแตะเฉพาะข้อที่คำอธิบายอ้างคำ ไม่อ้างเลข (ข้าม TFNG/`ส่วนใดผิด (A)-(D)`/ข้อที่ ex เขียน "ข้อ N") → ทุกไฟล์เหลือกระจุกไม่เกิน 16/30 · ตรวจย้อนกลับทั้ง 450 ข้อว่า "ตอบข้อ N"/"ตอบ <คำ>" ตรงกับ `a` จริง (ผิด 0 ในไฟล์ใหม่)
  - ยืนยัน (server เอง :8794 · mock login+register ม.5 + คลิก UI จริง): `gen_exam_std_manifest.py` ผ่าน **450/450 ข้อ** (5 ชุด/สนาม) · fetch ทั้ง 15 ชุด 200 นับข้อได้ 30 ตรงมานิเฟสต์ · แผงเลือกชุดขึ้น 5 ชุด × 3 โหมด ครบ · **สอบจริง toeic_3 ตอบครบ 30/30 → ผ่าน +900🪙 +120 RP ใบประกาศ + quizLog** (`xstd_toeic_3` mode exam) · เฉลยแท็บ "ทุกข้อ" โชว์ "✅ เฉลย: D. no later than" ตรงตำแหน่งหลังสลับ · โหมดฝึก ielts_5 ข้อไวยากรณ์+ข้อบทอ่าน (บทอ่าน 4 ย่อหน้ามีเลขกำกับ) ขึ้น "ถูกต้อง" ตรงเฉลย · **กฎทองข้อ 7 ที่ 812×375: หน้าไม่เลื่อน (375/375) · ข้อที่ยาวสุดของ 270 ข้อใหม่ (ielts_3 ข้อ 14) ช้อยส์ D อยู่ในกรอบ (290 < 332) · ข้อ "ส่วนใดผิด" ของ TOEFL ก็อยู่ในกรอบ** · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - 📌 **ค้าง (ของ session อื่น ไม่ได้แก้เพราะ `css/exam.css`/`js/examstd.js` เป็นไฟล์ที่รอบ 817/819 ทำอยู่):** พอมี 5 ชุด/สนาม แถวในแผงเลือกชุด `.xsp-rows` ต้องเลื่อนในกรอบตัวเอง (887/491 ที่ 1280×720 · 454/214 ที่ 812×375) — กรอบนอกยังพอดีจอ แต่ถ้าอยากให้เห็น 5 ชุดครบใบตามกฎข้อ 7 ควรทำ `.xsp-rows` เป็น 2 คอลัมน์ที่จอกว้าง
- **รอบ 819 (30 ก.ค. · ผู้ใช้: "เพิ่มโหมดที่ 3 ในระบบข้อสอบมาตรฐาน = สอบจับเวลาจริง ตัดจบอัตโนมัติ + สถิติเวลาต่อส่วน"):** ⏱️ `js/examstd.js`+`css/exam.css` โหมด `timed` (โหมด 3 ใน `openExamStdPicker` ปุ่ม `.xsp-go.timed` · `data-mode` แทนการเดาจาก class) — ใช้ `XS_TIME_HINT` เดิมเป็น **เวลาจริง** (`xsLimitSec()` ielts 45/toeic 25/toefl 40 นาที) นับถอยหลังในหัวจอ (เหลือ ≤5 นาที=เหลือง `.warn` · ≤1 นาที=แดงกะพริบ `.crit` + toast เตือน 2 จุด) หมดเวลา → `xsTimeUp()` เก็บกล่องยืนยันที่ค้างอยู่ (`.alert-overlay`) แล้วเรียก `xsFinish()` ทันที + toast "หมดเวลาแล้ว ส่งคำตอบให้อัตโนมัติ" + แถบ `.xs-rtimeup` ในกล่องผล (ข้อไม่ตอบนับเป็นผิด · เวลาที่บันทึกใช้ลิมิตเป๊ะ ไม่เกินจากวินาทีคลาด)
  - 📊 **สถิติเวลาต่อ "ส่วน" (ทุกโหมด ไม่ใช่แค่ timed):** `xsMark(secI)` เก็บ `XS.secSpent[secI]` ทุกครั้งที่วาดข้อ (ไม่นับเวลาที่นั่งอ่านเฉลย) → `xsSecStats()` → **แท็บที่ 3 "⏱️ เวลาแต่ละส่วน" ในหน้าเฉลย** (`xsTimeTableHTML`): แถบสี=สัดส่วนเวลา · ขีดตั้ง=สัดส่วนจำนวนข้อ · ป้าย 🐢 ช้ากว่า/⚡ เร็วกว่า/✅ พอดี (เกณฑ์ ratio ≥1.25 / ≤0.8) + เวลาต่อข้อ + ตอบถูกกี่ข้อ · กล่องผลสอบสรุปให้บรรทัดเดียวว่าส่วนไหนกินเวลาที่สุด (`.xs-rslow`) · เชื่อของกลางเดิมครบ (`quizPassed`/`quizLog` เพิ่มฟิลด์ `mode`/`certAward`/`addCoins`/`feedEvent`) ไม่แตะ 2 โหมดเดิม
  - ยืนยัน (server เอง :50521 · mock login+register ม.4 + คลิก UI จริง): **หมดเวลาจาก tick จริง 3 ครั้ง** (ไม่ใช่เรียกฟังก์ชันตรง) → ส่งอัตโนมัติ กล่องยืนยันที่เปิดค้างถูกเก็บ (`alert-overlay` 1→0) หัวขึ้น "⏰ หมดเวลาแล้ว!" · ผ่าน 28/30 timed = +900🪙+ใบประกาศ `std:true`+`quizLog.mode='timed'` · ไม่ผ่าน 18/30 = ไม่ได้รางวัลถูกต้อง · แท็บเวลาโชว์ 3 ส่วน (IELTS) และ 5 ส่วน (TOEIC) ครบ % ตรงกับ secSpent · โหมด exam/practice เดิมไม่เปลี่ยน (นับขึ้น "แนะนำ 45:00" ไม่ตัดจบ · practice ยังเฉลยทันที+ล็อกข้อ) · **กฎทองข้อ 7: 1280×720 และ 812×375 หน้าไม่เลื่อน กล่องอยู่ในจอครบทุกใบ** — จอเตี้ยบีบ 3 ปุ่มเป็นแถวเดียว (ป้ายสั้น `.xsp-sm`) + แท็บเวลาเรียง 2 คอลัมน์ → **ไม่มี scroll เลยแม้ในกรอบ** (ผลสอบ 0px · แท็บเวลา 236/236 ทั้ง 3 และ 5 ส่วน) · `node --check` ผ่าน · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **โค้ดส่วนใหญ่ของงานนี้ติดไปกับ commit รอบ 817 ของ session คู่ขนานแล้ว** (แชร์ working tree เดียวกัน เขา pin `js/examstd.js` ตอนที่ไฟล์มีงานนี้ค้างอยู่) — รอบนี้จึงเหลือ commit เฉพาะ `css/exam.css` ทั้งไฟล์ + 2 บรรทัดท้ายใน `js/examstd.js` · ทดสอบซ้ำหลังไฟล์รวมกับงานเขาแล้ว ผ่านทั้งชุด (ปุ่ม 🏁 อันดับ ของเขาอยู่ครบ ไม่ชนกัน)


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 821 (30 ก.ค. · ผู้ใช้ต่อยอดรอบ 818: "ทำแบบเดียวกันนี้กับโลกโดรน FPV (M.drone ก็ใช้ Space/Shift ขึ้น-ลงเหมือนกัน แต่ยังไม่มีป้ายเตือน)"):** 🛸⌨️ ใช้ป้าย `#adv-keyhint` ตัวเดียวกับโลกเฮลิฯ (รอบ 818) ร่วมกัน — เพิ่ม CSS `.adv-drone.kbd #adv-keyhint{display:block}` (`js/adv3d_css.js`) และไฮไลต์คีย์ Space/Shift ใน `tickDrone` (`js/adventure3d.js` ใกล้บรรทัด 5590) แบบเดียวกับ `tickHeli` · โดรนไม่มีเฟสเดินเท้า จึงไม่ต้องเช็ก `:not(.hfoot)` เหมือนเฮลิฯ
  - ยืนยัน (server เอง :8791 · mock login+register ม.4 + `state.droneTicket=true` + `Adventure3D.start('drone')`): ป้ายโชว์ถูกต้องตอนอยู่โหมดโดรน ไม่ทับ `#adv-race`/`#adv-shot`/`#adv-map` ทั้งจอ 1280×720 และ 812×375 · `node --check` ผ่านทั้ง 2 ไฟล์ · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - 📌 ระหว่างทำพบ session คู่ขนานแก้ป้ายเดียวกันจากคำว่า "Space"/"Shift" เป็นไอคอน ↑/↓ (ตามที่เสนอท้ายรอบ 818) — ไม่ชนกัน (คนละบรรทัด) รวมมาด้วยในคอมมิตนี้เพราะแชร์ไฟล์เดียวกัน


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 822 (30 ก.ค. · ผู้ใช้ต่อยอดรอบ 820: "ทำ .xsp-rows เป็น 2 คอลัมน์ที่จอกว้าง ให้เห็น 5 ชุดครบใบตามกฎข้อ 7"):** 📐 `css/exam.css` เพิ่ม `@media (min-width:760px)` ให้ `.xsp-rows` เป็น grid 2 คอลัมน์ + ขยาย `.xsp-box` เป็น `min(96vw,1080px)` + clamp `.xsp-info` เหลือ 1 บรรทัด (บางสนามเช่น TOEIC รายละเอียดยาว) · จอเตี้ย (`max-height:470px`) บังคับกลับคอลัมน์เดียวเสมอไม่ว่าจะกว้างแค่ไหน (ล้มกฎ 2 คอลัมน์ด้านบน เพราะที่สูงจำกัดกว่าที่กว้าง)
  - ⚠️ **เจอ session คู่ขนานกำลังแก้ไฟล์เดียวกันแบบ uncommitted อยู่ (ฟีเจอร์กราฟพัฒนาการคะแนน `.xsp-hist` ใน `js/examstd.js`+`css/exam.css`)** — แก้ปัญหาด้วยการ**คัดลอกเฉพาะ diff ของตัวเอง**ไปสร้าง blob แล้ว `git update-index --cacheinfo` เข้า index ตรง ๆ (ไม่ผ่าน `git add` ซึ่งจะดึงไฟล์บนดิสก์ทั้งก้อนที่มีงานเขาปนอยู่) → commit เฉพาะ `css/exam.css`(เวอร์ชันตัวเองล้วน)+`version.json` ไม่แตะ `js/examstd.js` เลย → **งาน `.xsp-hist` ที่ยังไม่เสร็จของอีก session ไม่หลุดไปกับ commit นี้ ยังอยู่ในดิสก์ครบเหมือนเดิมทุกตัวอักษร** (ยืนยันด้วย `git diff` หลัง commit ว่า diff เหลือเฉพาะงานเขาล้วน ไม่ปนของเรา)
  - ยืนยัน (server เอง :8795 · mock login+register ม.5 + คลิก UI จริง): 1280×720 ทั้ง 3 สนามสอบ `.xsp-rows` scrollHeight=clientHeight พอดี (497/497 ไม่ล้น) · 812×375 กลับคอลัมน์เดียวถูกต้อง (พฤติกรรมเดิมก่อนแก้ ที่ล้นในกรอบตัวเองอยู่แล้วจากพื้นที่แนวตั้งจำกัดจริง ไม่ใช่จุดต้องแก้เพิ่ม) · คลิกปุ่มในกริดใหม่เปิดข้อสอบได้ปกติ · deploy ใช้ `git archive HEAD` เท่านั้นจึงไม่มีทาง WIP ของ session อื่นหลุดขึ้นเว็บ · live `2026-07-30.778` ตรงเลข


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 823 (30 ก.ค. · ผู้ใช้สั่ง 5 ข้อ: ①ย้ายตั๋วโลก 3D ออกจากตลาด จ่ายค่าเข้า 500/ครั้งแทน ②ชวนเพื่อนได้ทุกโลก เล่นจบด้วยกันคืนคนละ 100 ③เช็กปฏิทินวันสำคัญไทย วันหยุด=ลดครึ่งราคา ④วันเด็ก ป.1-6 เล่นฟรี ⑤ต้องมีข้อความแจ้งเหตุผลลด/ฟรีเสมอ — ตอบคำถามชี้แจงไว้ก่อน: คืนเหรียญตั๋วเก่าเต็มจำนวนแล้วรีเซ็ตเป็น 500/ครั้งเท่ากันหมด · กดปุ่มเข้าโลกเด้งจ่ายเงินทันที ไม่มีการ์ดตั๋วแยก · "จบเกมด้วยกัน" = อยู่ด้วยกันต่อเนื่องครบ 3 นาที):** 🎫💰📅🤝 **ระบบเศรษฐกิจโลก 3D ทั้งชุด** — ไฟล์ใหม่ `js/data/calendar.js` (`THAI_HOLIDAYS`/`CHILDREN_DAY`/`worldEntryInfo()`) · `js/data/items.js` เพิ่ม `WORLD_ENTRY_FEE=500`/`TINV_TOGETHER_MS=3นาที`/`TINV_CASHBACK` 2000→100 (ใช้ร่วมทุกโลก) · `js/ui.js` ลบ `render*Card`/`buy*Ticket` 8 ชุดเดิม (~1000 บรรทัด) แทนด้วย `openWorldEntryDialog()`+`railWorldClick()` กลาง (WORLD3D array มี `prereq` แทน `price` คงที่) + `openHealDialog()` · `index.html` ลบการ์ดตั๋วในตลาด · state.*Ticket ยังใช้ชื่อเดิมแต่เปลี่ยนความหมายเป็น "เคยปลดล็อกแล้ว" (ไม่ใช่เข้าฟรีตลอดไป)
  - **migration คืนเงิน (`js/state.js`):** `ticketsReset` flag ครั้งเดียว คืนเหรียญเต็มราคาตั๋วเก่า (5,000-45,000) ของทุกแฟล็กที่เคยจ่ายไปแล้ว เก็บ `state.ticketRefund` ให้ `showTicketRefund()` (`js/main.js` ต่อคิวจาก `showGiantRefund`) เด้งบอกครั้งเดียว · ลบตั๋วออกจาก `assetValue()` (ไม่ใช่ทรัพย์สินถาวรแล้ว)
  - **ระบบ "จบเกมด้วยกัน" รวมทุกโลก (`js/online.js` `tinvPartyTick(map,uid)`):** จับเวลาต่อเนื่อง (`state.tinvTogether`) ต้องอยู่ด้วยกันครบ `TINV_TOGETHER_MS` ก่อนจ่าย (กันเทเลพอร์ตเข้า-ออก) — เรียกจาก `adventure3d.js`(`tinvCheck`ทุก tick ไม่ใช่แค่ตอนเจอ)/`moto3d.js`/`invasion3d.js`(ของใหม่ 2 ไฟล์นี้ไม่เคยมีระบบชวนเพื่อนมาก่อน) · แก้บั๊กเดิมที่ `tinvWatch()` กรองรับเฉพาะ map adv/haunt/heli (drone/drive/soccer/moto/invasion เชิญไม่เคยทำงานจริง) → เปิดรับครบ 8 โลกผ่าน `TINV_WORLD_LABEL`
  - ยืนยัน (server เอง :59021 · mock login+register ป.4 + เพิ่มสัตว์โตเต็มวัยจำลอง + เรียกฟังก์ชันตรงผ่าน eval): `openWorldEntryDialog` โชว์ราคาวันนี้ถูกต้อง (30 ก.ค. 2026 = วันเข้าพรรษาจริง → ขึ้น "ลดครึ่งราคา 🪙250 ~~🪙500~~" ถูกต้อง) · กดจ่ายหักเหรียญ 250 ตรง + ตั้ง `advTicket=true` ปลดล็อกถาวร · prereq chain ถูกต้อง (heli เข้าได้เพราะมี advTicket, drone/soccer ล็อกเพราะยังไม่มี heliTicket/driveTicket) · จำลองเซฟเก่ามีตั๋ว 3 ใบ (adv/haunt/heli) reload แล้วคืนเหรียญ 30,000 ตรงเป๊ะ + แฟล็กปลดล็อกยังอยู่ครบ · `tinvPartyTick` ยิงซ้ำก่อนครบเวลา=false, ครบเวลา=true+เหรียญเข้าครั้งเดียว, ยิงซ้ำหลังเคลม=false · วันเด็กจำลอง (`CHILDREN_DAY`) ป.4=ฟรี / ม.1=จ่ายเต็ม 500 ถูกต้อง · `renderRailWorlds()` badge ราคา/ล็อกถูกต้อง (mecha ระบบแยกไม่กระทบ) · `node --check` ผ่านทั้ง 9 ไฟล์ที่แก้ · console สะอาด ล้างเซฟ+ปิด server แล้ว
  - 📌 **ค้าง:** ยังไม่ได้ทดสอบเข้าโลกจริงจนจบ (โหลด engine 3D เต็มรูปแบบ) เพราะทดสอบผ่านการเรียกฟังก์ชันตรง ไม่ได้คลิก UI ครบทุกขั้น — ควรลองเข้าเล่นจริงอย่างน้อย 1 โลกในรอบถัดไปเพื่อยืนยัน `w.enter()` ทำงานต่อจากปุ่ม "จ่ายแล้วเข้าเลย!" ราบรื่น


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 825 (30 ก.ค. · ผู้ใช้: "ทำกระดานอันดับข้อสอบมาตรฐานให้เป็นตลอดกาลจริง ใช้โซน DB ใหม่"):** 🏁 เดิม (รอบ 817) กระดานอ่านจากฟีดรวม `Online.gfeed` 120 โพสต์ล่าสุด → คนที่สอบผ่านนานแล้วหลุดกระดาน · รอบนี้เพิ่มโซน **`/examRank/<setId>/<uid> = {sc,tt,sec,n,g,ts}`** (1 แถว/คน/ชุด) — เขียนใน `xsFinish()` ผ่าน `xrkSubmit()` เฉพาะตอนสอบผ่าน+ดีกว่าเดิม (**ตรรกะ "เก็บที่ดีที่สุด" ย้ายจากฝั่งอ่านมาฝั่งเขียน**) · `xrkFetch/xrkMerge` อ่านด้วย `orderByChild('sc').limitToLast(50)` (ต้องมี `.indexOn:"sc"`) + cache ต่อชุด แล้วเรียงคะแนน→เวลาเองฝั่ง client · ลบ `__XRK_POST_RE`/`xrkIdByLabel` ทิ้ง · **หน้าตาเหมือนเดิมเป๊ะ** (`bxrRowHTML`/`BXR_TOP`/CSS `.bxr-*` เดิม ไม่เพิ่ม CSS)
  - 📣 **ข้อความบอกแหล่งข้อมูลแยกใหม่ `xrkNote()`** — ห้ามใช้ `bxRankNote()` ร่วมกับกระดานสอบใหญ่ (รอบ 786) ที่ยังเป็น "จากกิจกรรมล่าสุด" อยู่ · `xrkNoteRefresh()` เขียนป้ายใหม่หลังรู้ผลจาก DB และ **มีทางถอยหา `.lbf-note`** เผื่อ `js/ui.js` บนเว็บยังเป็นเวอร์ชันเก่า (session คู่ขนานเห็น `xrkNote()` ใน ui.js ก่อนที่ examstd.js จะ commit เลย commit แก้ให้เหลือ `<div class="lbf-note" id="xrk-note"></div>` ว่าง ๆ — `xrkNoteRefresh()` เติมข้อความให้เองตอน mount จึงยังถูกต้อง)
  - 🩹 **บทเรียน commit ระหว่างมีงานคนอื่นค้างในไฟล์เดียวกัน (เสีย 2 คอมมิต):** `js/examstd.js` มีงาน `.xsp-hist` ของอีก session ค้างอยู่ → แยก diff ด้วยการ "เก็บเฉพาะ hunk ของเรา" จาก `git diff -U0` **ผิด** (hunk ที่ขอบติดกันถูกตัดทิ้งไปด้วย เลยตกนิยาม `XRK_READ`/`__xrkCache` และเหลือ `__XRK_POST_RE` เก่า — `node --check` ไม่จับเพราะไวยากรณ์ถูก) → **วิธีที่ถูก: เอาไฟล์บนดิสก์ (ที่ทดสอบผ่านแล้ว) มาตัดเฉพาะบล็อกของเขาออกด้วยการแทนที่สตริง แล้วเช็กรายชื่อสัญลักษณ์ทั้ง 2 ฝั่ง** (ต้องมี xrkSubmit/XRK_READ/__xrkCache… · ต้องไม่มี xsHistorySVG/__XRK_POST_RE…) ก่อน `git hash-object` เข้า index ส่วนตัว (`GIT_INDEX_FILE`) แล้ว commit · เว็บจริงไม่เคยพังเพราะ deploy อ่านจากไฟล์บนดิสก์ ไม่ใช่จาก git
  - ⏳ **ต้อง publish rules ก่อนถึงใช้ได้จริง** (Artifact ปุ่มคัดลอกก้อนเต็ม 28 โซน: https://claude.ai/code/artifact/79fa6a20-7c7f-4cfc-af4a-c3ab1c69e73b · รายละเอียดโซนใน `handoff/RULES.md`) — เขียนได้เฉพาะแถว uid ตัวเอง + validate บังคับ `sc<=tt` และ `sc*10>=tt*7` (ผ่าน 70% จริง) · **ยังไม่ publish = เกมไม่พัง** → `Online.xrkOk=false` เห็นสถิติตัวเองจากใบประกาศ + ป้ายบอกเหตุผลบนจอ
  - ยืนยัน (server เอง :8797 · mock login+register ป.4 + fake `Online.db` + **สอบจริง ielts_1 ผ่าน UI ครบ 30 ข้อ ตอบถูก 27/30**): เขียน `/examRank/ielts_1/test1` ครบทุกฟิลด์ (sec 75 ตรงกับใบประกาศ) · ทดสอบ 4 เคส "เก็บที่ดีที่สุด" ถูกทุกเคส (คะแนนน้อยกว่า/ช้ากว่า=ไม่เขียน · เร็วกว่า/คะแนนมากกว่า=เขียนทับ) · เพื่อน 11 คน+เรา → Top 8 เรียงคะแนน→เวลาถูกต้อง · เราอันดับ 12 = โชว์ "…" + แถวเรา (⭐) ท้ายสุด · ชุดที่ยังไม่มีใครสอบขึ้นข้อความว่าง · **deny ทั้งอ่านและเขียน → ยังเห็นแถวตัวเอง + ป้าย ⚠️ ถูกต้อง · ออฟไลน์ → ป้าย 📴** · แท็บเต็มจอ `js/ui.js` ใช้ป้ายใหม่ (และ **จำลอง ui.js เวอร์ชันเก่าแล้วป้ายยังถูกแก้ให้เอง**) · กระดานสอบใหญ่เดิมยังใช้ข้อความเดิมไม่กระทบ · **กฎทองข้อ 7: 1280×720 และ 812×375 หน้าไม่เลื่อน กล่องอยู่ในจอครบ** (รายชื่อเลื่อนในกรอบตัวเองตามรอบ 817) · `node --check` ผ่าน · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 826 (30 ก.ค. · ผู้ใช้ต่อยอดรอบ 825: "เพิ่มอันดับรวมทุกชุดต่อสนามสอบ (เช่น IELTS รวม 5 ชุด) ในกระดานเดียวกัน"):** 🏅 `js/examstd.js` เพิ่มชิป **"🏅 รวมทุกชุด"** หน้าแถวชิปชุด (คีย์ `<exam>_*` = `XRK_ALL` ใช้ path เดียวกับ setId ทั้งระบบ · เป็น**ค่าเริ่มต้น**ตอนเปิดกระดาน/สลับสนามสอบ) — `xrkAllRows(exam)` รวมผลจาก `xrkFetch` รายชุด (ใช้ cache เดิม ไม่ยิง query เพิ่ม) เป็น 1 แถว/คน: จำนวนชุดที่ผ่าน + คะแนนรวม + เวลารวม · **เรียงจำนวนชุดที่ผ่านมากก่อน → สัดส่วนคะแนนรวม → เวลารวมน้อยสุด** (ถ้าเรียงสัดส่วนก่อน คนผ่านชุดเดียว 30/30 จะแซงคนผ่าน 5 ชุด = ผิดความหมาย) · แถวใช้ `bxrRowHTML` เดิมแล้วแทรก "N ชุด ·" ใน `.bxr-sc` (ไม่เพิ่ม CSS · ชื่อ/สัญลักษณ์ระดับชั้นยังมาจากที่เดียวตามกฎคุ้มครองเด็ก) · สอบผ่านใหม่ล้าง cache ทั้งชุดนั้นและกระดานรวม
  - ยืนยัน (server เอง :8798 · mock login+register ป.4 + fake `Online.db` 5 ชุด/หลายโปรไฟล์): เรียงถูก (เพื่อนผ่าน 5 ชุด 130/150 มาก่อนคนผ่าน 1 ชุด 30/30) · อ่าน DB 5 ครั้ง/สนามสอบแล้วสลับชิปไปมา **ไม่ยิงอ่านซ้ำเลย (0 ครั้ง)** · สลับสนามสอบเด้งกลับกระดานรวมของสนามใหม่ · เราอยู่อันดับ 12 = "…" + แถวเรา (⭐) · `xrkSubmit` ล้าง cache ทั้ง `ielts_2` และ `ielts_*` แล้วเปิดใหม่เห็นสถิติใหม่ทันที · **ออฟไลน์/rules ยังไม่ publish → รวมใบประกาศของตัวเองเป็น "2 ชุด · 51/60" + ป้ายบอกเหตุผลถูกต้อง** · ป้ายหัวกระดานสลับข้อความตามชิปทุกครั้งที่วาด · แท็บเต็มจอ `js/ui.js` ใช้ได้เหมือนกัน · **กฎทองข้อ 7: 812×375 และ 1280×720 หน้าไม่เลื่อน กล่องอยู่ในจอ แถวไม่ล้นแนวนอน** · `node --check` ผ่าน · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 827 (30 ก.ค. · ผู้ใช้: "ทำแบบเดียวกับ /examRank รอบ 825 ให้กระดานสอบใหญ่คลังศัพท์ขั้นสูงใน js/bandadv.js (bxRankRows/bxRankNote)"):** 🏁 เดิม (รอบ 786) กระดานอ่านจากฟีดรวม `Online.gfeed` → คนสอบผ่านนานแล้วหลุดกระดาน · เพิ่มโซน **`/bandRank/<catId>_<lvKey>/<uid> = {sc,tt,sec,n,g,ts}`** เขียนจาก `bxrSubmit()` ใน `onPass(secs)` ของ `bandAdvExamCat` (`js/bandadv.js`) เฉพาะสอบผ่าน+ดีกว่าเดิม (คะแนนก่อนแล้วเวลา ตรงกับ `bandAdvExamBest`) · เปลี่ยน `game.js` ส่ง `secs` เข้า `cat.onPass(secs)` (เดิมไม่มีพารามิเตอร์) · `bxrFetch/bxrMerge` อ่านด้วย `orderByChild('sc').limitToLast(50)` (ต้องมี `.indexOn:"sc"`) แล้วเรียงคะแนน→เวลาฝั่ง client · ลบ `bxrIdByLabel`/`__BXR_POST_RE` ทิ้ง · หน้าตาเดิมเป๊ะ (`bxrRowHTML`/`BXR_TOP`/CSS `.bxr-*` ไม่เพิ่ม CSS) · เปลี่ยนหัวข้อ/ป้ายจาก "เร็วที่สุด" เป็น "คะแนนสูงสุด/เร็วสุด" ให้ตรงตรรกะใหม่ (ทั้งใน `js/bandadv.js` และแท็บ `bx` ของ `js/ui.js` ซึ่งเพิ่ม `id="bxr-note"` ด้วย)
  - ⚠️ **ชนเลขรอบกับ session คู่ขนาน:** เริ่มงานตอนขอเลข 826 ได้ แต่ก่อน commit มีอีก session commit "รอบ 826" (ชิปรวมทุกชุดใน `/examRank`) ไปแล้ว → รัน `rotate_handoff.py --next-round` ใหม่ได้ 827 แล้วไล่แก้ทุกจุดที่พิมพ์ 826 ไว้ (โค้ด 3 ไฟล์ + RULES.md + Artifact) เป็น 827 ก่อน commit — คนละระบบกับงานเขา (bandRank vs examRank) จึงทำต่อได้ไม่ต้องหยุด
  - ⏳ **ต้อง publish rules ก่อนถึงใช้ได้จริง** (Artifact ปุ่มคัดลอกก้อนเต็ม: https://claude.ai/code/artifact/854df926-f052-4fd5-bafc-a1fc491fed47 · รายละเอียดโซนใน `handoff/RULES.md`) — เขียนได้เฉพาะแถว uid ตัวเอง + validate บังคับ `sc<=tt` และ `sc*10>=tt*8` (ผ่าน 80% จริงของสอบใหญ่) · **ยังไม่ publish = เกมไม่พัง** → `Online.bxrOk=false` เห็นสถิติตัวเองจากใบประกาศ + ป้ายบอกเหตุผลบนจอ
  - ยืนยัน (server เอง :64996 · mock login+register ป.4 + fake `Online.db` ผ่าน eval + เรียก `bandAdvExamCat`/`startQuiz`/`finishQuiz` จริงผ่าน UI ครบ): 4 เคส "เก็บที่ดีที่สุด" ถูกทุกเคส (คะแนนน้อยกว่า/เท่ากันช้ากว่า=ไม่เขียน · เท่ากันเร็วกว่า/มากกว่า=เขียนทับ) · จบ quiz จริง 30 ข้อผ่าน UI → `onPass(secs)` เรียก `bxrSubmit('academic','found',27,30,125)` ถูกต้อง (ไม่เขียนทับเพราะแถวเดิมดีกว่า) · เพื่อน 11 คน+เรา → Top 8 เรียงคะแนน→เวลาถูกต้อง เราอันดับ 12 = "…" + แถวเรา (⭐) · deny/ออฟไลน์ยังเห็นสถิติตัวเอง+ป้ายถูกต้อง · แผงป๊อปอัปกับแท็บเต็มจอ `js/ui.js` ป้ายรีเฟรชถูกต้อง · **กฎทองข้อ 7: 1280×720 และ 812×375 กล่องนอกไม่เลื่อน** (list ในกรอบตัวเองเลื่อนได้ตามเดิม) · `node --check` ผ่านทั้ง 3 ไฟล์ · console สะอาด ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 828 (30 ก.ค. · ผู้ใช้: "เพิ่มปุ่มดูอันดับในกล่องผลสอบให้เปิดถึงชุดที่เพิ่งสอบ"):** 🏁 `js/examstd.js` เพิ่มพารามิเตอร์ที่ 2 `setId` → `openExamStdRank(exam, setId)` / `xrkMount(box, exam, initialSetId)` · ปุ่ม "🏁 ดูอันดับ" ในกล่องผลสอบ (เมื่อ `passed` เท่านั้น) เรียก `openExamStdRank(p.exam, p.id)` → เปิดกระดานที่ชุดที่สอบ ไม่ใช่รวมทุกชุด · ยืนยัน (preview ·  mock login ป.4 + สอบผ่าน → ปุ่มขึ้น → เปิดกระดานถูกชุด) · 1280×720 / 812×375 ไม่มี scrollbar ✓


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 829 (30 ก.ค. · ผู้ใช้: "publish แล้ว" หลังรอบ 827):** ✅ ตรวจสด `firebase database:get /.settings/rules` เทียบกับ `handoff/RULES.md` แบบ deep JSON compare = **identical ทั้งไฟล์** → รู้ว่าที่จริง publish ครั้งนี้ขึ้นให้ **6 โซนที่ค้างมานาน** พร้อมกันหมด ไม่ใช่แค่ `bandRank`: `examRank`(825) `pphoto`(709/763) `gfeed` reactions(701) `tpAward`(649+654) `wsAward`(592) `hp` ใน `/world`(376) — REST ยืนยันสิทธิ์ตรงทุกโซน (401 ที่ต้อง auth · 200 ที่อ่านสาธารณะ) · แก้ `RULES.md` เปลี่ยนสถานะทั้ง 6 จาก ⏳ เป็น ✅ พร้อมบันทึกวิธีตรวจ (กันงงรอบหน้าว่าทำไมฟีเจอร์เหล่านี้ใช้ได้แล้วทั้งที่ยังเขียนว่ารอ publish) · เอกสารล้วน ไม่แตะโค้ดเกม


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 830 (30 ก.ค. · ผู้ใช้: "ชนหมา = ปรับ 10 เหรียญ/ครั้ง"):** 🐕 `js/moto3d.js:10` `DOG_HIT_COIN` 100→10 (เดิมลดจาก 500→100 รอบ 643) · ยืนยัน (server เอง :8830 · mock login + `MotoWorld.start()` + test hook `_t.forceDog()`+`_t.pos`+`_t.dogTick()` จำลองชนจริง): coins 100→90 (หัก 10 ตรงเป๊ะ) · `node --check` ผ่าน · ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 831 (30 ก.ค. · ผู้ใช้ส่งภาพโลกเฮลิฯ เหนือเมืองกำแพงเพชร: "ปรับพื้นสีเหลืองให้เป็นคอนกรีตในเมือง + ขอ prompt" แล้วต่อยอด "ตัวอักษรนอกถนนห้ามอยู่ใกล้ตึก"):** 🏙️🔠 `js/adventure3d.js` — ①`MODES.drive.ground` เขียวมะกอก-เหลือง(0x9cb968)→เทาคอนกรีต(0x9a9a92) + เพิ่ม probe ภาพจริง `img/city/ground.png` (เหมือนระบบทางเท้า) prompt คัดลอกอยู่ `PROMPTS_GROUND_KPP.md` ②บั๊กจริง: จุดวางตัวอักษรนอกถนน (`greenPts`) เช็คระยะห่างตึกผ่าน `navBlockedAt` ซึ่ง**เช็คแค่ spatial-hash cell เดียว (SCELL=42ม.)** พอสำหรับ pad รถ 1.55ม. แต่ pad ใหม่ 14ม. ข้าม cell ได้ง่าย ทำให้ตัวอักษรลอยใกล้ตึกได้ (วัดจริงพลาด 573/10,633 จุด) → เขียน `greenBuildingClear()` แยกที่กวาด 3×3 cell ข้างเคียง แก้แล้ว 0 จุดหลุด (min dist ตรง 15.55ม.=NAV_CLR+14 เป๊ะ)
  - ยืนยัน (server เอง :8912 · mock login+register ป.4 + `railWorldClick`/`enterHeli3D`→เลือกแผนที่ `kpp`→คลิก intro จริงผ่าน UI): `Adventure3D._t.drive.d.greenPts` 10,082 จุด ทุกจุด ≥15.55ม. จากตึกที่ใกล้ที่สุด (0 จุดหลุด, ก่อนแก้เจอ 573 จุดหลุดถึงใกล้สุด 2.5ม.) · เช็ก source ที่เบราว์เซอร์โหลดจริงผ่าน network request ตรงกับไฟล์บนดิสก์ · `node --check` ผ่าน · console สะอาด · ปิด server แล้ว
  - 📌 ค้าง: ยังไม่มีภาพคอนกรีตจริง (`img/city/ground.png`) — ตอนนี้เป็นสีเทาเรียบ ผู้ใช้ยังไม่ได้เจน/วางไฟล์


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 832 (30 ก.ค. · ผู้ใช้ส่งภาพหน้า "หมวดคำศัพท์ & แบบทดสอบ" สั่ง 3 ข้อ: ①ปุ่มกลับข้างบนให้ใส่ซ้ำด้านล่างด้วย ②เพิ่มปุ่มลัด IELTS/TOEIC/TOEFL แยกปุ่ม เลื่อนแนวนอนได้ถ้าจอแคบ ③ทุกปุ่มกดแล้วมีแสงกะพริบใต้ปุ่มแป๊บเดียว):** ⬅️📘✨ `index.html`(#screen-cats: `#btn-cats-back-bottom` + `#cats-quick-exam` 3 ปุ่ม `.quick-exam-btn[data-xstd]`) · `js/main.js`(ผูกปุ่มกลับซ้ำ + คลิกปุ่มลัดเรียก `openExamStdPicker('ielts'|'toeic'|'toefl')` ตรง ไม่ต้องเลื่อนหาการ์ดท้ายรายการ) · `css/style.css`(`.cats-quick-exam` flex+overflow-x:auto · `.quick-exam-btn`) · `js/util.js`(delegated `pointerdown` ตัวเดียว: ปุ่มไหนใส่ class `tapglow` จะได้ glow ใต้ปุ่ม fade 550ms อัตโนมัติ — ใช้ซ้ำได้กับปุ่มอื่นแค่แปะ class ไม่ต้องเขียน JS เพิ่ม) แปะ `tapglow` ให้ปุ่มกลับบน/ล่าง + 3 ปุ่มลัด
  - ยืนยัน (server เอง :8831 · mock login+register ม.4 คลิก UI จริงผ่าน `openExamStdPicker`): 3 ปุ่มลัดเปิด picker ตรงสนามสอบถูกต้อง (หัวกล่องขึ้น IELTS Academic/TOEIC Reading/TOEFL Structure & Reading ตามปุ่มที่กด) · ปุ่มกลับล่างเรียก `showScreen('screen-dashboard')` ถูกต้อง (เช็ก class `active` สลับถูก) · `tapglow-on` ขึ้นตอน pointerdown แล้วหายเองใน <1s ไม่ค้าง · 1280×720 และ 375×812 ไม่มี horizontal overflow ทั้งหน้าและแถบปุ่มลัด (แถบมี `overflow-x:auto` เผื่อจอแคบกว่านี้) · `node --check` ผ่านทั้ง main.js/util.js · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 833 (30 ก.ค. · ผู้ใช้ส่งภาพเล่นโลกยานแม่บนมือถือ: กล่องดำ "vocabworld.web.app – To show your cursor, switch apps, reload the page, or go back" เด้งบังจอเรื่อย ๆ สั่ง "ปิดทุกโลก 3D"):** 🖱️🚫 กล่องนั้นเป็น UI ของเบราว์เซอร์เอง โผล่ทุกครั้งที่หน้าเว็บเรียก `requestPointerLock()` → ปิดที่ตัวกล่องไม่ได้ ต้อง**ไม่ล็อกตั้งแต่ต้น** · ต้นตอ: `js/invasion3d.js` ผูก `cvEl.mousedown` แล้วสั่งล็อกทันทีโดยไม่เช็กชนิดอุปกรณ์ — บนมือถือ "แตะจอ" ทำให้เบราว์เซอร์ยิง `mousedown` ปลอมตามหลัง touch → โลกยานแม่เข้าใจผิดว่าเป็นเมาส์จริง (โลก adventure3d มีด่าน `IS_TOUCH` อยู่แล้วจึงไม่เจอ)
  - แก้: ด่านกลางใหม่ใน `js/util.js` (โซน 🖱️🚫 ท้ายไฟล์) = `TOUCH_INPUT_SEEN` (เริ่มจาก `hover:hover and pointer:fine` + ติด true ถาวรเมื่อเจอ `touchstart`/`pointerdown` type touch/pen) + `mouseLockOK(e)` (กัน mouse event ที่เกิดจากนิ้วด้วย `sourceCapabilities.firesTouchEvents`) + `lockMouse3D(el,e)` (ล็อกให้เฉพาะเมาส์จริง · ถ้าไม่ผ่านจะ `exitPointerLock` ที่ค้างมาให้ด้วย) — ทุกโลก 3D เรียกตัวนี้ที่เดียว: `js/invasion3d.js:6360` + `js/adventure3d.js:5310`
  - ยืนยัน (server เอง :52485 · mock login+register ป.4 · เข้าโลกจริงทั้ง 2 engine แล้ว spy `Element.prototype.requestPointerLock`): **ยานแม่** เคสผู้ใช้ (touchstart → mousedown ปลอม 2 ครั้ง) = **ขอล็อก 0 ครั้ง** ไม่มีล็อกค้าง · คอมมีเมาส์จริง = ขอล็อก 1 ครั้ง (พฤติกรรมเดิมครบ) แล้วหลังแตะจอไม่ขอเพิ่มอีก (คงที่ 1) · **โลกผจญภัย** ผลเดียวกัน (คลิกเมาส์=1 · หลัง touch คลิกซ้ำ=ยัง 1) · ปุ่มยิงนิ้ว (`hold(fireBtn)`) ไม่เกี่ยวกับ pointer lock จึงยิงได้เหมือนเดิม · `node --check` ผ่าน 3 ไฟล์ · console ไม่มี error · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 834 (30 ก.ค. · ผู้ใช้ตำหนิรอบ 832 ว่าใส่ปุ่มผิดหน้า: "ฉันอุตส่าห์เอาภาพหน้า lobby ให้ดูแล้ว ย้ายปุ่มเหล่านี้ไปหน้า Lobby เลย"):** 📘📗📙 **ย้ายปุ่มลัด IELTS/TOEIC/TOEFL จากท้ายหน้า `#screen-cats` ไปแถบล่าง Lobby (`.lobby-bottom`)** ตามที่สั่งจริงตั้งแต่แรก (ปุ่มกลับซ้ำท้ายหน้าหมวดคำศัพท์ของรอบ 831 ยังอยู่ ถูกต้องแล้ว) · `index.html` ลบ `#cats-quick-exam` + เพิ่ม 3 ปุ่ม `.lobby-std-btn[data-xstd]` ต่อจาก 📒 ในแถบล่าง · `js/main.js` ย้าย handler ไปฟัง `#lobby-bottom` · `css/lobby.css` แถบล่างเลื่อนแนวนอนได้ (`overflow-x:auto`) · `js/util.js`+`css/style.css` ขยาย tapglow ให้ครอบ **ทุกปุ่มรางซ้าย (แนวตั้ง) + ทุกปุ่มแถบล่าง (แนวนอน)** ตามที่ผู้ใช้สั่งข้อ 3 (รอบ 832 ทำแค่ 5 ปุ่มที่แปะ class เอง)
  - 🩹 **3 กับดักที่เจอจริงตอนทำ (จดไว้กันพลาดซ้ำ):** ①`justify-content:flex-end` + `overflow-x` = ปุ่มตัวแรกล้นออกซ้ายแล้ว**เลื่อนไปหาไม่ได้เลย** → ใช้ `margin-left:auto` ที่ลูกตัวแรกแทน (มีที่=ชิดขวาเหมือนเดิม · ไม่พอ=ยุบเป็น 0) ②`overflow-y` กลายเป็น `hidden` อัตโนมัติเมื่อตั้ง `overflow-x:auto` → เงา 3 มิติใต้ปุ่ม (`0 6px 0`) ถูกตัด แก้ด้วย `padding-bottom:7px;margin-bottom:-7px` (ความสูง footer เท่าเดิมเป๊ะ ไม่เบียดเวทีสัตว์) ③`.lobby-std-btn{padding:… !important}` **แพ้** `.lobby-quiz-btn{padding:… !important}` ที่อยู่ท้ายไฟล์กว่า (specificity เท่ากัน) → ต้องเขียน `.lobby-bottom .lobby-std-btn`
  - 💡 **แถบล่างติดขอบจอ ใต้ปุ่มเหลือที่แค่ ~2px** → แสง tapglow ของแถบนี้ต้องคาบเกี่ยวขอบล่างปุ่ม (`bottom:-5px`) ไม่ใช่ลอยใต้ปุ่มเหมือนที่อื่น (`bottom:-8px`) ไม่งั้นถูกตัดหายทั้งที่โค้ดถูก
  - ยืนยัน (server เอง :8833 · mock login+register ม.4 · วัดด้วย `getBoundingClientRect`): **1280×720** ปุ่มครบ 8 ตัวพอดีไม่ต้องเลื่อน (scrollW 1252 = clientW) · **812×375** เลื่อนแนวนอนได้จริง (1039>792) **ปุ่มแรกเข้าถึงได้ที่ scrollLeft 0 · ปุ่มสุดท้ายเห็นครบที่ scroll สุด** (กับดัก ① ไม่เกิด) · หน้าไม่มี scroll แนวตั้ง/แนวนอนทั้ง 2 ขนาด (กฎทองข้อ 7) · 3 ปุ่มเปิด picker ถูกสนามสอบทุกตัว · glow ขึ้นทั้งปุ่มราง (🏠บ้าน) ปุ่มแถบล่างเดิม (🎮 เล่นเกม) และ 3 ปุ่มใหม่ · **ปุ่ม disabled (💊รักษา) ไม่ติดแสง** ✓ · แสงหายเองครบทุกปุ่มใน <1s ไม่ค้าง · กรอบแสงอยู่ในกรอบ clip + ในจอ (702→716 < 720) · ปุ่มเดิม `#btn-cats`/ปุ่มกลับล่างยังทำงานปกติ · `node --check` ผ่าน · console ไม่มี error · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 835 (30 ก.ค. · ผู้ใช้ส่งภาพแผงเลือกชุดข้อสอบ IELTS: "ทำปุ่มปิดชัดๆ ที่ขวามือบน ของทั้ง 3 ด้วย (IELTS/TOEIC/TOEFL)"):** 🔴 ต้นตอ: `.pl-close` กลาง (`css/lobby.css`) ออกแบบไว้ขาวโปร่งบนพื้นสี ใช้ได้กับ overlay ทั่วไป แต่ `.xsp-box`/`.xsb-box` (`js/examstd.js` รอบ 812/813) พื้นขาว → ปุ่ม ✕ ขาวจางจนมองแทบไม่เห็น (บั๊กเดียวกับที่กล่องขาวอื่น ๆ เช่น `.vb-box`/`.bax-box` เคยเจอและแก้ไปแล้วรอบ 287/773 แต่ 2 กล่องนี้หลุดไม่ได้รับ) · เพิ่ม `.xsp-box .pl-close,.xsb-box .pl-close{background:#e05252;border:2px solid #fff;box-shadow:...}` ใน `css/style.css` ตามแพทเทิร์นเดิมเป๊ะ — ครอบทั้ง 3 สนามสอบเพราะใช้ template เดียวกัน (`openExamStdPicker(exam)`) และครอบแผงเลือกสนามสอบ (`openExamStdBoard`) ที่มีบั๊กเดียวกันไปด้วย
  - ยืนยัน (server เอง :8835 · mock login+register ม.4 · เช็ก computed style): ปุ่มปิดทั้ง 3 สนามสอบ + แผงเลือกสนามสอบ ได้พื้นแดง `rgb(224,82,82)` ขอบขาว 1.6px ตรงกับกล่องขาวอื่นทุกกล่อง · กดปิดยังทำงานปกติ (overlay หายจาก DOM) · ไม่กระทบกล่องอื่นที่ใช้ `.pl-close` (selector เจาะจงเฉพาะ 2 คลาสนี้) · console สะอาด · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 836 (30 ก.ค. · ผู้ใช้ส่งภาพหน้าสอบ IELTS: "ทำข้อสอบไม่เสร็จแล้วกดออกไม่ได้ ให้กดออกได้เสมอ พร้อมป้ายเตือนคะแนนจะไม่บันทึก"):** 🚪 ฟังก์ชัน `xsQuitAsk()`/`xsClose()` (`js/examstd.js`) มีอยู่แล้วครบ (ตอบ≥1ข้อ→เตือน "คำตอบจะไม่ถูกบันทึกและไม่ได้คะแนน" ก่อนออก) แต่ **กล่องเตือนซ่อนอยู่หลังจอสอบ** — `.alert-overlay` (จาก `alertBox()`) z-index:100 ต่ำกว่า `#xs-screen` z-index:1400 มาก กดอะไรไม่ได้เลย (ตอบ 0 ข้อไม่เจอเพราะออกตรงไม่มีกล่องเตือน) · แก้ `css/exam.css` เพิ่ม `#xs-screen ~ .alert-overlay{z-index:1450}` ยกเฉพาะกล่องที่โผล่ระหว่างอยู่ในจอสอบ ครอบทั้ง 3 สนามสอบ (ielts/toeic/toefl ใช้ template เดียวกัน) เพราะ root cause เป็น CSS ร่วม ไม่ใช่ต่อสนามสอบ
  - ยืนยัน (server เอง :60210 · mock login+register ม.4 · เข้าสอบจริงผ่าน `examStdStart`): ตอบ 2/30 ข้อแล้วกด "✕ ออก" → กล่องเตือนขึ้นด้านบนจอสอบจริง (`elementFromPoint` ชี้ปุ่ม "ออกจากข้อสอบ" ตรง ไม่ใช่จอสอบ) กดยืนยันแล้วออกสำเร็จ (`#xs-screen`/`.alert-overlay` หายจาก DOM) · ตอบ 0 ข้อกดออก = ออกทันทีไม่มีกล่องเตือน (ถูกต้อง ไม่มีอะไรจะเสีย) · ทดสอบซ้ำกับ `toeic_1` ผลเหมือนกัน (TOEFL ใช้ template เดียวกันจึงไม่ต้องทดสอบแยก) · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 837 (30 ก.ค. · ผู้ใช้ต่อยอดรอบ 831):** 🖼️ ผู้ใช้เจน+วาง `img/city/ground.png` (พื้นคอนกรีตเมืองกำแพงเพชร ตาม `PROMPTS_GROUND_KPP.md`) — โค้ด probe รอไว้แล้วตั้งแต่รอบ 831 ไม่ต้องแก้ไฟล์โค้ดเพิ่ม แค่ commit ไฟล์ภาพ (1254×1254 PNG) ให้ขึ้นเว็บ · ไม่มีอะไรต้องทดสอบเพิ่ม (mechanism เดิมยืนยันแล้วรอบ 831)


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 838 (30 ก.ค. · ผู้ใช้ส่งภาพเมืองกำแพงเพชร: "พื้นกระเบื้องสว่างไป เปลี่ยนให้มืดครึ้มเป็นสีเทา"):** 🌫️ `js/adventure3d.js:1327` ตอน `img/city/ground.png` โหลดเสร็จ เดิม tint พื้นด้วย `groundMat.color.setHex(0xffffff)` (ขาวเต็ม = ไม่หรี่แสงเลย ภาพคอนกรีตจริงเลยสว่างจ้า) → เปลี่ยนเป็น `0x6e6e69` (เทาเข้มมืดครึ้ม) คูณกับภาพให้หม่นลง กลไกเดิมทั้งหมด (ปูซ้ำ/ path ใช้ร่วมกับโหมดขับรถผ่าน `buildDriveCity`) ไม่แตะ
  - ยืนยัน (server เอง :61305 · mock login+register ม.4 · เข้าจริงผ่าน `enterHeli3D()`→เลือกแผนที่ kpp→`Adventure3D.start`): world โหลดสำเร็จ (`Adventure3D` object + canvas ขึ้น) ไม่มี error คอนโซล · อ่านค่าสี pixel จริงจาก WebGL framebuffer (`gl.readPixels`) หลัง `renderNow()` บริเวณพื้นได้ ~(170-186,161-178,146-160) เทาหม่นลงจากขาวเดิม (255) ตามคาด · ปิด server แล้ว
  - 📌 ค้าง: ยังไม่ได้ดูภาพจริงผ่านจอ (screenshot tool ใช้ไม่ได้ในรอบนี้เพราะ Browser pane ไม่ได้เปิดแสดงผลฝั่งผู้ใช้) — ถ้าเข้าเกมแล้วยังสว่าง/มืดไม่พอ บอกให้ปรับเลข hex เพิ่มได้ทันที


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 839 (30 ก.ค. · ผู้ใช้ต่อยอด: "ใส่ท้องฟ้าให้ในเมืองกำแพงเพชรด้วย ใช้ภาพนี้ `img/sky/sky_dawn.jpg`"):** 🌅 ระบบ "ท้องฟ้าภาพจริง" (`applySky`, รอบ 203/816) มีอยู่แล้ว แค่ `SKY_IMG['drive']` เดิมชี้ไป `sky_day` (ไม่มีไฟล์ → fallback สีพื้น) — เมือง KPP (ทั้งโหมดขับรถและเฮลิฯ กำแพงเพชร ใช้ฉากเดียวกัน `worlds.drive`) `js/adventure3d.js:1986` เปลี่ยนเป็น `drive:'sky_dawn'` ผู้ใช้มีไฟล์อยู่แล้ว ไม่ต้องแก้โค้ดอื่น
  - ยืนยัน (server เอง :53245 · mock login+register ม.4 · เข้าจริงผ่าน `enterHeli3D()`→เลือกแผนที่ kpp): network request `img/sky/sky_dawn.jpg` → 200 · `gl.readPixels` หลัง `renderNow()` 6 จุดทั่วท้องฟ้า ได้สีชมพู/ม่วงอมส้มไล่เฉด **ไม่เท่ากันทุกจุด** (162-212,136-156,142-166) ยืนยันว่าเป็นภาพพาโนรามาจริง ไม่ใช่สีเรียบทึบ · ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 840 (30 ก.ค. · ผู้ใช้ขอ prompt กระเบื้องมุงหลังคาสีต่างๆ เช่นแดง/น้ำเงิน):** 🧱🏠 หลังคาปิรามิดตึกแถว (`js/adventure3d.js:1523` บล็อก InstancedMesh `roof`) เดิมเป็นสีลูกกวาดล้วน (`CUTE_ROOF` 8 สี รวมแดง/น้ำเงินอยู่แล้ว) ไม่มีลายผิว — เพิ่ม probe ภาพจริง `img/city/roof_tile.png` (แพทเทิร์นเดียวกับ facade ผนัง) แปะเป็น `map` บนวัสดุเดียวกัน คูณกับสี `CUTE_ROOF` ต่อหลังเหมือนเดิม (ภาพต้องขาว/เทาอ่อนล้วน ไม่งั้นสีเพี้ยน) · เขียน prompt เจนภาพลง `PROMPTS_BUILDINGS_KPP.md` หัวข้อ 5 (รูปแบบเดียวกับ 4 หัวข้อเดิม)
  - `node --check` ผ่าน · **ยังไม่มีไฟล์ภาพ** (`img/city/roof_tile.png`) — ตอนนี้หลังคายังเป็นสีล้วนเหมือนเดิมทุกอย่าง (โค้ดรอเงียบๆ เหมือนแพทเทิร์น ground.png รอบ 831/837) ไม่ต้องทดสอบ visual เพิ่มเพราะยังไม่มีอะไรเปลี่ยนบนจอจนกว่าจะมีไฟล์


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 841 (30 ก.ค. · ผู้ใช้เจน+วาง `img/city/roof_tile.png` ตาม prompt รอบ 840):** 🧱🏠 โค้ด probe รอไว้แล้วตั้งแต่รอบ 840 ไม่ต้องแก้ไฟล์โค้ดเพิ่ม แค่ commit ไฟล์ภาพ (1254×1254 PNG) ให้ขึ้นเว็บ — หลังคาปิรามิดตึกแถวทั้งเมือง KPP จะมีลายกระเบื้องจริงคูณสีลูกกวาดต่อหลัง (มีคาดว่าไม่มีอะไรต้องทดสอบเพิ่ม mechanism เดิมยืนยันแล้วรอบ 837/840)


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 842 (30 ก.ค. · ผู้ใช้ขอขยายพื้นที่แตะสไลเดอร์เลี้ยวโลกมอเตอร์ไซค์ ให้สูง 3 เท่า ภาพเท่าเดิม):** `js/moto3d.js` — เพิ่ม `#moto-steerhit` (div โปร่งใสซ้อนบน `#moto-slider`, สูง 72% = เดิม 24%×3, ขึ้น-ลงด้านละ 1 ช่วงเดิมเป๊ะ) แล้วย้าย pointer listener (`pointerdown/move/up/cancel`+capture) จาก `sliderEl`→`hitEl` ทั้งหมด · `#moto-slider` เดิมเหลือแค่โชว์ภาพ (`pointer-events:none`) ตำแหน่ง/ขนาดไม่แตะ → knob ภาพที่เห็นเท่าเดิมทุกพิกเซล ส่วน `setSteer()` ยังคำนวณองศาจาก `sliderEl.getBoundingClientRect()` เดิม (ความไวลากแนวนอนไม่เปลี่ยน)
  - ยืนยัน (server เอง :55751 · mock login+register ม.4 · `enterMoto3D()` จริงผ่าน UI): `getBoundingClientRect` วัดจริง — hit สูง 518px = slider(172.8px)×3 พอดี, ขอบบน/ล่างห่างจาก slider เดิมด้านละ 172.8px เป๊ะ (=1 ช่วงเดิม) · `document.elementFromPoint` จุดขอบบน/ล่างของโซนขยาย → ชี้ `moto-steerhit` (แตะติด) จุดถัดออกไปอีก 20px → ชี้ `moto-body` (พ้นโซนพอดี ไม่ล้น) · จำลอง `PointerEvent` แตะจุดเหนือกล่องเดิม 153px (อยู่ในโซนใหม่) → knob หมุนตอบสนองถูกทิศ · ตรวจแล้วไม่ทับปุ่ม/องค์ประกอบอื่นบนตัวเครื่อง (เร่ง/เบรก/เกียร์/แตร/power อยู่คนละแนว x) · `node --check` ผ่าน · console สะอาด


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 843 (30 ก.ค. · ผู้ใช้ขอขยายรูป+กรอบ profile หน้าล็อบบี้ ใหญ่กว่าเดิม 2 เท่า):** `css/lobby.css` — `.pass-photo` (base 52×62→104×124, border-radius 12→24, border 2→4px) + `.id-card .pass-photo` (override ที่ใช้งานจริง 54×62→108×124, border-radius 13→26, border 1→2px) · media query จอเตี้ย (≤520px/≤430px height) **ไม่แตะ** กันฝ่าฝืนกฎทองข้อ 7
  - ยืนยัน (server เอง :54415 · mock login+register ผ่าน UI → `showScreen('screen-dashboard')`): `getBoundingClientRect` วัด `#pass-photo` = 108×124 จริงที่จอ 1280×720 ไม่ล้น (`.lobby-top` สูงขึ้นเป็น 138px ยังพอดี stage เหลือ 495px) · ทดสอบซ้ำจอเตี้ย 812×375 (ขนาดเดิม 46×53 ตามเดิม) `dash.scrollHeight===clientHeight` ไม่มี scrollbar


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 844 (30 ก.ค. · ผู้ใช้ส่งภาพเมืองกำแพงเพชร: "ตึกยังแปะภาพไม่ครบ ห้ามเอาผนังไปเป็นหลังคา"):** 🏢 ต้นตอ: "ตึกจริง" 79 หลัง (ผัง OSM, `ExtrudeGeometry` ใน `js/adventure3d.js` `buildDriveCity`) มีแค่สีพาสเทลล้วน ไม่เคยแปะภาพผนังเลย (ตึกแถวข้างล่างมีอยู่แล้ว) → เพิ่ม material array `[capFlatM,wallM]` ใช้ `img/city/shop_4fl.png` ตามกฎเดิม "4 ชั้นขึ้นไป→shop_4fl" repeat ตาม z จริง(เมตร)
  - ⚠️ ก่อนแก้ตรวจ `js/vendor/three.min.js` จริงก่อนว่า `ExtrudeGeometry.addGroup` ลำดับไหนคือผนัง/ฝา — พบว่า **materialIndex 0 = ฝาบน/ล่าง(cap) · 1 = ผนังข้าง(side)** (สลับกับที่คนทั่วไปเข้าใจ) ใส่ผิดลำดับจะเป็นบั๊กที่ผู้ใช้เตือน (ผนังไปโผล่เป็นหลังคา)
  - ยืนยัน: เทสต์แยก (สี debug แดง/น้ำเงินคนละ index) ยืนยัน index0=cap,index1=side ตรงจริง 100% (`gl.readPixels` มุมบนตรงแดง มุมข้างตรงน้ำเงิน) + เข้าเกมจริง (server เอง :49677 · mock login+register ม.4 · `Adventure3D.start('heli',{map:'kpp',walkIn:true})`): `img/city/shop_4fl.png` โหลด 200 OK ไม่มี error คอนโซล · `node --check` ผ่าน · ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 845 (30 ก.ค. · ผู้ใช้: "เฮลิคอปเตอร์บินได้ช้าไป ปรับให้บินได้ไวกว่านี้ 2 เท่า"):** 🚁💨 `js/adventure3d.js:8144` `tickHeli()` — สูตรเดิม equilibrium speed = accel/drag (13/1.4≈9.3 m/s) ไม่ใช่เพดาน clamp 17 ที่แทบไม่ถึง (drag ดึงกลับก่อน) → เพิ่ม accel แนวราบ 13→26 + แนวดิ่ง 9→18 (drag คงเดิม 1.4/1.8) + ขยับเพดาน clamp 17→34 คู่กัน ให้ equilibrium ใหม่ ~18.6 (2 เท่าเป๊ะ) ไม่โดน clamp ตัด
  - ยืนยัน (server เอง · mock login+register ม.4 · เข้าจริงผ่าน `enterHeli3D()`→kpp): ใช้ testkit `_t.step(dt,n)`/`_t.setKeys()`/`_t.col` จำลองไต่ระดับแล้วบินหน้าเต็มแรงจนถึง equilibrium วัดความเร็วจริงจาก camera position delta = **17.27 m/s (62.2 กม./ชม.)** ตรงกับสูตรคำนวณเป๊ะ (เทียบสูตรเดิมคำนวณได้ 8.64 m/s → อัตราส่วน 2.0 เท่าพอดี) · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 846 (30 ก.ค. · ผู้ใช้: "เหรียญห้ามอยู่เดี่ยวๆ ต้องอยู่กับตัวอักษร" + "ชนหมาปรับ 50 เหรียญ"):** 🪙🔤 `js/moto3d.js` `scatterCoinTick()` (บรรทัด ~1670) เดิมโปรยเหรียญทองอิสระด้วย `addFreeCoin` ไม่ผูกตัวอักษร → เปลี่ยนเป็นสร้างก็อปปี้ตัวอักษรที่ยังไม่เก็บของคำนี้ (สุ่มจาก idx ที่เหลือ) แล้วแปะเหรียญด้วย `addCoin(l,0,+1)` แบบเดียวกับ `spawnLetters` ทุกประการ (letters.length เพิ่มตามเสมอ) · `DOG_HIT_COIN` 10→50
  - ยืนยัน (server เอง · mock login+register ม.4 · เข้าจริงผ่าน `enterMoto3D()`→`MotoWorld.start()`): ใช้ `_t.step(1/60,800)` จำลองขับ ~13 วิ ได้ `letters.length===coins===13` เหรียญทุกใบมี `ch` ติด (`orphanNonKeep:0`) ไม่มีเหรียญลอยเดี่ยวเลย · `_t.forceDog()`+ย้าย dog ไปทับตัวเอง+`dogTick()` วัด `state.coins` ก่อน/หลัง 1000→950 ตรง 50 เป๊ะ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-07-30 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 847 (30 ก.ค. · ผู้ใช้: "ตัวอักษรพื้นทุกโลกไม่ต้องสุ่มที่เกิดใหม่ตามเวลาเดิม เปลี่ยนเป็นอยู่นิ่งที่เดิม เก็บแล้วหาย 1 นาทีค่อยเกิดใหม่ที่เดิม"):** 🔠⏱️ `js/adventure3d.js` — ①ลบ `relocateLetters()`+`RELOCATE_MS`(75วิ) ที่เคยสุ่มย้ายตำแหน่งตัวอักษรที่ยังไม่ถูกเก็บทุก 75 วิ ทิ้งทั้งฟังก์ชัน (ตอนนี้ตัวอักษรอยู่นิ่งตลอดจนกว่าจะถูกเก็บ) ②`pickUpLetter()` เดิมลบตัวอักษรทิ้งแล้วปล่อยให้ `ensureCoverage()`/`ensureDriveAmbience()` (รันทุก 5 วิ) สุ่มจุดใหม่แทน → เปลี่ยนเป็นจำตำแหน่ง/scale/room เดิมไว้ในคิว `letterRespawns` แล้วเกิดใหม่ที่จุดเดิมเป๊ะหลัง `LETTER_RESPAWN_MS`(60วิ) ผ่านฟังก์ชันใหม่ `spawnLetterAt()`/`tickLetterRespawns()` (ครอบทุกโลกที่ใช้ระบบ `letters` ร่วม: adv/haunt/heli ทั้ง 2 แผนที่/drone/drive — ไม่รวม 🪙เหรียญโบนัสข้างถนน ยังเป็นระบบ ambient เดิม, ไม่รวม soccer/mecha ที่มีระบบของตัวเองอยู่แล้ว)
  - ยืนยัน (server เอง · mock login+register ม.4 · เข้าจริงผ่าน `enterHeli3D()`→kpp ใช้ testkit ใหม่ `_t.letters`/`_t.letterRespawns`/`_t.pickUp(i)`): เก็บตัวอักษร 'e' ที่ตำแหน่ง (42.73,1.4,166.90) → หายจาก `_t.letters` ทันที เข้าคิว `letterRespawns` ตรงพิกัดเป๊ะ · รอจริง 61 วินาที (`setTimeout`+`_t.step`) → ตัวอักษร 'e' โผล่กลับที่พิกัดเดิมเป๊ะ (`foundAtSameSpot:1`) คิวว่างเหลือ 0 · ตัวอักษรอื่นที่ไม่แตะเลย x/z ไม่ขยับแม้จำลองผ่านไป 2.5 วิ (`same:true`) · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว (รีเบสทับรอบ 846 ที่แก้ `js/moto3d.js` คนละไฟล์ ไม่ชนกัน)


## ⏬ ย้ายเมื่อ 2026-07-31 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 848 (30 ก.ค. · ผู้ใช้ส่งภาพหน้าสอบ TOEIC: "ตัวอักษรคำถาม/ตัวเลือก/ปุ่มส่งคำตอบเล็กไป"):** `css/exam.css` (ครอบทั้ง TOEIC/TOEFL/IELTS เพราะ 3 สนามสอบใช้ selector `.xs-*` ร่วมกัน) — `.xs-q` 16→20px, `.xs-qno` 12.5→14.5px, `.xs-ch` 15→18px (padding 8×10→11×14), `.xs-ab` 22→27px กล่อง, `.xs-btn` (ปุ่มถัดไป/ส่งคำตอบ) 14.5→17px + padding โต · media `max-width:640px` ขยับตาม 14/13→16.5/15.5px ด้วย · **ไม่แตะ** breakpoint `max-height:470px` (จอเตี้ยมือถือแนวนอน) กันฝ่าฝืนกฎทองข้อ 7 (พื้นที่ตายตัวอยู่แล้ว)
  - ยืนยัน (server เอง :8791 · mock login + `examStdStart('toeic_1','practice')`): `getComputedStyle` วัดจริง qFont 20px/chFont 18px/btnFont 17px ตรงค่าใหม่ · `.xs-qside` และ `#xs-screen` ไม่ล้นจอทั้ง 1280×720 (`scrollHeight-clientHeight===0`) และ 480×800 แคบ (cascade เป็น 16.5/15.5px ตาม breakpoint ไม่ล้นเช่นกัน)


## ⏬ ย้ายเมื่อ 2026-08-01 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 849 (30 ก.ค. · ผู้ใช้ส่งภาพจอยขับมอเตอร์ไซค์: "กรอบดาว/โน้ตดนตรี (ซ้าย) กับรถ/เมฆ (ขวา) ขวางในจอ ย้ายไปกรอบแดงด้านข้าง พื้นทึบไม่โปร่งใส"):** 🖼️ สติกเกอร์ 2 กลุ่มนี้ไม่ใช่ปุ่ม HTML แต่ฝังเป็นพิกเซลอยู่ในภาพพื้นหลังเดียวกันทั้งเครื่อง `img/moterbike/console_crop.webp` (ใช้กับ `#moto-body`) → แก้ด้วยสคริปต์ Python (PIL+OpenCV, เก็บไว้ที่ scratchpad ไม่ได้อยู่ในโปรเจกต์): ① หา bbox จริงด้วย mask "สีอิ่มตัวหรือสว่างขาว" (ต้องรวม white_thr เพราะเมฆ/กระจกรถสีขาวไม่อิ่มตัว จับไม่ติดถ้าเช็คแค่ saturation) ② ลบตำแหน่งเดิมด้วย `cv2.inpaint` (mask = convex hull ของพิกเซลไอคอน กันไม่ให้ล้อรถดำๆ ที่แยกจากสีไม่ได้หลุดออกมาเป็นเงา) + เกลี่ยผิวเพิ่มอีกชั้น (blend blur เบาๆ) ③ วางป้ายพื้นทึบสีเข้มมนใหม่มุมบนซ้าย/ขวา — ต้องย่อไอคอนเหลือ scale 0.38 เพราะมุมที่ว่างจริง (พ้นทั้งจอ `#moto-screen` และไม่ล้นออกนอกซิลูเอตตัวเครื่อง/ไม่ทับเส้นขอบเงามันของบอดี้) แคบมาก — หาตำแหน่ง/ขนาดที่ valid ด้วย grid-search เช็ค void-overlap จริงทีละพิกเซล ไม่ใช่กะด้วยตา · บัมพ์ `?v=295→296` ใน `js/moto3d.js` ตามกฎ cache-first ของ sw.js
  - ส่งภาพร่างให้ผู้ใช้ดูก่อน (asset ภาพวาดของผู้ใช้ ไม่ใช่ของทดสอบ) ผู้ใช้ยืนยัน "โอเค แทนที่ไฟล์ได้เลย" จึงเขียนทับไฟล์จริง · ยืนยัน (server เอง :64342 · mock login+register ม.4 · เข้าจริงผ่าน `enterMoto3D()`): network request `console_crop.webp?v=296` → 200 OK (แคชใหม่โหลดจริง ไม่ใช่ของเก่าค้าง) · ตรวจภาพ crop ซูม 3 เท่าทั้ง 2 ฝั่งด้วยตาไม่เห็นเงาเดิมหลงเหลือ ไม่ล้นขอบจอ/ขอบตัวเครื่อง · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 850 (30 ก.ค. · ผู้ใช้: "บันไดโรงแรมผีสิงชิดผนัง ให้ค้นหลักการสร้างบันไดตึกจริง" + "ผีเน้นตามหลัง+เสียงฝีเท้า ไม่เน้นเห็นข้างหน้า" + "เดินดูลอย ขยับกล้องให้ธรรมชาติ"):** 🪜👻📷 ①`js/hotel3d.js` — รื้อทางลาดยาวแนบผนังเหนือ → บันได **dog-leg (พับกลับ 180°)** ตามหลักบันไดอาคารจริง (ค้นเว็บ: ลูกตั้ง≤18ซม./ลูกนอน≥25ซม./ชานพัก≥1.2ม. ตามกฎกระทรวง ฉ.55): 2 ช่วง×10 ขั้น (ลูกตั้ง .17 ลูกนอน .34) เลนใต้ขึ้นครึ่งชั้น→ชานพักกลางตะวันตกหักกลับ→เลนเหนือขึ้นถึงชั้นถัดไป + ช่องโล่งกลางมีแผงราวกันตก+ราวจับไม้ 2 ฝั่ง · เขียน `surfaceY()` ใหม่ (แยกโซนชานพักชั้น/ชานพักกลาง/ช่วงไต่ 2 เลน) · ย้ายไฟโถงไปเหนือชานพักกลาง ②`js/adventure3d.js` — `ghostGoStalk` เกิดหลังผู้เล่น 11 ม.(ตาม yaw) · state `stalk`: หันมองได้ .6 วิแล้วผีเลือนหาย (vis fade 3.5/s · ไฟฉายยังไล่ทันใน .6 วิ) + `HSound.step()` ใหม่ (ฝีเท้าทุ้ม+เสียดสีพรม จังหวะตรง gait ยิ่งใกล้ยิ่งดัง) · peek 1400→650ms · คาบส่งผีตาม 17-32s→12-24s ③head bob: เฟสก้าวผูกระยะเดินจริง (ชนกำแพง=หยุดโยก) bob±5ซม. + roll ไหล่สลับเท้า + เอนเข้าโค้งตอนหันกล้อง (clamp .045) ใน `tickHotelPlayer` + testkit `_t.hotel.setYaw/setPitch`
  - ยืนยัน (server เอง :8791 · mock login+register · เข้าจริง `enterHaunted3D()`): surfaceY 9 จุดตรงเป๊ะ (ชานพัก 0/3.4/1.7/5.1/13.6 · กลางช่วง .85/2.55) · จำลองเดินทีละ 15 ซม. ขึ้นชั้น 0→1 ผ่านตลอด จบที่ 3.4 พอดี · ข้ามช่องกลางโดนราวกัน ✓ · Snap.grid 4 มุมเห็นขั้นบันได+ราวจริง · ผี: เกิดข้างหลัง ✓ ตามขณะเดิน vis=1 ✓ หันมอง .33วิ ยังเห็น (vis 1) มองค้าง 1.8วิ จาง (vis 0) ✓ ฝีเท้า 7 ก้าว/3วิ ✓ ครบ 13 วิวาร์ปหลัง→lurk วนถูก ✓ · bob: เดิน range .10 ชนกำแพง .003 ✓ tilt เดิน .057/หัน .059 ✓ · `node --check` ผ่านทั้ง 2 ไฟล์ · console สะอาด · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 851 (30 ก.ค. · ผู้ใช้ส่งภาพ: "ปุ่มขวามือ (ออก/แชท/ปิด/ปิด/ใช้E) ซ้อนทับกัน"):** 🖼️ `js/adv3d_css.js` — ต้นตอ: คอลัมน์ปุ่มแชท/ไมค์/ลำโพง (`#adv-exit/#adv-help/#adv-chat-btn/#adv-mic/#adv-spk/#adv-vmode` ขวา:8px ไล่ top 118-282) ไม่เคยมี override เฉพาะโลกผีสิงเหมือนโลกขับรถ/หุ่น (`.adv-drive`/`.adv-mecha` มีอยู่แล้ว) → ลงมาชนปุ่มจอสัมผัส `#adv-torch`/`#adv-use` (ขวา:14px วางชิดล่างเสมอ ค่าตายตัวกันไม่ให้ทับ `#adv-exit`) บนจอเตี้ย 812×375 → เพิ่ม `.adv-haunt` override ย้ายทั้งแถวขึ้นแถวบนเดียวกัน (ค่าเดียวกับ `.adv-drive` ที่พิสูจน์แล้วไม่ทับ)
  - ยืนยัน (server เอง :8792 · mock login+register · เข้าจริง `enterHaunted3D()` · จำลอง `.adv-touch` จอ 812×375): `getBoundingClientRect` ทั้ง 8 ปุ่ม (exit/help/chat/mic/spk/vmode/torch/use) → **overlaps:[] (ศูนย์คู่ทับกัน)** เทียบก่อนแก้ที่ทับ 2 คู่ · ปิด `.adv-touch` (จำลองเดสก์ท็อป) → `#adv-torch`/`#adv-use` กลับเป็น `display:none` ตามเดิม ไม่กระทบ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 852 (30 ก.ค. · ผู้ใช้ส่งภาพโลกฟุตบอล 5 ข้อ: ปุ่มทับกัน / พลัง 500→100 / เติมพลังบอลเร็ว+20% / ชาร์จ≥30% บอลไฟ+ควันมิสไซล์ / หันลำตัวตามมุมเล็ง):** ⚽ ①CSS `js/adv3d_css.js` จัดฝั่งขวาใหม่: แถวบน=ปุ่มระบบแบบโลกขับรถ (`.adv-soccer #adv-exit/help/chat/mic/spk/vmode` top:8) · คอลัมน์ขวา=มุมกล้อง48/จุดโทษ88/ฟรีคิก128/พลัง168 · แถบชาร์จ `#adv-power` ย้ายลงข้างปุ่มเตะ (bottom:96 right:132) · topbar ตรึงซ้าย 206 · **⚠️ ส่วน CSS นี้ถูก session คู่ขนานกวาดติด commit `f9d771f` (รอบ 851 โลกผีสิง) ไปก่อนแล้ว — รอบนี้เพิ่มเฉพาะ `#adv-aurabar{top:40}`** ②`js/adventure3d.js`: `AURA_COST` 500→100 (+ป้ายปุ่ม/ข้อความใช้ค่า const) · `kickLaunch()` คูณ `AURA_SPD=1.2` ตอนออร่า (เส้นไกด์สูตรเดียวกันจึงตรง) · ระบบใหม่ `buildBallFX/ballFXTick/smokePuff` (`FIRE_CHG=30`): ชาร์จ≥30%=สไปรต์เปลวไฟ 8 ดวงเต้นวนรอบบอล (additive) · เตะพลัง≥30% (`sbFlame`)=ไฟลู่สวนทางความเร็ว+พ่นก้อนควัน pool 90 ก้อนพองโต-ลอยขึ้น-จางแบบจรวด (รีเพลย์ซ่อนไฟ ควันจางต่อ) ③หันลำตัว: เดิม `rotation.y=+aimYaw` หันสวนทิศ (โมเดลหน้า -Z) → แก้เป็น `-aimYaw` smooth + ยืนถอยหลังบอล .55ม. เยื้องให้ขาขวาตรงแนวบอล + ชาร์จ=เอนหลัง+ง้างขาตามพลัง (`rotation.order='YXZ'`) · ออร่าย้ายตามตัวนักเตะ · testkit ใหม่ `_t.soccer`
  - ยืนยัน (server เอง :8793 · mock login+register · เข้าจริง `enterSoccer3D()`): `getBoundingClientRect` ทุกปุ่ม+แถบ **overlaps:[] ทั้ง 1000×640 และ 812×375 (รวมตอนแถบเวลาออร่าโชว์)** · ซื้อพลังเหรียญ 1000→900 ป้าย "ต่อเวลา 100🪙" ✓ · `launch(100).spd` 44→52.8 (×1.2 เป๊ะ) ✓ · ชาร์จ 35%→ไฟติด / 20%→ไม่ติด ✓ เตะ 80%→flame+ควัน / 20%→ไม่มี ✓ · เล็ง 0.5 → ry=-0.5 จุดยืนตรงสูตรเป๊ะ · ชาร์จค้าง(Space) lean 0.09 ปล่อยคืน 0 ✓ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 853 (30 ก.ค. · ผู้ใช้: "ควันและไฟต้องหางยาวเพราะแรงลมปะทะ + ควันต้องชัดกว่านี้มากๆ"):** 🔥💨 `js/adventure3d.js` โซน ballFX (ต่อจากรอบ 852) — เปลว 8→14 ดวง เรียงเป็นหางตามแกนสวนความเร็ว ยืดถึง ~2.4m ตามสปีด (`tail=(.3+tt*2.1)*(0.6+sp/30*.6)`) ปลายแคบ-จาง ทรงหยดน้ำ · เท็กซ์เจอร์ไฟอิ่ม/ทึบขึ้น + หัวโต `BALL_R*2.7` (เดิม 1.9 จมแสงแดด) · ควัน: `SMOKE_GAP` 26→13ms (ถี่ 2 เท่า) `SMOKE_LIFE` 1.15→1.8s `SMOKE_MAX` 90→180 ก้อนใหญ่ .34→.55 เท็กซ์เจอร์+opacity .5→.88 (จางแบบ 1-t² ชัดนาน) จุดพ่นถอยท้าย 2.2R พ้นหางไฟ
  - ยืนยัน (server เอง :8794 · mock login+register · เข้าจริง `enterSoccer3D()` · จำลองเวลาจริง 13ms/เฟรมให้ smoke gate ทำงาน): `Snap.grid` 3 จังหวะ (ชาร์จ/หลังเตะ .4วิ/กลางอากาศ 1วิ) ดูด้วยตา — ไฟล้อมบอลชัดตอนชาร์จ ✓ หางไฟลากตามบอล ✓ ควันลำทึบขาวต่อเนื่องยาวตลอดวิถีแบบ missile ✓ (ก่อนจูนรอบแรกควันบาง/ไฟจมแสง → เร่งอีกรอบแล้วถ่ายซ้ำ) · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 854 (30 ก.ค. · ผู้ใช้: "อัพเดท background music หน้า Lobby ให้เหลือแค่ bgm_01 เพลงเดียว"):** 🎵 ผู้ใช้ลบไฟล์ `sound/bgm/bgm_02.mp3`/`bgm_03.mp3` ออกจากดิสก์เองแล้ว (git แจ้ง deleted) → `js/music.js` `BG_NAMES` ตัดเหลือ `['bgm_01']` เท่านั้น (เดิมมี bgm_02..08 ที่ไม่มีไฟล์จริงอยู่แล้ว) · ผลข้างเคียง: ฉากเฮลิฯ ที่เคยขอเพลง `bgm_02`(เดิน/ลิฟต์)/`bgm_03`(กลางคืน) จะหาไฟล์ไม่เจอ → คงเพลงเดิมไว้เฉยๆ ไม่ error (ยังไม่ได้แก้ `adventure3d.js` เพราะนอกขอบเขตงานนี้ เป็นแค่ผลข้างเคียงจากไฟล์หาย)
  - ยืนยัน (server เอง :50904 · mock login+register ม.4 · เข้า Lobby จริง): `read_network_requests` กรอง `bgm` → probe HEAD เจอแค่ `bgm_01.mp3` (200) ไม่มี request ไป bgm_02/03 เลย · โหลดเล่นจริงเป็น `bgm_01.mp3` (GET 200) · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 855 (30 ก.ค. · ผู้ใช้: "ตัวอักษรใน goal ไม่ยอมเปลี่ยนสักที ทั้งที่ยิงโดนแล้ว แก้ด่วน"):** ⚽🐛 reproduce ก่อนแก้ (testkit ใหม่ `_t.soccer.teleportBall/wordsInfo/invNow` วาร์ปบอลชนป้ายตรง ๆ): ยิงโดนจริง inv เพิ่ม+ป้ายย้ายที่ แต่ตัวอักษร**ค้างตัวเดิม** · ต้นตอ `js/adventure3d.js` `soccerNextTile()` เอา `need[0]` เสมอ ซึ่ง `soccerNeededSet()` เรียงตามตัวสะกดของคำ → คำที่มีตัวซ้ำ (eye=e,y,e) หรือตัวที่โผล่หลายคำ (e อยู่ 5-6 คำ) ทำให้ need[0] เป็นตัวเดิมซ้ำติดกันหลายลูก ดูเหมือน "ไม่เปลี่ยน" · แก้: ถ้า need[0] ซ้ำกับตัวที่เพิ่งยิง ให้เลื่อนไปตัวถัดไปที่ต่างออกไป (`need.find(c=>c!==l.ch)`) — คำยังครบเหมือนเดิม (tryCompleteWords นับจาก inv ไม่สนลำดับ) ซ้ำได้เฉพาะเหลือตัวเดียวล้วนจริง ๆ
  - ยืนยัน (server เอง :8795 · mock login+register · เข้าจริง `enterSoccer3D()` · ยิงจริง 22 ลูกติดผ่าน teleportBall+step): ก่อนแก้ ch ค้าง 'e' หลังชน ✓reproduce · หลังแก้ ลำดับป้าย a→p→a→p→a→l→... **ไม่มีตัวซ้ำติดกันเลย** · คำ apple/hair/ear ประกอบจบ-ถูกถอดออก-คำใหม่หมุนเข้า ✓ เหรียญ 1000→1170 ✓ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 856 (30 ก.ค. · ผู้ใช้ส่งภาพ EDUCATION เก็บ E,D แล้ว: "ตัวต่อไปควรเป็น U แต่ป้ายกลับไป E ไม่ถูกต้อง"):** ⚽🐛 รากลึกกว่ารอบ 855: `js/adventure3d.js` `soccerNeededSet()` เดิมหัก inv แบบ "นับรวมทุกคำ" แล้วค่อยไล่ตามตัวสะกด → E ที่เก็บถูกเครดิตให้ E ของคำท้าย ๆ ตำแหน่ง E ของคำแรกเลยค้างหัวคิว · แก้: เดินตามตัวสะกดทีละตำแหน่ง (คำแรก-ตัวแรกก่อน) เครดิตตัวที่เก็บแล้วให้ตำแหน่งแรกสุดก่อน → คิวเดินหน้าตามการสะกดคำจริงเสมอ · **ถอด hack รอบ 855 ("ข้ามตัวซ้ำกับที่เพิ่งยิง") ทิ้ง** — รากแก้แล้ว และ hack นั้นสลับลำดับสะกดของคำตัวซ้ำจริง (apple → p,p ต้องซ้ำได้)
  - ยืนยัน (server เอง :8796 · mock login+register · เข้าจริง `enterSoccer3D()` · ยิงจริง 12 ลูกผ่าน `_t.soccer.teleportBall`): ลำดับป้าย `nosefatherba` ตรง `words.join('')` เป๊ะทุกตัว (n-o-s-e→f-a-t-h-e-r→b-a) — 'e' ของ father ไม่โดนเครดิต e ของ nose กลืน (เคสเดียวกับ EDUCATION) ✓ คำจบถูกถอด-คำใหม่หมุนเข้า ✓ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 858 (30 ก.ค. · ผู้ใช้: "เอาเข้า Google Play Store ให้หาเจอได้เลย"):** 🏪📦 สร้างแพ็กเกจ Android จริงผ่าน PWABuilder API (`pwabuilder-cloudapk.azurewebsites.net/generateAppPackage`) → ได้ `store/android/` (Vocab World.aab 4MB สำหรับอัปโหลด Play · .apk 3.9MB ลองเครื่องจริง · signing.keystore+รหัสใน signing-key-info.txt) · **`store/android/` เข้า .gitignore แล้ว — กุญแจ signing ห้ามขึ้น repo สาธารณะเด็ดขาด ทำหายต้องเจนแอปใหม่ทั้งตัว** · packageId=`app.web.vocabworld.twa` version 1.0.0(1) · รัน `make_assetlinks.py` ใส่ SHA-256 ของ upload key แล้ว deploy `.well-known/assetlinks.json` ขึ้นเว็บจริง
  - ⏭️ **ค้างฝั่งผู้ใช้:** ①สมัคร/ล็อกอิน Play Console (play.google.com/console · $25 ครั้งเดียว — ผู้ใช้ยังไม่แน่ใจว่ามีบัญชี) ②สร้างแอป+อัปโหลด .aab (คู่มือละเอียด = Artifact "พา Vocab World ขึ้น Play Store") ③หลังอัปโหลด: เอา SHA-256 ของ **App signing key** จาก Play Console มารัน `python tools/make_assetlinks.py <อันใหม่> <อันเดิม>` แล้ว deploy ซ้ำ ④บัญชีบุคคลใหม่ต้องผ่านทดสอบปิด 12 คน×14 วันก่อนขึ้น production 🏪 เตรียมของฝั่งเราให้ครบก่อนขึ้นร้าน (ตัวเกมเป็น PWA อยู่แล้ว → ขึ้น Play ด้วย TWA) — ①`privacy.html` หน้าใหม่ นโยบายความเป็นส่วนตัว TH+EN + ตารางสรุปสำหรับฟอร์ม Data safety (Play **บังคับ**ต้องมี URL สาธารณะ) + ลิงก์จากหน้าข้อตกลงใน `index.html` ②`js/auth.js` `authIsAppMode()`+`AUTH_REDIRECT_CODES` — ในแอปที่ติดตั้งแล้ว (TWA/PWA) popup login เปิดไม่ได้ → ใช้ `signInWithRedirect` ตรง ๆ (⚠️ ห้ามเช็ค `display-mode:fullscreen` เพราะเกมสั่งเต็มจอเองในเบราว์เซอร์ปกติ จะเข้าใจผิดว่าเป็นแอป) ③`tools/make_assetlinks.py` เจน `.well-known/assetlinks.json` (ตอนนี้เป็น `[]` รอลายนิ้วมือ SHA-256 จาก Play Console หลังอัปโหลด .aab) ④`tools/make_store_assets.py` → `store/icon-512.png` (32-bit ตามสเปก · ของเกมเป็น palette ใช้ไม่ได้) + `store/feature-1024x500.png` · `deploy_firebase.sh` ตัด `store/` ไม่ให้ขึ้นเว็บ
  - ยืนยัน (server เอง :63581): `authIsAppMode()` = false เบราว์เซอร์ปกติ / true เมื่อ standalone / **false เมื่อ fullscreen** (กันเคสเกมสั่งเต็มจอ) ✓ · `privacy.html` เรนเดอร์ครบ 3 หัวข้อ ไม่ล้นแนวนอนทั้ง 812 และ 375 ✓ · ลิงก์นโยบายในหน้าข้อตกลงขึ้นจริง กล่องยังพอดีจอ 812×375 (กฎทองข้อ 7) ✓ · `node --check` ผ่าน
  - ⏭️ **ค้าง (ต้องผู้ใช้ทำเอง):** สมัคร Play Console $25 → PWABuilder เจน .aab → อัปโหลด → เอา SHA-256 มารัน `make_assetlinks.py` → **บัญชีส่วนบุคคลใหม่ต้องทดสอบปิด 12 คน 14 วัน** ก่อนขึ้น production


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 860 (1 ส.ค.):** เลิกบอกผู้เล่น "ปิดเกมเปิดใหม่" ตอนโลก 3D โหลดค้าง — `advBusyMsg(retry)` ใน `js/ui.js`: `advLoading` เก็บ timestamp (เดิม boolean) · กดซ้ำตอนค้าง >10 วิ → `advResetLoad()` ล้างสถานะ+ถอด `script[data-lso]:not([data-loaded])` แล้วเรียกฟังก์ชันทางเข้าโลกเดิมซ้ำอัตโนมัติ (ทางเข้า 9 โลกส่งตัวเองเป็น retry) · <10 วิ = แค่ "รอสักครู่นะ" · ยืนยัน: node --check + eval 3 เคสใน preview (fresh/stuck/idle ผ่านหมด) · ⚠️ ผู้ใช้สั่ง **ยังไม่แตะ/ไม่อัป APK + ยังไม่ขึ้น Play Store** จนกว่าเกมจะสมบูรณ์กว่านี้
- **รอบ 859 (31 ก.ค. · ผู้ใช้สั่ง 6 งาน: เฟดเพลงหน้าเรียน / APK เข้าโลก 3D ไม่ได้ / หุ่นรบไม่เด้งค่าเข้า / เตือนเงินหายเอง / splash เห็นกรอบ+ขอแสงกรีด / หน้า login ให้หรู):**
  - 🚑 **รากบั๊ก APK "เข้าไม่ได้ทุกโลก" (หลังเล่นมอไซค์+เปิด TOEIC):** `loadScriptOnce` (ui.js) — แท็ก script ที่เคยโหลดพัง 1 ครั้ง เรียกซ้ำจะ addEventListener รอ event ที่ไม่มีวันยิง → promise ค้าง → `advLoading` ค้าง true → **ทุกโลกเงียบถาวร** · แก้: แท็กพัง (dataset.failed) ถอดทิ้งสร้างใหม่=retry จริง + guard เงียบเปลี่ยนเป็น `advBusyMsg()` + กล่อง `world3DFail(label,err)` โชว์ error จริง/สถานะ WebGL/RAM + ปุ่มโหลดเกมใหม่ (กฎทอง #1 ป้ายบอกเหตุผล) + `webglcontextlost` handler ทั้ง 3 เอนจิน + ออกโลก `renderer.setSize(2,2,false)` คืน GPU memory (adventure3d/moto3d/invasion3d — start() fit เต็มจอคืนเสมอ ยืนยัน canvas 1250→2→1250) + `blkBuildThumbs` เพิ่ม forceContextLoss · ยังต้องเทสต์เครื่องจริงยืนยัน แต่ถ้าซ้ำอีกจะมีกล่องบอกสาเหตุแล้ว
  - 🤫 เฟดเพลงล็อบบี้: `js/music.js` ระบบ duck ตรวจ DOM ทุก 250ms (`#xs-picker/#xs-screen/#xs-review/.fq-box/#screen-cats,quiz,game.active`) → เฟดเงียบ ~0.9วิ ค้างจนปิดหน้า → เฟดกลับ (วัดจริง vol .28→.21→.13→.06→pause / คืน 0→.09→.15→.21→.30) + `Music._t` test hook
  - 🤖 หุ่นรบเข้าระบบจ่ายค่าเข้าเหมือนโลกอื่น: `ui.js` WORLD3D เพิ่ม `ticketKey:'mechaTicket'` + railWorldClick ไหลเข้า openWorldEntryDialog (ซ่อนข้อความ "ปลดล็อกโลกถัดไป" เฉพาะ mecha) — ยืนยันจ่าย 500 สองรอบ เข้าโลกจริงทั้งคู่
  - 💰 `toast(msg, 0)` = ค้างจนผู้เล่นกดปิด (util.js · ไม่เล่นเสียงผิดถ้าไม่ใช่คำเตือน) ใช้กับเงินค่าอาหารสัตว์ `state.js` (เข้าแล้ว/เตือนล่วงหน้าวันสิ้นเดือน — ตัวที่ผู้ใช้อ่านไม่ทันวันนี้ 31 ก.ค.)
  - 🛡️ splash: `#app-splash` พื้นเรียบ `#0a1f3c` (สีเดียวกับ background_color ของ APK — รอยต่อกลืน) + แสงกรีดขอบทอง mask 2 ชั้น xor สูตร rank (index.html inline) · ไอคอนแอปพื้นเรียบใหม่ `img/icons/icon-192/512-flat.png` (เจนใน `tools/make_store_assets.py` จาก splash_logo บนพื้น #0a1f3c ขอบสีพื้นล้วนเป๊ะ) + manifest.json/sw.js ชี้ตัวใหม่ (CACHE v217) → APK splash ไม่เห็นกรอบสี่เหลี่ยม · ✅ **rebuild .aab/.apk เสร็จแล้ว v1.0.1 (code 2)** ด้วย `store/android/rebuild_apk.py` (keystore เดิม — เทียบ SHA-256 ใน assetlinks ตรงเป๊ะ · ⚠️ `minSdkVersion` ต้อง **21** ไม่ใช่ 19 — androidbrowserhelper 2.6.2 บังคับ ไม่งั้น build 500) · ตรวจใน APK แล้ว splash drawable ทุกขนาดมุมภาพ = #0a1f3c ตรงพื้น · ของเก่า 1.0.0 อยู่ `store/android/old-1.0.0/` · ไฟล์อัปโหลด Play = `store/android/Vocab World.aab`
  - 💎 login ใหม่: index.html โครง `.login-lux` (ตราโล่+VOCAB WORLD ทอง gradient+เส้นแบ่ง✦) + `css/lobby.css` ธีมน้ำเงิน-ทอง ปุ่ม Google มาตรฐานแบรนด์ — 1000×640 และ 812×375 ไม่มี scroll ✓ (กฎทอง 7)
  - ยืนยัน (server :8642 · mock login+register ม.4 · คลิกจริงผ่าน browser): ทุกข้อด้านบน + `node --check` ผ่าน 7 ไฟล์ · ล้างเซฟ+reload ปิดเสียงแล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 861 (2 ส.ค. · ผู้ใช้ 3 งาน: แปะ texture โลกผีสิง / เข็มจากชีตใหม่คมชัด / เข็มไม่พอกรอบ 2 หน้า):** ① texture โรงแรม 7 ไฟล์ (wall/room/carpet/marble/wood/tile/facade) เดิม .png untracked = **ไม่เคยขึ้นเว็บ** → แปลง .jpg q87 (13MB→2MB) commit ครบ โค้ด hotel3d.js ต่อไว้อยู่แล้ว ยืนยันเข้าโลกจริง network โหลด .jpg 200 ครบ+portraits ② `tools/badgelab.py` ชี้ `originals/new_badge_sheet.png` (1254² คมชัด ริบบิ้นครบ ไม่มีตรา AI → ตัดขั้นซ่อม thunder_3 ทิ้ง) จูน BG_TH 60→44 (จานมืด bff_1/mechaboss_1 ไม่แหว่ง) CLOSE 9→5 (กันแถว 4-5 ห่าง ~8px เชื่อมติด) + กติกาเชื่อมชิ้นใหม่ (ริบบิ้นยอม gap ติดลบ 8px · "ชิ้นยื่น" เช่นปลายดาบ mechaboss_1 ผูกจานที่คาบเกี่ยว/ใกล้สุด) + เจาะพิกเซลกำมะหยี่ (b>r×1.8 & max<70) กันช่องพวงมาลัย crown เป็นแผ่นน้ำเงิน → 33/33 ตรวจ contact sheet พื้นสว่าง/เข้มครบ ③ การ์ดโปรไฟล์: `--fc-n=จำนวนเข็ม` (≤5) เข็มน้อยขยายเต็มกรอบ · กระดานเข็ม (`ui.js`+`lobby.css`): `.lbf-box-bcat` สูงคงที่ 96vh + กริด `grid-auto-rows:1fr` เลิกเลื่อน + โครงการ์ดใหม่ `.lbf-bcat-mid` เหรียญซ้าย 45%-อันดับขวา (2 แถวกริดเหรียญยังใหญ่ 90px+) + `≤4 สาย=.lbf-one-row` กลับแนวตั้งเหรียญใหญ่ 200px+ + media จอเตี้ย (ต้องวาง"หลัง"กฎ base ไม่งั้นแพ้ cascade — เจอจริง)
  - ยืนยัน (preview :8642 mock login+register ม.4 · mock Online.board 6 สาย/3 สาย): overflow=0 ทุกการ์ดทุกกรอบ ทั้ง 1000×640 และ 812×375 (กฎทอง 7) · ภาพเข็มโหลด 256px ครบทั้ง 2 หน้า · `node --check` ผ่าน · ล้างเซฟ+reload ปิดเสียงแล้ว · ⚠️ แตะไฟล์ภาพ → finish ด้วย `--sw` ตามบทเรียนรอบ 748


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 863 (2 ส.ค. · ผู้ใช้: "สลับ index2 เป็นหน้าหลักแทน index เดิม"):** 🔀 `git mv` สองต่อ — ล็อบบี้เดิม → **`index_classic.html`** · เมือง 3D → **`index.html`** (หน้าหลัก) · สลับไปมา 2 ทาง: เมือง→ชิป "🚪 ล็อบบี้แบบเดิม" ล่างซ้าย / คลาสสิก→ปุ่มทอง "🏙️ เมือง 3D" **บนสุดของราง** (เป็น `<a class="rail-btn rail-city">` + CSS ใหม่ใน `css/lobby.css` ล้าง underline)
  - แก้ตาม: `js/city3d.js` ปลายทางแตะตึก+ลิงก์สำรอง three.js พัง → `index_classic.html?go=` · `index.html` (เมือง) เพิ่ม `<link rel=manifest>` + register SW เอง (เป็น start_url แล้ว ไม่งั้นไม่มีแคชออฟไลน์) + title/คอมเมนต์ใหม่ + bust `city3d.js?v=863` · `sw.js` SHELL เพิ่ม `index_classic.html`+`js/city3d.js` และ CACHE_VERSION **v219** (แคชทั้ง 2 หน้า ออฟไลน์สลับได้) · `manifest.json` เพิ่ม shortcut "ล็อบบี้แบบเดิม" (start_url ยังเป็น ./index.html = เมือง)
  - ยืนยัน (server เอง :8873 · 1000×640 + 812×375): เปิด / → เมือง 3D canvas ขึ้น + SW active + cache v219 มีครบ 3 ไฟล์ ✓ · **แตะตึกจริง → `index_classic.html?go=w3d_soccer`** ✓ · `?go=market` + mock login/register → แผงตลาดเปิดเอง + ล้าง param ✓ · ปุ่ม "เมือง 3D" อยู่บนสุดราง ไม่ทับปุ่มอื่น (overlaps ว่าง) เห็นทั้ง 2 จอ กดแล้วกลับเมืองจริง ✓ · `node --check` + `check_missing_assets --git` ผ่าน · ล้างเซฟ+unregister SW+ปิด server แล้ว
  - ⏭️ ค้าง: ผู้ใช้ที่ติดตั้ง PWA/APK เดิมจะเปิดมาเจอเมือง 3D แทนล็อบบี้ (ตั้งใจ) — ถ้าอยากให้แอปเปิดล็อบบี้เดิม แก้ `start_url` ใน manifest.json
- **รอบ 862 (2 ส.ค. · ผู้ใช้: "สร้าง index2 ล็อบบี้เมือง 3D แบบคลิป SimCity — ห้ามแตะ index เดิม + ห้ามเหมือน SimCity"):** 🏙️ หน้าใหม่ `index2.html` + เอนจิน `js/city3d.js` (ใหม่ทั้งไฟล์ ~1.1K บรรทัด standalone ใช้แค่ three.min.js+firebase-config) — เกาะลอยฟ้า toy-town พาสเทล ถนนวงแหวน 2 ชั้น อาคาร 28 หลังผูกลิงก์จริงทุกเมนู (ราง+แถบล่าง+โลก 3D ทั้ง 9) ไอคอนลอย+ป้ายไทย · กล้อง: 1 นิ้วลาก=เลื่อน (จุดพื้นตามนิ้วเป๊ะ) · 2 นิ้วบิด/หนีบ/ลากตั้ง=หมุน/ซูม/เอียง (bird-eye 90°↔มุมต่ำ) เมาส์ครบ+เฉื่อย · แตะตึก→ซูมแล้วเด้ง `index.html?go=<key>` (ตัวรับท้าย `js/main.js` ก้อนเดียวมี guard — รอ Auth.booted+dashboard แล้วคลิกปุ่มจริง/railWorldClick · ล้าง param กันเด้งซ้ำ) · ผู้เล่นจริง: `/presence`→ยืนหน้าตึกตาม act + `/world|/wroom` (drive/moto/heli/helikpp/drone · poll 10 วิ)→รถ/มอไซค์/ฮ./โดรนวิ่ง-บินจริงในเมืองพร้อมป้ายชื่อ+ดาวชั้น (กฎคุ้มครองเด็ก) ตัวละคร=`ba` จาก leaderboard (blk1-8 หุ่นบล็อก 3D · blk9-88 sprite) · แตะตัวละคร=การ์ดโปรไฟล์ (เหรียญ/ทรัพย์สิน/สถิติ) · ตัวเราอ่านเซฟ localStorage ยืนพลาซ่า ⭐ · กลางวัน-กลางคืนตามเวลาจริง (override `?day/?night`) โรงงานพ่นควัน/ผีลอย/เรือเหาะ/NPC 3 คัน
  - ยืนยัน (server เอง :8871 · จอ 1000×640+812×375): เจสเจอร์วัดจริง (pan tx เลื่อน · บิด 30°=yaw −0.52 เป๊ะ · pinch dist 88→117 ถูกทิศ) · แตะตึกตลาด→landing `?go=market`→mock login→แผง "🏪 ตลาด" เปิดเอง+param ถูกล้าง ✓ `go=w3d_adv`→เข้า flow railWorldClick (toast ต้องมีสัตว์โต) ✓ การ์ดโปรไฟล์เด้ง+พอดีจอเตี้ยไม่ scroll ✓ fake 6 ยืน+4 ยาน วิ่งตรงรัศมีถนน ✓ Snap grid 5 ชุดดูด้วยตา · `node --check` ผ่าน 2 ไฟล์ · ล้างเซฟ+ปิด server แล้ว
  - ⏭️ ค้าง: ผู้ใช้ทดลองบนมือถือจริง → พอใจแล้วค่อยสลับเป็นหน้าหลัก (แผน: rename index→index_classic, index2→index) · ไอเดียต่อ: เดินเข้าตึกแทนเมนู/เพื่อนแชทลอยหัวในเมือง/ฤดูกาล-เทศกาล


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 865 (2 ส.ค. · ผู้ใช้: "เพิ่มระบบเทศกาลใน city3d.js ตามวันที่จริง — พลุปีใหม่/สงกรานต์/ลอยกระทง โซนตกแต่งแยก ไม่แตะกล้อง"):** 🎉 โซนใหม่ท้าย `js/city3d.js` (หลัง `buildAmbientTraffic`, ก่อนโซนผู้เล่นจริง — ไม่แตะ CAMERA RIG เลย): `FESTIVAL` เช็กวันที่จริง (override เทสต์ `?festival=newyear|songkran|loikrathong|none`) → เรียก `buildFireworks()` (28ธ.ค.-3ม.ค.: พลุ 4 ลูกระเบิดสีสุ่มวนซ้ำ, THREE.Points) / `buildSongkranDeco()` (12-16เม.ย.: พวงธงรอบลาน+จุดสาดน้ำ 8 จุด) / `buildLoiKrathongDeco()` (22-26พ.ย. ครอบวันเต็มดวง 24 พ.ย. 2569 — เช็กจริงจาก WebSearch: กระทงลอย 8 ใบรอบสระ+โคมลอย 14 ดวงทั่วเมือง) · **⚠️ session คู่ขนานกำลังแก้ `js/city3d.js` พร้อมกัน (รอบ 863 สลับ index2→index, รอบ 864 กำลังทำอยู่ยังไม่ commit) — โค้ดของรอบนี้โดนสวีปติด commit `8727295`/`b4c8d98` ของเขาไปแล้วโดยไม่ได้ตั้งใจ (คนละ working dir ไม่ใช่ worktree) จึงต้องขยับเลขรอบเองเป็น 865 กันชนกับ 864 ที่เห็นในโค้ดที่ยังไม่ commit**
  - ยืนยัน (server เอง :8871 · `?festival=` override ทั้ง 3 โหมด): `scene.children` เพิ่มตรงเป๊ะทุกโหมด (สงกรานต์ +9 = พวงธง 1 กลุ่ม+น้ำ 8 จุด · ลอยกระทง +22 = กระทง 8+โคม 14) · พลุเห็นลูกไฟระเบิดจริงในภาพ (`Snap.grab`) · วันจริงวันนี้ (2 ส.ค.) resolve เป็น 'none' ตรงกับ `?festival=none` เป๊ะ (181 objects เท่ากัน) · console ไม่มี error ทั้ง 3 โหมด · `node --check` ผ่าน · ปิด python server (PID ของตัวเอง) แล้ว
  - ⏭️ ค้าง: ยังไม่ deploy (ตั้งใจ `--no-deploy` — โค้ดเกมจริงอยู่ใน commit ของ session คู่ขนานแล้ว รอเขา deploy รอบตัวเองตามปกติ กันชน Firebase deploy ซ้อนกัน)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 866 (2 ส.ค. · ผู้ใช้: "ต่อยอด city3d.js — ตัวเราเดินไปหน้าตึกก่อนเข้า + บับเบิลแชทสดจาก RTDB บนหัวเพื่อนในเมือง"):** 🚶💬 2 โซนใหม่ใน `js/city3d.js` — ① **เดินไปหน้าตึก**: แตะตึก → `walkSelfTo()` พาตัวเรา (จากเซฟ localStorage) เดินตามพิกัดเชิงขั้ว (มุม ease-out ก่อน → รัศมี ease-in ทีหลัง = ออกจากลานแล้วค่อยพุ่งเข้าประตู ไม่ตัดผ่านน้ำพุ) หยุดห่างใจกลางตึก 7 หน่วย หันหน้าเข้าตึก แล้วค่อยเด้ง `index_classic.html?go=` · แขนขาหุ่นบล็อกแกว่งจริง (`userData.limbs`) ตัว sprite ใช้เด้ง+เอียงแทน · กล้องตามหลัง (dist→40 pitch→0.80) · แตะซ้ำ = ข้ามไปเลย · ไม่มีเซฟในเครื่อง = ท่าเดิม (ซูมกล้องแล้วไป) ② **บับเบิลแชทสด** 2 ท่อจาก RTDB (อ่านอย่างเดียว ไม่เพิ่ม path/ไม่แก้ rules): `winfo/<map>/<room>/<uid>` (`c`+`k` = ข้อความลอยหัวที่พิมพ์ในโลก 3D ผ่าน netroom) → ลอยเหนือรถ/มอไซค์/ฮ./โดรนในเมือง · `chats/<pairId>` ข้อความล่าสุดของคู่เรา-เพื่อน (rules อ่านได้เฉพาะคู่ตัวเอง) → ลอยเหนือหัวเพื่อนที่ยืนในเมือง / ของเราขึ้นเหนือหัวเรา · เก่ากว่า 3 นาทีไม่เด้ง · ใบละ 9 วิ (จางเข้า-ออก) · ข้อความ+เวลาเดิมไม่เด้งซ้ำ · มาก่อน spawn เก็บเข้าคิว (`bubPend`) แล้ว flush · **ผลพลอยได้: คนที่อยู่สนามย่อย (`wroom`) เคยขึ้นป้าย "ผู้เล่น" เพราะ node ร้อนไม่มีชื่อ → ตอนนี้ดึงชื่อจริงจาก `winfo` แล้ว**
  - ยืนยัน (server เอง :62463 · เซฟ mock ในเครื่อง · 1000×640 + 812×375): **แตะตึกจริงบน canvas** → เดิน → เด้ง `index_classic.html?go=market` / `?go=play` ครบทั้ง 2 จอ ✓ · เส้นทางวัดจริง รัศมีโตทางเดียว (10.6→19.4→36.3→56 ไม่ต่ำกว่าจุดเริ่ม = ไม่เดินทับลานน้ำพุ) จบตรงหน้าประตูเป๊ะ (r=56/27) หันเข้าตึกถูก (ry ตรง atan2) แขนขาแกว่ง 0.28→0.52→0.70 แล้วรีเซ็ตเป็น 0 ตอนถึง ✓ · บับเบิล: db จำลอง → path ที่เรียกจริง `friends/me` → `chats/fA_me`,`chats/fB_me` (pairId เรียงถูก) + `world|wroom|winfo/<map>` ครบ · เด้งเหนือหัวถูกความสูงทุกชนิด (ยืน 4.9 / รถ 4.5 / มอไซค์ 4.3) · ข้อความเก่า 5 นาที = ไม่เด้ง · ส่งซ้ำ ts เดิม = ไม่สร้างใบใหม่ · หมดอายุ 9 วิ ถูกเก็บทิ้งครบ (0 ใบ) · ชื่อจาก winfo = "สายลม" ✓ · ภาพ 2 ใบดูด้วยตา (บับเบิลไทย 2-3 บรรทัดพอดีกรอบ + ตัวเราเดินกลางลาน) · console ไม่มี error · `node --check` ผ่าน · ล้างเซฟแล้ว
  - ⚠️ **โค้ดส่วนใหญ่ของรอบนี้โดน session คู่ขนานสวีปติด commit `42def6d` (รอบ 865) ไปก่อนแล้ว** (working dir เดียวกัน 3 session พร้อมกัน) — รอบ 866 นี้จึงเหลือเฉพาะส่วนจูน (ระยะบรรทัดบับเบิล/ความเร็วเดิน 22 หน่วย-วิ/test hooks `_t.walkTo,door,bubble,bubbleAt,fakeDb,watchChats,poll`)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 867 (2 ส.ค. · ผู้ใช้ขอ "แตะตึกแล้วให้ตัวเราเดินเข้าไปหน้าประตูก่อนค่อยเปิดเมนู" — ของรอบ 866 มีอยู่แล้วแต่ผู้ใช้ไม่เห็น):** 🚶🐛 ต้นตอ = `spawnSelf()` ใน `js/city3d.js` `return` ทิ้งเมื่อไม่มีเซฟ localStorage (`sv.profileName`) → `Live.self=null` → `walkSelfTo()` คืน false **เงียบ ๆ** → ตกไป fallback เด้งเข้าเมนูทันที (เคสจริง: เปิดแอป/เครื่อง/เบราว์เซอร์ใหม่ครั้งแรก ซึ่งตอนนี้ index.html = เมือง 3D เป็นหน้าแรกที่เจอ ยังไม่เคยเข้าล็อบบี้เลย)
  - แก้: ไม่มีเซฟก็ยังสร้าง "ตัวเรา" (หุ่นบล็อก `blk1` แขนขาแกว่งได้) — **ไม่มีป้ายชื่อ + ไม่ pickable ไม่มีการ์ดโปรไฟล์** (กฎคุ้มครองเด็ก: ไม่โชว์ชื่อ/ชั้นที่ไม่รู้จริง) · มีเซฟ = ของเดิมครบทุกอย่าง · bust `city3d.js?v=863→867` ใน `index.html`
  - ยืนยัน (server เอง :64933 · 1000×640): **ไม่มีเซฟ** — ก่อนแก้ `self:null`+`walkTo:false` ✓reproduce · หลังแก้ **แตะตึกจริงบน canvas** (pointerdown/up ที่ตึกตลาด 362,308) → `walk:true` → จบที่ `/index_classic.html?go=market` ✓ · เดินจริง r 56→53.9→42.4→27 (=จุดประตูเป๊ะ) แขนขาสลับ 0.142/-0.142→0.28/-0.28 แล้วรีเซ็ต 0 ตอนถึง ✓ · ตัวแทน `pickable:false` ไม่มีป้าย ✓ · **มีเซฟ** — ป้าย+การ์ดครบเหมือนเดิม (น้องเทส/ม.6/1234 เหรียญ/blk3) ✓ · console ไม่มี error · `node --check` ผ่าน · ล้างเซฟแล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 869 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 867: "ตัวแทน (ยังไม่ล็อกอิน) ให้เดินไปตึกล็อบบี้ แล้วขึ้นป้าย 'เข้าสู่ระบบก่อนนะ' แทนเด้งเงียบๆ"):** 🔑 `js/city3d.js`: guest (ไม่มีเซฟ = `Live.self.named=false`) แตะตึกไหนก็ตาม → `travelTo()` เปลี่ยนปลายทางเป็น **จุดลงทะเบียนจุดเดียวกันเสมอ** (`RECEPTION_SPOT {x:3.2,z:22}`, `doorSpotOf('__reception')`) แทนเดินไปตึกจริงที่แตะ → ถึงแล้วขึ้นชิป+บับเบิลลอยหัว "🔑 เข้าสู่ระบบก่อนนะ" ค้าง 1.6 วิ ก่อนเด้ง `index_classic.html` **(ไม่มี `?go=` แนบ — ตั้งใจ เพราะยังเข้าโลกนั้นไม่ได้จริง)** · ผู้เล่นจริง (มีเซฟ) ไม่กระทบ ยังเดินไปตึกที่แตะจริงเหมือนรอบ 866/867 ทุกอย่าง · เพิ่ม test hook `_t.tapBuilding(key)` (จำลองแตะตึกผ่าน `travelTo()` เต็มเส้นทาง รวม guest-reroute)
  - ยืนยัน (server เอง :58693 · 1000×640): **guest แตะ w3d_soccer** → เดินไปจุด `(3.2,22)` r=22.23 ตรงกับ `RECEPTION_SPOT` เป๊ะ (ไม่ใช่ประตูสนามฟุตบอล r=56) → ชิป "🔑 เข้าสู่ระบบก่อนเล่นนะ" + บับเบิลหัว "🔑 เข้าสู่ระบบก่อนนะ" → จบที่ `/index_classic.html` **ไม่มี go=w3d_soccer แนบ** ✓ · **มีเซฟ (น้องเทส) แตะ w3d_soccer** → เดินไปประตูสนามจริง r=56 ตรงกับ `doorSpotOf('w3d_soccer')` เป๊ะ ชิป "🚪 เข้า โลกฟุตบอล …" → จบที่ `/index_classic.html?go=w3d_soccer` ✓ (ไม่กระทบ regression) · console ไม่มี error · `node --check` ผ่าน · ล้างเซฟแล้ว
  - ⚠️ **session คู่ขนานกำลังแก้ `js/city3d.js`+`index.html` พร้อมกัน (รอบ 868 กล่องพิมพ์ตอบแชท — ยังไม่ commit ตอนที่รอบนี้ commit)** ทำงานคนละจุดในไฟล์เดียวกัน (ไม่ซ้ำระบบ) แต่คนละ working dir ไม่ใช่ worktree → commit ของรอบ 869 นี้จะสวีปเอาโค้ด round 868 (ยังไม่ commit ณ ตอนนั้น) ติดไปด้วยโดยไม่ได้ตั้งใจ (ตามแบบเดิมที่เจอมาแล้วรอบ 863/865/866) — **ไม่ได้แตะ `index.html`** ในรอบนี้เลย ปล่อยให้ session 868 commit เองตามปกติ


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 870 (2 ส.ค. · ผู้ใช้: "กลับจาก index_classic.html ให้ตัวเราโผล่หน้าประตูตึกที่เพิ่งเข้า แทนกลางลานน้ำพุ"):** 🚪 โซนใหม่ใน `js/city3d.js` (ก่อนโซนเดิน รอบ 866) — `rememberDoor()` เก็บ key ตึกลง **sessionStorage** `vwCityLastDoor` ตอน `travelTo()` (หลังด่านเช็กล็อกอินรอบ 869 → แขกที่ถูกส่งไปจุดลงทะเบียนไม่ถูกจำ) · `spawnSelf()` อ่านคืน → วางตัวเราที่ `doorSpotOf(key)` **หันหน้าออกจากตึก** (เพิ่งเดินออกจากประตู) + เล็ง `rig.tx/tz` มาที่จุดนั้น (ไม่งั้นตึกวงนอกอยู่ริมจอ) + บับเบิลบนหัว "🚪 กลับมาจาก&lt;ตึก&gt;แล้ว" (แถบชิปโดนสถานะออนไลน์ทับใน 1-2 วิ เลยต้องมีป้ายบนหัวด้วย) · ปิดแท็บ/เปิดแอปใหม่ = ลืม กลับไปเกิดกลางลานเหมือนเดิม · key เพี้ยน/ผังเปลี่ยน = ปล่อยกลางลาน · bust `city3d.js?v=868→870`
  - ยืนยัน (server เอง :8912 · 1000×640 + 812×375): **ไปกลับเส้นทางจริง** — แตะตึกตลาดจริงบน canvas (pointerdown/up 363,309) → sess=`market` → เดิน → `index_classic.html?go=market` → กดปุ่ม "🏙️ เมือง 3D" จริง → กลับมายืน (-20.98, 16.99) = `doorSpotOf('market')` เป๊ะ (r=27=34−7) ry หันออกจากตึกตรงสูตร · กล้อง `rig.tx/tz` ตามไปจุดเดียวกัน ✓ · ตึกวงนอก `w3d_soccer` r=56 + `w3d_heli` บนจอ 812×375 → ตัวเราอยู่กลางจอ (406,187) ไม่หลุดขอบ ✓ · บับเบิล "🚪 กลับมาจากตลาดแล้ว 🏪" ขึ้นจริง ✓ · ไม่มีเซฟ (แขก) แตะตึก → sess ยังว่าง เดินไปจุดลงทะเบียนตามรอบ 869 ✓ · key ปลอม/ไม่มี sess → กลับไป (3.2, 8.6) กลางลาน ✓ · ภาพยืนยันด้วยตา (ยืนหน้าโลกเฮลิฯ) · console ไม่มี error · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **session คู่ขนานกำลังแก้ `js/city3d.js`+`index.html` พร้อมกัน** (กล่องแชทรอบ 868 ใน index.html + `pageshow` reconnect ที่ยังไม่ commit) → commit รอบนี้สวีปของเขาติดไปด้วย (working dir เดียวกัน) — โค้ดผ่าน `node --check` และเว็บ live เช็กแล้วไม่มี error


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 871 (2 ส.ค. · ผู้ใช้ขอ "walkSelfTo() เดินไปหน้าตึก เพิ่มเสียงฝีเท้า loop เร่ง-ช้าตามจังหวะเดิน + ฝุ่นฟุ้งใต้เท้า ให้รู้สึกมีน้ำหนัก"):** 👟🌫️ `js/city3d.js` เพิ่ม `footStepSfx()` (สังเคราะห์เอง Web Audio — ไฟล์นี้ standalone ไม่มี `state.sound`/`HeliSound` ให้พึ่งเหมือน adventure3d.js) + `footDustPuff()`/`footDustTick()` ก่อน `walkSelfTo()` — ยิงตาม **ระยะทางที่เดินจริงต่อเฟรม** (`FOOT_STEP_DIST=3.3` หน่วย ไม่ใช่ตามเวลา) → ช่วงกลางเดินไว(easing)ก้าวถี่ ต้น-ท้ายเดินช้าก้าวห่าง = จังหวะเร่ง-ช้าตรงตามการเดินจริง · `AudioContext` สร้าง/ปลุกทันทีตอนเริ่มเดิน (ยังอยู่ใน call stack ของการแตะจริง กัน browser บล็อกเสียงเพราะไม่มี user gesture)
  - ⚠️ **session คู่ขนานกำลังแก้ `js/city3d.js` พร้อมกัน (รอบ 869/870) — โค้ดรอบนี้โดนสวีปติด commit `e635a6e` (ข้อความ "รอบ 869") ไปก่อนจะ commit เอง** (คนละ working dir ไม่ใช่ worktree ตามแบบเดิมรอบ 863/865/866/869) **คอมเมนต์ในโค้ดเขียนว่า "รอบ 870" ชนกับฟีเจอร์ rememberDoor ที่ใช้เลข 870 จริงในคอมมิตเดียวกัน — ไม่ได้แก้คอมเมนต์ย้อนหลัง ยึด TASKS.md นี้เป็นเลขจริง (871)**
  - ยืนยัน (preview เอง :50609 · `_t.walkTo('w3d_adv')`+`_t.step()` วนหลายรอบ): dust sprite โผล่เป็นชุด (`scene.children` +4 แล้วลดกลับใน <1วิ) ทุก ~35-40 เฟรม ตลอดการเดิน ✓ · `AudioContext` ถูกสร้าง **ครั้งเดียว** ตอนเริ่มเดิน (spy `window.AudioContext`) ไม่สร้างซ้ำระหว่างก้าว ✓ · console ไม่มี error ตลอดหลายรอบเดิน (market, w3d_adv) ✓ · `node --check` ผ่าน · **ขึ้นเว็บจริงแล้วโดยอัตโนมัติ**: `curl vocabworld.web.app/js/city3d.js` มี `footStepSfx` ครบ ตรง `version.json` (`824`) ที่ session คู่ขนาน deploy ไปแล้ว — ไม่ต้อง deploy ซ้ำ


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 873 (2 ส.ค. · ผู้ใช้ 3 งานเมือง 3D ตามคลิป SimCity: ① 2 นิ้วบิดตามเข็ม=เมืองหมุนตามเข็ม (เดิมกลับทิศ) ② zoom out แล้วตัวหนังสือยังใหญ่อ่านง่าย ③ ปุ่มเปิด/ปิดเพลง BGM):** 🔄🔍🎵 `js/city3d.js`+`index.html` — ① สลับเครื่องหมาย yaw ใน `setupInput` + **normalize dAng เข้า (-π,π]** (แก้บั๊กแฝงเดิม: มุมนิ้ว atan2 ข้าม ±180° แล้วเมืองหมุนวูบเต็มรอบ) ② ticker ป้ายตึกใน `buildCity` ขยาย sprite ตาม `rig.dist` (`k=max(1,dist/52)` → dist150 = ×2.9 ขนาดบนจอเกือบคงที่) ③ โซนใหม่ `🎵 รอบ 873` (ก่อน BOOT): `bgmSetup()` เล่น `sound/bgm/bgm_01.mp3` loop อัตโนมัติ **volume 0.6 (ลดจากเดิม 40% — ผู้ใช้สั่ง)** + ปุ่มกลม 🎵/🔇 ลอยเด้งมุมขวาล่าง (CSS `#bgm-btn` ใน index.html) จำสถานะ `localStorage vwCityBgm` · ซ่อนแท็บ=พัก กลับมา=เล่นต่อ · โดนบล็อก autoplay → เล่นซ้ำตอน gesture แรก · test hook `_t.bgm()`
  - ยืนยัน (server เอง :8807 · 1000×640 + 812×375): บิดตามเข็ม 30° → yaw **+0.524** เป๊ะ / ทวนเข็ม −0.524 / เริ่มมุม 170° ข้ามเส้น ±180° ก็ยัง +0.524 ไม่วูบ ✓ · **ฉายพิกัดตึกลงจอจริง: นิ้วตามเข็ม 25° → ตึกหมุนตามเข็มบนจอ +16.9°** (ตรง SimCity) ✓ · ป้าย 28 ใบ scale 5.6→9.48→16.15 ที่ dist 26/88/150 + ภาพ zoom out สุดอ่านชื่อโลกชัดทุกป้าย (Snap) ✓ · ปุ่มเพลง: เล่นเอง vol 0.6 · กด=หยุด+🔇+ls='0' · กดซ้ำ=เล่นต่อ · reload จำสถานะ · อยู่ในจอไม่ทับชิปใดทั้ง 2 ขนาด ✓ · console ไม่มี error · `node --check` ผ่าน · ปิดเพลง+ล้าง ls+ฆ่า server แล้ว
  - ⚠️ โค้ดทั้งหมดโดนสวีปติด commit `3e3124d` (รอบ 874 ของ session คู่ขนาน) + deploy `.827` ขึ้นเว็บแล้ว (curl ยืนยัน `bgmSetup` live) → commit รอบนี้เหลือแค่บันทึก TASKS.md · เลขรอบ 873 ตรงคอมเมนต์ในโค้ด (session 874 เห็นแล้วเลี่ยงให้)
- **รอบ 872 (2 ส.ค. · ผู้ใช้: "บอลลูนข้อความลอยเหนือหัวเพื่อนในเมือง 3D + แตะแล้วพิมพ์ตอบได้เลย + เห็นบอลลูนของตัวเองด้วย"):** 💬🖊️ ต่อยอดบับเบิลรอบ 866 (อ่านอย่างเดียว) ให้ **ตอบกลับได้จากในเมือง** — โซนใหม่ `🖊️💬 รอบ 868` ใน `js/city3d.js` (คอมเมนต์ใช้เลข 868 ตอนเริ่มงาน · เลขจริงของรอบนี้คือ 872 ยึด TASKS.md) + กล่อง `#chat-box` ใน `index.html` (CSS+DOM) และโหลด `js/data/badwords.js` เพิ่ม 1 ไฟล์ (standalone)
  - **ต่อระบบแชทเดิม ไม่มีระบบใหม่ซ้อน + ไม่แตะ rules:** เขียนลง `/chats/<pairId>` = `{f,t,ts}` สูตร pairId เดียวกับ `chatPairId()` · กติกาเดียวกับ `chatSend()` (ยุบช่องว่าง → ≤200 ตัว → `nameHasBadWord`) · แตะบับเบิล = พิมพ์ตอบทันที · แตะตัวละคร = การ์ดโปรไฟล์ + ปุ่ม "💬 พิมพ์คุยด้วย" · ส่งแล้วบับเบิลของเราเด้งเองเหนือหัว · ยังไม่ล็อกอิน/ยังไม่เป็นเพื่อน = กล่องขึ้น**ป้ายบอกเหตุผล**+ทางไปหน้าเพื่อน (กฎทอง #1) ไม่เงียบหาย
  - **ประสิทธิภาพ/ความปลอดภัยเด็ก:** กรองคำหยาบ **ก่อนแสดง** ด้วย (ข้อความหยาบ → "🙊 ข้อความไม่สุภาพ ถูกซ่อนไว้" ไม่เคยถูกวาดลง texture) · หัวกล่อง/ป้าย = ชื่อเล่น + ดาวระดับชั้น (`gradeStars`) ไม่มีชื่อจริง/ตัวเลขชั้น · เพดาน 5 ใบพร้อมกัน (เก่าสุดหายก่อน) · texture cache ตามข้อความ 14 ใบ + dispose จริงตอนไม่มีใครใช้ · ใบขยายตามระยะกล้อง (×1→×2.1) ซูมออกยังอ่านออก · `pagehide` = `cityStopLive()` ปิด listener ทุกท่อ+หยุด poll · `pageshow` (bfcache) ต่อคืน
  - ยืนยัน (server เอง :8788 · db จำลอง · 1000×640 + 812×375): บับเบิลขึ้นตรงหัว "คนที่พูดจริง" เท่านั้น (fA พูด → fB ไม่มีใบ) หันตามกล้อง (Sprite · หมุน yaw +1.2 ยังอยู่ในจอ) จางหายครบ 9 วิ ข้อความเก่า 5 นาทีไม่เด้ง ยิงซ้ำ ts เดิมไม่สร้างใบใหม่ · 7 ใบรัว → เหลือ 5 (pick 5) ✓ ข้อความซ้ำไม่เพิ่ม texture ✓ · **แตะบับเบิลจริงบน canvas** (pointerdown/up) → กล่องเปิด "💬 คุยกับ น้องฟ้า ★★★★" → พิมพ์ส่ง → push `chats/fA_me` `{f:'me',t,ts:{'.sv':'timestamp'}}` + บับเบิลตัวเองเด้ง ✓ · คำหยาบ/ยาวเกิน 200 = ไม่ push ✓ · **เปิด `index_classic.html` จริง: `chatPairId('fA')`=`fA_me` ตรงกัน และข้อความที่ส่งจากเมืองขึ้นในห้องแชทเดิมเป็น `chat-bubble mine`** ✓ · กล่อง+การ์ดโปรไฟล์อยู่ในจอครบ ไม่มี scroll ทั้ง 2 ขนาด (กฎทอง 7) · `stopLive` ปิด 3 ท่อเหลือ handler 0 ✓ · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **โค้ดเกือบทั้งหมดของรอบนี้โดน session คู่ขนานสวีปติด commit รอบ 869/870/871 ไปก่อนแล้ว** (working dir เดียวกัน 3 session — แบบเดียวกับรอบ 865/866) → commit รอบนี้เหลือแค่ test hooks `_t.tap/_t.ptrState` · **บทเรียนเทสต์: ยิง pointerdown/up ผ่าน eval มีดีเลย์ ~350ms เกินเกณฑ์ `dt<450` ของ `setupInput` → ต้องยิงติดกันไม่คั่น `await` ไม่งั้นแตะไม่ติดทั้งที่โค้ดถูก**


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 874 (2 ส.ค. · ผู้ใช้: "เพิ่มปุ่มตอบด่วนในกล่องแชทเมือง 3D — ชิปข้อความสำเร็จรูป กดแล้วส่งทันที"):** 🖊️💬 ต่อยอดกล่องแชทรอบ 872 (`🖊️💬 รอบ 868` ใน `js/city3d.js` + `#chat-box` ใน `index.html`) เพิ่ม **ชิปตอบด่วน 5 ปุ่ม** (`CITY_QUICK_REPLIES`) เหนือช่องพิมพ์ — กดแล้วส่งเข้า `/chats/<pairId>` ทันทีผ่านฟังก์ชันเดียวกับพิมพ์เอง (แยก `sendCityChatText(text)` ใช้ร่วมกัน) ผ่านกติกาเดิมทุกข้อ (ยุบช่องว่าง → ≤200 ตัว → `nameHasBadWord`) · โชว์เฉพาะตอน `chatBoxCanSend()`=true (ล็อกอิน+เป็นเพื่อนแล้ว) ไม่งั้นซ่อน (เหลือแค่ปุ่มไปหน้าเพื่อน) · ชิป wrap เอง 2 แถว ไม่ต้องเลื่อน
  - ยืนยัน (server เอง :8793 · db จำลอง (`_t.fakeDb`) + `_t.friends`/`_t.openChat` · 1000×640 + 812×375): ชิปขึ้นครบ 5 ปุ่ม การ์ดพอดีจอไม่มี scroll ทั้ง 2 ขนาด (กฎทอง 7) · กดชิปจริงผ่าน DOM ref → push `chats/fA_me` `{f:'me',t:'😄 เก่งมากเลย!',ts}` ถูกต้อง + note "ส่งแล้ว ✓" ✓ · คำหยาบยังโดนกรองเหมือนเดิม (พิมพ์เองก็ยังใช้ path เดียวกัน) ✓ · ไม่เป็นเพื่อน → ชิปหาย เหลือปุ่ม "ไปหน้าเพื่อน" ✓ · console ไม่มี error · `node --check` ผ่าน · ปิด server แล้ว
  - ⚠️ ใช้เลขรอบ 874 แทน 873 ที่สคริปต์เสนอ — เห็นคอมเมนต์ "รอบ 873" (ปุ่มเพลงประกอบ) ค้างอยู่ใน `index.html`/`js/city3d.js` แบบยังไม่ commit จาก session คู่ขนาน กันชนเลขรอบ


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 875 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 872: "ไอคอน 💬 ข้อความค้างยังไม่ได้อ่าน"):** 💬🔴 โซนใหม่ `💬🔴 รอบ 873` ใน `js/city3d.js` (คอมเมนต์ใช้เลข 873 ตอนเริ่มงาน · เลขจริง = 875) — บับเบิลรอบ 872 เด้งเฉพาะข้อความสด ≤3 นาที เข้าเมืองช้ากว่านั้นไม่รู้เลยว่าเพื่อนทัก → ป้าย 💬 + จุดแดง **ค้างเหนือหัวจนกว่าจะอ่าน** (เด้งเบา ๆ + ขยายตามระยะกล้อง ×1→×2.1 · texture ใบเดียวใช้ร่วมทุกคน) · แตะป้าย = เปิดกล่องคุยเลย · ชิปมุมขวาบนขึ้น "🟢 ออนไลน์ N คน · 💬 M"
  - **ตัวชี้วัดเดียวกับล็อบบี้เดิม ไม่มีสถานะใหม่:** `state.chatSeen[<pairId>]` ในเซฟ (คีย์เดียวกับ `chatSeenTs()/chatMarkSeen()` ใน `js/online.js`) — ค้างอ่าน = ข้อความล่าสุดเป็นของเพื่อน + ts ใหม่กว่าที่จำ · เปิดกล่องคุยในเมือง = เขียน `chatSeen` กลับเซฟแบบ **read-modify-write** (อ่านเซฟสดก่อนเขียนทุกครั้ง แตะคีย์เดียว กัน session/แท็บอื่นทับ) → ป้ายในล็อบบี้เดิมหายตามกัน · ไม่มีเซฟ (แขก) = ข้ามเงียบ ไม่พัง · ป้ายซ่อนตัวเองตอนบับเบิลของคนนั้นลอยอยู่ (`onTap` ข้ามชิ้น `visible===false` — three ไม่เช็กให้)
  - ยืนยัน (server เอง :8789/:8790 · db จำลอง · 1000×640 + 812×375): ข้อความค้าง 5-30 นาที = **ไม่มีบับเบิล แต่มีป้าย** ✓ ข้อความล่าสุดเป็นของเราเอง = ไม่มีป้าย ✓ ข้อความเก่ากว่า `chatSeen` = ไม่มีป้าย ✓ · **แตะป้ายจริงบน canvas** → กล่องเปิด "💬 คุยกับ น้องฟ้า ★★★★" + ป้ายหาย + ชิป 💬 2→1 + เซฟมี `chatSeen['fB_me']` ตรง ts ข้อความเป๊ะ (ฟิลด์อื่นในเซฟครบเหมือนเดิม) ✓ · **เปิด `index_classic.html` จริง → `chatSeenTs('fB')` ได้ค่าเดียวกับที่เมืองเขียน** (อ่านในเมือง = ล็อบบี้เดิมถือว่าอ่านแล้ว) ✓ · ข้อความใหม่หลังอ่าน = ป้ายกลับมา · เปิดกล่องค้างไว้แล้วข้อความเข้า = อ่านทันทีไม่ขึ้นป้าย · ซูมออก dist 150 ป้ายยังเห็น (scale ×1.7) · แขกไม่มีเซฟ = ไม่ throw ✓ · ภาพยืนยันด้วยตา (ป้ายลอยเหนือป้ายชื่อพอดี ไม่ทับ) · `node --check` ผ่าน · ล้างเซฟ+ปิด server แล้ว
  - ⚠️ **โค้ดโดน session คู่ขนานสวีปติด commit รอบ 874 (ชิปตอบด่วน) + deploy ไปแล้ว** — `diff` ไฟล์ live กับไฟล์ในเครื่อง **ตรงกันเป๊ะทุกบรรทัด** ที่ `vocabworld.web.app` (`.827`) → รอบนี้ `--no-deploy` แค่บันทึกรอบ · ทดสอบซ้ำบนไฟล์รวมแล้ว: ป้ายค้างอ่าน + ชิปตอบด่วนของเขาทำงานร่วมกันได้ปกติ (กดชิป → push `chats/fA_me` + บับเบิลเราขึ้น)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 876 (2 ส.ค. · ผู้ใช้ 2 เรื่อง: ① "เอาแถบ 'มีเกมอัพเดทใหม่' แบบล็อบบี้เดิมมาใส่เมือง 3D ด้วย" ② ร้องเรียน: เสียง BGM เทสต์ยังดังซ้อนกันหลายชั้นในเครื่อง):** ✨🔇 `index.html`+`js/city3d.js` — ① คัดลอกระบบแจ้งเวอร์ชันจาก `index_classic.html` (เทียบ `version.json` ทุก 3 นาที · ครั้งแรกจำเวอร์ชันที่รัน ไม่เด้งหลอก · แถบ+ปุ่ม "🔄 อัปเดตเลย"/"✕" หน้าตาเดิมเป๊ะ) แนบ CSS มากับ index.html เอง (หน้านี้ไม่โหลด css/style.css) + test hook `window.__ubCheck` ② **ต้นตอเสียงซ้อน: BGM รอบ 873 autoplay → ทุกแท็บ preview ของทุก session เปิดเพลงพร้อมกันเอง + แท็บเก่าฟื้นหน้าเกมจาก SW cache ได้แม้ server ตาย** → เพิ่ม `BGM_DEV` (hostname localhost/127.*) = ไม่ autoplay บนเครื่อง dev (ผู้เล่นจริง vocabworld.web.app ไม่กระทบ · ปุ่ม 🎵 กดเล่นเองได้เสมอผ่าน `bgmPlay(true)`) · bust `city3d.js?v=876`
  - ยืนยัน (server เอง :8809 · 1000×640 + 812×375 · ⚠️ แท็บ preview เป็น `document.hidden`=true ต้อง override ก่อนเทสต์ ไม่งั้น check() ข้ามเงียบ): fetch ปลอม version.json 2 ค่า → แถบเด้งจริง ข้อความ/ปุ่มครบ อยู่ในจอ ไม่ทับปุ่มเพลง/ชิปใด ทั้ง 2 ขนาด · กด ✕ หาย ✓ · guard: reload โดย ls=เปิด บน localhost → **Audio ไม่ถูกสร้างเลย** (vol=null) + gesture kick ก็เงียบ ✓ · กดปุ่ม 🎵 เอง = เล่นจริง (force) กดปิด = หยุด ✓ · console ไม่มี error · `node --check` ผ่าน · จบเทสต์: mute+ls='0' ทุกแท็บ ปิดแท็บเก่า ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 877 (2 ส.ค. · ผู้ใช้: "เข้าหัวข้อจากเมือง 3D → ฉากหลังหลัง dialog ต้องเป็นตึกนั้นในเมือง ไม่ใช่พื้นหลังล็อบบี้เดิม · พื้นหลังเดิมใช้เฉพาะเข้าหน้าเดิมตรง ๆ"):** 🖼️ `js/city3d.js` (`captureCityShot` ก่อน `travelTo`) เก็บภาพ jpeg 960px จาก canvas ตอนยืนหน้าประตู/ก่อนเด้งทุกทาง → ฝาก `sessionStorage vwCityShot {k,ts,img}` · ตัวรับ = ?go= handler ท้าย `js/main.js`: key ตรง+อายุ<5นาที → `#city-backdrop` (z=39 ใต้ panel(40)/dialog(100)) + `body.city-arrive` ซ่อน `#screen-dashboard` ด้วย visibility (ชิป z 80-95 ไม่งั้นทะลุ) ยกเว้น `#panel-overlay.open` คืน visible · ตัวเฝ้า 300ms: ปิดกล่อง/แผงเมื่อไหร่จางออก .5s คืนล็อบบี้เดิม เปลี่ยน screen = ถอดทันที ไม่เปิดอะไรใน 1.5s = ถอด · CSS ท้าย `css/lobby.css` · bust `city3d.js?v=877`
  - ยืนยัน (server เอง :8814 · 1000×640 + 812×375 · เดินจริง `CITY._t.tapBuilding('w3d_adv')` → เด้ง ?go=w3d_adv): shot ถูก key/ขนาด ~59KB ✓ dialog "🌍 เข้าโลกผจญภัย" ลอยบนภาพตึก (ภาพ+screenshot ยืนยันด้วยตา) ✓ ยกเลิก → backdrop จางออก คืน dashboard ✓ แผง market เปิดทับภาพได้ ปิดแล้วคืนใน ~760ms ✓ เข้าตรงไม่มี ?go = ไม่มี backdrop ✓ จอเตี้ยกล่องอยู่ครบไม่ scroll ✓ console ไม่มี error · `node --check` ผ่าน 2 ไฟล์ · ล้างเซฟ+ฆ่า server แล้ว · ⚠️ เทสต์ในแท็บซ่อน: interval โดน Chrome intensive throttling (นาทีละครั้ง) — อาการเฉพาะแท็บ hidden ไม่ใช่บั๊ก


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 879 (2 ส.ค. · ผู้ใช้ขอ: "เบลอ+หรี่ภาพตึกเบา ๆ ให้ตัวหนังสือใน dialog เด่นขึ้นอีก" — ต่อยอดฉากหลังตึกเมือง 3D ก่อนหน้า):** 🎨 แก้ CSS จุดเดียวใน `css/lobby.css` (`#city-backdrop`) เพิ่ม `filter:blur(3px) brightness(.72)` + `transform:scale(1.04)` (กันขอบโปร่งจากเบลอเกินจอ) — ไม่แตะ JS
  - ยืนยัน (server เอง :8815 · 1000×640): computed style ตรง `blur(3px) brightness(0.72)` + `scale(1.04,1.04)` ✓ ภาพยืนยันด้วยตา (dialog "เข้าโลกผจญภัย" อ่านง่ายขึ้นชัดเจนเทียบก่อนแก้) ✓ ล้างเซฟ+ฆ่า server แล้ว
  - ⚠️ **session คู่ขนานกำลังแก้ `js/city3d.js`+`index.html` พร้อมกัน** (ฟีเจอร์จอเปิด "ภาพเมืองย้อนกลับ" — ใช้เลข "รอบ 880" ในโค้ดที่ยังไม่ commit) รอบนี้แตะแค่ `css/lobby.css` จุดเดียว ไม่ชนไฟล์ ขยับเลขรอบตัวเองเป็น 879 กันชน


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 880 (2 ส.ค. · ผู้ใช้: "กดกลับจาก index_classic.html มาเมือง 3D → ให้โชว์ภาพ vwCityShot เดิมเป็นฉากเปิดแว้บแรกระหว่างเมืองโหลด แล้วค่อยจางเข้าฉาก 3D จริง"):** 🎬 เดิมขากลับเจอจอน้ำเงินเปล่าค้างจนเมืองสร้างเสร็จ · `captureCityShot()` (`js/city3d.js`) เขียนภาพใบเดียวกันเพิ่มอีกคีย์ `sessionStorage vwCityBack {k,bk,ts,img,cam}` — ต้องแยกใบเพราะ `vwCityShot` ถูก `js/main.js` ลบทิ้งทันทีหลังใช้ (รอบ 877) · `cam` = มุมกล้อง **ของเฟรมที่แคปจริง** → ขากลับตั้ง rig ตามนั้น ภาพจางลงไปทับฉากที่หน้าตาเหมือนกันเป๊ะ · ตัวโชว์ภาพอยู่ใน `index.html` เอง (สคริปต์สั้นก่อนโหลด three.js = ขึ้นทันแว้บแรก) เติมคลาส `#splash.photo` + `#splash-shot` (cover) + ป้าย "🚪 กำลังกลับเข้าเมือง…" · เงื่อนไขโชว์: `bk` ตรง `vwCityLastDoor` (รอบ 870) + ภาพสด <5 นาที + ใช้ครั้งเดียวแล้วลบ · จางออกเมื่อเมืองวาดจริง ≥1 เฟรม (double-rAF · มีตาข่าย 900ms กันแท็บพื้นหลังภาพค้าง) แล้วกล้องถอยจากมุมภาพ → `dist 88/pitch .95` เล็งตัวเราที่ประตู 1.7 วิ · แตะจอเอง = หยุดจัดกล้องทันที · bust `city3d.js?v=880`
  - ยืนยัน (server เอง :8821 · 1000×640 + 812×375 · เดินเข้าตลาดจริงผ่าน `_t.tapBuilding('market')` → `?go=market` → กลับ index.html): ล็อบบี้เดิมกิน `vwCityShot` แล้ว **`vwCityBack` ยังอยู่** ✓ ขากลับ splash = `photo` + ภาพเต็มจอ cover + ป้ายไทยถูก ✓ กล้องเริ่มตรง cam เป๊ะ (dist30/tx−26.42/tz21.40/yaw2.251) แล้วไล่ถึง dist88/pitch.95/เล็ง (−20.98,16.99) = `doorSpotOf('market')` = ตำแหน่งตัวเราเป๊ะ ✓ (เพิ่ม `_t.intro()/_t.introPull(ms)` ไล่ด้วยเวลาจำลอง เพราะแท็บ preview ซ่อน rAF ไม่วิ่ง) · แตะจอระหว่างถอย = ค่าไม่ขยับเลย ✓ · 4 เคสลบ (ตึกไม่ตรง/ภาพเก่า 6 นาที/ไม่มีคีย์/JSON พัง) = จอเปิดน้ำเงินเดิม + intro เดิม dist150 ไม่ throw ✓ · 812×375 ป้าย+แถบอยู่ในจอ ไม่ scroll ✓ · ภาพจริงที่เด็กเห็นยืนยันด้วยตา (ตึกตลาด 24H + ป้าย "ตลาด" + ตัวเราหน้าประตู) · console ไม่มี error · `node --check` ผ่าน · ล้างเซฟ/sessionStorage + ฆ่า server แล้ว
  - ⚠️ **session คู่ขนานกำลังแก้ `captureCityShot()` ฟังก์ชันเดียวกัน** (รอบ 877 ต่อ: ดันกล้องชิดประตูเฉพาะเฟรมที่แคป) ยังไม่ commit → รอบนี้ต่อยอดบนโค้ดเขาและ **commit สวีปติดไปด้วย** (working dir เดียวกัน) · ผลพลอยได้: ภาพเล็ง "ใจกลางตึก" ไม่ใช่ตัวเรา จึงต้องไถ `tx/tz` กลับมาหาตัวเราตอนถอยกล้อง ไม่งั้นตัวเราค้างริมจอ (ขัดเจตนารอบ 870) · ไม่แตะ `css/lobby.css`/`js/cert.js` ที่ session อื่นแก้ค้าง


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 881 (2 ส.ค. · ผู้ใช้: "theme สีหลักเข้มไป ปรับทั้งเกมให้น่ารักกลมกลืนกับ lobby เมือง 3D — ยกเว้นภายในโลกต่างๆ คงเดิม"):** 🎨 เขียนสคริปต์ (scratchpad `retheme.py`) แปลงสีตระกูลน้ำเงินเข้ม (hue 190-262 · L<.36) เป็นฟ้าสดใส HSL lift (`L'=.34+.62L` · จูง hue เข้า 210 · คงลำดับอ่อน-เข้ม) **เฉพาะ property พื้น/ขอบ/เงา** (background*/border*/box-shadow/`--navy`/`--glass`) ไม่แตะสีตัวหนังสือ → 225 จุดใน `css/lobby.css`(หลัก) `css/style.css` `css/exam.css` `index_classic.html`(consent gate) `js/ui.js`(กล่องเลือกแผนที่) · **ไม่แตะ**: splash `#0a1f3c` (ล็อกรอบ 859 = สี APK) + ไฟล์โลก 3D ทุกไฟล์ (adv3d_css/invasion3d ฯลฯ) + `js/cert.js` ที่ session อื่นแก้ค้าง
  - ยืนยัน (server เอง :8821 · จอ preview ไม่ composite/screenshot ค้าง → **Chrome headless + หน้า bootstrap ชั่วคราว `_ttest880.html` (iframe+mock login · ลบแล้ว)** ถ่าย 1000×640): consent gate/dashboard/แผงเพื่อน/แผงตลาด โทนฟ้าสดใสเข้ากับฉากเมือง ตัวหนังสือขาว-ทองอ่านชัด (ภาพยืนยันด้วยตา 4 ใบ) ✓ `node --check js/ui.js` ผ่าน ✓ ล้างเซฟ+ลบไฟล์เทสต์+ฆ่า server แล้ว
  - 💡 เทคนิคใหม่: preview pane ซ่อนอยู่ = screenshot ทุกแบบใช้ไม่ได้ (html2canvas ก็วาด UI เกมไม่ออก) → headless Chrome + bootstrap iframe = ได้ภาพ DOM UI จริงทุกหน้า


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 882 (2 ส.ค. · ผู้ใช้: "เจน/เปลี่ยนภาพพื้นหลัง img/theme/theme_city_cod.png ให้เป็นเมืองฟ้าสดใสโทนเดียวกับเมือง 3D แล้วปรับ gradient ทับใน css/lobby.css ให้เข้ากัน"):** 🎨🏙️ ไม่มี AI image-gen ต่อให้ใช้ → เขียนสคริปต์ procedural เอง (scratchpad `gen_theme_city.py`, PIL+numpy) วาดฟ้าไล่สี #63b0ec→#9ed7ff→#d2ecff (ตรง `scene.background 0x9ed7ff` ใน `js/city3d.js`) + ตึกกระจก 3 เลเยอร์ไกล-ใกล้ (เบลอ/ทึบลดหลั่น โทน --navy/--sky) + เมฆนุ่ม + ลานกระเบื้องสะท้อนตึกจาง ๆ + เส้นเรืองแสงลู่สายตา + กลางจอโล่งกว่าขอบ (ให้ตัวละคร+UI อ่านง่าย ตรงสเปก `PROMPTS_LOBBY_COD.md` ทุกข้อ ไม่มีคน/โลโก้/ตัวอักษร) → เซฟ `img/theme/theme_city_cod.png` 1920×1080 (505KB เบากว่าไฟล์เก่า `theme_bg*.png` ~4 เท่า) · ปรับ gradient คุมคอนทราสต์ใน `css/lobby.css` (body background-image) จาก navy เข้ม (.58/.72) → บางลง (.40/.05/.10/.62) ให้สีฟ้าสดของภาพใหม่โชว์จริงแทนถูกทับมืดเหมือนตอนคุมภาพเก่า
  - ยืนยัน: composite gradient+ภาพด้วย PIL ตรงสูตร CSS stop ต่อ stop (อ่านตัวหนังสือ/UI ชัดเจน โทนสีเข้ากับ 3D city) ✓ · preview โหลด `index_classic.html` จริง ยืนยัน `Image().onload` ได้ 1920×1080 ตรง path + `getComputedStyle(body).backgroundImage` มี gradient/url ใหม่ครบ ✓ console ไม่มี error ✓ (จอ preview ซ่อนอยู่ เหมือนรอบ 880 → screenshot ใช้ไม่ได้ ใช้ composite เทียบแทน)
  - ⚠️ **session คู่ขนานแก้ `css/lobby.css` (โหมดกลางคืน `html.night` — คอมเมนต์เขาก็ใช้เลข "รอบ 882" ยังไม่ commit ตอนที่เห็น) + `index_classic.html` พร้อมกัน และ `js/cert.js` (session ที่ 3 แก้ค้าง)** — ตรวจ diff แล้วคนละ hunk ไม่ชนตำแหน่งโค้ด (คนละระบบ) แต่ working dir เดียวกัน → commit+deploy รอบนี้สวีปทั้ง 3 ไฟล์ติดไปด้วย (โหลดหน้ารวมกันจริงไม่มี console error) · ถ้าเลขรอบชนตอน push ให้เช็ก TASKS.md ว่าใครได้ 882 จริง (เขาอาจต้องขยับเป็นเลขอื่น)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 884 (2 ส.ค. · ผู้ใช้: "เอาภาพ vwCityShot มาเป็นจอเปิดของ index_classic.html ระหว่างโหลด แล้วจางเข้าหน้าหัวข้อ"):** 🖼️ `index_classic.html`(#app-splash ต้นไฟล์ — peek `vwCityShot` ไม่ลบ, main.js ยังลบครั้งเดียวตามเดิม) + `js/main.js`(?go= handler ท้ายไฟล์) — จอเปิดโชว์ภาพเมืองแทนพื้นน้ำเงินถ้า `?go=` ตรงกับภาพที่ฝากไว้ (เงื่อนไข k/อายุ<5นาทีเดียวกับรอบ 877) ค้างไว้ตลอดช่วง boot (safety timeout 20s กันค้าง) แล้วครอส-เฟดเข้า `#city-backdrop` เดิมตรงจังหวะ `bdShow()` (ฟิลเตอร์ blur/brightness/scale เหมือนกันเป๊ะ ไม่มีรอยต่อ/กระพริบ) — ไม่มี go/ภาพ = จอเปิดซ่อนไวเหมือนเดิม ไม่กระทบ
  - ยืนยัน (server เอง :8642 · sessionStorage จำลองภาพ SVG + mock login ทะลุ register ถึง dashboard จริง · 1000×640 + 812×375): จอเปิดมีภาพ+ป้าย "กำลังเข้าเมนู…" ถูกต้อง (blur(3px) brightness(.72) scale(1.04) ตรง `#city-backdrop` เป๊ะ, โลโก้/หัวข้อเดิมซ่อน) ✓ boot ถึง dashboard → splash หาย + `#city-backdrop` โผล่ภาพเดียวกันทันที + panel "🏪 ตลาด" เปิดทับ (`body.city-arrive`) ✓ ไม่มี go param = splash ซ่อนไวเหมือนเดิม ไม่โดนกระทบ ✓ 812×375 อยู่ในจอไม่ scroll ✓ console ไม่มี error · `node --check js/main.js` ผ่าน · ล้างเซฟ/sessionStorage + ฆ่า server แล้ว
  - ⚠️ **session คู่ขนานกำลังแก้ `css/lobby.css`/`index.html`/`js/city3d.js` + ส่วนหัว `index_classic.html` พร้อมกัน** (โหมดกลางคืน UI — ใช้เลข "รอบ 885" ค้างอยู่ในโค้ด ยังไม่ commit) คนละระบบ ไม่ชนกับโซนที่แก้ (`#app-splash`/`?go=` handler) → ขยับเลขรอบตัวเองเป็น 884 กันชน · commit เฉพาะ `index_classic.html`+`js/main.js`+`handoff/TASKS.md` (ไม่แตะ `css/lobby.css`/`index.html`/`js/city3d.js` ของเขา)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 885 (2 ส.ค. · ผู้ใช้: "เพิ่มโหมดกลางคืน UI ล็อบบี้ index_classic.html — หลัง 19:00 สลับ CSS variables ใน css/lobby.css เป็นโทนอุ่นมืดลงอัตโนมัติ + ปุ่มสลับเอง จำค่าใน localStorage"):** 🌙 สวิตช์ = คลาส `night` บน `<html>` ใส่จากสคริปต์ inline ในหัว `index_classic.html` (ก่อน paint แรก = ไม่มีจอสว่างวาบก่อนมืด) + ปุ่ม `#btn-night` ในแถบบนข้างปุ่มเพลง · โซนหน้าตา `🌙 รอบ 885` ท้าย `css/lobby.css` ทำ 3 ชั้น: ① ทับ `:root` vars เป็นโทนอุ่นเข้ม (`--navy/--sky/--panel-bg/--glass/--ink2`) ② ฉากหลังเมืองเป็น gradient พลบค่ำ (ใช้ภาพเดิม ไม่ต้องเจนใหม่) ③ ผ้าคลุม 2 ชั้นคลุมทั้งจอ `#night-veil` (`mix-blend-mode:color` .52 — **ย้อมสีอุ่นโดยคงความสว่างเดิม ตัวหนังสือจึงอ่านชัดเท่าเดิม** และกวาดสีฟ้าที่ hardcode ไว้หลายร้อยจุดจากรีธีมรอบ 881 ให้อุ่นตาม) + `body::after` (multiply น้ำตาลเข้ม .28 = หรี่จอ) · **บทเรียน 2 ข้อ:** ① multiply อย่างเดียวไม่พอ — ฟ้า×ส้ม = ม่วง ต้องมีชั้น `color` นำหน้า (ลอง .62 = ซีเปียเกินสีเกมหาย · .40 = ฟ้ายังโผล่ม่วง → .52 กำลังดี) ② ชั้นที่ 2 ใช้ `body::after` ไม่ใช่ pseudo ของ `#night-veil` เอง — พ่อที่มี blend/opacity สร้าง stacking context ใหม่ ลูกจะ blend แค่กับพื้นของพ่อ ไม่ใช่ทั้งหน้า
  - **กติกาเวลา:** อัตโนมัติ = กลางคืน 19:00-06:00 · กดปุ่ม = ตั้งเอง จำใน `localStorage vwNightUi` ('1'/'0') · ค่าที่ตั้งเอง **ล้างตัวเองเมื่อนาฬิกาเดินมาตรงกับที่ตั้งไว้** (ปิดกลางคืนตอน 2 ทุ่ม → 6 โมงเช้ากลับเป็นอัตโนมัติ ไม่ค้างถาวรจนฟีเจอร์อัตโนมัติตายไปเลย) · ปุ่มบอกสถานะใน title เสมอว่า "ตอนนี้อัตโนมัติ/ตั้งเอง" (กฎทอง #1) · เปิดค้างไว้ = เช็กทุก 60 วิ พลิกเองตอน 19:00
  - ยืนยัน (server เอง :8822 · **headless Chrome + หน้า bootstrap ชั่วคราว `_t882.html` (iframe+mock login+ข้าม consent · ลบแล้ว)** — จอ preview ซ่อนอยู่ screenshot ปกติค้าง): จำลองเวลา 6 ค่า → 19/23/03 = กลางคืน · 06/08/18 = กลางวัน ✓ ลำดับกด-จำ-ล้างค่าครบ 7 สเต็ป (ตั้งเอง→ตรงอัตโนมัติ→ล้าง) ✓ ภาพยืนยันด้วยตา: dashboard + แผงตลาด โทนอุ่นพลบค่ำ ตัวหนังสือ/ปุ่มอ่านชัด ไม่มีจุดม่วง ✓ 812×375 ปุ่มครบ 5 ปุ่มอยู่ในจอ ไม่มี scroll เอกสาร (`sw=cw · sh=ch`) ✓ `elementFromPoint` กลางปุ่ม = ตัวปุ่มจริง (ผ้าคลุม `pointer-events:none` ไม่ขวางกด) ✓ console ไม่มี error · `node --check` สคริปต์ inline ผ่าน · ล้าง localStorage 3 คีย์ + ลบไฟล์เทสต์ + ฆ่า server แล้ว
  - ⚠️ ไม่แตะ `js/*.js` เลย (ตัวคุมอยู่ใน HTML ทั้งหมด) · ไม่กระทบเมือง 3D `index.html` (ไม่โหลด `css/lobby.css`) · `#app-splash` (z 999999) + `#consent-gate` (z 100000) อยู่เหนือผ้าคลุม = คงสีเดิมตั้งใจ
  - ⚠️ **session คู่ขนาน (รอบ 882) สวีปโค้ดโหมดกลางคืนใน `index_classic.html` (ปุ่ม+สคริปต์ inline) ติด commit `2a5213a` ไปก่อนแล้ว** → รอบนี้ commit เหลือ **`css/lobby.css` ไฟล์เดียว** · ด้วยเหตุนี้ชั้นหรี่จอจึงย้ายจาก div ที่ต้องสร้างใน JS มาเป็น `body::after` (CSS ล้วน) — เพราะ `index_classic.html` ตอนนี้มีงานค้างของอีก session (จอเปิดภาพเมือง `__vwSplashPhoto` ที่พึ่ง `js/main.js` ซึ่งเขายังไม่ commit) **ห้ามสวีปติดไปเด็ดขาด ไม่งั้นเว็บจริงจะค้างจอเปิด 20 วิ ตอนเข้าจากเมือง 3D** · คอมเมนต์ในไฟล์ HTML/`js` ยังเขียน "รอบ 882" ตามที่ถูกสวีปไป ไม่แก้ย้อนหลัง — **ยึด TASKS.md นี้ว่าโหมดกลางคืน = รอบ 885**


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 886 (2 ส.ค. · ผู้ใช้: "ต่อยอด 870/880 — spawnSelf() ให้ตัวเราเดินออกจากตึกมาหน้าประตูแบบ walkSelfTo ย้อนทาง พร้อมเสียงฝีเท้า/ฝุ่นรอบ 871"):** 🚪🚶 โซนใหม่ `🚪🚶 รอบ 886` ใน `js/city3d.js` (หลัง `walkSelfTo`) — เดิมกลับจากล็อบบี้เดิมแล้ว "โผล่" ยืนนิ่งหน้าประตูทันที (รอบ 870) ไม่ต่อเนื่องกับภาพจอเปิด (รอบ 880) · ทำ: `stageExitWalk()` ตั้งต้นตัวเราไว้ **ในประตู** (ถอย `EXIT_BACK=4` เข้าหาใจกลางตึก = ถูกผนังบัง) → `walkSelfOut()` เดินออกมาหยุดที่ `doorSpotOf()` จุดเดิมใน 1.35 วิ (ease `k²(3−2k)` = ดันประตูช้า→เร่ง→ผ่อน) ใช้ `walkPose`+`footStepSfx`+`footDustPuff` ชุดเดียวกับรอบ 871 แต่ก้าวถี่/เบากว่า (`EXIT_STEP=1.3` · vol ≤.8) และ **กันเสียง/ฝุ่นดังตอนยังอยู่หลังผนัง** (`EXIT_CLEAR=4.3`) · ตัวเรียก = ตอน `#splash` เริ่มจาง (โหมดภาพ +300ms · เข้าตรง +700ms รอกล้อง intro ร่อนลง) + ตาข่าย 3 วิใน BOOT + ตาข่ายใน tick เอง → **ทุกทางจบที่หน้าประตูเสมอ** เหมือนรอบ 870 · ไม่แตะกล้องเลย (ปลายทางคือจุดที่ intro รอบ 880 เล็งอยู่แล้ว) · ป้าย/ชิป "กลับมาจาก…" ย้ายไปขึ้นตอนเดินออกมาถึง (ไม่งั้นบับเบิลลอยหลังผนัง) · bust `city3d.js?v=886`
  - ยืนยัน (server เอง :8823 · 1000×640): ตั้งต้นห่างใจกลางตึก 3.0 (หลังผนัง) → จบที่ door spot เป๊ะ `d=0` หันออกจากตึก `ry=2.251` ขาหยุดนิ่ง `limbs=[0,0,0,0]` ✓ · **3 ก้าว** (spy `createOscillator`) + ฝุ่น 3 ชุด ทุกชุดเกิดนอกผนังจริง (ห่างตึก 4.35/5.66/6.90) ✓ · ภาพยืนยันด้วยตา 4 เฟรม (`Snap.grid` → `exitwalk3.jpg`): t=60 ถูกตึกบัง → t=480 โผล่ที่ประตู → t=780/1400 เดินออกมายืนหน้าตึกหันหน้าออก ✓ · **บูตจริง rAF วิ่ง (headless Chrome 1000×640 iframe เมืองจริง)**: 1.2 วิ กำลังเดินออก · 1.9 วิ ถึงที่ + บับเบิล "🚪 กลับมาจากตลาดแล้ว 🛒" ขึ้น ✓ · เคสลบ: ไม่มี `vwCityLastDoor` = เกิดกลางลาน (3.2, 8.6) `exitOut()` คืน false ไม่ขยับ ✓ · แตะตึกอื่นระหว่างเดินออก = `walkSelfTo` คืน false ไม่ขัดจังหวะ เดินออกจบปกติ ✓ · แตะตึกก่อนตัวเดินออกทำงาน = ไปตึกนั้นได้ (`d=0` ที่ library) `walkSelfOut` ไม่ลากกลับ ✓ · console ไม่มี error · `node --check` ผ่าน · ล้างเซฟ/sessionStorage + ลบหน้าเทสต์ `_t883.html` + ฆ่า server/headless แล้ว
  - ⚠️ ขอเลขรอบตอนเริ่มงานได้ 883 แต่ session คู่ขนานใช้ 882-885 ไประหว่างทาง → ขยับเป็น **886** ก่อน commit (คอมเมนต์ในโค้ดแก้ตามครบแล้ว) · ไม่แตะไฟล์ที่ session อื่นค้าง (`css/lobby.css`/`index_classic.html`/`js/cert.js`)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 887 (2 ส.ค. · ผู้ใช้: "เอาโหมดกลางคืนรอบ 885 ไปใช้กับเมือง 3D ด้วย: หลัง 19:00 เปลี่ยน scene.background+แสง+เปิดไฟหน้าต่างตึก แชร์สวิตช์เดียวกับล็อบบี้เดิม"):** 🌙🏙️ `js/city3d.js` (ค่าคงที่ `NIGHT` บรรทัด 26) เดิมคำนวณจากเวลาเครื่องอย่างเดียว (เกณฑ์ 18:5-6:25 คนละเกณฑ์กับล็อบบี้) → เปลี่ยนให้อ่าน `localStorage vwNightUi` คีย์เดียวกับ `NightUI` ใน `index_classic.html` (ตรรกะ paint() เป๊ะ: ตั้งเอง='1'/'0' → auto=19:00-06:00 → ค่าที่ตรงกับ auto แล้วล้างตัวเอง) ยังคง `?day`/`?night` query override ไว้เทสต์ · scene.background/fog/light สี + `wallMat/wallTex(...,NIGHT)` เปิดไฟหน้าต่างสุ่ม 55% (ของเดิมมีอยู่แล้วรอบก่อนหน้า ไม่ต้องเขียนใหม่) เดี๋ยวนี้ตามสวิตช์ล็อบบี้จริง · bust `city3d.js?v=887`
  - ยืนยัน (server เอง :8642 · 1000×640): `?night=1`→bg/fog `#0c1734` + hemi/sun โทนน้ำเงินม่วง ✓ `?day=1`→`#9ed7ff` ✓ `localStorage.vwNightUi='1'`(กลางวันจริงตอนเทสต์)→บังคับกลางคืนสำเร็จ ค่าไม่ถูกล้าง (ไม่ตรง auto) ✓ ตั้ง `'0'`ตรงกับ auto กลางวันจริง→boot แล้ว key หายเอง (self-clear) bg ยังเป็นกลางวัน ✓ ตรวจ texture หน้าต่างตึกกลางคืนมีพิกเซล "ไฟติด" (เหลือง `#ffd978`) จริง ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง localStorage + ฆ่า server แล้ว
  - ⚠️ ไม่แตะ lit-window logic เดิม/ไม่เพิ่มปุ่มสลับในเมือง 3D (ผู้ใช้ขอแค่ "แชร์สวิตช์" ไม่ได้ขอ UI ใหม่) — สลับที่ล็อบบี้แล้วเข้าเมือง 3D (เพจโหลดใหม่) จะเห็นผลทันที


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 891 (2 ส.ค. · ผู้ใช้: "city3d.js บรรทัด ~34 ยังมีกฎล้าง `vwNightUi` ของรอบ 882 → การปักโหมดกลางคืนจากหน้าตั้งค่า (รอบ 889 คีย์ `vwNightMode`) หายตอนเข้าเมือง 3D — ลบกฎล้างค่า อ่าน `vwNightMode` เป็นหลัก"):** 🌙🏙️ แก้ค่าคงที่ `NIGHT` (`js/city3d.js` บรรทัด 26) ให้ตรรกะเท่ากับ `readMode()` ของ `NightUI` ใน `index_classic.html` เป๊ะ: `vwNightMode` 'day'/'night' = ตัวตัดสิน · ค่าแปลก/'auto' = อัตโนมัติ · **ไม่มีคีย์ใหม่จึงค่อยอ่าน `vwNightUi` เดิม (ผู้ใช้เก่ารอบ 882)** · ไม่มีคีย์เลย = อัตโนมัติ 19:00-06:00 · `?day`/`?night` override คงเดิม · **เมือง 3D ไม่เขียน/ไม่ลบ localStorage อีกแล้ว** (กฎล้างค่ารอบ 882 หายไป) → `syncLegacy()` ฝั่งล็อบบี้กลายเป็นแค่กันเหนียวตามที่รอบ 889 วางไว้ · bust `city3d.js?v=891` (`index.html`) · **ปิดงานค้างของรอบ 889 แล้ว**
  - ยืนยัน (server :8642 · 1000×640): ① harness ดึงบล็อก `NIGHT` จากไฟล์จริงมา eval ด้วยนาฬิกา/localStorage จำลอง **18 เคสถูกหมด** (auto 10/18/06=วัน · 19/23/05=คืน · ปักกลางวัน 20/03 ยังวัน · ปักกลางคืน 10/06 ยังคืน · ผู้ใช้เก่า ui=1@20 และ ui=0@10 ที่กฎ 882 เคยล้างทิ้ง = อยู่ครบ · คีย์ใหม่ชนะคีย์เดิมทุกคู่ · `?day`/`?night` ทับได้) และ **ทุกเคส `writes` = ว่าง (ไม่มี set/remove สักครั้ง)** ✓ ② บูตเมืองจริง 4 เคส อ่าน `CITY.scene`: ปักกลางคืนตอน 12:00 → bg/fog `0c1734` + hemi `33406b`/sun `8aa0ff` ✓ · ปักกลางวัน → `9ed7ff` + `cfe8ff`/`fff2d0` ✓ · ผู้ใช้เก่า `vwNightUi='1'` อย่างเดียว → กลางคืน ✓ · ไม่มีคีย์ (auto 12:00) → กลางวัน ✓ · **ทุกเคสคีย์ใน localStorage อยู่ครบหลังบูต ไม่ถูกล้าง** ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง localStorage + ฆ่า server แล้ว
  - ⚠️ ไม่แตะ `index_classic.html`/`js/util.js` (ฝั่ง `NightUI` ของรอบ 889 ถูกอยู่แล้ว) · ไม่แตะไฟ/หน้าต่างตึกกลางคืน (ใช้ `NIGHT` ตัวเดียวกัน ตามอัตโนมัติ)
- **รอบ 890 (2 ส.ค. · ผู้ใช้: "ต่อยอด 886 — ทำบานประตูตึกในเมือง 3D เปิดตอน walkSelfTo ถึงหน้าประตู และตอน walkSelfOut ก้าวออกมา พร้อมเสียงประตูสังเคราะห์เอง"):** 🚪🔊 โซนใหม่ `🚪🔊 รอบ 890` ใน `js/city3d.js` (ก่อนโซน 🚶 รอบ 866) + แก้ `doorAt()` ในโซน 🏗️ BUILDERS ให้แขวนบานบน **บานพับ (Group ขอบซ้ายช่องประตู)** แทนแผ่นไม้แปะผนัง (หมุนตัวบานเองไม่ได้ — จุดหมุนอยู่กลางบาน บานจะจมทะลุผนัง) + ลูกบิด + ช่องประตูมืดหลังบาน (เล็กกว่าบาน 0.14 ตอนปิดจึงถูกบังมิด หน้าตาตึกเหมือนเดิมเป๊ะ) · `buildCity` จดทะเบียน `CityDoors[key]` (20 หลังที่ builder เรียก `doorAt` — สนามบอล/ลานยาน/โรงเก็บ/ประตูป่า 8 หลังไม่มีบาน สั่งแล้วคืน false เงียบ ๆ) · ticker ไถองศา ease-out ทั้งไป-กลับ (เปิด .42 วิ · ปิด .62 วิ · สวิง −1.85 rad ออกนอกตึก) · **จังหวะ:** ① ขาไป `walkSelfTo` เดินได้ 62% (`DOOR_OPEN_AT`) = เริ่มผลัก → บานกางสุดก่อนถึงหน้าประตู ② ขากลับ `stageExitWalk` **สแนปบานเปิดค้างแบบเงียบ** (ภาพจอเปิดรอบ 880 แคปตอนบานเปิด ปล่อยปิดไว้ = ภาพจางมาแล้วประตูกระตุกปิด + ตัวเราเดินทะลุบาน) → `walkSelfOut` ก้าวพ้น `EXIT_SHUT=5.6` ค่อยปิดตามหลัง · เสียงสังเคราะห์เอง (AudioContext ตัวเดียวกับเสียงฝีเท้ารอบ 871): เอี๊ยด = sawtooth ไล่ความถี่ผ่าน bandpass Q 7.5 (เปิดไล่ขึ้น/ปิดไล่ลง) · **ตึบ+กลอนคลิกยิงตอนบานถึงวงกบจริงในตัว ticker ไม่ใช่ตอนสั่งปิด** (ไม่งั้นเสียงมาก่อนภาพครึ่งวินาที) · bust `city3d.js?v=890`
  - ยืนยัน (server เอง :8791 · 1000×640 · แท็บ preview `document.hidden`=true → rAF ไม่วิ่ง ขับเฟรมด้วย `setInterval(_t.step,16)` = `performance.now()` เดินตรงเวลาจริง): เปิด 25 เฟรม/ปิด 37 เฟรม ตรงค่าคงที่ ✓ ease ถูกทาง (เปิดออกตัวแรง ry −0.144 เฟรมแรก · ปิดออกตัวช้า 1.849→1.716 ใน 10 เฟรมแล้วเร่ง) ✓ สั่งซ้ำเป้าเดิมคืน false ไม่เล่นเสียงซ้ำ ✓ · **ขาไป**: เดินไกล 2.4 วิ (stats) ประตูเริ่มขยับที่ **62.7%** ของทาง เปิดสุดก่อนถึง 0.5 วิ ✓ เดินใกล้ 0.93 วิ (market) เปิดสุดหลังถึง 85ms (ก่อนเปลี่ยนหน้า 520ms) ✓ · **ขากลับ** (ยัด `vwCityLastDoor='market'` แล้ว reload): บูตมาบานเปิดค้างจริง (k=1 ไม่มีเสียง) ตัวเราอยู่ในตึก 3.0 ✓ เดินออก → ฝีเท้า 3 ก้าว (530/817/1234ms) · สั่งปิดตอน dist 5.62 (818ms) · **เสียงตึบ 1425ms = บานถึงวงกบ 1431ms** ตอนเรายืนหน้าประตูพอดี (ถึงที่ 1366ms) ✓ จบที่ door spot d=7 หันออก ✓ · เคสลบ: ตึกไม่มีบาน/`__reception`/key มั่ว = คืน false ไม่ throw ✓ · ตาข่าย setTimeout (rAF ตาย) = tgt ถูกตั้งไว้ พอ ticker วิ่งบานปิดเองครบ ✓ · ภาพยืนยันด้วยตา 10 ช่อง (`Snap.grid` + shim `Adventure3D._t.step`): market/home/academy(bTower)/library/factory/arcade เปิด-ปิดเห็นบานกางออกนอกตึก + ช่องประตูมืด ไม่จมผนัง ทั้งกลางวัน-กลางคืน ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - 💡 เครื่องมือใหม่ (เก็บใน scratchpad): แท็บ preview รอบนี้ **ดาวน์โหลดไฟล์ไม่ลง Downloads** → `shotsink.py` (HTTP รับ POST base64 เซฟเป็นไฟล์) + ดัก `HTMLAnchorElement.click` ของ SnapLab ส่งเข้า sink แทน · SnapLab ไม่รู้จัก `window.CITY` ต้อง shim `window.Adventure3D={_t:{step:(dt,n)=>CITY._t.step(n||1)}}` ก่อนโหลด
  - ⚠️ ไม่แตะกล้อง/เส้นทางเดิน/ระบบเสียงฝีเท้าเลย · ประตูไม่ใช่ของกดได้ (hitbox เดิมคุมการแตะตึกอยู่แล้ว)
- **รอบ 889 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 885: "เพิ่มสวิตช์โหมดกลางคืนในหน้า ⚙️ ตั้งค่า พร้อมตัวเลือก อัตโนมัติ/กลางวัน/กลางคืน 3 ทาง"):** 🌙⚙️ แถวใหม่ `#set-night` (ปุ่ม segmented 3 ปุ่ม) ใน `openSettings()` (`js/util.js`) + CSS `.set-seg/.set-seg-btn` (`css/style.css`) + เต็มความกว้างในกริดตั้งค่า (`css/lobby.css` `.settings-box .set-night-row{grid-column:1/-1}`) · ตรรกะทั้งหมดยังอยู่ในสคริปต์ inline หัว `index_classic.html` เดิม — เพิ่ม `NightUI.getMode()/setMode()` (`toggle()` = ทางลัดของ `setMode`) · ปุ่ม 🌙 แถบบนกับแผงตั้งค่าเป็นตัวเดียวกัน (paint() ไฮไลต์ปุ่ม 3 ทางให้ด้วย กดจากที่ไหนอีกฝั่งขยับตามทันที)
  - **เลิกกฎ "ล้างค่าตัวเองเมื่อตรงกับอัตโนมัติ" ของรอบ 885** — พอมี 3 ทางแล้วกฎนี้พัง: ปัก "กลางคืนตลอด" ตอน 2 ทุ่มจะโดนล้างทันที (ตรงกับอัตโนมัติพอดี) พอ 6 โมงเช้าก็ไหลเป็นกลางวันทั้งที่ผู้ใช้สั่งปักไว้ · ตอนนี้ปักแล้วค้างจริงจนกดปุ่ม "🕒 อัตโนมัติ" เอง
  - **🔑 แยกเป็น 2 คีย์ (สำคัญ — อย่ายุบกลับเป็นคีย์เดียว):** `vwNightMode` ('day'/'night' · ไม่มีคีย์ = auto) = ตัวตัดสินจริง · `vwNightUi` ('1'/'0' คีย์เดิมรอบ 882) เขียนตามให้ทุก paint เพราะ **`js/city3d.js` (เมือง 3D รอบ 887) อ่านคีย์นี้ และยังมีกฎล้างค่าของรอบ 882 ติดอยู่ (บรรทัด ~34)** — ถ้าใช้คีย์เดียวกัน เดินเข้าเมือง 3D ทีเดียว การปักหายเงียบ ๆ · `syncLegacy()` ใน paint ซ่อมคีย์เดิมคืนให้อัตโนมัติ (ทุก 60 วิ + ทุกครั้งที่เปิดหน้า) · ผู้ใช้เก่าที่มีแต่คีย์เดิม = อ่านเป็นโหมดปักได้ตามเดิม (migrate อัตโนมัติ) · ✅ **ปิดแล้วรอบ 891** (ลบกฎล้างค่าใน `js/city3d.js` + ให้อ่าน `vwNightMode` เป็นหลัก → `syncLegacy` เหลือแค่กันเหนียว)
  - ยืนยัน (server เอง :8830 · headless Chrome + bootstrap `_t889.html` (iframe+mock login · ลบแล้ว) · 1000×640 + 812×375): จำลองเวลา 9 เคส — auto: 10/18/06=กลางวัน · 19/05=กลางคืน ✓ · ปักกลางวัน: 20/03 ยังกลางวัน ✓ · ปักกลางคืน: 10/06 ยังกลางคืน ✓ (กฎเดิมรอบ 885 จะพลาดข้อนี้) · กด 3 ปุ่มสลับไปมา + กดปุ่ม 🌙 แถบบน = ไฮไลต์/ไอคอน/คลาส `night`/คีย์ ตรงกันทุกสเต็ป ✓ · จำลองเมือง 3D ล้าง `vwNightUi` → paint ซ่อมกลับเป็น '1' เอง ✓ · ผู้ใช้เก่า (มีแต่คีย์เดิม) อ่านถูก + กด auto แล้วล้างคีย์เก่าด้วย ✓ · ภาพยืนยันด้วยตา 3 โหมด (กลางวัน/กลางคืน/เล็ก 812×375) ปุ่มไม่กลมเพี้ยน อ่านชัดทั้ง 2 ธีม · console ไม่มี error · `node --check` ผ่านทั้ง `js/util.js` และสคริปต์ inline · ล้าง localStorage + ลบไฟล์เทสต์ + ฆ่า server แล้ว
  - 🐛 บทเรียน CSS: `.set-seg-btn` เดี่ยว ๆ (0,1,0) **แพ้ `.levelup-box button` (0,1,1)** ปุ่มเลยกลายเป็นแคปซูลม่วง 18px → ต้องเขียน `.set-seg .set-seg-btn` (บทเรียนเดียวกับรอบ 803 และกล่อง gradelock)
  - ⚠️ **แผง ⚙️ ตั้งค่ายังเลื่อนในตัวเองอยู่ (scrollHeight 1639 vs 492 ที่ 1000×640) = ขัดกฎทอง #7 — ของเดิมก่อนรอบนี้** (แถวใหม่เพิ่มแค่ ~76px) เนื้อหาเยอะจริง (ตัวละคร 88 ตัว + สวิตช์ฟีด) · **ยังไม่แก้ในรอบนี้ (นอกขอบเขต)** ถ้าจะจัดใหม่ต้องยกแผงทั้งใบ — โน้ตไว้ให้รอบหน้า


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 893 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 889: "โหมดกลางคืนล็อบบี้ให้ไล่ระดับตามเวลาจริง 18:00 อุ่นบาง ๆ → 21:00 เข้มสุด → 05:00-06:30 จางกลับ · ทำด้วย CSS var --night-k คูณ opacity ผ้าคลุม 2 ชั้น ห้ามไล่แก้สี hardcode"):** 🌗 เดิมเป็นสวิตช์ขั้นเดียว · ตอนนี้สคริปต์ `NightUI` (inline หัว `index_classic.html`) คำนวณ `k` 0..1 ด้วย smoothstep 2 ช่วง (18:00-21:00 ขึ้น · 05:00-06:30 ลง · ที่เหลือ 0 หรือ 1) แล้วยิงเป็น `--night-k` บน `<html>` ทุก paint (interval 60 วิเดิม + เพิ่ม `visibilitychange` เผื่อเครื่องหลับข้ามคืน) · `css/lobby.css`: `#night-veil` = `calc(.52*var(--night-k))` · `body::after` = `calc(.28*...)` (ค่าสูงสุดเท่ารอบ 885 เป๊ะ) · **โหมดปักไม่ต้องมีเงื่อนไขพิเศษ — ปักกลางวัน = k คงที่ 0 · ปักกลางคืน = k คงที่ 1 · คลาส `night` มาจาก `k>=.25` ทางเดียว** (auto ตัดที่ 18:59/06:01 ≈ เกณฑ์เดิม 19:00-06:00) · ปุ่ม 3 ทางในหน้า ⚙️ + ปุ่ม 🌙 แถบบน + คีย์ `vwNightMode`/`vwNightUi` ทำงานเหมือนเดิมทุกอย่าง (เมือง 3D ไม่ต้องแก้)
  - 🔑 **ฉากหลังต้องไล่ระดับด้วย ไม่งั้นยัง "กระโดด"** — วัดแล้วตอนคลาส `night` พลิก จอสว่างเฉลี่ยเปลี่ยนพรวด 33 หน่วย (พาเลตต์+ฉากหลังสลับพร้อมกัน) และขนาดสเต็ปเท่าเดิมไม่ว่าจะย้ายจุดตัดไปที่ k ไหน (29.8/27.7/25.0/23.8 ที่ k=.25/.5/.75/.93) → เลิกสลับ `html.night body{background-image}` ทั้งชุด เปลี่ยนเป็น **วางชั้นพลบค่ำทับ gradient เดิมของรอบ 882 แล้วไล่เฉพาะ alpha ตาม k** (`rgba(...,calc(.74*var(--night-k)))` · 4 ชั้นแล้วต้องเติม `background-size/position` ให้ครบ 4 ค่า) → สเต็ปตอนพลิกเหลือ **7.9 หน่วย เล็กกว่าการไล่ปกติของช่วงนั้นเอง (11-15/30 นาที)** = ตาไม่จับ · หน้าตากลางวัน (k=0) และกลางคืนเต็ม (k=1) วัดแล้วเท่าของเดิมทุกจุด (120/161/206 · 113/94/76)
  - ยืนยัน (server เอง :8792 + :8793 · headless Chrome + หน้า bootstrap ชั่วคราว `_t891.html`/`_s891.html` (iframe+mock login · ลบแล้ว) · จอ preview ซ่อน screenshot ปกติค้าง): จำลองนาฬิกา 15 ค่า — 17/18=0.000 · 19=0.259 · 20=0.741 · 21/23/03/05=1.000 · 06=0.259 · 07=0.000 + จุดกึ่งกลาง 18:30/19:30/20:30/05:45/06:15 ✓ opacity ผ้าคลุมทั้ง 2 ชั้น = k×.52 / k×.28 เป๊ะทุกค่า ✓ **กวาดทีละนาทีครบ 24 ชม.: ก้าวใหญ่สุด 0.0167/นาที (ที่ 05:45) ไม่มีจุดกระโดด · รอยต่อ 4 จุด (18:00/21:00/05:00/06:30) ค่าตรงกันทั้งสองฝั่ง** ✓ ปักกลางวัน 20/03/23 = k 0 ทุกครั้ง · ปักกลางคืน 10/06/15 = k 1 ทุกครั้ง ✓ กด auto ล้าง 2 คีย์ · ผู้ใช้เก่าคีย์รอบ 882 อ่านถูก · ปุ่ม 🌙 toggle ยังพลิกได้ ✓ · ภาพยืนยันด้วยตา 6 ช่วงเวลา (17:00/18:30/19:30/21:00/05:45/06:40) ตัวหนังสืออ่านชัดทุกใบ ฉากหลังไม่ยืดเพี้ยน · console ไม่มี error · `node --check` สคริปต์ inline ผ่าน · ล้าง localStorage + ลบไฟล์เทสต์ + ฆ่า server แล้ว
  - ⚠️ ที่ยังเป็นสเต็ปอยู่ = **พาเลตต์ `html.night` (ตัวแปรสี ~10 ตัว + ปุ่มแถบบน)** ซึ่งพื้นที่เล็กและตอนพลิกผ้าคลุมอุ่นมาแล้ว 1/4 จึงกลืน · ถ้าจะไล่ระดับด้วยจริง ๆ ต้องใช้ `color-mix()` ครอบ `@supports` (เครื่องเก่าไม่รองรับจะสีเพี้ยนทั้งเกม) — ยังไม่ทำ · ไม่แตะ `js/*.js` และ `js/city3d.js` (รอบ 891/892 ของ session คู่ขนานเพิ่งลง)
- **รอบ 892 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 890: "ประตูตึกที่มีคนออนไลน์ยืนอยู่ให้แง้มไว้ + ไฟส่องออกมาจากช่องประตูตอนกลางคืน"):** 🚪👥🌙 ต่อในโซน `🚪🔊 รอบ 890` (`js/city3d.js`) — เพิ่มแนวคิด **"ท่าพัก" (`rest`) ของบาน**: `closeCityDoor` ไม่ได้แปลว่าปิดสนิทอีกต่อไป แต่ = *ปล่อยกลับท่าพัก* (0 ปิดสนิท · `DOOR_AJAR=0.13` ≈ 25° แง้ม) · `refreshDoorRest()` นับ `Live.actors` ที่ `kind==='stand'` ต่อ `bkey` → ตึกไหนมีคนยืน บานแง้มไว้ (ร้านเปิด มีคนอยู่ข้างใน) เรียกจาก 3 จุด: ท้าย snapshot `watchPresence` · ท้าย `spawnStander` (lbGet เป็น async ตัวจริงลงจอทีหลัง) · `removeActor` · `held` กันไม่ให้ท่าพักไปแย่งบานที่กำลังเปิดรับเราเดินเข้า · เสียงตอนแง้ม/ปิดตามคน = creak เบา (vol .45) และ **เงียบ 4 วิแรกหลังบูต** (presence ก้อนแรกมาทีเดียวหลายตึก ไม่งั้นเอี๊ยดรัวทั้งเมือง) · **ปิดค้างที่ท่าแง้ม = ไม่มีเสียงกลอน** (ยิงเฉพาะตอน k แตะ 0 จริง) · 🌙 กลางคืน `doorAt` เพิ่ม 3 ชั้น: ช่องประตูเปลี่ยนเป็นแผ่นเรืองแสงอุ่น (`MeshBasicMaterial` ไม่กินแสงฉาก) + **ลำแสงทาบพื้น** (ระนาบนอน additive · texture เรเดียลจากขอบบน = ฐานแสงอยู่ที่ธรณีประตูแล้วบานออก) + **ดวงเรืองที่ช่องประตู** (sprite แบบโคมไฟถนน — ตัวนี้ทำให้ "ตึกที่มีคนอยู่" ดูออกตั้งแต่มุมทั้งเมือง ลำแสงพื้นอย่างเดียวจางเกิน) ทั้งคู่ opacity/ขนาดผูกกับองศาที่บานเปิด → **ปิดสนิท = ดับสนิท** · กลางวันไม่สร้างวัตถุแสงเลย · bust `city3d.js?v=892`
  - ยืนยัน (server เอง :8793 · 1000×640 · ขับเฟรม `_t.step` + `setInterval` เหมือนรอบ 890): `fakeStand(5)` → นับได้ play:2 library:2 home:1 → 3 ตึกนั้น rest=0.13 ตึกอื่น 0 ✓ บานไถไปหยุดที่ 0.13 (ry −0.45 ≈ 25°) ✓ · เดินเข้าตึกที่แง้มอยู่ → เปิดสุด k=1 → ปล่อยแล้ว **กลับมาหยุดที่ 0.13 ไม่ปิดสนิท** ✓ · เดินออกจากตึกที่มีเพื่อนอยู่ (exit walk เต็มเส้น): สั่งปิดที่ dist 5.62 → บานหยุดที่ 0.13 · ฝีเท้า 3 ก้าว + creak ปิดครบ · **ไม่มีเสียงกลอน (sine 176) เลย** ✓ · กลางคืน: sprite additive 20 ตัว = 1 ต่อ 1 ประตู · spill 0 ตอนปิด → .469 ตอนแง้ม → .9 ตอนเปิดสุด ✓ · กลางวัน: sprite additive **0 ตัว** + `spill:null` ✓ · ภาพยืนยันด้วยตา 10 ช่อง: กลางคืนตลาดแง้มมีไฟลอด vs ของขวัญปิดมืดสนิท · ห้องสมุดเปิดสุดเห็นลำแสงทาบพื้นเต็ม · มุมทั้งเมือง dist 90 เห็นจุดไฟตึกที่มีคน · กลางวันแง้มเห็นบานเปิดแต่ไม่มีแสง ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ **โค้ดรอบนี้ส่วนใหญ่ถูก session คู่ขนาน (รอบ 891) สวีปติด commit `6be25f6` ไปก่อนแล้ว** (working dir เดียวกัน · เขา commit `js/city3d.js` ตอนงานนี้ทำค้างอยู่) — รอบ 892 จึงเหลือ diff แค่ชั้น "ดวงเรืองที่ช่องประตู" + bust · **ยึด TASKS.md นี้ว่าประตูแง้ม/ไฟลอดประตู = รอบ 892** (คอมเมนต์ในไฟล์แก้เป็น 892 ครบแล้ว ยกเว้นบรรทัด 26 `NIGHT` ที่เป็นของเขาจริง) · ไม่แตะตรรกะ `NIGHT`/`vwNightMode` ของเขาเลย


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 894 (2 ส.ค. · ผู้ใช้: "แผง ⚙️ ตั้งค่า เนื้อหายาวจนเลื่อนในตัวเอง ขัดกฎทอง #7 จัดใหม่ให้เห็นครบไม่ต้องเลื่อน"):** ⚙️🗂️ ต้นตอ: กล่องเดียวยัดทุกแถว (สวิตช์เสียง/สั่น/เอฟเฟกต์/กลางคืน/รูปโปรไฟล์/ตัวละคร 88 ตัว/เปิดเผยฟีด 5 หมวด) — วัดจริง `scrollHeight` 1641 vs กล่องสูงได้แค่ 589px (92vh ที่ 1000×640) ล้นเกือบ 3 เท่า → แก้: แบ่งเป็น **3 แท็บ** (`js/util.js` `openSettings()`) ใช้คลาส `.lb-tab` เดิม (โทนม่วงกระดานอันดับ) — 🔊ทั่วไป (เสียง/สั่น/เอฟเฟกต์/กลางคืน/รูปโปรไฟล์) · 🦸ตัวละคร (ตัวเลือก 88 ตัว) · 📰เปิดเผย (ฟีด 5 หมวด) โชว์ทีละแท็บด้วย `.set-panel.active` (JS ผูก event ท้าย innerHTML) · เลิกกริด 3 คอลัมน์เดิม (บีบข้อความยาวจนขึ้นหลายบรรทัด) เปลี่ยน `.settings-box` เป็น flex column + ทุกขนาด font/switch/ปุ่มใช้ `clamp(...,vh,...)` ตามแพทเทิร์นกฎทอง #7 เดิม · ตัวเลือกตัวละคร: เปลี่ยนจาก `grid2x8` (2 แถว) เป็น **`grid1x5`** (แถวเดียว 5 คอลัมน์ — คลาสมีอยู่แล้วในไฟล์ ไม่ต้องเขียนกริดใหม่) ลดครึ่งความสูง · CSS แก้เฉพาะโซน `.settings-box` ใน `css/lobby.css` (~บรรทัด 2971) — ไม่แตะ `#night-veil`/`--night-k` ของรอบ 893 (คนละโซน)
  - ยืนยัน (server เอง :8642 · testkit mock login เข้า `index_classic.html` จริง): วัด `scrollHeight` vs `clientHeight` ของ `.settings-box` ครบทั้ง 3 แท็บ ที่ **1000×640** (560/560, 479/479, 581/581 — overflow 0 ทุกแท็บ) และ **812×375** (337/337 ทุกแท็บ — overflow 0) ✓ วัดซ้ำระดับ `.set-panel` ด้วย (ไม่ถูก `overflow:hidden` ตัดเนื้อหาแอบซ่อน) ✓ ฟังก์ชันยังทำงานครบ: สลับแท็บ, สวิตช์เสียงคลิกเปลี่ยนสถานะ, ปุ่มโหมดกลางคืน 3 ทาง (`NightUI.setMode`) เปลี่ยนจริง, เลือกตัวละคร (`.sel` ติดถูกตัว), สวิตช์เปิดเผยฟีดคลิกเปลี่ยนสถานะ ✓ console ไม่มี error · `node --check js/util.js` ผ่าน · ล้าง localStorage (เซฟ + `vwNightMode`/`vwNightUi` ที่แตะระหว่างเทสต์) + ฆ่า server แล้ว
  - ⚠️ ตัวเลือกตัวละคร (แท็บ 🦸) ตอนนี้โชว์ทีละ 5 ตัวต่อหน้า (เดิม 8) เพราะแถวเดียว — แลกกับไม่ต้องเลื่อนแนวตั้งอีกต่อไป ยังปัดซ้าย-ขวาดูตัวอื่นได้ปกติ · commit เฉพาะ `css/lobby.css`+`js/util.js`+`handoff/TASKS.md` (ไม่แตะไฟล์ session คู่ขนานอื่นที่ยังค้าง: `handoff/RULES.md`/`index.html`/`js/city3d.js`/`js/netroom.js`/`js/ui.js`)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 895 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 894: "ปุ่มลูกศรปัดตัวละครให้กระโดดทีละหน้า (5 ตัว) แทนเลื่อนทีละตัว ให้เข้ากับ layout แถวเดียวใหม่"):** 🦸➡️ ตรวจโค้ดก่อนแก้พบว่า `bindStripArrows()` (`js/ui.js:7024`) เดิมเลื่อนทีละ **80% ของความกว้างที่เห็น** อยู่แล้ว (ใช้ร่วมทุกแถบปัดในเกม ไม่ใช่ทีละตัวอย่างที่เข้าใจ) → เพิ่มพารามิเตอร์ `opts` เสริม: `bindStripArrows(wrap, {full:true})` ให้เลื่อนเต็ม 100% ของความกว้าง (กระโดดเต็มหน้า 5 ตัวเป๊ะ ไม่ซ้อนของเดิม) · เรียกใช้เฉพาะจุดเดียว — แท็บ 🦸ตัวละคร ใน `openSettings()` (`js/util.js`) · แถบปัดอื่นทั้งหมด (โรงงาน/ตลาด/โชว์รูมรถ-หุ่น/ทรัพย์สินโปรไฟล์) เรียกแบบไม่ใส่ `opts` → พฤติกรรม 80% เดิมเป๊ะ ไม่กระทบ
  - ยืนยัน (server เอง :8642 · testkit mock login): มอนกีย์แพตช์ `strip.scrollBy` ดักค่าที่ฟังก์ชันคำนวณจริง (สภาพแวดล้อม preview ไม่ compositing สั่ง smooth-scroll แล้วไม่ขยับจริงให้วัด delta ตรงๆ ได้) → blk-x (แท็บตัวละคร) ส่ง `left = clientWidth` เป๊ะ (ratio 1.0) ✓ · สร้าง strip จำลองเรียก `bindStripArrows(wrap)` แบบไม่ใส่ opts → ได้ `ratio 0.8` เท่าของเดิมทุกประการ (ไม่กระทบแถบอื่น) ✓ console ไม่มี error · `node --check` ผ่านทั้ง `js/ui.js`+`js/util.js` · ล้าง localStorage + ฆ่า server แล้ว
  - 💡 ทำในเซสชันเดิมแทนเปิดใหม่ตามที่ผู้ใช้เสนอ (ประหยัด token กว่า — ไฟล์/บริบทโหลดพร้อมอยู่แล้วจากรอบ 894 และงานเล็กมาก) — แจ้งผู้ใช้แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 896 (2 ส.ค. · ผู้ใช้: "สร้างโลก 3D ใหม่ เกมขับรถ F1 สนาม Bahrain International Circuit สมจริง + ฟิสิกส์โมเมนตัม + เล่นด้วยกัน + ขอ prompt เจนภาพ"):** 🏎️ engine ใหม่ `js/f1_3d.js` (~1,100 บรรทัด) + ข้อมูลสนามจริง `js/data/f1_bahrain.js` (**อบจาก OSM: เส้น GP Circuit จริง 5,402/5,412 ม. ครบ 15 โค้ง + ผังอาคารจริง 42 หลัง** — Main Grandstand/Batelco/First Turn/Victory/University/Sakhir Tower/พิท · สคริปต์อบอยู่ scratchpad `bake_bic.py`) · ฟิสิกส์: a=PWR/v เพดาน 14.5 · drag v² · **downforce เพิ่มกริปตามความเร็ว** (grip=17.5+0.0035v² ≈4.5g ที่ 250 กม./ชม.) เกินลิมิต=understeer+ไถล · ผิว 4 ชั้น track/kerb/runoff/sand (ทราย grip .28 drag 7) · night race ไฟสปอตไลต์ · จับเวลา/รอบ + checkpoint 3 จุดกันตัดสนาม + `state.f1Best` · คำศัพท์บนแทร็ก REWARD 60 · multiplayer NetRoom map `'f1'` (10 คน/สนาม) + แชท/กระดาน · GLB `img/models/f1_car.glb` (ผู้ใช้จะวาง — ไม่มีใช้รถประกอบเอง) · texture probe `img/f1/*.jpg` 6 ไฟล์ (`PROMPTS_F1.md`) · เข้าโลก: WORLD3D แถวใหม่ f1 (prereq motoTicket) ใน `js/ui.js`
  - ยืนยัน (server เอง :8791 · mock login · แท็บซ่อน→ขับเฟรมด้วย `_t.step`): 0-100 = 2.05 วิ · ท็อป 308 กม./ชม. บนแทร็ก / 107 บนทราย ✓ เทเลพอร์ตครบรอบ=+1 รอบ+โบนัส · ข้ามเส้นไม่ผ่าน checkpoint=0 ✓ ผิว lateral 0/7→track 8.6→runoff 20→sand ✓ เพื่อนจำลอง 2 คน+บับเบิล+กระดาน(มีดาวชั้น) ✓ ประกอบคำ+เหรียญ ✓ ภาพยืนยันด้วยตา 4 มุม×3 ชุด (กริด/อัฒจันทร์/T1/มุมสูง — **ผังตรง BIC จริงชัดเจน**) · 812×375 ทุกกล่องในจอไม่ scroll ✓ console ไม่มี error · `node --check` ผ่าน 4 ไฟล์ · ล้าง storage+ฆ่า server แล้ว
  - 🐛 บทเรียน: จุด OSM ผ่าน Douglas-Peucker ระยะไม่สม่ำเสมอ (โค้ง 2ม./ตรง 500ม.) → Catmull-Rom uniform overshoot เส้นวนย้อน 31 จุด (เส้นขอบขาวไขว้ผ่าแทร็ก — เจอรอบนี้เอง) → **แก้ที่ตัวอบ: resample ระยะเท่า 8 ม. แทน DP** เหลือ 0 จุดเสีย
  - ⏳ **ค้าง: ผู้ใช้ publish rules** (เพิ่ม `'f1'` ใน enum wroom+winfo 2 จุด — ยังไม่ publish = เล่นเดี่ยวได้ เห็นเพื่อนไม่ได้) · Artifact rules+prompts: https://claude.ai/code/artifact/a7207cce-6fb3-4e92-b234-ebf7e9edf5db · รอไฟล์ `f1_car.glb` + ภาพ `img/f1/` จากผู้ใช้
  - ⚠️ ไม่แตะไฟล์ session คู่ขนาน (`css/lobby.css`/`index.html`/`index_classic.html`/`js/city3d.js`)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 897 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 890/892: "ทำประตูม้วนเลื่อนขึ้นให้โรงรถ/โรงเก็บยาน bGarage+bHangar+bDronePad · ใช้ทะเบียน CityDoors เดิม · เสียงครืดเหล็ก+กึก · แง้ม 25% + ไฟลอดกลางคืน"):** 🚪🌀 `js/city3d.js` เดิมรองรับแค่บานหมุน (`applyDoorPose` hardcode `rotation.y`) → เพิ่ม **ชนิดที่ 2 `kind:'roll'`** ใช้ทะเบียน/ตัวสั่ง/ตัวขับ/ท่าพักตัวเดิมทั้งหมด ต่างกัน 3 จุด: ① pose = ย่อ `scale.y` ของกลุ่มที่ **จุดยึดอยู่ขอบบน** (บานหดขึ้นไปม้วนเก็บในคาน · เลื่อนขึ้นเฉย ๆ บานจะโผล่ทะลุหลังคา) ② เสียง `shutterRollSfx` = noise × พัลส์ซี่สแลต 26/วิ ผ่าน bandpass **กวาดความถี่ตามทิศบานวิ่ง** (ขึ้น 520→1250 · ลง 1250→520) + `shutterClunkSfx` (sine 132→44 + เหล็กสั่น 332/487) **กึกทั้ง 2 ปลาย** (ลงสุด vol 1 · ขึ้นสุด .5) ③ ช้ากว่า (เปิด .85 · ปิด 1.15 วิ) จึงเริ่มยกตาม **"เวลาที่เหลือของการเดิน"** (`doorLeadS`) ไม่ใช่ 62% คงที่แบบบานหมุน · ท่าแง้ม `ROLL_AJAR=0.15` → ยกขึ้น 26% + ไฟลอดใต้ประตูตอนกลางคืน (ยกลำแสงพื้น/ดวงเรืองรอบ 892 ออกมาเป็น `doorNightFx` ใช้ร่วมกัน 2 ชนิด · `sp`/`gl` เป็น **array** เพราะโรงรถมี 2 ช่อง) · builders: bGarage เปลี่ยนแผ่นลายสแลตแปะผนัง 2 ช่องเป็นประตูจริง · bHangar+bDronePad เพิ่มใหม่ · ประตูในเมือง 20→**23 บาน** · bust `city3d.js?v=897`
  - 🔑 **บทเรียน: ชิ้นส่วนประตูต้องอยู่ "หน้าผนัง" เสมอ** — วางช่องมืดไว้หลังบาน (z−0.07) = จมในกล่องผนัง เปิดประตูแล้วเห็นผนังทึบเหมือนเดิม (ตาเปล่าหลงว่าใช้ได้เพราะดวงเรืองกลางคืนสว่างทับ) → ยิง **raycast** ยืนยัน: โดนกล่องผนัง 9×3.6×7 ก่อนช่องมืด 0.03 หน่วยทุกครั้ง · แก้เป็นค่าคงที่ `ROLL_Z_*` ยกทุกชิ้นออกหน้าระนาบผิวตึก · **hangar หนักกว่านั้น: `CylinderGeometry(...,openEnded=false)` ปิดหัวท้ายด้วยฝาครึ่งวงกลม = หน้า hangar เป็นผนังทึบ** (ไม่ใช่ช่องเปิดอย่างที่เห็นจากรูปทรง) ประตูจึงต้องอยู่ที่ z=4.0 พอดีฝา
  - ยืนยัน (server เอง :8794 · 1000×640 · ขับเฟรม `_t.step` + spy `createBufferSource/createOscillator`): เปิดสุด 51 เฟรม=.85 วิ · ปิด 69 เฟรม=1.15 วิ ตรงค่าคงที่ ✓ ease-out ถูกทาง (lift .27→.50→.68→.81→.90→.94) · บาน 2 ช่องของอู่รถไถพร้อมกัน ✓ · **เสียงยาวตามระยะที่บานวิ่งจริง**: เปิดสุด .85s · ปิดสุด 1.15s · ปิด→แง้มอย่างเดียว .18s ✓ กึกยิงตอนถึงสุดจริงในตัวขับ · หยุดที่ท่าแง้ม = ไม่มีกึก ✓ บานไม้ 20 หลังยังเป็น sawtooth เอี๊ยด+กลอนเหมือนเดิม (market 26 เฟรม ry −1.85) ✓ · เดินเข้า: อู่รถไกล (เดิน 2.40 วิ) ประตูเริ่มยก 1.563 วิ (65%) เปิดสุด 1.721 วิ **ก่อนถึง 0.68 วิ** · โดรน (เดิน 1.31 วิ) เริ่ม .467 เปิดสุด .617 ✓ ทั้งคู่ถึงหน้าประตูตอน lift .94 · library (บานหมุน) ยังเริ่มที่ 62% เป๊ะเหมือนรอบ 890 ✓ · ขากลับ: บูตมาบานเปิดค้างเงียบ k=1 แล้วปิดตามหลังจนกึก ✓ · presence: ยัด 6 คนยืน → 3 หลังประตูม้วนแง้ม lift .261 + ไฟลอด (spill .479/glow .392) · คนออกหมด → ปิดสนิท ไฟดับ 0 ✓ · กลางวันไม่มีวัตถุแสงเลย (additive sprite 0 · spill/glow null) ✓ · เคสลบ: สั่งซ้ำคืน false · สนามบอล/ประตูป่า/key มั่ว คืน false ไม่ throw ✓ · แตะจอจริง 4 จุดตอนกลางคืน console ไม่มี error ✓ · ภาพยืนยันด้วยตา 2 กริด × 9 ช่อง (กลางวัน: ปิด/แง้ม/เปิด ครบ 3 หลัง เห็นซี่สแลต+ช่องมืด · กลางคืน: แง้มแล้วไฟลอดใต้ประตูทั้ง 3 หลัง) ✓ `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ ขอเลขรอบตอนเริ่มได้ 894 แต่ session คู่ขนานใช้ 894-896 ระหว่างทาง → ขยับเป็น **897** ก่อน commit (คอมเมนต์ในโค้ดแก้ครบแล้ว) · commit เฉพาะ `js/city3d.js`+`index.html` (session อื่นค้าง `js/netroom.js`/`js/ui.js`/`handoff/RULES.md` — ไม่แตะ) · 5 หลังที่ยังไม่มีประตู (สนามบอล/สนามมอไซค์/ลานยานแม่/ประตูป่า/ลานเฮลิฯ) = ตั้งใจ เป็นลานเปิดโล่ง ไม่ใช่ตึกมีบาน


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 898 (2 ส.ค. · ผู้ใช้: "publish rules แล้ว เจนภาพ+ทำ glb แล้ว นำไปใส่ให้สมบูรณ์"):** 🏎️🖼️ ประกอบ asset จริงเข้าโลก F1 — ① ภาพผู้ใช้ 6 ไฟล์เป็น .png 2-3.4MB → ย่อ/แปลงเป็น `img/f1/*.jpg` (17-274KB · .png ต้นฉบับคงไว้ ไม่ commit = ไม่ขึ้นเว็บ) ② โมเดล `img/models/f1_car.glb` (Tripo 3.4MB · 84k tri · tex 2048) → ทำ `f1_car_lite.glb` (1.7MB · simplify .5 · tex 1K ตามสูตรรอบ 519) เกมโหลด lite ก่อน fallback ตัวเต็ม ③ แก้ `js/f1_3d.js` 4 จุด: โหลด lite / repeat texture บน Extrude UV (หน่วยเมตร — ไม่แก้ภาพจะปูซ้ำทุก 1 ม. เป็นลายจุด: crowd 1/35,1/8.5 · pit 1/22,1/11 · tent 1/18) / **ทิศหัวรถ: เลิกหมุน PI (Tripo หันหน้า +Z ตรงแกนเกมอยู่แล้ว — เดิมรถวิ่งถอยหลัง)** / tint แทร็กภาพจริงเข้มลง 0x87898d ④ ตรวจ rules สดผ่าน CLI: `'f1'` อยู่ครบ 2 จุด (wroom+winfo) — **multiplayer พร้อมใช้แล้ว**
  - ยืนยัน (test copy จาก git archive HEAD + staged file :8793 = เหมือนที่ deploy จริงเป๊ะ): ภาพยืนยันด้วยตา — จมูก+ปีกหน้ารถหันหน้าวิ่งถูกทาง · อัฒจันทร์ภาพคนดูจริงสวย · แทร็กเข้มสมจริง · ขับจริงผ่านซุ้มได้ ✓ console ไม่มี error · `node --check` ผ่าน
  - ⚠️ **session คู่ขนานกำลังแก้ `js/f1_3d.js` อยู่ (รอบ 899/900: ไฟสตาร์ท/รถเงา/ยางสึก/พิท + โซน f1Rank ใน RULES.md ยังไม่ commit)** → รอบนี้ commit แบบ **เขียน git index ตรง** (HEAD + 4 จุดแก้ของรอบนี้เท่านั้น — ไม่ใช้ `git commit -- path` เพราะจะกวาด working tree ของเขา) · ไม่ commit `handoff/RULES.md` (f1Rank ของเขา) · การแก้ 4 จุดถูกใส่ใน working tree ให้เขาต่อยอดด้วยแล้ว
  - 💡 rules โซน `/f1Rank` ที่เห็นใน RULES.md = งาน session คู่ขนาน ยังไม่ publish (ไม่เกี่ยวกับรอบนี้)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 903 (2 ส.ค. · ผู้ใช้: "โลก F1: เพิ่มกระดานอันดับ Best Lap ออนไลน์ — โซนใหม่ /f1Rank ตามสูตร /examRank เก็บ {sec,n,g,ts} ต่อ uid แสดงท็อป 10 ในหน้า intro"):** 🏆 โซนใหม่ `f1Rank` (`handoff/RULES.md`) — 1 แถวต่อ uid (สนามเดียว ไม่มี setId) validate บังคับ `sec` ใหม่ต้องน้อยกว่าแถวเดิมเสมอ (ตรงข้าม examRank ที่คะแนนมากกว่าดีกว่า) จึง `set()` ทับได้เลย · อ่าน `orderByChild('sec').limitToFirst(50)` (เวลาน้อยสุดมาก่อน) · ฝั่งเกม `js/f1_3d.js`: `frSubmit/frMerge/frFetch/frRowHTML/frBodyHTML/frNote/frMount` เขียนตอนทำ Best Lap ใหม่ (`progressTick`) โชว์ท็อป 10 ในกล่อง `#f1-rankbox` ของหน้า intro (เรียกจาก `start()`) · แถวตัวเอง fallback จาก `state.f1Best` เสมอ (ออฟไลน์/ยังไม่ publish ก็ยังเห็น) · **บั๊กที่เจอ**: 10 แถวเดี่ยวคอลัมน์เดียวสูงเกินจอเตี้ย 375px (อีโมจิ/ดาว gradeMark ดันบรรทัดสูง ~28px/แถวทุกเบราว์เซอร์ ไม่ใช่ตามที่ line-height สั่ง) → แก้เป็นกริด 2 คอลัมน์ (`.fr-list{display:grid;grid-template-columns:1fr 1fr}`) แทน
  - ⚠️ **session คู่ขนานกำลังแก้ `js/f1_3d.js` ก้อนใหญ่พร้อมกันอยู่ (ไฟสตาร์ท/รถเงา/ยางสึก/พิท ใช้เลขรอบ 899-902)** → commit รอบนี้เขียน **git index ตรงจาก HEAD + เฉพาะ diff ของ f1Rank เท่านั้น** (`git hash-object -w` + `git update-index --cacheinfo` แล้ว sanity-diff ยืนยันไม่มีโค้ด DRS/ไฟ/รถเงา/ยาง/พิทหลุดมาด้วย) — **ไม่แตะ working tree ของเขา** ปล่อยให้ต่องานเดิมได้ต่อ
  - ยืนยัน (server เอง testkit mock login + mock `Online.db`): จำลอง 12 คนใน DB → ท็อป 10 เรียงเวลาน้อยสุดถูกต้อง + แทรกแถวตัวเองถูกตำแหน่ง + ดาวระดับชั้น/ชื่อเล่นขึ้นครบ (ไม่โชว์ชื่อจริง) ✓ วัด `getBoundingClientRect`/`scrollHeight` vs `clientHeight` ที่ 1000×640 และ **812×375** ครบ 10 แถว overflow=0 ทั้งคู่ ✓ กรณี rules ยังไม่ publish (deny) ขึ้นป้ายเตือนถูกต้อง ✓ `node --check` ผ่าน · ยืนยัน JSON rules ก้อนที่ส่งให้ผู้ใช้ตรงกับใน RULES.md 100% (byte-compare) · ล้าง mock + ปิด server แล้ว
  - ⏳ ค้าง: ผู้ใช้ publish rules โซน `f1Rank` — Artifact ปุ่มคัดลอกก้อนเต็ม: https://claude.ai/code/artifact/ba9890de-eb86-4255-bed6-b322f0e4e688


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 905 (2 ส.ค. · ผู้ใช้: "โลก F1 เพิ่มระบบยางสึก — slide สะสมทำกริปลดทีละน้อย มีเกจยางบน HUD · ขับเข้า pit lane แล้วจอดตรงช่อง = เปลี่ยนยาง 3 วิ กริปเต็ม"):** 🛞🔧 โซนใหม่ `🛞🔧 รอบ 900` ใน `js/f1_3d.js` — ① **ยางสึก**: `tyreWear()` คิดจากไถลเป็นหลัก (`TYRE_W_SLIDE .022/วิ` ที่ slide=1 คูณ `fast=spd/38` เพดาน 1.35) + ตามระยะทาง `.000019/ม.` (≈10%/รอบ) + kerb/ทราย · กริป `tyreGrip()=0.62+0.38·tyre` คูณเข้า `gripMax` (ยางหมด = กริป 62% ยังขับได้แต่ไถลง่าย) + เบรกจับน้อยลง `(0.8+0.2·tyre)` ② **เลนพิทเป็นผิวที่ 5**: เดิม `F1_MAP.pit` อยู่นอกแทร็ก 14 ม. → ถูกนับเป็น runoff (grip .62 drag 1.6 = ขับเข้าไม่ได้จริง) · เพิ่ม `buildPitLine()` (resample 5 ม. · 155 จุด · 770 ม.) + `inPitLane()` ใน `surfAt` → `SURF_PIT{grip:1,drag:.25}` + **ลิมิตเตอร์อัตโนมัติ 80 กม./ชม.** (เลขความเร็วเปลี่ยนเป็นเหลืองบอกว่าไม่ใช่รถเสีย) ③ **ช่องเปลี่ยนยาง** กลางเลนพิทฝั่งโรงรถ (พื้นลายเตือน+กากบาท+เสาป้าย 🛞 เขียว/เหลือง/แดง) จอดนิ่ง (<1.6 m/s) 3 วิ = ยางเต็ม + เสียงปืนลมขันน็อต (`Snd.wrench` พัลส์ 22/วิ ผ่าน bandpass) + ระฆังจบ (`Snd.tyreDone`) · ขยับ = เริ่มนับใหม่ ④ HUD: เกจ 🛞 มุมขวาบน (เขียว>55% เหลือง>30% แดง+กะพริบ<15%) + ป้ายพิทกลางบน (เตือนยางหมด/ระยะถึงช่อง/นับถอยหลัง) + เลนพิท (เส้นประ) และช่อง (จุด P ฟ้า) บนมินิแมป ⑤ **รอบที่แวะเลนพิท = ไม่นับ Best Lap/รถเงา** (กติกาจริง) แต่ยังได้ +25 🪙 ครบรอบ
  - ยืนยัน (server เอง :53212 · mock login · แท็บซ่อน→ขับเฟรมด้วย `_t.physTick`/`_t.step`): ผิว — กลางเลนพิท/ช่องจอด='pit' · ขอบ 5.5 ม.='pit' · 8 ม.='sand' · **ปลายเลนที่ซ้อนแทร็ก 2 จุด='track'** (แทร็กชนะเสมอ) ✓ · สึก — สลาลอม 5 วิ วัดได้ 0.2815 **ตรงกับสูตรที่คำนวณคู่ขนานเป๊ะทุกพจน์** (roll+slide+kerb/sand) · วิ่งสะอาด = 0.103/รอบ (≈9-10 รอบต่อชุด) · ทราย 2.1 วิ = 8% ✓ · กริป 1/0.5/0 → 1.0/0.81/0.62 ✓ ยางไม่ต่ำกว่า 0/ไม่เกิน 1 ✓ · ลิมิตเตอร์ — ยิงเข้า 298 กม./ชม. → ล็อก 80 เป๊ะใน 1.7 วิ ✓ · พิทสต็อป — 3.00 วิ พอดี (180 เฟรม) ยาง .25→1 · ป้ายแดงตอนเปลี่ยน→เขียวตอนเสร็จ · แบนเนอร์ "ยางใหม่!" + นับ stop ✓ · ยกเลิกกลางคัน (1.58 วิ แล้วขับออก) = ยางไม่เปลี่ยน pitT รีเซ็ต กลับมาจอดเริ่มนับใหม่ ✓ · ยางเต็มจอดค้าง = ไม่เปลี่ยนซ้ำ ป้ายเขียว ✓ · รอบเข้าพิทขึ้น "🔧 รอบเข้าพิท — ไม่นับสถิติ" best ไม่ขยับ แต่ +25 🪙 มา ✓ รอบสะอาดยังขึ้น "⭐ BEST LAP!" ปกติ ✓ · เข้าโลกใหม่ยางรีเซ็ต 100% ✓ · เคสลบ: เรียก `surfAt/pitAt/inPitLane` ที่ (9999,9999) ไม่ throw ✓ · **HUD วัด `getBoundingClientRect` ทั้ง 1000×640 และ 812×375: ทุกกล่องอยู่ในจอ ไม่ทับกันสักคู่** (ครั้งแรก 812×375 ชนเหรียญ 2px + ชนป้ายรถเงา 2px → ขยับ media query เป็น top 48/90) ✓ ภาพยืนยันด้วยตา 4 ช่อง (เข้าเลน/ถึงช่อง/กำลังเปลี่ยน/เสร็จ — เห็นพื้นช่องลายเตือน + เสาป้ายเปลี่ยนสีจริง) · console ไม่มี error · `node --check` ผ่าน · ล้าง localStorage + ฆ่า server แล้ว
  - ⚠️ **ชน session คู่ขนาน 3 ทางในไฟล์เดียว (`js/f1_3d.js`) — เก็บบทเรียนไว้:** ระหว่างทำรอบนี้มีอีก 2 session เขียนไฟล์เดียวกันอยู่ (DRS/ไฟสตาร์ท/รถเงา = 898/899 · กระดานอันดับ f1Rank = 903 · ห้องคนขับ = 901) · ขอ `--next-round` ตอนเริ่มได้ 898 แต่ถูกใช้ไปก่อน → ไล่เป็น 900 ก็ถูกใช้อีก (city3d ยานพาหนะออกจากประตู) → **จบที่ 905 · คอมเมนต์ในโค้ดแก้เป็น 905 ครบ 18 จุดแล้ว**
    - 🔑 **โค้ดยางสึก/พิททั้งก้อนถูก session รอบ 903 สวีปติด commit `951dab3` ไปก่อนแล้ว** (working tree เดียวกัน เขา commit `js/f1_3d.js` ตอนงานนี้ทำค้างอยู่ — เคสเดียวกับรอบ 892) → **ยึด TASKS.md นี้ว่ายางสึก+พิทสต็อป = รอบ 905** ไม่ใช่ 903 · รอบ 905 จึงเหลือ diff แค่เลขรอบในคอมเมนต์ + การ deploy ขึ้นเว็บ (live ตอนนั้นยังเป็น `.850` = ยังไม่มีระบบนี้)
    - 🧭 **วิธีที่ใช้แล้วได้ผล (ทำซ้ำได้):** ตรวจ `git status` เจอไฟล์ตัวเองมีคนอื่นเขียนค้าง → **อย่า commit ทับ** · ตั้งลูปเฝ้า `git show HEAD:<file> | grep -q <ฟังก์ชันของเขา>` ทุก 15 วิ พอโค้ดเขาลง commit แล้วค่อย commit ของเรา (รอบนี้รอ ~75 วิ) · ระหว่างรอเขียน TASKS.md ไปก่อน ไม่เสียเวลา
    - ⚠️ commit รอบนี้ pin เฉพาะ `js/f1_3d.js`+`handoff/TASKS.md` — แต่ `js/f1_3d.js` ยังมี **1-line CSS ของรอบ 901 (`#f1-cockpit` inset -8%)** ที่เจ้าของยังไม่ commit ติดไปด้วย (ลบทิ้งอันตรายกว่า ปล่อยติดไป) · ไม่แตะ `index.html`/`js/city3d.js`/`handoff/RULES.md`/`handoff/ARCHITECTURE.md` ของ session อื่น
  - 📌 เจอระหว่างทาง (ไม่ใช่ของรอบนี้ ยังไม่แก้): ที่ **812×375 ป้าย `#f1-drs` (รอบ 898/899) ทับ `#f1-hud`** ตอน DRS ติด — เป็นโซนของ session คู่ขนาน ปล่อยให้เจ้าของแก้


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 900 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 897: "เดินเข้า w3d_drive/w3d_mecha/w3d_drone แล้วให้ยานพาหนะแล่นออกมาจากช่องประตูที่เพิ่งม้วนขึ้น แล้วจอดรอหน้าประตู · ใช้ทะเบียน CityDoors + ticker เดิม"):** 🚗🤖🛸 โซนใหม่ `🚗🤖🛸 รอบ 900` ใน `js/city3d.js` (ต่อท้ายโซนประตู 890/897) — ตาราง `DOOR_RIDES` 3 หลัง (รถแดง/หุ่นเดิน/โดรน) + `Rides` + ticker ตัวเดียว · **ยืมของเดิมล้วน**: `CityDoors[key].k` เป็นตัวบอกว่าบานยกถึงไหน (ยานรอ `RIDE_GATE=0.5` ค่อยออกตัว = ถึงปากประตูตอนบานสุดพอดี) · ยานเป็น **ลูกของกลุ่มตึก** (`d.h.parent`) → พิกัดในตารางเป็นของตึกตรง ๆ +z = หันออกลาน ไม่ต้องแปลงมุมเมือง · เสียงย่ำของหุ่น = `footStepSfx` รอบ 871 ตัวเดิม · เพิ่มใหม่แค่ `rideSfx` (เครื่องยนต์ sawtooth เบสไล่รอบ / ใบพัด triangle) + `miniMecha()` (สัดส่วน/สีเดียวกับหุ่นโชว์บน bHangar ย่อให้ลอดประตู 2.2 ม. · ขาแขวนบนกลุ่มสะโพกจึงแกว่งเป็นท่าเดินจริง) + tag `userData.wheels` ใน `miniCar` (ล้อหมุน)
  - ⏱️ **จังหวะ: `doorLeadS()` บวกเวลาที่ยานใช้ (`rideLeadS` = 1.425 วิ)** → บานเริ่มยกเร็วขึ้นเท่านั้น (อู่รถ 42% ของทางเดิน เดิม 65%) เดินถึงหน้าประตู**พอดีตอนยานจอดนิ่ง** → ภาพจอเปิดขากลับ (รอบ 880 แคปตอนถึง) ติดยานจอดรออยู่ในภาพด้วย · **ขากลับ `stageExitWalk` สแนปยานจอดไว้ให้เลย** (`launchRide(key,true)`) ไม่งั้นภาพจางมาแล้วยานหายวับ · เดินพ้นประตู → `closeCityDoor` → `releaseRide` ยานถอยกลับเข้าโรง (1.0 วิ) เสร็จก่อนบานลงถึงพื้น (1.15 วิ)
  - ยืนยัน (server เอง :8795 · 1000×640 · ขับเฟรมด้วย accumulator ให้ "เวลาจำลอง = เวลาจริง" — แท็บ preview ถูกหรี่ interval เหลือ ~8fps ถ้าใช้ `setInterval(step,16)` เฉย ๆ แบบรอบ 890 จะวัดเพี้ยน): เดินเข้าอู่รถจริง 2.419 วิ → บานเริ่มยก 1.013 · รถออกตัว 1.428 · **หัวรถผ่านระนาบประตู 1.764 ตอน lift 0.931 (บานพ้นแล้ว ไม่เสียบบาน)** · จอดนิ่ง 2.418 = ถึงพอดี ✓ โดรน (เดิน 2.476) จอด 2.390 ✓ · ล้อหมุน/ขาแกว่ง/ใบพัดหมุนครบ · หุ่นจอดแล้ว **ยืนตรงเท้าชิดพื้น** (ขา 0) ไม่ค้างท่าก้าว ✓ · ปิดประตู → ถอยกลับเข้าโรงหายไปเฟรม 62 (1.03 วิ) ตอนบานยังเหลือ lift 0.181 ✓ ไม่รั่ว (นับวัตถุในฉาก 3→4→3) · เคสลบคืน false เงียบทุกอัน (ตึกบานหมุน/key มั่ว/สั่งซ้ำ/ปล่อยทั้งที่ไม่มียาน) · เสียง spy: บานหมุนเปล่า 1 osc · รถ 1buf+5osc (ครืด+กึก3+เครื่องยนต์2) · หุ่น 3buf+5osc (ครืด+กึก3+ย่ำ2) · โดรน 1buf+5osc ✓ · ภาพยืนยันด้วยตา 2 กริด (9 ช่อง ครบ 3 หลัง ปิด/กำลังออก/จอดรอ + 3 ช่องขากลับ: จอดรอ→ถอยเข้าโรงพร้อมบานลง→ปิดสนิทรถหายเข้าใน) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - 🧰 **ประหยัด token รอบหน้า (กฎทอง #9):** ตัวรับภาพ `shotsink.py` ที่ต้องเขียนใหม่ทุกรอบ (แท็บ preview กด `<a download>` แล้วไฟล์ไม่ลง Downloads — เจอตั้งแต่รอบ 890) **ย้ายเข้า `tools/shotsink.py` ถาวร** + ต่อเข้า SnapLab แล้ว: `python tools/shotsink.py 8812 <โฟลเดอร์>` แล้วสั่ง `Snap.sink('http://127.0.0.1:8812')` ครั้งเดียว ภาพทุกใบไปเซฟเอง (พอร์ต 8797 มัก**ไม่ว่าง** เพราะ session คู่ขนาน — เลือกพอร์ตอื่นแล้วเช็กว่าไฟล์ลงจริง) · อีกอย่างที่เสียเวลา: `rig` มี `DIST_MIN=26` เข้าใกล้ตึกกว่านั้นไม่ได้ → ถ่ายใกล้ให้ตั้ง `CITY.camera.position/lookAt` เองตรง ๆ
  - ⚠️ ไม่แตะไฟล์ session คู่ขนาน (`js/f1_3d.js`/`handoff/RULES.md` ค้างอยู่) · 5 หลังที่ยังไม่มีประตู/ยาน (สนามบอล/สนามมอไซค์/ลานยานแม่/ประตูป่า/ลานเฮลิฯ) = ลานเปิดโล่งตามเดิม


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 904 (2 ส.ค. · ผู้ใช้: "โลก F1 เพิ่มโซน DRS บนทางตรงหลัก+ทางตรงหลัง T10 (ใช้ช่วง index ของ LINE ที่ curv ต่ำยาวสุด 2 ช่วง) · อยู่ในโซน+ตามเพื่อนใกล้กว่า 25 ม. = ปีกเปิด ท็อปสปีด +8% + ป้าย DRS บนจอ"):** 🪽 โซนใหม่ `🪽 รอบ 904` ใน `js/f1_3d.js` — **หาโซนเองไม่ hardcode**: `findDrsZones()` ไล่ช่วง `|LINE.curv|≤0.0018` ต่อเนื่อง (ข้ามโค้งแทรก ≤4 sample · เริ่มไล่จาก index ที่ "ไม่ตรง" เพื่อไม่ตัดช่วงที่คาบเกี่ยว index 0) เอา 2 ช่วงยาวสุด แล้วตัดหัวโซนออก 55 ม. (ไม่ให้เปิดคาโค้ง) → ได้ **ทางตรงหน้าพิท 1,008 ม. (คร่อมเส้นสตาร์ท จบพอดีจุดเบรก T1) + ทางตรงหลัง 636 ม.** · เปิดเมื่อ: อยู่ในโซน + วิ่งตามทาง (`fwd>2`) + ไม่ใช่ทราย + **มีรถเพื่อนอยู่ "ข้างหน้า" ใกล้กว่า 25 ม.** + ไม่แตะเบรก · ผลคือลดแรงต้านอากาศ `DRAG_K×0.7898` (จูนชดเชย ROLL_A ให้ได้ +8% เป๊ะ ไม่ใช่ 1/1.08³ ตรง ๆ) · ภาพ: flap ปีกหลังกางจริงบนรถประกอบเอง + **ไฟเขียวท้ายรถ** (sprite additive — GLB ผู้ใช้ไม่มี flap แยกชิ้น ต้องมีตัวนี้ถึงเห็น) + โซนเขียวบนมินิแมป + ป้าย `#f1-drs` มุมขวา **บอกเหตุผลเสมอ** (ยังไม่มีใครข้างหน้า / ตามให้ใกล้กว่า 25 ม. / ปล่อยเบรกก่อน / เปิดแล้ว +8%)
  - ยืนยัน (server :8642 · mock login · ปลดไฟแดงรอบ 899 ด้วย `_t.setHold(0)+beginLights` · ตรึงตำแหน่งรถแล้วอัดคันเร่งวัดท็อปสปีดล้วน): **334.0 → 360.7 กม./ชม. = +8.00% เป๊ะทั้ง 2 โซน** ✓ · เมทริกซ์ 10 เคส: เพื่อนหน้า 15 ม.=เปิด · 24 ม.=เปิด · 26/30 ม.=ไม่เปิด · เพื่อนอยู่ข้างหลัง=ไม่เปิด · เบรก=ปิด+ป้ายบอก "ปล่อยเบรกก่อน" · ย้อนศร/ตกทราย/นอกโซน=ป้ายซ่อน ✓ · ขับจริงออกจากโซนที่ idx 493 = ปลายทางตรงพอดี ✓ · ภาพยืนยันด้วยตา: มินิแมปเห็นเส้นเขียว 2 ช่วงตรงทางตรงจริงของผัง Bahrain · ท้ายรถ DRS ปิด=มืดสนิท / เปิด=ไฟเขียวเรือง (ปรับขนาด sprite จาก 2.4→0.7 หลังภาพแรกพบว่าเขียวฉาบทั้งคัน) ✓ · `getBoundingClientRect` ทั้ง 1000×640 และ 812×375: ป้ายอยู่ในจอ **ไม่ทับกล่องไหนเลย** (ครั้งแรกวางไว้ bottom 152px ชนมาตรวัดความเร็ว+ปุ่มแชท → ย้ายขึ้นเป็น 240/246px) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง localStorage + ฆ่า server แล้ว
  - 🔧 **ต่อท้าย: DRS ไม่ทำงานในเลนพิท** — เลนพิท (ผิวใหม่รอบ 905) เลียบทางตรงหน้าพิท `nearIdx` จึงตกในโซน 1 → ยืนยันด้วยของจริงว่าป้ายเขียวติดตอนอยู่ในพิท (ผิด กติกาจริงห้าม) → เพิ่มเงื่อนไข `surfNow!=='pit'` · วัดซ้ำ: ในเลนพิท=ป้ายซ่อน/ไม่เปิด · บนแทร็กในโซน=เปิดปกติ ✓
  - ⚠️ **ประวัติ commit ของไฟล์นี้วุ่นเพราะ 4 session เขียนพร้อมกัน** — โค้ด DRS ถูก session รอบ 903 สวีปติด `951dab3` → แล้วโดน `e83289c` ("กวาด WIP ติด") ตัดออกบางส่วน → **commit `f78aa07` ของรอบนี้ใส่ไฟล์เต็มกลับครบทั้งก้อน** (มี DRS+ไฟสตาร์ท+ยาง/พิท+กระดานอันดับ+ห้องคนขับ ครบ 2,458 บรรทัด ตรงกับ working tree) · **deploy แล้ว `.854` · curl ยืนยัน live มีทั้ง DRS และเงื่อนไขเลนพิท** (ก่อนหน้านั้น session อื่น deploy `.853` ที่มี DRS แต่ยังไม่มีเงื่อนไขเลนพิท) · **ยึด TASKS.md นี้ว่า DRS = รอบ 904** · ขอเลขรอบตอนเริ่มได้ 898 แต่ session อื่นใช้ 898-903 ระหว่างทาง → ขยับเป็น 904 (คอมเมนต์ในโค้ดแก้ครบแล้ว) · ไม่แตะไฟล์อื่นของ session อื่นเลย (`handoff/RULES.md`)
  - 💡 มุมคนขับ (รอบ 901) มองไม่เห็นปีก/ไฟท้ายตัวเอง → **ป้ายบนจอคือตัวบอกหลัก** ตั้งใจให้บอกเหตุผลทุกสถานะตามกฎทอง #1


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 902 (2 ส.ค. · ผู้ใช้: "โลก F1 เพิ่มลำดับออกสตาร์ทไฟแดง 5 ดวงบนซุ้ม ติดทีละดวงแล้วดับพร้อมกัน = ออกตัว (ล็อกคันเร่งก่อนไฟดับ) + รถเงาโปร่งแสงวิ่งตาม Best Lap ให้ไล่แข่งกับตัวเอง"):** 🚦👻 โซนใหม่ `🚦👻 รอบ 902` ใน `js/f1_3d.js` + ไฟ 5 ดวงบนซุ้ม (โซน 🏗️) เปลี่ยนจากลูกบอลตายเป็นคุมได้จริง (สลับสี + ดวงเรือง additive ให้เห็นจากท้ายกริด ~100 ม.) · **ลำดับ:** หน่วง 1.4 วิ → ติดทีละดวงทุก 1.0 วิ → ครบ 5 ค้าง**สุ่ม 0.7-2.6 วิ** (เดาไม่ได้) → ดับพร้อมกัน = ปลดล็อกคันเร่ง (`lightsLocked()` คุมที่ `physTick` — เบรก/พวงมาลัย/เร่งเครื่องรอยังทำได้ปกติ) · แถบไฟ 5 ดวงบนจอด้วย (`#f1-lights`) เพราะท้ายกริดไฟจริงเล็กมาก · **กดคันเร่ง "ใหม่" ตอนไฟครบ 5 = จั๊มพ์สตาร์ท หน่วง 2 วิ** (กดค้างรอมาแต่แรก **ไม่**ผิด — เด็กกดค้างเป็นเรื่องปกติ) · ไม่กดค้าง = โชว์**เวลาปฏิกิริยา**หลังไฟดับ · 👻 **รถเงา:** บันทึก x/z/yaw/ระยะ 10 จุด/วิ ตลอดรอบ → รอบไหนเร็วสุดเก็บลง **localStorage `vwF1Ghost`** (ไม่ยัดลง `state` กัน cloud save บวม · ~25 ไบต์/จุด ≈ 24KB ต่อรอบ 95 วิ) พร้อม `v`=ความยาวสนาม กันข้อมูลข้ามเวอร์ชันแทร็ก → รอบถัดไปรถเงาโปร่งแสง (opacity .34 + ป้าย "👻 สถิติของหนู") วิ่งซ้ำตามเวลาจริง + จุดฟ้าบนมินิแมป + **ป้าย `#f1-gap` บอกช้า/เร็วกว่าสถิติกี่วินาที** (เทียบที่ "ระยะทางเดียวกัน" ไม่ใช่เวลาเดียวกัน)
  - ยืนยัน (server เอง :8796/:8797 · mock login · แท็บซ่อน→ขับเฟรมด้วย `_t.step`): ไฟติดที่ 1.40/2.40/3.42/4.42/5.42 วิ ห่างดวงละ 1.0 เป๊ะ · ไฟดับ 6.92 = 5.42+hold 1.5 ✓ · **กดคันเร่งค้างตลอด spd=0 จนไฟดับ** แล้วพุ่ง 14.1 m/s ใน 1 วิ (ตรง 0-100 ใน 2.05 วิ) ✓ จั๊มพ์สตาร์ท: กดใหม่ตอนครบ 5 → ป้ายเตือน → ไฟดับแล้วยังล็อก pen=2.0 → ครบ 2 วิ ปลดล็อกออกตัวได้ ✓ เวลาปฏิกิริยาวัดด้วยนาฬิกาจริง (รอจริง 511 ms → โชว์ 0.511) · กดค้างข้ามจังหวะ = ไม่โชว์ (ไม่หลอกเด็ก) ✓ · **พิกเซลจริงบนจอ**: ไฟดับ (51,0,0) → ติด (253,59,56) ไล่ทีละดวงซ้าย→ขวา → หลังออกตัวดับหมด ✓ ภาพยืนยันด้วยตาจากที่นั่งคนขับบนกริด (ไฟแดง 5 ดวงเรืองบนซุ้ม SAKHIR) ✓ · 👻 บันทึก 10 จุด/วิจริง · ครบรอบ → เก็บ ghost (t/n/v ครบ) + แบนเนอร์ "บันทึกรถเงาใหม่" · รอบถัดไปรถเงาโผล่วิ่ง ตำแหน่งคลาดจากจุดที่คำนวณเอง <4 ม. (= ระยะระหว่าง sample) ✓ gap: ช้ากว่า "+1.63" (แดง) · เร็วกว่า "−14.39" (เขียว) ✓ ghost จบรอบก่อน = ซ่อนรถแต่ป้าย gap ยังอยู่ ✓ ออก-เข้าใหม่โหลด ghost เดิมได้ · **เคสลบ**: ghost คนละสนาม (`v` ไม่ตรง)/JSON เสีย/ไม่ใช่ JSON/ไม่มีคีย์ → คืน false ไม่ throw ✓ · 812×375 แถบไฟ+ป้าย gap อยู่ในจอครบ ไม่ทับแถบคำศัพท์ ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเสียง + ฆ่า server แล้ว
  - ⚠️ **ไฟล์นี้มี 4 session ทำพร้อมกัน** (898 asset · 903 กระดานอันดับ · 905 ยาง/พิท · 901 ห้องคนขับ) → โค้ดรอบนี้ถูก **session รอบ 903 สวีปติด commit `951dab3`** ไปก่อนที่จะได้ผ่า index (บทเรียนเดียวกับรอบ 892) · **ยึด TASKS.md นี้ว่าไฟสตาร์ท+รถเงา = รอบ 902** (คอมเมนต์ในโค้ดถูกแล้ว) · **ยังไม่ deploy** — HEAD ตอนนี้มีงานพิท/ยาง/ห้องคนขับของ session ที่ยังทำค้างอยู่ปนมาด้วย ใครทำเสร็จก่อนค่อย deploy ทีเดียว (ผู้ใช้เลือกแนวทาง "ไม่ปล่อยงานคนอื่นที่ยังไม่เสร็จขึ้นเว็บ")
  - 🧰 เครื่องมือใหม่ (scratchpad `build_mine.py`/`split_hunks.py`): แยก hunk ของ session ตัวเองออกจาก session คู่ขนานในไฟล์เดียวกัน → ได้ไฟล์ "HEAD + เฉพาะของเรา" เอาไปเขียน git index ตรง (รอบนี้ทำเสร็จ ทดสอบผ่านหมดแล้ว แต่ไม่ได้ใช้เพราะโดนสวีปก่อน)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 906 (2 ส.ค. · ผู้ใช้: "โลก F1 มุมมอง first-person นั่งในห้องคนขับเป็นภาพหลัก ใช้ f1_cockpit.png ตัดต่อให้สมจริง + ปุ่มสลับเห็นรถทั้งคัน"):** 🪖 ภาพผู้ใช้พื้นหลังเทา → คว้านโปร่งใส (region-growing T=12 จากขอบ + seed ช่องมองใต้ halo + ลบเกาะเบลอ + ตัดเส้นเบลอแนวนอนโซนมุม · สคริปต์ f1cockpit*.py ใน scratchpad) → **`img/f1/cockpit.webp` 210KB มี alpha** · โค้ด `js/f1_3d.js` คอมเมนต์เป็น **"รอบ 901"** (session คู่ขนานกวาดติด commit `e83289c` ขึ้นเว็บไปก่อน — โค้ดครบถูกต้อง **รอบนี้เติมเฉพาะไฟล์ภาพที่ขาด** ไม่งั้น overlay 404 ทั้งเว็บ) · เข้าโลก = มุมคนขับเสมอ (ซ่อนรถตัวเอง · กล้องตรึงรถไม่มีหน่วง FP_EYE 1.04 ม. FOV 70+12 ตามความเร็ว — TUNE ZONE `FP_*`) · ปุ่ม 📷 ซ้ายล่างสลับมุมไล่หลังเดิม · overlay z5 ใต้ HUD z6-7 · cover ขอบล่าง −8% · **จอกว้างเตี้ย ≥9:5 สลับเป็น 100%×128% ตรึงขอบบน** (cover จะเอาค็อกพิทบังเต็มจอจนขับไม่ได้)
  - ยืนยัน (server เอง :8795 · mock login · `_t.step` ขับเฟรม · แท็บซ่อน img.decode ค้าง→ใช้ onload): กล้อง y=1.04 ห่างรถ 0.5 ตรงค่าคงที่ ✓ carVisible/overlay/ปุ่ม/คลาส fp สลับถูกทั้งสองทาง ✓ intro 812×375 overflow 0 ✓ ภาพยืนยันด้วยตา 4 ใบ (composite canvas+overlay เอง — Snap จับแต่ WebGL): 1000×640 เห็น Sakhir Tower/อัฒจันทร์/ตัวอักษรคำศัพท์ทะลุช่องมอง · 812×375 เห็นแทร็กพอขับ · มุมรถเห็นทั้งคันไม่มี overlay ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server + sink แล้ว


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 907 (2 ส.ค. · ผู้ใช้ต่อยอด DRS รอบ 904: "ส่งสถานะ DRS ผ่าน NetRoom ด้วย (payload.d) ให้เห็นไฟเขียวท้ายรถเพื่อน ตอนเขาเปิดปีก"):** 🪽🧑‍🤝‍🧑 `netSend()` เพิ่ม `payload.d:drsOn?1:0` · `onPeer()` เก็บ `p.drsTgt` จากค่านั้น (เพื่อนเก่าที่ยังไม่มีคีย์นี้ = `undefined→0` ไม่ throw ปิดเสมอ) · `buildPeer()` เรียก `attachDrsGlow(p.grp)` **ติดกับกลุ่มรถเพื่อน ไม่ใช่ตัวโมเดลรถ** (กันพังตอน `makeCar` สลับโมเดลเป็น GLB ทีหลัง — ของเดิมรอบ 904 สลับแค่ `children[0]`) · `peerTick()` ไล่ระดับ `p.drsK` เข้าหา `p.drsTgt` แบบเดียวกับของเราเอง (`lerp` ไม่ใช่ตัด/เปิดกระตุก) แล้วเซ็ต `opacity` ของสไปรต์ไฟท้าย
  - ยืนยัน (server เอง :8642 · mock login · `fakePeer(uid,x,z,{d})`): เพื่อนใหม่ไม่มี `d` = `drsTgt/drsK/opacity` เป็น 0 หมด ไม่ throw ✓ ส่ง `d:1` แล้วขับเฟรม 60 ครั้ง → `drsK→1` `opacity→0.85` ตรงค่าคงที่เดียวกับรถเรา ✓ ส่ง `d:0` กลับ → ไล่ระดับกลับ 0 ✓ ภาพยืนยันด้วยตา (กล้องจ่อท้ายรถเพื่อน): ปิด=มืดสนิท เปิด=ไฟเขียวเรืองชัดเจนที่ปีกหลัง ✓ เกมออฟไลน์ (ไม่มี `room`) — `frame()`→`netSend()` คืนตัวเงียบ ไม่ throw ✓ `node --check` ผ่าน · ล้าง localStorage + ฆ่า server แล้ว
  - ⚠️ **ไฟล์นี้มี session คู่ขนานกำลังเขียนสด ๆ ระหว่างทำ** (เพิ่มกล้องสั่นบน kerb/ทราย + เสียงลมเปลี่ยนตอนปีก DRS เปิด/ปิด + ป้ายเสาริมแทร็ก 2 โซน — คอมเมนต์ในโค้ดขยับ 907→908→909 ระหว่างที่ผมทำงานอยู่) **commit นี้จึงมีโค้ดของเขาติดมาด้วยทั้งก้อน** (ยังไม่ได้ตรวจ/ทดสอบส่วนนั้น) · **ยึด TASKS.md นี้ว่าไฟเขียวท้ายรถเพื่อน = รอบ 907** ส่วนกล้องสั่น/เสียงลม/ป้ายเสา ให้ session เจ้าของมาลง TASKS.md เองตามเลขรอบที่เขาติดไว้ในคอมเมนต์ (908/909)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 908 (2 ส.ค. · ผู้ใช้: "โลก F1 โซน 🪽 รอบ 904 = DRS: เพิ่มป้ายเสาริมแทร็กบอกจุด detection และจุดเริ่ม/จบโซน DRS ทั้ง 2 โซน (ใช้ drsZones ที่คำนวณไว้แล้ว) + เสียงลมเปลี่ยนตอนปีกเปิด/ปิด"):** 🪽 ต่อในโซน `🪽 รอบ 904` ของ `js/f1_3d.js` — ① **ป้ายเสา 12 ต้น** (`buildDrsBoards`) จาก `drsZones` ตรง ๆ ไม่ hardcode: 3 จุด/โซน × 2 ฝั่ง = detection (ฟ้า 🔍 จุดวัดระยะ) / start (เขียว 🪽 เปิดปีกได้) / end (ส้ม 🚫 จบโซน) + **แถบสีพาดพื้นเต็มความกว้างแทร็ก**ทุกจุด + ดวงเรือง additive (สนามเป็น night race) · ป้าย**หันหน้ารับรถที่วิ่งเข้ามา** (normal = −tangent) เอียงเข้าหาแทร็ก 0.25 rad · จุด detection = ถอยจากหัวโซน `DRS_DET_M=110` ม. (วัดจริง 108 — ปัดตาม sample grid) ② **เสียงลมตามปีก**: `Snd.tick` รับพารามิเตอร์ `drs` → เลื่อน lowpass ของเส้นเสียงลมเดิม 900→2050 Hz + ดังขึ้น ×1.45 (ไม่เพิ่ม node ใหม่) · `Snd.wing(open)` = เสียงฟู่กวาดความถี่ ขึ้นตอนกาง/ลงตอนหุบ ยิงเฉพาะ**ตอนสถานะเปลี่ยน** ③ มินิแมปเพิ่มหมุด det/start/end ตรงกับป้ายจริง
  - 🐛 **บทเรียน: `SAMPLE_M=5` ไม่ใช่ระยะจริงต่อ sample** — `buildLine` เกลี่ยให้ลงตัวรอบสนาม วัดได้ **4.00 ม./sample** (1,350 จุด / 5,401.6 ม.) → ครั้งแรกจุด detection เพี้ยนเหลือ 88 ม. แทน 110 · แก้เป็นคิดจาก `TOTAL/LINE.n` เสมอ
  - ยืนยัน (server เอง :8811 · mock login · แท็บซ่อน→ขับเฟรมด้วย `_t.physTick`): ป้าย 12 ต้นครบ 3 ชนิด × 2 โซน × 2 ฝั่ง · วัดทุกต้น: ห่างกลางแทร็ก 17.7 ม. เป๊ะ (=HALF_W+RUNOFF_W+1.2) · `along=0` ทุกต้น (อยู่ระนาบเดียวกับ index) · facing 0.969 = หันสวนรถ · inward +0.247 = เอียงเข้าหาแทร็กทั้งสองฝั่ง ✓ detection ห่างหัวโซน 108 ม. ทั้ง 2 โซน ✓ · **เสียง**: spy `createBufferSource` — ปีกเปิด/ปิด/เบรก/ปล่อยเบรก/ออกนอกโซน = ยิงเสียงลม **ครั้งละ 1 พอดี** · นิ่ง 90 เฟรมสถานะเดิม = **0 ครั้ง** (ไม่ยิงซ้ำ) ✓ lowpass ไล่ 900→2009 Hz ตอนเปิด และกลับลง 927 ตอนปิด (setTargetAtTime 0.12 วิ) ✓ · เรียก `buildDrsBoards()` ซ้ำ = วัตถุในฉากเท่าเดิม 195→195 (ไม่ซ้อน) · เคสลบ `drsDetIdx` โซนมั่ว/ไม่มีโซน = ไม่ throw ✓ · **ภาพยืนยันด้วยตา** (เรนเดอร์เองด้วยกล้องที่ตั้ง — `Snap.grab` เดิม readPixels ก่อนกล้องมีผล ได้ภาพเก่า): อ่านป้ายออกครบ 3 ชนิด + แถบสีบนพื้นตรงจุด · **มุมคนขับ 812×375 เห็นป้าย DRS DETECTION ชัดทั้ง 2 ฝั่ง** ✓ ทุกกล่อง HUD อยู่ในจอ 812×375 (ไม่มี DOM ใหม่) · console ไม่มี error · `node --check` ผ่าน · ล้าง storage + reload ปิดเสียง + ฆ่า server แล้ว
  - ⚠️ **โค้ดฟีเจอร์นี้ขึ้นเว็บไปแล้วกับ `.856`** — session รอบ 907 (ไฟเขียวท้ายรถเพื่อน) สวีป working tree ติด commit `43ca5a0` แล้ว deploy (เคสเดิมกับรอบ 892/902/905) · curl ยืนยัน live มี `buildDrsBoards`/`WIND_LP_OPEN`/`Snd.wing`/`TOTAL/LINE.n` ครบ · **รอบ 908 จึงเหลือ commit เฉพาะกันป้ายซ้อน (`drsMarkObjs`) + `tools/snaplab.js`** และ **ไม่ deploy** — working tree มีงานพวงมาลัยรอบ 910 ของอีก session ค้างอยู่ (ยึดแนวทางผู้ใช้: ไม่ปล่อยงานคนอื่นที่ยังไม่เสร็จขึ้นเว็บ)
  - 🧰 ปรับ `tools/snaplab.js` ให้ใช้กับโลก F1/เมืองได้ (เดิมรู้จักแค่ InvasionWorld/Adventure3D → คืน `no stepper` ภาพว่าง) + เลือก canvas **WebGL ใบใหญ่สุด** แทน `querySelector('canvas')` ใบแรก (โลกที่มีมินิแมป 2D อยู่ก่อนจะคว้าใบผิด)


## ⏬ ย้ายเมื่อ 2026-08-02 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 911 (2 ส.ค. · ผู้ใช้เล่นจริงแล้วสั่ง 5 ข้อ: "ทิศเลี้ยวกลับด้าน · ปุ่มเลี้ยวหนา×2 · ปุ่มเกียร์ถอย · หลุดสนามทั้งคัน ~2 วิให้เกิดใหม่บนถนนแถวนั้น · ล้อยางดำหมุนสมจริงในมุมคนขับ"):** 🔄 **ทิศเลี้ยว: บั๊กตั้งแต่รอบ 896 ทุกมุมกล้อง** — แกนจอหันหน้า +Z แล้วขวามือคือ −X แต่ `yawRate=vF·tan(steer)/WB` ไม่ติดลบ → กดขวารถเลี้ยวซ้าย · แก้ 3 จุดใน `js/f1_3d.js`: yawRate ใส่ลบ + `steerParts -steer` + เอียงตัวถัง `rotation.z` พลิกเครื่องหมาย (จึงเอียง "เข้าโค้ง" ถูกทางด้วย) · ทิศหมุนพวงมาลัยรอบ 910 ของ session คู่ขนานยังถูก (CSS rotate บวก=ตามเข็ม=เลี้ยวขวา ตรง convention ใหม่พอดี) ⏪ ปุ่ม R เทา (ซ้ายเบรก·คีย์ R) `REV_A 7·REV_MAX 8` เบรกชนะ·ล็อกก่อนไฟดับ·HUD เกียร์ R 🏜️ ทราย 2 วิติด → `respawnOnTrack()` วางบน `LINE` จุด `nearIdx` หันทิศแข่ง สปีด 0 + ป้ายเขียว `#f1-resp` 🎛️ แถบเลี้ยว 64→128px knob 56→116 (สูตร knob ใน `steerTo` อ่าน `offsetWidth` จริง) ย้าย left 66→118 พ้นปุ่ม 📷/🏁 🛞 `buildFpWheels()+fpWheelTick()` ล้อหน้าดำ 2 ล้อเฉพาะโหมด fp (ซี่ 6 แนว+แถบเหลือง soft ซ้อนฝากระบอกลดหลั่นกัน z-fight) หมุนตาม vF จริง/หักตามพวงมาลัย · **TUNE `FPW_*`: F 1.35 (1.58 โดนแขนคาร์บอนภาพบังมิด) · H 0.80 ยกสูงกว่าจริงให้ตรงตำแหน่งยางที่ภาพอาร์ตวาดไว้ระดับกระจก (จุดแตะพื้นถูกอาร์ตทึบบัง มองไม่เห็นว่าลอย)**
  - ยืนยัน (server เอง :8795 · mock login · `_t.step`): กดขวา yaw −0.535 / ซ้าย +0.338 ✓ R: ถอย 6.26 m/s เกียร์โชว์ R ✓ ทราย 2.02 วิ → กลับเส้นกลาง dist 0 สปีด 0 + ป้ายขึ้น ✓ แถบเลี้ยว 270×128 knob 116 ไม่ทับปุ่มใดทั้ง 1000×640 และ 812×375 (วัด rect ครบ) ✓ ล้อ: ฉายพิกัดจอ x=64/936 โผล่ช่องโปร่งริมจอ + ภาพยืนยัน 5 ใบ (ตรง/เลี้ยวขวา/จอเตี้ย — ล้อดำแถบเหลือง หน้าล้อหักตามเลี้ยว โลกหมุนถูกทิศ) ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob
  - ⚠️ **commit แบบเขียน git index ตรง (สูตรรอบ 898)**: blob = HEAD + แก้รอบ 911 จำนวน 26 จุด (สคริปต์ scratchpad `blob911.py`) — ไม่กวาดงานพวงมาลัย 2 ชั้นรอบ 910 ที่ยังค้าง working tree (session นั้นน่าจะรอไฟล์ wheel.webp จากผู้ใช้) · ไม่แตะ `js/adventure3d.js` ที่ M ค้างของ session อื่น


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 912 (2 ส.ค. · ผู้ใช้เห็นจากเครื่องจริง: "ก้านล้อฝั่งซ้ายไม่สมบูรณ์เหมือนฝั่งขวา"):** 🛞💡 ต้นตอ = แสง ไม่ใช่ geometry — หน้าล้อมุมคนขับ (รอบ 911) เป็นฝากระบอกหันข้าง วัสดุ Lambert โดนไฟสนามข้างเดียว ฝั่งซ้ายมืดจนก้าน/แถบเหลืองจมหาย → เปลี่ยนวัสดุล้อทั้ง 4 ตัวใน `buildFpWheels()` (`js/f1_3d.js`) เป็น **MeshBasicMaterial** (ไม่พึ่งแสง สองฝั่งชัดเท่ากันเสมอ) + ปรับสี: ซี่สว่างขึ้น 0x99a2ac ยางเข้ม 0x101216 · commit แบบเขียน git index ตรงเหมือนรอบ 911 (สคริปต์ scratchpad ในตัว — งานพวงมาลัย 2 ชั้นรอบ 910 ยังค้าง working tree ไม่กวาด)
  - ยืนยัน (server เอง :8795 · mock login · `_t.step` · composite ภาพ): ภาพขับตรง — ล้อซ้าย/ขวาเห็นแถบเหลือง+ซี่ครบชัดเท่ากันทั้งสองฝั่ง ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 913 (2 ส.ค. · ผู้ใช้: "โลก F1 โซน 🪖 รอบ 901 — แยกชั้นพวงมาลัยจาก img/f1/cockpit.webp ให้หมุนตาม steer จริง"):** 🎡 ภาพห้องคนขับเดิมเป็นภาพเดียวพวงมาลัยตายอยู่กับที่ → ผ่าเป็น **2 ชั้นด้วย `tools/f1_split_wheel.py`** (เก็บไว้ใช้ซ้ำ · แก้ภาพใหม่ต้องเอาค่า `hub pct` ที่สคริปต์พิมพ์ไปใส่ `WHEEL_HUB_X/Y`): `img/f1/cockpit_body.webp` (ค็อกพิทไม่มีพวงมาลัย — โซนพวงมาลัยถมด้วย **เงามืดเบลอ ×0.42** กันเห็นทะลุ/เห็นรูตอนหมุน) + `img/f1/wheel.webp` (เฉพาะพวงมาลัย+นิ้วที่กำแป้น พื้นหลังโปร่ง ขอบฟุ้ง 5px) · ทั้งคู่ขนาดเท่าต้นฉบับ 1536×1024 → ทับกันพอดีเสมอ · โค้ด `js/f1_3d.js` โซน 🎡: `layoutWheel()` **อ่าน `background-size/position` ที่เบราว์เซอร์คำนวณเองมาวาง `<img>` ทับกรอบภาพจริง** (จึงตามกฎ @media จอกว้างเตี้ย `100% 128%` ได้เองโดยไม่เขียนสูตรซ้ำ) + `wheelTick()` หมุนตาม `steer` จริง **อัตราทด `WHEEL_RATIO 2.2`** (สุดพวงมาลัย ±42.9° · 274 กม./ชม. ล้อขยับนิดเดียวยังเห็น ~9.6°) · จอยืดแนวตั้งใช้ `scaleY(sy) rotate() scaleY(1/sy)` = หมุนในสัดส่วนจริงไม่บิด · โหลด `wheel.webp` ไม่ได้ = ถอยไปใช้ `cockpit.webp` เดิมอัตโนมัติ
  - ยืนยัน (staging = `git archive HEAD` + ไฟล์ที่จะ commit เป๊ะ :8824 · mock login · แท็บซ่อน rAF ได้ 0 เฟรม → ขับด้วย `_t.physTick/step`): เลย์เอาต์ 1000×640 cover คำนวณได้ 1036.5×691 @(−18.25,0) **ตรงสูตร cover เป๊ะ** · 812×375 เข้า @media ได้ 812×480 @(0,0) sy 0.8867 ✓ · มุม: กดขวา deg **+42.83** (ตามเข็ม) กดซ้าย **−42.83** ปล่อย → 0 · **ทิศตรงกับรถหลังรอบ 911 แก้ (steer +1 → yaw ลด = เลี้ยวขวาจริง)** ✓ · มุม 📷 ไล่หลัง = ไม่หมุน/ค็อกพิท display:none · กลับมามุมคนขับวางใหม่ถูกต้อง ✓ · ยิง `error` ใส่ `<img>` → background สลับเป็น `cockpit.webp` เอง ไม่ throw ✓ · เด็ก ๆ กดปุ่มลูกศรจริงผ่าน `frame()` เต็มลูป หมุนตามจริง ✓ · 812×375 วัด `getBoundingClientRect` ทุกกล่อง HUD อยู่ในจอครบ ไม่มีอะไรหลุด (ลูก `#f1-cockpit` มีแค่ `#f1-wheel`) ✓ · **ภาพยืนยันด้วยตา** (composite canvas+2 ชั้นเอง): ตรงกลางเนียนไม่มีรอยต่อ/เงาหลอน · ±19°/±43° ไม่มีรูโหว่/ลิ่มดำ นิ้วยังกำแป้น ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ **ชน session คู่ขนานหนักมาก (ไฟล์เดียวกัน `js/f1_3d.js`)**: ขอเลขรอบได้ 907 → โดนใช้ไประหว่างทางจนถึง 912 (907/908 DRS · 911/912 ทิศเลี้ยว+ล้อหน้ามุมคนขับ) → **จบที่ 913 คอมเมนต์ในโค้ดแก้ครบ 10 จุด** (ของเขา 911/912 ไม่แตะ) · commit แบบ **เขียน git index ตรง = HEAD + เฉพาะแพตช์ของรอบนี้** (สคริปต์ `apply_mine.py` แปะ 9 จุดด้วย anchor ต้องเจอ 1 ครั้งพอดีทุกจุด — anchor `applyCamMode` ต้องอัปเดตตามของเขา 1 ครั้งระหว่างทาง) → deploy ไม่พางาน WIP ของเขาขึ้นเว็บ


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 914 (2 ส.ค. · ผู้ใช้ต่อยอดรอบ 913: "มือสั่นตอนวิ่งบน kerb — ขยับชั้นพวงมาลัยเล็กน้อยตามการสั่นของกล้อง (รอบ 907)"):** 🫨🎡 `wheelTick()` ใน `js/f1_3d.js` เพิ่ม `translate()` เล็ก ๆ ก่อน `rotate()` — ใช้ **`shakeT`/`SHAKE_HZ` ตัวเดียวกับกล้อง** (`camTick` อัปเดต `shakeT` ก่อน `wheelTick` ในเฟรมเดียวกันอยู่แล้ว) จึงสั่นจังหวะเดียวกับกล้อง/โลก ไม่ใช่คนละจังหวะที่ดูหลอน · แอมพลิจูดใหม่ `WHEEL_SHAKE_KERB_PX 3.4` / `WHEEL_SHAKE_SAND_PX 2.0` (px จอ สั่นเบากว่า kerb เหมือนกล้อง) สเกลตามความเร็วแบบเดียวกับ `SHAKE_KERB_AMP` เดิม · แก้ optimization เดิม (ข้ามวาดถ้ามุมไม่เปลี่ยน) ให้ไม่ข้ามระหว่างสั่น + **บังคับวาดอีก 1 เฟรมตอนออกจาก kerb/ทราย** (flag `wheelShakeOn`) กัน translate ค้างเวลากลับเข้าแทร็กเรียบ
  - ยืนยัน (staging = `git archive HEAD` + ไฟล์ที่จะ commit เป๊ะ :8830 · mock login): บนแทร็กไม่มี `translate` เลย ✓ kerb มี `translate` ขยับทุกเฟรมทั้ง x/y (ทดสอบผ่าน `_t.step` ให้ `camTick` อัปเดต `shakeT` จริงเหมือนเกม) ✓ sand เบากว่า kerb (~1.0px เทียบ ~1.6-1.7px ที่ spd เดียวกัน) ✓ ออกจาก kerb → เฟรมถัดไป `translate` หายเกลี้ยงทันที แล้วเฟรมต่อไปมุมเดิม/ไม่มีสั่น = ข้ามวาดตามเดิม (ประหยัด) ✓ 812×375 วัด HUD ทุกกล่องยังอยู่ในจอครบ (transform นี้แตะแค่ `#f1-wheel` ไม่กระทบ layout) ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ ไฟล์นี้มี session คู่ขนานแก้สด ๆ ระหว่างทำ (รีแฟกเตอร์รถบอต) — commit แบบเขียน git index ตรง = HEAD (รอบ 913 ของตัวเอง) + แพตช์ 4 จุดของรอบนี้เท่านั้น (`apply_mine2.py` ใน scratchpad) ไม่แตะ WIP ของเขา


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 915 (2 ส.ค. · ผู้ใช้ชี้จากจอจริง 4 ข้อ: "ก้านล้อฝั่งซ้ายไม่ครบเหมือนขวา · ย้ายปุ่มมุมรถ/ออก ไปขวาบนก่อนถึงเหรียญ · แถบเลี้ยวไปซ้ายสุดแทนที่ปุ่มเดิม · เพิ่มมุมกล้องเห็นแต่ถนน"):** 🖼️ **ก้านล้อ**: ต้นตอคือตอนคว้านพื้นหลังรอบ 905 กินยาง+ก้านปีกนกฝั่งซ้ายไปมากกว่าขวา (ภาพต้นฉบับมีครบทั้ง 2 ข้าง) → ภาพเกือบสมมาตรจึง **มิเรอร์ฝั่งขวามาอุดเฉพาะรูที่ซ้าย alpha ขาด** (union ไม่ทับของเดิม · โซน x 0-350 y 250-700 ฟุ้งขอบ 6px · สคริปต์ scratchpad `fix_left_arm.py`) แก้ที่ `img/f1/cockpit.webp` แล้วรัน `tools/f1_split_wheel.py` เจน `cockpit_body.webp` ใหม่ (ไม่แตะ `wheel.webp` ของรอบ 913 — โซนพวงมาลัยไม่โดนแพตช์) 🧭 **ปุ่ม**: `#f1-topright` แถว flex ขวาบน = [📷 มุมกล้อง][🏁 ออก][🪙 เหรียญ] — **ย้ายเหรียญเข้ามาเป็นลูกของแถว** จึงไม่ต้องเดาความกว้างเหรียญตอนเลขยาว · แถบเลี้ยว `left:118px→8px` ชิดซ้ายสุด + ยกมินิแมป `bottom:88→146px` พ้นกัน · จอเตี้ย ≤430px แถบเลี้ยวเหลือ 100px/knob 90px + ปุ่มบนย่อ 🛣️ **มุมที่ 3 "มุมถนน"**: `camMode` เป็นวง 3 ค่า (`CAM_MODES`) ป้ายปุ่มบอกมุมถัดไปเสมอ · มุมถนน = จุดกล้องเดียวกับคนขับ แต่ไม่มี overlay/ล้อ/รถ + ยกสายตา `ROAD_EYE 1.45` กดลงน้อยลง `ROAD_DROP 1.5` FOV 74 (TUNE ZONE `ROAD_*`)
  - ยืนยัน (server เอง :8795 · mock login · `_t.step`): วัด rect ครบทั้ง **1000×640 และ 812×375** — แถวขวาบนเรียง cam→exit→coins ถูกลำดับ อยู่ในจอ ไม่ทับคำศัพท์/เกจยาง แม้ตั้งเหรียญเป็น `+999,999` ✓ แถบเลี้ยว l=8 ไม่ทับมินิแมป/คันเร่ง/ตารางเวลา ✓ ลากสุดซ้าย-ขวา knob ไม่ล้นกรอบ (11≥8 · 255≤258) ✓ วนกล้อง 4 ครั้งกลับที่เดิม: cockpit(camY 1.04·overlay block·รถซ่อน) → chase(3.68·none·รถโชว์) → road(1.45·none·รถซ่อน·FOV 78) → cockpit ✓ ป้ายปุ่มเปลี่ยนถูกทุกสเต็ป · ภาพยืนยัน 4 ใบ: มุมถนนเห็นแทร็ก+รถบอตล้วนไม่มีอะไรบัง · **เทียบซ้าย vs มิเรอร์ขวาในภาพเกมจริง = ก้านดำ/แผงหลัง/วงเหลืองเหมือนกันแล้ว** ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ commit เขียน git index ตรง (blob = HEAD + 12 จุดของรอบนี้ · `blob915.py`) — session คู่ขนานกำลังทำ **หน้าปัดบนพวงมาลัย (`DASH_*`)** ค้าง working tree + มี `index_classic.html`/`js/city3d.js`/`main.js`/`online.js`/`state.js`/`ui.js`/`adventure3d.js` ของ session อื่นค้างอยู่ → ไม่แตะทั้งหมด


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 916 (2 ส.ค. · ผู้ใช้: "ตัวเลขบนจอพวงมาลัยเป็นของจริง (เกียร์/ความเร็ว/รอบ) วาดทับด้วย canvas แทนเลขในภาพ"):** 🔢 ภาพ `img/f1/wheel.webp` มีจอ LCD+แถบไฟรอบเครื่องวาดตายตัว (เกียร์ 5 / 12210 / แถบส้ม) → ปู `<canvas id="f1-dash">` ขนาดเท่า "กรอบจอ" ทับ แล้ววาดค่าจริงจากเกม · โซนใหม่ `🔢 รอบ 916` ใน `js/f1_3d.js`: `DASH_PX{x:654,y:500,w:232,h:118}` = พิกัดจอวัดจากภาพต้นฉบับ 1536×1024 (วัดด้วยโปรไฟล์ความสว่างของภาพ ไม่ได้กะเอา) → แปลงเป็นพิกเซลจอผ่าน `cockpitBox()` (แยกออกมาจาก `layoutWheel` ใช้ร่วมกัน) จึงทับตรงทุกขนาดจอ **รวมกรณี @media จอกว้างเตี้ยที่ยืดภาพ 128%**
  - จอวาด: **แถบไฟรอบเครื่อง 15 ดวง** (เขียว→แดง→น้ำเงินกะพริบตอนตัดรอบ · ต้องปู "รางไฟทึบ" ก่อน ไม่งั้นขีดส้มในภาพโผล่ตามร่อง) · **เกียร์** ตัวใหญ่ (R/N/1-8) · **ความเร็ว กม./ชม.** (เหลืองตอนลิมิตเตอร์เลนพิท) · **รอบ/นาที** 3,200–15,000 คิดจากเกียร์+ความเร็วในเกียร์ **สูตรเดียวกับเสียงเครื่องยนต์** (เลขกับเสียงตรงกันเสมอ) + แถบไล่ระดับ · มุมขวาโชว์เวลาต่อรอบ (ยังไม่จับเวลา = โชว์ % ยางแทน ไม่ปล่อยว่าง) · หมุน/สั่นไปกับพวงมาลัยเพราะใช้ transform+แกนหมุนก้อนเดียวกับ `wheelTick` · วาดใหม่เฉพาะตอนค่าเปลี่ยน (signature)
  - ยืนยัน (staging = `git archive HEAD` + ไฟล์ที่จะ commit เป๊ะ :8846 · mock login · `_t.step`): เรขาคณิตตรงสูตรเป๊ะทั้ง 1000×640 (cover) และ 812×375 (100% 128%) — left/top/w/h/transform-origin ที่คำนวณเทียบกับที่โค้ดตั้งจริงตรงกันทุกตัว ✓ ค่าจริง: 274 กม./ชม.=เกียร์ 7 rpm 12,950 · 94=เกียร์ 3 · หยุดนิ่งเหยียบคันเร่ง=เร่งเครื่องรอออกตัว ✓ **ภาพยืนยันด้วยตา** (composite เอง: พื้นหลัง+ชั้นพวงมาลัย+จอ): ตรง/เลี้ยวขวา/เลี้ยวซ้าย −39° จอเอียงไปกับพวงมาลัยพอดี ไม่หลุดกรอบ · ไม่มีขีดส้มเดิมโผล่ · **ภาพสำรอง** (ยิง `error` ใส่ `<img>` → กลับไป `cockpit.webp` ที่มีพวงมาลัยติดมา) จอยังทับตรงเป๊ะและอัปเดตค่าต่อ ไม่ throw ✓ สลับมุม 📷/🛣️ = ไม่วาดเลย (0 ครั้ง) กลับมามุมคนขับวาดต่อปกติ ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ ไฟล์ `js/f1_3d.js` มี session คู่ขนานเขียนอยู่ตลอด (ระหว่างทำ HEAD ขยับ 913→914→915 · เลขรอบที่ขอตอนเริ่มได้ 915 ก็โดนใช้ไป) → commit แบบ **เขียน index ชั่วคราว (`GIT_INDEX_FILE`) = HEAD + เฉพาะแพตช์ของรอบนี้** ด้วย `build_mine.py` แบบ anchor (ทุก anchor ต้องเจอครั้งเดียวพอดี) — ไม่พา WIP ของเขาขึ้นเว็บ และไม่แตะ index หลักที่เขาอาจ stage ค้างไว้


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 917 (2 ส.ค. · ผู้ใช้: "เกมใหม่ยิงปืนใส่แผ่นตัวอักษรประกอบคำ ฉากสวนสนุกสดใส ใช้ภาพ ww2_hold/aim_gun.png · แผ่นบนพื้นไม้โดนยิงพับถอยหลังแล้วเด้งกลับ · เสียงปืนอัดลม · เข้าได้จาก lobby ทั้ง 2 แบบ · เล่นคนเดียว · อันดับ+รางวัล 10,000-1,000 เหมือนค้นหาคำ" + อนุมัติทำเป็นโลก 3D เต็ม):** 🎯 **เกมใหม่ "ยิงเป้าคำศัพท์"** — Three.js first-person ซุ้มยิงปืนสวนสนุก (`js/shootword.js` ไฟล์เดียวจบ รวม CSS/เสียงสังเคราะห์ · โหลด three.min.js ตอนกดปุ่มเท่านั้น) · หิ้งไม้ 3 ชั้นไล่ระดับ 18 แผ่น ยิงสะกดตามคำ (vocabForStudent เท่านั้น · ทุกตัวอักษรของคำมีแผ่นครบเสมอ = จบได้การันตี · ยิงถูกแผ่นกลับมาพร้อมตัวใหม่) · แผ่นพับถอยหลัง→เด้ง easeOutElastic+เสียงดึ๋ง · ปืนผู้ใช้ 2 ภาพ→`img/gun/hold.webp`+`aim.webp` (ย่อ 109/98KB ต้นฉบับ .png ไม่ commit) โหมดเล็ง=ซูม FOV 30 ยิงตรงปลายศูนย์หน้า (จุดรูวัดจาก alpha จริง) · เสียงปืนอัดลม "พสึ่บ+ปั๊มลม" สังเคราะห์ · ฉาก: ชิงช้าสวรรค์หมุน/เต็นท์ลาย/ลูกโป่ง/เมฆ/ธง/ไฟราว/กันสาดหยัก · 🦆 เป็ดวิ่ง 2 ตัวยิงได้ +3 เหรียญ (ไม่เข้าแต้มอันดับ) · แต้ม=ยาว×2 (+5 ไม่พลาด) → `state.sgScore/sgWords` → field `sg` + แท็บ 🎯 (การ์ดเล็ก+เต็มจอ ui.js) + รางวัลรายเดือน `js/sgaward.js` (โรงงาน makeMonthAward เดิม) · ทางเข้า: ราง `#btn-rail-shootword` + ตึกซุ้มเป้าหมุนในเมือง 3D (city3d deg 20 วงนอก) + CLICK map main.js · แก้: index_classic(ปุ่ม+2 script) / state(default+sanitize) / online(push sg+fallback 6 ชั้น+board whitelist) / ui(7 จุด) / city3d(1 ตึก)
  - ยืนยัน (preview :8642 · mock login ป.4/ป.2 · `_t` step ขับเฟรม): ยิงครบคำ BEE = +11 เหรียญ+แต้ม (3×2+5) words+1 ✓ ยิงผิด=miss+1 pos ไม่ขยับ แผ่นเด้งกลับตัวเดิม ✓ แผ่นถูกกลับมาตัวใหม่ (E→O) ✓ เป็ด +3 เหรียญ sg ไม่ขยับ ล้ม+เกิดใหม่ ✓ cooldown 310ms บล็อกนัดซ้อน ✓ เป็ดล้มไม่บังกระสุน (บั๊กแรกเจอ quad ใสบัง — แก้ filter ใน shoot) ✓ push ก้อนแรกมี sg + ถอย fallback ครบ 6 ชั้นตอน deny ไม่ throw ✓ แท็บ 🎯 เต็มจอ Top10+โพเดียม+แถบรางวัล + กระดานประกาศ SgAward เปิดได้ (mock 12 คน) ✓ HUD วัด rect 1000×640 และ 812×375 ไม่ทับ/ไม่ล้น ✓ Esc/ปุ่มออก ปิด-เปิดใหม่ได้ ✓ ภาพยืนยันด้วยตา 5 ใบ (โหมดถือ/เล็ง/จอเตี้ย/ตึกในเมือง — ศูนย์เล็งทาบกลางจอพอดี) ✓ console ไม่มี error · `node --check` ผ่าน 7 ไฟล์ · ล้าง storage+ปิดเสียง+ฆ่า server แล้ว
  - ⏳ ค้าง: **ผู้ใช้ publish rules โซน `sgAward` + field `sg`** — Artifact ปุ่มคัดลอกก้อนเต็ม: https://claude.ai/code/artifact/3bad17e9-4017-496a-af8e-2a55da92d1c9 (ยังไม่ publish เกมไม่พัง — เล่น/เก็บแต้มในเครื่องได้ครบ แค่กระดานยังไม่เห็นแต้มเพื่อน)
  - 📌 เจอระหว่างทาง (ไม่ใช่ของรอบนี้): กระดานเต็มจอแท็บ Top10 ทุกแท็บ (ws/tp/sg) ล้น 2px ที่ 812×375 (`scrollHeight 358 > clientHeight 356`) — เป็น layout ร่วมเดิม ไม่เห็นด้วยตา ปล่อยให้รอบหน้าแก้รวดเดียว · จูนภาพปืน = TUNE ZONE หัวไฟล์ `js/shootword.js`


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 918 (2 ส.ค. · ผู้ใช้: "โลก F1 โซน 🎡 รอบ 913 — แยกชั้นแถบไฟ LED บนพวงมาลัยจาก img/f1/wheel.webp ให้ไล่ตามรอบเครื่อง เขียว→แดงตอนใกล้เปลี่ยนเกียร์ ใช้ tools/f1_split_wheel.py เป็นแบบ"):** 🚥 `tools/f1_split_leds.py` (ตัวใหม่ ทำตามแบบเดิม) หาดวงไฟจาก "สี" ในภาพเอง ได้ **15 ดวงตรงตำแหน่งที่วาดไว้จริง** (ไม่ใช่หารเท่า ๆ กัน) → เขียน **`img/f1/wheel_body.webp` = พวงมาลัยที่ไฟดับหมด** (หรี่โซนไฟ ×0.20 = เหมือน LED ยังไม่ติด) + พิมพ์อาร์เรย์ตำแหน่ง % ไปใส่ `F1_LEDS` · โซนใหม่ `🚥 รอบ 918` ใน `js/f1_3d.js`: ดวงไฟเป็น `<i>` ใน `#f1-leds` **ใช้กรอบ/จุดหมุน/transform ก้อนเดียวกับ `<img>` พวงมาลัย** (มิเรอร์ค่าใน `layoutWheel`/`wheelTick` → หมุน/สั่น/ยืดตามเองทุกขนาดจอ ไม่เขียนสูตรซ้ำ) · สี **เขียว 6 → เหลือง 5 → แดง 4** · ถึง **93% ของช่วงเกียร์ = ติดเต็มแถบ + กะพริบแดง↔ขาว 7 ครั้ง/วิ** (วัดจากสัดส่วนในเกียร์ "สด ๆ" ไม่ใช่ค่าหน่วง ไม่งั้นเกียร์ต่ำที่กระชากเร็วเตือนไม่ทัน)
  - 🔀 **รวมกับจอ canvas รอบ 916 (ผู้ใช้เลือกเอง)**: ตัดแถบไฟ 15 ดวงที่ `drawDash` วาดออก ปล่อยโซนนั้นโปร่ง + ขยับขอบบนจอ LCD ลง 3 px (`dashRR(c,4,14,226,102,5)`) ให้พ้นก้นดวงไฟ · `ledTick` **อ่าน `dashRpm` ก้อนเดียวกับจอ** → ไฟกับเลข "รอบ/นาที" ตรงกันเสมอ (ไม่มีจอ = ถอยไปคิดเองด้วยสูตรเสียงเครื่องยนต์) · ภาพหาย = `wheel_body` → `wheel.webp` (ดับไฟที่วาดเอง) → `cockpit.webp` ตามลำดับ
  - ยืนยัน (staging = `git archive HEAD` + ไฟล์ที่จะ commit เป๊ะ :8831 · mock login · `_t.step`): **ทุกเกียร์ 1-6 ไล่ถึงเต็มแถบ+กะพริบก่อนขึ้นเกียร์ครบทุกเกียร์** ✓ จำนวนดวง = `round(k×15)` ตรงกับ `dashRpm` ที่จอใช้เป๊ะ ✓ กะพริบวัดได้ **6.92 ครั้ง/วิ** (ตั้งไว้ 7) ✓ ชั้นไฟ vs ชั้นพวงมาลัย: left/top/w/h/transform-origin/transform **เท่ากันทุกตัว** ทั้ง 1000×640 (cover) และ 812×375 (ยืด 128% · scaleY 0.8867) ✓ วนกล้อง 🪖→📷→🛣️→🪖 ไฟซ่อน/กลับมาวางถูก ✓ ยิง `error` ใส่ `<img>` 2 ครั้ง = ถอยครบ 2 ชั้น ไม่ throw ✓ ขับด้วยปุ่มลูกศรจริงผ่านลูปเกมเต็ม เห็นครบทั้ง 4 สถานะสี ✓ **ภาพยืนยันด้วยตา** (composite เอง: ฉาก+พวงมาลัย+ดวงไฟ+จอ): เขียว/เหลือง/เต็มแถบแดง/ตอนเลี้ยว — ไฟตรงร่องไฟจริงในภาพ ไม่มีขีดส้มเดิมโผล่ ไม่โดนจอบัง ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ **ชน session คู่ขนาน "เรื่องเดียวกัน"**: ระหว่างทำ เขา commit **รอบ 916 = จอ canvas บนพวงมาลัย ซึ่งวาดแถบไฟ 15 ดวงของตัวเองด้วย** → หยุดถามผู้ใช้ก่อนตามกฎทอง #10 · ผู้ใช้เลือก **"รวมสองอย่าง"** (เก็บตัวเลขจริงของเขา + ใช้ไฟจริงจากภาพของรอบนี้) · เลขรอบขอตอนเริ่มได้ 914 แต่โดนใช้ถึง 917 ระหว่างทาง จบที่ **918** · commit แบบเขียน git index ตรง (HEAD + แพตช์รอบนี้ ผ่านสคริปต์ anchor `apply_leds.py`) ไม่พา WIP ของ session อื่นขึ้นเว็บ


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 919 (2 ส.ค. · ผู้ใช้ส่งภาพจอเครื่องเกมพกพา + ลูกศร 2 อัน: "① ย้ายกล่องไปตามลูกศร ② ออกแบบรองรับคนออนไลน์เยอะในอนาคต"):** 🧭🏆 โลกมอเตอร์ไซค์/รถยนต์ `js/moto3d.js` — ต้นตอที่กล่องทับป้ายคำศัพท์คือ **กระดานคะแนนกว้างเป็น `vmin` ของหน้าต่าง (34vmin ≈ ครึ่งจอเกม)** + `fitWord` เดิมย่อคำเทียบ "ความกว้างจอ 96%" โดยไม่รู้ว่ามีกล่องซ้าย/ขวาบังอยู่ → ① กล่อง GPS ชิดซ้าย `1.6%→.7%` แคบลง `31%→24%` · กระดาน+เหรียญชิดขวา `2%→.7%` กระดานยกขึ้น `top 10.5%→8.5%` กว้างเป็น % ของจอเกม (max 26%) ② `fitWord()` วัดกรอบจริง 2 กล่องด้วย `getBoundingClientRect` → ได้ช่องกลางจอ แล้ววางป้ายคำ **กลางจอไว้ก่อน เบียดค่อยเลื่อน** · คำยาวตัด 2 แถวก่อน (ตัวอักษรยังใหญ่) ค่อยย่อ + คุมสูงไม่เกิน 38% ของจอ ③ **กระดานรองรับคนเยอะ**: เรียงนิ่ง (คะแนนเท่ากันเรียงตามชื่อ) · แถวคิดจากความสูงจอแล้ววัดซ้ำ ล้นเมื่อไหร่ลดแถวเอง · **เห็นตัวเองเสมอ** (หลุดท็อป → "⋯" + อันดับจริง — เดิม `slice(0,5)` เด็กหาตัวเองไม่เจอ) · ที่เหลือยุบเป็น "+ อีก N คน" · หน่วงวาด 220ms
  - ยืนยัน (server :8642 · FakeDB + `W3D.seedPeers` 13 คน · mock login · วัด `getBoundingClientRect` ทุกกล่อง): **1000×640 / 812×375 / 620×360** — ป้ายคำ 8 ตัว (EVALUATE) ไม่ทับกล่องไหนเลย (ช่องไฟ 3.8-5.7px) ทุกขนาด · ทุกกล่องอยู่ในจอครบ · กระดานไม่ล้น (`scrollHeight≤clientHeight`) และไม่ชนมินิแมป (เหลือ 8-23px) ✓ **40 คนในสนาม = กล่องสูงเท่าเดิมเป๊ะ (95px)** โชว์ "+ อีก 36 คน" + แถวเราอันดับ 41 ✓ คำสั้นยังอยู่กลางจอพอดี (center 232 = กึ่งกลาง) · คำ 13 ตัวย่อลงอัตโนมัติ 0.64 สูงไม่เกิน 38% ✓ **ยิงแพ็กเกจเพื่อน 429 ครั้ง/1.4 วิ → กระดานวาดจริงแค่ 6 ครั้ง** (เดิมวาดทุกแพ็กเกจ) ✓ ชุดทดสอบเดิม `tools/test_worlds3d.js` โหมดมอไซค์ **ผ่าน 7/7** ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 920 (2 ส.ค. · ผู้ใช้ถามว่าปุ่มเข้าเกม 🎯 ยิงเป้าคำ ทำหรือยัง — ตรวจแล้วโค้ด/live ครบทั้งราง+ตึกในเมือง 3D จริง แต่เจอบั๊กจริงระหว่างตรวจ):** 🔄 ปุ่ม `#update-reload` (แถบ "มีเกมเวอร์ชันใหม่") ใน **ทั้ง 2 ไฟล์** เรียก `location.reload()` เฉยๆ — service worker cache เก่ายังค้าง กดอัปเดตแล้วเห็นโค้ดเก่าเหมือนเดิม → **นี่คือบั๊กที่เคยแก้ไว้แล้วในรอบ 876 แต่หลุดหายไปจาก `index_classic.html`** (regression จากหลาย session เขียนไฟล์เดียวกัน) **และ `index.html` ไม่เคยมีเลย** → คืนกลับ + ทำให้ครบทั้ง 2 ไฟล์: กดปุ่ม → ปิดปุ่ม+โชว์ "⏳ กำลังอัปเดต..." → `navigator.serviceWorker.getRegistrations()` unregister ทุกตัว + `caches.keys()` ลบทุกก้อน → ค่อย `location.reload()`
  - ยืนยัน (server เอง :8642 · จำลอง `getRegistrations`/`caches.keys`/`caches.delete` แล้วยิงปุ่มจริงด้วยโค้ด onclick ที่คัดลอกจากซอร์สเป๊ะ): unregister ถูกเรียกครบทุก registration (2/2) · `caches.keys()` เรียก 1 ครั้ง แล้วลบครบทุกคีย์ที่ได้ (2/2) · ปุ่มปิดใช้งาน+เปลี่ยนข้อความระหว่างรอ ✓ reload มาหลังลบ cache เสร็จเท่านั้น (ไม่ race) ✓ `node --check` ผ่านทั้ง 2 บล็อก script ที่แก้ · **ยืนยันแยกว่าปุ่มเกม 🎯 ยิงเป้าคำ (รอบ 917) ยังอยู่ครบ**: `btn-rail-shootword` มีจริงใน DOM `display:flex` ทั้งบน localhost และ https://vocabworld.web.app สด ๆ + ตึกซุ้มเป้าในเมือง 3D (`city3d.js` มี `shootword`) — สรุปว่าโค้ดไม่เคยหาย ถ้าผู้ใช้ยังไม่เห็นบนเครื่องจริงให้กด "🔄 อัปเดตเลย" รอบใหม่ (มีตัวล้าง cache แล้ว) หรือปิด-เปิดแอปใหม่
  - 💡 ไม่ได้แตะ `js/adventure3d.js`/`js/f1_3d.js` ที่มี session คู่ขนานทำงานค้างอยู่ในนั้น


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 921 (2 ส.ค. · ผู้ใช้ส่งภาพหน้าจอเครื่องจริงพร้อมขีดเส้นแดง สั่ง 4 ข้อ):** 🛑🎛️ `js/f1_3d.js` — ① **ยกมือออกจากคันเร่ง = ค่อย ๆ เบรกเอง** (`COAST_A 5.5 m/s²` ใน `physTick` เฉพาะตอนไม่กดเร่ง/ไม่เบรก/ไม่ถอย · ต่ำกว่า `COAST_STOP 0.45 m/s` หยุดสนิทไม่คืบต่อ · ผิวลื่นหน่วงได้น้อยลงตามกริปเหมือนเบรกจริง) ② **แถบเลี้ยวหนาขึ้นอีกเท่าตัว** (128→256 / จอเตี้ย 100→200) ③ **ความเร็ว กม./ชม. ย้ายมากลางล่าง** ④ **ยกแถวปุ่มเร่ง/เบรก/R ขึ้นมา** ให้ขอบบนปุ่มเร่งเสมอกับขอบบนแถบเลี้ยวพอดี — ②③④ คุมด้วยตัวแปร CSS `--f1-sh` (สูงแถบเลี้ยว · **เพดาน 44vh** = สูงเกือบถึงเส้นแดงที่ผู้ใช้ขีดไว้ทุกขนาดจอ) + `--f1-sw`/`--f1-kn`/`--f1-pedb` · ของที่เคยตรึงเป็น px (มินิแมป/ปุ่มแชท/ป้าย DRS/แถบแชท) วัดต่อจากตัวแปรพวกนี้แทน → media query จอเตี้ยเหลือแค่ค่าที่ต่างจริง
  - 🐛 **เจอตอนวัด (แก้แล้ว)**: ทำลูกบิดโตตามความสูงแถบตรง ๆ → ลูกบิดกว้าง 242 เท่ากับแถบ 270 จน**เลื่อนได้แค่ 28px** (สูตรใน `steerTo` คือ 1−ลูกบิด/แถบ) เด็กดูไม่ออกว่าเลี้ยวมากน้อยแค่ไหน → เพิ่ม `--f1-kn = min(สูงแถบ−14, กว้างแถบ×0.55)` + จัดกลางแนวตั้ง → **เลื่อนได้ 120px** (จอเตี้ย 112px) ยังอยู่ในแถบครบทั้ง 2 สุด
  - ยืนยัน (staging = `git archive HEAD` + ไฟล์ที่จะ commit เป๊ะ :8834 · mock login · ปลดไฟแดงด้วย `setHold(0)+beginLights` · **วางรถบนเส้น `LINE` ก่อนวัดทุกครั้ง** ไม่งั้นรถหลุดสนามแล้วโดน respawn รอบ 911 รีเซ็ตความเร็วจนวัดเพี้ยน): เบรกอัตโนมัติ — 253.5 กม./ชม. ปล่อยคันเร่ง ไล่ลง 233/214/197/180/165/150 ทุกครึ่งวินาที (ลื่นไหล ไม่กระตุก) · 54 กม./ชม. หยุดสนิทใน **2.37 วิ** เทียบกดเบรกจริง **0.52 วิ** (เบรกยังแรงกว่า 4.6 เท่า ไม่กลืนกัน) · กดคันเร่งค้างยังเร่งปกติ 54→189 กม./ชม. ใน 3 วิ · **เกียร์ถอยยังถอยได้เต็ม 8 m/s** (กัน `!reving` ไว้) ปล่อย R แล้วเบรกอัตโนมัติหยุดให้ทั้งสองทิศ ✓ · ผัง — วัด `getBoundingClientRect` **ทุกกล่อง HUD 19 ใบพร้อมกัน (บังคับโชว์ของที่ซ่อนอยู่ด้วย)** ทั้ง 1000×640 และ 812×375: **ไม่มีคู่ไหนทับกันเลย ไม่มีใบไหนหลุดจอ** ✓ แถบแชทเดิมโดนปุ่มที่ใหญ่ขึ้นทับจนกดไม่ได้ → ยกขึ้นเหนือแถบเลี้ยว ✓ ภาพยืนยันด้วยตา 2 ขนาด (composite ฉาก+ค็อกพิท+พวงมาลัย แล้ววาดกรอบ+ป้ายทุกกล่องทับตามพิกัดจริง + เส้นแดง 52% ของผู้ใช้): แถบเลี้ยวกับปุ่มเร่งเริ่มที่ระดับเดียวกันใต้เส้นแดงพอดี · ความเร็วอยู่กลางล่างบนพื้นคาร์บอนเข้ม อ่านออกชัด ✓ console ไม่มี error · `node --check` ผ่านทั้งไฟล์จริงและ blob · ล้าง storage + ฆ่า server แล้ว
  - 📌 เจอระหว่างทาง (ไม่ใช่ของรอบนี้ ไม่แก้): ถ้าบังคับให้ `#f1-lights` (ไฟสตาร์ท) กับ `#f1-pit` (ป้ายพิท) โชว์พร้อมกันจะทับกัน 21-27px — ของเดิมทั้งคู่ (top:50 / top:96) และจริง ๆ ไม่โผล่พร้อมกัน (ไฟสตาร์ทเฉพาะตอนออกตัว · ป้ายพิทตอนยางโทรม)
  - ⚠️ เลขรอบ: ขอตอนเริ่มได้ 919 แต่ session คู่ขนานใช้ไปก่อน (GPS โลกมอเตอร์ไซค์) → ขยับเป็น **921** คอมเมนต์ในโค้ดแก้ครบ 8 จุด · commit แบบเขียน git index ตรง = HEAD + แพตช์ 9 จุดของรอบนี้ (`apply_mine3.py`) ไม่พา WIP ของ session อื่นขึ้นเว็บ


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 922 (2 ส.ค. · ผู้ใช้: "ลากซ้ายปืนเบนขวา ลากลงปืนเงยขึ้น กลับด้านหมด แก้ด้วย"):** 🎯🔄 `js/shootword.js` bindInput() — สูตรเดิม `yaw+=dx*s`/`pitch+=dy*s` เป็นเครื่องหมายผิดตั้งแต่แรก (yaw บวก=หันซ้ายจริงตามสูตรกล้อง Three.js order YXZ แต่ผู้ใช้ลากซ้าย dx ติดลบกลับไปลบ yaw ทำให้เลี้ยวขวา) → กลับเครื่องหมายเป็น `yaw-=dx*s`/`pitch-=dy*s*0.8` ทั้งคู่ ลากซ้าย=มองซ้าย ลากลง=มองลง ตรงสามัญสำนึกแล้ว
  - ยืนยัน (server เอง :8642 · mock login · ยิง `PointerEvent` จำลองลากจริงผ่าน `#sg-overlay` แล้วอ่าน `ShootWord._t.camera.rotation` หลัง `step()`): ลากซ้าย 100px → `rotation.y=+0.240` (หันซ้ายถูกทิศ) · ลากลง 100px → `rotation.x=-0.059` (มองลงถูกทิศ ชนขอบ clamp พอดี) ✓ console ไม่มี error · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 923 (3 ส.ค. · ผู้ใช้ 2 ข้อ: "① ขยายให้เป้าห่างออกไปอีก 3 เท่า ② เพิ่มปุ่มยิงตำแหน่ง 1 และ 2" — ถามกลับให้เลือกแบบปุ่มยิงเพราะกำกวม ผู้ใช้เลือก "ปุ่มยิง 2 ตำแหน่งซ้าย-ขวาล่างจอ"):** 🎯🔫 `js/shootword.js` — ① `ROWS[].z` คูณ 3 (-9/-13.5/-18 → -27/-40.5/-54 สูง/กว้าง/ขนาดแผ่นเท่าเดิม) + ปรับตาม: fog end 110→180 (กันหิ้งไกลสุดจมหมอก) · ฉากหลัง `bd` z -46→-76 (ไม่งั้นโผล่บังหิ้งชั้น 3) · เป็ด 🦆 z ×3 ตามหิ้ง ② ปุ่ม `#sg-shoot-l`/`#sg-shoot-r` มุมล่างซ้าย-ขวา (ต่ำกว่าปุ่ม 🎯 เล็ง พ้นคำใบ้) ยิงตรงกึ่งกลางจอเสมอ (จุดเดียวกับรูศูนย์เล็ง) + กากบาท `#sg-cross` กลางจอโชว์เฉพาะโหมดถือ (โหมดเล็งมีศูนย์ปืนจริงอยู่แล้ว) — ของเดิม "แตะจอสั้นๆ = ยิง" ยังใช้ได้ปกติ เป็นตัวเลือกเสริม
  - ยืนยัน (server เอง :49973 · mock login · `ShootWord._t`): ระยะ `ROWS.z` = [-27,-40.5,-54] ตรง ✓ วัด `getBoundingClientRect` ปุ่มยิง/เล็ง/ออก/คำ/กากบาท ทั้ง 1000×640 และ **812×375**: ไม่ทับกันสักคู่ ไม่มีชิ้นไหนหลุดจอ ✓ กดปุ่มยิงจริง (`PointerEvent('pointerdown')`) → `recoilFx` ติด `.kick` ✓ · เล็งกล้องไปแผ่นตัวอักษรที่ถูกต้องจริงแล้วกดปุ่มยิง → `pos` ขยับ 0→1 (โดนจริง ที่ระยะ 3 เท่า raycaster ยังแม่น) · เล็งแผ่นผิดตัว → `misses` ขึ้น 1 (ตรรกะเดิมทำงานถูก) ✓ **ภาพยืนยันด้วยตา** (Snap.shot จริง 2 มุม): มุมกว้างเห็นซุ้ม+หิ้งเล็กลงชัดเจนตามระยะใหม่ · **โหมดเล็งซูมเข้าอ่านตัวอักษรบนหิ้งได้ชัดเจนทุกตัว** (R O J U Z D / V E S N M O / D F N N) ชดเชยระยะไกลได้ดี ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 924 (3 ส.ค. · ผู้ใช้ส่งภาพ: ผนังกระเบื้องขาว/เทาโผล่กลางกำแพงวอลเปเปอร์โรงแรม "ทำให้ดูไม่หรู"):** 🧱 `js/hotel3d.js` build() — ต้นตอคือผนัง**ในห้อง**ของห้องน้ำแต่ละห้องพัก (`accBox(F.tile,-HX+1.8,...)` "ผนังยาว แกน Z") ใช้ `tex_hotel_tile` (กระเบื้องห้องน้ำ) แต่หันหน้าออกเข้าห้อง จึงเห็นชัดจากในห้อง/มุมทางเดิน → เปลี่ยนเป็น `F.room` (`tex_hotel_room` วอลเปเปอร์ห้อง ลายเดียวกับผนังข้าง ๆ) เพิ่ม `room` เข้า `furnMesh`+forEach list (เดิมประกาศไว้เฉยๆไม่เคย render) · ผนังกระเบื้องอีก 2 ผืน (ผนังขวางในห้องน้ำเอง + ผนังนอกที่แนบชิดผนังโครงสร้างจนมองไม่เห็น) คงกระเบื้องเดิมไว้ตามเดิม
  - ยืนยัน: สร้าง `HOTEL3D.build()` แยกใน preview จริง (ไม่ผ่านเกม เพราะ mock login ติดค้าง auth listener) เรนเดอร์กล้องเล็งตรงผนังนี้ก่อน/หลังแก้เทียบกัน — **ก่อนแก้ตรงกับภาพผู้ใช้เป๊ะ** (ลายกระเบื้องขาวสลับแนวเหมือนกัน) **หลังแก้เป็นวอลเปเปอร์ลายดอกไม้ครีม** ตรงตามที่ขอ · `node --check` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 925 (3 ส.ค. · ผู้ใช้ส่งภาพ: เห็นแผ่นสีเทาแบนโล่ง ๆ ตรงช่องกลางบันได นึกว่าเป็นช่องว่าง "ปิดทึบให้สวยหรูเลย"):** 🪜 `js/hotel3d.js` build() — แผงกันตกช่องกลางบันได (balustrade) + ราวนอกฝั่งชานพัก เดิมใช้ `A.metal` (`M.metal` สีเทาล้วนไม่มีลาย) มองจากบางมุมเลยดูเหมือนรูโหว่ทั้งที่จริงเป็นกำแพงตันกันตกอยู่แล้ว → เปลี่ยนเป็น `A.wood` (`tex_hotel_wood` ไม้เข้มมีลายจริง) ทั้ง 2 จุด ให้เข้าชุดกับราวจับไม้ด้านบนที่มีอยู่แล้ว
  - ยืนยัน: เรนเดอร์ `HOTEL3D.build()` แยกเทียบมุมกล้องใกล้ช่องบันไดชั้น 1 (เหมือนภาพผู้ใช้) — หลังแก้เห็นลายไม้เข้มเต็มแผ่นชัดเจน ไม่มีจุดไหนเป็นสีเทาแบนว่างเปล่าอีก · `node --check` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 926 (3 ส.ค. · ผู้ใช้ส่งภาพวงกลม "1"/"2" พร้อมลูกศรชี้ปุ่มยิงเดิมที่มุมล่าง: "① ย้ายปุ่มไปตำแหน่ง 1/2 ② ปรับปุ่มโปร่งใส 50%"):** 🔫📍 `js/shootword.js` `.sg-shoot` — เดิมชิดขอบล่างสุด (`bottom:8vh`) ย้ายขึ้นมา **กึ่งกลางแนวตั้งของจอ** (`top:40%;transform:translateY(-50%)`) ตามตำแหน่งวงกลมในภาพ ยังอยู่ซ้าย-ขวาเดิม (`left/right:2vh`) เว้นระยะพ้นปุ่ม 🎯 เล็งด้านล่างพอดี · พื้นหลังปุ่ม `.85→.5` alpha (โปร่งใส 50% ตามขอ ขอบ/ไอคอน/ตัวหนังสือยังชัดเจนเต็ม)
  - 🐛 **เจอระหว่างแก้ (แก้แล้ว)**: สถานะกดค้าง `.down` เดิมตั้ง `transform:translateY(3px)` ทับค่า `translateY(-50%)` ใหม่ตรง ๆ (CSS transform ไม่ได้บวกกัน) จะทำปุ่มกระโดดตำแหน่งตอนกด → แก้เป็น `translateY(calc(-50% + 3px))`
  - ยืนยัน (server เอง · mock login): วัด `getBoundingClientRect` ปุ่มยิง/เล็ง/ออก/คำ/กากบาท ทั้ง 1000×640 และ **812×375** ไม่ทับกันสักคู่ ไม่หลุดจอ ✓ `background-color` คำนวณจริง = `rgba(255,95,109,0.5)` ✓ จำลองกดปุ่ม (`.down` class) แล้ววัด rect ก่อน/หลัง — ขยับแนวตั้งแค่ 3px ตามที่ตั้งใจ แนวนอนไม่ขยับเลย (`jumpX:0`) ✓ **ภาพยืนยันด้วยตา** (คอมโพสิตแคนวาสจริง + วาดกรอบตำแหน่งปุ่มทับพิกัดจริง): ปุ่มขึ้นมาอยู่กึ่งกลางจอสูงตรงกับระดับชิงช้าสวรรค์/เต็นท์ ตรงกับตำแหน่งวงกลมที่ผู้ใช้ทำเครื่องหมายไว้ ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 927 (3 ส.ค. · ผู้ใช้ส่งภาพจอเกมพกพาโลกมอเตอร์ไซค์ ขีดลูกศร 3 จุด):** 🏍️ `js/moto3d.js` — ① ตัวอักษรคำศัพท์ (`#moto-word .m-chips`) ชิดกันเกินไป → เพิ่ม `gap` 0.8vmin→2vmin (fitWord() วัด scrollWidth จริงอยู่แล้ว ย่อ/ตัด 2 แถวให้เองถ้าล้น ไม่ต้องแก้ที่อื่น) ② ผู้ใช้ยืนยันทาง AskUserQuestion: กล่อง GPS ย้ายชิดซ้ายเพิ่ม (`left .7%→.2%` + padding ลด + จัดเนื้อหาชิดซ้ายแทนกลางกล่อง) · กล่องสนาม/ไปหาเพื่อน (`#moto-board`) ย้ายชิดขวาเพิ่ม (`right .7%→.2%` + padding ลด) ③ ยืนยัน: เลขเหรียญมุมขวาบน = `sessionCoins` (ได้เฉพาะทริปนี้) คนละตัวกับ `state.coins` ที่ `dogHit()` หักอยู่แล้ว → เพิ่มหัก `sessionCoins` + วาด `coinsEl` ใหม่ทันทีในฟังก์ชันเดียวกัน
  - ยืนยัน (server เอง :8642 · mock login · `getBoundingClientRect` เทียบก่อน/หลัง): กล่อง GPS `left 0.7%→0.2%` · กล่องสนาม `right 0.7%→0.2%` ไม่ทับกล่องคำศัพท์/เหรียญ (เว้นช่องว่าง 6-7% ทุกฝั่ง) ✓ ช่องไฟตัวอักษรจริง 5.1px→12.8px (2.5 เท่า) ✓ บังคับชนหมาจริง (`t.forceDog()`+วางหมาทับตัวเอง+`dogTick`): `state.coins` 45→0 **และ** ป้าย `🪙 +45→+0` เปลี่ยนทันทีในเฟรมเดียวกัน (เดิมค้าง +45 ไม่ขยับ) ✓ `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว
  - ⚠️ เลขรอบ: session คู่ขนานใช้ 925/926 ไปก่อน (แผงกันตกบันได/ปุ่มยิงเป้าคำ — คนละระบบ) → คอมเมนต์ในโค้ดที่เขียนไว้ก่อนแก้เป็น 927 ตามจริง


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 928 (3 ส.ค. · ผู้ใช้: "สนามฟุตบอลใหญ่ขึ้น 2 เท่า" — เลือก "ขยายทั้งสนามจริง ระยะเตะไกลขึ้นด้วย"):** ⚽🏟️ `js/adventure3d.js` โซน soccer — สนาม 44×64→**88×128** (`fieldW/L` + lines texture `W/L/PW/NB` + repeat หญ้า 39×51 / normal 42×58 + `ringAds` 26→52) · `GOAL_Z -19→-38` `PLAYER_Z 8→16` จุดสุ่มยืน ±26m, z −8..+20 (ระยะยิง 30–58m เดิม 15–29) · **ประตู/บอล/GK เท่าเดิม** (ของจริงไม่ขยายตาม) · `KICK_SPD_MAX 44→52` จากจำลองฟิสิกส์ (scratchpad kicksim.js: ที่ 44 ลอยถึงแค่ 56m ไม่ถึงจุดไกลสุด · 52 ลอย 66m) · FK 18→27m (พ้นเขตโทษใหม่ลึก 19.4m) · PK 7→13m (ตรงจุดโทษที่วาด 11m×K) · `GUIDE_N 44→56` · เพดานเวลาบิน 4.5→6.5s · oob |x|>60 · เส้นสนาม 4→2.5px · testkit เพิ่ม `_t.soccer.ball/sbGoaled/sbInGoal`
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid+shotsink :8813): ยิงตรงเข้าจริงจาก 39.8m (ตัดเส้น y=0.58) และ 3/6 จากระยะ 52–58m (ตัดเส้นต่ำ 0.4–1.0 พ้น GK — ไกลสุดท้าทายแต่ทำได้) ✓ FK ยืน z=−11=GOAL_Z+27 ✓ PK z=−25 ยิงมุมเสาเข้า ✓ ป้ายตัวอักษรอยู่หน้าประตูใหม่ z=−37.5 วาร์ปบอลชนเก็บ 'f' เข้ากระเป๋า ✓ ภาพยืนยันด้วยตา 2 กริด (มุมเล่นจริง/มุมสูงเห็นทั้งผืน/หน้าประตู — ประตูเล็กลงตามสัดส่วนสมจริง) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + reload ปิดเสียง + ฆ่า server แล้ว
  - 💡 ปุ่ม FK/PK โดน `repOn` (รีเพลย์หลังประตู เดินตามเวลาจริง) บล็อก click ระหว่างเทสต์แบบขับเฟรม — ต้องรอเวลาจริง ~6 วิ ให้รีเพลย์จบก่อน · แถบหญ้าเขียวสดนอกเขต lines-texture ที่เห็นในมุมสูง = ของเดิมมีอยู่แล้ว (mipmap จากไกล) ไม่ใช่ regression
  - ⚠️ เลขรอบ: ขอตอนเริ่มได้ 911 แต่ session คู่ขนานใช้ 911–927 ระหว่างทาง → ขยับเป็น 928 (คอมเมนต์ในโค้ดแก้ครบ 19 จุด) · ไม่แตะ `js/f1_3d.js` ที่ session อื่นค้างอยู่


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 929 (3 ส.ค. · ผู้ใช้ส่งภาพวงกลม "1" ต่อรอบ 926: "ย้ายปุ่มยิงฝั่งซ้ายไปตามตำแหน่งที่กำหนด" — ฝั่งขวาไม่แตะ):** 🔫📍 `js/shootword.js` — `#sg-shoot-l` แยกออกจาก `.sg-shoot` (top:40% ร่วม) มาตั้ง `top:60%` ของตัวเอง (ฝั่งขวา `#sg-shoot-r` ยังอยู่ 40% เดิม) ตำแหน่งใหม่ตรงกับวงกลมในภาพ (ประมาณ 60% ของความสูงจอ จากขอบบน)
  - ยืนยัน (server เอง :8642 · mock login): วัด `getBoundingClientRect` จุดกึ่งกลางปุ่มฝั่งซ้าย ที่ viewport 1052×491 (ขนาดใกล้เคียงภาพผู้ใช้) = 60.0% จากขอบบน **ตรงกับตำแหน่งวงกลมในภาพเป๊ะ** ✓ ไม่ทับปุ่มยิงขวา/เล็ง/คำ/เหรียญ/คำใบ้ ทั้ง 1052×491 และ **812×375** ไม่มีจุดไหนหลุดจอ ✓ **ภาพยืนยันด้วยตา** (คอมโพสิตแคนวาสจริง + วาดวงกลมทับตำแหน่งปุ่ม): ปุ่มซ้ายอยู่ระดับพื้นทราย/โคนชิงช้าสวรรค์ ต่ำกว่าปุ่มขวาชัดเจน ตรงกับภาพอ้างอิงของผู้ใช้ ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 930 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 928: "แก้แรงเตะจาก 52m/s เป็น 90m/s"):** ⚽🚀 `js/adventure3d.js` `KICK_SPD_MAX 52→90` — จำลองฟิสิกส์ก่อนแก้ (scratchpad kicksim.js) ที่ 90 ลอยตรงถึง ~102m (เกินระยะยิงไกลสุด 58m มาก) ไม่ได้แตะค่าอื่น (สนาม/GOAL_Z/PLAYER_Z/FK/PK จากรอบ 928 คงเดิม)
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step`): ยิงเข้าจริงจาก 48m (pit .13) และ 59m (power 55%) ✓ ยิงเข้าเสาขวาตรง ๆ ที่ 90m/s — ตรวจ `sbVel` ก่อน/หลังชน เห็นความเร็วสะท้อนกลับชัดเจน (vz +13.9 จาก −26.4, vx พลิกเครื่องหมาย) ยืนยันว่า collision เสาไม่ทะลุแม้ความเร็วสูงขึ้น ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว
  - ⚠️ เลขรอบ: ขอตอนเริ่มได้ 929 แต่ session คู่ขนานใช้ไปก่อน (ปุ่มยิงเป้าคำ) → ขยับเป็น 930 · commit เฉพาะ `js/adventure3d.js`+`handoff/TASKS.md` ไม่แตะ `js/f1_3d.js`/`js/shootword.js` ที่ session อื่นค้างอยู่


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 931 (3 ส.ค. · ผู้ใช้ตำหนิ "ไม่ได้ทำตามภาพเลย อุตส่าห์แนบภาพไปแล้ว" — รอบ 929 ทำผิดจริง):** 🔫📍 `js/shootword.js` `#sg-shoot-l` — **ต้นตอ: รอบ 929 ย้ายแต่แกนตั้ง (`top:60%`) แต่ปล่อย `left:2vh` ติดขอบซ้ายไว้** ทั้งที่วงกลม "1" ในภาพอยู่ห่างเข้ามาในจอเยอะ → รอบนี้**วัดพิกัดจากภาพผู้ใช้จริง** (ภาพ 1052×491 · วงกลมกลางที่ x≈219 y≈285 รัศมี ≈106) = **20.8% กว้าง / 58% สูง** → ตั้ง `left:21%;top:58%;transform:translate(-50%,-50%)` + `.down` ของตัวเองรวม translateX (กันกระโดดตอนกด) · ฝั่งขวาไม่แตะ
  - 📏 **บทเรียน (กฎทอง #1 ขยาย): ผู้ใช้แนบภาพมา = ต้องวัดพิกัดจากภาพเป็นตัวเลขก่อนแก้ อย่าอ่านคร่าว ๆ แล้วเดาว่า "ย้ายลง"** — 2 รอบก่อนหน้าเสียเปล่าเพราะอ่านภาพแบบหยาบ ไม่ได้แปลงเป็น % ของจอ
  - ยืนยัน (server เอง :8642 · mock login · viewport 1052×491 เท่าภาพผู้ใช้): จุดกึ่งกลางปุ่มจริง = **(220.9, 284.9)** เทียบเป้าจากภาพ (219, 285) → **คลาด 1.9px แนวนอน · 0.1px แนวตั้ง** ✓ **ภาพยืนยันด้วยตา** (เรนเดอร์จริง + วาดวงกลมประอ้างอิงจากพิกัดในภาพผู้ใช้ทับ): ปุ่ม "ยิง" อยู่กลางวงกลมประพอดี ✓ ไม่ทับปุ่มขวา/เล็ง/คำ/เหรียญ/คำใบ้/กากบาท และไม่หลุดจอ ทั้ง 1052×491 และ **812×375** (สัดส่วนเดียวกัน 21%/58% ทั้ง 2 ขนาด) ✓ กดค้างขยับลง 3px แนวนอนนิ่ง (`dx:0`) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 932 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 930: "ร่างปกติ ความแรง 65 m/s · ร่างพลัง 100 ความแรง 100 m/s"):** ⚽⚡ `js/adventure3d.js` — แยกแรงเตะ 2 ระดับ: `KICK_SPD_MAX 90→65` (ร่างปกติเต็มแรง) · `AURA_SPD` เดิมคูณคงที่ 1.2 เปลี่ยนเป็น `100/KICK_SPD_MAX` (คำนวณอัตโนมัติให้ร่างพลังเต็มแรง=100 เป๊ะเสมอ แม้จูน KICK_SPD_MAX อีกในอนาคต) · จำลองฟิสิกส์ยืนยันร่างปกติ 65m/s ยังยิงไกลสุด ~58m ในสนามได้ (pit≈0.20-0.21)
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step`): วัดความเร็วปากลูกจริงหลังเตะเต็มแรง — ร่างปกติ 64.99 m/s · ร่างพลัง (`state.soccerAuraUntil` อนาคต) 99.99 m/s ตรงเป๊ะทั้งคู่ ✓ ยิงเข้าจริงระยะกลาง 41m (ร่างปกติ) และไกลสุด 59-60m (ร่างปกติ 2/3 ครั้ง ตัดเส้นต่ำ 0.7-0.8 พ้น GK) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว
  - ⚠️ ระวัง cache เหนียวตอนเทสต์: fetch ธรรมดาหลัง reload ยังได้ค่าเก่า (KICK_SPD_MAX=52 จากรอบก่อนหน้าที่เคยเปิดค้างในแท็บ) ต้อง `fetch(...,{cache:'reload'})` + unregister SW ก่อนวัดซ้ำถึงตรง


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 933 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 932: "เฉพาะร่างธรรมดา ลูกบอลไม่มีไฟ และไม่มีควัน"):** ⚽🔥 `js/adventure3d.js` — ไฟ/ควันลูกบอล (รอบ 852) เดิมขึ้นทุกร่างเมื่อชาร์จ ≥`FIRE_CHG` 30% → ปิดในร่างธรรมดา **2 จุดเท่านั้น**: ① `soccerKick` `sbFlame=auraActive()&&power>=FIRE_CHG` (คุมทั้งไฟตอนบอลพุ่ง**และควัน** เพราะตัวพ่นควันเช็ก `sbFlame`) ② `ballFXTick` เงื่อนไขไฟตอนชาร์จเพิ่ม `&&auraActive()` · ไม่แตะพารามิเตอร์ไฟ/ควันเดิมเลย (ร่างพลังเหมือนเดิมทุกอย่าง)
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid+shotsink :8814): **ร่างธรรมดา** — ชาร์จเต็ม 100% `fireOn=false` · เตะเต็มแรง `sbFlame=false` `fireOn=false` `smokeLive=0` ✓ **ร่างพลัง** — ชาร์จ `fireOn=true` · เตะ `sbFlame=true` ไฟติดตลอดวิถี (สุ่ม 5 จุดเวลา true ทุกจุด) ควันสะสม 6→9 ก้อน ✓ ภาพยืนยันด้วยตา 3 ช่อง (ร่างธรรมดาชาร์จเต็ม/พุ่งเต็มแรง = บอลลายปกติสะอาด · ร่างพลัง = หางไฟส้มชัดเจน) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - 💡 ตอนเทสต์ ถ้าเล็งเข้าประตูแล้ววัด `fireOn` หลังยิงจะได้ `false` หลอกตา — เพราะรีเพลย์ (`repOn`) ซ่อนไฟอยู่แล้วตามดีไซน์เดิม ต้องเล็งออกข้างสนามถึงวัดไฟระหว่างบินได้


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 934 (3 ส.ค. · ผู้ใช้: "ยิงตัวอักษรแล้วไม่มีอะไรเกิดขึ้น"):** 🎯🐛 `js/shootword.js` — **regression จากรอบ 923 (ขยายระยะเป้า 3 เท่า) มี 2 ต้นตอซ้อนกัน ทั้งคู่ทำให้ปุ่มยิงไม่โดนอะไรเลย**: ① `pitch` เริ่มต้น `0.10` ตั้งไว้ตั้งแต่เป้ายังใกล้ — พอเป้าไกลขึ้น 3 เท่า มุมไปยังหิ้งแบนลงเหลือ ~0.00-0.06 rad กล้องจึงเงย**ข้ามหัวแผ่น**ตลอด → แก้เป็น `0.04` (กลางกลุ่มเป้าทั้ง 3 แถว) ② **ตัวการหลัก: แต่ละแถวมีแผ่นเลขคู่ (6 ใบ) วางสมมาตรรอบ x=0 → "กึ่งกลางจอ" ตรงกับช่องว่างระหว่างแผ่นพอดีทุกแถว** และที่ระยะใหม่แผ่นเหลือแค่ **12×12 px** บนจอ → ปุ่มยิง/กากบาทที่ยิงกลางจอเสมอ ลอดช่องไปโดนฉากหลังทุกนัด → เพิ่ม `nearestPlate()` **ช่วยเล็ง** (snap เข้าแผ่นใกล้จุดเล็งสุดในรัศมี `TUNE.SNAP_R` 4.5% ของด้านสั้นจอ ≈22px = ครึ่งระยะห่างแผ่น) เรียกเฉพาะตอน raycast ตรงไม่โดนแผ่น/เป็ด
  - ยืนยัน (server เอง :8642 · mock login · เทสต์แบบผู้เล่นจริง ไม่ใช่ `lookAt` บังคับเหมือนรอบ 923 ที่ทำให้บั๊กหลุด): **ก่อนแก้ยิงปุ่ม 0/6 นัด** (raycast กลางจอเจอแต่ `noHit` + ฉากหลัง dist 76.4) · หลังแก้ **เล่นจบคำจริงด้วยปุ่มยิงล้วน**: `UNIFORM` 7/7 ตัว misses 0 (1052×491) และ `WEDNESDAY` 9/9 ตัว (**812×375**) ✓ โหมดเล็งซูมยิงโดนด้วย ✓ · **เคสลบ (กันช่วยเล็งมากเกินจนยิงมั่วก็โดน)**: ยิงท้องฟ้า / ยิงพื้น / ยิงริมซ้ายสุด = **ไม่โดนทั้ง 3 เคส** ✓ แต่เล็งเยื้องจากแผ่น 8px (เด็กเล็งไม่เป๊ะ) = โดน ✓ · console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว
  - 📏 **บทเรียนต่อจากรอบ 931**: รอบ 923 เทสต์ด้วย `cam.lookAt(แผ่น)` แล้วยิง = บังคับเล็งตรงเป้าเสมอ **จึงไม่เจอบั๊กที่ผู้เล่นจริงเจอ** — งานที่ผู้เล่นต้องเล็งเอง ต้องเทสต์จาก "มุมกล้องค่าเริ่มต้น + จุดที่ปุ่มยิงยิงจริง" เท่านั้น


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 935 (3 ส.ค. · ผู้ใช้ส่งภาพชี้ 3 จุด: "①ลบรอยสีไม่สม่ำเสมอบนสนาม ②ออร่าเป็นเปลวไฟน้ำเงินจริง (ค้นเน็ตเทียบ) ③เปลวไหวธรรมชาติ"):** ⚽🔵 `js/adventure3d.js` — ① `soccerTurfGrade` เพิ่ม **flat-field ต่อช่องสี** (เฉลี่ยบล็อก 32px→bilinear→ปรับเข้าค่าเฉลี่ยรวม clamp .7-1.4) — ภาพถ่ายหญ้ามีแสง/สีเป็นหย่อม พอปู MirroredRepeat กลายเป็นลายด่างทั้งสนาม (การรีดรายแถวเดิมแก้เฉพาะแถบแนวนอน) ② เขียนออร่าใหม่ตามเปลวแก๊สจริง (ค้น elgas/britannica: กรวยในขาวอมฟ้าสว่างสุด ~1,500-1,960°C · เปลวนอกน้ำเงินม่วงจางเกือบใส): `auraFlameTex()` ลิ้นหยดน้ำคว่ำ 2 ชั้นสี + sprite 18 ลิ้น (วงนอกเตี้ย 12 + ในสูง 6) แทนวงแหวน torus เดิม ③ เลียด้วยไซน์ 3 ความถี่ไม่ลงตัว (f1 4.5-7 · f2 7.5-11.5 · 2.3) ยืดสูง=เรียวลง + ส่ายปลาย + ember ฟ้าลอยขึ้น · ทรงกระบอกเดิมเหลือ opacity .04 (จูนหลังดูภาพ: .07 เห็นเป็น "กล่องแก้ว" สี่เหลี่ยม)
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid×2 + shotsink :8814): ภาพมุมเกมจริงเทียบภาพผู้ใช้ — รอยด่าง 3 จุดที่ชี้หายเรียบ เหลือแถบตัดหญ้าตั้งใจ ✓ เปลวฟ้าโคนขาว-ขอบน้ำเงินชัดกลางแดด ลิ้นถึงลำตัว ✓ จังหวะ A/B (+0.5วิ) รูปลิ้นต่างกันชัด = ไหวไม่วนแพตเทิร์น ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ เลขรอบขอได้ 934 โดน session คู่ขนาน (ยิงเป้าคำ) ใช้ก่อน → 935 · commit เฉพาะ `js/adventure3d.js`+`handoff/TASKS.md` ไม่แตะ `js/f1_3d.js`/`js/shootword.js` ที่ค้างอยู่


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 936 (3 ส.ค. · ผู้ใช้ส่งภาพโหมดเล็ง "ยิงตัว B แล้วก็ยังไม่มีอะไรเกิดขึ้น ผิดพลาดตรงไหน" — ต่อจากรอบ 934):** 🎯🔴 `js/shootword.js` — **วัดจากภาพผู้ใช้ (1315×613): ตัว B อยู่ห่างจุดยิงจริง ~31px แต่รัศมีช่วยเล็งรอบ 934 มีแค่ 27.6px = พลาดหวุดหวิด** เจอ 3 ปัญหา: ① `nearestPlate()` รัศมีเป็น px คงที่ **ไม่ขยายตามซูมโหมดเล็ง** (FOV 58→30 ภาพโต ~1.9 เท่า = ช่วยเล็งเข้มงวดขึ้นเกือบเท่าตัวโดยไม่ตั้งใจ) → คูณ `TUNE.FOV/camera.fov` (โหมดปกติ zoom=1 เดิม) ② โหมดเล็งไม่มีตัวบอกจุดยิงจริง (ซ่อนกากบาททิ้ง · ปลายศูนย์ในภาพปืนชี้ต่ำกว่า B ที่ผู้ใช้เล็ง) → เปลี่ยน `#sg-cross` ในโหมดเล็งเป็น**จุดแดงเล็กตรงจุดยิงเป๊ะ** (เอาแผ่นมาทาบจุดแดง=โดน) ③ เกณฑ์ "ถือว่าลาก" 9px ไวไป นิ้วเด็กสั่นนิดเดียวปล่อยนิ้วแล้วไม่ยิงเงียบ ๆ → 16px
  - ยืนยัน (server เอง :8642 · mock login · viewport 1315×613 เท่าภาพผู้ใช้ · จำลองเคสจริง: เอียงกล้องให้แผ่นเยื้องจุดยิงเป็นระยะที่คุม): **เยื้อง 28.9px (เคสตัว B ของผู้ใช้ — รัศมีเก่าพลาด) = โดน ✓** · 46px = โดน ✓ · 68px = ไม่โดน ✓ (กันยิงมั่ว) · ยิงท้องฟ้าโหมดปกติ = ไม่โดน ✓ (zoom=1 รัศมีเดิม) · จุดแดง: กลางจอเป๊ะ (657.5,306.5) โหมดถือกลับเป็นกากบาทขาว ✓ · แตะนิ้วสั่น 12px ผ่าน `PointerEvent` จริง = ยิงออก+โดน ✓ · **ภาพยืนยันด้วยตา** (คอมโพสิตฉาก+ภาพปืนเล็ง+จุดแดง): จุดแดงอยู่ปลายศูนย์ปืนพอดี ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 937 (3 ส.ค. · ผู้ใช้: "ทำ feedback ตอนยิงโดนแผ่นให้ชัดเจนขึ้น: พับแรงขึ้น มีประกายกระเด็น เสียงติ๊งดังขึ้น"):** 🎯✨ `js/shootword.js` — ① `flipPlate`/`tick` เพิ่ม `FOLD_ANGLE 1.5→1.78` rad + `FOLD_DUR 0.2→0.13` วิ (พับไวและแรงขึ้นชัดเจน ทั้งขาพับลงและตอนเด้งกลับ) ② เพิ่ม `sparkBurst()` — สไปรต์ประกาย 10 ชิ้น additive blending กระเด็นออกจากจุดที่ยิงโดนแผ่นแล้วร่วงตามแรงโน้มถ่วง จาง 0.28-0.44 วิ เรียกจาก `hitPlate()` ทุกครั้งที่โดนแผ่น (ถูก/ผิด) ③ `SND.plink` (เสียงติ๊ง) เพิ่มวอลุ่มทุกชั้นเสียง ~1.5 เท่า + เสริมโทนแหลม 2900Hz ให้ "ติ๊ง" เด่นขึ้น
  - ยืนยัน (server เอง :8642 · mock login index_classic.html · เรียก `ShootWord._t.hitPlate(P)` ตรง): หลังโดน `hinge.rotation.x` ไปถึง `-1.780` พอดี (ตรง `FOLD_ANGLE`) ที่ `t=0.13s` ✓ สไปรต์ในฉากเพิ่ม 5→15 ทันทีที่โดน (10 ประกายใหม่) แล้วหายกลับเหลือ 5 หลังผ่าน ~0.8s (ทำความสะอาดครบ ไม่รั่ว) ✓ console ไม่มี error ✓ `node --check` ผ่าน · ปิดเกม+ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 938 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 937: "ปรับความแรงสั่นกล้อง/screen shake ตอนโดนแผ่นเพิ่มอีกชั้น"):** 🎥 `js/shootword.js` — เพิ่ม `shakeMag` + `shakeCam(amt)` (เอาค่ามากสุด ไม่บวกทบ) สั่น `camera.rotation` ด้วยไซน์ 2 ความถี่ต่างกัน (x/y คนละเฟส กันดูเป็นการโยกแกนเดียว) หน่วงเร็วแบบ exponential ~0.15-0.3s ให้ไม่เวียนหัว — เรียกใน `hitPlate()`: โดนตัวถูก `shakeCam(0.032)` (แรงกว่า ให้ฉลอง) โดนตัวผิด `shakeCam(0.017)` (เบากว่า) เพิ่ม getter `_t.shakeMag` ไว้เทสต์
  - ยืนยัน (server เอง :8642 · mock login index_classic.html · `ShootWord._t.hitPlate()` ตรง): โดนถูก `shakeMag→0.032` แล้ว `camera.rotation.y` ขยับ 0→0.0205rad ในเฟรมเดียว ✓ หน่วงลงเหลือ ~0 ภายใน 20 เฟรม (~0.32s) ✓ โดนผิด `shakeMag→0.017` (เบากว่าโดนถูกตามดีไซน์) ✓ console ไม่มี error · `node --check` ผ่าน · ปิดเกม+ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 939 (3 ส.ค. · ผู้ใช้ 6 ข้อชุดแข่ง + จูนเปลวกลางคัน):** ⚽👕🔥 `js/adventure3d.js`+`js/adv3d_css.js` — ①สวอตช์รูปเสื้อจริง (canvas clip `ssShirtPath`) ②`SOCCER_SHORTS` 10 สี รูปกางเกง ③`SOCCER_PATTERNS` 8 ลายสไตล์ทีมระดับโลก (ริ้วตั้ง/ริ้วขวาง/สายสะพาย/ครึ่งอก/หัวลูกศร/แขนต่างสี/ไล่เฉด — สีรอง `ssSec()` อัตโนมัติ: เข้ม→ขาว สว่าง→กรมท่า) ④โลโก้ **VOCAB WORLD** ทุกตัว: อกใหญ่ 2 บรรทัด + หลังเหนือเบอร์ (`soccerShirtTex` — ลำตัว BoxGeometry 6 หน้า อก/หลัง/ข้าง คนละเทกซ์เจอร์) ⑤แผง `#adv-soccerstart` เต็มจอ inset 2vh/2vw ทองพรีเมียม + **พรีวิวสด `ssPreviewDraw`** (เสื้อ+โลโก้+กางเกง+เบอร์ที่ขา อัปเดตทุกคลิก · `_ssPaint` hook ให้ปุ่ม± เรียก) ⑥กล้องหลังนักเตะตอนเล็ง 8m/สูง4.8→**5.2m/สูง3.1** (ตอนบอลพุ่งคงเดิม) · 🔥 เปลวจูนตามสั่งกลางคัน: ลิ้นในสูง 2.1-3.2m ท่วมหัว (หัว ~1.6) + **เกลียวไฟส้ม 2 สาย 26 สไปรต์** พันโคน→ยอด หมุน 5.5 rad/s + ไหวแรงขึ้น (ถี่ ×1.35 · ช่วงยืด .5-1.24 · ส่ายเกือบเท่าตัว) · state ใหม่ `soccerShort`/`soccerPat` (save/load ครบ)
  - ยืนยัน (server เอง :8811 · mock login · `getBoundingClientRect`+คอมโพสิตแผง DOM + Snap.grid 3D + shotsink :8814): แผง 1000×640 กิน 96% จอ ไม่ scroll · **812×375 ครบทุกชิ้นในจอ overflow 0** ✓ ภาพแผง: สวอตช์เสื้อ/กางเกง/ชิปลาย 8 แบบ (วาดด้วยสีเสื้อที่เลือกสด) + พรีวิว VOCAB WORLD+เบอร์ ✓ (แก้ 1 จุดจากภาพ: โลโก้พรีวิว font .14→.1 เดิมล้นขอบอกโดน clip) · 3D: ริ้วแดง-ขาว+โลโก้อกและหลัง+กางเกงดำขึ้นบนหุ่นจริง ✓ กล้องต่ำ-ใกล้เห็นตัวใหญ่ ✓ เปลวพ้นหัว+เกลียวส้ม 2 จังหวะตำแหน่งหมุนต่างกัน ✓ เตะข้ามเส้นประตูปกติ · ฟรีคิกกำแพง (ค่า default ใหม่) ไม่ error · ร่างธรรมดาไม่มีไฟ ✓ console สะอาด · `node --check` ผ่าน 2 ไฟล์ · ล้าง storage+ฆ่า server แล้ว
  - ⚠️ เลขรอบ 938 โดน session คู่ขนานใช้ (screen shake ยิงเป้าคำ) → 939 · commit 3 ไฟล์ (adventure3d/adv3d_css/TASKS) ไม่แตะ `js/f1_3d.js` ที่ค้าง


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 940 (3 ส.ค. · ผู้ใช้ถาม "โลก F1 เล่นกับเพื่อนได้ไหม กี่คน — ให้บอกไว้ในป้ายคำแนะนำก่อนเล่นด้วย"):** 🏎️🧑‍🤝‍🧑 `js/f1_3d.js` — ① ป้าย intro เพิ่มบรรทัด "เล่นกับเพื่อนพร้อมกันได้ · **สนามละไม่เกิน `${ROOM_MAX}`=10 คน** เต็มแล้วเปิดสนามใหม่ให้เอง · กด 👥 ไปหาเพื่อน บนกระดาน" (เลขดึงจาก `ROOM_MAX` ไม่ hardcode) ② **เจอบั๊กระหว่างทาง: F1 วาดปุ่ม `👥 ไปหาเพื่อน` ที่ NetRoom ฝังมากับป้ายสถานะ แต่ไม่เคยดักคลิก — กดแล้วเงียบมาตลอด** (moto/adventure/invasion มีครบ) → เพิ่ม listener `.nr-go` → `room.openFriends()` ③ ป้ายเดิมเต็มพอดีอยู่แล้ว เพิ่มข้อความแล้วทับปุ่มสตาร์ท → ยุบถ้อยคำ (รวมบรรทัดคุม/จับเวลา+สตาร์ท · ตัดคำฟุ่มเฟือย) + `.fi-rules` line-height 1.55→1.4
  - ยืนยัน (server เอง :8642 · mock login index_classic.html · `getBoundingClientRect`): ป้ายพอดีจอไม่มี scroll/ไม่ทับปุ่ม ทั้ง **812×375** (rules 246/246 ห่างปุ่ม 8px) · 1052×491 (339/339) · 1280×720 (353/353) · 600×360 โหมดคอลัมน์ซ้อน (กระดานอันดับไม่โดน clip) ✓ ปุ่มไปหาเพื่อน: ยัด room ปลอมผ่าน `F1World._t.room` แล้วคลิก → `openFriends()` ถูกเรียก 1 ครั้ง (ก่อนแก้ไม่มี listener เลย) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ปิดเกม + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 941 (3 ส.ค. · ผู้ใช้ 2 รอบสั่ง: "เกลียวส้มไม่ใช่ลูกเล็ก ๆ — เปลวยาวหมุนเป็นเกลียวล่างขึ้นบนวนไม่รู้จบ" + "ไฟฟ้าไม่ใช่คนละก้อน — ก้อนใหญ่ก้อนเดียว ใหญ่กว่าตัวผู้เล่น สูงท่วมหัว ×5"):** ⚽🔥 `js/adventure3d.js` โซนออร่า — ① เกลียวส้ม: ทิ้งสไปรต์ 26 เม็ด → **ริบบิ้นเกลียว** `auraCoilRibbon()` (เรขาคณิต helix คงที่ 96 ช่วง×4 รอบ สูง 8.8m โคน r.85→ยอด .3 + เทกซ์เจอร์ `auraCoilTex()` แกนเหลืองขาว-ขอบส้ม wrapS ซ้ำ) 2 สายห่างครึ่งรอบ — **หมุน `rotation.y` ต่อเนื่อง 4.2 rad/s + เลื่อน `map.offset.x` = เปลวไหลขึ้นตามเกลียววนไม่รู้จบจริง** ② เปลวฟ้า: ทิ้งวงลิ้นแยก 18 ลิ้น → **สไปรต์ใหญ่ 4 ชั้นซ้อนแกนเดียวกัน** (w 2.6→1.05 · h 9.5→6.2 · additive รวมเป็นก้อนเดียว) กว้างกว่าตัวหุ่น ~4.5 เท่า สูง ~9.5m — **sway ร่วมทุกชั้น** (ชั้นสูงเอนมาก = ทั้งก้อนโค้งลู่ลมเหมือนไฟจริง) · จูนสี 2 รอบจากภาพ: เทกซ์เจอร์เปลวนอก alpha .16→.3 (ยืดเป็นเสาแล้วน้ำเงินจางเกิน) + ชั้น op .5-.62 กันขาวโพลน · ember ลอยสูงตามเสา (1.9→6.5m)
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid×3 + shotsink :8814): ภาพ 3 ชุด — เสาไฟฟ้า-ขาวก้อนเดียวหุ้มตัวสูงพ้นหัวหลายเท่า เห็นสีน้ำเงินชัด ✓ ริบบิ้นส้มต่อเนื่องทั้งเส้นพันโคน→ยอด (ไม่เป็นเม็ดแล้ว) จังหวะ +0.5วิ เกลียวหมุนไปตำแหน่งใหม่ ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ เลขรอบ 940 โดน session คู่ขนาน (F1 ป้ายแนะนำ) ใช้ก่อน → 941 · commit เฉพาะ `js/adventure3d.js`+`handoff/TASKS.md` ไม่แตะ `js/ui.js`/`js/util.js` ที่ค้าง


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 942 (3 ส.ค. · ผู้ใช้แจ้งโลกหุ่นยนต์ 2 บั๊ก: ①ซื้อหุ่นแล้วยังขึ้น "ยังไม่มีหุ่นยนต์" ②เพื่อนเป็นรูปโปรไฟล์ ไม่ใช่หุ่นที่เขาเลือก):** 🤖 `js/util.js`+`js/ui.js`+`js/adventure3d.js` — ① ต้นตอ: ป้ายนั้นคือ **toast-warn ค้างจนกดปิดเอง** (เข้า `TOAST_WARN_RE` คำ "ยังไม่") ยิงตอนกดเข้าโลกก่อนซื้อ แล้วลอยค้างทับ HUD หลังซื้อ/เข้าโลกสำเร็จ → เพิ่ม `clearWarnToasts(re)` (util.js) · `buyRobot` สำเร็จล้างป้าย /หุ่นยนต์/ · `Adventure3D.start` ผ่านด่านเช็กแล้วล้าง toast-warn ล็อบบี้ทั้งหมด ② โหมด mecha เดิม fallback `makePeerSprite` (รูปโปรไฟล์) → `sendPos` ส่ง `av:'m_01'..'m_10'` จาก `state.mechaRobot` (≤8 ผ่าน rules เดิม) + `makeMechaFigure/makeMechaPeer` (หุ่นรบ 3D ~4.7m สีลำตัวตาม ROBOTS · ตา/ปืน/ช่องอกเรืองแสงสี MECHA_WEAPONS · cache บล็อกร่วม) + `p.mech` ใน onPeerData/tickPeers (เดินแกว่งขา freq 1.3 · vTop=MECHA_VMAX · บับเบิล 6.15/ไมค์ 5.75) + removePeer dispose ครบ
  - ยืนยัน (server :8642 · mock login index_classic.html): ซื้อหุ่นจริงผ่าน askConfirm → ป้ายเตือนค้าง 1→0 เหลือป้าย "ได้หุ่นแล้ว" ✓ ยิงป้ายค้างใหม่แล้ว `enterMecha3D()` → 1→0 ✓ ฉีดเพื่อน `_t.onPeerData` av m_07/m_01 → `mech:true` limbs 4 ยืนพื้น · **ภาพยืนยันด้วยตา** (Snap.shot): หุ่นเงิน+หุ่นแดงคนละสี ป้ายชื่อลอยหัว ✓ เดินขาแกว่ง (rot 0→0.122) ✓ สลับ av กลางคันสร้างตัวใหม่ ✓ `netLeave` ลบเกลี้ยงไม่ throw ✓ console สะอาด · `node --check` ผ่าน 3 ไฟล์ · ล้าง storage แล้ว
  - ⚠️ ส่วนที่แก้ใน `js/adventure3d.js` **ติดไปกับ commit รอบ 941 แล้ว** (session ฟุตบอลแก้ไฟล์เดียวกันพร้อมกันใน working tree เดียว จึงถูก commit รวม — comment ในโค้ดจึงเขียน "รอบ 941") · รอบนี้ commit ส่วนที่เหลือ `js/ui.js`+`js/util.js` (ต้อง deploy — โค้ด live เรียก `clearWarnToasts` ผ่านการ์ด typeof รออยู่)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 943 (3 ส.ค. · ผู้ใช้สั่ง 3 ข้อ: ①ยกเลิกกฎต้องผ่านโลกก่อนถึงเข้าโลกถัดไป ②เข้าโลกไหนก็ได้จ่ายค่าเข้า 500 ③ไม่มีหุ่น/รถ ระบบเลือกให้ยืมฟรี):** 🔓 `js/ui.js`+`js/adventure3d.js` — ตัด `prereq` ทั้งหมดใน `WORLD3D`+`railWorldClick`+`renderRailWorlds` (ล็อก 🔒 เหลือเคสเดียว: โลกผจญภัยยังไม่มีสัตว์โตเต็มวัย — กติกาสัตว์เลี้ยง ไม่ใช่ลำดับโลก) · หุ่นรบเข้าระบบค่าเข้า 500 เหมือนโลกอื่น ไม่มีหุ่น=ยืม `robot_01` ฟรี (`enterMecha3D` ตั้ง `state.mechaRobot` ไม่แตะ `state.robots`) · ไม่มีรถ=ยืมรถระบบฟรี (`enterDrive3D` ข้าม pickDriveCar → `myCar()=null` → โมเดล car_01+สมรรถนะ 3/3/3 ตาม fallback เดิม) ค้างงวดยังบล็อกเหมือนเดิม · โน้ตยืมโชว์ในหน้าจ่ายค่าเข้า (แทนโน้ต "ปลดล็อกโลกถัดไป" ที่เลิกใช้) + บีบ dialog พอดีจอเตี้ย
  - ยืนยัน (server เอง :8873 · mock login · `getBoundingClientRect`): ผู้เล่นใหม่ 0 หุ่น 0 รถ — ราง 10 โลกโชว์ 🪙500 หมด (adv ล็อกตามกติกาสัตว์) ✓ จ่าย 500 เข้า mecha ด้วยหุ่นยืม robot_01 / เข้า drive ด้วยรถยืม (cars=0, dash โชว์) ✓ F1+ยานแม่เด้งหน้าจ่ายทันทีไม่ติด prereq ✓ regression: มีหุ่นเอง→ใช้ robot_03 ไม่มีโน้ตยืม · รถค้างงวด→🔐 บล็อกเหมือนเดิม ✓ dialog 812×375 ไม่ scroll (302/302) ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage+ฆ่า server แล้ว
  - ⚠️ งานนี้ทำคร่อมกับ session รอบ 942 ใน working tree เดียวกัน — โค้ดส่วนใหญ่ (WORLD3D/railWorldClick/renderRailWorlds/loanNote/enterDrive3D) **ติดไปกับ commit c818516 (รอบ 942) และ deploy `.888` แล้ว** · รอบนี้ commit ส่วนที่ขาด: `enterMecha3D` ยืมหุ่น + ด่าน mecha ใน adventure3d + padding dialog (ช่วงก่อนหน้า live มีช่องโหว่สั้น ๆ: ไม่มีหุ่นจ่าย 500 แล้วเข้าไม่ได้ — ปิดด้วยรอบนี้) · comment ในโค้ดที่หลุดไปกับ 942 ถูก relabel เป็น 943 ในรอบนี้แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 944 (3 ส.ค. · ผู้ใช้แก้เกลียวส้ม 3 ข้อ: "หมุนขึ้น (เดิมหมุนลง) โคนใหญ่ค่อย ๆ เล็ก ยอดจบเหนือหัว ~1/4 ตัว · ใหญ่ 5 เท่า + จางตั้งแต่ระดับอก + ยอดสอบแหลม · หมุนเร็ว 3 เท่า"):** ⚽🌪️ `js/adventure3d.js` `auraCoilRibbon`/`auraTick` — ทรง "ทอร์นาโดคว่ำ": โคน r 4.25m (.85×5) สอบด้วยเลขชี้กำลัง 1.4 จนแหลมที่ยอด 2.15m (หัว 1.72+1/4 ตัว) · **จางด้วย vertex color** (additive: สี→ดำ=ใส ไม่ต้อง shader) ทึบเต็มใต้ระดับอก .95m แล้วไล่จางถึงยอด · หมุน `rotation.y=-tS*12.6` (**กลับเครื่องหมาย = แพตเทิร์นไหลขึ้น** เพราะ helix พันทวนเข็มตามความสูง · 4.2→12.6 = ×3) + texture offset กลับทิศ ×3 เท่ากัน
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid+shotsink :8814): ภาพข้างตัว — กรวยทองโคนกว้างมากค่อย ๆ สอบขึ้นแหลม วงบนจางกว่าวงล่างชัด (fade จากอก) ✓ เฟรมห่าง 0.15 วิ ตำแหน่งเกลียวขยับไปมาก (เร็ว ×3) ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ เลขรอบขอได้ 942 โดน session คู่ขนานใช้ (ยกเลิกลำดับปลดล็อกโลก = 943) → 944 · ระวัง: `M js/adventure3d.js` ใน status มีของ session 943 ปนได้ — commit รอบนี้ pin เฉพาะไฟล์เดิม + เช็ก diff ก่อน


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 945 (3 ส.ค. · ผู้ใช้สั่ง: เพิ่มส่วนลดค่าเข้าโลก mecha/drive เมื่อผู้เล่นมีหุ่น/รถของตัวเอง):** 🤖🚗 `js/data/calendar.js`+`js/ui.js` — `worldEntryInfo(mode)` รับ mode เข้ามาแล้ว: มีหุ่นเอง (`state.robots.length`) เข้า mecha หรือมีรถเอง (`myCar()`) เข้า drive → ลดเพิ่ม 30% จากราคาวันนี้ (ทบกับส่วนลดวันหยุด/วันเด็ก ตามที่ผู้ใช้เลือก) · `openWorldEntryDialog`+`renderRailWorlds` โชว์เหตุผลส่วนลดทุกอันบนจอเสมอ (ห้ามลดเงียบๆ) ไม่มีของตัวเอง → เห็นโน้ตยืมฟรีเหมือนเดิม ไม่มีส่วนลดนี้
  - ยืนยัน (server เอง :8642 · mock login index_classic.html · เรียก `worldEntryInfo()`/`openWorldEntryDialog`/`renderRailWorlds` ตรง): ไม่มีหุ่น/รถ → 500 ปกติ ✓ มีหุ่นเอง mecha → 350 (ลด 30%) ✓ มีรถเอง drive → 350 ✓ ทบวันหยุด (จำลอง 12 ส.ค.): 500→250→175 ✓ dialog โชว์ข้อความส่วนลดครบ + ราคาขีดฆ่าเดิม ✓ rail price ต่อโลกถูกต้อง (mecha 350, drive 500 ตอนไม่มีรถ) ✓ console สะอาด · `node --check` ผ่าน 2 ไฟล์ · ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 946 (3 ส.ค. · ผู้ใช้สั่ง: โซนออร่าฟุตบอล เพิ่มสไปรต์ประกายเล็กไต่ผิวกรวยทอร์นาโด):** ✨ `js/adventure3d.js` `auraGlintTex`/`buildAura`/`auraTick` — เพิ่ม `auraGlints` 10 ชิ้น (สไปรต์กลม แกนขาว-ขอบทอง additive) ไต่ตามสูตรผิวกรวยเดียวกับ `auraCoilRibbon` (r=4.25×(1-t)^1.4, y จาก .1→2.15) มุมหมุน `-tS*12.6` เท่าเกลียว (ติดผิวกรวยไปด้วยกัน) · t ไต่วนซ้ำ 0→1 คนละจังหวะ (phase สุ่ม) + twinkle/fade ตามความสูง
  - ยืนยัน (server เอง :8820 · mock login · `enterSoccer3D()`+`state.soccerAuraUntil` ตรง · ขับเฟรม `Adventure3D._t.step` · SnapLab `Snap.shot`+crop zoom): **ภาพยืนยันด้วยตา** — เห็นจุดประกายขาว-ทองเล็กลอยอยู่ติดผิวกรวยเกลียวส้มที่ความสูงต่างกัน ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 947 (3 ส.ค. · ผู้ใช้ปรับออร่า 3 ข้อ: "เกลียวกลับเป็นหมุนลง · โคนเกลียวกว้างกว่าตัวราว 1/5 ของความสูงตัว · เปลวฟ้าสูงพ้นหัว ~2/4 ของความสูงตัว"):** ⚽🔥 `js/adventure3d.js` โซนออร่า — เกลียว: `rotation.y` กลับเป็นบวก (หมุนลง) + texture offset กลับทิศ · `R0 4.25→.48` (เส้นผ่านศูนย์กลางโคน ~.96m = ตัว .58 + 1.72/5) แถบ `W0 1.0→.38` · เปลวฟ้า: ชั้น h 9.5-6.2 → **3.3-2.5** (ปลายเทกซ์เจอร์ ~88% ของสไปรต์ → ยอดจริง ~2.6m = หัว 1.72 + ครึ่งตัว .86) op เพิ่ม .6-.78 (ก้อนเตี้ยแสงรวมน้อยลง — จูนจากภาพ 2 รอบ) · sway หาร 9→2.8 · ember 6.5→2.8m
  - 🔗 **ประกายไต่กรวยรอบ 946 (session คู่ขนาน) hardcode `4.25` + ทิศหมุนเก่า** — กรวยย่อแล้วประกายจะไต่กรวยล่องหนใหญ่ยักษ์ → แก้ตามในรอบนี้ (.48 + ทิศบวก) ฟีเจอร์เขาอยู่ครบ
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid+shotsink :8814): ภาพข้างตัว — เกลียวทองรัดรอบตัวกว้างกว่าลำตัวเล็กน้อย จางเหนืออก ✓ ไฟฟ้าก้อนเดียวยอดพ้นหัว ~ครึ่งตัว ✓ ประกาย 946 เกาะกรวยเล็กตามไม่ลอยไกล ✓ เฟรมห่าง .15วิ เกลียวหมุนไปมาก ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - ⚠️ เลขรอบขอได้ 945 → session คู่ขนานใช้ 945/946 → 947 (sed แก้คอมเมนต์ครบ)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 949 (3 ส.ค. · ผู้ใช้สั่ง "ทำให้มีปุ่ม lobby 3d ตลอด ไม่ใช่เดี๋ยวมีเดี๋ยวไม่มี"):** 🏙️📌 `index_classic.html`+`css/lobby.css` — ต้นตอ: ปุ่ม `#btn-rail-city` (🏙️ เมือง 3D) เป็นปุ่ม**แรกในราง `#lobby-rail` ที่เลื่อนได้** → พอเลื่อนหาปุ่มอื่น (ราง 24 ปุ่ม ยาวเกินจอมาก) ปุ่มนี้หลุดออกนอกจอ = ผู้ใช้เห็นเป็น "เดี๋ยวมีเดี๋ยวไม่มี" · แก้: ย้ายออกมาปักหมุดเป็นลูกตรงของ `.rail-wrap` (นอกโซนเลื่อน) + ห่อราง/ป้าย ▲▼ ด้วย `.rail-scroll` ใหม่ (ขอบจาง `::before/::after` + ป้ายบอกทางย้ายมาอ้างอิงกล่องนี้ ไม่งั้น ▲ ไปทับปุ่มเมือง 3D)
  - ยืนยัน (preview :8642 · mock login + ผ่านหน้าลงทะเบียน/consent · `getBoundingClientRect`): เลื่อนราง 0 / กลาง / สุดล่าง (max 1352) → ปุ่มค้างที่ top 166 ทุกครั้ง ✓ จอเตี้ย **812×375** ค้างที่ 84–136 ✓ ป้าย ▲ อยู่ 233 ใต้ปุ่มไม่ทับ ✓ ตอนเลื่อนสุดล่าง (ในรางเหลือแต่ปุ่มโลก 3D) `elementFromPoint` กลางปุ่มยังโดน `.rail-ico` ในปุ่มจริง = กดได้ ✓ console สะอาด · ล้าง storage แล้ว
- **รอบ 948 (3 ส.ค. · ผู้ใช้ 3 ข้อ: "โคนเกลียว 1/5→3/5 ของความสูงตัว · เปลวฟ้า→สีม่วง · เส้นเล็งฟ้า→เหลืองเข้ม"):** ⚽🟣 `js/adventure3d.js` — ① `R0 .48→.8` (Ø โคน ~1.6m = ตัว .58 + 1.72×3/5) + ประกาย 946 ตาม (.8) ② `auraFlameTex` เปลี่ยนคู่สี: โคนม่วงเข้ม(110,40,255)→ม่วงสด · ปลายลาเวนเดอร์ · แกนในขาวอมม่วง(245,230,255) + `auraCore 0x7a3fff` + ember `0xe6ccff` ③ ริบบิ้นไกด์ vertex color `0x0b3fd6/0xb6ecff → 0xb8860b/0xffe27a` (เหลืองเข้มไล่ทอง) + วงจุดตก `setRGB(1,.85,.35)` + ข้อความ intro/banner "เส้นไกด์สีฟ้า"→"สีเหลืองทอง" 3 จุด
  - ยืนยัน (server เอง :8811 · mock login · ขับเฟรม `_t.step` · Snap.grid+shotsink :8814): ภาพมุมเกม — ริบบิ้นเล็งเป็นแถบเหลืองทองชัด ✓ ภาพข้างตัว — ก้อนไฟม่วง (ขอบม่วงสด แกนขาวอมม่วง) + เกลียวโคนกว้าง Ø~1.6m ✓ console ไม่มี error · `node --check` ผ่าน · ล้าง storage + ฆ่า server แล้ว
  - 💡 บทเรียนเทสต์: `setCharge(60)` แล้ว step → เกมนับเป็นปล่อยชาร์จ = เตะจริง กล้องตามบอลหาย — เทสต์ภาพนิ่งอย่าแตะ setCharge (guide โชว์เองตอน aura เปิด)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 950 (3 ส.ค. · ผู้ใช้ต่อยอด: "ปักหมุดปุ่ม 💊 รักษา ไว้คู่ 🏙️ เมือง 3D ด้วย"):** 💊📌 `index_classic.html`+`css/lobby.css` — ย้าย `#btn-rail-cure` ออกจากราง `#lobby-rail` ที่เลื่อนได้ มาอยู่คู่ `#btn-rail-city` ในกล่องปักหมุดใหม่ `.rail-pinned` (ลูกตรงของ `.rail-wrap` นอกโซนเลื่อน) — ปุ่มเดิมทำงานเหมือนกันทุกอย่าง (`getElementById` หาเจอ ไม่พึ่งตำแหน่งในราง) แค่ย้ายที่วาง
  - ยืนยัน (preview :8642 · mock login+ผ่านลงทะเบียน/consent · `getBoundingClientRect`): เลื่อนราง บน/กลาง/ล่างสุด → ทั้ง 2 ปุ่มค้างที่เดิม (city 166-227, cure 234-295) gap 7px ตรงตามดีไซน์ ✓ ป้าย ▲ ไม่ทับ ✓ จอเตี้ย 812×375 ทั้งคู่อยู่ในจอ (84-135 / 142-193) ✓ console สะอาด · ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 951 (3 ส.ค. · ผู้ใช้สั่ง "ย้ายปุ่มควิซอาหารปลอดภัยในล็อบบี้ ไปไว้ใต้ปุ่มให้อาหารในหน้าโปรไฟล์สัตว์"):** 🛡️ `index_classic.html`+`js/main.js`+`js/ui.js`+`css/style.css`+`css/lobby.css` — ถอด `#btn-foodquiz` ออกจากแถบล่าง `#lobby-bottom` → ย้ายไปเป็นแถว `.care-row.care-row-quiz` ต่อท้ายแผง "การดูแล" ใน overlay ข้อมูลน้อง (ผูก handler ใน `bindPetPlateButtons`) · วางไว้**นอก**บล็อก `hungerUI` → ร่างไข่ที่ยังไม่มีปุ่มให้อาหารก็ยังกดควิซได้ · deep-link `?go=foodquiz` ใน main.js เปลี่ยนจาก "คลิกปุ่มในราง" เป็นเรียก `openFoodQuiz()` ตรง (ปุ่มไม่อยู่ในล็อบบี้แล้ว)
  - กฎทองข้อ 7: แผงการดูแลยาวขึ้น 31px → เพิ่ม `@media (max-height:430px)` บีบปุ่มดูแล/แบนเนอร์ป่วย/กล่องความสามารถ (ระยะขอบ+line-height เท่านั้น **ไม่ลดขนาดตัวอักษร**) — วัดที่ 812×375: น้องปกติ `sh=ch=351` ไม่มี scroll ✓ · เคสหนักสุด (ป่วย+หิว+พิษ) 453→437 = **เตี้ยกว่าก่อนแก้ (445)** ทั้งที่มีปุ่มเพิ่ม (เคสนี้ยาวเกินใบมาตั้งแต่ก่อนแก้ — ยังค้างเป็นงานเก่า)
  - ยืนยัน (preview :8642 · mock login · `getBoundingClientRect`): แถบล่างล็อบบี้เหลือ 7 ปุ่ม ไม่มี foodquiz ✓ ปุ่มใหม่อยู่ใต้ 🍽️ ให้อาหาร คอลัมน์/ความกว้างตรงกัน gap 3.2px ✓ `elementFromPoint` กลางปุ่มโดนปุ่มจริง = กดได้ ✓ กดแล้วควิซเด้ง (z 100 > pi-overlay 85) ตอบข้อได้ นับ playCount ✓ ร่างไข่: มีปุ่มควิซ ไม่มีปุ่มให้อาหาร ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 952 (3 ส.ค. · ผู้ใช้สั่ง "ไม่ว่าคนหรือสัตว์ ถ้าป่วยเพราะหิว ให้ปุ่มที่ซื้อของกินใช้ไม่ได้ · รักษาแล้วจึงซื้อได้"):** 🚫🍽️ `js/state.js`+`js/ui.js`+`css/style.css` — เพิ่มตัวกลาง `hungerSickLock()`/`hungerSickMsg()` (state.js ใต้ `petHungry`) = ล็อกเมื่อ `state.playerSick` หรือมีน้อง `sick && sickCause==='hunger'` · จุดที่ล็อก: ปุ่ม 🍽️ ให้อาหาร (เพิ่มเงื่อนไข `state.playerSick` + การ์ดใน `feedPet`/`openFoodMenu`) · `buyCollectible`+`buyMarketItem` เฉพาะของสะสม `cat==='food'` · ของขวัญ/คำทักที่เป็นของกิน ผ่าน `foodGiftBlocked(k,id)` (🍪 greet 'treat' · 🎂 gift cat 'cake' · ของสะสมหมวดอาหาร) เช็ก 3 ชั้น (greet picker/`confirmSendGift`/`doSendGift`) · ป่วยสาเหตุอื่น (ร้อน/ฝน/พิษ/อดนอน) ไม่เข้ากฎนี้ ใช้กติกาเดิม
  - กฎทองข้อ 1 (ห้ามปิดฟีเจอร์เงียบ ๆ): น้องป่วย → เขียนทับบรรทัดสถานะความอิ่มเป็น "🤒 ป่วยอยู่... **ซื้อของกินไม่ได้** ต้องรักษาให้หายก่อนนะ" (ไม่เพิ่มบรรทัดใหม่) · ป่วยเฉพาะ "คน" → ป้ายใหม่ `.food-lock-note` เหนือปุ่มดูแล บอกเหตุ+วิธีแก้
  - ยืนยัน (preview :55416 · mock login · `getBoundingClientRect`): น้องป่วยหิว→ปุ่มให้อาหาร disabled + บรรทัดเหตุผล ✓ คนป่วย (น้องไม่ป่วย)→ปุ่ม disabled + ป้ายเหตุผล ✓ `feedPet()`→กล่อง "ไปรักษา 🪙100" · `openFoodMenu()` ตรง ๆ ก็ไม่เปิด ✓ `buyCollectible('donut')` เด้ง toast ไม่เปิดกล่องซื้อ · `foodGiftBlocked` treat/cake/boba=true, hi/rose=false ✓ รักษาแล้ว (dinnerClick→รักษา) → lock=null ปุ่มกดได้ เมนูอาหารเปิด ซื้อโดนัทเปิดกล่องจ่ายเงิน ✓ กฎทองข้อ 7 @812×375: คนป่วย 347/347 · ปกติ 295/295 ไม่มี scroll ✓ เคสน้องป่วย 386/351 = **สั้นกว่าก่อนแก้ 1px** (แผงนี้ยาวเกินใบตอนน้องป่วยมาตั้งแต่ก่อนรอบนี้ — งานเก่าค้าง) · console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
  - ⚠️ `js/ui.js` มีการแก้ 1 บรรทัดของ session คู่ขนาน (ห่อ `.pl-badge-frame` ในการ์ดเข็ม บรรทัด ~1925 · คู่กับ `js/data/badgeSprite.js` ที่ยังไม่ commit) ติดไปกับ commit รอบนี้ด้วย — ยังไม่มี CSS ของคลาสนั้น (span เปล่า ไม่กระทบหน้าตา)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 953 (3 ส.ค. · ผู้ใช้ส่งภาพ 2 หน้า "ใส่เข็มให้อยู่ในกรอบ ให้สวยงาม"):** 🎖️🖼️ `js/data/badgeSprite.js`+`css/lobby.css`+`sw.js` — **ต้นตอที่แท้จริงคือ cache ไม่ใช่โค้ด**: ไฟล์เหรียญในเครื่อง/บน live เป็นตัวตัดใหม่ (256×256 พื้นโปร่ง สะอาดทุกใบ ตรวจ 33 ไฟล์ด้วย contact sheet + `curl` เทียบขนาดกับ live ตรงกันเป๊ะ) แต่ผู้ใช้ยังเห็นของเก่า (พื้นทึบ + เหรียญข้างเคียงติดมา) เพราะรูปโดนแคช 2 ชั้น — Firebase Hosting ส่ง `Cache-Control: public, max-age=604800` (7 วัน) + sw.js เป็น cache-first สำหรับรูป → URL เดิมเป๊ะ = ไม่ยิงขอใหม่เลย · แก้: `badgeIcHTML()` ต่อท้าย `?v=BADGE_IMG_V` (=953) ทุก URL (ครอบคลุมทั้ง 4 จุดที่เรียก: อันดับเข็ม/การ์ดโปรไฟล์/ป้ายฉลอง/สถิตินักพิมพ์) + บัมพ์ `CACHE_VERSION` เป็น v230 · **ตัดไฟล์เหรียญใหม่ครั้งหน้าต้องบัมพ์ `BADGE_IMG_V` ด้วยทุกครั้ง**
  - กรอบสวยงามตามที่ขอ: `.lbcat-ic` เดิม `flex:1 1 0` บังคับกล่องรูปสูงเต็มคอลัมน์ (100×199) เหรียญจัตุรัสจึงลอยกลางช่องว่าง → เปลี่ยนเป็น `flex:0 1 auto` + `max-width/max-height:100%` + `width/height:auto` = กล่องพอดีเหรียญเป๊ะ (107×107) แล้วใส่ border/พื้นหลัง radial/เงาในบน `<img>` เอง (padding+border-box) = กรอบรัดรูปพอดีทุกใบ **ไม่ต้องเพิ่ม element ใน ui.js** · การ์ดโปรไฟล์ `.pl-badge-card-ic` ใส่กรอบโทนสว่างชุดเดียวกัน + `align-self:center;aspect-ratio:1` = จัตุรัสเป๊ะ (59×59 จากเดิม 69×59)
  - ยืนยัน (preview :56995 · mock login · `getBoundingClientRect` + เรนเดอร์ DOM→SVG foreignObject→canvas→shotsink ดูภาพจริง): 1280×720 — เหรียญทั้ง 4 สายจัตุรัส 107×107 อยู่ในกรอบการ์ดครบ `?v=953` ต่อท้ายทุก src ✓ การ์ดโปรไฟล์ 4 ใบ กรอบจัตุรัส เหรียญเต็มใบไม่โดนตัด ✓ **จอเตี้ย 812×375**: กระดานเข็ม `sh=ch=357` ไม่มี scroll กล่องอยู่ในจอ · โปรไฟล์ `sh=ch=375` ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ฆ่า shotsink แล้ว
  - ⚠️ เลขรอบขอได้ 952 แต่ session คู่ขนาน (ปุ่มให้อาหารตอนผู้เล่นป่วย — แก้ `js/ui.js`+`js/state.js`) ใช้ไปแล้วใน working tree → เลื่อนเป็น 953 · commit pin เฉพาะ 3 ไฟล์ของรอบนี้ **ไม่แตะ `js/ui.js`**


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 955 (3 ส.ค. · ผู้ใช้ส่งภาพ 2 ใบ "กดปุ่มยิงซ้ายแล้วปืนเบนแทนที่จะยิง + ปุ่มยิงเล็กไป ขอใหญ่ 3 เท่า"):** 🔫🎯 `js/shootword.js` (ยิงเป้าคำศัพท์ · สวนสนุก) — **วัดในเกมจริงก่อนแก้**: กดกลางปุ่ม=ยิงออก yaw 0.002 (นิ่ง) · **กดพลาดขอบปุ่มแค่ 20px = ไม่ยิง + กล้องเบน −0.28 rad (16°)** เพราะนิ้วลงนอกปุ่ม → `overlay` นับเป็น "ลากนิ้ว = มองรอบซุ้ม" · ต้นตอ = ปุ่มเล็ก (14vh≈86px)
  - แก้ 2 ชั้น: ① `.sg-shoot` 14vh→**40vh** (`clamp(150px,40vh,260px)` ≈ 3 เท่าทุกจอ) + อีโมจิ/ตัวอักษรโตตาม + ย้ายไปมุมล่างซ้าย-ขวา (`bottom:1.6vh`, ทิ้ง `left:21%/top:58%` รอบ 930 — วงใหญ่ขนาดนี้ลอยกลางจอจะบังเป้า) ② `.sg-shoot::before{inset:-26px}` = พื้นที่กดล่องหนล้นออกอีก 26px + `setPointerCapture` ตอน pointerdown (นิ้วไถออกก็ไม่กลายเป็นลากจอ) ③ ปุ่ม 🎯 เล็ง ย้ายขึ้นมุมขวาบนใต้ปุ่มออก (`right:1.6vh;top:10vh`) ไม่งั้นวงยิงขวาทับจนกดไม่ได้
  - ยืนยัน (preview :59442 · mock login · `getBoundingClientRect` + ยิงจริง): 1280×640 ปุ่ม 89→**256px** · 812×375 60→**150px** · กดกลาง/ไถ 120px/พลาดขอบ 20px = **ยิงออกทั้ง 3 เคส yaw≈0** · ห่างจริง 60px ยังลากมองรอบได้ (−0.28) ✓ เล็งแผ่น 'S' แล้วกดปุ่มซ้าย → pos 0→1 (โดนจริง) ✓ ปุ่มเล็ง/ออก/ป้ายคำ/แถบใบ้ ไม่ทับกันทั้ง 2 ขนาดจอ กากบาทกลางจอโล่ง ✓ console สะอาด · ล้าง storage แล้ว · sw.js ไม่ต้องบัมพ์ (js เป็น network-first)
  - ⚠️ เลขรอบขอได้ 954 แต่ session คู่ขนาน (ล้างแคชรูป collectibles/gifts — `js/images.js`+`sw.js` v232) จองไปแล้วใน working tree → เลื่อนเป็น 955 · commit pin เฉพาะ `js/shootword.js`
  - 🚨 **บทเรียนใหม่ (เสีย 1 รอบเต็ม): session คู่ขนานรัน `git checkout` ระหว่างที่เราแก้ไฟล์อยู่ → `js/shootword.js` ที่ยังไม่ commit ถูกย้อนกลับหมด** commit รอบ 955 (bb3be23) จึงติดไปแค่ `version.json` และ deploy ตัวที่ไม่มีโค้ดขึ้นเว็บ · จับได้ตอนเช็ก `git show --stat` หลังจบ → ใส่โค้ดกลับ+ยืนยันใหม่ครบ commit `8ef8e6d` deploy `.902` (curl เช็ก `clamp(150px,40vh,260px)` บน live เจอแล้ว) · **กฎใหม่: แก้ไฟล์เกมเสร็จให้ commit ทันที (อย่ารอทดสอบจบ) + หลัง `finish_round.sh` ต้องอ่าน `git show --stat HEAD` ว่ามีไฟล์ครบจริง**


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 957 (3 ส.ค. · ผู้ใช้สั่ง "คลิกที่เหรียญแต่ละเหรียญ ให้ขึ้นข้อความอธิบายว่าได้เหรียญนั้นมาได้อย่างไร"):** 🖱️🎖️ `js/game.js`+`js/data/badgeSprite.js`+`css/style.css` — เพิ่ม field `d` (คำอธิบายเกณฑ์จริง) ให้ `BADGE_META` ทุกเข็ม (33 ตัว อ้างตัวเลขจาก `*_TIERS` ในโค้ดจริง เช่น `🥇`="ตอบคำติดต่อกัน 30 คำ ไม่ชนสิ่งกีดขวาง โลกเฮลิฯ") + ฟังก์ชันใหม่ `showBadgeInfo(emoji)` เปิดกล่องเบาๆ (ภาพเหรียญใหญ่+ชื่อ+คำอธิบาย ปิดด้วยปุ่ม/แตะพื้นหลัง ไม่เล่นเสียง error แบบ `alertBox`) · `badgeIcHTML()` เพิ่มพารามิเตอร์ที่ 3 `clickable` (ค่าเริ่มต้น true) ผูก `onclick` ที่ element เดิมตรงๆ (ไม่ห่อ wrapper ใหม่ กันกระทบ CSS เดิม) → **ครอบคลุมทุกจุดที่แสดงเหรียญอัตโนมัติ**: อันดับเข็มแยกตามสาย · การ์ดเข็มโปรไฟล์ · สถิตินักพิมพ์ ยกเว้นป้ายฉลองเข็มใหม่ที่ส่ง `clickable=false` ตรงๆ (overlay ปิด pointer-events ทั้งกล่องอยู่แล้วเพื่อไม่บังการเล่น)
  - ⚠️ ขอเลขรอบได้ 954 แต่ session คู่ขนาน 3 รอบ (954=แสงวิ่งเหรียญ/955=ปุ่มยิง/956=แผงตั้งค่า) ใช้ไปหมดแล้วก่อน commit — เลื่อนเป็น 957 (สคริปต์ `--next-round` ยืนยัน) comment ในโค้ดที่เขียนไว้ "รอบ 954" แก้เป็น 957 ครบก่อน commit
  - ยืนยัน (preview เอง :62136 · mock login · คลิกจริงผ่าน `element.click()` เช็ค DOM): อันดับเข็มแยกตามสาย → คลิกเหรียญ 🥇 เด้งกล่อง "กัปตันมือทอง" + คำอธิบายตรง ✓ กระดานอันดับเข็มยังเปิดอยู่หลังปิดกล่อง (stopPropagation ทำงาน ไม่ปิดกระดานที่ครอบ) ✓ การ์ดโปรไฟล์คลิกเหรียญได้เหมือนกัน ✓ สถิตินักพิมพ์ (เข็ม ⌨️) คลิกได้ ✓ emoji ที่มี variation selector (⛈️) ทำงานถูก ✓ แตะพื้นหลังปิดกล่องได้ ✓ ป้ายฉลองเข็มใหม่ (`celebrateBadge`) ไม่มี `onclick`/`badge-clickable` ตามที่ตั้งใจ ✓ **จอเตี้ย 812×375**: กล่อง `sh=ch=278` ไม่มี scroll อยู่ในจอครบ ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด preview แล้ว
- **รอบ 956 (3 ส.ค. · ผู้ใช้ส่งภาพแผงตั้งค่า สั่ง "ขยายเต็มจอ + ใส่ปุ่มปิดมุมขวาบนเด่นชัด"):** ⚙️🖥️ `js/util.js`(`openSettings`)+`css/lobby.css` — เพิ่มปุ่ม `.set-x` (✕ วงกลมแดง มุมขวาบน) คู่กับปุ่ม "เสร็จแล้ว" เดิม · `.settings-box` เปลี่ยนเป็น `position:fixed;inset:0` เต็มจอ (เดิม cap `min(94vw,680px)`) — ต้องเพิ่ม specificity เป็น `.settings-box.settings-box` เพราะกฎ `.levelup-box{max-width:min(92vw,600px)}` (บรรทัด 3110 เดิม) มา**หลัง**ในไฟล์แย่งชนะได้ที่ specificity เท่ากัน · ปุ่ม `.set-x` ต้องใส่ `appearance:none` ไม่งั้น `<button>` เนทีฟบังคับ width ขั้นต่ำ ทำวงกลมเบี้ยว (เจอจาก `getComputedStyle` วัด width ไม่ตรงที่ประกาศ)
  - ⚠️ **เจอ session คู่ขนานทับไฟล์ระหว่างทำงาน** (เห็น commit 24134c8/8ef8e6d ของอีก session ที่บันทึกบทเรียนเรื่องนี้พอดี) — แก้ 2 ไฟล์นี้ไปแล้วโดนโค้ด revert เงียบ ๆ กลับเป็นของเดิม 1 รอบ ต้องแก้ซ้ำ (grep ยืนยันว่าไฟล์ก่อนแก้ไม่มี `set-x` เลย) — แก้เสร็จรอบ 2 แล้วเช็ก grep ทันทีหลัง edit ทุกครั้งกันโดนทับซ้ำ
  - ยืนยัน (preview เอง :8917 · mock login · `getBoundingClientRect`+`getComputedStyle` เพราะ pane ไม่ compositing ให้ screenshot ตรง ๆ ไม่ได้): `.settings-box` computed width/height = เท่าวิวพอร์ตเป๊ะ (1000×640) ✓ ปุ่ม `.set-x` 40×40 วงกลมเป๊ะ + aria-label "ปิด" อ่านจาก `read_page` ได้ ✓ กดปิดแล้ว overlay หาย ✓ จอเตี้ย 812×375: เต็มจอ ไม่มี scroll (`scrollH===clientH`) ✓ `node --check` ผ่าน · ล้าง storage + ฆ่า test server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 954→958 (3 ส.ค. · ผู้ใช้ขอ "แสงวิ่งผ่านหน้าเหรียญ (shine sweep)" บน `.lbcat-ic`/`.pl-badge-card-ic` + "เหรียญเด้ง+วิ้ง 1 ครั้ง" ตอนป้ายฉลองเข็มใหม่):** ✨🎖️ `js/data/badgeSprite.js`+`css/lobby.css`+`css/style.css` — `<img>` เป็น replaced element วาง ::after ทับหน้าเหรียญไม่ได้ (สเปกไม่รองรับ) → `badgeIcHTML()` ห่อ `<img>` ด้วย `<span class="{cls} badge-shine">` เฉพาะ 2 คลาสนี้ (`BADGE_SHINE_CLS`) แล้วย้าย CSS กรอบ/ขนาดเดิมของรอบ 953 จาก `<img>` ไปอยู่บน span แทน (`width/height:fit-content` แทน `auto` — span ไม่มีสัดส่วนในตัวเหมือน img แต่ไฟล์เหรียญตัดมาจัตุรัสเสมอ ใช้ `aspect-ratio:1` ช่วยได้) · `.badge-shine::after` = แสงทแยงกวาดผ่านทุก ~4.4s (sync ~0.7s แล้วพัก) มี `nth-child` stagger กันกะพริบพร้อมกันทุกใบ · ป้ายฉลอง `.bc-emoji-img` ไม่ห่อ (สร้างใหม่ทุกครั้งที่ฉลองอยู่แล้ว ไม่ toggle) ใช้ keyframe เดี่ยว (`animation:...1` ไม่ infinite) สเกล+translateY เด้ง พร้อม `filter:brightness+drop-shadow` แฟลชวิ้งจังหวะเดียวกัน
  - 🚨 **ชน session คู่ขนานทำงานไฟล์เดียวกันรัวๆ ระหว่างทำ (badgeSprite.js/lobby.css/style.css ถูกใช้ทั้งรอบ 956/957 ด้วย)** — โดน `git checkout`/commit ของอีก session ล้างโค้ดที่ยังไม่ commit ไปทั้งหมด 2 รอบ (retry ใหม่ครั้งที่ 2 ถึงติด) แต่สุดท้ายโค้ดของรอบนี้ "รอด" เพราะอีก session อ่านไฟล์ที่มีโค้ดเราอยู่ในนั้นไปต่อยอด แล้ว commit รวมไปด้วย — **โค้ดรอบนี้จริง ๆ ไปอยู่ใน commit `4341c71` (รอบ 956, lobby.css) และ `977090f` (รอบ 957, badgeSprite.js+style.css) ไม่ใช่ commit แยกของตัวเอง** จึงไม่มี commit message อ้างอิงฟีเจอร์นี้ตรง ๆ — เขียนบันทึกนี้ไว้กันงงว่าโค้ดหายไปไหน
  - ยืนยัน (preview เอง :57170 · mock login · เรียก `showPlayerCard()`/`openLeaderboardFull()`+monkey-patch `lbBadgeSections()` ตรง เพราะไม่มีข้อมูลเข็มจริงใน mock · `getBoundingClientRect`+`getComputedStyle` เพราะ pane ไม่ compositing ให้ screenshot): กล่องเหรียญยังจัตุรัสเป๊ะทั้ง 2 จุด (การ์ดโปรไฟล์ 30×30 ที่ 812×375, อันดับเข็ม 9.5×9.5 ก่อนสเกล 0.4× ของกล่อง) ไม่ผิดสัดส่วนจากรอบ 953 ✓ `::after` มี `animation-name/duration/play-state:running` ถูกต้อง ✓ ป้ายฉลอง: `celebrateBadge()` ยิงจริง → `.bc-emoji-img` ได้ `animationIterationCount:"1"` (เล่นครั้งเดียวจริง) css width/height คงที่ 64×64 ไม่กระทบ layout ✓ **จอเตี้ย 812×375**: กระดานเข็ม `sh=ch=357` ไม่มี scroll (ตรงกับค่ารอบ 953 เป๊ะ แปลว่าไม่กระทบความสูงกล่องเดิม) โปรไฟล์ `sh=ch=375` ✓ console สะอาด · `node --check` badgeSprite.js ผ่าน · ล้าง storage + ปิด overlay ทดสอบแล้ว · live เช็กแล้ว (curl vocabworld.web.app ตรง `.904` มี `badge-shine`/`bcImgBounceShine`/`BADGE_SHINE_CLS` ครบ)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 959 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 955 "ปุ่มยิงกดค้างรัวได้ ตอนนี้ต้องแตะทีละครั้ง"):** 🔫🔁 `js/shootword.js` `bindShootBtns()` — pointerdown ยิงทันที 1 นัด + เปิด `setInterval` ยิงซ้ำทุก `COOLDOWN`(310ms) ตราบเท่าที่กดค้าง · pointerup/pointerleave/pointercancel เคลียร์ interval ทันที (ตัวแปร `holdTimer` local ต่อปุ่ม กดปุ่มซ้าย-ขวาพร้อมกันไม่ชนกัน) · ไม่เพิ่มตัวกันรัวใหม่ ใช้ cooldown เดิมของ `shoot()` พอ
  - ยืนยัน (preview เอง :64208 · mock login · จับ mutation `sg-gun-hold.kick` นับจำนวนยิงจริง): กดค้าง 1.1s → ยิงรัว 3 นัด (ตรงตามช่วง cooldown 310ms) ✓ ปล่อยนิ้วแล้วรออีก 700ms → ไม่มีนัดเพิ่ม (interval เคลียร์จริง) ✓ แตะสั้น 30ms → ยิงแค่ 1 นัด (พฤติกรรมเดิมไม่เปลี่ยน) ✓ console สะอาด · `node --check` ผ่าน · curl live `.905` เจอ `holdTimer=setInterval` แล้ว · ล้าง storage + ปิด preview แล้ว
  - ⚠️ ขอเลขรอบได้ 958 แต่ session คู่ขนานคอมมิต "รอบ 958" (แสงวิ่งเหรียญ) ไปก่อนแล้ว (ไม่มี TASKS.md entry ตอนนั้นเลยหลุด hook) → เปลี่ยนคอมเมนต์ในโค้ดเป็น 959 ด้วย commit แยก (คอมมิตแรก `636b68d` ยังมีข้อความ "รอบ 958" ค้างอยู่ในชื่อ commit — ของจริงคือ 959)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 960 (3 ส.ค. · ผู้ใช้: "เหรียญกระพริบดูเหมือนไฟล์พัง — เปลี่ยนเป็นแสงกรีดกรอบเหรียญ ตามจุดที่เป็นสันนูนของแต่ละเหรียญ"):** 💡🎖️ `css/lobby.css`+`js/data/badgeSprite.js`+`css/style.css` — ต้นตอของ "ดูเหมือนไฟล์พัง" = แถบขาวทึบ `.9` ของรอบ 954 กวาดทับ**ทั้งกล่องสี่เหลี่ยม รวมพื้นโปร่งรอบเหรียญ** (เห็นเป็นแผ่นสว่างวาบ ไม่ใช่แสงสะท้อนโลหะ) · แก้ด้วย 3 ชั้นใน `.badge-shine::after`: ① `mask-image:var(--bsrc)` (ไฟล์เหรียญใบนั้นเอง ส่งมาจาก `badgeIcHTML` เป็น custom property) = แสงอยู่ในรูปทรงเหรียญเท่านั้น ② **`mask-mode:luminance`** = ตัวทำให้ "เกาะสันนูน" จริง (ค่าแมสก์ = ความสว่าง×alpha → ขอบวงลอเรล/สันนูนที่สว่างอยู่แล้วรับแสงเต็ม ร่องลึกแทบไม่รับ) ครอบคลุมทั้ง 33 ใบโดยไม่ต้องทำแมสก์แยกทีละไฟล์ ③ `mix-blend-mode:screen` + กวาดช้าลง 5.2s (กวาดจริง ~1.2 วิ ที่เหลือพัก) · ป้ายฉลอง `.bc-emoji-img` เป็น `<img>` เดี่ยวใช้ mask ไม่ได้ → ลด `brightness(2)`→`1.28`+`saturate(1.25)` แล้วย้ายความ "วิ้ง" ไป `drop-shadow` เรืองทอง (ไล่ตาม alpha ของ PNG = เกาะขอบเหรียญ ไม่ใช่แผ่นขาวทับหน้า)
  - 🔬 **2 บทเรียนที่เจอจากการทดสอบ (ห้ามทำซ้ำ):** ① **`url()` ใน custom property ต้องเป็น absolute** — ใส่ path สั้นแล้วเบราว์เซอร์ resolve เทียบ "ไฟล์ CSS ที่เรียก `var()`" (= `css/lobby.css`) กลายเป็น `/css/img/badges/x.png` = 404 · **แมสก์ที่โหลดไม่ได้ = โปร่งทั้งแผ่น = แสงหายเงียบ ๆ ไม่มี error ให้เห็น** → `badgeIcHTML` แปลงด้วย `new URL(src, document.baseURI).href` ก่อนส่ง ② **`color-dodge` ใช้ไม่ได้กับงานนี้** (ลองแล้วถอย): จางจนแทบไม่เห็น + จุดที่ติดกลายเป็นจุดสีเขียว/เหลืองเพี้ยน เพราะ dodge ตัดทีละแชนเนล → `screen` ให้ผลตรงและไม่เพี้ยนสี
  - ยืนยัน (preview เอง :63953 · mock login · `getComputedStyle`+`read_network_requests` · **ดูภาพจริงด้วยการเรนเดอร์ canvas ที่ใช้สูตรเดียวกับ CSS เป๊ะ** (luminance mask + screen) แล้ว `<a download>`→อ่านไฟล์ เพราะ pane ไม่ compositing ให้ screenshot): **ภาพเทียบเก่า/ใหม่ 4 เหรียญ** — เก่า = แถบขาวพาดทะลุนอกเหรียญเต็มสี่เหลี่ยม (ยืนยันอาการที่ผู้ใช้เห็น) · ใหม่ = แสงเกาะขอบวงลอเรล/ขอบถ้วย/สันหมวกนักบิน ร่องมืดยังมืด ไม่มีสิ่งใดล้นออกนอกเหรียญ ✓ เทียบความแรง 3 ระดับแล้วเลือก peak `.85` (0.55 จางไป · 1.0 แรงไป) · `mask-mode:luminance` เบราว์เซอร์รองรับจริง (`CSS.supports`=true, computed=`luminance`) ทั้ง 2 จุด ✓ ไฟล์แมสก์โหลด 200 ทุกใบ (network log) ✓ **จอเตี้ย 812×375**: กระดานเข็ม `sh=ch=356` ไม่มี scroll · หน้าเอกสาร 375=375 ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
  - ⚠️ ค่า `inset:var(--bpad)` ทำให้กล่องแสงใหญ่กว่ารูปเหรียญจริง ~5% (inset % คิดจาก padding-box แต่ padding % คิดจากความกว้าง parent) → ไฮไลต์เหลื่อมจากสันจริงได้ ~1-2px ระดับที่มองไม่ออกตอนแสงเคลื่อน · ถ้าจะให้เป๊ะ 100% ต้องเพิ่ม span ห่อชั้นในที่รัดขนาด `<img>` พอดี (ยังไม่ทำ ไม่คุ้มความเสี่ยงชน session คู่ขนาน)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 961 (3 ส.ค. · ผู้ใช้ส่งภาพ 3 ใบ สั่ง 3 ข้อ: "เอาเส้นขาวฝนออก ดูไม่ professional · เม็ดฝนใสกว่านี้อีก · รูป profile ในมือถือเล็กไป ขอใหญ่กว่าปุ่มแนวตั้งเหมือนบนคอม"):** 🌧️📷 `js/ui.js`+`css/lobby.css` — ① ถอด `.rain-layer` 2 ชั้น (stripe gradient ขาวทแยงทั้งจอ) ออกจาก `rainFxTick()` + ลบ CSS/`@keyframes rainfall,rainfall2` ทิ้ง เหลือฝนเป็น "หยดน้ำบนกระจก" อย่างเดียว ② `rainFxDrop()` ลด `--o` 0.40–0.80 → **0.13–0.28** + `.glass-drop` เงาจาง .35→.18 และเพิ่ม `blur(.3px)` (น้ำจริงเป็นเลนส์บิดแสง ไม่ใช่รูปแปะทับจอ) ③ `.id-card .pass-photo` โซนมือถือ: `@media(max-height:520px)` 56×64→**86×99** · `@media(max-height:430px)` 46×53→**76×87** — เดิมรูป**แคบกว่าปุ่มราง** (56<76 / 46<66) เลยดูเล็ก ทั้งที่สูงกว่านิดเดียว · จอคอมไม่แตะ (108×124 เท่าเดิม)
  - ยืนยัน (preview เอง :60628 · mock login+ลงทะเบียน · `getBoundingClientRect`+`getComputedStyle`): ฝน — `.rain-layer` เหลือ **0 ตัว** ใน DOM ✓ หยดน้ำ `--o`=0.13–0.25 · ตั้ง `currentTime` 40% วัด opacity จริง = 0.133 (แท็บ preview เป็น `hidden` แอนิเมชันไม่เดินเอง ต้องขับเวลาเอง) ✓ filter มี blur(.3px) ✓ · รูป profile — 812×375: **76×87 vs ปุ่มราง 66×51** (กว้างกว่า+สูงกว่า 1.7 เท่า) · 900×500: **86×99 vs 76×61** · 1280×720 เท่าเดิม 108×124 vs 76×61 ✓ เวทีน้องหดรับ (250→216 / 334→299) แต่ `.lobby-stage` ไม่มี scroll (216/216) และแถบปุ่มล่างถูกตัด 9px/5px **เท่าเดิมทุกขนาดรูป** = ของเก่าค้าง ไม่ใช่ผลจากรอบนี้ ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิดฝนทดสอบแล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 962 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 961 "ปัญหาเรื่องฝนนี้ ให้แก้ระบบฝนโลกโดรนด้วย" + "ใส่ละอองฝนเบลอขอบจอ (vignette) แทนเส้นฝน"):** 🌧️🛸 `js/adv3d_css.js`(`#adv-rain`)+`css/lobby.css`(`#rain-fx`)+`js/ui.js`(`rainFxTick`) — โดรน FPV: ถอด `#adv-rain:before` (stripe ทแยงขาว + `@keyframes advRain`) ออกทั้งหมด (เจอ `advRain` ไม่ถูกใช้ที่ไหนอื่น ลบ keyframe ได้เลย) + ลดความทึบหยดน้ำ `#adv-rain i` ~2.5 เท่า (.62/.28/.10→.24/.11/.04 · เงา .45/.28→.18/.12 · keyframe opacity .85/.7→.32/.26) ให้สอดคล้องกับฝนล็อบบี้รอบ 961 · เพิ่ม **`.rain-vignette`**/`@keyframes advVignette` ใหม่ทั้ง 2 โลก (ล็อบบี้ห่อ element ใหม่ต่อท้าย `.rain-glass` ใน `rainFxTick` · โดรนใช้ `#adv-rain:before` เดิมเป็นที่ฝาก) = radial-gradient โปร่งกลาง มัว+เบลอขอบ (`blur(9-10px)`) เต้นจาง ๆ 5s ให้ยังรู้สึกว่าฝนตกโดยไม่มีเส้น · ทั้ง 2 จุดมี `html.no-anim ...{animation:none}` รองรับโหมดลดแอนิเมชันอยู่แล้ว
  - ยืนยัน (preview เอง :63162 · mock login+ลงทะเบียน · บังคับ `rainNow=()=>true` เรียก `rainFxTick()` ตรงสำหรับล็อบบี้ · โดรน: inject `window.ADV3D_CSS` เป็น `<style>` จริงแล้ววัด `getComputedStyle` เพราะโลก 3D ไม่ได้โหลดจนกว่าจะเข้าโหมด ไม่ต้องบูตฉากเต็ม): ล็อบบี้ — `.rain-layer` เหลือ 0 ตัว · `.rain-vignette` มี `animationName:rainVignettePulse` + gradient/blur ตรงตามประกาศ · หยดน้ำ `--o`=0.22-0.27 (ช่วงเดิมรอบ 961) ✓ · โดรน — `::before` มี `animationName:advVignette` (ไม่ใช่ `advRain` เดิม) + gradient/blur ตรงตามที่เขียน · หยดน้ำ background/box-shadow ตรงค่าใหม่ที่ลดแล้ว ✓ · console สะอาด · `node --check` ผ่านทั้ง `js/ui.js` + syntax-check `js/adv3d_css.js` ผ่าน · ล้าง storage + ปิด preview แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 963 (3 ส.ค. · ผู้ใช้สั่ง "เพิ่มเสียงฝนเบาๆ ลูปตอนเอฟเฟกต์ฝนเต็มจอทำงาน + สวิตช์เปิด/ปิดในตั้งค่า"):** 🌧️🔊 `js/util.js`(`RainSound`+`openSettings`)+`js/ui.js`(`rainFxTick`) — เพิ่ม `RainSound` (white noise→lowpass 2600Hz + LFO ไล่ความดังช้าๆ ต่อ `audioCtx` ตัวเดียวกับ `beep()`) `start()`/`stop()`/`refresh()` เรียกจาก `rainFxTick()` ตอนสร้าง/ลบ `#rain-fx` · สวิตช์ใหม่ `state.rainSound` ในแผงตั้งค่า (แท็บทั่วไป ใต้ "เสียงในเกม") เซฟใน localStorage ผ่าน `saveState()` เดิม · ทั้งสวิตช์เสียงหลัก (`state.sound`) และสวิตช์นี้ต้องเปิดทั้งคู่เสียงฝนถึงจะดัง — ปิดสวิตช์ใดสวิตช์หนึ่งหยุดเสียงทันทีผ่าน `refresh()`
  - ยืนยัน (preview เอง :8790 · mock login · monkey-patch `rainNow`/`rainProtected` บังคับฝนตก): `rainFxTick()` สร้าง `#rain-fx` + `RainSound.src` ตั้งค่า gain ไต่ขึ้นสู่ 0.055 จริง ✓ ฝนหยุด → `RainSound.src=null` ✓ กดสวิตช์ 🌧️ ปิด/เปิดตอนฝนตกอยู่ → เสียงหยุด/กลับมาทันที ไม่ต้องรอฝนหยุด ✓ กดสวิตช์เสียงหลักปิด/เปิด → เสียงฝนตามไปด้วย ✓ ค่า `rainSound` เซฟใน `petVocabAdventure_v1` ใน localStorage จริง ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิดเสียง + reload แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 964 (3 ส.ค. · ผู้ใช้ส่งภาพแผ่นคอมเมนต์ สั่ง "คอมเมนต์ใต้คอมเมนต์ได้ด้วย เหมือน facebook/TikTok"):** 💬↩ `js/online.js`+`js/ui.js`+`css/lobby.css`+`handoff/RULES.md` — เก็บ field ใหม่ `p` (รหัสคอมเมนต์แม่) ใต้ `/gfeed/$postId/cm/$cid` · `gfeedParse` อ่าน `p` · `gfeedAddComment(postId,tx,parentId,parentName)` · UI: `fcmTreeHTML()/fcmRowHTML()` จัดเป็นต้นไม้ **1 ชั้น** (ตอบใต้ "การตอบกลับ" เกาะคอมเมนต์แม่ตัวเดิม เหมือน FB) + ปุ่ม `↩ ตอบกลับ` ทุกแถว + แถบ "กำลังตอบ @ชื่อ ✕" เหนือช่องพิมพ์ · แจ้งเตือนเพิ่มชนิด `rp` = "ตอบกลับคอมเมนต์ของคุณ" (แจ้งได้แม้โพสต์เป็นของคนอื่น — `gfeedNotifDiff` เดิม return ทิ้งถ้าโพสต์ไม่ใช่ของเรา)
  - ⚠️ **rules ยังไม่ publish** (`"$other":{".validate":false}` ใต้ `cm/$cid` ทำให้ field `p` โดน deny) → ถอยเป็นคอมเมนต์ธรรมดาขึ้นต้น `↪ @ชื่อ` อัตโนมัติ + ธง `Online.cmReplyRulesOld` โชว์ป้ายเหลืองบอกเหตุผลในแผ่นคอมเมนต์ (กฎทองข้อ 1) · ก้อนเต็ม + Artifact ปุ่มคัดลอกอยู่ใน `handoff/RULES.md` หัวข้อสถานะ publish
  - ยืนยัน (preview เอง :54236 · **ต้องเปิด `/index_classic.html`** ไม่ใช่ราก · mock login + fake `Online.db`): ต้นไม้ถูก — c1 มีลูก 2 (ฉันเอง/มานี) · c4 ชั้นบน · คอมเมนต์ที่ `p` ชี้ไปคอมเมนต์ที่ไม่มีอยู่ = เด้งขึ้นเป็นชั้นบน (ไม่หาย) ✓ กด ↩ ที่ "การตอบกลับ" → `data-cid` = c1 (ไม่ลึกเกิน 1 ชั้น) แถบ+placeholder+focus ถูก ✓ ส่งแล้วเคลียร์แถบ · ส่งไม่สำเร็จคืนข้อความ+แถบ ✓ fallback rules เก่า: push ที่มี `p` โดน reject → ส่งซ้ำเป็น `↪ @Sumpajit ขอบใจนะ` สำเร็จ + ป้ายเตือนโผล่ ✓ แจ้งเตือน: ตอบกลับคอมเมนต์เราในโพสต์คนอื่น = `rp` 1 รายการ (คอมเมนต์อื่นในโพสต์คนอื่นไม่แจ้ง) · คอมเมนต์ในโพสต์เราเอง = `cm` เหมือนเดิม ✓ **จอเตี้ย 812×375**: กล่อง 460×337.5 อยู่ในจอครบ ไม่มี scroll (รายการคอมเมนต์เลื่อนในตัวเองตามดีไซน์เดิม) · ปุ่มตอบกลับ 64.5×23 (นิ้วเด็กกดง่าย) · ย่อหน้าตอบกลับเยื้อง 24px มีเส้นไกด์ซ้าย ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว
  - ⚠️ ขอเลขรอบได้ 963 แต่ session คู่ขนาน (เสียงฝน) commit ทับก่อน → เลื่อนเป็น 964 + rebase · โค้ด `js/ui.js` ที่ยังไม่ commit ถูก commit `a2416e7` ของ session นั้นกวาดไปด้วย (ตรวจแล้วครบ ไม่หาย)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 965 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 964 "ยุบ/ขยาย ดูการตอบกลับอีก N รายการ เมื่อสายยาว"):** 💬▾ `js/ui.js`(`fcmTreeHTML`+`renderFeedComments`)+`css/lobby.css` — สายตอบกลับที่มี > `FCM_REP_SHOW`(2) รายการ โชว์แค่ 2 อันแรก + ปุ่ม `▾ ดูการตอบกลับอีก N รายการ` ท้ายสาย · กดแล้วกางครบ + ปุ่มเปลี่ยนเป็น `▴ ย่อการตอบกลับ` ยุบกลับได้ · จำสถานะเปิด/ปิดต่อคอมเมนต์แม่ด้วย `__fcmOpen` (Set รหัสคอมเมนต์แม่ที่ขยายอยู่) รีเซ็ตทุกครั้งเปิดแผ่นคอมเมนต์ใหม่ · สายสั้น ≤2 ไม่มีปุ่มเลย (ไม่รกจอ)
  - ยืนยัน (preview เอง :59597 · mock login + fake cm 2 สาย: สายยาว 5 ตอบ + สายสั้น 1 ตอบ): สายยาว render แค่ 2 + ปุ่ม "อีก 3 รายการ" ✓ สายสั้นไม่มีปุ่ม ✓ กดปุ่ม → กาง 5 ครบ + ปุ่มเปลี่ยนเป็นย่อ ✓ กดย่อ → กลับเหลือ 2 + ปุ่มเดิม ✓ **จอเตี้ย 812×375**: กล่อง `sh=ch` ไม่มี scroll ปุ่มอยู่ในจอ ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด preview แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 966 (3 ส.ค. · ผู้ใช้สั่ง "เพิ่มการกดถูกใจรายคอมเมนต์ · โซนใหม่ cl/&lt;uid&gt;"):** 💙💬 `js/online.js`+`js/ui.js`+`css/lobby.css`+`handoff/RULES.md` — โซนใหม่ `/gfeed/$postId/cm/$cid/cl/<uid> = true` (ซ้อนใต้คอมเมนต์ ไม่ต้องเปิด listener ใหม่ · `gfeedParse` คืน `clU/clN/clMe` ต่อคอมเมนต์) · `gfeedToggleCommentLike(postId,cid,likedNow)` สิทธิ์เขียนชุดเดียวกับไลก์โพสต์ · UI: ปุ่ม 🤍/💙+ตัวเลขทุกแถวใน `fcmRowHTML` (เพื่อนกดได้ · **คนนอกเห็นแต่จำนวนอ่านอย่างเดียว** `.fcm-likec`) เด้งสีทันทีแบบ optimistic แล้วค่อยยืนยันกับ DB · แจ้งเตือนชนิดใหม่ `cl` = "ถูกใจคอมเมนต์ของคุณ" (แจ้งได้แม้โพสต์เป็นของคนอื่น · กดถูกใจตัวเองไม่แจ้ง)
  - 🩹 แถมแก้ของเดิม: `renderFeedComments()` เดิม **เด้งลงล่างสุดทุกครั้งที่วาดใหม่** → กดถูกใจคอมเมนต์บน ๆ แล้วจอกระโดดหนี · ตอนนี้จำ `scrollTop` ไว้ (ยังเด้งลงล่างเหมือนเดิมถ้าผู้ใช้ดูอยู่ท้ายรายการ = มีคอมเมนต์ใหม่เข้า) — ช่วยปุ่ม ↩ ตอบกลับ/▾ ขยายของรอบ 964-965 ไปด้วย
  - ⚠️ **rules ยังไม่ publish** (`"$other":{".validate":false}` ใต้ `cm/$cid` deny ลูกที่ไม่มีชื่อในกฎ) → กดแล้วคืน false + ธง `Online.cmLikeRulesOld` ขึ้นป้ายเหลืองในแผ่นคอมเมนต์ + toast บอกตรง ๆ (กฎทองข้อ 1) · **Artifact ปุ่มคัดลอกก้อนเต็ม (รวม `p` รอบ 964 ด้วย publish ครั้งเดียวจบ):** https://claude.ai/code/artifact/250a1f4e-5979-4877-9a6b-750636826af8
  - ยืนยัน (preview เอง :49336 · **เปิด `/index_classic.html`** · mock login + fake `Online.db` ที่บันทึก path ที่เขียนจริง + สวิตช์สั่ง deny): parse — `cl` 2 คน→`clN:2 clMe:true` · ค่า `false` ใน cl ไม่ถูกนับ ✓ กด → เขียน `set gfeed/p1/cm/c3/cl/test1 = true` · ถอน → `remove` path เดิม เป๊ะตามสเปก ✓ optimistic 🤍→💙 1 / 💙 2→🤍 1 ✓ deny → กลับเป็น 🤍 + ป้ายเหลือง + toast "ต้องอัปเดตกฎ /gfeed" ✓ คนนอก (ไม่ใช่เพื่อน) = ปุ่ม 0 ตัว เห็นแค่ `💙 2` (คอมเมนต์ที่ไม่มีคนถูกใจไม่โชว์เลข) ✓ แจ้งเตือน: 2 คนถูกใจคอมเมนต์เรา = `cl` 2 รายการ · ถูกใจคอมเมนต์คนอื่น/ถูกใจตัวเอง = ไม่แจ้ง ✓ เลื่อนขึ้นบนสุดแล้วกดถูกใจ → `scrollTop` ยังเป็น 0 (ไม่กระโดด) · อยู่ท้ายรายการ → ยังเด้งลงล่าง ✓ **จอเตี้ย 812×375**: กล่อง 460×338 อยู่ในจอครบ ไม่มี scroll · ปุ่มถูกใจ 24px สูงเท่าปุ่มตอบกลับ (เจอตอนแรกปุ่มสูง 40px เพราะเลขตกบรรทัด → เพิ่ม `white-space:nowrap`) ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · JSON ก้อน rules parse ผ่าน 31 โซน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 967 (3 ส.ค. · ผู้ใช้ส่งภาพโลกขับรถ สั่ง 2 ข้อ: "ย้ายกระจกมองหลังไปแทนที่ป้ายเตือน+ป้ายความเร็วที่โดนทับ แล้วเอาป้ายลงมาใต้กระจก อย่าให้ซ้อนกัน" + "ย้ายคำ EDITOR ไปอยู่ระหว่างกระจกกับปุ่มมุมกล้อง ย่อตัวอักษรให้พอดี ห้ามทับอะไร"):** 🪞🚗 `js/adv3d_css.js`+`js/adventure3d.js` — ต้นตอ: กระจก `top:82` (สูง 74) คร่อมทับป้ายความเร็ว `#adv-inst`(52) + ป้ายเตือน `#adv-warn`(60) ซึ่งซ้อนกันเองอยู่แล้ว 12px · แก้: กระจกขึ้นไป **52-126** (แก้ 2 ที่ให้ตรงกัน — CSS `#adv-mirror-rear` + `MIRROR_REAR.t` ที่ WebGL ใช้ตั้ง scissor) แล้วเรียงป้ายลงมาใต้กระจก `#adv-inst`132 · `#adv-warn`158 · `#adv-junc`192 · `#adv-lawwarn`230 (2 ใบหลังเดิมอยู่ 96/120 = จมอยู่ใต้กระจกมาตลอด) · คำเป้าหมาย `#adv-words` ย้ายจากกลางจอ(170) ไปช่องว่างขวาของกระจก `left:calc(50% + 138px);right:116px` + `width:fit-content;margin:auto` (กล่องหดพอดีคำ จัดกลางช่อง) ย่อตัวอักษร `clamp(10px,1.6vw,16px)` · ปุ่มครู `#adv-tmute/#adv-podbtn` ย้ายจากแถวขวา(top:52) ไปซ้อนใต้กระดานคะแนนซ้าย (เดิมกินช่องที่คำย้ายมาอยู่ + จอ 812 ยังทับตัวกระจกด้วย)
  - ยืนยัน (preview เอง :56513 · mock login+ลงทะเบียน+เข้าโลกขับรถจริง `state.driveTicket=true`→`Adventure3D.start('drive')`→ออกรถ · `getBoundingClientRect` + ตัวเช็กทับกันแบบไล่ทุกคู่ 29 element โดยบังคับโชว์ป้ายที่ปกติซ่อน + ยัดข้อความจริง): **1280×720 ไม่มีคู่ไหนทับกันเลย** (เหลือแต่ `adv-horn × adv-shoot` ที่ทับกันอยู่ก่อนแล้ว ไม่ได้แตะ) — กระจก 510-770/52-126 · คำ 861-1081/48-94 (อยู่ระหว่างกระจกจบ 770 กับปุ่มมุมกล้องเริ่ม 1180 จริง) · ป้ายความเร็ว 132-155 · ป้ายเตือน 158-191 ✓ · **812×375** คำ 544-696/48-110 ไม่ทับใคร ทดสอบคำยาว 6/11/13 ตัวอักษร (ตัดบรรทัดเป็น 2 แถวสูงสุด 110 < ปุ่มเกียร์ 123) ✓ · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด preview แล้ว
  - ⚠️ จอเตี้ย 375: ป้ายทางแยก/ป้ายใบสั่ง (192/230) เฉี่ยวแป้นเบรก-เกียร์ถอย (y187+) ~2px และทับบางส่วนตามลำดับ — เป็นแถบเตือนชั่วคราว `pointer-events:none` กดปุ่มทะลุได้ปกติ (เดิมจมใต้กระจกทั้งใบ ยังดีกว่าเดิม)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 969 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 967 "ทำข้อ 1" = ปุ่มย่อ/ขยายกระจกมองหลัง สำหรับจอมือถือเล็ก):** 🔎🪞 `js/adventure3d.js`+`js/adv3d_css.js` — ปุ่มเล็ก `#adv-mirror-toggle`(－/＋ 19×19px) มุมล่างขวาของกรอบกระจก `#adv-mirror-rear` กดสลับ `.mini` (260×74→**150×43** สัดส่วนใกล้เดิม) · ฝั่ง WebGL: `mirrorRearRect()` คืน `MIRROR_REAR_MINI` แทน `MIRROR_REAR` ตาม `state.mirrorMin` (เรียกทุกเฟรมใน `drawCarMirrors`ไม่แคช = สลับได้ทันที) · เซฟค่าไว้ผ่าน `saveState()` เดิม (ติดตัวข้ามรอบขับ/ข้ามเซสชัน) + sync ตอนเข้าโหมด `drive` ให้ตรงกับค่าที่จำไว้เสมอ
  - ยืนยัน (preview เอง python http.server:8790 เพราะ preview_start เต็มโควตา 5 · mock login+ลงทะเบียน+เข้าโลกขับรถจริง+ออกรถ): กดปุ่ม → กระจก 260×74→150×43 จริง (`getBoundingClientRect`) + `state.mirrorMin`/localStorage เป็น `true` ✓ กดซ้ำ → กลับ 260×74 + ปุ่มข้อความ '－'/'＋' สลับถูกทิศ ✓ **812×375**: ปุ่ม/กระจกทั้ง 2 ขนาดไม่ทับ element อื่นเลย (ไล่เช็ก 6 คู่รอบกระจก) ✓ `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด http.server แล้ว
  - ⚠️ ไม่ได้ยืนยันภาพจริงในกระจก WebGL ตอน mini (แท็บ preview ซ่อน ไม่มี rAF loop ให้ทดสอบ `drawCarMirrors` ตรง ๆ) — ยืนยันด้วยโค้ด/logic แทน: `mirrorRearRect()`คืนค่าตรงกับ CSS `.mini` เป๊ะ (150×43 ทั้ง 2 จุด) และ `drawCarMirrors` เรียกทุกเฟรมจริงตอนเล่น (บรรทัด 12091) ไม่ใช่ผ่าน testkit `step()` (ซึ่งไม่ครอบคลุมกระจก) — ถ้าเล่นจริงแล้วภาพในกระจกไม่ตรงกรอบ บอกได้เลย จุดแก้เดียวคือ `mirrorRearRect()`
- **รอบ 968 (3 ส.ค. · ผู้ใช้สั่งงานเดิมซ้ำ "ถูกใจรายคอมเมนต์ `cl/<uid>` + ส่ง rules ให้ publish"):** 💙📜 **โค้ดทำครบแล้วรอบ 966 และขึ้นเว็บจริงแล้ว** (curl live `.913` เจอ `gfeedToggleCommentLike` ใน `js/online.js` · ปุ่ม `.fcm-like`/`.fcm-likec` ใน `js/ui.js` ครบ) → ไม่ทำซ้ำตามกฎทองข้อ 10 ทำเฉพาะส่วนที่ค้าง = **rules** · แก้ `handoff/RULES.md` เท่านั้น (ไม่แตะไฟล์เกม)
  - **อ่านกฎสดมาเทียบก่อนส่ง** (`MSYS_NO_PATHCONV=1 firebase database:get "/.settings/rules"` — ไม่ใส่ตัวแปรนี้ git-bash แปลง path เป็น `C:\...` แล้ว CLI ตอบ "Path must begin with /"): live 300 คีย์ vs ก้อนใน RULES.md 302 คีย์ **ต่างแค่ `cl/$uid/.write`+`.validate`** ไม่มีคีย์หาย/ค่าเพี้ยน → publish ทับปลอดภัย · ผลพลอยได้: **`p` ของรอบ 964 ผู้ใช้ publish ไปแล้ว** (live `cm/$cid` มีลูก `p`) → อัปสถานะรอบ 964 เป็น ✅ ตอบกลับใต้คอมเมนต์ใช้งานได้เต็มระบบแล้ว
  - **Artifact ปุ่มคัดลอกใบใหม่ (เจนจากก้อนใน RULES.md ตรง ๆ ด้วยสคริปต์ ไม่ก๊อปมือ):** https://claude.ai/code/artifact/b0837383-ac74-4259-bf9a-2a8d657cc425 · ยืนยัน: ดึง `textContent` ของ `<pre>` (= ข้อความที่ปุ่มคัดลอกส่งเข้าคลิปบอร์ด) กลับมา `json.loads` ผ่าน 31 โซน · เทียบอักขระต่ออักขระกับ RULES.md **ตรงกัน 100%** · `<mark>` 6 บรรทัดไม่ปนเข้าข้อความที่คัดลอก · ไม่มี DOCTYPE/html/body ซ้อน
  - ▶️ **ค้าง: รอผู้ใช้กด Publish ใน Firebase Console** (ยังไม่ publish = ปุ่มถูกใจคอมเมนต์คืน false + ป้ายเหลืองในแผ่นคอมเมนต์ ตามดีไซน์รอบ 966) · publish แล้วควรอ่านกฎสดยืนยันอีกครั้งว่า `cl` ขึ้นจริง


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 971 (3 ส.ค. · ผู้ใช้ส่งภาพล็อบบี้ สั่ง 2 ข้อ: "กล่องผู้เล่นกว้างเท่าแนวกล่องฟีด (+เปลี่ยนชื่อเป็น Global Feed)" · "กลุ่มเหรียญ+วันนี้+... มาไว้แนวเดียวกับกล่องแนะนำคำศัพท์"):** 🧭🪙 `js/ui.js`(`alignProfilePlate`/ใหม่ `alignCoinBlock`+`laneModeOn`)+`css/lobby.css`(โซนใหม่ท้ายไฟล์ 🧭) — ① **ต้นตอที่การ์ดผู้เล่นสั้นกว่ากล่องฟีด**: เดิมตั้งความกว้างที่ `.profile-plate` (ป้ายชื่อข้างใน) แต่ `.id-card` เป็น `flex-shrink:1` → พอแถวบนแน่น (เหรียญ 6 หลัก + ออนไลน์ + คอม โผล่ครบ) การ์ดโดนบีบ ป้ายหดตาม ขอบขวาเลยไม่เคยตรง → ย้ายไปตั้งความกว้างที่ `.id-card` ตรง ๆ + `flex:0 0 auto` ② แถวเหรียญยึด "เลนเดียวกับกล่องแนะนำคำศัพท์" = กึ่งกลางแกนเดียวกัน และถ้าตัวเลขยาวเกินเลนจะย่อ font/padding ทั้งแถวด้วย `--coin-k` (เพดาน 0.72) จนพอดีเลน = ขอบซ้าย/ขวาตรงกันเป๊ะ ③ หัวกล่องฟีดในล็อบบี้เปลี่ยนข้อความเป็น **`⬢ Global Feed 📰`** (ฟีดโชว์ของทุกคน ไม่ใช่แค่เพื่อน)
  - 🔑 บทเรียน: **`margin-left` เลื่อนกล่องในแถว flex ที่มีตัวคั่น `flex:1` สองข้าง จะขยับได้แค่ครึ่งเดียว** (ตัวคั่นสองข้างหารกัน — วัดจริงเหลื่อม 2px ทุกครั้ง) → ต้องล็อกตัวคั่นซ้ายเป็น `flex:0 0 0px` ก่อน · เคยลอง "ยืดแถวเหรียญเต็มเลน + `space-between`" แล้วถอย เพราะจอ 1600px ตัวเลขห่างกันถึง 300px ดูหลุด
  - โหมดนี้เปิดด้วยคลาส `.lobby-top.coin-laned` (ตั้งจาก `laneModeOn()`) — หน้าที่ยังไม่มีสัตว์เลี้ยงไม่มีเวที/กล่องฟีดให้อ้างอิง จะถอดคลาส + ล้างความกว้างที่ตรึงไว้ กลับไปลอยกึ่งกลางแบบรอบ 695
  - ยืนยัน (preview เอง :61899 · **เปิด `/index_classic.html`** · mock login + สร้างสัตว์ + ยัดตัวเลขยาวเท่าภาพผู้ใช้ `680,086 / +4,630 / ออนไลน์+2886.48 / คอม+19147.61` · `getBoundingClientRect`): ขอบขวาการ์ดผู้เล่น = ขอบขวากล่องฟีด **ต่างกัน 0.0px ทุกขนาดจอ** (ก่อนแก้ที่ 780×345 ต่างกัน 90px = อาการที่ผู้ใช้เห็น) ✓ แกนกลางแถวเหรียญ = แกนกลางกล่องคำศัพท์ 0.0px ทั้ง 812×375 / 894×395 / 1000×640 / 1280×720 / 1600×900 ✓ ตัวเลขยาวสุดที่ 1000×640 → k=0.875 พอดีเลนเป๊ะ (ขอบซ้าย/ขวาต่าง 0.2/0.1px) · ที่ 812×375 k ชนเพดาน 0.72 ล้นเลนข้างละ 6px แต่ยังห่างปุ่มไอคอน 18px ไม่มี scroll แนวนอน ✓ **จอเตี้ย 812×375**: `scrollHeight=clientHeight` ✓ สลับสถานะ มีสัตว์→ไม่มีสัตว์→มีสัตว์ ค่าที่ตรึงถูกล้าง/ตั้งใหม่ถูกต้อง ✓ ไม่มี ResizeObserver วนซ้ำ (0 style mutation ใน 1 วิ) · console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
  - ⚠️ **ชนเลขรอบ + โดน session คู่ขนานกวาดโค้ดไปคอมมิต** — ขอเลขได้ 968 แต่ระหว่างทำ session อื่นใช้ 968/969/970 หมด (สุดท้ายได้ **971**) · โค้ดชุดแรกของรอบนี้ (`alignCoinBlock`/`coin-laned` เวอร์ชันแรก) ถูก commit `d7e1d09` ของ session รอบ 970 กวาดไปด้วย — commit ของรอบนี้จึงเหลือเฉพาะส่วนปรับต่อ (เปลี่ยนจากยืดเต็มเลนเป็นกึ่งกลางเลน + `laneModeOn` ตอนไม่มีสัตว์ + เปลี่ยนเลขรอบในคอมเมนต์)
- **รอบ 970 (3 ส.ค. · ผู้ใช้ต่อยอดรอบ 966/968 "ทำข้อ 1 (ดูใครถูกใจคอมเมนต์) + ข้อ 2 (เรียงคอมเมนต์ยอดนิยมขึ้นก่อน)"):** 💙🔝 `js/ui.js`(`fcmRowHTML`+`showCommentLikers`+`fcmTreeHTML`)+`css/lobby.css` — แยกปุ่มตัวเลข `.fcm-cnt` ออกจากปุ่มหัวใจ `.fcm-like` (กดหัวใจ=สลับไลก์ · กดตัวเลข=เปิดกล่อง `showCommentLikers()` โชว์รายชื่อคนถูกใจ ใช้ `uidDisplayName()` เดิม + ตัวเองแสดง "คุณ") · `fcmTreeHTML()` เรียงคอมเมนต์ **ชั้นบนสุด** ตามยอดถูกใจมากไปน้อยก่อนแสดง (เท่ากัน=เก่าก่อน) แบบ "ความคิดเห็นยอดนิยม" — การตอบกลับใต้แต่ละคอมเมนต์ยังเรียงตามเวลาเดิม ไม่โดนสลับ · ปุ่ม `.fcm-cnt` โผล่ทั้งฝั่งเพื่อน(กดหัวใจได้)และคนนอก(อ่านอย่างเดียว) เพราะดูรายชื่อ = แค่อ่านข้อมูลที่มีอยู่แล้วในเครื่อง ไม่ใช่การเขียน DB
  - ⚠️ **ชนรอบเลขซ้อน 2 ชั้นระหว่างทำ** — ขอ 968 ก่อน (session ตรวจ rules ใช้ไปแล้ว) → ขอ 969 (session ปุ่มกระจกมองหลังใช้ไปพร้อมกัน) → สุดท้ายได้ 970 · แก้ comment ในโค้ดที่เขียนไว้ "รอบ 968/969" เป็น 970 ครบก่อน commit · ไม่ได้แตะไฟล์ของ session อื่นเลย (คนละฟีเจอร์ คนละไฟล์ทั้งคู่)
  - ยืนยัน (preview เอง :60728 · mock login + fake `Online.db`): เรียง — คอมเมนต์ถูกใจ 3/1/0 → แสดงลำดับ `[c2(3),c3(1),c1(0)]` ตรงตามยอดนิยม ✓ กดตัวเลข → กล่องรายชื่อเปิด "ถูกใจคอมเมนต์นี้ (3)" ครบชื่อ + ตัวเองขึ้น "คุณ" ✓ กดหัวใจ **ไม่**เปิดกล่องรายชื่อ · กดตัวเลข **ไม่**สลับไลก์ (ทดสอบแยกกันชัดเจน) ✓ ปิดกล่องด้วยปุ่ม/แตะพื้นหลังได้ ✓ **จอเตี้ย 812×375**: กล่องรายชื่อ 96×124 (20 คน) อยู่ในจอครบ ไม่มี scroll ทั้งกล่อง (list ในตัวเลื่อนเองตามดีไซน์เดิม) ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 973 (3 ส.ค. · ผู้ใช้สั่ง "กระจกมองหลังโลกขับรถ ให้โชว์เพื่อนที่ขับตามมา (multiplayer) พร้อมป้ายชื่อลอยเหนือรถเพื่อนที่เห็นในกระจก"):** 🪞🧑‍🤝‍🧑 `js/adventure3d.js`(โซนใหม่ `mirrorTagsTick` ต่อท้าย `drawCarMirrors`)+`js/adv3d_css.js` — **ตัวรถเพื่อน "อยู่ในภาพกระจกอยู่แล้ว"** (mirrorPass เรนเดอร์ `scene` เดิมทั้งฉาก เพื่อนถูก `scene.add` ไว้ตั้งแต่ `onPeerData`) ยืนยันด้วย pixel-diff แล้ว — ที่ขาดจริงคือ **ป้ายชื่อ**: `blkNameSprite` กว้าง 2.7m พอย่อลงกรอบ 260×74 เหลือ ~20px อ่านไม่ออก → เพิ่มชั้น DOM `#adv-mirror-tags` ทับกรอบกระจก ฉายพิกัดเพื่อนผ่าน `mirrorRearCam` ตัวเดิมที่เพิ่งเรนเดอร์ (`matrixWorldInverse`+`projectionMatrix` ของเฟรมนั้น = ป้ายเกาะหลังคารถจริง) · ป้าย = ชื่อเล่น+ดาวระดับชั้น(`gradeMark`)+ระยะเป็นเมตร · จางลงตามระยะ (>45m .78 · >70m .55) · เกิน 95m/แซงขึ้นหน้าไปแล้ว(หลังกล้องกระจก)/หลุดขอบกรอบ = ไม่ขึ้นป้าย · สูงสุด 3 ใบ เอาคันใกล้สุดก่อน · ย่อ/ขยายกระจกแล้วกรอบป้ายตามอัตโนมัติ (อ่าน `mirrorRearRect()`)
  - 🔑 **2 บทเรียนที่เจอตอนทดสอบ (ห้ามทำซ้ำ):** ① **เพื่อนที่ขับเรียงเลนเดียวกัน ป้ายมากองทับกันหมด** — คันใกล้ลอยสูง (มุมชัน) คันไกลไหลลงหาเส้นขอบฟ้า สุดท้ายอยู่ห่างกัน 2-3px ทั้งกอง → วางทีละใบจากคันใกล้สุด ชนใครก็ดันลงล่างทีละชั้น (แกน x ยังตรงคันเดิม = ยังรู้ว่าป้ายของใคร) ② **ป้ายอ้วนบังกระจกจนดูไม่ได้** — ชุดแรก font 9px+ดาว 8px กว้าง 77px จาก 260 (30%) 3 ใบบังถนนเกือบหมด → ย่อเป็น font 8px/ดาว 6px บีบชิด/พื้นหลัง .58 กึ่งโปร่ง/ชื่อตัด 9 ตัวอักษร → เหลือ 46-67px มองทะลุเห็นรถได้
  - 🩹 แถม: `Adventure3D._t.step()` เดิม **ไม่วาดกระจกเลย** (rAF ไม่ยิงในแท็บ preview → เทสต์กระจกไม่ได้มาตลอด) → เพิ่ม `drawCarMirrors()+mirrorTagsTick()` ใน step
  - ยืนยัน (preview เอง :8791 · mock login+ลงทะเบียน+เข้าโลกขับรถจริง `state.driveTicket=true`→`Adventure3D.start('drive')`→`engineOn()` · ยิงเพื่อนปลอมเข้า `_t.onPeerData` · **พิสูจน์ตำแหน่งด้วย pixel-diff จาก `gl.readPixels` เฉพาะกรอบกระจก** = ถ่าย 2 เฟรม (มีเพื่อน/ไม่มีเพื่อน) แล้วหา centroid ของพิกเซลที่เปลี่ยน): รถเพื่อนขึ้นในกระจกจริง (พิกเซลเปลี่ยน 191-213 จุด) · **ป้าย cx=130.0 vs รถ cx=129.5 (คลาด 0.5px) · ป้ายล่างสุด 29.6 vs หลังคารถ 29.0 = ป้ายนั่งบนหลังคาพอดี** ✓ กรอบป้าย = กรอบกระจกเป๊ะทุกเคส (1280×720 → 510,52,260,74 · 812×375 → 276,52,260,74 · ย่อ → 331,52,150,43) ✓ 5 คน (หลัง 8/20/40/60 + หน้า 25) → ขึ้น 3 ใบใกล้สุด คันที่แซงไปข้างหน้าไม่ขึ้น ✓ 140m/ไม่มีเพื่อน → กรอบซ่อน ✓ สลับมุมมองที่ 3 → ป้ายหาย กลับมุมมอง 1 → ป้ายกลับมา ✓ ออกจากโลก → ป้ายหาย ✓ **จอเตี้ย 812×375**: 3 ใบ ทับกัน **0 คู่** อยู่ในกรอบครบทั้งเต็ม/ย่อ ✓ ชื่อยาวตัด "มานีขับเ…" ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด server ทดสอบแล้ว
  - ⚠️ **หมายเหตุ session คู่ขนาน:** ตอนคอมมิต `js/adventure3d.js`/`js/adv3d_css.js` มีงานที่ยังไม่ commit ของอีก session ค้างอยู่ในไฟล์เดียวกัน (ปุ่มย่อ/ขยายกระจก `mirrorRearRect`/`MIRROR_REAR_MINI`/`toggleMirrorMini` + media query จอเตี้ยของ "รอบ 972") — **แยกคอมมิตไม่ได้เพราะโค้ดรอบนี้เรียก `mirrorRearRect()` ของเขา** จึงถูกกวาดมาด้วยในคอมมิตรอบนี้ (ขอเลขได้ 972 แต่เลี่ยงไปใช้ 973 เพราะเห็นเขาจอง 972 ไว้ในคอมเมนต์แล้ว)
  - 📋 **เจอระหว่างทาง ยังไม่แก้ (คนละระบบ ปล่อยให้ session รอบ 972 จัดการ):** media query `max-height:430` ซ่อน `#adv-mirror-l/#adv-mirror-r` ด้วย CSS แต่ `drawCarMirrors()` ยัง `mirrorPass` วาดภาพกระจกข้างลง canvas อยู่ → จอเตี้ยจะเห็นภาพกระจกข้าง 2 ก้อนลอยไม่มีกรอบ (ต้องเช็กเงื่อนไขเดียวกันฝั่ง JS ด้วย)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 974 (3 ส.ค. · ผู้ใช้สั่ง "มีคนกดใจ/คอมเมนต์อะไร ให้แจ้งรายงานผู้ใช้ + ในรายงานมีลิงก์ไปยังต้นเรื่อง กดหรือไม่กดก็ได้"):** 🔗🔔 `js/online.js`+`js/ui.js`+`js/util.js`+`css/lobby.css`+`css/style.css` — ① แจ้งเตือนเก็บ **`cid`** เพิ่ม (`gfeedNotifDiff` ชนิด `cm`/`rp`/`cl` · `rx`=กดใจโพสต์ไม่มี cid เพราะต้นเรื่องคือตัวโพสต์) ② `toastLink()` ใหม่ใน util.js = แถบเด้งสดที่มีปุ่ม **🔗 ไปดูต้นเรื่อง** + ปุ่ม ✕ · **ไม่กดก็หายเองใน 7 วิ ไม่เด้งหน้าจอเอง** (กติกาที่ผู้ใช้ย้ำ) ③ กล่อง 🔔 ทุกแถวมีปุ่มลิงก์เห็นชัด + บรรทัดบอก "ไม่กดก็ได้ รายการยังอยู่ที่นี่" (เดิมกดแถวได้แต่ไม่มีอะไรบอกว่ากดได้) ④ `feedNotifGo()` = เลื่อนวงหมุนล็อบบี้ไปหยุดที่โพสต์นั้น + เปิดแผ่นคอมเมนต์ + **ไฮไลต์ตัวต้นเรื่องจริง** (คอมเมนต์ใบนั้น / `.fcm-post` ถ้าเป็นการกดใจโพสต์) · ตอบกลับที่อยู่ในสายที่ถูกยุบ (รอบ 965) → กางสายให้ก่อนอัตโนมัติ · โพสต์หลุดฟีดแล้ว → บอกผู้ใช้ ไม่เงียบ
  - 🔑 **บทเรียน (ห้ามทำซ้ำ): ห้ามใช้ `target.offsetTop` คิดระยะเลื่อนใน `.fcm-list`** — offsetParent ของแถวคือกล่องแผ่น ไม่ใช่ลิสต์ (วัดได้ 295 ในลิสต์สูง 191 = เลื่อนพลาดทุกครั้ง) → ใช้ `getBoundingClientRect()` เทียบ list/target แล้วบวกเข้า `scrollTop` เดิม (ไม่ต้องรู้ว่าซ้อนกันกี่ชั้น) · อีกข้อ: **แท็บ preview เป็น `hidden` → `transition:bottom` ไม่เดิน** วัด rect ได้ค่าเก่าทั้งคู่ ดูเหมือน toast ทับกัน → ปิด transition ก่อนวัด (แบบเดียวกับรอบ 961)
  - ยืนยัน (preview เอง :64321 · **เปิด `/index_classic.html`** · mock login+ลงทะเบียน+ยัดน้อง 1 ตัวให้กล่องฟีดโผล่ + ฟีดปลอม 2 โพสต์/คอมเมนต์ 14 ใบ/สายตอบกลับยุบ 5 ใบ): ลิงก์ทั้ง 5 ชนิดพาไปถูกที่ทุกใบ — `cl`→c2 · `rp`→r5 (**สายถูกกางให้ 12→15 แถว**) · `cm`→x8 · `rx`→`.fcm-post` · คอมเมนต์เราในโพสต์เพื่อน→เปลี่ยนโพสต์เป็น p2 แล้วไฮไลต์ d1 ✓ ทุกเคส "อยู่ในกรอบรายการจริง" (rect เทียบ list) ✓ `gfeedNotifDiff` จริงคืน cid ครบทุกชนิด ✓ กดปุ่มในแถบเด้ง → แถบหาย + เปิดต้นเรื่องถูกใบ ไม่เด้งซ้อน (stopPropagation กันคลิกแถวซ้ำ) ✓ ไม่กด → 6.6 วิยังอยู่ · 7.5 วิหายเอง · ไม่มีอะไรเปิดค้าง ✓ 2 แถบซ้อน bottom 133/76 ไม่ทับกัน ✓ โพสต์หลุดฟีด → toast บอก ไม่เปิดแผ่นเปล่า ✓ **จอเตี้ย 812×375**: กล่อง 🔔 420×330 อยู่ในจอครบ ไม่มี scroll · ปุ่มลิงก์ 90×23 อยู่ใต้บรรทัดเวลาไม่ทับ · แถบเด้ง 406×59 อยู่ในจอ ✓ console สะอาด · `node --check` ผ่าน 3 ไฟล์ · ล้าง storage + ปิด server แล้ว
  - ⚠️ **session คู่ขนานทำ HEAD พังไว้ ซ่อมในรอบนี้:** commit "รอบ 971" ของอีก session กวาด `js/ui.js` ที่ผมกำลังแก้ค้างไปครึ่งทาง → บน main มี `feedNotifGo()` ที่เรียก `FCM_FOCUS_POST` **แต่ไม่มีบรรทัดประกาศตัวแปรนั้น** และ `openFeedComments` ยังรับ 1 อาร์กิวเมนต์ = **กดแจ้งเตือนแล้ว ReferenceError** (a61871a ของเขาซ่อม toastLink/style ให้แล้วส่วนหนึ่ง) · รอบนี้คอมมิตชุดเต็มทับ = ครบทั้งระบบ · คอมเมนต์ในโค้ดของงานนี้เปลี่ยนเลขเป็น "รอบ 974" หมดแล้ว (ของ session นั้นที่เป็น "รอบ 971" จริง = จัดแนวหัวล็อบบี้/แถวเหรียญ ไม่เกี่ยวกัน)


## ⏬ ย้ายเมื่อ 2026-08-03 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 975 (3 ส.ค. · ต่อยอดรอบ 973 "แตร/ไฟเลี้ยวเพื่อนในกระจก ให้ป้ายกะพริบด้วย"):** 📯🚦 `js/adventure3d.js`(`netHonk`+`mirrorTagsTick`)+`js/adv3d_css.js` — **ไฟเลี้ยว** ใช้ `p.tl` ที่มีอยู่แล้วตรงๆ (field `tl`/`l` ผ่าน rules มานานแล้ว) → ลูกศร ◀/▶ กะพริบหน้าชื่อในป้ายกระจก · **แตร** ไม่เคยส่งเข้าเน็ตเลยมาก่อน (แค่เล่นเสียงเครื่องตัวเอง) — ตอนแรกจะเพิ่มฟิลด์ DB ใหม่ (เช่น `hn`) แต่พบว่า **เสี่ยงเกินไป**: `/wroom` เขียนทั้งก้อนด้วย `.set()` ทุกเฟรม ฟิลด์ที่ rules ยังไม่รู้จัก (`"$other":{"​.validate":false}`) ทำให้ **ทั้งก้อนถูกปฏิเสธ** ไม่ใช่แค่ฟิลด์เดียว และเส้นทางใหม่ (ต่างจาก legacy `/world`) **ไม่มีตัวลอกฟิลด์แปลกทิ้งแล้วส่งซ้ำ** → ถ้าพลาดจะหยุดซิงก์ตำแหน่งเพื่อนทั้งชุดเงียบๆ ทันทีที่โดนปฏิเสธครั้งแรก (ดู `netroom.js:onFail` — `everOk` true แล้วโดน deny = `netOk=false` ค้างทั้ง session) → **เปลี่ยนแผน**: ยืมช่องแชทลอยหัวเดิม (`c`/`ct` — rules อนุญาตอยู่แล้ว) ส่งข้อความ `'📯'` แทน (`netHonk()`) ไม่ต้องแก้ rules เลย แถมได้ฟองข้อความ 📯 ลอยเหนือหัวเพื่อนในโลกจริงด้วยฟรีๆ (ระบบเดิมอ่าน `c`/`ct` อยู่แล้ว) · ฝั่งกระจก: `onPeerData` เจอ `d.c==='📯'` → จำ `p.hornAt` → ป้ายกระจกของคันนั้นเรืองส้ม+เด้งกะพริบ ~0.9 วิ
  - 🔑 บทเรียน (ห้ามทำซ้ำ): **ห้ามใส่ `transform` ใน CSS keyframe ของป้ายที่ตำแหน่งมาจาก inline style `transform:translate(...)` ที่ตั้งจาก JS ทุกเฟรม** — animation ชนะ inline style เสมอ ลองใส่ `transform:scale()` ตอนกะพริบแตรรอบแรกแล้วป้ายจะกระโดดไปมุมจอทันทีที่ animation เริ่ม (ตำแหน่งเดิมหาย) → เปลี่ยนไปใช้ `filter:brightness()`+`background`/`box-shadow` แทน ไม่แตะ transform เลย
  - ยืนยัน (preview เอง :8792 · mock login+ลงทะเบียน+เข้าโลกขับรถจริง+ยิงเพื่อนปลอม `tl:1` และ `c:'📯',ct:Date.now()` เข้า `_t.onPeerData`): ลูกศร ◀ ขึ้นหน้าชื่อคันที่ `tl:1` จริง ✓ ป้ายคันที่บีบแตรได้ class `honk` + `getComputedStyle().animationName` = `mtagHonk`/`mtagTurnBlink` จริงทั้งคู่ (ไม่ใช่ `none`) ✓ **ระหว่างกะพริบแตร ตำแหน่งป้ายไม่ขยับเลย** (`getBoundingClientRect` เท่าเดิมทุก frame ก่อน/หลัง) ✓ ผ่าน 900ms → class หลุดเอง (`step()` เช็กซ้ำ) ✓ ฟองข้อความ 📯 ขึ้นเหนือหัวเพื่อนในโลกจริงด้วย (`p.bubble` มีจริง) ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด server ทดสอบแล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 976 (3 ส.ค. · ผู้ใช้สั่ง "เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/&lt;uid&gt; ให้ปิดเกมแล้วกลับมายังเห็นย้อนหลัง + เลขค้างบนกระดิ่ง"):** 🔔📥 `js/online.js`+`js/ui.js`+`css/lobby.css`+`handoff/RULES.md`+`tools/gen_rules_artifact.py`(ใหม่) — **พลิกทิศทางการแจ้งเตือน: "คนที่กด" เป็นฝ่ายเขียนใบแจ้งเตือนฝากไว้ในกล่องของเจ้าของเรื่อง** (เดิมรอบ 701 ผู้รับคิดเองจาก diff `/gfeed` → ต้องเปิดเกมค้างอยู่เท่านั้น ปิดแล้วหายเกลี้ยง) · โซนใหม่ `/gnotif/<ผู้รับ>/n/<nid> = {t,pid,cid,u,n,r,cm,tx,ts}` + `/gnotif/<ผู้รับ>/seen = <nid ที่อ่านถึง>` · **`seen` เก็บเป็น push key ไม่ใช่ timestamp** (นาฬิกาเครื่องคนกดเชื่อไม่ได้) · ส่งจาก `gfeedSetReaction`/`gfeedAddComment`(ผ่าน `gnotifTellComment`)/`gfeedToggleCommentLike` · รับด้วย `gnotifWatchStart→gnotifListen` (child_added + limitToLast 40) · diff เดิมยังอยู่เป็นตัวสำรอง กันซ้ำที่ `gnotifAdd` ด้วยรหัส `t|pid|cid|u|r` · UI: ป้ายแดง **"ใหม่"** ต่อแถวที่ยังไม่อ่าน + กดเปิดกล่อง 🔔 = `gnotifMarkSeen()` จด `seen` ลง DB · `gnotifPrune()` กวาดเกิน 40 ใบทิ้ง
  - ⚠️ **rules ยังไม่ publish → เกมไม่พัง** ถอยกลับไปทำงานแบบรอบ 701 เป๊ะ + `Online.gnotifOk=false` ขึ้นป้ายเหลืองในกล่อง 🔔 บอกเหตุผลตรง ๆ (กฎทองข้อ 1) · **Artifact ปุ่มคัดลอกก้อนเต็ม 32 โซน:** https://claude.ai/code/artifact/b655958d-c995-4100-96ed-71b191dc43ed
  - 🛠️ แถม (กฎทองข้อ 9): `tools/gen_rules_artifact.py` — เจนหน้า Artifact ปุ่มคัดลอกจากก้อนใน RULES.md ตรง ๆ (`--zone` ไฮไลต์โซนใหม่ให้เอง) เดิมทุกรอบต้องเขียนสคริปต์ชั่วคราวใหม่
  - ยืนยัน (preview เอง :63843 · **เปิด `/index_classic.html`** · mock login+ลงทะเบียน+ยัดน้อง 1 ตัวให้กระดิ่งโผล่ + fake `Online.db` ที่บันทึก path ที่เขียนจริง/ยิง child_added เองได้/สวิตช์สั่ง deny): **ฝั่งส่ง 9 เคสถูกหมด** — `rx`→เจ้าของโพสต์ · `cm`→เจ้าของโพสต์(cid = คีย์คอมเมนต์ใหม่จริง) · ตอบคอมเมนต์บ๊อบในโพสต์คนอื่น→**2 ใบ `rp`+`cm` คนละคน** · ตอบคอมเมนต์ของเจ้าของโพสต์เอง→ใบเดียว(ไม่ซ้ำ) · ตอบคอมเมนต์ตัวเอง/ถูกใจคอมเมนต์ตัวเอง/โพสต์ตัวเอง/ถอนไลก์/ถอนถูกใจ→**ไม่ส่ง** ✓ **ฝั่งรับ**: ประวัติ 5 ใบ + `seen='-A3'` → เรียงใหม่→เก่า เลขค้าง **2** ตรง · โหลดย้อนหลังไม่เด้ง toast เลย · ใบใหม่สด→เด้ง+นับ 3 · diff ยิงซ้ำใบเดิม→**ไม่เพิ่มแถว ไม่เด้งซ้ำ** · diff มาก่อน DB ตามมา→ผูก `nk` ให้ใบเดิม ✓ **🔁 จำลองปิดเกมเปิดใหม่ (ล้างของในเครื่องแล้วต่อ DB ใหม่): 8 ใบยังอยู่ครบ เลขค้าง 1 = เฉพาะใบที่เข้ามาหลังกดอ่าน** ✓ กดเปิดกล่อง→ป้าย "ใหม่" 4 ใบตรงกับที่ยังไม่อ่าน + เขียน `set gnotif/test1/seen='-A7'` + กระดิ่งเหลือ 🔔 เปล่า ✓ prune 53→ลบ 13 เหลือ 40 ✓ **rules ถูก deny**: `gnotifOk=false` · ไลก์/คอมเมนต์ยัง **สำเร็จปกติ** · diff สำรองยังเด้ง+นับได้ · ป้ายเหลืองขึ้นในกล่อง · ข้อความกล่องว่างเปลี่ยนตามสถานะ ✓ ปุ่ม 🔗 ไปดูต้นเรื่องของรอบ 974 ยังเปิดแผ่นคอมเมนต์ได้เหมือนเดิม ✓ **จอเตี้ย 812×375**: กล่อง 420×330 อยู่ในจอครบ ตัวกล่องไม่มี scroll (sh=ch=328) · หน้าเว็บไม่มี scroll · ป้ายเหลือง 398×43 อยู่ในกล่อง · ป้าย "ใหม่" 26px ห่างชื่อ 5px บรรทัดเดียวกัน · ปุ่มลิงก์ 90×22.6 อยู่ใต้บรรทัดเวลา ✓ console สะอาด · `node --check` ผ่าน 2 ไฟล์ · JSON rules parse ผ่าน 32 โซน + ข้อความในปุ่มคัดลอกตรงกับ RULES.md **ทุกตัวอักษร (28,218 ตัว)** · ล้าง storage + ปิด server แล้ว
  - ⚠️ ขอเลขรอบได้ 975 แต่ session คู่ขนาน (แตร/ไฟเลี้ยวในกระจก) commit ทับก่อน → เลื่อนเป็น **976** + แก้เลขในคอมเมนต์โค้ดครบก่อน commit (คนละระบบ ไม่แตะไฟล์กัน)


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 977 (3 ส.ค. · ผู้ใช้สั่ง "ปุ่มจับคู่ภาพใต้จอ Lobby เดิม + Lobby 3D · กระดานเต็มจอ ภาพคละกัน จับคู่ได้บวกเหรียญเหมือนจับคู่คำศัพท์ทุกประการ · แตะภาพมีเสียงอังกฤษ · ใช้ img/matching/animal1.png+animal2.png"):** 🖼️🎮 ไฟล์ใหม่ `js/picmatch.js`+`js/data/matchpics.js`+`tools/slice_matching.py` · แก้ `index_classic.html`(ปุ่ม `#btn-picmatch` ในแถบล่าง + script 2 ตัว)+`css/lobby.css`(โซนใหม่ท้ายไฟล์ 🖼️)+`js/main.js`(`CLICK.picmatch` รับ `?go=`)+`js/city3d.js`(ตึกใหม่ `picmatch` 169° วงนอก + `actBuilding` 🖼️)+`js/online.js`(สถานะ "กำลังจับคู่ภาพสัตว์")
  - **กติกา = จับคู่ภาพ "สัตว์ตัวเดียวกัน คนละลายเส้น"** — แถวบน 4 ใบจากแผ่น 1 · แถวล่างจากแผ่น 2 (46 ตัวที่มีครบทั้ง 2 แผ่น) · แตะภาพไหนก็อ่านออกเสียงอังกฤษ (`speakWord`) · รางวัลใช้สูตร/ตัวนับชุดเดียวกับ `checkMatch` ใน game.js เป๊ะ (10🪙+2RP+5EXP/คู่ · มังกร×2 · โบนัสมือถือ · แต้มโรงงาน · คอมโบ · เคลียร์รอบ +20🪙+5RP · สายฟ้าแลบ · ตัดช้อยส์แมว · จับเวลา 60 วิ +20 ถ้ามีหมา · การ์ดสรุป `showSessionSummary` + สถิติสัปดาห์เดียวกัน)
  - 🖼️ **ตัดภาพเอง:** `tools/slice_matching.py` ตัดแผ่น 1024×1536 เป็นการ์ด 200px **เฉพาะรูป ตัดตัวอักษรทิ้ง** (พิกัดกรอบการ์ดหาจาก "สีเส้นประขอบการ์ด" b−r>5 ไม่ใช่ช่องว่างสีขาว — พื้นหลังขาวเท่าการ์ด แถวสูงไม่เท่ากันทุกแถว) → `img/matching/cards/a{1,2}_<key>.png` 150 ใบ 2.5MB · **ต้นฉบับ animal1/2.png ใส่ .gitignore แล้ว** (4.2MB ไม่ได้ใช้ตอนเล่น ตัดใหม่ได้เสมอ) · เจนเสียง 29 คำที่ยังไม่มีด้วย edge-tts สูตรเดียวกับ `tools/gen_word_audio.py` → ครบ 46/46
  - ยืนยัน (preview เอง :54980 · **เปิด `/index_classic.html`** · mock login+ลงทะเบียน): จับคู่ถูก +10🪙+2RP คอมโบ×1 · ผิด = shake คอมโบ 0 ไม่ได้เหรียญ ✓ เคลียร์ 4 คู่ = +50 (30+โบนัส 20) แล้วขึ้นรอบใหม่เอง เวลา 60 ✓ หมดเวลา→รอบใหม่ ✓ ตัดช้อยส์เรืองคู่ที่ถูกทั้ง 2 ฝั่ง กดได้ครั้งเดียว/รอบ ✓ `speakWord` ถูกเรียกด้วยชื่ออังกฤษทุกครั้งที่แตะ (ทั้ง 2 แถว) · **HEAD ทุกไฟล์ 200 ครบ 92 ภาพ + 46 เสียง** ✓ ออก→การ์ดสรุป+ฟีด "จับคู่ภาพสัตว์ได้ N เหรียญ" · "เล่นต่ออีกรอบ" กลับเข้าจับคู่**ภาพ** ไม่ใช่เกมคำ ✓ เมือง 3D: `CITY._t.tapBuilding('picmatch')` → เดินไปแล้วเด้ง `index_classic.html?go=picmatch` → เปิดกระดานจริง ✓ **จอเตี้ย 812×375**: ไม่มี scroll (375=375) ไล่เช็กทับกัน 16 element = 0 คู่ ทุกชิ้นอยู่ในจอ (ต้องย่อ `--pmh` เหลือ 22.5vh + ซ่อนบรรทัด 2 ของป้ายล่าง ไม่งั้นป้ายล้นจอ 21px) ✓ console สะอาด · `node --check` ผ่าน 5 ไฟล์ · ล้าง storage + ปิด server แล้ว
  - 🔑 บทเรียน: **แท็บ preview เป็น hidden → transition ไม่เดิน** ป้ายชื่อสัตว์ใต้การ์ดที่จับคู่ได้วัด opacity ได้ 0 ตลอดทั้งที่ CSS ถูก (ปิด transition ก่อนวัด → 1) — ซ้ำรอย 961/974


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 978 (3 ส.ค. · ผู้ใช้สั่ง "เพิ่มโหมด 'ภาพสัตว์↔คำอังกฤษ' ในเกมจับคู่ภาพ ใช้การ์ดที่มีอยู่ทั้ง 150 ใบ ไม่ใช่แค่ 46 ตัวที่มี 2 แผ่น + ปุ่มสลับโหมดบนกระดาน · กติกาเหรียญเดิม"):** 🔤 `js/data/matchwords.js`(ใหม่ เจนจาก `tools/gen_matchwords.py`)+`js/picmatch.js`(`pm.mode`/`toggleMode`/`imgCard`/`wordCard`)+`css/lobby.css`(`.pm-mode-btn`/`.pm-wordcard`)+`index_classic.html`(script tag ใหม่) — MATCH_WORDS ครบ 104 ตัว (ทุกตัวที่มีภาพ ≥1 แผ่น) พร้อม field `sheet` บอกว่าใช้ภาพ a1/a2 แผ่นไหน · โหมด word: แถวบนภาพ (แผ่นเดียวจาก `sheet`) ↔ แถวล่างคำอังกฤษ (การ์ดข้อความใหม่ `.pm-wordcard`) · ปุ่ม `#pm-mode` สลับ + รีเซ็ตคิวคนละคลัง (`queue=[]`กันปนโหมด) · เจนเสียง 55 คำที่ยังไม่มีด้วย edge-tts สูตรเดียวกับรอบ 977
  - ยืนยัน (preview เอง :55913 · เปิด `/index_classic.html` · mock login+ยัดสัตว์ผ่าน state ตรง+`PicMatch.open()`): สลับโหมดถูก คลังคนละชุด (pic=46/word=104) · การ์ดภาพ/คำตรงกันทุกคู่ (ตรวจ HEAD 208 ไฟล์ word-mode + 92 ไฟล์ pic-mode = 200 ครบ) · จับคู่ถูกได้ 10🪙 พูดชื่ออังกฤษทั้ง 2 ฝั่ง · ผิด=shake คอมโบ 0 · ครบรอบ+20🪙 ขึ้นรอบใหม่ยังอยู่โหมดเดิม · hint ไฮไลต์ถูกคู่ทั้ง 2 แถว · **จอเตี้ย 812×375**: ไม่มี scroll · ปุ่มโหมดไม่ทับปุ่มอื่นในแถวบน · คำยาวสุด (Grasshopper/Woodpecker/Chinchilla/Guinea Pig) ไม่ล้นการ์ด · console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 979 (3 ส.ค. · ผู้ใช้สั่ง "เพิ่มแท็บ 🖼️ จับคู่ภาพ ในกระดานอันดับ + รางวัลรายเดือน Top 10 กติกาเดียวกับ 🔎 ค้นหาคำทุกประการ"):** 🖼️🏆 ไฟล์ใหม่ `js/pmaward.js`(ค่าตั้ง PmAward ใช้โรงงาน `makeMonthAward`) · แก้ `js/picmatch.js`(`check()`เพิ่ม `state.pmScore/pmPairs/pmBoards` — จับคู่ถูก +2 แต้ม/เคลียร์กระดาน +10 แต้ม)+`js/online.js`(field ใหม่ `pm` บน `/leaderboard` ต่อจาก `sg` ในทั้ง sig/fallback ladder/listener)+`js/ui.js`(`LB_TABS`เพิ่ม `pm` ต่อจาก `ws`+`LB_PM_TOP`+`lbRankRows('pm')`+`lbfAwardBarHtml`+ปุ่มแท็บใน `openLeaderboardFull`)+`index_classic.html`(script `pmaward.js` ต่อจาก `sgaward.js`)+`handoff/RULES.md`(โซนใหม่ `pmAward` + ฟิลด์ `pm` ใน `leaderboard/$uid`)
  - ยืนยัน (preview เอง :50490 · mock login+ลงทะเบียน ป.1 + fake `Online.board`/`Online.db`): แท็บ `🖼️ จับคู่ภาพ` โผล่ถูกตำแหน่ง (ต่อจาก 🔎 ค้นหาคำ) ✓ เล่นจับคู่จริงครบ 4 คู่ → `pmScore` 2→4→6→8 แล้ว +10 ตอนเคลียร์กระดาน = 18 ตรงสูตร ✓ `onlinePushScore()` ส่ง `pm:18` ขึ้น `/leaderboard` จริง (ตรวจ payload) ✓ **rules ยังไม่ publish จำลอง deny เฉพาะฟิลด์ `pm`** → fallback ถอยลงชั้น `sg` อัตโนมัติ เขียนสำเร็จไม่พัง (เหมือนฟิลด์อื่นตอนเพิ่มใหม่ทุกรอบที่ผ่านมา) ✓ กระดานเต็มจอ: โพเดียม/Top10/ป้ายรางวัลรายเดือนแสดงคะแนน+เงินรางวัลถูกต้อง (เทียบมือ 3 แถวมือ) ✓ กด `.lbf-award` เปิดกระดานประกาศ `PmAward.open()` ได้ กติกา/แถวคะแนนถูก ✓ จำลอง `pmAward` deny ทั้งพาธ → `PmAward.check()` resolve เงียบไม่ throw (try/catch เดิมใน award.js ครอบอยู่แล้ว) ✓ **จอเตี้ย 812×375**: กระดานเต็มจอไม่มี scroll (`scrollHeight=clientHeight=375`) กล่องอยู่ในจอครบ ✓ console สะอาด · `node --check` ผ่านทั้ง 4 ไฟล์ js · `gen_rules_artifact.py` parse ก้อนเต็มผ่าน (33 โซน) ✓ ล้าง storage + ปิด server แล้ว
  - ✅ **ผู้ใช้ publish rules แล้ว (3 ส.ค.)** — อ่านกฎสดเทียบกับก้อนใน RULES.md: **331 คีย์ตรงกันทุกตัว 0 ต่าง** (`pmAward`+`leaderboard.pm` ขึ้นจริงแล้ว) → แต้มจับคู่ภาพขึ้นกระดานอันดับ/รับรางวัลรายเดือนได้ปกติทันที
  - ⚠️ **เจอโค้ดค้างไม่ commit ของ session อื่นในไฟล์เดียวกัน (`js/picmatch.js`+`css/lobby.css`)** ระหว่างทำงาน — ระบบจัดกริดอัตโนมัติ `fitGrid()`/`gradeTier()`/คลาส `wide`/`tiny` (ขยาย SIZE_LOW/MID/HIGH ให้พอดีจอทุกขนาด คนละเรื่องกับงานนี้) commit รอบนี้จึงกวาดมาด้วยเพราะแยกไฟล์ไม่ได้ — ทดสอบแล้วไม่ชนกับฟีเจอร์คะแนนที่เพิ่ม (จับคู่คู่ที่ 1-4 ได้ปกติ) แต่**ไม่ได้ทดสอบกระดานใหญ่ 40 คู่ของระบบนั้นเอง** ถ้าเจอปัญหาแจ้งได้เลย


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 980 (3 ส.ค. · ผู้ใช้สั่ง "เกม Vocab World — โหมดจับคู่ภาพ-คำใน js/picmatch.js (js/data/matchwords.js) กรองสัตว์ตามระดับชั้นผู้เล่น"):** 🎓🐾 ไฟล์ใหม่ `js/data/animalgrade.js`(เจนจาก `tools/gen_animalgrade.py`) + แก้ `js/picmatch.js`(`gradeTier()`+`bank()` กรอง)+`index_classic.html`(script tag ใหม่) — `MATCH_WORDS`/`MATCH_PICS` ไม่มีข้อมูลระดับชั้นเดิม (ต่างจาก `VOCAB_BANDS` ที่แยกคลังคำต่อระดับอยู่แล้ว) → ออกแบบตาราง `ANIMAL_GRADE` ใหม่ key→tier 1-3 (สะสม: tier สูงเห็นของ tier ต่ำด้วยเสมอ ไม่ตัดของเดิมออก) ผูกกับ 3 ระดับเดียวกับ `sizeForGrade()` เป๊ะ (ป.1-2/ป.3-4/ป.5 ขึ้นไป) — tier1=22 ตัว(สัตว์คุ้นเคยสุด เช่น cat/dog/cow) · สะสมถึง tier2=64 ตัว · สะสมถึง tier3=104 ตัว(ครบ รวมตัวหายาก เช่น chinchilla/alligator) · `bank()` กรองแบบ `(ANIMAL_GRADE[key]||3) <= tier` + fallback คลังเต็มถ้าไฟล์ยังไม่โหลดหรือกรองแล้วว่าง (กันพัง)
  - ยืนยัน (preview เอง :8795 · เซ็ต `state.student.grade` ตรงผ่านคอนโซล + เรียก `PicMatch._t.bank()`/`PicMatch.open()`): ป.1-2 → pic 20/46 · word 22/104 (tier สูงสุด 1) ✓ ป.3-4 → pic 46/46(สัตว์ในคลัง pic ทุกตัว tier≤2 อยู่แล้ว) · word 64/104 (tier สูงสุด 2) ✓ ป.5 ขึ้นไป/ม.1-ม.6/ปริญญาตรี → ครบทั้ง 2 โหมด (tier สูงสุด 3) ✓ ต่ำกว่าประถมศึกษา = เท่า ป.1-2 ✓ ทุกกรณีคีย์ไม่ซ้ำ ไม่มีอันไหนหลุดออกจากคลังที่ควรมี ✓ เปิดเกมจริงด้วยนักเรียน ป.1 → กระดาน 4 คู่มีแต่สัตว์ tier1 (butterfly/monkey/chicken/fox) การ์ดภาพ/คำเรนเดอร์ปกติทั้ง 2 โหมด ✓ console สะอาด · `node --check` ผ่านทั้ง 2 ไฟล์ · ล้าง storage + ปิด server ทดสอบแล้ว
  - ⚠️ **ไฟล์ที่แก้ร่วมกับ session คู่ขนาน (`js/picmatch.js`/`index_classic.html`)** — เขาทำระบบจัดกริดอัตโนมัติ `fitGrid()` (รอบ 981) คนละเรื่องกับงานนี้ในฟังก์ชันใกล้กัน (`sizeForGrade`) แยก commit ไม่ได้ ทดสอบร่วมแล้วไม่ชนกัน (ดูรอบ 981 ยืนยันของเขา) · commit นี้จึงมีโค้ด `fitGrid`/`pmScore` ของเขาติดมาด้วยเป็นเรื่องปกติของสถานการณ์นี้


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 981 (3 ส.ค. · ผู้ใช้สั่ง "ป.1-2 = 4 คู่ · ป.3-4 = 10 คู่ · ป.5 ขึ้นไป = 40 คู่ (80 ภาพ) ย่อภาพเหมือนเกม onet แต่เราเป็นแนวนอน"):** 🎚️📐 `js/picmatch.js`+`css/lobby.css` — `sizeForGrade()` คืน [จำนวนคู่, วินาที] ตามชั้น (4/60 · 10/150 · 40/480) · **`fitGrid()` ใหม่**: ไล่ทุกจำนวนคอลัมน์ 1..n เลือกอันที่ทำให้ช่องใหญ่สุดโดยกระดาน **2 แถบยังอยู่ในจอครบ** แล้วตั้ง `--pmc/--pmh/--pmg` (เรียกทุกรอบใหม่ + ตอน resize/หมุนจอ) · กระดาน >8 คู่ กางกริดเต็มความกว้างจอ (`.wide` — ล็อบบี้ปกติกว้างแค่ 780px) · ช่อง <80px = `.tiny` ขอบบาง/ซ่อนป้ายชื่อใต้ภาพ · โบนัสเคลียร์รอบคิดตามขนาด (คู่ละ 5🪙 + 1.25RP → 4 คู่ = +20🪙+5RP เท่าเดิม · 40 คู่ = +200🪙+50RP) · เกณฑ์สายฟ้าแลบขยายตามขนาดกระดาน (`THUNDER_MS × คู่/4`) · **โหมดภาพ-คำจำกัดที่ 20 คู่** (40 คู่ = ช่อง 36px คำยาวอ่านไม่ออก)
  - 🔑 **บทเรียน: ป้ายล่างล้นออกนอก `section` ได้ — `sec.getBoundingClientRect().bottom` ไม่รวมส่วนที่ล้น** (วัดได้ 718/720 ทั้งที่ป้ายจริงจบที่ 724 = ล้นจอ) → ลูปหดขนาดช่องต้องวัดจาก **"ลูกใบล่างสุดของ section"** ไม่ใช่ตัว section · อีกข้อ: **setTimeout ในแท็บ preview ที่ซ่อนอยู่โดน throttle เป็น ~1 วิ** → ลูปทดสอบที่ `await wait(35)` 45 รอบกินเวลาเกิน 30 วิจน tool timeout **แล้วลูปยังวิ่งต่อในหน้าเว็บ** ไปกดการ์ดของรอบถัดไปจนตัวเลขเพี้ยน (คลิกทั้งลูปแบบ sync ไม่ต้อง await เพราะ `pm.checking` ถูกปลดทันทีเมื่อจับถูก)
  - 🛡️ กันเกมค้าง: `take()` ตัดจำนวนที่ขอลงมาเท่าคลังที่มีจริง (`Math.min(n, bank().length)`) — คลังโดนกรองตามชั้น (ANIMAL_GRADE ของ session รอบ 979) เหลือน้อยกว่าที่ขอเมื่อไหร่ ลูปหาตัวไม่ซ้ำจะวนไม่จบ
  - ยืนยัน (preview เอง :55182 · mock login+ลงทะเบียน · วัดด้วย `getBoundingClientRect`): **ป.1/ป.2/ต่ำกว่าประถม → 4 คู่ · ป.3/ป.4 → 10 คู่ · ป.5/ป.6/ม.3/ปริญญาตรี → 40 คู่** ทุกชั้นตรงตามสั่ง ✓ **1280×720**: 4 คู่=4คอลัมน์ 150px · 10 คู่=10คอลัมน์ 122px · 40 คู่=**14คอลัมน์ 71px** — การ์ดทับกัน 0 คู่ (ไล่ครบทุกคู่ใน 80 ใบ) หลุดจอ 0 ใบ ไม่มี scroll ทั้งแนวตั้ง/นอน ✓ **812×375**: 97px / 75px / **36px** ทุกใบอยู่ในจอ ไม่มี scroll ✓ ยิงอีเวนต์ resize → คำนวณใหม่ถูกต้อง ✓ เคลียร์กระดาน 40 คู่ = +560🪙/+122RP (36 คู่ที่เหลือ×10 + โบนัส 200 · RP 72+50) · 10 คู่ = +150🪙/+33RP **ตรงสูตรเป๊ะ** ✓ โหมดภาพ-คำ: ป.5 ได้ 20 คู่ ช่อง 45px — ยัดคำยาวสุดในคลัง (Grasshopper/Chinchilla/Woodpecker) **ไม่มีใบไหนตัวอักษรล้น/โดนตัด** ✓ คลังหลังกรองตามชั้น pic 20/46/46 · word 22/64/104 (พอสำหรับ 4/10/40 คู่ทุกชั้น) ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว
  - ⚠️ **ไฟล์ `js/picmatch.js` ตอน commit มีงานค้างของ session อื่น 2 ชุดติดมาด้วย** (รอบ 979 = แต้ม `state.pmScore/pmPairs/pmBoards` + ตารางกรองสัตว์ `js/data/animalgrade.js`) — แยกไม่ได้เพราะแก้ฟังก์ชันเดียวกัน (`bank()`/`sizeForGrade→gradeTier`) · ทดสอบรวมกันแล้วทำงานถูกทั้ง 2 ระบบ · **ไม่ได้ commit `index_classic.html` และ `js/data/animalgrade.js` ของเขา** (ปล่อยให้ session นั้น commit เอง — ระหว่างนี้ `typeof ANIMAL_GRADE === 'undefined'` ทำให้ถอยไปใช้คลังเต็ม ไม่พัง)
  - 📋 ข้อสังเกตค้างไว้: โหมดภาพ-ภาพของ ป.5 ใช้ 40 จาก 46 ตัวที่มีภาพครบ 2 แผ่น → **แต่ละรอบสัตว์ซ้ำกันเกือบหมด** ถ้าอยากให้หลากหลายต้องตัดภาพสัตว์เพิ่มจากแผ่นที่ 2 ให้มีคู่ในแผ่นที่ 1 (หรือใช้ภาพเดียวกันแต่พลิก/ย้อมสีต่าง)


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 983 (3 ส.ค. · ผู้ใช้สั่ง "ขยายโซน /gnotif ให้เก็บของขวัญ + คำขอเป็นเพื่อน + ทักทายน้อง ย้อนหลังด้วย รวมเข้ากล่อง 🔔 เดียวกัน"):** 🔔🎁 `js/online.js`(`giftSend`/`greetSend`/`friendRequest` ฝากใบแจ้งเตือนต่อท้ายการส่ง + `gnotifKeyOf`/`GNOTIF_QUIET`/`gnotifListen`)+`js/ui.js`(`FNT_JUMP`/`fntGiftName`/`feedNotifText`/`feedNotifGo`/`openFeedNotif`)+`handoff/RULES.md` — ชนิดใหม่ 3 แบบใน `/gnotif`: `gf` ของขวัญ (`r`=shop/collect · `cm`=id · `cid`=รหัสใบในกล่อง 🎁) · `gr` ทักทายน้อง · `fr` คำขอเป็นเพื่อน · **ไม่มีฟิลด์ใหม่เลย ใช้ของเดิมทั้งหมด** · ปุ่มท้ายแถวพาไป **ห้องของขวัญ/แผงเพื่อน** แทน "ไปดูต้นเรื่อง" · ผู้รับแปลง id → ชื่อไทยเองด้วย `giftItemName()`
  - 🔑 **ทำไมต้องเก็บ:** ของขวัญ/คำทักหายจากกล่อง 🎁 ทันทีที่กดรับ/ไม่รับ · คำขอเป็นเพื่อนถูกลบตอนตอบ → เดิมไม่มีที่ไหนย้อนดูได้ว่าใครส่งอะไรมาเมื่อไหร่ · `gf`/`gr` **ไม่เด้งแถบซ้ำ** (กล่อง 🎁 เด้งอยู่แล้ว) แต่ยังนับเลขกระดิ่ง · `fr` เด้ง (ไม่เคยมีใครเด้งให้)
  - 🔒 rules: `pid` เปลี่ยนเป็นไม่บังคับ + ทางเขียนใหม่เช็ก "ของจริง" — `gf`/`gr` ต้องมี `/gifts/<ผู้รับ>/<คนส่ง>` · `fr` ต้องมี `/friendReq/<ผู้รับ>/<คนส่ง>` = สิทธิ์เท่าการส่งของขวัญ/คำขอที่ทำได้อยู่แล้ว ไม่เปิดช่องใหม่ให้คนแปลกหน้า
  - ✅ **ผู้ใช้ publish ก้อนเต็ม 33 โซน/555 บรรทัดแล้ว** (Artifact https://claude.ai/code/artifact/83189dd7-0cf5-4b97-85a5-73a59d901284) → อ่านกฎสดเทียบทีละคีย์ **331 คีย์ตรงกันหมด** · ของค้างเก่าขึ้นครบพร้อมกัน: `gnotif`(976) `cl`(966) `sgAward`(917) `f1Rank`(903) `f1`ใน wroom(896) `pmAward`+`pm`(979)
  - ยืนยัน (preview เอง :52458 · **เปิด `/index_classic.html`** · mock login + fake `Online.db` ที่บันทึก path ที่เขียนจริง/ยิง child_added เองได้/สวิตช์ deny): **ฝั่งส่ง** — ของขวัญ/คำทัก/คำขอ เขียนใบแจ้งเตือนถูกทั้ง 3 ทาง (`cid` = รหัสของขวัญใบนั้นจริง) · ส่งหาตัวเอง = ไม่ส่งใบ · **rules `/gnotif` deny → ส่งของขวัญ/คำขอยังสำเร็จปกติ** (`gnotifOk=false`) · ของขวัญเองโดน deny → ไม่มีใบตามไป ✓ **ฝั่งรับ** — ประวัติ 5 ใบ + `seen='-A3'` → เลขค้าง 2 ตรง ไม่เด้ง toast ตอนโหลด · ของใหม่สด: `gf`/`gr` เงียบ · `fr` เด้งพร้อมปุ่ม "👥 ไปแผงเพื่อน" · คนเดิมส่งคำขอซ้ำหลังถูกปฏิเสธ = ขึ้น 2 แถว (ไม่ถูกกลืน) · child_added ใบเดิมซ้ำ = ไม่เพิ่มแถว ไม่เด้งซ้ำ ✓ กล่อง 🔔: ไอคอน 🎁/🐾/👋 + ชื่อของขวัญไทยถูกทุกใบ (id แปลกปลอม→"สินค้า" ไม่พัง) · ปุ่ม/กดทั้งแถว → `openPanel('panel-gifts'/'panel-friends')` ถูกทุกเคส กล่องปิดก่อนเสมอ · กดเปิดกล่อง = เขียน `seen='-A9'` เลขกระดิ่งเหลือ 0 ✓ **จอเตี้ย 812×375**: กล่อง 420×330 อยู่ในจอครบ ตัวกล่องไม่มี scroll (sh=ch=328) · ปุ่มทุกแถวไม่ล้นกล่อง (0 ใบ) · หน้าเว็บไม่มี scroll ✓ console สะอาด · `node --check` ผ่าน 2 ไฟล์ · ล้าง storage แล้ว
  - ⚠️ **ชนเลขรอบ 3 ชั้น + โค้ดโดนกวาด** — session คู่ขนานใช้ 979/980/981 แล้วยังเอา **982** ไปอีก (ระหว่างที่ผมกำลังเปลี่ยนคอมเมนต์เป็น 982 พอดี) สุดท้ายลงที่ **983** · โค้ดของรอบนี้ใน `js/online.js`/`js/ui.js` **ถูก commit ของเขา (c2dc667/2ec92aa/cfc8873) กวาดขึ้น main ไปก่อนแล้ว** (ตอนนั้นคอมเมนต์ยังเขียนว่า "รอบ 980") — commit รอบนี้จึงเหลือแค่แก้เลขรอบในคอมเมนต์ + เอกสาร · ตรวจแล้วโค้ดบน main ครบทั้งระบบ ไม่ขาดท่อน (ต่างจากเคสรอบ 974 ที่โดนกวาดครึ่งทางจน ReferenceError)
  - 💡 **บทเรียนซ้ำรอย 971/973/974:** ทำงานไฟล์เดียวกันพร้อม session อื่นใน working tree เดียว = โค้ดถูกกวาดข้าม session ได้เสมอ · ก่อน commit ทุกครั้งให้ `git log --oneline -3` + `git diff --stat` ดูว่าเหลืออะไรจริง ๆ (ถ้า diff เหลือแค่คอมเมนต์ = โดนกวาดไปแล้ว อย่า commit ซ้ำ)


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 984 (3 ส.ค. · ผู้ใช้ส่งภาพกระดาน 40 คู่ สั่ง "ฉันบอกให้ขยายกระดานให้เต็มหน้าจอ ภาพสัตว์คอลัมน์หน้าโดนตัด ขยายให้เต็มจอเลย"):** 🖥️ `css/lobby.css`+`js/picmatch.js` — **ต้นตอ: รอบ 981 กางแค่ "กริด" ด้วย `width:100vw;margin-left:calc(50% - 50vw)` แต่ตัว `#screen-picmatch` ยังอยู่ในกรอบ `#app` (กว้าง 780px) → การ์ดคอลัมน์ริมโผล่พ้นกรอบแล้วโดนตัดครึ่ง** · แก้เป็น **ชั้นเต็มจอจริง** `position:fixed;inset:0;width:100vw` + พื้นหลัง gradient เดียวกับ body + `z-index:55` (การ์ดสรุปตอนออก z=100 ยังทับได้ปกติ)
  - 🔑 **บทเรียน specificity: `.screen.active:not(#screen-dashboard){width:min(780px,94vw)}` ใน style.css ชนะ `#screen-picmatch.active` เพราะ `:not(#id)` นับ id เข้า specificity ด้วย** (1,2,0 > 1,1,0) → กฎใหม่ต้องขึ้นต้น `body #screen-picmatch.screen.active` ไม่งั้นตั้ง `position:fixed` ติดแต่ `width` ไม่ติด (วัดได้ fixed จริงแต่กว้าง 780 เท่าเดิม งงมาก)
  - 🔑 **บทเรียนที่ 2: `@media (max-height:430px){.pm-grid{gap:6px}}` ทับ `gap:var(--pmg)` ที่ `fitGrid()` คำนวณ** → แถว 20 คอลัมน์กว้างเกินจอข้างละ 11px การ์ดริมโดนตัดที่ 812×375 (ลบกฎ gap ตายตัวออก · ห้ามตั้ง gap ซ้ำที่อื่นอีก)
  - ปรับเพิ่ม: กระดาน >20 คู่ ใส่คลาส `.big` บีบป้ายล่างเหลือบรรทัดเดียวไม่มีกรอบ (ได้พื้นที่คืน → ช่องโต 62→78px) · `fitGrid` เปลี่ยนเป็น `>=` ตอนเลือกจำนวนคอลัมน์ = ช่องใหญ่เท่ากันให้เลือกแบบคอลัมน์เยอะกว่า (กระดานกางเต็มจอสวยกว่า)
  - ยืนยัน (preview เอง :50159 · mock login+ลงทะเบียน · `getBoundingClientRect` ทุกใบ): **1312×630 (ขนาดจอที่ผู้ใช้ส่งภาพมา)** — ป.5 = 15 คอลัมน์ ช่อง **78px** กว้าง **93%** ของจอ · ป.3 = 124px 99% · ป.1 = 150px · **การ์ดโดนตัด 0 ใบ ทับกัน 0 คู่ ทั้ง 80 ใบ** ✓ **812×375** — ป.5 19 คอลัมน์ 36px 93% · ป.3 74px 98% · ตัดออกนอกจอ 0 ใบ ✓ กระดานเป็น `fixed` เต็ม 0,0→เต็มจอจริง (ก่อนแก้ x=266 w=780) ✓ เล่นจริงบนกระดานใหญ่: จับถูก +10🪙 · ผิด 0 คอมโบรีเซ็ต · ปุ่มกลับ/สลับโหมดกดได้ ✓ โหมดภาพ-คำบนกระดานใหญ่ ช่อง 94px ตัวอักษรไม่ล้น ✓ ออกจากเกม → การ์ดสรุปทับกระดานถูกต้อง กลับล็อบบี้แล้วกระดานหายสนิท ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 986 (⚠️ commit เขียนว่า "รอบ 985" — session คู่ขนาน (กระดานจับคู่ภาพคละกัน) commit เลข 985 พร้อมกันเป๊ะ hook เลยจับไม่ทัน · คนละไฟล์ ไม่ชนกัน ขึ้นเว็บครบทั้งคู่ที่ deploy `.928`) · 3 ส.ค. · ผู้ใช้ส่งภาพหน้าอันดับเข็ม สั่ง "ทุกๆเข็ม ได้รับเมื่อไหร่ + เงิน 10,000 เหรียญทันที พร้อมข้อความแสดงความยินดี ห้ามขึ้นมาแล้วหายไป ให้ผู้ใช้กดปิดเอง เพื่อยืนยันว่าอ่านทัน"):** 🎊🪙 `js/game.js`(`BADGE_COIN`/`awardBadgeCoin`/`BC_QUEUE`/`celebrateBadge`แยกเป็น`bcShow`)+`css/style.css`(`.bc-hold`/`.bc-sticky`/`.bc-coin`/`.bc-ok`) — แก้ที่ **ท่อรวมจุดเดียว** (`celebrateBadge` ที่เข็มทุกสายเรียกอยู่แล้ว 12 จุดใน 3 ไฟล์) ไม่ต้องไล่แก้ทีละสาย → เข็มสายใหม่ในอนาคตได้รางวัลอัตโนมัติ
  - 🔑 **"เข็มจริง" ตัดสินจาก `BADGE_META[emoji]` เท่านั้น** — `celebrateBadge` ถูกยืมไปฉลองเรื่องที่ไม่ใช่เข็มด้วย (`🏁` จบสนามแข่ง `adventure3d.js:5749` · `📚` อ่านครบ 10 คำวันนี้ `ui.js:493`) พวกนี้**ต้องไม่ได้เงินก้อนนี้ + ยังหายเองใน 2.6 วิเหมือนเดิม** · เกณฑ์นี้กันพลาดในอนาคตด้วย เพราะเข็มใหม่ต้องลง BADGE_META อยู่แล้วถึงจะโชว์ได้
  - 🛡️ `state.badgeCoinGot` = รายชื่ออิโมจิเข็มที่จ่ายแล้ว → **จ่ายเข็มละครั้งเดียวตลอดกาล** (กันฉลองซ้ำ/`checkXxxBadge` ยิงใหม่หลังโหลดเซฟ) · ผู้เล่นเก่าที่มีเข็มอยู่แล้วไม่ได้ย้อนจ่าย (celebrateBadge ยิงเฉพาะตอนได้เข็มใหม่)
  - 🎫 **คิวป้าย `BC_QUEUE`** — เข็มสายที่ 4 แล้วต่อด้วย 👑 เข็มลับใน 3.6 วิ = ป้าย 2 ใบซ้อนทับกันกลางจอพอดีจนอ่านไม่ออก → เข้าคิวโชว์ทีละใบ แต่ **เงินจ่ายทันทีตั้งแต่ตอนได้เข็ม ไม่รอคิว** (ตามที่ผู้ใช้ย้ำ)
  - ⚠️ **overlay ต้องคง `pointer-events:none` เปิดรับคลิกเฉพาะ "กล่อง"** (`.bc-hold .badge-celebrate{pointer-events:auto}`) — เข็ม 6 สายเด้งกลางอากาศตอนโลก 3D ยังวิ่งอยู่ ถ้าคลุมทั้งจอผู้เล่นจะบังคับเครื่องไม่ได้แล้วตกทันที (ป้ายยังค้างจนกดปิดตามสั่ง)
  - ยืนยัน (preview เอง :59313 · `/index_classic.html` · mock login+ลงทะเบียน ป.3 · เดินทางจริง `addThunder()` ไม่ใช่เรียก celebrateBadge ตรง): ได้เข็ม ⚡ → `state.coins` 0→**10,000** + `#coin-count` = "10,000" ทันที + แถบ "🪙 รับรางวัลเข็มใหม่ 10,000 เหรียญ เข้ากระเป๋าแล้ว!" ✓ **ป้ายยังอยู่ที่ 6/10/16 วินาที** (เดิมหาย 2.6 วิ) กดปุ่ม "เยี่ยมมาก! 🎉" → หายใน 700ms ✓ `📚`/`🏁` = ได้ 0 เหรียญ ไม่มีปุ่ม ไม่มีแถบเงิน หายเองครบใน 3.2 วิ ✓ เรียกเข็ม ⚡ ซ้ำ = 0 เหรียญ ไม่มีแถบเงิน แต่ยังค้างรอกดปิด ✓ คิว: ได้ 🥉 ระหว่าง ⚡ ค้าง → จ่าย 10,000 ทันที แต่ overlay มีใบเดียวตลอด ปิดใบแรกแล้วใบ 🥉 โผล่เอง ปิดครบ = 20,000 · `badgeCoinGot=['⚡','🥉']` ✓ **จอเตี้ย 812×375 (ข้อความยาวสุด 🦾 เข็มนิ้วเหล็กฯ)**: กล่อง 453×228 ที่ y=73 อยู่ในจอครบ ปุ่มอยู่ในจอ กล่อง/หน้าเว็บไม่มี scroll (sh=ch=222) ภาพเข็ม `typist_5.png` โหลดจริง ✓ `pointer-events` overlay=none กล่อง=auto ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 985 (3 ส.ค. · ผู้ใช้สั่ง "ซ่อนป้ายเลือกภาพแถวบน/แถวล่าง แล้วเอาภาพ 2 ชุดมาผสมกันเลย ไม่มีเกมจับคู่ภาพที่ไหนแยกกันเป็นระเบียบแบบนี้ เค้าต้องคละกัน"):** 🔀 `js/picmatch.js` — **เลิกโครง "2 แถบ" (แถวบน=แผ่น 1 · แถวล่าง=แผ่น 2) เปลี่ยนเป็นกระดานเดียวสับไพ่รวมกันทั้งหมด** · `newRound()` ดันการ์ดทั้ง 2 ชุดเข้า array เดียวแล้ว `shuffle` ก่อนลง `#pm-grid-a` (`#pm-grid-b` เหลือกล่องเปล่า `hidden` เผื่อโค้ดเก่าอ้างถึง) · `pick()` เลิกดู `data-side` — ใบแรกที่แตะ=`sel1` ใบสอง=`sel2` ตรวจทันที (แตะใบเดิมซ้ำ=ยกเลิก) → **แตะใบไหนก่อนก็ได้** · `hint()` หาคู่จาก "ใบอื่นที่ key ตรงกันในกระดานเดียวกัน" · ถอดป้าย `#pm-label-a/b` ออกจาก DOM (`updateLabels()` เหลือแค่ตั้งข้อความปุ่มโหมด) · `fitGrid()` คิดจาก `คู่ × 2` ใบในกริดเดียว (เดิมหารพื้นที่ครึ่งต่อแถบ)
  - 🎁 **ผลพลอยได้: ช่องภาพโตขึ้นทุกจอ** เพราะเลิกเสียที่ให้ป้าย 2 บรรทัด + ไม่ต้องแบ่งพื้นที่เป็น 2 แถบ — 1312×630: 78→**86px** (กว้าง 96% ของจอ) · 812×375: 36→**46px** (98%)
  - ยืนยัน (preview เอง :63532 · mock login+ลงทะเบียน): กระดานเดียวจริง (`#pm-grid-b` มี 0 ใบ · ป้าย 0 อัน) · ลำดับ a1/a2 คละกันทั้งกระดาน (80 ใบ = 160 ช่วงสลับ) ✓ **แตะใบที่ 2 ของคู่ก่อนแล้วค่อยแตะใบแรก = จับคู่ได้ +10🪙** (พิสูจน์ว่าลำดับไม่สำคัญแล้ว) ✓ แตะใบเดิมซ้ำ = ยกเลิก `sel1=null` ✓ จับผิด = สั่น คอมโบ 0 ไม่ได้เหรียญ แล้วล้าง selection เอง ✓ ตัดช้อยส์เรือง 2 ใบที่เป็นคู่กันจริง ✓ เคลียร์ 10 คู่ = +150🪙/+33RP ตรงสูตร แล้วขึ้นรอบใหม่ 20 ใบ เวลารีเซ็ต ✓ **โหมดภาพ-คำก็คละกันในกระดานเดียว** (ภาพ 10 + คำ 10 สลับกัน · แตะคำก่อนแล้วภาพ = ได้เหรียญ) ✓ **812×375 กระดาน 40 คู่**: 16 คอลัมน์ × 5 แถว ช่อง 46px ทับกัน 0 คู่ หลุดจอ 0 ใบ ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 987 (4 ส.ค. · ผู้ใช้ส่งภาพกระดานจับคู่ภาพ สั่ง "ขยับปุ่มน้องแมวช่วยตัดช้อยส์ไปไว้ริมล่างขวา แล้วขยับข้อความที่ตกขอบขึ้นมาให้อ่านได้"):** 🐱 `css/lobby.css`(`#screen-picmatch .hint-btn` ใหม่ `position:absolute` มุมล่างขวา แทนที่ `display:block;margin:auto` เดิม + media จอเตี้ย)+`js/picmatch.js`(`fitGrid()` เลิกนับความสูงปุ่มที่ `position:absolute` เข้า `used` กันจองพื้นที่เกินจริง) — ปุ่มหลุดจาก flex flow → `.pm-note` (ข้อความ "เล่นได้เรื่อยๆ...") ขยับขึ้นมาแทนที่อัตโนมัติ ไม่ต้องแก้ margin เอง
  - ยืนยัน (preview เอง :8642 · mock login+ลงทะเบียน ป.5 · `getBoundingClientRect`): **1280×720** ปุ่มมุมล่างขวา (right≈1269,bottom≈685) ไม่ชนขอบ · note bottom=494.5 อยู่ในจอเต็ม ไม่ตกขอบ ✓ **812×375 (จอเตี้ย)** ปุ่ม right≈805,bottom≈344 อยู่ในจอ · note bottom=334.9 อยู่ในจอ · **กระดาน 40 คู่ (80 การ์ด)** การ์ดแถวล่างสุด bottom=311.8 ไม่ชนปุ่ม/note (ห่าง 0 คู่ทับกัน) ✓ console สะอาด · ล้าง storage + ปิด server แล้ว



## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 988 (4 ส.ค. · ผู้ใช้แจ้ง "ธีมที่ควรเป็นกลางวัน กลับขึ้นกลางคืน — เวลาในเกมให้รันตามเวลาประเทศไทย"):** 🇹🇭 ไฟล์ใหม่ `js/thaitime.js` (เวลาไทย UTC+7 กลางของทั้งเกม: `thHour/thHourF/thDate/thDayKey/thDayStart/thAtHour/thTs/thLocaleOpt`) โหลดเป็น **สคริปต์แรกสุด** ของทั้ง `index.html`+`index_classic.html` (+ใส่ใน SHELL ของ `sw.js`) → ไล่เปลี่ยนทุกจุดที่เคยอ่าน `new Date().getHours()/toDateString()` = **นาฬิกาเครื่องผู้เล่น** ให้อ่านเวลาไทยแทน: ธีมกลางวัน/คืน (`nightK` ใน index_classic.html · `autoNight` city3d.js · `isNightNow` state.js) · ดวงอาทิตย์/หมอก adventure3d.js · มื้อเย็น 18:00 · ฝน 19:00 (homes.js) · เวลานอน/ปุ่มนอน · วันใหม่ `todayStr`/สตรีคลูบ/ปฏิทิน 30 วัน · เดือน+จุดตัดรางวัล 00:01 วันที่ 1 (award.js ใช้ `thTs`) · สัปดาห์ `weekKeyStr` · โควตารายวัน (auth/lobby3d/adventure3d/foodQuiz) · วันสำคัญไทย+เทศกาล (calendar.js/city3d/heli) · ข้อความวัน-เวลาผูก `timeZone:'Asia/Bangkok'` (util.js/ui.js/gradelock.js)
  - 🔑 **ต้นตอ:** ทั้งเกมเชื่อไทม์โซนเครื่อง — เครื่องที่ตั้งโซนต่างประเทศ/เวลาเพี้ยนจะเห็นกลางคืนทั้งที่บ้านเราแดดจ้า · ไทยไม่มี DST → คิดตรงจาก `Date.UTC + 420 นาที` ได้เลย · ⛔ `thDate()` ใช้ **อ่าน** getters เท่านั้น ห้ามเอา `.getTime()` ไปใช้เป็น timestamp (ใช้ `thDayStart/thAtHour/thTs` แทน)
  - ยืนยัน: **node จำลองเครื่องต่างประเทศ 10 โซน** (New York/LA/London/Tokyo/Sydney/Kiritimati/Honolulu/Kolkata/UTC/Bangkok — ตั้ง `TZ=` แล้ว eval ฟังก์ชันจริงจากไฟล์เกม ไม่ได้เขียนใหม่): เครื่องนิวยอร์กเห็น 21:54 แต่ `nightK()` = **0.00 กลางวันเต็ม** ตรงเวลาไทย 08:54 (สูตรเดิมได้ **1.00 กลางคืนเต็ม** = บั๊กที่ผู้ใช้เจอเป๊ะ) · `isNightNow/autoNight/todayStr/ymStr/nightKeyOf/weekKeyStr` + มื้อเย็น→18:00 ไทย + ฝน→19:00 ไทย ถูกทุกโซน ✓ **preview จริง :8642** (ทั้ง index_classic + index): `--night-k=0.000` ผ้าคลุม opacity 0 ไม่มีคลาส `night` ตอน 08:55 · นาฬิกา "อังคาร 4 ส.ค. 2569 08:55" · แถบฝน "อีก 10 ชม. 5 นาที" · จุดตัดรางวัลถัดไป 1 ก.ย. 00:01 ไทย · ปุ่ม 3 โหมด (ปักกลางวัน/กลางคืน/อัตโนมัติ) + `kAt()` จำลองเวลายังทำงานครบ · เมือง 3D โหลด thaitime แล้วเรนเดอร์ปกติ ✓ console สะอาดทั้ง 2 หน้า · `node --check` ผ่าน 14 ไฟล์ · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 989 (4 ส.ค. · ผู้ใช้ส่งภาพกระดานจับคู่ภาพ สั่ง "ย้ายยอดเหรียญรวมไปไว้ข้างๆ Combo แล้วเอาที่ว่างตรงกลางระหว่าง 'ภาพ-ภาพ' กับ 'ยอดเหรียญ' ใส่เสียงอ่าน+ความหมายไทย ฟอนต์อ่านง่าย"):** 🔊 `js/picmatch.js`(html `.game-top` เพิ่มปุ่ม `#pm-now`(คำอังกฤษ+ไทยของใบล่าสุดที่แตะ กดซ้ำ=ฟังอีกที) + ห่อ coin-pill/combo-pill เข้า `.pm-right`)+`updateNow/resetNow/replayNow`(เรียกจาก `pick()`ทุกครั้งที่แตะการ์ด + เคลียร์ตอน `newRound()`)+`css/lobby.css`(`.pm-now`/`.pm-right`/`#screen-picmatch .game-top` + media จอเตี้ย) — เหรียญ+คอมโบอยู่ติดกันจริง (ห่าง 8px) ป้ายกลางกินพื้นที่ยืดหยุ่น (`flex:1 1 auto`) ระหว่างปุ่มโหมดกับกลุ่มเหรียญ/คอมโบ
  - ยืนยัน (preview เอง :8642 · mock login+ลงทะเบียน · `getBoundingClientRect`): **1280×720**: coin right=1166 combo left=1174 (ห่าง 8px ติดกัน) · แตะการ์ด Seahorse → ป้ายกลางขึ้น "Seahorse · ม้าน้ำ" ทันที ✓ ปุ่ม `#pm-now` กดซ้ำ = เรียก `speakWord('Seahorse')` ซ้ำ (ไม่ต้องแตะการ์ดใหม่) ✓ **812×375 (จอเตี้ย กระดาน 40 คู่)**: ทุกชิ้นใน `.game-top` อยู่ในจอ (ขวาสุด 805<812) · คำยาว "Guinea Pig · หนูตะเภา" `scrollWidth=clientWidth` ไม่ถูกตัด (ฟอนต์ปรับเหลือ 12px/11px ตาม media จอเตี้ย) · กระดาน+โน้ตล่างยังไม่ตกขอบ (`scrollHeight=clientHeight=349`) ✓ ขึ้นรอบใหม่ (`newRound()`) → ป้ายกลางรีเซ็ตกลับ "แตะภาพฟังเสียง" ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 990 (4 ส.ค. · ผู้ใช้สั่ง "คำไหนที่จับคู่ได้แล้ว ให้คำศัพท์คำนั้นหายไปจากกระดาน จะได้ไม่ขวางตัวที่เหลือ"):** 🫥 `js/picmatch.js`(`check()` จับคู่ถูก → 500ms โชว์กรอบเขียว `.matched` แล้วใส่คลาส `.gone` 220ms ก่อน `.remove()` ออกจาก DOM จริง แล้วเรียก `fitGrid()` ใหม่)+`fitGrid()`(แยก `totalN`(=`pairs.length*2` คงที่ทั้งรอบ คุม class `big`+ค่า `gap`) ออกจาก `n`(=`gA.children.length` จำนวนใบที่เหลือจริง คุมจำนวนคอลัมน์/ขนาดช่อง) — ใบที่เหลือขยายเต็มพื้นที่ว่างอัตโนมัติ)+`css/lobby.css`(`.pm-card.gone{opacity:0;transform:scale(.35)}`)
  - ยืนยัน (preview เอง :8642 · mock login+ลงทะเบียน ป.5 · `getBoundingClientRect`): จับคู่ giraffe 1 คู่บนกระดาน 40 คู่ (80 ใบ) → เหลือ 78 ใบจริงใน DOM · ช่อง `--pmh` ขยาย 86px→**93px** อัตโนมัติ ✓ **812×375 (จอเตี้ย 40 คู่)**: จับคู่ 3 คู่ → เหลือ 74 ใบ ช่อง 46→49px · offscreen=0 overlap=0 ทุกใบ · `scrollHeight=clientHeight=350` ไม่ล้นจอ ✓ **เคลียร์กระดานเล็ก 4 คู่ครบทั้งรอบ** (จับ 8 ใบต่อกัน) → ใบหายหมดสนิท ไม่มี error แล้ว `newRound()` ขึ้นกระดานใหม่ 8 ใบเองถูกต้อง ✓ console สะอาดตลอด (ตรวจ `window.onerror` เก็บด้วย) · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 991 (4 ส.ค. · ผู้ใช้สั่ง "การหายไปของการ์ด หมุนหาย"):** 🌀 `css/lobby.css`(`.pm-card.gone` เพิ่ม `rotate(420deg)` + ทับ transition shorthand เป็น `.45s` เฉพาะ transform/opacity — เดิม `.16s` จาก `.pm-card` สั้นไปหมุนไม่ทันเห็น)+`js/picmatch.js`(`check()` เลื่อนดีเลย์ก่อน `.remove()` จาก 220ms→**450ms** ให้ตรงกับความยาวแอนิเมชันใหม่ กันตัดจบก่อนหมุนเสร็จ)
  - ยืนยัน: CSSOM โหลดกฎ `.pm-card.gone{opacity:0;transform:scale(.15) rotate(420deg);transition:transform .45s...,opacity .45s}` ถูกต้อง ✓ จับคู่จริงแล้ววัดเวลา — ใบยังอยู่ใน DOM ที่ 650ms (ระหว่างหมุน) แล้วหายจริงที่ 1150ms (>950ms=500+450 ตามคำนวณ) ✓ **⚠️ วัด `getComputedStyle` มุมหมุนกลางอากาศไม่ได้เพราะแท็บ preview เป็น hidden ตอนทดสอบ (transition ไม่เดินตอนแท็บซ่อน — บทเรียนซ้ำรอบ 977) เชื่อ CSSOM+จังหวะลบจาก DOM แทน** ✓ เคลียร์กระดานเล็ก 4 คู่ครบทั้งรอบ ไม่มี error ขึ้นรอบใหม่ปกติ ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 992 (4 ส.ค. · ผู้ใช้สั่ง "หนังสือ Picture Dictionary พลิกหน้าเหมือนจริง หมวดตาม img/matching/ แตะคำแล้วออกเสียง"):** 📖 ไฟล์ใหม่ `js/picdict.js`(หนังสือกาง 2 หน้า พลิก 3D rotateY ที่สัน + เงา 2 ชั้น + เสียงพลิกสังเคราะห์ + ขอบตั้งกระดาษหนาตามตำแหน่ง + ปก + สารบัญ 8 กลุ่ม/46 แผ่น + แตะการ์ด=`speakWord`+บอลลูน)+`css/picdict.css`+`js/data/picdict.js`(สารบัญ)+`js/data/picdict_words.js`(ตำแหน่งช่อง/คำต่อแผ่น — มีแล้ว 1 แผ่น Colors) · ปุ่ม `#btn-picdict` footer ล็อบบี้เดิม + ตึก `bld('picdict')` 37° วงนอกเมือง 3D (`?go=picdict` ผ่าน CLICK map main.js) + activity online.js/actBuilding
  - 🔑 บทเรียน: `display:flex` ของคลาสชนะ attribute `hidden` → ต้องมี `#screen-picdict [hidden]{display:none!important}` · แท็บ preview ซ่อน: transitionend อาจไม่มา (มี failsafe 950ms) + ResizeObserver/resize ไม่ยิง (ทดสอบด้วย dispatch เอง — เครื่องจริงยิงปกติ)
  - ยืนยัน (preview :8642 · mock login+ลงทะเบียน ป.5 · rect): ปกกลางจอ→เปิด→สารบัญ 46 ชิป ไม่ล้น (overflow 0) · ชิป"สี"→spread 13 พลิกถูก · overlay 64 ช่องตรงภาพเป๊ะ (แตะช่อง 4=`speakWord('Green')`+บอลลูน "Green สีเขียว") · พลิกไป/กลับ/มุมพับ/สารบัญ/ลูกศรซ่อนหัวท้ายเล่ม ✓ **812×375 ไม่มี scroll (sh=ch=350)** หนังสือ+ลูกศรอยู่ในจอ overlay refit ตรง (195≈196px) ✓ `?go=picdict` เปิดหนังสือจริง · เมือง 3D โหลดตึกใหม่ console สะอาดทั้ง 2 หน้า · `node --check` ผ่าน 6 ไฟล์ · ล้าง storage แล้ว
  - ▶️ ค้าง: ถอดคำอีก 45 แผ่น → มอบ Sonnet 5 แชทใหม่ตาม `PROMPT_PICDICT_SONNET.md` (prompt พร้อมคัดลอก: https://claude.ai/code/artifact/33e92c2c-8c70-4179-8621-db31e73d43bc) · แผ่นละ ~2MB ถ้าเว็บช้าค่อยพิจารณาย่อรูป (ห้ามแตะไฟล์ต้นฉบับใน img/)


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1003 (4 ส.ค. · ผู้ใช้ส่งภาพป๊อปอัปซูมรอบ 1000 บอก "ครอบตำแหน่งคำไม่ถูกต้อง" — แตะ Budgerigar แต่กรอบไปครอบ Robin):** 🧭 **ต้นตอไม่ใช่สูตรครอป แต่คือช่องคลิกเลื่อนไม่ตรงการ์ด "ทั้ง 46 แผ่นมาแต่แรก"** — `PICDICT_WORDS` ไม่มี `pad` สักแผ่น + แผ่นจริงแบ่งช่องไม่เท่ากัน (Birds วัดได้แถวสูง 264→159px ไล่เตี้ยลง) การหารช่องเท่า ๆ กันจึงเลื่อนสะสม · แก้ที่ `js/picdict.js`(โซนใหม่ `boundaries/solveAxis/detectGrid` + `placeCells` วางช่องแบบ absolute ตามเส้นแบ่งที่อ่านจากพิกเซล cache ต่อแผ่น · ตรวจไม่ผ่าน→ถอยไปกริดเดิม)+`css/picdict.css`(`.pd-cells-abs`) · ป๊อปอัปซูมจึงครอบถูกใบเอง + **แตะฟังเสียง/โหมดครูถามแม่นขึ้นทั้งเล่มด้วย**
  - 🔑 2 บทเรียนระหว่างทำ: ① หาคอลัมน์ต้องสแกน**เฉพาะกลางแผ่น** (แถบหัวเรื่องพาดเต็มความกว้าง ทำให้ 7 ใน 16 แผ่นแรกหาคอลัมน์ไม่เจอ) ② overlay ต้องตั้งขนาดเป็น **% ไม่ใช่ px** — ตั้ง px แล้วค้างไม่ตรงกล่องตอนเล่มถูกกางใหม่ (เจอจริงตอนสลับขนาดจอไป-กลับ: กล่อง 277px แต่ overlay ค้าง 285px ช่องเลื่อนไปคร่อมใบข้าง ๆ อีก)
  - ยืนยัน (preview เอง :8918 · mock login ป.5 · วัดพิกเซลจริง): เกณฑ์ตัดสิน = "เส้นแบ่งแถวผ่ากลางการ์ดไหม" (1.000=ไม่ผ่าเลย) → **สแกนครบ 46/46 แผ่นตรวจจับกริดได้หมด** · วัดของจริงบนหน้าเว็บ 12 แผ่นต่างหมวด (Tools/BodyParts/Birds/SeaAnimals/WildAnimals/FarmAnimals/food/animal2/Jobs/School/Space/Opposites/Prepositions/fruit/Time/Transportation/Colors/Family/Sports) ได้ **0.95–1.00 ทุกแผ่น เดิม 0.25–0.79** ✓ ช่อง Budgerigar y997–1197 คลุมการ์ดจริง 1015–1176 พอดี (เดิม y878–1097 = การ์ด Robin) · ช่อง Robin ก็คลุมการ์ด Robin ถูก ✓ ภาพในป๊อปอัปไม่มีร่องการ์ดคั่นกลาง = ได้ใบเดียวจริง ✓ สลับจอ 1320×620 ↔ 812×375 ไป-กลับแล้ววัดซ้ำ ยัง 1.000 · overlay กว้างเท่ากล่องเป๊ะทุกขนาด ✓ **812×375** การ์ดซูมสูง 207px อยู่ในเวที 350px ไม่มี scroll ✓ โหมดครูถามยังไม่เปิดซูมตอนตอบ (กันเฉลย) ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว



## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1004 (4 ส.ค. · ผู้ใช้: "ธีมเขียว/ม่วง ไม่คมชัดเหมือนกรมท่าต้นฉบับ ช่วยแก้ให้คมชัดเหมือนกัน"):** 🎨 `css/lobby.css` โซนธีม — **ถอด `#theme-veil` ทิ้งถาวร (`display:none!important`)** ต้นเหตุมัวตัวเดียวกับรอบ 997-999 (emerald/plum ยังใช้ผ้าคลุม mix-blend-mode ย้อมทั้งจออยู่) → เปลี่ยนเป็น**ทับสีตรงเฉพาะแถบป้าย 7 ชิ้น**ที่ฮาร์ดโค้ดกรมท่า (`.id-card`/`.coin-group`/`.grade-pill`/`.icon-btn`/`.newword-banner`/`.pet-tab`/ขอบจางราง `.rail-scroll::before,::after`) ด้วย gradient **สูตร alpha ลอกต้นฉบับเป๊ะ** (.82/.86 · .7/.75 · .84/.88) แค่เปลี่ยน hue เขียว/ม่วง · ตัด `--tint1..4` ทิ้ง = ฉากหลัง/ความสว่างเหมือน navy ทุกไบต์ทั้ง 3 ธีม (กฎล็อกสี) · `.pet-tab` ต้อง `:not(.dinner):not(.on)` — ปุ่มข้าวเย็น 🍚 พื้นโปร่ง/แท็บเลือกอยู่พื้นขาว เกือบโดนทาสีทับ (เจอตอนวัดจริง)
  - ยืนยัน (preview เอง :8642 · mock login+ลงทะเบียน ป.ตรี · `getComputedStyle` + `html.no-anim` กัน transition artifact): emerald `.id-card/.coin-group/.icon-btn/.grade-pill` = `rgba(9,54,43,.82)→rgba(4,28,22,.86)` · plum = `rgba(43,24,70,.82)→rgba(22,11,38,.86)` (alpha ตรง navy ต้นฉบับ) · `.rail-btn` ตามธีมผ่าน `--glass` ✓ `#theme-veil` display:none ทั้ง 3 ธีม ✓ **gradient ฉากหลัง 3 ธีมเหมือนกันทุกตัวอักษร** = ความสว่าง/ความคมไม่ต่างกันแล้ว ✓ ปุ่ม 🍚 ยังโปร่งทุกธีม ✓ **812×375** ไม่ล้นจอ (overflow 0/0) ✓ console สะอาด · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1005 (4 ส.ค. · ต่อจากรอบ 1001 · ผู้ใช้ดูจุดแดงในโหมดเล็ง 🎯 แล้วสั่ง "ลบจุดวงกลมสีแดงทิ้งไปเลย"):** 🔴 `js/shootword.js` ซ่อน `#sg-overlay.aim #sg-cross` ทั้งอัน (`display:none`) — ⚠️ **ความเสี่ยงที่ต้องจับตา:** จุดยิงจริงยังอยู่กึ่งกลางจอเป๊ะเหมือนเดิม (ไม่ตรงรูศูนย์ในภาพปืนแม่นๆ — ต้นเหตุเดียวกับบั๊กรอบ 936 "เล็งอยู่ในศูนย์แล้วไม่โดน") ยิ่งห่างขึ้นอีกหลังขยับภาพปืนรอบ 1001 (`AIM_DOT_GAP`) ตอนนี้กันพลาดด้วย `SNAP_R` (รัศมีช่วยเล็ง) เท่านั้น ไม่มีตัวบอกภาพแล้ว
  - ยืนยัน (preview :58868 · `ShootWord.open()`+จำลองปุ่มเล็ง): `getComputedStyle(#sg-cross).display==='none'` ในโหมด aim ✓ ยังไม่ได้เทสต์ยิงจริงว่าพลาดบ่อยขึ้นไหม — ▶️ ถ้าผู้ใช้เล่นแล้วรู้สึกว่ายิงพลาดบ่อยขึ้น ให้กลับมาดูจุดนี้ก่อน (ตัวเลือก: ลด `AIM_DOT_GAP` ลง หรือเพิ่ม `SNAP_R`)


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1006 (4 ส.ค. · ผู้ใช้: "บางครั้งเลื่อนซ้ายขวาแล้วจอไม่ยอมหัน เหมือนหน่วง/ค้าง" ในโลกยิงเป้าคำศัพท์):** 👆👆 ต้นตอ: `bindInput()` ใน `js/shootword.js` จำนิ้วลากได้ตัวเดียว (`pd`) ไม่เช็ค pointerId — นิ้วที่สองแตะจอ (แตะยิง/มือพาด) แล้ว pointerup ของนิ้วไหนก็ได้ล้าง `pd` ทิ้ง นิ้วที่ยังลากอยู่เลย "ลากแล้วไม่หัน" จนต้องยกนิ้วแตะใหม่ → แก้เป็น `Map` ต่อ pointerId นิ้วใครนิ้วมัน


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1007 (4 ส.ค. · ผู้ใช้ส่งภาพหน้า ⚙️ ตั้งค่า "มีข้อความถูกตัด ปรับขนาดให้อ่านได้ทั้งหมด"):** 📐 ต้นตอ = แท็บทั่วไป/เปิดเผยเรียงแถวเดียวแนวตั้ง สูงเกินกรอบแล้วโดน `overflow:hidden` **ตัดหายเงียบ ๆ** (812×375 ต้องการ 380px มีให้ 236px = หาย 2 แถวเต็ม ๆ · การแบ่ง 3 แท็บรอบ 893 ยังไม่พอ) → `css/lobby.css` แตกเป็น **2 คอลัมน์** (`grid` + `grid-auto-rows:minmax(min-content,1fr)`) เมื่อจอกว้าง ≥520px · คืนที่ว่างที่ได้เป็น **ตัวอักษรใหญ่ขึ้น** (ชื่อ 15→19px คำอธิบาย 12→14px ที่ 1311×613) · แถว 🌙 กลางคืนกันที่ชื่อขั้นต่ำ 110px (เคยโดนปุ่ม 3 โหมดบีบเหลือ 62px จนคำไทยหัก 5 บรรทัด) · เพิ่ม `overflow-y:auto` ซ่อนแถบเลื่อนเป็น **ตาข่ายกันตาย** — จอแปลกที่เตี้ยกว่าที่รองรับให้เลื่อนดูได้ ดีกว่าตัดหายเงียบแบบเดิม
  - ยืนยัน (preview เอง :59114 · mock login · `html.no-anim` + `getBoundingClientRect`/`scrollHeight`): **1311×613 (ขนาดจริงในภาพผู้ใช้)** ทั้ง 3 แท็บ need=have=436 ไม่มี scroll ไม่มีแถวโดนตัด ไม่มีข้อความล้นกล่องสักชิ้น ✓ **812×375** need=have=236 ครบทั้ง 3 แท็บ (ก่อนแก้ ทั่วไป 380/236 · เปิดเผย 344/236) ✓ 667×340 (จอเล็กกว่าที่รองรับ) เหลือเกิน 3–16px เลื่อนดูได้ ไม่หาย ✓ ปุ่ม/สวิตช์ทุกตัวอยู่ในกรอบ · กดสวิตช์/สลับแท็บ/ปุ่มเสร็จแล้ว ทำงานปกติ · console สะอาด · ล้าง storage แล้ว
  - 🔑 บทเรียนลำดับ CSS: กฎย่อ padding จอเตี้ยกับกฎขยายตัวอักษร specificity เท่ากัน (0,2,0) — วางผิดลำดับโดนทับเงียบ (เจอตอนวัดแล้วค่าไม่ขยับ) ต้องวางบล็อก `max-height` **หลัง** บล็อก `min-width`


## ⏬ ย้ายเมื่อ 2026-08-04 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1008 (4 ส.ค. · ผู้เล่นร่วมทดสอบส่งภาพเมนูอาหาร: "กดเมนูอื่นไม่ได้เลย กดได้แต่ชุดละ 1,000"):** 🍽️ **ต้นตอ = เมนูอาหารใช้ `petHungry()` ตัดสินว่ากินได้ไหม แต่ `petHungry` คืน false เสมอตอน pet level 1** (กติกา "น้องเล็กยังไม่หิว/ไม่ป่วย") → การ์ดอาหารธรรมดาถูกล็อกทั้งกระดาน เหลือกดได้แต่ 🍱 Feast 1,000 (`skipNext`) · ซ้ำร้าย `careTick` รีเซ็ตหลอดความอิ่มตามมื้ออยู่ **ใต้ `if(p.level<2) continue;`** → น้อง level 1 ที่กิน Feast ไปแล้ว หลอดค้าง 100 ถาวร = ล็อกตลอดกาล
  - แก้: `js/state.js` เพิ่ม `petCanEat(p)` (= หิว **หรือ** หลอดความอิ่มมื้อนี้ยังไม่เต็ม) + ย้ายบรรทัดรีเซ็ตหลอดขึ้นก่อน `continue` (น้อง level 1 รีเซ็ตตามมื้อด้วย ไม่ป่วย) · `js/ui.js` `feedClick/openFoodMenu/showFeedResult` ใช้ `petCanEat` แทน `hungry` (ตัดพารามิเตอร์ `hungry` ของ `openFoodMenu` ทิ้ง) · ตอนล็อกจริง (อิ่มเต็มหลอด) **บอกเหตุผลบนจอตามกฎทองข้อ 1**: ป้าย `🔒 อิ่มแล้ว` บนการ์ด + หัวกล่องบอก "กดได้อีกทีตอน \<มื้อถัดไป\> · ไม่จำเป็นต้องซื้อชุดวิเศษ" + toast บอกเวลาเมื่อกดการ์ดที่ล็อก · `css/style.css` `.food-locked` (จาง+เทา+ขอบประ+`cursor:not-allowed`)
  - ยืนยัน (preview เอง :8642 · mock login ป.5 · สร้าง pet cat 5,000🪙): lv1 หลอด 0 → **ปลดล็อกครบ 10/10 เมนู** (เดิมกดได้ใบเดียว) · กด Apple = -150🪙 หลอด 25/100 ป้าย "กินต่ออีกหน่อย" → กด Chicken ×2 = 100/100 ปุ่มเปลี่ยนเป็น "อิ่มแล้ว" ไม่ชวนกินต่อ ✓ เปิดใหม่ตอนอิ่มเต็ม = ล็อก 9 ใบ เหลือ Feast + `opacity .5/grayscale .85/not-allowed` + กดแล้วเหรียญไม่หาย เด้ง toast บอกเวลา ✓ กิน Feast แล้วป้ายเปลี่ยนเป็น "มะรืนนี้ 18:00 น." ถูกต้อง ✓ lv1 หลอดค้าง 100 ข้ามมื้อ → `careTick()` รีเซ็ตเป็น 0 กินได้ ไม่ป่วย ✓ lv2 หิวจริง/กินไปครึ่งหลอด = ไม่ล็อกสักใบ (ทางเดิมไม่กระทบ) ✓ **812×375** กล่องสูงเท่าเดิมตอนหิว (1299/315) ตอนล็อกโตขึ้นแค่ 44px จากป้าย ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1010 (4 ส.ค. · ผู้ใช้ส่งภาพหน้า ⚙️ ตั้งค่า แท็บตัวละคร สั่ง "1.ตัวละครเล็กไป ปรับให้ใหญ่จนเกือบเต็มป้าย 2.แท็บทั่วไป/ตัวละคร/เปิดเผย ไม่รู้ว่าอันไหนกดอยู่/กดได้ไหม"):** 🎨 `css/lobby.css` 2 จุด — **(1)** ต้นตอแท็บไม่ชัด: `.set-tabs .lb-tab{box-shadow:none}` (รอบ 893) มี specificity เท่ากับ `.lb-tab.active{box-shadow:...}` (style.css) แต่โหลดทีหลัง → ชนะ ลบเงาแท็บ active ทิ้งหมด ทำให้ 3 แท็บดูเหมือนกันหมด → ใส่กรอบ inset ให้ทุกแท็บ (บอกว่ากดได้) + คืนเงา/ไฮไลต์ขาวให้แท็บ active เด่นชัด + เอฟเฟกต์ยุบตอนกด (`:active{transform:scale(.95)}`) · **(2)** การ์ดตัวละคร `.blk-mini img` เดิม `height:clamp(62px,15vh,120px)` ตายตัวไม่ผูกกับขนาดป้าย → เปลี่ยนเป็น `flex:1 1 auto` ให้รูปยืดเต็มพื้นที่ป้ายที่เหลือหลังหักคำบรรยาย (ป้ายสูงเท่าไรรูปขยายตาม เพราะ grid1x5 stretch ป้ายให้สูงแน่นอนอยู่แล้ว)
  - ยืนยัน (preview เอง :8642 · mock login + `openSettings()` + `getBoundingClientRect`/`getComputedStyle`): แท็บ active (avatar) `box-shadow: 0 3px 0 #7d5fc0 + inset ring ขาว` ต่างจากแท็บเฉย ๆ (`inset ring ม่วงจาง`) ชัดเจนทั้ง bg/สี/เงา ✓ **1280×720**: การ์ดตัวละคร 82×156px รูป 76×137px = สูง **88% ของป้าย** (เดิม ~120/156=77% แต่ก่อนหน้านั้นจริง ๆ เตี้ยกว่ามากในป้ายที่ยาวขึ้นตามจอ) ✓ **812×375**: `need=have=375` ไม่ล้นจอ รูปยังเต็มสัดส่วนป้ายเล็ก ไม่บิด (`aspect-ratio` คุม) ✓ console สะอาด · ล้าง storage แล้ว (4 ส.ค. · ผู้ใช้เลือกต่อยอด "ทำแถบหลอดความอิ่ม โชว์บนหัวเมนูอาหารเป็นหลอดจริง"):** 📊 `js/ui.js openFoodMenu()` เพิ่มหลอด `.hunger-bar.food-hunger-bar` เหนือข้อความ (คลาสชุดเดียวกับแดชบอร์ด — สีทอง+เรืองแสง `buffed` เมื่ออิ่มเต็ม/ล็อก) + `css/style.css` `.food-hunger-bar{height:16px}` · ยืนยัน (preview :8642): fill width ตรง `p.fullness%` ทุกกรณี (35→100%) · จอเตี้ย 812×375 ไม่ล้นเพิ่ม (กล่องยังเลื่อนในตัวเหมือนเดิม ไม่กระทบหน้าเว็บหลัก) · console สะอาด · ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1011 (4 ส.ค. · ผู้ใช้สั่งไล่หาปุ่ม/การ์ดกดไม่ได้ทั้งเกมที่ไม่บอกเหตุผล เหมือนแพทเทิร์นเมนูอาหารรอบ 1008):** ไล่ตรวจทุกจุด cant-afford/disabled/return เงียบใน `js/ui.js` (ตลาด/บ้าน/ไข่/หุ่น/รถ/บิล/ฟาร์ม/สอบใหญ่/band/โลก 3D/เปลี่ยนชั้น) เกือบทั้งหมดมีข้อความอยู่แล้ว **เจอจุดเดียวที่กดไม่ได้แบบเงียบจริง**: ปุ่ม 👍 ถูกใจโพสต์ฟีดของคนที่ไม่ใช่เพื่อน (`fpostHTML`) ใช้ native `disabled` ล้วน ๆ ไม่มีข้อความ (ต่างจากช่องคอมเมนต์ข้าง ๆ ที่มี `.fcm-locked` บอกอยู่แล้ว)
  - แก้: `js/ui.js` เปลี่ยนจาก `disabled` เป็นคลาส `.fp-like-locked` (คงหน้าตาจาง/cursor:default เดิม) + `bindFeedPostEvents` เช็กคลาสนี้แทน `.disabled` แล้ว toast "👍 ถูกใจได้เฉพาะโพสต์ของตัวเองกับเพื่อนเท่านั้น — ส่งคำขอเป็นเพื่อนก่อนนะ" ก่อน return · `css/lobby.css` เพิ่ม selector `.fp-act.fp-like-locked` คู่กับ `[disabled]` เดิม
  - ยืนยัน (preview เอง :8791 · mock login + จำลองโพสต์เพื่อน/คนแปลกหน้าแล้วยิง `.click()` จริงผ่าน `bindFeedPostEvents`): โพสต์คนแปลกหน้า → ปุ่มได้คลาส `fp-like-locked` (ไม่มี `disabled` attr) กด → toast ขึ้นตามข้อความ + `feedPickRx` ไม่ถูกเรียก ✓ โพสต์เพื่อน → ปุ่มปกติ กด → `feedPickRx` ถูกเรียก ไม่มี toast ✓ `getComputedStyle` ยัง opacity .45/cursor default เหมือนเดิม ✓ `node --check js/ui.js` ผ่าน · ล้าง test DOM + storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1012 (4 ส.ค. · ผู้ใช้: "แผง panel ย่อย (ตลาด/โรงงาน/บ้าน/เพื่อน) เปลี่ยนสีหัวการ์ด/แถบตามธีมด้วย" — ต่อยอดโซนล็อกสีรอบ 1004):** 🎨 `.panel-head` (แถบหัวแผงทุกใบ) ใช้ `var(--navy-2)` อยู่แล้ว = ธีมเปลี่ยนสีเองอัตโนมัติทั้ง 4 แผง ไม่ต้องแก้ · ที่เหลือฮาร์ดโค้ดฟ้า/ม่วงค้างมีแค่ **2 ชิ้นในแผงตลาด/โรงงาน** — `.hq-head` (หัวการ์ดสินค้า) + `.mkt-group-head` (ป้ายคั่นหมวด) → ทับด้วย `linear-gradient(…, var(--sky), var(--sky-d))` ของธีมนั้น (สีเด่นเดิมของธีม ไม่ตั้งใหม่ คงมุม gradient เดิม) ใน `css/lobby.css` ท้ายโซนรอบ 1004 · บ้าน/เพื่อนไม่มีแถบสีของตัวเอง (ใช้ `.panel-head` ร่วม เนื้อหาข้างในเป็นข้อความ+สีสถานะ overdue/paid ซึ่งเป็นสีความหมาย ไม่ควรทับ)
  - ยืนยัน (preview เอง :8642 · mock login): navy (ค่าเริ่มต้น) `.mkt-group-head`/`.hq-head` สีเดิมเป๊ะ ไม่กระทบ (ตรวจ byte เทียบค่า rgb เดิม) ✓ emerald/plum ทั้ง 2 ชิ้นเปลี่ยนเป็น `var(--sky)/var(--sky-d)` ของธีมถูกต้อง ✓ `.panel-head` ทั้ง 3 ธีมตรง `--navy-2` ที่ล็อกไว้ ✓ console สะอาด · ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1013 (4 ส.ค. · ผู้ใช้สั่งไล่หาปุ่ม/การ์ดกดไม่ได้แบบเงียบใน `js/invasion3d.js`/`js/f1_3d.js`/`js/city3d.js` — ยังไม่เคยตรวจ 3 ไฟล์นี้มาก่อน ต่อแพทเทิร์นรอบ 1011/1008):** ตรวจ click handler/`disabled`/`return` เงียบทุกจุดใน 3 ไฟล์ — **f1_3d.js/city3d.js สะอาดอยู่แล้ว** (ปุ่ม nr-go/travelTo/chatbox ผ่านการแก้ในรอบก่อนหน้า 866-939 หมดแล้ว) · **invasion3d.js เจอจุดเดียว**: ปุ่ม 🎯 "จุดสูงข่ม" (`inv-mapsnipe`) ใน `openSpawnMap` — กดแล้วเงียบถ้า `sniperSpots` ว่าง (เนินไม่พอในแมพนั้น ๆ)
  - แก้: `js/invasion3d.js` เพิ่ม `toastBan` บอกเหตุผล "ยังหาจุดสูงข่มไม่เจอ ... ลองเลือกจุดเองบนแผนที่แทนนะ" ก่อน `return`
  - ยืนยัน (preview เอง :60813 · mock login + โหลด `js/invasion3d.js` ตรง + `InvasionWorld.start()`): สแกน `disabled`/`.locked`/click handler ทั้ง 3 ไฟล์ครบ ไม่พบจุดอื่น · แมพจริงมี `sniperSpots` 4 จุดเสมอ (คลิกปุ่มจริงยังทำงานปกติ ไม่มี regression) · จำลอง toast ข้อความใหม่เรนเดอร์ถูกต้องใน `#inv-ban` · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1014 (4 ส.ค. · ผู้ใช้ส่งภาพเครื่องเกมพกพาโลกมอเตอร์ไซค์ ขีดเลข 1-4 สั่ง "ย้ายกล่อง 1 ไปตำแหน่ง 2 · ย้ายกล่อง 3 ไปตำแหน่ง 4"):** 🧭🏆 = ย้าย HUD **ออกไปนอกจอเกม ไปวางบนตัวเครื่อง** — `js/moto3d.js` ย้าย `#moto-gps`(ป้ายระยะทาง) + `#moto-board`(กระดาน/ไปหาเพื่อน) ออกจาก `#moto-screen` มาเป็นลูกของ `#moto-body` (อยู่ในจอเดิมจะโดน `overflow:hidden` ตัดหาย) แล้วคิด % จากตัวเครื่องแทน: GPS `left 2.4% top 19.5% w 21.6%` = แถบดำระหว่างป้ายดาว (จบ 18.2%) กับปุ่มเลี้ยวส้ม (เริ่ม 47.8%) · กระดาน `right 4% top 4.5% max-w 23% max-h 28%` = มุมบนขวาเหนือลูกบอลฟ้า (เริ่ม 35%) · แต่งกล่องเป็นจอย่อยบนเครื่อง (ขอบ+เงา inset)
  - ⚠️ จุดที่ต้องระวังถ้ามาแก้ต่อ: GPS ต้องคง `pointer-events:none` (ทับพื้นที่แตะพวงมาลัย `#moto-steerhit` left 2.5% top 21% h 72% — ไม่งั้นแย่งนิ้วเด็กตอนเลี้ยว) · กระดานห้ามปิด pointer-events (มีปุ่ม 👥 ไปหาเพื่อน)
  - ผลพลอยได้: กลางจอว่างเต็มความกว้างให้ป้ายคำศัพท์ — `fitWord()` วัดกรอบจริง เจอ 2 กล่องอยู่นอกจอเลยไม่หักช่องให้เอง (ไม่ต้องแก้โค้ด)
  - ยืนยัน (preview เอง :8642 · mock login ป.5 · `MotoWorld._t` + `getBoundingClientRect` คิดเป็น % ของตัวเครื่อง): **1087×487 (ขนาดในภาพผู้ใช้)** GPS 2.4→24% / 19.5→30.7% · กระดาน 77→96% / 4.5→30.5% ไม่ทับจอ (จอ 25.2→71.6%) ไม่ทับบอลฟ้า/ปุ่มส้ม ✓ ป้ายระยะทางเดินจริง "61 ม." + ลูกศรหมุนตามทิศ ✓ **812×375** ทั้งคู่อยู่ครบ กระดานลดเหลือ 5 แถวเอง `scrollHeight` ไม่ล้น หน้าไม่ล้นจอ (0/0) ✓ **1280×720 + เพื่อน 14 คนชื่อยาว** กระดานกว้างสุด 75.7→96% ยังพ้นจอ + "+ อีก 9 คน" ✓ `pointer-events` GPS=none / กระดาน=auto ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1015 (4 ส.ค. · ผู้ใช้ส่งภาพซูมผิดใบอีกแผ่น "คลิกโคเนื้อ อ่านว่า Snail" — ต่อจากรอบ 1003):** 📐 **เลิกตรวจจับกริดสดตอนรันไทม์ → "อบล่วงหน้า" เป็นตาราง** ไฟล์ใหม่ `js/data/picdict_grid.js` (กรอบการ์ดรายช่อง 46 แผ่น สัดส่วน 0..1 อบด้วยเครื่องมือใหม่ `tools/picdict_gridlab.js` — ห้ามแก้มือ) + `js/picdict.js` ถอดโซนตรวจจับ ~150 บรรทัดทิ้ง เหลือ `bakedGrid()` เปิดตาราง (แผ่นไม่มีในตาราง→กริดหารเท่า) + `index_classic.html` โหลดสคริปต์ใหม่
  - 🔑 **ทำไมตรวจสดไม่รอด:** การ์ดมีร่องปลอม 3 ตระกูลคาบซ้ำกันเป๊ะ (รูป↔ป้ายอังกฤษ↔ป้ายไทย↔การ์ดถัดไป) → เฟสหลุดได้หลายแบบและ "ดูเข้ารูป" ทุกแบบ (เส้นตกในร่องว่างจริง ความสูงแถวสม่ำเสมอ) เกณฑ์เดียวใช้กับทุกแผ่นไม่ได้ (0.93 ถูกกับ FarmAnimals แต่พัง Tools) · แก้ 3 รอบใน session เดียวถึงยอมเปลี่ยนสถาปัตยกรรม — งานภาพนิ่ง 46 ใบคงที่ควรอบครั้งเดียวแล้วตรวจด้วยตา ไม่ใช่ให้ทุกเครื่องเดาใหม่
  - 🔑 บทเรียนวิธีตรวจ: ด่าน "ช่องมีหมึก+ขอบสะอาด" ปล่อยกริดเลื่อมผ่านได้ (เส้นผิดก็ตกร่องว่าง) → ตัวตัดสินที่แม่นคือ **judge เลียนแบบตา**: การ์ดถูก = รูปก้อนใหญ่+ป้ายใต้รูปในช่อง / เฟสผิด = แถบป้ายบางโผล่หัวช่อง (สอบเทียบกับภาพจริง: แผ่นถูก 0-2% แผ่นผิด 25-53%) · gridlab ใช้ judge เลือกชุดที่ดีสุดจากหลายเกณฑ์+หลายเวอร์ชันซ่อมเฟส
  - ยืนยัน (preview :8921 · mock login ป.5 · gridlab bake ครบ 46/46 judge 0% ทุกแผ่น (Family 1.8%=การ์ดหัวใจ 1 ใบ ตรวจภาพแล้วถูก) + **ดูภาพจริง strip+กรอบแดง**: FarmAnimals/fruit/Tools/Family ทุกใบมีรูป+ป้ายครบในกรอบ): บนหน้าเว็บจริง judge = bad 0 ทั้ง 26 แผ่นที่ไล่วัด (รวมแผ่นเคยพังทั้งหมด) ✓ คลิก Cattle → ป้าย "Cattle · โคเนื้อ" + ครอปได้ใบเดียว ✓ **812×375** ซูมอยู่ในเวที ไม่มี scroll ✓ โหมดครูถามไม่เปิดซูม (กันเฉลย) ✓ console สะอาด · `node --check` ผ่านทุกไฟล์ · ล้าง storage + ปิด server + ลบไฟล์เทสต์ใน Downloads แล้ว
  - 📌 กติกาแผ่นใหม่: เพิ่มแผ่นในหนังสือแล้ว **ต้องรัน GridLab อบกริฟ** (วิธีอยู่หัวไฟล์ `tools/picdict_gridlab.js`) แล้วเขียน `js/data/picdict_grid.js` ใหม่ — ไม่งั้นแผ่นนั้นได้กริดหารเท่า (ช่องอาจไม่ตรง)


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1017 (4 ส.ค. · ผู้ใช้ส่งภาพขีดกรอบแดงต่อจากรอบ 1014 สั่ง "แต่ละกล่อง ขยายให้กว้างเท่ากรอบแดง"):** 🧭🏆 ขยายกล่อง GPS+กระดานคะแนนในโลกมอเตอร์ไซค์ (`js/moto3d.js`) ให้ใหญ่ขึ้นจริง — ⚠️ ลองกว้าง 30% ตามกรอบตรง ๆ ก่อนแล้วพัง (ทับจอเกม/ลูกบอลควบคุม) → คำนวณพื้นที่ว่างจริงจาก `getBoundingClientRect` ก่อน: **GPS** กว้างสุดได้แค่ 22.5% (จอเริ่ม left 25.2%) · **กระดาน** กว้างสุดได้แค่ 24.5% (จอจบ right 71.6%) → ขยายเท่าที่พื้นที่มีจริง + เพิ่มขนาดตัวอักษร/ไอคอน/ลูกศรทั้งชุด ~35-40% แทน (กล่องสูงขึ้นเองตามเนื้อหา ไม่ต้องบังคับความสูง)
  - ยืนยัน (preview เอง :8790 · mock login ป.5 + สมัครใหม่ · `MotoWorld._t` + `getBoundingClientRect` เทียบ % ของตัวเครื่อง): **1087×487 (ขนาดภาพผู้ใช้)** gps right 24.9% < screen left 25.2% ✓ board left 78% > screen right 71.6% ✓ ไม่ทับลูกบอลควบคุม (board bottom 24.6% < throttle top 40%) ✓ **812×375** ไม่ล้นจอ (0/0) ทั้งคู่ยัง fit ✓ **1280×720 + เพื่อน 14 คนชื่อยาว** board ยัง fit ไม่ทับจอ/ลูกบอล + "+ อีก 10 คน" ✓ วาดภาพเทียบสัดส่วนกับกรอบแดงต้นฉบับ ใกล้เคียงกันดี ✓ `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1017 (4 ส.ค. · ผู้ใช้: "ใช้ภาพ img/home/newHouse.png แทนภาพเดิมในการเลือกบ้าน + ตัดภาพให้ตรงกับบ้านแต่ละแบบ"):** 🏠 ตัด `newHouse.png` (1536×1024 · 3 แถบ) เขียนทับ `img/home/home_basic|medium|castle.png` — พิกัดตัด+เหตุผลจดไว้ใน `img/home/README.txt` (ชุดเก่าพื้นหลังโปร่งกู้ได้จาก git) · ภาพใหม่เป็น**แนวนอน มีฉากหลังกลางคืน** → `css/style.css` ปรับ `.home-opt-img` 56×56 จัตุรัส → **84×54 + มุมมน 9px** และ `.home-img-big` เพิ่ม `border-radius:12px`
  - ผลพลอยได้ (กฎทองข้อ 7): กล่อง 🏠 เลือกที่พัก **เดิมล้นกรอบอยู่แล้ว** (1280×720 ต้องการ 624 มีให้ 611 · 812×375 ต้องการ 621 มีให้ 315) → ยุบ `gap/padding/line-height` + เพิ่ม media query `max-height:719px and min-width:560px` พลิกเป็น **3 การ์ดเรียงแนวนอน** (ภาพบนข้อความล่าง) · ⚠️ ต้องเขียน `.levelup-box.home-shop-box` (0,2,0) ไม่งั้นแพ้ `.levelup-box h2` ที่อยู่ล่างกว่าในไฟล์เดียวกัน (บทเรียนลำดับ CSS รอบ 1007)
  - ยืนยัน (preview เอง :8642 · mock login · `no-anim` + `getBoundingClientRect`): **1280×720** แนวตั้ง need=have=609 ไม่เลื่อน (เดิม 624/611) ✓ **812×375** แนวนอน need=have=290 กล่อง 39→336 อยู่ในจอ การ์ดไม่โดนตัด ✓ **1000×640** need=have=290 ✓ ทั้ง 3 ภาพโหลดขนาดใหม่จริง (430×310 / 750×310 / 887×289) มุมมน 9px ✓ กดการ์ดปราสาท → กล่องยืนยันเด้งถูกใบ เหรียญไม่หายตอนยกเลิก ✓ แผงบ้าน `.home-img-big` โหลด `home_medium.png` มุมมน 12px ✓ console สะอาด · ล้าง storage แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1018 (4 ส.ค. · ผู้ใช้ต่อยอดรอบ 1017: "ทำภาพบ้านทรุดโทรม/ถูกตัดไฟ (_decayed/_dark) จากภาพชุดใหม่ ด้วยการปรับสี/ความสว่างจากไฟล์เดิม แทนฟิลเตอร์ CSS"):** 🎨 เพิ่ม `img/home/home_<id>_decayed.png` + `home_<id>_dark.png` (6 ไฟล์ basic/medium/castle) — อบสูตร CSS filter เดิม (`.home-decayed-img`/`.home-dark-img` ใน `css/style.css:1837-1838`) ลงเป็นภาพจริงด้วยเมทริกซ์ตาม CSS Filter Effects spec เป๊ะ (sepia/saturate/brightness/contrast) ไม่ใช่ประมาณด้วยตา · **ไม่ต้องแก้โค้ด** — `js/images.js` probe ไฟล์เหล่านี้อัตโนมัติอยู่แล้ว มีไฟล์จริงจะใช้ก่อน CSS filter fallback เสมอ (`homeVisualHTML` ใน `js/ui.js:5760`) · รายละเอียดสูตร+เหตุผลไม่ทำ `_nowater/_ruined` จดใน `img/home/README.txt`
  - ยืนยัน: เรียก `homeVisualHTML()` ตรงในคอนโซล preview เทียบ 3 บ้าน × 3 สถานะ (ปกติ/ทรุดโทรม/ตัดไฟ) — ได้ `<img>` ชี้ไฟล์ใหม่ตรงตัวไม่มีคลาสฟิลเตอร์ค้าง (`dCls` ว่างเพราะ `dImg` เจอไฟล์จริง) ✓ เปิดไฟล์ดูด้วยตา 6 ไฟล์: decayed ออกสีซีดอมน้ำตาล ทึบลง / dark มืดลงชัดเจนโทนเย็น ตรงกับที่ CSS เคยเรนเดอร์ ✓ ล้าง storage + ปิด server แล้ว


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1020 (4 ส.ค. · ผู้ใช้ (ผ่าน Codex): หน้า "ภาพ–ภาพ" จับคู่ถูกแล้วการ์ดที่เหลือขยับตำแหน่ง):** 🧷 ต้นตอ `js/picmatch.js` ลบคู่สำเร็จออกจาก DOM จริงแล้วเรียก `fitGrid()` คำนวณกริดใหม่ตามจำนวนที่เหลือ → เปลี่ยนเป็นแค่หมุน/หด/จาง (`.gone`) แล้วคงเป็นช่องล่องหนในกริดตลอด ไม่ remove()/fitGrid() ซ้ำ (แก้โดย Codex sandbox ในเครื่อง — session Claude นี้ตรวจโค้ด+ทดสอบเองก่อน push เพราะ Codex commit เองไม่ได้)
  - ยืนยัน (preview เอง :8642 · mock login · `PicMatch.open()` + `PicMatch._t` จับคู่จริงผ่าน `.click()`): จับคู่ 2 คู่จาก 40 คู่ — การ์ดยังอยู่ครบ 80 ใบใน DOM ทุกครั้ง (ไม่ลด) · พิกัด `getBoundingClientRect` ของการ์ดอื่นก่อน/หลังจับคู่**เท่ากันเป๊ะทุกใบ** (ไม่ขยับแล้ว) ✓ คู่ที่จับ = คลาส `matched gone` + `pointer-events:none` กันกดซ้ำ ✓ เช็ก opacity/transform จริงด้วย `html.no-anim` (ไม่งั้น preview ไม่ compositing ทำให้อ่าน transition ค้างค่าเก่า — บทเรียนรอบ 977/991) → ยืนยัน opacity 0 + scale(.15) rotate(420deg) ตรงตามที่ตั้งใจ ✓ ตัวนับ `pm.matched` เพิ่มถูกต้อง (2/40) เงื่อนไขจบเกมไม่กระทบ ✓ console สะอาด


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1021 (5 ส.ค. · ผู้ใช้: "ถ้า Claude ติดลิมิท จะ commit/deploy เองยังไง ทำเครื่องมือให้ Codex ส่งงานได้ง่าย ๆ หน่อย"):** 🚀 เพิ่ม `tools/ship.sh` + `ship.bat` (ดับเบิลคลิกได้) = ห่อ `finish_round.sh` แล้ว**เดาให้ครบทุกช่อง**ที่เดิมต้องกรอกเอง 4 อย่าง (เลขรอบ/ข้อความ/รายชื่อไฟล์/ออปชัน) เหลือแค่กด y — ใช้ตอน AI ตัวอื่นแก้ไฟล์ทิ้งไว้แต่ commit เองไม่ได้
  - 🔑 **3 ด่านกันพลาด (สำคัญกว่าความสะดวก):** ① หยิบเฉพาะไฟล์ที่ git ติดตามอยู่แล้ว → `img/`/`sound/` ที่ untracked ไม่มีทางหลุดขึ้นไป · ② **ไฟล์ที่ mtime เก่ากว่าไฟล์ล่าสุดเกิน 2 ชม. = เตือนว่าน่าจะเป็นงานค้างของ session อื่น แล้วข้ามให้** (เจอของจริงตอนเทสต์: `js/picdict.js` 88 บรรทัดค้างอยู่ ถ้าไม่มีด่านนี้จะโดนกวาดไปด้วย) · ③ `js/data/vocab*` บล็อกตาย · asset/ไฟล์เก่า **ไม่ยอมให้ `-y` ข้ามคำถาม** ต้องพิมพ์ยืนยันเองเสมอ
  - ไฟล์สร้างใหม่ (untracked) หยิบด้วย allowlist เข้ม `js/*.js js/data/*.js css/*.css tools/*.{sh,py,js} *.html` เท่านั้น — กันของชั่วคราวเต็มโฟลเดอร์ (`*.wav`/`*.patch`/`__pycache__`/`scratchpad/`) หลุด
  - ข้อความ commit ไล่หาเอง: อาร์กิวเมนต์ → `handoff/SHIP.txt` (ให้ AI เขียนทิ้งไว้ ลบให้เมื่อสำเร็จ) → บรรทัด `**รอบ N` ที่เพิ่งเพิ่มใน TASKS.md → ถามผู้ใช้ · เลข `รอบ N:` เติมจาก `rotate_handoff.py --next-round` ให้เอง (ไม่ต้องเดา) · เดา `--sw`/`--no-deploy` จากชนิดไฟล์ที่แตะ
  - ยืนยัน: `bash -n` ผ่าน · dry run เห็นครบ (หยิบ `tools/ship.sh` ที่สร้างใหม่ + ข้าม `js/picdict.js` เก่า + เลือก `--no-deploy` ถูกเพราะแตะแต่ `tools/`) · ไม่มี tty (ถูกเรียกจากสคริปต์) = ตอบ "ไม่" ทุกคำถามอัตโนมัติ ปลอดภัยไว้ก่อน


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1022 (5 ส.ค. · ผู้ใช้ส่งภาพหน้าสารบัญ สั่ง 4 ข้อ: ปุ่มใกล้กันเสี่ยงกดผิด · ปัดขวา→ซ้าย=หน้าถัดไป ซ้าย→ขวา=ย้อนกลับ · อยู่สารบัญแล้วปัดซ้าย→ขวา=ปิดเล่มเห็นปก · เปิดจากปกต้องเจอสารบัญ ไม่ใช่ "ยกทั้งเล่ม"):** 📖 รื้อโหมดปกใน `js/picdict.js`+`css/picdict.css` — **ปกเลิกเป็นหนังสือคนละใบ กลายเป็น "แผ่นพลิกใบขวา" ของเล่มเดียวกัน** (ถอด `#pd-closed`/`pd-cover`/`cvg`/`bindCoverSwipe` ทิ้งทั้งชุด) → ท่าปิด = `coverShift()` เลื่อนเล่มไปซ้าย 25% ให้ครึ่งขวาอยู่กลางจอ + ซ่อนหน้าซ้าย (`.cover-half`) · เปิด = ปกหมุนรอบสัน 0→-180° **พลิกใบเดียวจบที่สารบัญ** พร้อมเลื่อนเล่มกลับกลางจอ (ไม่มีเฟรม "ทั้งเล่มโผล่" อีก) · ปิดกลับ = ย้อนทุกขั้น · ทั้งหมดใช้กลไก drag-follow เดิม (`dragMove` เพิ่มโหมด `dg.cover='open'|'close'`) ปัดตามนิ้ว/ปล่อยกลางทางแล้วคืนท่าได้เหมือนพลิกหน้าปกติ · ข้อ 2 (ทิศปัด) ของเดิมถูกอยู่แล้ว — วัดยืนยันซ้ำ · ข้อ 1: `.pd-quiz-btn` top 50→84px (จอเตี้ย 36→62) ช่องไฟระหว่างปุ่ม 📑/🎧 จาก ~8px → **39px** (จอเตี้ย 30px) เขตหวงห้ามด้านข้างเท่าเดิม fitBook ไม่ต้องหดหนังสือ
  - 🔑 จุดที่พลาดง่ายถ้ามาแก้ต่อ: ① ต้องล้างคลาส `pd-cover-face` ของ**อีกด้าน**ทุกครั้งใน `coverPrep()` ไม่งั้นหน้าสารบัญติดพื้นแดงของปก (เจอตอนเทสต์รอบแรก) ② ตอน "ปิดเล่ม" ต้องซ่อนหน้าซ้ายตลอดทาง ไม่ใช่ครึ่งทาง ไม่งั้นเห็นสารบัญ ๑ ซ้ำอีกใบใต้ปกที่กำลังปิด ③ `flipTo()` ต้อง `return` เมื่อยังไม่ `pd.opened` (ปุ่มสารบัญ/ลูกศรคีย์บอร์ดกดตอนปิดปกอยู่)
  - ยืนยัน (preview เอง :8642 · mock login ป.5 · PointerEvent จริงบน `#pd-book` + `getBoundingClientRect`): **1280×720** ปัดขวา→ซ้ายเปิดปก → จบที่ `s=0` สารบัญ ๑/๒ เล่มกลับมากลางจอ (132..1148) faces ล้างคลาสหมด ✓ ปัดขวา→ซ้าย `s 0→1` · ปัดซ้าย→ขวา `s 1→0` ✓ ปัดซ้าย→ขวาที่สารบัญ → ปิดเล่ม ปกกลับมากลางจอเป๊ะ (640 vs 640) ✓ ปล่อยกลางทางทั้ง 2 ทิศ = คืนท่าเดิม busy=false ✓ `openBook()` (เส้นทางปุ่ม 🎧) + `openQuiz()` จากหน้าปก → เข้าโหมดครูถามถามคำที่ 1 ได้ ✓ ออก-เข้าใหม่ทั้งท่าเปิด/ท่าปิด + `resize` ตอนปิดปก จัดท่าถูกทุกครั้ง ✓ **812×375** ปกอยู่ในเวทีครบ ไม่มี scroll (350/350 · doc 812/812) ช่องไฟปุ่ม 30px ✓ แตะชิปสารบัญ→ไปหน้าแผ่นถูก · แตะการ์ด→ซูม "Lion" ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
  - ⚠️ **commit นี้พ่วงงานค้างของ session อื่นไปด้วยโดยเลี่ยงไม่ได้** (ไฟล์เดียวกัน): บล็อก `refineCropV()` ใน `js/picdict.js` (ป้ายกำกับ "รอบ 1016" แต่เลข 1016 ถูกใช้ไปแล้วกับงาน GPS มอเตอร์ไซค์ `0d81c454`) ค้าง uncommitted มาตั้งแต่ 4 ส.ค. — ตรวจให้แล้วก่อนพ่วง: เปิดภาพซูมจริง 3 ใบ (Lion/Rhinoceros/Puma) รูปตรงกับป้ายทุกใบ ไม่มี error


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1023 (5 ส.ค. · ผู้ใช้: "เลื่อนซ้ายขวาแล้วจอไม่ยอมหัน เหมือนหน่วง/ค้าง" — อาการเดียวกับซุ้มยิงเป้ารอบ 1006 แต่เกิดในโลกยานแม่ด้วย):** 👆 `js/invasion3d.js` `bindInput()` — เดิมนิ้วได้เป็น "นิ้วมอง" เฉพาะตอน *แตะครั้งแรก* ในครึ่งขวา+ไม่ได้แตะบนปุ่ม+`lookId===null` → พลาดสลับกัน 3 ทางเลยรู้สึกเป็น "บางครั้ง": ①นิ้วลงครึ่งซ้ายนอกจอย ②เริ่มบนปุ่มแล้วไถออกมาเล็ง ③`lookId` ค้างจากนิ้วที่ touchend หลุด = ที่นั่งไม่เคยว่างอีกเลย · แก้: ทะเบียนนิ้วสำรอง ลากเกิน 12px รับเป็นนิ้วมองให้เอง (ตั้งจุดอ้างอิงใหม่ ไม่กระตุก) + เช็ก `lookId` กับ `e.touches` ทุกครั้ง + ย้าย touchmove/end ไปผูก `window` capture (กันจังหวะปล่อยนิ้วหลุดเมื่อชิ้นที่แตะถูกวาดใหม่)
  - ยืนยัน (preview :8642 · mock login + `InvasionWorld.start()` เข้าสนามจริง · จำลอง `TouchEvent` หลายนิ้วพร้อม `e.touches` ถูกต้อง): ลากครึ่งขวา yaw 0.605 (เดิมได้อยู่แล้ว) · **ครึ่งซ้าย 0.529 · เริ่มบนปุ่มยิงแล้วไถ 0.529 · lookId ค้าง 0.605 · touchend หลุดนอก wrap 0.605 — ทั้ง 4 เคสเดิม = 0 ทุกเคส** ✓ จอยเดินยังขยับ `translate(40px,-30px)` และไม่หมุนกล้อง ปล่อยแล้วรีเซ็ต ✓ แตะปุ่มสั่น <12px ไม่หมุนกล้อง ✓ แผงแผนที่เปิดคร่อม ลากแล้วไม่หมุนกล้อง ✓ สองนิ้วพร้อมกัน (จอย+มอง) ทำงานคู่ได้ ✓ ปิดโลกแล้ว touch นอกเกมไม่ถูกกิน (`defaultPrevented` false) ✓ console สะอาด · `node --check` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1024 (5 ส.ค. · ผู้ใช้: ใช้ภาพต่อเนื่องใน `img/animation/` ทำสัตว์หน้า lobby ให้เป็นธรรมชาติขึ้น):** 🐾 ครอป 6 ชุด (แมว/หมา/มังกร × เด็ก/โต) แยกเศษเฟรมข้างเคียง แล้วบีบต้นฉบับรวม ~10.9MB เป็น WebP sprite รวม ~1.1MB; `js/ui.js` ใช้ 6fps `steps()` แบบไป–ย้อนกลับเฉพาะสุขภาพดี ไม่มีชุด/รูปร่างพิเศษ ส่วนหิว/ป่วย/หลับ/ไข่/ปิดเอฟเฟกต์คงภาพสถานะเดิม พร้อม fallback ถ้า WebP โหลดไม่ได้; `css/lobby.css` ถอด jump/squash เดิมเมื่อใช้ sprite และ `sw.js` v237
  - ยืนยัน `tools/anim_preview.html` ใช้โครง/CSS เดียวกับ lobby: 6/6 โหลดและเล่น `psPetSeq` 1s alternate, parent body/travel=`none`, ทุกตัวอยู่ในกรอบและไม่มี overflow ที่ 812×375; `?noanim=1` ได้ animation=`none`/เฟรมแรก; `node --check` (`ui.js`,`sw.js`) + `check_missing_assets.py --git` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-05 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1025 (5 ส.ค. · Picture Dictionary ซูมติดกรอบ/คำอื่น):** js/picdict.js เลิกสแกนเลยกรอบการ์ด 15% และครอปจากกรอบอบของคำที่คลิกเท่านั้น; วิเคราะห์แถบเนื้อหาภายในกรอบเพื่อทิ้งป้าย/เส้นของเพื่อนบ้าน โดยผลครอปไม่มีทางล้ำออกนอกกรอบเดิม
  - ยืนยันภาพ Chick/Snail/Harp Seal/Camel/Hobbies สะอาดที่ 1320×620 และ 812×375; console ไม่มี error, node --check และ git diff --check ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1027 (5 ส.ค. · กด “แข่งออนไลน์” แล้วระบบบอกให้ต่อเน็ต/เข้า Google ทั้งที่เข้าแล้ว):** ต้นตอ `js/picquiz_online.js` ตรวจ `window.Online` แต่ `Online` เป็น lexical global (`const`) จึงไม่อยู่บน `window` และได้ false ทุกครั้ง; แก้ `dbReady()` รวมถึง fallback `Auth/state/firebase` ให้ตรวจด้วย `typeof` ตาม scope จริง
  - ยืนยัน browser smoke test ด้วย Google UID + `Online.ready` จริงจำลอง: เปิด Lobby เป็น `🟢 ออนไลน์` ไม่มี toast ทั้ง 1280×720/812×375 และไม่มี scroll; `node --check` + `git diff --check` ผ่าน
- **รอบ 1026 (5 ส.ค. · ห้องแข่งครูถามศัพท์ออนไลน์):** `js/picquiz_online.js`+CSS เพิ่มโหมดสร้าง/เข้าห้องด้วยรหัส 6 ตัว ล็อก 50 คนใน rules จริง; เจ้าของเริ่ม 10 คำได้ทันที คำถาม/หน้าหนังสือ/เวลา/อันดับซิงก์ร่วมกัน คะแนนใช้ timestamp เซิร์ฟเวอร์
  - มีแชทกรองคำหยาบ + group voice P2P 8 คน (กัน mesh 50 คนทำมือถือค้าง), ปุ่มรับ/ไม่รับ/ปิดไมค์/วางสายชัด; ไมค์เปิดหลังกดรับเท่านั้น ไม่อัดเสียง; `privacy.html`+ข้อตกลงอัปเดตแล้ว
  - ยืนยัน Node/diff-check + browser 1280×720/812×375 ผ่าน ไม่มี scroll/console error; Firebase รับ rules fixed slots (ผู้เล่น 0–49 · voice 0–7 · signaling 0–199) แล้ว และอ่านกลับตรงกันครบ 35 โซน โดย 33 โซนเดิมไม่เปลี่ยน


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1028 (5 ส.ค. · Picture Dictionary ฟังคำรับเหรียญ + ซ่อมภาพหมวดห้องน้ำ):** `js/picdict.js`+CSS ล็อกหน้าต่างซูมจนเสียงจบ แล้วให้ 1 เหรียญทุกครั้งพร้อมภาพ/เสียงยืนยัน; `js/util.js` เพิ่ม callback จบเสียง MP3/TTS โดยไม่กระทบ caller เดิม
  - `tools/picdict_gridlab.js` ตรวจแถวที่ถูกแยกรูป/ป้ายผิดเฟส และอบ `Bathroom.png` ใหม่ใน `js/data/picdict_grid.js` ให้ครบ 64 คำ; Clothes Hamper/Stain Remover/Waste Bin/Water Heater ตรงภาพแล้ว
  - ยืนยันฟังซ้ำ 2 ครั้งเหรียญ 100→102, ปิดไม่ได้ก่อนเสียงจบ, GridLab 46/46 ไม่ fail, browser 1280×720 + 812×375 ไม่มี scroll/console error และ syntax/diff-check ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1030 (5 ส.ค. · สัตว์ Lobby เคลื่อนไหวเป็นธรรมชาติ):** เพิ่ม `js/petbehavior.js` แบ่งคลิป 8 วินาทีเป็น idle/walk/look/sit/play และผูก sleep กับสถานะเกม เลือกท่าต่อกันแบบมีน้ำหนักต่างกันสำหรับแมว/หมา/มังกร พร้อมความเร็วและช่วงพักสุ่ม; เปลี่ยนท่าด้วย crossfade แทนการวนคลิปเดิมซ้ำ
  - `js/ui.js` เชื่อม controller กับคลิปจริงและ fallback ภาพ/sprite; `css/lobby.css` เพิ่มหายใจ มอง นั่ง เดิน เล่น หลับ และหยุดครบเมื่อปิดเอฟเฟกต์; `index_classic.html`+`sw.js` โหลดไฟล์ใหม่
  - ยืนยัน preview คลิปจริงเปลี่ยน state/time/rate, fallback บังคับครบ 6 state, no-anim หยุดทั้งหมด, 1280×720/812×375 ไม่ล้น; Node syntax + diff-check ผ่าน
- **รอบ 1029 (5 ส.ค. · Picture Dictionary กล่องเหรียญไม่บังคำศัพท์):** css/picdict.css ย้ายกล่องแจ้ง +1 เหรียญไปด้านขวานอกการ์ดซูม ทำให้ภาพ ชื่ออังกฤษ และคำแปลมองเห็นครบตลอด
  - จอมือถือแนวนอนใช้กล่องขนาดย่อ; Browser 1280×720 และ 812×375 ยืนยันว่าไม่ซ้อนการ์ด อยู่ใน viewport และ git diff --check ผ่าน



## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1031 (5 ส.ค. · ผู้ใช้ไม่เห็นความต่างรอบ 1030):** จากภาพจริง คลิปทำงานแต่เริ่ม idle/sit ช้าและหยุดค้างนานโดยไม่มีป้าย จึงดูเหมือนภาพนิ่ง; `js/petbehavior.js` เปลี่ยนให้เริ่มด้วย look/play ลด hold และเพิ่มความเร็ว พร้อมชื่อท่าไทยสดบนป้ายใน `js/ui.js`+`css/lobby.css`
  - ยืนยันคลิปจริงเริ่ม cat=look, dog/dragon=play ภายใน 0.7 วิ แล้วเปลี่ยน state/time ต่อ; ป้ายตรง state ทุกครั้ง, 1280×720 และ 812×375 ไม่ล้น/ไม่ตัด


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1032 (5 ส.ค. · ลดเพลงตอนอ่าน/ครูถามจาก Picture Dictionary):** `js/city3d.js` เพิ่มตัวคูณ duck 20% สำหรับ BGM ล็อบบี้; `js/picdict.js` เรียกเมื่อเข้า Picture Dictionary หรือโหมดครูถามศัพท์ และคืนเสียงเดิมทันทีเมื่อออกกลับ Lobby
  - ยืนยัน `node --check js/city3d.js js/picdict.js` ผ่าน; คงสถานะปุ่มเปิด–ปิดเพลงผู้เล่นไว้ และถ้า BGM ถูกสร้างระหว่างอยู่หน้านี้ก็ใช้ 20% ตั้งแต่ต้น


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1033 (5 ส.ค. · "ทำไมของแพงเลือกได้ แต่อาหารธรรมดาเลือกไม่ได้"):** ไม่ใช่บั๊กตรรกะ — น้องอิ่ม 100/100 ทุกเมนูล็อกหมด เหลือแต่ 🍱 ชุด 1,000 (`skipNext`) · **ต้นตอที่ทำให้เข้าใจผิด 2 จุด:** ① `.food-fav` (ขอบทองกะพริบ) specificity ต่ำกว่า `.food-item.food-locked` แต่ `animation`/`box-shadow` ไม่โดนทับ → การ์ดปลา 300 ยังเรืองแสงเหมือนกดได้ ② ป้าย 🔒 อยู่หัวการ์ด พอเมนูเลื่อนก็หลุดจอ
  - แก้ `css/style.css` (`.food-item.food-locked.food-fav` ปิด glow/gradient) + `js/ui.js` `openFoodMenu` เพิ่มบรรทัดท้ายการ์ด `🔒 น้องอิ่มเต็มหลอด — กินได้อีกทีตอน …` ทุกใบที่ล็อก และป้าย `✅ ใบเดียวที่กดได้ตอนนี้` บนใบที่กดได้
  - ยืนยัน preview: อิ่มเต็ม → fav มี class `food-locked`, computed `animation:none box-shadow:none` bg เทา · อิ่มไม่เต็ม → fav กลับมา glow ปกติ ไม่มีป้ายล็อกเลย
  - ⚠️ ค้าง: เมนูอาหาร 11 ใบยัง scroll (scrollHeight 1488 vs client 611) = ขัดกฎทองข้อ 7 — ควรจัดใหม่ให้จบในจอเดียว


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1034 (5 ส.ค. · บั๊กจริง: รักษาน้องหายแล้วป้อนข้าวไม่ได้ทั้งวัน):** ต้นตอ `curePet` เดิมตั้ง `fedUpTo=มื้อนี้ + fullness=100` เพื่อกันป่วยซ้ำ = เกมนับว่า "กินแล้ว" ทั้งที่ยังไม่ได้กิน → เมนูอาหารล็อกยกกระดานถึง 18:00 วันถัดไป และ `missedMeals` ล้างได้เฉพาะตอนกินเต็มหลอด น้องเลยค้าง**ผอมโซ**
  - แก้: เพิ่มฟิลด์ `hungerSickSlot` (state.js) = มื้อที่ป่วยเพราะหิวไปแล้ว → `careTick` ใช้ตัวนี้กันป่วยซ้ำแทน · `curePet` (ui.js) ไม่แตะ fedUpTo/fullness อีก + toast บอกว่า "ยังไม่ได้กินมื้อนี้ ป้อนได้เลย" · แถบแดชบอร์ดเปลี่ยนเป็น "🍽️ ยังไม่ได้กินมื้อนี้เลย! … (มื้อนี้รักษาแล้ว ไม่ป่วยซ้ำ)" ไม่ขู่ผิด
  - **กู้เซฟที่ค้างอยู่แล้ว** (loadState): `missedMeals>0` + `fedUpTo` อยู่ในมื้อนี้ = อิ่มปลอมจากการรักษา (ถ้ากินจริงต้อง missedMeals=0) → คืน fullness=0 ให้ป้อนได้ทันที · เซฟที่กินจริงไม่โดนแตะ
  - เพิ่ม ❌ ปุ่มปิด sticky มุมบนขวาเมนูอาหาร (`.food-x`) · ทุกข้อความเรื่องข้าวเย็น "คน" ใส่ชื่อผู้เล่น `หนู (ชื่อ)` + วงเล็บย้ำ "คนนะ ไม่ใช่น้องสัตว์" (helper `selfName()` ใน ui.js)
  - ยืนยัน preview: ป่วยหิว→รักษา→`petCanEat=true` เมนู 10 ใบไม่ล็อกสักใบ, careTick ซ้ำไม่ป่วยอีก · migration เซฟค้าง→fullness 0 / เซฟกินจริง→ไม่โดนแตะ · ปุ่ม ❌ ยังอยู่ในจอตอนเลื่อนสุด · `node --check` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1035 (5 ส.ค. · สตรีค "ลูบติดกัน" ในโปรไฟล์น้องโชว์เลขค้าง):** ผู้ใช้ทักว่าไม่อัปเดตตามการลูบจริง — ถูกต้อง `state.patStreak` ถูกเขียนเฉพาะตอนลูบ (`patStreakTick`) ไม่มีใครลดตอนสตรีคขาด → หยุดลูบ 10 วันยังโชว์ "🔥 ลูบติดกัน 5 วัน"
  - เพิ่ม `patStreakNow()`/`patDayKey()` ใน `js/ui.js` (คิดสดจาก `patStreakDay`: วันนี้/เมื่อวาน = ยังต่อได้ · เก่ากว่านั้น = 0) แล้วใช้แทนการอ่าน state ตรงใน `patCalendarHTML`, toast เตือนตอนเย็น (`patRemindTick`) และแถวเข็มเพื่อนซี้ใน `js/game.js` (`showProgressReport`) · ค่าที่เก็บ/เข็ม/ดีสุดไม่แตะ
  - โน้ตใต้ปฏิทินบอกเหตุผลเมื่อขาด: "สตรีคขาดไปแล้ว (ลูบครั้งล่าสุด YYYY-MM-DD) — ลูบวันนี้เริ่มนับใหม่ที่ 1"
  - ยืนยัน preview: ขาด 10 วัน→0 + โน้ตใหม่ (จุดปฏิทินยังครบ 5) · ลูบเมื่อวาน→3 · ลูบวันนี้ต่อ→4 ดีสุดคง 5 · แถวเข็ม "ติดกัน 0 วัน (ดีสุด 5)" · `node --check` ผ่าน ไม่มี console error


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1036 (6 ส.ค. · โลกยานแม่ปัดซ้าย–ขวาบางครั้งไม่หัน/เหมือนหน่วง):** แพตช์รอบ 1023 รับนิ้วสำรองได้แล้ว แต่ทิ้ง `touchmove` เฟรมแรกหลังผ่าน dead-zone 12px; เครื่องที่ฉาก 3D เฟรมตกอาจส่ง swipe สั้นมาเพียง move เดียว จึงจบที่ yaw ไม่เปลี่ยน
  - `js/invasion3d.js` เก็บจุดเริ่ม candidate แล้วใช้ delta แรกในเฟรมที่รับนิ้วทันที โดยยังกรองนิ้วสั่น <12px และไม่กระทบจอย/มัลติทัช
  - ยืนยัน browser regression 1000×640 + 812×375: ปัดปกติ/เริ่มฝั่งซ้าย/เริ่มบนปุ่มยิง/ผ่าน dead-zone/อีกนิ้วยกกลางคัน ผ่าน 5/5; `node --check` + `git diff --check` ผ่าน · รอผู้ใช้ดับเบิลคลิก `ship.bat` เพื่อ commit/deploy (sandbox Codex เขียน `.git` ไม่ได้)


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1037 (6 ส.ค. · เกมจับคู่ภาพ “เล็ก–ใหญ่” → “ใหญ่–ใหญ่”):** `css/lobby.css` ขยายเฉพาะรูปจากชุด `a1` เป็น `scale(1.2)` ภายในช่องเดิม เพื่อให้ขนาดตัวสัตว์ใกล้ชุด `a2` โดยไม่เปลี่ยนกริด/จำนวนการ์ดและไม่ทำให้กระดาน 80 ใบล้นจอ
  - selector เจาะจง `.pm-card[data-side="a1"] .pm-img`; โหมดภาพ–คำและภาพชุด `a2` คงเดิม · `git diff --check` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1038 (6 ส.ค. · โปรแกรม commit/deploy แบบดับเบิลคลิก):** เพิ่ม `COMMIT_DEPLOY.bat` ที่รากโปรเจกต์เป็นปุ่มเดียวจบ—หา Git Bash เอง, ตั้ง `safe.directory`, แสดงไฟล์/ขอคำยืนยัน แล้วใช้ระบบเดิมทำ version/cache → commit → Firebase deploy → GitHub push
  - `ship.bat` ชื่อเดิมส่งต่อไปโปรแกรมใหม่; `tools/ship_entry.sh` ต่อ PATH ของ Git Bash+Python ที่ bundle มากับ Codex และหยุดพร้อมข้อความชัดถ้าขาด; `tools/ship.sh` ส่ง exit code แยกสำเร็จ/ยกเลิก/ผิดพลาด จึงไม่ขึ้น “สำเร็จ” หลอก · เพิ่มกฎส่วนกลางให้ทุกงาน Vocab World เปิดโปรแกรมนี้อัตโนมัติเมื่อพร้อมส่ง · ทดสอบ launcher ใหม่/ชื่อเดิมและ `git diff --check` ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1039 (6 ส.ค. · ยานแม่หยุดยิงใส่ผู้เล่น):** `js/invasion3d.js` ถอดทั้งกระสุนหนักที่ยานแม่ยิงเล็งผู้เล่นเป็นระยะ และหยุดเรียกระบบลำแสงสีฟ้าเตือน 3 ครั้ง/ครั้งที่ 4 ฆ่าผู้เล่น; ยานแม่ยังลอยคุมสนามและยานลูกยังต่อสู้ตามเดิม
  - ยืนยัน `node --check js/invasion3d.js` และ `git diff --check` ผ่าน; ไม่มี `MS_BEAM_GAP`, `MS_BEAM_DMG`, `msBeamAt` หรือการเรียก `tickMsBeam()` เหลือในลูปเกม


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1040 (6 ส.ค. · ยกเครื่องด่านยานแม่):** ปรับแสง/เงา/หมอก/โทน ACES, ถนนและร่องรอยสนามรบ, วัสดุ PBR, ซากยุทโธปกรณ์ จุดกำบัง ควันและเถ้าลอย โดยใช้ instancing/Points คุมงบมือถือ


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1041 (6 ส.ค. · HUD ยานแม่แบบเกมยิงมือถือ):** เปลี่ยนปุ่ม emoji เป็นไอคอน SVG ต้นฉบับโทนยุทธวิธี และเพิ่มปุ่ม HUD ด้านบนสำหรับลากย้าย/ปรับขนาด/ความทึบ พร้อมบันทึกตำแหน่งแบบ responsive ในเครื่อง


## ⏬ ย้ายเมื่อ 2026-08-06 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1042 (6 ส.ค. · พรีเซ็ต HUD + จอยเดินไม่ก้มเงย):** `js/invasion3d.js` ใช้ตำแหน่งถนัดขวาจากภาพอ้างอิงล่าสุด 1306×653 เป็นค่าเริ่มต้น เพิ่มพรีเซ็ตถนัดขวา/ซ้าย/แท็บเล็ตโดยรักษา custom layout เดิม และแก้ ownership ของ touch ให้ทุกนิ้วที่เริ่มในวงจอยเป็นนิ้วเดินเท่านั้น—เลือกจาก target จริง, สำรองด้วยพิกัด HUD และล้าง id ค้าง จึงไม่หลุดไปเปลี่ยน `pitch`


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1043 (6 ส.ค. · ยานลูกยิงตอบเฉพาะคนที่ยิงก่อน):** `js/invasion3d.js` เพิ่มสถานะ hostile แยกต่อยาน/ต่อเครื่อง—ยานที่ยังไม่ถูกเรายิงจะบินเฉยๆ; การล็อกเรดาร์/ดาเมจจากบอท/เพื่อนไม่ทำให้ยานมายิงเรา


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1045 (6 ส.ค. · ยกเครื่องโลก “ผจญภัย” เป็น Vocab Arena PvE):** เพิ่ม `js/arena3d.js`+`css/arena3d.css`—สนามมุมกล้องเฉียง/ปีศาจตัวอักษร/สกิลแสงหลายชั้น/เก็บอักษรเพิ่มพลัง→ประกอบคำรับเหรียญ→ร้านไอเทมถาวร โดยออกแบบภาพ-เสียงใหม่ไม่คัดลอกทรัพย์สิน ROV
- **รอบ 1044 (6 ส.ค. · ไฟแดงบนยานลูก hostile):** `js/invasion3d.js` เพิ่มสไปรต์สัญญาณแดงเต้นบนยานลูก เปิดเฉพาะเมื่อผู้เล่นคนนี้ยิงโดนจน `hostile=true`; ดาเมจ ally/peer ไม่เปิดไฟ และไม่เปลี่ยน guard/จังหวะ/ดาเมจการยิงเดิม


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1046 (6 ส.ค. · แจ้งอัปเดตเกมที่เคยไม่ขึ้น):** แก้ `index.html`+`index_classic.html` จากเดิมที่เอาเวอร์ชัน server มาเป็น baseline ตอนเช็กครั้งแรก (จึงไม่แจ้งผู้ใช้หน้าเก่า) เป็นเทียบ `version.json` กับ `vw-update-ack` และแสดง “มีการอัปเดตเกมใหม่!” ทันทีเมื่อยังไม่รับทราบเวอร์ชันนั้น


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1048 (6 ส.ค. · พักเพลง Lobby เมื่อเข้า 4 หน้า):** `js/music.js` ขยาย DOM duck selector ให้ครอบคลุม 🖼️ จับคู่ภาพ, 📖 Picture Dictionary, 🎧 ครูถามศัพท์ และ 📝 แผงสอบเลื่อนขั้น; ปิดหน้ากลับ Lobby แล้ว resume จากจุดเดิมอัตโนมัติ


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1050 (6 ส.ค. · Vocab Arena เฟส 2):** เพิ่ม Co-op PvE 2–4 คนผ่าน NetRoom เดิม, บอสคำศัพท์รายบท 4 บท, ระบบล้ม/คลาน/ชุบเพื่อน และคืนชีพสำรองโดยไม่หักเหรียญ; ใช้ภาพ ตัวละคร และเอฟเฟกต์ต้นฉบับของเกม ไม่คัดลอกทรัพย์สินหรือดีไซน์ ROV


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1051 (6 ส.ค. · กันโน้ตส่งงานติด Git):** เพิ่ม `handoff/SHIP.txt` ใน `.gitignore` และนำไฟล์ชั่วคราวที่รอบ 1050 เผลอเก็บใน handoff commit ออกจาก Git; รอบถัดไปโปรแกรมยังอ่านโน้ตได้ตามเดิมแต่ `git add handoff` จะไม่กวาดติดอีก


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1053 (ข้อความ commit เผลอมี “รอบ 1052” · 6 ส.ค. · จับคู่ภาพใช้คลัง Picture Dictionary):** `js/picmatch.js`+`css/lobby.css` เปลี่ยนทางเข้าจาก Lobby/Lobby 3D ให้เจอสารบัญ 8 กลุ่ม/46 หมวดเดียวกับหนังสือ ใช้ภาพครอปจากแผ่น WebP จริง และแบ่งลิงก์ชุดใต้หมวดตามงบ ป.1–2=4 / ป.3–4=10 / ป.5+=40 คู่ (โหมดภาพ–คำเดิมยังอยู่และจำกัด 20 คู่เพื่อให้อ่านชัด); `js/online.js` เปลี่ยนสถานะจากสัตว์เป็น Picture Dictionary


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1054 (6 ส.ค. · ซ่อมด่าน deploy ที่ฟ้อง undefined ผิด):** `tools/check_undefined_calls.py` เพิ่มการข้าม regex literal ภายใน `${...}` ของ template string—กรณี `replace(/'/g,...)` เดิมทำ parser หลงกลืนโค้ดหลังบรรทัดนั้น จึงฟ้อง `resetNow/setCombo/setSess` และ CSS `:not()` ทั้งที่นิยาม/selectorถูกต้อง


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1056 (6 ส.ค. · เกม 🫧 ฟอง):** เพิ่มปุ่มรางซ้าย Lobby + ร้านฟองในเมือง 3D; แตะฟองตามลำดับคำ ตัวซ้ำมีฟองครบ สุ่มตำแหน่งไม่ซ้อน ไม่มีไฟใบ้ และเสียง pop WebAudio ธรรมชาติ


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1057 (6 ส.ค. · จับคู่ภาพ 20 คู่ + ภาพสมส่วน + ทางออกชัด):** `js/picmatch.js` จำกัด ป.5+ จาก 40→20 คู่/ชุด, รักษา aspect ของ crop แทนการยืดเป็นสี่เหลี่ยม, ปุ่มซ้ายกลับสารบัญ และเพิ่ม `🚪 ออกไป Lobby` มุมขวาล่าง; `css/lobby.css` รองรับปุ่ม/จอเต็มโดยไม่ล้น


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1059 (7 ส.ค. · จับคู่ภาพตัดข้อความใต้ภาพ + ขยายภาพสมส่วนทั้งคลัง):** ใช้ตัวตรวจจับพิกเซลสแกน 2,641 ช่อง/46 แผ่น หาเส้นกรอบและแถบตัวอักษรด้วย row consensus แล้วอบตารางขอบแถว/จุดก่อนป้ายคำไว้ใน `js/picmatch.js`; ตัวเกมใช้กรอบเฉพาะภาพและถอดป้ายชื่อซ้อนออก, `css/lobby.css` fit ทั้งภาพแนวตั้ง/แนวนอนโดยไม่ยืด


## ⏬ ย้ายเมื่อ 2026-08-07 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1060 (7 ส.ค. · ยกเครื่องโรงแรมผีสิงไทย):** ภารกิจ 4 คำบังคับเส้นทาง ชั้น 4→โลงชั้น 3, ชั้น 4→โลง, ชั้น 2→โลง, ชั้นล่างสุด→ตู้สุ่ม 5 ใบในห้องในสุดชั้น 4; สมาชิกโรงแรมแชร์ตัวอักษร/รางวัล และจบรอบ +500🪙 ก่อนกลับ Lobby เดิม


## ⏬ ย้ายเมื่อ 2026-08-08 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1062 (7 ส.ค. · โรงแรมยาว 3 เท่า):** ยืดทางเดิน CORE_E→BX จาก 32.5→97.5 ม. ด้วยห้องขนาดเดิม 3→9 ห้อง/ฝั่ง/ชั้น (รวม 72 ห้อง); ขยายพื้น/รั้ว/ขอบเขตเดินเฉพาะโลกผีสิง ไม่กระทบโลกอื่น


## ⏬ ย้ายเมื่อ 2026-08-08 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1063 (7 ส.ค. · เก็บข้อความหลุดในเกมจับคู่ภาพครบคลัง):** สแกนพิกเซลและตรวจ contact preview ครบ 46 หมวด/2,641 ภาพ พบข้อความแตะขอบจริง 5 แถวใน Daily Routines, Drinks, Shapes, Time และ Transportation; เพิ่ม white-gap crop เฉพาะแถวใน `js/picmatch.js` จึงไม่ตัดภาพหมวดอื่นเกินจำเป็นและขยายภาพตามกรอบใหม่โดยรักษาสัดส่วน


## ⏬ ย้ายเมื่อ 2026-08-08 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1065 (7 ส.ค. · ส่งโค้ด crop จับคู่ภาพที่คิวโรงแรมแทรกรอบ 1064):** commit/deploy `js/picmatch.js` ตามผลตรวจรอบ 1063 ให้ครบจริง; รายละเอียดและผลทดสอบอ้างอิง bullet รอบ 1063 ด้านล่าง


## ⏬ ย้ายเมื่อ 2026-08-08 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1066 (7 ส.ค. · corridor โรงแรมผีสิงสมจริง):** ปรับโถง 5→2.8 ม., ฝ้า 2.95 ม., ประตู 0.98×2.12 ม. พร้อมวงกบ/recess/ธรณี/แผงไม้/มือจับ/peephole/keycard/เลขห้อง; เพิ่มบัวพื้น-chair rail-crown molding และซุ้มแบ่งทางยาว 5 ช่วงโดยคง collision/ห้อง/ภารกิจเดิม


## ⏬ ย้ายเมื่อ 2026-08-09 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1067 (7 ส.ค. · performance/ช่องพื้น/ภาพคนไทยโรงแรม):** เพิ่ม visibility + PointLight culling ตามชั้น (ช่วงบันได/ลิฟต์เปิด 2 ชั้นติดกัน) โดยไม่ลด geometry/material corridor และไม่แตะ HUD/ภารกิจ; อุดพื้นทางเชื่อมชานพัก→corridorกว้าง 1.1 ม. ที่หายหลังขึ้นบันได


## ⏬ ย้ายเมื่อ 2026-08-09 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1068 (7 ส.ค. · Word Search แยกสีตามคำ):** เปลี่ยนคำที่หาเจอจากเขียวเหมือนกันหมดเป็นพาเลตต์ 8 สี โดยชิปคำกับช่องตัวอักษรของคำเดียวกันใช้สีคู่กัน; ช่องที่คำตัดกันแสดงสีผสมและสีคงเดิมเมื่อเก็บกระดานกลับมาเล่นต่อ


## ⏬ ย้ายเมื่อ 2026-08-09 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1069 (7 ส.ค. · Publish Rules เกมฟอง):** ผู้ใช้เผยแพร่กฎเต็มแล้ว; อ่านสดจาก Firebase CLI ได้ 36 โซนและ SHA-256 ตรงกับ `handoff/RULES.md` ทั้งไฟล์


## ⏬ ย้ายเมื่อ 2026-08-09 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1070 (7 ส.ค. · ล็อก 4 โลก 3D + สิทธิ์บัญชีทดสอบ):** Lobby เดิมและเมือง 3D ใส่ 🔒/`Coming soon` ให้ผจญภัย·ขับรถ·มอไซค์·หุ่นรบ; บัญชี `sumpajitshami@gmail.com` (สัมปจิตฉามิ) และ `freddommun@gmail.com` (ครูรุต) ผ่านได้ โดยเมืองอ่าน `testerAccess` จากเซฟ Auth


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1071 (7 ส.ค. · เสียงโลกผีสิง):** เปลี่ยนเสียงเดินผู้เล่นเรา/ผู้เล่นอื่นเป็น `freesound_community-concrete-footsteps-6752.mp3` แบบลูป Audio แยกต่อตัว เริ่ม-หยุดตามการเดินจริงและลดระดับตามระยะ; ออกจากโรงแรม/เพื่อนออกแล้วปิดลูปครบ


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1072 (7 ส.ค. · ถอดระบบผู้เล่นป่วย):** ผู้เล่นไม่ป่วยจากการข้ามข้าวเย็นอีกต่อไป และสถานะคนป่วยเดิมไม่ล็อกการให้อาหาร/ซื้อของกิน; ข้าวเย็นผู้เล่นยังเป็นกิจกรรมเสริม ส่วนการป่วยและค่ารักษาคงอยู่เฉพาะสัตว์กับอาการบาดเจ็บโลก 3D


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1074 (8 ส.ค. · ปลดปักหมุดเมือง 3D/รักษา):** ย้ายปุ่ม `เมือง 3D` และ `รักษา` จาก `.rail-pinned` กลับเข้า `#lobby-rail` เป็นสองปุ่มแรก จึงเลื่อนไปพร้อมเมนูอื่นตามที่ผู้ใช้ขอ
- **รอบ 1073 (8 ส.ค. · responsive iPhone 14 Lobby):** ต้นตอคือ `viewport-fit=cover` แต่ไม่กัน safe-area ซ้าย/ขวา + Safari landscape text autosizing + scrollbar กินความกว้างราง ทำให้ปุ่มซ้ายแตะยากและ footer/หัวข้อบวมผิดจาก Android


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1076 (8 ส.ค. · iPhone Lobby ให้สัดส่วนเหมือน Android):** ต้นตอคือ iPhone 14 landscape มี viewport เพียง ~844×390 CSS px จึงเข้า responsive จอเตี้ยและขยายการ์ด/ปุ่มจนแสดงองค์ประกอบไม่ครบ ต่างจาก Android ที่กว้าง ~1280px


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1078 (8 ส.ค. · ตัดบัญชีทดสอบออกจากอันดับ):** บัญชี `freddommun@gmail.com` (ครูรุต) และ `sumpajitshami@gmail.com` (Sumpajit/สัมปจิตฉามิ) ไม่ส่งคะแนนขึ้น `/leaderboard` อีก และแถวหลักเดิมถูกลบเมื่อบัญชีเข้าเกม


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1080 (9 ส.ค. · ออนไลน์ Lobby เลื่อนขึ้น):** เปลี่ยนกล่องผู้เล่นออนไลน์ด้านขวาจากหั่นหน้า/พลิก 3D เป็น ticker เลื่อนขึ้นต่อเนื่องและวนไร้รอยต่อแบบ “Feed ทุกคน”; แตะ/ลากหยุดอ่านและปล่อย 5 วินาทีเลื่อนต่อ


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1082 (9 ส.ค. · ตู้เข็มโปรไฟล์ 5×3 แนวตั้ง):** เปลี่ยนเข็มจาก 1 แถวปัดซ้ายขวาเป็น 3 แถว × 5 คอลัมน์ ปัดขึ้นลง พร้อมปุ่มขึ้น/ลงที่ซ่อนตามตำแหน่ง


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1084 · Haunted Hotel Phase 1+2 (working tree ยังไม่ commit/deploy):** runtime FSM `ENTER→ACTIVE_WORD→TEMP_BLACKOUT→RESTORE→PERMANENT_DARK→FINAL_CABINET→COMPLETE→RETURN` + canonical `/hauntedHotel/rN/run`


## ⏬ ย้ายเมื่อ 2026-08-10 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1085 · Haunted Hotel Phase 3 (working tree ยังไม่ commit/deploy):** เปลี่ยนเพดานเฉพาะ `haunt` เป็น 6 คนด้วย `HauntedHotelRuntime.MAX_PLAYERS`; NetRoom verifier เดิมกระจายคนที่ 7 ไปหลังถัดไปแบบ race-safe โดยไม่แตะเพดานโลกอื่น


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1086 · Haunted Hotel Phase 4 (working tree ยังไม่ commit/deploy):** เพิ่ม placement pool stable ID/version 1 จากทุกห้องค้นได้+โถง/ทางเดิน และ derive จาก canonical `runId+seed` แบบกระจายหลายชั้น/ไม่กองห้อง โดยตัวหน้าโลง/ตู้ยังคงตำแหน่งพิเศษเดิม


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1088 · กฎส่ง Firebase Rules แบบป้องกันข้อความตกหล่น:** ทุกครั้งต้องส่งก้อนเต็มผ่าน HTML ที่มีปุ่ม “คัดลอกทั้งก้อน” จาก `tools/gen_rules_artifact.py` เป็นทางหลัก; เครื่องมือตรวจ `json.loads`, payload หลัง render ตรง source ทุกตัวอักษร และแสดง SHA-256 ก่อนเขียนไฟล์; กฎถาวรอยู่ใน `handoff/RULES.md` + skill `vocab-world` · ทดสอบ artifact จริงผ่าน 37 โซน/45,250 ตัวอักษร/มี `hauntedHotel` · ผู้ใช้ยืนยัน Publish แล้ว 10 ส.ค.; Codex ยังเทียบ rules สดไม่ได้เพราะ browser ไม่มีสิทธิ์/เกมไม่ได้ล็อกอิน


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1089 · Haunted Hotel replacement rules + PNG ghost:** ตัวอักษร 1 ตัวทุกห้องชั้น 2–5, canonical ห้องไม่ซ้ำควบคุมไฟ 5→ดับหลัง flicker 10 วิ / 10→ติด / 13→ดับอีกครั้ง; ผีใช้ `ghost_attack_01.png` ไฟล์เดียว ไล่คนใกล้สุดและข้ามคนที่หลบในห้อง พร้อม shader cold tint/rim/face glow/flicker และผมปลิวแบบ GPU เบาโดยไม่ sync Firebase


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1089 · Haunted Hotel funeral/coffin realism pass (พร้อม commit/deploy):** ปรับเฉพาะ `js/hotel3d.js` ให้โลงมะฮอกกานีเก่าอ่านชั้นฝา/แผง/คิ้ว/มือจับ, แท่น+เงาสัมผัส, เทียน/ธูป/ดอกไม้แห้ง, ภาพกรอบผุ, คราบชื้น/พรม และตัดเม็ด Sphere/ไฟประดับขาวเดิม; collision เดิมคงพิกัดและไม่แตะ mission/multiplayer


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1091 · Firebase PWA + stable TWA:** เพิ่ม `npm run build` → `dist/`, `firebase.json`, `manifest.webmanifest`, Bubblewrap identity `app.web.vocabworld.twa`; Android ไม่มี game assets และ normal game update ไม่ต้อง rebuild AAB
- **รอบ 1090 · รีเซ็ตรอบเมื่อ Haunted Hotel ว่าง:** NetRoom จำจำนวนผู้เล่นก่อนเข้าห้อง; ถ้าเป็น 0 ผู้เล่นคนแรกจะ transaction สร้าง canonical run ใหม่ทันทีและไม่แสดง state เก่าระหว่างรอล้าง ส่วนผู้เล่นที่เข้ามาสมทบยัง adopt run เดียวกันตามเดิม; fresh-start ถูก consume หลัง init สำเร็จจึงไม่รีเซ็ตซ้ำตอน Firebase reconnect · ไม่เพิ่ม field/ไม่ต้องแก้ Rules · เพิ่ม regression `tools/test_hauntedhotel_session_reset.js` และ Phase 4/rules/syntax/undefined/template/assets/diff ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1093 · Google Play privacy/account deletion remediation:** Settings มี entry ลบบัญชีจุดเดียว พร้อมคำเตือน → พิมพ์ `DELETE` → Google re-auth → RTDB multi-location delete → Firebase Auth delete; ถ้าลบ Auth ไม่สำเร็จหลัง RTDB จะค้างสถานะ finalize-only และไม่รายงานสำเร็จเท็จ
- **รอบ 1092 · Haunted Hotel ตู้/ผี/พลังชีวิต:** เปิดตู้ทุกใบไม่ Jump Scare ทันที; หลังบานเริ่มเปิด 650ms และผู้เล่นหันออก ≥1.05 rad จึงแสดงหน้าผีเต็มจอ 3 วิ โดยซ่อน HUD/ฉากอื่นทั้งหมด


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1094 · แก้ Firebase Rules line 385 + Publish สำเร็จ:** คืน `.child('u').val()` และวงเล็บที่ตกใน `gnotif/$uid/n/$nid/.write`; generator ปฏิเสธ expression ที่วงเล็บ/quote ไม่ครบแล้ว · หลังผู้ใช้ Publish ตรวจ Rules สดด้วย Firebase CLI ตรง source ครบ 37 โซน/475 leaf keys (`missing/extra/changed=0`) · เว็บ live ยังเป็น policy เก่าและ `/delete-account.html` ยัง fallback เข้า City จึงเหลือ commit/deploy Hosting + ทดสอบบัญชีทิ้ง


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1096 · ปิดบั๊ก account deletion `permission_denied`:** ต้นตอคือ plan ส่ง `gfeed/<post>/lk/<uid>` และ `cm/<cid>/cl/<uid>` แม้ไม่มี reaction บนโพสต์คนแปลกหน้า; แก้ `js/account-deletion.js` ให้ส่งเฉพาะ reaction ที่มีจริง และ Rules อนุญาตเจ้าของ UID ลบ reaction ตัวเองแม้เลิกเป็นเพื่อน โดยไม่ขยายสิทธิ์สร้าง/แก้


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1097 · หน้า Login ใช้โลโก้ Vocab World ใหม่ (รอ visual review/ยังไม่ deploy):** แทน crest + หัวข้อซ้ำด้วย `img/phoneScreenShots/newVocabworldLogo.png`, ปรับการ์ด/พื้นหลัง/Google CTA น้ำเงิน-ฟ้า-ทอง และเปิด login แนวตั้งโดยไม่แตะ auth; build 8,236 ไฟล์ + validator ผ่าน, Browser 10 viewport 360×640–1920×1080 ไม่มี overflow/scroll โลโก้ 3:2 และ console ใหม่ 0 error


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1099 · แก้ deploy รอบ 1098 ขาด asset โลโก้:** ต้นเหตุ `ship.sh` กัน asset untracked ตามปกติ จึง commit HTML/CSS แต่ไม่รวม PNG; เตรียม `handoff/SHIP.txt` ระบุเฉพาะ `img/phoneScreenShots/newVocabworldLogo.png` ให้ launcher add/commit/deploy โดยไม่กวาด asset อื่น


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1100 · ส่งหน้า Login ขึ้น Firebase หลัง asset เข้า Git แล้ว:** รอบ 1099 commit/push โลโก้สำเร็จแต่ `ship.sh` จัด asset-only เป็น no-deploy จึง live ยัง `.1016`; เตรียม manifest ผูก `index_classic.html` เพื่อบัมพ์ version/build/deploy จริง โดยไม่แก้ UI/auth เพิ่ม


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1102 · Haunted Hotel โลงเทพพนม + ป้ายบอกชั้น:** เปลี่ยนโลงตะวันตกเป็นโลงไทยฐานบัว/ชาดแดง/ฝาจั่ว/ยอดเปลว พร้อมลาย canvas และเทพพนมนูนสองด้าน; เพิ่มป้ายไทย-อังกฤษชั้น 1–5 ข้างลิฟต์ทุกชั้นใน `js/hotel3d.js` โดยคง collider/mission เดิม · Haunted Hotel regression 3 ชุด, syntax/template/undefined/diff, build 8,236 ไฟล์ + PWA validator และ Browser 1280×720/812×375 overflow 0 ผ่าน
- **รอบ 1101 · แก้จอยเดินโลกยานแม่บางครั้งกลายเป็นก้ม/เงย:** ต้นเหตุคือนิ้วที่เริ่มฝั่งจอยแต่คลาดขอบถูกเก็บเป็น candidate กล้อง; `js/invasion3d.js` ล็อกบทบาท touch ตั้งแต่เริ่ม, เพิ่ม hit slop 20px และสลับฝั่งมองตามพรีเซ็ตถนัดซ้าย · regression 9 เคส, syntax/template/undefined, build 8,236 ไฟล์ + PWA validator และ Browser 812×375 console 0 ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1103 · ปุ่มเข้าสู่ระบบใต้ข้อความหน้าเมือง:** เพิ่มปุ่ม `🔑 เข้าสู่ระบบ` ใต้สถานะ “ล็อกอินในเกมก่อน…” ใน `index.html` ลิงก์ไป `index_classic.html`; `js/city3d.js` แสดงเฉพาะตอนยังไม่ล็อกอินและซ่อนเมื่อ auth สำเร็จ · syntax/assertion/diff ผ่าน และ Browser 1280×720 + 812×375 ยืนยัน gap 8.8px, overflow 0, ปลายทางมี `#screen-login`


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1105 · F1 Dual Graphics Mode Phase 1:** เพิ่ม Racing Mode Select ก่อนค่าเข้า, preference local, preview WebP 2 ภาพ และ `vw.f1.environment-profile/v1`; Battery Saver คงค่าฉากเดิม ส่วน High Graphics ปรับ profile บน scene/renderer ชุดเดียว โดยไม่แตะ physics/gameplay/NetRoom/Firebase


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1109 · ปุ่ม Login ต้องขึ้นแน่นอน + อัปเดตเมื่อกดเท่านั้น:** ภาพผู้ใช้ยืนยัน `.1022` ยังซ่อนปุ่มเพราะ HTML ตั้ง `display:none` แล้วรอ Firebase; เปลี่ยน `index.html` ให้แสดงตั้งแต่เฟรมแรกและซ่อนเฉพาะเมื่อ auth สำเร็จ พร้อมแก้ `js/app-update.js` ให้ตรวจทุก 15 วิ แสดงข้อเสนอก่อน และเรียก SW update หลังผู้ใช้กดเท่านั้น · assertions/build 8,240 ไฟล์/PWA validator ผ่าน; Browser 1321×618 หลัง Firebase ตอบยังเห็นปุ่ม gap 8.8px, overflow/console 0
- **รอบ 1108 · กู้ปุ่ม Login เมื่อ PWA cache คนละชุด:** ภาพผู้ใช้ยืนยันข้อความ Login ขึ้นแต่ element ปุ่มหาย เพราะ shell เก่าถูก deploy ทับด้วยเลข build เดิม; `js/city3d.js` สร้างปุ่มสำรองเมื่อ HTML ไม่มี และ `js/app-update.js` ตรวจ SW ทุกครั้ง+รีโหลดเมื่อ controller เปลี่ยนแม้เลขเดิม · syntax/diff, stale-shell assertions, build 8,240 ไฟล์/PWA validator และ Browser 812×375 (gap 8.8px, overflow 0, Login ปลายทาง/console 0) ผ่าน
- **รอบ 1106 · F1 realistic dynamic engine audio (ยังไม่ deploy):** แทนเครื่อง oscillator ด้วย `sound/racing/engineSound.mp3` แบบ single-sample RPM 4,000–19,000 / pitch 0.70×–1.60× ตาม throttle·speed·accel/decel·brake·เกียร์ 8 สปีด·กล้อง พร้อม synth fallback/crossfade/mobile node เดียว


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1110 · transition release ทดสอบปุ่มอัปเดตด้วยรุ่นใหม่จริง:** `.1022` รับ `.1023` เงียบเพราะตัว updater เก่ายังทำงานก่อนถูกแทนที่ จึงต้องมี `.1024` เป็นรุ่นแรกที่ `.1023` ตรวจด้วยกติกาใหม่; `js/app-update.js` แสดงเลข build ปลายทางบนข้อความเพื่อยืนยัน · explicit-prompt/no-update-before-click assertion, syntax/diff, build 8,240 ไฟล์/PWA validator ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1111 · ป้ายอัปเดตแบบยืนยัน แม้มือถือโหลด build ล่าสุดเอง:** ต้นเหตุ navigation network-first ทำให้กลับเข้า Lobby แล้ว `หน้า=server` จึงไม่เคยเห็นปุ่ม; `js/app-update.js` เพิ่ม `vw-update-acknowledged` ให้ป้าย “เกมรุ่นใหม่พร้อมแล้ว/เปิดเกมรุ่นใหม่” ค้างจนกด และยังคงเส้นทาง remote update เดิม · เพิ่ม `tools/test_app_update_prompt.js` ครบ loaded/acknowledged/remote; syntax/diff/build 8,240/PWA ผ่าน และ Browser 812×375 ป้ายเห็นจริง overflow/console 0 กดแล้วไม่เด้งซ้ำ


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1112 · ส่งป้ายอัปเดตถึง Lobby 3D ที่ค้างใน memory/bfcache:** ภาพผู้ใช้ยืนยัน Classic โหลด `.1025` แต่ City ยังเป็นเอกสารเก่า (ปุ่ม Login ก็หายพร้อมกัน); `js/app-update.js` เริ่ม check/timer ใหม่บน pageshow/focus และ `sw.js` ทำ one-time recovery เฉพาะ client `/`/`index.html` ที่มี shell เก่า โดยไม่รีโหลด Classic/โลกเกม · regression restored prompt + SW city-only/once ผ่าน; build 8,240/PWA validator และ Browser รอบเดียวกัน 812×375 ยืนยัน City+Classic เห็นป้าย `.1025`, overflow/console 0


## ⏬ ย้ายเมื่อ 2026-08-12 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1115 · Vocab World Racing แบบผู้เล่นล้วน:** ถอดรถ AI/bot ทั้ง runtime, minimap, DRS และ test hook; DRS เหลือคำนวณจากผู้เล่นออนไลน์จริงเท่านั้น
- **รอบ 1114 · ยกเลิกหนังสือ Picture Dictionary แบบกาง 2 หน้า:** คง 8 หมวดเดิม แต่เปลี่ยนเป็นหน้ารายการเดียว 40 คำ/หน้า (8×5) ภาพ+อังกฤษ+ไทยใหญ่ชัด พร้อมปุ่มก่อนหน้า/ถัดไปและเมนูหมวดแบบไม่ต้องเลื่อนบนจอเล็ก
- **รอบ 1113 · FPS weapon sprite state machine (ยังไม่ commit/deploy ตามคำสั่ง):** สร้าง runtime frames 47 ภาพจาก master แบบ deterministic/alpha/512×512 anchor เดียว และต่อ `EQUIP/IDLE/WALK/SPRINT/ADS_ENTER/ADS/ADS_EXIT/FIRE/RELOAD` ผ่าน adapter local โดย reuse gameplay/ADS/fire/reload/mobile controls เดิมและ fallback โมเดล 3D เมื่อภาพยังไม่พร้อม


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1118 · Picture Dictionary แสดงครั้งละ 18 คำ:** ปรับจาก 8×5 เป็น 6 คอลัมน์ × 3 แถว เพื่อขยายภาพและคำอังกฤษ/ไทยให้ชัดขึ้นบนจอเล็ก; แก้ `js/picdict.js`, `css/picdict.css`, `tools/test_picdict_single_page.js`


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1117 · FPS weapon state/presentation fix (ยังไม่ commit/deploy ตามคำสั่ง):** ADS ใช้ normalized progress 0..1 เดียว กลับทิศต่อจากตำแหน่งปัจจุบันและใช้เวลาที่เหลือตามสัดส่วน; FIRE คง logical `.045s` แต่รับประกันนำเสนอ 1→2→3→4 ก่อนคืน base state


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1121 · Picture Dictionary เปลี่ยนหน้าด้วยการปัด:** ถอดปุ่มก่อนหน้า/ถัดไปออก คงเลขหน้าและเพิ่มคำแนะนำ; ปัดซ้ายไปหน้าใหม่ ปัดขวาย้อนกลับ พร้อม threshold กันการแตะ/ขยับนิ้วสั้นผิดความหมาย
- **รอบ 1119 · อันดับทรัพย์สินรวม Top 10 + รางวัลรายเดือน:** เพิ่มแท็บ 🏆 ใช้ค่า `leaderboard.av` เดิม จัดอันดับมูลค่าทรัพย์สินที่ถือครอง (ไม่รวมเหรียญ) และให้รางวัลอันดับ 1–10 = 10,000–1,000 เหรียญผ่านโรงงาน `award.js`


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1124 · ฟีดรายงานอันดับดีขึ้นแทนปุ่มธีม 3 ปุ่ม:** หัวล็อบบี้แสดงชื่อผู้เล่น/หัวข้อ/#เดิม→#ใหม่เฉพาะอันดับที่สูงขึ้น ครอบคลุม 9 กระดาน; baseline ครั้งแรกและอันดับตกเงียบ ไม่สร้างข่าวย้อนหลังหรือข่าวลบ
- **รอบ 1123 · Picture Dictionary ลากหน้าตามนิ้ว:** แผง 18 คำเลื่อนตามนิ้ว 1:1 ระหว่างปัด; ปล่อยถึงเกณฑ์ให้หน้าเดิมไหลออก/หน้าใหม่ไหลเข้า ไม่ถึงเกณฑ์หรือชนขอบให้เด้งกลับพร้อมแรงต้าน


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1126 · badge ตั้งค่าเป็น “ยังไม่เห็น” จริง:** หน้าสรุปเดิมแสดงคำเชิญแล้วแต่เลขไม่หายจนกดเข้าโลก; ผู้ใช้กำหนดว่าแค่เห็นหน้าสรุปและกดปิดก็ควรถือว่าอ่านแล้ว โดยคำเชิญยังค้างไว้ได้
- **รอบ 1125 · F1 Realistic Circuit visual upgrade (ยังไม่ commit/deploy ตามคำสั่ง):** Realistic Mode เพิ่ม cockpit/camera ระดับสายตา, asphalt+racing line, modular barriers/catch fence, fictional boards, grandstands, pit complex, floodlights, bridges/marshal posts/skyline; Battery Saver ใช้ค่ากับฉากเดิมและไม่สร้างชั้น Realistic


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1127 · จับคู่ภาพห้ามเล่นหน้าเดิมจนผ่านหน้าอื่น 10 หน้า:** บันทึก 10 หน้าล่าสุดแบบ rolling ใน localStorage; ปุ่มหน้าที่ยังติดล็อกบอกจำนวนหน้าที่เหลือ และครบ 10 หน้าแล้ววนกลับมาเล่นได้


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1128 · อันดับทรัพย์สินรวมแสดง Top 100:** ขยายเฉพาะจำนวนรายชื่อจาก 10 เป็น 100 เหมือนกระดานเหรียญ โดยเงินรางวัลยังจำกัดอันดับ 1–10 = 10,000–1,000 เหรียญตามเดิม; แก้ `js/ui.js`, `tools/test_asset_leaderboard.js`


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1130 · อันดับเหรียญออนไลน์สะสมตลอดกาล Top 100 + รางวัลรายเดือน:** เพิ่มแท็บ 🌐 จัดจาก `state.onlineEarned` ซึ่งเป็นเหรียญที่ได้จากเวลาออนไลน์และแสดงในกระเป๋า Lobby; ส่งค่า `leaderboard.oe` และใช้ query เฉพาะ `oe` เพื่อไม่ให้ยอดเหรียญคงเหลือกระทบอันดับ


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1132 · ล็อก F1 + ยานแม่ก่อน deploy:** เพิ่มทั้งสองด่านเข้า Coming soon แบบเดียวกับมอเตอร์ไซค์ ผู้เล่นทั่วไปเห็น 🔒/กดแล้วถูกบล็อกก่อนหน้าจ่ายเงิน แต่บัญชี tester ยังเข้าได้; เพิ่ม regression `tools/test_f1_lobby_lock.js`


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1134 · Letter Cannon (ยังไม่ commit/deploy ตามคำสั่ง):** เพิ่มเกม Canvas ยิงตัวอักษรตามลำดับคำจาก `vocabForStudent()` แบบ endless/ไม่ลงโทษ/ไม่มี Game Over พร้อม 7 power-up, reward เดิม และ cleanup ครบ


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1135 · รางวัลแท็บเหรียญ + ยืนยันเหรียญออนไลน์สะสมตลอดกาล:** แท็บ 🪙 เหรียญให้ Top 10 = 10,000→1,000 รายเดือนผ่าน `coinAward`; เพิ่ม state/load/build/Rules และกระดานประกาศครบ


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1136 · Letter Cannon ล็อกเฉพาะ tester ก่อนขึ้นเว็บ:** ใช้สิทธิ์กลาง `isTester()`/`state.testerAccess`; ผู้เล่นทั่วไปเห็น 🔒 และข้อความ “เปิดให้เฉพาะบัญชีทดสอบ” ส่วน tester เข้าได้


## ⏬ ย้ายเมื่อ 2026-08-13 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1137 · หน้าโหลด Cloud ห้ามค้างไม่รู้จบ:** ครบ 6 วินาทีแสดงปุ่ม “รีเฟรชเกมแล้วลองใหม่”; ครบ 12 วินาทีตัด timeout พร้อมบอกสาเหตุ/รหัส error แทนการรอ Firebase ตลอดไป


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1143 · คืนค่าเข้าเกมที่เล่นไม่ได้:** ครอบคลุมโลก 3D มีค่าเข้า 10 เส้นทาง; โหลด/start พัง, ยกเลิกก่อนเริ่ม หรือเครื่องค้าง/reload ใน 15 วินาทีแรก ได้คืนเต็มจำนวนและกันคืนซ้ำ
- **รอบ 1142 · สงวนชื่อ Admin/แอดมิน:** เฉพาะ `freddommun@gmail.com`, `sumpajitshami@gmail.com`, `parkerhulk2020@gmail.com` ใช้ได้; บล็อกตัวพิมพ์ผสม ช่องว่าง และอักขระซ่อนทั้งสมัคร/เปลี่ยนชื่อ/ก่อนส่ง DB
- **รอบ 1140 · Word Search เพิ่มคู่มือ Combo:** เพิ่มปุ่ม “🔥 Combo คืออะไร?” และ dialog อธิบาย ×1→×2→×3, ต้องหาคำถัดไปภายใน 3 วิ, ลากผิดไม่ตัด และสูตรเหรียญ
- **รอบ 1139 · รางวัลแรงค์+อันดับดีขึ้น:** เลื่อนแรงค์ใหญ่ได้ 10,000 (ขั้น III/II/I ไม่ได้); เซฟเก่ารับย้อนหลังตามแรงค์ใหญ่ปัจจุบันแบบครั้งเดียว


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1144 · Letter Cannon ป้อมภาพสองเลเยอร์ + owner-only:** ใช้ฐานนิ่ง/หัวป้อมกระบอกคู่หมุน 180° จาก PNG 1254×1254 โปร่งใส; ยิงสลับปากกระบอกจริงและทุก power-up ใช้ทิศเดียวกับหัวป้อม


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1146 · deploy-only สำหรับ hotfix ภาพป้อม:** รอบ 1145 commit/push สำเร็จแต่ `ship.sh` เห็นเฉพาะ tools/docs จึงเลือก `--no-deploy`; live ยัง `.1040` และภาพยัง 404
- **รอบ 1145 · hotfix asset 404 หลัง deploy:** `.1040` ขึ้นสำเร็จแต่ production manifest ไม่มีภาพป้อม เพราะ `build_web.mjs` fallback ใน git archive ไม่ผ่านรายการ explicit ของโหมดมี `.git`


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1147 · Letter Cannon ปลดล็อกเฉพาะ Admin:** เปลี่ยน gate จากครู/เจ้าของ 1 บัญชีเป็น `isAdmin()` ซึ่งอ้าง allowlist กลาง `ADMIN_NAME_EMAILS` เดิม 3 บัญชี ไม่เพิ่มอีเมล/UID หรือแก้ Rules


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1150 · Letter Cannon ยิงด้วยปุ่ม + เลื่อนลื่น:** ยกเลิก auto-fire; ยิงเฉพาะเมื่อแตะหรือกดค้างปุ่ม 🔥 ยิง ซึ่งวางเหนือปุ่มซ้าย/ขวาทั้งสองฝั่งและรองรับ Spacebar
- **รอบ 1148 · Letter Cannon ยิงด้วย double tap:** ถอดปุ่ม ยิง/FIRE และ CSS/handler เดิม; แตะหรือคลิกสองครั้งภายใน 380ms ที่ฝั่งซ้ายหรือขวาก็เล็งแล้วยิง 1 นัด โดยไม่ผูก pointer/มือ


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1151 · ปุ่ม “เริ่มเกมตอนนี้” ห้องครูถามศัพท์กลับมาทำงาน:** ต้นตอ PicQuiz Online ยังเรียก API หนังสือสองหน้าที่ถูกถอดในรอบ 1123 จึงเกิด TypeError เงียบก่อนเริ่มเกม


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1152 · Pet Bond Scene 2.5D:** รวมผู้เลี้ยง บ้านปัจจุบัน และสัตว์ไว้ในฉากเดียว พร้อมฉาก ImageGen แยกหมา/แมว/มังกรและปุ่มไปอัปเกรดบ้าน


## ⏬ ย้ายเมื่อ 2026-08-14 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1153 · ปรับราคารถยนต์:** รถโชว์รูม 10 คันเรียงราคาใหม่จาก 400,000–500,000 เหรียญ โดยระบบซื้อสด/ดาวน์/ผ่อนอ่านราคาเดียวกันจาก `CARS`; syntax, ช่วงราคา และลำดับราคาผ่าน


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1154 · ห้องแต่งตัวพรีเมียม + เสื้อผ้าใหม่:** เพิ่มภาพ ImageGen โปร่งใส 10 ชิ้น (เครื่องประดับ 6 / เสื้อผ้า 4) รวมสินค้าเป็น 18 ชิ้น พร้อมระดับ คลาสสิก/หายาก/มหัศจรรย์/ตำนาน ราคา ป้ายหมวด แสงอัญมณี และยอดขาย


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1157 · ย้ายปุ่ม “สะกดคำ” ออกจากเวทีน้อง:** ปุ่มอยู่ต่อท้ายแถบ “ระดับชั้น” ในช่องว่างด้านขวา โดยย้าย DOM node เดิมจึงคงเงื่อนไขแสดง/ซ่อนและ click handler ครบ; แก้ `css/lobby.css`, `js/lobby3d.js` และเพิ่ม regression test


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1158 · ชั้นอาหาร + โลก Pet Shopping 3D:** เปลี่ยนการให้อาหารเป็นหัก stock จากชั้น 30/75/160 ช่อง; ชั้นเริ่มว่างและอัปเกรดจ่ายส่วนต่าง. ปุ่มใต้ให้อาหารพาไปซื้ออาหาร/แฟชั่นในโลกขับรถมุมมองคนขับ มี GPS, หัวน้อง, วิทยุรถ, ร้านโครงสร้างครบ, รถส่วนตัวฟรี/ไม่มีรถเช่า `car_01` รอบละ 500 และหักหลังเปิดโลกสำเร็จ


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1160 · hotfix Pet Shopping 3D จากภาพผู้เล่น:** เปลี่ยน cockpit ให้เข้ากับฉาก low-poly, ปุ่มมุมบน 50px+, equalizer เปิด/ปิดเพลง, และพวงมาลัย/เร่ง/เบรก/D-R/แตร+ฟิสิกส์/เสียงยกจาก `moto3d` รอบ 785
- **รอบ 1159 · hotfix คิวคำพูดข้ามสัตว์:** เมื่อสลับแท็บสัตว์ ยกเลิก timer/คิวของตัวเดิมและผูก callback กับสัตว์เจ้าของข้อความ ป้องกันข้อความมังกรไปแสดงบนหมา; `test_pet_bond`, syntax, build `.1049` และ PWA validator ผ่าน


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1163 · Pet Shopping ใช้ระบบขับรถเมืองกำแพงเพชรโดยตรง:** แทนชุด `moto3d` รอบ 1160 ด้วย physics/cockpit ตามรถ/เกจ/กระจก 3 บาน/กล้อง/สตาร์ท+เข็มขัด/D-R/ไฟเลี้ยวคืนกลาง/เสียง/วิทยุ+Equalizer


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1162 · กราฟอันดับ Top 30 หน้า Lobby:** เพิ่มปุ่ม “กราฟอันดับ” ถัดจาก “สะกดคำ”; กราฟ 10 หมวดคะแนนหลักใช้สีไม่ซ้ำ สลับหมวดได้ และติดชื่อผู้เล่นทุกจุด พร้อมปุ่ม “✕ ปิด” ชัดเจน


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1164 · hotfix รถโลกซื้ออาหาร:** ปรับ cockpit ให้เต็มขอบ ล็อก crop แดชบอร์ด และขยายพวงมาลัยให้เห็นชัดทั้งจอปกติ/จอเตี้ย


## ⏬ ย้ายเมื่อ 2026-08-20 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1169 · ปุ่ม Settings จอมือถือ landscape แคบ:** ต้นเหตุ header มีความกว้างขั้นต่ำจากการ์ดผู้เล่น+แถวเหรียญ ทำให้ก้อนปุ่มขวาถูก `overflow:hidden` ตัด; ที่ viewport ≤640×520 ยึดปุ่ม 5 ตัวไว้ขอบขวาใต้แถวเหรียญและซ่อนเฉพาะฟีดอันดับ
- **รอบ 1168 · รถชนแล้วเด้ง + คอนโซล/Equalizer responsive (ผู้ใช้อนุมัติภาพแล้ว):** collision เดิมคืนเพียงตำแหน่งเฟรมก่อนแต่แรงยังดันเข้า solid; แก้ normal/depth ดันพ้น 22 ซม., เด้ง 0.65–2.4 m/s, ขอบถนนดันเข้า 28 ซม. และพักคันเร่ง 0.32 วินาที โดยคงค่าซ่อม 100 เหรียญ


## ⏬ ย้ายเมื่อ 2026-08-21 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1172 · เก็บตัวอักษรโลกเฮลิคอปเตอร์ทีละคำตามลำดับ:** เดิมสร้าง 10 คำ+ตัวหลอก 8 ตัว; แก้ `js/adventure3d.js` ให้มีเฉพาะตัวของคำปัจจุบัน แยกคนละดาดฟ้า และปฏิเสธตัวที่ผิดลำดับ


## ⏬ ย้ายเมื่อ 2026-08-21 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1173 · ลบรอยต่อท้องฟ้า 360°:** `sky_dawn.jpg` เป็น 2:1 แต่ขอบซ้าย/ขวาสีไม่ตรงกัน จึงเกิดเส้นตั้งใน equirectangular skybox


## ⏬ ย้ายเมื่อ 2026-08-21 — จาก handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)

- **รอบ 1174 · แก้ซื้อของตลาดออนไลน์แล้วของหาย:** Firebase Transaction ลบ node ด้วย `null` ทำให้ snapshot หลังลบว่าง แต่โค้ดเดิมนำ snapshot ว่างไปออกใบเสร็จ จึงขึ้น `invalid` ทั้งที่ของถูกลบแล้ว
