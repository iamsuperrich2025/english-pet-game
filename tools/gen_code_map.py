#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gen_code_map.py — เจน handoff/CODE_MAP.md อัตโนมัติจากโค้ดจริง (แผนที่ฟังก์ชัน:บรรทัด)
จุดประสงค์: session ใหม่หาว่าฟังก์ชัน/ค่าคงที่อยู่ไฟล์ไหนบรรทัดไหนได้จากไฟล์เดียว
→ Read เฉพาะช่วง (offset=บรรทัด limit=40) แทนการ Grep สุ่มหลายรอบ = ประหยัด token

เก็บ: function/async function ระดับ top-level + const/let ชื่อตัวพิมพ์ใหญ่ (ค่าคงที่/config)
ข้าม: js/vendor/ (ไลบรารีนอก)

Usage: python tools/gen_code_map.py   (rotate_handoff.py เรียกให้อัตโนมัติทุกครั้งอยู่แล้ว)
"""
import io, os, re, sys, glob, datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "handoff", "CODE_MAP.md")

FN = re.compile(r"^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)")
CONST = re.compile(r"^(?:const|let)\s+([A-Z][A-Z0-9_]{2,})\s*=")
PER_LINE = 6  # entries ต่อบรรทัด (อ่านทั้งไฟล์แล้วยังประหยัด token)


def scan(path):
    entries = []
    with io.open(path, "r", encoding="utf-8", errors="replace") as f:
        for i, ln in enumerate(f, 1):
            m = FN.match(ln) or CONST.match(ln)
            if m:
                entries.append("%s:%d" % (m.group(1), i))
    return entries, i


def main():
    files = sorted(glob.glob(os.path.join(ROOT, "js", "*.js")))
    out = [
        "# CODE_MAP.md — แผนที่ฟังก์ชัน:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)\n",
        "\n",
        "> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`\n",
        "> เจนใหม่อัตโนมัติทุกครั้งที่รัน `python tools/rotate_handoff.py` (จบรอบ) · อัปเดตล่าสุด: %s\n" % datetime.date.today().isoformat(),
    ]
    total = 0
    for path in files:
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        entries, nlines = scan(path)
        total += len(entries)
        out.append("\n## %s (%s บรรทัด · %d รายการ)\n" % (rel, format(nlines, ","), len(entries)))
        for k in range(0, len(entries), PER_LINE):
            out.append(" · ".join(entries[k:k + PER_LINE]) + "\n")
    with io.open(OUT, "w", encoding="utf-8", newline="") as f:
        f.writelines(out)
    print("🗺️ CODE_MAP.md: %d ไฟล์ · %d รายการ · %s bytes" % (len(files), total, format(os.path.getsize(OUT), ",")))


if __name__ == "__main__":
    main()
