#!/usr/bin/env python3
"""pack_tex.py — บีบภาพเทกซ์เจอร์ที่ผู้ใช้เจนมา (PNG ก้อนใหญ่) ให้เป็น .jpg เบาๆ พร้อมขึ้นเว็บ

ทำไมต้องมี: ภาพจากตัวเจน AI มักเป็น PNG 2-4 MB ต่อไฟล์ · เกมนี้เด็กเล่นบนมือถือ
โหลดทีละหลาย MB = เข้าโลกช้ามาก · แปลงเป็น JPEG คุณภาพ 85 เหลือ ~5-10% ของเดิม ตาดูไม่ออก

⚠️ WebGL1 บังคับ: texture ที่ตั้ง RepeatWrapping (หญ้า/ฝูงชน/ป้าย) **ต้องเป็น power-of-two**
   ไม่งั้นภาพจะไม่ซ้ำ (กลายเป็นสีเดียว/ขอบยืด) — สคริปต์นี้ย่อลง POT ให้อัตโนมัติ

ใช้:  python tools/pack_tex.py                 # แปลงทุกไฟล์ตามสูตรด้านล่าง
      python tools/pack_tex.py --keep-png      # ไม่เตือนเรื่องไฟล์ png ต้นฉบับ

ไฟล์ .png ต้นฉบับ **ไม่ถูกลบ** (เป็นของผู้ใช้) — เกมเลือก .jpg ก่อนอยู่แล้ว (ดู applyTex ใน adventure3d.js)
"""
import sys, os
from PIL import Image

try: sys.stdout.reconfigure(encoding='utf-8')   # คอนโซล Windows เป็น cp1252 พิมพ์ emoji ไม่ได้
except Exception: pass

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TEX = os.path.join(ROOT, 'img', 'tex')

# ชื่อไฟล์ -> {size:(กว้าง,สูง) POT สำหรับภาพที่ repeat, crop:วิธีตัดก่อนย่อ}
#   crop 'content' = ตัดพื้นดำรอบๆ ทิ้ง เอาเฉพาะเนื้อภาพ (ตัวเจนชอบวางแถบยาวลอยกลางพื้นดำ)
#   crop ('box', l,t,r,b) = สัดส่วน 0-1 ของภาพเดิม (ตัดขอบที่ไม่ต้องการ เช่น หญ้าที่ติดมากับภาพฝูงชน)
JOBS = {
    'soccer_grass':  {'size': (1024, 1024)},                                  # หญ้า repeat — ต้อง POT
    'soccer_crowd':  {'size': (2048,  512), 'crop': ('box', 0, 0, 1, .88)},   # ตัดแถบหญ้าขอบล่างทิ้ง
    'soccer_ball':   {'size': (1024,  512)},                                  # ลายบอลห่อทรงกลม
    'soccer_ads':    {'size': (2048,  128), 'crop': ('content',)},            # ดึงเฉพาะแถบป้ายออกจากพื้นดำ
}
QUALITY = 85


def crop_content(im, thresh=42):
    """ตัดขอบมืดรอบภาพทิ้ง — คืนกรอบแถวxคอลัมน์ที่ 'มีเนื้อภาพ' จริง"""
    g = im.convert('L')
    w, h = g.size
    px = g.load()
    step = max(1, w // 256)                       # สุ่มอ่านคอลัมน์แบบข้ามเพื่อความเร็ว
    rows = [y for y in range(h)
            if max(px[x, y] for x in range(0, w, step)) > thresh]
    cols = [x for x in range(0, w, step)
            if max(px[x, y] for y in range(0, h, max(1, h // 256))) > thresh]
    if not rows or not cols:
        return im
    return im.crop((cols[0], rows[0], min(w, cols[-1] + step), rows[-1] + 1))


def main():
    if not os.path.isdir(TEX):
        print('❌ ไม่เจอโฟลเดอร์', TEX); return 1
    total_before = total_after = 0
    for key, job in JOBS.items():
        mw, mh = job['size']
        src = None
        for ext in ('.png', '.jpg', '.jpeg', '.webp'):
            p = os.path.join(TEX, key + ext)
            if os.path.exists(p):
                src = p; break
        if not src:
            print(f'⏭️  {key}: ยังไม่มีไฟล์ ข้ามไป'); continue
        dst = os.path.join(TEX, key + '.jpg')
        if os.path.abspath(src) == os.path.abspath(dst):
            print(f'⏭️  {key}: เป็น .jpg อยู่แล้ว ข้ามไป'); continue

        im = Image.open(src).convert('RGB')
        before = os.path.getsize(src)
        ow, oh = im.size
        cp = job.get('crop')
        if cp and cp[0] == 'content':
            im = crop_content(im)
        elif cp and cp[0] == 'box':
            _, l, t, r, b = cp
            im = im.crop((int(ow * l), int(oh * t), int(ow * r), int(oh * b)))
        cw, ch = im.size
        if (cw, ch) != (mw, mh):
            im = im.resize((mw, mh), Image.LANCZOS)
        im.save(dst, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        after = os.path.getsize(dst)
        total_before += before; total_after += after
        note = f' · crop {cw}x{ch}' if (cw, ch) != (ow, oh) else ''
        print(f'✅ {key}: {ow}x{oh}{note} {before/1e6:.2f}MB → {mw}x{mh} {after/1e6:.2f}MB '
              f'(เหลือ {after/before*100:.0f}%)')

    if total_before:
        print(f'\n📦 รวม {total_before/1e6:.2f}MB → {total_after/1e6:.2f}MB '
              f'(ประหยัด {(1-total_after/total_before)*100:.0f}%)')
        print('👉 อย่าลืม: git add img/tex/*.jpg แล้ว deploy (git archive HEAD ไม่เอาไฟล์ที่ยังไม่ commit)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
