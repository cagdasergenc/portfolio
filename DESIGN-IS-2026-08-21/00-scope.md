# Scope

**Audited:** `design/behind-glass` branch, dev server at localhost:5173, primarily `/` (the persistent stage) and secondarily `/work/pocket-pediatrics` (the only case study with real content).

**Primary user:** design hiring managers doing a ~90-second skim; secondary, founders hiring for web/brand work.

**Primary task:** understand what the owner has built and decide to open a case study, in under 90 seconds, without needing to open a PDF.

**Constraints:** React 19 + Vite 8 + Tailwind 4 + raw WebGL2 (no three.js on this branch). Self-hosted fonts only, no CDN. Must ship a sibling design (`design/lit-paper`) from the same content pipeline. Owner has final say; this audit's job is evidence, not taste.

**Reference/competitor context:** the sibling branch `design/lit-paper` (warm editorial, light) is the direct comparison point — same content, same constraints, opposite visual world.

**State of content:** only Pocket Pediatrics has a real cover image and real copy. EXE and the sustainability report are still placeholder/`FILL IN`. This matters for principle #6 (honest) and #8 (thorough) — the audit scores what ships today, not the intended end state.
