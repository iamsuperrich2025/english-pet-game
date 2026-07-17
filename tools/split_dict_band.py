# split_dict_band.py — แปลงคลัง dict 57 ไฟล์ → ไฟล์ช่วงคำแยกตาม band 1-5 (ป.1–ม.6)
#
# ทำอะไร: อ่าน js/data/dict/dict_*.js ทั้งหมด (entry 8 ช่อง: [en,pos,ipa,คำอ่าน,
# นิยามEN,แปลTH,ตัวอย่างEN,แปลตัวอย่าง] · บางรอบเจนมา 6 ช่อง = เติม "" ให้ครบ 8)
# → ตัดคำซ้ำ (เก็บ entry ที่ข้อมูลครบกว่า) → จัดระดับ band 1-5:
#   1) คำแกนจาก js/data/vocab.js (VOCAB_BANDS — เกมจัดระดับไว้แล้ว) ปักหมุดตรงๆ
#   2) คำที่เหลือเรียงตามความถี่คำ (wordfreq zipf: คำยิ่งพบบ่อย=ยิ่งง่าย)
#      แบ่งตามสัดส่วน default 10/15/20/25/30% (band1→5)
# → เขียน js/data/dict_band/: manifest.js (ไฟล์จิ๋ว โหลดตอนบูต/ให้ Claude อ่าน)
#   + ชิ้นละ ~75 คำ ชื่อ db<band>_<คำแรก>-<คำสุดท้าย>.js (โหลดขี้เกียจรายไฟล์)
#
# ใช้:  python tools/split_dict_band.py            (เขียนจริง)
#       python tools/split_dict_band.py --dry-run  (โชว์แผน+สถิติ ไม่เขียน)
#       ตัวเลือก: --size 75 · --props 10,15,20,25,30
# ต้องมี: pip install wordfreq
import argparse, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DICT_DIR = ROOT / 'js' / 'data' / 'dict'
OUT_DIR = ROOT / 'js' / 'data' / 'dict_band'
VOCAB_JS = ROOT / 'js' / 'data' / 'vocab.js'
FIELDS = 8
BAND_LABEL = {1: 'ป.1–ป.2', 2: 'ป.3–ป.4', 3: 'ป.5–ป.6', 4: 'ม.1–ม.3', 5: 'ม.4–ม.6'}

def load_dict_entries():
    """รวม entry จาก dict_*.js ทุกไฟล์ · เติมช่องให้ครบ 8 · ตัดซ้ำเก็บตัวครบกว่า"""
    best, order, dup = {}, [], 0
    for p in sorted(DICT_DIR.glob('dict_*.js')):
        m = re.search(r'DICT_FILES\.push\((\[.*\])\);', p.read_text(encoding='utf-8'), re.S)
        if not m:
            print(f'⚠️ ข้าม (parse ไม่ได้): {p.name}'); continue
        for e in json.loads(m.group(1)):
            e = (e + [''] * FIELDS)[:FIELDS]
            k = e[0].casefold().strip()
            if not k:
                continue
            if k in best:
                dup += 1
                if sum(1 for x in e if x) > sum(1 for x in best[k] if x):
                    best[k] = e          # ตัวใหม่ข้อมูลครบกว่า
            else:
                best[k] = e; order.append(k)
    return [best[k] for k in order], dup

def load_anchors():
    """คำแกน {word_casefold: band} จาก VOCAB_BANDS (vocab.js) + vocab/band*.js"""
    anchors = {}
    srcs = [VOCAB_JS] + sorted((ROOT / 'js' / 'data' / 'vocab').glob('band*.js'))
    for src in srcs:
        blocks = re.split(r'\{band:\s*(\d+)', src.read_text(encoding='utf-8'))
        for i in range(1, len(blocks), 2):
            band = int(blocks[i])
            if not 1 <= band <= 5:
                continue
            for en in re.findall(r"\['([^']+)','[^']*'\]", blocks[i + 1]):
                anchors.setdefault(en.casefold(), band)
    return anchors

def zipf(word):
    from wordfreq import zipf_frequency
    z = zipf_frequency(word, 'en')
    if z == 0 and ' ' in word:   # วลี: ใช้คำที่หายากสุดในวลีแทน
        zs = [zipf_frequency(w, 'en') for w in word.split()]
        z = min(zs) if zs else 0
    return z

def assign_bands(entries, anchors, props):
    """คืน {word_casefold: band} — แกนปักหมุด · ที่เหลือแบ่งตามความถี่+สัดส่วน"""
    bands, rest = {}, []
    for e in entries:
        k = e[0].casefold()
        if k in anchors:
            bands[k] = anchors[k]
        else:
            rest.append(k)
    rest.sort(key=lambda k: -zipf(k))            # บ่อยสุด(ง่าย)ก่อน
    quota = [round(len(rest) * p / sum(props)) for p in props]
    quota[-1] = len(rest) - sum(quota[:-1])
    i = 0
    for band, q in enumerate(quota, start=1):
        for k in rest[i:i + q]:
            bands[k] = band
        i += q
    return bands

def slug(word):
    return re.sub(r'[^a-z0-9]+', '', word.casefold()) or 'x'

def write_outputs(entries, bands, size, dry):
    OUT_DIR.mkdir(exist_ok=True)
    manifest, nfiles = {}, 0
    for band in range(1, 6):
        group = sorted((e for e in entries if bands[e[0].casefold()] == band),
                       key=lambda e: e[0].casefold())
        manifest[band] = {'label': BAND_LABEL[band], 'count': len(group), 'files': []}
        for i in range(0, len(group), size):
            chunk = group[i:i + size]
            name = f'db{band}_{slug(chunk[0][0])}-{slug(chunk[-1][0])}.js'
            manifest[band]['files'].append({'f': name, 'n': len(chunk),
                                            'from': chunk[0][0], 'to': chunk[-1][0]})
            if not dry:
                rows = ',\n'.join(json.dumps(e, ensure_ascii=False) for e in chunk)
                (OUT_DIR / name).write_text(
                    '"use strict";\n'
                    f'/* DICT_BAND band {band} ({BAND_LABEL[band]}) — คำ: {chunk[0][0]} ถึง {chunk[-1][0]} '
                    f'({len(chunk)} คำ · ช่อง: en,pos,ipa,คำอ่าน,นิยามEN,แปลTH,ตัวอย่างEN,แปลตัวอย่าง) */\n'
                    f'DICT_BAND.push({{band:{band},words:[\n{rows}\n]}});\n', encoding='utf-8')
            nfiles += 1
    if not dry:
        (OUT_DIR / 'manifest.js').write_text(
            '"use strict";\n'
            '/* DICT_BAND manifest — เจนโดย tools/split_dict_band.py ห้ามแก้มือ\n'
            '   เกมโหลดไฟล์นี้ตอนบูต แล้วค่อยโหลดชิ้น db<band>_*.js ขี้เกียจตามที่ใช้\n'
            '   Claude: อ่านไฟล์นี้แทนไฟล์ข้อมูล — ไฟล์ db*_a-b.js เปิดเฉพาะช่วงคำที่จำเป็น */\n'
            'const DICT_BAND = [];\n'
            'const DICT_BAND_MANIFEST = '
            + json.dumps(manifest, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
    return manifest, nfiles

def main():
    ap = argparse.ArgumentParser(description='แยก dict 57 ไฟล์เป็นไฟล์ช่วงคำตาม band 1-5')
    ap.add_argument('--size', type=int, default=75)
    ap.add_argument('--props', default='10,15,20,25,30', help='สัดส่วน band1-5 (%%)')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    props = [float(x) for x in a.props.split(',')]
    assert len(props) == 5, '--props ต้องมี 5 ค่า'
    entries, dup = load_dict_entries()
    anchors = load_anchors()
    hit = sum(1 for e in entries if e[0].casefold() in anchors)
    print(f'📖 dict: {len(entries)} คำไม่ซ้ำ (ตัดซ้ำ {dup}) · คำแกน vocab.js: {len(anchors)} '
          f'(อยู่ใน dict {hit})')
    bands = assign_bands(entries, anchors, props)
    manifest, nfiles = write_outputs(entries, bands, a.size, a.dry_run)
    for b in range(1, 6):
        m = manifest[b]
        ex = [f['from'] for f in m['files'][:3]]
        print(f'  band {b} ({m["label"]}): {m["count"]} คำ · {len(m["files"])} ไฟล์ · เริ่ม: {", ".join(ex)}')
    print(f'{"[dry-run] จะเขียน" if a.dry_run else "✅ เขียนแล้ว"} {nfiles} ไฟล์ + manifest.js → {OUT_DIR}')

if __name__ == '__main__':
    main()
