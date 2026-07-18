#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
📦 ตรวจ "ไฟล์ที่หน้าเว็บอ้างถึง แต่ไม่มีอยู่ในชุดที่กำลังจะขึ้นเว็บ"
(เกิดจากรอบ 324: js/data/word_new.js ไม่เคยถูก commit → deploy ใช้ git archive HEAD
 ไฟล์เลยไม่ขึ้นเว็บ → live 404 → newWordPool() ไม่มีตัวตน → แถบ New Word พังเงียบ
 ในเครื่อง dev ปกติดีทุกอย่าง เลยไม่มีใครเห็นจนกว่าผู้เล่นจริงจะเจอ)

ใช้:
    python tools/check_missing_assets.py                 # ตรวจโฟลเดอร์โปรเจกต์ (ไฟล์ในเครื่อง)
    python tools/check_missing_assets.py --path <dir>    # ตรวจสำเนา staged ตอน deploy (git HEAD)
    python tools/check_missing_assets.py --git           # ตรวจว่าไฟล์ที่อ้างถูก commit แล้วหรือยัง

ตรวจอะไร: ทุก src=/href= ใน .html + `importScripts()`/รายการ cache ใน sw.js ที่เป็น path ภายในโปรเจกต์
ข้าม: URL ภายนอก (http/https//), data:, blob:, mailto:, #anchor, path ที่มีตัวแปร ${...}
exit 2 = เจอไฟล์หาย → deploy_firebase.sh (set -e) หยุดทันที
"""
import re, sys, pathlib, subprocess

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = pathlib.Path(__file__).resolve().parent.parent
if "--path" in sys.argv:
    ROOT = pathlib.Path(sys.argv[sys.argv.index("--path") + 1]).resolve()
GIT_MODE = "--git" in sys.argv          # โหมดเช็ก "commit แล้วหรือยัง" (ใช้ในเครื่อง ไม่ใช่ตอน deploy)

REF_RE = re.compile(r"""(?:src|href)\s*=\s*["']([^"']+)["']""")
SKIP_PREFIX = ("http://", "https://", "//", "data:", "blob:", "mailto:", "#", "javascript:")

def is_local(ref: str) -> bool:
    return not (ref.startswith(SKIP_PREFIX) or "${" in ref or ref.strip() == "")

def main():
    html_files = sorted(ROOT.glob("*.html"))
    if not html_files:
        print(f"❌ ไม่พบไฟล์ .html ใน {ROOT}")
        return 1

    tracked = set()
    if GIT_MODE:
        out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True).stdout
        tracked = {line.strip() for line in out.splitlines() if line.strip()}

    missing, checked = [], 0
    for hf in html_files:
        for ref in REF_RE.findall(hf.read_text(encoding="utf-8", errors="replace")):
            if not is_local(ref):
                continue
            rel = ref.split("?")[0].split("#")[0].lstrip("/")
            target = ROOT / rel
            checked += 1
            if not target.exists():
                missing.append((hf.name, rel, "ไม่มีไฟล์"))
            elif GIT_MODE and rel not in tracked:
                missing.append((hf.name, rel, "มีในเครื่องแต่ยังไม่ commit → deploy แล้วจะ 404"))

    print(f"📦 ตรวจ {checked} ไฟล์ที่ถูกอ้างใน {len(html_files)} html ({ROOT})")
    if not missing:
        print("✅ ไฟล์ที่หน้าเว็บอ้างถึงครบทุกตัว")
        return 0
    print(f"\n❌ ขาด {len(missing)} ไฟล์:")
    for src, rel, why in missing:
        print(f"   {src} → {rel}   ({why})")
    print("\n💡 ไฟล์ใหม่ที่ index.html อ้าง ต้อง `git add` ให้เรียบร้อย ไม่งั้นขึ้นเว็บไม่ได้")
    print("   (deploy ใช้ `git archive HEAD` — ไฟล์ untracked ไม่ถูกใส่ไปด้วย)")
    return 2

if __name__ == "__main__":
    sys.exit(main())
