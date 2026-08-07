import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { usePush } from './hooks/usePush'
import Nav from './components/Nav'
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

export default function App() {
  usePush()
  return (
    <div className="min-h-screen">
      <ScrollToTop />
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
