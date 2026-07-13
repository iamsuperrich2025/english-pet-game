# PROMPTS_SKY.md — พรอมป์สร้างภาพท้องฟ้า 5 แบบ (ฉากหลังโลก 3D · รอบ 203)

> วางไฟล์ที่ `img/sky/<key>.jpg` (หรือ `.png`) → เกมใช้เป็นฉากหลังท้องฟ้า **panorama 360°** ทันที
> ไม่มีไฟล์ = คงพื้นหลังสีเดิม · **ต้องเป็น equirectangular 2:1** (เช่น 4096×2048) ขอบซ้าย-ขวาต่อกันได้ไร้รอยต่อ

| key ไฟล์ | บรรยากาศ | ใช้ในโลก |
|---|---|---|
| `sky_day` | กลางวันสดใส ฟ้าใสเมฆขาว | ผจญภัย · ขับรถ · ฟุตบอล |
| `sky_dawn` | รุ่งอรุณ/ทองส้ม | เฮลิคอปเตอร์ |
| `sky_night` | กลางคืนดาวเต็มฟ้า | ผีสิง |
| `sky_storm` | เมฆพายุดรามาติก | โดรน FPV |
| `sky_alien` | ต่างดาว ม่วง 2 ดวงจันทร์ | หุ่นยนต์นักรบ |

## 🔧 สไตล์ร่วม (ต่อท้ายทุกพรอมป์ / prefix)
```
360-degree equirectangular sky panorama, 2:1 aspect ratio (4096x2048), seamless left and right edges for horizontal wrapping. Sky and clouds only, filling the whole frame, with a soft hazy horizon across the vertical middle and open sky toward the top. No buildings, no ground objects, no birds, no text, no watermark. Smooth high-resolution gradients, clean painterly-realistic style, suitable as a game skybox background.
```

## 🌤️ ท้องฟ้า 5 แบบ

**1. sky_day — กลางวันสดใส (ผจญภัย/ขับรถ/ฟุตบอล)**
```
Bright cheerful daytime sky, clear vivid blue gradient from deep blue at the top to pale blue at the horizon, scattered fluffy white cumulus clouds, warm sunny atmosphere.
```

**2. sky_dawn — รุ่งอรุณทองส้ม (เฮลิคอปเตอร์)**
```
Golden-hour sunrise sky, warm gradient of gold, peach and soft pink near the horizon fading to gentle blue above, wispy clouds glowing from below, calm and beautiful.
```

**3. sky_night — กลางคืนดาวเต็มฟ้า (ผีสิง)**
```
Clear night sky, deep navy-to-black gradient, a full spread of bright stars with a faint Milky Way band, a soft glowing full moon, subtle cool-blue moonlight haze near the horizon, calm and slightly mysterious.
```

**4. sky_storm — เมฆพายุดรามาติก (โดรน)**
```
Dramatic overcast storm sky, layered dark grey and slate-blue clouds with breaks of bright light rays streaming through, moody and cinematic, high contrast, aerial atmosphere.
```

**5. sky_alien — ท้องฟ้าต่างดาว (หุ่นยนต์นักรบ)**
```
Otherworldly alien sky, purple and teal-green gradient with glowing nebula clouds, two moons of different sizes, faint distant stars, subtle eerie cosmic glow, sci-fi fantasy mood.
```

---
วิธีใช้: copy `สไตล์ร่วม` + พรอมป์ของแบบนั้นต่อกัน แล้วเจนภาพ (เลือกโหมด/สัดส่วน panorama 2:1) → เซฟเป็น `sky_day.jpg` ฯลฯ วางใน `img/sky/`
เคล็ด: ครึ่งล่างของภาพ (ใต้เส้นขอบฟ้า) ถูกพื้น/หมอกบังในเกม ไม่ต้องเนี้ยบมาก · เน้นครึ่งบน (ท้องฟ้า+เมฆ) ให้สวย
