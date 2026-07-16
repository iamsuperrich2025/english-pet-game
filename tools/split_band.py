# split_band.py — แยกไฟล์ก้อนรวมใน js/data/band/ เป็นไฟล์ช่วงคำอัตโนมัติ
#
# ไฟล์ก้อนรวม (เช่น b6_academic.json) = array ของคู่ ["word","คำแปล"]
# (รองรับหลาย JSON array ต่อกันในไฟล์เดียว — เจอจริงใน b6_academic.json)
# ไฟล์แยก (เช่น b6_academic_abandon-bias.js) = array เดียว บรรทัดละ 5 คู่
#
# พฤติกรรม: อ่านก้อนรวม → ตัดคำที่มีอยู่แล้วในไฟล์แยกของ base เดียวกัน (กันซ้ำ
# กับที่ผู้ใช้แยกมือไว้) → เรียง a-z → หั่นเป็นก้อนละ N คำ → เขียนไฟล์
# {base}_{คำแรก}-{คำสุดท้าย}.js · ไม่ทับไฟล์เดิม (ชนชื่อ = ข้าม+เตือน)
#
# ใช้:  python tools/split_band.py js/data/band/b6_academic.json
#       python tools/split_band.py --all              # ทุกไฟล์ก้อนรวมในโฟลเดอร์
#       ตัวเลือก: --size 75 · --lower (บังคับคำอังกฤษเป็นตัวเล็ก) · --dry-run
import argparse, json, re, sys
from pathlib import Path

BAND_DIR = Path(__file__).resolve().parent.parent / 'js' / 'data' / 'band'
SPLIT_RE = re.compile(r'^(?P<base>.+)_[^_]+-[^_]+\.js$')  # มีช่วงคำ _a-b ต่อท้าย
PER_LINE = 5

def parse_pairs(path: Path):
    """อ่านไฟล์เป็นลิสต์คู่ [en, th] — รองรับหลาย JSON array ต่อกัน"""
    s = path.read_text(encoding='utf-8').strip()
    dec, i, pairs = json.JSONDecoder(), 0, []
    while i < len(s):
        val, j = dec.raw_decode(s, i)
        if not isinstance(val, list):
            raise ValueError(f'{path.name}: ไม่ใช่ array ที่ตำแหน่ง {i}')
        pairs.extend(val)
        while j < len(s) and s[j] in ' \r\n\t,':
            j += 1
        i = j
    bad = [x for x in pairs if not (isinstance(x, list) and len(x) == 2
                                    and all(isinstance(y, str) for y in x))]
    if bad:
        raise ValueError(f'{path.name}: มี {len(bad)} รายการไม่ใช่คู่ [en, th] เช่น {bad[0]!r}')
    return pairs

def covered_words(base: str):
    """คำอังกฤษ (casefold) ที่อยู่ในไฟล์แยกของ base นี้แล้ว"""
    words, files = set(), []
    for p in sorted(BAND_DIR.glob(f'{base}_*.js')):
        if not SPLIT_RE.match(p.name):
            continue
        for en, _ in parse_pairs(p):
            words.add(en.casefold())
        files.append(p.name)
    return words, files

def slug(word: str):
    """คำแรก/คำสุดท้ายสำหรับตั้งชื่อไฟล์ — ตัวเล็ก เหลือ a-z0-9"""
    return re.sub(r'[^a-z0-9]+', '', word.casefold()) or 'x'

def render(pairs):
    lines = []
    for i in range(0, len(pairs), PER_LINE):
        row = ', '.join(json.dumps(p, ensure_ascii=False) for p in pairs[i:i + PER_LINE])
        lines.append('  ' + row)
    return '[\n' + ',\n'.join(lines) + '\n]\n'

def split_file(bulk: Path, size: int, lower: bool, dry: bool):
    base = bulk.stem
    pairs = parse_pairs(bulk)
    if lower:
        pairs = [[en.lower(), th] for en, th in pairs]
    done, done_files = covered_words(base)
    todo, seen = [], set()
    for en, th in pairs:
        k = en.casefold()
        if k in done or k in seen:   # ตัดที่แยกแล้ว + กันซ้ำในก้อนรวมเอง
            continue
        seen.add(k)
        todo.append([en, th])
    todo.sort(key=lambda p: p[0].casefold())
    print(f'📦 {bulk.name}: {len(pairs)} คู่ · แยกแล้ว {len(pairs) - len(todo)} '
          f'(ในไฟล์เดิม {len(done_files)} ไฟล์) · เหลือแยก {len(todo)}')
    written = 0
    for i in range(0, len(todo), size):
        chunk = todo[i:i + size]
        out = BAND_DIR / f'{base}_{slug(chunk[0][0])}-{slug(chunk[-1][0])}.js'
        if out.exists():
            print(f'  ⚠️ ข้าม (มีอยู่แล้ว): {out.name}')
            continue
        if dry:
            print(f'  [dry-run] {out.name}  ({len(chunk)} คำ)')
        else:
            out.write_text(render(chunk), encoding='utf-8')
            print(f'  ✅ {out.name}  ({len(chunk)} คำ)')
        written += 1
    if not todo:
        print('  🎉 แยกครบหมดแล้ว ไม่มีคำเหลือ')
    return written

def main():
    ap = argparse.ArgumentParser(description='แยกไฟล์ก้อนรวม band เป็นไฟล์ช่วงคำ')
    ap.add_argument('files', nargs='*', help='ไฟล์ก้อนรวม (.json)')
    ap.add_argument('--all', action='store_true', help='ทุกไฟล์ .json ใน js/data/band/')
    ap.add_argument('--size', type=int, default=75, help='จำนวนคำต่อไฟล์ (default 75)')
    ap.add_argument('--lower', action='store_true', help='บังคับคำอังกฤษเป็นตัวเล็ก')
    ap.add_argument('--dry-run', action='store_true', help='โชว์แผน ไม่เขียนไฟล์')
    a = ap.parse_args()
    if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    targets = [Path(f) for f in a.files]
    if a.all:
        targets += sorted(BAND_DIR.glob('*.json'))
    if not targets:
        ap.error('ระบุไฟล์ หรือใช้ --all')
    total = 0
    for t in targets:
        total += split_file(t, a.size, a.lower, a.dry_run)
    print(f'\n{"จะเขียน" if a.dry_run else "เขียนแล้ว"} {total} ไฟล์')

if __name__ == '__main__':
    main()
