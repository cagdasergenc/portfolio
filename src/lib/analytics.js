const LIVE_HOSTS = new Set(['cagdasergenc.com', 'www.cagdasergenc.com'])
const ACTIONS = new Set(['case_study_select', 'cv_click', 'contact_click', 'linkedin_click', 'prototype_click', 'deck_open'])

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
      ...(project ? { project_slug: project } : {}),
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
