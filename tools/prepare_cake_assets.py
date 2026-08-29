from __future__ import annotations

import argparse
import hashlib
import json
from io import BytesIO
from pathlib import Path

from PIL import Image


DISPLAY_SIZE = 512
THUMB_SIZE = 256
OBJECT_FILL = 0.86
DISPLAY_TARGET_BYTES = 100_000
DISPLAY_HARD_BYTES = 120_000
THUMB_TARGET_BYTES = 35_000
THUMB_HARD_BYTES = 50_000


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize_canvas(source: Image.Image, size: int) -> tuple[Image.Image, dict[str, float]]:
    rgba = source.convert("RGBA")
    alpha = rgba.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value >= 16 else 0).getbbox()
    if not bbox:
        raise ValueError("image has no visible alpha pixels")

    visible = rgba.crop(bbox)
    target_extent = round(size * OBJECT_FILL)
    scale = min(target_extent / visible.width, target_extent / visible.height)
    resized = visible.resize(
        (max(1, round(visible.width * scale)), max(1, round(visible.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))

    out_bbox = canvas.getchannel("A").point(lambda value: 255 if value >= 16 else 0).getbbox()
    assert out_bbox is not None
    return canvas, {
        "fill_width_percent": round((out_bbox[2] - out_bbox[0]) / size * 100, 2),
        "fill_height_percent": round((out_bbox[3] - out_bbox[1]) / size * 100, 2),
        "margin_left_percent": round(out_bbox[0] / size * 100, 2),
        "margin_top_percent": round(out_bbox[1] / size * 100, 2),
        "margin_right_percent": round((size - out_bbox[2]) / size * 100, 2),
        "margin_bottom_percent": round((size - out_bbox[3]) / size * 100, 2),
    }


def encode_webp(image: Image.Image, target_bytes: int, hard_bytes: int) -> tuple[bytes, int]:
    best: tuple[bytes, int] | None = None
    for quality in range(86, 57, -2):
        buffer = BytesIO()
        image.save(buffer, "WEBP", quality=quality, method=4, exact=True)
        payload = buffer.getvalue()
        best = (payload, quality)
        if len(payload) <= target_bytes:
            break
    assert best is not None
    if len(best[0]) > hard_bytes:
        raise ValueError(f"cannot meet hard byte limit ({len(best[0])} > {hard_bytes})")
    return best


def process(source_dir: Path, output_dir: Path) -> dict:
    sources = sorted(source_dir.glob("*.webp"))
    if not sources:
        raise ValueError(f"no WebP source files in {source_dir}")
    output_dir.mkdir(parents=True, exist_ok=True)

    files = []
    for index, source_path in enumerate(sources, 1):
        serial = f"{index:03d}"
        display_path = output_dir / f"cake_{serial}.webp"
        thumb_path = output_dir / f"cake_{serial}_256.webp"
        with Image.open(source_path) as source:
            display, geometry = normalize_canvas(source, DISPLAY_SIZE)
        thumb = display.resize((THUMB_SIZE, THUMB_SIZE), Image.Resampling.LANCZOS)

        display_data, display_quality = encode_webp(
            display, DISPLAY_TARGET_BYTES, DISPLAY_HARD_BYTES
        )
        thumb_data, thumb_quality = encode_webp(thumb, THUMB_TARGET_BYTES, THUMB_HARD_BYTES)
        display_path.write_bytes(display_data)
        thumb_path.write_bytes(thumb_data)

        files.append({
            "id": f"cake2026_{serial}",
            "source": source_path.name,
            "display": display_path.name,
            "thumbnail": thumb_path.name,
            "display_width": DISPLAY_SIZE,
            "display_height": DISPLAY_SIZE,
            "thumbnail_width": THUMB_SIZE,
            "thumbnail_height": THUMB_SIZE,
            "display_bytes": len(display_data),
            "thumbnail_bytes": len(thumb_data),
            "display_quality": display_quality,
            "thumbnail_quality": thumb_quality,
            "transparent": True,
            "encoding": "webp-lossy-alpha",
            "display_sha256": sha256(display_data),
            "thumbnail_sha256": sha256(thumb_data),
            **geometry,
        })

    manifest = {
        "rule": "Gift Asset Performance Rule",
        "version": 1,
        "display": {
            "width": DISPLAY_SIZE,
            "height": DISPLAY_SIZE,
            "target_max_bytes": DISPLAY_TARGET_BYTES,
            "hard_max_bytes": DISPLAY_HARD_BYTES,
        },
        "thumbnail": {
            "width": THUMB_SIZE,
            "height": THUMB_SIZE,
            "target_max_bytes": THUMB_TARGET_BYTES,
            "hard_max_bytes": THUMB_HARD_BYTES,
        },
        "object_fill_target_percent": OBJECT_FILL * 100,
        "lazy_load_required": True,
        "files": files,
    }
    manifest_path = output_dir / "cake_assets_manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description="Build VW gift cake display and thumbnail WebP assets")
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    manifest = process(args.source, args.output)
    display_total = sum(item["display_bytes"] for item in manifest["files"])
    thumb_total = sum(item["thumbnail_bytes"] for item in manifest["files"])
    print(f"cakes={len(manifest['files'])}")
    print(f"display_total_bytes={display_total}")
    print(f"thumbnail_total_bytes={thumb_total}")
    print(f"display_max_bytes={max(item['display_bytes'] for item in manifest['files'])}")
    print(f"thumbnail_max_bytes={max(item['thumbnail_bytes'] for item in manifest['files'])}")


if __name__ == "__main__":
    main()
