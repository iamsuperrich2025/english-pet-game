# -*- coding: utf-8 -*-
"""แยกชั้น "แถบไฟ LED รอบเครื่อง" ออกจากภาพพวงมาลัย img/f1/wheel.webp (รอบ 914)
   (ทำตามแบบ tools/f1_split_wheel.py — สคริปต์เดียวจบ รันซ้ำได้ ไม่แก้ไฟล์ต้นฉบับ)

   ผลลัพธ์:
     img/f1/wheel_body.webp = พวงมาลัยที่ "ไฟดับหมด" (โซนไฟถูกหรี่ให้เหมือน LED ยังไม่ติด)
                              ขนาดเท่า wheel.webp เป๊ะ → ใช้ CSS/สูตรวางตัวชุดเดียวกันได้เลย
     พิมพ์อาร์เรย์ตำแหน่งดวงไฟเป็น % ของภาพ → เอาไปวางใน F1_LEDS ของ js/f1_3d.js
                              (เกมวาดดวงไฟเป็น <i> ทับตรงตำแหน่งเดิมเป๊ะ แล้วเปลี่ยนสีตามรอบเครื่อง)

   ⚠️ เปลี่ยนภาพพวงมาลัยใหม่เมื่อไหร่ ต้องรันสคริปต์นี้ใหม่ แล้วเอาอาร์เรย์ที่พิมพ์ออกมาไปใส่ F1_LEDS ด้วย
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

try: sys.stdout.reconfigure(encoding='utf-8')   # คอนโซล Windows เป็น cp1252 — พิมพ์ไทยไม่ออก
except Exception: pass

ROOT = r'C:\Users\rober\english-pet-game'
SRC  = os.path.join(ROOT, 'img', 'f1', 'wheel.webp')

# --- โซนที่แถบไฟอยู่ (พิกัดบนภาพต้นฉบับ 1536x1024) ---
BAND_Y  = (494, 522)      # ช่วง y ที่ยอมรับว่าเป็นแถบไฟ (กันไปโดนปุ่มหมุนสีเหลืองด้านล่าง)
BAND_X  = (630, 910)
MIN_W   = 3               # ดวงที่แคบกว่านี้ = สัญญาณรบกวน ทิ้ง
PAD     = 1               # ขยายกล่องดวงไฟออกด้านละ (px) — ให้ดวงที่เกมวาดคลุมของเดิมมิด
OFF_MUL = 0.20            # ความสว่างที่เหลือของ "ไฟดับ" (0 = ดำสนิท)
FEATHER = 1.2             # ขอบฟุ้งของ mask (px) กันขอบคม

im = Image.open(SRC).convert('RGBA')
W, H = im.size
a = np.asarray(im).astype(np.int16)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
# ไฟ LED ในภาพ = เหลือง/ส้มสว่าง (แดงสูง ฟ้าต่ำ)
led = (al > 100) & (r > 110) & ((r - b) > 50) & (g > 55)

sub = led[BAND_Y[0]:BAND_Y[1], BAND_X[0]:BAND_X[1]]
col = sub.sum(axis=0)

# ไล่เป็นช่วงต่อเนื่องตามแนวนอน = 1 ช่วง 1 ดวง
boxes, s = [], None
for i, c in enumerate(list(col) + [0]):
    on = c >= 2
    if on and s is None:
        s = i
    elif not on and s is not None:
        if i - s >= MIN_W:
            x0, x1 = s + BAND_X[0], i + BAND_X[0]
            seg = led[BAND_Y[0]:BAND_Y[1], x0:x1]
            ys = np.nonzero(seg.any(axis=1))[0]
            boxes.append((x0, BAND_Y[0] + int(ys.min()), x1, BAND_Y[0] + int(ys.max()) + 1))
        s = None

if not boxes:
    raise SystemExit('หาแถบไฟไม่เจอ — ตรวจ BAND_X/BAND_Y กับภาพต้นฉบับก่อน')

# ① ภาพ "ไฟดับ": หรี่เฉพาะโซนดวงไฟ (mask จากกล่องที่เจอ + ฟุ้งขอบ)
mask = Image.new('L', (W, H), 0)
dr = ImageDraw.Draw(mask)
for (x0, y0, x1, y1) in boxes:
    dr.rectangle([x0 - PAD, y0 - PAD, x1 + PAD - 1, y1 + PAD - 1], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(FEATHER))

dark = im.filter(ImageFilter.GaussianBlur(1.1))
dr_, dg_, db_, da_ = dark.split()
dim = lambda c: c.point(lambda v: int(v * OFF_MUL))
dark = Image.merge('RGBA', (dim(dr_), dim(dg_), dim(db_), da_))
body = im.copy()
body.paste(dark, (0, 0), mask)
out = os.path.join(ROOT, 'img', 'f1', 'wheel_body.webp')
body.save(out, quality=88, method=6)

# ② อาร์เรย์ตำแหน่งดวงไฟเป็น % ของภาพ (พร้อมวางใน js/f1_3d.js)
print('LED %d ดวง · %s %d KB %s' % (len(boxes), os.path.basename(out),
                                     os.path.getsize(out) // 1024, Image.open(out).size))
print('const F1_LEDS = [   // [left%, top%, width%, height%] — เจนจาก tools/f1_split_leds.py')
line = '  '
for k, (x0, y0, x1, y1) in enumerate(boxes):
    x0 -= PAD; y0 -= PAD; x1 += PAD; y1 += PAD
    cell = '[%.3f,%.3f,%.3f,%.3f],' % (x0 / W * 100, y0 / H * 100, (x1 - x0) / W * 100, (y1 - y0) / H * 100)
    if len(line) + len(cell) > 108:
        print(line); line = '  '
    line += cell
print(line.rstrip(',') if line.strip() else '', '\n];')
