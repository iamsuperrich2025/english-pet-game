# Frontline rounds 1372–1373

- **รอบ 1373 · Frontline กลางสนามขับผ่านของตกแต่ง (Local only):** ของตกแต่งไม่มี collision; สาเหตุหยุดในภาพเดิมยังไม่ยืนยัน แต่พบขอบ ±89 มองไม่เห็น
- เพิ่ม `frontline-boundary.js` รั้วขอบ ±90 + meadow ชายทราย/น้ำ, จำกัด prop/flora ภายในสนาม โดยคง 15 chunks/ไม่มี asset ใหม่; tank คืนเหตุ edge/base ให้ main/UI แสดง EDGE · TURN หรือ BASE LOCKED พร้อมไทย ไม่เปลี่ยนป้อม/เศรษฐกิจ/network
- ผ่าน native movement 11 checks: ของตกแต่งจริง 6 แบบ×เดินหน้า/ถอยหลัง=12 legs ไม่หยุดสักครั้งและ peer เห็นตรงกัน, edge/base/เลี้ยวกลับ; unit49, visual8, syntax31, coverage/dispose; build2026-09-09.1226 9,384 files/611.9 MiB + validator/production exclusion ผ่าน
- Local `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1373`; namespaceเดิม `frontline_v1_dev/0ba61275a15a39f98a073760/{rooms,inputs}`; ทดสอบ R7349; R1001 อ่านอย่างเดียว; รายงาน/ภาพ workspace work/frontline-1373-*; ไม่ restart/deploy/commit
- **รอบ 1372 · Frontline หน้าเข้าเกมภาพน่ารัก (Local only):** `index.html` + `frontline-launcher.css` แยกสไตล์หน้าเข้าเกม; โลโก้/รถถังยิ้ม ฉากสวน แผงครีม ปุ่มเขียว wallet/tip จริง; ห้องเลข 4 หลักและ Enter/click เดิม; จอเตี้ยเห็นโลโก้ครบ แนวตั้งเลื่อนหน้า welcome ได้แต่สนามยังแนวนอน
- ภาพ built-in image_gen → AVIF 1672×940/180,384 B + WebP fallback 279,948 B; ไม่มี PNG runtime หรือ texture เพิ่มในสนาม; `preview.mjs` allowlist CSS/AVIF เฉพาะ Local; README บันทึกโมดูล/asset/การทดสอบ
- ผ่าน launcher 10 checks (5 viewport, validation, join/AUTO/DROP/FIRE/BOMB/EXIT, no production requests), ตรวจภาพจริงเป็น WebP; build retry สำเร็จ 9,384 files/611.9 MiB + validator + production exclusion; รายงานรวมรอบ 1371–1372 และ prompt ที่ Documents/Codex/2026-09-08/create-a-new-vocab-world-frontline/work/
- Local ใหม่ `http://192.168.1.120:19444/__dev/frontline?room=R1001&v=1372`; restart preview เพื่อเสิร์ฟ CSS/AVIF → namespace `frontline_v1_dev/0ba61275a15a39f98a073760/{rooms,inputs}`; ทดสอบ R9469 แยกจาก R1001; ไม่ deploy/commit หรือเปิดเมนู production
