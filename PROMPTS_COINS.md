# PROMPTS_COINS.md — พรอมป์สร้างภาพเหรียญ 3 ชนิด (โลกมอเตอร์ไซค์ · รอบ 338)

> 📂 วางไฟล์ที่ `img/coins/<key>.png` → เกมสลับใช้ภาพจริงทันที · ไม่มีไฟล์ = ใช้เหรียญที่วาดด้วยโค้ดเหมือนเดิม
> ⚠️ **ต้องเป็น PNG พื้นโปร่ง** จัตุรัส 1024×1024 · เหรียญหันหน้าตรงเข้ากล้อง เต็มเฟรมพอดี (เว้นขอบนิดเดียว)
> 💾 วางแล้วบอก Claude ให้ commit (`img/` อยู่ใน git · deploy ใช้ `git archive HEAD`)

| key ไฟล์ | ได้ตอนไหน | มูลค่า | โทนสี |
|---|---|---|---|
| `coin_gold` | เหรียญทองหลังตัวอักษรทุกตัว | 🪙 1 | ทองคำ |
| `coin_sapphire` | วางบนทางโค้งสวย | 🪙 5 | ฟ้าไพลิน |
| `coin_diamond` | วางบนหลุม/เนิน (ยากสุด) | 🪙 20 | ม่วง-เพชร |

## 🔧 สไตล์ร่วม (ต่อท้ายทุกพรอมป์)
```
Single game currency coin icon, front-facing straight-on view, perfectly circular, centered and filling the frame, transparent background (PNG alpha), no background scene, no shadow on the ground, no text, no numbers, no watermark. Highly detailed 3D render with polished beveled rim, crisp engraved relief, soft studio lighting with a warm specular highlight on the upper left, rich reflections, premium collectible medal quality, clean edges suitable for cutting out as a sprite.
```

## 🪙 1. coin_gold — เหรียญทอง (มูลค่า 1)
```
Luxurious solid gold coin, mirror-polished 24-karat gold with warm amber depths, thick beveled rim with fine reeded milled edge, a raised five-pointed star emblem in the center surrounded by a delicate engraved laurel wreath, subtle radiating sunburst texture on the field, tiny sparkle glints on the rim.
```

## 💠 2. coin_sapphire — เหรียญไพลิน (มูลค่า 5)
```
Elegant silver-platinum coin with a deep sapphire blue enamel field, brilliant-cut blue gemstone set into the center in a raised claw setting, polished chrome rim with engraved art-deco chevron pattern, cool blue inner glow reflecting off the metal, frosted and polished contrast on the surfaces, refined jewellery quality.
```

## 💎 3. coin_diamond — เหรียญเพชร (มูลค่า 20)
```
Regal royal-purple and white-gold coin, deep amethyst enamel field with a large brilliant-cut diamond mounted at the center throwing rainbow prismatic sparkles, ornate white-gold rim engraved with a crown-and-filigree motif, tiny diamond studs set around the border, radiant highlights and light dispersion, the rarest treasure of the collection.
```

## ✅ เช็กหลังวางไฟล์
1. เข้าโลกมอเตอร์ไซค์ → เหรียญบนถนนเปลี่ยนเป็นภาพใหม่ทันที (ไม่ต้องแก้โค้ด)
2. เหรียญดูเล็ก/ใหญ่ไป → บอก Claude ปรับ `size` ใน `COIN_TIERS` (`js/moto3d.js`) ทอง 2.3 · ไพลิน 2.9 · เพชร 3.6
3. เห็นขอบดำ/ขอบขาวรอบเหรียญ = พื้นยังไม่โปร่งจริง → เจนใหม่โดยย้ำ *transparent background, cut out*
