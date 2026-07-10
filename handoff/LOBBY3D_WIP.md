# LOBBY3D_WIP.md — ✅ แก้เสร็จแล้ว (รอบ 105, version .101)

> **สรุป: ต้นตอคือ SkinnedMesh clone ไม่ rebind skeleton** — `gltf.scene.clone(true)` ไม่ผูก bone ใหม่
> GPU skinning เลยยึด bone ต้นฉบับ (detached) → scale/ตำแหน่ง/การหมุนที่ตั้งบน node ไม่มีผลกับ vertex
> = อาการ A (เล็ก 3×) + B (หันหลัง + หมุน/กล้องไม่สะท้อน) **ต้นตอเดียวกันจริง แต่ไม่ใช่ matrix ค้าง/pollution**
> **แก้:** เพิ่ม `cloneSkinned()` (อัลกอริทึม SkeletonUtils.clone ของ three.js inline) ใช้แทน `.clone(true)` ใน `applyLayout`
> ยืนยันด้วย gl.readPixels: fillY 24%→88%, การหมุน front/side/back ต่างกันจริง + screenshot เห็นคน+หมาเต็มตัวหันหน้าตรง
>
> ⬇️ (ประวัติการดีบักไว้อ้างอิง — สมมติฐานเดิม 2 ข้อ [matrix ค้าง / adventure3d pollution] **ผิดทั้งคู่**)

## 🎯 โจทย์ผู้ใช้
ออกแบบหน้า Lobby ใหม่: **ตรงกลางเป็นโลก 3D วางโมเดลคนเลี้ยง+สัตว์** · เก็บแผงข้อมูล/แถบ **ซ้าย(rail) บน(top) ขวา(side)** ไว้เหมือนเดิม
- ผู้ใช้เลือก (ผ่าน AskUserQuestion): **(1)** การ์ดกลางใหญ่ขึ้น คงกรอบเดิม (ไม่ full-bleed) **(2)** แผง "ข้อมูลน้อง"/"การดูแล" ย้ายเป็น **พาเนลทึบติดขอบซ้าย–ขวา** (ไม่ทับโลก 3D)
- โมเดลชาย+หญิงเสร็จแล้ว (`img/models/caretaker_male.glb`, `caretaker_female.glb`, `pet_dog.glb`)

## ✅ ทำเสร็จแล้ว (อยู่ใน working tree ยังไม่ commit)
1. **Layout redesign — ใช้งานได้ดี** (screenshot ยืนยันสวย):
   - `js/ui.js` (~บรรทัด 1339): เรียงลูกใน `.pet-card` ใหม่เป็น **[plate-left(ข้อมูลน้อง) | stage-hero(เวที 3D) | plate-right(การดูแล)]**
   - `css/lobby.css`: `#screen-dashboard .pet-card` = flex row 3 คอลัมน์ · `.stage-hero` = เวทีโลก 3D (พื้นหลังไล่เฉด + เส้นพื้นเรืองแสง ::after) · `.stage-plate` = พาเนลทึบติดขอบ (เลิก absolute overlay)
   - rail ซ้าย / top bar / side ขวา / footer **คงเดิมครบ**
2. **หันหน้าโมเดล** — `js/lobby3d.js` เพิ่ม `const FACE_CAMERA = -Math.PI/2` + ใส่ `petRoot.rotation.y = ownerRoot.rotation.y = FACE_CAMERA` ใน `applyLayout()`
   - ⚠️ **ยังไม่ผ่าน** (ดูปัญหาข้อ B ล่าง)

## 🐞 ปัญหาค้าง 2 ข้อ (ต้นตอเดียวกัน — ดู "ข้อสรุปสำคัญ")

### A. โมเดลเรนเดอร์ **เล็กเกินไป ~3×** ในกรอบกลาง (portrait)
- กล้อง frame ความสูงโมเดล 1.55 → ควรเต็ม ~85% แต่จริงเต็มแค่ ~27% (นั่งล่างจอ)
- **พิสูจน์ต้นตอแล้ว:** หน้า test แยก (isolated) โหลด **โมเดลเดียว → เต็ม 89% สวยเป๊ะ หันหน้าตรง** · แต่โหลด **2 โมเดล (owner+pet) → ตกเหลือ 27%** ทั้งที่ Box3 วัดขนาดโมเดลถูก (owner 1.56, pet 1.34, เท้าที่ y=0) และกล้อง/aspect/buffer เหมือนกันทุกอย่าง
- ทดสอบแล้วว่า **ไม่ใช่**: aspect(portrait), pixelRatio(1 vs 1.25), hierarchy(rootTilt→spin→sway), การ clone scene, DPR, `matrixWorldAutoUpdate`(=true, THREE r149)

### B. โมเดลหันหลัง + **การหมุน/กล้องที่เปลี่ยน ไม่สะท้อนใน render**
- ในเกมเห็น **ด้านหลังหัว** (ผมฟูดำ ไม่เห็นหน้า) ทั้งที่ตั้ง FACE_CAMERA
- ตั้ง `spin.rotation.y = 0` กับ `= π` (ผ่าน debug `_spin`) → **ภาพเหมือนเดิมทั้งคู่** (การหมุนไม่เปลี่ยนภาพ!)
- `three.project()` บอกหัวโมเดลอยู่ NDC ~0.64 (82% จอ) แต่ pixel จริงเต็มแค่ ~30% → **render ไม่ตรงกับ projection matrix ของกล้องเอง**
- isolated axis test ยืนยันโมเดลหันหน้า -X โดยดีฟอลต์ → `rotY = -π/2` (กล้อง +z) = **หน้าตรง** (เห็นตา/ยิ้มชัด) — โมเดลไม่มีปัญหา

## 💡 ข้อสรุปสำคัญ (ตั้งสมมติฐานให้ session ใหม่)
**อาการ A และ B น่าจะต้นตอเดียว: ในเกม `renderer.render(scene,camera)` ใช้ world/view matrix ที่ผิด/ค้าง** — การเปลี่ยน `camera.position`/`spin.rotation.y` ต่อเฟรมไม่สะท้อนออกภาพ (แต่การโหลดโมเดล/เปลี่ยน avatar ที่เป็น structural change สะท้อน) · isolated (THREE สด, render ครั้งเดียว) ทำงานถูกหมด → **ปัญหาอยู่ที่ integration ในเกม**

### จุดที่ควรสืบต่อ (ยังไม่ได้ตรวจ)
- มี **Lobby3D / renderer / render loop ซ้อน** ไหม? (`initRenderer` ถูกเรียกซ้ำสร้าง camera/scene ใหม่แต่โชว์ canvas เก่า?) เช็ก `booting`/fast-path ใน `attach()`
- `adventure3d.js` (โลก 3D อีกตัว) แชร์ THREE ตัวเดียวกัน — มันตั้งค่า global อะไรที่กระทบไหม? (เช่น override prototype, ค้าง state) · ลองโหลด lobby ใน**หน้าที่ไม่เคยเข้า adventure3d**
- canvas ที่ **แสดง** เป็นตัวเดียวกับที่ `renderer` วาดไหม (`#lobby3d-canvas`) · มี canvas 2 ตัวไหม
- ใส่ `scene.updateMatrixWorld(true)` + `camera.updateMatrixWorld(true)` ก่อน render ใน 1 tick แล้วดูว่าการหมุนสะท้อนไหม (ทดสอบสมมติฐาน matrix ค้าง)

## 🧪 วิธี reproduce เร็ว (preview)
```js
// mock login + สร้างน้องหมา adult (ดู testkit ใน HANDOFF.md)
authOnLogin({uid:'test1',email:'t@test.com'}); // แล้วกรอก register เลือก"ชาย" กด"เริ่มผจญภัย"
const p=newPet('dog','เจ้าด่าง'); p.level=3; state.pets=[p]; state.active=0; state.playerAvatar='male'; saveState(); renderDashboard();
// รอ ~2.6s โมเดลโหลด · Lobby3D._debug() ดูสถานะ
```
- **preview_resize เป็น landscape ก่อน** (เช่น 1000×640) ไม่งั้นโดน overlay "หมุนจอ"
- **screenshot ในเกมเชื่อครึ่งเดียว** — บางครั้งได้ภาพ low-res/สเกลเพี้ยน · ล้าง toast ก่อน: `document.querySelectorAll('[class*=toast]').forEach(t=>t.remove())`
- **อย่าเรียก readPixels นอกจังหวะ render ซ้ำๆ** — ทำ preview_screenshot ค้าง (ต้อง reload หน้าแก้)

## 🩹 workaround ที่ลองแล้ว (ถ้าจะแก้ปลายเหตุ)
- **CSS zoom (ได้ผลเรื่องขนาด):** `#lobby3d-canvas{transform:scale(2.6);transform-origin:50% 95%}` → ตัวใหญ่เต็มเวที **ไม่บิด** (ขยาย bitmap ที่เรนเดอร์ถูกอยู่แล้ว) · แต่**ยังหันหลัง** (ต้องแก้ B ก่อน) · ค่า 2.6 ผูกกับ bug (ถ้าแก้ A ได้จะ over-zoom)
- **autofit จาก pixel (perspective)** ลู่เข้าได้ (fill 86%) แต่ดันกล้องใกล้ → perspective บิด (หัวโต) เพราะ B ทำ recenter เพี้ยน — **ไม่แนะนำ**
- **OrthographicCamera** — ยังเจอ A (2 โมเดลย่อ) เหมือนกัน · autofit ortho oscillate
- ⚠️ ทั้งหมดเป็นปลายเหตุ · **แนะนำแก้ต้นตอ B ก่อน** (render ไม่สะท้อน scene) แล้ว A กับ B น่าจะหายพร้อมกัน

## 📂 ไฟล์เกี่ยว
- `js/lobby3d.js` — โมดูล Lobby3D (initRenderer/applyLayout/frameCamera/tick/attach) · **สะอาดแล้ว** (ถอด debug/autofit ทดลองออกหมด เหลือ baseline + FACE_CAMERA)
- `js/ui.js` ~1339 — DOM การ์ดน้อง (reorder แล้ว)
- `css/lobby.css` — `.pet-card`/`.stage-hero`/`.stage-plate` (redesign แล้ว)
- โมเดล 3D: `img/models/*.glb`
