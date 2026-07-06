# STATUS.md — สถานะปัจจุบัน (อ่านทุก session ก่อนเริ่ม)

## 🎯 สถานะล่าสุด (6 ก.ค. 2026)
- **งานล่าสุด:** ✅ ข้อ 0.5 ส่งของขวัญ (รอบยี่สิบแปด) + ✅ แผง emoji แชทจัด 7 หมวด + ✅ แยกปุ่มโรงงาน/ตลาดคนละแผง (รอบยี่สิบเก้า) — push แล้วทั้งหมด
- **item 0 (สังคมออนไลน์) เสร็จครบ 0.1–0.5** · เกม feature-complete ตาม backlog หลัก
- **งานถัดไปที่แนะนำ:** เลือกจาก `handoff/BACKLOG.md` (item 8 รายได้ออนไลน์ +0.01/วิ · item 2 ตลาดออนไลน์จริง · item 3 daily quest · item 4 การ์ดสรุปส่งครู) — ทำทีละข้อรอผู้ใช้ยืนยัน

## ⚠️ ค้างฝั่งผู้ใช้ (สำคัญ)
1. **publish Security Rules ใหม่** (เพิ่มโซน `/gifts` — ก้อนเต็มใน `handoff/RULES.md`) ไม่งั้นส่งของขวัญถูก reject · ก้อนนี้ครอบ av/ni ใน /leaderboard ด้วย
2. **ทดสอบจริงบน Pages 2 บัญชี:** ส่ง-รับของขวัญ + แชท + self-heal เพื่อน (ยังไม่เคยทดสอบ 2 บัญชีจริง)

## 📌 ประวัติรอบล่าสุด

**✅ รอบสามสิบ (6 ก.ค. · Opus): แก้ toast โดนบัง (ทดสอบ 2 บัญชีจริงบน Pages)** — ผู้ใช้เจอตอนส่งของขวัญ toast ข้างล่างอ่านไม่ออก เพราะแถบ PWA `.update-banner` (z-index 120, bottom-center) ทับ toast (เดิม z-index 95, bottom:30) · **แก้ `.toast` (style.css): z-index 95→9990 + bottom 30→76px + เพิ่มเงา** → toast ลอยเหนือ overlay/banner ทุกตัว ไม่โดนบังอีก · ทดสอบ preview: toast อยู่เหนือ update-banner 20px ไม่ overlap (version.json→.4)



**✅ รอบยี่สิบเก้า (6 ก.ค. · Opus): แยกปุ่ม "โรงงาน" กับ "ตลาด" เป็นคนละแผง (ผู้ใช้สั่ง) — push แล้ว (commit `8294428`)**
- เดิม `#collect-card` แผงเดียว 2 แท็บ → **2 rail buttons + 2 แผง:** `panel-factory` (🏭 `#factory-card` = งานผลิต+แคตตาล็อก) · `panel-market` (🏪 `#market-card` = ออเดอร์+คลัง+ตั้งราคาขาย+กล่องขายสำเร็จ)
- ui.js: `renderCollectCard`→`renderFactoryCard()`+`renderMarketCard()` · ถอด collectView/.mkt-tabs · renderDashboard เรียกทั้งคู่ 2 จุด · startProduce/cancelProduce→renderFactoryCard · index.html rail+panel-market · lobby.js PANEL_TITLES · version.json→.3
- ทดสอบ preview: factory มีแต่ผลิต · market มี orders+sold+คลัง · rail 8 ปุ่ม · produce/list dialog ทำงาน · ไม่มี console error
- **⚠️ ของขวัญที่รับมา (giftBox) ส่งต่อ/ขายต่อไม่ได้** — ยืนยัน: picker ดึงจาก state.collection เท่านั้น · giftBox ไม่เข้า assetValue/ตลาด/listings

**✅ รอบยี่สิบแปด (6 ก.ค. · Opus): ข้อ 0.5 ส่งของขวัญ + แผง emoji แชทเป็นหมวด — push แล้ว (commit `5cf5394`)**
- **คำถามค้าง 3 ข้อผู้ใช้เคาะแล้ว:** (1) ปฏิเสธ collectible→**คืนคลังผู้ส่ง** (2) ค้าง "ยังไม่มีผู้รับ" เกิน **7 วัน→หมดอายุคืนของ** (3) กด "ส่ง"→**escrow ตัด/หักทันที** · เพิ่มเอง: ของขวัญร้านถูกปฏิเสธ/หมดอายุ→**คืนเหรียญ**
- ไฟล์ใหม่ `js/data/gifts.js` (GIFTS 50) · DB `/gifts/<toUid>/<fromUid>/<giftKey>={k,id,fn,ts,st}` · online.js giftSend/Accept/Decline + giftInWatch(ผู้รับ) + giftOutWatchSync/giftOutRebuild/giftReclaim(ผู้ส่ง · GIFT_EXPIRE_MS 7 วัน) · ui.js renderGiftPanel/openGiftPicker/confirmSendGift/doSendGift/acceptGift/declineGift/showGiftReveal · state.giftBox+migration
- **➕ แชท:** emoji 44 ตัวเรียงพรืด → `CHAT_EMOJI_CATS` 7 หมวด 163 ตัว (แถบไอคอนหมวด คลิกสลับกริด) · CSS `.chat-emoji-cats/.chat-emoji-cat`
- ทดสอบ preview (mock login + fake reactive Firebase): giftSend เขียน node · doSendGift shop หักเหรียญ/collect ตัดของ · รับ→giftBox+DB accepted · ไม่รับ→declined · ผู้ส่งเห็น declined→คืน collectible/เหรียญ+ลบ node · หมดอายุ 7 วัน→คืน · XSS escape · picker/emoji ครบ · ไม่มี console error

**✅ รอบยี่สิบเจ็ด (6 ก.ค.): จอเต็ม fullscreen + ปุ่มติดตั้งแอพ + แจ้งเวอร์ชันใหม่ (commit `65612b5`,`8cf2031`) · ผู้ใช้ยืนยัน fullscreen ซ่อน status bar สำเร็จ**
- `manifest.json` display standalone→**fullscreen** (+display_override) · **⚠️ แอพที่ติดตั้งแล้วต้องถอน+ติดตั้งใหม่ 1 ครั้ง** · ปุ่ม 📲 ติดตั้งในเกม (`#btn-install`/`#btn-install-top`) · ระบบแจ้งเวอร์ชันใหม่ (`version.json` + `.update-banner`) · `.nojekyll`
- 🔑 **ทุกครั้ง push ให้บัมพ์ `v` ใน version.json** · Pages build หน่วง 2–5 นาที (เช็ก curl ก่อนทดสอบมือถือ)

**✅ รอบยี่สิบหก (6 ก.ค.): PWA ติดตั้งเป็นแอพ (commit `31d16d8`)** — manifest.json + sw.js (network-first โค้ด/cache-first รูป/ข้าม Firebase) + icons 4 ไฟล์ · ⬜ เหลือผู้ใช้ลอง "เพิ่มลงหน้าจอโฮม" บนมือถือจริง

**✅ รอบยี่สิบห้า (6 ก.ค.): การ์ดข้อมูลผู้เล่น คลิกชื่อ (commit `0daa179`)** — leaderboard +av(มูลค่าทรัพย์สิน)+ni(จำนวนชิ้น) · state.assetCount() · fetchPlayerStats() · ui.showPlayerCard()/.pl-click · **fallback ถ้า av/ni ถูก reject เขียน {n,g,coins,at} เดิม** (rules /gifts รวม av/ni แล้ว)

**✅ รอบยี่สิบสี่ (6 ก.ค.): self-heal เพื่อนครบสองฝ่าย (commit `9748206`)** — `Online.friendsHealed` + `friendsHeal()` เขียนยืนยันฝั่งตรงข้าม `friends/<f.uid>/<me>` (rules อนุญาต auth.uid===$friendUid) throttle ครั้งเดียว/uid/เซสชัน · ทดสอบ fake db 7 เคสผ่าน

> รอบ 1–23 อยู่ใน `handoff/HISTORY.md`
