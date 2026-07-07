# HANDOFF.md — BOOT ไฟล์เดียวจบ (Pet Vocab Adventure)

> 📂 ราก `C:\Users\rober\english-pet-game\` · ⚠️ working dir = `C:\Users\rober` → **เปิดไฟล์ใช้ path เต็มเสมอ**
> 🚀 **session ใหม่: อ่านไฟล์นี้ไฟล์เดียวพอเริ่มงาน** (เดิมต้องอ่าน 3 ไฟล์ — ยุบมาไว้นี่หมดแล้ว) · ไฟล์อื่นเปิดเฉพาะตอนต้องใช้ (ดูตารางล่างสุด)

## 🏆 กฎทอง (ยึด 4 ข้อนี้ก่อนเสมอ)
1. **ภาพก่อนโค้ด** — บั๊กที่มองเห็นได้ (UI/layout) → **ขอ/ดู screenshot ก่อน ห้ามเปิดโค้ดเดา** (รอบที่ผ่านมาเดา z-index จากโค้ดเสียเวลาเปล่า พอเห็นภาพเจอต้นตอทันที)
2. **Grep ก่อน Read** — ไฟล์ใหญ่ (`ui.js` ~2,000 บรรทัด, `vocab.js`, `collectibles.js`) หาชื่อฟังก์ชันด้วย Grep แล้ว Read เฉพาะช่วง (offset+limit) · **ห้ามอ่านทั้งไฟล์**
3. **preview: resize landscape ก่อน · เชื่อ `getBoundingClientRect` ไม่เชื่อ screenshot/elementFromPoint** (ดู 🖥️ ล่าง)
4. **จบงาน: บัมพ์ `version.json` → commit เฉพาะไฟล์ที่แก้ (ห้าม `git add -A`) → อัปเดต `handoff/TASKS.md`**

## 📸 สถานะปัจจุบัน (7 ก.ค. 2026)
- ✅ **บั๊ก "ของขวัญโดนบัง" แก้แล้ว** (รอบ 31) — ต้นตอ: รูปในกล่องยืนยัน `askConfirm` ไม่ถูกคุมขนาด (CSS scope เฉพาะ `.list-dialog`) · แก้ scope เป็น `.levelup-box` · รอผู้ใช้ hard-refresh ยืนยันบน Pages
- ✅ เกม feature-complete · item 0 สังคมออนไลน์เสร็จครบ 0.1–0.5 (login/ชื่อ/เพื่อน/แชท/ของขวัญ)
- ⚠️ **ค้างฝั่งผู้ใช้:** publish Firebase rules ใหม่ (โซน `/gifts` — ก้อนเต็มใน `handoff/RULES.md`) + ทดสอบจริง 2 บัญชี
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
