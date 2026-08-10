#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""สร้างหน้า Artifact "ปุ่มคัดลอก Firebase rules ก้อนเต็ม" จาก handoff/RULES.md ตรง ๆ
   (รอบ 976 — เดิมทุกรอบเขียนสคริปต์ชั่วคราวใหม่ทุกครั้ง เปลือง token)

ใช้:  python tools/gen_rules_artifact.py <ไฟล์ HTML ที่จะเขียน> [--round N] [--zone ชื่อโซนที่เพิ่มใหม่] ...
  --zone ใส่ได้หลายตัว = ไฮไลต์เหลืองทุกบรรทัดในบล็อกของโซนนั้นในหน้า Artifact

กติกาผู้ใช้ที่สคริปต์นี้บังคับให้เอง:
  • ส่ง rules ต้อง "เต็มทั้งหน้า" เสมอ (ห้ามตัดเฉพาะโซน) — คัดลอกจากก้อนใน RULES.md ตรง ๆ ไม่ก๊อปมือ
  • ข้อความที่ปุ่มคัดลอกส่งเข้าคลิปบอร์ด = textContent ของ <pre> → ตรวจได้ว่า json.loads ผ่าน
"""
import argparse, hashlib, html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def rules_json_text():
    src = (ROOT / 'handoff' / 'RULES.md').read_text(encoding='utf-8')
    m = re.search(r'## ก้อนเต็ม.*?```json\n(.*?)```', src, re.S)
    if not m:
        sys.exit('หาบล็อก ```json ใต้หัวข้อ "## ก้อนเต็ม" ใน handoff/RULES.md ไม่เจอ')
    txt = m.group(1).rstrip('\n')
    json.loads(txt)                      # พังตรงนี้ = ก้อนใน RULES.md เสีย ห้ามส่งให้ผู้ใช้
    return txt

def zone_line_range(lines, zone):
    """หาช่วงบรรทัดของ "zone": { ... } ชั้นบนสุด (นับวงเล็บปีกกา)"""
    pat = re.compile(r'^\s*"%s"\s*:\s*\{' % re.escape(zone))
    for i, ln in enumerate(lines):
        if pat.match(ln):
            depth = 0
            for j in range(i, len(lines)):
                depth += lines[j].count('{') - lines[j].count('}')
                if depth == 0:
                    return i, j
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--round', default='')
    ap.add_argument('--zone', action='append', default=[])
    a = ap.parse_args()

    txt   = rules_json_text()
    lines = txt.split('\n')
    hot   = set()
    marks = []
    for z in a.zone:
        r = zone_line_range(lines, z)
        if not r:
            sys.exit('ไม่เจอโซน "%s" ในก้อนเต็ม' % z)
        hot.update(range(r[0], r[1] + 1))
        marks.append('%s (บรรทัด %d–%d)' % (z, r[0] + 1, r[1] + 1))

    body = '\n'.join(('<mark>%s</mark>' % html.escape(ln)) if i in hot else html.escape(ln)
                     for i, ln in enumerate(lines))
    # Fail closed: the rendered <pre>.textContent must equal the source JSON exactly.
    copy_payload = html.unescape(re.sub(r'</?mark>', '', body))
    if copy_payload != txt:
        sys.exit('copy payload differs from handoff/RULES.md; artifact not written')
    zones = len(json.loads(txt)['rules'])
    sha256 = hashlib.sha256(txt.encode('utf-8')).hexdigest().upper()
    head  = ('รอบ %s · ' % a.round if a.round else '') + '%d โซน · %d บรรทัด' % (zones, len(lines))
    note  = ('ไฮไลต์เหลือง = ส่วนที่เพิ่มใหม่: ' + ' · '.join(marks)) if marks else ''

    (ROOT / a.out).write_text(TPL.format(head=html.escape(head), note=html.escape(note),
                                         sha256=sha256, body=body),
                              encoding='utf-8')
    print(('wrote %s (%s)' % (a.out, head)).encode('ascii', 'replace').decode())   # console Windows เป็น cp1252

TPL = """<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Firebase Rules — ก้อนเต็ม (Vocab World)</title>
<style>
 :root{{--bg:#0e1626;--panel:#16233a;--code:#101d31;--line:#27405f;--ink:#e7f1ff;--dim:#8fb4dd;
        --btn:#2f7ee0;--ok:#7ee08a;--hot:#f7d774;--hotink:#20303f;}}
 @media (prefers-color-scheme: light){{
   :root{{--bg:#f4f8ff;--panel:#ffffff;--code:#ffffff;--line:#cddffa;--ink:#12243a;--dim:#4a6c92;
          --btn:#1f6fd0;--ok:#1d8a3f;--hot:#ffe7a0;--hotink:#3a2d00;}}
 }}
 :root[data-theme="dark"]{{--bg:#0e1626;--panel:#16233a;--code:#101d31;--line:#27405f;--ink:#e7f1ff;
        --dim:#8fb4dd;--btn:#2f7ee0;--ok:#7ee08a;--hot:#f7d774;--hotink:#20303f;}}
 :root[data-theme="light"]{{--bg:#f4f8ff;--panel:#ffffff;--code:#ffffff;--line:#cddffa;--ink:#12243a;
        --dim:#4a6c92;--btn:#1f6fd0;--ok:#1d8a3f;--hot:#ffe7a0;--hotink:#3a2d00;}}
 body{{margin:0;font-family:system-ui,'Segoe UI',sans-serif;background:var(--bg);color:var(--ink);}}
 .wrap{{max-width:1000px;margin:0 auto;padding:22px 16px 60px;display:flex;flex-direction:column;gap:14px;}}
 h1{{font-size:20px;margin:0;text-wrap:balance;}} .sub{{color:var(--dim);font-size:13px;margin:0;line-height:1.6;}}
 .steps{{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 16px;
         font-size:14px;line-height:1.7;}}
 .bar{{position:sticky;top:0;background:var(--bg);padding:10px 0;display:flex;gap:10px;align-items:center;z-index:5;}}
 button{{background:var(--btn);color:#fff;border:0;border-radius:10px;padding:11px 20px;font-size:15px;
         font-weight:700;cursor:pointer;font-family:inherit;}}
 button:active{{transform:translateY(1px);}}
 button:focus-visible{{outline:3px solid var(--hot);outline-offset:2px;}}
 .ok{{color:var(--ok);font-size:14px;}}
 pre{{background:var(--code);border:1px solid var(--line);border-radius:12px;padding:14px;overflow-x:auto;
      font-size:12.5px;line-height:1.45;white-space:pre;margin:0;}}
 mark{{background:var(--hot);color:var(--hotink);border-radius:3px;}}
</style>
<div class="wrap">
  <h1>🔐 Firebase Rules — ก้อนเต็มทั้งหน้า</h1>
  <p class="sub">{head}<br>SHA-256: <code>{sha256}</code><br>{note}</p>
  <div class="steps">
    <b>วิธีใช้</b><br>
    1) กดปุ่ม <b>คัดลอกทั้งก้อน</b> ด้านล่าง<br>
    2) เปิด <b>Firebase Console → Realtime Database → Rules</b><br>
    3) <b>ลบของเดิมทั้งหมด</b> แล้ววางก้อนนี้ทับ → กด <b>Publish</b>
  </div>
  <div class="bar"><button id="c">📋 คัดลอกทั้งก้อน</button><span class="ok" id="s"></span></div>
  <pre id="p">{body}</pre>
</div>
<script>
 document.getElementById('c').addEventListener('click', function(){{
   var t = document.getElementById('p').textContent;
   navigator.clipboard.writeText(t).then(function(){{
     document.getElementById('s').textContent = '✅ คัดลอกแล้ว (' + t.length.toLocaleString() + ' ตัวอักษร)';
   }}, function(){{
     var r = document.createRange(); r.selectNodeContents(document.getElementById('p'));
     var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
     document.getElementById('s').textContent = '⚠️ กด Ctrl+C เพื่อคัดลอกส่วนที่เลือกไว้ให้แล้ว';
   }});
 }});
</script>
"""

if __name__ == '__main__':
    main()
