#!/usr/bin/env python3
"""Build deterministic runtime frames from the untouched FPS master sheets."""

from __future__ import annotations

import argparse
import json
from collections import deque
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


def grid_edges(length: int, cells: int) -> list[int]:
    return [round(i * length / cells) for i in range(cells + 1)]


def remove_number_badge(frame: Image.Image) -> None:
    """Remove the detached numbered badge component without touching weapon pixels."""
    alpha = frame.getchannel("A")
    width, height = frame.size
    limit_x = min(width, max(88, round(width * 0.34)))
    limit_y = min(height, max(92, round(height * 0.20)))
    pixels = alpha.load()
    seen: set[tuple[int, int]] = set()
    candidates: list[list[tuple[int, int]]] = []

    for y in range(limit_y):
        for x in range(limit_x):
            if pixels[x, y] <= 16 or (x, y) in seen:
                continue
            queue = deque([(x, y)])
            seen.add((x, y))
            component: list[tuple[int, int]] = []
            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < limit_x and 0 <= ny < limit_y and (nx, ny) not in seen and pixels[nx, ny] > 16:
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            candidates.append(component)

    for component in candidates:
        xs = [p[0] for p in component]
        ys = [p[1] for p in component]
        box = (min(xs), min(ys), max(xs) + 1, max(ys) + 1)
        bw, bh = box[2] - box[0], box[3] - box[1]
        if len(component) >= 350 and bw <= 120 and bh <= 120 and box[0] < width * 0.28 and box[1] < height * 0.15:
            rgba = frame.load()
            for px, py in component:
                rgba[px, py] = (0, 0, 0, 0)


def write_frame(kind: str, index: int, frame: Image.Image) -> str:
    folder = OUT / kind
    folder.mkdir(parents=True, exist_ok=True)
    name = f"fps_weapon_{kind}_{index:02d}.png"
    frame.save(folder / name, optimize=True)
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
        sheet = Image.open(source).convert("RGBA")
        xs, ys = grid_edges(sheet.width, columns), grid_edges(sheet.height, rows)
        frames: list[str] = []
        for index in range(count):
            col, row = index % columns, index // columns
            frame = sheet.crop((xs[col], ys[row], xs[col + 1], ys[row + 1]))
            remove_number_badge(frame)
            frame = normalize_frame(frame)
            frames.append(write_frame(kind, index + 1, frame))
        manifest[kind] = frames

    idle_source = ROOT / "assets/weapons/fps/fps_weapon_idle_master.png"
    idle = normalize_frame(Image.open(idle_source).convert("RGBA"))
    idle_folder = OUT / "idle"
    idle_folder.mkdir(parents=True, exist_ok=True)
    idle.save(idle_folder / "fps_weapon_idle.png", optimize=True)
    manifest["idle"] = ["assets/weapons/fps/runtime/idle/fps_weapon_idle.png"]
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--clean", action="store_true")
    args = parser.parse_args()
    result = build(args.clean)
    print("PASS FPS runtime frames:", ", ".join(f"{key}={len(value)}" for key, value in result.items()))
