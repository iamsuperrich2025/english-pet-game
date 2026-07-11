# PROMPTS_CARS.md — ภาพรถ 10 คัน หมวด "🚗 ยานพาหนะ" ในตลาด (รอบ 130)

> ใช้กับ Image·Nano Banana 2 / GPT Image ก็ได้ · เจนแล้ววางที่ **`img/cars/`** ตามชื่อไฟล์ให้ตรงเป๊ะ
> ขนาด **1024×1024 (1:1)** · **พื้นหลังโปร่งใส (transparent PNG)** ถ้าเจนโปร่งไม่ได้ให้พื้นขาวล้วน (โค้ดจะ crop เอง)
> ⚠️ ห้ามมีโลโก้ยี่ห้อจริง/ตัวหนังสือบนภาพ · ดีไซน์ต้องไม่เลียนแบบรถการ์ตูนดัง (ลิขสิทธิ์)

## Prompt กลาง (ใช้ทุกคัน — เปลี่ยนเฉพาะบรรทัดสี/ลาย)

```
Cute cartoon toy car, 3/4 front view facing slightly left, glossy smooth surfaces,
big friendly wheels, rounded kawaii proportions, no driver, no text, no brand logos,
soft studio lighting, vibrant kid-friendly colors, clean transparent background,
high quality 3D render style, centered, fills 80% of frame
Color & livery: <ใส่บรรทัดของแต่ละคันด้านล่าง>
```

## บรรทัดสี/ลายของแต่ละคัน (ชื่อไฟล์ → livery)

| ไฟล์ | ชื่อในเกม (generic) | Color & livery |
|------|---------------------|----------------|
| `car_01.png` | แดงสายฟ้า | bright red body with a yellow lightning bolt stripe on the side |
| `car_02.png` | ฟ้าใสซิ่ง | sky blue body with two white racing stripes over the hood and roof |
| `car_03.png` | เขียวธรรมชาติ | leaf green body with a subtle leaf pattern on the doors |
| `car_04.png` | ส้มเปลวไฟ | bright orange body with cartoon flame decal on the front fenders |
| `car_05.png` | ชมพูหวานใจ | pastel pink body with small white hearts and stars stickers |
| `car_06.png` | ม่วงกาแล็กซี่ | deep purple body with tiny glowing stars like a galaxy sky |
| `car_07.png` | เหลืองตาหมากรุก | bright yellow body with black-and-white checkered flag stripe |
| `car_08.png` | ขาวหิมะ | snow white body with light blue accent lines, minimal clean look |
| `car_09.png` | ดำนีออน | matte black body with teal neon glow accents under the doors |
| `car_10.png` | รุ้งพาสเทล | soft pastel rainbow gradient body from pink nose to mint tail |

## เช็กลิสต์หลังเจน
1. ครบ 10 ไฟล์ ชื่อตรงตาราง → วางที่ `img/cars/`
2. บอก Claude ให้ commit (ไฟล์ใหม่ไม่เข้า git = live 404 — บทเรียนรอบ 86/112)
3. ฝั่งโค้ด (session ระบบซื้อรถ) probe รูปเอง — ไม่มีรูปใช้อีโมจิ 🚗 ไปก่อน เกมไม่พัง
