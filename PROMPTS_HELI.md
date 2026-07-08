# PROMPTS_HELI.md — ภาพ cockpit + เสียงใบพัด Bell 🚁 (โลกเฮลิคอปเตอร์ รอบ 52)

> **เกมเล่นได้เลยโดยไม่ต้องรอไฟล์ทั้งสอง** — ตอนนี้มี cockpit จำลองด้วย CSS + เสียงใบพัดสังเคราะห์
> (Web Audio ปลอดลิขสิทธิ์ 100%) ในตัวแล้ว · ไฟล์ที่เจนคือ "ตัวอัปเกรด" วางปุ๊บเกมใช้เองอัตโนมัติ

---

## 1) ภาพห้องนักบิน `img/heli_cockpit.png`

**วิธีใช้:** เจนภาพ → ตั้งชื่อไฟล์ `heli_cockpit.png` → วางใน `img/` → commit+push จบ
**สเปกภาพ:** แนวนอนกว้าง (16:9 หรือกว้างกว่า) · เกมจะวางภาพนี้**ชิดขอบล่างจอ** (สูงไม่เกิน ~38% ของจอ)
เป็นแผงหน้าปัด ไม่ต้องมีกระจก/วิวข้างนอก (ส่วนบนของจอคือฉาก 3D จริง)

**Prompt (วางในเครื่องมือเจนภาพที่ใช้ประจำ):**
```
first-person pilot view of a Bell 206 JetRanger helicopter cockpit instrument
panel, wide dashboard filling the bottom of the frame, round analog gauges
(altimeter, airspeed, fuel, engine RPM), center console with levers and
switches, cyclic stick visible at bottom center, warm cartoon mobile-game art
style, clean bright colors, high detail, no windshield view, no sky, no
background scenery, only the dashboard panel, wide 21:9 aspect ratio
```
> 💡 เคล็ดลับ: ถ้าภาพที่ได้มีวิวท้องฟ้าติดมา ให้ crop เหลือเฉพาะแผงหน้าปัดด้านล่างก่อนวางไฟล์
> (ขอบบนของภาพควรเป็นขอบบนของแผงหน้าปัดพอดี — เกมวาง object-position:top ให้เอง)

## 2) เสียงใบพัด `sound/heli_rotor.mp3` (วนลูปตลอดการบิน — เจนจาก Suno)

**วิธีใช้:** Suno → Create → ติ๊ก **Instrumental** → วาง prompt → โหลด MP3 →
เปลี่ยนชื่อเป็น `heli_rotor.mp3` → วางในโฟลเดอร์ `sound/` → commit+push

**Prompt (Style of Music):**
```
realistic helicopter rotor blades spinning, steady rhythmic blade chop,
deep turbine engine hum, Bell 206 helicopter flight ambience, constant
speed, mechanical sound effect only, no music, no melody, no drums,
no vocals, seamless loop
```
> ℹ️ เกมปรับ pitch/ความดังเองตามการบิน (จอดเบา-ไต่ระดับดังขึ้น) ทั้งกับเสียงสังเคราะห์และไฟล์จริง
> ℹ️ Suno ถนัดเพลงมากกว่า sound effect — ถ้าได้ผลไม่สมจริง ลองเจนหลายรอบแล้วเลือกท่อนที่ "ตุบๆ" สม่ำเสมอสุด หรือใช้เสียงสังเคราะห์ในเกมต่อไปก็ได้ (ทำงานดีอยู่แล้ว)

---

## เช็กลิสต์หลังวางไฟล์
- [ ] `img/heli_cockpit.png` — เข้าโลกเฮลิฯ แล้วเห็นแผงหน้าปัดจริงแทนแผง CSS
- [ ] `sound/heli_rotor.mp3` — ได้ยินเสียงใบพัดจริงแทนเสียงสังเคราะห์ทันทีที่ขึ้นบิน
- ℹ️ ทั้งสองไฟล์ sw.js cache แบบ cache-first ให้อัตโนมัติ (โหลดครั้งเดียว)
