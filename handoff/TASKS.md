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

### 📌 สรุปสถานะล่าสุด (14 ส.ค.) — อ่านก่อน
- **รอบ 1177 · กู้สินค้าตลาดหายย้อนหลังตั้งแต่รหัสซื้อ 6 หลัก:** audit live 51 บัญชี พบผู้เสียหาย 12 บัญชี/29 ชิ้นจาก `netKey` ที่ไม่มีทั้ง `/market` และ `/msold`; Cloud Audit Logs ไม่ได้เปิดจึงระบุผู้ซื้อไม่ได้ และ flow เสียไม่เคยหักเงิน/ส่งของผู้ซื้อ
- สำรอง `/users` `/market` `/msold` ก่อนแก้; คืนด้วย snapshot คู่ + ตรวจซ้ำรายบัญชี และใช้ Firebase ETag compare-and-set กับบัญชี active ป้องกันเขียนทับความคืบหน้า/คืนซ้ำ
- ยืนยัน cloud ถาวรแล้ว 11 บัญชี/28 ชิ้น; อีก 1 บัญชี active ใช้ client เก่าเขียน listing กลับ จึงให้แพตช์รอบ 1176 ตรวจ path จริงและคืนจาก state สดทันทีหลังรับ deploy รอบนี้
- **รอบ 1176 · ตรวจตลาดจริงและคืนรายการขายค้างอัตโนมัติ:** เดิม UI เห็น `netKey` ก็อ้างว่าแขวนออนไลน์ แม้ `/market` ถูกลบแล้ว; เปลี่ยนเป็นสถานะ checking/online/sold จาก Firebase จริง
- รายการที่ไม่พบทั้ง `/market/<key>` และ `/msold/<uid>/<key>` หลังเว้น 3.5 วินาที จะถูกลบจากรายการขาย คืนสินค้าเข้าคลังหนึ่งครั้ง และแจ้งเพียง “การลงขายสินค้านี้ไม่สำเร็จ”; อ่านยืนยันไม่ได้จะไม่แตะสินค้า
- แก้ `js/online.js`, `js/ui.js`; เพิ่ม `tools/test_market_listing_reconcile.js` ครอบ live/sold/stale/retry-no-duplicate; market-buy regression, syntax/diff, build `.1062` 8,336 ไฟล์ 464.9 MiB และ PWA validator ผ่าน
- **รอบ 1174 · แก้ซื้อของตลาดออนไลน์แล้วของหาย:** Firebase Transaction ลบ node ด้วย `null` ทำให้ snapshot หลังลบว่าง แต่โค้ดเดิมนำ snapshot ว่างไปออกใบเสร็จ จึงขึ้น `invalid` ทั้งที่ของถูกลบแล้ว
- แก้ `js/online.js` สำเนารายการที่ตรวจผู้ขาย/สินค้า/ราคาครบภายใน transaction ก่อนลบ แล้วใช้สำเนาสร้างใบเสร็จและคืนผลให้ผู้ซื้อ; คนแรกได้ตามเดิม
- เพิ่ม `tools/test_market_buy_transaction.js`; จำลอง snapshot หลังลบเป็น null แล้วยืนยันผู้ซื้อได้ข้อมูลครบ + ใบเสร็จ 1 ครั้ง; syntax/diff, production build `.1061` 8,336 ไฟล์ 464.9 MiB และ PWA validator ผ่าน
- **รอบ 1173 · ลบรอยต่อท้องฟ้า 360°:** `sky_dawn.jpg` เป็น 2:1 แต่ขอบซ้าย/ขวาสีไม่ตรงกัน จึงเกิดเส้นตั้งใน equirectangular skybox
- แก้ `js/adventure3d.js` ผสมคู่พิกเซลสองขอบด้วย smoothstep 14% ให้ริมตรงกันเป๊ะ คงกลางภาพคมเดิม และ cache texture ร่วม heli/drive ลดงานซ้ำบนมือถือ
- เพิ่ม `tools/test_sky_seam.js`; RGB edge delta ภาพจริง mean 72.21/max 193 → 0/0, Browser WebGL หมุน 0°/90°/180°/270° ไม่มีรอยตัด; syntax/เฮลิฯ/โรงแรม/diff ผ่าน
- **รอบ 1172 · เก็บตัวอักษรโลกเฮลิคอปเตอร์ทีละคำตามลำดับ:** เดิมสร้าง 10 คำ+ตัวหลอก 8 ตัว; แก้ `js/adventure3d.js` ให้มีเฉพาะตัวของคำปัจจุบัน แยกคนละดาดฟ้า และปฏิเสธตัวที่ผิดลำดับ
- รางวัลคง 1 เหรียญ/ตัว และปรับโบนัสเฮลิคอปเตอร์เป็น 50 เหรียญ/คำ; BUDGET ได้รวม 56 เหรียญ และเริ่มคำใหม่กลับมามีเพียงคำเดียวอัตโนมัติ
- เพิ่ม `tools/test_heli_letter_round.js`; syntax/diff + Haunted Hotel 2 ชุดผ่าน และ Browser runtime ผ่าน 7/7 (จำนวน/คลัง/ลำดับ/เหรียญ/รอบใหม่)
- **รอบ 1169 · ปุ่ม Settings จอมือถือ landscape แคบ:** ต้นเหตุ header มีความกว้างขั้นต่ำจากการ์ดผู้เล่น+แถวเหรียญ ทำให้ก้อนปุ่มขวาถูก `overflow:hidden` ตัด; ที่ viewport ≤640×520 ยึดปุ่ม 5 ตัวไว้ขอบขวาใต้แถวเหรียญและซ่อนเฉพาะฟีดอันดับ
- แก้ `css/lobby.css`, cache-bust `index_classic.html` และเพิ่ม `tools/test_lobby_settings_responsive.js`; Browser 520×375, 568×320, 640×360, 667×375, 812×375, 915×412, 1217×648, 1325×619 = ปุ่มครบ/inside/ไม่ทับเหรียญ/overflow 0 และกด Settings ได้
- regression/syntax/diff ผ่าน; กล่อง Settings 520×375 `scrollHeight=clientHeight=375`; production build `.1056` 8,336 ไฟล์ 464.8 MiB + PWA/cache/TWA validator ผ่าน · พร้อม COMMIT_DEPLOY
- **รอบ 1168 · รถชนแล้วเด้ง + คอนโซล/Equalizer responsive (ผู้ใช้อนุมัติภาพแล้ว):** collision เดิมคืนเพียงตำแหน่งเฟรมก่อนแต่แรงยังดันเข้า solid; แก้ normal/depth ดันพ้น 22 ซม., เด้ง 0.65–2.4 m/s, ขอบถนนดันเข้า 28 ซม. และพักคันเร่ง 0.32 วินาที โดยคงค่าซ่อม 100 เหรียญ
- ตรวจ asset คอนโซล `1536×1024` พบจอจริง `[622,378]-[889,505]` แต่โค้ดใช้ rect เก่าและ crop คงที่; เปลี่ยนเป็น mapping จาก `naturalWidth/Height + object-fit/object-position` พร้อม mask/contain animation ในกรอบจริง
- crop เฉพาะ `car_01` เป็น `50% 35%`, clip ขอบบนตามทรงโค้งคอนโซล, mobile landscape สูง 34vh และบังคับ asset cache `?v=1168`; ไม่แตะ gameplay/control/camera/HUD อื่น
- syntax + pet-shopping/integration/dress + layout regression ผ่าน; Browser 1280×720, 1366×768, 812×375, 915×412 = inside ทุกขนาด/overflow 0/console error 0; build `.1055` 8,336 ไฟล์ 464.8 MiB + PWA validator ผ่าน · ผู้ใช้อนุมัติให้ commit/deploy
- **รอบ 1164 · hotfix รถโลกซื้ออาหาร:** ปรับ cockpit ให้เต็มขอบ ล็อก crop แดชบอร์ด และขยายพวงมาลัยให้เห็นชัดทั้งจอปกติ/จอเตี้ย
- ลด roll/bob ของกล้องให้ขับสบายขึ้น โดยคง GPS ร้านอาหาร/แฟชั่น ฟิสิกส์ การชน ระบบความปลอดภัย และวิทยุเดิมครบ
- นำเข้าเฉพาะ `js/petshopping3d.js` และ `css/petshopping3d.css` จาก `work/ps3-hotfix-1164`; SHA-256 ตรงต้นฉบับทั้งสองไฟล์
- syntax + pet-shopping/integration/dress + regression hotfix ผ่าน; production build `.1052` 8,336 ไฟล์ 464.8 MiB ผ่าน
- **รอบ 1162 · กราฟอันดับ Top 30 หน้า Lobby:** เพิ่มปุ่ม “กราฟอันดับ” ถัดจาก “สะกดคำ”; กราฟ 10 หมวดคะแนนหลักใช้สีไม่ซ้ำ สลับหมวดได้ และติดชื่อผู้เล่นทุกจุด พร้อมปุ่ม “✕ ปิด” ชัดเจน
- โหลด snapshot `/leaderboard` เฉพาะตอนเปิดและ cache 2 นาที จึงได้ Top 30 จริงของแต่ละหมวดโดยไม่เพิ่ม listener/Firebase Rules; สอบใหญ่/ข้อสอบมาตรฐานคงดูแยกชุดในแท็บเดิม
- แก้ `rankgraph.js/css`, `lobby3d.js`, `index_classic.html`, build allowlist + regression; syntax/tests, Browser 1280×720 และ 812×375 no-overflow/30 จุด+30 ชื่อ, production build `.1051` 8,336 ไฟล์ + PWA validator ผ่าน
- **รอบ 1163 · Pet Shopping ใช้ระบบขับรถเมืองกำแพงเพชรโดยตรง:** แทนชุด `moto3d` รอบ 1160 ด้วย physics/cockpit ตามรถ/เกจ/กระจก 3 บาน/กล้อง/สตาร์ท+เข็มขัด/D-R/ไฟเลี้ยวคืนกลาง/เสียง/วิทยุ+Equalizer
- GPS ร้านอาหาร/แฟชั่นของ Pet Shopping ยังใช้ route/nav เดิม; เพิ่มปุ่มเพลง 50px และจัดควบคุมที่ 812×375 ไม่ซ้อน/ไม่ overflow; แก้ `petshopping3d.js/css`, cache `index_classic.html`+`ui.js`, regression test
- syntax + pet-shopping/integration/dress + Browser 812×375/1280×720 ผ่าน, console error 0; production build/validator รอบสุดท้ายก่อนส่ง
- แก้ขับจนถนน/พื้นหายด้วยพื้น 1,400m + drive limit 480m; เพิ่ม collision อาคาร/ร้าน/ต้นไม้ 128 จุด ชนแล้วหยุด+เด้ง+สั่น ทะลุไม่ได้
- สร้าง `img/pet-shopping/cute_town_mural_v2.webp` ด้วย ImageGen และติดลายอุ้งเท้า/ดอกไม้/ไหมพรมบน 50 อาคาร; แก้ texture loader เป็น fetch+ImageBitmap มี fallback ให้ภาพขึ้นจริง
- syntax/regression/integration/dress, Browser 1280×720 + 812×375 no-overflow/console 0, จำลองชนอาคารหยุดที่ boundary, build `.1050` 8,332 ไฟล์ + PWA/TWA validator ผ่าน; รอ COMMIT_DEPLOY
- ตู้เสื้อผ้าไม่ขายตรงแล้ว; ร้าน 3D ซื้อของเข้าตู้แต่ไม่สวมอัตโนมัติ. เงินปรับตัว 10,000 เข้า migration ครั้งเดียวและกล่องภาพ+เสียงค้างจนกดรับทราบ; สัตว์ป่วยยังหาเหรียญ/รายได้คอม/ออนไลน์ได้ตามปกติ
- เพิ่มภาพ ImageGen WebP 3 ภาพใน `img/pet-shopping/`; Browser 812×375 ผ่าน pantry/store/cockpit/GPS/no-overflow/cleanup console 0; syntax + pantry/world/integration/dress/pet-bond/paid-entry/missing-assets + production build `.1049`/PWA validator ผ่าน
- `test_spell_header.js`, syntax และ diff-check ผ่าน; Browser runtime ที่ 1047×497/812×375 ยืนยันปุ่มอยูหลังระดับชั้น 5px, บรรทัดเดียวกัน, ไม่ทับเวที และ horizontal overflow = 0
- เพิ่ม `body` slot และ `wear_extra.js` แบบ center-anchor: ภาพเดียวใช้กับหมา/แมว/มังกร มี `all_*` fallback สำหรับสัตว์/slot ใหม่ โดยยังคงกติกาใส่ได้ทีละ 1 ชิ้น; จูนฮู้ด/ชุดนอนให้เห็นตาและรอยยิ้มครบ
- Browser preview 1280×720 และ 812×375 แสดงครบ 18 ใบแบบ 9×2 ไม่มี scroll/overflow; ตรวจผ้าคลุม ฮู้ด ชุดนอน เสื้อกั๊ก เทียร่า บนสัตว์ทั้ง 3 ชนิดด้วยภาพจริง
- syntax + `test_dress_luxury.js` + `test_pet_bond.js` + alpha validator ผ่าน; production build `.1045` 8,316 ไฟล์ 464.1 MiB และ PWA validator ผ่าน รวม PNG ใหม่ครบ 10 + fingerprint `wear_extra` แล้ว · รอ acceptance หลัง deploy
- เพิ่มพฤติกรรม `cuddle`/`care` พร้อม motion แบบการ์ตูนลื่น; ชุด/เครื่องประดับทุก slot ติดตามสองโพส และสัตว์/slot ในอนาคตใช้ fallback แบบ data-driven
- สถานะห่วงใยหมุนคลังเกร็ดวิทยาศาสตร์สุขภาพสำหรับเด็ก 32 เรื่อง (น้ำ อาหารเค็ม/หวาน ฟัน มือ การนอน สายตา แดด การเคลื่อนไหว การได้ยิน และใจ) โดยจำลำดับข้ามการเข้าเกม
- `tools/test_pet_bond.js`, syntax, diff, build และ PWA validator ผ่าน; Browser preview 1280×720/812×375 ผ่านทั้ง cuddle/care/no-anim ไม่มี overflow — ยังรอ acceptance ใน lobby บัญชีจริงหลัง deploy
- เพิ่ม API กลางสำหรับอ่านคลังคำ/เปิดหน้าคำใน Picture Dictionary และย้ายโหมดออนไลน์มาใช้ API ใหม่ โดยแพ็กตำแหน่งลงฟิลด์ `spread` เดิมเพื่อใช้ Firebase Rules ปัจจุบันได้ทันที
- แก้ `js/picdict.js`, `js/picquiz_online.js`; เพิ่ม `tools/test_picquiz_online_start.js` ตรวจปุ่มเขียน `playing/countdown`, API เก่าไม่หลงเหลือ และขีดจำกัดข้อมูลจริง
- syntax/regression/diff ผ่าน; production build 8,304 ไฟล์ 459.7 MiB + PWA/cache/TWA validator ผ่าน · Browser localhost ถูก URL policy บล็อก จึงรอ acceptance ออนไลน์หลัง deploy
- เปลี่ยนการเลื่อนเป็น velocity smoothing ที่ตอบสนองไว เร่งและผ่อนหยุดสั้น ๆ ไม่กระตุก/อืด โดยคงกระสุน glow/trail/muzzle shockwave/impact explosion เดิมทั้งหมด
- แก้ `lettercannon.js/css` + regression; syntax/regression/diff, build 8,304 ไฟล์ และ Browser 1280×720 + 812×375 ผ่าน ปุ่มไม่ทับกัน/ไม่ยิงเอง/แตะยิงได้/console error 0 · รอ commit/deploy + Admin acceptance ออนไลน์
- ลากเกิน 24px ใช้เล็งอย่างเดียว ไม่ถูกนับเป็น tap; กดพัก/เสียง/ออก/สลับหน้าต่างจะล้างจังหวะแตะ กันยิงลั่น และ Spacebar ยังใช้เป็นทางเลือกบนคีย์บอร์ด
- แก้ `lettercannon.js/css` + regression; syntax/regression/diff และ production build 8,304 ไฟล์/PWA/dist assertions ผ่าน · Browser local ถูก URL policy บล็อก จึงรอ acceptance บนหน้าออนไลน์หลัง deploy
- sync `state.adminAccess` ให้เมือง 3D แสดงสิทธิ์ตรงบัญชี; Lobby, route และ `LetterCannon.open()` ตรวจ admin จริง ส่วนผู้เล่นทั่วไปยังเห็น 🔒
- แก้ `auth.js`, `state.js`, `city3d.js`, `lettercannon.js`, `index_classic.html` และ tests; syntax/regression/admin allowlist/build 8,304 ไฟล์/PWA/dist gate+PNG ผ่าน
- manifest รอบนี้รวม `js/lettercannon.js` (ไม่แก้เนื้อหา) เพื่อให้ launcher เลือก deploy จริง; ปิดงานได้เมื่อ live เป็น `.1041` และภาพสอง URL ตอบ 200 `image/png`
- เพิ่ม `assets/images/letter_cannon/` ใน `PUBLIC_PREFIXES` ให้ทั้ง tracked build และ archive fallback รวมภาพจริง; regression บังคับตรวจ prefix นี้กันย้อนกลับ
- จำลอง build โดยตัดคำสั่ง git ออกจาก PATH แล้วภาพทั้งสองอยู่ output/manifest พร้อม hash ถูกต้อง; รอ deploy `.1041` และต้องตรวจ URL ตอบ 200 `image/png` ก่อนปิดงาน
- แก้ gate จาก tester 2 บัญชีเป็น owner ผ่าน `isTeacher()` เดิม; เมือง 3D ใช้ `state.ownerAccess` เฉพาะป้าย/ทางเข้า ส่วน `LetterCannon.open()` ตรวจ Auth จริงและบล็อก route/API โดยตรง
- แก้ `lettercannon.js`, `auth.js`, `state.js`, `city3d.js`, `index_classic.html`, build/test/map + เพิ่มภาพ 2 ไฟล์; input cleanup ครบ pointer/touch/blur/visibility/orientation และเข้าออกซ้ำไม่ค้าง
- syntax + regression Auth/City/State + PNG alpha + Browser 1280×720/812×375 + build 8,304 ไฟล์ 459.7 MiB + PWA validator ผ่าน; พร้อม COMMIT_DEPLOY/owner production acceptance
- กล่องแจ้งบอกเกม/สาเหตุแบบสั้น + ยอด `+เหรียญ` ชัดเจน เล่นเสียงเงินเข้า 2 ครั้ง; Esc/พื้นหลังปิดไม่ได้ ต้องกด “รับทราบ” เท่านั้น
- แก้ `js/state.js`, `js/ui.js`, `js/main.js`; เพิ่ม `tools/test_paid_game_entry_refund.js`; syntax + regression/F1 ผ่าน
- Browser 812×375 ยืนยันกล่องครบ/ไม่เลื่อน (`scrollHeight=clientHeight=257`), Esc/backdrop ยังค้าง/ปุ่มปิดได้; build 8,302 ไฟล์ 456.3 MiB + PWA validator ผ่าน
- ผู้เล่นเดิมที่ไม่ได้รับสิทธิ์แต่ใช้ชื่อสงวนจะถูกล้างชื่อสาธารณะและบังคับตั้งใหม่เมื่อเข้าเกม; ไม่กระทบชื่อสัตว์
- แก้ `js/auth.js`, `js/main.js`, `js/util.js`, `handoff/RULES.md`; เพิ่ม `tools/test_admin_reserved_names.js`; syntax/test/build ผ่าน (`8302` ไฟล์)
- ผู้ใช้ยืนยันว่า Publish Rules รอบ 1142 แล้ว 13 ส.ค.; ยังไม่ได้เทียบสดทั้งก้อนเพราะ sandbox อ่าน Firebase CLI token ใน `.config` ไม่ได้
- Dialog ปิดได้ 4 ทาง (×/เข้าใจแล้ว/พื้นหลัง/Esc) โดย Esc ปิดคู่มือก่อนออกเกม; CSS จำกัดความสูงและย่อด้วย `clamp()` สำหรับจอเตี้ยโดยไม่ใช้ scrollbar
- แก้ `js/wordsearch.js`, `css/lobby.css`; เพิ่ม `tools/test_wordsearch_combo_help.js`; syntax/regression/diff ผ่าน แต่ visual Browser QA ถูกนโยบาย `file://` บล็อก จึงรอ acceptance หลังเปิด localhost จริง
- อันดับตัวเองใน 10 กระดานทำลายสถิติดีสุดเดิมทุก 1 ตำแหน่งได้ 1,000; อันดับตกไม่หัก/ไม่รีเซ็ต จึงกลับมาไต่ซ้ำรับเงินซ้ำไม่ได้
- กล่องทั้งสองระบบเล่นเสียงฉลอง+เหรียญชัด เก็บ notice ข้าม reload และปิดได้เฉพาะปุ่มรับทราบ; แก้ `ranks.js`, `state.js`, `ui.js`, `main.js`, `GAME_RULES.md` + regression ใหม่
- syntax/diff + rank movement/regression ใหม่ผ่าน; build 8,302 ไฟล์ 456.3 MiB + PWA validator ผ่าน · รอ COMMIT_DEPLOY
- อนุญาต “ใช้เซฟในเครื่องไปก่อน” เฉพาะเมื่อ `ownerUid` ตรงบัญชี Google ปัจจุบัน; เครื่องใหม่หรือเซฟคนละบัญชีจะไม่เข้าเกมและไม่เสี่ยงเขียนทับ Cloud
- แก้ `js/auth.js`, `index_classic.html`; เพิ่ม `tools/test_auth_cloud_recovery.js`; syntax/recovery/update regression/diff ผ่าน
- Browser 1280×720 + 812×375 เห็นข้อความ/ปุ่มครบ ไม่เลื่อน/console 0; build 8,302 ไฟล์ 456.3 MiB + PWA ผ่าน · พร้อมส่ง hotfix
- ล็อกครอบคลุมปุ่ม Lobby, ทางเข้าจากเมือง 3D และ `LetterCannon.open()` โดยตรง; ไม่ทำรายชื่อบัญชีซ้ำและไม่เปลี่ยน Rules ที่ผู้ใช้ Publish แล้ว
- แก้ `index_classic.html`, `css/lobby.css`, `js/lettercannon.js`, `tools/test_letter_cannon.js`; syntax/regression/diff ผ่าน
- production build 8,302 ไฟล์/456.3 MiB + PWA validator ผ่าน; พร้อม COMMIT_DEPLOY และรอ acceptance ออนไลน์ ≥2 เครื่อง
- 🌐 ใช้ `state.onlineEarned` เดิมซึ่งสะสมตั้งแต่เริ่มระบบและไม่รีเซ็ตรายวัน; เพิ่มข้อความกติกาให้ชัด และคงยอดย้อนหลังเดิมทั้งหมด
- กันบัญชีครูรุต/Sumpajit ทุกอันดับและแหล่งตัดรางวัล; อุด F1 ที่ยังขาด พร้อมลบแถว F1 เดิมเมื่อ tester ส่งเวลาใหม่
- syntax/regression รวม F1 ทุกชุด + diff ผ่าน; Browser 812×375 กระดานรางวัลครบ 10 ขั้น/ไม่ล้น/console 0; build 8,302 ไฟล์ 456.3 MiB + PWA ผ่าน · ค้าง Publish Rules และรอรวมงานคู่ขนานก่อน COMMIT_DEPLOY
- เชื่อมปุ่มราง Lobby + แท่นสองภาษาในเมือง 3D; ออนไลน์ผ่าน NetRoom ห้องละ 7 ป้อม วางกลาง→ซ้าย→ขวาไม่ทับ ห้องเต็มเปิดห้องใหม่ และออฟไลน์เล่นเดี่ยวได้
- เพิ่ม `js/lettercannon.js`, `css/lettercannon.css`, regression + build allowlist/PROJECT_MAP; syntax/regression/diff + Browser 1280×720/812×375 + เข้าออก 5 รอบ console 0 + build 8,300 ไฟล์/PWA ผ่าน
- `handoff/RULES.md` เพิ่ม map `lettercannon` ใน world/wroom/winfo; **ผู้ใช้ยืนยันว่า Publish Rules ก้อนเต็ม 829 บรรทัดแล้ว 13 ส.ค.** ค้างตรวจสดเมื่อเข้าถึงบัญชีเจ้าของได้ + ทดสอบผู้เล่นจริง ≥2 เครื่องก่อนถือว่าออนไลน์พร้อมใช้งาน
- แก้ deploy F1 โดยรวม `img/f1/cockpit_body_realistic.png` เข้า release และขยาย `check_missing_assets.py` ให้จับ required build asset ที่ยังไม่อยู่ใน Git ก่อน build
- production build ตัด cache-reset เฉพาะ localhost ออกจาก HTML และซ่อนข้อความ Git ที่ชวนเข้าใจผิด; syntax/regression/diff ผ่าน และจำลอง git HEAD+ไฟล์รอบนี้ build 8,248 ไฟล์/445.9 MiB + PWA validator ผ่าน · รอ COMMIT_DEPLOY
- อันดับ 1–10 ได้ 10,000–1,000 เหรียญผ่าน `onlineCoinAward`; Rules เพิ่ม index/validation `oe` และโซน `/onlineCoinAward`; regression/syntax ผ่าน และ Browser 812×375 ยืนยันครบ 100 อันดับ, ไม่ล้นแนวนอน, หน้ารางวัลครบ 10 ขั้น, console 0 · รอผู้ใช้ Publish Rules ก่อนส่งขึ้นเว็บ
- regression/syntax/template/undefined/diff ผ่าน; Browser 812×375 เดโมยืนยันหัวข้อ Top 100, ครบ 100 รายชื่อ/อันดับสุดท้าย 100, overflow แนวนอน 0, console 0; build 8,294 ไฟล์สำเร็จ แต่ PWA validator ติดโค้ด localhost cache-reset ของรอบ 1126 ที่ค้างคู่ขนาน ไม่เกี่ยวกับรอบนี้ · รอรวมหลังงานคู่ขนานพร้อมส่ง
- จบรอบไม่เริ่มหน้าเดิมอัตโนมัติ แต่กลับสารบัญพร้อม dialog กติกาและปุ่ม “รับทราบ”; กดหน้าล็อกจะแจ้งเหตุผลแบบเดียวกัน
- แก้ `js/picmatch.js`, `css/lobby.css`; เพิ่ม `tools/test_picmatch_page_cooldown.js` ยืนยัน lock 10→1→ปลด→ล็อกรอบใหม่/คนละชุดไม่ชน; syntax/diff + build 8,294 ไฟล์ผ่าน และ Browser 812×375 ยืนยัน dialog/ปุ่มครบไม่ล้น · validator ติด client-cache fix รอบ 1126 ที่ค้างใน working tree; รอ COMMIT_DEPLOY รวมงานพร้อมส่ง
- `js/ui.js` fingerprint บิล/คำขอ/แชท/ของขวัญ/คำเชิญทีละรายการและ acknowledge ทั้งหน้าทันที; `js/state.js` จำ 200 รายการล่าสุดข้าม reload; ของใหม่/ยอดใหม่จึงเตือนใหม่ ส่วนมื้อเย็นไม่ใช่ badge
- คง route/แถบบอกเหตุผล/local cache fix ใน `js/main.js`/`js/util.js`/`css/lobby.css`/HTML; regression+syntax/diff และ Browser 812×375 ไม่ล้น/console 0 · ผู้ใช้ทดสอบ localhost และยืนยันว่าถูกต้องแล้ว 12 ส.ค.; ยังไม่ commit/deploy เพราะมี F1/FPS ค้างปะปนใน working tree
- แก้ `js/f1_3d.js`, `js/f1_modes.js`; เพิ่ม `tools/test_f1_realistic_circuit.js` และ adaptive high/medium/low โดยรวมของซ้ำ 3,054 instance เป็น 26 กลุ่มวาดบน tier high
- F1 regressions 4 ชุด + syntax/diff ผ่าน; Browser 1280×720 และ 812×375 ยืนยันกล้อง 1.30 ม./FOV 72/near .14, cockpit+HUD ไม่ล้น, console 0; Battery เริ่มตรง 1.04 ม./70/.3 และ realistic `built=false`
- final build 8,291 ไฟล์/454.8 MiB + PWA validator ผ่าน; ค้างเฉพาะผู้ใช้ acceptance ด้วยตาในเกมจริง · **ยังไม่เปิด `COMMIT_DEPLOY.bat`**
- แก้ `index_classic.html`, `css/lobby.css`, `js/ui.js`, `js/online.js`; เพิ่ม `tools/test_rank_move_feed.js` ครบ loop/แตะหยุด/ปล่อย 5 วิ, Browser 1057×503 + 812×375 theme buttons/overflow/console=0, syntax/template/undefined/diff + build 8,291/PWA ผ่าน
- แก้ `js/picdict.js`, `css/picdict.css`, `tools/test_picdict_single_page.js`; Browser 812×375 ยืนยันลาก 300px ตาม 300px, เปลี่ยนหน้า/เด้งกลับที่ขอบ, แตะซูม, overflow และ console 0
- แก้ `js/picdict.js`, `css/picdict.css`, `tools/test_picdict_single_page.js`; Browser 812×375 ยืนยัน swipe ไป-กลับ/ขอบหน้าสุดท้าย/short drag/แตะซูม, 18 ใบและ overflow 0, console 0
- แก้ `js/ui.js`, `js/state.js`, `js/assetaward.js`, `index_classic.html`, `tools/build_web.mjs`, `tools/validate_web_build.mjs`, `handoff/RULES.md`; เพิ่ม regression `tools/test_asset_leaderboard.js` และโซน Rules `/assetAward`
- regression/syntax/template/undefined/diff ผ่าน; Browser 812×375 ยืนยัน Top 10, กล่อง/กระดานประกาศไม่ล้น, รางวัล 10,000→1,000, console 0; build 8,291 ไฟล์/454.8 MiB + PWA validator ผ่าน · รอ Publish Rules + COMMIT_DEPLOY
- แก้ `js/fpsweapon.js`, expose progress/frame สำหรับ QA ใน `js/invasion3d.js` และขยาย `tools/test_fps_weapon_state.js` ครบ reversal, fire/reload/queue/lifecycle, 30/60/120 FPS + dt spike โดยไม่แตะ balance/asset/Firebase
- syntax/state/assets/diff ผ่าน; Browser harness โหลด runtime assets จริงที่ 1280×720 และ 812×375 ยืนยัน rapid reversal + FIRE `1>2>3>4`, overflow 0, console warning/error 0 แล้วลบ harness/ปิด server
- ค้างผู้ใช้ตรวจผลและสั่งก่อน commit/push/deploy; **ยังไม่เปิด `COMMIT_DEPLOY.bat`**
- regression/syntax/diff ผ่าน; Browser 812×375 ยืนยัน 18 ใบ/6×3, การ์ด 129×94px, overflow 0, หน้า 2=18/หน้า 3=12 คำ, zoom+quiz ใช้ได้และ console 0; build 8,289 ไฟล์/454.8 MiB + PWA validator ผ่าน
- ถอดยางเสื่อม/ผลต่อเบรกและกริป/เกจ/พิทสต็อป/เสียง/ข้อความทั้งหมด โดยคง ghost ผู้เล่น, เลนพิทและลิมิต 80 กม./ชม.; แก้ `js/f1_3d.js` และเพิ่ม `tools/test_f1_solo_ghost.js`
- solo/ghost + engine audio + graphics mode + syntax/undefined/template/diff ผ่าน; build 8,289 ไฟล์/454.8 MiB และ PWA validator ผ่าน · รอ COMMIT_DEPLOY ส่งขึ้นเว็บ
- แก้ `js/picdict.js`, `css/picdict.css`; เพิ่ม `tools/test_picdict_single_page.js` และคงแตะฟัง/ซูม/รับเหรียญ/ครูถามศัพท์เดิม
- regression/syntax/diff ผ่าน; Browser 812×375 ยืนยันหน้าแรก 40/หน้าสอง 8 คำ, เมนู 8 หมวด, zoom+quiz ใช้ได้, console 0; build 8,289 ไฟล์/454.8 MiB + PWA validator ผ่าน
- แก้ `js/fpsweapon.js`, `js/invasion3d.js`, `js/ui.js`, `tools/build_web.mjs`; เพิ่ม build/asset/state tests และ `assets/weapons/fps/runtime/` โดยไม่แก้ master/Firebase/shared worlds
- asset/state/touch/syntax/diff ผ่าน; production build ชั่วคราว 8,289 ไฟล์/454.9 MiB + PWA validator ผ่าน และ Browser desktop/mobile 812×375 โหลด cache 47 ภาพ/alpha sight โปร่ง/overflow 0; ค้าง manual acceptance ในโลกจริงและรอคำสั่ง commit/deploy
- แก้ `js/f1_3d.js`, `tools/build_web.mjs`, `tools/validate_web_build.mjs`; เพิ่ม `tools/test_f1_engine_audio.js` + MP3 และบังคับ build รวม asset แม้ยัง untracked โดยไม่แตะ physics/NetRoom/Firebase/โลกอื่น
- regression/fallback/cleanup + syntax/template/undefined/diff ผ่าน; Browser Battery+Quality: ก่อน gesture=`off/0 context`, หลัง Start=`sample/1`, exit=`off/0`, console 0; build 8,237 ไฟล์/444.4 MiB + PWA validator ผ่าน · ค้างฟังจริงบนลำโพงมือถือ/จุน volume-loop ถ้าจำเป็น
- แก้ `js/f1_modes.js`, `js/ui.js`, `js/f1_3d.js` + preview/test; regression entry fee/สลับโหมด/cleanup/F1 offline, Browser 812×375 (ไม่มี overflow, scene=1/renderer=1), syntax/template/undefined และ build 8,239 ไฟล์/PWA validator ผ่าน
- Rules รอบ 1096 publish แล้วและ Firebase CLI เทียบสดตรง source 37 โซน/475 leaf (`missing/extra/changed=0`); destructive test ลบบัญชี `hulk`/`EZTSR3` สำเร็จ หน้าเกมกลับ login และ REST ยืนยัน friendCodes/presence/leaderboard ของ UID เดิมเป็น `null`
- Regression ครอบ stranger/no-reaction + former-friend/owned-reaction ผ่าน 778 paths; syntax, undefined-call 50 ไฟล์=0, build 8,235 ไฟล์ และ PWA validator ผ่าน
- แก้ `handoff/RULES.md`, `js/account-deletion.js`, `tools/test_account_deletion.js`; artifact full-copy รอบ 1096 ตรวจ JSON/Copy exact/37 zones/SHA-256 ผ่าน
- เพิ่ม `privacy.html` และ `delete-account.html` ไทย/อังกฤษ ครอบคลุมข้อมูลบัญชี/รูป/สังคม/WebRTC/local storage/ผู้ให้บริการ/retention/เด็ก/ช่องทางอีเมล; เพิ่ม `docs/GOOGLE_PLAY_PRIVACY_REMEDIATION.md` เป็น audit + Data Safety worksheet
- Rules รอบ 1093 เพิ่มเฉพาะสิทธิ์ลบข้อมูลของ UID ตนเองใน 7 กลุ่มที่จำเป็น; JSON + artifact full-copy ตรง source ผ่าน แต่ **ยังไม่ publish** และไม่แตะ production ตามคำสั่ง
- unit mock ยืนยัน deletion plan 776 paths ไม่ลบข้อมูลคู่สนทนา, build 8,235 ไฟล์/442.5 MiB + validator ผ่าน; Browser หน้า public 812×375 ไม่มี horizontal overflow/console issue และโหลด deletion JS/CSS hashed ครบ; ยังต้อง acceptance ด้วยบัญชีทิ้งหลัง publish/deploy
- ผีโจมตีหัก 1 จากหลอดพลัง 10/10 (ตู้+ประชิด; ประชิดพัก 4.5 วิ) และครบ 10 ครั้งหยุดเกม แสดง GAME OVER แล้วกลับ Lobby; intro อธิบายกติกาใหม่
- ขณะไฟดับ การหลบในห้องเดียวครบ 120 วินาทีบังคับผีวาร์ปเข้าขอบเขตห้องและไล่ผู้เล่นคนนั้น; ออกจากห้อง/ไฟติด/เปลี่ยนห้องรีเซ็ตเวลา
- แก้ `js/adventure3d.js`, `js/hauntedhotelghost.js`, `js/adv3d_css.js`, `tools/test_hauntedhotel_rules.js`; regression/syntax/undefined/template/diff ผ่าน และ Browser 1280×720 + 812×375 ยืนยัน face-only/HUD ไม่ล้น (overflow 0)
- `version.json` ใช้ `version/updated`; startup JS/CSS เป็น immutable hashed aliases, lazy GLB/ภาพ/เสียง/JSON ใช้ content-hash Cache Storage; SW install shell แบบ atomic เก็บ previous fallback, network-only version และไม่แตะ `petVocabAdventure_v1`
- ยืนยัน build 8,230 ไฟล์/442.5 MiB + validator/JSON/syntax/diff ผ่าน; Browser City+Classic 1280×720/812×375 overflow=0 console=0, hashed scripts 59 และปิด server แล้ว offline reload Classic build เดิมผ่าน
- ค้างเฉพาะ commit/deploy ผ่าน `COMMIT_DEPLOY.bat` และยืนยัน live headers/version/assetlinks; Android wrapper rebuild เฉพาะเมื่อ native metadata เปลี่ยน ไม่ใช่ทุก game release
- แสงอุ่นเทียนแบบ random interpolation + cold fill/rim ไม่ cast shadow, ฝุ่น 28/14 จุดตามกำลังเครื่องและอัปเดต 55ms; Browser preview 1280×720/812×375 = 51–60/60 FPS, 83–95 calls, ~44K tris, console 0; Phase 4/rules regression + syntax/diff ผ่าน ไม่มี asset ใหม่
- หันหลังครบทุก 10 ครั้งเฉพาะตอนไฟดับ → Jump Scare 3 วิ + เสียงหายใจ/จอสั่นจนหลบเข้าห้อง; หลัง `jump_scare.mp3` จบ 5 วิ เล่น `thaiInstrumentGhost.mp3` วน 2 นาทีแล้วกลับเพลงมืดอื่น · ตัด progressive hint panel เก่าที่ขัดกฎใหม่ให้เหลือ proximity/search event แบบ non-modal · source PNG ไม่ถูกแก้ · desktop/mobile visual QA ผ่าน · syntax/undefined/template/assets/diff + regression กฎใหม่/Phase 4 ผ่าน · Firebase full-rules artifact รอบ 1089 ตรวจ 37 โซน/45,426 ตัว/Copy exact/UTF-8 ผ่าน รอผู้ใช้ Publish
- เพิ่ม search timer local 45/85/135/190 วินาที, floor→room→strong proximity, distance check 500ms, pulse/เสียงเฉพาะเป้าหมาย และส่ง search event เข้า Horror Director โดยไม่เพิ่ม Firebase/frame sync
- เพิ่ม critical hint queue จำกัด 4 ค้างจนกด X/“เข้าใจแล้ว”, แยกจาก ambient banner, ล้าง hint เก่าเมื่อ objective/word/reconnect เปลี่ยน, เปิด hint ล่าสุดซ้ำได้; จบภารกิจกลับ Lobby หลังผู้เล่นกดยืนยัน
- แก้ `js/hauntedhotel.js`, `js/hauntedhoteldirector.js`, `js/hotel3d.js`, `js/adventure3d.js`, `js/adv3d_css.js`, `handoff/RULES.md`; test Phase 4 + syntax/diff ผ่าน, Browser 812×375/1280×720 ไม่ล้น ปุ่ม 44px/เล่นต่อหลัง panel ได้
- เพิ่ม `js/hauntedhoteldirector.js`: tension 0..1/phase-aware/recovery, decision 400ms, local ambient·visual·environmental, isolation/subgroup/fairness และ compact `/hauntedHotel/rN/scare` transaction สำหรับ major event (ไม่ส่งตำแหน่ง/เฟรมเพิ่ม)
- ต่อ lifecycle ผ่าน runtime/session, reuse peers+เสียง/ภาพ/ไฟเดิม, เพิ่ม rules `scare` และแก้คำอธิบาย 6 คน; reward security/NetRoom refactor/server authority ยังเลื่อนไว้
- ยืนยัน Phase 2 regression, Phase 3 A–N + 6-client objective/shared race, NetRoom 7-player matrix (`r0:6,r1:1`), browser module smoke, syntax 9 ไฟล์, undefined 47=0, template/rules/diff ผ่าน
- เพิ่ม transaction-safe init/expected-state mutation, shared seed+wordSet+cabinet slot, ordinal bitmask, stable completedAt, late join/reconnect snapshot และ listener cleanup; ไม่แก้ `netroom.js`/reward security
- แก้ `js/hauntedhotelsession.js`, `js/hauntedhotel.js`, `js/adventure3d.js`, `js/hotel3d.js`, `js/ui.js`, `sw.js`, `handoff/RULES.md`; rules ใหม่ยังไม่ publish ตามคำสั่งห้าม deploy
- ยืนยัน unit init race/double-solve/FSM/late join/reconnect/cleanup ผ่าน, browser smoke console 0, syntax 6 ไฟล์, undefined 46 ไฟล์=0, template/diff และ rules JSON ผ่าน
- ขยายเข็มระดับสูงสุดที่ฝังท้ายชื่อกลับเป็นทุกระดับ 1..ปัจจุบัน จึงเห็นทุกเข็มที่ตัวเองและเพื่อนเคยได้โดยไม่เพิ่มข้อมูล Firebase; แก้ `js/game.js`, `js/ui.js`, `css/lobby.css`
- ยืนยัน Browser 1280×720 + 812×375: 5 คอลัมน์/3 แถว, ปัดลงถึงท้าย, ไม่ล้นแนวนอน; unit expansion 36 เข็ม, `node --check` และ diff check ผ่าน
- คงเมนูแตะผู้เล่น การ์ดคำชวน และแฟลชเพื่อนใหม่; แก้ `js/ui.js` + `css/lobby.css`
- ยืนยัน Browser 812×375: กล่องอยู่ในจอครบ, page overflow=0, 2 loop chunks, scrollTop 26.4→43.2; `node --check` และ diff check ผ่าน
- กรองข้อมูลเก่า/การแทรกแถวตัวเองออกจากอันดับเหรียญ เข็ม บอส ค้นคำ พิมพ์คำ ฟอง ยิงเป้า จับคู่ภาพ สอบใหญ่ ข้อสอบมาตรฐาน และการตัดรางวัล; query เผื่อ 2 แถวเพื่อคงจำนวนผู้เล่นจริงครบ
- ยืนยัน runtime harness ลบโดยไม่เขียน + 8 แท็บ + 2 กระดานสอบผ่าน; `node --check` 6 ไฟล์, undefined 44 ไฟล์=0, template และ diff check ผ่าน
- แก้ `js/util.js` ให้เฉพาะ iPhone + `screen-dashboard` แนวนอนใช้ผืนเสมือน 1280px/สเกลตามความกว้างเครื่อง; ออกจาก Lobby/หมุนแนวตั้งคืน viewport เดิม และ Android ไม่ถูกแตะ
- ยืนยัน VM iPhone ได้ 1280×~591/Android+portrait คง device-width, `node --check`, undefined 44 ไฟล์=0, template และ diff ผ่าน; visual Browser ทำไม่ได้เพราะ sandbox ไม่อนุญาตเปิด localhost background
- ลบ CSS กล่องปักหมุดและ `alignCureBtn()` ที่ดันตำแหน่งรักษาเฉพาะ; คงสถานะรักษาจาง/กดไม่ได้เมื่อไม่มีสัตว์ป่วยตามระบบเดิม
- ยืนยัน `node --check js/ui.js`, `git diff --check` และโครงสร้างไม่มี `rail-pinned`/`alignCureBtn`; Browser ทดสอบภาพจริงไม่ได้เพราะ policy บล็อก `file://`
- แก้ `css/lobby.css`: ล็อก text-size 100%, padding ตาม safe-area, รางซ้ายจอเตี้ย 72px/ปุ่มขั้นต่ำ 44px/ซ่อน scrollbar แต่ยังปัดได้ และย่อ footer จอเตี้ยเหลือ ~36px
- ยืนยัน Browser 844×390 + 812×375 พร้อมจำลอง safe-area 47px/ข้าง: document ไม่ล้น, stage ยัง 421px, ปุ่มรางทุกใบ 72×44.9px กดได้และราง `pan-y`; `git diff --check` ผ่าน
- `js/state.js` ลบทางสร้างสถานะพร้อม migration ล้าง `playerSick*` จากเซฟเก่า/cloud; `js/ui.js` ถอดปุ่ม/กล่อง/เงื่อนไขคนป่วย และ `js/util.js` แก้คู่มือไม่อ้างปุ่มมุมขวาบนที่ไม่มี
- ยืนยัน VM เซฟเก่าล้างฟิลด์ครบแต่ pet hunger lock ยังทำงาน; Browser 1280×720 + 812×375 ปุ่มให้อาหาร enabled, ไม่มีข้อความ/ไอคอนคนป่วย, กล่องเต็มจอไม่ล้น, console 0; syntax/undefined/template/diff ผ่าน
- ตรวจถอดรหัสไฟล์ concrete + `sound/ghost/` รวม 23 ไฟล์: ทุกไฟล์ใช้ได้ แต่ `u_5hx6qi66bg-strange-whispers-415245.mp3` เบามาก (peak −19.4/RMS −35.1 dBFS) จึงห้ามใช้; กระจาย 17 ไฟล์ที่ผ่านให้ ambient/ไฟดับ/ไฟกะพริบ/ผีโผล่/กระซิบ/ถอนหายใจ/เคาะ/ตู้/เก็บอักษร/รางวัล และกันเสียงยาวซ้อนตัวเอง
- ยืนยัน runtime harness เดิน-หยุด-local/peer/stopAll, HTTP 18 asset=200+ขนาด>0, `node --check`, diff check, undefined 44 ไฟล์=0, missing assets 251=0 และ template check ผ่าน
- สองบัญชีทดสอบได้ยอดขั้นต่ำ 10,000,000 เหรียญทันที (marker วัน+ยอดใหม่ทำให้รับได้แม้วันนี้เคยรับ 500,000) และเปลี่ยนระดับชั้นขึ้น/ลง/ซ้ำได้ทุกชั้นโดยไม่ติด 30 วัน; บัญชีทั่วไปคงกฎเดิม
- ยืนยัน VM ครบ tester/normal ทั้ง 2 Lobby + ลด ม.6→ป.1→สูงกว่าปริญญาตรี + ยอด 10M; Browser 1280×720 และ 812×375 ไม่ล้น, คลิกขึ้น `🔒 Coming soon`, console 0; syntax 5 ไฟล์/undefined 44 ไฟล์/template/assets/diff ผ่าน
- ยืนยัน `.indexOn` มี `bb`, `/leaderboard/$uid/bb` และ `/bbAward` ครบ; กระดาน Top 10/คะแนนเพื่อน/ตัดรอบรางวัลออนไลน์พร้อมใช้งาน ไม่มีไฟล์เกมเปลี่ยน
- แก้ `js/wordsearch.js` + `css/lobby.css`; มี migration กระดานเขียวที่เซฟจากเวอร์ชันเก่า ยืนยัน render 8 คำ=8 สีที่ 1280×720 และ 812×375 ไม่ล้น/ทุกใบอยู่ในจอ พร้อม `node --check`, undefined 44 ไฟล์=0 และ diff check ผ่าน
- กล้องผู้เล่นจริง 1280×720 มุมหนักสุด 1,151→353 calls / 67,820→50,194 tris / 57.7→59.6 FPS; 812×375 1,145→351 / 67,598→50,110 / 59.1→60 FPS, ชั้นปกติเหลือ PointLight 2 ดวงและช่วงต่อชั้น 4 ดวง
- ภาพบุคคลโรงแรมทั้ง 6 ใบใช้ไฟล์คนไทยเดิมพร้อม cache revision `?thai=1067` กันเครื่องเก่าคืนรูปชาวต่างชาติ; runtime ยืนยัน URL ครบ 6, ภารกิจ/ตัวอักษรเดิม, ภาพรอยต่อ, console 0, node/undefined/diff ผ่าน
- เปลี่ยนวัสดุหลักเป็น Standard PBR + bump procedural/roughness แยกผนัง-พรม-ไม้-ทองเหลือง; โคม vintage เว้นจังหวะตาม bay พร้อม PointLight 2800K จำกัด 8 ดวงทั้งตึก และลด ambient ให้เกิด pool แสง/เงาสลับโดยระบบไฟดับเดิมยังควบคุมครบ
- เพิ่ม smoke detector/ช่องลม/EXIT/ตู้ดับเพลิง, รูป 5 สัดส่วนและจังหวะไม่ซ้ำ; ยืนยันภาพ first-person 1280×720 + 812×375 (canvas/scroll พอดี), 72 ห้อง/8 ไฟ, node syntax/diff/undefined 44 ไฟล์=0 ผ่าน
- ยืนยันภาพก่อน/หลังครบแถวเสี่ยง, crop ทุกภาพ finite/อยู่ใน 0..1, ไม่มี `.pm-name`, console 0; node/undefined 44 ไฟล์ unknown=0/assets 251/template/diff ผ่าน
- ย้ายโลง+ตัวสุดท้ายชั้น 3 และตู้ 5 ใบชั้น 4 ไปปลายตึกใหม่; กระจายไฟ/หน้าต่าง/ภาพ/จุดตัวอักษรครบแนวยาว ยืนยัน Browser ภายใน/ภายนอก + เส้นกลางเดินถึงหน้าโลง, ratio=3.0, node/undefined/diff ผ่าน
- เปลี่ยนรูปติดผนัง 6 ภาพเป็นผู้สูงวัยไทยสมมติ + รูปผู้เสียชีวิตสมมติอีกใบ; เพิ่มโลงไทย/กรอบทอง/พวงมาลัยขาวดำ/ไฟงานศพที่ไม่ดับ และตู้สุ่มมีตัวอักษร·ว่าง·รูป·ห่อผ้าขาว 2 ห่อ; ลดตาแดง/ผีไล่ เหลือด้านหลังทะลุกำแพงครั้งเดียว
- เสียง runtime โรงแรมใช้เฉพาะ `sound/ghost/`; สร้าง WAV ฝีเท้า 4 แบบ/เก็บอักษร/โบนัสใหม่ พร้อมฝีเท้าผู้เล่นอื่นลดระดับตามระยะ, เคาะเฉพาะมืด+ใกล้โลง และข้อความมือถือ clamp 13–17px
- ยืนยัน browser 1280×720 + 812×375 และ regression ครบ 4 คำ: floor 3/3/1/0, final 2/2/2/ตู้ floor3, ไฟ 0→1→2→3, ghostShown ครั้งเดียว, bonusPaid=true; node/undefined/template/diff/assetsเฉพาะงานผ่าน
- ตัวตรวจจับซ่อมกรอบแถวเดิมที่แยกผิดใน Colors/School/Shapes ก่อนตัดข้อความ จึงไม่เหลือแถวที่ได้ครึ่งภาพหรือได้เฉพาะชื่อ; กรอบใหม่กว้างขึ้นค่ากลาง 1.47 เท่า และ 2,641 crop finite/อยู่ใน 0..1/คำกับภาพครบทุกดัชนี
- ยืนยัน browser contact preview ครอบคลุมกรณีปกติ/แถวสำรอง/ภาพแนวตั้ง/แนวนอน รวม Bedroom ที่ยึดกรอบเดิม: ไม่พบข้อความใต้ภาพ, aspect error สูงสุด 0.00069, ทุกภาพอยู่ในกรอบและ console 0; crop validator 2,641 ภาพ/node/undefined 44 ไฟล์ unknown=0/assets 251/template/diff ผ่าน
- สแกน 2,641 crop แบบ lightweight พบ 63 candidate แล้วดู contact sheet คัด 22 จุดที่มีเศษข้างเคียง/โดนตัดมาปรับ; Blogging ล็อกตามเส้นจริง x=702–827px จึงไม่กิน Bird Watching
- ยืนยัน browser: 20 คู่/40 ใบ, aspect error สูงสุด 0.00021, กลับสารบัญ/ออก Lobby ผ่าน, 1280×720 + 812×375 (`scroll=client`, ทุกใบ/ปุ่มอยู่ในจอ), console 0; node/undefined 44 ไฟล์ unknown=0/assets 251/template/diff ผ่าน
- คะแนน `bbScore` สะสมตลอดกาล + กระดานเฉพาะ Top 10 + `bbAward` 10,000→1,000 เหรียญ; `handoff/RULES.md` มีก้อนเต็มรอ publish field/index `bb` และโซน `bbAward`
- ยืนยัน BALLOON: ฟอง L/O ซ้ำครบ, แตะผิดไม่เดิน/จบคำ +5🪙 +19 คะแนน; 1280×720 + 812×375 ไม่ล้น, คำ 14 ตัวสุ่ม 12 รอบ overlaps=0/within=true, Lobby 3D + console สะอาด; node/checkers/diff ผ่าน
- ยืนยันตัวตรวจเต็มโปรเจกต์ 44 ไฟล์พบ 10,443 นิยามและ unknown=0; regression จำลอง regex ที่มี quote ใน template ผ่าน, `py_compile` และ `git diff --check` ผ่าน—พร้อม deploy commit รอบ 1053 ที่ค้างจากความล้มเหลวเดิมอีกครั้ง
- ยืนยันข้อมูลครบ 2,641 ภาพ/46 แผ่น (words=grid ทุกใบ; ลิงก์ชุดครอบคลุมทุกดัชนีไม่ซ้ำ), browser 1280×720 + 812×375: 8/20/80 ใบไม่ล้น, ชุดท้าย 25–27 = 6 ใบ, จับคู่ได้ +10/Combo, `?go=picmatch` เข้า chooser, console 0 error; `node --check`/`git diff --check` ผ่าน และล้าง test hook/storage/server แล้ว
- ยืนยัน `git check-ignore handoff/SHIP.txt`, `git diff --check` และสถานะ tracked หลังส่งต้องสะอาด; เป็นงานเครื่องมือ/เอกสารเท่านั้น จึงไม่ deploy เว็บซ้ำ
- รางวัลบอสแบ่งฐานทีม 80% เท่ากัน + โบนัสผลงานช่วยทีมไม่เกิน 20%, กันรับซ้ำด้วย encounter claim; `js/state.js` รองรับสถิติ co-op/บอสและ `js/ui.js`+`css/arena3d.css` รองรับ HUD ปาร์ตี้/บอส/revive บนมือถือ
- ยืนยัน browser 1280×720 + 812×375: ปาร์ตี้ 4 คนไม่ล้น, follower sync HP บอส 65%, ชุบเพื่อน/ทำลายเกราะคำศัพท์/รางวัลฐาน+โบนัส/กันรับซ้ำผ่าน; console สะอาด, `node --check` และ `git diff --check` ผ่าน
- ล้าง test hook/cache query ชั่วคราวที่ถูก session คู่ขนานกวาดติดรอบ 1049 ออกจาก `js/arena3d.js`, `js/auth.js`, `js/ui.js`, `index_classic.html`; ไม่มี marker ทดสอบค้างในเว็บจริง
- ยืนยัน `node --check`, `git diff --check` และ regression ของ `duckTick()` ครบ selector ใหม่ทั้ง 3 ชนิดผ่าน (Picture Dictionary+ครูถามใช้จอเดียวกัน)
- กดอัปเดตหรือปิดจึงบันทึก ack; ทดสอบจำลองทั้ง 2 หน้าแล้ว—เวอร์ชันใหม่แสดง 1 ครั้งและเวอร์ชันที่รับทราบไม่แสดงซ้ำ, syntax ของ update checker ผ่าน
- ใช้ตัวละคร `blk1..blk88` จากหน้าโปรไฟล์จริงและน้องตัวปัจจุบันวิ่งตามแบบ spring พร้อมช่วยโจมตี; `js/state.js` เพิ่ม migration `arenaItems/arenaStats/arenaIntro`, `js/ui.js` โหลดเอนจินใหม่แยกจากไฟล์เดิม 12,828 บรรทัด, `index_classic.html`+`sw.js` รองรับ CSS/offline
- ยืนยัน browser 1280×720 + 812×375: วงจรฆ่า→เก็บ→ประกอบ→เงิน→ซื้อของผ่าน, ร้าน `scrollHeight=clientHeight`/HUD ไม่ล้น, ตัวละคร blk88+หมาวิ่งตามขึ้นจริง, คอนโซล 0 error หลังรันทิ้งไว้; `node --check` และ `git diff --check` ผ่าน
- ยืนยัน mobile 812×375: ก่อน hostile ไฟปิด, ally/peer ยังปิด, ผู้เล่นยิงแล้วไฟเปิด; ภาระไฟ 1 ดวง = +1 draw call/+2 triangles, ฉากนิ่ง 60 FPS (`pixelRatio 1.25`); `node --check` และ `git diff --check` ผ่าน
- ยืนยัน attribution 4 กรณี (เรา default/true, ally, peer), ยานตายไม่เปลี่ยนสถานะ, ทางยิงปกติ+ยิงสวนเรดาร์มี guard ครบ; `node --check` และ `git diff --check` ผ่าน
- ยืนยัน browser 1280×720 + 812×375: ผัง 3 แบบ/toolbar/ปรับเอง/ยกเลิก/ลากผ่าน และ reload หลังแก้ไม่มี console error; `node --check`, cardinal regression (หน้า/หลัง/ซ้าย/ขวา), multi-touch ownership และ `git diff --check` ผ่าน
- ยืนยัน preview 1280×720 และ 812×375: ลาก/บันทึก/ยกเลิก/รีเซ็ตและปุ่มเดิมทำงาน แถบเครื่องมือไม่ล้นจอ; คงระบบต่อสู้และกฎยานแม่ไม่ยิงผู้เล่นเดิม
- ตรวจ preview 1280×720 = 60 FPS/447 calls/74,648 tris และ 812×375 = 60 FPS/510 calls/75,879 tris; HUD/ยานลูก 26 ลำปกติ คอนโซลว่าง และคงกฎรอบ 1039 ว่ายานแม่ไม่ยิงผู้เล่น
- ยืนยัน (preview :8642 · mock login + `ShootWord.open()` + จำลอง PointerEvent หลายนิ้ว): ลากเดี่ยว yaw 0→0.48 ✓ ซีนบั๊ก (นิ้ว B แตะ-ยกระหว่าง A ลาก) A ยังหันต่อ 0.216→0.62 (โค้ดเก่าค้างที่ 0.216) ✓ แตะสั้น=ยิง (`kick` ขึ้น) ทั้งเดี่ยวและระหว่างอีกนิ้วกดค้าง ✓ console สะอาด · node --check ผ่าน · หมายเหตุ: yaw ยังมี clamp ±0.62 rad โดยตั้งใจ (กันหันหลุดซุ้ม) ถ้าผู้ใช้ยังรู้สึก "หันไม่สุด" ที่ขอบ = อาการชน clamp ไม่ใช่บั๊กนี้
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
