import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSun } from './hooks/useSun'
import Nav from './components/Nav'
import Home from './routes/Home'
import CaseStudy from './routes/CaseStudy'
import NotFound from './routes/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
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
