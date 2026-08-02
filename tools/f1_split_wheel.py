# -*- coding: utf-8 -*-
"""แยกชั้น "พวงมาลัย" ออกจากภาพห้องคนขับ img/f1/cockpit.webp (รอบ 913)
  ผลลัพธ์ 2 ไฟล์ (ขนาดเท่าต้นฉบับ 1536x1024 → วางทับกันได้พอดีด้วย CSS ชุดเดียวกัน)
    img/f1/cockpit_body.webp  = ค็อกพิทไม่มีพวงมาลัย (ตรงพวงมาลัยถมด้วยเงามืดเบลอ กันเห็นทะลุตอนหมุน)
    img/f1/wheel.webp         = เฉพาะพวงมาลัย พื้นหลังโปร่งใส
  จุดหมุน (แกนพวงมาลัย) = HUB  → เกมใช้เป็น transform-origin
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter

ROOT = r'C:\Users\rober\english-pet-game'
SRC  = os.path.join(ROOT, 'img', 'f1', 'cockpit.webp')

# --- รูปทรงพวงมาลัย (พิกัดบนภาพต้นฉบับ 1536x1024) ---
POLY = [(575,499),(975,499),(996,532),(1001,600),(986,692),(950,750),(900,764),
        (660,764),(600,746),(560,692),(548,600),(553,532)]
FEATHER = 5          # ขอบฟุ้ง (px) กันขอบคม
HUB = (759, 655)     # แกนหมุน (ปุ่มกลมกลางพวงมาลัย)

im = Image.open(SRC).convert('RGBA')
W, H = im.size

mask = Image.new('L', (W, H), 0)
ImageDraw.Draw(mask).polygon(POLY, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(FEATHER))

# ① ชั้นพวงมาลัย = สีเดิม × mask (alpha เดิมของค็อกพิทคูณด้วย เผื่อโซนโปร่ง)
wheel = im.copy()
a = wheel.getchannel('A').point(lambda v: v)
import numpy as np
na = np.asarray(a).astype(np.uint16) * np.asarray(mask).astype(np.uint16) // 255
wheel.putalpha(Image.fromarray(na.astype('uint8')))

# ② ตัวค็อกพิท = ภาพเดิม แต่โซนพวงมาลัยแทนที่ด้วย "เงามืดเบลอ"
shadow = im.filter(ImageFilter.GaussianBlur(26))
sr, sg, sb, sa = shadow.split()
dark = lambda c: c.point(lambda v: int(v * 0.42))
shadow = Image.merge('RGBA', (dark(sr), dark(sg), dark(sb), sa))
body = im.copy()
body.paste(shadow, (0, 0), mask)

os.makedirs(os.path.join(ROOT, 'img', 'f1'), exist_ok=True)
body.save(os.path.join(ROOT, 'img', 'f1', 'cockpit_body.webp'), quality=92, method=6)
wheel.save(os.path.join(ROOT, 'img', 'f1', 'wheel.webp'), quality=88, method=6)
print('hub pct = %.4f %.4f' % (HUB[0] / W, HUB[1] / H))
for f in ('cockpit_body.webp', 'wheel.webp'):
    p = os.path.join(ROOT, 'img', 'f1', f)
    print(f, os.path.getsize(p) // 1024, 'KB', Image.open(p).size)
