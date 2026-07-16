# archive (ย้ายอัตโนมัติโดย tools/rotate_handoff.py — ค้นด้วย Grep เท่านั้น ห้ามอ่านทั้งไฟล์)


## ⏬ ย้ายเมื่อ 2026-07-16 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 240:** ตัดแถว "🦸 ตัวละครของหนู ชาย/หญิง" ในตั้งค่าทิ้ง → ใช้ **"ตัวละครในล็อบบี้" (blk1..8 · `state.blockAv`) เป็นรูปโปรไฟล์หลัก** ทุกที่ (`playerAvatarHTML` คืนภาพ blk เสมอ) · แถว blk เปลี่ยน label เป็น "🦸 ตัวละครของหนู · เป็นรูปโปรไฟล์ด้วย" · quiz cheer avatar โชว์เสมอ · registration ยังตั้ง `playerAvatar` male/female เป็น seed default (male→blk1 · female→blk6)


## ⏬ ย้ายเมื่อ 2026-07-16 — จาก handoff/TASKS.md (สรุปสถานะล่าสุด)

- **รอบ 241:** 🎨 ธีมแชท "ร่วมกันทั้งคู่" — ใครเปลี่ยนธีม อีกฝ่ายเห็นเปลี่ยนตามผ่าน DB (เดิมจำแยกในเครื่อง) · โซนใหม่ `/chattheme/<pairId>` = themeId (string) · online.js `chatSetTheme`/`chatWatchTheme` · ui.js openChat: `applyTheme(th,fromRemote)` + watcher (fromRemote ไม่เขียนซ้ำ กัน echo) · unsubscribe ใน close() · **⚠️ ต้อง publish rules (Artifact) ก่อน sync ข้ามเครื่องถึงทำงาน** — ยังไม่ publish = ตกไปใช้ธีมในเครื่องเดิม · ยืนยัน browser (stub Online): local pick เขียน DB + box เปลี่ยน · remote change → box ตามทันที · ไม่มี echo loop · close ปลด watcher · ไม่มี error
