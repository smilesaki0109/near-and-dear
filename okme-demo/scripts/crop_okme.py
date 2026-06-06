"""
提供画像（黒背景）から OKme! のロゴ・キャラクター・メインビジュアルを切り出し、
背景を透過して public/images/ に保存するスクリプト。

使い方:
    python3 -m pip install --target=.pytools Pillow   # 初回のみ
    PYTHONPATH=.pytools python3 okme-demo/scripts/crop_okme.py <source.png> okme-demo/public/images

- ロゴ: 全体しきい値で黒を透過（暗い正規パーツが無いため安全）
- キャラ: 縁から繋がった黒のみ透過（内部の濃い色＝ARグラスを保持）
- ヒーロー: そのまま切り出し（黒背景は暗色パネル上で使用）
領域座標は元画像 1024x682 を前提にした概算値。差し替え時は調整してください。
"""

import sys
from collections import deque
from PIL import Image

SRC = sys.argv[1]
OUT = sys.argv[2]  # output dir

img = Image.open(SRC).convert("RGBA")
W, H = img.size
print("source size", W, H)


def lum(px):
    return max(px[0], px[1], px[2])


def autocrop(im):
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def remove_bg_threshold(region, thr=45):
    px = region.load()
    w, h = region.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if max(r, g, b) < thr:
                px[x, y] = (r, g, b, 0)
    return autocrop(region)


def remove_bg_floodfill(region, thr=72):
    region = region.copy()
    px = region.load()
    w, h = region.size
    visited = [[False] * w for _ in range(h)]
    q = deque()

    def consider(x, y):
        if 0 <= x < w and 0 <= y < h and not visited[y][x]:
            if lum(px[x, y]) < thr:
                visited[y][x] = True
                q.append((x, y))

    for x in range(w):
        consider(x, 0)
        consider(x, h - 1)
    for y in range(h):
        consider(0, y)
        consider(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
        consider(x + 1, y)
        consider(x - 1, y)
        consider(x, y + 1)
        consider(x, y - 1)

    return autocrop(region)


# (left, top, right, bottom, mode)
regions = {
    "okme-logo": (250, 95, 760, 235, "threshold"),
    "okme-character": (70, 305, 430, 655, "flood"),
    "okme-hero": (440, 312, 1012, 666, "none"),
}

for name, (l, t, r, b, mode) in regions.items():
    crop = img.crop((l, t, r, b))
    if mode == "threshold":
        crop = remove_bg_threshold(crop)
    elif mode == "flood":
        crop = remove_bg_floodfill(crop)
    out = f"{OUT}/{name}.png"
    crop.save(out)
    print(name, "->", crop.size, out)
