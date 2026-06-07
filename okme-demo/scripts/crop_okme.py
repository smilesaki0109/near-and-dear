"""
提供画像（黒背景）から OKme! のロゴ・キャラクター・メインビジュアルを切り出し、
背景を透過して public/images/ に保存するスクリプト。

使い方:
    python3 -m pip install --target=.pytools Pillow   # 初回のみ
    PYTHONPATH=.pytools python3 okme-demo/scripts/crop_okme.py <source.png> okme-demo/public/images

キャラクターはエッジのジャギーを避けるため:
- 縁から繋がった黒だけをフラッドフィルで背景判定（内部のARグラス等の濃色は保持）
- 背景画素の RGB を淡い背景色に置換（ダウンスケール時の暗いフチを防ぐ）
- 2倍に LANCZOS アップスケールしてアルファをアンチエイリアス化（なめらかな輪郭）
"""

import sys
from collections import deque
from PIL import Image, ImageFilter

SRC = sys.argv[1]
OUT = sys.argv[2]  # output dir

# 透過エッジがにじむ先の色（サイト背景の薄いブルーグレーに合わせる）
EDGE_BG = (239, 244, 251)

img = Image.open(SRC).convert("RGBA")
W, H = img.size
print("source size", W, H)


def lum(px):
    return max(px[0], px[1], px[2])


def autocrop(im):
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def background_mask(region, thr):
    """縁から繋がった暗部を背景(True)とするマスクを返す。"""
    px = region.load()
    w, h = region.size
    bg = [[False] * w for _ in range(h)]
    q = deque()

    def consider(x, y):
        if 0 <= x < w and 0 <= y < h and not bg[y][x] and lum(px[x, y]) < thr:
            bg[y][x] = True
            q.append((x, y))

    for x in range(w):
        consider(x, 0)
        consider(x, h - 1)
    for y in range(h):
        consider(0, y)
        consider(w - 1, y)

    while q:
        x, y = q.popleft()
        consider(x + 1, y)
        consider(x - 1, y)
        consider(x, y + 1)
        consider(x, y - 1)
    return bg


def cutout_smooth(region, thr=112, scale=2):
    """なめらかな透過キャラクターを生成。"""
    region = region.convert("RGBA")
    px = region.load()
    w, h = region.size
    bg = background_mask(region, thr)

    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            if bg[y][x]:
                ap[x, y] = 0
                # 背景の暗い色は残さず、淡い背景色へ（暗フチ防止）
                r, g, b, _ = px[x, y]
                px[x, y] = (EDGE_BG[0], EDGE_BG[1], EDGE_BG[2], 0)

    region.putalpha(alpha)

    # 高解像度化（LANCZOS）→ 2値アルファがアンチエイリアスされ輪郭がなめらかに
    region = region.resize((w * scale, h * scale), Image.LANCZOS)
    # ごく軽いブラーで階段状を解消
    r, g, b, a = region.split()
    a = a.filter(ImageFilter.GaussianBlur(0.6))
    region = Image.merge("RGBA", (r, g, b, a))
    return autocrop(region)


def cutout_threshold(region, thr=45):
    """ロゴ用：全体しきい値で黒を透過（暗い正規パーツが無いため安全）。"""
    region = region.convert("RGBA")
    px = region.load()
    w, h = region.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if max(r, g, b) < thr:
                px[x, y] = (r, g, b, 0)
    return autocrop(region)


# (left, top, right, bottom, mode)
regions = {
    "okme-logo": (250, 95, 760, 235, "threshold"),
    "okme-character": (70, 305, 430, 655, "smooth"),
    "okme-hero": (440, 312, 1012, 666, "none"),
}

for name, (l, t, r, b, mode) in regions.items():
    crop = img.crop((l, t, r, b))
    if mode == "threshold":
        crop = cutout_threshold(crop)
    elif mode == "smooth":
        crop = cutout_smooth(crop)
    out = f"{OUT}/{name}.png"
    crop.save(out)
    print(name, "->", crop.size, out)
