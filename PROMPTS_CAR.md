# PROMPTS_CAR.md — ภาพห้องคนขับโลกขับรถกำแพงเพชร 🚗 (รอบ 113)

> เจนเสร็จวางไฟล์ตาม path ด้านล่าง — **โค้ดรองรับแล้ว เกม probe เอง** (ไม่มีไฟล์ = ใช้แผง CSS จำลองไปก่อน พวงมาลัยยังหมุนได้)
> รถ**พวงมาลัยขวา**แบบเมืองไทย · 2 ภาพต้องแนวเดียวกัน (สี/แสงเดียวกัน จะได้ดูเป็นรถคันเดียวกัน)

---

## 1) แผงหน้าปัด + ฝากระโปรง (ไม่มีพวงมาลัย) → `img/car/dash.png`

- ขนาดแนะนำ **1920×800** (แนวนอนกว้าง) · **PNG พื้นหลังโปร่งใส**
- ⚠️ สำคัญ: **ห้ามมีพวงมาลัยในภาพ** (พวงมาลัยเป็นภาพแยกข้อ 2 ซ้อนทับแล้วหมุนตามการเลี้ยว)
- ส่วนบนของภาพ (เหนือแนวหน้าปัด/ฝากระโปรง) ต้องโปร่งใส — เกมวางภาพชิดขอบล่างจอ โลก 3D โผล่ด้านบน

```
First-person driver's seat POV interior of a modern Thai family sedan,
RIGHT-HAND DRIVE, steering wheel REMOVED / not present (empty steering column area
on the right side, instrument cluster with speedometer and fuel gauge fully visible),
dark charcoal dashboard with soft rounded design, air vents, small digital clock,
lower edge of windshield frame across the top, car HOOD (bonnet) in light silver-blue
paint visible stretching ahead at the bottom center of the windshield view,
left side shows passenger side dashboard and door edge,
bright tropical daylight lighting, photorealistic game asset,
wide 1920x800 composition, TRANSPARENT BACKGROUND above the dashboard line and
around the hood silhouette (PNG alpha), no sky, no scenery, no hands, no people,
no steering wheel, clean edges for game HUD overlay
```

## 2) พวงมาลัยแยกชิ้น (สำหรับหมุน) → `img/car/wheel.png`

- ขนาดแนะนำ **1024×1024 (จัตุรัสเป๊ะ)** · **PNG พื้นหลังโปร่งใส**
- ⚠️ สำคัญมาก: **จุดหมุนของพวงมาลัย = กึ่งกลางภาพพอดี** (เกมหมุนภาพรอบจุดกลางตอนเลี้ยวซ้าย-ขวา) — พวงมาลัยตั้งตรง ไม่เอียง มองตรงหน้า
- วงพวงมาลัยเต็มวง ครบทั้งบน-ล่าง อย่าให้ขอบภาพตัดวง

```
A modern car steering wheel photographed perfectly straight-on and centered,
full circle completely visible, dark charcoal leather rim with silver spokes,
plain round center hub with NO logo, subtle horn pad,
the rotation center of the wheel is exactly at the center of the square image,
neutral even studio lighting matching bright daylight interior,
photorealistic game asset, 1024x1024, TRANSPARENT BACKGROUND (PNG alpha),
no hands, no dashboard, no background, no shadow cast outside the wheel,
clean crisp edges for game HUD overlay that will be rotated by code
```

---

## การทำงานในเกม (โค้ดพร้อมแล้ว — adventure3d.js)
- `#adv-cardash` วางภาพ dash ชิดขอบล่างเต็มกว้าง (สูงสุด 42vh) · `#adv-carwheel` วางภาพพวงมาลัยที่ตำแหน่ง 66% ค่อนขวา (พวงมาลัยขวา)
- เลี้ยวซ้าย-ขวา → โค้ดหมุน `wheel.png` ตามมุมพวงมาลัยจริง (สูงสุด ~±230°) แบบ smooth
- ไม่มีภาพ → CSS จำลอง (แผงเข้ม + วงพวงมาลัย) พวงมาลัยยังหมุนได้เหมือนกัน
- อยากเปลี่ยนตำแหน่ง/ขนาดพวงมาลัย: แก้ CSS `#adv-carwheel{left:66%;bottom:-7vh;width:min(36vh,46vw)}`
