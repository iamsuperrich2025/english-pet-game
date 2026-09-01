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
- **รอบ 1345 · ให้อาหารสัตว์ทุกตัวในคราวเดียว:** เปลี่ยนปุ่มรายตัวเป็นแผงวางแผนรวม เห็นสัตว์ที่เลี้ยงครบ เลือกเมนูรายตัว/จัดปลอดภัยอัตโนมัติ แล้วหัก stock ทั้งชุดแบบ atomic
- อาหาร 18 เมนูใช้ WebP sprite RGBA 1080×540 ไฟล์เดียว 175,920 bytes; ทุกการ์ดบอก `บนชั้น ×จำนวน` และของหมดพาไปเลือกซื้อชั้น/ขับรถซื้อเติม
- ถอดน่องไก่ติดกระดูก: คง stock id `chicken` แต่เปลี่ยนเป็นอกไก่ต้มสุกไร้กระดูก พร้อมข้อความ “กระดูกไก่อาจทิ่มลำไส้สัตว์ได้” ใน data/UI/GAME_RULES
- syntax + pantry/bulk regression + undefined-call + production build/PWA/cache/TWA ผ่าน; Chrome source viewport 812×375 ได้ 9 pets/10 foods, noScroll+inside+sprite=true และคลิกจริง stockDelta=7

- **รอบ 1341 · Home V2 portrait lower HUD:** ย้าย New Word + wallet 7 ใบจากด้านบนลง dock สองแถวเหนือ Bottom Rail เฉพาะจอแนวตั้ง ≤700px; หมุนแนวนอนแล้วคืน DOM เดิมอัตโนมัติ
- จอง shell row แยกให้ dock/Bottom Rail จึงไม่ทับกัน, แถบสถิติยังปัดแนวนอนและเปิดมาเห็น 3 ใบ; บีบ top controls เป็นไอคอนกะทัดรัด
- **แก้ไขรอบ 1342:** รอบ 1341 จับเป้าหมายผิดหน้าจอ จึงย้อน Home V2 lower HUD ออกทั้งหมดและแก้ Dragon Sky Siege (`lc-wordbox` + `lc-stats`) ตามภาพจริง
- ย้ายแผงคำศัพท์/สถานะจาก `top:55/132px` ลง dock ล่างสูง 110px แยก 60px + 46px มี gap 4px; ปุ่มเพลง/เสียง/Missile/พัก/ออกยังอยู่ด้านบน
- ขยับ AUTO FIRE และแถบกระสุนขึ้นเหนือ dock ไม่ให้ UI ทับกัน; เพิ่ม geometry regression และผ่าน `test_letter_cannon`, Home V2 regression, syntax และ production build
- การตรวจภาพผ่าน in-app browser ถูก Windows sandbox ปฏิเสธก่อนเปิดหน้า จึงยังต้องยืนยันภาพบนเครื่องจริงหลัง deploy
- **รอบ 1343 · Dragon Sky Siege HUD auditor hotfix:** ตามคำสั่งล่าสุดคืนเฉพาะคำเป้าหมาย+คำแปล+ช่องตัวอักษรไว้ด้านบน และคงสถานะ 6 ช่องไว้ด้านล่าง
- ต้นเหตุภาพแหว่ง/คำหายคือ inherited grid row ชนกัน + fixed 46/60px พร้อม overflow hidden; เปลี่ยนสถานะเป็น auto height/ไม่ตัด และคำแปลยาวขึ้นบรรทัดได้
- ResizeObserver วัดความสูงสถานะจริงเพื่อยก AUTO FIRE/แถบกระสุนให้พ้นอัตโนมัติ; ยกชั้นเกมเหนือปุ่ม Frontline admin ซึ่งไม่ควรลอยทับเกมอื่น
- `test_letter_cannon`, syntax, Home V2 regression, production build และ source/dist contract ผ่าน; Browser/Computer Use visual QA ยังถูก Windows ACL บล็อก ต้องยืนยันภาพจริงหลัง deploy
- **รอบ 1344 · คืนเพลง Beyond the Stars:** ต้นเหตุ BGM ถูกผูกผิดกับ `state.sound`; ปิดเสียงยิงจึงทำให้ปุ่มขึ้น “เพลง ปิด” และเพลงหยุดทั้งที่ music preference ยังเปิด
- แยก BGM จาก SFX สมบูรณ์, ปุ่ม autoplay-blocked แตะแล้ว retry โดยไม่สลับ preference เป็นปิด; ยัง lazy `preload=metadata`, ใช้ Audio เดิม, loop และ fade/rewind ตอนออก
- production ใช้ content-hash `.a114de51abfe93d1.mp3`, ไม่เข้า SW precache; live Range 0–1023 ตอบ 206/1,024 bytes จาก 3,788,707 พร้อม cache 1 ปี immutable
- BGM regression (รวม SFX-off/retry/no-precache), เกม regression, syntax, build/PWA/cache/TWA validator และ diff ผ่าน


- **รอบ 1340 · ShootWord เพลง Fairgame Fun แบบ lazy Range/cache:** เข้าเกมจึงสร้าง Audio `preload=metadata` เล่นวน มีปุ่มเพลงมุมขวาบนแยกจาก Exit และออกเกมเฟด 1.1 วินาทีก่อน pause+rewind/คืนเพลง Lobby
- ปุ่มเปิด–ปิดสี/ข้อความ/ARIA ชัดและ touch target 42px/34px; Chrome QA source+dist ที่ 1365×610/812×375 ยืนยัน HUD overlap 0, toggle ใช้ Audio/request เดิม และ fade ลดเสียงก่อนหยุด
- build ฉีด hashed URL `Fairgame_Fun.503ec17b85a7e6c3.mp3` โดยไม่ใส่ SW precache; Range test ได้ 206/1,024 bytes จาก 1,833,726 bytes พร้อม immutable disk cache
- แก้ `js/shootword.js`, `tools/build_web.mjs`, เพิ่ม `tools/test_shootword_bgm.js` + เพลง; syntax/ShootWord regressions/production build/PWA/cache/TWA validator ผ่าน
- **รอบ 1339 · โลกฟุตบอล Match-day + Stadium Celebration:** เปลี่ยนท้องฟ้าเมฆ/อัฒจันทร์คนดูเต็มสนาม/ไฟส่อง/ป้าย/สีหญ้า/มุมกล้องให้ใกล้ภาพต้นแบบ โดย runtime ใช้ AVIF จริง 10-bit (sky 27KB + crowd 498KB) ไม่มี PNG ใหม่
- เพลง `sound/football/Stadium_Celebration.mp3` เริ่มหลังแตะลงสนามเท่านั้น วนซ้ำ มีปุ่มเปิด–ปิดชัดเจน และออกโลกเฟด 1.1 วินาทีแล้ว pause+rewind ก่อนคืนเพลง Lobby
- ประหยัดข้อมูลด้วย `preload=metadata` + HTTP Range + hashed immutable URL/disk cache; ทดสอบขอ 1KB ได้ 206/1,024 bytes จาก 4,123,363 bytes และ toggle ใช้ Audio/request เดิม
- Visual QA ด้วยตา source+dist แบบ touch ที่ 1365×610 / 812×375 / 608×283: ภาพได้สัดส่วนต้นแบบ, asset 200/206, HUD overlap 0; soccer regression + syntax/diff + production build/PWA/cache/TWA validator ผ่าน

- **รอบ 1336 · Letter Cannon เพลง + seamless sky:** เพิ่ม Beyond the Stars แบบ lazy stream/loop ใช้ content-hash disk cache ปุ่มเพลงมุมซ้าย และ fade 1.1 วินาทีก่อนคืนเพลง Lobby
- ฉากเกาะลอยฟ้า 3 ภาพ pan/cross-fade A→B→C→A ไม่มีขอบ tile; ทยอยโหลด 1→2→3 หลังเข้าเกม และใช้ AVIF 10-bit 200,441 bytes แทน PNG 5,282,145 bytes (ลด 96.21%)
- แก้ `js/lettercannon.js`, `css/lettercannon.css`, `tools/build_web.mjs` + regression; syntax/เกม/เสียง/geometry/AVIF และ production build/PWA/cache/TWA validator ผ่าน
- **รอบ 1337 · Racing เพลงเริ่มเมื่อ GO:** ตั้งเพลง Racing เป็นเปิดทุกครั้งที่เข้าโลก แต่ระหว่างเลือกรถ/ไฟแดงยัง pause; เริ่มเล่นตรงจังหวะไฟดับและรถปลดล็อกเท่านั้น กรณีจั๊มพ์สตาร์ทรอจนโทษหมด
- ปุ่มเพลงเป็นสถานะเฉพาะ session Racing ไม่เขียนทับ preference เพลง Lobby; lazy metadata, content-hash disk cache และ fade 1.1 วินาทีตอนออกยังคงเดิม
- แก้ `js/f1_3d.js`, `tools/test_f1_race_bgm.js`; F1 regression ทั้งชุด + syntax/diff + production build และ Chrome QA source/dist ยืนยัน wait/red=paused+locked, GO=playing+unlocked
- **รอบ 1338 · Letter Cannon hotfix ฉากหลังเลื่อนลงไม่สั่น:** ต้นตอคือ pan เดิมซูมเพียง 4.5% พร้อม `sin()` แกว่งข้าง และ screen shake ครอบทั้ง canvas จึงเห็นสั่นมากกว่าเลื่อน
- เปลี่ยนเป็นเลื่อนแนวดิ่งลง 28% ต่อ 12 วินาที, cross-fade 2 วินาที และวาดฉากหลังก่อน gameplay shake; แก้ `js/lettercannon.js` + regression ใน `tools/test_letter_cannon.js`
- syntax/Letter Cannon/BGM/diff + production build `.1204` และ PWA/cache/TWA validator ผ่าน; built asset ยืนยันไม่มี horizontal sway และฉากหลังไม่รับ screen shake
- **รอบ 1319 · Home V2 swipe HUD + raised New Word:** รวม เหรียญ/วันนี้/ออนไลน์/จากคอม/มูลค่ารวม/กราฟอันดับ/อันดับ เป็นราง 7 การ์ดที่ปัดซ้ายขวาและ snap ได้ โดยเปิดมาเห็น 3 การ์ดหลักก่อน; route กราฟ/อันดับยังใช้ระบบเดิม
- ยก New Word ไปแทนช่องแถวรองเดิมตาม desktop/compact/จอเตี้ย และขยายปุ่มสัตว์เป็นรางกว้างพร้อม safe area/ตัวอักษรสีขาว contrast สูง; syntax + Home V2 regression + production build + PWA/cache/TWA validator ผ่าน
- **รอบ 1320 · ซ่อนป้ายติดต่อโฆษณาทุกโลก:** ป้ายว่างไม่วาดข้อความและซ่อนทั้งแผ่น/เสา รวมป้ายผนังโลกเฮลิฯ กับป้ายชื่อเชิญบนตึก; ป้ายผู้เช่าหรือภาพผู้สนับสนุนจริงยังแสดงตามเดิม
- แก้ `js/adv3d_tex.js`, `js/adventure3d.js`; syntax + regression 11 เงื่อนไข + production build `.1187` + PWA/cache/TWA validator ผ่าน (ว่าง/เช่า/หมดอายุ/ภาพจริง/ทุกชนิดป้าย)
- **รอบ 1322 · Home V2 ปุ่มยาว + สัตว์ไม่ลอย:** ขยายปุ่มสัตว์บนจอ landscape/มือถือเป็น 236–264px (มือถือ 244px) ให้ข้อความไทยไม่ตกขอบ และลด `bottom` ของภาพสัตว์เหลือ 10%/9% ให้แตะแท่นมากขึ้น
- แก้ `css/home-v2.css`, `index_classic.html`, `tools/test_home_v2_mobile_preview.js`; syntax + Home V2 regression + production build ผ่าน; Browser visual QA ยังถูก Windows ACL บล็อก
- **รอบ 1323 · Home V2 ปุ่มสัตว์ responsive จริง:** ต้นตอคือ device-profile selector เก่าบีบปุ่มกลับเหลือ 104–142px เพราะ specificity สูงกว่า; override ใหม่ชนะครบ desktop/tablet/phone และคง safe copy 76% บนปุ่ม 236–270px
- ข้อความแต่ละชั้นเป็นบรรทัดเดียว พร้อม fit จาก `scrollWidth/getBoundingClientRect` หลัง resize/ชื่อ/จำนวนสัตว์/เว็บฟอนต์เปลี่ยน; syntax + regression 4 profiles ผ่าน, Browser QA ยังถูก Windows ACL บล็อก
- **รอบ 1325 · Home V2 ปุ่มสัตว์สูงและวางแนวเท่ากัน:** ล็อก hitbox ทั้ง 4 ปุ่มให้สูง 100% ของรางและ center บนฐานเดียว ใช้ gap responsive 8–10px พร้อม scroll padding สมมาตร; แยกภาพกรอบเป็น pseudo-layer แล้วชดเชย alpha bounds ของกรอบม่วง/ส้ม/ชมพูให้ขอบที่มองเห็นตรงกัน
- เพิ่ม metrics วัด height/top/bottom/gap spread จาก getBoundingClientRect; R39 regression + JS syntax + diff check ผ่าน และ full production build จาก clean snapshot ผ่านเป็น .1191; Browser visual QA ยังถูก Windows ACL บล็อก
- **รอบ 1330 · ยกเลิกผล/รายงานผิด:** เข้าใจ “รุ่นใหม่” กลับด้านและเปิด GLB เก่ารอบ 898 คืน ทั้งที่รุ่นที่ผู้ใช้อนุมัติคือ VR-X1 faceted รอบ 1210/1216; QA เดิมบังคับสีผ่าน hook จึงไม่ตรวจเส้นทางกดจริง
- **รอบ 1331 · คืน VR-X1 และสีเขียวจริง:** ถอด GLB เก่าออกจาก runtime/build, รถเราใช้ `buildPeerF1Car` รุ่นใหม่, บันทึกสีทันทีเมื่อแตะ swatch และ Garage แสดงรุ่น+สีชัด (`js/f1_3d.js` + build/preflight/regression)
- QA กด UI จริง: เขียว→ยืนยัน→cockpit→มุมรถ ทั้ง source/dist ได้ `stored=green`, cockpit green hashed และ `kind=vrx1-faceted-low-poly`; F1 12 ชุด + build/PWA/assets ผ่าน
- **รอบ 1332 · ถอด cockpit แดงรุ่นเก่าที่ทับสี:** ต้นตอภาพผู้ใช้ตรงกับ `cockpit.webp` fallback เป๊ะ และโหมดประหยัดยังใช้ `cockpit_body.webp`; ย้ายทุกโหมดไปชุด `cockpit_turn_*` WebP ตามสี พร้อมป้าย VR-X1/สีบนสนาม
- QA กดฟ้าจริง source+dist: cockpit/มุมรถเป็นฟ้า, `stored=blue`, hashed blue ถูกต้อง; F1 18/18 + build/PWA/assets ผ่าน และ manifest มีรถสีใหม่ 15/15, cockpit เก่า 0
- **รอบ 1333 · hotfix ล้อ 3D ยักษ์ซ้อน cockpit:** ต้นตอคือชุด `F1_FP_WHEELS` เก่ายังถูกเปิดเฉพาะ Battery Saver จึงไม่ปรากฏในการ QA รอบ 1332 ที่บังคับ Quality; ถอดระบบล้อหน้าซ้อนนี้ออกจาก runtime ทุกโหมดและเพิ่ม regression ห้าม marker กลับมา
- QA กดฟ้าจริงแล้วตรวจภาพด้วยตาก่อน deploy ครบ Source/Dist × Battery/Quality ทั้ง cockpit และมุมรถ: เป็น VR-X1 ฟ้า ไม่มีล้อ/รถรุ่นเก่าซ้อน; F1 18/18 + syntax + build/PWA validator ผ่าน
- **รอบ 1335 · Racing เพลง Velocity Vocabulary แบบ lazy/cache:** เข้าโลก Racing จึงสร้าง `HTMLAudioElement` แบบ `preload=metadata` + loop; build ฉีด URL content hash และไม่ใส่เพลงใน SW precache
- ปุ่ม `🎵 เพลง เปิด` / `🔇 เพลง ปิด` อยู่ใต้เวลาในคอลัมน์ขวา ใช้ preference เพลงเดิม; ออกโลกเฟด 1.1 วินาทีแล้ว pause+rewind ก่อนคืนเพลง Lobby
- Regression เสียง/HUD/F1 + build `.1201` ผ่าน; Chrome QA 1365×610/812×375 ไม่ชน HUD, เปิดซ้ำได้ HTTP 206 จาก disk cache และ fade ลด 0.42→0 ก่อนหยุด
- **รอบ 1334 · ย้ายแถบอันดับเข้ากรอบบน:** เปลี่ยนสมอจากกล่องรอบด้านขวาเป็นช่องระหว่างการ์ดอันดับสดกับกล่องคำศัพท์ พร้อมจำกัดความกว้างตามพื้นที่จริงและ fallback จอแคบ (`js/f1_3d.js`, `tools/test_f1_board_layout.js`)
- Visual QA source/dist ที่ 1322×625 และ 812×375: แถบอยู่ช่องบน ไม่ชนอันดับ/คำศัพท์/เวลา; F1 regression ทั้งชุด + syntax + production build/PWA/assets ผ่าน
- **รอบ 1317 · Home V2 HUD + ตลาดสัตว์:** แถวรอง 4 ช่องสูงเท่าแถวหลัก 56px/49px และ New Word มี safe gap 5/7/6px ตาม desktop/compact/จอเตี้ย; ถอดปุ่มและ route Classic พร้อมจัดเครื่องมือ 6 ปุ่มเต็มกรอบ
- ตลาดต่อท้ายหุ่นยนต์เพิ่มสัตว์ครบ 9 ชนิดจาก `PETS`; ร้านเดิมกับตลาดใช้ `openPetPurchase()` จุดเดียว จึงคงราคา/ห้ามชนิดซ้ำ/ตั้งชื่อ/ยอดขายเดิม
- syntax + ตลาด/สัตว์/Home V2 + production build/validate ผ่าน; Browser visual QA ยังถูก Windows ACL บล็อก (`apply deny-read ACLs`)
## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)

### 🔫 คิวงานปืน/โลกยานแม่/โลกใหม่ที่รออยู่ (ผู้ใช้อนุมัติล่วงหน้าแล้ว ทำได้เลยไม่ต้องถาม)
- **รอบ 1316 · Home V2 HUD + hidden music pause:** จัดแถวรอง 4 ช่องเท่ากันเป็น จากคอม → มูลค่ารวม → กราฟอันดับ → อันดับ; สองปุ่มหลังเรียก `openRankGraph()` / `#btn-rail-rank` เดิม
- เมื่อหน้า hidden พักเพลง Lobby, วิทยุรถ, AudioContext และ duck polling; เมื่อกลับมาคืนเสียงเฉพาะเมื่อผู้ใช้ยังเปิดเพลง/เสียงและไม่ติดเงื่อนไขโลกหรือหน้าสอบ
- syntax + Home V2 + music lifecycle regression + production build ผ่าน; hashed assets มี marker ครบ, Browser runtime ยังถูก Windows ACL บล็อก
- **รอบ 1315 · Dragon Sky Siege enemy/boss loop:** เพิ่มเครื่องบินศัตรู HP จริงสูงสุด 3 ลำ ยิงกระสุนเล็งกลับ; โดนผู้เล่นลดพลังมังกรหนึ่งดวงและยิงทำลายได้
- บอสออกทุก 30 วินาทีของเวลาเล่น ยิงกระจาย 3 นัด มีแถบ HP; เมื่อชนะจะเพิ่มคลื่น/HP บอส เติม Missile หนึ่งลูก และวนบอสถัดไปอีก 30 วินาทีโดยไม่จบภารกิจ
- ใช้ `f1VocabForStudent()` ร่วมกับเกม F1 โดยตรง: 5 ช่วงชั้น × 500 คำตรงระดับ ไม่ทำข้อมูลซ้ำ; สำรับสับใหม่เมื่อครบ 500 และกันคำซ้ำติดขอบชุด
- syntax + Dragon Sky Siege/F1 vocab regression + clean production build/validate ผ่าน; ศัตรูและบอสวาดด้วย Canvas ไม่มี raster asset ใหม่ และแคชจำนวนคำไม่สร้าง pool ซ้ำใน HUD
- **รอบ 1314 · Home V2 Classic left rail:** คืนเฉพาะรางเมนูซ้ายเป็นปุ่มกรมท่าทรงมนแบบ Classic และอ่านไอคอนจริงจาก `.rail-ico` ของปุ่มต้นทาง พร้อม fallback ชุดเดิมครบ 29 ปลายทาง
- คืนป้ายเลื่อน `▲ บนสุด` / `▼ มีอีก` แบบกดได้; Profile, Global Feed, stage, New Vocab และ Bottom Rail ไม่เปลี่ยน
- syntax + Home V2 regression + production build ผ่าน; marker อยู่ทั้ง unhashed/hashed build, Browser runtime ถูก Windows ACL บล็อก
- **รอบ 1313 · New Vocab royal balance:** ยกระดับกรอบเป็น jewel frame สีม่วง–ทองหลายชั้น พร้อมเหรียญอัญมณีซ้ายขวาโดยไม่เพิ่ม animation/asset ใหม่
- แบ่ง badge/คำศัพท์/reward เป็น 3 lane ที่สองข้างกว้างเท่ากัน ทำให้คำศัพท์อยู่กึ่งกลางจริง; มี geometry แยก desktop/landscape จอเตี้ย/≤760px
- syntax + Home V2 regression + production build ผ่าน; Browser runtime ถูก Windows ACL บล็อกจึงยืนยันด้วย geometry contract และ cache/runtime markers
- **รอบ 1312 · Dragon Sky Siege coin feedback:** เปลี่ยน HUD/ผลภารกิจจาก “คะแนน” เป็นเหรียญจริงที่เข้ากระเป๋า และย้ายสถิติรองเป็นจำนวนทำลาย/ยิงพลาด
- เหรียญ +1 และโบนัสจบคำ +50 บินจากเป้าเข้าตัวนับ พร้อมเสียงรับเงินแบบหน่วงไม่ให้เสียงยิงกลบ และการ์ดผลลัพธ์ย้ำยอดเข้า
- ใช้เหรียญ lossless WebP โปร่งใสแทน PNG พร้อม production include; เอฟเฟกต์จำกัดสูงสุด 6 ชิ้นต่อโบนัสเพื่อรักษาความลื่น
- syntax + coin/mission/performance regression + clean production build/validate ผ่าน; compact result รองรับจอเตี้ย 812×375
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

### ### 📌 สรุปสถานะล่าสุด (31 ส.ค.) — อ่านก่อน
- **รอบ 1329 · ด่านซื้ออาหาร/แฟชั่นไม่มีค่าปรับ:** ถอดการสะสม/หักเหรียญจากไม่คาดเข็มขัด ขับเกิน 90 และชนทั้งหมด; ยังคงไฟเตือน เสียง/แรงเด้ง และป้ายย้ำว่าไม่เสียค่าปรับ
- เซฟเดิมรับชดเชยครั้งเดียว 1,600 เหรียญ (เพดานเดิมต่อรอบ เพราะระบบเก่าไม่มี ledger) พร้อมกล่องแจ้ง; เซฟใหม่ไม่รับซ้ำ และ cache key ด่านบัมพ์เป็น 1329
- syntax + targeted coin invariance + pet-shopping integration + production build/PWA/cache/TWA validator ผ่าน; regression รวมยังหยุดที่ GPS-route assertion เดิมซึ่งอยู่นอกส่วนค่าปรับ*รอบ 1328 · Home V2 zero-flash + ราคาโลกเดิม:** preload/runtime ใช้ hashed URL เดียว, prebuild ก่อน dashboard active และ class-only observer สลับใน microtask; source HTML ซ่อน Classic ตั้งแต่เฟรมแรก จึงไม่รอ polling 0–10 วินาที
- ปุ่มโลกแนวตั้งอ่าน `worldEntryInfo()`/`.rail-price` เดิม (ปกติ 🪙500 รวมวันลด/ฟรี/ส่วนลดเจ้าของ) โดยคง admin gate 6 โลก; R41 regression + price probe + syntax + production build `.1194` + PWA/cache/TWA validator ผ่าน, Browser QA ยังถูก Windows ACL บล็อก
- **รอบ 1327 · Home V2 เป็น Lobby หลัก:** เปิด Home V2 ให้ผู้เล่นทุกคนทันทีเมื่อ dashboard active, ลบ Admin Preview/ทางสลับกลับ Classic และเก็บ Classic DOM ซ่อนไว้เป็น state/action source; panel เดิมเปิดทับ Home ได้
- โลก admin 6 รายการ render เป็น hidden+disabled ตั้งแต่เฟรมแรก, ตัด tab focus และมี action guard ก่อน dispatch; R40 regression 29 เมนู/13 เกม + syntax + production build .1193 + PWA/cache/TWA validator ผ่าน (Browser QA ยังถูก Windows ACL บล็อก)
- **รอบ 1326 · Letter Cannon Top 100 + รางวัลรายเดือน:** สะสมคะแนนทุกภารกิจครั้งเดียวเมื่อจบ/ออก → `/leaderboard.lc`, query แยก Top 100 จริง, เพิ่มแท็บ/โพเดียม/รางวัล 10,000–1,000 และฟีดอันดับดีขึ้น
- เพิ่ม `lcAward`/state กันจ่ายซ้ำ/Rules index+validation พร้อม artifact ปุ่มคัดลอกทั้งก้อน; syntax + runtime idempotency + leaderboard/award regression + production build/PWA/cache/TWA validator ผ่าน
- **รอบ 1324 · Racing R4 อันดับสด:** เพิ่ม timing-tower เลขใหญ่ `อันดับ/ผู้เล่นทั้งหมด` พร้อมธงตาหมากรุก; เรียงจริงจากจำนวนรอบ + ระยะบนแทร็ก และ fallback จากพิกัดสำหรับ client รุ่นเก่า
- จอ 812×375 แยกการ์ดอันดับ/minimap/พวงมาลัยไม่ให้ชนกัน; F1 regression ทั้งชุด + syntax + production build `.1190` ผ่าน, Browser visual QA ถูก Windows ACL บล็อก
- **รอบ 1306 · Dragon Sky Siege ลื่นขึ้น:** ต้นตอคือ render ตาม 120/144 Hz, DPR 2, trail/blur/audio buffer/HUD allocation ซ้ำทุกนัดและทุกเฟรม
- ล็อก active 60 FPS, pause 10/countdown 30, DPR 1.5, trail อิงเวลา, particle ring 140, cache noise/gradient และไม่ rebuild HUD ตอน autofire; gameplay/อาวุธ/ฉาก/หางมังกรครบ
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
