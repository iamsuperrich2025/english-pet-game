#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧵 ตรวจ "backtick หลงอยู่ในบล็อก template string" ของไฟล์ js ทั้งโปรเจกต์
(เกิดจากรอบ 583: คอมเมนต์ CSS ในบล็อก `const CSS=`…`` ใส่ backtick ครอบชื่อคลาส
 → สตริงขาดกลางคัน โค้ด CSS ที่เหลือกลายเป็นโค้ด JS · `node --check` ยัง "ผ่าน"
 แต่รันจริงโยน TypeError → window.InvasionWorld ไม่เกิด เว็บค้างหน้าโหลดทั้งเกม)

วิธีใช้ (dev เท่านั้น · ไม่ขึ้นเว็บ เพราะ deploy ตัด tools/ ทิ้ง):
    python tools/check_template_backtick.py            # ตรวจโปรเจกต์นี้
    python tools/check_template_backtick.py --path DIR # ตรวจสำเนาที่ staged (deploy ใช้ตัวนี้)
    python tools/check_template_backtick.py --list     # โชว์บล็อกที่ตรวจทั้งหมด (ถึงจะผ่าน)

หลักการ: หา "บล็อกหลายบรรทัด" ที่ขึ้นต้นด้วย  const/let/var ชื่อ = `  (backtick ปิดท้ายบรรทัด)
  แล้วเดินอักขระไปข้างหน้าแบบเดียวกับที่ JS ตีความ (ข้าม \\escape และ ${...} interpolation)
  จน "เจอ backtick ตัวแรก" = จุดที่สตริงจบจริงในสายตา JS แล้วถามว่า
     · ท้าย backtick นั้นเป็น "ตัวปิดที่สมเหตุสมผล" ไหม (  ;  )  ,  +  .trim()  หรือ backtick อยู่ต้นบรรทัดลำพัง )
     · ถ้าไม่ใช่ = สตริงขาดกลางคัน → backtick ตัวนั้นคือ "ตัวหลง" ที่ไม่ควรมี
  เสริมสำหรับบล็อกชื่อ *CSS*: เนื้อในต้องมีวงเล็บปีกกาครบคู่ (ขาดกลางคัน = ไม่ครบ)

เป็นการตรวจแบบ heuristic แต่จงใจ "ไม่ผ่าน" ไว้ก่อน เพราะเคสนี้ทำเว็บล่มทั้งเกม
ถ้าเจอ false positive จริง ๆ ให้เติมชื่อไฟล์:บรรทัดลง ALLOW ด้านล่าง
"""
import re, sys, pathlib

# console Windows เป็น cp1252 → บังคับ stdout เป็น utf-8 ไม่งั้น emoji/ไทยพัง
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = pathlib.Path(__file__).resolve().parent.parent
# --path <dir> = ตรวจโฟลเดอร์อื่น (deploy ใช้ตรวจสำเนาที่ staged จาก git HEAD ก่อนขึ้นเว็บ)
if "--path" in sys.argv:
    ROOT = pathlib.Path(sys.argv[sys.argv.index("--path") + 1]).resolve()
SHOW_LIST = "--list" in sys.argv

SKIP_DIRS = ("vendor", "data")          # ไฟล์ข้อมูล/ไลบรารีนอก ไม่ใช่โค้ดที่เราเขียน
# ยกเว้นรายจุด (ใส่เป็น "ชื่อไฟล์:บรรทัดที่เปิดบล็อก") — ใช้เมื่อพิสูจน์แล้วว่าเป็น false positive
ALLOW = set()

# บรรทัดเปิดบล็อก:  const CSS=`   /   let html = `   (backtick ต้องปิดท้ายบรรทัด = เป็นบล็อกหลายบรรทัด)
OPEN_RE = re.compile(r"^[ \t]*(?:const|let|var)[ \t]+([A-Za-z_$][\w$]*)[ \t]*=[ \t]*`[ \t]*$", re.M)
# ท้าย backtick ที่ถือว่า "ปิดบล็อกจริง":  `;   `)   `,   `+   `.trim()  ฯลฯ
CLOSE_OK_RE = re.compile(r"^[ \t]*(?:;|\)|,|\+|\.[\w$]+\s*\(|\}|\])")


def skip_interp(src: str, i: int) -> int:
    """อยู่ที่ '${' → คืนตำแหน่งถัดจาก '}' ที่ปิดคู่กัน (นับ {} ซ้อน + ข้าม string/template ข้างใน)"""
    n, depth, i = len(src), 1, i + 2
    while i < n and depth:
        c = src[i]
        if c == "\\":
            i += 2
            continue
        if c in "'\"":
            q, i = c, i + 1
            while i < n and src[i] != q:
                i += 2 if src[i] == "\\" else 1
        elif c == "`":
            i = skip_template(src, i + 1)[0]
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1
    return i


def skip_template(src: str, i: int) -> tuple:
    """อยู่หลัง backtick เปิด → คืน (ตำแหน่ง backtick ที่ปิด, เจอตัวปิดไหม) — ข้าม \\escape และ ${...}"""
    n = len(src)
    while i < n:
        c = src[i]
        if c == "\\":
            i += 2
            continue
        if c == "$" and i + 1 < n and src[i + 1] == "{":
            i = skip_interp(src, i)
            continue
        if c == "`":
            return i, True
        i += 1
    return n, False


def line_of(src: str, idx: int) -> int:
    return src.count("\n", 0, idx) + 1


def line_text(src: str, idx: int) -> str:
    st = src.rfind("\n", 0, idx) + 1
    en = src.find("\n", idx)
    return src[st:(en if en >= 0 else len(src))]


def check_file(path: pathlib.Path, rel: str):
    """คืน (รายการบล็อกที่ตรวจ, รายการปัญหา)"""
    src = path.read_text(encoding="utf-8", errors="replace")
    blocks, bad = [], []
    for m in OPEN_RE.finditer(src):
        name, open_ln = m.group(1), line_of(src, m.start())
        if f"{rel}:{open_ln}" in ALLOW:
            continue
        end, closed = skip_template(src, m.end())
        blocks.append((name, open_ln, line_of(src, end) if closed else None))
        if not closed:
            bad.append((name, open_ln, None, "ไม่เจอ backtick ปิดบล็อกจนจบไฟล์", ""))
            continue
        rest = src[end + 1:src.find("\n", end) if src.find("\n", end) >= 0 else len(src)]
        alone = line_text(src, end).strip() == "`"          # บรรทัดมี backtick ตัวเดียวลำพัง = ตัวปิดที่ยอมรับได้
        if not (alone or CLOSE_OK_RE.match(rest)):
            bad.append((name, open_ln, line_of(src, end),
                        "backtick หลงกลางบล็อก → สตริงขาดตรงนี้ (ตัวหลังจากนี้กลายเป็นโค้ด JS)",
                        line_text(src, end).strip()))
            continue
        # เสริมเฉพาะบล็อก CSS: เนื้อในต้องมีปีกกาครบคู่ (ขาดกลางคัน = ไม่ครบ)
        if "CSS" in name.upper():
            body = re.sub(r"\$\{[^}]*\}", "", src[m.end():end])
            body = re.sub(r"""(["'])(?:\\.|(?!\1).)*\1""", "", body)   # ตัด "…" '…' ที่อาจมีปีกกาในค่า
            if body.count("{") != body.count("}"):
                bad.append((name, open_ln, line_of(src, end),
                            f"ปีกกาในบล็อก CSS ไม่ครบคู่ ({body.count('{')} เปิด / {body.count('}')} ปิด) "
                            f"— บล็อกอาจถูกตัดจบก่อนเวลาด้วย backtick หลง",
                            line_text(src, end).strip()))
    return blocks, bad


def main() -> int:
    files = [ROOT / "sw.js"] if (ROOT / "sw.js").exists() else []
    js_dir = ROOT / "js"
    if js_dir.is_dir():
        files += [f for f in sorted(js_dir.rglob("*.js"))
                  if not any(p in SKIP_DIRS for p in f.relative_to(js_dir).parts[:-1])]
    if not files:
        print("❌ ไม่พบไฟล์ js/ — รันจากรากโปรเจกต์นะ")
        return 1

    n_blocks, problems, listed = 0, [], []
    for f in files:
        rel = f.relative_to(ROOT).as_posix()
        blocks, bad = check_file(f, rel)
        n_blocks += len(blocks)
        listed += [(rel, *b) for b in blocks]
        problems += [(rel, *b) for b in bad]

    print(f"🧵 สแกน {len(files)} ไฟล์ · บล็อก template หลายบรรทัด {n_blocks} บล็อก · ปัญหา {len(problems)} จุด\n")
    if SHOW_LIST:
        for rel, name, ln, end_ln in listed:
            print(f"   {rel}:{ln}  const {name}=`  → ปิดที่บรรทัด {end_ln if end_ln else '❌ ไม่เจอ'}")
        print("")
    if not problems:
        print("✅ ไม่มี backtick หลงในบล็อก template string")
        return 0

    for rel, name, open_ln, end_ln, why, line in problems:
        print(f"⚠️  {rel}:{end_ln or open_ln}  ในบล็อก `const {name}=`` (เปิดบรรทัด {open_ln})")
        print(f"      {why}")
        if line:
            print(f"      {line[:120]}")
    print("\n💡 วิธีแก้: ในบล็อก template string (โดยเฉพาะ CSS) **ห้ามพิมพ์ backtick** แม้แต่ในคอมเมนต์")
    print("   อยากอ้างชื่อคลาส ให้เขียน  คลาส kbd  แทน  `.kbd`  (หรือใส่ \\` ถ้าจำเป็นต้องมีจริง)")
    # exit 2 = เจอของน่าสงสัย → deploy_firebase.sh (set -e) หยุดทันที ไม่ปล่อยเว็บล่มขึ้นจริง (รอบ 583)
    return 2


if __name__ == "__main__":
    sys.exit(main())
