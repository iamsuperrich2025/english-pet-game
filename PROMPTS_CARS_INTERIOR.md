# PROMPTS_CARS_INTERIOR.md — พรอมป์ console ภายใน + เสียงเครื่องยนต์ ต่อรถแต่ละคัน (รอบ 209)

> รถซื้อได้หลายคัน (สะสมได้) · แต่ละคันมี **เอกลักษณ์ต่างกัน** — สี console ภายใน + เสียงเครื่องยนต์
> 🖼️ ภาพ console: วางที่ `img/car/dash_<id>.png` (เช่น `dash_car_01.png`) · ไม่มีไฟล์ = ใช้ `dash.png` กลางเหมือนเดิม
> 🔊 เสียงเครื่อง: วางที่ `sound/car/engine_<id>.mp3` · ไม่มีไฟล์ = ใช้เสียงสังเคราะห์เดิม (CarSound)
> ⚠️ ภาพ console **ให้วาง layout เหมือนกันทุกคัน** (พวงมาลัยขวาล่าง · เกจกลม · จอกลางคอนโซล) เปลี่ยนแค่โทนสี — เกมวางเข็ม/จอวิทยุตามพิกัดเดิม

## 🖼️ ภาพ console ภายใน — สไตล์ร่วม (prefix)
```
First-person driver's-eye view inside a cute cartoon car, right-hand drive dashboard. A rounded steering wheel at the bottom-right, a round speedometer gauge cluster behind the wheel, a small rectangular infotainment screen in the center console, air vents, and a windshield at the top showing a bright sunny cartoon road ahead. Glossy toy-like plastic materials, soft even lighting, clean child-friendly cartoon style, 16:9 wide. Keep the SAME dashboard layout/proportions across the whole set (wheel bottom-right, gauge behind wheel, screen center). No text, no logos, no watermark.
```

## 🔊 เสียงเครื่องยนต์ — สไตล์ร่วม (prefix)
```
A short, clean, seamless LOOPING car engine sound, about 5-6 seconds, that loops smoothly with no gap. Steady idle-to-light-cruising tone. No music, no voice, no tire screech. Mono/stereo game SFX for a cute cartoon driving game.
```

## 🚗 รถ 10 คัน (console + เสียง)

**1. car_01 · แดงสายฟ้า** — 🖼️ `red and black sporty interior, glowing red accents on the dashboard trim and gauge ring.` · 🔊 `sporty high-revving turbo engine, energetic and punchy.`

**2. car_02 · ฟ้าใสซิ่ง** — 🖼️ `sky-blue and silver interior, cool blue ambient light on the dashboard.` · 🔊 `smooth sporty inline engine with a light whoosh, breezy and quick.`

**3. car_03 · เขียวธรรมชาติ** — 🖼️ `fresh green and cream eco interior, soft leafy-green accents.` · 🔊 `gentle quiet hybrid/eco engine, soft calm hum.`

**4. car_04 · ส้มเปลวไฟ** — 🖼️ `burnt-orange and charcoal interior, warm ember-orange glow on vents and gauges.` · 🔊 `muscular deep V8 rumble, throaty and powerful.`

**5. car_05 · ชมพูหวานใจ** — 🖼️ `sweet pastel-pink and white interior, cute rounded shapes, soft pink glow.` · 🔊 `cute light little engine, bubbly and gentle, higher pitch.`

**6. car_06 · ม่วงกาแล็กซี่** — 🖼️ `deep purple galaxy interior with tiny star sparkles, violet neon dashboard glow.` · 🔊 `futuristic sci-fi engine, subtle synth whir with a spacey shimmer.`

**7. car_07 · เหลืองตาหมากรุก** — 🖼️ `bright yellow interior with a black-and-white checker trim strip, retro taxi vibe.` · 🔊 `classic chugging diesel taxi engine, steady old-school idle.`

**8. car_08 · ขาวหิมะ** — 🖼️ `snow-white and light-grey luxury interior, clean minimal, soft cool light.` · 🔊 `quiet refined luxury engine, smooth and almost silent.`

**9. car_09 · ดำนีออน** — 🖼️ `glossy black interior with bright cyan/teal neon underglow on the dashboard and gauges.` · 🔊 `aggressive electric-turbo engine with a rising neon whine.`

**10. car_10 · รุ้งพาสเทล** — 🖼️ `soft pastel-rainbow interior, gentle multicolor gradient trim, dreamy and playful.` · 🔊 `playful magical shimmer engine, light sparkly whimsical hum.`

---
วิธีใช้: ภาพ = สไตล์ร่วม(ภาพ) + รายละเอียด 🖼️ ของคันนั้น → เซฟ `dash_car_0X.png` วาง `img/car/` · เสียง = สไตล์ร่วม(เสียง) + รายละเอียด 🔊 → เซฟ `engine_car_0X.mp3` วาง `sound/car/`
📌 โค้ดฝั่งเกม (ให้รถหลายคัน + เลือกคันขับ + โหลด console/เสียงต่อคัน) จะทำต่อในรอบถัดไป — วางไฟล์ไว้ก่อนได้ เดี๋ยว probe เจอเอง
