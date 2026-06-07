"""
オープニング用の個別素材を処理する。

- logo / credit: 彩度の高いマーク。背景色との距離でなめらかにアルファを作り透過切り抜き。
- character: 白×白で切り抜きが難しいため、背景は残したまま余白だけトリミング。
  （表示側でページ背景をこの画像の背景色に合わせ、縁を見えなくする）

使い方:
    PYTHONPATH=.pytools python3 okme-demo/scripts/crop_opening.py
"""

import math
from PIL import Image, ImageFilter

ASSET = "/Users/imaisaki/.cursor/projects/Users-imaisaki-Documents-New-PJ-card-app/assets"
OUT = "okme-demo/public/images"

SRC_CHAR = f"{ASSET}/__________2026-06-07_9.51.28-5c0cf770-594b-4fa2-ac07-1615a95b21e2.png"
SRC_LOGO = f"{ASSET}/__________2026-06-07_9.51.34-37f3a394-b894-4de7-840d-35ca872dad09.png"
SRC_CREDIT = f"{ASSET}/__________2026-06-07_9.51.42-d6bdca74-6341-4c6c-b8cf-e4d500773005.png"


def corner_bg(im):
    w, h = im.size
    pts = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    rs = [im.getpixel(p) for p in pts]
    n = len(rs)
    return tuple(sum(c[i] for c in rs) // n for i in range(3))


def dist(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)


def autocrop_alpha(im):
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def colorkey(path, low=14, high=46):
    im = Image.open(path).convert("RGBA")
    bg = corner_bg(im)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            d = dist((r, g, b), bg)
            if d <= low:
                a = 0
            elif d >= high:
                a = 255
            else:
                a = int((d - low) / (high - low) * 255)
            px[x, y] = (r, g, b, a)
    # 薄いブラーでアルファのエッジをさらになめらかに
    r, g, b, a = im.split()
    a = a.filter(ImageFilter.GaussianBlur(0.5))
    im = Image.merge("RGBA", (r, g, b, a))
    return autocrop_alpha(im)


def trim_bg(path, pad=28, tol=20):
    """背景は残し、均一背景の余白だけをトリミング。"""
    im = Image.open(path).convert("RGB")
    bg = corner_bg(im)
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    # 高速化のため2pxステップで走査
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            if dist(px[x, y], bg) > tol:
                found = True
                if x < minx:
                    minx = x
                if x > maxx:
                    maxx = x
                if y < miny:
                    miny = y
                if y > maxy:
                    maxy = y
    if not found:
        return im
    minx = max(0, minx - pad)
    miny = max(0, miny - pad)
    maxx = min(w, maxx + pad)
    maxy = min(h, maxy + pad)
    return im.crop((minx, miny, maxx, maxy))


logo = colorkey(SRC_LOGO)
logo.save(f"{OUT}/okme-logo.png")
print("logo", logo.size)

credit = colorkey(SRC_CREDIT)
credit.save(f"{OUT}/okme-credit.png")
print("credit", credit.size)

char = trim_bg(SRC_CHAR)
char.save(f"{OUT}/okme-character-hero.png")
print("character-hero", char.size, "bg", corner_bg(Image.open(SRC_CHAR).convert("RGB")))
