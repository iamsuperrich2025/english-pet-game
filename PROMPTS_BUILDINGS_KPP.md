# PROMPTS_BUILDINGS_KPP.md — ภาพหน้าตึกเมืองกำแพงเพชร 🏢 (โลกขับรถ · รอบ 117)

> เจนเสร็จวางที่ **`img/city/<ชื่อไฟล์>.png`** — โค้ดรองรับแล้ว (adventure3d.js probe เอง):
> มีไฟล์ = ตึกแถว 4,660 หลังเปลี่ยนผนังเป็นภาพจริงทันที · ไม่มี = สีล้วนตามเดิม
> เกมแยกตึกตามจำนวนชั้น → ใช้ภาพคนละไฟล์ (1/2/3/4 ชั้น) · แต่ละหลังมี tint สีพาสเทลต่างกันคูณกับภาพอัตโนมัติ

## ⚠️ กติกาภาพ (สำคัญมาก ทุกไฟล์)
- **จัตุรัส 1024×1024** · มองตรงหน้าตึก 90° (orthographic/flat elevation) **ห้ามมีมุมเอียง/perspective**
- **ต่อเนื่องแนวนอนแบบ seamless** — ขอบซ้ายต่อกับขอบขวาได้เนียน (เกม tile ซ้ำตามความกว้างตึก ~2.5 คูหา/หลัง)
- ภาพ 1 ไฟล์ = **หน้าตึกเต็มความสูงตามจำนวนชั้น** (ขอบล่างภาพ = พื้นถนน · ขอบบนภาพ = ขอบดาดฟ้า)
- แสงแบนสม่ำเสมอ (ไม่มีเงาทแยง) · ไม่มีคน/รถ/เสาไฟ/ต้นไม้/ท้องฟ้า — ผนังตึกล้วนๆ เต็มเฟรม
- โทนสีอ่อนขาว-ครีม (เกมจะย้อมสีพาสเทลให้แต่ละหลังเอง — ภาพเข้มไปจะหม่นทั้งเมือง)

---

## 1) บ้านชั้นเดียวต่างจังหวัด → `img/city/house_1fl.png`

```
Flat orthographic front elevation texture of a single-story Thai provincial house,
full facade filling the frame edge-to-edge, bottom edge is street level, top edge is roofline edge,
cream painted concrete walls, one aluminium sliding window with awning, one simple door,
small ventilation blocks near the top, light warm white and cream tones,
seamless horizontally tileable (left edge continues into right edge),
even flat daylight, no perspective, no shadows cast, no people, no sky, no ground,
photorealistic game texture, 1024x1024
```

## 2) ตึกแถวพาณิชย์ 2 ชั้น → `img/city/shop_2fl.png`

```
Flat orthographic front elevation texture of a 2-story Thai shophouse (ตึกแถว) in a provincial town,
full facade filling the frame edge-to-edge, bottom edge is street level, top edge is flat rooftop parapet,
ground floor: metal roller shutter shopfront partly open feel but CLOSED shutters, small Thai-style shop signboard band above,
upper floor: aluminium sliding windows with small balcony railing and air conditioning unit,
cream and light beige painted concrete, subtle weathering stains,
seamless horizontally tileable (left edge continues into right edge, repeating shophouse bays),
even flat daylight, no perspective, no people, no sky, no street,
photorealistic game texture, 1024x1024
```

## 3) ตึกแถวพาณิชย์ 3 ชั้น → `img/city/shop_3fl.png`

```
Flat orthographic front elevation texture of a 3-story Thai commercial shophouse row,
full facade filling the frame edge-to-edge, bottom edge is street level, top edge is flat rooftop parapet,
ground floor metal roller shutters with shop signboard band, two upper floors of aluminium windows
with balconies, drying laundry poles hint, air conditioning units on wall brackets,
light cream white concrete with subtle tropical weathering,
seamless horizontally tileable (left edge continues into right edge, repeating bays),
even flat daylight, no perspective, no people, no sky,
photorealistic game texture, 1024x1024
```

## 4) อาคารพาณิชย์ 4 ชั้น → `img/city/shop_4fl.png`

```
Flat orthographic front elevation texture of a 4-story Thai commercial building,
full facade filling the frame edge-to-edge, bottom edge is street level with glass shopfront
and roller shutters, top edge is flat rooftop parapet,
three upper floors with regular grid of aluminium sliding windows, some balconies with railings,
air conditioning units, light cream and pale grey painted concrete, subtle weathering,
seamless horizontally tileable (left edge continues into right edge, repeating window bays),
even flat daylight, no perspective, no people, no sky,
photorealistic game texture, 1024x1024
```

---

## การทำงานในเกม (โค้ดพร้อมแล้ว)
- ตึก 1 ชั้น → `house_1fl` · 2 ชั้น → `shop_2fl` · 3 ชั้น → `shop_3fl` · 4 ชั้นขึ้นไป → `shop_4fl`
- ภาพถูก tile ซ้ำแนวนอน ~2.5 รอบต่อหลัง (ตึกกว้างเห็นหลายคูหา) · ยืดตามสัดส่วนหลังเล็กน้อย
- วางไฟล์แล้วเข้าโลกขับรถใหม่ = เห็นเลย (ไม่ต้องแก้โค้ด) · **อย่าลืม `git add img/city/...` ตอน push ไม่งั้น live 404** (บทเรียนรอบ 112)
- หมายเหตุ: ดาดฟ้าตึกจะเห็นลายเดียวกับผนัง (ข้อจำกัด texture เดียว/ตึก — มุมมองคนขับระดับถนนแทบไม่เห็นดาดฟ้า)
