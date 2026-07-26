#!/usr/bin/env bash
# 🗜️ compress_clips.sh — บีบคลิปน้องใน clip/*.mp4 ให้เล็กลง แล้วเจนตาราง "ไฟล์เล็กสุดก่อน" ให้เกมเอง
#
# ใช้เมื่อไหร่: ครูเจนคลิปใหม่วางใน clip/ แล้วรันคำสั่งเดียวจบ
#   bash tools/compress_clips.sh            # บีบเฉพาะไฟล์ที่ยังไม่มีตัวเล็ก (หรือต้นฉบับใหม่กว่า)
#   bash tools/compress_clips.sh --force    # บีบใหม่ทั้งหมด
#
# ทำอะไร (รอบ 611):
#   1. ต้นฉบับ clip/<key>.mp4  →  clip/sm/<key>.mp4 (H.264 CRF 28) + clip/sm/<key>.webm (VP9 2-pass CRF 40)
#      · ตัดเสียงทิ้ง (-an) เพราะเกมเล่นคลิปแบบ muted อยู่แล้ว (เสียง AAC กินไฟล์ละ ~140KB ฟรี ๆ)
#      · คงความละเอียดเดิม 1280×720 (จอมือถือ retina ยังได้ภาพคม) — ลดแค่ bitrate
#   2. เจนบล็อก CLIP_SM ใน js/images.js ให้ใหม่ = ต่อคลิปหนึ่งตัว เรียง "ไฟล์เล็กสุดก่อน"
#      เกมหยิบตัวแรกที่เบราว์เซอร์เล่นได้ (webm เล่นไม่ได้ก็ข้ามไป mp4 · พังหมดถอยไปต้นฉบับ)
#   ⛔ ไม่แตะต้นฉบับใน clip/ เด็ดขาด (asset ของผู้ใช้) — เขียนลง clip/sm/ อย่างเดียว

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# --- หา ffmpeg (PATH ก่อน · ไม่เจอค่อยหาที่ winget ลงไว้) ---
if command -v ffmpeg >/dev/null 2>&1; then
  FFMPEG=ffmpeg
else
  FFMPEG="$(ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/*/bin/ffmpeg.exe 2>/dev/null | head -1 || true)"
  [ -n "$FFMPEG" ] || { echo "❌ ไม่พบ ffmpeg — ติดตั้งด้วย: winget install --id Gyan.FFmpeg -e"; exit 1; }
fi
echo "🎬 ffmpeg: $FFMPEG"

mkdir -p clip/sm
TMP="${TMPDIR:-/tmp}/vwclip$$"; mkdir -p "$TMP"
trap 'rm -rf "$TMP"' EXIT

tot_src=0; tot_out=0
for src in clip/*.mp4; do
  [ -f "$src" ] || continue
  key="$(basename "$src" .mp4)"
  mp4="clip/sm/$key.mp4"
  webm="clip/sm/$key.webm"

  if [ $FORCE -eq 0 ] && [ -f "$mp4" ] && [ -f "$webm" ] && [ "$mp4" -nt "$src" ] && [ "$webm" -nt "$src" ]; then
    echo "⏭️  $key (มีตัวเล็กแล้ว)"
  else
    echo "🗜️  $key …"
    "$FFMPEG" -v error -y -i "$src" \
      -c:v libx264 -crf 28 -preset veryslow -profile:v high -pix_fmt yuv420p \
      -movflags +faststart -an "$mp4"
    "$FFMPEG" -v error -y -i "$src" -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 \
      -cpu-used 2 -deadline good -auto-alt-ref 1 -lag-in-frames 25 -pix_fmt yuv420p -an \
      -pass 1 -passlogfile "$TMP/$key" -f null - 2>/dev/null
    "$FFMPEG" -v error -y -i "$src" -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 \
      -cpu-used 2 -deadline good -auto-alt-ref 1 -lag-in-frames 25 -pix_fmt yuv420p -an \
      -pass 2 -passlogfile "$TMP/$key" "$webm"
  fi

  s=$(stat -c%s "$src"); a=$(stat -c%s "$mp4"); b=$(stat -c%s "$webm")
  small=$a; [ "$b" -lt "$a" ] && small=$b
  tot_src=$((tot_src+s)); tot_out=$((tot_out+small))
  printf "   ต้นฉบับ %6dKB → mp4 %5dKB · webm %5dKB → ใช้จริง %5dKB (%d%%)\n" \
    $((s/1024)) $((a/1024)) $((b/1024)) $((small/1024)) $((small*100/s))
done

echo "📦 รวม: $((tot_src/1024))KB → $((tot_out/1024))KB ($((tot_out*100/tot_src))% ของเดิม)"

# --- เจนบล็อก CLIP_SM ใน js/images.js (เรียงเล็กสุดก่อน) ---
python tools/gen_clip_map.py
echo "✅ อัปเดตตาราง CLIP_SM ใน js/images.js แล้ว"
