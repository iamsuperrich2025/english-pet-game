# 🛸 PROMPTS_INVASION.md — ภาพ/โมเดลสำหรับโลก "ยานแม่บุกโลก" (รอบ 413)

> โลกนี้ใช้ทรงที่โค้ดสร้างเองไปก่อน (procedural) — **วางไฟล์ตามชื่อด้านล่างแล้วเกมสลับไปใช้ของจริงเองอัตโนมัติ ไม่ต้องแก้โค้ด**
> ไฟล์ที่ยังไม่มี = เกมข้ามไปเงียบๆ ใช้ของเดิม (ไม่พัง ไม่มี error)

## 📦 ตารางไฟล์ที่ระบบรอรับ

| ไฟล์ | ใช้ทำอะไร | ขนาดที่แนะนำ |
|------|-----------|--------------|
| `img/models/mothership.glb` | ยานแม่ลำมหึมา (แทนทรงชั่วคราว) | ≤6 MB · ให้ด้านกว้างสุดเป็นแกน X · **ห้ามมีพื้น/ฉากติดมา** |
| `img/models/alien_fighter.glb` | ยานลูก 1 ลำ (ระบบก๊อปตามจำนวนตัวอักษร) | ≤1.5 MB · หัวยานชี้ไปทาง **−Z** |
| `img/models/gun_rifle.glb` | ปืนในมือผู้เล่น (มุมมองบุคคลที่ 1) | ≤2 MB · ปากลำกล้องชี้ **−Z** |
| `img/invasion/sky.webp` | ท้องฟ้า 360° (equirectangular 2:1) | 4096×2048 |
| `img/invasion/sand.jpg` | พื้นทราย (ต่อลายไร้รอยต่อ) | 1024² seamless |
| `img/invasion/wall.jpg` | ผนังบ้านดินเผา (ต่อลายไร้รอยต่อ) | 512² seamless |

> ⚠️ โมเดล .glb ระบบจะย่อ/ขยายและจัดกึ่งกลางให้เอง — ส่งมาขนาดไหนก็ได้ แต่ **ทิศทางการหัน (−Z)** ต้องถูก ไม่งั้นยานจะบินถอยหลัง

---

## 1️⃣ ยานแม่ — `img/models/mothership.glb`
```
Colossal alien mothership, top-down lens/saucer silhouette with a wide flat disc body,
matte charcoal-black faceted armor plating in overlapping angular panels, rows of sharp
spikes along the upper spine and pointing down from the underbelly, concentric structural
rings, small glowing indicator lights in green / amber / cyan along the outer rim,
a dark recessed rectangular panel bay on the front underside, dim red energy core beneath
the hull center. Hard-surface sci-fi, brutalist industrial, non-reflective dark metal,
neutral studio lighting, no background, no ground, isolated object, symmetrical.
```

## 2️⃣ ยานลูก — `img/models/alien_fighter.glb`
```
Small alien attack fighter craft, dark charcoal faceted armor matching a larger mothership,
sharp arrowhead / wedge silhouette with two swept blade wings, a single glowing green eye
sensor at the nose, twin cyan engine glow at the rear. Compact, aggressive, hard-surface
sci-fi. Nose pointing forward, isolated object, no background, no ground, symmetrical.
```

## 3️⃣ ปืนผู้เล่น — `img/models/gun_rifle.glb`
```
Modern futuristic assault rifle, first-person view model, matte dark gunmetal receiver with
a short heat-shrouded barrel, compact holographic sight on top rail, angled foregrip,
straight magazine, adjustable stock, subtle cyan energy indicator strips on the side.
Military hard-surface design, clean readable silhouette, isolated object, no background,
no hands, barrel pointing forward.
```

## 4️⃣ ท้องฟ้า 360° — `img/invasion/sky.webp`
```
360 degree equirectangular panorama, Middle Eastern desert sky at late afternoon,
warm dusty haze, pale amber and sand-tan gradient near the horizon deepening to muted blue
overhead, thin wispy high clouds, distant flat sandstone mesas and dunes along the horizon
line, heavy atmospheric dust. No sun disc, no aircraft, no text, seamless left-right wrap,
2:1 aspect ratio.
```

## 5️⃣ พื้นทราย — `img/invasion/sand.jpg`
```
Seamless tileable desert sand texture, top-down flat view, fine warm tan grains with subtle
wind ripple lines, small scattered pebbles, natural colour variation, even diffuse lighting,
no shadows, no objects, photorealistic, tileable on all four edges.
```

## 6️⃣ ผนังบ้านดินเผา — `img/invasion/wall.jpg`
```
Seamless tileable Middle Eastern adobe mud-brick wall texture, flat frontal view, warm sandy
beige plaster with fine cracks and weathering stains, subtle trowel marks, even diffuse
lighting, no shadows, no windows, no doors, photorealistic, tileable on all four edges.
```

---

## 🔧 หลังวางไฟล์แล้วทำอะไรต่อ
1. วางไฟล์ตาม path ในตาราง (สร้างโฟลเดอร์ `img/invasion/` ถ้ายังไม่มี)
2. บอก Claude ให้ commit ไฟล์ภาพ — **สำคัญ: deploy ใช้ `git archive HEAD` ไฟล์ที่ไม่ commit จะไม่ขึ้นเว็บ**
3. เข้าเกมดูได้เลย ไม่ต้องแก้โค้ด
