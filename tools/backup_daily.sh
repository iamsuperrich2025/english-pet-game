#!/usr/bin/env bash
# ============================================================
# ตัวเรียกสำรองข้อมูลรายวัน (รอบ 212) — Windows Task Scheduler เรียกไฟล์นี้
# ------------------------------------------------------------
# ห่อ tools/backup_db.sh ให้บันทึกผลลง backups/backup_log.txt (ดูย้อนหลังได้ว่ารันสำเร็จไหม)
# ตั้ง Task: bash tools/setup_backup_task.ps1  (หรือดูคำสั่งใน HANDOFF)
# ============================================================
cd "$(dirname "$0")/.." || exit 1
mkdir -p backups
{
  echo "===== $(date '+%Y-%m-%d %H:%M:%S') · เริ่มสำรองอัตโนมัติ ====="
  bash tools/backup_db.sh
  echo "----- จบรอบ (exit $?) -----"
  echo ""
} >> backups/backup_log.txt 2>&1
