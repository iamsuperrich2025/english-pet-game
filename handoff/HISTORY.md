# HISTORY.md — ประวัติการทดสอบรอบเก่า (archive)

> อ่านเมื่อ: ต้องรู้ว่ารอบก่อนๆ ทำอะไร/ทดสอบอะไรไปแล้ว หรือย้อนดูเหตุผลของบั๊กเก่า
> รอบล่าสุด (24–29) อยู่ใน `handoff/STATUS.md` · ไฟล์นี้เก็บรอบ 1–23

**รอบยี่สิบสาม (6 ก.ค. 2026 — Opus แก้ 2 บั๊กระบบเพื่อน/แชท ✅):** (1) ค้นหาเพื่อนขึ้น "ผู้เล่น ชั้น " (ชื่อว่าง) — friendSearch อ่านชื่อจาก presence+leaderboard เลือกอันมีชื่อ + register push presence/leaderboard ทันที (commit `84c4894`) (2) แจ้งเตือนข้อความแชทใหม่แม้ปิดกล่อง — `chatWatchSync`(เฝ้า chats/<pairId> limitToLast 1) + `chatMarkSeen` + `Online.chatUnread` + badge/toast/เสียง/ปุ่ม "ใหม่!" (commit `9f3ec4b`) · ✅ ผู้ใช้ publish rules `/chats` แล้ว

**รอบยี่สิบสอง (6 ก.ค. 2026 — Opus ข้อ 0.4 แชท ✅):** chat engine (chatPairId/chatRef/chatListen/chatSend/chatPrune · CHAT_MAX_LEN 200/CHAT_KEEP 100) · openChat + CHAT_EMOJIS 44 + ปุ่ม 💬 · rules `/chats` · ทดสอบ fake in-memory Firebase: pairId เรียง alphabet · reject ว่าง/>200/คำหยาบ/leet · prune 105→100 · XSS escape · emoji picker · ไม่มี console error

**รอบยี่สิบเอ็ด (6 ก.ค. 2026 — Opus ข้อ 0.3 เพิ่มเพื่อน ✅):** friendCode/Search/Request/Accept/Decline + listeners + presenceMap · แผง 👥 + #friend-card · renderFriendPanel(dataset.built)/friendDoSearch/refreshFriendData/updateFriendBadge · ทดสอบ fake Online.db ครบ (รหัส deterministic/ค้นหา/ส่ง-รับ-ปฏิเสธ/XSS escape/offline)

**รอบยี่สิบ (6 ก.ค. 2026 — Fable ฝนเต็มจอ ✅):** overlay `#rain-fx` ฝนตกจริง 19:00–20:00 + ไม่มีบ้านสภาพดี · เม็ดฝนจาง 2 ชั้น (repeating-gradient แกน 100°/96° เลื่อนขนานเส้น — ⚠️ เคยพลาด 170° เส้นออกนอน) + หยดเกาะกระจก `.glass-drop` · rainFxTick · แค่ภาพ ไม่แตะ state · **เพิ่มเติม:** หยดน้ำเปลี่ยนเป็นภาพจริง `img/fx/raindrop*.png` (ล้าง halo เทาด้วย Pillow alpha ramp) · **หมายเหตุ:** ภาพเจนมามัก baked halo เทา — ตรวจ alpha ด้วย Pillow ก่อนใช้

**รอบสิบเก้า (6 ก.ค. 2026 — Fable ข้อ 7 ตั้งชื่อสัตว์ ✅):** util.js `askNameDialog(opt)` กล่องตั้งชื่อกลาง (4 จุด) · auth.js refactor authAskProfileName + authApplyProfileName + authEditProfileName · state.js newPet(type,name)+migration · ui.js student-chip 📛+✏️ · ซื้อสัตว์ต่อกล่องบังคับตั้งชื่อ (ยกเลิก=ไม่ซื้อ) · ชื่อสัตว์แทนชื่อชนิดทุกจุด escape · **หมายเหตุ:** กดปุ่มใน overlay ผ่าน eval แยกคนละ call กับตอนสร้าง (เคย race)

**รอบสิบแปด (6 ก.ค. 2026 — Fable ข้อ 0.2 display name ✅):** `js/data/badwords.js` (BAD_PART/BAD_EXACT + nameNormalize + checkName) · state.profileName+migration · #reg-nick · authAskProfileName/authPushProfile · onlineKey()=uid · escapeHTML() ชื่อจาก DB · ทดสอบตัวกรอง 27/27 เคส (คำปกติผ่าน ฟักทอง/แมงมุม/Bob/กูเกิล · คำหยาบดักทุกท่า เว้นวรรค/ตัวซ้ำ/เลขแทน/ไม่มีวรรณยุกต์) · presence/leaderboard เปลี่ยน key onlineId→uid (เอนทรีเก่าลบแล้ว)

**รอบสิบเจ็ด (5 ก.ค. ดึก — Fable ยกเครื่อง UI Lobby ✅ + hotfix):** 🚨 hotfix `3bc1bfe`: commit `9accb89` เผลอติด script tag `js/data/vocab/band1-5.js` ขึ้น production (ไฟล์ยังไม่ commit) → เกมพังทั้งเว็บ `gradeBand is not defined` — แก้โดยชี้กลับ vocab.js เดิม · **บทเรียน: commit ต้องไม่มี script tag ชี้ไฟล์ untracked** · โครงใหม่: บังคับแนวนอน + Lobby (แถบบน + rail ซ้าย + สัตว์กลางจอ stage-hero/stage-plate + การ์ดสดขวา) + ระบบแผง `js/lobby.js` + ธีม `css/lobby.css` (พื้น theme_bg + ฟอนต์ Kanit) + การ์ด Trade HQ `.hq-card` · ผู้ใช้วางภาพของขวัญครบ 50/50

**รอบสิบหก (5 ก.ค. ดึก — Fable):** (1) ถอดปุ่ม "เริ่มเกมใหม่ทั้งหมด (ลบข้อมูล)" ถาวร (อันตราย เด็กเข้าใจผิดเป็น logout) (2) แคตตาล็อกโรงงานแบ่งหน้า 5 รายการ/หน้า (`factoryPage`/`.mkt-pager` + ปัดซ้ายขวา touchstart/touchend + animation slide)

**รอบสิบห้า (5 ก.ค. ดึก — Fable ข้อ 0.1 Google Login ✅):** js/auth.js + #screen-login + logout · state.savedAt/ownerUid+migration · online.js โหลด firebase-auth-compat → authStart แทน onlineStart · main.js bootGame()+guard · ทดสอบ mock ครบ (เคส A–E ผูก/ไม่ผูกเซฟ/cloud vs เครื่อง/บัญชีอื่น) · ✅ ผู้ใช้วาง rules + ทดสอบ login จริงบน Pages ผ่าน (REST 15 เคส)

**รอบสิบสี่ (5 ก.ค. — Fable ระบบโรงงานผลิต 🏭 + ออเดอร์ 📦):** collectibles.js ใหม่ 50 ชิ้น (+tier common+COLLECT_CATS+words) · state producing/orders/producedCount/nextOrderAt + addCraft + newOrder/orderTick · game.js hook 2 จุด · ui.js renderFactory/renderOrdersUI/startProduce/cancelProduce/deliverOrder (แทน marketListings/buyFromMarket เดิม) · ทดสอบครบ (ออเดอร์แรก common เสมอ · ผลิตสำเร็จ · ส่งมอบ · ตั้งขาย · migration) · commit `441a40e`

**รอบสิบสาม (5 ก.ค. — Fable ระบบออนไลน์จริง Firebase):** firebase-config.js + online.js + #leaderboard-card + renderOnlineCard (จริง/จำลอง) + state.onlineId · Firebase โปรเจกต์ english-pet-game (RTDB asia-southeast1) · ทดสอบครบ (fallback/ต่อติด/seed 60+4 presence/ผีค้างกรอง/กระดาน 50 เรียง/อัปเดตสด) · ✅ Security Rules จริงวางแล้ว (presence+leaderboard + validate + indexOn coins · ทดสอบ 10 เคส allow/deny)

**รอบสิบสอง (4 ก.ค. — Opus สินค้าสะสม + ตลาด เฟส 1):** collectibles.js (12 ชิ้น 4 tier) + #collect-card + probeCollectImages + assetValue/migration/marketTick + UI + CSS · ทดสอบครบ (dropdown ค้นหา/ซื้อ+ฉากเปิด/assetValue/ตั้งขาย/ลูกค้าซื้อ/cancelListing/migration) · ผู้ซื้อ-ขายจำลอง

**รอบสิบเอ็ด (4 ก.ค. — Opus แรงค์ net worth + ยกเลิกข้อ 2):** แรงค์ state.coins → **net worth = เหรียญ + assetValue** (ทรัพย์สินคิดราคาเต็ม) · เกณฑ์ยากขึ้นเท่าตัว · ตรวจย้าย addCoins → refreshRank() ใน careTick (เทียบ rankKey) · ทดสอบครบ (ซื้อไม่ตก/ขายไม่ฉลองผิด/ข้ามแรงค์→ฉาก) · ยกเลิกข้อ 2 (โรงเรียนสัตว์)

**รอบสิบ (4 ก.ค. — Opus ข้อ 13 ค่าขยะ):** TRASH_RATE/TRASH_FINE/trashCost + billTick special-case trash (ไม่ตัด/ไม่พัง ค้าง→ปรับ +500 ทบ) + trashBillUI/payTrash · ทดสอบครบ (บิลฟรีเดือนแรก/ค่าปรับทบ/จ่าย/บ้านพังล้าง/migration)

**รอบเก้า (4 ก.ค. — Opus UI ข้อ 12 สวนผลไม้):** renderFarmCard + นาฬิกานับถอยหลังต่อต้น + ต้นสุก→ปุ่มขายโผล่ (readysig) + ขายต้นไม่หายออกผลรอบใหม่ + ปุ่ม `#btn-farm-sellall` เก็บขายรวบ · ทดสอบครบ

**รอบแปด (4 ก.ค. — Opus ข้อ 4,7,8,10,11 + เริ่ม 12):** ข้อ 4 ฝน (rainNow 19:00–20:00 · cause:'rain' · rainProtected) · ข้อ 7 มือถือ (10,000/ขาย 6,000 · โบนัส +5/ข้อ · ค่าเน็ต 1,000/เดือน) · ข้อ 8 โบนัสสอบตามบ้าน (quizBonus 0/100/200) · ข้อ 10 แรงค์ (ภายหลังแทนด้วย net worth รอบสิบเอ็ด) · ข้อ 11 คอม (50,000/ขาย 30,000 · +0.01/วิ compTick · ค่าข้อมูล 5,000/เดือน) · ข้อ 12 fruits.js+state.farm+UI

**รอบเจ็ด (4 ก.ค. — ทดสอบข้อ 6 ค่าน้ำ ✅ 8 รายการ):** ซื้อเพิงบิลน้ำฟรีเดือนแรก · บิลออกวันที่ 1 · ตัดน้ำ+ไฟพร้อมกัน (ภาพมืดชนะแห้ง) · ป่วย cause:thirst (มังกรไม่ immune น้ำ) · ติดตั้งน้ำ+หม้อแปลง+จ่ายค้าง → กลับมา · บ้านพังล้างทุกสถานะ · migration

**รอบหก (4 ก.ค. — ข้อ 6 ค่าน้ำ + refactor UTILITIES/UTILITY_UI กลาง):** smoke test ผ่าน

**รอบห้า (4 ก.ค. — ข้อ 5 ค่าไฟ):** บิลไฟเดือนแรกฟรี · ตัดไฟ (บ้านมืด heatProtected=false ร้อนแม้มีแอร์) · หม้อแปลง 1,000 · จ่ายค้าง→ไฟกลับ · บ้านพังล้าง · **หมายเหตุ:** screenshot อาจติดเฟรมเก่า เช็ก DOM ด้วย eval

**รอบสี่ (4 ก.ค. — ข้อ 3 บ้าน):** ซื้อเพิงบิลฟรีเดือนแรก · ทรุดโทรม (วันที่ 5) · บ้านพัง (ข้ามเดือน) · migration · **หมายเหตุ:** http.server cache เหนียว ให้ fetch(src,{cache:'reload'}) ก่อน reload

**รอบสาม (4 ก.ค. — ข้อ 9 อาหาร):** slot 3 ชม.ปัดขอบ · feast อิ่มข้าม slot · ป่วย cause:hunger · migration pet เดี่ยว→fedUpTo

**รอบสอง:** นาฬิกาเดินทุกวินาที · เพื่อนจำลอง 7 คน · EXP curve ใหม่ · rank_bronze.png

**รอบแรก:** ลงทะเบียน ป.5 band 3 · จับคู่/เคลียร์รอบเหรียญ+RP · ฉาก RANK UP · ซื้อหมา 3,000 · หิว→ป่วย · รักษา 1,000 · feast · ร้อน (มังกร immune) · บ้านกลาง+แอร์หายร้อน · สอบผ่านครั้งแรก +100 · migration
