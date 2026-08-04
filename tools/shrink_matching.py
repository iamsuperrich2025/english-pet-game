#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🗜️ shrink_matching.py — ย่อแผ่นคำศัพท์ Picture Dictionary ให้ขึ้นเว็บได้ (รอบ 993)

ทำไมต้องมี: ต้นฉบับ img/matching/*.png = 46 แผ่น ~91MB และเป็นไฟล์ untracked
  → tools/deploy_firebase.sh เอาไฟล์จาก `git archive HEAD` เท่านั้น = ไม่ขึ้นเว็บ
  → หน้าหนังสือบนเว็บจริงภาพ 404 (ยืนยันด้วย curl รอบ 993)
วิธี: แปลงเป็น WebP คงความละเอียดเดิม (1024×1536 — ตัวหนังสือบนการ์ดต้องอ่านออก
  บนจอ retina) ลงโฟลเดอร์ใหม่ img/matching/web/ แล้ว commit เฉพาะโฟลเดอร์นั้น
  ⛔ ไม่แตะ/ไม่ลบไฟล์ต้นฉบับของผู้ใช้เด็ดขาด (ต้นฉบับยังอยู่ในเครื่องเหมือนเดิม)

ใช้:  python tools/shrink_matching.py            # ย่อทุกแผ่นที่ยังไม่มี/เก่ากว่าต้นฉบับ
      python tools/shrink_matching.py --force    # ทำใหม่ทุกแผ่น
      python tools/shrink_matching.py --q 82     # ปรับคุณภาพ (ค่าเริ่ม 80)
"""
import argparse, os, glob, sys
from PIL import Image

# คอนโซล Windows เป็น cp1252 — บังคับ UTF-8 ไม่งั้น print ลูกศร/ไทยแล้วสคริปต์ตาย
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SRC = os.path.join(os.path.dirname(__file__), '..', 'img', 'matching')
OUT = os.path.join(SRC, 'web')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--q', type=int, default=80, help='คุณภาพ WebP (ค่าเริ่ม 80)')
    ap.add_argument('--force', action='store_true')
    a = ap.parse_args()

    os.makedirs(OUT, exist_ok=True)
    sheets = sorted(glob.glob(os.path.join(SRC, '*.png')))
    if not sheets:
        print('❌ ไม่พบแผ่นภาพใน', SRC); return 1

    tot_in = tot_out = 0
    done = skip = 0
    for f in sheets:
        name = os.path.splitext(os.path.basename(f))[0] + '.webp'
        dst = os.path.join(OUT, name)
        if not a.force and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(f):
            tot_in += os.path.getsize(f); tot_out += os.path.getsize(dst); skip += 1
            continue
        im = Image.open(f)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGB')
        im.save(dst, 'WEBP', quality=a.q, method=6)
        si, so = os.path.getsize(f), os.path.getsize(dst)
        tot_in += si; tot_out += so; done += 1
        print(f'  {os.path.basename(f):28s} {si/1048576:5.2f}MB → {so/1024:6.0f}KB  ({so/si*100:4.1f}%)')

    print(f'\n🗜️ ย่อ {done} แผ่น (ข้ามของเดิม {skip}) · '
          f'รวม {tot_in/1048576:.1f}MB → {tot_out/1048576:.1f}MB '
          f'({tot_out/tot_in*100:.1f}% · ประหยัด {(tot_in-tot_out)/1048576:.1f}MB)')
    print(f'📂 ผลลัพธ์: img/matching/web/  (ต้นฉบับไม่ถูกแตะต้อง)')
    return 0

if __name__ == '__main__':
    sys.exit(main())
