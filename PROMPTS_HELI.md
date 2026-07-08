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

## 2) เสียงเครื่องยนต์ 3 ไฟล์ (เจนจาก Suno — รอบ 53 ระบบเสียงสมจริง)

> เกมมีระบบเสียงเครื่องยนต์ 3 จังหวะแล้ว: **สตาร์ทเครื่อง → ลูปบินปกติ → เร่งเครื่องเต็มกำลัง**
> (เสียงสังเคราะห์ทำครบทั้ง 3 จังหวะอยู่แล้ว — ไฟล์คืออัปเกรดความสมจริง วางกี่ไฟล์ก็ได้ ไม่ต้องครบชุด)
> เกมมีโมเดล RPM แรงเฉื่อย: ดึงขึ้น = เสียงค่อยๆ เร่ง · ปล่อย = ค่อยๆ เบา · มีไฟล์ high จะ crossfade ให้เอง

**วิธีใช้:** Suno → Create → ติ๊ก **Instrumental** → วาง prompt → โหลด MP3 →
เปลี่ยนชื่อไฟล์ให้ตรงเป๊ะ → วางในโฟลเดอร์ `sound/` → commit+push

### 2.1) `sound/heli_start.mp3` — สตาร์ทเครื่อง (เล่นครั้งเดียวตอนเข้าโลก · ระหว่างนี้ยังบินไม่ได้)
```
Bell 206 helicopter turbine engine startup sequence, igniter clicking,
jet turbine spooling up from silence, engine whine slowly rising in pitch,
rotor blades starting to turn slowly then accelerating to full steady speed,
ends at full power, mechanical sound effect only, no music, no melody,
no drums, no vocals
```
> ✂️ ตัดให้จบที่จังหวะ "ใบพัดหมุนเต็มรอบพอดี" ~5–9 วินาที (เกมรอไฟล์จบแล้วค่อยปลดล็อกบิน สูงสุด 9 วิ)

### 2.2) `sound/heli_rotor.mp3` — ลูปบินปกติ/เดินเบา (วนตลอดการบิน)
```
realistic helicopter rotor blades spinning, steady rhythmic blade chop,
deep turbine engine hum, Bell 206 helicopter flight ambience, constant
speed, mechanical sound effect only, no music, no melody, no drums,
no vocals, seamless loop
```

### 2.3) `sound/heli_rotor_high.mp3` — ลูปเร่งเครื่องเต็มกำลัง (ตอนไต่ระดับ/ดึง collective)
```
helicopter at full power climbing hard, fast aggressive rotor blade chop,
high RPM screaming turbine whine, loud straining jet engine, intense
Bell 206 helicopter maximum throttle, mechanical sound effect only,
no music, no melody, no drums, no vocals, seamless loop
```
> ℹ️ มีครบทั้ง 2.2+2.3 → เกม crossfade สองลูปตาม RPM (เนียนสุด) · มีแค่ 2.2 → เกมปรับ pitch/ดังของลูปเดียวแทน
> ℹ️ Suno ถนัดเพลงมากกว่า sound effect — เจนหลายรอบแล้วเลือกท่อนที่สม่ำเสมอสุด หรือใช้เสียงสังเคราะห์ต่อก็ได้

---

## เช็กลิสต์หลังวางไฟล์
- [ ] `img/heli_cockpit.png` — เข้าโลกเฮลิฯ แล้วเห็นแผงหน้าปัดจริงแทนแผง CSS
- [ ] `sound/heli_start.mp3` — เข้าโลกได้ยินซีเควนซ์สตาร์ทจริง (หน้าปัดขึ้น "กำลังสตาร์ทเครื่องยนต์...")
- [ ] `sound/heli_rotor.mp3` — เสียงใบพัดจริงแทนเสียงสังเคราะห์ระหว่างบิน
- [ ] `sound/heli_rotor_high.mp3` — ดึงขึ้นแรงๆ แล้วเสียงเปลี่ยนเป็นเร่งเครื่องเต็มกำลัง (crossfade)
- ℹ️ ทุกไฟล์ sw.js cache แบบ cache-first ให้อัตโนมัติ (โหลดครั้งเดียว)
