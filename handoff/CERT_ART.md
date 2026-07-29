# 🎖️ CERT_ART.md — ภาพประกอบใบประกาศ (รอบ 712)

> ระบบวาดใบประกาศเองด้วย SVG (`js/cert.js`) **ไม่มีไฟล์ภาพก็สวยใช้ได้เลย**
> ใส่ไฟล์ 2 ตัวนี้เมื่อไหร่ = ทับชั้นเวกเตอร์ให้หรูขึ้นทันที ไม่ต้องแก้โค้ด

| ไฟล์ | ขนาด | หน้าที่ |
|------|------|---------|
| `img/cert/paper.png` | **700×1000 px แนวตั้ง** (7:10) | กระดาษ + กรอบทองทั้งใบ · **กลางใบต้องว่างเปล่า** ระบบพิมพ์ข้อความทับเอง |
| `img/cert/logo.png`  | **512×512 px พื้นโปร่ง** | โลโก้ Vocab World วางกลางหัวใบ (พื้นที่จริงบนใบ 180×180 ที่ y=68–248) |

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

## 2) prompt โลโก้ (logo.png)
```
Emblem logo for "Vocab World", an English vocabulary learning game for children.
A circular badge: a globe drawn with clean latitude/longitude lines resting on an open book,
enclosed by a polished gold rope-and-laurel ring, one small five-pointed star at the top.
Colors: deep navy blue (#123a63) and royal gold (#c8a13c) with soft highlights.
Modern flat vector style with subtle gradients, crisp edges, perfectly centered and
symmetrical, transparent background, square 512x512, no text, still readable at 32 px,
app-icon quality, premium and friendly - suitable for a school award certificate.
Negative: text, letters, words, photo, realistic 3D render, drop shadow, busy details,
gradient background, mascot character, cartoon face.
```
> อยากได้ตัวมีอักษร: เติม `with the letters "VW" in an elegant serif monogram at the center of the globe`

## หลังได้ไฟล์
1. วางที่ `img/cert/paper.png` และ `img/cert/logo.png` (สร้างโฟลเดอร์ `img/cert/` ก่อน)
2. เปิดเกม → สอบผ่าน 1 ครั้ง → ดูใบประกาศในฟีด/โปรไฟล์ (แตะดูใบใหญ่)
3. ⚠️ `img/` ไม่อยู่ใน git (ดู NOTES.md) — ต้อง deploy Firebase ถึงจะขึ้นเว็บจริง
