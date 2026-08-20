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

echo "📦 เตรียม source จาก git HEAD → $STAGE/source"
rm -rf "$STAGE" && mkdir -p "$STAGE/source"
cd "$REPO"
git archive HEAD | tar -x -C "$STAGE/source"
# 🛑 รอบ 1022: ไฟล์ "รันได้" (.bat/.exe/…) ห้ามขึ้น Firebase Hosting แผน Spark — deploy จะพังทั้งรอบ
#    ("Executable files are forbidden on the Spark billing plan") เจอครั้งแรกตอน ship.bat (รอบ 1021)
#    เข้ามาอยู่ราก repo · ลบทิ้งตรงนี้ + กันซ้ำอีกชั้นด้วย "ignore" ใน firebase.json ข้างล่าง
find "$STAGE/source" -type f \( -iname '*.exe' -o -iname '*.com' -o -iname '*.dll' \) -delete

# 🧾 รอบ 1178: ถ้า commit ล่าสุดแตะ Cloud Functions ให้ deploy backend ก่อนหน้าเว็บ
# เพื่อไม่ให้ client รุ่นใหม่เรียกฟังก์ชันที่ยังไม่ขึ้นจริง (commit ปกติไม่แตะ functions = ไม่เสียเวลาส่วนนี้)
if git diff --name-only origin/main..HEAD | grep -q '^functions/'; then
  echo "☁️ deploy Cloud Functions สำหรับตลาดแบบ server-authoritative..."
  cd "$STAGE/source"
  # รอบ 1179: git archive ไม่มี node_modules; ติดตั้งใน staging ไม่เช่นนั้น CLI หา firebase-functions ไม่พบ
  echo "📦 ติดตั้ง Functions dependencies จาก package-lock ใน staging..."
  npm ci --prefix functions --omit=dev --no-audit --no-fund
  # --force = ยืนยัน retry policy; function ใช้ tx marker + lease จึงทำซ้ำได้อย่างปลอดภัย
  # รอบ 1180: Eventarc service agent ที่เพิ่งสร้างอาจต้องรอ IAM propagate — retry เองแทนการหยุดทั้ง deploy
  FUNCTIONS_OK=0
  for ATTEMPT in 1 2 3; do
    if "$FB" deploy --only functions --project "$PROJECT" --force; then
      FUNCTIONS_OK=1
      break
    fi
    if [[ "$ATTEMPT" -lt 3 ]]; then
      echo "⏳ Functions attempt $ATTEMPT/3 ยังไม่สำเร็จ — รอสิทธิ์ Eventarc 60 วินาทีแล้วลองใหม่..."
      sleep 60
    fi
  done
  [[ "$FUNCTIONS_OK" -eq 1 ]] || { echo "❌ Cloud Functions ยัง deploy ไม่ครบหลังลอง 3 ครั้ง"; exit 1; }
fi

# 🕵️ ด่านกันบั๊กเงียบ (รอบ 323): สแกน "ฟังก์ชันที่ถูกเรียกแต่ไม่มีอยู่จริง" ในไฟล์ที่กำลังจะขึ้นเว็บจริง
#    (ตรวจสำเนา staged = git HEAD ไม่ใช่ working tree → ตรงกับของที่ผู้เล่นจะได้เป๊ะ)
#    เจอ = exit 2 → set -e หยุด deploy ทันที · บั๊กแบบ petPatFx (รอบ 320) แตะแล้วเงียบ จะไม่หลุดขึ้นเว็บอีก
# 📦 ด่านที่ 2 (รอบ 325): ไฟล์ที่ index.html อ้างถึงต้องมีอยู่ "ในชุดที่กำลังจะขึ้นเว็บ" จริงๆ
#    (ไฟล์ untracked จะไม่ติดมากับ git archive → live 404 เงียบๆ แบบ word_new.js รอบ 324)
echo "📦 ตรวจไฟล์ที่หน้าเว็บอ้างถึงครบไหม..."
if ! python "$REPO/tools/check_missing_assets.py" --path "$STAGE/source"; then
  echo ""
  echo "❌ หยุด deploy: มีไฟล์ที่ index.html อ้างถึงแต่ไม่ได้ขึ้นเว็บ (ดูรายการด้านบน)"
  echo "   ส่วนใหญ่คือไฟล์ใหม่ที่ลืม git add — add + commit แล้ว deploy ใหม่"
  rm -rf "$STAGE"
  exit 2
fi

echo "🕵️ ตรวจฟังก์ชันที่ไม่มีอยู่จริงก่อน deploy..."
if ! python "$REPO/tools/check_undefined_calls.py" --path "$STAGE/source"; then
  echo ""
  echo "❌ หยุด deploy: พบการเรียกฟังก์ชันที่ไม่มีนิยาม (ดูรายการด้านบน)"
  echo "   แก้โค้ด + commit ก่อน แล้วค่อย deploy ใหม่"
  echo "   (ถ้าเป็น global ของไลบรารีภายนอกจริงๆ ให้เติมชื่อใน BUILTINS ของ tools/check_undefined_calls.py)"
  rm -rf "$STAGE"
  exit 2
fi

# 🧵 ด่านที่ 3 (รอบ 585): backtick หลงในบล็อก template string เช่น `const CSS=`…``
#    ต้นเหตุเว็บล่มรอบ 583 — คอมเมนต์ CSS ใส่ backtick ครอบชื่อคลาส สตริงขาดกลางคัน
#    `node --check` ยัง "ผ่าน" แต่รันจริงโยน TypeError → InvasionWorld ไม่เกิด เกมค้างหน้าโหลด
echo "🧵 ตรวจ backtick หลงในบล็อก template string (CSS) ก่อน deploy..."
if ! python "$REPO/tools/check_template_backtick.py" --path "$STAGE/source"; then
  echo ""
  echo "❌ หยุด deploy: พบ backtick ที่ทำให้ template string ขาดกลางคัน (ดูรายการด้านบน)"
  echo "   แก้โค้ด + commit ก่อน แล้วค่อย deploy ใหม่ — เคสนี้ทำเว็บล่มทั้งเกม (รอบ 583)"
  echo "   (ถ้าพิสูจน์แล้วว่าเป็น false positive ให้เติม 'ไฟล์:บรรทัด' ลง ALLOW ใน tools/check_template_backtick.py)"
  rm -rf "$STAGE"
  exit 2
fi

echo "🏗️ npm run build → dist/ (hashed startup assets + content manifest)"
cd "$STAGE/source"
npm run build
npm run validate:build

echo "🚀 deploy → https://$SITE.web.app"
cd "$STAGE/source"
"$FB" deploy --only "hosting:$SITE" --project "$PROJECT"

# 🧹 ล้าง Hosting versions เก่า (รอบ 158) — กันชนโควตา storage แผนฟรี (429)
# พลาดไม่เป็นไร deploy สำเร็จไปแล้ว (|| true)
node "$REPO/tools/cleanup_hosting_versions.mjs" || echo "⚠️ cleanup ข้ามไป (ไม่กระทบ deploy)"
cd "$REPO" && rm -rf "$STAGE"            # เก็บกวาด staging ของตัวเอง (ตอนนี้ชื่อมี PID ไม่สะสมทับกัน)
