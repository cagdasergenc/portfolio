import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <section className="shell py-40">
      {/* Netlify's SPA redirect serves this at HTTP 200 (it has to, for
          client-side routing to work at all) -- noindex is the only signal
          available to tell Google this isn't a real page. */}
      <SEO title="Page not found — Çağdaş Ergenç" description="This page moved or never existed." noindex />
      <p className="label">404</p>
      <h1 className="mt-4 text-display">This page moved or never existed.</h1>
      <Link className="mt-8 inline-block underline underline-offset-4" to="/">Back to the work</Link>
    </section>
  )
}
