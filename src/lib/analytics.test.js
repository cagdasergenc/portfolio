// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { actionFromElement, isLiveHost, trackEvent } from './analytics'

afterEach(() => vi.unstubAllGlobals())

describe('portfolio analytics', () => {
  it('excludes local, preview, and lookalike hosts', () => {
    expect(isLiveHost('cagdasergenc.com')).toBe(true)
    expect(isLiveHost('www.cagdasergenc.com')).toBe(true)
    for (const host of ['localhost', '127.0.0.1', 'portfolio.vercel.app', 'cagdasergenc.com.example.org']) {
      expect(isLiveHost(host)).toBe(false)
    }
  })
  it('sends only deliberate action metadata, excluding email and link queries', () => {
    const link = document.createElement('a')
    link.href = 'mailto:private@example.com?subject=private'
    link.dataset.analytics = 'contact_click'
    link.dataset.placement = 'case_study'
    expect(actionFromElement(link)).toEqual({ name: 'contact_click', parameters: { placement: 'case_study' } })
    link.dataset.analytics = 'unrecognised_event'
    expect(actionFromElement(link)).toBeNull()
  })
  it('safely handles blocked analytics and sends once when live', () => {
    vi.stubGlobal('window', { location: { hostname: 'cagdasergenc.com' } })
    expect(() => trackEvent('cv_click')).not.toThrow()
    const gtag = vi.fn()
    vi.stubGlobal('window', { location: { hostname: 'localhost' }, gtag })
    trackEvent('cv_click')
    expect(gtag).not.toHaveBeenCalled()
    vi.stubGlobal('window', { location: { hostname: 'cagdasergenc.com', origin: 'https://cagdasergenc.com', pathname: '/' }, gtag })
    trackEvent('cv_click', { placement: 'hero' })
    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'cv_click', { page_location: 'https://cagdasergenc.com/', placement: 'hero' })
  })
})
