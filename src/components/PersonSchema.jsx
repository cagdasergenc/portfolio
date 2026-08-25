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
