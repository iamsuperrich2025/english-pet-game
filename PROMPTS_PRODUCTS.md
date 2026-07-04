# 🏭 PROMPTS_PRODUCTS.md — คำสั่งเจนภาพ "สินค้าผลิต" 38 ชิ้นใหม่ (รวมชุดเดิม 12 = 50 ชิ้น)

> **แนวคิดใหม่ (5 ก.ค. 2026):** ผู้เล่นไม่ได้ "ซื้อ" สินค้าจากตลาดอีกต่อไป แต่ **ผลิตเอง** โดยจ่ายด้วย
> "แต้มคำศัพท์" — ทุกคำที่ตอบถูกในเกมจับคู่/แบบทดสอบ ไหลเข้าเป็นแต้มผลิตของชิ้นที่เลือกค้างไว้
> ผลิตครบ → ได้ของเข้าคลัง → ตั้งขายในตลาด (ระบบตลาดเดิมใช้ต่อทั้งชุด)
> สินค้าสะสม 12 ชิ้นเดิม (PROMPTS_COLLECTIBLES.md) **ถูกรวมเข้าแคตตาล็อกนี้** เป็นสินค้าผลิตด้วย

## 📌 กติกาสำคัญ (อ่านก่อนเจน — เหมือนชุดเดิมทุกข้อ)

1. **ชื่อไฟล์ต้องตรงเป๊ะ** ตามหัวข้อ (ตัวพิมพ์เล็กทั้งหมด นามสกุล `.png` — ระวัง Windows ซ่อนนามสกุล เคยเกิด `.png.png` มาแล้ว)
2. บันทึกเป็น **PNG พื้นหลังโปร่งใส** ขนาดจัตุรัส 1024×1024 — ถ้าโปร่งใสไม่ได้ให้สั่ง `plain white background` แล้วลบพื้นด้วย remove.bg ก่อนบันทึก
3. วางไฟล์ทั้งหมดในโฟลเดอร์ **`img/collectibles/`** (โฟลเดอร์เดียวกับชุดเดิม — เกมตรวจเจอเองอัตโนมัติ ไม่ต้องแก้โค้ด)
4. ภาพไหนยังไม่มี **เกมจะใช้อีโมจิแทนให้เอง** — เจนทีละภาพก็ได้ ไม่ต้องครบก่อน
5. เจนทั้งชุด **ในแชทเดียวกันต่อเนื่อง** พิมพ์กำกับ *"use the exact same premium collectible showcase style and lighting as the previous image"* ทุกครั้ง — ถ้าต่อจากชุด 12 ชิ้นเดิมได้ยิ่งดี ทั้ง 50 ภาพจะเป็นชุดเดียวกัน
6. ของระดับ **Legendary** ให้อลังการกว่าเพื่อน (แสง+ประกายทองมากขึ้น) และ **Mythic** อลังการสุด

> ⚠️ **เรื่องลิขสิทธิ์:** ทุก prompt สั่ง *"original generic design, not based on any real brand or existing product/character, no logos"* ไว้แล้ว — ตัวต่อ/จอยเกม/คอนโซล/รองเท้า จะได้ทรงกลางๆ ไม่เหมือนแบรนด์จริง ปลอดภัยครับ

---

## 🎨 สไตล์รวมของทั้งชุด (ต่อท้ายทุก prompt — ชุดเดียวกับ PROMPTS_COLLECTIBLES.md)

ทุกภาพลงท้ายด้วยประโยคชุดนี้ (ก็อปไปแปะต่อจากคำอธิบายของแต่ละชิ้น):

```text
Detailed premium 3D render, glossy high-quality collectible toy look, soft studio lighting, resting on a small round glossy display pedestal with a soft radial glow beneath it and gentle golden sparkles floating around to look valuable and collectible, bright cheerful colors, symmetrical centered composition, plain transparent background, square 1:1 image, children's mobile game collectible showcase art, original generic design not based on any real brand or existing product or character, no text, no letters, no numbers, no brand logos, no watermark.
```

---

## 📦 แคตตาล็อกเต็ม 50 ชิ้น — 5 หมวด × 10 ชิ้น

ระดับ: ⚪ Common (ใหม่ — ของเริ่มต้น ผลิตง่าย) · ⭐ Rare · ⭐⭐ Epic · ⭐⭐⭐ Legendary · 👑 Mythic
**ราคาฐาน/แต้มคำ เป็นค่าแนะนำ** ปรับสมดุลได้ตอนใส่โค้ด (อัตราแนะนำ: Common ~25 เหรียญ/คำ · Rare ~50 · Epic ~80 · Legendary ~130 · Mythic ~300)

### 🍰 หมวดอาหาร/เบเกอรี่ (ใหม่ทั้งหมด 10 ชิ้น)

| # | สินค้า | ไฟล์ | ระดับ | ราคาฐาน | แต้มคำผลิต |
|---|--------|------|-------|---------|-----------|
| 1 | คัพเค้กสตรอว์เบอร์รี | `collect_cupcake.png` | ⚪ | 500 | 20 |
| 2 | โดนัทเคลือบ | `collect_donut.png` | ⚪ | 800 | 30 |
| 3 | โหลคุกกี้ | `collect_cookiejar.png` | ⚪ | 1,200 | 45 |
| 4 | ไอศกรีมซันเดย์ | `collect_icecream.png` | ⚪ | 1,500 | 55 |
| 5 | ชานมไข่มุก | `collect_boba.png` | ⚪ | 2,000 | 70 |
| 6 | ชุดมาการองสายรุ้ง | `collect_macaron.png` | ⭐ | 5,000 | 100 |
| 7 | กล่องช็อกโกแลตหรู | `collect_chocbox.png` | ⭐ | 8,000 | 160 |
| 8 | เค้กผลไม้สด | `collect_fruitcake.png` | ⭐ | 12,000 | 240 |
| 9 | เค้กสายรุ้ง | `collect_rainbowcake.png` | ⭐ | 18,000 | 360 |
| 10 | เค้กฉลอง 5 ชั้น | `collect_weddingcake.png` | ⭐⭐ | 40,000 | 500 |

### 🧸 หมวดของเล่น (ใหม่ 5 + ✅ ชุดเดิม 5)

| # | สินค้า | ไฟล์ | ระดับ | ราคาฐาน | แต้มคำผลิต |
|---|--------|------|-------|---------|-----------|
| 11 | ว่าวมังกร | `collect_kite.png` | ⚪ | 1,000 | 40 |
| 12 | ชุดน้ำชากระเบื้อง | `collect_teaset.png` | ⚪ | 2,500 | 85 |
| 13 | รถไฟของเล่น | `collect_toytrain.png` | ⚪ | 3,000 | 100 |
| 14 | ปราสาทตัวต่อ | `collect_blocks.png` | ⭐ | 10,000 | 200 |
| 15 | บอร์ดเกมผจญภัย | `collect_boardgame.png` | ⭐ | 15,000 | 300 |
| — | ตุ๊กตาหมี ✅เดิม | `collect_teddy.png` | ⭐ | 20,000 | 400 |
| — | ยูนิคอร์นตุ๊กตา ✅เดิม | `collect_unicorn.png` | ⭐ | 30,000 | 600 |
| — | บ้านตุ๊กตา ✅เดิม | `collect_dollhouse.png` | ⭐ | 60,000 | 1,200 |
| — | หุ่นยนต์ของเล่น ✅เดิม | `collect_robot.png` | ⭐⭐ | 150,000 | 1,900 |
| — | หุ่นยนต์ไดโนเสาร์ ✅เดิม | `collect_dinorobot.png` | ⭐⭐⭐ | 500,000 | 3,800 |

### 👗 หมวดแฟชั่น (ใหม่ทั้งหมด 10 ชิ้น)

| # | สินค้า | ไฟล์ | ระดับ | ราคาฐาน | แต้มคำผลิต |
|---|--------|------|-------|---------|-----------|
| 16 | หมวกแก๊ปดาวทอง | `collect_cap.png` | ⚪ | 800 | 30 |
| 17 | ผ้าพันคอสายรุ้ง | `collect_scarf.png` | ⚪ | 1,500 | 55 |
| 18 | เสื้อยืดกราฟิก | `collect_tshirt.png` | ⚪ | 2,000 | 70 |
| 19 | เป้แพนด้า | `collect_backpack.png` | ⭐ | 6,000 | 120 |
| 20 | รองเท้าผ้าใบไฟ LED | `collect_sneakers.png` | ⭐ | 9,000 | 180 |
| 21 | แว่นกันแดดทรงดาว | `collect_sunglasses.png` | ⭐ | 12,000 | 240 |
| 22 | ชุดเดรสเจ้าหญิง | `collect_dress.png` | ⭐⭐ | 50,000 | 630 |
| 23 | หมวกพ่อมด | `collect_wizardhat.png` | ⭐⭐ | 60,000 | 750 |
| 24 | กระเป๋าถือหรู | `collect_handbag.png` | ⭐⭐ | 90,000 | 1,100 |
| 25 | สร้อยคอเพชร | `collect_necklace.png` | ⭐⭐⭐ | 300,000 | 2,300 |

### 📱 หมวดแก็ดเจ็ต (ใหม่ 8 + ✅ ชุดเดิม 2)

| # | สินค้า | ไฟล์ | ระดับ | ราคาฐาน | แต้มคำผลิต |
|---|--------|------|-------|---------|-----------|
| 26 | หูฟังไร้สาย | `collect_headphones.png` | ⭐ | 7,000 | 140 |
| 27 | จอยเกมไร้สาย | `collect_gamepad.png` | ⭐ | 10,000 | 200 |
| 28 | ลำโพงบลูทูธ | `collect_speaker.png` | ⭐ | 15,000 | 300 |
| 29 | นาฬิกาอัจฉริยะ | `collect_smartwatch.png` | ⭐⭐ | 45,000 | 560 |
| 30 | กล้องถ่ายรูปเรโทร | `collect_camera.png` | ⭐⭐ | 60,000 | 750 |
| 31 | กล้องจุลทรรศน์ | `collect_microscope.png` | ⭐⭐ | 80,000 | 1,000 |
| 32 | แว่น VR | `collect_vr.png` | ⭐⭐ | 120,000 | 1,500 |
| 33 | เครื่องเกมคอนโซล | `collect_console.png` | ⭐⭐⭐ | 250,000 | 1,900 |
| — | โดรนถ่ายภาพ ✅เดิม | `collect_drone.png` | ⭐⭐⭐ | 400,000 | 3,100 |
| — | กล้องดูดาวทองเหลือง ✅เดิม | `collect_telescope.png` | ⭐⭐⭐ | 800,000 | 6,200 |

### 🚀 หมวดยานพาหนะ/ของหรู (ใหม่ 5 + ✅ ชุดเดิม 5)

| # | สินค้า | ไฟล์ | ระดับ | ราคาฐาน | แต้มคำผลิต |
|---|--------|------|-------|---------|-----------|
| 34 | สเก็ตบอร์ดกาแล็กซี | `collect_skateboard.png` | ⚪ | 3,500 | 120 |
| 35 | สกู๊ตเตอร์ไฟฟ้า | `collect_scooter.png` | ⭐ | 14,000 | 280 |
| 36 | จักรยานเสือภูเขา | `collect_bicycle.png` | ⭐ | 18,000 | 360 |
| 37 | รถโกคาร์ท | `collect_gokart.png` | ⭐⭐ | 130,000 | 1,600 |
| 38 | เรือยอชต์ทองคำ | `collect_goldyacht.png` | 👑 | 1,500,000 | 5,000 |
| — | รถบังคับ ✅เดิม | `collect_rccar.png` | ⭐⭐ | 80,000 | 1,000 |
| — | เรือบังคับ ✅เดิม | `collect_rcboat.png` | ⭐⭐ | 100,000 | 1,250 |
| — | เครื่องบินบังคับ ✅เดิม | `collect_rcplane.png` | ⭐⭐ | 250,000 | 3,100 |
| — | เฮลิคอปเตอร์บังคับ ✅เดิม | `collect_rchelicopter.png` | ⭐⭐⭐ | 350,000 | 2,700 |
| — | รถสปอร์ตทองคำ ✅เดิม | `collect_goldcar.png` | 👑 | 2,000,000 | 6,700 |

> ✅เดิม = prompt อยู่ใน PROMPTS_COLLECTIBLES.md แล้ว ไม่ต้องเจนซ้ำถ้าเจนไปแล้ว — ด้านล่างนี้คือ **prompt เฉพาะ 38 ชิ้นใหม่**

---

## 🍰 หมวดอาหาร/เบเกอรี่

### 1) คัพเค้กสตรอว์เบอร์รี — `collect_cupcake.png`
```text
A premium collectible strawberry cupcake: a fluffy vanilla cupcake in a pastel pink paper liner, topped with a tall swirl of glossy strawberry frosting, rainbow sprinkles and one shiny red cherry on top, looking freshly baked and irresistibly delicious like bakery showcase food.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 2) โดนัทเคลือบ — `collect_donut.png`
```text
A premium collectible glazed donut: a golden fluffy ring donut coated in glossy pastel-pink strawberry glaze dripping slightly over the edge, decorated with colorful rainbow sprinkles, looking fresh, bouncy and delicious like a bakery showcase donut.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 3) โหลคุกกี้ — `collect_cookiejar.png`
```text
A premium collectible cookie jar: a clear glass jar with a cute ceramic bear-head lid, filled to the top with golden chocolate-chip cookies, one extra cookie leaning against the jar, looking warm, homey and delicious.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 4) ไอศกรีมซันเดย์ — `collect_icecream.png`
```text
A premium collectible ice cream sundae: a tall clear sundae glass with three scoops of strawberry, vanilla and chocolate ice cream, swirled whipped cream, rainbow sprinkles, a crispy wafer stick and a shiny red cherry on top, looking cold, creamy and delicious.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 5) ชานมไข่มุก — `collect_boba.png`
```text
A premium collectible bubble milk tea: a clear cup of creamy caramel-colored milk tea with dark chewy tapioca pearls at the bottom, a pastel dome lid and a wide mint-green straw, tiny cute condensation droplets on the cup, looking refreshing and trendy. No label on the cup.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 6) ชุดมาการองสายรุ้ง — `collect_macaron.png`
```text
A premium collectible macaron gift set: six pastel rainbow macarons (pink, orange, yellow, green, blue, purple) arranged neatly in an elegant open luxury gift box with a silk ribbon, looking delicate and expensive like a high-end patisserie gift.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 7) กล่องช็อกโกแลตหรู — `collect_chocbox.png`
```text
A premium collectible luxury chocolate gift box: a heart-shaped red velvet box with the lid open showing assorted glossy chocolate pralines in golden foil cups, tied with a shiny golden ribbon bow, looking romantic and expensive.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 8) เค้กผลไม้สด — `collect_fruitcake.png`
```text
A premium collectible fresh fruit shortcake: a round layered sponge cake with fluffy white cream, layers of fresh strawberries inside, topped with whole glossy strawberries, kiwi slices and blueberries, on a glass cake stand, looking fresh and delicious like a bakery showcase cake.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 9) เค้กสายรุ้ง — `collect_rainbowcake.png`
```text
A premium collectible rainbow layer cake: a tall round cake covered in smooth pastel frosting with one neat slice cut out revealing six vibrant rainbow sponge layers inside, decorated with a frosting swirl border and sprinkles, on a cake stand, looking magical and delicious.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 10) เค้กฉลอง 5 ชั้น — `collect_weddingcake.png`
```text
A premium collectible grand celebration cake: an elegant five-tier white cake decorated with delicate golden trim, cascading sugar flowers in soft pink and cream, tiny pearl details, on an elegant stand, looking luxurious like a dream celebration cake.
```
+ ต่อด้วยสไตล์รวมด้านบน

---

## 🧸 หมวดของเล่น (เฉพาะชิ้นใหม่)

### 11) ว่าวมังกร — `collect_kite.png`
```text
A premium collectible dragon kite: a colorful traditional dragon-shaped kite with a friendly cute dragon face, long flowing rainbow ribbon tails, delicate bamboo frame details, displayed as if gently floating, with a small wooden spool of string beside it. Original generic design, not based on any existing character.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 12) ชุดน้ำชากระเบื้อง — `collect_teaset.png`
```text
A premium collectible porcelain tea set: a cute pastel mint-and-pink porcelain teapot with two matching teacups and saucers on a small round tray, painted with delicate little flower patterns and golden rim details, looking dainty and expensive like a boutique toy tea party set.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 13) รถไฟของเล่น — `collect_toytrain.png`
```text
A premium collectible toy steam train: a glossy retro tin-style toy locomotive in cherry red and forest green with golden trims, big red wheels, a little coal tender car attached behind, sitting on a short piece of toy track, looking charming and high quality. Original generic design, not based on any existing character or brand.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 14) ปราสาทตัวต่อ — `collect_blocks.png`
```text
A premium collectible building-block castle: a colorful toy castle built from chunky plastic building bricks in bright red, blue, yellow and green, with two towers, a little gate and tiny triangular flags on top, looking fun and creative. Original generic brick design, not based on any real building-block brand.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 15) บอร์ดเกมผจญภัย — `collect_boardgame.png`
```text
A premium collectible adventure board game set: an open colorful fantasy board game with a winding path across islands, mountains and castles, colorful dice, cute wooden pawn pieces and face-down cards arranged around the board, the box lid propped behind, looking fun and inviting. No text on the board or box.
```
+ ต่อด้วยสไตล์รวมด้านบน

---

## 👗 หมวดแฟชั่น

### 16) หมวกแก๊ปดาวทอง — `collect_cap.png`
```text
A premium collectible snapback cap: a glossy sky-blue and white baseball cap with a golden star emblem embroidered on the front, curved brim, displayed on a small cap stand, looking fresh and stylish. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 17) ผ้าพันคอสายรุ้ง — `collect_scarf.png`
```text
A premium collectible knitted rainbow scarf: a soft chunky hand-knitted scarf in cheerful rainbow stripes with cute tassels at both ends, loosely coiled in a neat spiral display, looking warm, fluffy and cozy.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 18) เสื้อยืดกราฟิก — `collect_tshirt.png`
```text
A premium collectible graphic t-shirt: a crisp white kids t-shirt displayed neatly upright, printed with a cute original smiling sun and rainbow cartoon design on the chest, looking fun and brand new. Original generic artwork, no brand logos, no letters.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 19) เป้แพนด้า — `collect_backpack.png`
```text
A premium collectible kids backpack: a cute mint-green school backpack with a friendly panda-face front pocket, sturdy zippers with heart-shaped pulls, padded straps, standing upright and looking brand new and adorable. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 20) รองเท้าผ้าใบไฟ LED — `collect_sneakers.png`
```text
A premium collectible pair of light-up sneakers: glossy white kids sneakers with rainbow accents and translucent soles glowing with colorful LED light from within, laces neatly tied, one shoe angled beside the other, looking futuristic and cool. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 21) แว่นกันแดดทรงดาว — `collect_sunglasses.png`
```text
A premium collectible pair of stylish sunglasses: sleek star-shaped kids sunglasses with a glossy pink-to-purple gradient frame and shiny mirrored rainbow lenses, resting on a small display stand, looking fun and fashionable.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 22) ชุดเดรสเจ้าหญิง — `collect_dress.png`
```text
A premium collectible princess dress: a beautiful pastel-pink ball gown with a sparkly sequined bodice, puffy layered tulle skirt with tiny glitter stars, and a satin ribbon at the waist, displayed on a simple dress stand, looking magical and expensive. Original generic design, not based on any existing character.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 23) หมวกพ่อมด — `collect_wizardhat.png`
```text
A premium collectible wizard hat: a tall deep-blue pointed wizard hat with a softly bent tip, decorated with golden embroidered stars and crescent moons, a wide brim and a golden band, gently sparkling with magic dust, looking mystical and high quality.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 24) กระเป๋าถือหรู — `collect_handbag.png`
```text
A premium collectible luxury handbag: an elegant cream quilted leather handbag with a shiny golden chain strap and a golden heart-shaped clasp, standing upright, looking soft, classy and expensive like a boutique designer bag. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 25) สร้อยคอเพชร — `collect_necklace.png`
```text
A premium collectible diamond necklace: a dazzling necklace of brilliant sparkling diamonds on a delicate golden chain with one large teardrop diamond pendant, displayed on an elegant black velvet jewelry bust, light glinting off every gem. Slightly more grand and premium with extra golden sparkles because it is a legendary rare item.
```
+ ต่อด้วยสไตล์รวมด้านบน

---

## 📱 หมวดแก็ดเจ็ต (เฉพาะชิ้นใหม่)

### 26) หูฟังไร้สาย — `collect_headphones.png`
```text
A premium collectible wireless headphones: glossy white over-ear headphones with rose-gold metal accents, plush cushioned ear pads and headband, displayed on a small headphone stand, looking sleek and high-end. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 27) จอยเกมไร้สาย — `collect_gamepad.png`
```text
A premium collectible wireless game controller: a glossy two-tone purple and teal gamepad with colorful glowing buttons, twin joysticks and a subtle LED light strip, displayed at a slight angle on a small stand, looking fun and high-tech. Original generic design, not based on any real console brand.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 28) ลำโพงบลูทูธ — `collect_speaker.png`
```text
A premium collectible portable speaker: a round fabric-mesh bluetooth speaker in soft grey with a glowing rainbow LED ring around its base and simple round buttons on top, looking modern and premium. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 29) นาฬิกาอัจฉริยะ — `collect_smartwatch.png`
```text
A premium collectible smartwatch: a sleek smartwatch with a rounded square glossy screen showing a colorful abstract glowing ring pattern (no numbers or letters on screen), a soft mint sport band, displayed upright on a small charging stand, looking modern and high-tech. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 30) กล้องถ่ายรูปเรโทร — `collect_camera.png`
```text
A premium collectible retro digital camera: a stylish camera with a silver metal top plate, warm tan leather body wrap, a big glass lens with colorful reflections and a small round viewfinder, its strap curled neatly beside it, looking classic and expensive. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 31) กล้องจุลทรรศน์ — `collect_microscope.png`
```text
A premium collectible science microscope: a modern white and sky-blue student microscope with a shiny metal arm, three rotating lenses, a glowing illuminated specimen stage and fine focus dials, looking precise and exciting like real science equipment. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 32) แว่น VR — `collect_vr.png`
```text
A premium collectible VR headset set: a sleek white virtual-reality headset with a glowing blue front visor stripe and soft padded strap, with two matching motion controllers with glowing tracking rings resting beside it, looking futuristic and premium. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 33) เครื่องเกมคอนโซล — `collect_console.png`
```text
A premium collectible game console set: a sleek glossy midnight-blue game console standing upright with a glowing power ring, flanked by two matching wireless controllers with colorful glowing buttons, looking like the ultimate dream gaming machine. Original generic design, not based on any real console brand. Slightly more grand and premium with extra golden sparkles because it is a legendary rare item.
```
+ ต่อด้วยสไตล์รวมด้านบน

---

## 🚀 หมวดยานพาหนะ/ของหรู (เฉพาะชิ้นใหม่)

### 34) สเก็ตบอร์ดกาแล็กซี — `collect_skateboard.png`
```text
A premium collectible skateboard: a skateboard standing upright at a slight angle showing its deck printed with a vibrant original galaxy and shooting-star design, glossy translucent orange wheels and shiny silver trucks, looking fresh and ready to ride. Original generic artwork, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 35) สกู๊ตเตอร์ไฟฟ้า — `collect_scooter.png`
```text
A premium collectible electric scooter: a sleek mint-green electric kick scooter with a curved deck glowing with soft blue LED light underneath, chunky smooth wheels, a simple round headlight and comfortable grips, kickstand down, looking clean and futuristic. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 36) จักรยานเสือภูเขา — `collect_bicycle.png`
```text
A premium collectible mountain bike: a glossy sunset-orange kids mountain bike with black knobby tires, a sturdy frame with subtle geometric accents, front suspension fork and a small water bottle in its holder, displayed on a stand, looking rugged and brand new. Original generic design, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 37) รถโกคาร์ท — `collect_gokart.png`
```text
A premium collectible racing go-kart: a candy-blue kids racing go-kart with a low sleek body, white racing stripes, chunky black slick tires with silver rims, a small steering wheel and a little spoiler at the back, looking fast and fun. Original generic design, no numbers, no brand logos.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 38) เรือยอชต์ทองคำ — `collect_goldyacht.png`
```text
A mythic ultra-luxurious collectible golden yacht model: a highly detailed shiny solid-gold luxury motor yacht with sleek flowing decks, tiny railings, a miniature pool and glowing warm cabin windows, displayed on a glossy black pedestal with a gentle golden water-ripple effect, surrounded by abundant golden sparkles and radiant light rays to look ultra rare and priceless. Original generic yacht design, not based on any real brand. One of the most grand and luxurious items in the whole set.
```
+ ต่อด้วยสไตล์รวมด้านบน

---

## ✅ เช็กลิสต์ไฟล์ชุดใหม่ (38 ภาพ — โฟลเดอร์ `img/collectibles/`)

`collect_cupcake.png` · `collect_donut.png` · `collect_cookiejar.png` · `collect_icecream.png` · `collect_boba.png` · `collect_macaron.png` · `collect_chocbox.png` · `collect_fruitcake.png` · `collect_rainbowcake.png` · `collect_weddingcake.png` · `collect_kite.png` · `collect_teaset.png` · `collect_toytrain.png` · `collect_blocks.png` · `collect_boardgame.png` · `collect_cap.png` · `collect_scarf.png` · `collect_tshirt.png` · `collect_backpack.png` · `collect_sneakers.png` · `collect_sunglasses.png` · `collect_dress.png` · `collect_wizardhat.png` · `collect_handbag.png` · `collect_necklace.png` · `collect_headphones.png` · `collect_gamepad.png` · `collect_speaker.png` · `collect_smartwatch.png` · `collect_camera.png` · `collect_microscope.png` · `collect_vr.png` · `collect_console.png` · `collect_skateboard.png` · `collect_scooter.png` · `collect_bicycle.png` · `collect_gokart.png` · `collect_goldyacht.png`

— ⬜ ยังไม่เจน (เจนเสร็จวางลงโฟลเดอร์ได้เลย ยังไม่มี = เกมใช้อีโมจิแทน) · อีก 12 ภาพชุดเดิมดู PROMPTS_COLLECTIBLES.md
