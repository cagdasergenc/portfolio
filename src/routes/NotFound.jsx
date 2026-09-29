/**
 * The 404 page.
 *
 * Used by: App.jsx (any unmatched URL) and routes/CaseStudy.jsx (unknown slug)
 * Uses: components/SEO.jsx
 *
 * How it works: the host rewrites every path to index.html so client side
 * routing works, which means this page is served with HTTP 200 and not 404.
 * noindex on SEO is the only way left to tell Google it is not a real page.
 */
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <section className="shell py-40">
      {/* The host rewrites every path to index.html, so this is served at
          HTTP 200 and not 404 (it has to be, for
          client-side routing to work at all) -- noindex is the only signal
          available to tell Google this isn't a real page. */}
      <SEO title="Page not found · Çağdaş Ergenç" description="This page moved or never existed." noindex />
      <p className="label">404</p>
      <h1 className="mt-4 text-display">This page moved or never existed.</h1>
      <Link className="mt-8 inline-block underline underline-offset-4" to="/">Back to the work</Link>
    </section>
  )
}
