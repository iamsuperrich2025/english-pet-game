# HANDOFF.md — สารบัญส่งต่องาน (Pet Vocab Adventure)

> ⚡ **ไฟล์นี้ตั้งใจให้เล็ก — เป็น "สารบัญ" ไม่ใช่เนื้อหาทั้งหมด** (เดิมยาว 400+ บรรทัด เปลืองโทเคน จึงแตกเป็นไฟล์ย่อยในโฟลเดอร์ `handoff/`)
>
> **session ใหม่:** อ่าน `handoff/STATUS.md` + `handoff/CONVENTIONS.md` ก่อนเสมอ แล้วเปิด**เฉพาะ**ไฟล์ที่งานรอบนี้ต้องใช้ (ไม่ต้องอ่านทุกไฟล์)

## 🧭 เปิดไฟล์ไหนเมื่อไหร่

| จะทำอะไร | อ่านไฟล์ |
|----------|----------|
| 🟢 **อ่านทุก session** — สถานะล่าสุด + งานถัดไป + ที่ค้างฝั่งผู้ใช้ + ประวัติรอบ 24–29 | [`handoff/STATUS.md`](handoff/STATUS.md) |
| 🟢 **อ่านทุก session** — ธรรมเนียม + ประหยัด tokens + mock login + กติกา commit | [`handoff/CONVENTIONS.md`](handoff/CONVENTIONS.md) |
| แตะ Firebase / ต้อง publish rules ใหม่ (ส่งเต็มทั้งหน้าเสมอ) | [`handoff/RULES.md`](handoff/RULES.md) |
| หาไฟล์/ฟังก์ชัน/โครงสร้างโค้ด | [`handoff/ARCHITECTURE.md`](handoff/ARCHITECTURE.md) |
| แก้ระบบเกม (สัตว์/บ้าน/บิล/แรงค์/โรงงาน/ตลาด/ออนไลน์/ชื่อ/ของขวัญ) | [`handoff/GAME_RULES.md`](handoff/GAME_RULES.md) |
| เลือกงานถัดไป / ดูสเปก backlog | [`handoff/BACKLOG.md`](handoff/BACKLOG.md) |
| ต้องรู้ว่ารอบก่อนๆ (1–23) ทำอะไรไปแล้ว | [`handoff/HISTORY.md`](handoff/HISTORY.md) |

## 📸 สถานะย่อ (ดูเต็มใน STATUS.md)
- 🐞 **งานถัดไป = บั๊กค้าง:** ส่งของขวัญจริง 2 บัญชี → toast ข้างล่างโดนบัง อ่านไม่ออก · ลองแก้ z-index แล้วยังไม่หาย → **อ่านหัวข้อ "🐞 บั๊กค้าง" บนสุดของ`handoff/STATUS.md` (มีสเต็ปดีบัก + ต้องขอ screenshot จากผู้ใช้ก่อน)**
- ✅ เกม feature-complete ตาม backlog หลัก · item 0 สังคมออนไลน์เสร็จครบ 0.1–0.5 (login/ชื่อ/เพิ่มเพื่อน/แชท/ของขวัญ)
- ⚠️ **ค้างฝั่งผู้ใช้:** publish rules ใหม่ (เพิ่มโซน `/gifts`) + ทดสอบจริงบน Pages 2 บัญชี
- 🎯 งานอื่นเลือกจาก BACKLOG (item 8 รายได้ออนไลน์ · item 2 ตลาดออนไลน์จริง · item 3 daily quest ฯลฯ)

## 🔗 ลิงก์
- เกม: https://iamsuperrich2025.github.io/english-pet-game/
- repo: `iamsuperrich2025/english-pet-game` (branch `main`) · Firebase console + RTDB → ดู `handoff/RULES.md`
- งานมอบ Sonnet: `TASK_VOCAB_SONNET.md` (คำศัพท์) · `TASK_DICTIONARY_SONNET.md` (พจนานุกรม)

---
> 📁 โฟลเดอร์ `handoff/` มี 7 ไฟล์ย่อย: STATUS · CONVENTIONS · RULES · ARCHITECTURE · GAME_RULES · BACKLOG · HISTORY
> เวลาปิดงานแต่ละรอบ: อัปเดต `handoff/STATUS.md` (ย้ายรอบเก่าลง HISTORY ถ้ายาว) + ไฟล์ย่อยที่เกี่ยวข้อง แล้ว commit
