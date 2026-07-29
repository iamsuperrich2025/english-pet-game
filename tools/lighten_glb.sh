#!/usr/bin/env bash
# ============================================================
# 🪶 lighten_glb.sh — ลดขนาดโมเดล .glb ที่หนักเกิน (สูตรรอบ 431 + ทำเป็นสคริปต์รอบ 689)
# โมเดลจาก Tripo/สแกน หนักเป็นสิบ MB เอาลงเกมไม่ได้ — ตัวนี้ย่อให้เหลือหลักร้อย KB
#
# ใช้:
#   bash tools/lighten_glb.sh <ไฟล์เข้า.glb> <ไฟล์ออก.glb> [ratio] [error] [texSize]
#   bash tools/lighten_glb.sh img/models/ghost.glb img/models/ghost_lite.glb 0.03 0.2 1024
#
# ⚠️ กุญแจสำคัญ (บทเรียนรอบ 431): ต้อง "ตัด NORMAL ทิ้งก่อน weld+simplify"
#    ไม่งั้น simplify ตันอยู่ที่ ~15% ลดไม่ลง (ทุก vertex มี normal ต่างกัน = weld รวมไม่ได้)
#    ทำผ่าน CLI ล้วนได้โดย: unlit (ทำให้ NORMAL ไม่ถูกใช้) → prune --keep-attributes false
#    ⚠️⚠️ ผลข้างเคียงที่ต้องแก้ฝั่งเกมเสมอ (บทเรียนรอบ 689):
#       ① ไฟล์ที่ได้เป็นวัสดุ "ไม่รับแสง" (unlit) — อยากให้ไฟฉายส่องโดน ต้องทับ material เองใน three.js
#       ② **ต้องเรียก geometry.computeVertexNormals() ตอนโหลด** ไม่งั้นวัสดุที่ใช้แสงจะดำทึบตลอด
#          (ไม่มี normal = คำนวณแสงไม่ได้) — ดูตัวอย่าง ghostGlbEnsure() ใน js/adventure3d.js
#
# ผลจริง: house_01 62MB/1.88M tris → 1.1MB/37.8k tris · ghost 54MB/1.88M tris → 510KB/22.5k tris
# เก็บไฟล์ต้นฉบับไว้ในเครื่อง (ห้ามขึ้น repo — .gitignore กันไว้แล้ว)
# ============================================================
set -e
export PATH="$HOME/bin/node:$PATH"
IN="$1"; OUT="$2"
RATIO="${3:-0.03}"; ERROR="${4:-0.2}"; TEX="${5:-1024}"
if [[ -z "$IN" || -z "$OUT" ]]; then
  echo "ใช้: bash tools/lighten_glb.sh <in.glb> <out.glb> [ratio=0.03] [error=0.2] [texSize=1024]"; exit 1
fi
[[ -f "$IN" ]] || { echo "❌ ไม่เจอไฟล์ $IN"; exit 1; }

TMP="$(mktemp -d)"
sz(){ awk -v b="$(stat -c%s "$1")" "BEGIN{printf \"%.2f MB\", b/1048576}"; }
echo "📦 ต้นฉบับ: $IN = $(sz "$IN")"

echo "1️⃣  unlit (ทำให้ NORMAL ไม่ถูกใช้)"
gltf-transform unlit "$IN" "$TMP/a.glb" >/dev/null 2>&1

echo "2️⃣  prune --keep-attributes false (ตัด NORMAL/TANGENT ทิ้งจริง)"
gltf-transform prune "$TMP/a.glb" "$TMP/b.glb" --keep-attributes false >/dev/null 2>&1

echo "3️⃣  weld (รวม vertex ซ้ำ — ทำได้แล้วเพราะไม่มี normal ขวาง)"
gltf-transform weld "$TMP/b.glb" "$TMP/c.glb" >/dev/null 2>&1

echo "4️⃣  simplify ratio=$RATIO error=$ERROR"
gltf-transform simplify "$TMP/c.glb" "$TMP/d.glb" --ratio "$RATIO" --error "$ERROR" >/dev/null 2>&1

echo "5️⃣  join (รวม mesh ที่ใช้ material เดียวกัน = draw call น้อยลง)"
gltf-transform join "$TMP/d.glb" "$TMP/e.glb" >/dev/null 2>&1 || cp "$TMP/d.glb" "$TMP/e.glb"

echo "6️⃣  resize texture → ${TEX}px"
gltf-transform resize "$TMP/e.glb" "$TMP/f.glb" --width "$TEX" --height "$TEX" >/dev/null 2>&1

echo "7️⃣  prune + dedup (ล้าง buffer ที่ไม่ใช้ — ขั้นนี้ตัดขนาดลงมากที่สุด)"
gltf-transform prune "$TMP/f.glb" "$TMP/g.glb" --keep-attributes false >/dev/null 2>&1
gltf-transform dedup "$TMP/g.glb" "$TMP/h.glb" >/dev/null 2>&1

# 8) quantize: POSITION/UV f32 → int16 (KHR_mesh_quantization)
#    js/vendor/GLTFLoader.js รองรับส่วนขยายนี้อยู่แล้ว ไม่ต้องลง decoder เพิ่ม (ต่างจาก draco/meshopt)
echo "8️⃣  quantize (f32 → int16 · เล็กลงอีก ~30% โดยตาแทบไม่เห็นต่าง)"
gltf-transform quantize "$TMP/h.glb" "$OUT" >/dev/null 2>&1 || cp "$TMP/h.glb" "$OUT"

echo "✅ เสร็จ: $OUT = $(sz "$OUT")"
rm -rf "$TMP"
gltf-transform inspect "$OUT" 2>&1 | grep -E "glPrimitives|resolution" | head -5 || true
