# 🎖️ CERT_ART.md — ภาพประกอบใบประกาศ (รอบ 712)

> ระบบวาดใบประกาศเองด้วย SVG (`js/cert.js`) **ไม่มีไฟล์ภาพก็สวยใช้ได้เลย**
> ใส่ไฟล์ 2 ตัวนี้เมื่อไหร่ = ทับชั้นเวกเตอร์ให้หรูขึ้นทันที ไม่ต้องแก้โค้ด

| ไฟล์ | ขนาด | หน้าที่ |
|------|------|---------|
| `img/cert/paper.png` | **700×1000 px แนวตั้ง** (7:10) | กระดาษ + กรอบทองทั้งใบ · **กลางใบต้องว่างเปล่า** ระบบพิมพ์ข้อความทับเอง |
| `img/cert/logo.png`  | **512×512 px พื้นโปร่ง** | โลโก้ Vocab World **ทรงโล่** วางกลางหัวใบ (พื้นที่จริงบนใบ 176×196 ที่ y=58–254) |

⚠️ **โซนห้ามมีลาย** (พิกัดบนผืน 700×1000): แถบข้อความ y≈280–960 · หัวโลโก้ y≈60–250
กรอบ/ลายวางได้เฉพาะขอบนอก ~55px และมุมทั้ง 4 · ห้ามมีตัวหนังสือใด ๆ ในภาพ

## 1) prompt กระดาษ + กรอบ (paper.png)
```
Blank luxury certificate background, portrait orientation, aspect ratio 7:10 (700x1000 px).
An ornate double gold border frame: a thick polished gold outer band with fine engraved
filigree, a thin gold inner rule, and delicate scrollwork ornaments in all four corners.
Paper is warm ivory cream parchment with a very subtle guilloche watermark texture,
soft vignette, classic diploma / academic award style, perfectly symmetrical.
The entire center of the sheet is COMPLETELY EMPTY clean paper - no text, no letters,
no numbers, no seal, no ribbon, no crest in the middle. Flat top-down scan, even lighting,
sharp print quality, 300 dpi look.
Negative: text, letters, words, typography, signature, logo, seal in center, ribbon across
center, people, portrait, dark background, heavy shadows, clutter, watermark words.
```

## 2) prompt โลโก้ **ทรงโล่** (logo.png) — ผู้ใช้สั่งเปลี่ยนจากวงกลม รอบ 713
```
Heraldic shield emblem logo for "Vocab World", an English vocabulary learning game.
A classic heater shield (pointed at the bottom, rounded top shoulders) - taller than it is
wide, standing upright and dignified. Thick polished gold beveled shield border with a fine
inner rule; the shield field is deep navy blue (#123a63). Inside the field, centered from top
to bottom: a small five-pointed gold star, a globe drawn with clean latitude/longitude lines,
and an open book at the base. Royal gold (#c8a13c) and deep navy palette with soft metallic
highlights on the gold. Crest / academic coat-of-arms feeling: elegant, prestigious, crisp.
Modern flat vector style with subtle gradients, perfectly symmetrical, centered, transparent
background, square 512x512 canvas with the shield fitted inside, no text, still readable at
32 px, app-icon quality - suitable for a school award certificate.
Negative: circle badge, round frame, text, letters, words, photo, realistic 3D render,
drop shadow, busy details, gradient background, mascot character, cartoon face, sword, wings.
```
> อยากได้ตัวมีอักษร: เติม `with the letters "VW" in an elegant gold serif monogram on a small banner across the bottom of the shield`

## หลังได้ไฟล์
1. วางที่ `img/cert/paper.png` และ `img/cert/logo.png` (สร้างโฟลเดอร์ `img/cert/` ก่อน)
2. เปิดเกม → สอบผ่าน 1 ครั้ง → ดูใบประกาศในฟีด/โปรไฟล์ (แตะดูใบใหญ่)
3. ⚠️ `img/` ไม่อยู่ใน git (ดู NOTES.md) — ต้อง deploy Firebase ถึงจะขึ้นเว็บจริง
