# 🛸 PROMPTS_INVASION.md — ภาพ/โมเดลสำหรับโลก "ยานแม่บุกโลก" (รอบ 413)

> โลกนี้ใช้ทรงที่โค้ดสร้างเองไปก่อน (procedural) — **วางไฟล์ตามชื่อด้านล่างแล้วเกมสลับไปใช้ของจริงเองอัตโนมัติ ไม่ต้องแก้โค้ด**
> ไฟล์ที่ยังไม่มี = เกมข้ามไปเงียบๆ ใช้ของเดิม (ไม่พัง ไม่มี error)

## 📦 ตารางไฟล์ที่ระบบรอรับ

| ไฟล์ | ใช้ทำอะไร | ขนาดที่แนะนำ |
|------|-----------|--------------|
| `img/models/mothership.glb` | ยานแม่ลำมหึมา (แทนทรงชั่วคราว) | ≤6 MB · ให้ด้านกว้างสุดเป็นแกน X · **ห้ามมีพื้น/ฉากติดมา** |
| `img/models/alien_fighter.glb` | ยานลูก 1 ลำ (ระบบก๊อปตามจำนวนตัวอักษร) | ≤1.5 MB · หัวยานชี้ไปทาง **−Z** |
| `img/models/gun_rifle.glb` | ปืนไรเฟิลจู่โจม (มุมมองบุคคลที่ 1) | ≤2 MB · ปากลำกล้องชี้ **−Z** |
| `img/models/gun_r93.glb` | 🎯 **R93 สไนเปอร์** (ปืนกระบอกที่ 2 · รอบ 419) | ≤2 MB · ปากลำกล้องชี้ **−Z** |
| `img/models/soldier_a.glb` | 🪖 **ทหารพันธมิตร** (หน่วยรบภาคพื้นในเกม) | ≤4 MB · **แยกชิ้นส่วน ไม่ต้อง rig** |
| `img/models/soldier_b.glb` | 🪖 **ทหารของผู้เล่นออนไลน์** (เพื่อนที่เห็นในแมพ) | ≤4 MB · **แยกชิ้นส่วน ไม่ต้อง rig** |
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

## 3️⃣.5 🎯 R93 สไนเปอร์ — `img/models/gun_r93.glb`
```
Modern bolt-action sniper rifle, first-person view model, matte grey-green metal receiver with a long
heavy fluted barrel and muzzle brake, large high-magnification telescopic scope mounted on tall rings,
straight-pull bolt handle protruding from the right side, dark walnut thumbhole stock with raised
cheek piece, straight 10-round box magazine, folded bipod under the front barrel. Precision marksman
weapon, hard-surface realistic design, clean readable silhouette, isolated object, no background,
no hands, barrel pointing forward.
```
> ยังไม่มีไฟล์ = เกมใช้ทรงที่โค้ดสร้างเอง (ลำกล้องยาว + กล้องเล็งใหญ่ + คันรั้งลูกเลื่อน + ขาทราย) ได้ปกติ

### 🎚️ Polygon Count ของ "ปืน" — แนะนำ **8,000–10,000**
ปืนต่างจากทหารตรงที่ **มีแค่กระบอกเดียวบนจอ** (view model ของผู้เล่น) แต่**อยู่ใกล้กล้องที่สุด**
→ ให้รายละเอียดได้เยอะกว่าทหาร โดยแทบไม่กระทบงบรวม

| Polygon Count | คิดเป็น % ของฉากทั้งหมด | ประเมิน |
|---|---|---|
| 5,000 | 2.1% | ✅ สบาย (แต่ท่อกลมอาจเห็นเป็นเหลี่ยมตอนส่องกล้อง) |
| **8,000** ⬅️ **ค่าที่ตั้งอยู่ = พอดีแล้ว** | 3.4% | ✅ สบาย |
| 10,000–12,000 | ~5% | ✅ สบาย (คมขึ้นตอนมองใกล้) |
| 15,000 | 6.1% | ✅ ยังไหว แต่ไฟล์เริ่มใหญ่เกิน 2MB |

> **สรุป: 8,000 ที่ตั้งอยู่ใช้ได้เลย** · อยากให้กระบอก/กล้องกลมเนียนขึ้นตอนเล็ง ขยับเป็น **10,000** ได้สบายๆ
> (ปืนวาดแค่ 1 ครั้งต่อเฟรม — ตอนส่องกล้อง PiP ระบบซ่อนปืนในรอบเลนส์อยู่แล้ว)

**⚡ เรื่องชิ้นส่วนของปืน (รอบ 428):** ปืนเป็น view model ที่วาดทุกเฟรม ถ้าแตก 81 ชิ้น = +81 draw call ตลอดเกม
→ **เกมรวมทั้งกระบอกเป็นก้อนเดียวให้แล้ว (81 → 1 · สามเหลี่ยมเท่าเดิมเป๊ะ)** แตกกี่ชิ้นก็ไม่ต้องกังวล
> ⚠️ ต้องเปิด **Pack UV** เหมือนทหาร ไม่งั้นรวมไม่ได้

### 🔧 ลำกล้องสั้นไป? — **ไม่ต้องแก้ใน Tripo เกมยืดให้เอง** (รอบ 427)
โมเดลที่ AI ปั้นมักได้ลำกล้องสั้นกว่าสไนเปอร์จริง → `stretchGunBarrel()` ยืดให้หลังโหลด

**ยืดแล้วไม่เพี้ยน** เพราะลำกล้องเป็นทรงกระบอกตรง — ยืดตามแกนตัวเอง หน้าตัดคงเดิม (ไม่อ้วนขึ้น)

| ชิ้นส่วน | ระบบทำอะไร |
|---|---|
| ลำกล้อง (ยาวเรียว อยู่ครึ่งหน้า) | **ยืดตามแกนอย่างเดียว** ตรึงปลายท้ายที่ต่อกับโครงปืน |
| ปากลำกล้อง · ศูนย์หน้า · ขาทราย | **เลื่อนตามไปข้างหน้า** เท่าที่ลำกล้องยาวขึ้น (รอยต่อคงเดิม) |
| โครงปืน · กล้อง · ด้าม · พานท้าย | **ไม่แตะเลย** |

**ผลทดสอบ:** ลำกล้อง 0.52 → 0.884 (**1.7 เท่า**) · ความหนาเท่าเดิม · ปากลำกล้องไม่ถูกยืดและยังต่อสนิท (ช่องว่าง 0.005 เท่ากันทั้งก่อน-หลัง) · โครง/พานท้าย/กล้อง ไม่ขยับ ✅

> 🔧 อยากยาว/สั้นกว่านี้ แก้ค่าเดียว: `GUN_STRETCH` (ตอนนี้ 1.7) ใน `js/invasion3d.js`
> ถ้าจุดตัดไม่พอดีกับโมเดลจริง ปรับ `GUN_CUT` (0.46 = ตัดที่ 46% ของความยาวปืนวัดจากท้าย)

---

# 🪖 ตัวละครทหาร 2 ตัว (รอบ 423)

## ❓ ต้อง rig ใน Tripo ไหม → **ไม่ต้องครับ**
ผมทำ **ระบบข้อต่อ (rig) ไว้ในเกมแล้ว 11 จุด** และเขียนท่าทางเป็นโค้ด (ยืน/เดิน/เล็ง/หมอบ/สะบัดตอนยิง)
ซึ่ง **เนียนกว่าและตรงสถานการณ์กว่าคลิปสำเร็จรูปจาก Tripo** เพราะ:

| | rig+animate ใน Tripo | แยกชิ้นส่วนมา ให้เกมขยับ (แนะนำ ✅) |
|---|---|---|
| ท่าทาง | ได้คลิปตายตัวไม่กี่ท่า | **ท่าตอบสนองสถานการณ์จริง** — หมอบหลังกระสอบทราย · เงยหน้าเล็งยานลูกตามมุมจริง · สะบัดไหล่ตอนลั่นไก |
| ความเนียน | คลิปมักกระตุก/สไลด์ | ขยับด้วยสมการ ลื่นทุกเฟรม ปรับความเร็วได้ |
| น้ำหนักไฟล์ | มี skeleton+clip ใหญ่กว่า | เบากว่า |
| แก้ทีหลัง | ต้องกลับไปเจนใหม่ | แก้ตัวเลขในโค้ดจุดเดียว |

### 📦 สิ่งที่ต้องส่งมา
> ✅ **ไม่ต้องตั้งชื่อชิ้นส่วนก็ได้!** (รอบ 424) — Tripo Smart Segment แตกมาเป็น `tripo_part_1..109` ก็ใช้ได้เลย
> ระบบจะ **ดูตำแหน่งของแต่ละชิ้นในร่างกาย** แล้วจับเข้าข้อต่อเอง (หัว/ลำตัว/สะโพก/แขนบน-ล่าง/ขาบน-ล่าง ซ้าย-ขวา)
> ทดสอบกับโมเดลจำลอง 110 ชิ้นแล้ว **จับถูก 110/110 ชิ้น**
>
> เงื่อนไขที่ยังต้องทำให้ถูก มีแค่ **ท่ายืนและทิศทาง** ด้านล่างเท่านั้น

<details><summary>ถ้าอยากตั้งชื่อเองเพื่อความชัวร์ (ไม่บังคับ)</summary>

Export `.glb` โดยให้ **แต่ละชิ้นส่วนเป็น mesh แยก และตั้งชื่อตามนี้** (ชื่อไม่ต้องเป๊ะ ขอให้มีคำนี้อยู่):

```
Hips · Torso · Head
UpperArm_L · Forearm_L · UpperArm_R · Forearm_R
Thigh_L    · Calf_L    · Thigh_R    · Calf_R
```
> มือ/เท้า/หมวก/เสื้อเกราะ — **รวมเข้ากับชิ้นแม่ได้เลย** (มือรวมกับ Forearm · เท้ารวมกับ Calf · หมวกรวมกับ Head)
</details>

### 🎚️ ตั้งค่า Retopo เท่าไหร่ดี (วัดจากฉากจริงในเกม)
ฉากนี้ **ไม่รวมทหาร** ใช้ไปแล้ว ~122,000 สามเหลี่ยม / 452 draw call
สมมติในแมพมีทหารพร้อมกัน 18 คน (พันธมิตร 10 + เพื่อนออนไลน์ ~8):

| Polygon Count | รวมทหาร 18 คน | ทั้งฉาก | ประเมิน |
|---|---|---|---|
| 3,000 | 54,000 | 176,000 | ✅ สบายมาก (มือถือเก่าก็ไหว) |
| **6,000** ⬅️ **แนะนำ** | 108,000 | 230,000 | ✅ **ปลอดภัย + ยังดูดี** |
| 8,000 | 144,000 | 266,000 | ✅ ปลอดภัย (ขอบบน) |
| 10,000 | 180,000 | 302,000 | ⚠️ เสี่ยงบนมือถือเก่า |

> **สรุป: ตั้ง Polygon Count = 6,000** (เลื่อนจาก 10,000 ลงมา)
> ทหารในเกมนี้เห็นระยะกลาง-ไกลเป็นหลัก 6,000 กับ 10,000 แทบแยกไม่ออกด้วยตา แต่ประหยัดไปเกือบครึ่ง
> ถ้าอยากให้ `soldier_b` (ตัวผู้เล่น เห็นใกล้กว่า) สวยกว่าหน่อย ใช้ **8,000** ได้

### 📤 ตั้งค่าตอน Export (สำคัญมาก!)

| ช่อง | ตั้งเป็น | เหตุผล |
|---|---|---|
| Format | **GLB** | ฟอร์แมตที่เกมโหลดได้ |
| **Pack UV** | **เปิด ✅** | รวมทุกชิ้นให้ใช้ texture เดียว → เกมรวมชิ้นเหลือ **11 ก้อน/คน** · ถ้าปิดจะได้ material แยก ~118 อัน รวมไม่ได้เลย |
| Texture Resolution | **1k** (2k ถ้าอยากชัดมาก) | ทหารเห็นระยะกลาง-ไกล 1k พอ · ช่วยให้ไฟล์ ≤4MB ตามเป้า |

**วัดจริงเทียบให้ดู (ทหาร 18 คนในแมพ):**

| | material ในไฟล์ | mesh ต่อทหาร 1 คน | draw call รวม 18 คน |
|---|---|---|---|
| **Pack UV เปิด** ✅ | 1 | **11** | **198** ← ไหวสบาย |
| Pack UV ปิด ❌ | 118 | 118 | **2,124** ← มือถือเด็กค้างแน่นอน |

> ⚠️ **Pack UV ต้องเปิดเสมอ** — เพราะระบบรวมชิ้นของเกมจัดกลุ่มตาม material
> ถ้าแต่ละชิ้นมี texture ของตัวเอง จะรวมไม่ได้ → draw call พุ่ง 10 เท่า

**💡 เรื่องที่สำคัญกว่าจำนวนโพลีอีก — จำนวนชิ้นส่วน:**
Smart Segment แตกมา ~110 ชิ้น = 110 draw call ต่อทหาร 1 คน (18 คน = 1,980 draw call → มือถือเอาไม่อยู่)
→ **เกมรวมชิ้นให้อัตโนมัติแล้ว เหลือ 11 ก้อน/คน (ลด 10 เท่า)** จึงแตกกี่ชิ้นก็ไม่มีปัญหา ไม่ต้องกังวล

**⚠️ เงื่อนไขเดียวที่ต้องทำให้ถูก คือ "ท่ายืน":**
- ยืน **A-pose** = แขนห้อยลง กางออกจากลำตัว **15–30°** · **ข้อศอกเหยียดตรง** · ขาแยกประมาณช่วงไหล่
- ❌ **ห้ามใช้ T-pose** (กางแขนขนานพื้น) — ทดสอบแล้วระบบแยก "แขนบน/แขนล่าง" ไม่ออก
  เพราะทั้งสองท่อนอยู่ระดับความสูงเดียวกัน → ได้ข้อต่อแค่ 9/11 แขนล่างหายไปทั้ง 2 ข้าง
- ไม่ต้องมีปืนติดมาก็ได้ (เกมใส่ปืนให้ในมือขวาเอง)

### 🧭 ทิศทางและขนาด — **ไม่ต้องตั้งใน Tripo (ตั้งไม่ได้อยู่แล้ว)**
Tripo ไม่มีปุ่มกำหนดแกนหน้า/ความสูงจริงให้ผู้ใช้ → **เกมจัดการเองทั้งคู่:**

| เรื่อง | ระบบทำอะไรให้ | ทดสอบแล้ว |
|---|---|---|
| **ความสูง** | `fitInto(1.8)` ย่อ/ขยายให้สูง 1.8 ม. เสมอ ไม่ว่าไฟล์จะมาสเกลเท่าไหร่ | สเกล ×37 และ ×0.02 → ได้ 1.800 ทั้งคู่ ✅ |
| **ทิศหันหน้า** | `faceModelForward()` ดูจาก **ปลายเท้ายื่นไปทางไหน + เป้สะพายอยู่หลัง** แล้วหมุน 180° ให้เองถ้าจำเป็น | โมเดลหันหน้า +Z และ −Z → จบลงหันหน้า −Z ถูกทั้งคู่ ✅ |

> สรุป: **Export ออกมาเลย ไม่ต้องหมุน ไม่ต้องปรับสเกล** — ขอแค่ยืน A-pose อย่างเดียวพอ

> ⚠️ ถ้า export มาเป็นก้อนเดียวแยกชิ้นไม่ได้ → **เกมไม่พัง** แต่ตัวละครจะยืนนิ่ง ขยับแขนขาไม่ได้

---

## 7️⃣ 🪖 ทหารพันธมิตร — `img/models/soldier_a.glb`
```
Modern military soldier character, full body, standing in a relaxed A-pose with arms straight
and slightly away from the body, facing forward. Desert multicam combat uniform, plate carrier
vest with pouches, combat helmet with fabric cover and side rails, knee pads, tactical gloves,
combat boots. Rugged special-forces operator look, tan and olive colour scheme, dusty worn
fabric. Clean readable silhouette, game-ready low-to-mid poly, neutral lighting, no background,
no weapon, no base or platform.
```

## 8️⃣ 🪖 ทหารของผู้เล่น — `img/models/soldier_b.glb`
```
Modern special forces marksman character, full body, standing in a relaxed A-pose with arms
straight and slightly away from the body, facing forward. Olive-grey combat uniform with rolled
sleeves, lightweight chest rig with magazine pouches, baseball-style tactical cap and headset,
shemagh scarf around the neck, knee pads, combat boots. Lean agile sniper-support look,
muted green-grey colour scheme. Clean readable silhouette, game-ready low-to-mid poly,
neutral lighting, no background, no weapon, no base or platform.
```

---

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
