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

# ── 1) บัมพ์ version.json (SW/cache ใช้ build id นี้อัตโนมัติ) ─────────
NEW=""
if [[ $DEPLOY -eq 1 ]]; then
  OLD=$(python -c "import json;d=json.load(open('version.json'));print(d.get('version') or d['v'])")
  NEW="$(date +%F).$(( ${OLD##*.} + 1 ))"
  echo "🔢 version: $OLD → $NEW"
  if [[ $DRY -eq 0 ]]; then
    NEW_VERSION="$NEW" python - <<'PY'
import json, os
from datetime import datetime
from pathlib import Path

data = {
    "version": os.environ["NEW_VERSION"],
    "updated": datetime.now().astimezone().isoformat(timespec="seconds"),
}
Path("version.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
PY
  fi
  FILES+=(version.json)
fi
if [[ -n "$SW_NOTE" ]]; then
  echo "🧹 sw.js: cache namespace follows version.json ($SW_NOTE)"
  FILES+=(sw.js)
fi
if [[ $DRY -eq 1 ]]; then
  echo "🧪 dry: จะ commit [${FILES[*]}] → $([[ $DEPLOY -eq 1 ]] && echo 'deploy+curl ยืนยัน' || echo 'rotate (ไม่ deploy)') → commit handoff → push"; exit 0
fi

# ── 2) commit โค้ด (pin pathspec — hooks ตรวจ session คู่ขนานให้) ────────
# รอบ 863: ไฟล์ที่ถูกลบ/rename (เช่น index2.html → index.html) ไม่มีในเวิร์กทรีแล้ว → `git add` จะ fatal
#          ให้ add เฉพาะไฟล์ที่ยังมีจริง ส่วนการลบที่ stage ไว้แล้ว `git commit -- <path>` เก็บให้เองอยู่แล้ว
ADD=(); for f in "${FILES[@]}"; do [[ -e "$f" ]] && ADD+=("$f"); done
[[ ${#ADD[@]} -gt 0 ]] && git add -- "${ADD[@]}"
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
  LIVE=$(curl -s "https://vocabworld.web.app/version.json?t=$(date +%s)" | python -c "import json,sys;d=json.load(sys.stdin);print(d.get('version') or d['v'])")
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
