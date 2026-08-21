# Scorecard

Tie-breaker rule applied throughout: when uncertain between two scores, the
lower one was taken. Each principle scored against its worst representative
instance, not an average.

---

**1. Good design is innovative — Score: 1/3**
Evidence: `.glass` resolves to `backdrop-filter: blur(12px)` (`01-evidence.md` §headline, `src/index.css:168`) — the exact pattern the project's own spec names as "the most generated look in software right now... the most imitated" and explicitly disqualifies. The sticky-stage scroll handoff (`Stage.jsx`) is a genuine structural departure a first-time visitor would notice.
Justification: score the worst instance, and the worst instance is the one carrying the design's stated identity claim. The visual language that ships is imitative; the interaction structure that ships is not. Averaging would flatter the score — the anchor asks what a peer-aware viewer would conclude about the whole, and the whole's visible surface (glass, dark, rounded) reads as a very common pattern with one real, subtle variation (the pointer sheen and viscosity), which is exactly anchor level 1.

**2. Good design makes a product useful — Score: 3/3**
Evidence: nav pill, sticky-stage capsule, and the `sr-only` keyboard grid all reach any case study in one click, from any scroll position, with no decoy actions found (`01-evidence.md` §1, §2).
Justification: the primary task — reach a case study — completes in the fewest possible steps by every input method checked (pointer, keyboard, screen reader). This is scored on what a user experiences, not on the dead code discussed under #10; a visitor never encounters that.

**3. Good design is aesthetic — Score: 1/3**
Evidence: 7 distinct rendered colours and a coherent 4px-multiple spacing scale (`01-evidence.md` §2) — genuinely tight. Against that: `--text-hero` is an orphaned token no longer serving its named role (`src/index.css:33`, `Stage.jsx:118`); `CaseStudy.jsx:18` hand-rolls layout instead of the `.shell` class every sibling section uses; `Band.jsx`, documented as "the section header for this world," is not reused by `CaseStudy.jsx` at all.
Justification: three distinct, independently-citable inconsistencies meets the anchor's literal "3–5 inconsistencies" threshold for level 1, even though none is visually jarring on its own. The palette and spacing discipline are real and are exactly what keeps this from a 0.

**4. Good design makes a product understandable — Score: 3/3**
Evidence: every operable control checked (nav links, stage capsule + "Open →", skip link) names its own function; `Rail.jsx` is correctly `aria-hidden` and out of the tab order rather than being presented as a control that needs understanding (`01-evidence.md` §1, §3).
Justification: no control on this surface requires unlearned knowledge to operate correctly. This is a real strength, not a generous rounding — stated plainly rather than manufacturing a deduction to appear more critical.

**5. Good design is unobtrusive — Score: 3/3**
Evidence: covers render full-bleed and unobstructed; the two protective scrims measurably fade to zero across the middle of the viewport (`Stage.jsx:126-149`, geometry verified live this session against the gradient stop math); nav is a small floating pill, not a bar.
Justification: "never obstruct the work" is the spec's own explicit rule for this surface, and it is met — proven by measurement, not just by design intent.

**6. Good design is honest — Score: 0/3**
Evidence: the design's own spec states, as a shipping condition: "Not `backdrop-filter: blur`... A WebGL layer samples the actual cover images and displaces them through a shader... If either is dropped, this becomes generic and should not ship." The shipped `.glass` rule IS `backdrop-filter: blur(12px)` (`src/index.css:168`); the real shader (`src/gl/refract.js`, tested and previously verified working) is unreachable from any route (`01-evidence.md` §headline finding).
Justification: this is not a user-facing copy lie — nothing a visitor reads is false, and that distinction matters. But Rams's honesty principle governs the product, not only its marketing copy, and there is no more direct violation of "claim only what it is" than a design whose name, spec, and documentation describe a shader that is not running in what ships. The rubric's own load-bearing-principle list names #6 explicitly for exactly this class of finding.

**7. Good design is long-lasting — Score: 1/3**
Evidence: the spec self-identifies two active trend markers it is knowingly adopting — dark glassmorphism ("the most imitated" pattern right now) and fully-rounded shapes ("the most familiar shape language in software today") — `docs/superpowers/specs/2026-08-07-behind-glass-design.md` §2.1, §5.4, quoted in `01-evidence.md`.
Justification: two explicit, self-documented dated markers is anchor level 1. The sticky-stage structure is not a trend marker (scroll-driven handoffs predate any current cycle) and does not offset the visual-language markers for this specific principle.

**8. Good design is thorough down to the last detail — Score: 2/3**
Evidence for care: the reduced-motion failsafe watchdog (`useReveal.js:20-31`) that disarms the reveal animation entirely after 1.6s if it never fires — a failure mode most sites never consider, and one this project hit and fixed live this session. The archived-link contrast fix on MesfenoWear (`WebBand.jsx:26-32`), corrected from a measured 2.59:1 to 4.92:1. Against that: the pointer sheen added to `.glass` this session was never re-verified against the contrast floor measured before it existed — recomputed now, it drops the title text to 4.30:1 (below the 4.5:1 AA floor) at peak pointer force over a worst-case bright cover, passing only against the one real cover currently in the codebase (`01-evidence.md` §2).
Justification: real, evidenced care exists throughout, and one concrete regression slipped through exactly because two separate fixes were never checked against each other — which is what "down to the last detail" is meant to catch.

**9. Good design is environmentally friendly — Score: 2/3**
Evidence: entry bundle is 140.93 kB gzip, comfortably under the 500KB anchor threshold, and `prefers-reduced-motion` correctly stops the pointer field's animation loop entirely (`usePush.js:20-25`). Against that: when motion is not reduced, that same loop runs `requestAnimationFrame` unconditionally for the life of the tab regardless of pointer activity (`usePush.js:41-52`), forcing continuous style recalculation. Separately, a 35 MB case-study PDF ships in `dist/` — a known issue, flagged as a launch blocker in an earlier session, still unresolved (`01-evidence.md` §4).
Justification: motion IS correctly gated (satisfying the explicit condition in anchor level 2), and bundle weight is well within bounds — but an always-on idle loop plus a still-unfixed 35MB asset are real, current resource costs, not hypothetical ones.

**10. Good design is as little design as possible — Score: 1/3**
Evidence: `Hero.jsx` (55 lines), `WorkIndex.jsx` (51 lines), and `GlassCard.jsx` + its shader dependency (129 lines) are all unreachable from any route today — three separate implementations of "show the projects" exist in the codebase, only one live. `Rail.jsx` is explicitly documented as decorative, feeds `--rail-p` to nothing outside itself, and duplicates no information the scrolling page content doesn't already convey.
Justification: five concretely removable-without-task-loss items (three dead files plus the orphaned token plus Rail's debatable inclusion) meets anchor level 1's "3–5 removable elements." A stricter reading — two dead full reimplementations of the same live feature counts as duplicated affordances — could argue this belongs at 0; scored at 1 because the duplication is invisible to a user and only findable by reading the codebase, which is the more defensible line even under the tie-breaker rule.

---

**Total: 17/30**
