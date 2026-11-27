#!/usr/bin/env python3
"""Tạo ảnh bìa tối giản theo phong cách Hugh Do cho một bài viết.

Dùng:  python3 tools/make-cover.py content/posts/<file>.md
Kết quả: public/images/covers/<slug>.webp (2400x1029, tỉ lệ 21:9),
và tự điền dòng `cover:` vào frontmatter nếu bài chưa có cover.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 2400, 1029
BG = (255, 255, 255)
FG = (10, 10, 10)
MUTED = (107, 107, 107)
FIELD = (210, 210, 207)
SOFT = (242, 242, 240)
RED = (217, 45, 32)
CATS = {"game": "Game", "football": "Football", "design": "Design", "more": "& More"}

FONT_DIRS = ["/usr/share/fonts/opentype/inter", "/usr/share/fonts/truetype/inter"]


def font(weight, size):
    names = {"light": "Inter-Light.otf", "regular": "Inter-Regular.otf", "semibold": "Inter-SemiBold.otf"}
    for d in FONT_DIRS:
        p = Path(d) / names[weight]
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.truetype("DejaVuSans.ttf", size)


def frontmatter(src):
    m = re.match(r"^---\n(.*?)\n---\n", src, re.S)
    data = {}
    if m:
        for line in m.group(1).splitlines():
            kv = re.match(r"^(\w+):\s*(.*)$", line)
            if kv:
                v = kv.group(2).strip()
                if len(v) >= 2 and v[0] == v[-1] and v[0] in "'\"":
                    v = v[1:-1].replace("''", "'")
                data[kv.group(1)] = v
    return m, data


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_logo_mark(d, x, y, s, color):
    """Lục giác HD trừu tượng (nét mảnh) làm hoạ tiết nền."""
    import math
    pts = [(x + s * math.cos(math.radians(60 * i - 30)), y + s * math.sin(math.radians(60 * i - 30))) for i in range(6)]
    d.polygon(pts, fill=color)


def make(post_path):
    post = Path(post_path)
    src = post.read_text(encoding="utf-8")
    m, data = frontmatter(src)
    title = data.get("title", post.stem)
    cat = CATS.get(data.get("category", "more"), "& More")
    slug = post.stem[11:] if re.match(r"\d{4}-\d{2}-\d{2}-", post.stem) else post.stem

    # Tách "Series (Phần N): Tiêu đề phụ" thành dòng phụ + tiêu đề chính
    eyebrow, main = "", title
    sm = re.match(r"^(.*?\(Phần \d+\))\s*:\s*(.+)$", title) or re.match(r"^(.*?)\s*:\s*(.+)$", title)
    if sm and len(sm.group(1)) < 60:
        eyebrow, main = sm.group(1), sm.group(2)

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Hoạ tiết nền: lục giác lớn rất nhạt bên phải
    draw_logo_mark(d, W - 330, H / 2 + 40, 560, SOFT)

    pad = 170
    # Dòng chuyên mục: gạch đỏ + tên chuyên mục
    d.rectangle([pad, 200, pad + 64, 206], fill=RED)
    d.text((pad + 90, 180), cat.upper(), font=font("semibold", 40), fill=RED)

    y = 300
    if eyebrow:
        d.text((pad, y), eyebrow, font=font("regular", 52), fill=MUTED)
        y += 100

    max_w = W - pad * 2 - 380
    size = 132
    while True:
        f = font("light", size)
        lines = wrap(d, main, f, max_w)
        if len(lines) <= 3 or size <= 84:
            break
        size -= 8
    for ln in lines[:4]:
        d.text((pad, y), ln, font=f, fill=FG)
        y += int(size * 1.18)

    # Đường kẻ + chữ ký "hughdo" kiểu con trỏ đỏ
    d.line([(pad, H - 150), (W - pad, H - 150)], fill=FIELD, width=3)
    bf = font("semibold", 34)
    bw = d.textlength("hughdo", font=bf)
    d.rounded_rectangle([pad, H - 118, pad + bw + 48, H - 58], radius=12, fill=RED)
    d.text((pad + 24, H - 112), "hughdo", font=bf, fill=(255, 255, 255))

    out_dir = ROOT / "public/images/covers"
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{slug}.webp"
    img.save(out, "WEBP", quality=88)
    rel = f"/images/covers/{slug}.webp"

    if m and "cover" not in data:
        fm = m.group(1) + f"\ncover: {rel}"
        src = src.replace(m.group(0), f"---\n{fm}\n---\n", 1)
        post.write_text(src, encoding="utf-8")
    print(rel)


if __name__ == "__main__":
    for p in sys.argv[1:]:
        make(p)
