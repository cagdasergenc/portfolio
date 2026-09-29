/**
 * The shell every page shares: routes, the nav, scroll reset and analytics.
 *
 * Used by: main.jsx
 * Uses: routes/Home.jsx, routes/CaseStudy.jsx, routes/NotFound.jsx,
 *       components/Nav.jsx, components/PersonSchema.jsx, hooks/usePush.js
 *
 * How it works:
 * - Routes maps "/" to Home, "/work/:slug" to CaseStudy, everything else to NotFound.
 * - ScrollToTop sends a new page to the top, unless the URL carries a #hash.
 * - TrackPageViews sends one GA4 page_view per route change. gtag itself is
 *   loaded in index.html, so this only fires if that script is there.
 * - usePush runs once here for the whole page and writes the pointer values
 *   that the glass surfaces and the shader both read.
 */
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { usePush } from './hooks/usePush'
import Nav from './components/Nav'
import PersonSchema from './components/PersonSchema'
import Home from './routes/Home'
import CaseStudy from './routes/CaseStudy'
import NotFound from './routes/NotFound'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // Never fight an anchor. The nav links to /#work, /#about and
    // /#contact, so scrolling to top on a hashed URL would silently
    // break every one of them when clicked from a case-study page.
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function TrackPageViews() {
  const location = useLocation()
  useEffect(() => {
    // index.html's gtag config has send_page_view disabled specifically so
    // this is the only place page_view fires -- once per real navigation,
    // including the first, rather than the static script's one-time call
    // plus this one disagreeing after every route change. gtag is missing
    // entirely for anyone blocking it, so this has to check before calling.
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    })
  }, [location])
  return null
}

export default function App() {
  usePush()
  return (
    <div className="min-h-screen">
      <PersonSchema />
      <ScrollToTop />
      <TrackPageViews />
      {/* Visible only on focus. The first Tab stop on every page, so a
          keyboard or screen-reader visitor can skip the nav instead of
          walking it on every route change. */}
      <a
        href="#content"
        className="glass sr-only font-mono text-xs uppercase tracking-[0.08em] focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:px-4 focus:py-3"
      >
        Skip to content
      </a>
      <Nav />
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
