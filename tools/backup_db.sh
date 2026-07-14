#!/usr/bin/env bash
# ============================================================
# สำรอง "ข้อมูลบน server ทั้งหมด" ลงเครื่อง (รอบ 211)
# ------------------------------------------------------------
# ใช้:  bash tools/backup_db.sh
# เผื่อกรณีข้อมูลบน Firebase โดนลบ/บัญชีโดน flag (เหมือน GitHub รอบ 134)
# ดึงลงเครื่อง 2 อย่าง:
#   1) Realtime Database ทั้งก้อน  → backups/db_<เวลา>.json
#   2) รายชื่อผู้ใช้ Auth ทั้งหมด    → backups/auth_<เวลา>.json
# เงื่อนไข: firebase login ค้างไว้แล้ว (ตัวเดียวกับ deploy_firebase.sh)
# ⚠️ ไฟล์ใน backups/ มีข้อมูลเด็ก (ชื่อเล่น/เซฟ) → gitignore ไว้ ห้าม push ขึ้น repo สาธารณะ
# ============================================================
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/c/Users/rober/bin/node:$PATH"   # Node พกพา + firebase-tools (ชุดเดียวกับ deploy)
export MSYS_NO_PATHCONV=1                      # กัน Git Bash แปลง "/" เป็น path วินโดวส์ (database:get จะ error "Path must begin with /")
FB="firebase"
PROJECT="english-pet-game"
OUT="$REPO/backups"
KEEP=14                                        # เก็บย้อนหลังกี่ชุด (ลบชุดเก่ากว่านี้)

mkdir -p "$OUT"
TS="$(date +%Y%m%d_%H%M%S)"

echo "📥 [1/2] สำรอง Realtime Database ทั้งก้อน → backups/db_$TS.json"
"$FB" database:get "/" --project "$PROJECT" > "$OUT/db_$TS.json"
DB_SZ="$(wc -c < "$OUT/db_$TS.json" | tr -d ' ')"
echo "     ✔ ได้ $DB_SZ bytes"

echo "📥 [2/2] สำรองรายชื่อผู้ใช้ Auth → backups/auth_$TS.json"
# auth:export รับ path เป็น "argument" ของ exe วินโดวส์ → ต้องส่ง path แบบวินโดวส์ (MSYS_NO_PATHCONV ปิดการแปลงไว้)
AUTH_OUT_WIN="$(cygpath -w "$OUT/auth_$TS.json" 2>/dev/null || echo "$OUT/auth_$TS.json")"
if "$FB" auth:export "$AUTH_OUT_WIN" --format=json --project "$PROJECT" >/dev/null 2>&1; then
  AU_SZ="$(wc -c < "$OUT/auth_$TS.json" | tr -d ' ')"
  echo "     ✔ ได้ $AU_SZ bytes"
else
  echo "     ⚠️ ข้าม auth export (สิทธิ์ไม่พอ/ปิดใช้) — data DB สำรองไว้แล้ว"
fi

# 🧹 เก็บย้อนหลังแค่ $KEEP ชุดล่าสุดต่อชนิด (กันเต็มดิสก์)
prune(){
  local pat="$1"
  ls -1t "$OUT"/$pat 2>/dev/null | tail -n +$((KEEP+1)) | while read -r f; do rm -f "$f"; done
}
prune "db_*.json"
prune "auth_*.json"

echo ""
echo "✅ สำรองเสร็จ — เก็บไว้ที่ $OUT (ล่าสุด $KEEP ชุด)"
echo "   กู้คืน DB:   firebase database:set / backups/db_<เวลา>.json --project $PROJECT"
echo "   กู้คืน Auth: firebase auth:import backups/auth_<เวลา>.json --project $PROJECT"
