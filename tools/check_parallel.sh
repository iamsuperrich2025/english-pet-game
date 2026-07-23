#!/bin/sh
# ============================================================
# 🚦 กฎทองข้อ 10 — ตรรกะกลาง "ตรวจ session คู่ขนาน" (ที่เดียว ห้ามเขียนซ้ำ)
#
# เรียกจาก 3 ที่ (ทุกที่ผ่านสคริปต์นี้ ไม่มีตรรกะซ้ำ):
#   • SessionStart hook (~/.claude/settings.json) : boot        — เตือน "ตั้งแต่วินาทีบูต"
#   • .githooks/pre-commit                        : pre-commit  — กัน commit ทับงานคนอื่น
#   • .githooks/commit-msg                        : round <N>   — กันเลขรอบชน (เดิม hook grep เอง)
#
# โหมด (อาร์กิวเมนต์ตัวแรก):
#   (ไม่มี) | boot  → รายงานรวมตอนบูต: base นำหน้า + version.json ตามหลัง main + worktree อื่นที่ค้าง
#   pre-commit      → base นำหน้า + version.json (staged) ต้องใหม่กว่า main   (exit 1 = บล็อก commit)
#   round <N>       → เลขรอบ N ชนกับที่ commit บน main แล้วไหม               (exit 1 = ชน)
#
# กติกา (ห้ามหลุด): เงียบสนิทเมื่อทันสมัย · ใช้ ref ในเครื่อง "ห้าม fetch" · ได้ทั้ง repo หลัก + worktree
#   (main / origin/main แชร์กันทุก worktree อยู่แล้ว จึงเทียบ HEAD ของ worktree กับ main ได้ตรง)
# ============================================================

MODE=${1:-boot}

# ── หา repo dir: ยึด cwd ถ้าเป็น git repo (ครอบทั้ง repo หลัก + worktree) · ไม่งั้นยึดที่ตั้งสคริปต์เอง ──
SELF=$(CDPATH= cd -- "$(dirname -- "$0")/.." 2>/dev/null && pwd)
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO=$(git rev-parse --show-toplevel 2>/dev/null) || REPO=$SELF
else
  REPO=$SELF
fi
[ -n "$REPO" ] && cd "$REPO" 2>/dev/null || exit 0

# ระหว่าง rebase/merge/cherry-pick อย่าเตือน (กำลังจัดการเรื่องนี้อยู่พอดี) — ทุกโหมดข้ามพร้อมกัน
GD=$(git rev-parse --git-dir 2>/dev/null) || exit 0
for d in rebase-merge rebase-apply MERGE_HEAD CHERRY_PICK_HEAD; do
  [ -e "$GD/$d" ] && exit 0
done
git rev-parse --verify -q HEAD >/dev/null 2>&1 || exit 0

# ── python ที่ใช้ได้ (fail-open ถ้าไม่มี) ──
PY=python
command -v "$PY" >/dev/null 2>&1 || PY=py
command -v "$PY" >/dev/null 2>&1 || PY=python3
command -v "$PY" >/dev/null 2>&1 || PY=""

# ── ดึงเลข deploy จาก version.json ที่ป้อนทาง stdin (ตรรกะเดียวกับ pre-commit เดิม ②) ──
num(){ sed -n 's/.*"v"[^"]*"[0-9-]*\.\([0-9]\{1,\}\)".*/\1/p' 2>/dev/null | head -1; }

# ── เลขรอบสูงสุดที่ commit ขึ้น main แล้ว (ผ่าน rotate_handoff.py จุดเดียว) ──
#    ⚠️ ต้องเช็กว่าสคริปต์ "รองรับ --check-round" ก่อนเรียก — เช็กเอาต์เก่า (ก่อนรอบ 509) ยังไม่มีแฟลกนี้
#       ถ้าเรียกไปมันจะตกไป default = "รันหมุน handoff จริง" (side effect อันตราย) → กัน guard ด้วย grep ก่อน
committed_max_round(){
  [ -n "$PY" ] || return 0
  grep -q -- '--check-round' tools/rotate_handoff.py 2>/dev/null || return 0
  "$PY" tools/rotate_handoff.py --check-round 0 2>/dev/null | head -1
}

# ── หา base แรกที่ "นำหน้า HEAD" → คืนผ่านตัวแปร ahead_base / ahead_n ──
detect_ahead(){
  ahead_base=""; ahead_n=0
  for base in main origin/main; do
    git rev-parse --verify -q "$base" >/dev/null 2>&1 || continue
    [ "$(git rev-parse HEAD)" = "$(git rev-parse "$base")" ] && continue
    git merge-base --is-ancestor "$base" HEAD 2>/dev/null && continue
    ahead_base=$base
    ahead_n=$(git rev-list --count "HEAD..$base" 2>/dev/null)
    break
  done
}

# ── ① รายงาน "base นำหน้า HEAD" (ใช้ทั้ง boot + pre-commit) · คืน 1 ถ้าพิมพ์รายงาน ──
report_base(){
  detect_ahead
  [ -n "$ahead_base" ] || return 0
  printf '🚦 กฎทองข้อ 10 — มี session คู่ขนานลงงานแล้ว: %s นำหน้า HEAD อยู่ %s commit\n' "$ahead_base" "$ahead_n"
  git log --oneline -3 "HEAD..$ahead_base" 2>/dev/null | sed 's/^/     /'
  maxround=$(committed_max_round)
  if [ -n "$maxround" ] && [ "$maxround" -gt 0 ] 2>/dev/null; then
    printf '   ▸ เลขรอบล่าสุดบน main = รอบ %s → งานใหม่เริ่มที่รอบ %s (ขอเลขชัวร์: %s tools/rotate_handoff.py --next-round)\n' \
      "$maxround" "$((maxround + 1))" "${PY:-python}"
  fi
  printf '   ▸ งานเรื่องเดียวกัน/ผลลัพธ์เดียวกัน → หยุด รอเขาเสร็จก่อน แล้วทำเฉพาะส่วนที่ยังไม่สมบูรณ์\n'
  printf '   ▸ คนละเรื่อง (แค่ไฟล์ชนกัน)       → git rebase %s แล้ว **วัดผลซ้ำ** ก่อน commit\n' "$ahead_base"
  return 1
}

# ── ② รายงาน "version.json ตามหลัง main" · $1=เลขของเรา $2=ตัวเทียบ(-lt/-le) $3=label $4=note ──
#    -lt (boot): เตือนเฉพาะตอน main ใหม่กว่าจริง (เท่ากัน=เงียบ) · -le (pre-commit): commit ต้องใหม่กว่าเสมอ
#    คืน 1 ถ้าพิมพ์รายงาน
report_version(){
  vmine=$1; vop=$2; vlabel=$3; vnote=$4
  [ -n "$vmine" ] || return 0
  for base in main origin/main; do
    vtheirs=$(git show "$base:version.json" 2>/dev/null | num)
    [ -n "$vtheirs" ] || continue
    if [ "$vmine" "$vop" "$vtheirs" ]; then
      printf '🚦 version.json (%s): .%s ไม่ใหม่กว่า %s (.%s) — เลข deploy จะชนกัน\n' "$vlabel" "$vmine" "$base" "$vtheirs"
      printf '   ▸ บัมพ์เป็น .%s ขึ้นไป%s\n' "$((vtheirs + 1))" "$vnote"
      return 1
    fi
  done
  return 0
}

# ── ③ รายงาน "worktree อื่นที่ค้าง" (boot เท่านั้น) — โชว์เฉพาะอันที่ HEAD ต่าง/ตามหลัง main (กันรก) ──
report_worktrees(){
  wt_main=$(git rev-parse --verify -q main 2>/dev/null) || return 0
  wt_self=$(git rev-parse HEAD 2>/dev/null)
  git worktree list --porcelain 2>/dev/null | {
    hdr=0; wt=""; hd=""; dead=""; dead_n=0
    emit(){
      [ -n "$wt" ] && [ -n "$hd" ] || return 0
      [ "$hd" = "$wt_self" ] && return 0      # ตัวเราเอง (หรือ worktree ที่อยู่ commit เดียวกับเรา)
      [ "$hd" = "$wt_main" ] && return 0      # อยู่ที่ main เป๊ะ = ไม่มีงานค้าง
      ah=$(git rev-list --count "$wt_main..$hd" 2>/dev/null)   # นำ main กี่ commit (งานยังไม่รวมเข้า main)
      if [ "${ah:-0}" -gt 0 ] 2>/dev/null; then
        # นำ main >0 = session กำลังทำอยู่ → โชว์เด่น + หัวข้อ commit ล่าสุด (subject) รู้ว่าเขาทำเรื่องอะไร กันทำซ้ำ
        bh=$(git rev-list --count "$hd..$wt_main" 2>/dev/null)
        subj=$(git log -1 --format=%s "$hd" 2>/dev/null)
        rn=$(printf '%s' "$subj" | sed -n 's/.*รอบ \([0-9]\{1,\}\).*/\1/p')
        if [ -n "$rn" ]; then rn="รอบ $rn"; else rn=$(printf '%.7s' "$hd"); fi
        if [ "$hdr" = 0 ]; then
          printf '🌿 worktree อื่นที่ยังทำงานอยู่ (มี commit ยังไม่รวม main — เช็กก่อนเริ่ม กันทำซ้ำ):\n'
          hdr=1
        fi
        printf '     ⚡ %-24s %-9s นำ main %s · ตาม %s — กำลังทำ: %s\n' "${wt##*/}" "$rn" "$ah" "$bh" "$subj"
      else
        # นำ 0 = commit รวม main แล้ว (session ตาย/เสร็จ) → รวบเป็นบรรทัดเดียวท้ายสุด ลด noise เมื่อค้างเยอะ
        dead_n=$((dead_n + 1))
        if [ -z "$dead" ]; then dead="${wt##*/}"; else dead="$dead, ${wt##*/}"; fi
      fi
    }
    while IFS= read -r line; do
      case "$line" in
        "worktree "*) emit; wt=${line#worktree }; hd="" ;;
        "HEAD "*)     hd=${line#HEAD } ;;
      esac
    done
    emit
    [ "$dead_n" -gt 0 ] && printf '🗑️ worktree ที่รวม main แล้ว %s อัน (%s) — เก็บกวาด: bash tools/clean_worktrees.sh\n' "$dead_n" "$dead"
  }
}

# ── เช็กเลขรอบชน (commit-msg) — ผ่าน rotate_handoff.py จุดเดียว (มี guard กันเวอร์ชันเก่า) · คืน 1 ถ้าชน ──
check_round(){
  n=$1
  [ -n "$n" ] || return 0
  [ -n "$PY" ] || return 0                                                     # ไม่มี python → fail-open
  grep -q -- '--check-round' tools/rotate_handoff.py 2>/dev/null || return 0   # สคริปต์เก่า → fail-open (ห้ามเผลอรันหมุน)
  theirs=$("$PY" tools/rotate_handoff.py --check-round "$n" 2>/dev/null); rc=$?
  [ "$rc" -eq 1 ] || return 0                                                  # 0=ว่าง / 2=ใช้ผิด / พัง → ปล่อยผ่าน
  printf '🚦 เลขรอบชน: กำลังจะ commit "รอบ %s" แต่ main/origin บันทึกถึงรอบ %s แล้ว\n' "$n" "${theirs:-?}"
  printf '   ▸ ถ้าเป็น "งานเดียวกัน" → หยุด ให้ session นั้นทำให้เสร็จก่อน\n'
  printf '   ▸ ถ้าคนละเรื่อง → rebase แล้วเปลี่ยนเลขรอบตัวเองเป็น %s ขึ้นไป (ในโค้ด/คอมเมนต์/TASKS.md ด้วย)\n' "$(( ${theirs:-0} + 1 ))"
  printf '   ▸ ขอเลขรอบว่างถัดไปแบบชัวร์: %s tools/rotate_handoff.py --next-round\n' "$PY"
  return 1
}

# ── dispatch ─────────────────────────────────────────────────
case "$MODE" in
  round)
    check_round "$2"; exit $?
    ;;
  pre-commit)
    rc=0
    report_base || rc=1
    if git diff --cached --name-only 2>/dev/null | grep -qx 'version.json'; then
      report_version "$(git show :version.json 2>/dev/null | num)" -le "ที่จะ commit" " (ทำหลัง rebase เท่านั้น)" || rc=1
    fi
    exit $rc
    ;;
  *)  # boot / SessionStart — รายงานรวม (ข้อมูลล้วน ไม่บล็อกอะไร · เงียบสนิทเมื่อไม่มีอะไรค้าง)
    report_base || true
    report_version "$(git show HEAD:version.json 2>/dev/null | num)" -lt "HEAD" "" || true
    report_worktrees || true
    exit 0
    ;;
esac
