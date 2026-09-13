# Content needed

Everything the site is waiting on, with specs. The build does not block on any
of it — each item drops into a slot that already exists.

Ordered by how much it matters. If you only do one section, do §1.

---

## 1. Case-study writing — the whole point of the site

Three files. Each has six fixed `##` sections with prompts written inline.

- `content/pocket-pediatrics/index.md`
- `content/exe/index.md`
- `content/sustainability-report/index.md`

| Section | What goes in it | Length |
| --- | --- | --- |
| Context | Where, for whom, why it existed. Name the institution and the constraint. | 2–3 sentences |
| Problem | One sharp statement. What was broken, for whom. | 1–2 sentences |
| Research | What you did and what you found. Methods and numbers. | 1–2 paragraphs |
| Insight | The turn — the thing you learned that changed the design. | 1 paragraph |
| Solution | What you made, and why those decisions over the obvious ones. | 2–3 paragraphs |
| Outcome | Result, metric, or an honest learning. | 1 paragraph |

**Insight is the section that gets you hired.** It is the only one that shows
how you think rather than what you produced. Spend the most time there.

Specifics beat adjectives. "Six interviews with paediatric nurses" carries more
than "extensive user research". "We never tested it with children" is a
stronger ending than an invented metric.

### Banned words

seamless · intuitive · innovative · cutting-edge · elevate · empower ·
leverage · robust · delve · landscape · realm · testament · journey ·
passionate · curated

Also: "not just X, but Y", anything opening "In today's…", and three-adjective
runs like "simple, elegant, effective".

---

## 2. Frontmatter gaps

Ten fields currently read `FILL IN`. The site renders them literally.

**`content/pocket-pediatrics/index.md`**

| Field | Needs |
| --- | --- |
| `duration` | e.g. `12 weeks` |
| `tagline` | one line, max 12 words |

**`content/exe/index.md`**

| Field | Needs |
| --- | --- |
| `duration` | |
| `team` | e.g. `solo` or `3 designers` |
| `tagline` | one line, max 12 words |

**`content/sustainability-report/index.md`** — everything:

`title` · `tagline` · `role` · `context` · `year` · `duration` · `team` · `tools`

Format rules: flat `key: value`, one per line. No nesting, no bullet lists.
Values may contain colons (`https://` is fine). Quotes optional.

---

## 3. Cover images — 3 needed

One per project. These are the work index — the first thing anyone sees of
your projects.

```
content/pocket-pediatrics/cover.jpg
content/exe/cover.jpg
content/sustainability-report/cover.jpg
```

| Spec | Value |
| --- | --- |
| Aspect ratio | **4:5 portrait** |
| Size | 1600 × 2000 px |
| Format | JPG or WebP |
| File size | ≤ 500 KB each |
| Filename | exactly `cover.jpg` (or `.webp` / `.png`) |

These get used twice: as cards in the CSS grid, and as the texture on the
paper sheets in the 3D index. Portrait 4:5 because a printed sheet standing in
space reads as paper — landscape reads as a screenshot.

Export fresh from Figma. **Do not screenshot the PDFs** — they will be soft,
and softness is the single most visible cheapness tell on a design portfolio.

Until these land the cards render a typographic treatment instead. It is
designed to look deliberate, but it is not as good as real work.

---

## 4. In-page images

Anything you want inside a case study. Numbered in display order:

```
content/<slug>/01-triage-flow.jpg
content/<slug>/02-testing-round-two.jpg
```

Reference them in the markdown by **bare filename only** — never a path:

```markdown
![Triage flow after the second round of testing](01-triage-flow.jpg)
```

| Spec | Value |
| --- | --- |
| Width | 2000 px |
| Format | JPG or WebP |
| File size | ≤ 500 KB each |
| Orientation | any — they break the text column full-bleed |

The alt text is not optional and it is not decoration — it is read aloud by
screen readers and indexed by search. Describe what is in the image.

---

## 5. PDFs

| Project | State | Needed |
| --- | --- | --- |
| Pocket Pediatrics | `case-study.pdf` present, 8.8 MB, 31 pages | Nothing blocking |
| EXE | `case-study.pdf` present, 10.4 MB, 21 pages | Nothing blocking |
| Sustainability report | missing | `content/sustainability-report/case-study.pdf` |

Both decks are still large for a phone connection. Neither is a blocker any
more: the case-study pages now carry the evidence inline as WebP exports of
the deck pages, and the PDF is the optional deeper read behind a preview
card. Set `pdf_pages` in frontmatter whenever a deck is re-exported, since
the card prints that number.

PDFs are a secondary path here. The case-study pages are the primary one, which
is the whole reason for this redesign — nobody should need to open a PDF to
understand your work.

---

## 6. About section

**Photo** → `src/assets/about.jpg` — done. A black and white portrait against
a dark background, 928 × 1152, 222 KB. The alt text in `About.jsx` describes
that image; if the portrait is ever swapped, change the alt text with it.

**Bio** — 2–3 short paragraphs. What you do, where you trained, what you are
looking for. Not a personality statement. Same banned words as §1.

---

## 7. Resume

`src/assets/resume.pdf` exists (264 KB). Replace it if you have a newer
version — it is linked from the Contact section as a direct download.

---

## 8. Confirmations, not files

- **Pocket Pediatrics is live** at `pocpedv2.netlify.app` (v2), entered with
  the one-tap Oscar demo account. Confirm the demo still opens before any
  big send-out: a dead demo is worse than no demo.
- **Pocket Pediatrics deck** still shows the v1 "See it in Action" QR
  walkthrough on page 8. A re-export without it is coming.
- **Research source links** for "National Profile of Caregiver Challenges"
  and "Inequities in Care Coordination" are named but not linked yet.
- **`pocket_pediatrics_logo.png`** (183 KB) is currently orphaned. The case
  studies use `cover.jpg` instead of logos now. Delete, or is there a use?

---

## Priority

1. **§1 case-study writing** — nothing else matters if the pages are empty
2. **§3 cover images** — the work index is the second thing anyone looks at
3. **§6 About** — the second-most-visited page on a portfolio during a job hunt
4. **§5 the 33 MB PDF** — launch blocker
5. Everything else
