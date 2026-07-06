# NOTE — แถบ URL ของเบราว์เซอร์กินพื้นที่จอ

> สร้าง 6 ก.ค. 2026 (รอบยี่สิบหก) · ผู้ใช้เปิดเกมบนมือถือ Chrome แนวนอน แล้วรู้สึกว่า
> **แถบ URL ด้านบน + แถบปุ่มล่างของเบราว์เซอร์ บังพื้นที่เล่นมากเกินไป** (จอแนวนอนเตี้ยอยู่แล้ว)

## ✅ แก้แล้ว (รอบยี่สิบเจ็ด · 6 ก.ค. 2026 — ยังไม่ commit/push รอผู้ใช้สั่ง)
1. **manifest.json: `display: standalone` → `fullscreen`** (+ `display_override:["fullscreen","standalone"]` เผื่อ fallback) →
   ตอนติดตั้งเป็นแอพแล้วเปิดจากไอคอน จะซ่อน **status bar ของ Android (นาฬิกา/แบต/สัญญาณ)** ด้วย = เต็มจอสุด
   (ผู้ใช้ยืนยันว่าแถบ URL หายแล้วจากการติดตั้ง PWA · ที่เหลือขวางคือ status bar มือถือ → fullscreen จัดการ)
   - ⚠️ **แอพที่ติดตั้งไปแล้วต้องถอน+ติดตั้งใหม่ 1 ครั้ง** ถึงจะเปลี่ยนโหมด (Android ล็อก display mode ตอนติดตั้ง)
2b. **ปุ่ม 📲 ติดตั้งแอพ ในเกม** (สำหรับคนใช้ไม่ค่อยเป็น · ผู้ใช้สั่งเพิ่ม):
   - 2 จุด: (ก) ปุ่มเขียวเด่นในการ์ด login `#btn-install` "📲 ติดตั้งเป็นแอพ / เล่นเต็มจอ ลื่นกว่า ไม่มีแถบบัง" (ข) icon-btn `#btn-install-top` 📲 ในหัว dashboard (ข้าง 🔊/🚪) สำหรับคน auto-login ข้ามหน้า login
   - โผล่เฉพาะตอนติดตั้งได้จริง: Android ดัก `beforeinstallprompt` (กด = เด้ง prompt ติดตั้งจริง) · iOS โชว์ปุ่มเสมอ กดแล้วเด้ง overlay สอน "แชร์ → Add to Home Screen" · ถ้าเปิดจากแอพที่ติดตั้งแล้ว (standalone/fullscreen) = ไม่โชว์ · `appinstalled` = ซ่อนปุ่ม
   - โค้ดสคริปต์ท้าย index.html (ใต้ update-check) · CSS `.install-btn`/`.install-guide-overlay`/`.install-guide` ใน style.css + squeeze จอเตี้ยใน lobby.css
   - ทดสอบ preview ผ่าน: ไม่มี error · ปุ่มซ่อน default · beforeinstallprompt→โผล่ทั้ง 2 จุด · overlay สอนวิธีเรนเดอร์ถูก · พอดีจอเตี้ย 740×360 ไม่ล้น

2. **ระบบแจ้งเวอร์ชันใหม่ในเกม** (ผู้ใช้ห่วงว่าคนไม่รู้ขั้นตอนจะไม่ได้อัปเดต):
   - ไฟล์ใหม่ `version.json` = `{"v":"..."}` · สคริปต์ใน `index.html` (ใต้ SW register) เทียบ version.json บน server กับที่กำลังรัน
     (เช็กตอน load + ทุก 3 นาที + ตอนกลับมาโฟกัส/ออนไลน์ · no-store) → ต่างเมื่อไร เด้งแถบ `.update-banner` "✨ มีเกมเวอร์ชันใหม่! 🔄 อัปเดตเลย ✕"
     กด = `location.reload()` (network-first ใน sw.js ดึงโค้ดใหม่ให้) · CSS `.update-banner`/`#update-reload`/`#update-dismiss` ใน style.css
   - ทดสอบ preview ผ่านครบ (ไม่มี error · เปลี่ยน version.json แล้วแถบเด้ง · ปิดได้)
   - 🔑 **ขั้นตอน deploy สำคัญ: ทุกครั้งที่ push โค้ดใหม่ ให้บัมพ์เลข `v` ใน `version.json`** (เช่น 2026-07-06.1 → .2)
     ผู้ใช้ถึงจะเห็นแถบ "มีเวอร์ชันใหม่" — ถ้าลืมบัมพ์ ผู้ที่เปิดค้างจะไม่ถูกเตือน (แต่ network-first ยังให้โค้ดใหม่ตอนเปิดรอบหน้าอยู่ดี)

### เรื่องอัปเดตระยะยาว (ตอบคำถามผู้ใช้)
- อัปเดตเนื้อหา/โค้ดปกติ (ฟีเจอร์/บั๊ก/คำศัพท์) → ผู้ใช้ที่ติดตั้งแล้ว **ได้อัตโนมัติ ไม่ต้องติดตั้งใหม่** (sw.js network-first)
- ต้องติดตั้งใหม่เฉพาะตอนแก้ **manifest** (display mode/ไอคอน/ชื่อ) เท่านั้น — นานๆ ที

---

## (อ้างอิงเดิม) บริบทตอนเริ่ม

## ปัญหา
- เกมบังคับแนวนอน (จอมือถือแนวนอน = เตี้ยมาก ~340–412px CSS height)
- เปิดใน **Chrome (โหมดเบราว์เซอร์)** → แถบ URL บน + แถบ navigation ล่าง กินความสูงไปเยอะ เหลือพื้นที่เกมน้อย
- ภาพจากผู้ใช้: หน้า login พอดีจอแล้ว (แก้รอบนี้) แต่ผู้ใช้ยังติดใจว่าแถบ URL เอง "ขวางพื้นที่มาก"

## บริบทที่ทำไปแล้ว (รอบยี่สิบหก 6 ก.ค. 2026)
- ✅ **PWA พร้อมแล้ว** (commit `31d16d8`): `manifest.json` (display **standalone** · orientation landscape) +
  `sw.js` + ไอคอนแอพ + register SW ใน index.html + meta `apple-mobile-web-app-capable` + `viewport-fit=cover`
- ✅ บีบหน้า login/register ให้พอดีจอเตี้ย (commit `d44bd2c`, `@media (max-height:520px)` ใน lobby.css)
- ผู้ใช้ยังเปิดในโหมดเบราว์เซอร์ปกติ (ยังไม่ได้กด "เพิ่มลงหน้าจอโฮม")

## ⭐ ทางแก้ที่ตรงจุดสุด: ติดตั้งเป็น PWA (standalone) → แถบ URL หายทั้งหมด
เมื่อ **ติดตั้งลงหน้าจอโฮมแล้วเปิดจากไอคอน** display:standalone จะทำให้ **ไม่มีแถบ URL / ไม่มี browser chrome เลย เต็มจอจริง** — นี่คือคำตอบหลัก ของที่ทำไว้แล้วรองรับอยู่
- ➕ ต่อยอดได้: เปลี่ยน manifest `"display": "standalone"` → **`"fullscreen"`** (ซ่อน status bar บน (นาฬิกา/แบต) ด้วย = ได้พื้นที่เพิ่มอีกนิด · แต่ผู้ใช้เห็นนาฬิกา/แบตไม่ได้ — ต้องเคาะกับผู้ใช้ว่าเอาไหม)
- ⚠️ ข้อจำกัด: ผู้ใช้ **ต้องกดติดตั้งเองก่อน** (Android Chrome: เมนู ⋮ → เพิ่มลงหน้าจอหลัก · iOS Safari: แชร์ → Add to Home Screen) — ถ้าเปิดจากลิงก์ในเบราว์เซอร์เฉยๆ จะยังเห็นแถบ URL

## ทางเลือกเสริม (ถ้าอยากให้โหมดเบราว์เซอร์เต็มจอด้วย โดยไม่ต้องติดตั้ง)
1. **ปุ่ม "เต็มจอ" + Fullscreen API** (`document.documentElement.requestFullscreen()`)
   - ➕ ซ่อนแถบ URL ได้แม้อยู่ในเบราว์เซอร์ · กดปุ่มครั้งเดียว
   - ⚠️ ต้องมี **user gesture** (กดปุ่มเอง เรียกอัตโนมัติตอนโหลดไม่ได้) · **iPhone (iOS Safari) ไม่รองรับ Fullscreen API บนมือถือ** (ได้เฉพาะ iPad/บางกรณี) → Android ได้ผลดี iOS ไม่ได้
   - แนวคิด UI: ปุ่ม 🔳 เต็มจอ มุมจอ (โชว์เฉพาะตอนไม่ได้อยู่ standalone — เช็ก `matchMedia('(display-mode: standalone)')`)
2. **Add-to-Home-Screen prompt ในเกม** — ดักอีเวนต์ `beforeinstallprompt` (Android) แล้วโชว์ปุ่ม "ติดตั้งแอพ 📲" เองในเกม (กดแล้วเด้ง prompt ติดตั้งเลย ไม่ต้องสอนหาเมนู) + สอน iOS แยก (iOS ไม่มี beforeinstallprompt ต้องบอกวิธี manual)
3. **แถบแนะนำเล็กๆ** "ติดตั้งเป็นแอพเพื่อเล่นเต็มจอ" โชว์ครั้งแรก (dismiss ได้ เก็บ flag ใน localStorage)

## คำแนะนำเบื้องต้น (ให้ session ใหม่เสนอผู้ใช้)
- **หลัก:** ผลักดันให้ติดตั้ง PWA (standalone) — โซลูชันสะอาดสุด ทำเสร็จแล้วครึ่งทาง เหลือแค่ทำ "ปุ่มติดตั้งในเกม" (ข้อเสริม 2) ให้ผู้ใช้กดติดตั้งง่ายๆ
- **รอง:** เพิ่มปุ่ม Fullscreen API (ข้อเสริม 1) สำหรับคนที่ไม่ติดตั้ง (Android ได้ผล · iOS แจ้งให้ Add to Home Screen แทน)
- อาจทำทั้งคู่: ปุ่ม "📲 ติดตั้งแอพ" (ถ้ามี beforeinstallprompt) + ปุ่ม "🔳 เต็มจอ" (fallback)

## คำถามที่ต้องเคาะกับผู้ใช้ก่อนลงมือ
1. รับได้ไหมที่ทางแก้หลักคือ "ให้ผู้เล่นติดตั้งเป็นแอพก่อน" (เด็ก/ผู้ปกครองต้องกดติดตั้ง 1 ครั้ง)?
2. เอา manifest `display: fullscreen` (ซ่อนนาฬิกา/แบตด้วย) ไหม หรือเก็บ `standalone` (ยังเห็นนาฬิกา/แบต)?
3. ต้องรองรับ iPhone ด้วยไหม (iOS ไม่มีปุ่มติดตั้งอัตโนมัติ + ไม่มี Fullscreen API มือถือ → ได้แค่สอน Add to Home Screen)?
4. อยากได้ปุ่ม "เต็มจอ" ในเกมสำหรับคนเล่นผ่านเบราว์เซอร์ (ไม่ติดตั้ง) ด้วยไหม?

## ไฟล์ที่เกี่ยวข้อง
- `manifest.json` — display mode (standalone/fullscreen), orientation
- `index.html` (head) — meta PWA, register SW, จุดเสียบปุ่มติดตั้ง/เต็มจอ
- `css/lobby.css` — `@media (max-height:520px)` (บีบ login แล้ว) + overlay "หมุนจอ" (`#rotate-overlay`)
- `js/main.js` — init จุดผูกอีเวนต์ (beforeinstallprompt / ปุ่ม fullscreen น่าจะเสียบที่นี่)
- `sw.js` — service worker (ไม่ต้องแตะสำหรับงานนี้)

## หมายเหตุทดสอบ
- โหมด standalone ทดสอบใน preview desktop ยาก (ต้องมือถือจริง/ติดตั้งจริง) — เช็ก `matchMedia('(display-mode: standalone)').matches`
- Fullscreen API ทดสอบใน preview: `requestFullscreen` ต้องมาจาก user gesture (คลิกปุ่มจริง ไม่ใช่ eval เฉยๆ)
- ผู้ใช้เปิดจริงบน Android Chrome (จาก screenshot) · เครื่องทดสอบ preview เป็น desktop
