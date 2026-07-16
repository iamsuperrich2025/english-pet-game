#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gen_code_map.py — เจนแผนที่โค้ดอัตโนมัติจากโค้ดจริง (2 ปลายทาง)
  1. handoff/CODE_MAP.md — แผนที่ `ชื่อ:บรรทัด`
     · js:  function/async function top-level + const/let ชื่อตัวพิมพ์ใหญ่ (ค่าคงที่/config)
     · css: selector index (`.class`/`#id` ตัวแรกของแต่ละ rule → ทุกบรรทัดที่ประกาศ)
  2. handoff/ARCHITECTURE.md — บล็อก "ไฟล์ไหนทำอะไร" ระหว่าง marker AUTO-FILES
     (สรุปจาก comment หัวไฟล์จริง — ห้ามแก้มือในบล็อก เดี๋ยวโดนเขียนทับ)

จุดประสงค์: session ใหม่หาว่าอะไรอยู่ไฟล์ไหนบรรทัดไหนจากไฟล์เดียว
→ Read เฉพาะช่วง (offset=บรรทัด limit=40) แทนการ Grep สุ่มหลายรอบ = ประหยัด token
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
CSS_RULE = re.compile(r"^([.#a-zA-Z\*:\[][^{;]*)\{")
CSS_TOKEN = re.compile(r"[.#][A-Za-z_-][\w-]*")
PER_LINE = 6  # entries ต่อบรรทัด (อ่านทั้งไฟล์แล้วยังประหยัด token)
DECOR = set("=-–—~* ")  # บรรทัดตกแต่งใน comment หัวไฟล์


def scan(path):
    entries = []
    with io.open(path, "r", encoding="utf-8", errors="replace") as f:
        for i, ln in enumerate(f, 1):
            m = FN.match(ln) or CONST.match(ln)
            if m:
                entries.append("%s:%d" % (m.group(1), i))
    return entries, i


def scan_css(path):
    """selector index: token แรก (.class/#id/element) ของแต่ละ rule → ทุกบรรทัดที่ปรากฏ"""
    tokens = {}   # token -> [lines]
    order = []
    with io.open(path, "r", encoding="utf-8", errors="replace") as f:
        for i, ln in enumerate(f, 1):
            m = CSS_RULE.match(ln)
            if not m:
                continue
            sel = m.group(1)
            t = CSS_TOKEN.search(sel)
            first = sel.split(None, 1)[0].split(",")[0]
            tok = t.group(0) if t else (first if first.startswith(":") else first.split(":")[0])
            if tok not in tokens:
                tokens[tok] = []
                order.append(tok)
            tokens[tok].append(i)
    entries = []
    for tok in order:
        ls = tokens[tok]
        shown = ",".join(str(x) for x in ls[:4]) + ("(+%d)" % (len(ls) - 4) if len(ls) > 4 else "")
        entries.append("%s:%s" % (tok, shown))
    return entries, i


def file_summary(path, max_parts=3, max_len=230):
    """ดึงสรุปจาก comment block หัวไฟล์ (/* ... */) — ข้ามบรรทัดตกแต่ง ==="""
    parts = []
    in_block = False
    with io.open(path, "r", encoding="utf-8", errors="replace") as f:
        for _ in range(40):
            ln = f.readline()
            if not ln:
                break
            s = ln.strip()
            done = False
            if not in_block:
                if s.startswith("/*"):
                    in_block = True
                    s = s[2:].strip()
                else:
                    continue
            if "*/" in s:
                s = s.split("*/")[0].strip()
                done = True
            s = s.strip("*•· ").strip()
            if s and not set(s) <= DECOR:
                parts.append(s)
            if done or len(parts) >= max_parts:
                break
    out = " · ".join(parts)
    return (out[:max_len] + "…") if len(out) > max_len else out


AUTO_BEGIN = "<!-- AUTO-FILES:BEGIN -->"
AUTO_END = "<!-- AUTO-FILES:END -->"


def update_architecture(all_files):
    arch = os.path.join(ROOT, "handoff", "ARCHITECTURE.md")
    block = [
        AUTO_BEGIN + "\n",
        "### 🤖 ไฟล์ไหนทำอะไร — เจนอัตโนมัติจาก comment หัวไฟล์ (`tools/gen_code_map.py` · **ห้ามแก้มือในบล็อกนี้**) · อัปเดต %s\n" % datetime.date.today().isoformat(),
    ]
    for path in all_files:
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        with io.open(path, "r", encoding="utf-8", errors="replace") as f:
            nlines = sum(1 for _ in f)
        summ = file_summary(path) or "(ไม่มี comment หัวไฟล์)"
        block.append("- **%s** (%s บรรทัด) — %s\n" % (rel, format(nlines, ","), summ))
    block.append(AUTO_END + "\n")

    text = io.open(arch, "r", encoding="utf-8").read()
    if AUTO_BEGIN in text and AUTO_END in text:
        pre = text.split(AUTO_BEGIN)[0]
        post = text.split(AUTO_END, 1)[1]
        new = pre + "".join(block) + post
    else:
        anchor = "## ไฟล์งานที่มอบ Sonnet"
        ins = "\n" + "".join(block) + "\n"
        if anchor in text:
            new = text.replace(anchor, ins + anchor, 1)
        else:
            new = text.rstrip() + "\n\n" + "".join(block)
    io.open(arch, "w", encoding="utf-8", newline="").write(new)
    print("🏛️ ARCHITECTURE.md: อัปเดตบล็อก AUTO-FILES (%d ไฟล์)" % len(all_files))


def main():
    js_files = sorted(glob.glob(os.path.join(ROOT, "js", "*.js")))
    css_files = sorted(glob.glob(os.path.join(ROOT, "css", "*.css")))
    sw = os.path.join(ROOT, "sw.js")
    out = [
        "# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)\n",
        "\n",
        "> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`\n",
        "> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: %s\n" % datetime.date.today().isoformat(),
    ]
    total = 0
    for path in js_files:
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        entries, nlines = scan(path)
        total += len(entries)
        out.append("\n## %s (%s บรรทัด · %d รายการ)\n" % (rel, format(nlines, ","), len(entries)))
        for k in range(0, len(entries), PER_LINE):
            out.append(" · ".join(entries[k:k + PER_LINE]) + "\n")
    for path in css_files:
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        entries, nlines = scan_css(path)
        total += len(entries)
        out.append("\n## %s (%s บรรทัด · %d selector)\n" % (rel, format(nlines, ","), len(entries)))
        for k in range(0, len(entries), PER_LINE):
            out.append(" · ".join(entries[k:k + PER_LINE]) + "\n")
    with io.open(OUT, "w", encoding="utf-8", newline="") as f:
        f.writelines(out)
    print("🗺️ CODE_MAP.md: %d ไฟล์ · %d รายการ · %s bytes" % (len(js_files) + len(css_files), total, format(os.path.getsize(OUT), ",")))

    update_architecture(js_files + css_files + ([sw] if os.path.exists(sw) else []))


if __name__ == "__main__":
    main()
