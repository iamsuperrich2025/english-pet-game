#!/usr/bin/env python3
"""Pack Vocab Force GLBs for production: one full body plus animation-only clips."""
from __future__ import annotations

import copy
import json
import shutil
import struct
from pathlib import Path

JSON_CHUNK = 0x4E4F534A
BIN_CHUNK = 0x004E4942


def read_glb(path: Path) -> tuple[dict, bytes]:
    raw = path.read_bytes()
    magic, version, total = struct.unpack_from("<III", raw, 0)
    if magic != 0x46546C67 or version != 2 or total != len(raw):
        raise ValueError(f"invalid GLB: {path}")
    pos = 12
    doc = None
    blob = b""
    while pos < len(raw):
        length, kind = struct.unpack_from("<II", raw, pos)
        pos += 8
        chunk = raw[pos:pos + length]
        pos += length
        if kind == JSON_CHUNK:
            doc = json.loads(chunk.decode("utf-8").rstrip(" \t\r\n\0"))
        elif kind == BIN_CHUNK:
            blob = chunk
    if doc is None:
        raise ValueError(f"missing JSON chunk: {path}")
    return doc, blob


def write_glb(path: Path, doc: dict, blob: bytes) -> None:
    text = json.dumps(doc, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    text += b" " * ((-len(text)) % 4)
    blob += b"\0" * ((-len(blob)) % 4)
    total = 12 + 8 + len(text) + (8 + len(blob) if blob else 0)
    out = bytearray(struct.pack("<III", 0x46546C67, 2, total))
    out += struct.pack("<II", len(text), JSON_CHUNK) + text
    if blob:
        out += struct.pack("<II", len(blob), BIN_CHUNK) + blob
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(out)


def animation_only(src: Path, dst: Path) -> None:
    doc, blob = read_glb(src)
    animations = copy.deepcopy(doc.get("animations") or [])
    if not animations:
        raise ValueError(f"no animation in {src}")

    used_accessors: set[int] = set()
    for animation in animations:
        for sampler in animation.get("samplers") or []:
            used_accessors.add(int(sampler["input"]))
            used_accessors.add(int(sampler["output"]))

    accessor_map = {old: new for new, old in enumerate(sorted(used_accessors))}
    accessors = [copy.deepcopy(doc["accessors"][old]) for old in sorted(used_accessors)]
    for animation in animations:
        for sampler in animation.get("samplers") or []:
            sampler["input"] = accessor_map[int(sampler["input"])]
            sampler["output"] = accessor_map[int(sampler["output"])]

    used_views: set[int] = set()
    for accessor in accessors:
        if "bufferView" in accessor:
            used_views.add(int(accessor["bufferView"]))
        sparse = accessor.get("sparse") or {}
        for key in ("indices", "values"):
            if key in sparse and "bufferView" in sparse[key]:
                used_views.add(int(sparse[key]["bufferView"]))

    view_map = {old: new for new, old in enumerate(sorted(used_views))}
    packed = bytearray()
    views = []
    for old in sorted(used_views):
        source = copy.deepcopy(doc["bufferViews"][old])
        start = int(source.get("byteOffset", 0))
        length = int(source["byteLength"])
        packed += b"\0" * ((-len(packed)) % 4)
        offset = len(packed)
        packed += blob[start:start + length]
        source["buffer"] = 0
        source["byteOffset"] = offset
        source.pop("target", None)
        views.append(source)

    for accessor in accessors:
        if "bufferView" in accessor:
            accessor["bufferView"] = view_map[int(accessor["bufferView"])]
        sparse = accessor.get("sparse") or {}
        for key in ("indices", "values"):
            if key in sparse and "bufferView" in sparse[key]:
                sparse[key]["bufferView"] = view_map[int(sparse[key]["bufferView"])]

    nodes = []
    for node in doc.get("nodes") or []:
        nodes.append({key: copy.deepcopy(node[key]) for key in ("name", "translation", "rotation", "scale") if key in node})
    targets = sorted({int(channel["target"]["node"]) for animation in animations for channel in animation.get("channels") or [] if "node" in channel.get("target", {})})
    packed_doc = {
        "asset": {"version": "2.0", "generator": "Vocab Force animation-only packer"},
        "scene": 0,
        "scenes": [{"nodes": targets}],
        "nodes": nodes,
        "animations": animations,
        "accessors": accessors,
        "bufferViews": views,
        "buffers": [{"byteLength": len(packed)}],
    }
    write_glb(dst, packed_doc, bytes(packed))


def pack_group(source: Path, output: Path, body: str, files: list[str]) -> None:
    output.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source / body, output / body)
    for name in files:
        if name != body:
            animation_only(source / name, output / name)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    base = root / "minigames" / "vocab-force"
    out = base / "runtime-models"
    nex = [
        "nex_walk.glb", "nex_Walk_Backward.glb", "nex_Standard_Forward_Char.glb",
        "nex_Right_Jab_from_Guard.glb", "nex_Step_in_High_Kick.glb", "nex_Sweeping_Kick.glb",
        "nex_Block1.glb", "nex_Stand_To_Side_Lying.glb", "nex_Jump_with_Arms_Open.glb",
        "nex_Vault_and_Land.glb", "nex_Climb_Stairs.glb", "nex_Climb_Left_with_Both_.glb",
        "nex_Climb_Right_with_Both.glb", "nex_climbing_down_wall.glb", "nex_Wall_Flip.glb",
        "nex_victory.glb", "nex_Stand_Up5.glb", "nex_Step_to_Sit_Transitio.glb",
        "nex_Boxing_Guard_Right_St.glb", "nex_Tightrope_Walk_inplac.glb", "nex_Unsteady_Walk.glb",
        "nex_mage_soell_cast.glb", "nex_Charged_Ground_Slam.glb",
    ]
    lyra = [
        "ly_Run.glb", "ly_Elbow_Strike.glb", "ly_Roundhouse_Kick.glb", "ly_Jump_with_Arms_Open.glb",
        "ly_Dive_Down_and_Land_2.glb", "ly_Backflip_and_Hooks.glb", "ly_Fall2.glb",
        "ly_Confident_Strut.glb", "ly_Power_Spin_Jump.glb", "ly_mage_soell_cast.glb", "ly_Charged_Ground_Slam.glb",
    ]
    zom = ["zom_Elderly_Shaky_Walk_in.glb", "zom_Scream.glb", "zom_Fall3.glb"]
    pack_group(base / "characters" / "next" / "animations", out / "nex", "nex_walk.glb", nex)
    pack_group(base / "characters" / "Lyravyn" / "animations", out / "lyravyn", "ly_Run.glb", lyra)
    pack_group(base / "characters" / "zom" / "animations", out / "zom", "zom_Elderly_Shaky_Walk_in.glb", zom)
    total = sum(path.stat().st_size for path in out.rglob("*.glb"))
    if total > 130 * 1024 * 1024:
        raise SystemExit(f"runtime bundle unexpectedly large: {total:,} bytes")
    print(f"Vocab Force runtime GLBs: {len(list(out.rglob('*.glb')))} files, {total:,} bytes")


if __name__ == "__main__":
    main()
