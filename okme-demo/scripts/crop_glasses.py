"""
黒背景のARメガネ製品画像から、メガネだけを切り抜く。
- 背景は純黒。フレームも黒いため、輝度キーではなく
  「画像の縁から繋がっている暗い領域（=背景）」を塗りつぶして透過する。
- これによりフレーム内部の黒は保持しつつ、周囲の黒背景のみ除去できる。
- アルファを軽くぼかして輪郭を滑らかにし、透明余白をトリムして保存。
"""

from PIL import Image, ImageFilter
from collections import deque

SRC = "/Users/imaisaki/.cursor/projects/Users-imaisaki-Documents-New-PJ-card-app/assets/image-32c74d55-223d-4110-aa4b-fa70ab62ab95.png"
OUT = "/Users/imaisaki/Documents/New PJ card app/okme-demo/public/images/ar-glasses.png"

# これ以下の輝度を「背景候補（純黒）」とみなす。
# 高くするとフレームの黒まで食うため低め。背景の粒ノイズはメディアン+最大連結領域で除去する。
BG_LUM = 26


def luminance(r, g, b):
    return 0.299 * r + 0.587 * g + 0.114 * b


def main():
    im = Image.open(SRC).convert("RGB")
    w, h = im.size
    px = im.load()

    # 暗いか否かのフラグ
    dark = bytearray(w * h)
    for y in range(h):
        base = y * w
        for x in range(w):
            r, g, b = px[x, y]
            if luminance(r, g, b) <= BG_LUM:
                dark[base + x] = 1

    # 縁から繋がる暗い領域 = 背景。BFSで塗りつぶす（8近傍）。
    bg = bytearray(w * h)
    q = deque()

    def seed(x, y):
        i = y * w + x
        if dark[i] and not bg[i]:
            bg[i] = 1
            q.append(i)

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        i = q.popleft()
        cx = i % w
        cy = i // w
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nx = cx + dx
                ny = cy + dy
                if 0 <= nx < w and 0 <= ny < h:
                    j = ny * w + nx
                    if dark[j] and not bg[j]:
                        bg[j] = 1
                        q.append(j)

    # 前景マスク（背景=0 / 前景=255）を作り、メディアンで背景の粒ノイズを除去
    mask = Image.new("L", (w, h), 0)
    mp = mask.load()
    for y in range(h):
        base = y * w
        for x in range(w):
            if not bg[base + x]:
                mp[x, y] = 255
    mask = mask.filter(ImageFilter.MedianFilter(5))

    # メディアン後マスクの最大連結領域だけを残す（飛び散ったノイズ片を除去）
    mpx = mask.load()
    fg = bytearray(w * h)
    for y in range(h):
        base = y * w
        for x in range(w):
            if mpx[x, y] >= 128:
                fg[base + x] = 1

    keep = bytearray(w * h)
    visited = bytearray(w * h)
    best = []
    for sy in range(h):
        for sx in range(w):
            si = sy * w + sx
            if not fg[si] or visited[si]:
                continue
            comp = []
            stack = [si]
            visited[si] = 1
            while stack:
                i = stack.pop()
                comp.append(i)
                cx = i % w
                cy = i // w
                for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                    nx = cx + dx
                    ny = cy + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        j = ny * w + nx
                        if fg[j] and not visited[j]:
                            visited[j] = 1
                            stack.append(j)
            if len(comp) > len(best):
                best = comp
    for i in best:
        keep[i] = 1

    # アルファ（前景=255 / それ以外=0）
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        base = y * w
        for x in range(w):
            if keep[base + x]:
                r, g, b = px[x, y]
                op[x, y] = (r, g, b, 255)

    # 輪郭を1px収縮してギザギザを除去 → 軽くぼかして滑らかに
    rgb = out.convert("RGB")
    a = (
        out.getchannel("A")
        .filter(ImageFilter.MinFilter(3))
        .filter(ImageFilter.GaussianBlur(0.8))
    )
    out = Image.merge("RGBA", (*rgb.split(), a))

    # 透明余白をトリム
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)

    out.save(OUT)
    print("saved", OUT, out.size)


if __name__ == "__main__":
    main()
