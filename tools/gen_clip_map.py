# -*- coding: utf-8 -*-
"""🗜️ gen_clip_map.py (รอบ 611) — เจนตาราง CLIP_SM ใน js/images.js จากไฟล์จริงใน clip/sm/

ต่อคลิป 1 ตัว = รายชื่อไฟล์เรียง "เล็กสุดก่อน" (เกมหยิบตัวแรกที่เบราว์เซอร์เล่นได้)
ถูกเรียกอัตโนมัติท้าย tools/compress_clips.sh — ปกติไม่ต้องรันเอง
⛔ บล็อกระหว่าง CLIP-SM-START / CLIP-SM-END ในไฟล์ js ห้ามแก้มือ (โดนทับทุกครั้งที่รัน)
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SM   = os.path.join(ROOT, 'clip', 'sm')
JS   = os.path.join(ROOT, 'js', 'images.js')

def main():
    if not os.path.isdir(SM):
        print('ไม่มีโฟลเดอร์ clip/sm — ยังไม่ได้บีบคลิป'); return 1

    keys = sorted({os.path.splitext(f)[0] for f in os.listdir(SM)
                   if f.endswith(('.mp4', '.webm'))})
    rows = []
    for k in keys:
        cands = []
        for ext in ('webm', 'mp4'):
            p = os.path.join(SM, k + '.' + ext)
            if os.path.isfile(p):
                cands.append((os.path.getsize(p), 'sm/%s.%s' % (k, ext)))
        if not cands:
            continue
        cands.sort()                       # เล็กสุดก่อน
        rows.append("  %s: [%s]," % (k, ','.join("'%s'" % c[1] for c in cands)))

    block = "const CLIP_SM = {\n%s\n};" % '\n'.join(rows)

    src = open(JS, encoding='utf-8').read()
    new = re.sub(r'(/\* CLIP-SM-START \*/\n).*?(\n/\* CLIP-SM-END \*/)',
                 lambda m: m.group(1) + block + m.group(2), src, flags=re.S)
    if new == src and block not in src:
        print('❌ ไม่พบเครื่องหมาย /* CLIP-SM-START */ ... /* CLIP-SM-END */ ใน js/images.js')
        return 1
    if new != src:
        open(JS, 'w', encoding='utf-8', newline='').write(new)
    print('CLIP_SM: %d clips' % len(rows))
    return 0

if __name__ == '__main__':
    sys.exit(main())
