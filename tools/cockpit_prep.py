# -*- coding: utf-8 -*-
"""สร้างกรอบค็อกพิตเฮลิคอปเตอร์แบบ "มองทะลุกระจก" สำหรับ Vocab World (รอบ 344)

จาก img/new_heli_cockpit.png (ภาพทึบทั้งใบ) → img/heli_frame.png
  1) flood fill หาช่องกระจกแต่ละบาน แล้วทำให้ "โปร่งใส" (โลก 3D โผล่ผ่านตรงนั้น)
  2) ครอปให้ได้สัดส่วนใกล้จอเกม จะได้ไม่ต้องยืดมาก
  3) ลบขอบแหลมด้วย feather + ย่อ/บีบไฟล์ให้เบาพอขึ้นเว็บ

รันใหม่เมื่อเปลี่ยนภาพต้นฉบับ:  python tools/cockpit_prep.py
"""
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "img", "new_heli_cockpit.png")
OUT  = os.path.join(ROOT, "img", "heli_frame.png")

# ตัดเพดานบน + เบาะ/พื้นล่างทิ้ง เหลือ "กรอบ" ที่ใช้จริง = กระจก + แผงหน้าปัด
# สัดส่วนผลลัพธ์ ~2.05 ใกล้จอเกมจริง (มือถือแนวนอน 2.17 · เดสก์ท็อป 1.78) → ครอปน้อย ไม่ต้องยืด
CROP   = (0, 150, 1536, 900)
OUT_W  = 1100                   # กว้างพอสำหรับจอมือถือ/เดสก์ท็อป โดยไฟล์ยังเบา
TOL    = 46                     # ระยะสีที่ถือว่าเป็นกระจกบานเดียวกัน
GLASS_MAX_Y = 780               # กันรั่วลงไปโดนเบาะ/พื้น (กระจกอยู่เหนือเส้นนี้ทั้งหมด)
SEEDS  = [(330, 380), (1200, 380), (150, 420), (1380, 420), (600, 330), (940, 330)]

im = Image.open(SRC).convert("RGB")
a  = np.asarray(im).astype(np.int16)
H, W, _ = a.shape

# ---- 1) หาช่องกระจก ----
mask = np.zeros((H, W), bool)
for sx, sy in SEEDS:
    if mask[sy, sx]:
        continue
    base = a[sy, sx].copy()
    seen = np.zeros((H, W), bool)
    seen[sy, sx] = True
    q = deque([(sx, sy)])
    n = 0
    while q:
        x, y = q.popleft()
        if np.abs(a[y, x] - base).max() > TOL:
            continue
        mask[y, x] = True
        n += 1
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny <= GLASS_MAX_Y and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((nx, ny))
    print("  seed (%4d,%4d) -> %6d px" % (sx, sy, n))

# ปิดรูเล็กๆ ในกระจก (จุด noise) แล้วหดกลับ ไม่ให้เหลือขอบสีฟ้าค้าง
m = Image.fromarray((mask * 255).astype(np.uint8))
m = m.filter(ImageFilter.MaxFilter(5))     # ปิดรู
m = m.filter(ImageFilter.MinFilter(3))     # หดกลับ
alpha = 255 - np.asarray(m).astype(np.uint8)          # กระจก = โปร่ง (0)
alpha_img = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2))   # ขอบนุ่ม ไม่หยัก

out = im.copy()
out.putalpha(alpha_img)

# ---- 2) ครอป + ย่อ ----
out = out.crop(CROP)
out = out.resize((OUT_W, round(out.height * OUT_W / out.width)), Image.LANCZOS)

# ---- 3) บีบไฟล์: quantize แบบเก็บ alpha (ไม่ dither = ไฟล์เล็กกว่ามาก) ----
q = out.quantize(colors=200, method=Image.FASTOCTREE, dither=Image.NONE)
q.save(OUT, optimize=True)

px = np.asarray(out.getchannel("A"))
print("ผลลัพธ์ %s  %dx%d  โปร่ง %.1f%%  %d KB (จาก %d KB)"
      % (os.path.basename(OUT), out.width, out.height, (px < 128).mean() * 100,
         os.path.getsize(OUT) // 1024, os.path.getsize(SRC) // 1024))
