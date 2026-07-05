# 🎨 PROMPTS_THEME.md — คำสั่งเจนภาพธีมเกม "เมืองทันสมัยโทนฟ้า" (Modern Blue City)

> **สไตล์ล่าสุดตามภาพตัวอย่างที่สองของผู้ใช้ (5 ก.ค. 2026):** เมืองสร้างใหม่ทันสมัยโทนสีฟ้า —
> ท้องฟ้าสดใส ตึกระฟ้ากระจกสีฟ้า แม่น้ำใสสะท้อนแสง ถนนโค้ง สวนสีเขียว
> การ์ด UI ขาว-ฟ้าขอบมนเงาวาว ปุ่มฟ้าไล่เฉด (สไตล์เกมสร้างเมืองมือถือ)
> ⚠️ **แทนที่เวอร์ชันเดิม (ฟาร์มพาสเทล) ทั้งไฟล์ — ผู้ใช้เปลี่ยนสไตล์แล้ว อย่าใช้ชุดเก่า**
> **ขั้นตอน:** ผู้ใช้เจนภาพวางลง `img/theme/` → เปิด session ใหม่ให้ Claude จัดธีม CSS ทั้งเกม (ผู้ใช้สั่งทำธีมใน session ใหม่)

## 📌 กติกาสำคัญ

1. ชื่อไฟล์ตรงเป๊ะ ตัวพิมพ์เล็ก `.png` — วางในโฟลเดอร์ **`img/theme/`**
2. **ภาพพื้นหลัง (ข้อ 1-2) สำคัญสุด** — มีแค่ 2 ภาพนี้ก็เปลี่ยนบรรยากาศเกมได้แล้ว ที่เหลือคือของตกแต่งเสริม
3. พื้นหลังสั่งให้ **กลางภาพโล่ง+ซอฟต์** เพื่อให้การ์ดและตัวหนังสือบนจออ่านง่าย (ใน prompt สั่งไว้แล้ว)
4. ภาพตกแต่ง (ข้อ 3-6) ให้เป็น **พื้นหลังโปร่งใส**
5. เจนต่อเนื่องในแชทเดียวกัน พิมพ์กำกับ *"use the exact same modern blue city-builder game style as the previous image"*

---

### 1) พื้นหลังหลัก (จอมือถือแนวตั้ง) — `theme_bg.png` · ขนาด 1024×1536 หรือสูงกว่า
```text
A beautiful modern city background for a mobile city-builder style game, vertical portrait orientation: bright light-blue sunny sky with a few soft white clouds at the top, gleaming blue glass skyscrapers and modern towers lining both left and right edges, a calm wide river with gentle light reflections and smooth curving light-grey roads in the lower half, small green parks with rounded trees tucked between buildings, clean cheerful semi-realistic 3D cartoon render in a cool blue color palette. Keep the CENTER of the image calm, soft and slightly hazy (put the detailed buildings at the edges) so game UI cards placed on top remain easy to read. No people, no vehicles, no text, no watermark.
```

### 2) พื้นหลังจอกว้าง (เผื่อเล่นบนคอม) — `theme_bg_wide.png` · ขนาด 1536×1024
```text
The same modern blue city scene in wide landscape orientation: bright blue sky with soft clouds, shiny blue glass skyscrapers rising on the far left and right sides, a calm reflective river and smooth curving roads across the lower part, small green parks with rounded trees, clean cheerful semi-realistic 3D cartoon render in a cool blue palette. Calm soft center area so UI stays readable, detailed buildings only at the edges, no people, no vehicles, no text, no watermark.
```

### 3) กลุ่มตึกระฟ้าสีฟ้า (ของตกแต่ง) — `theme_skyline.png`
```text
A cluster of modern blue glass skyscrapers for a city-builder game: three to four sleek shiny towers of different heights with reflective blue glass windows and clean white trim, standing together on a small neat base with a touch of greenery, semi-realistic 3D cartoon render, plain transparent background, no text.
```

### 4) บ้านหลังคาส้ม (ของตกแต่ง) — `theme_house.png`
```text
A charming suburban house for a city-builder game: cozy cream-colored house with a warm orange roof, blue-framed windows, a small chimney, surrounded by rounded green trees and bushes on a tiny neat grass lot, semi-realistic 3D cartoon render, plain transparent background, no text.
```

### 5) สวนสาธารณะเขียว (ของตกแต่ง) — `theme_park.png`
```text
A small city park for a city-builder game: lush rounded green trees and neat bushes on a tiny grass island with a curved walking path and a little wooden bench, fresh and clean, semi-realistic 3D cartoon render, plain transparent background, no text.
```

### 6) เมฆขาวนุ่ม (ของตกแต่ง) — `theme_cloud.png`
```text
A single soft white fluffy cloud, clean and puffy with a very subtle cool-blue shading underneath, matching a bright blue city sky, semi-realistic 3D cartoon render, plain transparent background, wide shape, no text.
```

---

## ✅ เช็กลิสต์ (6 ภาพ — โฟลเดอร์ `img/theme/`)

`theme_bg.png` · `theme_bg_wide.png` · `theme_skyline.png` · `theme_house.png` · `theme_park.png` · `theme_cloud.png`

— ⬜ ยังไม่เจน · เจนครบ (หรืออย่างน้อยข้อ 1) แล้ว**เปิด session ใหม่**บอก Claude ว่า "ทำธีม" ได้เลย
Claude จะแก้ CSS ทั้งเกมให้เข้าชุด: พื้นหลังภาพเมือง (มี gradient เดิมเป็น fallback) + การ์ดขาว-ฟ้าขอบมนเงาวาว + ปุ่มฟ้าไล่เฉด + แถบหัวโปรไฟล์น้ำเงินเข้ม — โดยคุมให้ตัวหนังสืออ่านง่ายเท่าเดิม แล้วทดสอบใน preview ก่อน push
