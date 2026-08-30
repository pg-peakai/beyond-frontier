"""
Extends the capture posters vertically without distorting them.

Rather than scaling (which stretches type and hardware) this inserts new pixel
rows at the flattest seams — rows whose neighbours are nearly identical — and
blends each inserted row between its neighbours. Detail-heavy bands (the
headline, the data log, the barcode) score high and are never touched.

Run: python scripts/elongate-cards.mjs.py <target-aspect>
"""
import sys, io
from pathlib import Path
import numpy as np
from PIL import Image

TARGET = float(sys.argv[1]) if len(sys.argv) > 1 else 0.55
SRC = Path("public/cards")
# Keep the frame's own top and bottom edges out of the insertion range.
MARGIN = 0.06
MIN_GAP = 2


def row_energy(a):
    d = np.abs(np.diff(a.astype(np.int16), axis=0)).mean(axis=(1, 2))
    return np.concatenate([d, d[-1:]])


def elongate(path, target_aspect):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im)
    h, w = a.shape[:2]
    new_h = int(round(w / target_aspect))
    add = new_h - h
    if add <= 0:
        return None

    e = row_energy(a)
    lo, hi = int(h * MARGIN), int(h * (1 - MARGIN))
    order = [i for i in np.argsort(e) if lo <= i < hi]

    counts = np.zeros(h, dtype=int)
    used = np.zeros(h, dtype=bool)
    placed = 0
    # first pass: spread single insertions across the flattest seams
    for i in order:
        if placed >= add:
            break
        if used[max(0, i - MIN_GAP):i + MIN_GAP + 1].any():
            continue
        counts[i] += 1
        used[i] = True
        placed += 1
    # second pass: if the image is too detailed to absorb it in one go, double up
    # on the flattest seams already chosen
    k = 0
    while placed < add:
        i = order[k % len(order)]
        counts[i] += 1
        placed += 1
        k += 1

    out = np.empty((new_h, w, 3), dtype=np.uint8)
    y = 0
    for i in range(h):
        out[y] = a[i]
        y += 1
        n = counts[i]
        if n:
            nxt = a[min(i + 1, h - 1)].astype(np.float32)
            cur = a[i].astype(np.float32)
            for j in range(n):
                t = (j + 1) / (n + 1)
                out[y] = (cur * (1 - t) + nxt * t).round().astype(np.uint8)
                y += 1

    return Image.fromarray(out), h, new_h, add, float(e[order[:add]].mean()), float(e.mean())


for p in sorted(SRC.glob("bf-00*.png")):
    if p.stem.endswith("-tall"):
        continue
    res = elongate(p, TARGET)
    if not res:
        print(f"{p.name}: already >= target")
        continue
    im, h, new_h, add, seam_e, avg_e = res
    out = p.with_name(p.stem + "-tall.png")
    im.save(out, optimize=True)
    print(f"{p.name}: {h} -> {new_h} (+{add})  seam energy {seam_e:.2f} vs image avg {avg_e:.2f}")
