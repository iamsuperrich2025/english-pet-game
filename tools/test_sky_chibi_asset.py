from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = {
    "hoodie-red": "sky_soft_cuboid_chibi_8dir.webp",
    "explorer": "sky_soft_cuboid_chibi_explorer_8dir.webp",
    "captain": "sky_soft_cuboid_chibi_captain_8dir.webp",
    "schoolgirl": "sky_soft_cuboid_chibi_schoolgirl_8dir.webp",
    "witch": "sky_soft_cuboid_chibi_witch_8dir.webp",
    "pajamas": "sky_soft_cuboid_chibi_pajamas_8dir.webp",
}
COLS, ROWS = 4, 2
ATLAS_SIZE = (1536, 768)
EXPECTED_TOP = 14
EXPECTED_BOTTOM = 374


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)
    print("PASS", message)


all_boxes: dict[str, list[tuple[int, int, int, int]]] = {}
for character_id, filename in ASSETS.items():
    asset = ROOT / "img" / "characters" / filename
    check(asset.stat().st_size > 350_000, f"{character_id} is a substantial lossless WebP")
    image = Image.open(asset).convert("RGBA")
    check(image.size == ATLAS_SIZE, f"{character_id} atlas is the locked 4x2 production size")
    alpha = image.getchannel("A")
    check(alpha.getextrema() == (0, 255), f"{character_id} contains real transparent and opaque pixels")
    check(
        all(alpha.getpixel(point) == 0 for point in ((0, 0), (1535, 0), (0, 767), (1535, 767))),
        f"{character_id} outer corners are transparent, not a baked checkerboard",
    )

    cell_width, cell_height = image.width // COLS, image.height // ROWS
    boxes: list[tuple[int, int, int, int]] = []
    for row in range(ROWS):
        for col in range(COLS):
            frame = alpha.crop((col * cell_width, row * cell_height, (col + 1) * cell_width, (row + 1) * cell_height))
            bbox = frame.getbbox()
            check(bbox is not None, f"{character_id} direction {row * COLS + col} is present")
            assert bbox is not None
            width, height = bbox[2] - bbox[0], bbox[3] - bbox[1]
            check(width >= 150 and height >= 355, f"{character_id} direction {row * COLS + col} is complete")
            check(abs((bbox[0] + bbox[2]) / 2 - cell_width / 2) <= 4, f"{character_id} direction {row * COLS + col} is centered")
            boxes.append(bbox)
    check(max(box[1] for box in boxes) - min(box[1] for box in boxes) <= 2, f"{character_id} head/top alignment is stable")
    check(max(box[3] for box in boxes) - min(box[3] for box in boxes) <= 1, f"{character_id} foot baseline is stable")
    check(all(abs(box[1] - EXPECTED_TOP) <= 2 and abs(box[3] - EXPECTED_BOTTOM) <= 1 for box in boxes), f"{character_id} matches the round-1247 scale and foot anchor")
    all_boxes[character_id] = boxes

check(len(all_boxes) == 6 and all(len(boxes) == 8 for boxes in all_boxes.values()), "all six selectable characters contain eight directions")
print("Sky Soft Cuboid Chibi six-character atlas QA passed")
