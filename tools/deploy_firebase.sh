#!/usr/bin/env bash
# ============================================================
# Deploy "Vocab World" ขึ้น Firebase Hosting (รอบ 134 — ย้ายจาก GitHub Pages)
# ใช้:  bash tools/deploy_firebase.sh
# เงื่อนไข: firebase login ค้างไว้แล้ว (ครั้งแรกผู้ใช้กดยืนยันในเบราว์เซอร์)
# หลักการ: เอาไฟล์จาก "git HEAD" เท่านั้น (git archive) → ไฟล์ untracked/WIP
#          ของ session คู่ขนาน (vocab/, pet_cat.glb, ghosts_recovered/ ฯลฯ) ไม่หลุดขึ้นเว็บ
# ============================================================
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="$(cygpath -u "${TEMP:-/tmp}" 2>/dev/null || echo /tmp)/vocabworld_deploy"   # tar ต้องการ POSIX path
export PATH="/c/Users/rober/bin/node:$PATH"   # Node พกพา + firebase-tools (npm -g) — ตัว standalone .exe ใช้ไม่ได้ (firepit crash)
FB="firebase"
SITE="vocabworld"                        # → https://vocabworld.web.app (แก้ตรงนี้ถ้าชื่อโดนจอง)
PROJECT="english-pet-game"               # Firebase project เดิม (Auth/RTDB ไม่ต้องย้าย)

# 💰 กันลืม (รอบ 250): หมุน handoff ให้ผอม + เจน CODE_MAP ใหม่ ทุกครั้งที่ deploy
#    แก้ไฟล์ handoff ใน working tree เท่านั้น (deploy ใช้ git HEAD ไม่กระทบ) — จบงานอย่าลืม commit handoff ตามปกติ
python "$REPO/tools/rotate_handoff.py" || echo "⚠️ rotate_handoff ข้ามไป (ไม่กระทบ deploy)"

echo "📦 เตรียมไฟล์จาก git HEAD → $STAGE"
rm -rf "$STAGE" && mkdir -p "$STAGE/public"
cd "$REPO"
git archive HEAD | tar -x -C "$STAGE/public"
rm -rf "$STAGE/public/handoff" "$STAGE/public/tools"
rm -f  "$STAGE/public"/*.md              # PROMPTS_*.md / TASK_*.md ไม่ใช่ของผู้เล่น

cat > "$STAGE/firebase.json" <<'EOF'
{
  "hosting": {
    "site": "vocabworld",
    "public": "public",
    "ignore": ["firebase.json"],
    "headers": [
      { "source": "**/*.@(js|css|html|json)", "headers": [ { "key": "Cache-Control", "value": "no-cache" } ] },
      { "source": "/", "headers": [ { "key": "Cache-Control", "value": "no-cache" } ] },
      { "source": "**/*.@(png|jpg|jpeg|webp|glb|mp3|ico)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=604800" } ] }
    ]
  }
}
EOF
cat > "$STAGE/.firebaserc" <<EOF
{ "projects": { "default": "$PROJECT" } }
EOF

echo "🚀 deploy → https://$SITE.web.app"
cd "$STAGE"
"$FB" deploy --only "hosting:$SITE" --project "$PROJECT"

# 🧹 ล้าง Hosting versions เก่า (รอบ 158) — กันชนโควตา storage แผนฟรี (429)
# พลาดไม่เป็นไร deploy สำเร็จไปแล้ว (|| true)
node "$REPO/tools/cleanup_hosting_versions.mjs" || echo "⚠️ cleanup ข้ามไป (ไม่กระทบ deploy)"
