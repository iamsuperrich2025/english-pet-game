#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""rotate_handoff.py — เก็บกวาดไฟล์บูต (HANDOFF.md / handoff/TASKS.md) ให้ผอมเสมอ
เพื่อประหยัด token ตอนเริ่ม session ใหม่ · **ย้ายทั้งก้อน verbatim ไม่ลบข้อมูล**

ทำ 4 อย่าง:
  1. HANDOFF.md  "## 📸 สถานะปัจจุบัน"    : เก็บ bullet รอบล่าสุด 3 อัน → ที่เหลือเข้า archive
  2. TASKS.md    "### 📌 สรุปสถานะล่าสุด"  : เก็บ bullet รอบล่าสุด 10 อัน → ที่เหลือเข้า archive
  3. TASKS.md    "### ... รอบ N ..." (รายละเอียดรอบ): เก็บ 6 section แรก → ที่เหลือเข้า archive
  4. TASKS.md    "## 📌 ประวัติรอบล่าสุด" : ย้ายเนื้อทั้งหมดเข้า archive เหลือบรรทัดชี้

ปลายทาง archive: handoff/archive/HANDOFF_STATUS.md · TASKS_STATUS.md · TASKS_ROUNDS.md
ก่อนแก้จะสำรองไฟล์เดิมไว้ที่ backups/handoff_rotate/<timestamp>/ เสมอ (gitignore แล้ว)

Usage:  python tools/rotate_handoff.py            # หมุนจริง
        python tools/rotate_handoff.py --check    # รายงานขนาดอย่างเดียว ไม่แตะไฟล์
"""
import io, os, re, sys, shutil, datetime

if hasattr(sys.stdout, "reconfigure"):  # คอนโซล Windows default cp1252 พิมพ์ไทยไม่ได้
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HANDOFF = os.path.join(ROOT, "HANDOFF.md")
TASKS = os.path.join(ROOT, "handoff", "TASKS.md")
ARCH_DIR = os.path.join(ROOT, "handoff", "archive")
BAK_ROOT = os.path.join(ROOT, "backups", "handoff_rotate")

KEEP_HANDOFF_BULLETS = 3
KEEP_TASKS_BULLETS = 10
KEEP_TASKS_SECTIONS = 6

# bullet ระดับบนสุดที่ขึ้นต้นด้วย "- <emoji อะไรก็ได้ 0-8 ตัว> **รอบ <เลข>"
ROUND_BULLET = re.compile(r"^- .{0,8}\*\*รอบ \d")
ROUND_SECTION = re.compile(r"^### .*รอบ \d")

BUDGET = {HANDOFF: 30_000, TASKS: 80_000}


def read_lines(path):
    with io.open(path, "r", encoding="utf-8") as f:
        return f.readlines()


def write_lines(path, lines):
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.writelines(lines)


def append_archive(name, src_label, chunk_lines):
    if not chunk_lines:
        return
    os.makedirs(ARCH_DIR, exist_ok=True)
    path = os.path.join(ARCH_DIR, name)
    new = not os.path.exists(path)
    with io.open(path, "a", encoding="utf-8", newline="") as f:
        if new:
            f.write("# archive (ย้ายอัตโนมัติโดย tools/rotate_handoff.py — ค้นด้วย Grep เท่านั้น ห้ามอ่านทั้งไฟล์)\n")
        stamp = datetime.date.today().isoformat()
        f.write("\n\n## ⏬ ย้ายเมื่อ %s — จาก %s\n\n" % (stamp, src_label))
        f.writelines(chunk_lines)
        if chunk_lines and not chunk_lines[-1].endswith("\n"):
            f.write("\n")


def find_section(lines, header_startswith, contains, closers):
    """คืน (start, end) ของ section: start = บรรทัด header · end = ก่อน header ระดับปิดถัดไป (หรือ EOF)"""
    start = None
    for i, ln in enumerate(lines):
        if ln.startswith(header_startswith) and contains in ln:
            start = i
            break
    if start is None:
        return None, None
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if any(lines[j].startswith(c) for c in closers):
            end = j
            break
    return start, end


def split_blocks(lines, start, end, bullet_re):
    """แบ่งช่วง [start,end) เป็น block: block เริ่มที่ bullet ตาม regex กินยาวถึงก่อน bullet/header ถัดไป
    คืน (prefix_lines, blocks) — prefix = บรรทัดก่อน bullet แรก"""
    idxs = [i for i in range(start, end) if bullet_re.match(lines[i])]
    if not idxs:
        return lines[start:end], []
    prefix = lines[start:idxs[0]]
    blocks = []
    for k, i in enumerate(idxs):
        stop = idxs[k + 1] if k + 1 < len(idxs) else end
        # block จบเร็วขึ้นถ้าเจอ header หรือ bullet ระดับบนอื่น
        for j in range(i + 1, stop):
            if lines[j].startswith(("#", "- ")):
                stop = j
                break
        blocks.append((i, stop))
    # เศษท้ายระหว่าง block สุดท้ายกับ end (บรรทัดที่ไม่ใช่ส่วนของ block)
    return prefix, blocks


def rotate_bullets(path, lines, hdr_prefix, hdr_contains, closers, keep, arch_name, label):
    s, e = find_section(lines, hdr_prefix, hdr_contains, closers)
    if s is None:
        print("  (ไม่พบ section '%s' — ข้าม)" % hdr_contains)
        return lines, 0
    prefix, blocks = split_blocks(lines, s, e, ROUND_BULLET)
    if len(blocks) <= keep:
        print("  %s: bullet %d ≤ %d — ไม่ต้องหมุน" % (hdr_contains, len(blocks), keep))
        return lines, 0
    keep_blocks, move_blocks = blocks[:keep], blocks[keep:]
    moved = []
    for i, j in move_blocks:
        moved.extend(lines[i:j])
    append_archive(arch_name, label, moved)
    # ประกอบไฟล์ใหม่: ก่อน section + prefix + kept blocks + บรรทัดใน section ที่ไม่อยู่ใน block ที่ย้าย + หลัง section
    covered = set()
    for i, j in move_blocks:
        covered.update(range(i, j))
    body = [lines[i] for i in range(s, e) if i not in covered]
    new_lines = lines[:s] + body + lines[e:]
    print("  %s: ย้าย %d bullet → %s" % (hdr_contains, len(move_blocks), arch_name))
    return new_lines, len(move_blocks)


def rotate_round_sections(lines, keep):
    idxs = [i for i, ln in enumerate(lines) if ROUND_SECTION.match(ln)]
    if len(idxs) <= keep:
        print("  section รอบ: %d ≤ %d — ไม่ต้องหมุน" % (len(idxs), keep))
        return lines, 0
    moved_ranges = []
    for k in range(keep, len(idxs)):
        i = idxs[k]
        stop = len(lines)
        for j in range(i + 1, len(lines)):
            if lines[j].startswith("### ") or lines[j].startswith("## "):
                stop = j
                break
        moved_ranges.append((i, stop))
    moved = []
    covered = set()
    for i, j in moved_ranges:
        moved.extend(lines[i:j])
        covered.update(range(i, j))
    append_archive("TASKS_ROUNDS.md", "handoff/TASKS.md (รายละเอียดรอบ)", moved)
    new_lines = [ln for i, ln in enumerate(lines) if i not in covered]
    print("  section รอบ: ย้าย %d section → TASKS_ROUNDS.md" % len(moved_ranges))
    return new_lines, len(moved_ranges)


def rotate_history_section(lines):
    s, e = find_section(lines, "## ", "ประวัติรอบล่าสุด", ["## "])
    if s is None or e - s <= 3:  # ไม่มี/เหลือแต่ pointer แล้ว
        return lines, 0
    body = lines[s + 1:e]
    if not any(ln.strip() and not ln.strip().startswith(">") for ln in body):
        return lines, 0
    append_archive("TASKS_ROUNDS.md", "handoff/TASKS.md (## ประวัติรอบล่าสุด)", body)
    pointer = ["\nประวัติรอบเก่าทั้งหมดถูกย้ายไป `handoff/archive/TASKS_ROUNDS.md` และ `handoff/HISTORY.md` — ค้นด้วย Grep `รอบ <เลข>`\n"]
    new_lines = lines[:s + 1] + pointer + lines[e:]
    print("  ประวัติรอบล่าสุด: ย้ายทั้ง section → TASKS_ROUNDS.md")
    return new_lines, 1


LONG_LINE = 1000  # ตัวอักษร (ไม่ใช่ byte) ต่อบรรทัด — บันทึกรอบควรย่อ ≤4 บรรทัดสั้นๆ (กฎทอง #8)


def report(tag):
    print("%s ขนาดไฟล์บูต:" % tag)
    for p in (HANDOFF, TASKS):
        sz = os.path.getsize(p)
        warn = "  ⚠️ เกินงบ %d — มีอย่างอื่นบวม ตรวจด้วยตา" % BUDGET[p] if sz > BUDGET[p] else ""
        print("  %-22s %8s bytes%s" % (os.path.relpath(p, ROOT), format(sz, ","), warn))


def warn_long_lines():
    """เตือนบรรทัดยาวผิดปกติในไฟล์บูต — สัญญาณว่าบันทึกรอบเขียนยาวเกิน (ควรย่อตามกฎทอง #8)"""
    hits = []
    for p in (HANDOFF, TASKS):
        rel = os.path.relpath(p, ROOT)
        for i, ln in enumerate(read_lines(p), 1):
            if len(ln) > LONG_LINE:
                hits.append((len(ln), "%s:%d" % (rel, i)))
    if hits:
        hits.sort(reverse=True)
        print("⚠️ บรรทัดยาวเกิน %d ตัวอักษร %d จุด (บันทึกรอบใหม่ควรย่อ ≤4 บรรทัด — ของเก่าจะหมุนออกเอง):" % (LONG_LINE, len(hits)))
        for length, loc in hits[:5]:
            print("   %s (%s ตัวอักษร)" % (loc, format(length, ",")))


def main():
    check_only = "--check" in sys.argv
    report("📏 ก่อนหมุน —" if not check_only else "📏")
    if check_only:
        return

    stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    bak = os.path.join(BAK_ROOT, stamp)
    os.makedirs(bak, exist_ok=True)
    shutil.copy2(HANDOFF, os.path.join(bak, "HANDOFF.md"))
    shutil.copy2(TASKS, os.path.join(bak, "TASKS.md"))
    print("💾 สำรองไฟล์เดิม → %s" % os.path.relpath(bak, ROOT))

    total = 0
    print("HANDOFF.md:")
    lines = read_lines(HANDOFF)
    lines, n = rotate_bullets(HANDOFF, lines, "## ", "สถานะปัจจุบัน", ["## "],
                              KEEP_HANDOFF_BULLETS, "HANDOFF_STATUS.md", "HANDOFF.md (สถานะปัจจุบัน)")
    total += n
    if n:
        write_lines(HANDOFF, lines)

    print("handoff/TASKS.md:")
    lines = read_lines(TASKS)
    lines, n1 = rotate_bullets(TASKS, lines, "### ", "สรุปสถานะล่าสุด", ["### ", "## "],
                               KEEP_TASKS_BULLETS, "TASKS_STATUS.md", "handoff/TASKS.md (สรุปสถานะล่าสุด)")
    lines, n2 = rotate_round_sections(lines, KEEP_TASKS_SECTIONS)
    lines, n3 = rotate_history_section(lines)
    if n1 or n2 or n3:
        write_lines(TASKS, lines)
    total += n1 + n2 + n3

    report("📏 หลังหมุน —")
    warn_long_lines()

    # 🗺️ เจน CODE_MAP.md ใหม่ทุกครั้ง (แผนที่ฟังก์ชัน:บรรทัด จะได้ไม่ล้าสมัย)
    import subprocess
    r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "gen_code_map.py")])
    if r.returncode != 0:
        print("⚠️ gen_code_map ล้มเหลว (ไม่กระทบการหมุน)")

    print("✅ เสร็จ (ย้าย %d ก้อน) · archive อยู่ handoff/archive/ (อย่าอ่านทั้งไฟล์ — Grep เท่านั้น)" % total)


if __name__ == "__main__":
    main()
