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

/** Splits a body into its `## ` sections, preserving order. */
export function splitSections(body) {
  const sections = []
  const re = /^## +(.+)$/gm
  let match
  const starts = []
  while ((match = re.exec(body)) !== null) {
    starts.push({ heading: match[1].trim(), from: match.index + match[0].length })
  }
  starts.forEach((s, i) => {
    const to = i + 1 < starts.length ? body.lastIndexOf('\n## ', starts[i + 1].from) : body.length
    sections.push({ heading: s.heading, markdown: body.slice(s.from, to) })
  })
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
