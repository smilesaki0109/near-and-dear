"""
気分選択用キャラクター画像の背景（薄い青グレー）を透過し、
キャラクターだけが浮いて見えるPNGを生成する。

- 四隅から推定した背景色に近い色を、外周からのフラッドフィルで透過。
  （連結成分で判定するので、キャラ内部の白い雲は消えない）
- 縁に残る背景色のフリンジ（"縁"）を1px収縮で除去し、軽くぼかして馴染ませる。
- 中身でトリミングして余白を最小化（表示時に大きく見せられる）。
"""

import os
from collections import deque

from PIL import Image, ImageFilter

NAMES = ["energetic", "tired", "focus", "anxious"]
SRC_DIR = (
    "/Users/imaisaki/.cursor/projects/"
    "Users-imaisaki-Documents-New-PJ-card-app/assets"
)
OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "images",
    "moods",
)

TOL = 30  # 背景とみなす色距離のしきい値
PAD = 10  # トリミング後の余白(px)


def color_dist(a, b):
    return (
        (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
    ) ** 0.5


def remove_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = (
        sum(c[0] for c in corners) // 4,
        sum(c[1] for c in corners) // 4,
        sum(c[2] for c in corners) // 4,
    )

    visited = bytearray(w * h)
    is_bg = bytearray(w * h)
    stack = deque()

    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))

    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h:
            continue
        idx = y * w + x
        if visited[idx]:
            continue
        visited[idx] = 1
        if color_dist(px[x, y], bg) > TOL:
            continue
        is_bg[idx] = 1
        stack.append((x + 1, y))
        stack.append((x - 1, y))
        stack.append((x, y + 1))
        stack.append((x, y - 1))

    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        row = y * w
        for x in range(w):
            if is_bg[row + x]:
                ap[x, y] = 0

    # 縁に残る「背景色の半透明フチ」を除去する。
    # 2px収縮してキャラ内側まで切り込む → その後に軽くぼかすことで、
    # 半透明エッジのRGBが背景青ではなくキャラ色になり、青い輪郭が出ない。
    alpha = alpha.filter(ImageFilter.MinFilter(5))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    out = img.copy()
    out.putalpha(alpha)
    return out


def trim(img: Image.Image) -> Image.Image:
    bbox = img.split()[3].point(lambda a: 255 if a > 12 else 0).getbbox()
    if not bbox:
        return img
    left = max(0, bbox[0] - PAD)
    top = max(0, bbox[1] - PAD)
    right = min(img.width, bbox[2] + PAD)
    bottom = min(img.height, bbox[3] + PAD)
    return img.crop((left, top, right, bottom))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for n in NAMES:
        src = os.path.join(SRC_DIR, f"mood-{n}.png")
        dst = os.path.join(OUT_DIR, f"mood-{n}.png")
        img = Image.open(src)
        out = trim(remove_bg(img))
        out.save(dst)
        print(f"saved {dst} -> {out.size}")


if __name__ == "__main__":
    main()
