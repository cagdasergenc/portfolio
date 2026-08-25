export const SITE_URL = 'https://cagdasergenc.com'
export const SITE_NAME = 'Çağdaş Ergenç'

/**
 * Per-route document metadata. React 19 hoists <title>, <meta>, and <link>
 * rendered anywhere in the tree up to <head> automatically, deduping by tag
 * type and key attribute (name/property/rel) -- no react-helmet needed.
 *
 * index.html carries zero page-specific tags (title, description, og:*,
 * canonical) for exactly this reason: every route renders its own via this
 * component, so there is only ever one source for each, never a static
 * fallback silently coexisting with a route's real one.
 */
export default function SEO({ title, description, path = '/', noindex = false }) {
  const url = `${SITE_URL}${path}`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
    </>
  )
}
