# PROMPTS_TEXTURE.md — พรอมป์สร้างเทกซ์เจอร์ "โลกโดรน FPV" (รอบ 323)

> 📂 วางไฟล์ที่ `img/tex/<key>.jpg` (หรือ `.png`) → เกมแปะทับพื้นผิวให้ทันที · **ไม่มีไฟล์ = ใช้ลายที่วาดด้วยโค้ดเดิม เกมไม่พัง**
> ⚠️ ทุกภาพต้อง **seamless / tileable** (ต่อขอบซ้าย-ขวา บน-ล่าง ได้ไร้รอยต่อ) · จัตุรัส 1024×1024 หรือ 2048×2048 · **ห้ามมีเงาแดด/แสงจ้าอบในภาพ** (เกมมีแสงของตัวเอง)
> 💾 วางไฟล์แล้วบอก Claude ให้ commit — `img/` อยู่ใน git จริง ต้อง commit ถึงจะขึ้นเว็บ (deploy ใช้ `git archive HEAD`)

| key ไฟล์ | ใช้แปะอะไร | ค่า repeat ในเกม |
|---|---|---|
| `tex_concrete` | ผนัง/เสา/พื้นตึกร้างทุกหลัง | 2×2 ต่อชิ้น |
| `tex_asphalt` | ถนนยางมะตอยในเมืองร้าง | 24×2 ต่อเส้น |
| `tex_ground` | พื้นดิน/ลานปูนรอบเมือง (แผ่นใหญ่สุด) | 26×26 |

## 🔧 สไตล์ร่วม (ต่อท้ายทุกพรอมป์)
```
Seamless tileable texture, square 2048x2048, top-down flat orthographic view, evenly lit with soft ambient light, no cast shadows, no highlights, no vignette, no perspective, no objects or props, no text or watermark, edges tile perfectly on all four sides, photorealistic PBR albedo/diffuse map for a 3D game.
```

## 🧱 1. tex_concrete — ผนังตึกร้าง
```
Weathered abandoned concrete wall surface, pale grey cement with subtle formwork panel seams, fine hairline cracks, dark vertical water stains and rust drips, patches of exposed aggregate and chipped edges, faint moss in the crevices, slightly rough matte finish, muted desaturated grey-beige palette.
```

## 🛣️ 2. tex_asphalt — ถนนยางมะตอย
```
Cracked old asphalt road surface, dark charcoal-grey bitumen with visible gravel aggregate, a network of thin spider cracks and tar-sealed repair lines, small potholes patched darker, scattered dust and light tyre wear, faded worn white paint fragments here and there, matte rough finish.
```

## 🌍 3. tex_ground — พื้นดิน/ลานรอบเมืองร้าง
```
Dry cracked earth and broken concrete ground, mixture of dusty tan soil, gravel and shattered pavement slabs, sparse dead grass tufts pushing through the cracks, scattered small rubble and pebbles, sun-bleached desaturated brown and grey tones, flat matte natural surface.
```

## 🌤️ ท้องฟ้า — มีไฟล์แยกอยู่แล้ว
โลกโดรนใช้ท้องฟ้า `sky_storm` (เมฆพายุ) — พรอมป์ + วิธีวางไฟล์อยู่ใน **`PROMPTS_SKY.md`**
วางที่ `img/sky/sky_storm.jpg` เป็น panorama 360° **equirectangular 2:1** (4096×2048) เท่านั้น (คนละสเปกกับเทกซ์เจอร์หน้านี้)

## ✅ เช็กหลังวางไฟล์
1. เปิดโลกโดรนในเกม → ตึก/ถนน/พื้นเปลี่ยนลายทันที (ไม่ต้องแก้โค้ด)
2. ลายซ้ำถี่/ห่างเกินไป → บอก Claude ปรับตัวเลข repeat ในตารางด้านบน (`applyTex(...)` ใน `js/adventure3d.js`)
3. เห็นรอยต่อเป็นตาราง = ภาพยังไม่ seamless → เจนใหม่โดยย้ำคำว่า *seamless tileable, edges tile perfectly*
