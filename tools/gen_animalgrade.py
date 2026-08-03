# -*- coding: utf-8 -*-
"""
gen_animalgrade.py — เจน js/data/animalgrade.js (ตารางระดับชั้นของสัตว์ในเกมจับคู่ภาพ, รอบ 980)
ใช้กรองคลังสัตว์ (MATCH_PICS/MATCH_WORDS) ตามระดับชั้นผู้เล่นใน js/picmatch.js (bank())

ระดับ 1 = ป.1-2 (สัตว์คุ้นเคยที่สุด) · 2 = ป.3-4 (เพิ่มสัตว์ทั่วไป) · 3 = ป.5 ขึ้นไป (ครบทุกตัว รวมตัวหายาก)
กรองแบบสะสม (tier N เห็นสัตว์ tier<=N ทั้งหมด) — ระดับสูงไม่มีวันเห็นน้อยกว่าเดิม

วิธีใช้: python tools/gen_animalgrade.py
- อ่านคีย์จริงจาก js/data/matchwords.js (คลังใหญ่สุด ครอบคลุมทุกตัวรวม MATCH_PICS) มาเทียบว่า
  TIER1/TIER2 ด้านล่างไม่มีคีย์พิมพ์ผิด/ซ้ำ · คีย์ที่เหลือทั้งหมดตกเป็น tier 3 อัตโนมัติ (กันตกหล่น)
- เขียน js/data/animalgrade.js ทับ
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MATCHWORDS = ROOT / "js" / "data" / "matchwords.js"
OUT = ROOT / "js" / "data" / "animalgrade.js"

TIER1 = [  # ป.1-2 — สัตว์คุ้นเคยที่สุด เห็นในชีวิตประจำวัน/นิทานเด็กเป็นประจำ
    'bear', 'bee', 'bird', 'butterfly', 'cat', 'chicken', 'cow', 'dog', 'duck', 'elephant',
    'fox', 'frog', 'goat', 'horse', 'monkey', 'pig', 'rabbit', 'sheep', 'snake', 'tiger', 'turtle', 'zebra',
]
TIER2 = [  # ป.3-4 — เพิ่มสัตว์ทั่วไปที่รู้จักแต่ไม่ได้เจอบ่อยเท่า tier1
    'ant', 'buffalo', 'camel', 'canary', 'chameleon', 'cheetah', 'clownfish', 'crab', 'crocodile', 'deer',
    'dolphin', 'donkey', 'eagle', 'giraffe', 'goldfish', 'goose', 'guinea_pig', 'hamster', 'hedgehog', 'jellyfish',
    'kangaroo', 'koala', 'leopard', 'lion', 'lizard', 'octopus', 'owl', 'panda', 'parrot', 'peacock',
    'pigeon', 'pony', 'rooster', 'seahorse', 'seal', 'shark', 'squirrel', 'starfish', 'swan', 'turkey', 'whale', 'wolf',
]
# tier 3 (ป.5 ขึ้นไป) = ทุกคีย์ใน matchwords.js ที่เหลือ (สัตว์หายาก/สะกดยาก) — ไม่ต้องพิมพ์เอง กันตกหล่น


def main():
    src = MATCHWORDS.read_text(encoding='utf-8')
    all_keys = re.findall(r"\['([a-z_]+)','[^']+','[^']+','a[12]'\]", src)
    if not all_keys:
        raise SystemExit("อ่านคีย์จาก matchwords.js ไม่ได้ (regex ไม่ match — ไฟล์เปลี่ยนฟอร์แมต?)")
    all_set = set(all_keys)

    for k in TIER1 + TIER2:
        if k not in all_set:
            raise SystemExit(f"key '{k}' ในตาราง tier ไม่มีใน matchwords.js (พิมพ์ผิด?)")
    dup = set(TIER1) & set(TIER2)
    if dup:
        raise SystemExit(f"key ซ้ำระหว่าง TIER1/TIER2: {sorted(dup)}")

    tier_of = {}
    for k in TIER1:
        tier_of[k] = 1
    for k in TIER2:
        tier_of[k] = 2
    for k in all_keys:
        tier_of.setdefault(k, 3)

    lines = [
        '"use strict";',
        '/* animalgrade.js - ตารางระดับชั้นของสัตว์ในเกมจับคู่ภาพ (รอบ 980)',
        '   เขียน/แก้ที่ tools/gen_animalgrade.py แล้วรันสคริปต์ใหม่ - ห้ามแก้ไฟล์นี้ตรงๆ',
        '   key -> tier (1=ป.1-2 · 2=ป.3-4 · 3=ป.5 ขึ้นไป) กรองแบบสะสม (tier สูงเห็นของ tier ต่ำด้วยเสมอ)',
        '   ใช้กรองคลังสัตว์ตามระดับชั้นผู้เล่นใน js/picmatch.js (bank()) */',
        'const ANIMAL_GRADE = {',
    ]
    for k in sorted(tier_of):
        lines.append(f"  {k}:{tier_of[k]},")
    lines.append('};')
    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    t1, t2, t3 = len(TIER1), len(TIER2), len(all_set) - len(TIER1) - len(TIER2)
    print(f"wrote {OUT} · tier1={t1} tier2={t2}(cum {t1+t2}) tier3={t3}(cum {len(all_set)}) total={len(all_set)}")


if __name__ == '__main__':
    main()
