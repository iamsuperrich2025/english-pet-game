# NOTES.md — สภาพแวดล้อม + ข้อควรระวังหายาก (เปิดตอนติดปัญหาแปลกๆ)

> สิ่งที่ใช้บ่อย (testkit, preview gotchas, commit, cache-bust) อยู่ใน `HANDOFF.md` แล้ว · ไฟล์นี้เก็บของที่นานๆ ใช้ที

## 🛠️ เครื่อง/เครื่องมือ
- **ไม่มี Node · มีแต่ Python 3.12** — preview ใช้ python http.server (พอร์ต 8642 ใน `.claude/launch.json`)
- git identity = iamsuperrich2025 / freddommun@gmail.com · push HTTPS credential ในเครื่อง (ไม่มี gh CLI)
- กดปุ่มใน overlay/async ผ่าน eval → **แยกคนละ call** กับตอนสร้าง overlay (เคย race หลายครั้ง)

## 🖼️ รูปภาพ (ระวังพัง)
- **Windows ซ่อนนามสกุลไฟล์** — เคยเกิด `dog_egg.png.png` · **ห้าม `fetch` ไฟล์ local** ใช้ `new Image()` probe → ดู `probeImages()` ใน `js/images.js`
- รูป PNG ของขวัญ/ของสะสมเป็น **1024×1024** — เวลาโชว์ต้องมี CSS คุมขนาด (เช่น `.ld-pic img{width:84px}`) ไม่งั้นบวมเต็มจอ (บทเรียนรอบ 31)

## 🎮 กติกาดีไซน์ (ผู้ใช้สั่ง — ห้ามฝืน)
- **ห้ามทำระบบใส่เครื่องแต่งตัวหลายชิ้นพร้อมกัน** — ใส่ทีละ 1 ชิ้น
- **ลิขสิทธิ์:** ไม่เจนภาพเลียนแบบเกมจริง — ใช้ "สไตล์เดียวกัน ดีไซน์ออริจินอล"
- Firebase rules เวลาส่งผู้ใช้ **ส่งเต็มทั้งหน้าเสมอ** ห้ามเฉพาะโซน

## 🧱 โครงโค้ด (ทั่วไป)
- **แยก data จาก logic** (`js/data/*` = data · `js/*.js` = logic)
- **ห้ามทำเซฟผู้เล่นเดิมพัง** — field ใหม่ทุกตัวต้องมี default ใน `loadState()` (migration)
- state เซฟที่ localStorage key `petVocabAdventure_v1`
