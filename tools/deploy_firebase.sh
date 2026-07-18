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
STAGE="$(cygpath -u "${TEMP:-/tmp}" 2>/dev/null || echo /tmp)/vocabworld_deploy_$$"   # tar ต้องการ POSIX path · _$$ = ต่อ PID กัน 2 session deploy พร้อมกันชนโฟลเดอร์กัน (เจอจริงรอบ 291)
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

# 🕵️ ด่านกันบั๊กเงียบ (รอบ 323): สแกน "ฟังก์ชันที่ถูกเรียกแต่ไม่มีอยู่จริง" ในไฟล์ที่กำลังจะขึ้นเว็บจริง
#    (ตรวจสำเนา staged = git HEAD ไม่ใช่ working tree → ตรงกับของที่ผู้เล่นจะได้เป๊ะ)
#    เจอ = exit 2 → set -e หยุด deploy ทันที · บั๊กแบบ petPatFx (รอบ 320) แตะแล้วเงียบ จะไม่หลุดขึ้นเว็บอีก
# 📦 ด่านที่ 2 (รอบ 325): ไฟล์ที่ index.html อ้างถึงต้องมีอยู่ "ในชุดที่กำลังจะขึ้นเว็บ" จริงๆ
#    (ไฟล์ untracked จะไม่ติดมากับ git archive → live 404 เงียบๆ แบบ word_new.js รอบ 324)
echo "📦 ตรวจไฟล์ที่หน้าเว็บอ้างถึงครบไหม..."
if ! python "$REPO/tools/check_missing_assets.py" --path "$STAGE/public"; then
  echo ""
  echo "❌ หยุด deploy: มีไฟล์ที่ index.html อ้างถึงแต่ไม่ได้ขึ้นเว็บ (ดูรายการด้านบน)"
  echo "   ส่วนใหญ่คือไฟล์ใหม่ที่ลืม git add — add + commit แล้ว deploy ใหม่"
  rm -rf "$STAGE"
  exit 2
fi

echo "🕵️ ตรวจฟังก์ชันที่ไม่มีอยู่จริงก่อน deploy..."
if ! python "$REPO/tools/check_undefined_calls.py" --path "$STAGE/public"; then
  echo ""
  echo "❌ หยุด deploy: พบการเรียกฟังก์ชันที่ไม่มีนิยาม (ดูรายการด้านบน)"
  echo "   แก้โค้ด + commit ก่อน แล้วค่อย deploy ใหม่"
  echo "   (ถ้าเป็น global ของไลบรารีภายนอกจริงๆ ให้เติมชื่อใน BUILTINS ของ tools/check_undefined_calls.py)"
  rm -rf "$STAGE"
  exit 2
fi

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
cd "$REPO" && rm -rf "$STAGE"            # เก็บกวาด staging ของตัวเอง (ตอนนี้ชื่อมี PID ไม่สะสมทับกัน)
