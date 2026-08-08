#!/usr/bin/env python3
"""Angle of Incidence — plates.

Each page is one surface of the persistent-stage design, drawn as an
instrument plate. Rendered at 3x and downsampled for clean edges.
"""
from PIL import Image, ImageDraw, ImageFont
import math, os

F = "/Users/cagdasergenc/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/ac204bfe-6dc4-46ab-8e35-9223a81be04e/0cc29777-c6d5-4a15-918c-9abfb51fab44/skills/canvas-design/canvas-fonts"
OUT = "/Users/cagdasergenc/portfolio/.claude/worktrees/portfolio-redesign-a17340/docs/design"
os.makedirs(OUT, exist_ok=True)

S = 3                      # supersample
W, H = 1600, 2000          # final page
CW, CH = W * S, H * S

VOID  = (10, 10, 12)
TEXT  = (244, 244, 246)
DIM   = (155, 155, 166)
SEAM  = (255, 255, 255)
SPEC  = [(92, 164, 172), (196, 146, 72), (150, 82, 108)]   # dispersion only

def f(name, size):
    return ImageFont.truetype(os.path.join(F, name), size * S)

MONO   = lambda s: f("GeistMono-Regular.ttf", s)
MONO_B = lambda s: f("GeistMono-Bold.ttf", s)
DISP   = lambda s: f("Boldonse-Regular.ttf", s)

def page():
    im = Image.new("RGB", (CW, CH), VOID)
    return im, ImageDraw.Draw(im, "RGBA")

def layer(im):
    """A transparent layer to draw on when real alpha is needed. PIL's text
    ignores RGBA fill alpha when drawing straight onto an RGB image, so
    anything translucent has to be composited rather than drawn."""
    l = Image.new("RGBA", im.size, (0, 0, 0, 0))
    return l, ImageDraw.Draw(l)

def merge(im, l):
    im.paste(Image.alpha_composite(im.convert("RGBA"), l).convert("RGB"), (0, 0))

def save(im, n):
    im.resize((W, H), Image.LANCZOS).save(f"{OUT}/{n}", "PNG")
    print("wrote", n)

def track(d, txt, xy, font, fill, tracking=0.0, anchor="la"):
    """Letter-spaced text. PIL has no tracking, so it is drawn glyph by glyph."""
    x, y = xy
    if anchor.startswith("r"):
        total = sum(d.textlength(c, font=font) + tracking * S for c in txt) - tracking * S
        x -= total
    for c in txt:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + tracking * S
    return x

def ticks(d, x0, x1, y, step, h_short, h_tall, every, fill, fade_from=None):
    n = int((x1 - x0) // step)
    for i in range(n + 1):
        x = x0 + i * step
        h = h_tall if i % every == 0 else h_short
        a = 255
        if fade_from is not None and x > fade_from:
            a = max(0, int(255 * (1 - (x - fade_from) / (x1 - fade_from))))
        d.line([(x, y), (x, y - h)], fill=fill + (a,), width=S)

def seam(im, box, r, strength=210, angle=0.35):
    """The lit rim: a rounded-rect hairline whose brightness falls away around
    the form. Drawn as an outline on its own layer and masked by a directional
    gradient — the previous parametric version traced a superellipse that did
    not follow the rounded rect and left a stray oval on the plate."""
    l, ld = layer(im)
    ld.rounded_rectangle(box, radius=r, outline=SEAM + (255,), width=max(1, S))
    g = Image.new("L", im.size, 0)
    gd = ImageDraw.Draw(g)
    x0, y0, x1, y1 = box
    span = (x1 - x0) + (y1 - y0)
    for i in range(int(span)):
        t = i / span
        v = int(18 + strength * ((1 - t) ** 2.1))
        gd.line([(x0 + i, y0), (x0, y0 + i)], fill=max(0, min(255, v)), width=2)
    l.putalpha(Image.composite(l.getchannel("A"), Image.new("L", im.size, 0), l.getchannel("A")).point(lambda a: a))
    l.putalpha(Image.eval(Image.merge("L", [g]), lambda v: v).point(lambda v: v) if False else
               Image.composite(g, Image.new("L", im.size, 0), l.getchannel("A")))
    merge(im, l)

def caption(d, n, title, sub):
    y = CH - 150 * S
    d.line([(90 * S, y), (CW - 90 * S, y)], fill=(255, 255, 255, 26), width=S)
    track(d, n, (90 * S, y + 26 * S), MONO_B(11), SPEC[0], 3.2)
    track(d, title.upper(), (90 * S, y + 52 * S), MONO(11), TEXT, 3.2)
    track(d, sub.upper(), (CW - 90 * S, y + 52 * S), MONO(11), DIM, 3.2, anchor="ra")


# ─────────────────────────────────────────────────────────── PLATE I
# The stage: subject held, apparatus in the margin.
im, d = page()
M = 90 * S

# faint field grid — patient accumulation, not decoration
for gx in range(0, CW, 40 * S):
    d.line([(gx, 0), (gx, CH)], fill=(255, 255, 255, 6), width=1)
for gy in range(0, CH, 40 * S):
    d.line([(0, gy), (CW, gy)], fill=(255, 255, 255, 6), width=1)

stage = (M, 300 * S, CW - M, CH - 430 * S)
d.rounded_rectangle(stage, radius=26 * S, fill=(16, 16, 19))
seam(im, stage, 26 * S)

# the subject, set not photographed. On its own layer so the alpha is real.
gl, gd = layer(im)
track(gd, "POCKET", (CW // 2, 640 * S), DISP(78), (255, 255, 255, 30), 6, anchor="ra")
track(gd, "PEDIATRICS", (CW // 2, 760 * S), DISP(78), (255, 255, 255, 30), 6)
merge(im, gl)

# annotation capsule — title on glass, metadata on the ground
cap = (M + 46 * S, CH - 620 * S, M + 640 * S, CH - 530 * S)
d.rounded_rectangle(cap, radius=45 * S, fill=(12, 12, 14, 235))
seam(im, cap, 45 * S, strength=150)
track(d, "POCKET PEDIATRICS", (M + 86 * S, CH - 588 * S), MONO_B(15), TEXT, 2.4)

track(d, "I / III", (M + 46 * S, CH - 480 * S), MONO(11), DIM, 3.2)
track(d, "UX RESEARCH, PRODUCT DESIGN · 2025", (CW - M - 46 * S, CH - 480 * S), MONO(11), DIM, 3.2, anchor="ra")

ticks(d, M, CW - M, 250 * S, 9 * S, 6 * S, 13 * S, 5, (255, 255, 255), fade_from=CW * 0.55)
track(d, "PLATE I — THE SUBJECT DOES NOT SCROLL AWAY", (M, 180 * S), MONO(12), TEXT, 3.6)
caption(d, "01", "Stage", "subject held · apparatus in margin")
save(im, "angle-i-stage.png")


# ─────────────────────────────────────────────────────────── PLATE II
# Handover: one subject leaves the frame as the next arrives.
im, d = page()
track(d, "PLATE II — HANDOVER", (M, 180 * S), MONO(12), TEXT, 3.6)
ticks(d, M, CW - M, 250 * S, 9 * S, 6 * S, 13 * S, 5, (255, 255, 255), fade_from=CW * 0.55)

for i in range(3):
    t = i / 2
    y0 = (330 + i * 430) * S
    box = (M + i * 60 * S, y0, CW - M - (2 - i) * 60 * S, y0 + 340 * S)
    op = [235, 130, 40][i]
    d.rounded_rectangle(box, radius=24 * S, fill=(16, 16, 19, op))
    seam(im, box, 24 * S, strength=int(200 * (1 - i * 0.32)))
    track(d, ["I", "II", "III"][i], (M + i * 60 * S, y0 - 30 * S), MONO_B(12), SPEC[i], 3.2)
    track(d, ["POCKET PEDIATRICS", "EXE", "SUSTAINABILITY"][i],
          (M + i * 60 * S + 40 * S, y0 + 150 * S), MONO(14), (244, 244, 246, op), 3.0)

# the opacity curve, printed as an instrument reading
cx0, cx1 = M, CW - M
cy = CH - 470 * S
d.line([(cx0, cy), (cx1, cy)], fill=(255, 255, 255, 30), width=S)
pts = []
for i in range(220):
    t = i / 219
    v = max(0.0, 1 - abs(t * 3 - 1) * 1.6)
    pts.append((cx0 + t * (cx1 - cx0), cy - v * 120 * S))
d.line(pts, fill=SPEC[0] + (210,), width=2 * S)
track(d, "OPACITY / SCROLL PROGRESS", (cx0, cy + 26 * S), MONO(11), DIM, 3.2)
caption(d, "02", "Handover", "one leaves as the next arrives")
save(im, "angle-ii-handover.png")


# ─────────────────────────────────────────────────────────── PLATE III
# Viscosity: the response lags and settles.
im, d = page()
track(d, "PLATE III — VISCOSITY", (M, 180 * S), MONO(12), TEXT, 3.6)
ticks(d, M, CW - M, 250 * S, 9 * S, 6 * S, 13 * S, 5, (255, 255, 255), fade_from=CW * 0.55)

ox, oy = M, 700 * S
ow, oh = CW - 2 * M, 420 * S
d.line([(ox, oy + oh), (ox + ow, oy + oh)], fill=(255, 255, 255, 34), width=S)
d.line([(ox, oy), (ox, oy + oh)], fill=(255, 255, 255, 34), width=S)

# the step input — instant
d.line([(ox, oy + oh), (ox + ow * 0.18, oy + oh)], fill=(255, 255, 255, 70), width=S)
d.line([(ox + ow * 0.18, oy + oh), (ox + ow * 0.18, oy)], fill=(255, 255, 255, 70), width=S)
d.line([(ox + ow * 0.18, oy), (ox + ow, oy)], fill=(255, 255, 255, 70), width=S)
track(d, "INPUT — INSTANT", (ox + ow * 0.20, oy - 40 * S), MONO(11), DIM, 3.2)

# the damped response — lag and settle
pts = []
for i in range(600):
    t = i / 599
    if t < 0.18:
        v = 0.0
    else:
        v = 1 - math.exp(-5.5 * (t - 0.18) * 4.4)
    pts.append((ox + t * ow, oy + oh - v * oh))
d.line(pts, fill=SPEC[1] + (240,), width=3 * S)
track(d, "RESPONSE — λ 5.5 · SETTLES ≈700MS", (ox + ow * 0.34, oy + oh * 0.42), MONO(11), SPEC[1], 3.2)

for frac, lab in [(0.0, "0.500"), (0.25, "0.831"), (0.55, "0.959"), (0.95, "0.987")]:
    x = ox + (0.18 + frac * 0.8) * ow
    d.line([(x, oy + oh), (x, oy + oh + 14 * S)], fill=(255, 255, 255, 90), width=S)
    track(d, lab, (x, oy + oh + 26 * S), MONO(10), DIM, 2.4)

track(d, "A RESPONSE THAT ARRIVES INSTANTLY READS AS A SWITCH.", (M, CH - 620 * S), MONO(13), TEXT, 3.4)
track(d, "ONE THAT LAGS, AND SETTLES, READS AS A SUBSTANCE.", (M, CH - 580 * S), MONO(13), DIM, 3.4)
caption(d, "03", "Viscosity", "measured, not asserted")
save(im, "angle-iii-viscosity.png")


# ─────────────────────────────────────────────────────────── PLATE IV
# Dispersion: the rim is where the material declares itself.
im, d = page()
track(d, "PLATE IV — DISPERSION AT THE RIM", (M, 180 * S), MONO(12), TEXT, 3.6)
ticks(d, M, CW - M, 250 * S, 9 * S, 6 * S, 13 * S, 5, (255, 255, 255), fade_from=CW * 0.55)

cx, cy = CW // 2, CH // 2 - 60 * S
for k in range(46):
    t = k / 45
    r = (250 + t * 250) * S
    a = int(10 + 30 * (1 - t))
    d.ellipse([cx - r, cy - r * 0.42, cx + r, cy + r * 0.42], outline=(255, 255, 255, a), width=1)

cap = (cx - 470 * S, cy - 120 * S, cx + 470 * S, cy + 120 * S)
d.rounded_rectangle(cap, radius=120 * S, fill=(12, 12, 14, 240))
for i, col in enumerate(SPEC):
    off = (i - 1) * 5 * S
    b = (cap[0] + off, cap[1] + off, cap[2] + off, cap[3] + off)
    d.rounded_rectangle(b, radius=120 * S, outline=col + (120,), width=S)
seam(im, cap, 120 * S, strength=235)

track(d, "REFRACTION IS NOT BLUR", (cx, cy - 12 * S), MONO_B(17), TEXT, 4.0, anchor="ra")
track(d, "REFRACTION IS NOT BLUR", (cx, cy - 12 * S), MONO_B(17), TEXT, 4.0)

for i, (col, lab) in enumerate(zip(SPEC, ["λ 610 R", "λ 550 G", "λ 470 B"])):
    y = CH - 560 * S + i * 34 * S
    d.line([(M, y), (M + 60 * S, y)], fill=col + (230,), width=2 * S)
    track(d, lab, (M + 76 * S, y - 8 * S), MONO(11), DIM, 3.0)

track(d, "A BLUR DESTROYS EDGES. REFRACTION MOVES THEM.", (CW - M, CH - 500 * S), MONO(12), TEXT, 3.4, anchor="ra")
caption(d, "04", "Dispersion", "the rim declares the material")
save(im, "angle-iv-dispersion.png")

print("done")
