# TASK_VOCAB_SONNET.md — งานขยายคลังคำศัพท์ (สำหรับ Sonnet 5 ใน session ใหม่)

> **วิธีใช้ (สำหรับผู้ใช้):** เปิด session ใหม่ เลือกโมเดล **Sonnet** แล้วพิมพ์:
> `อ่านไฟล์ C:\Users\rober\english-pet-game\TASK_VOCAB_SONNET.md แล้วทำตามทั้งหมด`
>
> **สำหรับ Sonnet:** อ่าน `HANDOFF.md` ในโปรเจกต์นี้ก่อนเริ่มงานเสมอ (บริบท+ธรรมเนียมการทำงานทั้งหมดอยู่ที่นั่น)
> งานนี้คือ backlog "คำศัพท์" ข้อ 5 + 5.1 + 5.2 (อัพเดทผู้ใช้ 5725691326 · 5 ก.ค. 2026)
> ทำเสร็จรายงานผล → ผู้ใช้จะให้ Fable 5 / Opus 4.8 ตรวจใน session ถัดไป

## เป้าหมาย 3 ข้อ (ทำตามลำดับ)

### ข้อ 5 — แยกไฟล์คำศัพท์ให้ชัดเจน
แตก `js/data/vocab.js` (ปัจจุบัน 5 band × 8 หมวด × 10 คำ ในไฟล์เดียว) เป็น:

```
js/data/vocab/band1.js   → const VOCAB_BAND1 = {band:1, grades:['ป.1','ป.2'], label:'ประถมต้น (ป.1–ป.2)', cats:[...]};
js/data/vocab/band2.js   → const VOCAB_BAND2 = {...}   (ป.3–ป.4)
js/data/vocab/band3.js   → const VOCAB_BAND3 = {...}   (ป.5–ป.6)
js/data/vocab/band4.js   → const VOCAB_BAND4 = {...}   (ม.1–ม.3)
js/data/vocab/band5.js   → const VOCAB_BAND5 = {...}   (ม.4–ม.6)
js/data/vocab/index.js   → const VOCAB_BANDS = [VOCAB_BAND1,...VOCAB_BAND5];
                           + ALL_CATS + gradeBand() + catsForStudent() + vocabForStudent() + findCat()
                           (ยกฟังก์ชัน helper ท้าย vocab.js เดิมมาทั้งหมด ห้ามเปลี่ยน logic)
```

- แก้ `index.html`: แทน `<script src="js/data/vocab.js">` ด้วย 6 ไฟล์ใหม่ (band1→5 แล้วค่อย index.js — **ลำดับสำคัญ**) แล้วลบ `js/data/vocab.js` ทิ้ง
- ทุกไฟล์ขึ้นต้น `"use strict";` + คอมเมนต์หัวไฟล์แบบเดียวกับ data ไฟล์อื่น

### ข้อ 5.1 — เพิ่ม part of speech
รูปแบบคำเปลี่ยนจาก `['cat','แมว']` → **`['cat','แมว','n']`** (เพิ่ม pos เป็นตัวที่ 3 ทุกคำ)

ค่า pos ที่อนุญาต: `n, v, adj, adv, prep, pron, conj, det, interj, phr`

แก้ engine ให้แสดงผลเป็น `research (n.)` — **แก้ 4 จุดนี้ใน js/game.js เท่านั้น ห้ามแตะจุดอื่น:**

| จุด | เดิม | ใหม่ |
|---|---|---|
| `newRound()` (~บรรทัด 32) | `.map(([en,th])=>({en,th}))` | `.map(([en,th,pos])=>({en,th,pos}))` |
| การ์ดอังกฤษ (~บรรทัด 39) | `>${p.en}</div>` | `>${p.en}${p.pos ? ' ('+p.pos+'.)' : ''}</div>` — **คง `data-word="${p.en}"` เป็น en ล้วนเหมือนเดิม** (logic จับคู่เทียบด้วย en) |
| `startQuiz()` (~บรรทัด 216) | `.map(([en,th])=>{` | `.map(([en,th,pos])=>{` แล้วเก็บ `pos` ใน object คำถามด้วย |
| โจทย์ข้อสอบ (~บรรทัด 231) | `textContent = q.en` | `textContent = q.en + (q.pos ? \` (${q.pos}.)\` : '')` |

ช้อยส์ข้อสอบเป็นภาษาไทย (`w[1]`) — ไม่ต้องเติม pos ในช้อยส์

### ข้อ 5.2 — ขยายคลังคำศัพท์ให้มากที่สุด ตรงระดับชั้นที่สุด
- **หมวดเดิมทุกหมวด: ขยายเป็นอย่างน้อย 40 คำ/หมวด** (จาก 10 คำ)
- **เพิ่มหมวดใหม่ได้ 2–4 หมวด/band** (id ใหม่ใช้ prefix `b1_`,`b2_`,... ตามธรรมเนียม · name ภาษาไทย + emoji + reward:100)
- เป้ารวมทั้งเกม **≥ 2,000 คำ**
- ระดับความยากอิงหลักสูตร สพฐ. + CEFR: band1 ≈ Pre-A1 · band2 ≈ A1 · band3 ≈ A1–A2 · band4 ≈ A2–B1 · band5 ≈ B1–B2 (เน้นคำ academic เตรียมสอบเข้ามหาวิทยาลัย เช่น research, analyze, significant)
- คำแปลไทยต้องเป็นคำแปลที่เด็กช่วงชั้นนั้นเข้าใจ สั้น กระชับ

## ⛔ กติกาเหล็ก (ห้ามพลาด — เซฟผู้เล่นจริงเสียหายได้)

1. **ห้ามเปลี่ยน/ลบ id หมวดเดิมทั้ง 40 หมวด** — ประวัติสอบ (`state.quizLog`) และหมวดที่ผ่านแล้ว (`state.quizPassed`) อ้างด้วย id
2. **en ห้ามซ้ำกันภายใน band เดียวกัน** (ข้าม band ซ้ำได้) — เกมจับคู่รวมทุกหมวดใน band เป็น pool เดียว (`vocabForStudent()`) ถ้า en ซ้ำ การ์ดจับคู่จะเช็คผิดตัว
3. **th ห้ามซ้ำกันภายในหมวดเดียวกัน** — ช้อยส์ข้อสอบกรองตัวลวงด้วย th ถ้าซ้ำจะได้ช้อยส์เหมือนกัน 2 อัน
4. ห้ามแตะไฟล์อื่นนอกจาก: `js/data/vocab/*` (ใหม่) · `index.html` (แค่ script tags) · `js/game.js` (แค่ 4 จุดข้างบน) · `HANDOFF.md` (อัปเดตตอนจบ)
5. เครื่องนี้ไม่มี Node มีแต่ Python 3.12 · Windows ระวังนามสกุลไฟล์ซ้ำซ้อน

## 🧪 การทดสอบ (บังคับก่อน commit)

⚠️ **เกมบังคับ Google login แล้ว (ข้อ 0.1)** — ใน preview login จริงไม่ได้ ให้ mock ด้วย eval หลังโหลดหน้า:

```js
window.authFetchCloud  = ()=>Promise.resolve(null);
window.authWriteCloud  = ()=>Promise.resolve();
window.authDeleteCloud = ()=>Promise.resolve();
window.onlineStart     = ()=>{};
authOnLogin({uid:'vocab_test', email:'test@test.com'});
// → เข้าหน้าลงทะเบียน กรอกชื่อ+เลือกชั้นที่จะทดสอบได้เลย
```

ใช้ preview server `english-pet-game` (พอร์ต 8642) · เบราว์เซอร์ cache JS เหนียว ให้ `Promise.all([...document.querySelectorAll('script[src]')].map(s=>fetch(s.src,{cache:'reload'})))` แล้วค่อย reload

รายการทดสอบขั้นต่ำ:
1. โหลดเกม → ไม่มี console error/warning
2. เช็คคำซ้ำอัตโนมัติด้วย eval: วน `VOCAB_BANDS` หา en ซ้ำใน band + th ซ้ำในหมวด + คำที่ไม่มี pos / pos นอกรายการอนุญาต → ต้องเป็น 0 ทั้งหมด
3. นับจำนวนคำทุก band ทุกหมวด ≥ 40 และ id หมวดเดิมครบ 40 id
4. mock login + ลงทะเบียน ป.1 → เล่นจับคู่: การ์ดโชว์ `cat (n.)` + จับคู่ถูกต้องทำงาน (คลิกผ่าน eval) → เปลี่ยนชั้นทดสอบ ม.6 ซ้ำ (band 5)
5. สอบ 10 ข้อ: โจทย์โชว์ pos · ช้อยส์ไทย 4 ตัวไม่ซ้ำกัน · ตอบครบจบได้
6. เซฟเก่า compat: สร้างเซฟ mock ที่มี `quizPassed:['animals']` → หมวดสัตว์ (ป.1-2) ยังขึ้น "✅ ผ่านแล้ว"
7. จบงาน: `localStorage.removeItem('petVocabAdventure_v1')` + reload กลับหน้า login

## 📦 ตอนจบงาน
1. ทดสอบผ่านครบ → `git add` + `commit` + `push` (ธรรมเนียมโปรเจกต์ — Pages อัปเดตเอง)
2. อัปเดต `HANDOFF.md`: บรรทัดสถานะบนสุด + เพิ่มรอบทดสอบใหม่ + โครงสร้างไฟล์ (vocab.js → vocab/)
3. **รายงานผลเป็นตาราง**: band × หมวด × จำนวนคำ (เดิม→ใหม่) + ตารางผลทดสอบทุกข้อ + จำนวนคำรวมทั้งเกม
