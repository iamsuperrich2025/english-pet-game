# -*- coding: utf-8 -*-
"""slice_matching.py - ตัดแผ่นภาพสัตว์ img/matching/animal{1,2}.png เป็นการ์ดภาพเดี่ยว
(เอาเฉพาะ "รูปสัตว์" ตัดข้อความอังกฤษ/ไทยออก) -> img/matching/cards/a1_<key>.png / a2_<key>.png
+ เขียนดัชนี js/data/matchpics.js ให้เกม "จับคู่ภาพ" ใช้ (รอบ 977)
ใช้ซ้ำได้: python tools/slice_matching.py    (ไม่แตะไฟล์ต้นฉบับของผู้ใช้)
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'img', 'matching')
OUT = os.path.join(SRC, 'cards')

# กรอบการ์ด (ตรวจจากขอบประของการ์ดจริง - ดู handoff/TASKS.md รอบ 977)
COLS1 = [(7, 155), (170, 322), (337, 492), (507, 660), (675, 824), (839, 1000)]
ROWS1 = [(14, 195), (206, 393), (403, 592), (601, 789), (798, 969),
         (977, 1135), (1144, 1282), (1289, 1417), (1424, 1534)]
COLS2 = [(5, 126), (130, 252), (256, 379), (383, 506),
         (510, 633), (637, 761), (763, 888), (890, 1014)]
ROWS2 = [(15, 144), (158, 280), (295, 419), (432, 557), (570, 694), (707, 825),
         (838, 958), (971, 1088), (1101, 1200), (1212, 1306), (1317, 1410), (1423, 1522)]

# ชื่อสัตว์เรียงตามแผ่น (อังกฤษ, ไทย)
SHEET1 = [
    ('Cat', 'แมว'), ('Dog', 'สุนัข'), ('Cow', 'วัว'), ('Bird', 'นก'), ('Chicken', 'ไก่'), ('Duck', 'เป็ด'),
    ('Elephant', 'ช้าง'), ('Lion', 'สิงโต'), ('Tiger', 'เสือ'), ('Bear', 'หมี'), ('Panda', 'แพนด้า'), ('Rabbit', 'กระต่าย'),
    ('Goat', 'แพะ'), ('Sheep', 'แกะ'), ('Horse', 'ม้า'), ('Zebra', 'ม้าลาย'), ('Giraffe', 'ยีราฟ'), ('Deer', 'กวาง'),
    ('Monkey', 'ลิง'), ('Squirrel', 'กระรอก'), ('Fox', 'สุนัขจิ้งจอก'), ('Wolf', 'หมาป่า'), ('Hedgehog', 'เม่น'), ('Bat', 'ค้างคาว'),
    ('Turtle', 'เต่า'), ('Frog', 'กบ'), ('Crocodile', 'จระเข้'), ('Snake', 'งู'), ('Lizard', 'จิ้งจก'), ('Chameleon', 'กิ้งก่า'),
    ('Dolphin', 'โลมา'), ('Whale', 'วาฬ'), ('Shark', 'ฉลาม'), ('Seal', 'แมวน้ำ'), ('Octopus', 'ปลาหมึกยักษ์'), ('Jellyfish', 'แมงกะพรุน'),
    ('Goldfish', 'ปลาทอง'), ('Clownfish', 'ปลาการ์ตูน'), ('Starfish', 'ปลาดาว'), ('Seahorse', 'ม้าน้ำ'), ('Crab', 'ปู'), ('Lobster', 'กุ้งล็อบสเตอร์'),
    ('Pig', 'หมู'), ('Buffalo', 'ควาย'), ('Donkey', 'ลา'), ('Camel', 'อูฐ'), ('Rooster', 'ไก่ตัวผู้'), ('Turkey', 'ไก่งวง'),
    ('Hamster', 'แฮมสเตอร์'), ('Guinea Pig', 'หนูตะเภา'), ('Parrot', 'นกแก้ว'), ('Peacock', 'นกยูง'), ('Bee', 'ผึ้ง'), ('Butterfly', 'ผีเสื้อ'),
]
SHEET2 = [
    ('Lion', 'สิงโต'), ('Elephant', 'ช้าง'), ('Giraffe', 'ยีราฟ'), ('Zebra', 'ม้าลาย'), ('Panda', 'แพนด้า'), ('Koala', 'โคอาลา'), ('Bear', 'หมี'), ('Tiger', 'เสือ'),
    ('Leopard', 'เสือดาว'), ('Cheetah', 'ชีตาห์'), ('Wolf', 'หมาป่า'), ('Fox', 'สุนัขจิ้งจอก'), ('Raccoon', 'แรคคูน'), ('Squirrel', 'กระรอก'), ('Hedgehog', 'เม่น'), ('Otter', 'นาก'),
    ('Rabbit', 'กระต่าย'), ('Monkey', 'ลิง'), ('Gorilla', 'กอริลลา'), ('Sloth', 'สลอธ'), ('Kangaroo', 'จิงโจ้'), ('Gibbon', 'ชะนี'), ('Chipmunk', 'ชิปมังก์'), ('Porcupine', 'เม่นแคระ'),
    ('Horse', 'ม้า'), ('Donkey', 'ลา'), ('Pony', 'โพนี่'), ('Cow', 'วัว'), ('Buffalo', 'ควาย'), ('Yak', 'จามรี'), ('Goat', 'แพะ'), ('Sheep', 'แกะ'),
    ('Pig', 'หมู'), ('Boar', 'หมูป่า'), ('Camel', 'อูฐ'), ('Llama', 'ลามะ'), ('Alpaca', 'อัลปากา'), ('Dog', 'สุนัข'), ('Cat', 'แมว'), ('Hamster', 'แฮมสเตอร์'),
    ('Guinea Pig', 'หนูตะเภา'), ('Chinchilla', 'ชินชิลลา'), ('Parrot', 'นกแก้ว'), ('Macaw', 'มาคอว์'), ('Cockatoo', 'ค็อกคาทู'), ('Lovebird', 'เลิฟเบิร์ด'), ('Finch', 'ฟินช์'), ('Canary', 'คานารี'),
    ('Owl', 'นกฮูก'), ('Eagle', 'นกอินทรี'), ('Duck', 'เป็ด'), ('Goose', 'ห่าน'), ('Swan', 'หงส์'), ('Peacock', 'นกยูง'), ('Pigeon', 'นกพิราบ'), ('Woodpecker', 'นกหัวขวาน'),
    ('Crocodile', 'จระเข้'), ('Alligator', 'อัลลิเกเตอร์'), ('Turtle', 'เต่า'), ('Tortoise', 'เต่ายักษ์'), ('Snake', 'งู'), ('Lizard', 'จิ้งจก'), ('Chameleon', 'กิ้งก่า'), ('Frog', 'กบ'),
    ('Toad', 'คางคก'), ('Gecko', 'ตุ๊กแก'), ('Iguana', 'อีกัวนา'), ('Tree Frog', 'กบต้นไม้'), ('Grasshopper', 'ตั๊กแตน'), ('Dragonfly', 'แมลงปอ'), ('Butterfly', 'ผีเสื้อ'), ('Ladybug', 'เต่าทอง'),
    ('Ant', 'มด'), ('Bee', 'ผึ้ง'), ('Wasp', 'ตัวต่อ'), ('Beetle', 'ด้วง'), ('Scorpion', 'แมงป่อง'), ('Snail', 'หอยทาก'), ('Spider', 'แมงมุม'), ('Centipede', 'ตะขาบ'),
    ('Shark', 'ฉลาม'), ('Dolphin', 'โลมา'), ('Whale', 'วาฬ'), ('Orca', 'วาฬเพชฌฆาต'), ('Seal', 'แมวน้ำ'), ('Sea Lion', 'สิงโตทะเล'), ('Octopus', 'ปลาหมึกยักษ์'), ('Squid', 'ปลาหมึก'),
    ('Starfish', 'ปลาดาว'), ('Jellyfish', 'แมงกะพรุน'), ('Clownfish', 'ปลาการ์ตูน'), ('Seahorse', 'ม้าน้ำ'), ('Oyster', 'หอยนางรม'), ('Angelfish', 'ปลานางฟ้า'), ('Goldfish', 'ปลาทอง'), ('Stingray', 'ปลากระเบน'),
]

ART_FRAC = 0.64      # ส่วนบนของการ์ด = รูป (ที่เหลือเป็นตัวอักษร)
SIZE = 200           # ขนาดไฟล์ผลลัพธ์ (จัตุรัส)


def key_of(en):
    return en.lower().replace(' ', '_')


def trim(im):
    """ตัดขอบขาวรอบรูป"""
    px = im.load()
    w, h = im.size
    x0, y0, x1, y1 = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if 255 - min(r, g, b) > 18:
                if x < x0: x0 = x
                if x > x1: x1 = x
                if y < y0: y0 = y
                if y > y1: y1 = y
    if x1 < x0:
        return None
    return (x0, y0, x1 + 1, y1 + 1)


def slice_sheet(fname, cols, rows, names, prefix, report):
    im = Image.open(os.path.join(SRC, fname)).convert('RGB')
    i = 0
    for (ry0, ry1) in rows:
        ch = ry1 - ry0
        for (cx0, cx1) in cols:
            en, th = names[i]
            i += 1
            # เผื่อขอบเข้ามา 9px กันเส้นประของการ์ดติดมาในภาพ
            art = im.crop((cx0 + 9, ry0 + 9, cx1 - 8, ry0 + int(ch * ART_FRAC)))
            bb = trim(art)
            if not bb:
                report.append('!! empty: %s %s' % (prefix, en))
                continue
            art = art.crop(bb)
            w, h = art.size
            side = int(max(w, h) * 1.10)
            canv = Image.new('RGB', (side, side), (255, 255, 255))
            canv.paste(art, ((side - w) // 2, (side - h) // 2))
            canv = canv.resize((SIZE, SIZE), Image.LANCZOS)
            canv = canv.convert('P', palette=Image.ADAPTIVE, colors=128)
            canv.save(os.path.join(OUT, '%s_%s.png' % (prefix, key_of(en))), optimize=True)
            report.append('%s_%-12s %3dx%-3d' % (prefix, key_of(en), w, h))


def main():
    os.makedirs(OUT, exist_ok=True)
    rep = []
    slice_sheet('animal1.png', COLS1, ROWS1, SHEET1, 'a1', rep)
    slice_sheet('animal2.png', COLS2, ROWS2, SHEET2, 'a2', rep)

    # ---- ดัชนี: เอาเฉพาะสัตว์ที่ "มีทั้ง 2 แผ่น" (จับคู่ภาพ 2 ลายเส้นของสัตว์ตัวเดียวกัน) ----
    order1 = [key_of(e) for e, _ in SHEET1]
    k1 = dict((key_of(en), (en, th)) for en, th in SHEET1)
    k2 = dict((key_of(en), (en, th)) for en, th in SHEET2)
    both = sorted([k for k in k1 if k in k2], key=order1.index)
    rows = ',\n'.join("  ['%s','%s','%s']" % (k, k1[k][0], k1[k][1]) for k in both)
    js = ("/* matchpics.js - คลังภาพเกมจับคู่ภาพ (รอบ 977)\n"
          "   เจนอัตโนมัติจาก tools/slice_matching.py - ห้ามแก้มือ\n"
          "   [key, English, ไทย] * ภาพ 2 ลายเส้นของสัตว์ตัวเดียวกัน:\n"
          "   img/matching/cards/a1_<key>.png (ซ้าย) * a2_<key>.png (ขวา) */\n"
          "const MATCH_PICS = [\n%s\n];\n" % rows)
    with open(os.path.join(ROOT, 'js', 'data', 'matchpics.js'), 'w', encoding='utf-8') as f:
        f.write(js)
    print('\n'.join(rep))
    print('--- cards %d files - both sheets = %d animals' % (len(SHEET1) + len(SHEET2), len(both)))
    print(both)


if __name__ == '__main__':
    main()
