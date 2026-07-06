# CONVENTIONS.md — ธรรมเนียมการทำงาน (อ่านทุก session)

> 📂 รากโปรเจกต์ `C:\Users\rober\english-pet-game\` · เปิดไฟล์ต้องใช้ path เต็ม (working dir = `C:\Users\rober`) · ไฟล์ย่อยอื่นอยู่ที่ `C:\Users\rober\english-pet-game\handoff\`

## ตอบผู้ใช้
- ตอบภาษาไทย สุภาพ ลงท้าย "ครับ" ใช้ตาราง/อีโมจิให้อ่านง่าย · ผู้ใช้คือครู/ผู้ปกครองชาวไทย
- ตอบกระชับ ตารางสั้น ไม่ต้องเล่ารายละเอียดโค้ดยาว
- ผู้ใช้ชอบให้เสนอไอเดียต่อยอดท้ายคำตอบ

## 💰 ประหยัด tokens (สำคัญ — ผู้ใช้สั่งเอง)
- **ห้ามอ่านไฟล์ใหญ่ทั้งไฟล์** โดยเฉพาะ ui.js (~2,000 บรรทัด) / HANDOFF+handoff/* / vocab.js / collectibles.js — ใช้ Grep หาชื่อฟังก์ชันก่อน แล้ว Read เฉพาะช่วงบรรทัด (offset+limit)
- **HANDOFF เป็นสารบัญ** — เปิดเฉพาะไฟล์ย่อยใน `handoff/` ที่งานรอบนี้ต้องใช้ (ดูตารางใน HANDOFF.md) · ประวัติ "รอบ..." เก่าๆ (`handoff/HISTORY.md`) ไม่ต้องอ่านถ้าไม่ติดปัญหา
- commit: **add เฉพาะไฟล์ที่แก้ ห้าม `git add -A`** (มี `js/data/vocab/` untracked ของงาน Sonnet ค้างอยู่ — ห้ามแตะ ห้าม commit จนงานคำศัพท์เสร็จครบ)

## การทำงาน/ทดสอบ
- แยก data จาก logic · **ห้ามทำเซฟผู้เล่นเดิมพัง** (field ใหม่ต้องมี default ใน `loadState`)
- ทำเสร็จต้องทดสอบจริงใน preview (eval จำลองเวลา/คลิก — mock `Date.now` ได้) รายงานผลเป็นตาราง · **จบงานรีเซ็ต `localStorage.removeItem('petVocabAdventure_v1')` + reload คืนหน้า login เสมอ**
- **แก้เกมเสร็จ+ทดสอบผ่าน → commit + push ด้วยทุกครั้ง** (Pages อัปเดตเองใน 1–2 นาที) · **ทุกครั้งที่ push ให้บัมพ์เลข `v` ใน `version.json`** (เช่น `.2`→`.3`) ผู้ใช้ที่เปิดค้างถึงจะเห็นแถบ "มีเวอร์ชันใหม่"
- commit message ลงท้าย `Co-Authored-By: Claude ...` · ห้าม `git add -A` (ดูข้างบน)

## ⚠️ เครื่องมือ/ข้อควรระวัง
- เครื่องนี้**ไม่มี Node มีแต่ Python 3.12** · git identity = iamsuperrich2025 / freddommun@gmail.com (push HTTPS credential ในเครื่องใช้ได้ ไม่มี gh CLI)
- **http.server cache เหนียวมาก** (แก้ js แล้ว reload ยังได้โค้ดเก่า — เช็กด้วย `typeof ฟังก์ชันใหม่`): บังคับโหลดใหม่ด้วย eval `await Promise.all(files.map(f=>fetch(f,{cache:'reload'})))` แล้ว `location.reload()`
- **preview:** server ชื่อ `english-pet-game` (python http.server พอร์ต 8642 ใน `.claude/launch.json`) · กดปุ่มใน overlay/async ผ่าน eval ให้**แยกคนละ call**กับตอนสร้าง (เคย race หลายครั้ง) · screenshot อาจ timeout — เช็ก DOM ผ่าน eval แทน · จอ preview จัตุรัสโดน overlay "หมุนจอ" → `preview_resize` เป็น 1280×720 ก่อน screenshot
- ระวังไฟล์ผู้ใช้: Windows ซ่อนนามสกุลไฟล์ เคยเกิด `dog_egg.png.png` · **ห้าม fetch ไฟล์ local** ใช้ `new Image()` probe (`probeImages()` ใน js/images.js)
- ห้ามทำระบบใส่เครื่องแต่งตัวหลายชิ้นพร้อมกัน (ผู้ใช้สั่งยกเลิก) — ใส่ทีละ 1 ชิ้น
- ลิขสิทธิ์: ไม่เจนภาพเลียนแบบเกมจริง ใช้ "สไตล์เดียวกัน ดีไซน์ออริจินอล"

## 🔑 mock login สำหรับทดสอบ preview (เกมบังคับ Google login — login จริงใน preview ไม่ได้)
```js
window.authFetchCloud  = ()=>Promise.resolve(null);   // จำลอง cloud ว่าง (หรือคืน {data,at} จำลองเซฟ)
window.authWriteCloud  = ()=>Promise.resolve();       // กันเขียนขึ้น DB จริง
window.authDeleteCloud = ()=>Promise.resolve();
window.authWriteProfileName = ()=>Promise.resolve();  // กันเขียน /users/<uid>/profile/name จริง (ข้อ 0.2)
window.onlineStart     = ()=>{};                      // กัน presence/leaderboard เขียน DB จริง
authOnLogin({uid:'test1', email:'t@test.com'});       // → เข้าหน้าลงทะเบียน เล่นต่อได้ปกติ
```
- ทดสอบระบบเพื่อน/แชท/ของขวัญ: ใช้ fake `Online.db={ref:path=>({...})}` + `Online.ready=true` (firebase SDK โหลดจริงบน localhost ได้ ServerValue.TIMESTAMP ใช้ได้) · fake db ต้องรองรับ push/on/off/once/update/orderByKey/limitToLast/get/set/remove/child ตามที่ engine เรียก
- จบงานล้างด้วย `localStorage.removeItem('petVocabAdventure_v1')` + reload
