# TASKS.md — งานถัดไป + ประวัติรอบ (เปิดตอนเลือกงาน / ตามบั๊ก)

> 📂 ราก `C:\Users\rober\english-pet-game\` · เปิดไฟล์ใช้ path เต็ม · สถานะย่อ + กฎ + testkit อยู่ใน `HANDOFF.md` (อ่านนั่นก่อน)
>
> 🧭 **โครงไฟล์นี้แยก 3 ชั้นเสมอ** — กันไม่ให้ session หน้าหลงเดา:
> **① อาการ (ยืนยันแล้ว)** = เห็นจริง/reproduce ได้ · **② เดา (ยังไม่พิสูจน์)** = สมมติฐาน ห้ามลงมือแก้จนพิสูจน์ · **③ งานถัดไป**

## 🟢 ไม่มีบั๊กค้าง
บั๊ก "ของขวัญโดนบัง" ปิดจบรอบ 31 · **ผู้ใช้ทดสอบจริงยืนยันแล้ว 7 ก.ค.** (กล่องยืนยันเด้งหน้าแผง picker ถูกต้อง ไม่บวม)

## 🤖 งานที่มอบ Codex (ChatGPT) ทำอยู่ตอนนี้ — เช็กก่อนเริ่มงานทุกครั้งกันชนกัน
> ผู้ใช้เริ่มใช้ Codex ช่วยงานคู่ขนานกับ session Claude (4 ส.ค. 2026 เหตุ: Claude ติด rate limit) — Codex ไม่เห็น `img/`/`sound/` (ไม่อยู่ใน git) และ **deploy Firebase เองไม่ได้** ต้องรอผู้ใช้รันบนเครื่องเอง
- **10 ส.ค. 2026 — รอบ 1096 Account deletion ผ่าน production แล้ว:** Rules ใหม่ publish/ตรวจสดตรง source และบัญชีทดสอบ `parkerhulk2020@gmail.com` ถูกลบสำเร็จ; รอ COMMIT_DEPLOY ส่ง client fix ที่ตัดพาธ reaction ว่างขึ้นเว็บ

## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)

### 🔫 คิวงานปืน/โลกยานแม่/โลกใหม่ที่รออยู่ (ผู้ใช้อนุมัติล่วงหน้าแล้ว ทำได้เลยไม่ต้องถาม)
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

### 📌 สรุปสถานะล่าสุด (30 ส.ค.) — อ่านก่อน
- **รอบ 1306 · Dragon Sky Siege ลื่นขึ้น:** ต้นตอคือ render ตาม 120/144 Hz, DPR 2, trail/blur/audio buffer/HUD allocation ซ้ำทุกนัดและทุกเฟรม
- ล็อก active 60 FPS, pause 10/countdown 30, DPR 1.5, trail อิงเวลา, particle ring 140, cache noise/gradient และไม่ rebuild HUD ตอน autofire; gameplay/อาวุธ/ฉาก/หางมังกรครบ
- regression performance + production build .1176 + PWA validate ผ่าน; พิกเซลลด 43.75%, render high-Hz ลด 50–58%, trail ลด 68.73%; scope js/lettercannon.js, tools/test_letter_cannon.js
- **รอบ 1305 · Home V2 visual cleanup:** แยก New Word ออกจาก speech, ใส่ภาพโปรไฟล์กลับในกรอบ, ทำปุ่มสัตว์ 4 ปุ่มเต็มใบ และคงสัดส่วนกรอบ Global Feed
- ซ่อนชื่อบ้าน/ปราสาทตามผู้ใช้สั่งและขยายภาพเต็มช่อง; ต้นตอหลักคือ R28 `top:54px` ทับ stage กับ action rail กว้างเกินคอลัมน์กลาง
- syntax + Home V2 regression + production build/validate ผ่าน; scope `css/home-v2.css`, `js/home-v2.js`, `index_classic.html`, `tools/test_home_v2_mobile_preview.js`
- **รอบ 1304 · Dragon Sky Siege ยิงอัตโนมัติ:** ถอดปุ่มยิงซ้าย–ขวาและ state/event ของปุ่มกับ Space ออกจาก HUD ทั้งหมด
- ปืนหลักยิงตาม cadence ของ TRACER/HEAVY/PIERCER อัตโนมัติทุกช่วง active play; ยังหยุดตอน countdown/pause/result และคงปุ่ม Missile เป็นอาวุธพิเศษ
- syntax + regression + production build .1174 + validate ผ่าน; scope js/lettercannon.js, css/lettercannon.css, tools/test_letter_cannon.js
- **รอบ 1302 · Home V2 ครอปรูปเต็มช่อง:** แก้ภาพหดติดมุมซ้ายบน เพราะวัด `getBoundingClientRect()` ตอนกล่อง `popIn scale(.4)`
- ใช้ `stage.clientWidth` ซึ่งเป็นขนาด layout ก่อน transform แล้วคง bounding rect เป็น fallback; สูตร cover จึงวาดรูปเต็มช่องตั้งแต่เปิดกล่อง
- syntax + regression ครอปรูป + Home V2 R29 + production build/validate ผ่าน; scope `js/photo.js`, `tools/test_photo_crop_viewport.js`
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
