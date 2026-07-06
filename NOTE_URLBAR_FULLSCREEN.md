# NOTE — แถบ URL ของเบราว์เซอร์กินพื้นที่จอ (เตรียมคุยต่อใน session ใหม่)

> สร้าง 6 ก.ค. 2026 (รอบยี่สิบหก) · ผู้ใช้เปิดเกมบนมือถือ Chrome แนวนอน แล้วรู้สึกว่า
> **แถบ URL ด้านบน + แถบปุ่มล่างของเบราว์เซอร์ บังพื้นที่เล่นมากเกินไป** (จอแนวนอนเตี้ยอยู่แล้ว)
> อยากให้ session ใหม่มาช่วยแก้เรื่องนี้โดยเฉพาะ · session ใหม่อ่านไฟล์นี้ + HANDOFF.md ก่อนเริ่ม

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
