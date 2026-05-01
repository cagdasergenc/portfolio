import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center px-[135px] md:px-10 sm:px-6">
      <span
        style={{ fontFamily: 'Karla, sans-serif', fontSize: 16, fontWeight: 500, letterSpacing: 1.5 }}
        className="text-white uppercase tracking-widest select-none"
      >
        CAGDAS ERGENC
      </span>

      {/* Desktop links */}
      <div className="ml-auto hidden sm:flex items-center gap-[17px]">
        {['Portfolio', 'Contact', 'About'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{ fontFamily: 'Karla, sans-serif', fontSize: 15, fontWeight: 400 }}
            className="text-white no-underline hover:opacity-70 transition-opacity"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="ml-auto sm:hidden flex flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-0"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
        <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-black/90 flex flex-col items-center py-4 gap-4">
          {['Portfolio', 'Contact', 'About'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ fontFamily: 'Karla, sans-serif', fontSize: 15, fontWeight: 400 }}
              className="text-white no-underline hover:opacity-70 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
