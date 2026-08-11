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

### 📌 สรุปสถานะล่าสุด (10 ส.ค.) — อ่านก่อน
- **รอบ 1103 · ปุ่มเข้าสู่ระบบใต้ข้อความหน้าเมือง:** เพิ่มปุ่ม `🔑 เข้าสู่ระบบ` ใต้สถานะ “ล็อกอินในเกมก่อน…” ใน `index.html` ลิงก์ไป `index_classic.html`; `js/city3d.js` แสดงเฉพาะตอนยังไม่ล็อกอินและซ่อนเมื่อ auth สำเร็จ · syntax/assertion/diff ผ่าน และ Browser 1280×720 + 812×375 ยืนยัน gap 8.8px, overflow 0, ปลายทางมี `#screen-login`
- **รอบ 1102 · Haunted Hotel โลงเทพพนม + ป้ายบอกชั้น:** เปลี่ยนโลงตะวันตกเป็นโลงไทยฐานบัว/ชาดแดง/ฝาจั่ว/ยอดเปลว พร้อมลาย canvas และเทพพนมนูนสองด้าน; เพิ่มป้ายไทย-อังกฤษชั้น 1–5 ข้างลิฟต์ทุกชั้นใน `js/hotel3d.js` โดยคง collider/mission เดิม · Haunted Hotel regression 3 ชุด, syntax/template/undefined/diff, build 8,236 ไฟล์ + PWA validator และ Browser 1280×720/812×375 overflow 0 ผ่าน
- **รอบ 1101 · แก้จอยเดินโลกยานแม่บางครั้งกลายเป็นก้ม/เงย:** ต้นเหตุคือนิ้วที่เริ่มฝั่งจอยแต่คลาดขอบถูกเก็บเป็น candidate กล้อง; `js/invasion3d.js` ล็อกบทบาท touch ตั้งแต่เริ่ม, เพิ่ม hit slop 20px และสลับฝั่งมองตามพรีเซ็ตถนัดซ้าย · regression 9 เคส, syntax/template/undefined, build 8,236 ไฟล์ + PWA validator และ Browser 812×375 console 0 ผ่าน
- **รอบ 1100 · ส่งหน้า Login ขึ้น Firebase หลัง asset เข้า Git แล้ว:** รอบ 1099 commit/push โลโก้สำเร็จแต่ `ship.sh` จัด asset-only เป็น no-deploy จึง live ยัง `.1016`; เตรียม manifest ผูก `index_classic.html` เพื่อบัมพ์ version/build/deploy จริง โดยไม่แก้ UI/auth เพิ่ม
- **รอบ 1099 · แก้ deploy รอบ 1098 ขาด asset โลโก้:** ต้นเหตุ `ship.sh` กัน asset untracked ตามปกติ จึง commit HTML/CSS แต่ไม่รวม PNG; เตรียม `handoff/SHIP.txt` ระบุเฉพาะ `img/phoneScreenShots/newVocabworldLogo.png` ให้ launcher add/commit/deploy โดยไม่กวาด asset อื่น
- **รอบ 1097 · หน้า Login ใช้โลโก้ Vocab World ใหม่ (รอ visual review/ยังไม่ deploy):** แทน crest + หัวข้อซ้ำด้วย `img/phoneScreenShots/newVocabworldLogo.png`, ปรับการ์ด/พื้นหลัง/Google CTA น้ำเงิน-ฟ้า-ทอง และเปิด login แนวตั้งโดยไม่แตะ auth; build 8,236 ไฟล์ + validator ผ่าน, Browser 10 viewport 360×640–1920×1080 ไม่มี overflow/scroll โลโก้ 3:2 และ console ใหม่ 0 error
- **รอบ 1096 · ปิดบั๊ก account deletion `permission_denied`:** ต้นตอคือ plan ส่ง `gfeed/<post>/lk/<uid>` และ `cm/<cid>/cl/<uid>` แม้ไม่มี reaction บนโพสต์คนแปลกหน้า; แก้ `js/account-deletion.js` ให้ส่งเฉพาะ reaction ที่มีจริง และ Rules อนุญาตเจ้าของ UID ลบ reaction ตัวเองแม้เลิกเป็นเพื่อน โดยไม่ขยายสิทธิ์สร้าง/แก้
- Rules รอบ 1096 publish แล้วและ Firebase CLI เทียบสดตรง source 37 โซน/475 leaf (`missing/extra/changed=0`); destructive test ลบบัญชี `hulk`/`EZTSR3` สำเร็จ หน้าเกมกลับ login และ REST ยืนยัน friendCodes/presence/leaderboard ของ UID เดิมเป็น `null`
- Regression ครอบ stranger/no-reaction + former-friend/owned-reaction ผ่าน 778 paths; syntax, undefined-call 50 ไฟล์=0, build 8,235 ไฟล์ และ PWA validator ผ่าน
- แก้ `handoff/RULES.md`, `js/account-deletion.js`, `tools/test_account_deletion.js`; artifact full-copy รอบ 1096 ตรวจ JSON/Copy exact/37 zones/SHA-256 ผ่าน
- **รอบ 1094 · แก้ Firebase Rules line 385 + Publish สำเร็จ:** คืน `.child('u').val()` และวงเล็บที่ตกใน `gnotif/$uid/n/$nid/.write`; generator ปฏิเสธ expression ที่วงเล็บ/quote ไม่ครบแล้ว · หลังผู้ใช้ Publish ตรวจ Rules สดด้วย Firebase CLI ตรง source ครบ 37 โซน/475 leaf keys (`missing/extra/changed=0`) · เว็บ live ยังเป็น policy เก่าและ `/delete-account.html` ยัง fallback เข้า City จึงเหลือ commit/deploy Hosting + ทดสอบบัญชีทิ้ง
- **รอบ 1093 · Google Play privacy/account deletion remediation:** Settings มี entry ลบบัญชีจุดเดียว พร้อมคำเตือน → พิมพ์ `DELETE` → Google re-auth → RTDB multi-location delete → Firebase Auth delete; ถ้าลบ Auth ไม่สำเร็จหลัง RTDB จะค้างสถานะ finalize-only และไม่รายงานสำเร็จเท็จ
- เพิ่ม `privacy.html` และ `delete-account.html` ไทย/อังกฤษ ครอบคลุมข้อมูลบัญชี/รูป/สังคม/WebRTC/local storage/ผู้ให้บริการ/retention/เด็ก/ช่องทางอีเมล; เพิ่ม `docs/GOOGLE_PLAY_PRIVACY_REMEDIATION.md` เป็น audit + Data Safety worksheet
- Rules รอบ 1093 เพิ่มเฉพาะสิทธิ์ลบข้อมูลของ UID ตนเองใน 7 กลุ่มที่จำเป็น; JSON + artifact full-copy ตรง source ผ่าน แต่ **ยังไม่ publish** และไม่แตะ production ตามคำสั่ง
- unit mock ยืนยัน deletion plan 776 paths ไม่ลบข้อมูลคู่สนทนา, build 8,235 ไฟล์/442.5 MiB + validator ผ่าน; Browser หน้า public 812×375 ไม่มี horizontal overflow/console issue และโหลด deletion JS/CSS hashed ครบ; ยังต้อง acceptance ด้วยบัญชีทิ้งหลัง publish/deploy
- **รอบ 1092 · Haunted Hotel ตู้/ผี/พลังชีวิต:** เปิดตู้ทุกใบไม่ Jump Scare ทันที; หลังบานเริ่มเปิด 650ms และผู้เล่นหันออก ≥1.05 rad จึงแสดงหน้าผีเต็มจอ 3 วิ โดยซ่อน HUD/ฉากอื่นทั้งหมด
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
ผู้ใช้ดูเว็บจริง (deploy `.946`) แล้วสั่ง **"ดีแล้ว เอาอย่างนี้เลย ล็อคไว้สีอย่างที่เป็นอยู่ตอนนี้เลย"**
- สีที่ล็อก = **กรมท่าต้นฉบับก่อนรอบ 881** (`--navy:#0a1f3c` · `--navy-2:#123a6b` · `--glass:rgba(7,25,52,.78)` · gradient ฉากหลัง `rgba(5,22,48,.58/.14/.20/.72)`) — ธีม navy (ค่าเริ่มต้น) **ห้าม override / ห้ามผ้าคลุม / ห้ามปรับความสว่างฉากหลัง**
- บทเรียนที่จ่ายไป 3 รอบ (997-999): ผ้าคลุมย้อมสีทั้งจอ (`mix-blend-mode`) + เพิ่มความทึบ gradient = จอ "มัว ไม่คมชัด" — ผู้ใช้ชี้เองว่า *"เปลี่ยนสีเฉพาะแถบป้ายต่างๆ ส่วนแสงสีความสว่างไม่ต้องไปแตะ"* → งานสีในอนาคตให้ทับสีตรงเฉพาะชิ้นส่วน (ปุ่ม/ป้าย/แถบ) เท่านั้น
- ปุ่มสลับธีม emerald/plum ยังอยู่ (ผู้ใช้ไม่ได้สั่งถอด) แต่ค่าเริ่มต้นต้องเป็น navy เสมอ
- **รอบ 1002 (4 ส.ค. · ผู้ใช้ดูผลรอบ 997-999 แล้วสั่ง "ทำไมมันดูมืด ดูไม่สวยเหมือนตอนแรกเลย งั้นปรับไปเป็นแบบต้นฉบับเดิม (ตั้งแต่ก่อนที่ทำ lobby 3d) กลับไปใช้สีนั้นเลย"):** ⏪ **ย้อนรีธีมรอบ 881 (กรมท่าเข้ม→ฟ้าสดใส) กลับทั้งหมด 231 จุด** ใน `css/lobby.css`(207)+`css/style.css`(12)+`css/exam.css`(3)+`index_classic.html`(6)+`js/ui.js`(3) · วิธี: สกัด mapping สีจาก **diff ของ commit `e8541ff9` (รอบ 881) เอง** แล้ว apply ย้อนกลับด้วยสคริปต์ — ได้ 108 คู่สี **ไม่กำกวมเลยสักคู่ · 0 บรรทัดจับคู่ไม่ได้** (ไม่ใช่ `git checkout` ไฟล์เก่าทับ ซึ่งจะลบงาน 120 รอบหลังจากนั้นทิ้ง) · คืน gradient ฉากหลังเป็นต้นฉบับ `rgba(5,22,48,.58/.14/.20/.72)` (รอบ 882 เคยลดเป็น .40/.05/.10/.62 ให้เข้ากับภาพเมืองฟ้า)
  - 🔑 **บทเรียนที่ทำให้รอบ 998/999 พลาด: "เข้ม" ≠ "สวย"** — ต้นฉบับสวยเพราะ**คอนทราสต์** (กรอบ/ปุ่มกรมท่าเข้ม แต่ฉากหลังยังสว่างโชว์ภาพเมือง gradient ตรงกลางแค่ .14/.20) · รอบ 999 ไปเพิ่มความทึบเป็น .42/.48 + ผ้าคลุมทับอีกชั้น → ภาพเมืองจมหมด ทั้งจอมืดเรียบ = ที่ผู้ใช้บอกว่าไม่สวย
  - 🎨 ธีม navy (ค่าเริ่มต้น) = **ไม่ override อะไรเลยแม้แต่บรรทัดเดียว** (`#theme-veil` opacity 0) → ได้หน้าตาก่อนรอบ 881 เป๊ะ ทั้งกลางวันและกลางคืน · emerald/plum เหลือเป็นทางเลือกเสริม (ทับตัวแปร + ผ้าคลุม .55)
  - ยืนยัน (preview เอง :65309 · mock login+ลงทะเบียน ป.ตรี · `getComputedStyle`): `--navy #0a1f3c` · `--navy-2 #123a6b` · `--glass rgba(7,25,52,.78)` · gradient `rgba(5,22,48,.58) 0%→.14 30%→.20 62%→.72 100%` **ตรงไฟล์ต้นฉบับ `e8541ff9^` ทุกค่า** ✓ `.icon-btn/.newword-banner/.grade-pill` = `rgba(12,36,74,.82)→rgba(6,20,44,.86)` · `.rail-btn` = `rgba(7,25,52,.78)` ✓ **สแกนสีชุดฟ้ารอบ 881 ทั้ง 108 ตัวในไฟล์ทั้ง 5 = เหลือ 0 จุด** ✓ กลางคืน: navy → `--navy #2a1d14` น้ำตาลอุ่น + night-veil .52 + theme-veil 0 = พฤติกรรมเดิมเป๊ะ ✓ สลับ emerald/plum แล้วกลับ navy ค่าคืนครบ ✓ **812×375** ไม่ล้นจอ (`overflowX/Y=0`) แถวปุ่มยังตรงแนวเหรียญ ✓ console สะอาด · `node --check js/ui.js` ผ่าน · ล้าง storage แล้ว
    - ⚠️ วัด `#theme-veil` opacity ครั้งแรกได้ 0 ทั้งที่ควรเป็น .55 — **artifact จาก transition ที่ไม่เดินตอนแท็บ preview ไม่ compositing** (บทเรียนซ้ำรอบ 977/991) พิสูจน์ใหม่ด้วย `html.no-anim` + อ่าน CSSOM = .55 ถูกต้อง
- **รอบ 1001 (4 ส.ค. · ผู้ใช้ส่งภาพขีดลูกศรแดง สั่ง "ย้ายจุดยิงสีแดงในโหมดเล็ง 🎯 (`js/shootword.js`) ไปอยู่เหนือแท่นศูนย์ยิงปลายปืน"):** 🔴 เพิ่ม `TUNE.AIM_DOT_GAP=6.25vh` แล้วบวกเข้า `transform` ของ `#sg-gun-aim`/`.kick` (ขยับ**ภาพปืนลง** ไม่ใช่ขยับจุดแดง — จุดยิงจริงยังอยู่กึ่งกลางจอเป๊ะ ไม่กระทบความแม่นที่ยืนยันไว้ตั้งแต่รอบ 936) ค่า `AIM_CX/AIM_CY/AIM_SX/AIM_SY` เดิมไม่แตะ
  - ยืนยัน (preview :8642 · เปิด `ShootWord.open()`+จำลองโหมดเล็ง · ครอปภาพจริงด้วย `getBoundingClientRect`+`drawImage` เทียบตำแหน่งจุดยิงจริงกับพิกเซลแท่นศูนย์ในภาพปืน `aim.webp`): จุดแดงลอยเหนือห่วงศูนย์หลังชัดเจน ไม่ทับแท่นเหมือนก่อนแก้ ✓ reload แบบ cache-bust ยืนยันโค้ดจริงบนดิสก์ทำงานตรงที่ทดสอบ ✓
- **รอบ 1000 (4 ส.ค. · ผู้ใช้ส่งภาพหนังสือ Picture Dictionary สั่ง "คลิกที่คำไหน ให้มีหน้าต่างย่อย ซูมคำนั้นขึ้นมาใหญ่ๆ เห็นชัดๆ"):** 🔍 `js/picdict.js`(ป๊อปอัปใหม่ `#pd-zoom` + `zoomCell()`/`closeZoom()` — ครอปเฉพาะส่วนภาพตรงกับช่องที่แตะด้วย canvas `drawImage` (map พิกัดสัดส่วน cell↔img เพราะ object-fit:fill 1:1) วาดขยายใหญ่ในการ์ดกลางจอ พร้อมคำอังกฤษ/ไทยตัวใหญ่ · แตะพื้นหลัง/การ์ด/ปุ่ม✕ = ปิด · เรียกจาก `sayCell()` ต่อจากบอลลูนเดิม (ไม่ทำงานตอนโหมดครูถามศัพท์ กันเฉลยหลุด) + ปิดอัตโนมัติเมื่อพลิกหน้า/เริ่มถาม/ออกจากเล่ม)+`css/picdict.css`(`.pd-zoom`/`.pd-zoom-card`/`.pd-zoom-canvas`/`.pd-zoom-label`/`.pd-zoom-close` + ย่อขนาดในจอเตี้ย)
  - 🔑 **บั๊กระหว่างทำ:** ใส่คลาส CSS `.pd-zoom-canvas` แต่ลืมใส่ `class` ใน `<canvas>` (มีแค่ `id`) → กฎจำกัดขนาด (`max-height`) ไม่โดนใช้เลย การ์ดสูงเกินจอ (706px ในจอ 694px) — เจอจากการวัด `getBoundingClientRect` เทียบ `pd-stage` ไม่ใช่เดาจากโค้ด
  - ยืนยัน (preview เอง :8917 · mock login+ลงทะเบียน ป.5 · `getBoundingClientRect`): เปิดหมวด "เครื่องมือ" (ตรงภาพผู้ใช้ส่งมา) แตะ "Hammer" → ป๊อปอัปขึ้นภาพครอปจริง (สุ่มพิกเซล non-white 26%) + ป้าย "Hammer · ค้อน" ✓ **1280×720** การ์ดสูง 366px อยู่ในเวที 694px เต็ม ✓ **812×375 (จอเตี้ย)** การ์ดสูง 207px อยู่ในเวที 349px เต็ม (`fitsWithinStage`=true) ✓ แตะที่ไหนก็ปิด (`show`→false ทันที, `hidden`→true หลัง .18s) ✓ พลิกหน้าขณะป๊อปอัปเปิดอยู่ = ปิดเองหลังพลิกเสร็จ ✓ เข้าโหมดครูถามศัพท์ระหว่างป๊อปอัปเปิด = ปิดทันที + แตะการ์ดระหว่างถามไม่เปิดป๊อปอัปอีก (กันเฉลย) ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage + ปิด server แล้ว
- **รอบ 999 (4 ส.ค. · ผู้ใช้ส่งภาพยืนยันหลังรอบ 997 ว่า "สีไม่เข้ม เหมือนเดิมเลย"):** 🎯 `css/lobby.css` ต้นตอ: `#theme-veil` เดิมใช้ `mix-blend-mode:color` อย่างเดียว **คงความสว่างเดิมของพื้นหลังไว้เสมอ** — ปุ่ม/แผงที่พื้นเดิมสว่างอยู่แล้วเลยแค่ "เปลี่ยนเฉด" ไม่เข้มขึ้นจริง → เปลี่ยนมา **ทับสีตรง** `.icon-btn`/`.newword-banner`/`.grade-pill`/`.rail-btn:hover`/`.rail-scroll::before,::after` ด้วย `var(--navy/--navy-2/--sky)` ต่อคลาส `html.theme-*` (แบบเดียวกับที่ NightUI เคยทำกับ icon-btn) + เพิ่มตัวแปร `--tint1..4` ให้ gradient พื้นหลัง body อ้างอิงแทน rgba(31,100,186) hardcode เดิม ตั้งเข้ม/ทึบขึ้นมาก (opacity .72/.42/.48/.82) ต่อธีม + บั๊บ `#theme-veil` opacity .4→.5 เป็นตาข่ายกันหลุดจุดเล็กที่เหลือ
  - ยืนยัน (preview เอง :57157 · mock login+ลงทะเบียน ป.ตรี): `getComputedStyle` วัดสีจริงหลังผสม — ธีม navy `#btn-chat`/`.newword-banner`/`.grade-pill` = `linear-gradient(rgb(28,74,133),rgb(18,51,94))` (เข้มกว่าฟ้าเดิม rgb(32,101,195) ชัดเจน) · emerald = `rgb(21,66,56)→rgb(14,46,40)` · plum = `rgb(58,35,84)→rgb(42,26,61)` · `.rail-btn` ปกติ = `rgba(9,24,46,.88)` (เข้มมาก) ✓ `.coin-group`/`.topbar-icons-row` ยัง top=20 ตรงกันเหมือนรอบ 997 ไม่มี regression ✓ **812×375** ไม่ล้นจอเหมือนเดิม ✓ console สะอาด · ล้าง storage แล้ว
- **รอบ 998 (4 ส.ค. · ผู้ใช้ส่งภาพหน้าปกหนังสือ สั่ง "เปลี่ยนจากแตะ เป็นปัดหน้าจอจากขวาไปซ้าย เพื่อความสมจริง"):** 👈 `js/picdict.js`(ถอด `click`→`openBook` เดิม เพิ่มโซน `coverDown/coverMove/coverUp/bindCoverSwipe` — ปกหมุนตามนิ้วจริงระหว่างลาก ปล่อยเกิน 32% ของความกว้างปก=เปิดต่อจนสุด ไม่ถึง=ไหลกลับปิด กลไกเดียวกับปัดพลิกหน้าในเล่ม)+`css/picdict.css`(`touch-action:none` กันเบราว์เซอร์แย่งท่าทาง + `cursor:grab`) — เปลี่ยนป้ายคำใบ้เป็น "👈 ปัดจากขวาไปซ้าย เพื่อเปิดหนังสือ"
  - 🔑 **บั๊กที่เจอระหว่างเทสต์:** ทางไหลกลับปิด (ปัดไม่ถึงเกณฑ์) เดิมใช้ `requestAnimationFrame` เคลียร์ transform — **rAF ไม่ยิงตอนแท็บถูกซ่อน/ไม่ compositing** (บทเรียนซ้ำเดิมของโปรเจกต์) ทำให้ปกค้างกลางทางถาวรถ้าจับจังหวะไม่ทัน → แก้เป็นเคลียร์ `transform/opacity` ทันทีในบล็อกเดียวกับตั้ง `transition` (ไม่พึ่งเฟรมถัดไป) ยังลื่นเหมือนเดิมเพราะเอนจิน transition เทียบจากเฟรมที่วาดจริงล่าสุดอยู่ดี
  - ยืนยัน (preview :8642 · จำลอง pointer event ลาก): แตะเฉย ๆ ไม่ลาก = **ไม่เปิด** (เดิมเปิดด้วยคลิก) ✓ ลากสั้น <32% = ไหลกลับปิดสนิท ไม่มี transform ค้าง (`inlineTf/inlineOp` ว่างเปล่าหลังจบ) ✓ ลากเกิน 32% = เปิดหนังสือจริง (`opened:true`, `pd-closed` hidden, `pd-bookwrap` โผล่) ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
  - ⚠️ **หมายเหตุ session คู่ขนาน:** commit นี้พ่วงฟีเจอร์ "🔍 ป๊อปอัปซูมการ์ดที่แตะให้ใหญ่ชัด" (`zoomCell/closeZoom` + `.pd-zoom*` css) จาก session อื่นที่แก้ไฟล์เดียวกันพร้อมกัน (คนละระบบ ไม่ชนกัน — โค้ดสมบูรณ์ เทสต์ผ่านทั้งคู่ร่วมกัน) เจ้าของฟีเจอร์นั้นยังไม่ได้บันทึกรอบเอง ถ้า session นั้นกลับมา commit ซ้ำจะพบว่า diff ว่างเพราะขึ้นเว็บไปกับรอบนี้แล้ว
- **รอบ 997 (4 ส.ค. · ผู้ใช้บอก "ธีมฟ้าเดิมสว่างแสบตา ขอสีสบายตากว่านี้แต่ยังหรูหรา" แล้วสั่ง "ย้ายกลุ่มปุ่ม 💬🔇☀️⚙️🚪 ขึ้นแนวเดียวกับแถวเหรียญรวม + เพิ่มปุ่มเปลี่ยนธีม 3 แบบ ค่าเริ่มต้น=เนวี่เข้ม+ทอง"):** 🎨 `index_classic.html`(ห่อปุ่มไอคอนเดิมใน `.topbar-icons`/`.topbar-icons-row` + แถวปุ่มใหม่ `.topbar-theme-row` 3 ปุ่ม `#theme-navy/emerald/plum` + สคริปต์ `ThemeUI` คู่กับ `NightUI` เดิม อ่าน/เขียน `localStorage['vwColorTheme']` ใส่คลาส `html.theme-*` ก่อน paint)+`css/lobby.css`(`.topbar-icons` คอลัมน์ `align-self:flex-start` ดันขึ้นชิดแถวเหรียญ + โซนใหม่ 3 ธีม: ทับตัวแปร `:root`(`--navy/--sky/--panel-bg/--ink2/--glass`) ต่อคลาส + `#theme-veil` ผ้าคลุม `mix-blend-mode:color` กวาดสี hardcode ทั่วไฟล์แบบเดียวกับ `#night-veil` เดิม opacity ไล่จางตาม `1-var(--night-k)` กันซ้อนสีกับกลางคืน)
  - ยืนยัน (preview เอง :62331 · mock login+ลงทะเบียน ป.ตรี · `getBoundingClientRect`): **1280×720** `.coin-group` top=20 ตรงกับ `.topbar-icons-row` top=20 เป๊ะ (เดิมลอยกลาง header เพราะ `.coin-block` สูง 2 แถว) แถวปุ่มธีมอยู่ใต้ต่อ (top 64) ✓ ค่าเริ่มต้นโหลดมาเป็น `html.theme-navy` ทันที (`--navy:#12335e`) ไม่มีจอกะพริบ ✓ กดสลับ emerald/plum → คลาส/ตัวแปร/`#theme-veil` เปลี่ยนตาม + จำ `localStorage` reload แล้วยังติดธีมเดิม (อ่านก่อน paint เหมือน NightUI) ✓ **812×375**: แถวไอคอน+ธีมยังอยู่ในจอ (`right`=802<812) ไม่ล้น (`scrollWidth=scrollHeight` ไม่เกิน) ✓ console สะอาดทั้ง 2 ขนาดจอ · ล้าง storage แล้ว
- **รอบ 996 (4 ส.ค. · ผู้ใช้ให้ไฟล์ "เสียงเปิดหนังสือ ให้ใช้เสียงนี้ sound/OpenBookSound.mp3"):** 🔊 `js/picdict.js` `flipSfx()` เล่นไฟล์จริงก่อน (`new Audio('sound/OpenBookSound.mp3')` cache ตัวเดียวใช้ซ้ำ + `currentTime=0`) ล้มเหลว/ไฟล์หายค่อย fallback ไปฟังก์ชันสังเคราะห์ noise เดิม (เปลี่ยนชื่อเป็น `flipSfxSynth`) — ลอกแพทเทิร์นเดียวกับ `playSpark` ใน `js/util.js`
  - ยืนยัน (preview :8642 · mock login+ลงทะเบียน ป.5): mock `window.Audio` ดักการเรียก → เปิดปกหนังสือจริงยิง `new Audio('sound/OpenBookSound.mp3')` แล้ว `.play()` ✓ พลิกหน้าซ้ำเร็ว ๆ ไม่ error (audio object เดิมถูกรีเซ็ต currentTime ใช้ซ้ำ) ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
- **รอบ 995 (4 ส.ค. · ผู้ใช้ส่งภาพขีดเส้นแดง สั่ง "ขยายความกว้างหนังสือถึงเส้นแดง · ขยายรูปที่ดูบีบ · เอาปุ่ม next/back ออก ใช้ปัดซ้าย-ขวาแทน ให้เหมือน fliphtml5" + "วัดระยะให้หนังสืออยู่กึ่งกลางจอพอดี"):** 📖 `js/picdict.js`(ใหม่: `fitBook()/btnBox()/relayout()/measChrome()` วัดจอจริงแล้วตั้ง width/height เอง + โซนลากพลิก `dragDown/dragMove/dragUp/setTurn` + แยก `flipTo` เป็น `prepFaces/finishFlip/cancelFlip`)+`css/picdict.css`(ถอด `.pd-arrow` · เลิก `aspect-ratio:4/3` ตายตัว · ภาพเป็น `object-fit:fill` · ป้าย `.pd-hint` · ปุ่ม 🎧 ย้ายมาซ้อนใต้ 📑)
  - 🔑 **ต้นตอที่เล่มเคยลอยแคบกลางจอ:** แผ่นเป็นแนวตั้ง 2:3 → กางคู่ได้แค่ 4:3 ซึ่งเตี้ยกว่าจอกว้าง ความสูงจึงเป็นตัวจำกัด · แก้ด้วยการยอมยืดแนวนอนได้ถึง `PD_STRETCH = 1.45` (ค่าที่ถอดจากเส้นแดงในภาพผู้ใช้ · เทียบภาพครอปจริงแล้วการ์ด/ตัวหนังสือยังไม่บิด) + ภาพเต็มหน้ากระดาษ (เดิม `contain` เหลือขอบว่างข้างละ ~30px)
  - 🔑 ปุ่มลอยมุมบนห้ามทับกระดาษ → `btnBox()` วัดปุ่มจริง แล้วเลือกทางที่ได้หน้ากระดาษใหญ่กว่าระหว่าง "หลบด้านข้าง(สูงเต็ม)" กับ "ถอยลงใต้ปุ่ม(กว้างเต็ม)" · ⚠️ วัดขอบผิดข้างครั้งแรก (ปุ่มขวาไปวัดจากขอบซ้าย) ทำให้เล่มหดฟรี — ดูจากจุดกึ่งกลางปุ่มว่าเกาะขอบไหน · **แถบครูถามศัพท์เปิด/ปิด ต้องเรียก `relayout()` เอง** (ResizeObserver ไม่ยิงตอนแท็บซ่อน)
  - ยืนยัน (preview :8642 · `getBoundingClientRect`): **1062×493 (จอในภาพผู้ใช้)** เล่ม 593→**799×454** กึ่งกลางเป๊ะ (ctr 531.2 vs 531) ขอบ 131–930 ≈ เส้นแดงที่ขีดไว้ (105–928) · **1280×720** 1016×680 · **812×375** 594×336 ทุกขนาดปุ่ม 3 ปุ่มไม่ทับเล่ม ไม่มี scroll ✓ ปัดซ้าย=หน้าถัดไป ปัดขวา=ย้อน · ลากค้างกลางทาง กระดาษหมุนตามนิ้วจริง (prog .35 = 63° เงา .89 เงาทาบ .67) ปล่อยไม่ถึงครึ่ง=ไหลกลับหน้าเดิม · ปัดเร็วสั้น ๆ=พลิก · ปัดแนวตั้ง/สุดเล่ม=ไม่พลิก · ลากจากบนการ์ด=ไม่ออกเสียงผิดจังหวะ ✓ แตะการ์ดยังตรงช่อง (Whale/Clownfish/Butterfly) overlay ตรงกล่องภาพ 100.0% ✓ โหมดครูถามยังได้ 10🪙/คำ พลิกหน้าระหว่างถามได้ แถบไม่ทับเล่ม ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
- **รอบ 994 (4 ส.ค. · ผู้ใช้สั่ง "โหมดครูถามศัพท์ + ปุ่มใหม่ทั้งล็อบบี้เดิมและ Lobby 3D"):** 🎧 `js/picdict.js`(โซน qz: `qzStart/qzStop/qzAsk/qzReplay/qzAnswer/qzScore/qzCells` + `openQuiz`)+`css/picdict.css`(แถบคำถาม `.pd-qbar` + `.qz-ok/.qz-no/.qz-target`)+`index_classic.html`(`#btn-picquiz`)+`js/main.js`(CLICK map `picquiz`)+`js/city3d.js`(ตึก 🎧 46° `BAND2_R+16`) — ครูอ่านคำ เด็กแตะการ์ดบนหน้าที่กางอยู่ให้ถูก · **สูตรรางวัลลอกจาก `js/picmatch.js` ทุกบรรทัด** (10🪙/5EXP/2RP + ไฟลุก×2 + มือถือ + addCraft + questEvent + vbRecord + ตัวนับ `game.*` ชุดเดียวกัน สถิติจึงรวมกับเกมจับคู่)
  - 🔑 ออกแบบให้เด็กไม่จมกับคำเดียว: ผิด 2 ครั้ง = **การ์ดคำตอบเรืองให้เห็น** · ผิดครั้งแรกอ่านซ้ำให้เอง · ปุ่ม 🔊 ฟังอีกที · พลิกหน้าระหว่างเล่นได้ (คำถามสุ่มใหม่จาก "การ์ดที่เห็นอยู่ตอนนี้" เสมอ) · พลิกไปสารบัญ = บอกให้พลิกกลับ ไม่ค้าง
  - 🔑 `openQuiz()` (ปุ่มล็อบบี้/`?go=picquiz`) **ห้ามใช้ setTimeout ตายตัว** — ต้อง poll รอ `qzCells()>=2` (สูงสุด 6 วิ) เพราะช่องคลิกวางหลังภาพ `onload` เครื่องช้าจะเริ่มถามก่อนหน้าพร้อม (เจอจริงตอนเทสต์: ตั้ง 1200ms แล้วพลาด)
  - ยืนยัน (preview :8642 · ป.5 · rect): ปุ่มล็อบบี้ → เปิดปก+พลิกไปหน้ามีคำ+เริ่มถามเอง ✓ ผิด 1 ครั้ง=ไม่ได้เหรียญ คอมโบ 0 อ่านซ้ำ · ผิดครั้งที่ 2=เฉลยเรือง · ตอบถูก=+10🪙 combo×1 `pmPairs+1` แล้วถามคำใหม่เองใน 1.5 วิ ✓ ถูกติดกัน 4 คำ=combo×4 ป้ายแดง 40🪙 ✓ พลิกหน้าระหว่างเล่น→คำถามใหม่มาจากหน้าที่เห็นจริง ✓ "✕ เลิกถาม"=การ์ดสรุป 40🪙/4คำ แล้ว**อยู่ในหนังสือต่อ** · "⬅ กลับ"=สรุปแล้วออกล็อบบี้ ✓ โหมดปกติยังแตะฟังเสียง+บอลลูนได้เหมือนเดิม ✓ **812×375 ไม่มี scroll (sh=ch=349)** แถบไม่ทับปุ่มกลับ ข้อความยาวสุด "Isosceles Right Triangle" ไม่โดนตัด ✓ `?go=picquiz` เริ่มถามเองใน 3.1 วิ ✓ เมือง 3D: ถ่ายภาพจริงด้วย `tools/snaplab.js` — ตึก 🎧 อยู่ระหว่าง 🥇/📖 บนบก ไม่เบียด ✓ console สะอาด · `node --check` ผ่าน · ล้าง storage แล้ว
  - 📌 คลังคำหนังสือ **ครบ 46 แผ่นแล้ว** (session Sonnet ถอดจบ) + เสียง mp3 เจนแล้ว 1,617 คำ (เหลือ 5 คำที่ `PAIR_RE` ไม่จับ: มีวงเล็บ/จุด เช่น `RV (Camper)`, `a.m.`)
- **รอบ 993 (4 ส.ค. · 🚨 หนังสือรอบ 992 ขึ้นเว็บแล้ว "ภาพ 404 ทั้งเล่ม" — เจอเองตอนจะทำงานย่อรูป):** 🗜️ **ต้นตอ: แผ่น `img/matching/*.png` 46 ไฟล์ 91MB เป็น untracked ทั้งหมด · deploy เอาไฟล์จาก `git archive HEAD` → ไม่มีภาพขึ้นเว็บเลย** (localhost ผ่านเพราะไฟล์อยู่ในเครื่อง — เคสเดียวกับ word_new.js รอบ 324) · ยืนยันด้วย `curl` ก่อนแก้: sheet=404 / cards=200
  - แก้: ไฟล์ใหม่ `tools/shrink_matching.py` (PNG→WebP q80 คงความละเอียด 1024×1536 ลง `img/matching/web/` · **ไม่แตะต้นฉบับ**) → **91.1MB → 11.5MB (12.7%)** แล้ว commit เฉพาะโฟลเดอร์ย่อ · `js/picdict.js` โหลด `web/<ชื่อ>.webp` + `onerror` ถอยไป `.png` ต้นฉบับ (เครื่องที่ยังไม่ได้รันสคริปต์ย่อยังเห็นภาพ)
  - 🛡️ ปิดช่องโหว่ถาวร: `tools/check_missing_assets.py` เพิ่ม `picdict_refs()` — อ่านสารบัญ `js/data/picdict.js` แล้วบังคับว่าทุกแผ่นต้องมี `.webp` ที่ commit แล้ว (ด่านเดิมดูแต่ `src=` ใน html จึงปล่อยผ่าน) · ทดสอบก่อน commit: จับครบ 46 ไฟล์ตามคาด
  - ยืนยัน: preview :8642 — หน้าหนังสือโหลด `web/*.webp` naturalWidth 1024 ครบ · ยิง error ใส่ภาพ → ถอยไป `Colors.png` สำเร็จ (`dataset.fb=1`) overlay ยังตรง แตะช่องยังออกเสียง ✓ หน้าที่ Sonnet ถอดคำแล้วขึ้นครบ (Action Verbs 56 ช่อง · Adjectives/Bathroom/Bedroom 64) · เทียบภาพครอป q80 vs ต้นฉบับ ตัวอักษรไทยคมเท่ากัน ✓ live `curl` .webp = 200 · console สะอาด · `node --check` ผ่าน
  - 📌 กติกาต่อไป: **แผ่นใหม่ที่ผู้ใช้วางใน `img/matching/` ต้องรัน `python tools/shrink_matching.py` แล้ว commit `img/matching/web/` ทุกครั้ง** (ต้นฉบับยังห้ามขึ้น repo — 91MB)
- 📦 รอบ 746-749 (29 ก.ค. รายละเอียดเต็ม) — ย้ายเข้า archive แล้ว (TASKS.md เกินงบ 80KB) **Grep** `รอบ 746` ถึง `รอบ 749` ใน `handoff/archive/TASKS_ROUNDS.md` · (สรุปสั้น: 749=ลบเข็มใต้ระดับชั้นในฟีด · 748=แก้ตำแหน่งเหรียญเข็มด้วย image-based detection (`badgelab.py`) · 747=ตัดไฟล์เหรียญ `img/badges/*.png` ใหม่กันเหรียญข้างเคียงติด + บทเรียน sw.js cache-first ต้องบัมพ์ CACHE_VERSION · 746=เพลงล็อบบี้ `sound/bgm/lobby_*.mp3` — ยังรอไฟล์จากผู้ใช้)
- 📦 รอบ 731-735 (29 ก.ค. รายละเอียดเต็ม) — ย้ายเข้า archive แล้ว (TASKS.md ใกล้เกินงบ 80KB วันที่มีหลาย session คอมมิตถี่มาก) **Grep** `รอบ 731` ถึง `รอบ 735` ใน `handoff/archive/TASKS_ROUNDS.md`
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
