import { Link } from 'react-router-dom'
import Glass from './Glass'

/**
 * The fixed nav: a floating glass pill, not a full width bar.
 *
 * Used by: App.jsx, so it sits on every page
 * Uses: components/Glass.jsx for the surface
 *
 * How it works:
 * - The links are hash links to the sections on the home page, so they work
 *   from a case study page too. App.jsx skips its scroll reset when a URL
 *   carries a hash, which is what keeps them working.
 * - The pill floats because the cover images underneath it change colour.
 *   The glass fill is measured for the worst case, a cover containing pure
 *   white, and still reads at 5.63:1. Nothing in here is dim text, which
 *   would not survive that.
 * - Every link is a 44px tap target. The type stays at 12px and the size
 *   comes from padding, so it reads small but a thumb still hits it.
 */
const ITEM = 'inline-flex min-h-11 items-center rounded-pill px-3 transition-colors hover:bg-white/10'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <Glass as="nav" className="flex items-center gap-1 px-2 sm:gap-3 sm:px-3">
        <Link
          to="/"
          className={`${ITEM} font-display text-lg font-bold`}
          aria-label="Çağdaş Ergenç, home"
        >
          <span aria-hidden="true" className="sm:hidden">ÇE</span>
          <span aria-hidden="true" className="hidden sm:inline">Çağdaş Ergenç</span>
        </Link>
        <ul className="flex items-center gap-1">
          <li><a className={`${ITEM} font-mono text-[12px] uppercase tracking-[0.08em]`} href="/#work">Work</a></li>
          <li><a className={`${ITEM} font-mono text-[12px] uppercase tracking-[0.08em]`} href="/#about">About</a></li>
          <li><a className={`${ITEM} font-mono text-[12px] uppercase tracking-[0.08em]`} href="/#contact">Contact</a></li>
        </ul>
      </Glass>
    </header>
  )
}
