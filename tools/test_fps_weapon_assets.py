#!/usr/bin/env python3
"""Validate master transparency and generated FPS weapon runtime frames."""

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "assets/weapons/fps/runtime"
EXPECTED = {"idle": 1, "walk": 8, "sprint": 8, "equip": 8, "ads": 6, "fire": 4, "reload": 12}
MASTERS = [
    ROOT / "assets/weapons/fps/fps_weapon_idle_master.png",
    ROOT / "assets/weapons/fps/fps_weapon_walk_8frames_master.png",
    ROOT / "assets/weapons/fps/fps_weapon_sprint_8frames_master.png",
    ROOT / "assets/weapons/fps/fps_weapon_equip_8frames_master.png",
    ROOT / "assets/weapons/fps/fps_weapon_ads_6frames_master.png",
    ROOT / "assets/weapons/fps/fire/fps_weapon_fire_4frames_master.png",
    ROOT / "img/animation/fps_weapon/fps_weapon_reload_12frames_master.png",
]

for master in MASTERS:
    assert master.exists(), f"missing master: {master}"
    image = Image.open(master)
    assert "A" in image.getbands(), f"no alpha channel: {master}"
    alpha = image.getchannel("A")
    assert alpha.getextrema()[0] == 0, f"no transparent pixels: {master}"

manifest = json.loads((RUNTIME / "manifest.json").read_text(encoding="utf-8"))
assert {key: len(value) for key, value in manifest.items()} == EXPECTED
for kind, files in manifest.items():
    for relative in files:
        path = ROOT / relative
        assert path.exists(), f"missing runtime frame: {path}"
        image = Image.open(path)
        assert image.size == (512, 512), f"non-normalized frame: {path} {image.size}"
        assert "A" in image.getbands() and image.getchannel("A").getextrema()[0] == 0, f"bad alpha: {path}"

print("PASS FPS weapon assets: 7 masters transparent, 47 normalized runtime frames present")
