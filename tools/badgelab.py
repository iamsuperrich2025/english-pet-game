"""badgelab.py — ตัด img/badges/badge_sheet.png (ตาราง 6x6) เป็นไฟล์เหรียญแยกทีละอัน
ให้ img/badges/<key>.png (33 ไฟล์) แบบ crop เฉพาะเนื้อเหรียญ+ริบบิ้น ไม่รวมพื้นหลังกำมะหยี่ดำ

ใช้ครั้งเดียว: python tools/badgelab.py
- อ่าน badge_sheet.png อย่างเดียว ไม่แก้ไฟล์ต้นฉบับ (ผู้ใช้วางไว้เอง — ห้ามเขียนทับ)
- มุมขวาบนมีตรา "AI-Generated" ของเครื่องมือเจนภาพทับอยู่ในช่องแรกของแถวบน (thunder_3) →
  ปิดทับด้วยสีพื้นหลังก่อนตัด (แค่ในหน่วยความจำ ไม่แก้ไฟล์ต้นฉบับ) กันไม่ให้หลุดติดไปในภาพที่ตัดออกมา

รอบ 738 (ผู้ใช้สั่งแก้): เดิมใช้วิธี "หาเนื้อหาสว่าง" ในหน้าต่างขยาย ±SEARCH_PAD รอบเซล — พอเซลข้างเคียง
มีเนื้อเหรียญ/ริบบิ้นอยู่ใกล้ขอบเซล (< 14px) กรอบที่หาได้จะเผลอกวาดเอาขอบเหรียญข้างเคียงติดมาด้วย
(เห็นชัดตอนขยายภาพใหญ่ในการ์ดโปรไฟล์ — เหรียญข้างเคียงโผล่มาเป็นเสี้ยว/บางเหรียญถูกตัดจนแหว่ง)
→ เปลี่ยนเป็น "ตัดตามช่องกริดตรงๆ" (fixed grid) + หด INSET เข้าด้านในเล็กน้อยกันเส้นแบ่งเซล/
เศษขอบเหรียญข้างเคียงที่อาจล้ำมาไม่กี่พิกเซล — เรียบง่าย ทำนายผลได้ ไม่มีทางกวาดเนื้อเซลอื่นมาปนอีก
เพราะไม่มีการขยายหน้าต่างค้นหาข้ามเซลเลย (ตรวจแล้วภาพเจนมาค่อนข้างสม่ำเสมอ เหรียญ+ริบบิ้นแต่ละอัน
พอดีอยู่ในเซลตัวเองอยู่แล้ว ไม่ต้องพึ่งการค้นหาเนื้อหาแบบเดิม)
"""
import os
import sys
from PIL import Image
import numpy as np

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'img', 'badges', 'originals', 'badge_sheet.png')   # ต้นฉบับเต็ม — ไม่ขึ้น git (**/originals/)
OUT_DIR = os.path.join(ROOT, 'img', 'badges')
COLS, ROWS = 6, 6
INSET = 6             # หดเข้าจากขอบเซลนอมินอลทุกด้าน (กันเส้นแบ่งเซล + เศษขอบเหรียญข้างเคียงล้ำเข้ามา)
WATERMARK_BOX = (780, 0, 1024, 100)   # (x0,y0,x1,y1) รอบ 738: ขยายลงมาอีก (53→100) กันเศษแสง/คราบเบลอเดิมของตรา AI-Generated ที่ยังไม่หมดในเซล thunder_3

# ชื่อไฟล์ตามลำดับเซลล์ในตาราง (แถวบนลงล่าง ซ้ายไปขวา) — ตรงกับลำดับ BADGE_CATS ใน js/game.js
KEYS = [
    'pilot_1','pilot_2','pilot_3', 'thunder_1','thunder_2','thunder_3',
    'daredevil_1','daredevil_2','daredevil_3', 'diligent_1','diligent_2','diligent_3',
    'glass_1','glass_2','glass_3', 'mechaboss_1','mechaboss_2','mechaboss_3',
    'softland_1','softland_2','softland_3', 'airletter_1','airletter_2','airletter_3',
    'bff_1','bff_2','bff_3', 'typist_1','typist_2','typist_3',
    'typist_4','typist_5','crown',
]

def main():
    im = Image.open(SRC).convert('RGB')
    a = np.array(im)
    H, W, _ = a.shape
    cw, ch = W / COLS, H / ROWS

    # ปิดตรา AI-Generated ด้วยสีพื้นหลังจริง (เฉลี่ยจากมุมภาพที่รู้ว่าเป็นพื้นหลังล้วน)
    bg_fill = (3, 5, 13)
    x0, y0, x1, y1 = WATERMARK_BOX
    a[y0:y1, x0:x1] = bg_fill
    im = Image.fromarray(a)

    manifest = []
    idx = 0
    for r in range(ROWS):
        for c in range(COLS):
            if idx >= len(KEYS):
                break
            key = KEYS[idx]; idx += 1
            cx0, cy0 = c * cw, r * ch
            cx1, cy1 = cx0 + cw, cy0 + ch
            bx0, by0 = round(cx0) + INSET, round(cy0) + INSET
            bx1, by1 = round(cx1) - INSET, round(cy1) - INSET
            crop = im.crop((bx0, by0, bx1, by1))
            crop.save(os.path.join(OUT_DIR, key + '.png'))
            manifest.append((key, bx0, by0, bx1 - bx0, by1 - by0))

    print(f'ตัดสำเร็จ {len(manifest)}/{len(KEYS)} เหรียญ → {OUT_DIR}')
    for key, x, y, w, h in manifest:
        print(f'  {key:14s} x={x:4d} y={y:4d} w={w:4d} h={h:4d}')

if __name__ == '__main__':
    main()
