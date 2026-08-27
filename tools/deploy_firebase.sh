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

# 🧪 Safe Pipeline: deploy "exact artifact" ที่ผ่าน Build/Browser Test แล้ว
# VW Dev Studio สร้าง/ทดสอบ $REPO/dist ก่อนถึงขั้น Deploy Production.
# เดิมสคริปต์ build ซ้ำจาก git HEAD ใน staging ตรงนี้ ทำให้ไฟล์ generated
# (โดยเฉพาะ index.html / sw.js) อาจได้ hash คนละชุดกับ build ที่ทดสอบ แม้ source เดียวกัน
# ขณะที่ไฟล์ pass-through เช่น js/skyplay3d.js ยัง MATCH — อาการตรงกับ Verify Live ที่พบจริง
#
# หลักใหม่:
#   1) ถ้ามี dist ที่ผ่านการทดสอบอยู่แล้ว ให้ copy byte-for-byte เข้า staging และ validate ซ้ำ
#   2) ถ้า dist ใช้ไม่ได้/ไม่มีจริง จึง fallback ไป build จาก staged git HEAD แบบเดิม
#   3) ห้ามแก้ verifier หรือทำให้ mismatch ผ่านปลอม ๆ
TESTED_DIST="${VW_TESTED_DIST:-$REPO/dist}"
USE_TESTED_DIST=0
STAGED_BUILD_VERSION="$(python -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("version", ""))' "$STAGE/source/version.json")"
TESTED_BUILD_VERSION=""
if [[ -f "$TESTED_DIST/version.json" ]]; then
  TESTED_BUILD_VERSION="$(python -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8")).get("version", ""))' "$TESTED_DIST/version.json")"
fi

if [[ "${VW_DEPLOY_FORCE_REBUILD:-0}" != "1" ]] \
   && [[ -f "$TESTED_DIST/index.html" ]] \
   && [[ -f "$TESTED_DIST/sw.js" ]] \
   && [[ "$TESTED_BUILD_VERSION" == "$STAGED_BUILD_VERSION" ]]; then
  echo "🧪 พบ prebuilt dist ที่ผ่าน Safe Pipeline: $TESTED_DIST"
  rm -rf "$STAGE/source/dist"
  mkdir -p "$STAGE/source/dist"
  cp -R "$TESTED_DIST"/. "$STAGE/source/dist"/

  echo "🔎 validate exact tested artifact เทียบกับ staged git HEAD..."
  cd "$STAGE/source"
  if npm run validate:build; then
    USE_TESTED_DIST=1
    echo "✅ Exact tested artifact valid — จะ deploy ไบต์ชุดเดียวกับที่ Local/Browser Test ใช้"
  else
    echo "⚠️ prebuilt dist ไม่ผ่าน validate กับ git HEAD — ไม่ deploy artifact ที่น่าสงสัย"
    echo "   fallback: build ใหม่จาก staged git HEAD ตามวิธีเดิม"
    rm -rf "$STAGE/source/dist"
  fi
elif [[ "${VW_DEPLOY_FORCE_REBUILD:-0}" != "1" ]] \
  && [[ -f "$TESTED_DIST/index.html" ]] \
  && [[ -f "$TESTED_DIST/sw.js" ]]; then
  echo "⚠️ prebuilt dist version=${TESTED_BUILD_VERSION:-missing} ไม่ตรง git HEAD version=$STAGED_BUILD_VERSION — fallback build จาก HEAD"
fi

if [[ "$USE_TESTED_DIST" -ne 1 ]]; then
  echo "🏗️ npm run build → dist/ (fallback: ไม่มี exact tested artifact ที่ใช้ได้)"
  cd "$STAGE/source"
  npm run build
  npm run validate:build
fi

# พิมพ์ SHA-256 ของ artifact ที่กำลังจะ deploy จริง เพื่อให้ VW Dev Studio/ผู้ใช้
# เทียบกับ Verify Live ได้ตรงไฟล์ โดยไม่แตะความเข้มงวดของ verifier
echo "🔐 Deployment artifact hashes:"
for REL in index.html sw.js js/skyplay3d.js; do
  if [[ ! -f "$STAGE/source/dist/$REL" ]]; then
    echo "   $REL  MISSING"
  elif command -v sha256sum >/dev/null 2>&1; then
    HASH="$(sha256sum "$STAGE/source/dist/$REL" | awk '{print $1}')"
    echo "   $REL  $HASH"
  else
    echo "   $REL  SHA256-TOOL-UNAVAILABLE"
  fi
done

echo "🚀 deploy → https://$SITE.web.app"
cd "$STAGE/source"
"$FB" deploy --only "hosting:$SITE" --project "$PROJECT"

# 🧹 ล้าง Hosting versions เก่า (รอบ 158) — กันชนโควตา storage แผนฟรี (429)
# พลาดไม่เป็นไร deploy สำเร็จไปแล้ว (|| true)
node "$REPO/tools/cleanup_hosting_versions.mjs" || echo "⚠️ cleanup ข้ามไป (ไม่กระทบ deploy)"
cd "$REPO" && rm -rf "$STAGE"            # เก็บกวาด staging ของตัวเอง (ตอนนี้ชื่อมี PID ไม่สะสมทับกัน)
