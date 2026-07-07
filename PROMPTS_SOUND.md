# PROMPTS_SOUND.md — เสียงโลกผีสิง 👻 (เจนจาก Suno)

> **ตอนนี้เกมมีเสียงหลอนสังเคราะห์ในตัวแล้ว (Web Audio — ปลอดลิขสิทธิ์ 100%) เล่นได้เลยไม่ต้องรอไฟล์**
> ไฟล์จาก Suno เป็น "ตัวอัปเกรด" — วางปุ๊บเกมสลับไปใช้ไฟล์จริงเองอัตโนมัติ (เหมือนระบบภาพ)
>
> **วิธีใช้:** สมัคร suno.com → Create → วาง prompt (โหมด Instrumental) → ดาวน์โหลด MP3
> → เปลี่ยนชื่อไฟล์ให้ตรงเป๊ะ → วางในโฟลเดอร์ `sound/` (สร้างโฟลเดอร์ใหม่ที่รากโปรเจกต์)
> → commit + push → จบ ไม่ต้องแก้โค้ด
>
> ⚠️ ติ๊ก **Instrumental** ทุกครั้ง (ห้ามมีเนื้อร้อง) · ความยาวเกิน 1 นาทีได้ เกมวนลูปให้เอง

---

## 1) `sound/haunt_ambient.mp3` — เสียงบรรยากาศพื้นหลัง (วนลูปตลอดที่อยู่ในโลกผี)

**Prompt (วางใน Style of Music):**
```
dark ambient horror soundscape, eerie howling wind, deep low drone, distant
creaking sounds, sparse ghostly whispers without words, no melody, no drums,
no vocals, slow and unsettling, haunted graveyard at night atmosphere,
seamless loop, cinematic sound design
```

## 2) `sound/haunt_chase.mp3` — เสียงตอนผีไล่ (วนลูประหว่างโดนล่า 20 วิ)

**Prompt:**
```
tense horror chase music, fast pounding heartbeat rhythm, urgent pulsing low
percussion, rising dissonant strings, accelerating tempo, panic and dread,
no vocals, no melody, relentless and driving, horror movie chase scene,
seamless loop
```

## 3) `sound/haunt_scare.mp3` — เสียง Jump scare (ดังครั้งเดียวตอนโดนผีจับ)

**Prompt:**
```
sudden horror jump scare stinger, loud dissonant orchestral hit, sharp
screeching violin stab, thunderous impact, instant burst of terror, very
short, no vocals, no melody, horror movie jump scare sound effect
```
> เคล็ดลับ: Suno มักเจนยาวเกิน — เลือกท่อนที่ "ตูม" สุดแล้วตัดเหลือ ~2-4 วินาทีด้วย
> แอปตัดเสียงอะไรก็ได้ (หรือใช้ทั้งไฟล์ก็ได้ เกมเล่นจากวินาทีแรก จุดสำคัญคือต้องเปิดมาดังทันที)

---

## เช็กลิสต์หลังวางไฟล์
- [ ] ไฟล์อยู่ที่ `sound/haunt_ambient.mp3` · `sound/haunt_chase.mp3` · `sound/haunt_scare.mp3` (ชื่อตรงเป๊ะ ตัวพิมพ์เล็กทั้งหมด)
- [ ] commit + push (sw.js cache ให้เองแบบ cache-first — ผู้เล่นโหลดครั้งเดียว)
- [ ] เข้าโลกผีสิง: ได้ยินเสียงบรรยากาศทันที · ผีไล่มีเสียงเร่งเร้า · โดนจับเสียงตูมดัง
- ℹ️ ลิขสิทธิ์: เพลงที่เจนจากบัญชี Suno แบบเสียเงินใช้เชิงพาณิชย์ได้ / บัญชีฟรีใช้แบบไม่ใช่การค้า+ให้เครดิต Suno — เกมนี้แจกฟรีบน GitHub Pages ใช้ได้ทั้งสองแบบ (ใส่เครดิตใน README ถ้าใช้บัญชีฟรี)
