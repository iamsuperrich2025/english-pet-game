# 🖼️ Prompt เจน texture เฮลิคอปเตอร์ Bell 212 (รอบ 358)

> วางไฟล์ที่ `img/tex/` ตามชื่อด้านล่าง → เกม probe เจอเอง ไม่ต้องแก้โค้ด → บอก Claude commit
> Artifact ปุ่มคัดลอก: ดูลิงก์ใน handoff/TASKS.md รอบ 358

## กติกาสำคัญ
- **tex_heli_body ต้องเป็นโทนเทาอ่อนเกือบขาว** (เกมย้อมสีทับเอง — ลายเดียวใช้ได้ทั้งลำแดง/ฟ้า/สีเทศกาล)
- ไฟล์ **JPG หรือ PNG 1024×1024** · **seamless/tileable** (ขอบต่อกันเนียน) · ไม่มีตัวหนังสือ/โลโก้
- ชื่อไฟล์: `img/tex/tex_heli_body.jpg` · `img/tex/tex_heli_metal.jpg`

## 1) tex_heli_body — ผิวลำเครื่อง (โทนเทาอ่อน ให้เกมย้อมสี)
```
Seamless tileable texture of aircraft fuselage aluminum skin, very light grey almost white matte painted metal, subtle panel lines grid, small flush rivets rows, faint scratches and weathering, slight oil streaks, photorealistic, flat orthographic view, even diffuse lighting, no logo, no text, no numbers, 1024x1024
```

## 2) tex_heli_metal — โลหะเข้ม (ใบพัด/สกี/ราง)
```
Seamless tileable texture of dark gunmetal steel, worn brushed metal with fine scratches, slightly oily sheen, chipped edges revealing bare metal, photorealistic, flat orthographic view, even diffuse lighting, no logo, no text, 1024x1024
```

## (เสริม ไม่บังคับ) 3) tex_heli_glass — กระจกห้องโดยสาร
> ตอนนี้กระจกใช้สีทึบอยู่ ถ้าอยากมีเงาสะท้อน: เจนแล้ววางไว้ก่อน ค่อยบอก Claude ต่อสายให้
```
Seamless texture of dark tinted aircraft cockpit glass, subtle diagonal light reflections, faint cloud reflections, deep blue-grey tone, photorealistic, no logo, no text, 1024x1024
```
