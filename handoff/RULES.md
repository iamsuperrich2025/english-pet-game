# RULES.md — Firebase Security Rules

> อ่านไฟล์นี้เมื่อ: แตะ Firebase / เพิ่มโซนใหม่ / ต้องส่ง rules ให้ผู้ใช้ publish
> **⚠️ กติกาผู้ใช้: ส่ง rules ให้ผู้ใช้ต้องส่ง "เต็มทั้งหน้า" เสมอ ห้ามส่งเฉพาะโซน** (คัดลอกทั้งก้อนไปวางทับใน Firebase console → Realtime Database → Rules → Publish)

**Firebase:** โปรเจกต์ `english-pet-game` (Google account ผู้ใช้ · Spark ฟรี) · RTDB `https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app` · console: https://console.firebase.google.com/project/english-pet-game/database
Claude แก้ rules เองไม่ได้ — ต้องส่งให้ผู้ใช้วาง · ทดสอบ allow/deny ผ่าน REST `<dbURL>/<path>.json` ได้ (โซนที่มี auth ต้องทดสอบผ่านหน้าเกมจริง/Emulator เพราะ REST ธรรมดาไม่มี token)

## สถานะการ publish
- ✅ **รอบ 631 (👥 โทรกลุ่ม 3 คน: `/calls` เพิ่ม `r`/`g` + `k` รับ `nofr`/`full` · 🔒 ลบวิดีโอคอลทั้งระบบ) — ผู้ใช้ publish แล้ว 28 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว:** อ่าน `/.settings/rules` สด → **เทียบทั้งไฟล์กับก้อนใน RULES.md = identical ครบ 22 โซน** · `r` ≤128 · `g` ≤400 · `k` enum มี `nofr`/`full` จริง → **ระบบโทรกลุ่มใช้งานได้เต็มระบบ** · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/e018942d-52ae-4908-88c8-b8da6d604b22
- ✅ **รอบ 625 (โซนใหม่ `calls` + `'chat'` ใน enum `/rtc` · 📞 โทรหาเพื่อน voice/video) — ผู้ใช้ publish แล้ว 27 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว:** อ่าน `/.settings/rules` สด → **เทียบทั้งไฟล์กับก้อนใน RULES.md = identical ครบ 22 โซน** · มี `/calls` จริง · `$map === 'chat'` เข้า enum จริง · `d` ≤ 20000 จริง → **ระบบโทรใช้งานได้เต็มระบบแล้ว** (เหลือทดสอบจริง 2 บัญชี/2 เครื่อง) · เดิม: `/calls/<toUid>/<fromUid>` = `{k, n, m, ts}` (k = `ring`/`ok`/`no`/`busy`/`end` · m = `voice`/`video` · n = ชื่อผู้โทร ≤40) · **อ่านได้เฉพาะเจ้าของกล่อง** (`auth.uid === $toUid`) · เขียนได้เฉพาะผู้โทร (node ชื่อ uid ตัวเอง) หรือเจ้าของกล่อง (ไว้ล้างกริ่งที่จัดการแล้ว) · **`/rtc`: เพิ่ม `$map === 'chat'`** (ท่อ SDP/ICE ของสาย ใช้โครงเดิมของ voice chat ในโลก 3D) + ขยาย `d` จาก 8000 → **20000 ตัวอักษร** (SDP ของวิดีโอยาวกว่าเสียงล้วน)
  - **ยังไม่ publish = เกมไม่พัง:** กดปุ่ม 📞/📹 แล้วเขียนโดน deny → จอสายขึ้น **ป้ายเหลืองบอกตรง ๆ** ว่า "ระบบโทรยังไม่เปิดใช้งาน — ต้องอัปเดตกฎความปลอดภัยโซน /calls ก่อน" แล้ววางสายเองใน 3 วิ · แชท/ของขวัญ/ทุกระบบอื่นทำงานปกติ
  - 🔒 **ความปลอดภัยเด็ก:** client รับสายเฉพาะ uid ที่อยู่ใน `/friends` ของตัวเอง (คนแปลกหน้าโทรเข้า = ลบกริ่งทิ้งเงียบ ๆ) · เสียง/ภาพวิ่ง P2P ไม่ผ่านเซิร์ฟเวอร์ · ไม่มีการอัดเก็บ
- ⏳ **รอ publish: โซนใหม่ `wsAward` (รอบ 592 · รางวัลรายเดือน Top 10 แท็บ 🔎 ค้นหาคำ)** · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/6f886d30-28c9-4951-ad61-d85795c35500 — `/wsAward/<YYYY-MM>` = `{at, w:{<uid>:{r:1-10, p:0-10000, n≤40, g≤20, s}}}` · **อ่านสาธารณะ** (ระดับเดียวกับ leaderboard) · **เขียนได้ครั้งเดียวเท่านั้น** (`auth != null && !data.exists()`) = เครื่องแรกที่เปิดเกมหลัง 00:01 ของวันที่ 1 เป็นคน "ตัดรอบ" แล้วใครก็เขียนทับไม่ได้ → ทุกคนเห็นอันดับ/รางวัลชุดเดียวกัน · `$m` ต้องตรง `^[0-9]{4}-[0-9]{2}$` · `at` ห้ามอนาคตเกิน 1 นาที
  - **ยังไม่ publish = เกมไม่พัง:** `set` โดน deny → `js/wsaward.js` เงียบ ๆ ไม่จ่ายรางวัลเดือนนั้น (ลองใหม่รอบเช็กถัดไป) · แท็บ 🔎 ยังโชว์อันดับ + เงินรางวัลของแต่ละอันดับ + กระดานประกาศ ("ถ้าตัดรอบตอนนี้") ได้ปกติ
  - **ความเสี่ยงที่ยอมรับ (ระดับเดียวกับ coins/`sales` ฝั่ง client):** client ที่ดัดแปลงเองอาจชิงเขียน snapshot ที่ยกอันดับตัวเอง — เหรียญเป็นฝั่ง client อยู่แล้ว และ snapshot เขียนได้ครั้งเดียวต่อเดือนจึงจำกัดผลกระทบ
- ✅ **รอบ 590 (field `ws` ใน /leaderboard = แต้มสะสมเกมค้นหาคำ Word Search) — ผู้ใช้ publish แล้ว 26 ก.ค. 2026 · ตรวจ rules สดผ่านครบ:** อ่าน `/.settings/rules` สดด้วย token ของ firebase CLI → **เทียบทั้งไฟล์กับก้อนใน RULES.md = identical ครบ 20 โซน** และมี `ws: {".validate":"newData.isNumber() && newData.val() >= 0"}` จริง · REST: GET /leaderboard = 200 (อ่านสาธารณะ) · PUT ไม่ล็อกอิน = 401 denied · **ผู้เล่นจริงเขียน `ws` ขึ้น DB ได้แล้ว** (พบ `ws:38` ใน /leaderboard) → แท็บ 🔎 ค้นหาคำ เห็นแต้มของเพื่อนได้เต็มระบบ · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/529eb9e8-b60b-4bc0-89e7-0e5699423745
- ✅ **รอบ 362 (โซนใหม่ `ads` = เช่าป้ายโฆษณาเมืองเฮลิฯ) — ผู้ใช้ publish แล้ว 19 ก.ค. 2026 · ตรวจสดผ่านครบ:** REST GET /ads = 200 (อ่านสาธารณะ) · PUT ไม่ล็อกอิน = Permission denied · เทียบ rules สดทั้งไฟล์ (CLI `/.settings/rules`) กับก้อนใน RULES.md = **identical ครบ 20 โซน** + เงื่อนไข expiry/ts clamp/uid เข้าจริง · **โบนัส: ของที่ค้าง publish มาก่อน (รอบ 186 g≤20 · 187 typing · 241 chattheme · 255-256 ba+hs) ติดมากับก้อนนี้ครบแล้ว — ปิดค้างทั้งหมด** · เดิม: `/ads/<n 1-10>` = `{uid, n:ชื่อผู้เช่า ≤40, ts}` · อ่านสาธารณะ (ชื่อโชว์บนป้ายอยู่แล้ว — ระดับเดียวกับ leaderboard) · เขียนได้เมื่อ **ว่าง / หมดอายุ (ts เกิน 7 วัน = 604800000 ms) / ป้ายของตัวเอง** · `uid` ต้อง = auth.uid · `ts` ห้ามอนาคตเกิน 1 นาที (กันจองแช่ถาวร) · **ยังไม่ publish = เกมไม่พัง:** ปุ่ม 🪧 เช่าป้ายกดแล้วเขียนโดน deny → toast บอก "ระบบยังไม่เปิด" **ไม่หักเหรียญ** (หักหลังเขียนสำเร็จเท่านั้น) ป้ายโชว์ข้อความติดต่อโฆษณาเดิม · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/b22a7f09-1429-4645-86df-14a637750a15
- ✅ **รอบ 325 (🐾 ทักทายน้องของเพื่อน) — ผู้ใช้ publish แล้ว 18 ก.ค. 2026 · ตรวจ rules สดผ่าน CLI token แล้ว:** `k` ของ `/gifts` รับ `'shop' | 'collect' | 'greet'` จริงบน server · **เทียบทั้งไฟล์กับก้อนใน RULES.md = ตรงกันเป๊ะทุกโซน (19 โซน identical)** ไม่มีโซนไหนหาย · ของที่เคยค้างมาก่อนติดมาครบด้วย (leaderboard `ba`+`hs` รอบ 255-256 · `chattheme` รอบ 241 · `typing` รอบ 187 · world enum `moto`) → **ปิดค้างทั้งหมด** · เดิม: แก้ **จุดเดียว** ใน `/gifts/$toUid/$fromUid/$giftKey/k` → เพิ่มค่า `'greet'` เข้า enum เดิม (เดิมรับแค่ `'shop'`/`'collect'`) · ไม่มีโซนใหม่ ไม่มี field ใหม่ (ใช้ `id` เก็บรหัสคำทัก เช่น `hi`/`hug`/`treat` ≤40 ตัวอักษรตาม validate เดิม) · **ยังไม่ publish = เกมไม่พัง:** ปุ่ม 🐾 ทักทายน้อง กดแล้วโดน deny → เด้ง toast บอกว่ายังอัปเดตกติกาไม่เสร็จ ส่วนของขวัญปกติ/แชท/ทุกอย่างอื่นทำงานเหมือนเดิมทั้งหมด · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/b7b0dfb7-9e21-48bf-917f-0cdc6cce5136
- ✅ **รอบ 255-256 (field `ba` ตัวละคร blk + `hs` หนีผีรอดนานสุด) — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว):** เดิม: เพิ่มใน `/leaderboard/$uid`: `ba` (string ≤8 เช่น "blk3" — การ์ดโชว์ blk เต็มตัว) + `hs` (number ≥0 วินาที — สถิติหนีผีรอดนานสุด) · **ยังไม่ publish = เกมไม่พัง:** เขียนโดน deny → client ถอยไปเขียนก้อนเดิมอัตโนมัติ (แค่การ์ดคนอื่นไม่มีรูป/สถิติผี) · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก (รวม ba+hs publish ทีเดียวจบ):** https://claude.ai/code/artifact/107ef295-bb7f-4bb1-a381-82b24ab80184
- ✅ **รอบ 241 (โซนใหม่ `chattheme` = ธีมแชทร่วมกันทั้งคู่) — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว):** เดิม: `/chattheme/$pairId` = themeId (string ≤16) · read/write เฉพาะคู่สนทนา (`$pairId.contains(auth.uid)`) · ใครเปลี่ยนธีมแชท อีกฝ่ายเห็นเปลี่ยนตามทันที (เดิมจำแยกในเครื่องใครเครื่องมัน) · **ยังไม่ publish = แชทปกติไม่กระทบ แค่ธีมยังไม่ sync ข้ามเครื่อง** (client เขียนโดน deny เงียบๆ → ตกไปใช้ธีมในเครื่องเดิม) · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/5d652aa8-0a38-4b9c-b98d-dbd4d585b657
- ✅ **รอบ 208 (โซนใหม่ `sales` = ยอดขายสินค้ารวมทั้งเซิร์ฟเวอร์) — ผู้ใช้ publish แล้ว 14 ก.ค. 2026 · ตรวจ REST ผ่าน:** GET /sales = 200 (null · อ่านสาธารณะได้) · PUT /sales ไม่ล็อกอิน = 401 Permission denied (เขียนต้อง auth · กันปั่นยอด) → ยอดขายนับจริงข้ามเครื่องแล้ว · เดิม:** `/sales/$id` = number · `.read:true` (ทุกคนเห็นยอดขาย) · `.write` เฉพาะ auth + **เพิ่มได้ทีละ 1 เท่านั้น** (`newData === data+1` หรือสร้างใหม่ = 1) กันปั่นยอด · client `sellInc(id)` = transaction +1 ตอนซื้อ (robots/cars/tickets/pets/home/phone/computer/ac/items) · **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่าน /sales โดน deny เงียบ → `Online.salesOk=false` · ป้ายโชว์ "ขายไปแล้ว 0 ชิ้น" (+นับ local ของตัวเองในเซสชัน) จนกว่าจะ publish · Artifact ปุ่มคัดลอกก้อนเต็ม (ก้อนเต็มด้านล่างอัปเดตแล้ว)
- ✅ **รอบ 187 (โซนใหม่ `typing` = "กำลังพิมพ์…") — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว):** เดิม: `/typing/$pairId/$uid` = timestamp (number) · read/write เฉพาะคู่สนทนา (`$pairId.contains(auth.uid)` + เขียนได้เฉพาะ node ตัวเอง) · **ยังไม่ publish = แชทปกติไม่กระทบ แค่ไม่เห็นสถานะพิมพ์** (client เขียนโดน deny เงียบๆ) · Artifact เดียวกับรอบ 186 (อัปเดตแล้ว): https://claude.ai/code/artifact/fdfc973b-559a-4a05-b181-f21416cd8cd6
- ✅ **รอบ 186 (แก้บั๊ก "รับเพื่อนไม่ได้" — `g` ≤20 ทั้ง 4 โซน) — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว → บัญชีชั้นเรียนยาวรับเพื่อน/ขึ้นออนไลน์ได้แล้ว):** เดิม: ต้นตอ = ทุกโซนที่มี field `g` (ชั้นเรียน) validate ไว้ `length <= 8` แต่ตัวเลือกชั้นเรียนมี "ปริญญาตรี" (9) · "สูงกว่าปริญญาตรี" (15) · "ต่ำกว่าประถมศึกษา" (17) → บัญชีที่เลือกชั้นยาว เขียน `friends`/`presence`/`leaderboard`/`friendReq` **ไม่ผ่าน validate** = รับเพื่อน/ขึ้นออนไลน์/กระดานไม่ได้เงียบๆ · **แก้: `g` ทั้ง 4 โซน (presence/leaderboard/friendReq/friends) `<= 8` → `<= 20`** (av คงเดิม ≤8) · **ยังไม่ publish = บัญชีชั้นยาวยังรับเพื่อนไม่ได้** · Artifact ปุ่มคัดลอกก้อนเต็ม: https://claude.ai/code/artifact/fdfc973b-559a-4a05-b181-f21416cd8cd6
- ✅ **รอบ 155 (Follow + Feed กิจกรรม) — ผู้ใช้ publish แล้ว 12 ก.ค. 2026:** โซนใหม่ `/feed` (โพสต์กิจกรรมที่เจ้าของเปิดเผย + คลังทรัพย์สิน) + `/follow` (ใคร follow ใคร แบบ TikTok) เข้าแล้ว · **ตรวจ REST จากภายนอกแล้ว:** /presence อ่านได้ 200 (ก้อนรวมไม่พัง) · /feed + /follow อ่าน/เขียนโดยไม่ login โดน 401 Permission denied ถูกต้องครบ 4 เคส · เหลือทดสอบจริง 2 เครื่อง (เปิดเผยกิจกรรม → เพื่อนเห็น + follow + ฟีดขึ้น)
- ✅ **รอบ 317 (โลกมอเตอร์ไซค์เล่นรวมกัน) — ผู้ใช้ publish แล้ว 18 ก.ค. 2026 · ตรวจ rules สดผ่าน CLI แล้ว (`$map === 'moto'` เข้า enum จริง + ก้อนทั้งไฟล์ตรงกับ RULES.md ทุกโซน):** เพิ่ม `$map === 'moto'` ใน enum ของ `/world` (จุดเดียว บรรทัด `.validate` ของ `/world/$map`) — ก้อนเต็มด้านล่างอัปเดตแล้ว · **ยังไม่ publish = ไม่พังอะไร:** โลกมอไซค์เล่นคนเดียวได้ปกติ แค่ยังไม่เห็นเพื่อน (client เขียนโดน deny → ปิดการส่งเงียบๆ `netOk=false` ใน moto3d.js) · ไม่มี field ใหม่ — ยานพาหนะที่เพื่อนขับ ('moto'/'car') ส่งผ่าน field `av` เดิมที่ rules รับอยู่แล้ว
- ✅ **รอบ 132 (ไฟเลี้ยวโลกขับรถ) — publish รวมมากับก้อนรอบ 155 แล้ว 12 ก.ค. 2026** (field `tl` อยู่ในก้อนเดียวกัน) · เดิม: เพิ่ม field `tl` (ไฟเลี้ยว 0=ปิด 1=ซ้าย 2=ขวา · number 0-2) ใน `/world/$map/$uid` — ก้อนเต็มด้านล่างอัปเดตแล้ว + Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/59c3da79-b3cc-4053-b5f3-5283b4729b7a · **ยังไม่ publish = เกมไม่พัง:** client ส่ง tl เฉพาะตอนเปิดไฟ ถ้าเขียนโดน deny จะตัด tl ส่งซ้ำทันที (`netTlOk` ใน sendPos adventure3d.js) — multiplayer เดินต่อปกติ แค่เพื่อนไม่เห็นไฟเลี้ยวจนกว่าจะ publish
- ✅ **รอบ 124 (ตลาดออนไลน์จริง — item 2) ผู้ใช้ publish แล้ว 11 ก.ค. 2026:** โซนใหม่ `/market` + `/msold` เข้าแล้ว · **ตรวจ REST จากภายนอกแล้ว:** /presence อ่านได้ 200 (rules ทั้งก้อนไม่พัง) · /market อ่านโดยไม่ login โดน 401 Permission denied ถูกต้อง · เหลือทดสอบซื้อ-ขายจริง 2 บัญชี/2 เครื่อง · ความเสี่ยงที่ยอมรับ: ซื้อ=ลบ node ของคนอื่นได้ (จำเป็นต่อกลไกซื้อ) + ใบเสร็จเขียนได้ทุก auth แต่ฝั่งคนขายจ่ายเฉพาะใบเสร็จที่ (1) ตรง netKey ของประกาศตัวเอง (2) ของหลุดจากตลาดแล้วจริง — ระดับเดียวกับ coins ฝั่ง client
- ✅ **รอบ 113 (โลกขับรถ drive + โดรน drone) — ผู้ใช้ publish แล้ว 10 ก.ค. 2026** (ผู้ใช้ยืนยันเองหลังได้ Artifact ปุ่มคัดลอก): map `drive`+`drone` เข้า enum ครบ 4 จุด (/world $map · /tinv map · /rtc · /class $map) → multiplayer/voice/ครูคุมห้องใช้ได้ทั้งโลกขับรถและโดรน · เหลือทดสอบจริง 2 เครื่อง
- ~~⏳ รอบ 85 (โลกโดรน FPV) — publish รวมไปกับรอบ 113 แล้ว~~ **รอบ 85 (โลกโดรน FPV) — เดิมค้าง publish:** เพิ่ม map `drone` ใน enum 4 จุด (/world $map · /tinv map · /rtc · /class $map) — ก้อนเต็มด้านล่างอัปเดตแล้ว · **ยังไม่ publish = โดรนเล่นคนเดียวได้ปกติ แต่ multiplayer/voice/ครูคุมห้องของโลกโดรนจะยังไม่ทำงาน** (เขียน /world/drone โดน deny เงียบๆ ไม่พังเกม) · โครงเหมือนโลกเฮลิฯเป๊ะ ไม่หย่อน security
- ✅ **รอบ 82 (คำเดียวกันในปาร์ตี้) publish แล้ว 9 ก.ค. 2026:** field `cw` (คำเป้าหมาย string "en|th" ≤60) ใน `/world/$map/$uid` เข้าแล้ว · ยืนยัน logic ฝั่ง client ด้วยการจำลอง peer 8 เคสผ่านหมด (leader election / ลูกทีมตามคำหัวหน้า / guard `lastSharedDone` / คนทั่วไปไม่ส่ง cw ไม่ผูก rules / คำมีอยู่แล้วดันขึ้นหน้าไม่ซ้ำ)
- ✅ **รอบ 52 (โลกเฮลิคอปเตอร์) publish แล้วพร้อมกัน 9 ก.ค. 2026:** map `heli` ในทุก enum (/world /rtc /class /tinv) + field `y` (ความสูงบิน) ใน /world เข้าแล้ว (มาในก้อนเต็มเดียวกัน)
- ⏳ เหลือ**ทดสอบจริง 2 บัญชี/2 เครื่องบน Pages** (เห็นคำเดียวกันตอน invite กันเข้าโลกเฮลิฯ + online เฮลิฯ ทั้งหมด)
- ✅ ชุดก่อนหน้า publish แล้ว 8 ก.ค. 2026 (ครบถึงรอบ 49): `/presence` `/leaderboard` `/users` `/friendCodes` `/friendReq` `/friends` `/chats` `/gifts` `/world` (รวม c/ct/m/w) `/tinv` `/rtc` `/class` (muteAll+podium)
- ✅ ตรวจจากภายนอกแล้ว (curl REST): /presence อ่านได้ 200 · /world และ /class อ่าน/เขียนโดยไม่ login โดน 401 Permission denied ถูกต้อง
- ⏳ เหลือ**ทดสอบจริง 2 บัญชี/2 เครื่องบน Pages** (ดู checklist ใน TASKS.md)
- 🔑 ทุกครั้งที่เพิ่มโซนใหม่ → ส่งก้อนเต็มด้านล่างให้ผู้ใช้ publish ใหม่
- ⏳ **รอ publish: field `hp` ใน /world (รอบ 376)** — ตำแหน่งลำแดงที่จอดทิ้งไว้ "x,z,y,yaw" ≤28 ตัว · ยังไม่ publish เกมไม่พัง (client ตัด hp ส่งซ้ำเอง แพตเทิร์น tl) แค่เพื่อนยังไม่เห็นลำจอด

## ก้อนเต็ม (ครอบ 0.1+0.2+0.3+0.4+0.5 + โลก 3D)

```json
{
  "rules": {
    "presence": {
      ".read": true,
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['n','g','act','at'])",
        "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":   { ".validate": "newData.isString() && newData.val().length <= 20" },
        "act": { ".validate": "newData.isString() && newData.val().length <= 60" },
        "at":  { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "leaderboard": {
      ".read": true,
      ".indexOn": "coins",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['n','g','coins','at'])",
        "n":     { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":     { ".validate": "newData.isString() && newData.val().length <= 20" },
        "coins": { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "av":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ni":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "bk":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ba":    { ".validate": "newData.isString() && newData.val().length <= 8" },
        "hs":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ws":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "at":    { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "friendCodes": {
      "$code": {
        ".read": true,
        ".write": "auth != null && newData.val() === auth.uid",
        ".validate": "newData.isString()"
      }
    },
    "friendReq": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "newData.hasChildren(['n','g','ts'])",
          "n":  { ".validate": "newData.isString() && newData.val().length <= 40" },
          "g":  { ".validate": "newData.isString() && newData.val().length <= 20" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "friends": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "$friendUid": {
          ".write": "auth != null && (auth.uid === $uid || auth.uid === $friendUid)",
          ".validate": "newData.hasChildren(['n','g','ts'])",
          "n":  { ".validate": "newData.isString() && newData.val().length <= 40" },
          "g":  { ".validate": "newData.isString() && newData.val().length <= 20" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "chats": {
      "$pairId": {
        ".read":  "auth != null && $pairId.contains(auth.uid)",
        ".write": "auth != null && $pairId.contains(auth.uid)",
        "$msgId": {
          ".validate": "newData.hasChildren(['f','t','ts'])",
          "f":  { ".validate": "newData.isString() && newData.val() === auth.uid" },
          "t":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 200" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "typing": {
      "$pairId": {
        ".read": "auth != null && $pairId.contains(auth.uid)",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid && $pairId.contains(auth.uid)",
          ".validate": "newData.isNumber()"
        }
      }
    },
    "chattheme": {
      "$pairId": {
        ".read":  "auth != null && $pairId.contains(auth.uid)",
        ".write": "auth != null && $pairId.contains(auth.uid)",
        ".validate": "newData.isString() && newData.val().length <= 16"
      }
    },
    "gifts": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".read":  "auth != null && auth.uid === $fromUid",
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          "$giftKey": {
            ".validate": "newData.hasChildren(['k','id','fn','ts','st'])",
            "k":  { ".validate": "newData.isString() && (newData.val() === 'shop' || newData.val() === 'collect' || newData.val() === 'greet')" },
            "id": { ".validate": "newData.isString() && newData.val().length <= 40" },
            "fn": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "ts": { ".validate": "newData.isNumber()" },
            "st": { ".validate": "newData.isString() && (newData.val() === 'pending' || newData.val() === 'accepted' || newData.val() === 'declined')" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid",
        "save": {
          "data": { ".validate": "newData.isString()" },
          "at":   { ".validate": "newData.isNumber()" }
        },
        "profile": {
          "name": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 20" }
        }
      }
    },
    "world": {
      "$map": {
        ".read": "auth != null",
        ".validate": "$map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive' || $map === 'moto' || $map === 'invasion'",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid",
          ".validate": "newData.hasChildren(['n','x','z','yaw','ts'])",
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "av":  { ".validate": "newData.isString() && newData.val().length <= 8" },
          "x":   { ".validate": "newData.isNumber()" },
          "z":   { ".validate": "newData.isNumber()" },
          "y":   { ".validate": "newData.isNumber()" },
          "yaw": { ".validate": "newData.isNumber()" },
          "ts":  { ".validate": "newData.isNumber()" },
          "c":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 60" },
          "ct":  { ".validate": "newData.isNumber()" },
          "m":   { ".validate": "newData.isNumber()" },
          "w":   { ".validate": "newData.isNumber() && newData.val() >= 0" },
          "cw":  { ".validate": "newData.isString() && newData.val().length <= 60" },
          "tl":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 2" },
          "hp":  { ".validate": "newData.isString() && newData.val().length <= 28" },
          "$other": { ".validate": false }
        }
      }
    },
    "tinv": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "newData.hasChildren(['map','n','ts'])",
          "map": { ".validate": "newData.isString() && (newData.val() === 'adv' || newData.val() === 'haunt' || newData.val() === 'heli' || newData.val() === 'drone' || newData.val() === 'drive')" },
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts":  { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "rtc": {
      "$map": {
        "$toUid": {
          ".read": "auth != null && auth.uid === $toUid",
          ".write": "auth != null && auth.uid === $toUid",
          "$msgId": {
            ".write": "auth != null && newData.child('f').val() === auth.uid",
            ".validate": "($map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive' || $map === 'chat') && newData.hasChildren(['f','t','d','ts'])",
            "f":  { ".validate": "newData.isString() && newData.val().length <= 128" },
            "t":  { ".validate": "newData.isString() && (newData.val() === 'offer' || newData.val() === 'answer' || newData.val() === 'ice')" },
            "d":  { ".validate": "newData.isString() && newData.val().length <= 20000" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "calls": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        ".write": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "newData.hasChildren(['k','ts'])",
          "k":  { ".validate": "newData.isString() && (newData.val() === 'ring' || newData.val() === 'ok' || newData.val() === 'no' || newData.val() === 'busy' || newData.val() === 'end' || newData.val() === 'nofr' || newData.val() === 'full')" },
          "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "m":  { ".validate": "newData.isString() && (newData.val() === 'voice' || newData.val() === 'video')" },
          "r":  { ".validate": "newData.isString() && newData.val().length <= 128" },
          "g":  { ".validate": "newData.isString() && newData.val().length <= 400" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "market": {
      ".read": "auth != null",
      "$key": {
        ".write": "auth != null && ((!data.exists() && newData.child('sid').val() === auth.uid) || (data.exists() && !newData.exists()))",
        ".validate": "newData.hasChildren(['sid','sn','id','p','ts'])",
        "sid": { ".validate": "newData.isString() && newData.val().length <= 128" },
        "sn":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "id":  { ".validate": "newData.isString() && newData.val().length <= 40" },
        "p":   { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 1000000" },
        "ts":  { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "msold": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "$key": {
          ".write": "auth != null && ((!data.exists() && newData.exists()) || (auth.uid === $uid && !newData.exists()))",
          ".validate": "newData.hasChildren(['id','p','bn','ts'])",
          "id": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "p":  { ".validate": "newData.isNumber() && newData.val() >= 1" },
          "bn": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "feed": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid",
        "p": {
          "$postId": {
            ".validate": "newData.hasChildren(['c','tx','ts'])",
            "c":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 12" },
            "tx": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 120" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        },
        "a": { ".validate": "newData.isString() && newData.val().length <= 4000" },
        "pt": { ".validate": "newData.isString() && newData.val().length <= 2000" },
        "$other": { ".validate": false }
      }
    },
    "follow": {
      "$uid": {
        ".read": "auth != null",
        "$followerUid": {
          ".write": "auth != null && auth.uid === $followerUid",
          ".validate": "newData.hasChildren(['n','ts'])",
          "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "sales": {
      ".read": true,
      "$id": {
        ".write": "auth != null && newData.isNumber() && ((!data.exists() && newData.val() === 1) || (data.exists() && newData.val() === data.val() + 1))",
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    },
    "ads": {
      ".read": true,
      "$n": {
        ".write": "auth != null && ($n === '1' || $n === '2' || $n === '3' || $n === '4' || $n === '5' || $n === '6' || $n === '7' || $n === '8' || $n === '9' || $n === '10') && (!data.exists() || data.child('ts').val() < now - 604800000 || data.child('uid').val() === auth.uid)",
        ".validate": "newData.hasChildren(['uid','n','ts'])",
        "uid": { ".validate": "newData.isString() && newData.val() === auth.uid" },
        "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "ts":  { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "$other": { ".validate": false }
      }
    },
    "wsAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".validate": "newData.hasChildren(['r','p','n'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "class": {
      "$map": {
        ".read": "auth != null",
        ".validate": "$map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive'",
        "muteAll": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['on','by','ts'])",
          "on": { ".validate": "newData.isBoolean()" },
          "by": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        },
        "podium": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['id','by','ts'])",
          "id": { ".validate": "newData.isNumber()" },
          "by": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "top": {
            "$i": {
              ".validate": "newData.hasChildren(['u','n','w'])",
              "u": { ".validate": "newData.isString() && newData.val().length <= 128" },
              "n": { ".validate": "newData.isString() && newData.val().length <= 40" },
              "w": { ".validate": "newData.isNumber() && newData.val() >= 0" },
              "$other": { ".validate": false }
            }
          },
          "$other": { ".validate": false }
        },
        "$other": { ".validate": false }
      }
    }
  }
}
```

## หมายเหตุโครง /world + /tinv (โลก 3D multiplayer — รอบสี่สิบ)
- `/world/<map>/<uid> = {n, av, x, z, yaw, ts, c?, ct?, m?, w?, tl?, hp?}` — **hp = ลำแดงจอดทิ้งไว้ (รอบ 376)**: สตริง "x,z,y,yaw" ≤28 ส่งเฉพาะโลกเฮลิฯ ตอนไม่ได้ขับ+ลำพ้นลานกลาง >4m · ฝั่งรับ heliMeshBuild วาดลำแดงตรงนั้น · deny = client ตัด hp ส่งซ้ำเอง — ตำแหน่งผู้เล่นใน map ('adv'|'haunt') · เขียนเองอ่านได้ทุกคนที่ login · onDisconnect ลบตัวเอง · ส่งถี่สุด ~5.5Hz เฉพาะตอนขยับ · **c/ct = แชทลอยหัว (รอบ 42)**: ข้อความ ≤60 + Date.now ฝั่งส่ง (คงที่ต่อข้อความ — ฝั่งรับเห็น ct เปลี่ยน = ข้อความใหม่ โชว์ 5 วิ) แนบไปกับ set ระหว่างยังสด ผ่านตัวกรอง nameHasBadWord ก่อนส่ง · **m = สถานะไมค์ (รอบ 44 — โชว์ 🎤 เหนือหัว)** · **w = จำนวนคำที่ประกอบได้รอบนี้ (รอบ 46 — กระดานคะแนนสด 🏆 มุมซ้ายบน)** · **tl = ไฟเลี้ยวโหมดขับรถ (รอบ 132 — 1=ซ้าย 2=ขวา · ปิดไม่ส่ง field · ฝั่งรับวาดไฟกะพริบบนรถบล็อกเพื่อน · เขียนโดน deny = client ตัด tl ส่งซ้ำเอง ไม่พังเกม)**
- `/tinv/<toUid>/<fromUid> = {map, n, ts}` — คำเชิญเล่นโลก 3D ด้วยกัน · ผู้รับอ่านกล่องตัวเอง ผู้ส่ง/ผู้รับลบได้ · ฝั่งส่งจำใน state.tinvSent (เซฟ cloud) · เจอกันใน map จริงครั้งแรก → ต่างคนต่างรับเงินคืน TINV_CASHBACK (2,000) ฝั่ง client แล้วผู้รับลบคำเชิญ

## หมายเหตุโครง /class (ครูคุมห้อง — รอบ 44 + พิธีแชมป์รอบ 48)
- `/class/<map>/muteAll = {on:bool, by:ชื่อครู, ts}` — สถานะ "ครูปิดเสียงทั้งห้อง" ค้างใน DB (เด็กเข้าทีหลังก็โดนล็อก) · ทุก client ฟัง on('value') → ล็อกปุ่มไมค์+ตัดไมค์ที่เปิดค้าง
- `/class/<map>/podium = {id:Date.now ฝั่งครู, by, ts, top:[{u,n,w}×≤3]}` — ครูกด 🏁 จบรอบแข่ง → ทุกเครื่องเห็นโพเดียม 🥇🥈🥉 + แตร + คนติดอันดับรับโบนัส 100/50/25 (เช็ก uid ตัวเอง) + sessionWords รีเซ็ตเริ่มรอบใหม่ · **ครูลบ node เองใน 15 วิ** + client กันเล่นซ้ำด้วย id ในหน่วยความจำ และไม่เล่นพิธีที่ id เก่ากว่า 5 นาที (ไม่ persist ใน state — เลี่ยงชนกับ session คู่ขนาน)
- **บัญชีครู = อีเมลใน `TEACHER_EMAILS` (js/auth.js — เพิ่มอีเมลต่อท้าย array ได้)** เห็นปุ่ม 👩‍🏫 · ⚠️ rules ยอมให้ทุก auth เขียนได้ (UI ซ่อนปุ่มจากเด็ก) — ยอมรับระดับความเสี่ยงเดียวกับ coins ฝั่ง client · field `m` ใน /world = สถานะไมค์ (โชว์ 🎤 เหนือหัว)

## หมายเหตุโครง /rtc (voice chat — รอบ 43)
- `/rtc/<map>/<toUid>/<msgId> = {f:ผู้ส่ง, t:'offer'|'answer'|'ice', d:JSON(SDP/ICE ≤8000), ts}` — **signaling เท่านั้น เสียงจริงวิ่ง P2P (WebRTC) ไม่ผ่าน Firebase**
- ผู้รับอ่าน+ลบกล่องตัวเอง (ประมวลผลแล้วลบทันที + ล้างตอน join) · คนอื่น push ได้เฉพาะข้อความที่ `f` = uid ตัวเอง
- **`$map === 'chat'` (รอบ 625) = ท่อ signaling ของ "สายโทรหาเพื่อน" (voice/video call)** — ไม่ใช่แผนที่จริง ใช้ path เดียวกันเพื่อไม่ต้องเพิ่มโครงใหม่ · ฝั่งเกม = `Call` ใน `js/online.js`

## หมายเหตุโครง /calls (📞 โทรหาเพื่อน — รอบ 625 · กลุ่ม 3 คน รอบ 631)
- `/calls/<toUid>/<fromUid> = {k, n, m, ts, r, g}` — **กริ่ง + สถานะสายเท่านั้น** (เสียงวิ่ง P2P ผ่าน WebRTC ไม่ผ่าน Firebase ไม่มีการอัดเก็บ)
- 👥 **รอบ 631 (คุยกลุ่ม 3 คน):** `r` = รหัสห้อง (uid คนเปิดสาย) · `g` = uid คนที่อยู่ในห้องแล้ว คั่นด้วย `,` (ผู้ถูกชวนต่อ mesh ให้ครบทุกคน) · `k` เพิ่ม `'nofr'` (ยังไม่ได้เป็นเพื่อนกันครบ) และ `'full'` (ห้องเต็ม)
- 🔒 **รอบ 631 ลบวิดีโอคอลออกทั้งระบบ (ผู้ใช้สั่ง — ป้องกันมิจฉาชีพ):** เหลือสายเสียงล้วน · `m` ยังปล่อยผ่านใน rules เผื่อเครื่องที่เปิดค้างเวอร์ชันเก่ายังส่งมา (ฝั่งรับไม่สนใจค่านี้แล้ว)
- 🔒 **เข้ากลุ่มได้เมื่อเป็นเพื่อนกันครบทุกคน** — อ่าน `/friends` ของคนอื่นไม่ได้ตาม rules → ผู้ถูกชวนเป็นคนตรวจเองว่าทุก uid ใน `g` อยู่ใน `/friends` ของตัวเอง ไม่ครบ = ตอบ `nofr` ไม่ต่อสาย (และไม่เปิดไมค์)
- ผู้โทรตั้ง `onDisconnect().remove()` บน node ของตัวเอง → ปิดแท็บ/เน็ตหลุดกลางกริ่ง สายฝั่งโน้นดับเอง · วางสายแล้วทั้งสองฝ่ายลบ node ของตัวเองในกล่องอีกฝ่าย
- client กรอง "เฉพาะเพื่อนใน `/friends`" ก่อนเด้งกริ่ง (rules เปิดให้ auth ใดก็เขียนกล่องได้ เหมือน `/gifts`/`/friendReq` — กันสแปมที่ชั้น client + ไม่มีข้อมูลส่วนตัวใน node)

- ฝั่งเกม: `Voice` ใน adventure3d.js — mesh ต่อสายเมื่อเจอกันใน map (uid น้อยกว่าเป็นผู้ offer) · STUN ของ Google ฟรี ไม่มี TURN (เน็ตมือถือบางเจ้าอาจต่อไม่ติด — ข้อจำกัดที่ยอมรับ) · ไมค์ default ปิดทุกครั้งที่เข้า

## หมายเหตุโครง /market + /msold (ตลาดออนไลน์จริง — รอบ 124 · item 2)
- `/market/<key> = {sid:uid คนขาย, sn:ชื่อคนขาย, id:collectible, p:ราคา, ts}` — ลงขาย: push node ตัวเอง (sid ต้อง = auth.uid) · **ซื้อ/ถอน = ลบ node** (transaction คนแรกได้ · ลบ node คนอื่นได้ = กลไกซื้อ) · แก้ไข node ไม่ได้ (อยากเปลี่ยนราคา = ถอนแล้วลงใหม่)
- `/msold/<sellerUid>/<key> = {id, p, bn:ชื่อผู้ซื้อ, ts}` — ใบเสร็จจากผู้ซื้อ · คนขายอ่าน-ลบกล่องตัวเอง · ใครก็เขียนได้ (สร้างใหม่เท่านั้น) → **ฝั่งคนขายกันใบเสร็จปลอม 2 ชั้น:** จ่ายเฉพาะที่ตรง `netKey` ใน state.listings ตัวเอง + เช็กว่า `/market/<key>` หายไปแล้วจริง
- ฝั่งเกม: `marketWatch/marketList/marketUnlist/marketBuy/marketSoldWatch` (online.js) · ประกาศจริงมี `netKey` ใน state.listings — `marketTick` จำลองจะไม่แตะ · rules ยังไม่ publish → `Online.marketOk=false` เกมใช้ตลาดจำลองเดิมอัตโนมัติ

## หมายเหตุโครง /feed + /follow (Follow + Feed กิจกรรม — รอบ 155)
- `/feed/<uid>/p/<pushKey> = {c:หมวด ≤12, tx:ข้อความไทย ≤120, ts}` — โพสต์กิจกรรมที่**เจ้าของเขียนเองเท่านั้น** (เขียนเฉพาะหมวดที่เปิดใน `state.feedShare` — default ปิดทุกหมวด) · เก็บ 30 ล่าสุด (client prune เองหลัง push) · login แล้วอ่านได้ทุกคน (เปิดหน้า profile ใครก็เห็น — ผู้ใช้เคาะ 12 ก.ค.)
- `/feed/<uid>/a = JSON string {collectId:จำนวน} ≤4000` — คลังทรัพย์สินที่เปิดเผย (สวิตช์ "เปิดเผยทรัพย์สิน") · ปิดสวิตช์ = client ลบทิ้ง · หมวด c ที่ใช้ตอนนี้: coin/quiz/goods/other (ดู FEED_CATS ใน state.js — เผื่อ ≤12 ไว้ให้หมวดใหม่)
- `/follow/<targetUid>/<followerUid> = {n:ชื่อผู้ติดตาม ≤40, ts}` — follow ทางเดียวแบบ TikTok ไม่ต้องอนุมัติ · ผู้ติดตามเขียน/ลบ node ตัวเองเท่านั้น · อ่านได้ทุกคนที่ login (ไว้นับยอดผู้ติดตามในหน้า profile)
- ฝั่งเกม: `feedEvent/feedPrune/feedPurgeCat/feedPushAssets/followSet/followUnset/feedWatchSync/fetchPlayerFeed/fetchPlayerAssets/fetchFollowers` (online.js) · รายชื่อที่เรา follow เก็บใน `state.follows` (เซฟ cloud — DB ฝั่ง /follow ไว้โชว์ยอด/ให้เป้าหมายรู้) · ปิดหมวดในตั้งค่า = `feedPurgeCat` ลบโพสต์เก่าหมวดนั้นออกจาก DB ด้วย

## หมายเหตุโครง /gifts (ข้อ 0.5)
- `/gifts/<toUid>/<fromUid>/<giftKey> = {k:'shop'|'collect', id, fn:ชื่อผู้ส่ง, ts, st:'pending'|'accepted'|'declined'}`
- ผู้รับอ่านทั้งกล่อง `/gifts/<toUid>` (auth.uid===toUid) · ผู้ส่งอ่าน-เขียนเฉพาะซับทรีตัวเอง `/gifts/<toUid>/<fromUid>` (เฝ้าสถานะ+คืนของ)
- คลัง collectible เป็น state ในเครื่อง (ไม่ได้อยู่ใน DB) → "คืนของ" ตอนถูกปฏิเสธ/หมดอายุ ทำที่ฝั่งผู้ส่ง (giftOutWatch) เมื่อผู้ส่งออนไลน์
