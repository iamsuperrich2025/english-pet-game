#!/usr/bin/env python3
"""Crop the generated 3x3 Thai portrait sheet into hotel game textures."""

from pathlib import Path
import sys

from PIL import Image, ImageEnhance


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: crop_hotel_portraits.py <contact-sheet.png>")

    src = Image.open(sys.argv[1]).convert("RGB")
    out_dir = Path(__file__).resolve().parents[1] / "img" / "tex"
    out_dir.mkdir(parents=True, exist_ok=True)

    cell_w, cell_h = src.width // 3, src.height // 3
    portraits = []
    for idx in range(9):
        col, row = idx % 3, idx // 3
        x0, y0 = col * cell_w, row * cell_h
        cell = src.crop((x0 + 3, y0 + 3, x0 + cell_w - 3, y0 + cell_h - 3))

        # The game frame is 3:4. Preserve the face and trim only the quiet side background.
        target_w = round(cell.height * 3 / 4)
        left = max(0, (cell.width - target_w) // 2)
        cell = cell.crop((left, 0, left + target_w, cell.height))
        cell = cell.resize((768, 1024), Image.Resampling.LANCZOS)
        cell = ImageEnhance.Contrast(cell).enhance(1.05)
        cell = ImageEnhance.Color(cell).enhance(0.86)
        portraits.append(cell)

    for idx, img in enumerate(portraits[:6], 1):
        img.save(out_dir / f"tex_hotel_portrait_{idx}.png", optimize=True)

    # Use a seventh, distinct synthetic identity for both the funeral altar and wardrobe clue.
    portraits[6].save(out_dir / "tex_hotel_funeral_portrait.png", optimize=True)


if __name__ == "__main__":
    main()
