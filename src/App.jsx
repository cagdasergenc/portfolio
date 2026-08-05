import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSun } from './hooks/useSun'
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
  useSun()
  return (
    <div className="min-h-screen">
      <div className="backdrop" aria-hidden="true" />
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
