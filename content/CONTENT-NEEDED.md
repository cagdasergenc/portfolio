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
| Pocket Pediatrics | `case-study.pdf` present, **33 MB** | Re-export under 8 MB |
| EXE | missing | `content/exe/case-study.pdf` |
| Sustainability report | missing | `content/sustainability-report/case-study.pdf` |

**The 33 MB one is a launch blocker.** It is slower to download than most
people will wait, and it is 25 rasterised pages with no text layer — so it is
also unsearchable and unreadable to a screen reader. Re-export from the source
with image compression on.

PDFs are a secondary path here. The case-study pages are the primary one, which
is the whole reason for this redesign — nobody should need to open a PDF to
understand your work.

---

## 6. About section

**Photo** → `src/assets/about.jpg`

| Spec | Value |
| --- | --- |
| Aspect ratio | 4:5 portrait |
| Size | 1600 × 2000 px |
| File size | ≤ 400 KB |

The photo you already sent works well — warm light from frame-right against a
neutral wall, which is the same light the whole site is built around. Send that
one at full resolution.

**Bio** — 2–3 short paragraphs. What you do, where you trained, what you are
looking for. Not a personality statement. Same banned words as §1.

---

## 7. Resume

`src/assets/resume.pdf` exists (264 KB). Replace it if you have a newer
version — it is linked from the Contact section as a direct download.

---

## 8. Confirmations, not files

- **MesfenoWear is offline.** It renders greyed out, labelled "Offline", with
  no outbound link. Correct, or should it be removed entirely?
- **Pocket Pediatrics is live** at `pocpedv2.netlify.app`, log in as `oscar`.
  Its case study leads with "Open the app" and offers the PDF second.
  Confirm the login still works before launch — a dead demo is worse than no
  demo.
- **`pocket_pediatrics_logo.png`** (183 KB) is currently orphaned. The case
  studies use `cover.jpg` instead of logos now. Delete, or is there a use?

---

## Priority

1. **§1 case-study writing** — nothing else matters if the pages are empty
2. **§3 cover images** — the work index is the second thing anyone looks at
3. **§6 About** — the second-most-visited page on a portfolio during a job hunt
4. **§5 the 33 MB PDF** — launch blocker
5. Everything else
