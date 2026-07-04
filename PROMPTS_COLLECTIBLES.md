# 🧸 PROMPTS_COLLECTIBLES.md — คำสั่งเจนภาพ "สินค้าสะสมฟุ่มเฟือย"

> ชุดของเล่นสะสมราคาแพงที่เด็กประถมชาย-หญิงชอบ ซื้อเก็บสะสม → กดซื้อแล้วเปิดภาพใหญ่โชว์ (คล้ายฉากอัปแรงค์) → อนาคตขายต่อได้แบบ Trade Depot
> **เจนแยกเดี่ยว ไม่ต้องมีสัตว์ในภาพ** — เน้นสวย ดูมีราคา เหมือนของสะสมในตู้โชว์

## 📌 กติกาสำคัญ (อ่านก่อนเจน)

1. **ชื่อไฟล์ต้องตรงเป๊ะ** ตามหัวข้อ (ตัวพิมพ์เล็กทั้งหมด นามสกุล `.png` — ระวัง Windows ซ่อนนามสกุล เคยเกิด `.png.png` มาแล้ว)
2. บันทึกเป็น **PNG พื้นหลังโปร่งใส** ขนาดจัตุรัส 1024×1024 — ถ้าโปร่งใสไม่ได้ให้สั่ง `plain white background` แล้วลบพื้นด้วย remove.bg ก่อนบันทึก
3. วางไฟล์ทั้งหมดในโฟลเดอร์ **`img/collectibles/`** — เกมจะตรวจเจอเองอัตโนมัติ ไม่ต้องแก้โค้ด
4. ภาพไหนยังไม่มี **เกมจะใช้อีโมจิแทนให้เอง** — เจนทีละภาพก็ได้ ไม่ต้องครบก่อน
5. เจนทั้งชุด **ในแชทเดียวกันต่อเนื่อง** พิมพ์กำกับ *"use the exact same premium collectible showcase style and lighting as the previous image"* ทุกครั้ง เพื่อให้ทั้งเซ็ตดูเป็นชุดเดียวกัน
6. เจน **ของระดับตำนาน (Legendary)** ให้อลังการกว่าเพื่อน (แสง+ประกายทองมากขึ้น) จะได้รู้สึกว่าหายาก คุ้มราคา

> ⚠️ **เรื่องลิขสิทธิ์:** ทุก prompt สั่ง *"original generic design, not based on any real brand or existing product/character, no logos"* ไว้แล้ว — ของบังคับ (รถ/เครื่องบิน/ฮ.) และหุ่นยนต์/ไดโนเสาร์ จะได้ทรงกลางๆ ไม่ไปเหมือนแบรนด์จริงหรือคาแรกเตอร์ในหนัง/เกม ปลอดภัยเรื่องลิขสิทธิ์ครับ

---

## 🎨 สไตล์รวมของทั้งชุด (ต่อท้ายทุก prompt)

ทุกภาพลงท้ายด้วยประโยคชุดนี้ (ก็อปไปแปะต่อจากคำอธิบายของแต่ละชิ้น):

```text
Detailed premium 3D render, glossy high-quality collectible toy look, soft studio lighting, resting on a small round glossy display pedestal with a soft radial glow beneath it and gentle golden sparkles floating around to look valuable and collectible, bright cheerful colors, symmetrical centered composition, plain transparent background, square 1:1 image, children's mobile game collectible showcase art, original generic design not based on any real brand or existing product or character, no text, no letters, no numbers, no brand logos, no watermark.
```

---

## 📦 รายการสินค้าสะสม 12 ชิ้น — โฟลเดอร์ `img/collectibles/`

ตารางสรุป (ราคา/ระดับเป็นค่า **แนะนำ** ปรับได้ตอนใส่โค้ด):

| # | สินค้า | ไฟล์ | ระดับ | ราคาแนะนำ | กลุ่ม |
|---|--------|------|-------|-----------|-------|
| 1 | ตุ๊กตาหมี | `collect_teddy.png` | ⭐ Rare | 20,000 | หญิง/ทั่วไป |
| 2 | ยูนิคอร์นตุ๊กตา | `collect_unicorn.png` | ⭐ Rare | 30,000 | หญิง |
| 3 | บ้านตุ๊กตา | `collect_dollhouse.png` | ⭐ Rare | 60,000 | หญิง |
| 4 | รถบังคับ | `collect_rccar.png` | ⭐⭐ Epic | 80,000 | ชาย |
| 5 | เรือบังคับ | `collect_rcboat.png` | ⭐⭐ Epic | 100,000 | ชาย |
| 6 | หุ่นยนต์ของเล่น | `collect_robot.png` | ⭐⭐ Epic | 150,000 | ทั่วไป |
| 7 | เครื่องบินบังคับ | `collect_rcplane.png` | ⭐⭐ Epic | 250,000 | ชาย |
| 8 | เฮลิคอปเตอร์บังคับ | `collect_rchelicopter.png` | ⭐⭐⭐ Legendary | 350,000 | ชาย |
| 9 | โดรนถ่ายภาพ | `collect_drone.png` | ⭐⭐⭐ Legendary | 400,000 | ชาย |
| 10 | หุ่นยนต์ไดโนเสาร์ | `collect_dinorobot.png` | ⭐⭐⭐ Legendary | 500,000 | ทั่วไป |
| 11 | กล้องดูดาวทองเหลือง | `collect_telescope.png` | ⭐⭐⭐ Legendary | 800,000 | ทั่วไป |
| 12 | รถสปอร์ตโมเดลทองคำ | `collect_goldcar.png` | 👑 Mythic | 2,000,000 | โชว์พิเศษ |

---

### 1) ตุ๊กตาหมี — `collect_teddy.png`
```text
A premium cute collectible teddy bear plush toy: soft honey-brown fur, a big friendly smile with round shiny black button eyes, lighter cream muzzle and paw pads, a pastel blue bow tie around its neck, sitting upright and looking huggable, like a high-end boutique gift-shop teddy bear.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 2) ยูนิคอร์นตุ๊กตา — `collect_unicorn.png`
```text
A premium cute collectible unicorn plush toy: fluffy white body with a soft pastel rainbow mane and tail, a shiny golden spiral horn, sparkly rosy cheeks, tiny embroidered star patterns, big glittery eyes, sitting cutely and looking magical and high quality.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 3) บ้านตุ๊กตา — `collect_dollhouse.png`
```text
A premium collectible pastel dollhouse toy: a charming two-story pink and cream miniature house with an open front revealing tiny cute furniture inside, a little balcony, heart-shaped windows, a small pointed roof, a tiny front garden with miniature flowers, looking like an expensive high-end girls' toy.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 4) รถบังคับ — `collect_rccar.png`
```text
A premium collectible remote-control sports car toy: a glossy candy-red off-road RC car with big chunky black knobby tires, bright round headlights, a sleek aerodynamic body and spoiler, a small antenna, with its matching two-stick remote controller resting beside a wheel, looking fast and expensive. Original generic car design, not based on any real car brand.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 5) เรือบังคับ — `collect_rcboat.png`
```text
A premium collectible remote-control speed boat toy: a glossy blue and white racing RC boat with a sleek pointed hull, chrome trim details, a tiny checkered flag at the back, resting on a clear display stand with a little water-spray effect, its matching remote controller beside it, looking fast and expensive. Original generic design, not based on any real brand.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 6) หุ่นยนต์ของเล่น — `collect_robot.png`
```text
A premium collectible toy robot figure: a cute chunky retro-futuristic robot with a rounded glossy silver and sky-blue body, big friendly glowing round eyes, a little antenna on top, articulated arms and legs, tiny colorful control buttons and a dial on its chest, looking like a high quality collectible figure. Original generic robot design, not resembling any existing character or franchise.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 7) เครื่องบินบังคับ — `collect_rcplane.png`
```text
A premium collectible remote-control airplane toy: a sleek single-propeller RC airplane with a glossy white and sky-blue body, red wing tips and tail fin, a shiny spinning front propeller, small landing wheels, its matching remote controller beside it, looking like a high-end hobby aircraft. Original generic aircraft design, not based on any real aircraft or brand.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 8) เฮลิคอปเตอร์บังคับ — `collect_rchelicopter.png`
```text
A premium collectible remote-control helicopter toy: a shiny yellow and black hobby RC helicopter with a detailed spinning main rotor and small tail rotor, curved landing skids, a clear glossy cockpit bubble, tiny mechanical details, its matching remote controller beside it, looking high-tech and expensive. Original generic helicopter design, not based on any real brand. Slightly more grand and premium with extra golden sparkles because it is a legendary rare item.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 9) โดรนถ่ายภาพ — `collect_drone.png`
```text
A premium collectible camera drone toy: a sleek white and dark-grey quadcopter drone with four spinning propellers, glowing blue LED accent lights, a small gimbal camera mounted underneath, hovering just slightly above its display pedestal, its matching remote controller with a phone clip beside it, looking modern and high-tech. Original generic drone design, not based on any real brand. Slightly more grand and premium with extra golden sparkles because it is a legendary rare item.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 10) หุ่นยนต์ไดโนเสาร์ — `collect_dinorobot.png`
```text
A premium collectible robot dinosaur toy: a friendly mechanical T-rex built from glossy green and orange armored plates with glowing blue eyes and glowing joints, tiny rivets, mechanical gears and pistons visible, standing upright on strong legs with a raised tail, looking powerful but cute and high quality. Original generic design, not resembling any existing character or franchise. Slightly more grand and premium with extra golden sparkles because it is a legendary rare item.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 11) กล้องดูดาวทองเหลือง — `collect_telescope.png`
```text
A premium collectible brass astronomy telescope: an elegant polished golden-brass telescope tube on sturdy varnished wooden tripod legs, angled up toward the sky, with tiny engraved star and crescent-moon decorations, a small focus knob and eyepiece, looking like an expensive antique scientific instrument for a young stargazer. Slightly more grand and premium with extra golden sparkles because it is a legendary rare item.
```
+ ต่อด้วยสไตล์รวมด้านบน

### 12) รถสปอร์ตโมเดลทองคำ (ของโชว์สุดหรู) — `collect_goldcar.png`
```text
A mythic ultra-luxurious collectible golden diecast supercar model: a highly detailed shiny solid-gold sports car with sleek flowing curves, gullwing doors slightly open, polished chrome wheels, tiny glowing headlights, displayed on a glossy black rotating pedestal, surrounded by abundant golden sparkles and radiant light rays bursting from behind to look ultra rare and priceless. Original generic supercar design, not based on any real car brand. This is the most grand and luxurious item in the whole set.
```
+ ต่อด้วยสไตล์รวมด้านบน

---

## ✅ เช็กลิสต์ไฟล์ชุดนี้ (12 ภาพ — โฟลเดอร์ `img/collectibles/`)

`collect_teddy.png` · `collect_unicorn.png` · `collect_dollhouse.png` · `collect_rccar.png` · `collect_rcboat.png` · `collect_robot.png` · `collect_rcplane.png` · `collect_rchelicopter.png` · `collect_drone.png` · `collect_dinorobot.png` · `collect_telescope.png` · `collect_goldcar.png`

— ⬜ ยังไม่เจน (เจนเสร็จวางลงโฟลเดอร์ได้เลย เกมจะดึงมาโชว์อัตโนมัติ ยังไม่มี = ใช้อีโมจิแทน)
