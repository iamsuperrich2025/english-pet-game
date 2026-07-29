#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
happylab.py — ประกอบภาพ `img/<pet>_<stage>_happy.png` ใหม่ให้ "แขนขาเนียน" (รอบ 758)

ปัญหาเดิม: ภาพ _happy ที่ AI เจนมาเป็นท่ากระโดดชูแขน แต่ **แขน/ขาวาดไม่จบ** —
  ขาหลังที่ยกขึ้นเป็นก้อนเบลอไม่มีข้อต่อ · มีอุ้งเท้าลอยกลางพุงอ่านไม่ออกว่าเป็นขาไหน ·
  ขาที่ยืนเป็นแท่งไม่มีนิ้ว (เป็นเหมือนกันทั้ง cat/dog ทั้ง baby/adult)

วิธีแก้ (ไม่ต้องเจนภาพใหม่ ไม่เพี้ยนสไตล์ เพราะใช้ชิ้นส่วนจาก "ภาพชุดเดียวกัน"):
  ลำตัว+ขา  ← `<pet>_<stage>_normal.png`  (ท่ายืน วาดครบทุกขา เนียนอยู่แล้ว)
  หน้ายิ้ม   ← `<pet>_<stage>_happy.png`   ตัดเฉพาะ "วงหน้า" (ตาหลิ่ว+ยิ้มกว้าง+แก้มแดง)
  ประกาย/หัวใจรอบตัว ← จากภาพ _happy เดิม (แยกอัตโนมัติ = ทุกก้อนที่ไม่ใช่ตัวสัตว์)

🔑 บทเรียนตอนทำ (อย่าถอยกลับไปทำแบบเดิม):
  - เคยลอง "ยกทั้งหัว" มาแปะ → ขนคาง/แก้มของท่ากระโดดกางกว้างกว่าคอของท่ายืน
    เลยเห็นเป็น "จานขาว" รอบคอทุกใบ · เปลี่ยนมาสลับเฉพาะวงหน้า (เก็บเส้นรอบหัว/คางของ
    ภาพ normal ไว้) แล้วจบ ไม่ต้อง feather/lock อะไรเพิ่มเลย
  - หมุดที่ใช้วางหน้า = **จมูก** (ไม่ใช่ยอดหัว/กึ่งกลางหู) เพราะเป็นจุดกลางหน้าที่ตรงกันทั้งสองท่า
  - สเกล = อัตราส่วน "รัศมีวงหน้า" ของ normal ต่อ happy (คุมด้วย n_ell/h_ell)
  - อ่านต้นฉบับจาก `img/originals/` (1024px RGBA) แล้วค่อยย่อ 768 + quantize 256 สี
    → คมกว่าอ่านจาก img/ ที่ลดสีไปแล้ว · **พิกัดใน CFG เป็นระบบ 768** (ย่อก่อนคำนวณ)

ใช้:  python tools/happylab.py            # เขียนทับ img/<pet>_<stage>_happy.png ทั้ง 4 ใบ
      python tools/happylab.py --preview  # เขียนลง _happylab/ ไว้ดูก่อน ไม่แตะ img/
หลังรัน: ต้องอัปเดตหมุดชุดด้วย  python tools/wearlab.py eyes && python tools/wearlab.py cut
"""
import os
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'img')
ORIG = os.path.join(IMG, 'originals')
PREVIEW = os.path.join(ROOT, '_happylab')
SIZE = 768

# วงหน้า = (cx, cy, rx, ry) ยึด "จมูก" เป็นศูนย์กลาง · h_cut = ตัดใต้คาง (พิกัดภาพ 768)
CFG = {
    'cat_adult': dict(h_ell=(368, 250, 140, 138), h_cut=344, n_ell=(338, 320, 158, 156),
                      erase=[(196, 330, 85, 90), (566, 305, 82, 88)]),
    'cat_baby':  dict(h_ell=(388, 265, 145, 130), h_cut=330, n_ell=(382, 350, 175, 157),
                      erase=[(190, 345, 74, 82), (528, 345, 72, 82)]),
    # หมา: หูฟ้าห้อยยาว ตัดวงหน้าให้อยู่ในขนครีมล้วน หูเดิมของภาพ normal อยู่ต่อได้เลย
    'dog_adult': dict(h_ell=(380, 205, 175, 170), h_cut=352, n_ell=(390, 215, 168, 180),
                      erase=[(212, 355, 58, 52), (528, 352, 58, 52)]),
    'dog_baby':  dict(h_ell=(378, 262, 152, 138), h_cut=395, n_ell=(388, 272, 172, 158),
                      erase=[(232, 362, 58, 48), (518, 365, 55, 48)]),
}
FEATHER = 30          # ความนุ่มของขอบวงหน้า (px)


def load(name):
    """ต้นฉบับ 1024px ถ้ามี (คมกว่า) ย่อลงระบบพิกัด 768"""
    p = os.path.join(ORIG, name + '.png')
    if not os.path.exists(p):
        p = os.path.join(IMG, name + '.png')
    im = Image.open(p).convert('RGBA')
    return im if im.size == (SIZE, SIZE) else im.resize((SIZE, SIZE), Image.LANCZOS)


def parts(im):
    """แยก 'ตัวสัตว์' (ก้อนใหญ่สุด) ออกจาก 'ประกาย/หัวใจ' ที่ลอยรอบ ๆ"""
    a = np.array(im)[:, :, 3] > 40
    lab, n = ndimage.label(a)
    if n == 0:
        return im, Image.new('RGBA', im.size)
    sizes = ndimage.sum(a, lab, range(1, n + 1))
    big = int(np.argmax(sizes)) + 1
    arr = np.array(im)
    body = arr.copy(); body[:, :, 3] = np.where(lab == big, arr[:, :, 3], 0)
    spark = arr.copy(); spark[:, :, 3] = np.where(a & (lab != big), arr[:, :, 3], 0)
    return Image.fromarray(body), Image.fromarray(spark)


def alpha_mul(im, m):
    arr = np.array(im).astype(np.float32)
    arr[:, :, 3] *= m
    return Image.fromarray(arr.astype(np.uint8))


def m_ell(size, e, feather):
    cx, cy, rx, ry = e
    yy, xx = np.mgrid[0:size[1], 0:size[0]]
    d = np.sqrt(((xx - cx) / float(rx)) ** 2 + ((yy - cy) / float(ry)) ** 2)
    return np.clip((1 - d) * (min(rx, ry) / float(feather)) + .5, 0, 1).astype(np.float32)


def m_above(size, ycut, feather):
    yy, _ = np.mgrid[0:size[1], 0:size[0]]
    return np.clip((ycut - yy) / float(feather) + .5, 0, 1).astype(np.float32)


def build(pet, cfg):
    hap, nor = load(pet + '_happy'), load(pet + '_normal')
    hbody, spark = parts(hap)
    nbody, _ = parts(nor)

    for e in cfg.get('erase', []):                       # ลบอุ้งเท้าที่ยกบังแก้มอยู่
        hbody = alpha_mul(hbody, 1 - m_ell(hbody.size, e, 22))

    m = m_ell(hbody.size, cfg['h_ell'], FEATHER)
    m = np.minimum(m, m_above(hbody.size, cfg['h_cut'], FEATHER))
    face = alpha_mul(hbody, m)

    s = cfg['n_ell'][2] / float(cfg['h_ell'][2])
    face = face.resize((int(SIZE * s), int(SIZE * s)), Image.LANCZOS)
    dx = int(round(cfg['n_ell'][0] - cfg['h_ell'][0] * s))
    dy = int(round(cfg['n_ell'][1] - cfg['h_ell'][1] * s))

    out = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    out.alpha_composite(spark)                           # ประกายอยู่หลังสุด
    out.alpha_composite(nbody)                           # ลำตัว+ขาท่ายืน
    lay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0)); lay.paste(face, (dx, dy))
    out.alpha_composite(lay)                             # หน้ายิ้มทับลงบนหน้าเดิม
    return out


def main():
    preview = '--preview' in sys.argv
    dest = PREVIEW if preview else IMG
    os.makedirs(dest, exist_ok=True)
    for pet, cfg in CFG.items():
        im = build(pet, cfg)
        p = os.path.join(dest, f'{pet}_happy.png')
        im.quantize(colors=256, method=Image.FASTOCTREE).save(p, optimize=True)
        print(f'  {"(preview) " if preview else ""}{p}  {os.path.getsize(p)//1024} KB')


if __name__ == '__main__':
    main()
