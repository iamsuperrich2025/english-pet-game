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

#### 🔫 งานยานแม่ (จบแล้ว)
1. **ทหารฝ่ายเราตะโกนบอกทิศศัตรู** ✅ รอบ 471
2. **เป้าฝึกยิงในสมรภูมิ** ✅ รอบ 471
3. **โหมดกลางคืน** ✅ รอบ 471 / 474

✅ **รอบ 474 (เวลาเดินเอง + ไฟถนน) ขึ้นเว็บแล้ว deploy `.462`**

#### 🏍️ งานโลกใหม่: ขับมอเตอร์ไซค์/รถยนต์ (30 ก.ค.)
- ✅ ชนหมา = ปรับ 10 เหรียญ ต่อครั้ง — เสร็จรอบ 830

### 📌 สรุปสถานะล่าสุด (22 ส.ค.) — อ่านก่อน
- **รอบ 1240 · Vocab Sky Solid Colliders:** แก้ตัวละครเดินทะลุหนังสือ ดินสอ บล็อก ABC น้ำพุ ต้นไม้ และด้านข้างแท่น ด้วย capsule-vs-circle/rotated-box collider; หนังสือ/บล็อกยืนบนด้านบนได้ (`js/skyplay3d.js`)
- ต้นตอคือระบบเดิมมีเฉพาะ top support กับประตู จึงไม่กันด้านข้าง/พร็อพ; collider เคลื่อนตาม moving/disappearing platform และเคารพระดับความสูง ไม่เปลี่ยนเส้นทางหรือรางวัล
- syntax+Sky regression (รวมจำลอง push-out/rotated collider)+diff+production build/PWA validator ผ่าน; browser QA ถูก Windows ACL ปิด ไม่แตะ Rules/เงิน/`css/petshopping3d.css`/งาน session อื่น (`tools/test_skyplay3d.js`)
- **รอบ 1239 · Shoot Word ชั้น/รางวัล/เสียง:** จัดหิ้ง 3 ชั้นให้ตัวอักษรชั้น 2–3 ไม่ถูกบัง; ยิงถูกตามลำดับได้ 5 เหรียญ/ตัวทันทีพร้อมภาพ+เสียงเหรียญ และอ่าน A–Z ทุกแผ่นที่ยิงโดน (`js/shootword.js`)
- ไม่จ่ายเหรียญซ้ำตอนครบคำ; คงแต้มอันดับ/สมุดคำ/เป็ดโบนัสเดิม; เสียงทั้งคำรอ 700ms ไม่ตัดเสียงตัวสุดท้าย
- syntax+diff-check+ชุดตรวจโครงสร้าง/ฉายกล้อง 812×375 ผ่าน: ชั้น 1 `188.8–206.7`, ชั้น 2 `166.2–180.2`, ชั้น 3 `139.5–151.8px`; ไม่แตะ `css/petshopping3d.css` ของ session อื่น
- **รอบ 1238 · Vocab Sky Dragon Tail + Floating Joystick:** เปลี่ยนหางมังกรจากเหลืองเป็นฟ้าและเพิ่มครีบสามเหลี่ยม 4 ชิ้นเรียงตลอดสันหางด้วย `InstancedMesh` 1 draw call (`js/skyplay3d.js`)
- เปลี่ยน joystick มือถือเป็นแบบ floating: แตะพื้นที่ว่างตรงไหนก็ได้ในครึ่งจอซ้ายแล้ววงย้ายศูนย์ไปใต้ปลายนิ้ว; ไม่แย่งปุ่ม/HUD/กล้องขวา, รองรับปล่อยนิ้ว/สลับแอปโดยไม่ค้าง
- Chromium touch QA 812×375 ย้ายศูนย์ `(50,327)` → `(250,260)`, ตัวละครเคลื่อนจริงและ knob คืนศูนย์; ครีบจริง 4 instance สี `#9cefff`, 6 คน 145 calls/8,640 triangles, console 0
- syntax+Sky structural/Beta/seam+diff+production build/PWA validator ผ่าน; ไม่แตะ Rules/สิทธิ์/รางวัล/`css/petshopping3d.css`/งาน session อื่น (`tools/test_skyplay3d.js`)
- **รอบ 1235 · Vocab Sky Playground Phase 5:** เพิ่ม Teacher Lesson Packs บันทึกในเครื่อง, playlist ความหมาย→ฟัง→สะกด, Ready Check และ host/student reconnect+late join โดยคง Phase 1–4/C4-S4 เดิม (`js/skyplay3d.js`, `css/skyplay3d.css`)
- เพิ่มรายงานรายคน+รายคำ, CSV/พิมพ์/รายงานย้อนหลัง; ผู้ใช้อนุญาต `R5` answer telemetry แบบย่อผ่าน `cw` เดิม ≤60; ไม่เพิ่ม Firebase path/rules/เงิน และคง NetRoom sky 6 คน
- 812×375 pack/ready/live/summary ไม่ scroll; browser QA ทุกค่าผ่านรวม save/load/host+student reconnect/disconnect/late join/teardown/Phase 4 compatibility/reportWordStats, console 0; structural+R5 split/merge+NetRoom 52/52+diff ผ่าน
- Production build 8,395 ไฟล์ + PWA/cache/TWA validator ผ่าน; ไม่แตะ `css/petshopping3d.css`/งาน session อื่น · ค้างแค่ลิงก์เข้า Lobby ซึ่งผู้ใช้กำหนดให้ทำภายหลัง
- **รอบ 1233 · Vocab Sky Playground Phase 4:** เพิ่ม Classroom Sky Events ให้ครูเลือกคำจาก vocab เดิม 3–5 คำ, 30/60/90 วินาที และโหมดความหมาย/ฟัง/สะกด พร้อมผลสรุปสด+ปิดรอบ (`js/skyplay3d.js`, `css/skyplay3d.css`)
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
