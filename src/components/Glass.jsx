/**
 * The one glass surface in the site.
 *
 * Used by: components/Nav.jsx, Stage.jsx, WorkGridFlat.jsx
 * Uses: the .glass class in index.css
 *
 * How it works: every capsule renders through this, so the smoked fill
 * (rgb(12 12 14 / 0.65), the level measured to keep text readable over a
 * white cover) can be extended by a caller's className but never watered
 * down. `as` swaps the tag, so the nav can be a real <nav>.
 */
export default function Glass({ as = 'div', className = '', ...props }) {
  const Tag = as
  return <Tag className={`glass ${className}`.trim()} {...props} />
}
