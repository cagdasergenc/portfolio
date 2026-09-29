/**
 * JSON-LD telling search engines who this site is about.
 *
 * Used by: App.jsx, so it is on every page
 * Uses: components/SEO.jsx for SITE_URL
 *
 * How it works: one static Person object is stringified into a
 * <script type="application/ld+json">. Google reads JSON-LD anywhere in the
 * document, so this does not need to reach <head>. Keep the fields in step
 * with the CV and the About text.
 */
import { SITE_URL } from './SEO'

// Google reads JSON-LD anywhere in the document, not only <head> -- no
// hoisting needed, this renders inline where it's used.
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Çağdaş Ergenç',
  jobTitle: 'Product & UX Designer',
  url: SITE_URL,
  sameAs: [
    'https://www.linkedin.com/in/cagdas-ergenc',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Barcelona',
    addressCountry: 'ES',
  },
}

export default function PersonSchema() {
  // dangerouslySetInnerHTML is safe here: SCHEMA is a static object defined
  // above, not user input.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
    />
  )
}
