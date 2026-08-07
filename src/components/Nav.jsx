import { Link } from 'react-router-dom'
import Glass from './Glass'

/**
 * A floating glass pill instead of a full-width bar. Lit Paper's nav sat on
 * a solid scrim and still went invisible over one dark section (1.10:1,
 * caught only in final review). Here the ground is dark everywhere, so the
 * risk inverts: a bright cover image passing under the fixed header. The
 * pill uses the same smoked glass measured in index.css — 5.63:1 for --text
 * over the worst case (a cover containing pure white) — so it holds
 * regardless of what scrolls beneath it. Nothing in the pill is dim
 * metadata, so nothing here hits the 2.25:1 failure the binding rule warns
 * about; text is left at its inherited body colour (--text) throughout.
 */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <Glass as="nav" className="flex items-center gap-4 px-5 py-3 sm:gap-8 sm:px-6">
        <Link
          to="/"
          className="font-display text-lg font-bold"
          aria-label="Çağdaş Ergenç — home"
        >
          <span aria-hidden="true" className="sm:hidden">ÇE</span>
          <span aria-hidden="true" className="hidden sm:inline">Çağdaş Ergenç</span>
        </Link>
        <ul className="flex gap-3 font-mono text-[12px] uppercase tracking-[0.08em] sm:gap-6">
          <li><a href="/#work">Work</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </Glass>
    </header>
  )
}
