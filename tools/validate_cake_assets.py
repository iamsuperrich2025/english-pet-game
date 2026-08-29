from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image


def fail(message: str) -> None:
    raise AssertionError(message)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    asset_dir = root / "img" / "collectibles" / "cakes2026"
    manifest_path = asset_dir / "cake_assets_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    files = manifest["files"]
    if len(files) != 103:
        fail(f"expected 103 cakes, got {len(files)}")

    display_total = 0
    thumb_total = 0
    for item in files:
        for kind, expected_size, hard_limit in (
            ("display", 512, 120_000),
            ("thumbnail", 256, 50_000),
        ):
            path = asset_dir / item[kind]
            data = path.read_bytes()
            if len(data) > hard_limit:
                fail(f"{path.name}: {len(data)} bytes exceeds {hard_limit}")
            if hashlib.sha256(data).hexdigest() != item[f"{kind}_sha256"]:
                fail(f"{path.name}: hash differs from manifest")
            with Image.open(path) as image:
                if image.size != (expected_size, expected_size):
                    fail(f"{path.name}: expected {expected_size}x{expected_size}, got {image.size}")
                rgba = image.convert("RGBA")
                if rgba.getchannel("A").getextrema()[0] != 0:
                    fail(f"{path.name}: canvas has no transparent pixels")
                bbox = rgba.getchannel("A").point(lambda value: 255 if value >= 16 else 0).getbbox()
                if not bbox:
                    fail(f"{path.name}: empty alpha channel")
                fill = max((bbox[2] - bbox[0]) / expected_size, (bbox[3] - bbox[1]) / expected_size)
                if not 0.82 <= fill <= 0.90:
                    fail(f"{path.name}: visible object fill {fill:.2%} is outside 82–90%")
            if kind == "display":
                display_total += len(data)
            else:
                thumb_total += len(data)

    if display_total > 10_300_000:
        fail(f"display set unexpectedly heavy: {display_total}")
    if thumb_total > 3_605_000:
        fail(f"thumbnail set unexpectedly heavy: {thumb_total}")
    print(f"PASS cake assets: {len(files)} pairs")
    print(f"display_total={display_total} thumbnail_total={thumb_total}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        raise
