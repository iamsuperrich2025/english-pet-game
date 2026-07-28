"""badgelab.py — ตัด img/badges/badge_sheet.png (ตาราง 6x6) เป็นไฟล์เหรียญแยกทีละอัน
ให้ img/badges/<key>.png (33 ไฟล์) แบบ crop เฉพาะเนื้อเหรียญ+ริบบิ้น ไม่รวมพื้นหลังกำมะหยี่ดำ

ใช้ครั้งเดียว: python tools/badgelab.py
- อ่าน badge_sheet.png อย่างเดียว ไม่แก้ไฟล์ต้นฉบับ (ผู้ใช้วางไว้เอง — ห้ามเขียนทับ)
- เพดานพื้นหลัง = จุดที่แชนแนลสีสูงสุด < BG_MAX (กำมะหยี่ดำเข้มมาก แยกจากเหรียญโลหะ/ริบบิ้นได้ชัด)
- มุมขวาบนมีตรา "AI-Generated" ของเครื่องมือเจนภาพทับอยู่ในช่องแรกของแถวบน (thunder_3) →
  ปิดทับด้วยสีพื้นหลังก่อนตัด (แค่ในหน่วยความจำ ไม่แก้ไฟล์ต้นฉบับ) กันไม่ให้หลุดติดไปในภาพที่ตัดออกมา
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
BG_MAX = 32          # เพดานความสว่าง = พื้นหลัง (วัดจริง: มุมภาพ <25 ทุกแชนแนล)
PAD = 6              # ขอบเผื่อรอบกรอบที่ตัดจริง (กันเนื้อโลหะโดนตัดชิดเกิน)
SEARCH_PAD = 14      # ขยายหน้าต่างค้นหานอกช่องปกติ (กันริบบิ้น/เหรียญเบี้ยวไม่พอดีเซล)
WATERMARK_BOX = (795, 0, 1024, 53)   # (x0,y0,x1,y1) พิกัดจริงของตรา AI-Generated ที่วัดได้

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
    bg_fill = np.array([3, 5, 13], dtype=np.uint8)
    x0, y0, x1, y1 = WATERMARK_BOX
    a[y0:y1, x0:x1] = bg_fill

    bright = a.max(axis=2)   # ใช้ค่าแชนแนลสูงสุดต่อพิกเซลตัดสินว่าเป็นพื้นหลังไหม

    manifest = []
    idx = 0
    for r in range(ROWS):
        for c in range(COLS):
            if idx >= len(KEYS):
                break
            key = KEYS[idx]; idx += 1
            cx0, cy0 = c * cw, r * ch
            cx1, cy1 = cx0 + cw, cy0 + ch
            sx0 = max(0, int(cx0 - SEARCH_PAD)); sy0 = max(0, int(cy0 - SEARCH_PAD))
            sx1 = min(W, int(cx1 + SEARCH_PAD)); sy1 = min(H, int(cy1 + SEARCH_PAD))
            win = bright[sy0:sy1, sx0:sx1]
            mask = win > BG_MAX
            ys, xs = np.where(mask)
            if len(xs) == 0:
                print(f'⚠️ {key}: ไม่เจอเนื้อหา (ข้าม)')
                continue
            bx0 = max(sx0, sx0 + xs.min() - PAD); by0 = max(sy0, sy0 + ys.min() - PAD)
            bx1 = min(sx1, sx0 + xs.max() + PAD); by1 = min(sy1, sy0 + ys.max() + PAD)
            crop = im.crop((bx0, by0, bx1, by1))
            crop.save(os.path.join(OUT_DIR, key + '.png'))
            manifest.append((key, bx0, by0, bx1 - bx0, by1 - by0))

    print(f'ตัดสำเร็จ {len(manifest)}/{len(KEYS)} เหรียญ → {OUT_DIR}')
    for key, x, y, w, h in manifest:
        print(f'  {key:14s} x={x:4d} y={y:4d} w={w:4d} h={h:4d}')

if __name__ == '__main__':
    main()
