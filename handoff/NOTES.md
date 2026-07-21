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

## 🪶 ลดขนาดโมเดล .glb ที่หนักเกิน (สูตรรอบ 431 — ใช้ซ้ำได้ทุกโมเดล)
โมเดลจาก Tripo/สแกน มักหนักเป็นสิบ MB (house_01 = 62MB / 1.88M tris) เอาลงเกมไม่ได้ · เครื่องมือลงไว้แล้ว:
`export PATH="$HOME/bin/node:$PATH"` + `gltf-transform` (npm -g @gltf-transform/cli)
- **⚠️ กุญแจสำคัญ: ต้อง "ตัด NORMAL ทิ้งก่อน weld+simplify"** ไม่งั้น simplify ตันอยู่ที่ ~15% ลดไม่ลง
  (ทุก vertex มี normal ต่างกัน = weld รวมไม่ได้ · GLTFLoader คำนวณ normal ให้เองอยู่แล้วเมื่อไม่มี)
- สคริปต์ตัวอย่าง `strip.mjs` (ใช้ @gltf-transform/core+functions+meshoptimizer): ลบ NORMAL/TANGENT → `weld()` → `simplify({ratio:0.02,error:0.35})`
- แล้วต่อด้วย `gltf-transform resize <in> <out> --width 1024 --height 1024` → **`gltf-transform prune`** (ล้าง buffer ที่ไม่ใช้ — ขั้นนี้ตัดจาก 15MB เหลือ 1.1MB)
- ผลจริง: 62MB/1.88M tris → **1.1MB/37.8k tris** หน้าตาในเกมยังใช้ได้ · เก็บต้นฉบับไว้ในเครื่อง (ใส่ .gitignore) ห้ามขึ้น repo
