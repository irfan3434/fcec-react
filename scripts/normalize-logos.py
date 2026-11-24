#!/usr/bin/env python
"""Trim partner logos to their artwork and re-centre them on one shared canvas.

The logo files come from the partners themselves, so every one is cropped
differently: a 1000x1000 PNG with the mark floating in a different amount of
empty space, a tight 390x88 wordmark, a square with an opaque coloured panel.
Sizing those with `width: 100%` is what made the theme's logo walls look
ragged — Esri read three times the weight of Mifre Energy purely because of
how the two files were saved.

Each logo is trimmed to its ink and then scaled to a constant *area*, clamped
to fit the canvas. Area rather than height or width: it is what stops a wide
wordmark from dwarfing a square roundel. Every export lands on the same canvas
with transparent padding, so the markup needs one width/height pair for all of
them and the CSS needs no per-logo special cases.

Usage:
    python scripts/normalize-logos.py <map.tsv> <src-dir> <dst-dir> [max-height]

The map is two tab-separated columns, source stem and output slug:
    Esri<TAB>esri

`max-height` caps how tall a mark may stand on the canvas, and defaults to
170. Raise it for a set with many portrait marks: the area rule wants to grow
a tall logo until it is as heavy as a wide one, and the height cap is what
stops it, so a stacked logo in a wall of wordmarks ends up reading light. The
accreditation wall is half portrait seals and uses 210.
"""

import math
import pathlib
import sys

from PIL import Image, ImageChops

CANVAS = (480, 240)
MAX_W, DEFAULT_MAX_H = 420, 170
TARGET_AREA = 48_000
# Pixels below this alpha are fringe, not ink.
ALPHA_FLOOR = 12
# Pixels this close to the background colour are background, not ink.
COLOUR_FLOOR = 24
# A ground only counts as padding to cut if it is near-white. Several logos
# are a mark reversed out of a solid colour — Almesbar's blue panel, Wastech's
# navy — and there the panel is the logo, not space around it.
WHITE_FLOOR = 235
# Lossless first when one logo was supplied in more than one format.
PREFERRED_SUFFIXES = (".png", ".webp", ".gif", ".jpeg", ".jpg")


def ink_box(img):
    """The artwork's bounding box, however the file happens to pad it."""
    alpha = img.getchannel("A").point(lambda v: 255 if v > ALPHA_FLOOR else 0)
    box = alpha.getbbox()
    if box is not None and box != (0, 0) + img.size:
        return box

    rgb = img.convert("RGB")
    corner = rgb.getpixel((0, 0))
    if min(corner) < WHITE_FLOOR:
        return box

    ground = Image.new("RGB", rgb.size, corner)
    diff = ImageChops.difference(rgb, ground).convert("L")
    return diff.point(lambda v: 255 if v > COLOUR_FLOOR else 0).getbbox() or box


def normalize(path, out, max_h):
    img = Image.open(path).convert("RGBA")
    box = ink_box(img)
    if box is None:
        return None

    ink = img.crop(box)
    w, h = ink.size
    scale = min(math.sqrt(TARGET_AREA / (w * h)), MAX_W / w, max_h / h)
    size = (max(1, round(w * scale)), max(1, round(h * scale)))
    ink = ink.resize(size, Image.LANCZOS)

    sheet = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    sheet.paste(ink, ((CANVAS[0] - size[0]) // 2, (CANVAS[1] - size[1]) // 2), ink)
    sheet.save(out, "WEBP", quality=86, method=6)
    return (w, h), size


def main():
    mapping, src, dst = (pathlib.Path(a) for a in sys.argv[1:4])
    max_h = int(sys.argv[4]) if len(sys.argv) > 4 else DEFAULT_MAX_H
    dst.mkdir(parents=True, exist_ok=True)

    for line in mapping.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        stem, slug = line.rstrip("\n").split("\t")
        # A few logos were supplied twice in different formats. Prefer the
        # lossless one: Moorhouse ships as both a 1000px PNG and a 200px JPEG,
        # and directory order alone would pick the JPEG.
        matches = sorted(
            (p for p in src.iterdir() if p.stem == stem),
            key=lambda p: PREFERRED_SUFFIXES.index(p.suffix.lower())
            if p.suffix.lower() in PREFERRED_SUFFIXES
            else len(PREFERRED_SUFFIXES),
        )
        if not matches:
            print(f"{slug:32} MISSING {stem}")
            continue

        out = dst / f"{slug}.webp"
        result = normalize(matches[0], out, max_h)
        if result is None:
            print(f"{slug:32} blank, skipped")
            continue
        (w, h), size = result
        print(f"{slug:32} {w}x{h} -> {size[0]}x{size[1]}  {out.stat().st_size // 1024} kB")


if __name__ == "__main__":
    main()
