# PROMPTS_GROUND_KPP.md — ภาพพื้นคอนกรีตเมืองกำแพงเพชร 🏙️ (โลกขับรถ + โลกเฮลิฯ เหนือเมืองจริง · รอบ 831)

> เกมปูพื้นทั้งเมือง (นอกถนน/ทางเท้า/แม่น้ำ — ที่ว่างระหว่างตึก) ด้วย **สีเทาคอนกรีตเรียบ** อยู่แล้ว (เดิมเป็นสีเขียว-เหลืองแบบทุ่งหญ้า ผู้ใช้แจ้งว่าดูเป็นสีเหลืองไม่เข้ากับเมือง จึงเปลี่ยนโทนแล้ว)
> วางภาพลายจริงเมื่อไหร่ เกมปูแทนอัตโนมัติทันที (probe เหมือนระบบทางเท้า/หน้าตึก — ไม่ต้องแก้โค้ดเพิ่ม)

**ไฟล์:** `img/city/ground.png` — มองจากด้านบน (top-down) · **ต้อง seamless tileable** (ต่อขอบซ้าย-ขวา-บน-ล่างได้ไม่มีรอย) · จัตุรัส 1024×1024 หรือ 2048×2048

**เครื่องมือ:** ChatGPT/DALL·E, Midjourney (`--tile`), Leonardo (Tiling) หรือ Stable Diffusion (seamless)

**Prompt (คัดลอกวาง):**
```
seamless tileable top-down texture of plain urban concrete ground, smooth troweled
cement surface with faint expansion-joint grid lines, light neutral grey tone with
subtle fine speckle grain, a few faint weather stains, clean and well-maintained
(not cracked or abandoned), orthographic overhead view, soft even daylight, no
shadows cast, no people, no cars, no text, high detail, repeating pattern that
tiles perfectly on all four edges, photorealistic
```

**ข้อควรระวัง:**
- ห้ามมีเงา/แสงเฉียง (ปูซ้ำแล้วจะเห็นลายซ้ำเป็นตาราง) — เอาแบบแสงเรียบสม่ำเสมอ
- ต้อง "เรียบ สะอาด ดูดูแลรักษาอยู่" (ไม่แตกร้าว ไม่รกร้าง) ต่างจาก `tex_ground` ของโลกโดรน (นั่นคือเมืองร้าง)
- ผืนนี้ปูทั้งเมืองกำแพงเพชรจริง (กว้างหลายกิโล) ลายไม่ต้องละเอียดมาก (scale ~22 ม./แผ่น)

**วิธีวาง:** ดาวน์โหลด → ตั้งชื่อ `ground.png` → วางใน `img/city/` → บอก Claude commit — ไม่ต้องแก้โค้ด
