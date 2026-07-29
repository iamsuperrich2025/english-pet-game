# PROMPTS_HOTEL.md — 🏨 prompt เจนภาพให้โรงแรมผีสิงสมจริง (รอบ 684)

> 📂 วางไฟล์ที่ `C:\Users\rober\english-pet-game\img\tex\<ชื่อคีย์>.jpg`
> **ไม่มีไฟล์ = เกมไม่พัง** (ใช้สีล้วนที่โค้ดวาดไว้) · มีไฟล์เมื่อไหร่ = แปะทับผิวนั้นทันที ไม่ต้องแก้โค้ด
> ⚠️ ทุกภาพต้อง **ต่อขอบได้ไร้รอยต่อ (seamless / tileable)** ยกเว้นที่ระบุว่าไม่ต้อง
> ⚠️ ห้ามมีตัวหนังสือ/โลโก้/ลายน้ำ/ใบหน้าคนจริงในภาพ (กันปัญหาลิขสิทธิ์ + กติกาคุ้มครองเด็ก)
> ขนาดที่พอดี: 1024×1024 (พื้น/ผนัง) · คุณภาพ jpg ~80

---

## 1. `tex_hotel_carpet` — พรมทางเดิน/ห้องพัก (ใช้เยอะสุด เห็นทั้งเกม)
```
Seamless tileable texture of a luxury old hotel corridor carpet, deep burgundy red with faded gold damask pattern, worn velvet pile, subtle dust and age stains, dim warm lighting, photorealistic top-down flat view, no text, no watermark, 1024x1024
```

## 2. `tex_hotel_wall` — วอลเปเปอร์ทางเดิน
```
Seamless tileable texture of antique Victorian hotel wallpaper, muted olive-brown damask pattern on aged paper, slight peeling at edges, water stains, gloomy atmosphere, photorealistic flat view, no text, 1024x1024
```

## 3. `tex_hotel_room` — วอลเปเปอร์ในห้องพัก
```
Seamless tileable texture of vintage hotel room wallpaper, warm beige with faint vertical stripes and small floral motif, aged and slightly yellowed, soft matte finish, photorealistic flat view, no text, 1024x1024
```

## 4. `tex_hotel_marble` — พื้นหินอ่อนล็อบบี้
```
Seamless tileable texture of polished cream marble floor tiles with grey veining and thin dark grout lines, luxury hotel lobby, slight reflections and scuffs, photorealistic top-down, no text, 1024x1024
```

## 5. `tex_hotel_wood` — ไม้เข้ม (ประตู/ตู้เสื้อผ้า/เตียง/เคาน์เตอร์)
```
Seamless tileable texture of dark polished walnut wood panel, rich vertical grain, antique varnish, small scratches, warm dim lighting, photorealistic flat view, no text, 1024x1024
```

## 6. `tex_hotel_tile` — กระเบื้องห้องน้ำ
```
Seamless tileable texture of old white subway bathroom tiles with grey grout, hairline cracks, faint mildew in grout lines, cold clinical look, photorealistic flat view, no text, 1024x1024
```

## 7. `tex_hotel_facade` — เปลือกนอกอาคาร ⚠️ **แก้ใหม่รอบ 694 (ของเดิมออกมาเหมือนฟาง ตึกดูชุ่ย)**
> 📐 **ข้อมูลที่ต้องรู้ก่อนเจน:** ภาพ 1 ใบ = ผนังจริง **3.2 × 3.2 เมตร** (ค่า `uvScale` ใน `hotel3d.js`)
> → ก้อนหินต้องใหญ่ราว **1/4 ของภาพ** (ก้อนละ ~80 ซม.) ถ้าลายถี่กว่านี้จะเห็นเป็น "พื้นผิวหยาบ ๆ" ไม่เป็นก้อนหิน
> 🌙 เกมคูณสีให้หม่นลงแล้ว (`0x6d6a66`) → **ภาพต้นฉบับให้เจนแบบ "กลางวันแสงเรียบ"** อย่าเจนภาพมืดมาซ้ำ
```
Seamless tileable texture of a grand 1920s hotel exterior wall, large rectangular ashlar limestone blocks about 80 cm each laid in neat courses, roughly 4 blocks across the image, deep recessed mortar joints, cool grey-beige stone with subtle colour variation between blocks, weathered patina, faint dark rain streaks running downward, thin moss only in the joints, flat orthographic wall view photographed straight on, even overcast daylight, no windows, no doors, no ornament, no people, no text, no watermark, high detail, 1024x1024
```
**Negative prompt (ถ้าเครื่องมือมีช่องให้ใส่):**
```
straw, hay, thatch, wood planks, bricks too small, tiles, mosaic, wallpaper pattern, perspective, vignette, shadows baked in, windows, doors, text, logo, watermark, people, warm orange tint
```
> ✅ **เช็กก่อนใช้:** เอาภาพมาวางต่อกัน 2×2 แล้วดูว่า **ขอบต่อสนิท ไม่มีเส้นรอยต่อ** และ **ไม่มีจุดเด่นซ้ำ ๆ** (เช่นรอยด่างใหญ่ ๆ จุดเดียว) เพราะจะเห็นเป็นลายซ้ำทั้งตึกทันที

---

## 8. `tex_hotel_portrait_1` … `tex_hotel_portrait_6` — 🖼️ **รูปคนในกรอบ (ใหม่รอบ 694)**
> ผู้ใช้: *"ขอ prompt แสกนรูปให้ดูสมจริง แล้วค่อยใช้ CSS ทำดวงตาให้ขยับ — ที่เป็นอยู่ไม่ผ่าน"*
> วางไฟล์ `img/tex/tex_hotel_portrait_1.png` … `_6.png` → **แปะทับภาพวาดเดิมอัตโนมัติ ไม่ต้องแก้โค้ดเลย**
> (ไม่มีไฟล์ = ใช้ภาพวาดเดิม เกมไม่พัง · มี 30 กรอบทั่วโรงแรม หมุนใช้ 6 แบบ)

### ⚠️ กติกาเหล็ก 3 ข้อ (ผิดข้อเดียวตาจะไม่ตรงเบ้า)
| # | กติกา | เหตุผล |
|---|-------|--------|
| 1 | **สัดส่วนภาพ 3:4 เป๊ะ** (เช่น 768×1024) | กรอบในเกมเป็น 1.02×1.36 ม. ภาพผิดสัดส่วน = หน้าเบี้ยว |
| 2 | **ตาซ้าย/ขวาอยู่ที่ 40.6% / 59.4% ของความกว้าง · สูงจากขอบบน 43.5%** | เกมวาง "ตาดำ" เป็นชิ้น 3D ทับตำแหน่งนี้ตายตัว |
| 3 | **ในภาพต้องเป็นตาขาวล้วน ไม่มีตาดำ/ม่านตา** | ตาดำคือชิ้นที่เกมขยับเอง — ถ้าภาพมีตาดำอยู่แล้วจะกลายเป็น "4 ตา" |

**Prompt หลัก (ปรับรายละเอียดคน 6 แบบตามตารางล่าง):**
```
Photorealistic scanned oil portrait photograph of <PERSON>, 1920s hotel guest, head and shoulders centred, facing the camera perfectly straight on, symmetrical frontal pose, head fills the upper half of the frame, the eyes sit exactly on the horizontal line 43.5% down from the top edge and are centred at 40.6% and 59.4% of the image width, IMPORTANT the eyes are plain blank pale white eyeballs with NO iris and NO pupil, neutral unsmiling expression, dark muted period clothing, dark brown studio backdrop, warm dim gallery lighting, aged photograph texture with fine craquelure, slight yellowing and dust, subtle vignette, portrait aspect ratio 3:4, no frame, no border, no text, no watermark, not scary-gory, suitable for children, 768x1024
```
**Negative prompt:**
```
iris, pupil, coloured eyes, looking away, three-quarter view, tilted head, smiling, blood, gore, wound, modern clothing, picture frame, border, caption, text, watermark, multiple people, hands, full body
```

| ไฟล์ | ใส่แทน `<PERSON>` |
|------|-------------------|
| `_1` | `an elderly gentleman with a grey moustache in a black tailcoat and high collar` |
| `_2` | `a pale young woman with dark hair in a low bun, wearing a high-necked lace dress` |
| `_3` | `a stern middle-aged hotel manager in a dark waistcoat with a pocket watch chain` |
| `_4` | `a solemn boy about ten years old in a formal sailor suit` |
| `_5` | `a older woman in a black mourning dress with a cameo brooch` |
| `_6` | `a bearded man in a heavy overcoat holding nothing, shoulders squared` |

### 🎬 อยากให้ "ตาขยับน่ากลัว" เพิ่มอีก (ทำในโค้ด ไม่ต้องเจนภาพเพิ่ม)
ตอนนี้ตากลอกตามผู้เล่นอยู่แล้ว (`HOTEL3D.tick` → `P.e1/P.e2`) — ต่อยอดได้: กะพริบตาเป็นจังหวะ (ย่อ `scale.y` แว็บเดียว) · ตาแดงวาบตอนไฟดับ · หันตามช้า ๆ แบบหน่วง (lerp) แทนตามทันที

---

## 🖼️ ภาพ "ผี" (ไม่ใช่ texture — วางที่ `img/ghosts/ghost_1.png` … `ghost_5.png`)
> ระบบเดิมของเกมอยู่แล้ว (PNG **พื้นหลังโปร่ง** 1024×1024 ตัวเต็มตัว ยืนตรง เท้าอยู่ขอบล่าง)
> โรงแรมนี้ใช้ภาพชุดเดิมได้เลย ถ้าอยากได้ชุดใหม่ให้เข้าธีมโรงแรม:
```
Full-body ghost of a hotel guest from the 1920s, pale translucent figure, tattered evening dress, long hair covering the face, floating slightly, soft blue-grey glow, transparent PNG background, full body standing upright with feet at the bottom edge, no text, spooky but NOT gory, suitable for children, 1024x1024
```
```
Full-body ghost of an old hotel bellboy, faded uniform with tarnished buttons, hollow dark eyes, semi-transparent, pale grey-green tone, transparent PNG background, standing upright full body, no blood, child-friendly spooky, 1024x1024
```

---

## 🎨 ภาพโปรโมต/หน้าการ์ดตั๋ว (ไม่ต้อง seamless · ยังไม่ผูกกับโค้ดจุดไหน — เตรียมไว้โชว์/ต่อยอดทีหลัง)
> วางที่ `img/promo/` (โฟลเดอร์ใหม่ ยังไม่มีในโปรเจกต์ — สร้างเองตอนวางไฟล์ได้เลย)

**โปร 1 — `img/promo/hotel_exterior.jpg`** (ตึกยามค่ำคืน มองจากหน้าโรงแรม)
```
A grand but eerie old luxury hotel at night, five storeys, warm yellow light glowing from a few windows, grand portico with stone columns and red carpet steps, full moon behind, bare dead trees and trimmed hedges in the front garden, thin ground fog, cinematic wide shot, photorealistic, no text, no logo
```

**โปร 2 — `img/promo/hotel_lobby.jpg`** (ล็อบบี้ในโรงแรม)
```
Interior of a grand hotel lobby at night, marble floor, red carpet runner, brass chandelier, reception desk with key cabinet behind, tall columns, dim warm lighting, empty and unsettling, photorealistic, no people, no text
```

---

## 🌌 ท้องฟ้าโลกโรงแรม — **ไม่ต้องเจนภาพแล้ว (รอบ 694)**
โลกนี้ถอดออกจากตาราง `SKY_IMG` แล้ว ใช้ท้องฟ้าที่โค้ดวาดเอง (`buildHauntSky` ใน `js/adventure3d.js`)
= โดมไล่สี + ดาวกะพริบ 3 ชั้น + จันทร์มีหลุม + เมฆลอยผ่านหน้าจันทร์ + หมอกติดพื้น
**อย่าวางไฟล์ `img/sky/sky_night.jpg`** — ไม่มีผลแล้ว และภาพนิ่งหรี่ตามจังหวะไฟดับไม่ได้

## 🔧 หมายเหตุสำหรับ session ถัดไป
- ชื่อคีย์ตรงกับ `makeMats()` ใน `js/hotel3d.js` — เพิ่มผิวใหม่ต้องเพิ่มคีย์ที่นั่นก่อน
- ระบบแปะภาพคือ `applyTex(mat,key,rx,ry,tint)` ใน `js/adventure3d.js` (ส่งเข้ามาทาง `opt.tex`)
- ค่า repeat ต่อผิวตั้งไว้แล้วใน `hotel3d.js` (พารามิเตอร์ `uvScale` ของ `accBox`) — ภาพ tileable จะปูพอดีเอง
