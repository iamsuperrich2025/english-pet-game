# gen_band_adv_manifest.py — สแกน js/data/band/*.js (ไฟล์แยกช่วงคำ) แล้วเจน
# js/data/band/manifest.js (BAND_ADV_MANIFEST) ให้ js/bandadv.js โหลดคำแบบขี้เกียจ
#
# กติกาเดียวกับ tools/split_band.py: อ่านเฉพาะไฟล์แยกช่วงคำ _<คำแรก>-<คำสุดท้าย>.js
# ห้ามอ่านไฟล์ก้อนรวม .json (data ทั้งก้อนยังไม่แยก)
#
# label/emoji ต่อ base ต้องแก้มือถ้าเพิ่มหมวดใหม่ (ไม่รู้ชื่อไทยที่เหมาะจากชื่อไฟล์เอง)
#
# ใช้: python tools/gen_band_adv_manifest.py
import json, re, sys
from pathlib import Path

# คอนโซล Windows ดีฟอลต์เป็น cp1252 — พิมพ์ข้อความไทยแล้ว UnicodeEncodeError ตายกลางคัน
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

BAND_DIR = Path(__file__).resolve().parent.parent / 'js' / 'data' / 'band'
OUT = BAND_DIR / 'manifest.js'
SPLIT_RE = re.compile(r'^(?P<base>.+)_[^_]+-[^_]+\.js$')

# หมวดที่รู้จักแล้ว — เพิ่มหมวดใหม่ที่นี่เวลามีไฟล์ b6_<ชื่อ>_*.js เพิ่ม
LABELS = {
    'b6_academic': {'label': 'ศัพท์วิชาการ', 'emoji': '🎓'},
    'b6_business': {'label': 'ศัพท์ธุรกิจ', 'emoji': '💼'},
    'b6_science': {'label': 'ศัพท์วิทยาศาสตร์', 'emoji': '🔬'},
    'b6_travel': {'label': 'ศัพท์ท่องเที่ยว', 'emoji': '✈️'},
    'b6_medical': {'label': 'ศัพท์การแพทย์', 'emoji': '⚕️'},
    'b6_legal': {'label': 'ศัพท์กฎหมาย', 'emoji': '⚖️'},
    'b6_it': {'label': 'ศัพท์เทคโนโลยี-IT', 'emoji': '💻'},
    'b6_environment': {'label': 'ศัพท์สิ่งแวดล้อม', 'emoji': '🌍'},
    'b6_sports': {'label': 'ศัพท์กีฬา', 'emoji': '⚽'},
}

def main():
    bases = {}   # base -> list of {f, n}
    for p in sorted(BAND_DIR.glob('*.js')):
        m = SPLIT_RE.match(p.name)
        if not m:
            continue
        base = m.group('base')
        pairs = json.loads(p.read_text(encoding='utf-8'))
        bases.setdefault(base, []).append({'f': p.name, 'n': len(pairs)})

    if not bases:
        print('ไม่พบไฟล์แยกช่วงคำใน js/data/band/', file=sys.stderr)
        sys.exit(1)

    missing = [b for b in bases if b not in LABELS]
    if missing:
        print(f'⚠️ หมวดใหม่ยังไม่มี label/emoji ใน LABELS: {missing} — เพิ่มในสคริปต์นี้ก่อนรัน', file=sys.stderr)
        sys.exit(1)

    manifest = {}
    for base, files in bases.items():
        info = LABELS[base]
        manifest[base.removeprefix('b6_')] = {
            'label': info['label'],
            'emoji': info['emoji'],
            'count': sum(f['n'] for f in files),
            'files': files,
        }

    body = json.dumps(manifest, ensure_ascii=False, indent=2)
    js = ('"use strict";\n'
          '/* BAND_ADV manifest — เจนโดย tools/gen_band_adv_manifest.py ห้ามแก้มือ\n'
          '   คลังศัพท์ขั้นสูงแยกหมวด (js/data/band/) — ไม่ผูกชั้นเรียนเหมือน DICT_BAND เปิดเล่นได้ทุกคน\n'
          '   entry เก็บแค่ [en, th] (ไม่มี pos/ipa/ตัวอย่าง) · js/bandadv.js โหลดไฟล์ตาม files[] แบบขี้เกียจ */\n'
          f'const BAND_ADV_MANIFEST = {body};\n')
    OUT.write_text(js, encoding='utf-8')
    total = sum(v['count'] for v in manifest.values())
    print(f'เขียน {OUT} — {len(manifest)} หมวด รวม {total} คำ')
    for k, v in manifest.items():
        print(f"  {k}: {v['count']} คำ ({len(v['files'])} ไฟล์)")

if __name__ == '__main__':
    main()
