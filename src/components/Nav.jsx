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
 *
 * Every link is its own 44px-high target. The type stays at 12px: the size
 * comes from padding, so the pill reads the same and the tap area is the
 * one a thumb actually needs. Hover tints the target rather than fading the
 * label, which keeps the text at full contrast and shows the real bounds of
 * the thing being pressed.
 */
const ITEM = 'inline-flex min-h-11 items-center rounded-pill px-3 transition-colors hover:bg-white/10'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <Glass as="nav" className="flex items-center gap-1 px-2 sm:gap-3 sm:px-3">
        <Link
          to="/"
          className={`${ITEM} font-display text-lg font-bold`}
          aria-label="Çağdaş Ergenç — home"
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
