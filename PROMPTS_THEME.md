# 🎨 PROMPTS_THEME.md — คำสั่งเจนภาพธีมเกม "ฟาร์มพาสเทลน่ารัก"

> อัพเดท 572569808 ข้อ 3: ปรับ theme เกมให้น่ารักสไตล์เกมฟาร์มพาสเทล (ตามภาพตัวอย่างที่ผู้ใช้ส่งมา:
> ท้องฟ้าฟ้าอ่อน เมฆฟู ทุ่งหญ้าเขียว ดอกไม้หลากสี กังหันลม บ้านฟาร์ม รั้วไม้ การ์ดขอบมนสีครีม)
> **ขั้นตอน:** ผู้ใช้เจนภาพชุดนี้วางลง `img/theme/` → Claude แก้ CSS ใช้ภาพเป็นพื้นหลัง+ตกแต่ง แล้วทดสอบใน preview

## 📌 กติกาสำคัญ

1. ชื่อไฟล์ตรงเป๊ะ ตัวพิมพ์เล็ก `.png` — วางในโฟลเดอร์ **`img/theme/`**
2. **ภาพพื้นหลัง (ข้อ 1-2) สำคัญสุด** — มีแค่ 2 ภาพนี้ก็เปลี่ยนบรรยากาศเกมได้แล้ว ที่เหลือคือของตกแต่งเสริม
3. พื้นหลังต้อง **สีอ่อน คอนทราสต์ต่ำ** เพื่อให้การ์ดและตัวหนังสือบนจอยังอ่านง่าย (ใน prompt สั่งไว้แล้ว)
4. ภาพตกแต่ง (ข้อ 3-6) ให้เป็น **พื้นหลังโปร่งใส** เหมือนชุดสินค้า

---

### 1) พื้นหลังหลัก (จอมือถือแนวตั้ง) — `theme_bg.png` · ขนาด 1024×1536 หรือสูงกว่า
```text
A dreamy pastel countryside background for a cute children's mobile farm game, vertical portrait orientation: soft light-blue sky with fluffy white clouds at the top, rolling light-green meadow hills below with tiny colorful flowers (pink, yellow, blue), a small wooden fence, distant tiny farmhouse and windmill on the horizon, a soft sandy path winding through the grass. Soft watercolor-like 3D cartoon render, very light and airy, LOW CONTRAST and slightly desaturated so game UI cards remain readable on top, no characters, no animals, no text, no watermark, seamless gentle composition with the busiest details at the edges and a calmer center.
```

### 2) พื้นหลังจอกว้าง (เผื่อเล่นบนคอม) — `theme_bg_wide.png` · ขนาด 1536×1024
```text
The same dreamy pastel countryside scene in wide landscape orientation: soft light-blue sky with fluffy clouds, rolling light-green flower meadows, wooden fences, a small farmhouse on the left horizon and a cute windmill on the right horizon, soft sandy path. Same soft watercolor-like 3D cartoon style, LOW CONTRAST and light so UI stays readable, calm center area, no characters, no text, no watermark.
```

### 3) กังหันลมน่ารัก (ของตกแต่ง) — `theme_windmill.png`
```text
A cute pastel cartoon windmill: cream and soft-red windmill tower with rounded edges, four gentle blades, tiny windows and a little flower bush at its base, soft 3D cartoon render, plain transparent background, square 1:1, no text.
```

### 4) บ้านฟาร์มน่ารัก (ของตกแต่ง) — `theme_farmhouse.png`
```text
A cute pastel cartoon farmhouse: small cream cottage with a soft orange roof, round wooden door, heart-shaped window and flowers along the wall, soft 3D cartoon render, plain transparent background, square 1:1, no text.
```

### 5) เมฆฟูลอย (ของตกแต่ง) — `theme_cloud.png`
```text
A single fluffy cute white cloud, soft and puffy like cotton with a very subtle warm glow underneath, soft 3D cartoon render, plain transparent background, wide shape, no text.
```

### 6) แถบหญ้าดอกไม้ (ขอบล่างจอ) — `theme_grass.png`
```text
A horizontal strip of cute pastel green grass with tiny colorful flowers (pink, yellow, blue) and a few small round bushes, designed as a bottom border decoration, soft 3D cartoon render, plain transparent background above the grass, wide banner shape, no text.
```

---

## ✅ เช็กลิสต์ (6 ภาพ — โฟลเดอร์ `img/theme/`)

`theme_bg.png` · `theme_bg_wide.png` · `theme_windmill.png` · `theme_farmhouse.png` · `theme_cloud.png` · `theme_grass.png`

— ⬜ ยังไม่เจน · เจนครบ (หรืออย่างน้อยข้อ 1) แล้วบอก Claude ได้เลย จะแก้ CSS จัดธีมให้ทั้งเกม + ปรับสีการ์ด/ปุ่มให้เข้าชุดพาสเทล แล้วทดสอบใน preview ก่อน push
