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

## 7. `tex_hotel_facade` — เปลือกนอกอาคาร (มองจากข้างนอกตอนเดินเข้า)
```
Seamless tileable texture of aged stone building facade, weathered sandstone blocks with dark streaks and moss in the joints, gothic revival hotel exterior at night, photorealistic flat view, no windows, no text, 1024x1024
```

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

## 🎨 ภาพโปรโมต/หน้าการ์ดตั๋ว (ไม่ต้อง seamless · ใช้โชว์เฉย ๆ)
```
A grand but eerie old luxury hotel at night, five storeys, warm yellow light glowing from a few windows, grand portico with stone columns and red carpet steps, full moon behind, bare dead trees and trimmed hedges in the front garden, thin ground fog, cinematic wide shot, photorealistic, no text, no logo
```
```
Interior of a grand hotel lobby at night, marble floor, red carpet runner, brass chandelier, reception desk with key cabinet behind, tall columns, dim warm lighting, empty and unsettling, photorealistic, no people, no text
```

---

## 🔧 หมายเหตุสำหรับ session ถัดไป
- ชื่อคีย์ตรงกับ `makeMats()` ใน `js/hotel3d.js` — เพิ่มผิวใหม่ต้องเพิ่มคีย์ที่นั่นก่อน
- ระบบแปะภาพคือ `applyTex(mat,key,rx,ry,tint)` ใน `js/adventure3d.js` (ส่งเข้ามาทาง `opt.tex`)
- ค่า repeat ต่อผิวตั้งไว้แล้วใน `hotel3d.js` (พารามิเตอร์ `uvScale` ของ `accBox`) — ภาพ tileable จะปูพอดีเอง
