# PROMPTS_SIDEWALK.md — ภาพลายทางเท้าโลกขับรถ 🚶 (รอบ 182)

> เกมปูทางเท้าถัดจากเลนจักรยาน (ฟ้าขอบขาว) ตลอดแนวถนนแล้ว — ตอนนี้เป็น **สีคอนกรีตเรียบ**
> วางภาพลายจริงเมื่อไหร่ เกมปูแทนอัตโนมัติทันที (probe เหมือนระบบภาพอื่น)

**ไฟล์:** `img/city/sidewalk.png` — มองจากด้านบน (top-down) · **ต้อง seamless tileable** (ต่อขอบซ้าย-ขวา-บน-ล่างได้ไม่มีรอย) · จัตุรัส 512×512 หรือ 1024×1024

**เครื่องมือ:** ChatGPT/DALL·E, Midjourney (`--tile`), Leonardo (Tiling) หรือ Stable Diffusion (seamless)

**Prompt (คัดลอกวาง):**
```
seamless tileable top-down texture of a Thai city sidewalk pavement, interlocking
concrete paver blocks in a regular herringbone pattern, warm grey and beige tones
with subtle tactile paving strip, clean orthographic overhead view, soft even
daylight, no people, no cars, no shadows cast across tiles, high detail, repeating
pattern that tiles perfectly on all four edges, photorealistic
```

**ทางเลือกลายอื่น (เลือกอย่างใดอย่างหนึ่ง):**
- บล็อกตัวหนอน: `interlocking paver "cobblestone" blocks` แทน herringbone
- กระเบื้องสี่เหลี่ยม: `square concrete sidewalk tiles with visible grout lines`

**ข้อควรระวัง:**
- ห้ามมีเงา/แสงเฉียง (ปูซ้ำแล้วจะเห็นลายซ้ำเป็นตาราง) — เอาแบบแสงเรียบสม่ำเสมอ
- โทนอย่าเข้มไป (กลางวันในเกมสว่าง) · ลายไม่ต้องละเอียดมาก (ปูซ้ำทั้งเมือง scale ~3.2m/แผ่น)

**วิธีวาง:** ดาวน์โหลด → ตั้งชื่อ `sidewalk.png` → วางใน `img/city/` → บอก Claude commit — ไม่ต้องแก้โค้ด
