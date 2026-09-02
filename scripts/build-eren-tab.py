#!/usr/bin/env python3
"""Rebuild every tab file from the FULL square Eren still.

Scale only — never face-crop. A 16px face crop reads as ©.
Source: public/icon-eren.png (shoulders + bun).

public/favicon.ico only (16+32+48 RGBA PNG-in-ICO).
Do NOT write src/app/favicon.ico — Next hashes it (`?favicon.*.ico`) and
Chrome prefers that 48px ICO, which is how the gold C comes back.
RGB PNG-in-ICO 500s Turbopack — keep RGBA.
"""
import io
import struct
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "icon-eren.png"
STAY = "eren-hold16.png"

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
    img.convert("RGBA").save(dest, format="PNG", optimize=True)


def png_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.convert("RGBA").save(buf, format="PNG")
    return buf.getvalue()


def write_ico(path: Path, sizes: tuple[int, ...]) -> None:
    """PNG-in-ICO, RGBA frames. Next/Turbopack rejects RGB PNG ICO."""
    frames = [png_bytes(scaled(s)) for s in sizes]
    header = struct.pack("<HHH", 0, 1, len(frames))
    offset = 6 + 16 * len(frames)
    directory = b""
    body = b""
    for size, data in zip(sizes, frames):
        w = 0 if size == 256 else size
        directory += struct.pack("<BBBBHHII", w, w, 0, 0, 1, 32, len(data), offset)
        body += data
        offset += len(data)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(header + directory + body)


stay = scaled(256)
save_png(stay, ROOT / "public" / STAY)
save_png(stay, ROOT / "public" / "icon.png")
save_png(stay, ROOT / "src" / "app" / "icon.png")
save_png(stay, ROOT / "public" / "tab-eren.png")
save_png(stay, ROOT / "public" / "stay-eren.png")
save_png(scaled(192), ROOT / "public" / "icon-192.png")
save_png(scaled(180), ROOT / "public" / "apple-icon.png")
save_png(scaled(180), ROOT / "src" / "app" / "apple-icon.png")

# 16+32+48 from the same full square. Public only — never src/app.
write_ico(ROOT / "public" / "favicon.ico", (16, 32, 48))
app_ico = ROOT / "src" / "app" / "favicon.ico"
if app_ico.exists():
    app_ico.unlink()

print("stay", STAY, (ROOT / "public" / STAY).stat().st_size)
print("public.ico", (ROOT / "public" / "favicon.ico").stat().st_size)
print("icon.png", (ROOT / "src" / "app" / "icon.png").stat().st_size)
