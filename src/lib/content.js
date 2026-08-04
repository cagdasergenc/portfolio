import { marked } from 'marked'

/**
 * Flat `key: value` frontmatter. Deliberately not YAML: the format is fixed
 * and documented, and gray-matter needs a Buffer polyfill in the browser.
 */
export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const colon = trimmed.indexOf(':')
    if (colon === -1) continue
    const key = trimmed.slice(0, colon).trim()
    const value = trimmed.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = value
  }
  return { data, body: raw.slice(match[0].length) }
}

/**
 * Splits a body into its `## ` sections, preserving order. Fence-aware: a
 * `## ` line inside a ``` or ~~~ fence (any length >= 3, either char) is
 * code, not a heading boundary.
 */
export function splitSections(body) {
  const sections = []
  let current = null
  let fence = null // the opening fence marker (e.g. '```'), or null if outside one

  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (fenceMatch) {
      const marker = fenceMatch[1]
      if (!fence) fence = marker
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null
    }

    const headingMatch = !fence && /^## +(.+)$/.exec(line)
    if (headingMatch) {
      if (current) sections.push({ heading: current.heading, markdown: current.lines.join('\n') })
      current = { heading: headingMatch[1].trim(), lines: [] }
      continue
    }

    // Lines before the first `##` heading (no `current` yet) are dropped —
    // intentional: the fixed six-section case-study model has no "intro" slot.
    if (current) current.lines.push(line)
  }
  if (current) sections.push({ heading: current.heading, markdown: current.lines.join('\n') })
  return sections
}

/** Renders markdown, rewriting bare image filenames to hashed build URLs. */
export function renderMarkdown(markdown, assets) {
  const renderer = new marked.Renderer()
  renderer.image = ({ href, text }) => {
    const src = assets[href] ?? href
    const alt = (text ?? '').replace(/"/g, '&quot;')
    return `<figure><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></figure>`
  }
  return marked.parse(markdown, { renderer, async: false })
}

const RAW = import.meta.glob('/content/*/index.md', {
  query: '?raw', import: 'default', eager: true,
})
const ASSETS = import.meta.glob('/content/*/*.{jpg,jpeg,png,webp,pdf}', {
  query: '?url', import: 'default', eager: true,
})

function slugOf(path) {
  return path.split('/')[2]
}

function assetsFor(slug) {
  const out = {}
  for (const [path, url] of Object.entries(ASSETS)) {
    if (slugOf(path) === slug) out[path.split('/').pop()] = url
  }
  return out
}

function build(path, raw) {
  const slug = slugOf(path)
  const assets = assetsFor(slug)
  const { data, body } = parseFrontmatter(raw)
  return {
    slug,
    ...data,
    featured: data.featured === 'true',
    order: Number(data.order ?? 99),
    cover: assets['cover.jpg'] ?? assets['cover.webp'] ?? assets['cover.png'],
    pdf: assets['case-study.pdf'],
    sections: splitSections(body).map((s) => ({
      heading: s.heading,
      html: renderMarkdown(s.markdown, assets),
    })),
  }
}

const PROJECTS = Object.entries(RAW)
  .map(([path, raw]) => build(path, raw))
  .sort((a, b) => a.order - b.order)

export function getProjects() { return PROJECTS }
export function getProject(slug) { return PROJECTS.find((p) => p.slug === slug) }
