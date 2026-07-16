# HANDOFF.md — BOOT ไฟล์เดียวจบ (Pet Vocab Adventure)

> 📂 ราก `C:\Users\rober\english-pet-game\` · ⚠️ working dir = `C:\Users\rober` → **เปิดไฟล์ใช้ path เต็มเสมอ**
> 🚀 **session ใหม่: อ่านไฟล์นี้ไฟล์เดียวพอเริ่มงาน** (เดิมต้องอ่าน 3 ไฟล์ — ยุบมาไว้นี่หมดแล้ว) · ไฟล์อื่นเปิดเฉพาะตอนต้องใช้ (ดูตารางล่างสุด)

## 🏆 กฎทอง (ยึด 4 ข้อนี้ก่อนเสมอ)
1. **ภาพก่อนโค้ด** — บั๊กที่มองเห็นได้ (UI/layout) → **ขอ/ดู screenshot ก่อน ห้ามเปิดโค้ดเดา** (รอบที่ผ่านมาเดา z-index จากโค้ดเสียเวลาเปล่า พอเห็นภาพเจอต้นตอทันที)
2. **CODE_MAP ก่อน Grep ก่อน Read** — หาว่าฟังก์ชัน/ค่าคงที่อยู่ไหน: Grep ชื่อใน `handoff/CODE_MAP.md` (แผนที่ `ชื่อ:บรรทัด` ทุกไฟล์ js เจนอัตโนมัติ) → Read ไฟล์จริง offset=บรรทัดนั้น limit=40 · ไฟล์ใหญ่ (`adventure3d.js` ~7,100 บรรทัด · `ui.js` ~5,900) **ห้ามอ่านทั้งไฟล์** · หาสิ่งที่ไม่ใช่ชื่อฟังก์ชัน (selector/ข้อความ) ค่อย Grep โค้ดตรง
3. **preview: resize landscape ก่อน · เชื่อ `getBoundingClientRect` ไม่เชื่อ screenshot/elementFromPoint** (ดู 🖥️ ล่าง)
4. **จบงาน: บัมพ์ `version.json` → commit เฉพาะไฟล์ที่แก้ (ห้าม `git add -A`) → อัปเดต `handoff/TASKS.md` (แบบย่อ ดูข้อ 8) → `python tools/rotate_handoff.py` → 🚀 `bash tools/deploy_firebase.sh` (⚠️ push อย่างเดียว "ไม่ขึ้นเว็บ"! เว็บจริง = Firebase Hosting `vocabworld.web.app` ไม่ใช่ GitHub Pages) → ยืนยัน `curl -s https://vocabworld.web.app/version.json` ตรงเลขที่บัมพ์**
5. **เลือก session ตามการประหยัด token (ผู้ใช้ยกเป็นกฎเคร่งครัด 12 ก.ค. 2026): ทุกครั้งที่ผู้ใช้เสนอ/สั่งงานใหม่ ต้องประเมินก่อนเริ่มเสมอ** — ทำใน session เดิมถูกกว่า (context โหลดแล้ว งานเล็ก) → **ทำเลย ไม่ต้องพูดถึง** · New session ถูกกว่า (session เดิมยาว/context บวม, งานใหม่ไม่พึ่งของเดิม) → **"ต้องบอกทุกครั้ง" ห้ามเงียบแล้วทำต่อ**
6. **อนุญาตล่วงหน้าทุกงานเกม (ผู้ใช้สั่ง 8 ก.ค. 2026):** งานเกมนี้+ไอเดียต่อยอดทุกกรณี → **ทำเลย จบงาน commit+push แล้วรายงาน ไม่ต้องถาม "สนใจไหม/ทำเลยไหม"** · **ยกเว้นต้องถามก่อน:** ทำให้ผู้ใช้เสียเงินเพิ่ม / เสี่ยงการเงิน / เสี่ยงความปลอดภัย (เช่น หย่อน rules) / งานใหญ่จนขัดกฎ token (ข้อ 5) · กฎนี้ไม่ยกเลิกการถามเมื่อ**งานกำกวม** (ไม่แน่ใจว่าหมายถึงงานไหน → ถามก่อน อย่าเดา)
7. **ทุกหน้าต่าง/dialog ที่เปิดใหม่ ต้องเห็นข้อมูลครบทั้งใบ ไม่มี scrollbar ไม่ต้องเลื่อน (กฎถาวรผู้ใช้ 12 ก.ค. 2026):** ออกแบบให้หด/จัดเรียงเองตามจอ (หัวแนวนอน/clamp ตาม vh/หลายคอลัมน์) · ทำ dialog ใหม่หรือแก้เดิม → **ทดสอบจอเตี้ย 812×375 เสมอ** (`scrollHeight<=clientHeight` + กล่องทั้งใบอยู่ในจอ) · ตัวอย่างพลาด: กล่องโบนัสออนไลน์รอบ 156 ปุ่มหลุดจอ → แก้รอบ 167
8. **💰 โหมดประหยัด token (รอบ 250):** บันทึกรอบเขียน**ที่เดียว** = bullet ย่อ **≤4 บรรทัด**ใน `handoff/TASKS.md` ▸ "สรุปสถานะล่าสุด" (อะไร/ต้นตอ/แก้ไฟล์ไหน/ยืนยันยังไง/ค้างอะไร) · `### รอบ N` รายละเอียดเต็มเพิ่มเฉพาะงานซับซ้อนจริง · **ห้ามคัดลอกเนื้อยาวซ้ำข้ามไฟล์ handoff** (เขียนที่เดียว+ชี้ path) · จบงานรัน `python tools/rotate_handoff.py` (ย้ายรอบเก่าเข้า `handoff/archive/` อัตโนมัติ + เตือนงบ: HANDOFF ≤30KB · TASKS ≤80KB) · ประวัติเก่า **Grep** `รอบ <เลข>` ใน `handoff/archive/` ห้ามอ่านทั้งไฟล์ · บูต session ใหม่: อ่าน HANDOFF ทั้งไฟล์ (เล็กแล้ว) + `handoff/TASKS.md` แค่ **Read limit=70**

## 📸 สถานะปัจจุบัน
สถานะรอบล่าสุด/งานค้าง **ดูที่เดียว**: `handoff/TASKS.md` หัวไฟล์ (### 📌 สรุปสถานะล่าสุด + ▶️ งานค้างถัดไป) — **ห้ามเขียนสถานะรอบซ้ำในไฟล์นี้** (เลิกใช้ตั้งแต่รอบ 250 · ของเก่าอยู่ `handoff/archive/HANDOFF_STATUS.md`)

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
- **force cache แล้วยังได้ของเก่า + ไฟล์ขนาดผิดปกติ = dev server ตายไปแล้ว** (เจอรอบ 167: sw.js เสิร์ฟ cache แบบ offline เงียบๆ เกมยังเดินเหมือนปกติ!) → `preview_start` ใหม่ + `navigator.serviceWorker.getRegistrations().then(rs=>rs.map(r=>r.unregister()))` แล้ว reload · เช็กเร็ว: `fetch('js/ui.js?bust='+Date.now()).then(r=>r.text())` ดูว่ามีโค้ดที่เพิ่งแก้ไหม
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
| หาว่าฟังก์ชัน/ค่าคงที่/CSS selector อยู่บรรทัดไหน | Grep ชื่อใน `C:\Users\rober\english-pet-game\handoff\CODE_MAP.md` (เจนอัตโนมัติ ห้ามแก้มือ · บั๊ก UI เริ่มหา selector ที่นี่) |
| โครงสร้างโค้ด/ภาพรวมสถาปัตยกรรม | `C:\Users\rober\english-pet-game\handoff\ARCHITECTURE.md` |
| แก้ระบบเกม (สัตว์/บ้าน/บิล/แรงค์/โรงงาน/ตลาด/ออนไลน์/ของขวัญ) | `C:\Users\rober\english-pet-game\handoff\GAME_RULES.md` |
| ดูสเปก backlog เต็ม | `C:\Users\rober\english-pet-game\handoff\BACKLOG.md` |
| ประวัติรอบเก่า (รายละเอียดเต็มทุกรอบ) | **Grep** `รอบ <เลข>` ใน `C:\Users\rober\english-pet-game\handoff\archive\TASKS_ROUNDS.md` (+`HANDOFF_STATUS.md` · รอบ 1–30 = `handoff\HISTORY.md`) — ห้ามอ่านทั้งไฟล์ |

## 🔗 ลิงก์
- **เกม (live): https://vocabworld.web.app** — Firebase Hosting site `vocabworld` ในโปรเจกต์ `english-pet-game` (ย้ายรอบ 134 หลังบัญชี GitHub โดน flag ทำ Pages 404 ทั้งเว็บ · deploy: `bash tools/deploy_firebase.sh` — CLI login ค้างในเครื่องแล้ว · Node พกพา `C:\Users\rober\bin\node` + firebase-tools ลงแล้ว)
- ~~https://iamsuperrich2025.github.io/english-pet-game/~~ (GitHub Pages — ใช้ไม่ได้จนกว่าบัญชีปลด flag · repo ยังใช้เก็บโค้ด push ได้ปกติ)
- repo: `iamsuperrich2025/english-pet-game` (branch `main`)
- งานมอบ Sonnet: `TASK_VOCAB_SONNET.md` (คำศัพท์) · `TASK_DICTIONARY_SONNET.md` (พจนานุกรม)
