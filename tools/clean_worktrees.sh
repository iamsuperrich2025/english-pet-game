#!/bin/sh
# ============================================================
# 🧹 tools/clean_worktrees.sh — เก็บกวาด worktree ที่ "รวมเข้า main แล้ว"
#    (นำ main 0 commit = ไม่มี commit ค้างที่ยังไม่รวม main = ลบทิ้งได้ไม่เสียงาน)
#
# ปลอดภัยเป็นหลัก (คู่กับ report_worktrees ใน check_parallel.sh):
#   • default = DRY-RUN — แค่โชว์ว่าจะลบอะไร "ไม่ลบจริง" · ลบจริงต้องใส่ --yes
#   • ไม่แตะ worktree หลัก (primary — git list เป็นอันแรกเสมอ) และ worktree ที่กำลังยืนอยู่
#   • "นำ main >0" (session ยังทำงานอยู่) ไม่ถูกแตะเด็ดขาด
#   • ไม่ใช้ --force → ถ้ามีไฟล์แก้ค้าง/untracked git จะไม่ยอมลบ (กันทิ้งงานที่ยังไม่ commit) แล้วข้ามให้ + เตือน
#
# ใช้:  bash tools/clean_worktrees.sh          # ดูรายการที่จะลบ (ไม่ลบ)
#       bash tools/clean_worktrees.sh --yes    # ลบจริง
# ============================================================

DO=0
[ "$1" = "--yes" ] && DO=1

# ── repo root (ครอบทั้ง repo หลัก + worktree — เหมือน check_parallel.sh) ──
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO=$(git rev-parse --show-toplevel 2>/dev/null)
else
  REPO=$(CDPATH= cd -- "$(dirname -- "$0")/.." 2>/dev/null && pwd)
fi
[ -n "$REPO" ] && cd "$REPO" 2>/dev/null || { echo "หา repo ไม่เจอ"; exit 1; }

main_sha=$(git rev-parse --verify -q main 2>/dev/null) || { echo "ไม่มี branch main"; exit 1; }
cur=$(git rev-parse --show-toplevel 2>/dev/null)

n=0; removed=0; skipped=0; first=1; wt=""; hd=""

handle(){
  [ -n "$wt" ] || return 0
  if [ "$first" = 1 ]; then first=0; return 0; fi          # worktree หลัก (อันแรก) — ห้ามลบ
  [ "$wt" = "$cur" ] && return 0                           # อันที่ยืนอยู่
  [ -n "$hd" ] || return 0
  ah=$(git rev-list --count "$main_sha..$hd" 2>/dev/null)
  [ "${ah:-0}" -gt 0 ] 2>/dev/null && return 0            # นำ main >0 = ยังทำงานอยู่ → ไม่แตะ
  n=$((n + 1))
  rn=$(git log -1 --format=%s "$hd" 2>/dev/null | sed -n 's/.*รอบ \([0-9]\{1,\}\).*/\1/p')
  if [ "$DO" = 1 ]; then
    if git worktree remove "$wt" 2>/dev/null; then
      printf '   ✅ ลบแล้ว: %s  (รอบ %s)\n' "$wt" "${rn:-?}"; removed=$((removed + 1))
    else
      printf '   ⏭️  ข้าม (มีไฟล์ค้าง/ลบไม่ได้ — ตรวจเองก่อน): %s\n' "$wt"; skipped=$((skipped + 1))
    fi
  else
    printf '   • %s  (รอบ %s)\n' "$wt" "${rn:-?}"
  fi
}

# อ่าน porcelain ทีละ record (path อยู่บรรทัดเดียว รองรับ path มีช่องว่าง) · flush เมื่อเจอ worktree ตัวถัดไป
while IFS= read -r line; do
  case "$line" in
    "worktree "*) handle; wt=${line#worktree }; hd="" ;;
    "HEAD "*)     hd=${line#HEAD } ;;
  esac
done <<EOF
$(git worktree list --porcelain 2>/dev/null)
EOF
handle

if [ "$n" = 0 ]; then
  echo "🧹 ไม่มี worktree ที่รวม main แล้วให้เก็บกวาด (ทุกอันยังทำงานอยู่ หรือเป็นอันหลัก/อันปัจจุบัน)"
  exit 0
fi
if [ "$DO" = 1 ]; then
  printf '🧹 เสร็จ: ลบ %s · ข้าม %s (จาก %s อัน)\n' "$removed" "$skipped" "$n"
else
  printf '\n☝️ worktree ที่รวม main แล้ว %s อัน (ยังไม่ลบ) — ลบจริงสั่ง: bash tools/clean_worktrees.sh --yes\n' "$n"
fi
