#!/usr/bin/env python3
"""Audit all generated FPS weapon frames and generator reproducibility."""

from __future__ import annotations

import hashlib
import json
import math
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

import build_fps_weapon_frames as generator


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "assets/weapons/fps/runtime"
WIDE_HIP = ROOT / "img/animation/fps_weapon/fps_weapon_hip_wide_v5.png"
WIDE_HIP_SHA256 = "8e1b6040452bbde261d448f86d6ce0cf19c453d871cdfad83daa8e2a672bb1c7"
EXPECTED = {"idle": 1, "walk": 8, "sprint": 8, "equip": 8, "ads": 6, "fire": 4, "reload": 12}
EXPECTED_TOTAL = 47

# Runtime-space rectangles wholly inside each optic opening.  Alpha <= 16 is
# visually transparent and preserves the scene behind the sight.
ADS_OPENINGS = (
    (322, 212, 344, 232),
    (307, 127, 334, 146),
    (251, 105, 294, 139),
    (256, 119, 302, 157),
    (230, 114, 309, 174),
    (204, 116, 338, 216),
)

# Regression guards for weapon pixels that the former connected-component
# heuristic cut away.  Counts are deliberately below the audited baseline.
WEAPON_GUARDS = (
    ("ads", 6, (126, 48, 180, 105), 1300),
    ("reload", 11, (120, 145, 205, 230), 4300),
    ("reload", 12, (120, 145, 205, 230), 4200),
)

# Muzzle flash/smoke and ejected cases must survive cleanup.
FIRE_GUARDS = (
    (2, (230, 20, 360, 170), 1000, (430, 200, 510, 285), 1700),
    (3, (0, 15, 175, 190), 15000, (440, 185, 512, 260), 1600),
    (4, (250, 10, 370, 160), 1500, (430, 155, 510, 240), 1700),
)

MOTION_LIMITS = {
    "ads": (2, 45, 2, 80, 12),
    "walk": (8, 25, 10, 50, 8),
    "sprint": (32, 125, 50, 190, 30),
    "equip": (6, 100, 8, 190, 8),
    "fire": (5, 25, 5, 20, 15),
    "reload": (2, 30, 2, 45, 15),
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def runtime_snapshot() -> dict[str, str]:
    files = sorted(RUNTIME.rglob("*.png")) + [RUNTIME / "manifest.json"]
    return {path.relative_to(ROOT).as_posix(): sha256_file(path) for path in files}


def aggregate_hash(snapshot: dict[str, str]) -> str:
    digest = hashlib.sha256()
    for path, file_hash in sorted(snapshot.items()):
        digest.update(f"{path}\0{file_hash}\n".encode())
    return digest.hexdigest()


def run_generator() -> dict[str, str]:
    result = subprocess.run(
        [sys.executable, str(ROOT / "tools/build_fps_weapon_frames.py"), "--clean"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    assert "PASS FPS runtime frames" in result.stdout, result.stdout
    return runtime_snapshot()


def projected_box(kind: str, index: int, box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    source, columns, rows, _ = generator.SETS[kind]
    with Image.open(source) as sheet:
        xs = generator.grid_edges(sheet.width, columns)
        ys = generator.grid_edges(sheet.height, rows)
    col, row = index % columns, index // columns
    source_size = (xs[col + 1] - xs[col], ys[row + 1] - ys[row])
    fitted_size = ImageOps.contain(
        Image.new("RGBA", source_size), generator.RUNTIME_SIZE, Image.Resampling.LANCZOS
    ).size
    offset_x = (generator.RUNTIME_SIZE[0] - fitted_size[0]) // 2
    offset_y = generator.RUNTIME_SIZE[1] - fitted_size[1]
    scale_x = fitted_size[0] / source_size[0]
    scale_y = fitted_size[1] / source_size[1]
    left, top, right, bottom = box
    return (
        math.floor(left * scale_x + offset_x),
        math.floor(top * scale_y + offset_y),
        math.ceil(right * scale_x + offset_x),
        math.ceil(bottom * scale_y + offset_y),
    )


def alpha_count(image: Image.Image, box: tuple[int, int, int, int], minimum: int = 17) -> int:
    histogram = image.getchannel("A").crop(box).histogram()
    return sum(histogram[minimum:])


master_before = {
    kind: sha256_file(source)
    for kind, (source, _columns, _rows, _count) in generator.SETS.items()
}
master_before["idle"] = sha256_file(generator.IDLE_SOURCE)
assert master_before == generator.MASTER_SHA256, "master hash lock is stale"

round_one = run_generator()
round_two = run_generator()
assert round_one == round_two, "runtime PNG/manifest hashes differ across two generator runs"
assert len([path for path in round_two if path.endswith(".png")]) == EXPECTED_TOTAL

master_after = {
    kind: sha256_file(source)
    for kind, (source, _columns, _rows, _count) in generator.SETS.items()
}
master_after["idle"] = sha256_file(generator.IDLE_SOURCE)
assert master_after == master_before, "generator modified a master image"

manifest = json.loads((RUNTIME / "manifest.json").read_text(encoding="utf-8"))
assert {key: len(value) for key, value in manifest.items()} == EXPECTED
assert sum(map(len, manifest.values())) == EXPECTED_TOTAL
manifest_paths = {relative for files in manifest.values() for relative in files}
disk_paths = {path.relative_to(ROOT).as_posix() for path in RUNTIME.rglob("*.png")}
assert manifest_paths == disk_paths, "manifest and runtime PNG inventory differ"

images: dict[tuple[str, int], Image.Image] = {}
bboxes: dict[str, list[tuple[int, int, int, int]]] = {}
for kind, files in manifest.items():
    bboxes[kind] = []
    for index, relative in enumerate(files, start=1):
        path = ROOT / relative
        assert path.exists(), f"missing runtime frame: {path}"
        image = Image.open(path)
        assert image.mode == "RGBA", f"not RGBA: {path} ({image.mode})"
        assert image.size == generator.RUNTIME_SIZE, f"wrong canvas: {path} {image.size}"
        rgba = image.convert("RGBA")
        alpha = rgba.getchannel("A")
        alpha_min, alpha_max = alpha.getextrema()
        assert alpha_min == 0 and alpha_max > 16, f"bad transparency: {path} {alpha.getextrema()}"
        assert all(
            a or (r == 0 and g == 0 and b == 0)
            for r, g, b, a in rgba.get_flattened_data()
        ), f"hidden RGB matte in fully transparent pixels: {path}"
        bbox = alpha.point(lambda value: 255 if value > 16 else 0).getbbox()
        assert bbox is not None, f"empty runtime frame: {path}"
        bboxes[kind].append(bbox)
        images[(kind, index)] = rgba
        print(f"PASS {relative} RGBA 512x512 bbox={bbox}")

# Wide viewmodel is the production non-ADS plate. Its front-sight cap must
# converge on canvas centre, while only right/bottom edges intentionally exit.
assert sha256_file(WIDE_HIP) == WIDE_HIP_SHA256, "wide hip viewmodel hash changed"
wide = Image.open(WIDE_HIP).convert("RGBA")
wide_alpha = wide.getchannel("A")
wide_mask = wide_alpha.point(lambda value: 255 if value > 16 else 0)
wide_box = wide_mask.getbbox()
assert wide.size == (1672, 941) and wide_box == (445, 458, 1672, 941), f"wide hip geometry changed: {wide.size} {wide_box}"
first_y = next(y for y in range(wide.height) if wide_mask.crop((0, y, wide.width, y + 1)).getbbox())
sight = [(x, y) for y in range(first_y, first_y + 20) for x in range(wide.width) if wide_alpha.getpixel((x, y)) > 32]
sight_x = sum(x for x, _y in sight) / len(sight)
sight_y = sum(y for _x, y in sight) / len(sight)
assert abs(sight_x - wide.width / 2) <= 1 and abs(sight_y - wide.height / 2) <= 1, (
    f"wide hip sight misses centre: {(sight_x, sight_y)}"
)
assert wide_mask.crop((0, 0, 1, wide.height)).getbbox() is None, "wide hip touches left edge"
assert wide_mask.crop((0, 0, wide.width, 1)).getbbox() is None, "wide hip touches top edge"
assert wide_mask.crop((wide.width - 1, 0, wide.width, wide.height)).getbbox() is not None, "wide hip must exit right"
assert wide_mask.crop((0, wide.height - 1, wide.width, wide.height)).getbbox() is not None, "wide hip must exit bottom"
print(f"PASS wide hip RGBA 1672x941 sight=({sight_x:.2f},{sight_y:.2f}) bbox={wide_box}")

# Every audited badge rectangle must be transparent after projection.  The
# maximum 1-2 alpha introduced by Lanczos on resized sheets is still below the
# explicit semi-opaque threshold of 16.
for kind, rectangles in generator.BADGE_RECTS.items():
    for zero_index, source_box in enumerate(rectangles):
        runtime_box = projected_box(kind, zero_index, source_box)
        alpha_max = images[(kind, zero_index + 1)].getchannel("A").crop(runtime_box).getextrema()[1]
        assert alpha_max <= 2, f"badge residue in {kind} {zero_index + 1}: alpha={alpha_max}"

# Explicit edge/top cleanup zones may retain only sub-threshold resampling
# traces; opaque or semi-opaque pixels in these zones are regressions.
for kind, frame_rectangles in generator.EDGE_CLEANUP_RECTS.items():
    for zero_index, rectangles in enumerate(frame_rectangles):
        for source_box in rectangles:
            runtime_box = projected_box(kind, zero_index, source_box)
            assert alpha_count(images[(kind, zero_index + 1)], runtime_box) == 0, (
                f"edge/top residue in {kind} {zero_index + 1}: {runtime_box}"
            )

for index, opening in enumerate(ADS_OPENINGS, start=1):
    alpha = images[("ads", index)].getchannel("A").crop(opening)
    histogram = alpha.histogram()
    transparent = sum(histogram[:17])
    assert transparent / (alpha.width * alpha.height) >= 0.99, f"ADS {index} optic is not transparent"

# Accepted idle v2 has a real transparent safe margin on the internal (left/top)
# edges.  The arms and stock intentionally continue through bottom/right, which
# are placed beyond the viewport by the runtime CSS.
idle_alpha = images[("idle", 1)].getchannel("A").point(lambda value: 255 if value > 16 else 0)
idle_box = idle_alpha.getbbox()
assert idle_box is not None and idle_box[0] >= 96 and idle_box[1] >= 150, f"idle safe margin regressed: {idle_box}"
assert idle_alpha.crop((0, 0, 1, 512)).getbbox() is None, "idle touches internal left canvas edge"
assert idle_alpha.crop((0, 0, 512, 1)).getbbox() is None, "idle touches top canvas edge"
assert idle_alpha.crop((511, 0, 512, 512)).getbbox() is not None, "idle no longer exits through right edge"
assert idle_alpha.crop((0, 511, 512, 512)).getbbox() is not None, "idle no longer exits through bottom edge"

for kind, index, box, minimum_pixels in WEAPON_GUARDS:
    actual = alpha_count(images[(kind, index)], box)
    assert actual >= minimum_pixels, f"weapon pixels cut from {kind} {index}: {actual}"

for index, flash_box, flash_minimum, case_box, case_minimum in FIRE_GUARDS:
    assert alpha_count(images[("fire", index)], flash_box) >= flash_minimum, f"fire {index} flash/smoke missing"
    assert alpha_count(images[("fire", index)], case_box) >= case_minimum, f"fire {index} casing missing"

for kind, boxes in bboxes.items():
    if len(boxes) < 2:
        continue
    max_x, max_y, max_width, max_height, max_bottom_gap = MOTION_LIMITS[kind]
    for first, second in zip(boxes, boxes[1:]):
        first_center = ((first[0] + first[2]) / 2, (first[1] + first[3]) / 2)
        second_center = ((second[0] + second[2]) / 2, (second[1] + second[3]) / 2)
        assert abs(second_center[0] - first_center[0]) <= max_x, f"{kind} horizontal anchor jump"
        assert abs(second_center[1] - first_center[1]) <= max_y, f"{kind} vertical bbox jump"
        assert abs((second[2] - second[0]) - (first[2] - first[0])) <= max_width, f"{kind} width jump"
        assert abs((second[3] - second[1]) - (first[3] - first[1])) <= max_height, f"{kind} height jump"
        assert abs((512 - second[3]) - (512 - first[3])) <= max_bottom_gap, f"{kind} bottom anchor jump"

print(f"PASS manifest inventory: {EXPECTED} total={EXPECTED_TOTAL}")
print(f"PASS master integrity: {len(master_before)} SHA-256 locks unchanged")
print(f"PASS deterministic SHA-256 x2: {aggregate_hash(round_two)}")
print("PASS badges/edge residue/ADS optic/idle safe margins/weapon guards/fire effects/bbox continuity")
