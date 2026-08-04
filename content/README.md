# Content

One folder per project. The folder name is the URL slug:
`content/pocket-pediatrics/` serves `/work/pocket-pediatrics`.

    content/<slug>/
      index.md        copy + frontmatter
      case-study.pdf  the download
      cover.jpg       index image, 2000px wide
      01-*.jpg        in-page visuals, numbered in display order

## Rules

- Frontmatter is flat `key: value`. No nesting, no lists. Values may
  contain colons.
- `live_url` is optional. Add it when the project is deployed somewhere
  people can use it, and the case study will lead with "Open the app"
  instead of the PDF download. Pair it with `live_hint` for any login or
  access note (for example `log in as oscar`).
- The six `##` headings are fixed and required, in this order: Context,
  Problem, Research, Insight, Solution, Outcome. One layout serves every
  project because of this.
- Reference images by bare filename — `![alt](01-triage.jpg)`. Never write
  a path. The build resolves and fingerprints them.
- Every image needs real alt text describing what is in it.

## Assets

- 2000px wide, JPG or WebP, 500KB or less each.
- Export fresh from Figma. Do not pull images out of the PDFs; they will be
  soft.
- Keep `case-study.pdf` under 8MB.

## Copy

Banned: seamless, intuitive, innovative, cutting-edge, elevate, empower,
leverage, robust, delve, landscape, realm, testament, journey, passionate,
curated. Also banned: "not just X, but Y", and any sentence that opens with
"In today's...".

Write what happened. Numbers and names beat adjectives.
