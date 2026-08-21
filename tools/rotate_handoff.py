#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""rotate_handoff.py — เก็บกวาดไฟล์บูต (HANDOFF.md / handoff/TASKS.md) ให้ผอมเสมอ
เพื่อประหยัด token ตอนเริ่ม session ใหม่ · **ย้ายทั้งก้อน verbatim ไม่ลบข้อมูล**

ทำ 5 อย่าง:
  1. HANDOFF.md  "## 📸 สถานะปัจจุบัน"    : เก็บ bullet รอบล่าสุด 3 อัน → ที่เหลือเข้า archive
  2. TASKS.md    "### 📌 สรุปสถานะล่าสุด"  : เก็บ bullet รอบล่าสุด 10 อัน → ที่เหลือเข้า archive
  3. TASKS.md    "### ... รอบ N ..." (รายละเอียดรอบ): เก็บ 6 section แรก → ที่เหลือเข้า archive
  4. TASKS.md    "### 📌 สรุปสถานะล่าสุด" : เก็บ bullet ล่าสุดทั้งหัวข้อ 12 บรรทัด (รวมผลทดสอบที่ไม่มีคำว่า “รอบ”)
  5. TASKS.md    "## 📌 ประวัติรอบล่าสุด" : ย้ายเนื้อทั้งหมดเข้า archive เหลือบรรทัดชี้

ปลายทาง archive: handoff/archive/HANDOFF_STATUS.md · TASKS_STATUS.md · TASKS_ROUNDS.md
ก่อนแก้จะสำรองไฟล์เดิมไว้ที่ backups/handoff_rotate/<timestamp>/ เสมอ (gitignore แล้ว)

Usage:  python tools/rotate_handoff.py              # หมุนจริง
        python tools/rotate_handoff.py --check      # รายงานขนาดอย่างเดียว ไม่แตะไฟล์
        python tools/rotate_handoff.py --next-round # พิมพ์ "เลขรอบว่างถัดไป" ตัวเดียว (ไว้ใช้ในสคริปต์ — อย่าเดาเลขเอง!)
        python tools/rotate_handoff.py --check-round N  # N ว่างไหม? exit 0=ว่าง 1=ชน (ให้ .githooks/commit-msg เรียก)
"""
import io, os, re, sys, shutil, subprocess, datetime

if hasattr(sys.stdout, "reconfigure"):  # คอนโซล Windows default cp1252 พิมพ์ไทยไม่ได้
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HANDOFF = os.path.join(ROOT, "HANDOFF.md")
TASKS = os.path.join(ROOT, "handoff", "TASKS.md")
ARCH_DIR = os.path.join(ROOT, "handoff", "archive")
BAK_ROOT = os.path.join(ROOT, "backups", "handoff_rotate")

KEEP_HANDOFF_BULLETS = 3
KEEP_TASKS_BULLETS = 10
KEEP_TASKS_STATUS_LINES = 12  # กันรายละเอียด bullet ที่ไม่มี “รอบ N” สะสมจนไฟล์บูตบวม
KEEP_TASKS_SECTIONS = 6
KEEP_STATUS_HEADS = 8      # 🆕 เก็บ "### 📌 สรุปสถานะล่าสุด" ล่าสุดกี่หัวข้อ (ที่เหลือเข้า archive)

# bullet ระดับบนสุดที่ขึ้นต้นด้วย "- <emoji อะไรก็ได้ 0-8 ตัว> **รอบ <เลข>"
ROUND_BULLET = re.compile(r"^- .{0,8}\*\*รอบ \d")
ROUND_SECTION = re.compile(r"^### .*รอบ \d")
# 🆕 หัวข้อสรุปสถานะ — แต่ละ session ชอบ "แทรกหัวข้อใหม่" แทนการเติม bullet ในหัวข้อเดิม
#    ทำให้ rotate_bullets เดิมไม่เคยทำงาน (แต่ละหัวข้อมี bullet เดียว) → TASKS.md บวมเงียบ ๆ จนเกินงบ
STATUS_HEAD = re.compile(r"^### .*สรุปสถานะล่าสุด")

# 🔢 เลขรอบ — จับ "รอบ <เลข>" ที่เจอในไฟล์ handoff / ข้อความ commit (ตรงกับที่ commit-msg เดิม grep)
ROUND_RE = re.compile(r"รอบ\s*(\d+)")

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


def rotate_status_bullets(lines, keep):
    """🩹 รอบ 532: หมุน bullet "รอบ N" ใน **ทุก** หัวข้อสรุปสถานะ ไม่ใช่แค่หัวข้อแรกที่เจอ

    ต้นตอที่เจอรอบนี้ (อาการเดียวกับรอบ 480 แต่คนละจุด): `rotate_bullets` ใช้ `find_section`
    ซึ่งคืน "หัวข้อแรกในไฟล์" — แต่ session ใหม่ ๆ เติม bullet ลงหัวข้อที่อยู่ **ล่างกว่า**
    หัวข้อแรกจึงมี bullet เดียวตลอด → รายงาน "ไม่ต้องหมุน" ทุกครั้งทั้งที่ไฟล์ 89KB เกินงบ
    (หัวข้อเดียวโตถึง 46KB) · แก้: ไล่ทุกหัวข้อ เก็บรวมกันแค่ keep bullet ที่เหลือเข้า archive
    · หัวข้อไหนถูกย้าย bullet ออกจนไม่เหลือเนื้อ = ตัดหัวข้อทิ้งด้วย (ไม่ให้เหลือหัวลอย)
    """
    heads = [i for i, ln in enumerate(lines) if STATUS_HEAD.match(ln)]
    if not heads:
        print("  bullet ในหัวข้อสรุปสถานะ: (ไม่พบหัวข้อ — ข้าม)")
        return lines, 0
    kept = 0
    drop = set()            # บรรทัดที่ย้ายออก
    moved_lines = []
    moved_n = 0
    for h in heads:
        end = len(lines)
        for j in range(h + 1, len(lines)):
            if lines[j].startswith("### ") or lines[j].startswith("## "):
                end = j
                break
        _, blocks = split_blocks(lines, h + 1, end, ROUND_BULLET)
        if not blocks:
            continue
        head_kept = 0
        for i, j in blocks:
            if kept < keep:
                kept += 1
                head_kept += 1
            else:
                moved_lines.extend(lines[i:j])
                drop.update(range(i, j))
                moved_n += 1
        if head_kept == 0:  # หัวข้อนี้ไม่เหลือ bullet เลย → ตัดทั้งหัวข้อ (เหลือแต่บรรทัดว่าง)
            if not any(lines[k].strip() and k not in drop for k in range(h + 1, end)):
                drop.update(range(h, end))
    if not moved_n:
        print("  bullet ในหัวข้อสรุปสถานะ: %d ≤ %d — ไม่ต้องหมุน" % (kept, keep))
        return lines, 0
    append_archive("TASKS_STATUS.md", "handoff/TASKS.md (bullet รอบเก่าในหัวข้อสรุปสถานะ)", moved_lines)
    print("  bullet ในหัวข้อสรุปสถานะ: ย้าย %d รอบ → TASKS_STATUS.md (เหลือ %d)" % (moved_n, kept))
    return [ln for k, ln in enumerate(lines) if k not in drop], moved_n


def rotate_status_tail(lines, keep):
    """เก็บ bullet ล่าสุดของหัวข้อสรุปทั้งก้อน ไม่ว่าบรรทัดนั้นจะมีคำว่า “รอบ N” หรือไม่.

    ผลทดสอบมักเป็น bullet ต่อจากหัวข้อรอบ จึงหลุดจาก rotate_status_bullets เดิมและทำให้
    TASKS.md โตเกินงบ แม้จะหมุน round header ไปแล้ว. ย้าย tail แบบ verbatim เข้า archive เสมอ.
    """
    s, e = find_section(lines, "### ", "สรุปสถานะล่าสุด", ["### ", "## "])
    if s is None:
        print("  bullet ทั้งหัวข้อสรุป: (ไม่พบหัวข้อ — ข้าม)")
        return lines, 0
    bullets = [i for i in range(s + 1, e) if lines[i].startswith("- ")]
    if len(bullets) <= keep:
        print("  bullet ทั้งหัวข้อสรุป: %d ≤ %d — ไม่ต้องหมุน" % (len(bullets), keep))
        return lines, 0
    cut = bullets[keep]
    moved = lines[cut:e]
    append_archive("TASKS_STATUS.md", "handoff/TASKS.md (รายละเอียดสรุปเกินงบ)", moved)
    print("  bullet ทั้งหัวข้อสรุป: ย้าย %d bullet → TASKS_STATUS.md (เหลือ %d)" % (len(bullets) - keep, keep))
    return lines[:cut] + lines[e:], len(bullets) - keep


def rotate_status_heads(lines, keep):
    """🆕 เก็บหัวข้อ 'สรุปสถานะล่าสุด' ใหม่สุด keep อัน — ที่เหลือย้ายเข้า archive ทั้งก้อน
       (หัวข้อเรียงใหม่→เก่าอยู่แล้ว เพราะทุก session แทรกอันใหม่ไว้บนสุด)"""
    idxs = [i for i, ln in enumerate(lines) if STATUS_HEAD.match(ln)]
    if len(idxs) <= keep:
        print("  หัวข้อสรุปสถานะ: %d ≤ %d — ไม่ต้องหมุน" % (len(idxs), keep))
        return lines, 0
    start = idxs[keep]
    # ก้อนที่ย้าย = ตั้งแต่หัวข้อที่ (keep+1) ไปจนถึงก่อนหัวข้ออื่นที่ "ไม่ใช่สรุปสถานะ" (หรือจบไฟล์)
    end = len(lines)
    for i in range(start, len(lines)):
        ln = lines[i]
        if (ln.startswith("## ") or ln.startswith("### ")) and not STATUS_HEAD.match(ln):
            end = i
            break
    append_archive("TASKS_STATUS.md", "handoff/TASKS.md (หัวข้อสรุปสถานะเก่า)", lines[start:end])
    moved = len(idxs) - keep
    print("  หัวข้อสรุปสถานะ: ย้าย %d หัวข้อ → TASKS_STATUS.md" % moved)
    return lines[:start] + lines[end:], moved


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


# ============================================================
# 🔢 เลขรอบ — ที่เดียวที่ตัดสินว่า "รอบไหนว่าง/ชน" (เดิมตรรกะนี้ฝังใน .githooks/commit-msg)
#    ใช้ทั้งตอนเดาเลขรอบถัดไป (--next-round) และตอน hook เช็กเลขชน (--check-round)
# ============================================================

def read_text(path):
    try:
        with io.open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    except OSError:
        return ""


def _max_round_in_text(text):
    return max((int(n) for n in ROUND_RE.findall(text or "")), default=0)


def _git(args):
    """รัน git ใน ROOT คืน stdout (คืน "" ถ้า error/ไม่มี git — fail-open)"""
    try:
        r = subprocess.run(["git"] + args, cwd=ROOT, capture_output=True,
                           text=True, encoding="utf-8", errors="replace")
        return r.stdout if r.returncode == 0 else ""
    except Exception:
        return ""


def _git_bases():
    """ref ที่มีจริงในบรรดา main / origin/main (อาจไม่มีเลยถ้ายังไม่มี remote)"""
    bases = []
    for b in ("main", "origin/main"):
        try:
            ok = subprocess.run(["git", "rev-parse", "--verify", "-q", b],
                               cwd=ROOT, capture_output=True).returncode == 0
        except Exception:
            ok = False
        if ok:
            bases.append(b)
    return bases


def max_round_committed():
    """เลขรอบสูงสุดที่ 'commit ขึ้น main/origin แล้ว' (จาก handoff/TASKS.md ของ base เท่านั้น)
       — ตรงกับตรรกะเดิมของ .githooks/commit-msg เป๊ะ: เทียบเฉพาะของที่ขึ้น main แล้ว
         ไม่นับ working tree ปัจจุบัน จึงไม่บล็อกงานของ session ตัวเอง (หลีกเลี่ยง self-collision)"""
    hi = 0
    for base in _git_bases():
        hi = max(hi, _max_round_in_text(_git(["show", "%s:handoff/TASKS.md" % base])))
    return hi


def max_round_seen():
    """เลขรอบสูงสุด 'ทุกแหล่ง' สำหรับเดาเลขรอบถัดไป:
         local handoff/TASKS.md + handoff/archive/*.md + (main/origin: TASKS.md + ข้อความ commit)
       over-count ได้ ไม่เป็นไร เพราะเราแค่ +1 เพื่อเลือกเลขที่ 'ปลอดภัยแน่ ๆ'"""
    hi = _max_round_in_text(read_text(TASKS))
    if os.path.isdir(ARCH_DIR):
        for name in sorted(os.listdir(ARCH_DIR)):
            if name.endswith(".md"):
                hi = max(hi, _max_round_in_text(read_text(os.path.join(ARCH_DIR, name))))
    for base in _git_bases():
        hi = max(hi, _max_round_in_text(_git(["show", "%s:handoff/TASKS.md" % base])))
        hi = max(hi, _max_round_in_text(_git(["log", "--format=%s%n%b", base])))
    return hi


def main():
    argv = sys.argv[1:]

    # 🔢 พิมพ์เลขรอบว่างถัดไป "ตัวเดียว" ไม่มี output อื่นปน (ให้สคริปต์/hook เอาไปใช้ได้ตรง ๆ)
    if "--next-round" in argv:
        print(max_round_seen() + 1)
        return

    # 🔢 เช็กว่าเลข N ว่างไหม → พิมพ์ "เลขรอบสูงสุดที่ commit แล้ว" ออก stdout + exit code (0=ว่าง 1=ชน)
    if "--check-round" in argv:
        i = argv.index("--check-round")
        try:
            n = int(argv[i + 1])
        except (IndexError, ValueError):
            print("ใช้: python tools/rotate_handoff.py --check-round <เลขรอบ>", file=sys.stderr)
            sys.exit(2)
        hi = max_round_committed()
        print(hi)                    # ให้ commit-msg เอาไปโชว์ "บันทึกถึงรอบ N แล้ว" + แนะนำ N+1
        sys.exit(1 if n <= hi else 0)

    check_only = "--check" in argv
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
    lines, n0 = rotate_status_tail(lines, KEEP_TASKS_STATUS_LINES)
    lines, n1 = rotate_status_bullets(lines, KEEP_TASKS_BULLETS)   # 🩹 รอบ 532: ไล่ "ทุก" หัวข้อ ไม่ใช่หัวข้อแรก
    lines, n2 = rotate_round_sections(lines, KEEP_TASKS_SECTIONS)
    lines, n3 = rotate_history_section(lines)
    lines, n4 = rotate_status_heads(lines, KEEP_STATUS_HEADS)   # 🆕 ต้นตอไฟล์บวม
    if n0 or n1 or n2 or n3 or n4:
        write_lines(TASKS, lines)
    total += n0 + n1 + n2 + n3 + n4

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
