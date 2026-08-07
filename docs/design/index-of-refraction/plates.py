#!/usr/bin/env python3
"""Index of Refraction — four plates. Second pass.

Fixes from the first pass:
  - ASCII only. The subscript/greek glyphs rendered as .notdef boxes.
    Angles are labelled i and r, which is the standard notation on an
    optical plate anyway.
  - The ray now behaves. It enters the medium, bends toward the normal,
    traverses, and disperses on exit. Previously it passed straight through,
    which is wrong on a plate whose entire subject is refraction.
  - Every label given clearance. Nothing overlaps anything.
  - The bottom matter is set in three separated registers instead of one
    crowded baseline.

Drawn at 2x and downsampled; PIL does not antialias primitives.
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFont

FONTS = "/Users/cagdasergenc/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/ac204bfe-6dc4-46ab-8e35-9223a81be04e/0cc29777-c6d5-4a15-918c-9abfb51fab44/skills/canvas-design/canvas-fonts"
OUT = "/Users/cagdasergenc/portfolio/.claude/worktrees/portfolio-redesign-a17340/docs/design/index-of-refraction"
os.makedirs(OUT, exist_ok=True)

S = 2
W, H = 1600, 2100
CW, CH = W * S, H * S

VOID    = (10, 10, 12)
INK     = (244, 244, 246)
DIM     = (150, 150, 161)
HAIR    = (84, 84, 94)
FAINT   = (52, 52, 60)
GHOST   = (30, 30, 36)
CYAN    = (92, 164, 172)
AMBER   = (196, 146, 72)
MAGENTA = (150, 82, 108)

def F(n, s): return ImageFont.truetype(os.path.join(FONTS, n), int(s * S))
JURA  = lambda s: F("Jura-Light.ttf", s)
JURAM = lambda s: F("Jura-Medium.ttf", s)
MONO  = lambda s: F("IBMPlexMono-Regular.ttf", s)
MONOB = lambda s: F("IBMPlexMono-Bold.ttf", s)
DISP  = lambda s: F("Italiana-Regular.ttf", s)

def tw(d, text, font, track):
    return (sum(d.textlength(c, font=font) + track * S for c in text) - track * S) / S

def tr(d, xy, text, font, fill, track=0, center=False, right=False):
    x, y = xy[0] * S, xy[1] * S
    width = tw(d, text, font, track) * S
    if center: x -= width / 2
    if right:  x -= width
    for c in text:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + track * S

def grain(img, amt=6):
    px = img.load(); rnd = random.Random(7); w, h = img.size
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            n = rnd.randint(-amt, amt)
            r, g, b = px[x, y]
            px[x, y] = (max(0, min(255, r+n)), max(0, min(255, g+n)), max(0, min(255, b+n)))
    return img

def finish(img, name):
    img = grain(img.resize((W, H), Image.LANCZOS))
    p = os.path.join(OUT, name); img.save(p, "PNG", optimize=True); print("wrote", p); return p

M = 150
BASE_RULE = H - M - 96      # a single rule the bottom matter hangs from

def apparatus(d, plate, title, formula, folio):
    t = 26
    for cx, cy, dx, dy in [(M,M,1,1),(W-M,M,-1,1),(M,H-M,1,-1),(W-M,H-M,-1,-1)]:
        d.line([(cx*S,cy*S),((cx+dx*t)*S,cy*S)], fill=FAINT, width=S)
        d.line([(cx*S,cy*S),(cx*S,(cy+dy*t)*S)], fill=FAINT, width=S)
    tr(d, (M, M-48), plate, MONO(13), DIM, 3.2)
    tr(d, (W-M, M-46), title, JURAM(15), DIM, 5.5, right=True)
    # index rail, right
    for i in range(41):
        y = M + i*((H-2*M)/40); lg = (i % 5 == 0)
        d.line([((W-M-(13 if lg else 6))*S, y*S), ((W-M)*S, y*S)], fill=HAIR if lg else FAINT, width=S)
    # bottom register: rule, then folio left / formula right, well clear of it
    d.line([(M*S, BASE_RULE*S), ((W-M)*S, BASE_RULE*S)], fill=GHOST, width=S)
    tr(d, (M, BASE_RULE+22), folio, MONO(12), FAINT, 3.2)
    tr(d, (W-M, BASE_RULE+22), formula, MONO(12), FAINT, 2.6, right=True)

def field(d, x0, y0, x1, y1, n, anomaly=None, color=FAINT):
    """Ruled accumulation. The anomaly shortens a run rather than bulging it —
    a bulge read as a rendering glitch in the first pass."""
    for i in range(n):
        t = i/(n-1); y = y0 + (y1-y0)*t
        cut = 0; c = color
        if anomaly is not None and abs(i-anomaly) <= 7:
            k = 1 - abs(i-anomaly)/7
            cut = (x1-x0) * 0.20 * k*k
            if abs(i-anomaly) <= 1: c = HAIR
        d.line([(x0*S, y*S), ((x1-cut)*S, y*S)], fill=c, width=S)

# ── PLATE I ──────────────────────────────────────────────────────────────────
def plate_1():
    img = Image.new("RGB",(CW,CH),VOID); d = ImageDraw.Draw(img)
    apparatus(d, "PLATE  I", "BOUNDARY", "n1 sin i  =  n2 sin r", "01 / 04")

    cx, cy = W/2, 940
    rw, rh = 460, 172
    top, bot = cy-rh, cy+rh
    d.rounded_rectangle([(cx-rw)*S, top*S, (cx+rw)*S, bot*S], radius=int(rh)*S, outline=HAIR, width=S)
    d.rounded_rectangle([(cx-rw+4)*S, (top+4)*S, (cx+rw-4)*S, (bot-4)*S],
                        radius=int(rh-4)*S, outline=(38,38,44), width=S)

    ex, ey = cx-250, top                      # entry on the upper boundary
    i_ang, r_ang = math.radians(41), math.radians(25)   # incidence, refraction

    # normal through the entry point
    d.line([(ex*S,(ey-190)*S),(ex*S,(ey+205)*S)], fill=GHOST, width=S)
    # incident ray
    L = 470
    d.line([((ex-L*math.sin(i_ang))*S,(ey-L*math.cos(i_ang))*S),(ex*S,ey*S)], fill=DIM, width=S)
    # inside the medium — bent toward the normal
    span = bot-top
    xx = ex + span*math.tan(r_ang)
    d.line([(ex*S,ey*S),(xx*S,bot*S)], fill=(196,196,204), width=S)
    # exit — bends back, and disperses
    for da, col in ((-2.6, CYAN), (0.0, INK), (2.6, AMBER)):
        a = i_ang + math.radians(da); LL = 560
        d.line([(xx*S,bot*S), ((xx+LL*math.sin(a))*S,(bot+LL*math.cos(a))*S)], fill=col, width=S)
    # normal at exit
    d.line([(xx*S,(bot-40)*S),(xx*S,(bot+150)*S)], fill=GHOST, width=S)

    for rr in (96,132):
        d.arc([(ex-rr)*S,(ey-rr)*S,(ex+rr)*S,(ey+rr)*S], start=228, end=270, fill=FAINT, width=S)
    d.arc([(ex-96)*S,(ey-96)*S,(ex+96)*S,(ey+96)*S], start=90, end=115, fill=FAINT, width=S)

    tr(d, (ex-104, ey-92), "i", MONO(16), DIM, 1)
    tr(d, (ex+16,  ey+62), "r", MONO(16), DIM, 1)
    # Both labels sit in verified clear space: INCIDENT below the upper field
    # and right of the ray; DISPERSED left of the exit rays and above the
    # index column. Measured, not eyeballed.
    tr(d, (455, 586), "INCIDENT", MONO(11), HAIR, 3.2)
    tr(d, (M+300, 1186), "DISPERSED", MONO(11), HAIR, 3.2)

    # accumulation fields, both clear of the ray corridor
    field(d, M, 300, M+330, 560, 40, anomaly=26)
    field(d, W-M-330, 1330, W-M, 1590, 40, anomaly=13)

    # refractive indices, left margin, clear of everything
    tr(d, (M, 1330), "n", JURAM(14), HAIR, 3)
    for k,(lab,hi) in enumerate([("1.00029",0),("1.4586",0),("1.5168",1),("1.9224",0)]):
        tr(d, (M, 1368+k*32), lab, MONO(12), DIM if hi else FAINT, 2)

    tr(d, (W/2, BASE_RULE-176), "INDEX OF REFRACTION", DISP(60), INK, 13, center=True)
    tr(d, (W/2, BASE_RULE-84), "THE MEDIUM IS DRAWN ONLY BY WHAT IT DISPLACES",
       MONO(12), HAIR, 4.4, center=True)
    return finish(img, "plate-1-boundary.png")

# ── PLATE II ─────────────────────────────────────────────────────────────────
def plate_2():
    img = Image.new("RGB",(CW,CH),VOID); d = ImageDraw.Draw(img)
    apparatus(d, "PLATE  II", "DISPLACEMENT", "x(t) = x0 + (xi - x0) e^-Lt", "02 / 04")

    ax, ay = W*0.60, 720
    x0,y0,x1,y1 = M+30, 330, W-M-30, 1120
    cols,rows = 26,17
    for j in range(rows):
        for i in range(cols):
            px = x0+(x1-x0)*i/(cols-1); py = y0+(y1-y0)*j/(rows-1)
            dx,dy = px-ax, py-ay; dist = math.hypot(dx,dy)+1e-6
            infl = math.exp(-(dist**2)/(2*290**2))
            ang = math.atan2(dy,dx); ln = 7+23*infl
            c = FAINT
            if infl > 0.42: c = HAIR
            if infl > 0.76: c = DIM
            d.line([(px*S,py*S),((px+ln*math.cos(ang))*S,(py+ln*math.sin(ang))*S)], fill=c, width=S)
    for rr,c in ((24,DIM),(72,HAIR),(148,FAINT),(248,GHOST)):
        d.ellipse([(ax-rr)*S,(ay-rr)*S,(ax+rr)*S,(ay+rr)*S], outline=c, width=S)

    gx,gy,gw,gh = M, 1330, W-2*M, 300
    d.line([(gx*S,(gy+gh)*S),((gx+gw)*S,(gy+gh)*S)], fill=FAINT, width=S)
    d.line([(gx*S,gy*S),(gx*S,(gy+gh)*S)], fill=FAINT, width=S)
    for k in range(11):
        tx = gx+gw*k/10
        d.line([(tx*S,(gy+gh)*S),(tx*S,(gy+gh+9)*S)], fill=FAINT, width=S)
    prev=None
    for k in range(561):
        t=k/560; v=math.exp(-7.7*t); px=gx+gw*t; py=gy+gh*v
        if prev: d.line([prev,(px*S,py*S)], fill=INK, width=S)
        prev=(px*S,py*S)
    d.line([(gx*S,gy*S),((gx+gw*0.055)*S,(gy+gh)*S)], fill=(70,46,46), width=S)

    tr(d, (gx+gw*0.075, gy+10), "LINEAR / REJECTED", MONO(11), (108,70,70), 3)
    tr(d, (gx+gw*0.34, gy+96), "L = 5.5", MONO(12), DIM, 2.4)
    tr(d, (gx, gy-40), "SETTLE", JURAM(14), DIM, 5.5)
    tr(d, (W-M, gy-38), "THE HAND ARRIVES FIRST", MONO(11), HAIR, 3.2, right=True)

    tr(d, (W/2, BASE_RULE-150), "A MATERIAL IS A DELAY", DISP(52), INK, 12, center=True)
    tr(d, (W/2, BASE_RULE-72), "MEASURED IN MILLISECONDS OF DISAGREEMENT",
       MONO(11), HAIR, 3.8, center=True)
    return finish(img, "plate-2-displacement.png")

# ── PLATE III ────────────────────────────────────────────────────────────────
def plate_3():
    img = Image.new("RGB",(CW,CH),VOID); d = ImageDraw.Draw(img)
    apparatus(d, "PLATE  III", "INDEX", "THREE SPECIMENS / CATALOGUED", "03 / 04")

    specs = [("I","POCKET PEDIATRICS","VOICE  CARE  TRIAGE",CYAN,0.62),
             ("II","EXE","AGENT  HANDOFF",AMBER,0.30),
             ("III","SUSTAINABILITY","MEASURE  REPORT",MAGENTA,0.48)]
    top = 330; colw = (W-2*M)/3
    for i,(num,name,sub,col,ph) in enumerate(specs):
        cx = M+colw*i+colw/2
        fw = colw*0.60; fh = fw*1.25
        fy0 = top; fy1 = top+fh
        d.rounded_rectangle([(cx-fw/2)*S,fy0*S,(cx+fw/2)*S,fy1*S],
                            radius=int(fw*0.17)*S, outline=HAIR, width=S)
        mid = fy0+fh/2
        for k in range(1,16):
            rr = (fw/2)*(k/16)*0.90
            sh = int(18+42*(1-k/16))
            d.ellipse([(cx-rr)*S,(mid-rr)*S,(cx+rr)*S,(mid+rr)*S], outline=(sh,sh,sh+4), width=S)
        a0 = 198+ph*150
        rr = fw/2-10
        d.arc([(cx-rr)*S,(mid-rr)*S,(cx+rr)*S,(mid+rr)*S], start=a0, end=a0+54, fill=col, width=S)
        tr(d,(cx,fy1+38),num,MONO(12),FAINT,3,center=True)
        tr(d,(cx,fy1+74),name,JURAM(16),INK,4.0,center=True)
        tr(d,(cx,fy1+112),sub,MONO(10),HAIR,3,center=True)

    by = 1170
    for i in range(150):
        t=i/149; x=M+(W-2*M)*t
        h=10+42*abs(math.sin(t*math.pi*3.0))*(0.32+0.68*math.exp(-((t-0.62)**2)/0.02))
        c = CYAN if abs(t-0.62)<0.010 else FAINT
        d.line([(x*S,by*S),(x*S,(by+h)*S)], fill=c, width=S)
    d.line([(M*S,(by+60)*S),((W-M)*S,(by+60)*S)], fill=GHOST, width=S)

    field(d, M, 1330, W-M, 1560, 44, anomaly=29)

    tr(d,(W/2,BASE_RULE-150),"THE INDEX",DISP(58),INK,14,center=True)
    tr(d,(W/2,BASE_RULE-72),"EVERY SURFACE KEEPS ITS OWN",MONO(12),HAIR,4.4,center=True)
    return finish(img, "plate-3-index.png")

# ── PLATE IV ─────────────────────────────────────────────────────────────────
def plate_4():
    img = Image.new("RGB",(CW,CH),VOID); d = ImageDraw.Draw(img)
    apparatus(d, "PLATE  IV", "MEDIUM", "TRANSMISSION  0.35  SMOKED", "04 / 04")

    n=24; gx,gy,gw,gh = M,370,W-2*M,270
    step=gw/n; chosen=15
    for i in range(n):
        a=(i+1)/n; v=int(10+(240-10)*(1-a)*0.92)
        x0=gx+step*i
        d.rectangle([x0*S,gy*S,(x0+step-3)*S,(gy+gh)*S], fill=(v,v,v+2))
        if i==chosen:
            d.rectangle([(x0-6)*S,(gy-6)*S,(x0+step+3)*S,(gy+gh+6)*S], outline=CYAN, width=S)
            tr(d,(x0+step/2,gy+gh+22),"0.65",MONO(11),CYAN,2,center=True)
    tr(d,(gx,gy-38),"OPACITY",JURAM(13),DIM,5)
    tr(d,(W-M,gy-36),"OPAQUE",MONO(11),HAIR,3,right=True)

    ly=790
    rows=[("text ON GLASS / WHITE COVER","5.63",1),
          ("text ON VOID","17.90",1),
          ("dim  ON VOID","7.19",1),
          ("dim  ON GLASS / WHITE COVER","2.25",0)]
    bar_x = M+560; full = W-M-bar_x-140
    for i,(lab,val,ok) in enumerate(rows):
        y=ly+i*62
        tr(d,(M,y),lab,MONO(13),DIM if ok else (112,76,76),2.2)
        d.line([(bar_x*S,(y+10)*S),((bar_x+full)*S,(y+10)*S)], fill=GHOST, width=S)
        fr=min(1.0,float(val)/18.0)
        d.line([(bar_x*S,(y+10)*S),((bar_x+full*fr)*S,(y+10)*S)],
               fill=INK if ok else MAGENTA, width=2*S)
        tx=bar_x+full*(4.5/18.0)
        d.line([(tx*S,(y-3)*S),(tx*S,(y+23)*S)], fill=AMBER, width=S)
        tr(d,(W-M,y),val,MONOB(13),INK if ok else MAGENTA,1.5,right=True)
    tr(d,(bar_x+full*(4.5/18.0),ly-40),"4.5",MONO(10),AMBER,1.5,center=True)

    cy2=1290
    for i in range(220):
        t=i/219; x=M+(W-2*M)*t
        f=math.exp(-((t-0.33)**2)/0.0016)+math.exp(-((t-0.70)**2)/0.0016)
        h=6+140*f; v=int(26+150*min(1.0,f))
        d.line([(x*S,(cy2+160-h)*S),(x*S,(cy2+160)*S)], fill=(v,v,v+3), width=S)
    d.line([(M*S,(cy2+160)*S),((W-M)*S,(cy2+160)*S)], fill=HAIR, width=S)
    tr(d,(M,cy2+180),"CAUSTIC",JURAM(13),DIM,5)
    tr(d,(W-M,cy2+182),"WHERE THE BENT LIGHT GATHERS",MONO(11),HAIR,3.2,right=True)

    tr(d,(W/2,BASE_RULE-150),"SMOKED, NOT FROSTED",DISP(52),INK,12,center=True)
    tr(d,(W/2,BASE_RULE-72),"A CLEAR MEDIUM CANNOT DARKEN WHAT LIES BENEATH",
       MONO(11),HAIR,3.8,center=True)
    return finish(img, "plate-4-medium.png")

if __name__ == "__main__":
    ps=[plate_1(),plate_2(),plate_3(),plate_4()]
    ims=[Image.open(p).convert("RGB") for p in ps]
    ims[0].save(os.path.join(OUT,"index-of-refraction.pdf"), save_all=True,
                append_images=ims[1:], resolution=200.0)
    print("wrote pdf")
