#!/usr/bin/env python3
"""Build deterministic runtime frames from the untouched FPS master sheets."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SETS = {
    "ads": (ROOT / "assets/weapons/fps/fps_weapon_ads_6frames_master.png", 3, 2, 6),
    "walk": (ROOT / "assets/weapons/fps/fps_weapon_walk_8frames_master.png", 4, 2, 8),
    "sprint": (ROOT / "assets/weapons/fps/fps_weapon_sprint_8frames_master.png", 4, 2, 8),
    "equip": (ROOT / "assets/weapons/fps/fps_weapon_equip_8frames_master.png", 4, 2, 8),
    "fire": (ROOT / "assets/weapons/fps/fire/fps_weapon_fire_4frames_master.png", 2, 2, 4),
    "reload": (ROOT / "img/animation/fps_weapon/fps_weapon_reload_12frames_master.png", 3, 4, 12),
}
OUT = ROOT / "assets/weapons/fps/runtime"
RUNTIME_SIZE = (512, 512)

# These hashes make the cleanup masks fail closed.  Every rectangle below was
# audited against this exact source image; applying it to a replaced/reordered
# sheet could erase weapon pixels.
MASTER_SHA256 = {
    "ads": "bbe02f5d2f9294a3526b04fcbaafc309ed5bb2a5e309c036b98909cfdcf5e606",
    "walk": "12820daf2beb3cb7017265472b10c73f55f633f1197315490ca34050b0b148d0",
    "sprint": "cf3e51d1fc6056a93923c774dacaee7f46c1573af934a6dc2b89e326b0233475",
    "equip": "9ade78a9b3d80587b2634c81888d90bed3ee2bfac64002d720cb63649a88a8e2",
    "fire": "c2fa8fa7e434eefd883d8c3e240e5cc281e5b98d4270c291ebd89ae2b60d8405",
    "reload": "4f19ec2173d6a8f569f36f964f73b3a4008f3cd1a422dcc7021a78a2fbd1eac0",
    "idle": "8e68fd8a43794602ac97ea60fff936e4568236158d2915557ab2090662225cbe",
}

# Crop-local, half-open rectangles covering only the printed frame badges.
# They intentionally vary per frame because the source badges are not aligned.
BADGE_RECTS = {
    "ads": ((76, 22, 141, 89), (56, 22, 122, 89), (58, 22, 124, 89),
            (76, 12, 141, 79), (56, 12, 122, 79), (58, 12, 124, 79)),
    "walk": ((58, 13, 118, 72), (68, 13, 128, 72), (108, 13, 168, 72),
             (74, 13, 135, 72), (58, 2, 118, 62), (68, 3, 129, 62),
             (58, 2, 118, 62), (43, 2, 103, 62)),
    "sprint": ((39, 38, 105, 104), (38, 36, 104, 102), (50, 36, 116, 102),
               (25, 37, 91, 103), (34, 6, 100, 72), (34, 7, 100, 74),
               (52, 8, 118, 74), (3, 9, 70, 75)),
    "equip": ((6, 9, 64, 66), (0, 8, 52, 64), (6, 8, 63, 66),
              (11, 8, 68, 66), (8, 32, 64, 88), (0, 31, 54, 88),
              (3, 31, 60, 88), (8, 31, 65, 88)),
    "reload": ((18, 5, 69, 57), (22, 6, 74, 59), (23, 6, 75, 59),
               (16, 16, 69, 68), (13, 15, 66, 68), (24, 20, 76, 72),
               (17, 5, 69, 57), (26, 5, 78, 58), (23, 6, 75, 58),
               (14, 0, 67, 49), (20, 0, 72, 49), (21, 0, 74, 49)),
}

# Source-sheet row bleed confirmed by pixel inspection.  These masks are also
# crop-local and avoid the current-frame barrel regions in reload frames 7-9.
EDGE_CLEANUP_RECTS = {
    # Each ADS frame has a verified weapon-free band above its first weapon
    # pixel.  Clearing that exact band also removes faint background residue.
    "ads": (
        ((0, 0, 512, 148),), ((0, 0, 512, 70),), ((0, 0, 512, 76),),
        ((0, 0, 512, 84),), ((0, 0, 512, 74),), ((0, 0, 512, 43),),
    ),
    "reload": (
        (), (), (),
        ((0, 0, 418, 44),), ((0, 0, 418, 41),), ((0, 0, 418, 22),),
        ((0, 0, 170, 2), (250, 0, 418, 2)),
        ((0, 0, 180, 2), (250, 0, 418, 2)),
        ((0, 0, 135, 2), (235, 0, 418, 2)),
        (), (), (),
    ),
}

IDLE_SOURCE = ROOT / "assets/weapons/fps/fps_weapon_idle_master.png"


def grid_edges(length: int, cells: int) -> list[int]:
    return [round(i * length / cells) for i in range(cells + 1)]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_master(kind: str, source: Path) -> None:
    actual = sha256_file(source)
    expected = MASTER_SHA256[kind]
    if actual != expected:
        raise RuntimeError(
            f"Refusing to apply audited {kind} masks: master SHA-256 changed "
            f"(expected {expected}, got {actual})"
        )


def clear_rectangles(frame: Image.Image, rectangles: tuple[tuple[int, int, int, int], ...]) -> None:
    """Clear only audited source-cell rectangles, including hidden RGB."""
    width, height = frame.size
    for box in rectangles:
        left, top, right, bottom = box
        if not (0 <= left < right <= width and 0 <= top < bottom <= height):
            raise ValueError(f"cleanup rectangle {box} outside frame {frame.size}")
        frame.paste((0, 0, 0, 0), box)


def clean_frame(kind: str, index: int, frame: Image.Image) -> None:
    rectangles: list[tuple[int, int, int, int]] = []
    if kind in BADGE_RECTS:
        rectangles.append(BADGE_RECTS[kind][index])
    if kind in EDGE_CLEANUP_RECTS:
        rectangles.extend(EDGE_CLEANUP_RECTS[kind][index])
    clear_rectangles(frame, tuple(rectangles))


def write_frame(kind: str, index: int, frame: Image.Image) -> str:
    folder = OUT / kind
    folder.mkdir(parents=True, exist_ok=True)
    name = f"fps_weapon_{kind}_{index:02d}.png"
    frame.save(folder / name, format="PNG", optimize=False, compress_level=9)
    return f"assets/weapons/fps/runtime/{kind}/{name}"


def normalize_frame(frame: Image.Image) -> Image.Image:
    """Keep every state on one canvas so screen scale/anchor cannot jump."""
    fitted = ImageOps.contain(frame, RUNTIME_SIZE, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", RUNTIME_SIZE, (0, 0, 0, 0))
    canvas.alpha_composite(fitted, ((RUNTIME_SIZE[0] - fitted.width) // 2, RUNTIME_SIZE[1] - fitted.height))
    return canvas


def build(clean: bool = False) -> dict[str, list[str]]:
    if clean and OUT.exists():
        for old in OUT.rglob("*.png"):
            old.unlink()
    manifest: dict[str, list[str]] = {}
    for kind, (source, columns, rows, count) in SETS.items():
        if not source.exists():
            raise FileNotFoundError(source)
        verify_master(kind, source)
        sheet = Image.open(source).convert("RGBA")
        xs, ys = grid_edges(sheet.width, columns), grid_edges(sheet.height, rows)
        frames: list[str] = []
        for index in range(count):
            col, row = index % columns, index // columns
            frame = sheet.crop((xs[col], ys[row], xs[col + 1], ys[row + 1]))
            clean_frame(kind, index, frame)
            frame = normalize_frame(frame)
            frames.append(write_frame(kind, index + 1, frame))
        manifest[kind] = frames

    verify_master("idle", IDLE_SOURCE)
    idle = normalize_frame(Image.open(IDLE_SOURCE).convert("RGBA"))
    idle_folder = OUT / "idle"
    idle_folder.mkdir(parents=True, exist_ok=True)
    idle.save(idle_folder / "fps_weapon_idle.png", format="PNG", optimize=False, compress_level=9)
    manifest["idle"] = ["assets/weapons/fps/runtime/idle/fps_weapon_idle.png"]
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--clean", action="store_true")
    args = parser.parse_args()
    result = build(args.clean)
    print("PASS FPS runtime frames:", ", ".join(f"{key}={len(value)}" for key, value in result.items()))
