# 🎨 PROMPTS.md — คำสั่งเจนภาพครบชุดสำหรับ Pet Vocab Adventure

รวม prompt สำหรับเจนภาพทั้งหมด **75 ภาพ** (คัดลอกไปวางใน Copilot ได้ทันที)

## 📌 กติกาสำคัญ (อ่านก่อนเจน)

1. **ชื่อไฟล์ต้องตรงเป๊ะ** ตามหัวข้อของแต่ละ prompt (ตัวพิมพ์เล็กทั้งหมด นามสกุล `.png`)
2. บันทึกเป็น **PNG พื้นหลังโปร่งใส** ขนาดจัตุรัส (เช่น 1024×1024) — ถ้า Copilot ทำพื้นโปร่งใสไม่ได้ ให้สั่งเพิ่มว่า `plain white background` แล้วใช้เว็บลบพื้นหลังฟรี เช่น remove.bg ก่อนบันทึก
3. วางไฟล์ทั้งหมดในโฟลเดอร์ **`img/`** (ข้างๆ index.html) — เกมจะตรวจเจอเองอัตโนมัติ ไม่ต้องแก้โค้ด
4. **ทำให้หน้าตาสัตว์เหมือนกันทุกภาพ**: เจนในแชทเดียวกันต่อเนื่อง และหลังได้ภาพแรกที่ถูกใจ ให้พิมพ์กำกับว่า *"use the exact same character design as the previous image"* ทุกครั้ง
5. ไม่จำเป็นต้องเจนครบ 75 ภาพก่อนถึงจะเล่นได้ — **ภาพไหนยังไม่มี เกมจะใช้อีโมจิแทนให้เอง**

## 🎯 ลำดับที่เกมเลือกภาพมาแสดง

ป่วย (sick) > หิวมาก (hungry, เกจหิว ≤ 25%) > ดีใจ (happy, ตอนลูบตัว/หลังกินข้าว) > ใส่ชุด (ชื่อไอเทม) > ปกติ (normal)

หมายเหตุ: ระบบแต่งตัวใส่ได้ทีละ 1 ชิ้น และตอนป่วย/หิวจะแสดงภาพอาการแทนภาพชุด

## 🚀 ชุดเริ่มต้นแนะนำ (9 ภาพ เกมสวยทันที)

`dog_newborn.png`, `cat_newborn.png`, `dragon_egg.png` + `*_baby_normal.png` + `*_adult_normal.png` ของทั้ง 3 ตัว
จากนั้นค่อยทยอยเพิ่มชุดอารมณ์ (happy/hungry/sick) และชุดแต่งตัวทีหลัง

---

# น้องหมา 🐶 (dog)

## แรกเกิดในตะกร้า — `dog_newborn.png`

(หมาเกิดเป็นตัว ไม่ได้ฟักจากไข่ — เกมจึงเริ่มจากลูกหมาแรกเกิดหลับตาในตะกร้า ตามความจริงที่ลูกหมาจะลืมตาตอนอายุ ~1–2 สัปดาห์)

```text
A tiny newborn puppy with soft cream fur and pastel blue floppy ears, eyes gently closed, sleeping peacefully wrapped in a pastel blue blanket inside a cozy round woven basket, a small "zzz" sleeping bubble floating above its head. Cute kawaii chibi style, 3D render look, soft pastel colors, soft studio lighting, centered composition, plain transparent background, square 1:1 image, children's mobile game art, no text, no watermark.
```

## ร่างเด็ก (baby)

### อารมณ์/อาการ 4 แบบ

**`dog_baby_normal.png`** — ปกติ
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_happy.png`** — ดีใจ
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, jumping with joy, eyes closed with a big happy smile, colorful confetti and sparkles floating around. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_hungry.png`** — หิว
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, looking hungry and sad with teary eyes, holding an empty food bowl, drooping posture. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_sick.png`** — ป่วย
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, looking sick and weak with a pale face, a thermometer in its mouth, an ice pack on its head and a small sweat drop. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

### ใส่ชุดแต่งตัว 8 แบบ (ท่ายืนยิ้มปกติ)

**`dog_baby_bow.png`** — โบว์
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing a big pink ribbon bow around its neck. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_cap.png`** — หมวกแก๊ป
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing a pastel blue baseball cap on its head. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_bell.png`** — ปลอกคอกระดิ่ง
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing a red collar with a shiny golden bell. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_glasses.png`** — แว่นตา
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing round blue eyeglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_scarf.png`** — ผ้าพันคอ
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing a cozy pink knitted scarf. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_tophat.png`** — หมวกวิเศษ
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing a black magician top hat. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_sunglasses.png`** — แว่นกันแดด
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing cool black sunglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_baby_crown.png`** — มงกุฎ
```text
A chubby baby puppy with soft cream fur and pastel blue floppy ears, standing and smiling gently, wearing a shiny golden crown. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

## ร่างโตเต็มวัย (adult)

### อารมณ์/อาการ 4 แบบ

**`dog_adult_normal.png`** — ปกติ
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_happy.png`** — ดีใจ
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, jumping with joy, eyes closed with a big happy smile, colorful confetti and sparkles floating around. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_hungry.png`** — หิว
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, looking hungry and sad with teary eyes, holding an empty food bowl, drooping posture. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_sick.png`** — ป่วย
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, looking sick and weak with a pale face, a thermometer in its mouth, an ice pack on its head and a small sweat drop. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

### ใส่ชุดแต่งตัว 8 แบบ (ท่ายืนยิ้มปกติ)

**`dog_adult_bow.png`** — โบว์
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing a big pink ribbon bow around its neck. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_cap.png`** — หมวกแก๊ป
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing a pastel blue baseball cap on its head. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_bell.png`** — ปลอกคอกระดิ่ง
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing a red collar with a shiny golden bell. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_glasses.png`** — แว่นตา
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing round blue eyeglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_scarf.png`** — ผ้าพันคอ
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing a cozy pink knitted scarf. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_tophat.png`** — หมวกวิเศษ
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing a black magician top hat. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_sunglasses.png`** — แว่นกันแดด
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing cool black sunglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dog_adult_crown.png`** — มงกุฎ
```text
A friendly grown-up dog with soft cream fur and pastel blue floppy ears, slightly taller and prouder but still adorable, standing and smiling gently, wearing a shiny golden crown. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

---

# น้องแมว 🐱 (cat)

## แรกเกิดในตะกร้า — `cat_newborn.png`

(แมวเกิดเป็นตัว ไม่ได้ฟักจากไข่ — เกมจึงเริ่มจากลูกแมวแรกเกิดหลับตาในตะกร้า ตามความจริงที่ลูกแมวจะลืมตาตอนอายุ ~1–2 สัปดาห์)

```text
A tiny newborn orange tabby kitten with darker orange stripes, eyes gently closed, sleeping peacefully curled up in a soft pastel orange blanket inside a cozy round woven basket, a small "zzz" sleeping bubble floating above its head. Cute kawaii chibi style, 3D render look, soft pastel colors, soft studio lighting, centered composition, plain transparent background, square 1:1 image, children's mobile game art, no text, no watermark.
```

## ร่างเด็ก (baby)

### อารมณ์/อาการ 4 แบบ

**`cat_baby_normal.png`** — ปกติ
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_happy.png`** — ดีใจ
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, jumping with joy, eyes closed with a big happy smile, colorful confetti and sparkles floating around. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_hungry.png`** — หิว
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, looking hungry and sad with teary eyes, holding an empty food bowl, drooping posture. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_sick.png`** — ป่วย
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, looking sick and weak with a pale face, a thermometer in its mouth, an ice pack on its head and a small sweat drop. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

### ใส่ชุดแต่งตัว 8 แบบ (ท่ายืนยิ้มปกติ)

**`cat_baby_bow.png`** — โบว์
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing a big pink ribbon bow around its neck. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_cap.png`** — หมวกแก๊ป
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing a pastel blue baseball cap on its head. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_bell.png`** — ปลอกคอกระดิ่ง
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing a red collar with a shiny golden bell. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_glasses.png`** — แว่นตา
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing round blue eyeglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_scarf.png`** — ผ้าพันคอ
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing a cozy pink knitted scarf. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_tophat.png`** — หมวกวิเศษ
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing a black magician top hat. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_sunglasses.png`** — แว่นกันแดด
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing cool black sunglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_baby_crown.png`** — มงกุฎ
```text
A chubby baby orange tabby kitten with darker orange stripes and a tiny pink nose, standing and smiling gently, wearing a shiny golden crown. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

## ร่างโตเต็มวัย (adult)

### อารมณ์/อาการ 4 แบบ

**`cat_adult_normal.png`** — ปกติ
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_happy.png`** — ดีใจ
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, jumping with joy, eyes closed with a big happy smile, colorful confetti and sparkles floating around. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_hungry.png`** — หิว
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, looking hungry and sad with teary eyes, holding an empty food bowl, drooping posture. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_sick.png`** — ป่วย
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, looking sick and weak with a pale face, a thermometer in its mouth, an ice pack on its head and a small sweat drop. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

### ใส่ชุดแต่งตัว 8 แบบ (ท่ายืนยิ้มปกติ)

**`cat_adult_bow.png`** — โบว์
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing a big pink ribbon bow around its neck. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_cap.png`** — หมวกแก๊ป
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing a pastel blue baseball cap on its head. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_bell.png`** — ปลอกคอกระดิ่ง
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing a red collar with a shiny golden bell. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_glasses.png`** — แว่นตา
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing round blue eyeglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_scarf.png`** — ผ้าพันคอ
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing a cozy pink knitted scarf. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_tophat.png`** — หมวกวิเศษ
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing a black magician top hat. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_sunglasses.png`** — แว่นกันแดด
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing cool black sunglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`cat_adult_crown.png`** — มงกุฎ
```text
A graceful grown-up orange tabby cat with darker orange stripes and a tiny pink nose, elegant but still adorable, standing and smiling gently, wearing a shiny golden crown. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

---

# น้องมังกร 🐲 (dragon)

## ไข่ — `dragon_egg.png`

```text
A cute cartoon dragon egg, red-orange with dragon scale pattern, surrounded by a soft glowing fiery aura. Cute kawaii style, 3D render look, soft pastel colors, soft studio lighting, centered composition, plain transparent background, square 1:1 image, children's mobile game art, no text, no watermark.
```

## ร่างเด็ก (baby)

### อารมณ์/อาการ 4 แบบ

**`dragon_baby_normal.png`** — ปกติ
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_happy.png`** — ดีใจ
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, jumping with joy, eyes closed with a big happy smile, colorful confetti and sparkles floating around. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_hungry.png`** — หิว
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, looking hungry and sad with teary eyes, holding an empty food bowl, drooping posture. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_sick.png`** — ป่วย
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, looking sick and weak with a pale face, a thermometer in its mouth, an ice pack on its head and a small sweat drop. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

### ใส่ชุดแต่งตัว 8 แบบ (ท่ายืนยิ้มปกติ)

**`dragon_baby_bow.png`** — โบว์
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing a big pink ribbon bow around its neck. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_cap.png`** — หมวกแก๊ป
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing a pastel blue baseball cap on its head. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_bell.png`** — ปลอกคอกระดิ่ง
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing a red collar with a shiny golden bell. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_glasses.png`** — แว่นตา
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing round blue eyeglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_scarf.png`** — ผ้าพันคอ
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing a cozy pink knitted scarf. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_tophat.png`** — หมวกวิเศษ
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing a black magician top hat. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_sunglasses.png`** — แว่นกันแดด
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing cool black sunglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_baby_crown.png`** — มงกุฎ
```text
A chubby baby mint-green dragon with tiny wings, small horns and a soft cream belly, standing and smiling gently, wearing a shiny golden crown. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

## ร่างโตเต็มวัย (adult)

### อารมณ์/อาการ 4 แบบ

**`dragon_adult_normal.png`** — ปกติ
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_happy.png`** — ดีใจ
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, jumping with joy, eyes closed with a big happy smile, colorful confetti and sparkles floating around. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_hungry.png`** — หิว
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, looking hungry and sad with teary eyes, holding an empty food bowl, drooping posture. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_sick.png`** — ป่วย
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, looking sick and weak with a pale face, a thermometer in its mouth, an ice pack on its head and a small sweat drop. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

### ใส่ชุดแต่งตัว 8 แบบ (ท่ายืนยิ้มปกติ)

**`dragon_adult_bow.png`** — โบว์
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing a big pink ribbon bow around its neck. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_cap.png`** — หมวกแก๊ป
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing a pastel blue baseball cap on its head. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_bell.png`** — ปลอกคอกระดิ่ง
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing a red collar with a shiny golden bell. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_glasses.png`** — แว่นตา
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing round blue eyeglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_scarf.png`** — ผ้าพันคอ
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing a cozy pink knitted scarf. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_tophat.png`** — หมวกวิเศษ
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing a black magician top hat. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_sunglasses.png`** — แว่นกันแดด
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing cool black sunglasses. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

**`dragon_adult_crown.png`** — มงกุฎ
```text
A majestic but cute grown-up mint-green dragon with large wings, small horns, a soft cream belly and a tiny flame at the tail tip, standing and smiling gently, wearing a shiny golden crown. Cute kawaii chibi style, 3D render look, soft pastel colors, big sparkly eyes, soft studio lighting, full body, centered composition, plain transparent background, square 1:1 image, children's mobile game character art, no text, no watermark.
```

---

## ✅ เช็กลิสต์ไฟล์ทั้งหมด (75 ภาพ)

**น้องหมา 🐶** (25 ภาพ): `dog_newborn.png`, `dog_baby_normal.png`, `dog_baby_happy.png`, `dog_baby_hungry.png`, `dog_baby_sick.png`, `dog_baby_bow.png`, `dog_baby_cap.png`, `dog_baby_bell.png`, `dog_baby_glasses.png`, `dog_baby_scarf.png`, `dog_baby_tophat.png`, `dog_baby_sunglasses.png`, `dog_baby_crown.png`, `dog_adult_normal.png`, `dog_adult_happy.png`, `dog_adult_hungry.png`, `dog_adult_sick.png`, `dog_adult_bow.png`, `dog_adult_cap.png`, `dog_adult_bell.png`, `dog_adult_glasses.png`, `dog_adult_scarf.png`, `dog_adult_tophat.png`, `dog_adult_sunglasses.png`, `dog_adult_crown.png`

**น้องแมว 🐱** (25 ภาพ): `cat_newborn.png`, `cat_baby_normal.png`, `cat_baby_happy.png`, `cat_baby_hungry.png`, `cat_baby_sick.png`, `cat_baby_bow.png`, `cat_baby_cap.png`, `cat_baby_bell.png`, `cat_baby_glasses.png`, `cat_baby_scarf.png`, `cat_baby_tophat.png`, `cat_baby_sunglasses.png`, `cat_baby_crown.png`, `cat_adult_normal.png`, `cat_adult_happy.png`, `cat_adult_hungry.png`, `cat_adult_sick.png`, `cat_adult_bow.png`, `cat_adult_cap.png`, `cat_adult_bell.png`, `cat_adult_glasses.png`, `cat_adult_scarf.png`, `cat_adult_tophat.png`, `cat_adult_sunglasses.png`, `cat_adult_crown.png`

**น้องมังกร 🐲** (25 ภาพ): `dragon_egg.png`, `dragon_baby_normal.png`, `dragon_baby_happy.png`, `dragon_baby_hungry.png`, `dragon_baby_sick.png`, `dragon_baby_bow.png`, `dragon_baby_cap.png`, `dragon_baby_bell.png`, `dragon_baby_glasses.png`, `dragon_baby_scarf.png`, `dragon_baby_tophat.png`, `dragon_baby_sunglasses.png`, `dragon_baby_crown.png`, `dragon_adult_normal.png`, `dragon_adult_happy.png`, `dragon_adult_hungry.png`, `dragon_adult_sick.png`, `dragon_adult_bow.png`, `dragon_adult_cap.png`, `dragon_adult_bell.png`, `dragon_adult_glasses.png`, `dragon_adult_scarf.png`, `dragon_adult_tophat.png`, `dragon_adult_sunglasses.png`, `dragon_adult_crown.png`

รวมทั้งหมด 75 ภาพ
