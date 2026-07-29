"""badgelab.py — ตัด img/badges/originals/badge_sheet.png (ตาราง 6x6) เป็นไฟล์เหรียญแยกทีละอัน
ให้ img/badges/<key>.png (33 ไฟล์) — เหรียญ+ริบบิ้นลอยบน**พื้นหลังโปร่งใส** จัดกึ่งกลางขนาดเท่ากันทุกใบ

ใช้: python tools/badgelab.py   (อ่านต้นฉบับอย่างเดียว ไม่แก้ไฟล์ต้นฉบับ — ผู้ใช้วางไว้เอง ห้ามเขียนทับ)

📜 ประวัติวิธีตัด (อย่าถอยกลับไปใช้ของเก่า — พังมาแล้วทั้งคู่):
  ① เดิม: หา bounding-box ของพิกเซลสว่างในหน้าต่างขยาย ±14px รอบเซล → เซลข้างเคียงที่มีเนื้อเหรียญ
     ใกล้ขอบถูกกวาดติดมาด้วย (เห็นชัดตอนขยายภาพใหญ่: มีเหรียญอื่นโผล่มาจากข้างบน)
  ② รอบ 747: ตัดตามกริด 6x6 ตรง ๆ + หด INSET → **ยังพัง** เพราะเหรียญจริง "ไม่ได้อยู่กึ่งกลางเซล"
     (เหรียญค่อนไปทางล่างของเซล) → ก้นเหรียญโดนตัดแหว่ง + ริบบิ้นแถวล่างถัดไปโผล่ขึ้นมาข้างบน
  ③ รอบ 748 (ปัจจุบัน): **ตรวจหาตำแหน่งเหรียญจริงจากภาพ** ไม่เดาจากกริดเลย —
     blur → threshold → closing → fill holes → label ได้ "ก้อน" ของแต่ละชิ้น
     จานเหรียญ = ก้อนใหญ่ (area > DISC_MIN) เจอครบ 33 ก้อนพอดี · ริบบิ้น = ก้อนเล็กที่ลอยเหนือจานตรงกลาง
     ครอปตามกรอบจริงของ (จาน ∪ ริบบิ้น) แล้วทำ **alpha จากตัวก้อนเอง** → เศษเหรียญข้างเคียงที่บังเอิญ
     ค้างอยู่ในกรอบกลายเป็นโปร่งใสทั้งหมด (คนละก้อน = ไม่ถูกเลือก) ปัญหา "เหรียญอื่นโผล่มา" จบถาวร
     บวกท่านี้ยังได้พื้นหลังโปร่งใส เหรียญเลยดูดีทั้งบนการ์ดพื้นสว่าง (โปรไฟล์) และพื้นน้ำเงินเข้ม (กระดานอันดับ)

🩹 เคสพิเศษ thunder_3: มีคราบแสง/ควันของตรา AI-Generated เดิมพาดลงมาจากขอบบนของชีต ทำให้ก้อนของมัน
   สูงผิดปกติ (ทะลุถึง y=4) → ใช้ "ขอบบนมัธยฐานของแถว" ตัดทอนให้เท่าเพื่อนในแถวเดียวกัน (ROW_TOP_TOL)
"""
import os
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'img', 'badges', 'originals', 'badge_sheet.png')   # ต้นฉบับเต็ม — ไม่ขึ้น git (**/originals/)
OUT_DIR = os.path.join(ROOT, 'img', 'badges')
COLS, ROWS = 6, 6

BG_TH = 60          # เพดานพื้นหลัง (วัดจริง: กำมะหยี่ ~10-32 · เนื้อเหรียญ/ริบบิ้น > 60 ชัดเจน)
BLUR = 2.0          # เบลอก่อน threshold — รวมลายสลักโลหะที่แตกเป็นจุด ๆ ให้เป็นก้อนเดียว
CLOSE = 9           # ปิดรูระหว่างลายสลัก
DISC_MIN = 8000     # พื้นที่ขั้นต่ำของ "จานเหรียญ" (จานจริง ~10,600-16,300 · ริบบิ้น ~1,900-2,700)
RIBBON_MIN = 600    # พื้นที่ขั้นต่ำของริบบิ้น (กันจุดรบกวน)
RIBBON_GAP = 46     # ระยะสูงสุดจากก้นริบบิ้นถึงหัวจาน ถึงจะนับว่าเป็นริบบิ้นของเหรียญนี้
ROW_TOP_TOL = 25    # ขอบบนสูงกว่ามัธยฐานของแถวเกินนี้ = ผิดปกติ (คราบแสง) → ตัดลงมาเท่าแถว

# 🩹 ซ่อมงานศิลป์ต้นฉบับที่เจนมาเสีย: ช่อง thunder_3 (แถว0 คอลัมน์5) **ไม่มีริบบิ้นเลย** —
# ตัวเจนภาพวาดเป็นลำแสงทองเบลอพาดลงมาจากขอบบนแทน (ซูมดูแล้วชัดเจน ไม่ใช่คราบลบตราออก)
# → ลบลำแสงทิ้ง แล้วย้ายริบบิ้นของ pilot_3 (เหรียญระดับทองในแถวเดียวกัน ริบบิ้นแดงเข้มขลิบทอง)
#   มาแปะให้ตรงกลางจานของ thunder_3 ที่ความสูงเดียวกับเพื่อนในแถว → ได้เหรียญครบองค์ เข้าชุดกัน
GLOW_BOX = (830, 0, 1010, 76)                  # (x0,y0,x1,y1) ลำแสงทองเหนือจาน thunder_3
RIBBON_DONOR = (373, 36, 478, 76)              # ริบบิ้นต้นแบบจาก pilot_3 (รวมสายห้อย ไม่กินเนื้อจาน)
RIBBON_DONOR_CX = 426                          # จุดกึ่งกลางจานของ pilot_3 (ใช้จัดให้ริบบิ้นอยู่กลางจานปลายทาง)
RIBBON_TARGET_CX = 914                         # จุดกึ่งกลางจานของ thunder_3
PAD = 10            # ขอบเผื่อรอบกรอบจริง (หน่วยพิกเซลต้นฉบับ)
OUT_SIZE = 256      # ขนาดผืนผ้าใบสี่เหลี่ยมจัตุรัสของทุกไฟล์ (เท่ากันหมด → เรียงแล้วดูเป็นชุดเดียวกัน)
FILL = 0.94         # สัดส่วนที่เนื้อเหรียญกินพื้นที่ผืนผ้าใบ (เหลือขอบหายใจนิดหน่อย)

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
    rgb = np.array(im)
    H, W, _ = rgb.shape
    cw, ch = W / COLS, H / ROWS

    # ---- ⓪ ซ่อมริบบิ้นที่หายไปของ thunder_3 (ดูคำอธิบาย GLOW_BOX ด้านบน) ----
    gx0, gy0, gx1, gy1 = GLOW_BOX
    rgb[gy0:gy1, gx0:gx1] = np.array([9, 14, 30], dtype=np.uint8)   # สีกำมะหยี่พื้นหลังรอบ ๆ จุดนั้น
    rx0, ry0, rx1, ry1 = RIBBON_DONOR
    donor = rgb[ry0:ry1, rx0:rx1]
    tx0 = RIBBON_TARGET_CX - (RIBBON_DONOR_CX - rx0)
    rgb[ry0:ry1, tx0:tx0 + donor.shape[1]] = donor

    # ---- ① หา "ก้อน" ของทุกชิ้นบนชีต ----
    blur = ndimage.gaussian_filter(rgb.max(axis=2).astype(np.float32), BLUR)
    mask = ndimage.binary_closing(blur > BG_TH, structure=np.ones((CLOSE, CLOSE)))
    mask = ndimage.binary_fill_holes(mask)
    lab, n = ndimage.label(mask)
    objs = ndimage.find_objects(lab)
    areas = ndimage.sum(mask, lab, range(1, n + 1))

    comps = []
    for i in range(n):
        sl = objs[i]
        if sl is None:
            continue
        ys, xs = sl
        comps.append(dict(label=i + 1, area=int(areas[i]),
                          y0=ys.start, y1=ys.stop, x0=xs.start, x1=xs.stop))

    discs = [c for c in comps if c['area'] >= DISC_MIN]
    ribbons = [c for c in comps if RIBBON_MIN <= c['area'] < DISC_MIN]
    if len(discs) != len(KEYS):
        print(f'⚠️ เจอจานเหรียญ {len(discs)} ก้อน แต่คาดไว้ {len(KEYS)} — ตรวจ DISC_MIN/BG_TH ก่อนใช้ผลลัพธ์')

    # ---- ② จับจานเหรียญเข้าช่องกริด (ใช้แค่ระบุว่าเป็นเหรียญอันไหน ไม่ได้ใช้กำหนดกรอบครอป) ----
    cell = {}
    for d in discs:
        r = int(((d['y0'] + d['y1']) / 2) // ch)
        c = int(((d['x0'] + d['x1']) / 2) // cw)
        cell[(min(r, ROWS - 1), min(c, COLS - 1))] = d

    # ---- ③ ต่อริบบิ้นเข้ากับจานของมัน แล้วได้กรอบจริง + ชุดก้อนที่เป็น "เหรียญนี้" ----
    plan = {}
    for (r, c), d in cell.items():
        labels = [d['label']]
        x0, y0, x1, y1 = d['x0'], d['y0'], d['x1'], d['y1']
        dcx = (d['x0'] + d['x1']) / 2
        for rb in ribbons:
            gap = d['y0'] - rb['y1']
            overlaps = rb['x0'] < dcx < rb['x1']          # ริบบิ้นคร่อมกึ่งกลางจาน
            if overlaps and 0 <= gap <= RIBBON_GAP:
                labels.append(rb['label'])
                x0, y0 = min(x0, rb['x0']), min(y0, rb['y0'])
                x1 = max(x1, rb['x1'])
        plan[(r, c)] = dict(labels=labels, box=[x0, y0, x1, y1])

    # ---- ④ ขอบบนผิดปกติ (คราบแสงของ thunder_3) → ตัดลงมาเท่ามัธยฐานของแถว ----
    for r in range(ROWS):
        tops = [p['box'][1] for (rr, _), p in plan.items() if rr == r]
        if not tops:
            continue
        med = float(np.median(tops))
        for (rr, _), p in plan.items():
            if rr == r and med - p['box'][1] > ROW_TOP_TOL:
                p['box'][1] = int(med)

    # ---- ⑤ ครอป + ทำ alpha จากก้อนของเหรียญนี้เท่านั้น + วางกึ่งกลางผืนผ้าใบขนาดเท่ากัน ----
    manifest = []
    idx = 0
    for r in range(ROWS):
        for c in range(COLS):
            if idx >= len(KEYS):
                break
            key = KEYS[idx]; idx += 1
            p = plan.get((r, c))
            if not p:
                print(f'⚠️ {key}: ไม่เจอเหรียญในช่อง ({r},{c}) — ข้าม')
                continue
            x0, y0, x1, y1 = p['box']
            x0 = max(0, x0 - PAD); y0 = max(0, y0 - PAD)
            x1 = min(W, x1 + PAD); y1 = min(H, y1 + PAD)

            keep = np.isin(lab[y0:y1, x0:x1], p['labels'])   # เฉพาะก้อนของเหรียญนี้ → เศษเหรียญข้างเคียง = โปร่งใส
            alpha = ndimage.binary_dilation(keep, iterations=2).astype(np.float32)
            alpha = ndimage.gaussian_filter(alpha, 1.2)      # ขอบนุ่ม ไม่เป็นฟันเลื่อย
            alpha = np.clip(alpha * 1.15, 0, 1)

            piece = np.dstack([rgb[y0:y1, x0:x1], (alpha * 255).astype(np.uint8)])
            tile = Image.fromarray(piece, 'RGBA')

            # ย่อให้พอดีผืนผ้าใบ (คงสัดส่วน) แล้ววางกึ่งกลาง — ทุกไฟล์ออกมาขนาดเท่ากันเป๊ะ
            box_w = int(OUT_SIZE * FILL)
            sc = min(box_w / tile.width, box_w / tile.height)
            tile = tile.resize((max(1, round(tile.width * sc)), max(1, round(tile.height * sc))), Image.LANCZOS)
            canvas = Image.new('RGBA', (OUT_SIZE, OUT_SIZE), (0, 0, 0, 0))
            canvas.paste(tile, ((OUT_SIZE - tile.width) // 2, (OUT_SIZE - tile.height) // 2))
            canvas.save(os.path.join(OUT_DIR, key + '.png'))
            manifest.append((key, x0, y0, x1 - x0, y1 - y0, len(p['labels'])))

    print(f'ตัดสำเร็จ {len(manifest)}/{len(KEYS)} เหรียญ → {OUT_DIR}  (โปร่งใส {OUT_SIZE}x{OUT_SIZE} ทุกไฟล์)')
    for key, x, y, w, h, nl in manifest:
        print(f'  {key:14s} src=({x:4d},{y:4d}) {w:3d}x{h:3d}  ชิ้น={nl}')


if __name__ == '__main__':
    main()
