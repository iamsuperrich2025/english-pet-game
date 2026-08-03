# -*- coding: utf-8 -*-
"""
gen_matchwords.py — เจน js/data/matchwords.js (คลังคำสำหรับโหมด "จับคู่ภาพ-คำ" ในเกมจับคู่ภาพ)
ต่างจาก matchpics.js (เฉพาะ 46 ตัวที่มีภาพครบ 2 ลายเส้น) — ไฟล์นี้ครอบคลุม "ทุกตัว" ที่มีภาพอย่างน้อย 1 แผ่น
ใน img/matching/cards/ (104 ตัว) เพราะโหมดนี้ใช้ภาพแค่ 1 แผ่นต่อสัตว์ (จับคู่กับคำอังกฤษ ไม่ใช่จับคู่ภาพกับภาพ)

คำแปลไทยของ 46 ตัวที่มีอยู่แล้วดึงจาก js/data/matchpics.js ตรงๆ (ไม่พิมพ์ซ้ำมือ กันพลาด)
คำแปลของอีก 58 ตัว คีย์ไว้ในสคริปต์นี้เอง (เขียนมือ ทานทั้งหมดแล้ว) — ต่างจาก matchpics.js ที่ auto-gen
จากการตัดภาพ ไฟล์นี้จึงแก้มือ/เพิ่มคำใหม่ในสคริปต์นี้ได้ตรงๆ แล้วรันซ้ำ

วิธีใช้: python tools/gen_matchwords.py
- อ่านรายชื่อไฟล์จริงใน img/matching/cards/ กำหนด sheet (a1/a2) ต่อคำอัตโนมัติ (a1 ถ้ามี ไม่งั้น a2)
- เขียน js/data/matchwords.js ทับ (เรียงตามตัวอักษร key)
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS = ROOT / "img" / "matching" / "cards"
MATCHPICS = ROOT / "js" / "data" / "matchpics.js"
OUT = ROOT / "js" / "data" / "matchwords.js"

# [key, English, ไทย] — 58 ตัวที่ยังไม่มีในคลังคำเดิม (matchpics.js มีแค่ 46 ตัวที่ภาพครบ 2 แผ่น)
NEW_WORDS = [
    ['alligator','Alligator','อัลลิเกเตอร์'],
    ['alpaca','Alpaca','อัลปาก้า'],
    ['angelfish','Angelfish','ปลาเทวดา'],
    ['ant','Ant','มด'],
    ['bat','Bat','ค้างคาว'],
    ['beetle','Beetle','ด้วง'],
    ['bird','Bird','นก'],
    ['boar','Boar','หมูป่า'],
    ['canary','Canary','นกคานารี'],
    ['centipede','Centipede','ตะขาบ'],
    ['cheetah','Cheetah','เสือชีตาห์'],
    ['chicken','Chicken','ไก่'],
    ['chinchilla','Chinchilla','ชินชิลล่า'],
    ['chipmunk','Chipmunk','กระรอกชิพมังก์'],
    ['cockatoo','Cockatoo','นกกระตั้ว'],
    ['crab','Crab','ปู'],
    ['deer','Deer','กวาง'],
    ['dragonfly','Dragonfly','แมลงปอ'],
    ['eagle','Eagle','นกอินทรี'],
    ['finch','Finch','นกฟินช์'],
    ['gecko','Gecko','ตุ๊กแก'],
    ['gibbon','Gibbon','ชะนี'],
    ['goose','Goose','ห่าน'],
    ['gorilla','Gorilla','กอริลลา'],
    ['grasshopper','Grasshopper','ตั๊กแตน'],
    ['iguana','Iguana','อีกัวน่า'],
    ['kangaroo','Kangaroo','จิงโจ้'],
    ['koala','Koala','โคอาล่า'],
    ['ladybug','Ladybug','เต่าทอง'],
    ['leopard','Leopard','เสือดาว'],
    ['llama','Llama','ลามะ'],
    ['lobster','Lobster','กุ้งมังกร'],
    ['lovebird','Lovebird','นกเลิฟเบิร์ด'],
    ['macaw','Macaw','นกมาคอว์'],
    ['orca','Orca','วาฬเพชฌฆาต'],
    ['otter','Otter','นาก'],
    ['owl','Owl','นกฮูก'],
    ['oyster','Oyster','หอยนางรม'],
    ['pigeon','Pigeon','นกพิราบ'],
    ['pony','Pony','ม้าโพนี่'],
    ['porcupine','Porcupine','เม่นใหญ่'],
    ['raccoon','Raccoon','แรคคูน'],
    ['rooster','Rooster','ไก่ตัวผู้'],
    ['scorpion','Scorpion','แมงป่อง'],
    ['sea_lion','Sea Lion','สิงโตทะเล'],
    ['sloth','Sloth','สลอธ'],
    ['snail','Snail','หอยทาก'],
    ['spider','Spider','แมงมุม'],
    ['squid','Squid','ปลาหมึกกล้วย'],
    ['stingray','Stingray','ปลากระเบน'],
    ['swan','Swan','หงส์'],
    ['toad','Toad','คางคก'],
    ['tortoise','Tortoise','เต่าบก'],
    ['tree_frog','Tree Frog','กบต้นไม้'],
    ['turkey','Turkey','ไก่งวง'],
    ['wasp','Wasp','ตัวต่อ'],
    ['woodpecker','Woodpecker','นกหัวขวาน'],
    ['yak','Yak','จามรี'],
]

def sheets_on_disk():
    d = {}
    for f in CARDS.glob('a[12]_*.png'):
        sheet, key = f.stem.split('_', 1)
        d.setdefault(key, set()).add(sheet)
    return d

def parse_matchpics():
    src = MATCHPICS.read_text(encoding='utf-8')
    rows = re.findall(r"\['([a-z_]+)','([^']+)','([^']+)'\]", src)
    return rows

def main():
    disk = sheets_on_disk()
    existing = parse_matchpics()
    existing_keys = {r[0] for r in existing}

    entries = []
    for key, en, th in existing:
        if key not in disk:
            raise SystemExit(f"key '{key}' in matchpics.js has no card file on disk")
        sheet = 'a1' if 'a1' in disk[key] else 'a2'
        entries.append((key, en, th, sheet))

    seen_new = set()
    for key, en, th in NEW_WORDS:
        if key in existing_keys:
            raise SystemExit(f"key '{key}' duplicated: already in matchpics.js")
        if key in seen_new:
            raise SystemExit(f"key '{key}' duplicated in NEW_WORDS")
        seen_new.add(key)
        if key not in disk:
            raise SystemExit(f"key '{key}' has no card file on disk (typo?)")
        sheet = 'a1' if 'a1' in disk[key] else 'a2'
        entries.append((key, en, th, sheet))

    missing_on_disk = set(disk) - {e[0] for e in entries}
    if missing_on_disk:
        raise SystemExit(f"card files on disk not covered by any entry: {sorted(missing_on_disk)}")

    entries.sort(key=lambda e: e[0])

    lines = [
        '"use strict";',
        '/* matchwords.js - คลังคำสำหรับโหมด "จับคู่ภาพ-คำ" ในเกมจับคู่ภาพ (รอบ 978)',
        '   เขียน/แก้ที่ tools/gen_matchwords.py แล้วรันสคริปต์ใหม่ - ห้ามแก้ไฟล์นี้ตรงๆ',
        '   [key, English, ไทย, sheet] * ครอบคลุมสัตว์ทุกตัวที่มีภาพอย่างน้อย 1 แผ่น (104 ตัว)',
        '   sheet = a1|a2 บอกว่าใช้ภาพ img/matching/cards/<sheet>_<key>.png แผ่นไหนแสดง (โหมดนี้ใช้แค่ 1 ภาพ/คำ) */',
        'const MATCH_WORDS = [',
    ]
    for key, en, th, sheet in entries:
        lines.append(f"  ['{key}','{en}','{th}','{sheet}'],")
    lines.append('];')
    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f"wrote {OUT} · {len(entries)} entries")

if __name__ == '__main__':
    main()
