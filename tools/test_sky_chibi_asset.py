from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET = ROOT / "img" / "characters" / "sky_soft_cuboid_chibi_8dir.webp"
COLS, ROWS = 4, 2


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)
    print("PASS", message)


image = Image.open(ASSET).convert("RGBA")
check(image.size == (1536, 768), "atlas is the locked 4x2 production size")
alpha = image.getchannel("A")
check(alpha.getextrema() == (0, 255), "atlas contains real transparent and opaque pixels")
check(all(alpha.getpixel(point) == 0 for point in ((0, 0), (1535, 0), (0, 767), (1535, 767))), "outer corners are transparent, not a baked checkerboard")

cell_width, cell_height = image.width // COLS, image.height // ROWS
for row in range(ROWS):
    for col in range(COLS):
        frame = alpha.crop((col * cell_width, row * cell_height, (col + 1) * cell_width, (row + 1) * cell_height))
        bbox = frame.getbbox()
        check(bbox is not None and bbox[2] - bbox[0] >= 150 and bbox[3] - bbox[1] >= 330, f"direction frame {row * COLS + col} has a complete aligned character")

print("Sky Soft Cuboid Chibi atlas QA passed")
