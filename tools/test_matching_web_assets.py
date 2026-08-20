#!/usr/bin/env python3
"""กันภาพ Picture Dictionary / เกมทายคำกลับมาหนักหรือเสียหลังเจนใหม่

ตรวจว่า WebP ครบคู่กับ PNG ต้นฉบับ, decode ได้, สัดส่วนไม่เพี้ยน และไม่เกิน budget
รัน: python tools/test_matching_web_assets.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "img" / "matching"
WEB = SRC / "web"
MAX_WIDTH = 768
MAX_FILE_BYTES = 220 * 1024
MAX_TOTAL_BYTES = 7 * 1024 * 1024


def main():
    originals = {p.stem: p for p in SRC.glob("*.png")}
    outputs = {p.stem: p for p in WEB.glob("*.webp")}
    assert originals, "no Picture Dictionary PNG sources found"
    assert outputs.keys() == originals.keys(), (
        f"asset names differ: missing={sorted(originals.keys() - outputs.keys())}, "
        f"extra={sorted(outputs.keys() - originals.keys())}"
    )

    total = 0
    for stem, output in sorted(outputs.items()):
        with Image.open(originals[stem]) as source, Image.open(output) as web:
            web.load()  # บังคับ decode ทั้งไฟล์ ไม่ใช่แค่อ่าน header
            assert web.format == "WEBP", f"{output.name}: expected WEBP"
            assert web.width <= MAX_WIDTH, f"{output.name}: width {web.width}px exceeds {MAX_WIDTH}px"
            expected_height = round(source.height * web.width / source.width)
            assert web.height == expected_height, (
                f"{output.name}: distorted ratio {web.size}; expected height {expected_height}"
            )
        size = output.stat().st_size
        assert size <= MAX_FILE_BYTES, f"{output.name}: {size / 1024:.1f}KB exceeds 220KB"
        total += size

    assert total <= MAX_TOTAL_BYTES, f"total {total / 1048576:.2f}MB exceeds 7MB"
    print(f"PASS matching web assets: {len(outputs)} WebP, {total / 1048576:.2f}MB, max width {MAX_WIDTH}px")


if __name__ == "__main__":
    main()
