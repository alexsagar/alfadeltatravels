"""Procedural cloud layers for the bird-journey prototype (original, no licence
obligations). Fractal value noise -> soft alpha -> lit/shadowed RGBA WebP.

Usage: python tools/clouds/make_clouds.py
Writes public/lab/clouds/{bank,wisp,veil}.webp
"""

import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "public", "lab", "clouds")
os.makedirs(OUT, exist_ok=True)


def fbm(w, h, octaves, seed, base=7):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        cells = base * 2**o
        small = rng.random((max(2, int(cells * h / w)), cells)).astype(np.float32)
        layer = np.asarray(Image.fromarray(small).resize((w, h), Image.BICUBIC), np.float32)
        acc += layer * amp
        total += amp
        amp *= 0.55
    return acc / total


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def cloud(name, w, h, seed, profile, lo, hi, opacity=1.0):
    n = fbm(w, h, 7, seed)
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    density = n * profile(y)
    alpha = smooth(density, lo, hi) * opacity
    # Light from above: brighter where density rises toward the top edge.
    shade = 0.78 + 0.22 * smooth(fbm(w, h, 5, seed + 7), 0.3, 0.75) * (1 - y * 0.6)
    rgb = np.stack([shade * 238, shade * 241, shade * 244], -1)  # cool white
    rgba = np.dstack([rgb, alpha * 255]).clip(0, 255).astype(np.uint8)
    path = os.path.join(OUT, f"{name}.webp")
    Image.fromarray(rgba, "RGBA").save(path, "WEBP", quality=80, method=6)
    print(name, f"{os.path.getsize(path) // 1024} KB")


# Dense bank rising from the bottom (used for the full-screen cloud wipe).
cloud("bank", 2400, 1200, 11, lambda y: 0.45 + 1.4 * y, 0.38, 0.62)
# Mid-height wisps drifting across the mountains.
cloud("wisp", 2400, 800, 23, lambda y: 0.3 + 0.9 * np.exp(-((y - 0.5) ** 2) / 0.06), 0.4, 0.68, 0.85)
# Thin full-frame veil for atmospheric depth.
cloud("veil", 2000, 1000, 37, lambda y: 0.8 + 0.4 * y, 0.32, 0.75, 0.5)
