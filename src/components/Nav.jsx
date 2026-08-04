import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-multiply">
      <nav className="shell flex items-baseline justify-between py-6">
        <Link to="/" className="font-display text-xl">Çağdaş Ergenç</Link>
        <ul className="label flex gap-6">
          <li><a href="/#work">Work</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
