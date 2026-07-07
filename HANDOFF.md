# HANDOFF.md — สารบัญส่งต่องาน (Pet Vocab Adventure)

> 📂 **รากโปรเจกต์: `C:\Users\rober\english-pet-game\`** — ⚠️ working directory ของ session ใหม่คือ `C:\Users\rober` (ไม่ใช่ในโปรเจกต์) ดังนั้นเวลาเปิด/แก้ไฟล์ **ต้องใช้ path เต็มเสมอ** (เติม `C:\Users\rober\english-pet-game\` นำหน้า) · path ทุกอันในไฟล์นี้และในโฟลเดอร์ `handoff/` เขียนแบบเต็มไว้แล้ว
>
> ⚡ **ไฟล์นี้ตั้งใจให้เล็ก — เป็น "สารบัญ" ไม่ใช่เนื้อหาทั้งหมด** (เดิมยาว 400+ บรรทัด เปลืองโทเคน จึงแตกเป็นไฟล์ย่อยในโฟลเดอร์ `handoff/`)
>
> **session ใหม่:** อ่าน `C:\Users\rober\english-pet-game\handoff\STATUS.md` + `C:\Users\rober\english-pet-game\handoff\CONVENTIONS.md` ก่อนเสมอ แล้วเปิด**เฉพาะ**ไฟล์ที่งานรอบนี้ต้องใช้ (ไม่ต้องอ่านทุกไฟล์)

## 🧭 เปิดไฟล์ไหนเมื่อไหร่ (path เต็ม — คัดลอกไปเปิดได้เลย)

| จะทำอะไร | เปิดไฟล์ |
|----------|----------|
| 🟢 **อ่านทุก session** — สถานะล่าสุด + งานถัดไป + ที่ค้างฝั่งผู้ใช้ + ประวัติรอบล่าสุด | `C:\Users\rober\english-pet-game\handoff\STATUS.md` |
| 🟢 **อ่านทุก session** — ธรรมเนียม + ประหยัด tokens + mock login + กติกา commit | `C:\Users\rober\english-pet-game\handoff\CONVENTIONS.md` |
| แตะ Firebase / ต้อง publish rules ใหม่ (ส่งเต็มทั้งหน้าเสมอ) | `C:\Users\rober\english-pet-game\handoff\RULES.md` |
| หาไฟล์/ฟังก์ชัน/โครงสร้างโค้ด | `C:\Users\rober\english-pet-game\handoff\ARCHITECTURE.md` |
| แก้ระบบเกม (สัตว์/บ้าน/บิล/แรงค์/โรงงาน/ตลาด/ออนไลน์/ชื่อ/ของขวัญ) | `C:\Users\rober\english-pet-game\handoff\GAME_RULES.md` |
| เลือกงานถัดไป / ดูสเปก backlog | `C:\Users\rober\english-pet-game\handoff\BACKLOG.md` |
| ต้องรู้ว่ารอบก่อนๆ (1–23) ทำอะไรไปแล้ว | `C:\Users\rober\english-pet-game\handoff\HISTORY.md` |

## 📸 สถานะย่อ (ดูเต็มใน STATUS.md)
- ✅ **บั๊ก "ของขวัญโดนบัง" แก้แล้ว (รอบ 31, 7 ก.ค.):** ต้นตอคือรูปในกล่องยืนยัน `askConfirm` ไม่ถูกคุมขนาด (CSS scope เฉพาะ `.list-dialog`) ไม่เกี่ยว toast/z-index · แก้ `css/style.css` scope เป็น `.levelup-box` → รอผู้ใช้ทดสอบจริงยืนยันบน Pages
- ✅ เกม feature-complete ตาม backlog หลัก · item 0 สังคมออนไลน์เสร็จครบ 0.1–0.5 (login/ชื่อ/เพิ่มเพื่อน/แชท/ของขวัญ)
- ⚠️ **ค้างฝั่งผู้ใช้:** publish rules ใหม่ (เพิ่มโซน `/gifts`) + ทดสอบจริงบน Pages 2 บัญชี
- 🎯 งานอื่นเลือกจาก BACKLOG (item 8 รายได้ออนไลน์ · item 2 ตลาดออนไลน์จริง · item 3 daily quest ฯลฯ)

## 🔗 ลิงก์
- เกม: https://iamsuperrich2025.github.io/english-pet-game/
- repo: `iamsuperrich2025/english-pet-game` (branch `main`) · Firebase console + RTDB → ดู `handoff\RULES.md`
- งานมอบ Sonnet: `C:\Users\rober\english-pet-game\TASK_VOCAB_SONNET.md` (คำศัพท์) · `C:\Users\rober\english-pet-game\TASK_DICTIONARY_SONNET.md` (พจนานุกรม)

---
> 📁 โฟลเดอร์ `C:\Users\rober\english-pet-game\handoff\` มี 7 ไฟล์: STATUS · CONVENTIONS · RULES · ARCHITECTURE · GAME_RULES · BACKLOG · HISTORY
> เวลาปิดงานแต่ละรอบ: อัปเดต `handoff\STATUS.md` (ย้ายรอบเก่าลง HISTORY ถ้ายาว) + ไฟล์ย่อยที่เกี่ยวข้อง แล้ว commit · path ในโค้ด (css/js) เป็น relative จากรากโปรเจกต์ — เปิดด้วย path เต็มหรือใช้ Grep/Glob ในโปรเจกต์
