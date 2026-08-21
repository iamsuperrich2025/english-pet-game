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
  + ไฟล์ runtime ที่ build ต้องอ่านโดยตรง แม้ไม่ได้อ้างจาก HTML (เช่น cockpit ของ F1)
  + 🎓 ไฟล์คลังศัพท์ขั้นสูงที่ `js/bandadv.js` fetch แบบขี้เกียจตามรายชื่อใน `js/data/band/manifest.js`
    (เกิดจากรอบ 767: ไฟล์คำ 20 ตัวไม่เคย commit — index.html ไม่ได้อ้างตรง ๆ จึงรอดด่านนี้ไป 12 วัน
     ผลคือกดการ์ด "ศัพท์วิชาการ/ธุรกิจ" แล้วขึ้น "โหลดคลังศัพท์ไม่สำเร็จ" บนเว็บจริง)
  + 📖 ไฟล์คลังศัพท์ใหญ่ตามระดับที่ `js/dictband.js` โหลดขี้เกียจผ่าน `<script>` tag ตามรายชื่อใน
    `js/data/dict_band/manifest.js` (รอบ 769: เผื่อช่องโหว่แบบเดียวกับ band adv — เนียนไปเหมือนกัน
     เพราะไฟล์ db<band>_*.js ก็ไม่ได้ถูก index.html อ้างตรง ๆ เช่นกัน)
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

BAND_F_RE = re.compile(r'"f"\s*:\s*"([^"]+)"')
LAZY_MANIFESTS = (
    ("js/data/band/manifest.js", "js/data/band/"),             # bandadv.js (fetch+json)
    ("js/data/dict_band/manifest.js", "js/data/dict_band/"),   # dictband.js (<script> tag)
)

# ไฟล์ที่ tools/build_web.mjs อ่านโดยตรงเพื่อสร้าง immutable alias จึงต้องอยู่ใน git HEAD
# ไม่ใช่แค่มีใน working tree มิฉะนั้น local build ผ่าน แต่ staged deploy จาก git archive จะพัง
REQUIRED_BUILD_ASSETS = (
    ("tools/build_web.mjs", "img/f1/cockpit_body_realistic.png"),
    ("tools/build_web.mjs", "img/f1/peer_car_25d.png"),
)

PICDICT_RE = re.compile(r"""['"]([^'"/]+\.png)['"]""")

def picdict_refs():
    """📖 แผ่นหนังสือ Picture Dictionary (รอบ 993) — js/picdict.js ประกอบ src เองจากสารบัญ
    js/data/picdict.js จึงไม่มี src= ใน html ให้ด่านหลักเห็น · ต้นฉบับ .png 91MB เป็น untracked
    ตลอด (ห้ามขึ้น repo) เกมจึงใช้แผ่นย่อ img/matching/web/*.webp — ตัวที่ต้องขึ้นเว็บคือ .webp
    (รอบ 992 หลุดด่านนี้ไป: หนังสือขึ้นเว็บแล้วภาพ 404 ทั้งเล่ม เจอตอน curl เช็กเอง)"""
    mf = ROOT / "js/data/picdict.js"
    if not mf.exists():
        return []
    src = mf.read_text(encoding="utf-8", errors="replace")
    return [("js/data/picdict.js", "img/matching/web/" + f[:-4] + ".webp")
            for f in PICDICT_RE.findall(src)]

def lazy_manifest_refs():
    """ไฟล์คำศัพท์ที่โหลดขี้เกียจตาม manifest — ไม่ใช่ <script src> ตรง ๆ ใน html จึงต้องตามหาเอง"""
    out = []
    for manifest, prefix in LAZY_MANIFESTS:
        mf = ROOT / manifest
        if not mf.exists():
            continue
        src = mf.read_text(encoding="utf-8", errors="replace")
        out += [(manifest, prefix + f) for f in BAND_F_RE.findall(src)]
    return out

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

    for src_name, rel in lazy_manifest_refs() + picdict_refs() + list(REQUIRED_BUILD_ASSETS):
        checked += 1
        if not (ROOT / rel).exists():
            missing.append((src_name, rel, "ไม่มีไฟล์ที่ runtime/build ต้องใช้"))
        elif GIT_MODE and rel not in tracked:
            missing.append((src_name, rel, "มีในเครื่องแต่ยังไม่ commit → deploy แล้วจะ 404"))

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
