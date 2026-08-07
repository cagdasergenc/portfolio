import { Link } from 'react-router-dom'

/**
 * The header previously used `mix-blend-multiply` so it would sit into the
 * paper. That silently broke on every case study: the Insight section is
 * full-bleed `--dark` (#12100C), and multiplying ink over it dropped the
 * logo to 1.10:1 and the nav links to 1.06:1 — invisible, for the whole
 * time that band sat under the fixed header.
 *
 * A scrim solves it without special-casing: the header always has paper
 * underneath it regardless of what is scrolling past, so contrast is the
 * same everywhere. It fades to transparent so it still reads as floating
 * rather than as a solid bar.
 */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Solid paper through the text band, fading only BELOW it. A scrim
          that starts fading immediately looks fine but measures badly: at
          85% alpha over the dark section the muted links come out at
          3.68:1, under the 4.5:1 bar. Extending past the header and holding
          full opacity to 55% keeps every nav glyph on opaque paper — 15.77:1
          for the logo, 5.05:1 for the links, identical everywhere on the
          site regardless of what scrolls beneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-10 top-0 bg-gradient-to-b from-paper from-55% to-transparent"
      />
      <nav className="shell relative flex items-baseline justify-between py-6">
        <Link to="/" className="font-display text-xl font-bold">Çağdaş Ergenç</Link>
        <ul className="label flex gap-6">
          <li><a href="/#work">Work</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
