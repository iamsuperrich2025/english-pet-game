# TASKS.md — งานถัดไป + ประวัติรอบ (เปิดตอนเลือกงาน / ตามบั๊ก)

> 📂 ราก `C:\Users\rober\english-pet-game\` · เปิดไฟล์ใช้ path เต็ม · สถานะย่อ + กฎ + testkit อยู่ใน `HANDOFF.md` (อ่านนั่นก่อน)
>
> 🧭 **โครงไฟล์นี้แยก 3 ชั้นเสมอ** — กันไม่ให้ session หน้าหลงเดา:
> **① อาการ (ยืนยันแล้ว)** = เห็นจริง/reproduce ได้ · **② เดา (ยังไม่พิสูจน์)** = สมมติฐาน ห้ามลงมือแก้จนพิสูจน์ · **③ งานถัดไป**

## 🟢 ไม่มีบั๊กค้าง
บั๊ก "ของขวัญโดนบัง" ปิดจบรอบ 31 · **ผู้ใช้ทดสอบจริงยืนยันแล้ว 7 ก.ค.** (กล่องยืนยันเด้งหน้าแผง picker ถูกต้อง ไม่บวม)

## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)
เกม feature-complete แล้ว · **ขั้นตอน: เสนอ backlog ให้ผู้ใช้เลือก → รอเคาะ → ทำทีละข้อ** (อ่านสเปกเต็มใน `handoff/BACKLOG.md` เฉพาะข้อที่เลือก)
- 💰 **item 8** รายได้ออนไลน์ +0.01/วิ
- 🏪 **item 2** ตลาดออนไลน์จริง (ซื้อขายข้ามผู้เล่น)
- 🎯 **item 3** daily quest
- 📇 **item 4** การ์ดสรุปส่งครู

## ⏳ ค้างฝั่งผู้ใช้ (ทำเองบน Firebase console — ไม่เกี่ยว session ใหม่ นอกจากผู้ใช้ถาม)
- publish Security Rules โซน `/gifts` (ก้อนเต็ม `handoff/RULES.md`) · ทดสอบ flow ส่ง-รับของขวัญเต็ม 2 บัญชี (บัญชีเทสต์มี 0 เหรียญ ยังไม่ได้ส่งจริงครบวง)

## ⚠️ ค้างฝั่งผู้ใช้ (ต้องทำเองบน console/มือถือ)
1. **publish Security Rules ใหม่** (เพิ่มโซน `/gifts` — ก้อนเต็มใน `handoff/RULES.md`) ไม่งั้นส่งของขวัญถูก reject · ก้อนนี้ครอบ av/ni ใน /leaderboard ด้วย
2. **ทดสอบจริง 2 บัญชี:** ส่ง-รับของขวัญ + แชท + self-heal เพื่อน + กล่องยืนยันของขวัญไม่บวม (fix รอบ 31)

## 📌 ประวัติรอบล่าสุด (เก่ากว่านี้อยู่ `handoff/HISTORY.md`)

**✅ รอบ 32 (7 ก.ค. · Opus): คำเตือน toast ค้างจนผู้ใช้กดปิด ✕ (ไม่หายเอง) — commit `6979a14` · version→.3**
- ผู้ใช้: คำเตือน "เพิ่มเพื่อนไม่สำเร็จ" หายไวเกิน ขอให้ทุกคำเตือนค้างจนกดปิด
- แก้ที่ `js/util.js` `toast()` จุดเดียว: ถ้าข้อความเข้า `TOAST_WARN_RE` (ไม่สำเร็จ/ไม่พอ/ยังไม่/หมดเวลา/ป่วย/⚠️/💔/⏰ ฯลฯ) → ไม่ตั้ง setTimeout + เพิ่มปุ่ม ✕ กดปิดเอง · ข้อความแจ้งสำเร็จ (ซื้อสำเร็จ/ได้เหรียญ) ยังหายเอง 1.8 วิเหมือนเดิม (ไม่งั้นค้างเต็มจอ)
- หลายคำเตือนพร้อมกันวางซ้อนไม่ทับ (`restackToasts` ดันขึ้นทีละ +height, ปิดอันไหนก็ restack)
- CSS `.toast-warn`: แคปซูลสีแดง `pointer-events:auto` ตัดคำได้ + ปุ่ม `.toast-x`
- ✅ ทดสอบ preview: คำเตือนค้างเกิน 2.2 วิ · success หายเอง · กด ✕ ปิด+restack ถูกต้อง
- 📝 ยังไม่ให้ผู้ใช้ทดสอบจริงบน Pages (Pages build หน่วง 2–5 นาที)

**✅ รอบ 31 (7 ก.ค. · Opus): แก้บั๊ก "ของขวัญโดนบัง" 2 จุด + ปรับระบบ handoff ใหม่ให้ลีน**
- **บั๊ก 1 (รูปบวม):** กล่องยืนยันส่งของขวัญ (`confirmSendGift`→`askConfirm`→`.levelup-box`) reuse markup `.ld-pic` แต่ CSS คุมขนาดรูป scope เฉพาะ `.list-dialog` → รูป PNG 1024² render เต็มขนาด ดันกล่องบวมเป็นแท่งขาวสูงบังจอ · แก้ `css/style.css` เปลี่ยน scope 4 บรรทัด `.list-dialog`→`.levelup-box` · ยืนยัน preview รูป 410px→84px · commit `0d2793c` · version→.1
- **บั๊ก 2 (กล่องยืนยันอยู่หลัง picker):** `askConfirm`/`.levelup-overlay` z-index **70** < `.gift-pick-overlay` **85** → กล่องยืนยันเด้งหลังแผง picker ที่ยังเปิดอยู่ ต้องปิด picker ก่อนถึงเห็น · แก้ `.levelup-overlay` z-index **70→100** (เหนือ picker 85 / card 90 / chat 80) · commit `54b1a98` · version→2026-07-07.2
- **✅ ผู้ใช้ทดสอบจริงบน Pages ยืนยันทั้ง 2 จุดเรียบร้อย (7 ก.ค.)** — บั๊กของขวัญปิดสมบูรณ์
- **📚 บทเรียน:** บั๊ก UI จับได้ไวมากเพราะผู้ใช้ส่ง screenshot ทันที (กฎ "ภาพก่อนโค้ด") — ก่อนหน้าเดา z-index/toast จากโค้ดเสียหลายรอบ ทั้งที่ต้นตอเป็นรูปบวม+z-index กล่องยืนยัน เห็นได้จากภาพในวินาทีเดียว
- **handoff ใหม่:** ยุบ 3 ไฟล์เริ่มงาน (HANDOFF+STATUS+CONVENTIONS) → อ่าน `HANDOFF.md` ไฟล์เดียว · เพิ่มไฟล์นี้ (TASKS) + `NOTES.md` · ลบ STATUS.md/CONVENTIONS.md · เพิ่มกฎทอง "ภาพก่อนโค้ด" + preview gotchas + testkit

**✅ รอบ 29 (6 ก.ค.): แยกปุ่ม "โรงงาน"/"ตลาด" เป็นคนละแผง (commit `8294428`)**
- `panel-factory` (🏭 งานผลิต+แคตตาล็อก) · `panel-market` (🏪 ออเดอร์+คลัง+ตั้งราคา+กล่องขายสำเร็จ) · ui.js `renderFactoryCard()`+`renderMarketCard()`
- **⚠️ ของขวัญที่รับมา (giftBox) ส่งต่อ/ขายต่อไม่ได้** — picker ดึงจาก state.collection เท่านั้น

**✅ รอบ 28 (6 ก.ค.): ข้อ 0.5 ส่งของขวัญ + แผง emoji แชท 7 หมวด (commit `5cf5394`)**
- ปฏิเสธ collectible→คืนคลังผู้ส่ง · ค้าง >7 วัน→หมดอายุคืนของ · กด "ส่ง"→escrow ตัดทันที · ของร้านถูกปฏิเสธ/หมดอายุ→คืนเหรียญ
- ไฟล์ใหม่ `js/data/gifts.js` (GIFTS 50) · DB `/gifts/<toUid>/<fromUid>/<giftKey>={k,id,fn,ts,st}` · online.js giftSend/Accept/Decline/giftInWatch/giftReclaim · ui.js renderGiftPanel/openGiftPicker/confirmSendGift/doSendGift/showGiftReveal · state.giftBox+migration

**✅ รอบ 27 (6 ก.ค.): fullscreen + ปุ่มติดตั้งแอพ + แจ้งเวอร์ชันใหม่ (commit `65612b5`,`8cf2031`)**
- manifest display→fullscreen · ปุ่ม 📲 ติดตั้ง (`#btn-install`) · `.update-banner` (z120) เช็ก version.json · **แอพที่ติดตั้งแล้วต้องถอน+ติดตั้งใหม่ 1 ครั้ง**

**✅ รอบ 24–26 (6 ก.ค.):** self-heal เพื่อนสองฝ่าย (`9748206`) · การ์ดข้อมูลผู้เล่นคลิกชื่อ +av/ni (`0daa179`) · PWA ติดตั้งเป็นแอพ sw.js (`31d16d8`)

> รอบ 1–23 อยู่ `handoff/HISTORY.md`
