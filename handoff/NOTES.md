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
- **โมเดล 3D สัตว์ = ตัวเปล่าเสมอ ไม่ใส่เครื่องประดับ (ผู้ใช้สั่ง 10 ก.ค. รอบ 115)** — ไม่ต้องเจนโมเดลแยกตามชุด (เปลืองมาก) เอาแรงไปเพิ่มชนิดสัตว์แทน (เช่น ควาย ในอนาคต) · **ฟังก์ชันแต่งตัว 2D คงไว้ตามเดิม ห้ามตัดออก** — แค่เครื่องประดับไม่โชว์บนโมเดล 3D เท่านั้น (lobby3d.js โหลด `pet_<ชนิด>.glb` ตัวเดียวต่อชนิด ไม่สนใจ item ที่สวม = ถูกต้องแล้ว ไม่ต้องแก้) · เพิ่มสัตว์ใหม่: เพิ่มใน `js/data/pets.js` + ภาพ PNG 2D ตามชุด `petImageKeys` + โมเดล `img/models/pet_<key>.glb` (สูตร Tripo ใน memory/PROMPTS_MODELS_3D.md)
- **ลิขสิทธิ์:** ไม่เจนภาพเลียนแบบเกมจริง — ใช้ "สไตล์เดียวกัน ดีไซน์ออริจินอล"
- Firebase rules เวลาส่งผู้ใช้ **ส่งเต็มทั้งหน้าเสมอ** ห้ามเฉพาะโซน

## 🧱 โครงโค้ด (ทั่วไป)
- **แยก data จาก logic** (`js/data/*` = data · `js/*.js` = logic)
- **`js/data/band/` (ผู้ใช้สั่ง 17 ก.ค. — ใช้ทุก band ทุกหมวด):** อ่าน/ใช้งานได้**เฉพาะไฟล์แบบแยกช่วงคำ** ที่ชื่อลงท้าย `_<คำแรก>-<คำสุดท้าย>` เช่น `b6_academic_abandon-bias.js` · **ห้ามอ่านไฟล์ก้อนรวม** เช่น `b6_academic.js` (data ทั้งก้อนยังไม่แยก เปลือง tokens — วางไว้จัดหมวดหมู่เฉยๆ)
- **ห้ามทำเซฟผู้เล่นเดิมพัง** — field ใหม่ทุกตัวต้องมี default ใน `loadState()` (migration)
- state เซฟที่ localStorage key `petVocabAdventure_v1`

## 🪶 ลดขนาดโมเดล .glb ที่หนักเกิน (สูตรรอบ 431 · ทำเป็นสคริปต์แล้วรอบ 689 — ใช้ซ้ำได้ทุกโมเดล)
**ใช้เลย ไม่ต้องเขียนใหม่:** `bash tools/lighten_glb.sh <in.glb> <out.glb> [ratio=0.03] [error=0.2] [texSize=1024]`
(ทำครบ 8 ขั้นในคำสั่งเดียว: unlit → prune ตัด NORMAL → weld → simplify → join → resize → prune+dedup → quantize)
- **⚠️ กุญแจข้อ 1: ต้อง "ตัด NORMAL ทิ้งก่อน weld+simplify"** ไม่งั้น simplify ตันอยู่ที่ ~15% ลดไม่ลง
  (ทุก vertex มี normal ต่างกัน = weld รวมไม่ได้) · ทำผ่าน CLI ล้วนได้ด้วย `unlit` → `prune --keep-attributes false`
- **⚠️⚠️ กุญแจข้อ 2 (บทเรียนรอบ 689 — เสียเวลาหาอยู่นาน): พอตัด NORMAL แล้ว ต้อง `computeVertexNormals()` คืนตอนโหลดใน three.js**
  ถ้าเอาไปใส่วัสดุที่ใช้แสง (Phong/Lambert/Standard) โดยไม่มี normal → **โมเดลจะเป็นเงาดำทึบตลอด**
  ปรับ `color`/ความสว่างไฟเท่าไรก็ไม่ขึ้น (เหลือแต่ ambient+emissive) · ดูตัวอย่างที่ `ghostGlbEnsure()` ใน `js/adventure3d.js`
- **วัดก่อนโทษโค้ด:** ถ้าโมเดลดูมืดผิดปกติ ให้วัดความสว่างเฉลี่ยของ texture จริงก่อน (วาดลง canvas แล้วเฉลี่ย RGB)
  — ผีรอบ 689 วัดได้ **34/255** คือเทกซ์เจอร์มันมืดเองจริง ๆ ต้องคูณ `material.color.setScalar(1.4)` ช่วย (three.js ยอมให้เกิน 1)
- ผลจริง: house_01 62MB/1.88M tris → **1.1MB/37.8k tris** · ghost 54MB/1.88M tris → **510KB/22.5k tris** (คุณภาพตายังคมเพราะรายละเอียดอยู่ที่ texture ไม่ใช่โพลี)
- เก็บต้นฉบับไว้ในเครื่อง (ใส่ `.gitignore`) ห้ามขึ้น repo · ไฟล์ `_lite` ที่เกมใช้จริง commit ได้ปกติ
