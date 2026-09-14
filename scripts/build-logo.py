"""
Generate both approved logo lockups and the favicon set from the supplied art.

    python scripts/build-logo.py src/assets/Logo.svg

About that source file: it has an .svg extension but it is not a vector. It is
a 1.6 MB wrapper around two embedded PNGs, one greyscale alpha mask and one
RGB colour plate, both 1594x1604, plus a single <path> that is only a
rectangular clip. There is no drawn geometry in it at all. Shipping it as-is
would mean a 1.6 MB request for a 38px mark that still cannot scale.

What it is good for is resolution: the artwork inside is 3x the raster we had.
This script recovers it and renders the two lockups from that.

Why two lockups: the lion's structural line work measures #151D26 and the site
header is #0B0B0C. That is 1.15:1 contrast where a graphic needs 3:1, so the
original colours are invisible on the dark ground. `lion-reversed` turns that
near-black into cream and leaves the gold mane exactly as it is;
`lion-original` is untouched, for light grounds.

The gold test is a soft ramp rather than a threshold. A binary test throws away
every anti-aliased edge pixel and leaves the mark looking chipped at header
size.

Outputs land in src/assets, not public/. They are statically imported by
Logo.tsx, so Next fingerprints and bundles them; a copy in public/ as well
would ship the same bytes twice under a non-cacheable name.
"""

import base64
import io
import re
import sys

import numpy as np
from PIL import Image

CREAM = np.array([245.0, 240.0, 235.0])
INK = (11, 11, 12, 255)
# Rows 1037 to 1085 are empty in the recovered art: that gap separates the
# lion from the CONSULTANTS RS wordmark. Only the lion is used as an image;
# the wordmark is set in Geist on the page so it stays sharp and selectable.
LION_BOTTOM = 1037


def recover(path: str) -> Image.Image:
    """Pull the artwork back out of the SVG wrapper, or open a plain raster."""
    if not path.lower().endswith(".svg"):
        return Image.open(path).convert("RGBA")

    source = open(path, encoding="utf-8", errors="replace").read()
    blobs = re.findall(r'(?:xlink:)?href="data:image/[a-z+]+;base64,([A-Za-z0-9+/=]+)"', source)
    if len(blobs) < 2:
        raise SystemExit("expected a mask and a colour plate inside the SVG")
    mask = Image.open(io.BytesIO(base64.b64decode(blobs[0]))).convert("L")
    colour = Image.open(io.BytesIO(base64.b64decode(blobs[1]))).convert("RGB")
    rgba = Image.merge("RGBA", (*colour.split(), mask))
    return rgba.crop(rgba.split()[3].getbbox())


def goldness(rgb: np.ndarray) -> np.ndarray:
    r, b = rgb[:, :, 0], rgb[:, :, 2]
    lum = rgb.mean(axis=2)
    warm = np.clip(((r - b) - 8.0) / 55.0, 0.0, 1.0)
    bright = np.clip((lum - 40.0) / 45.0, 0.0, 1.0)
    return (warm * bright)[:, :, None]


def main(source: str) -> None:
    art = recover(source)
    lion = art.crop((0, 0, art.width, LION_BOTTOM))
    lion = lion.crop(lion.split()[3].getbbox())

    data = np.array(lion).astype(float)
    rgb, alpha = data[:, :, :3], data[:, :, 3]
    g = goldness(rgb)
    reversed_rgb = rgb * g + CREAM * (1.0 - g)

    def save(arr: np.ndarray, path: str, height: int) -> None:
        im = Image.fromarray(np.dstack([arr, alpha]).astype("uint8"), "RGBA")
        width = round(im.width * height / im.height)
        im.resize((width, height), Image.LANCZOS).save(path, "WEBP", quality=92, method=6)
        print(f"{path}  {width}x{height}")

    # 3x the largest rendered size (44px in the footer) with headroom.
    save(reversed_rgb, "src/assets/lion-reversed.webp", 320)
    save(rgb, "src/assets/lion-original.webp", 320)

    icon = Image.fromarray(np.dstack([reversed_rgb, alpha]).astype("uint8"), "RGBA")
    for size, name in ((32, "src/app/icon.png"), (180, "src/app/apple-icon.png")):
        pad = round(size * 0.12)
        inner = size - pad * 2
        width = round(icon.width * inner / icon.height)
        canvas = Image.new("RGBA", (size, size), INK)
        canvas.alpha_composite(icon.resize((width, inner), Image.LANCZOS), ((size - width) // 2, pad))
        canvas.save(name)
        print(f"{name}  {size}x{size}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "src/assets/Logo.svg")
