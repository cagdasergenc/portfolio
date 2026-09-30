const LIVE_HOSTS = new Set(['cagdasergenc.com', 'www.cagdasergenc.com'])
const ACTIONS = new Set(['case_study_select', 'cv_download', 'email_click', 'linkedin_click', 'open_live_app', 'deck_preview', 'shop_visit'])

export function isLiveHost(hostname) {
  return LIVE_HOSTS.has(hostname)
}

// Never send arbitrary link URLs, email addresses, query strings or free text.
export function actionFromElement(element) {
  const { analytics, placement, project } = element.dataset
  if (!ACTIONS.has(analytics)) return null
  return {
    name: analytics,
    parameters: {
      placement: placement || 'page',
      ...(project ? { project: project } : {}),
    },
  }
}

export function trackEvent(name, parameters = {}) {
  if (!isLiveHost(window.location.hostname) || typeof window.gtag !== 'function') return
  window.gtag('event', name, {
    page_location: window.location.origin + window.location.pathname,
    ...parameters,
  })
}

// Preserve the existing API used by the shop links.
export const track = trackEvent
