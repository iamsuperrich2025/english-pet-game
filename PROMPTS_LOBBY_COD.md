# 🎮 PROMPTS_LOBBY_COD.md — ฉากหน้า Lobby 3D สไตล์ Call of Duty (พื้นหลังตึกสมัยใหม่)

> **รอบ 86 (9 ก.ค. 2026):** เปลี่ยนหน้า lobby ให้ตัวละครผู้เลี้ยง + น้องสัตว์ ยืนคู่กันกลางจอ
> เหมือนหน้า lobby เกม Call of Duty (ตัวละครยืนเต็มตัวกลางฉาก มี UI ขนาบซ้าย/บน/ขวา)
> พื้นหลัง = **ตึกอาคารสมัยใหม่** + ลานยืนด้านหน้า ให้ตัวละครดูยืนอยู่ในเมืองจริง

## 📌 กติกา (เหมือนไฟล์ prompt อื่น)
1. **ชื่อไฟล์ตรงเป๊ะ** ตัวพิมพ์เล็ก `.png` → วางในโฟลเดอร์ **`img/theme/`**
2. ทำเป็น **ภาพทึบ (ไม่ต้องโปร่งใส)** — เป็นพื้นหลังเต็มจอ
3. **แนวนอน (landscape)** เท่านั้น — เกมล็อกจอแนวนอน · ขนาด **1536×1024** หรือ **1920×1080**
4. ⚖️ **ลิขสิทธิ์:** ห้ามใส่โลโก้/ชื่อ/ตัวละคร Call of Duty จริง — เอาแค่ "สไตล์การจัดฉาก" (ตัวละครยืนกลาง เมืองอยู่หลัง) ดีไซน์ออริจินอลของเราเอง
5. โทนสี **ฟ้า-เทาเมืองสมัยใหม่** ให้เข้ากับตัวละครชิบิ 3D ที่เราออกแบบไว้ (ผู้เลี้ยง + น้องหมา/แมว/มังกร)

---

## ⭐ ภาพหลัก (สำคัญสุด) — `theme_city_cod.png` · 1920×1080 แนวนอน

```text
A cinematic 3D game lobby background for a children's pet game, wide landscape orientation, inspired by the staging screen of a modern shooter game but bright, clean and kid-friendly. A sleek modern city of glass-and-steel skyscrapers and contemporary buildings rises across the middle and upper part of the frame, softly out of focus with gentle depth-of-field haze. In the lower third there is a clean open plaza / paved courtyard floor made of polished light-grey and blue tiles, with subtle glowing accent lines, catching soft reflections — an empty hero staging area where a character would stand. Bright late-afternoon sky with soft clouds and warm rim light on the buildings, cool blue color palette with teal highlights, semi-realistic stylized 3D render, high detail on the sides, and a deliberately CALM, SOFT, SLIGHTLY EMPTY CENTER so game characters and UI panels placed on top stay easy to read. No people, no characters, no animals, no vehicles, no text, no logos, no watermark.
```

**ทำไมสั่งแบบนี้:** ตึกอยู่กลาง-บน (เบลอนุ่ม) · ลานปูพื้นเรืองแสงอยู่ล่าง = ที่ให้ตัวละครยืน · กลางจอโล่งซอฟต์ = การ์ดข้อมูล + ตัวละครอ่านง่าย

---

## 🌆 ตัวเลือกเสริม (ถ้าอยากลองโทนอื่น) — เจนแล้วเลือกอันที่ชอบ ตั้งชื่อ `theme_city_cod.png` เหมือนกัน

**A) โทนเช้า/กลางวันสดใส**
```text
The same modern city game lobby background, wide landscape, but at bright cheerful mid-morning: clean modern glass towers and rounded contemporary buildings under a clear light-blue sky with fluffy white clouds, a polished plaza floor with soft blue glowing tile lines in the foreground for a character to stand on, cool blue palette, semi-realistic stylized 3D render, detailed buildings on the sides, calm soft empty center for UI readability. No people, no animals, no vehicles, no text, no logos, no watermark.
```

**B) โทนเย็น/พลบค่ำมีไฟเมือง (ดราม่าแบบ COD)**
```text
The same modern city game lobby background, wide landscape, at blue-hour dusk: modern skyscrapers with warm glowing windows and neon-blue accent lights, a wet reflective plaza floor in the foreground catching city lights, dramatic cinematic lighting like a game main menu but still bright and friendly, cool blue and teal palette with warm window glints, semi-realistic stylized 3D render, detailed towers on the sides, calm softly-lit empty center so characters and UI stay readable. No people, no animals, no vehicles, no text, no logos, no watermark.
```

---

## ✅ เสร็จแล้วทำยังไง

1. เจนภาพ → เซฟชื่อ **`theme_city_cod.png`** → วางในโฟลเดอร์ **`img/theme/`**
2. เปิดเกม (หรือ refresh) — โค้ดรอรับไฟล์นี้ไว้แล้ว **ภาพจะขึ้นเป็นพื้นหลังทันที**
   (ถ้ายังไม่วางไฟล์ เกมจะใช้ภาพเมืองฟ้าเดิม `theme_bg_wide.png` เป็น fallback ไม่พัง)
3. ตัวละครผู้เลี้ยง + น้องสัตว์ ที่ยืนกลางจออยู่แล้ว จะดูเหมือนยืนอยู่ในลานเมืองจริง

> 💡 อยากให้ตัวละคร "จมลงในฉาก" เนียนขึ้น: เลือกภาพที่ **เส้นขอบฟ้า/พื้นลาน** อยู่ราวๆ กลางค่อนล่างของภาพ
> (ตัวละครในเกมยืนที่ประมาณ 60–75% จากบนลงล่าง) แล้วเงาใต้เท้าที่โค้ดวาดให้จะช่วยให้ดูตั้งบนพื้นพอดี
