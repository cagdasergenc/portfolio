/**
 * The one place that talks to GA4.
 *
 * Used by: components/Contact.jsx, WebBand.jsx and routes/CaseStudy.jsx for
 *          the events below. Page views are sent separately in App.jsx.
 * Uses: the gtag function that index.html loads
 *
 * How it works: gtag is missing for anyone blocking analytics, and for
 * everyone during local development, so every call checks first and quietly
 * does nothing. Nothing on the site depends on the return value.
 *
 * The five events worth counting, and why:
 * - cv_download      someone took the CV away with them
 * - open_live_app    someone went to try the Pocket Pediatrics demo
 * - deck_preview     someone opened a case study PDF
 * - shop_visit       someone clicked through to a shop I designed
 * - email_click      someone started writing to me
 */
export function track(event, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}
