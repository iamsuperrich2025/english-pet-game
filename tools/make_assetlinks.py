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
# Existing certificates are preserved; arguments add approved certificates.
# The Vocab World package identity is fixed; certificate removal requires review.
#
# เสร็จแล้ว: git add .well-known/assetlinks.json แล้ว deploy
# Commit the source and build guards together. An assetlinks-only repair must
# not use the full Hosting deploy/COMMIT_DEPLOY launcher.
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
    raw = fp.strip().replace(":", "").upper()
    if not re.fullmatch(r"[0-9A-F]{64}", raw):
        sys.exit(f"❌ ลายนิ้วมือไม่ถูกต้อง: '{fp}' — SHA-256 ต้องมี 64 ตัวอักษรฐานสิบหก (ได้ {len(raw)})")
    return ":".join(raw[i:i + 2] for i in range(0, 64, 2))


def main():
    ap = argparse.ArgumentParser(description="สร้าง .well-known/assetlinks.json สำหรับ TWA")
    ap.add_argument("fingerprints", nargs="+", help="SHA-256 fingerprint (ใส่ได้หลายอัน)")
    ap.add_argument("--package", default=DEFAULT_PACKAGE, help=f"Android package id (default: {DEFAULT_PACKAGE})")
    a = ap.parse_args()

    if a.package != DEFAULT_PACKAGE:
        ap.error(f"This source is reserved for {DEFAULT_PACKAGE}")
    # Fail closed rather than replacing an unreadable/missing source with one key.
    try:
        data = json.loads(OUT.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError("assetlinks must be an array")
        targets = [s["target"] for s in data
                   if s.get("target", {}).get("namespace") == "android_app"
                   and s["target"].get("package_name") == DEFAULT_PACKAGE
                   and "delegate_permission/common.handle_all_urls" in s.get("relation", [])]
        if not targets:
            raise ValueError("required Android identity/relation is missing")
        for target in targets:
            existing = target["sha256_cert_fingerprints"]
            if not isinstance(existing, list) or not existing:
                raise ValueError("existing certificate list is missing")
            for fp in existing:
                if not isinstance(fp, str) or not re.fullmatch(r"(?:[0-9A-F]{2}:){31}[0-9A-F]{2}", fp):
                    raise ValueError("existing SHA-256 fingerprint is invalid")
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        ap.error(f"Refusing to overwrite existing assetlinks: {error}")
    additions = [norm(fp) for fp in a.fingerprints]
    known = {fp for target in targets for fp in target["sha256_cert_fingerprints"]}
    for fp in additions:
        if fp not in known:
            targets[0]["sha256_cert_fingerprints"].append(fp)
            known.add(fp)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes((json.dumps(data, indent=2) + "\n").encode("utf-8"))
    print(f"✅ เขียนแล้ว: {OUT}")
    print(json.dumps(data, indent=2))
    print("Next: commit the source and build guards together; no full Hosting deploy for an assetlinks-only repair.")
    print("แล้วตรวจ: curl -s https://vocabworld.web.app/.well-known/assetlinks.json")


if __name__ == "__main__":
    main()
