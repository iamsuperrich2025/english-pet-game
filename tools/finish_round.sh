#!/usr/bin/env bash
# ============================================================
# 🏁 finish_round.sh — จบรอบครบวงจรในคำสั่งเดียว (รอบ 543)
# แทนการยิงคำสั่งแยก 8-10 ก้อนทุกรอบ (บัมพ์ version → commit pin pathspec →
# rotate → deploy → curl ยืนยัน live → commit handoff → push → ตรวจ stat)
# และย่อ output ของ deploy ให้เหลือบรรทัดที่ต้องรู้ = ประหยัด token ทุกรอบ
#
# ใช้ (อัปเดต handoff/TASKS.md ให้เสร็จก่อนค่อยเรียก):
#   bash tools/finish_round.sh "รอบ 543: ข้อความ commit" js/invasion3d.js [ไฟล์อื่น...]
# ออปชัน (ใส่ก่อนข้อความ):
#   --sw "โน้ต"    บัมพ์ sw.js CACHE_VERSION +1 พร้อมโน้ต (ใช้เมื่อแตะไฟล์ shell)
#   --no-deploy    งานเอกสาร/tools ไม่แตะไฟล์เกม: ข้ามบัมพ์ version+deploy+curl
#   --dry          พิมพ์แผนอย่างเดียว ไม่แตะอะไรจริง
# git hooks (.githooks) ทำงานตามปกติ — ถ้าโดนบล็อก = มี session คู่ขนาน ให้ทำตามที่ hook บอก
# ============================================================
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"; cd "$REPO"
SW_NOTE=""; DEPLOY=1; DRY=0
while [[ "$1" == --* ]]; do case "$1" in
  --sw) SW_NOTE="$2"; shift 2;;
  --no-deploy) DEPLOY=0; shift;;
  --dry) DRY=1; shift;;
  *) echo "❌ ไม่รู้จักออปชัน $1"; exit 1;;
esac; done
MSG="$1"; shift || true
if [[ -z "$MSG" || $# -eq 0 ]]; then
  echo "ใช้: bash tools/finish_round.sh [--sw \"โน้ต\"] [--no-deploy] [--dry] \"<commit msg>\" ไฟล์ที่แก้..."; exit 1
fi
FILES=("$@")

# ── 1) บัมพ์ version.json (+sw.js ถ้าสั่ง) ──────────────────────────────
NEW=""
if [[ $DEPLOY -eq 1 ]]; then
  OLD=$(python -c "import json;print(json.load(open('version.json'))['v'])")
  NEW="$(date +%F).$(( ${OLD##*.} + 1 ))"
  echo "🔢 version: $OLD → $NEW"
  [[ $DRY -eq 0 ]] && printf '{ "v": "%s" }\n' "$NEW" > version.json
  FILES+=(version.json)
fi
if [[ -n "$SW_NOTE" ]]; then
  V=$(grep -oE "pet-vocab-v[0-9]+" sw.js | head -1 | grep -oE "[0-9]+")
  echo "🧹 sw.js: v$V → v$((V+1)) ($SW_NOTE)"
  [[ $DRY -eq 0 ]] && sed -i -E "s|pet-vocab-v$V';.*|pet-vocab-v$((V+1))';  // v$((V+1)): $SW_NOTE|" sw.js
  FILES+=(sw.js)
fi
if [[ $DRY -eq 1 ]]; then
  echo "🧪 dry: จะ commit [${FILES[*]}] → $([[ $DEPLOY -eq 1 ]] && echo 'deploy+curl ยืนยัน' || echo 'rotate (ไม่ deploy)') → commit handoff → push"; exit 0
fi

# ── 2) commit โค้ด (pin pathspec — hooks ตรวจ session คู่ขนานให้) ────────
git add -- "${FILES[@]}"
git commit -m "$MSG" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" -- "${FILES[@]}"

# ── 3) deploy (rotate อยู่ในสคริปต์ deploy แล้ว) หรือ rotate เดี่ยว ─────
if [[ $DEPLOY -eq 1 ]]; then
  LOG="$(mktemp)"
  if bash tools/deploy_firebase.sh >"$LOG" 2>&1; then
    grep -E "Deploy complete|Hosting URL|⚠️" "$LOG" | tail -4
  else
    echo "❌ deploy ล้มเหลว — log เต็ม:"; cat "$LOG"; rm -f "$LOG"; exit 1
  fi
  rm -f "$LOG"
  LIVE=$(curl -s "https://vocabworld.web.app/version.json?t=$(date +%s)" | python -c "import json,sys;print(json.load(sys.stdin)['v'])")
  if [[ "$LIVE" == "$NEW" ]]; then echo "✅ live = $LIVE ตรงเลขที่บัมพ์"
  else echo "❌ live=$LIVE ≠ $NEW (เว็บยังไม่อัปเดต)"; exit 1; fi
else
  python tools/rotate_handoff.py | tail -4
fi

# ── 4) commit handoff (เฉพาะเมื่อมีของเปลี่ยน) + push ───────────────────
git add -- HANDOFF.md handoff 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "handoff: ${MSG#รอบ*: } + rotate" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" -- HANDOFF.md handoff
fi
echo "── commit ที่จะ push ──"
git log --oneline --stat -2 | grep -vE "^ *$" | head -20
git push
echo "🏁 จบรอบเรียบร้อย$([[ $DEPLOY -eq 1 ]] && echo " · live $NEW")"
