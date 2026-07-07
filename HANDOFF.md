# HANDOFF.md — BOOT ไฟล์เดียวจบ (Pet Vocab Adventure)

> 📂 ราก `C:\Users\rober\english-pet-game\` · ⚠️ working dir = `C:\Users\rober` → **เปิดไฟล์ใช้ path เต็มเสมอ**
> 🚀 **session ใหม่: อ่านไฟล์นี้ไฟล์เดียวพอเริ่มงาน** (เดิมต้องอ่าน 3 ไฟล์ — ยุบมาไว้นี่หมดแล้ว) · ไฟล์อื่นเปิดเฉพาะตอนต้องใช้ (ดูตารางล่างสุด)

## 🏆 กฎทอง (ยึด 4 ข้อนี้ก่อนเสมอ)
1. **ภาพก่อนโค้ด** — บั๊กที่มองเห็นได้ (UI/layout) → **ขอ/ดู screenshot ก่อน ห้ามเปิดโค้ดเดา** (รอบที่ผ่านมาเดา z-index จากโค้ดเสียเวลาเปล่า พอเห็นภาพเจอต้นตอทันที)
2. **Grep ก่อน Read** — ไฟล์ใหญ่ (`ui.js` ~2,000 บรรทัด, `vocab.js`, `collectibles.js`) หาชื่อฟังก์ชันด้วย Grep แล้ว Read เฉพาะช่วง (offset+limit) · **ห้ามอ่านทั้งไฟล์**
3. **preview: resize landscape ก่อน · เชื่อ `getBoundingClientRect` ไม่เชื่อ screenshot/elementFromPoint** (ดู 🖥️ ล่าง)
4. **จบงาน: บัมพ์ `version.json` → commit เฉพาะไฟล์ที่แก้ (ห้าม `git add -A`) → อัปเดต `handoff/TASKS.md`**
5. **เลือก session ตามการประหยัด token:** งาน/ขั้นตอนไหน **ทำใน session เดิมถูกกว่า** (context โหลดแล้ว งานเล็ก) → **ทำเลย ไม่ต้องเสนอแยก session** · ไหน **New session ถูกกว่า** (session เดิมยาว/context บวม, งานใหม่ที่ไม่พึ่งของเดิม) → **เสนอให้เริ่ม New session ทุกครั้ง**

## 📸 สถานะปัจจุบัน (8 ก.ค. 2026)
- ✅ **รอบ 47: การ์ดร้านสัตว์เลี้ยงโชว์เป้าหมาย "ขาดอีก 🪙X ≈ เล่นอีก Y คำ"** (เฉพาะการ์ดที่เหรียญไม่พอ · ฐาน 10🪙/คำ) — version .25
- ✅ **รอบ 46: กระดานคะแนนสดใน map 🏆** — มุมซ้ายบน จัดอันดับใครประกอบคำเยอะสุดรอบนี้ (me+เพื่อน · 👑 คนนำ · field `w` ใน `/world`) — version .24 · **rules ชุดเต็มรอ publish**
- ✅ **รอบ 45: หน้าร้านสัตว์เลี้ยงพอดีจอไม่มี scrollbar (fix margin collapse `#app{flow-root}` — ตัด scrollbar 8–12px ทั้งเว็บ) + ลิงก์ 🎮 เข้าเล่นเกมใต้เหรียญ** — version .23
- ✅ **รอบ 44: ไอคอน 🎤 เหนือหัวคนเปิดไมค์ + ปุ่มครูปิดเสียงทั้งห้อง 👩‍🏫** — บัญชีครู=`TEACHER_EMAILS` ใน auth.js · โซน `/class` ใหม่ + `/world` เพิ่ม `m` — version .22 · **rules ชุดเต็มรอ publish**
- ✅ **รอบ 43: Voice chat 🎤 + quick chat + bubble ธีมหลอน** — WebRTC P2P (signaling `/rtc`) · ปุ่ม 🎤(default ปิด)/🔊/🌐-👥(เฉพาะเพื่อน invite) · เสียงเบาตามระยะ · ชิปแตะเดียวส่ง 6 ข้อความ — version .21 · **rules ทั้งชุด (/world+/tinv+/rtc) รอผู้ใช้ publish + เสียงจริงต้องเทสต์ 2 เครื่อง**
- ✅ **รอบ 42: แชทลอยหัวใน map แบบ Roblox 💬** — ปุ่ม 💬/Enter พิมพ์ ≤60 ตัว กรองคำหยาบ โชว์เหนือหัวเพื่อน 5 วิ (field c/ct ใน `/world` เดิม — **rules /world ต้องเพิ่ม c/ct ด้วย ก้อนเต็มใน RULES.md**) — version .20
- ✅ **รอบ 41: โลกผีสิงกลางคืน 👻 + multiplayer 2 โลก + ชวนเพื่อนเงินคืน 2,000** — ตั๋วผี 10,000 (ต้องมีตั๋วแรกก่อน) 25🪙/คำ · ผี 8 ตัวโผล่ 20 วิย้ายที่ สู้ไม่ได้ต้องหนี โดนจับ=jump scare+game over · เสียงหลอนสังเคราะห์ (อัปเกรดได้ด้วยไฟล์ Suno — `PROMPTS_SOUND.md`) · ผู้เล่นอื่นโผล่ใน map (`/world`) · คำชวน (`/tinv`) เจอกันจริงรับคนละ 2,000 — version .19 · **⚠️ รอผู้ใช้ publish rules โซน /world+/tinv (`handoff/RULES.md`) + ทดสอบจริง**
- ✅ **รอบ 40: ข้อ 8 โลกผจญภัย 3D เสร็จ!** — Three.js ฝัง repo (`js/vendor/`) · first-person เก็บตัวอักษรประกอบคำ 15🪙/คำ · minimap เรดาร์ · monster ยิงสู้ได้ · KO→รักษา 1,000 · เข้าจากการ์ดตั๋ว — version .18 · **รอผู้ใช้ทดสอบจริงบน Pages (เดสก์ท็อป+มือถือ touch)**
- ✅ **รอบ 39: ภาพชุดตัวละคร/รูปร่างครบ 11/11** (dragon 3 ภาพสุดท้ายเข้า repo) — version .17
- ✅ **รอบ 38: ตัวละครผู้เลี้ยงโผล่ในฉากเกม (เด้งเชียร์ตอนตอบถูก) + หัวการ์ดสถิติ/สรุปส่งครู** — version .16
- ✅ **รอบ 37: เลือกตัวละครผู้เลี้ยง (ข้อ 4) + การ์ดตั๋วโลกผจญภัย (ข้อ 7) + 🐞 fix sw.js cache 404 รูป** (ภาพเจนใหม่ไม่โผล่ให้ผู้เล่นเก่า — CACHE_VERSION v2) — version .15
- ✅ **รอบ 36: ระบบรูปร่างตามคุณภาพการกิน (ข้อ 5.2 ระบบจริง)** — กินดี 3 มื้อติด=ล่ำ 💪 (+2 EXP/คำ) · ของโทษ 3 มื้อติด=อ้วน 🍩 · อดข้าว 2 มื้อ=ผอมโซ 🦴 · ภาพ 9 ร่างวางใน `img/` เกมโชว์เอง (**ผู้ใช้กำลังทยอยเจนภาพจาก `PROMPTS_CHARACTERS.md`**) — version .14
- ✅ **รอบ 35: prompt กลุ่ม C (ข้อ 4+5.2 → `PROMPTS_CHARACTERS.md` 11 ภาพ รอผู้ใช้เจน) + 🛡️ ควิซอาหารปลอดภัย** (ปุ่มเขียวแถบล่าง lobby · รางวัลวันละรอบ +10/ข้อ +25 ครบ 5) — version .13
- ✅ **รอบ 34: คิว 7725691507 ข้อ 5.1 แยกอาหารคน/สัตว์ + พิษสะสม เสร็จ** (version .12) — เมนู 2 ชุดตามชนิดสัตว์ · เตือนก่อนป้อนอาหารโทษ · บาร์พิษไม่ลดเอง เต็ม 100 ป่วยทันที · ขับพิษ 1,000 — **รอผู้ใช้ทดสอบจริงบน Pages ทั้ง 2 รอบ**
- ✅ บั๊ก "ของขวัญโดนบัง" แก้เสร็จ + ผู้ใช้ทดสอบจริงยืนยันแล้ว (รอบ 31, version .2) · **ไม่มีบั๊กค้าง**
- ✅ เกม feature-complete · item 0 สังคมออนไลน์เสร็จครบ 0.1–0.5 (login/ชื่อ/เพื่อน/แชท/ของขวัญ)
- ⚠️ **ค้างฝั่งผู้ใช้:** publish Firebase rules ใหม่ (โซน `/gifts` + `/world` + `/tinv` — ก้อนเต็มใน `handoff/RULES.md`) + ทดสอบจริง 2 บัญชี + (ถ้าต้องการ) เจนเสียงผีจาก Suno (`PROMPTS_SOUND.md`)
- 🎯 งานถัดไป: เลือกจาก `handoff/TASKS.md` → backlog (item 8 รายได้ออนไลน์ · item 2 ตลาดออนไลน์ · item 3 daily quest)

## 🧪 testkit — mock login เทสต์ preview (copy วางใน 1 eval ได้เลย)
เกมบังคับ Google login (login จริงใน preview ไม่ได้) — ก้อนนี้จำลองครบ:
```js
window.authFetchCloud=()=>Promise.resolve(null);      // cloud ว่าง (หรือคืน {data,at} จำลองเซฟ)
window.authWriteCloud=()=>Promise.resolve();          // กันเขียน DB จริง
window.authDeleteCloud=()=>Promise.resolve();
window.authWriteProfileName=()=>Promise.resolve();    // กันเขียน /users/<uid>/profile/name
window.onlineStart=()=>{};                            // กัน presence/leaderboard เขียนจริง
authOnLogin({uid:'test1',email:'t@test.com'});        // → เข้าหน้าลงทะเบียน เล่นต่อได้
```
- **เพื่อน/แชท/ของขวัญ:** ตั้ง `Online.ready=true` + fake `Online.db={ref:path=>({...})}` (firebase SDK โหลดจริงบน localhost ได้ · ServerValue.TIMESTAMP ใช้ได้) — fake db ต้องรองรับ push/on/off/once/update/orderByKey/limitToLast/get/set/remove/child
- **จบงานล้างเสมอ:** `localStorage.removeItem('petVocabAdventure_v1')` + reload คืนหน้า login

## 🖥️ preview gotchas (เจอซ้ำทุกรอบ — อ่านก่อนเทสต์)
- server ชื่อ **`english-pet-game`** (python http.server, config ใน `.claude/launch.json`) · **ไม่มี Node มีแต่ Python 3.12**
- **จอ preview เป็นจัตุรัส → ถูกมองเป็น portrait → เกมเด้ง overlay "หมุนจอ" (`#rotate-overlay`) มาบัง** · แก้: `preview_resize` เป็น **landscape** (เช่น 1000×640 หรือ 1280×720) ก่อนเสมอ
- **screenshot/`elementFromPoint` มี scale mismatch เชื่อไม่ได้** (แอพ render เล็กมุมบนซ้าย) → วัดขนาด/ตำแหน่งด้วย **`getBoundingClientRect`** เท่านั้น
- **http.server cache เหนียวมาก** (แก้ js/css แล้ว reload ยังได้ของเก่า) → force ใหม่ด้วย eval:
  `await fetch('css/style.css',{cache:'reload'}); location.reload();`
- **Pages build หน่วง 2–5 นาที** หลัง push → เช็ก live ก่อนบอกผู้ใช้: `curl -s ".../version.json?t=$(date +%s)"`

## 💾 commit / deploy
- git identity = iamsuperrich2025 / freddommun@gmail.com · push HTTPS credential ในเครื่องใช้ได้ (ไม่มี gh CLI)
- **`git add` เฉพาะไฟล์ที่แก้ · ห้าม `git add -A`** (มี `js/data/vocab/` untracked ของงาน Sonnet ค้าง — ห้ามแตะ)
- **ทุก push บัมพ์ `version.json`** (ผู้ใช้ที่เปิดค้างถึงเห็นแถบ "มีเวอร์ชันใหม่") · commit message ลงท้าย `Co-Authored-By: Claude ...`

## 🗣️ ตอบผู้ใช้
- ไทย สุภาพ ลงท้าย "ครับ" · ใช้ตาราง/emoji ให้อ่านง่าย · กระชับ ไม่เล่าโค้ดยาว · **ท้ายคำตอบเสนอไอเดียต่อยอด** (ผู้ใช้เป็นครู/ผู้ปกครองไทย)

## 🗺️ เปิดไฟล์ไหนเมื่อไหร่ (path เต็ม — เปิดเฉพาะตอนต้องใช้)
| จะทำอะไร | เปิดไฟล์ |
|----------|----------|
| งานถัดไป / อาการบั๊ก(ยืนยัน) vs เดา(ยังไม่พิสูจน์) / backlog สรุป | `C:\Users\rober\english-pet-game\handoff\TASKS.md` |
| สภาพแวดล้อม + ข้อควรระวังหายาก (image probe, ห้ามหลายชุดแต่งตัว, ลิขสิทธิ์) | `C:\Users\rober\english-pet-game\handoff\NOTES.md` |
| แตะ Firebase / publish rules (ส่งเต็มทั้งหน้าเสมอ) | `C:\Users\rober\english-pet-game\handoff\RULES.md` |
| หาไฟล์/ฟังก์ชัน/โครงสร้างโค้ด | `C:\Users\rober\english-pet-game\handoff\ARCHITECTURE.md` |
| แก้ระบบเกม (สัตว์/บ้าน/บิล/แรงค์/โรงงาน/ตลาด/ออนไลน์/ของขวัญ) | `C:\Users\rober\english-pet-game\handoff\GAME_RULES.md` |
| ดูสเปก backlog เต็ม | `C:\Users\rober\english-pet-game\handoff\BACKLOG.md` |
| รอบเก่า 1–30 ทำอะไรไปแล้ว | `C:\Users\rober\english-pet-game\handoff\HISTORY.md` |

## 🔗 ลิงก์
- เกม: https://iamsuperrich2025.github.io/english-pet-game/ · repo: `iamsuperrich2025/english-pet-game` (branch `main`)
- งานมอบ Sonnet: `TASK_VOCAB_SONNET.md` (คำศัพท์) · `TASK_DICTIONARY_SONNET.md` (พจนานุกรม)
