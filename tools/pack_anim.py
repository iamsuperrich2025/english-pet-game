#!/usr/bin/env python
"""ตัดขอบว่าง + บีบแผ่นสไปรต์ที่อบมา → .webp พร้อมใช้บนเว็บ (เครื่องมือพัฒนา)

  python tools/pack_anim.py img/anim/test_caretaker.png --cols 6 --frames 24

สิ่งที่ทำ:
  1) หา "กรอบรวม" ของพิกเซลทึบจากทุกเฟรม (union bbox) — ใช้กรอบเดียวกันตัดทุกเฟรม
     ⚠️ ต้องเป็นกรอบรวม ไม่ใช่ตัดทีละเฟรมตามขอบของเฟรมนั้น ไม่งั้นตัวละครจะเด้งไปมาตอนเล่น
  2) ตัดขอบว่างทิ้ง → ตัวละครเต็มกรอบ ไฟล์เล็กลง
  3) เซฟเป็น WebP (มี alpha) + ไฟล์ .json บอกขนาดช่อง/จำนวนเฟรม ให้ CSS steps() เอาไปเล่น
"""
import argparse, json, os
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('sheet')
ap.add_argument('--cols', type=int, required=True)
ap.add_argument('--frames', type=int, required=True)
ap.add_argument('--fps', type=int, default=12)
ap.add_argument('--quality', type=int, default=82)
ap.add_argument('--margin', type=int, default=4)      # เผื่อขอบกันตัวละครชิดกรอบเกินไป
a = ap.parse_args()

im = Image.open(a.sheet).convert('RGBA')
cols = a.cols
rows = (a.frames + cols - 1) // cols
cw, ch = im.width // cols, im.height // rows

cells = [im.crop(((i % cols) * cw, (i // cols) * ch, (i % cols) * cw + cw, (i // cols) * ch + ch))
         for i in range(a.frames)]

# กรอบรวมของทุกเฟรม
boxes = [c.getchannel('A').getbbox() for c in cells]
boxes = [b for b in boxes if b]
if not boxes:
    raise SystemExit('ไม่พบพิกเซลทึบเลย — โมเดลไม่โผล่ในกรอบ?')
x0 = max(0, min(b[0] for b in boxes) - a.margin)
y0 = max(0, min(b[1] for b in boxes) - a.margin)
x1 = min(cw, max(b[2] for b in boxes) + a.margin)
y1 = min(ch, max(b[3] for b in boxes) + a.margin)
fw, fh = x1 - x0, y1 - y0

out = Image.new('RGBA', (fw * cols, fh * rows), (0, 0, 0, 0))
for i, c in enumerate(cells):
    out.paste(c.crop((x0, y0, x1, y1)), ((i % cols) * fw, (i // cols) * fh))

base = os.path.splitext(a.sheet)[0]
webp = base + '.webp'
out.save(webp, 'WEBP', quality=a.quality, method=6)

meta = {'file': os.path.basename(webp), 'frames': a.frames, 'cols': cols, 'rows': rows,
        'fw': fw, 'fh': fh, 'fps': a.fps}
open(base + '.json', 'w').write(json.dumps(meta))

print(f'ช่องเดิม {cw}x{ch} -> ตัดเหลือ {fw}x{fh}')
print(f'{os.path.getsize(a.sheet)//1024} KB (png) -> {os.path.getsize(webp)//1024} KB (webp)  {webp}')
print(json.dumps(meta))
