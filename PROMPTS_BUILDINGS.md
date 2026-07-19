# 🏙️ PROMPTS_BUILDINGS.md — ภาพผนังตึกโลกเฮลิคอปเตอร์ 🚁

ตึกในโลกเฮลิฯ ตอนนี้มี **หน้าต่างจำลอง (procedural)** ให้ดูมีมิติแล้ว — ถ้าอยากให้ **สมจริงขึ้น** วางไฟล์ผนังจริงชุดนี้ เกมจะเอามาแปะตึกเอง (tile ซ้ำขึ้นตามความสูงตึกอัตโนมัติ)

## 📌 กติกาสำคัญ (สำคัญกว่าปกติ — เพราะภาพต้อง "ต่อกันได้")

1. **ชื่อไฟล์เป๊ะ:** `facade_1.png` … `facade_6.png` (ตัวพิมพ์เล็ก) วางในโฟลเดอร์ **`img/buildings/`** (สร้างใหม่ได้เลย)
2. ✅ **ผูกเข้าเกมแล้ว** — เกมตรวจหา `facade_1..6.png` เอง มีกี่ภาพใช้เท่านั้น · ตึกไหนไม่มีภาพใช้หน้าต่าง procedural เดิม · ไม่ต้องแก้โค้ด
3. 🔑 **ต้องเป็น "seamless / tileable texture"** — ภาพต้องต่อกันได้ทั้ง**แนวตั้งและแนวนอน** (ขอบซ้าย=ขอบขวา · ขอบบน=ขอบล่าง) เพราะเกมจะ tile ซ้ำขึ้นตึกสูง **ถ้าไม่ seamless จะเห็นรอยต่อเป็นตารางชัด** → ในโปรมต์ย้ำคำว่า `seamless tileable texture, edges wrap perfectly`
4. **มุมตรง (flat / orthographic front view)** — เป็น "พื้นผิวผนัง" ไม่ใช่ภาพตึกทั้งหลังมีมุมมอง (ห้าม perspective/ท้องฟ้า/พื้น/ขอบตึก) · เห็นเฉพาะ**หน้าผนัง+หน้าต่าง**เต็มเฟรม
5. **จัตุรัส 1:1 (1024×1024)** พื้นหลังทึบเต็มเฟรม (ไม่ต้องโปร่งใส) · ไม่มีตัวอักษร/ลายน้ำ
6. **สไตล์ให้เข้ากับเกม low-poly การ์ตูนสดใส** (กลางวัน สีสด คลีน เรียบ) — ไม่เอาแนวโฟโต้เรียลหม่น/สกปรก · ย้ำ `bright clean cartoon low-poly style, daytime`
7. 1 ตารางหน้าต่าง = ~1 ชั้นตึก · ให้มี **หน้าต่างเรียงเป็นแถวสม่ำเสมอ** (เกม tile ~ทุก 8m กว้าง / ทุก 6m สูง)

---

## ตึกที่ 1 · ตึกออฟฟิศกระจกสีฟ้า — `facade_1.png`

```text
A seamless tileable texture of a modern glass office building facade, flat front orthographic view filling the whole frame. Even grid of large rectangular light-blue glass windows separated by thin light-grey metal frames, some windows slightly reflective, a few softly lit warm yellow. Bright clean cartoon low-poly game art style, daytime, flat even lighting, cheerful and simple. Seamless tileable texture, the left edge wraps perfectly to the right edge and the top edge to the bottom edge so it repeats with no visible seams. No perspective, no sky, no ground, no roof, no building edges — only the flat wall surface. Square 1:1 image, no text, no watermark.
```

## ตึกที่ 2 · อพาร์ตเมนต์ปูนครีม — `facade_2.png`

```text
A seamless tileable texture of a cream-and-tan concrete apartment building facade, flat front orthographic view filling the whole frame. Regular grid of square windows with white frames and small balconies, warm beige wall panels, a few windows lit soft yellow. Bright clean cartoon low-poly game art style, daytime, flat even lighting, cheerful and simple. Seamless tileable texture, the left edge wraps perfectly to the right edge and the top edge to the bottom edge so it repeats with no visible seams. No perspective, no sky, no ground, no roof, no building edges — only the flat wall surface. Square 1:1 image, no text, no watermark.
```

## ตึกที่ 3 · ตึกโมเดิร์นสีสดใส — `facade_3.png`

```text
A seamless tileable texture of a colorful modern building facade, flat front orthographic view filling the whole frame. Grid of windows framed by cheerful coral, teal, and yellow wall panels in a playful checker pattern, clean white window frames, a few windows lit. Bright clean cartoon low-poly game art style, daytime, flat even lighting, fun and vibrant. Seamless tileable texture, the left edge wraps perfectly to the right edge and the top edge to the bottom edge so it repeats with no visible seams. No perspective, no sky, no ground, no roof, no building edges — only the flat wall surface. Square 1:1 image, no text, no watermark.
```

## ตึกที่ 4 · ตึกอิฐแดงคลาสสิก — `facade_4.png`

```text
A seamless tileable texture of a classic red-brick building facade, flat front orthographic view filling the whole frame. Warm red-brown brick wall with an even grid of tall windows, cream stone window sills and frames, a few windows lit soft yellow. Bright clean cartoon low-poly game art style, daytime, flat even lighting, cozy and simple. Seamless tileable texture, the left edge wraps perfectly to the right edge and the top edge to the bottom edge so it repeats with no visible seams. No perspective, no sky, no ground, no roof, no building edges — only the flat wall surface. Square 1:1 image, no text, no watermark.
```

## ตึกที่ 5 · ตึกกระจกเขียวมรกต — `facade_5.png`

```text
A seamless tileable texture of a green glass skyscraper facade, flat front orthographic view filling the whole frame. Even grid of emerald and mint green reflective glass windows with slim dark mullions, sleek and modern, a few panels catching light. Bright clean cartoon low-poly game art style, daytime, flat even lighting, cheerful and simple. Seamless tileable texture, the left edge wraps perfectly to the right edge and the top edge to the bottom edge so it repeats with no visible seams. No perspective, no sky, no ground, no roof, no building edges — only the flat wall surface. Square 1:1 image, no text, no watermark.
```

## ตึกที่ 6 · ตึกพาสเทลน่ารัก — `facade_6.png`

```text
A seamless tileable texture of a cute pastel building facade, flat front orthographic view filling the whole frame. Soft lavender and baby-pink wall panels with a neat grid of arched windows, white frames, tiny flower boxes, a few windows warmly lit. Bright clean cartoon low-poly game art style, daytime, flat even lighting, sweet and simple. Seamless tileable texture, the left edge wraps perfectly to the right edge and the top edge to the bottom edge so it repeats with no visible seams. No perspective, no sky, no ground, no roof, no building edges — only the flat wall surface. Square 1:1 image, no text, no watermark.
```

---

## 💡 เคล็ดลับ

- **เห็นรอยต่อเป็นตาราง?** = ภาพยังไม่ seamless จริง → ย้ำ `perfectly seamless tileable, no visible seams when repeated` หรือใช้เครื่องมือ make-tileable (เช่นใน Photopea filter > other > offset แล้วแต้มรอยต่อ)
- **หน้าต่างเล็ก/ถี่ไป?** ตอน tile จริงจะยิ่งถี่ → สั่ง `large windows, few rows` (เกมคูณ repeat ตามความสูงตึกอยู่แล้ว)
- **อยากให้ดูเหมือนกลางคืน?** เปลี่ยน `daytime` → `at dusk, many windows glowing warm yellow` (แต่โลกเฮลิฯเป็นกลางวัน แนะนำ daytime ให้เข้าฉาก)
- ไม่ต้องครบ 6 ภาพก็ได้ — มีกี่ภาพเกมสุ่มใช้เท่านั้น ที่เหลือใช้หน้าต่าง procedural เดิม

---

# 🆕 ชุด "สมจริง (photorealistic)" — ผู้ใช้ขอ 19 ก.ค. 2026 (รอบ 364)

ชุดบนเป็นสไตล์การ์ตูน — ชุดนี้แทนที่ได้เลย ใช้ชื่อไฟล์/กติกาเดิมทุกข้อ (seamless 1:1 1024 มุมตรง ไม่มีตัวอักษร)
**Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/597a2937-aefe-486e-877a-15885d3bfd66
สรุปหัวข้อ 6 ตึก: 1=กระจกฟ้าออฟฟิศ · 2=อพาร์ตเมนต์ปูนครีม+ระเบียง+แอร์ · 3=คอนกรีต-ไม้โมเดิร์น · 4=อิฐแดงคลาสสิก · 5=กระจกเขียวมรกต+คาดขาว · 6=หินทรายอบอุ่นกรอบบรอนซ์
โครงพรอมป์ต่างจากชุดการ์ตูนแค่: `photorealistic ... realistic architectural detail, neutral even daylight, no harsh shadows, 4k detail` แทน `bright clean cartoon low-poly style`
