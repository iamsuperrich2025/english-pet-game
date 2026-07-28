#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
wearlab.py — ตัด "ชุด/เครื่องประดับ" ออกจากภาพสัตว์ที่เจนไว้แล้ว ให้เป็น PNG พื้นหลังใส
เพื่อเอาไปซ้อนบนภาพ "รูปร่าง" (fat/thin/strong) ได้ในภาพเดียว (รอบ 666)

ทำไมต้องตัด: img/<pet>_adult_<item>.png กับ img/<pet>_adult_<shape>.png เป็นภาพ AI คนละครั้ง
ท่าไม่ตรงกันเลย (diff ทั้งภาพ ~65%) → ซ้อนตรง ๆ /หา diff อัตโนมัติไม่ได้
วิธีนี้จึงตัดเฉพาะ "ตัวชุด" ด้วยสี (ชุดทุกชิ้นสีตัดกับขนสัตว์ชัด) แล้ววางด้วย "เส้นตา" เป็นหมุด

ใช้:  python tools/wearlab.py eyes     # ตรวจจับเส้นตา + ออกภาพตรวจสอบ
      python tools/wearlab.py cut      # ตัดชุดทั้งหมด → img/wear/<pet>_<item>.png + js/data/wear.js
      python tools/wearlab.py sheet    # ประกอบ (รูปร่าง+ชุด) เป็นตารางไว้ดูด้วยตา
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG  = os.path.join(ROOT, 'img')
OUT  = os.path.join(IMG, 'wear')
SCRATCH = os.environ.get('WEARLAB_OUT', os.path.join(ROOT, '_wearlab'))

PETS   = ['cat', 'dog', 'dragon']
SHAPES = ['fat', 'thin', 'strong']
# ภาพ "เป้าหมาย" ที่ต้องเอาชุดไปแปะ = ทุกภาพที่ currentPetImg() เอามาทับภาพใส่ชุด
TARGETS = [f'adult_{s}' for s in SHAPES] + [f'{st}_{m}' for st in ('adult', 'baby') for m in ('sick', 'hungry', 'happy')]
# ชุดทั้งหมด + ช่องที่ใส่ + ช่วงความสูง (สัดส่วนของกล่องตัวสัตว์) ที่อนุญาตให้ตัด + สีเป้าหมาย HSV
# hue เป็นองศา 0-360 · s,v เป็น 0-1
ITEMS = {
    'crown':      dict(band=(0.00, 0.40), hue=(35,  62), s=(0.35, 1.01), v=(0.30, 1.01), parts=1),
    'tophat':     dict(band=(0.00, 0.40), dark=True, parts=1),
    'cap':        dict(band=(0.00, 0.45), hue=(180, 250), s=(0.18, 1.01), v=(0.25, 1.01), parts=1),
    'bow':        dict(band=(0.00, 0.95), hue=(320, 375), s=(0.22, 1.01), v=(0.35, 1.01), parts=1),
    'scarf':      dict(band=(0.25, 0.95), hue=(320, 375), s=(0.16, 1.01), v=(0.35, 1.01), parts=1),
    'bell':       dict(band=(0.20, 0.95), hue=(-15, 60),  s=(0.55, 1.01), v=(0.35, 1.01), parts=2),
    # แว่นใส: ห้ามถมรูเลนส์ (เว้นให้โปร่ง จะได้เห็น "ตาของน้องตัวจริง" ผ่านเลนส์)
    'glasses':    dict(band=(0.05, 0.75), hue=(185, 265), s=(0.30, 1.01), v=(0.12, 1.01), parts=2, nofill=True),
    'sunglasses': dict(band=(0.05, 0.75), dark=True, parts=2),
}

# บางตัวสีชุดชนกับสีตัวเอง (หูหมาสีฟ้า=หมวกฟ้า/แว่นฟ้า · ขนแมวส้ม=ปลอกคอแดง) ตัดยังไงก็ติดตัวมาด้วย
# → ยืมชิ้นที่ตัดสะอาดจากสัตว์ตัวอื่นมาใช้แทน (ดีไซน์ชุดชุดเดียวกัน + ปรับขนาดตามระยะห่างตาอยู่แล้ว)
SRC = {'dog_cap': 'cat', 'dog_glasses': 'cat', 'cat_bell': 'dog', 'dragon_bell': 'dog'}

# วางชุดยังไง — head = ยึดยอดหัว (sink = ให้จมลงไปในหัวกี่ % ของความสูงชิ้นนั้น)
#                eye  = ยึดเส้นตา (ใช้ระยะที่วัดได้จากภาพต้นฉบับตรง ๆ)
# k/ox/oy = ปรับละเอียด (ox/oy หน่วย = ระยะห่างตา)
PLACE = {
    'crown':      dict(slot='head', sink=0.30, k=1.12),
    'tophat':     dict(slot='head', sink=0.40),
    'cap':        dict(slot='head', sink=0.52),
    'bow':        dict(slot='eye'),
    'scarf':      dict(slot='eye'),
    'bell':       dict(slot='eye'),
    'glasses':    dict(slot='eye'),
    'sunglasses': dict(slot='eye'),
}


def load(key):
    return Image.open(os.path.join(IMG, key + '.png')).convert('RGBA')


def bbox_of(a):
    ys, xs = np.nonzero(a[:, :, 3] > 16)
    return xs.min(), ys.min(), xs.max(), ys.max()


def hsv(a):
    rgb = a[:, :, :3].astype(np.float32) / 255.0
    mx = rgb.max(2); mn = rgb.min(2); d = mx - mn
    h = np.zeros_like(mx)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    m = (d > 1e-6)
    idx = m & (mx == r); h[idx] = ((g - b)[idx] / d[idx]) % 6
    idx = m & (mx == g) & (mx != r); h[idx] = ((b - r)[idx] / d[idx]) + 2
    idx = m & (mx == b) & (mx != r) & (mx != g); h[idx] = ((r - g)[idx] / d[idx]) + 4
    h = h * 60.0
    s = np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0)
    return h, s, mx


# ---------------------------------------------------------------- เส้นตา (หมุดวางชุด)
def detect_eyes(key, allow_wide=None):
    """คืน (xL,yL,xR,yR) ของจุดกึ่งกลางตาสองข้าง — ใช้เป็นหมุดอ้างอิงเดียวกันทุกภาพ
       ตาในสไตล์ภาพชุดนี้ = ก้อนมืดใหญ่สองก้อนที่อยู่ระดับเดียวกัน (จมูกอยู่ต่ำกว่า จึงไม่โดนเลือก)"""
    a = np.asarray(load(key), dtype=np.uint8)
    x0, y0, x1, y1 = bbox_of(a)
    W, H = x1 - x0, y1 - y0
    # ภาพ "แว่น" เท่านั้นที่ยอมให้ใช้ก้อนดำกว้างแทนตา (หมวก/ปีกมังกรก็ดำกว้างเหมือนกัน ห้ามเผลอ)
    aw = key.endswith(('_sunglasses', '_glasses')) if allow_wide is None else allow_wide
    lum = a[:, :, :3].astype(np.float32).mean(2)
    dark = (lum < 105) & (a[:, :, 3] > 180)
    dark[:y0, :] = False; dark[y0 + int(H * 0.72):, :] = False   # เอาเฉพาะครึ่งบน (หัว)
    lab, n = ndimage.label(dark)
    if n == 0: return None
    blobs, wide = [], []
    area_pet = float((a[:, :, 3] > 16).sum())
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        area = len(xs)
        if area < area_pet * 0.0015 or area > area_pet * 0.22: continue
        bw, bh = xs.max() - xs.min(), ys.max() - ys.min()
        b = dict(area=area, cx=xs.mean(), cy=ys.mean(), w=bw, h=bh,
                 x0=xs.min(), x1=xs.max(), y0=ys.min(), y1=ys.max())
        # แว่นกันแดด = ก้อนดำก้อนเดียวกว้างพาดหน้า (เลนส์สองข้างเชื่อมกันที่สะพานแว่น)
        if aw and bh > 0 and bw > W * 0.25 and bw / max(bh, 1) > 1.9 \
           and abs(b['cx'] - (x0 + x1) / 2) < W * 0.12 and (b['cy'] - y0) < H * 0.45: wide.append(b)
        # ตา = ก้อนกลม ๆ ไม่กว้างเกินหัว (กันปีก/เงา/มือ มาแย่ง)
        if area > area_pet * 0.09: continue
        if bw > W * 0.34 or bh > H * 0.24: continue        # ตาแมวมักติดขอบตาดำมาด้วย เลยกว้างได้ถึง 1/3 หัว
        if not (0.40 <= bw / max(bh, 1) <= 3.4): continue
        if (b['cy'] - y0) > H * 0.55: continue             # ตาไม่มีทางอยู่ต่ำกว่าครึ่งตัว (กันลายอกแมว)
        blobs.append(b)
    g = max(wide, key=lambda b: b['area']) if wide else None
    best, bestScore = None, -1e9
    for i in range(len(blobs)):
        for j in range(i + 1, len(blobs)):
            L, R = sorted((blobs[i], blobs[j]), key=lambda b: b['cx'])
            dy = abs(L['cy'] - R['cy']); dx = R['cx'] - L['cx']
            if dx < W * 0.06 or dx > W * 0.75: continue
            if dy > H * 0.06: continue                      # ต้องอยู่ระดับเดียวกัน
            ar = min(L['area'], R['area']) / max(L['area'], R['area'])
            if ar < 0.35: continue                          # ตาสองข้างต้องใหญ่พอ ๆ กัน
            score = (L['area'] + R['area']) * ar - dy * 40
            if score > bestScore: bestScore, best = score, (L, R)
    # มีทั้งคู่ตาและก้อนแว่น → เลือกอันที่อยู่ "สูงกว่า" (ตา/แว่นอยู่บนหน้า ไม่ใช่ลายอก/เงาปาก)
    if g and (not best or g['cy'] < (best[0]['cy'] + best[1]['cy']) / 2 - H * 0.05):
        return (g['x0'] + g['w'] * 0.25, g['cy'], g['x0'] + g['w'] * 0.75, g['cy'])
    if not best: return None
    L, R = best
    return (L['cx'], L['cy'], R['cx'], R['cy'])


def all_keys():
    ks = []
    for p in PETS:
        for t in TARGETS:
            if os.path.exists(os.path.join(IMG, f'{p}_{t}.png')): ks.append(f'{p}_{t}')
        for it in ITEMS: ks.append(f'{p}_adult_{it}')
    return ks


EYES_JSON = os.path.join(SCRATCH, 'eyes.json')
MANUAL = {}   # ใส่ override มือได้: 'cat_adult_fat': [x1,y1,x2,y2]


def cmd_eyes():
    os.makedirs(SCRATCH, exist_ok=True)
    res, bad = {}, []
    for k in all_keys():
        e = MANUAL.get(k) or detect_eyes(k)
        if e is None: bad.append(k); continue
        res[k] = [round(float(v), 1) for v in e]
    json.dump(res, open(EYES_JSON, 'w'), indent=1)
    # ภาพตรวจสอบ: วาดกากบาทบนตาที่เจอ
    keys = all_keys(); S = 190; cols = 6
    rows = (len(keys) + cols - 1) // cols
    sheet = Image.new('RGB', (S * cols, (S + 16) * rows), (238, 238, 238))
    d = ImageDraw.Draw(sheet)
    for i, k in enumerate(keys):
        im = load(k); sc = S / im.width
        th = im.resize((S, S)); x = (i % cols) * S; y = (i // cols) * (S + 16) + 16
        sheet.paste(th.convert('RGB'), (x, y), th)
        d.text((x + 3, y - 13), k.replace('_adult', ''), fill=(0, 0, 0))
        if k in res:
            ex = res[k]
            for cx, cy in ((ex[0], ex[1]), (ex[2], ex[3])):
                px, py = x + cx * sc, y + cy * sc
                d.line((px - 6, py, px + 6, py), fill=(255, 0, 0), width=2)
                d.line((px, py - 6, px, py + 6), fill=(255, 0, 0), width=2)
    sheet.save(os.path.join(SCRATCH, 'eyes_check.png'))
    print('eyes ok:', len(res), 'fail:', bad)


# ---------------------------------------------------------------- ตัดชุด
def cut_item(pet, item):
    spec = ITEMS[item]
    key = f'{SRC.get(f"{pet}_{item}", pet)}_adult_{item}'
    a = np.asarray(load(key), dtype=np.uint8)
    x0, y0, x1, y1 = bbox_of(a)
    H = y1 - y0
    alpha = a[:, :, 3] > 16
    if spec.get('dark'):
        lum = a[:, :, :3].astype(np.float32).mean(2)
        h, s, v = hsv(a)
        m = (lum < 118) & (s < 0.55) & alpha
    else:
        h, s, v = hsv(a)
        hh = h.copy()
        lo, hi = spec['hue']
        if lo < 0: hh = np.where(hh > 300, hh - 360, hh)
        if hi > 360: hh = np.where(hh < 60, hh + 360, hh)
        m = (hh >= lo) & (hh <= hi) & (s >= spec['s'][0]) & (s <= spec['s'][1]) \
            & (v >= spec['v'][0]) & (v <= spec['v'][1]) & alpha
    b0, b1 = spec['band']
    m[:y0 + int(H * b0), :] = False
    m[y0 + int(H * b1):, :] = False
    # ปิดรู + เก็บก้อนใหญ่ (กันจุดสีหลงจากขน)
    m = ndimage.binary_closing(m, np.ones((5, 5)))
    lab, n = ndimage.label(m)
    if n == 0: return None
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    keep = np.zeros_like(m)
    big = sizes.max()
    # ชุดชิ้นเดียว (หมวก/โบว์/ผ้าพันคอ) เอาก้อนใหญ่สุดก้อนเดียว — กันหูสีเดียวกัน/ลายขนหลุดมาด้วย
    lim = big * (0.10 if spec.get('parts', 1) > 1 else 0.98)
    for i, sz in enumerate(sizes, start=1):
        if sz >= max(lim, 400): keep |= (lab == i)          # แว่นสองข้าง/ปลอกคอ+กระดิ่ง = หลายก้อน
    m = keep if spec.get('nofill') else ndimage.binary_fill_holes(keep)
    m = ndimage.binary_dilation(m, np.ones((3, 3)))
    out = a.copy()
    out[:, :, 3] = np.where(m, a[:, :, 3], 0)
    im = Image.fromarray(out, 'RGBA')
    # ขอบนุ่มนิดหน่อยกันขอบแข็ง
    al = im.split()[3].filter(ImageFilter.GaussianBlur(0.8))
    im.putalpha(al)
    ys, xs = np.nonzero(m)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)), (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def head_top(key, ex):
    """y ของ 'ยอดกะโหลกกลางหน้าผาก' — สแกนเฉพาะแถบแคบ ๆ ระหว่างตาสองข้าง จะได้ไม่ไปโดนปลายหู
       ใช้เป็นหมุดของหมวก: ระยะจากตาถึงยอดหัวไม่คงที่ (แมวอ้วนหน้าผากเตี้ย แมวล่ำหน้าผากสูง)"""
    a = np.asarray(load(key), dtype=np.uint8)
    emx, ed = (ex[0] + ex[2]) / 2, abs(ex[2] - ex[0])
    lo, hi = int(emx - ed * 0.42), int(emx + ed * 0.42)
    band = a[:, max(0, lo):hi + 1, 3] > 64
    ys = np.nonzero(band.any(axis=1))[0]
    return float(ys.min()) if len(ys) else float(ex[1])


def cmd_cut():
    os.makedirs(OUT, exist_ok=True); os.makedirs(SCRATCH, exist_ok=True)
    eyes = json.load(open(EYES_JSON))
    meta = {}
    for pet in PETS:
        for item in ITEMS:
            # วัดสัดส่วนเทียบ "เส้นตาของภาพต้นทางที่ตัดมา" เสมอ (บางชิ้นยืมจากสัตว์ตัวอื่น — ดู SRC)
            key = f'{SRC.get(f"{pet}_{item}", pet)}_adult_{item}'
            if key not in eyes: print('  ! ไม่มีเส้นตา', key); continue
            r = cut_item(pet, item)
            if not r: print('  ! ตัดไม่ได้', key); continue
            im, (cx0, cy0, cx1, cy1) = r
            ex = eyes[key]
            emx, emy = (ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2
            ed = abs(ex[2] - ex[0])                       # ระยะห่างตา = หน่วยวัด
            if max(im.size) > 400:                        # ย่อให้พอดีจอ (ของเดิม 768 ใหญ่เกินความจำเป็น)
                r2 = 400 / max(im.size)
                im = im.resize((max(1, round(im.width * r2)), max(1, round(im.height * r2))), Image.LANCZOS)
            # ลดสีเหลือ 128 สี (แบบเก็บ alpha) — ชิ้นเล็ก ๆ ตาแทบไม่เห็นต่าง แต่ไฟล์เล็กลง ~4 เท่า
            im.quantize(colors=128, method=Image.FASTOCTREE).save(
                os.path.join(OUT, f'{pet}_{item}.png'), optimize=True)
            meta[f'{pet}_{item}'] = dict(
                w=round((cx1 - cx0) / ed, 4),             # กว้างกี่เท่าของระยะห่างตา
                h=round((cy1 - cy0) / ed, 4),
                dx=round((cx0 - emx) / ed, 4),            # มุมบนซ้ายห่างจากจุดกึ่งกลางตา
                dy=round((cy0 - emy) / ed, 4))
            print(f'  ok {pet}_{item}: {im.width}x{im.height}px  w={meta[f"{pet}_{item}"]["w"]}')
    shapes = {}
    for pet in PETS:
        for t in TARGETS:
            k = f'{pet}_{t}'
            if k not in eyes: continue
            ex = eyes[k]
            im = load(k)
            shapes[k] = dict(
                ex=round((ex[0] + ex[2]) / 2 / im.width, 4),   # จุดกึ่งกลางตา (สัดส่วนภาพ)
                ey=round((ex[1] + ex[3]) / 2 / im.height, 4),
                ed=round(abs(ex[2] - ex[0]) / im.width, 4),    # ระยะห่างตา (สัดส่วนภาพ)
                ht=round(head_top(k, ex) / im.height, 4))      # ยอดกะโหลก (หมวกยึดเส้นนี้)
    json.dump(dict(wear=meta, shape=shapes), open(os.path.join(SCRATCH, 'wear_meta.json'), 'w'), indent=1)
    write_js(meta, shapes)
    print('ชุดที่ตัดได้:', len(meta), '· ภาพเป้าหมาย:', len(shapes))


def write_js(meta, shapes):
    """เขียน js/data/wear.js — ตารางเดียวที่เกมต้องใช้ (ห้ามแก้มือ เจนใหม่ด้วย wearlab.py cut)"""
    L = []
    for k, v in sorted(meta.items()):
        pl = PLACE[k.split('_', 1)[1]]
        L.append("  %s:{f:'img/wear/%s.png',w:%s,h:%s,dx:%s,dy:%s,s:'%s',sk:%s,k:%s,ox:%s,oy:%s}," % (
            k, k, v['w'], v['h'], v['dx'], v['dy'], pl['slot'], pl.get('sink', 0),
            pl.get('k', 1), pl.get('ox', 0), pl.get('oy', 0)))
    A = ['  %s:{ex:%s,ey:%s,ed:%s,ht:%s},' % (k, v['ex'], v['ey'], v['ed'], v['ht'])
         for k, v in sorted(shapes.items())]
    txt = ('"use strict";\n'
           '/* ============================================================\n'
           '   wear.js — ตำแหน่งวาง "ชุดที่ใส่" ทับภาพน้องท่าอื่น (รอบ 666)\n'
           '   ⛔ ไฟล์นี้เจนอัตโนมัติด้วย `python tools/wearlab.py cut` ห้ามแก้มือ (โดนทับ)\n'
           '   ทุกค่าเป็น "สัดส่วนของด้านภาพ" (ภาพน้องเป็นจัตุรัส 768x768 ทุกใบ)\n'
           '     WEAR_PIECE  ชิ้นชุดที่ตัดเป็น PNG โปร่ง · w/h/dx/dy = หน่วยระยะห่างตา\n'
           '                 s=head วางยึดยอดหัว (sk=จมลงในหัวกี่ % ของความสูงชิ้น) · s=eye ยึดเส้นตา\n'
           '     WEAR_ANCHOR หมุดของภาพเป้าหมาย: ex,ey=กึ่งกลางตา · ed=ระยะห่างตา · ht=ยอดหัว\n'
           '   ============================================================ */\n'
           'const WEAR_PIECE = {\n' + '\n'.join(L) + '\n};\n'
           'const WEAR_ANCHOR = {\n' + '\n'.join(A) + '\n};\n')
    open(os.path.join(ROOT, 'js', 'data', 'wear.js'), 'w', encoding='utf-8').write(txt)


# ---------------------------------------------------------------- ประกอบดูด้วยตา
def compose(pet, target, item, size=768, tune=None):
    meta = json.load(open(os.path.join(SCRATCH, 'wear_meta.json')))
    w = meta['wear'].get(f'{pet}_{item}'); sh = meta['shape'].get(f'{pet}_{target}')
    if not w or not sh: return None
    base = load(f'{pet}_{target}').resize((size, size))
    lay = Image.open(os.path.join(OUT, f'{pet}_{item}.png')).convert('RGBA')
    ed = sh['ed'] * size
    pl = PLACE[item]
    t = dict(k=pl.get('k', 1.0), ox=pl.get('ox', 0.0), oy=pl.get('oy', 0.0)); t.update(tune or {})
    k, ox, oy = t['k'], t['ox'], t['oy']
    tw = max(1, int(round(w['w'] * ed * k))); th = max(1, int(round(w['h'] * ed * k)))
    lay = lay.resize((tw, th))
    if pl['slot'] == 'head':
        # หมวกยึด "ยอดหัว" ไม่ใช่เส้นตา — ระยะตา→ยอดหัวต่างกันมากระหว่างร่างอ้วน/ผอม/ล่ำ
        px = int(round(sh['ex'] * size - tw / 2 + ox * ed))
        py = int(round(sh['ht'] * size - th * (1 - pl['sink']) + oy * ed))
    else:
        px = int(round(sh['ex'] * size + (w['dx'] * k + ox) * ed))
        py = int(round(sh['ey'] * size + (w['dy'] * k + oy) * ed))
    base.alpha_composite(lay, (px, py))
    return base


def cmd_sheet():
    items = list(ITEMS)
    S = 150
    for pet in PETS:
        tg = [t for t in TARGETS if os.path.exists(os.path.join(IMG, f'{pet}_{t}.png'))]
        sheet = Image.new('RGB', (S * len(items), (S + 16) * len(tg)), (238, 238, 238))
        d = ImageDraw.Draw(sheet)
        for r, target in enumerate(tg):
            for c, item in enumerate(items):
                im = compose(pet, target, item, 512)
                x, y = c * S, r * (S + 16) + 16
                if im: sheet.paste(im.resize((S, S)).convert('RGB'), (x, y), im.resize((S, S)))
                d.text((x + 3, y - 13), f'{target.replace("adult_","")[:6]}·{item}', fill=(0, 0, 0))
        p = os.path.join(SCRATCH, f'sheet_{pet}.png'); sheet.save(p); print(p)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'eyes'
    {'eyes': cmd_eyes, 'cut': cmd_cut, 'sheet': cmd_sheet}[cmd]()
