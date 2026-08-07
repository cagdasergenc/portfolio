/**
 * The one glass surface definition — same discipline that made `--sun-x`
 * work: every capsule in the site renders through this so the smoked fill
 * (Task 3's measured contrast floor, `rgb(12 12 14 / 0.65)` via `.glass` in
 * index.css) can only be extended by a caller's className, never diluted.
 */
export default function Glass({ as = 'div', className = '', ...props }) {
  const Tag = as
  return <Tag className={`glass ${className}`.trim()} {...props} />
}
