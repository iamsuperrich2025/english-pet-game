#!/usr/bin/env python3
# ============================================================
# make_assetlinks.py — สร้าง .well-known/assetlinks.json สำหรับแอป Android (TWA) บน Play Store
#
# ใช้ตอนไหน: หลังอัปโหลด .aab ขึ้น Play Console แล้ว ไปเอาลายนิ้วมือ SHA-256 มาจาก
#            Play Console → Test and release → Setup → App signing (App integrity)
#            → คัดลอกค่า "SHA-256 certificate fingerprint" ของ **App signing key**
#            (ไม่ใช่ upload key — ต้องใส่ทั้งสองก็ได้ ปลอดภัยกว่า)
#
# ใช้ยังไง:
#   python tools/make_assetlinks.py AA:BB:CC:...            # ใส่ 1 ลายนิ้วมือ
#   python tools/make_assetlinks.py AA:BB:.. 11:22:..       # ใส่หลายอัน (app signing + upload key)
#   python tools/make_assetlinks.py --package com.foo.bar AA:BB:..
#
# เสร็จแล้ว: git add .well-known/assetlinks.json แล้ว deploy
#   bash tools/finish_round.sh "รอบ N: assetlinks" .well-known/assetlinks.json
# ตรวจว่าใช้ได้จริง:
#   curl -s https://vocabworld.web.app/.well-known/assetlinks.json
#   https://developers.google.com/digital-asset-links/tools/generator
# ผลลัพธ์ถ้าถูกต้อง = เปิดแอปแล้ว "ไม่มีแถบ URL" ของเบราว์เซอร์โผล่ด้านบน
# ============================================================
import json, re, sys, argparse, pathlib

DEFAULT_PACKAGE = "app.web.vocabworld.twa"   # ต้องตรงกับ Package ID ที่ตั้งไว้ตอน generate ใน PWABuilder
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / ".well-known" / "assetlinks.json"


def norm(fp: str) -> str:
    """รับได้ทั้งแบบมี/ไม่มีโคลอน ตัวเล็ก/ใหญ่ → คืนรูปแบบมาตรฐาน AA:BB:CC..."""
    raw = re.sub(r"[^0-9A-Fa-f]", "", fp).upper()
    if len(raw) != 64:
        sys.exit(f"❌ ลายนิ้วมือไม่ถูกต้อง: '{fp}' — SHA-256 ต้องมี 64 ตัวอักษรฐานสิบหก (ได้ {len(raw)})")
    return ":".join(raw[i:i + 2] for i in range(0, 64, 2))


def main():
    ap = argparse.ArgumentParser(description="สร้าง .well-known/assetlinks.json สำหรับ TWA")
    ap.add_argument("fingerprints", nargs="+", help="SHA-256 fingerprint (ใส่ได้หลายอัน)")
    ap.add_argument("--package", default=DEFAULT_PACKAGE, help=f"Android package id (default: {DEFAULT_PACKAGE})")
    a = ap.parse_args()

    data = [{
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
            "namespace": "android_app",
            "package_name": a.package,
            "sha256_cert_fingerprints": [norm(f) for f in a.fingerprints],
        },
    }]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"✅ เขียนแล้ว: {OUT}")
    print(json.dumps(data, indent=2))
    print("\nขั้นต่อไป: bash tools/finish_round.sh \"รอบ N: assetlinks\" .well-known/assetlinks.json")
    print("แล้วตรวจ: curl -s https://vocabworld.web.app/.well-known/assetlinks.json")


if __name__ == "__main__":
    main()
