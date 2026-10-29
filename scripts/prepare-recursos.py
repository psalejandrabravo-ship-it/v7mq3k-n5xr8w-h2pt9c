"""Genera derivados con el negro de fondo en transparencia.

No modifica public/recursos/originales.
Uso: python3 scripts/prepare-recursos.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "recursos" / "originales"
DEST = ROOT / "public" / "recursos" / "derivados"

JOBS = [
    ("84070.png", "logo-color.png", 10, 26),
    ("84071.png", "logo-oscuro.png", 8, 18),
    ("84072.png", "logo-blanco.png", 10, 26),
    ("111242.png", "cofre-cerrado.png", 12, 28),
    ("111243.png", "cofre-abierto.png", 12, 28),
    ("111231.png", "pirata.png", 12, 30),
]


def key_black(path: Path, dest: Path, lo: int, hi: int) -> None:
    rgb = np.array(Image.open(path).convert("RGB")).astype(np.float32)
    alpha = np.clip((rgb.max(axis=2) - lo) / (hi - lo), 0, 1)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(dest)


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    for source, target, lo, hi in JOBS:
        key_black(SRC / source, DEST / target, lo, hi)
        print(target)


if __name__ == "__main__":
    main()
