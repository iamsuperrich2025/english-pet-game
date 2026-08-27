#!/usr/bin/env bash
# ============================================================
# 🚀 ship.sh — "ปุ่มเดียวจบ" สำหรับส่งงานที่ AI ตัวอื่น (Codex ฯลฯ) แก้ไฟล์ทิ้งไว้ในเครื่อง
# (รอบ 1021 · ผู้ใช้สั่ง: "ถ้า Claude ติดลิมิท ต้อง commit/deploy เองได้ง่าย ๆ")
#
# ปัญหาที่แก้: Codex เขียนไฟล์ลงดิสก์ได้ แต่ sandbox ห้ามรัน git → ต้องมีคนกด commit/deploy ให้
# finish_round.sh เดิมต้องกรอกเอง 4 อย่าง (เลขรอบ/ข้อความ/รายชื่อไฟล์/ออปชัน) = จำยาก พลาดง่าย
# ตัวนี้ "เดาให้ครบทุกช่อง" แล้วให้แค่ยืนยัน y/n
#
# ใช้ (แนะนำ: ดับเบิลคลิก COMMIT_DEPLOY.bat ที่หน้าแรกของโปรเจกต์):
#   bash tools/ship.sh                    ← เดาทุกอย่าง แล้วถามยืนยัน
#   bash tools/ship.sh "ข้อความ commit"   ← กำหนดข้อความเอง (เลขรอบยังเติมให้)
#   bash tools/ship.sh -y                 ← ไม่ต้องถาม ลุยเลย
#   bash tools/ship.sh --dry              ← ดูแผนเฉย ๆ ไม่แตะอะไร
#   bash tools/ship.sh --only js/a.js ... ← ส่งเฉพาะไฟล์ tracked ที่ระบุ (กันกวาดงานแชทคู่ขนาน)
#
# ที่มาของข้อความ commit (ไล่ตามลำดับ):
#   1) อาร์กิวเมนต์ที่พิมพ์มา
#   2) ไฟล์ handoff/SHIP.txt บรรทัดแรก (ให้ AI เขียนทิ้งไว้ — ลบให้อัตโนมัติเมื่อสำเร็จ)
#      ถ้ามีบรรทัด `FILE: path` จะส่งเฉพาะรายการนั้น รวมไฟล์ asset ใหม่ได้โดยไม่กวาดงาน session อื่น
#   3) บรรทัด "**รอบ N ..." ที่เพิ่งถูกเพิ่มใน handoff/TASKS.md
#   4) ถามผู้ใช้
# ============================================================
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"; cd "$REPO"

YES=0; DRY=0; MSG=""; ONLY=()
while [[ $# -gt 0 ]]; do case "$1" in
  -y|--yes) YES=1; shift;;
  --dry) DRY=1; shift;;
  --only)
    [[ $# -ge 2 ]] || { echo "❌ --only ต้องตามด้วย path ไฟล์ tracked 1 ไฟล์"; exit 2; }
    ONLY+=("$2"); shift 2;;
  -h|--help) sed -n '2,25p' "$0"; exit 10;;
  *) MSG="$1"; shift;;
esac; done

say(){ printf '%s\n' "$*"; }
# ถามผู้ใช้ผ่าน /dev/tty (ดับเบิลคลิกแล้วยังถามได้) · ถ้าไม่มี tty (รันจากสคริปต์/AI) = ตอบไม่ได้
HAS_TTY=0; ( exec < /dev/tty ) >/dev/null 2>&1 && HAS_TTY=1
prompt(){ # $1=ข้อความ → พิมพ์คำตอบออก stdout
  local a
  if [[ $HAS_TTY -eq 1 ]]; then printf '%s ' "$1" > /dev/tty; read -r a < /dev/tty; else return 1; fi
  a="${a%$'\r'}" # Git Bash รับ Enter จากหน้าต่าง cmd เป็น CRLF; กัน "y\r" ถูกตีความเป็น n
  printf '%s' "$a"
}
ask(){ # y/n — ไม่มี tty ให้ถือว่า "ไม่" (ปลอดภัยไว้ก่อน)
  local a; a="$(prompt "$1")" || return 1; [[ "$a" == "y" || "$a" == "Y" ]]
}

# ── 1) หาไฟล์ที่เปลี่ยน (เฉพาะที่ git ติดตามอยู่แล้ว) ────────────────────
# ไฟล์ untracked (img/ sound/ ฯลฯ) ไม่ถูกหยิบโดยตั้งใจ = กันเผลอ commit asset ผู้ใช้
SHIPNOTE="handoff/SHIP.txt"
MANIFEST=()
if [[ -f "$SHIPNOTE" ]]; then
  mapfile -t MANIFEST < <(sed -n 's/^FILE:[[:space:]]*//p' "$SHIPNOTE" | sed 's/\r$//' | sed '/^$/d')
fi
if [[ ${#MANIFEST[@]} -gt 0 ]]; then
  CHANGED=()
  for f in "${MANIFEST[@]}"; do
    [[ "$f" != /* && "$f" != *".."* ]] || { say "❌ FILE path ไม่ปลอดภัย: $f"; exit 2; }
    # A tracked file may intentionally be deleted/renamed in this round. Keep its path so
    # finish_round.sh can commit the deletion, while still rejecting unknown missing paths.
    [[ -e "$f" ]] || git ls-files --error-unmatch -- "$f" >/dev/null 2>&1 \
      || { say "❌ FILE ไม่พบในเครื่องและไม่ใช่ไฟล์ tracked: $f"; exit 2; }
    CHANGED+=("$f")
  done
  mapfile -t CHANGED < <(printf '%s\n' "${CHANGED[@]}" | sort -u)
  say "🎯 ใช้รายการไฟล์เฉพาะรอบจาก $SHIPNOTE: ${#CHANGED[@]} ไฟล์"
elif [[ ${#ONLY[@]} -gt 0 ]]; then
  CHANGED=()
  for f in "${ONLY[@]}"; do
    # รอบ 1054: โหมด scope สำหรับเครื่องที่หลายแชทแก้ main พร้อมกัน — รับเฉพาะ path tracked แบบตรงตัว
    # ไม่รับไฟล์ใหม่/glob/.. เพื่อไม่ให้ธงนี้กลายเป็นช่องกวาด asset หรือไฟล์นอกโปรเจกต์
    [[ "$f" != /* && "$f" != *".."* ]] || { say "❌ --only path ไม่ปลอดภัย: $f"; exit 2; }
    git ls-files --error-unmatch -- "$f" >/dev/null 2>&1 || { say "❌ --only รับเฉพาะไฟล์ tracked: $f"; exit 2; }
    git diff --quiet HEAD -- "$f" || CHANGED+=("$f")
  done
  mapfile -t CHANGED < <(printf '%s\n' "${CHANGED[@]}" | sed '/^$/d' | sort -u)
  say "🎯 โหมดส่งเฉพาะงานรอบนี้ (--only): ${#CHANGED[@]} ไฟล์"
else
  mapfile -t CHANGED < <(git diff --name-only HEAD -- . | sort -u)
fi

# ไฟล์ "สร้างใหม่" ที่ยังไม่เข้า git — หยิบเฉพาะไฟล์โค้ดจริง (AI สร้างไฟล์ใหม่บ่อย เช่น js/data/picdict_grid.js)
# allowlist เข้มมาก เพราะโฟลเดอร์นี้มี asset/ของชั่วคราว untracked เต็มไปหมด (img/ sound/ *.wav *.patch ฯลฯ)
NEWF=()
if [[ ${#ONLY[@]} -eq 0 && ${#MANIFEST[@]} -eq 0 ]]; then
  mapfile -t NEWF < <(git ls-files --others --exclude-standard -- . \
    | grep -E '^(js/[^/]+\.js|js/data/[^/]+\.js|css/[^/]+\.css|tools/[^/]+\.(sh|py|js)|[^/]+\.(html|bat))$' \
    | grep -vE '^js/data/vocab' | sort -u)
fi
if [[ ${#NEWF[@]} -gt 0 ]]; then
  say "🆕 เจอไฟล์โค้ดที่สร้างใหม่ (ยังไม่เคยเข้า git):"
  printf '   - %s\n' "${NEWF[@]}"
  if [[ $YES -eq 1 ]] || ask "   เอาไฟล์ใหม่เหล่านี้ขึ้นด้วยไหม? (ถ้า AI เพิ่งสร้างให้ ตอบ y) (y/n)"; then CHANGED+=("${NEWF[@]}")
  else say "   → ข้ามไว้ (ยังอยู่ในเครื่อง ไม่หาย)"; fi
fi

if [[ ${#CHANGED[@]} -eq 0 ]]; then
  say "✅ ไม่มีไฟล์ที่แก้ค้างอยู่ — ไม่มีอะไรต้อง ship ครับ"
  say "   (ถ้าเพิ่งให้ AI แก้ ลองเช็กว่ามันเขียนลงโฟลเดอร์นี้จริงไหม: $REPO)"
  exit 10
fi

# ── 2) แยกประเภท: ปกติ / ต้องยืนยันก่อน / ห้ามแตะ ───────────────────────
FILES=(); RISKY=(); BLOCKED=()
for f in "${CHANGED[@]}"; do
  case "$f" in
    js/data/vocab/*)            BLOCKED+=("$f");;                 # งาน Sonnet ค้าง — ห้ามแตะ (HANDOFF)
    img/*|sound/*)              RISKY+=("$f");;                   # asset ผู้ใช้ — ต้องถามก่อนเสมอ
    *)                          FILES+=("$f");;
  esac
done
[[ ${#BLOCKED[@]} -gt 0 ]] && { say "⛔ ข้ามไฟล์ต้องห้าม (js/data/vocab/):"; printf '   - %s\n' "${BLOCKED[@]}"; }
if [[ ${#RISKY[@]} -gt 0 ]]; then
  say "⚠️  มีไฟล์ asset ถูกแก้ (ปกติ AI ไม่ควรแตะ — ต้องยืนยันเองเสมอ แม้ใส่ -y):"; printf '   - %s\n' "${RISKY[@]}"
  if ask "   เอาไฟล์เหล่านี้ขึ้นด้วยไหม? (y/n)"; then FILES+=("${RISKY[@]}"); else say "   → ข้ามไว้ (ยังอยู่ในเครื่อง ไม่หาย)"; fi
fi
[[ ${#FILES[@]} -eq 0 ]] && { say "❌ ไม่เหลือไฟล์ให้ commit"; exit 1; }

# ── 2.5) กันเก็บงานค้างของ session อื่นมาด้วย (สำคัญ!) ───────────────────
# เครื่องนี้รันหลาย AI/session พร้อมกัน — ไฟล์ที่ "แก้ไว้นานแล้ว" มักเป็นงานที่ยังทำไม่เสร็จของอีกคน
# เกณฑ์: ไฟล์ที่เก่ากว่าไฟล์ล่าสุดเกิน 2 ชม. = น่าสงสัย ต้องถามก่อนเสมอ
NEWEST=0
for f in "${FILES[@]}"; do [[ -e "$f" ]] || continue; m=$(stat -c %Y "$f" 2>/dev/null || echo 0); (( m > NEWEST )) && NEWEST=$m; done
KEEP=(); STALE=()
for f in "${FILES[@]}"; do
  m=$(stat -c %Y "$f" 2>/dev/null || echo "$NEWEST")
  if (( NEWEST - m > 7200 )); then STALE+=("$f"); else KEEP+=("$f"); fi
done
if [[ ${#STALE[@]} -gt 0 ]]; then
  say "🕰️  ไฟล์พวกนี้ถูกแก้ไว้นานแล้ว (ต่างจากไฟล์ล่าสุดเกิน 2 ชม.)"
  say "    มักแปลว่าเป็นงานค้างของ session อื่นที่ยังทำไม่เสร็จ — เอาขึ้นไปอาจพังได้:"
  for f in "${STALE[@]}"; do
    m=$(stat -c %Y "$f" 2>/dev/null || echo 0); H=$(( (NEWEST - m) / 3600 ))
    say "   - $f  (เก่ากว่า ~${H} ชม.)"
  done
  if ask "   เอาไฟล์เก่าเหล่านี้ขึ้นด้วยไหม? ปกติตอบ n (y/n)"; then KEEP+=("${STALE[@]}")
  else say "   → ข้ามไว้ (ยังอยู่ในเครื่องครบ ไม่หาย)"; fi
  FILES=("${KEEP[@]}")
  [[ ${#FILES[@]} -eq 0 ]] && { say "❌ ไม่เหลือไฟล์ให้ commit (ถูกข้ามหมด)"; exit 1; }
fi

# ── 3) ข้อความ commit + เลขรอบ ──────────────────────────────────────────
if [[ -z "$MSG" && -f "$SHIPNOTE" ]]; then
  MSG="$(grep -m1 -v '^[[:space:]]*$' "$SHIPNOTE" || true)"
  [[ -n "$MSG" ]] && say "📝 ใช้ข้อความจาก $SHIPNOTE"
fi
if [[ -z "$MSG" ]]; then                       # ดึงจากบันทึกรอบที่เพิ่งเพิ่มใน TASKS.md
  MSG="$(git diff -U0 -- handoff/TASKS.md | grep '^+' | grep -oE 'รอบ [0-9]+[^*]*' | head -1 | cut -c1-110 || true)"
  [[ -n "$MSG" ]] && say "📝 ใช้ข้อความจากบันทึกรอบใน handoff/TASKS.md"
fi
if [[ -z "$MSG" ]]; then
  MSG="$(prompt 'พิมพ์ข้อความ commit สั้น ๆ (ทำอะไรไป):')" || true
  if [[ -z "$MSG" ]]; then
    if [[ $DRY -eq 1 ]]; then MSG="(ยังไม่ได้ตั้งข้อความ)"
    else
      say "❌ ไม่รู้ว่าจะเขียนข้อความ commit ว่าอะไร — ทำอย่างใดอย่างหนึ่ง:"
      say "   • บอกให้ AI เขียนบันทึกรอบลง handoff/TASKS.md (ปกติมันทำอยู่แล้ว)"
      say "   • หรือให้ AI เขียนไฟล์ handoff/SHIP.txt บรรทัดเดียว = ข้อความ commit"
      say "   • หรือพิมพ์เอง:  bash tools/ship.sh \"ข้อความที่ต้องการ\""
      exit 1
    fi
  fi
fi
if ! [[ "$MSG" =~ ^รอบ[[:space:]]*[0-9]+: ]]; then     # ยังไม่มีคำนำหน้า "รอบ N:" → เติมให้
  N="$(python tools/rotate_handoff.py --next-round 2>/dev/null | tr -dc '0-9')"
  MSG="รอบ ${N:-?}: ${MSG#รอบ *: }"
fi

# ── 4) เดาออปชัน: แตะไฟล์ shell → --sw · แตะแต่เอกสาร → --no-deploy ─────
OPTS=(); KIND="deploy ขึ้นเว็บจริง"
if ! printf '%s\n' "${FILES[@]}" | grep -qE '^(functions/|js/|css/|.*\.html$|sw\.js$|manifest|index)'; then
  OPTS+=(--no-deploy); KIND="ไม่ deploy (แตะแต่เอกสาร/เครื่องมือ)"
else
  OPTS+=(--sw "${MSG#*: }")
fi

# ── 5) โชว์แผน แล้วยืนยัน ───────────────────────────────────────────────
say ""
say "══════════════ แผนที่จะทำ ══════════════"
say "💬 commit : $MSG"
say "📦 ไฟล์   : ${#FILES[@]} ไฟล์"
printf '   - %s\n' "${FILES[@]}"
say "🚀 ปลายทาง: $KIND"
git diff --stat HEAD -- "${FILES[@]}" | tail -1 | sed 's/^/📊 /'
if ! git diff --quiet HEAD -- handoff/TASKS.md; then say "📒 มีบันทึกรอบใน handoff/TASKS.md แล้ว ✓"
else say "📒 ⚠️ ยังไม่มีบันทึกรอบใน handoff/TASKS.md (session หน้าจะไม่รู้ว่าทำอะไรไป)"; fi
say "════════════════════════════════════════"
if [[ $DRY -eq 1 ]]; then say "🧪 dry — ไม่ได้แตะอะไรจริง"; exit 10; fi
if [[ $YES -eq 0 ]]; then ask "ส่งขึ้นเลยไหม? (y/n)" || { say "ยกเลิกครับ ไฟล์ยังอยู่ครบ"; exit 10; }; fi

# ── 6) ส่งจริงผ่าน finish_round.sh (ตรรกะเดิมที่ใช้อยู่ทุกวัน) ──────────
say ""
bash tools/finish_round.sh "${OPTS[@]}" "$MSG" "${FILES[@]}"
[[ -f "$SHIPNOTE" ]] && rm -f "$SHIPNOTE" && say "🧹 ลบ $SHIPNOTE แล้ว"
say "🎉 เรียบร้อยครับ"
