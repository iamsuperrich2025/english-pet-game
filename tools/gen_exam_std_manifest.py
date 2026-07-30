# -*- coding: utf-8 -*-
"""เจน js/data/exam/manifest.js จากไฟล์ชุดข้อสอบจริง js/data/exam/<exam>_<n>.json (รอบ 812)

ทำ 2 อย่างในตัวเดียว:
  ① ตรวจไฟล์ข้อสอบ (ผิดที่ไหน exit 1 พร้อมบอกไฟล์+ข้อ) — 4 ช้อยส์ทุกข้อ · a อยู่ในช่วง ·
     ห้ามช้อยส์ซ้ำข้อความ · ต้องมีเฉลย ex · total ตรงกับจำนวนข้อจริง · id ตรงชื่อไฟล์
  ② เขียน manifest.js (นับข้อ/ส่วน/บทอ่านให้เอง — ห้ามพิมพ์เลขมือ เดี๋ยวเพี้ยน)

วิธีใช้:  python tools/gen_exam_std_manifest.py
"""
import json, sys, glob, os, collections

try:                                   # console Windows เป็น cp1252 → อีโมจิ/ไทยพัง ต้องบังคับ utf-8
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR  = os.path.join(ROOT, 'js', 'data', 'exam')
OUT  = os.path.join(DIR, 'manifest.js')

# ป้ายหมวดสอบ (ไทย) + สีธีม/อีโมจิ — เพิ่มสนามสอบใหม่ให้เติมที่นี่ที่เดียว
EXAMS = {
  'ielts': {'emoji': '📘', 'label': 'IELTS Academic', 'sub': 'ไวยากรณ์ + การอ่านเชิงวิชาการ'},
  'toeic': {'emoji': '📗', 'label': 'TOEIC Reading', 'sub': 'ไวยากรณ์ + เอกสารธุรกิจ'},
  'toefl': {'emoji': '📙', 'label': 'TOEFL Structure & Reading', 'sub': 'โครงสร้างประโยค + บทอ่านวิชาการ'},
}

def die(msg):
    print('❌ ' + msg)
    sys.exit(1)

def main():
    sets = collections.defaultdict(list)
    files = sorted(glob.glob(os.path.join(DIR, '*.json')))
    if not files:
        die('ไม่เจอไฟล์ข้อสอบใน %s' % DIR)
    for path in files:
        fn = os.path.basename(path)
        with open(path, encoding='utf-8') as f:
            try:
                d = json.load(f)
            except Exception as e:
                die('%s อ่าน JSON ไม่ผ่าน: %s' % (fn, e))
        sid = d.get('id') or ''
        if sid + '.json' != fn:
            die('%s: id ในไฟล์ (%s) ไม่ตรงชื่อไฟล์' % (fn, sid))
        exam = d.get('exam')
        if exam not in EXAMS:
            die('%s: exam "%s" ไม่รู้จัก (เพิ่มใน EXAMS ของสคริปต์นี้ก่อน)' % (fn, exam))
        n, npass, secs = 0, 0, []
        for si, sec in enumerate(d.get('sections') or []):
            items = sec.get('items') or []
            if not items:
                die('%s section %d ไม่มีข้อสอบ' % (fn, si + 1))
            for ii, it in enumerate(items):
                where = '%s ส่วน %d ข้อ %d' % (fn, si + 1, ii + 1)
                ch = it.get('c') or []
                if len(ch) != 4:
                    die('%s: ต้องมี 4 ช้อยส์ (เจอ %d)' % (where, len(ch)))
                if len(set(map(str.strip, ch))) != 4:
                    die('%s: ช้อยส์ซ้ำข้อความกัน' % where)
                a = it.get('a')
                if not isinstance(a, int) or not (0 <= a < 4):
                    die('%s: เลขเฉลย a ต้องเป็น 0-3 (เจอ %r)' % (where, a))
                if not str(it.get('q') or '').strip():
                    die('%s: ไม่มีโจทย์ q' % where)
                if len(str(it.get('ex') or '').strip()) < 30:
                    die('%s: เฉลยละเอียด ex สั้นเกินไป (ต้องอธิบายว่าทำไมถูก/ทำไมข้ออื่นผิด)' % where)
            n += len(items)
            if sec.get('p'):
                npass += 1
            secs.append({'n': sec.get('n') or '', 'q': len(items), 'p': 1 if sec.get('p') else 0})
        if d.get('total') != n:
            die('%s: total=%r แต่นับข้อจริงได้ %d' % (fn, d.get('total'), n))
        sets[exam].append({'f': fn, 'id': sid, 'label': d.get('label') or sid,
                           'q': n, 'passages': npass, 'secs': secs})

    lines = ['/* เจนอัตโนมัติโดย tools/gen_exam_std_manifest.py — ห้ามแก้มือ (แก้ไฟล์ json แล้วรันสคริปต์ใหม่)',
             '   สารบัญชุดข้อสอบจริงแบบมาตรฐาน (รอบ 812) — ตัวข้อสอบโหลดขี้เกียจผ่าน fetch ใน js/examstd.js */',
             'const EXAM_STD_MANIFEST = {']
    for exam in EXAMS:
        if exam not in sets:
            continue
        meta = EXAMS[exam]
        ss = sorted(sets[exam], key=lambda s: s['id'])
        lines.append('  %s:{emoji:%s, label:%s, sub:%s, sets:[' % (
            exam, json.dumps(meta['emoji'], ensure_ascii=False),
            json.dumps(meta['label'], ensure_ascii=False), json.dumps(meta['sub'], ensure_ascii=False)))
        for s in ss:
            secs = ', '.join('{n:%s, q:%d, p:%d}' % (json.dumps(x['n'], ensure_ascii=False), x['q'], x['p'])
                             for x in s['secs'])
            lines.append('    {id:%s, f:%s, label:%s, q:%d, passages:%d, secs:[%s]},' % (
                json.dumps(s['id']), json.dumps(s['f']), json.dumps(s['label'], ensure_ascii=False),
                s['q'], s['passages'], secs))
        lines.append('  ]},')
    lines.append('};')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    tot = sum(s['q'] for v in sets.values() for s in v)
    print('✅ เขียน %s' % os.path.relpath(OUT, ROOT))
    for exam in EXAMS:
        if exam in sets:
            print('   %s %-6s %d ชุด · %d ข้อ' % (EXAMS[exam]['emoji'], exam,
                  len(sets[exam]), sum(s['q'] for s in sets[exam])))
    print('   รวม %d ข้อ ผ่านการตรวจครบทุกข้อ' % tot)

if __name__ == '__main__':
    main()
