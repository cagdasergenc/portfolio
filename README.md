# cagdasergenc.com

My portfolio. A product and UX designer's site, built and maintained by me in
React and Vite, deployed on Vercel.

Live: [cagdasergenc.com](https://cagdasergenc.com)

## What is different about it

Most portfolio sites are a document: hero, then a grid of cards, then an about
section. This one opens on the work. The first viewport is a project, pinned in
place while the page scrolls, and scrolling swaps which project is on it. The
positioning line sits on top of the work as annotation, not in front of it as a
statement.

The pinning uses a tall track with a `position: sticky` stage inside it, so the
scrollbar, keyboard paging and deep links keep working. Nothing hijacks scroll.

The cover image on that stage is a WebGL surface. The title capsule over it is
real glass: the shader resamples the cover with displaced coordinates inside the
capsule, so the image bends rather than blurs. Every cover is measured on load
to decide how dark the shading over the headline has to be, so a dark cover is
never painted black and text over a bright one stays readable.

On a small screen, with reduced motion, or without WebGL, the same projects
render as a stacked list. That is a designed path, not a fallback.

## Stack

- React 19 and React Router
- Vite 7
- Tailwind CSS 4, with the design tokens in `src/index.css`
- Raw WebGL2 for the refraction shader, no three.js
- GSAP ScrollTrigger for entry animations only
- marked for the case study markdown
- Vitest for the maths and content tests

No backend, no database, no CMS. The case studies are markdown files compiled at
build time.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm test         # vitest
npm run lint
```

## How the code fits together

```
src/
  main.jsx            mounts React, sets up the router
  App.jsx             routes, nav, scroll reset, GA4 page views, pointer field
  routes/
    Home.jsx          the landing page: Stage, WebBand, About, Contact
    CaseStudy.jsx     /work/:slug, built from content/<slug>/index.md
    NotFound.jsx      404
  components/
    Stage.jsx         the pinned stage, decides which project is active
    StageCanvas.jsx   the cover image, upgraded to WebGL when possible
    WorkGridFlat.jsx  the plain stacked version of the same projects
    Nav.jsx Glass.jsx Band.jsx Rail.jsx Prose.jsx Lightbox.jsx
    WebBand.jsx About.jsx Contact.jsx SEO.jsx PersonSchema.jsx
  hooks/
    usePush.js        pointer position as CSS variables, damped
    useLowFi.js       shader or plain path
    useCapsuleRect.js measures the glass capsule for the shader
    useReveal.js      entry animations
  lib/
    content.js        markdown to page data (the whole content pipeline)
    contrast.js       WCAG contrast maths
    scrim.js          how dark the cover shading has to be, per cover
    activeIndex.js    scroll position to project index, with a dead zone
    push.js color.js  the maths behind usePush and the shader colours
  gl/
    refract.js        WebGL setup and the render loop
    shader.glsl.js    the vertex and fragment shaders
content/
  <slug>/index.md     one folder per project, the folder name is the URL
```

Every file starts with a comment saying what it is, what uses it and what it
uses, so this tree is a map and not the only reference.

The data flow for a case study, end to end:

```
content/pocket-pediatrics/index.md
  -> lib/content.js        reads frontmatter, splits on "##", renders markdown,
                           resolves images and the PDF through Vite
  -> routes/CaseStudy.jsx  summary list, sidebar links, sections, deck card
  -> components/Prose.jsx  renders the compiled HTML
  -> components/Lightbox.jsx  opens a figure or the deck PDF
```

## Adding a project

1. Create `content/<slug>/`. The folder name becomes the URL: `/work/<slug>`.
2. Write `index.md` with flat `key: value` frontmatter, then the body in `##`
   sections. Each `##` heading becomes a section on the page and a link in the
   sidebar.
3. Drop images in the same folder and reference them by bare filename,
   `![alt text](01-thing.webp)`. Never write a path. The build resolves and
   fingerprints them. The image title becomes the caption.
4. Optional: `case-study.pdf` for the deck card, `cover.jpg` for the stage,
   `live_url` and `live_hint` if the project is deployed somewhere.
5. `draft: true` keeps a project out of the listing and unreachable at its URL
   until it is ready.

Rules I keep for the content itself: real alt text on every image, images 2000px
wide and under 500KB, numbers and names instead of adjectives, and no em dashes.

## Tests

The tests cover the parts where being wrong is invisible: contrast maths, the
scrim measurement, the damping, the scroll to index dead zone, and the content
pipeline. Rendering is not unit tested, it is checked in a browser.

## Licence

Code is MIT, see LICENSE. The case study content, images, PDFs and the CV are
mine and not covered by it. Please do not republish my work as yours.
