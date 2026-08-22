from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
ASSETS = {
    "hoodie-red": ("sky_soft_cuboid_chibi_8dir.webp", "sky_soft_cuboid_chibi_anim.webp"),
    "explorer": ("sky_soft_cuboid_chibi_explorer_8dir.webp", "sky_soft_cuboid_chibi_explorer_anim.webp"),
    "captain": ("sky_soft_cuboid_chibi_captain_8dir.webp", "sky_soft_cuboid_chibi_captain_anim.webp"),
    "schoolgirl": ("sky_soft_cuboid_chibi_schoolgirl_8dir.webp", "sky_soft_cuboid_chibi_schoolgirl_anim.webp"),
    "witch": ("sky_soft_cuboid_chibi_witch_8dir.webp", "sky_soft_cuboid_chibi_witch_anim.webp"),
    "pajamas": ("sky_soft_cuboid_chibi_pajamas_8dir.webp", "sky_soft_cuboid_chibi_pajamas_anim.webp"),
}

SOURCE_CELL = 384
CELL = 192
COLS = 8
ROWS = 8
FOOT_BASELINE = 187


def check(condition: bool, message: str, quiet: bool = False) -> None:
    if not condition:
        raise AssertionError(message)
    if not quiet:
        print("PASS", message)


def source_alpha(source: Image.Image, direction: int) -> Image.Image:
    col, row = direction % 4, direction // 4
    frame = source.crop(
        (col * SOURCE_CELL, row * SOURCE_CELL, (col + 1) * SOURCE_CELL, (row + 1) * SOURCE_CELL)
    ).resize((CELL, CELL), Image.Resampling.LANCZOS)
    alpha = frame.getchannel("A")
    normalized = Image.new("L", (CELL, CELL))
    normalized.paste(alpha.crop((0, 0, CELL, FOOT_BASELINE)), (0, 0))
    return normalized


for character_id, (source_name, animation_name) in ASSETS.items():
    source_path = ROOT / "img" / "characters" / source_name
    animation_path = ROOT / "img" / "characters" / animation_name
    check(animation_path.stat().st_size > 1_000_000, f"{character_id} has its own substantial idle/walk WebP")
    source = Image.open(source_path).convert("RGBA")
    animation = Image.open(animation_path).convert("RGBA")
    check(animation.size == (1536, 1536), f"{character_id} animation atlas is the locked 8x8 size")
    check(animation.getchannel("A").getextrema() == (0, 255), f"{character_id} animation atlas has real alpha")
    check(
        all(animation.getpixel(point)[3] == 0 for point in ((0, 0), (1535, 0), (0, 1535), (1535, 1535))),
        f"{character_id} animation atlas corners stay transparent",
    )

    for direction in range(ROWS):
        cells = [
            animation.crop((frame * CELL, direction * CELL, (frame + 1) * CELL, (direction + 1) * CELL))
            for frame in range(COLS)
        ]
        for frame, cell in enumerate(cells):
            bbox = cell.getchannel("A").getbbox()
            check(
                bbox is not None
                and 3 <= bbox[1] <= 11
                and bbox[2] - bbox[0] >= 74
                and bbox[3] - bbox[1] >= 176
                and bbox[3] == FOOT_BASELINE,
                f"{character_id} direction {direction} frame {frame} keeps scale and foot anchor",
            )
        check(
            ImageChops.difference(cells[0].getchannel("A"), source_alpha(source, direction)).getbbox() is None,
            f"{character_id} direction {direction} idle identity matches its source silhouette",
        )
        check(ImageChops.difference(cells[0], cells[2]).getbbox() is not None, f"{character_id} direction {direction} has idle motion", True)
        check(ImageChops.difference(cells[4], cells[6]).getbbox() is not None, f"{character_id} direction {direction} has walk motion", True)
    check(True, f"{character_id} keeps identity, scale, foot anchor and real idle/walk motion in all 8 directions")

check(len(ASSETS) == 6 and len({animation for _, animation in ASSETS.values()}) == 6, "all six characters remain separate animation assets")
print("Sky Soft Cuboid Chibi idle/walk atlas QA passed")
