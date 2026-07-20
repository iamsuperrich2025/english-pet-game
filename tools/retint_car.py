# retint_car.py — ย้อม texture รถโลกขับรถ (รอบ 393)
# แกะ texture ฝังใน img/models/car_01.glb (ตัวถังสีแดง = car_01 แดงสายฟ้า) แล้วย้อมเป็นสีรถโชว์รูมคัน 02-10
# → img/models/car_tex_02.jpg .. car_tex_10.jpg (โค้ดเกม clone material สลับ texture ต่อคัน — แพตเทิร์น helicopter_tex_blue รอบ 383)
# วิธีใช้: python tools/retint_car.py   (รันจากรากโปรเจกต์ · อย่าลืม commit ไฟล์ jpg ไม่งั้นไม่ขึ้นเว็บ)
import json, struct, io, colorsys, os
from PIL import Image

GLB = os.path.join('img', 'models', 'car_01.glb')
OUT = os.path.join('img', 'models')

# เป้าหมายสีต่อคัน (อิง c: ใน js/data/items.js = สีแคตตาล็อกโชว์รูม)
# mode: hue=ย้ายโทนสี · white=ลดสีเป็นขาวเงิน · dark=ทึบดำ · rainbow=พาสเทลไล่โทนตามตำแหน่ง texture
CARS = [
    ('02', '#42a5f5', 'hue'),      # ฟ้าใสซิ่ง
    ('03', '#66bb6a', 'hue'),      # เขียวธรรมชาติ
    ('04', '#fb8c00', 'hue'),      # ส้มเปลวไฟ
    ('05', '#f48fb1', 'hue'),      # ชมพูหวานใจ
    ('06', '#7e57c2', 'hue'),      # ม่วงกาแล็กซี่
    ('07', '#fdd835', 'hue'),      # เหลืองตาหมากรุก
    ('08', '#e8eef2', 'white'),    # ขาวหิมะ
    ('09', '#37474f', 'dark'),     # ดำนีออน
    ('10', '#ba68c8', 'rainbow'),  # รุ้งพาสเทล
]

def body_mask(h, s, v):
    # ตัวถังฐาน = โทนแดง อิ่มสี (ล้อดำ/กระจกฟ้า/โครเมียมเทา ไม่โดน)
    return s > .30 and v > .10 and (h < .10 or h > .90)

def main():
    d = open(GLB, 'rb').read()
    ln = struct.unpack('<I', d[12:16])[0]
    js = json.loads(d[20:20 + ln])
    off = 20 + ln
    bl = struct.unpack('<I', d[off:off + 4])[0]
    bin_ = d[off + 8:off + 8 + bl]
    bv = js['bufferViews'][js['images'][0]['bufferView']]
    tex = bin_[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]
    im = Image.open(io.BytesIO(tex)).convert('RGB')
    W, H = im.size
    px = im.load()

    # ค่าเฉลี่ย s,v ของตัวถังฐาน — ใช้สเกลให้เฉดเงา/ไฮไลต์เดิมคงอยู่
    ss = vv = n = 0
    for y in range(0, H, 4):
        for x in range(0, W, 4):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if body_mask(h, s, v):
                ss += s; vv += v; n += 1
    BS, BV = ss / n, vv / n
    print(f'base body: mean s={BS:.2f} v={BV:.2f} ({n} samples)')

    for cid, hexc, mode in CARS:
        tr = int(hexc[1:3], 16) / 255; tg = int(hexc[3:5], 16) / 255; tb = int(hexc[5:7], 16) / 255
        th, ts, tv = colorsys.rgb_to_hsv(tr, tg, tb)
        out = im.copy(); po = out.load()
        for y in range(H):
            for x in range(W):
                r, g, b = po[x, y]
                h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                if not body_mask(h, s, v):
                    continue
                if mode == 'white':
                    h2, s2, v2 = th, s * .12, min(1, v * 1.28 + .06)
                elif mode == 'dark':
                    h2, s2, v2 = th, s * .30, v * .34 + .02
                elif mode == 'rainbow':
                    h2 = ((x / W) * .9 + (y / H) * .35) % 1.0
                    s2, v2 = s * .45, min(1, v * 1.12 + .04)
                else:
                    h2 = th
                    s2 = min(1, s * ts / BS)
                    v2 = min(1, v * tv / BV)
                r2, g2, b2 = colorsys.hsv_to_rgb(h2, s2, v2)
                po[x, y] = (int(r2 * 255), int(g2 * 255), int(b2 * 255))
        f = os.path.join(OUT, f'car_tex_{cid}.jpg')
        out.save(f, quality=82)
        print(f, os.path.getsize(f) // 1024, 'KB')

if __name__ == '__main__':
    main()
