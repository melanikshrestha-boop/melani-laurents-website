#!/usr/bin/env python3
"""Rebuild every tab file from the FULL square Eren still.

Scale only — never face-crop. A 16px face crop reads as ©.
Source: public/icon-eren.png (shoulders + bun).
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "icon-eren.png"

if not SRC.is_file():
    raise SystemExit(f"missing {SRC}")

# Full square. Do not crop.
full = Image.open(SRC).convert("RGBA")
if full.size[0] != full.size[1]:
    raise SystemExit(f"source is {full.size}, not square")


def scaled(size: int) -> Image.Image:
    return full.resize((size, size), Image.Resampling.LANCZOS)


def save_png(img: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format="PNG", optimize=True)


stay = scaled(256)
save_png(stay, ROOT / "public" / "eren-stay14.png")
save_png(stay, ROOT / "public" / "icon.png")
save_png(stay, ROOT / "src" / "app" / "icon.png")
save_png(stay, ROOT / "public" / "tab-eren.png")
save_png(stay, ROOT / "public" / "stay-eren.png")
save_png(scaled(192), ROOT / "public" / "icon-192.png")
save_png(scaled(180), ROOT / "public" / "apple-icon.png")
save_png(scaled(180), ROOT / "src" / "app" / "apple-icon.png")

# 16+32+48 from the same full square. Chrome uses these for the tab.
ico_public = ROOT / "public" / "favicon.ico"
ico_app = ROOT / "src" / "app" / "favicon.ico"
stay.save(ico_public, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
ico_app.write_bytes(ico_public.read_bytes())

print("stay14", (ROOT / "public" / "eren-stay14.png").stat().st_size)
print("ico", ico_public.stat().st_size)
print("icon.png", (ROOT / "src" / "app" / "icon.png").stat().st_size)
