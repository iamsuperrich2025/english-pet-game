#!/bin/sh
# ============================================================
# 🚦 กฎทองข้อ 10 — ตรวจ "session คู่ขนานนำหน้าเราไปแล้ว" (ตรรกะกลางที่เดียว)
#
# ใช้ร่วมกัน 2 ที่ (อย่าเขียนโค้ดซ้ำ):
#   • .githooks/pre-commit   — กันไม่ให้ commit ทับงานคนอื่น (เช็กตอนจะ commit)
#   • SessionStart hook       — เตือน "ตั้งแต่วินาทีบูต" ก่อนจะเริ่มทำงานซ้ำ
#
# ทำอะไร: หา base (main / origin/main) ที่ "นำหน้า HEAD" (มี commit ที่ HEAD ยังไม่มี)
#   • ไม่มี → เงียบสนิท exit 0 (บูตทุกครั้งจะได้ไม่มี noise เปลือง token)
#   • มี   → พิมพ์รายงาน (base นำหน้ากี่ commit + หัวข้อ 3 อันล่าสุด + เลขรอบล่าสุดบน main) → exit 1
#
# ใช้ ref ในเครื่องเท่านั้น "ห้าม fetch" (ต้องไม่หน่วงตอนบูต) · ทำงานได้ทั้ง repo หลักและ worktree
#   (main / origin/main แชร์กันทุก worktree อยู่แล้ว จึงเทียบ HEAD ของ worktree กับ main ได้ตรง)
# ============================================================

# ── หา repo dir: ยึด cwd ถ้าเป็น git repo (ครอบทั้ง repo หลัก + worktree) · ไม่งั้นยึดที่ตั้งสคริปต์เอง ──
SELF=$(CDPATH= cd -- "$(dirname -- "$0")/.." 2>/dev/null && pwd)
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO=$(git rev-parse --show-toplevel 2>/dev/null) || REPO=$SELF
else
  REPO=$SELF
fi
[ -n "$REPO" ] && cd "$REPO" 2>/dev/null || exit 0

# ระหว่าง rebase/merge/cherry-pick อย่าเตือน (กำลังจัดการเรื่องนี้อยู่พอดี)
GD=$(git rev-parse --git-dir 2>/dev/null) || exit 0
for d in rebase-merge rebase-apply MERGE_HEAD CHERRY_PICK_HEAD; do
  [ -e "$GD/$d" ] && exit 0
done
git rev-parse --verify -q HEAD >/dev/null 2>&1 || exit 0

# ── หา base แรกที่ "นำหน้า HEAD" ──────────────────────────────
ahead_base=""; ahead_n=0
for base in main origin/main; do
  git rev-parse --verify -q "$base" >/dev/null 2>&1 || continue
  [ "$(git rev-parse HEAD)" = "$(git rev-parse "$base")" ] && continue
  git merge-base --is-ancestor "$base" HEAD 2>/dev/null && continue
  ahead_base=$base
  ahead_n=$(git rev-list --count "HEAD..$base" 2>/dev/null)
  break
done

# ทันสมัย → เงียบสนิท (ไม่มี output = ไม่มี noise ตอนบูต)
[ -n "$ahead_base" ] || exit 0

# ── เลขรอบล่าสุดที่ commit ขึ้น main แล้ว (ตรรกะเดียวกับ commit-msg: rotate_handoff.py) ──
# ⚠️ ต้องเช็กว่าสคริปต์ "รองรับ --check-round" ก่อนเรียก — เช็กเอาต์เก่า (ก่อนรอบ 509) ยังไม่มีแฟลกนี้
#    ถ้าเรียกไปมันจะตกไป default = "รันหมุน handoff จริง" (side effect อันตราย) → ต้องกันไว้
PY=python
command -v "$PY" >/dev/null 2>&1 || PY=py
command -v "$PY" >/dev/null 2>&1 || PY=python3
command -v "$PY" >/dev/null 2>&1 || PY=""
maxround=""
if [ -n "$PY" ] && grep -q -- '--check-round' tools/rotate_handoff.py 2>/dev/null; then
  maxround=$("$PY" tools/rotate_handoff.py --check-round 0 2>/dev/null | head -1)
fi

# ── รายงาน (stdout) ──────────────────────────────────────────
printf '🚦 กฎทองข้อ 10 — มี session คู่ขนานลงงานแล้ว: %s นำหน้า HEAD อยู่ %s commit\n' "$ahead_base" "$ahead_n"
git log --oneline -3 "HEAD..$ahead_base" 2>/dev/null | sed 's/^/     /'
if [ -n "$maxround" ] && [ "$maxround" -gt 0 ] 2>/dev/null; then
  printf '   ▸ เลขรอบล่าสุดบน main = รอบ %s → งานใหม่เริ่มที่รอบ %s (ขอเลขชัวร์: %s tools/rotate_handoff.py --next-round)\n' \
    "$maxround" "$((maxround + 1))" "${PY:-python}"
fi
printf '   ▸ งานเรื่องเดียวกัน/ผลลัพธ์เดียวกัน → หยุด รอเขาเสร็จก่อน แล้วทำเฉพาะส่วนที่ยังไม่สมบูรณ์\n'
printf '   ▸ คนละเรื่อง (แค่ไฟล์ชนกัน)       → git rebase %s แล้ว **วัดผลซ้ำ** ก่อน commit\n' "$ahead_base"
exit 1
