# PROMPTS_SPELL_SOUND.md — เสียงเกมวงแหวนสะกดคำ Spin-to-Spell 🌀 (5 ไฟล์)

> **ตอนนี้เกมมีเสียงสังเคราะห์ในตัวแล้ว (Web Audio — ปลอดลิขสิทธิ์ 100%) เล่นได้เลยไม่ต้องรอไฟล์**
> ไฟล์เสียงจริงเป็น "ตัวอัปเกรด" — วางปุ๊บเกมสลับไปใช้ไฟล์จริงเองอัตโนมัติ (ระบบเดียวกับเสียงโลกผี)
>
> **เครื่องมือแนะนำ:** เสียงสั้น (ข้อ 1–3, 5) ใช้ **ElevenLabs Sound Effects** (elevenlabs.io → Sound Effects
> → วาง prompt → ตั้ง Duration ตามระบุ) เหมาะกว่า Suno เพราะเป็น SFX สั้นๆ ไม่ใช่เพลง
> ส่วนแฟนแฟร์ (ข้อ 4) ใช้ Suno (ติ๊ก **Instrumental**) หรือ ElevenLabs ก็ได้
>
> **วิธีวาง:** ดาวน์โหลด → แปลง/ตั้งชื่อเป็น `.mp3` ให้ตรงเป๊ะ → วางในโฟลเดอร์ใหม่ `sound/spell/`
> (สร้างที่รากโปรเจกต์) → บอก Claude ให้ commit — ไม่ต้องแก้โค้ด

---

## 1) `sound/spell/tick.mp3` — เสียงติ๊กตอนตัวอักษรผ่านช่อง (ดังถี่ตามความเร็วหมุน)
**Duration: 0.3 วินาที (สั้นที่สุดที่ตั้งได้)**
```
single short mechanical ratchet click, game show prize wheel tick, wooden
peg clicking past a pin, bright crisp snappy transient, no reverb tail,
no music, one single click sound only, toy-like and playful
```

## 2) `sound/spell/collect.mp3` — เก็บตัวอักษรถูก ✅
**Duration: 0.5 วินาที**
```
short cheerful pickup chime, bright sparkly two-note ding going upward,
glassy bell tone, video game item collect sound, happy and rewarding,
clean and simple, no music, kid-friendly casual game sound effect
```

## 3) `sound/spell/wrong.mp3` — แตะตัวผิด ❌ (นุ่มๆ ไม่ดุ เด็กเล็กเล่น)
**Duration: 0.5 วินาที**
```
soft gentle error blip, cartoon rubber boing going downward, muted low
bounce, friendly "try again" feeling, not harsh, not scary, no buzzer,
playful kids game wrong-answer sound, short and soft
```

## 4) `sound/spell/win.mp3` — สะกดครบคำ 🎉 (แฟนแฟร์สั้น)
**Duration: 2 วินาที (Suno: ตัดใช้ 2 วิแรกได้ เกมไม่ตัดให้)**
```
short triumphant celebration fanfare, bright playful orchestra hit with
ascending xylophone and glockenspiel run, confetti party feeling, big
happy finish chord with light cymbal, kids game level complete jingle,
no vocals, fast and joyful
```

## 5) `sound/spell/start.mp3` — เปิดวงแหวน/เริ่มเกม 🌀
**Duration: 1 วินาที**
```
magical shimmering whoosh swirl going upward, sparkling ring of chimes
appearing, fantasy summon effect, airy and bright, playful magic circle
activation, no music, kids game UI sound effect
```

---
### โน้ตเทคนิค (สำหรับ Claude รอบหน้า)
- โค้ดอยู่ `js/lobby3d.js` ฟังก์ชัน `spellSfx(name)` — probe ไฟล์ครั้งแรกที่เล่น ไม่มี=จำเป็น `'miss'` แล้ว fallback `spellSynth` (beep สังเคราะห์) ตลอด session
- เสียง tick ถูก throttle 50ms ใน `spellTick` (ปัดแรงสุดไม่รัวเกิน 20 ครั้ง/วิ)
- เพิ่ม/เปลี่ยนชื่อไฟล์ = แก้ทั้ง 2 จุด: `spellSfx` call sites + prompt ไฟล์นี้
