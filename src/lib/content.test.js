import { describe, it, expect } from 'vitest'
import { parseFrontmatter, splitSections, renderMarkdown } from './content'

describe('parseFrontmatter', () => {
  it('reads flat key/value pairs', () => {
    const { data } = parseFrontmatter('---\ntitle: Pocket Pediatrics\nyear: 2025\n---\nbody here')
    expect(data.title).toBe('Pocket Pediatrics')
    expect(data.year).toBe('2025')
  })

  it('returns the body without the frontmatter block', () => {
    const { body } = parseFrontmatter('---\ntitle: X\n---\n## Context\ntext')
    expect(body.trim()).toBe('## Context\ntext')
  })

  it('splits on the first colon only, so values may contain colons', () => {
    const { data } = parseFrontmatter('---\ntagline: Care for kids: a study\n---\n')
    expect(data.tagline).toBe('Care for kids: a study')
  })

  it('strips surrounding quotes from values', () => {
    const { data } = parseFrontmatter('---\ntitle: "D&B DTF"\n---\n')
    expect(data.title).toBe('D&B DTF')
  })

  it('ignores blank lines and comments inside the block', () => {
    const { data } = parseFrontmatter('---\n\n# a comment\ntitle: X\n---\n')
    expect(data.title).toBe('X')
    expect(Object.keys(data)).toEqual(['title'])
  })

  it('handles a file with no frontmatter', () => {
    const { data, body } = parseFrontmatter('just text')
    expect(data).toEqual({})
    expect(body).toBe('just text')
  })
})

describe('splitSections', () => {
  it('splits on level-2 headings and keeps their order', () => {
    const s = splitSections('## Context\nc\n\n## Problem\np\n\n## Outcome\no')
    expect(s.map((x) => x.heading)).toEqual(['Context', 'Problem', 'Outcome'])
  })

  it('keeps section body markdown intact', () => {
    const s = splitSections('## Context\nline one\nline two')
    expect(s[0].markdown.trim()).toBe('line one\nline two')
  })

  it('ignores level-3 headings as section boundaries', () => {
    const s = splitSections('## Context\n### Sub\ntext')
    expect(s).toHaveLength(1)
    expect(s[0].markdown).toContain('### Sub')
  })

  it('returns an empty array for empty content', () => {
    expect(splitSections('')).toEqual([])
  })
})

describe('renderMarkdown', () => {
  const assets = { 'cover.jpg': '/assets/cover.abc123.jpg' }

  it('rewrites bare image filenames to hashed build URLs', () => {
    const html = renderMarkdown('![A ward round](cover.jpg)', assets)
    expect(html).toContain('src="/assets/cover.abc123.jpg"')
  })

  it('carries alt text through', () => {
    const html = renderMarkdown('![A ward round](cover.jpg)', assets)
    expect(html).toContain('alt="A ward round"')
  })

  it('lazy-loads images', () => {
    const html = renderMarkdown('![x](cover.jpg)', assets)
    expect(html).toContain('loading="lazy"')
  })

  it('leaves an unknown filename alone rather than emitting a broken hash', () => {
    const html = renderMarkdown('![x](missing.jpg)', assets)
    expect(html).toContain('src="missing.jpg"')
  })

  it('still renders ordinary markdown', () => {
    expect(renderMarkdown('**bold**', assets)).toContain('<strong>bold</strong>')
  })
})
