/**
 * A measurement band — the section header for this world.
 *
 * Three of MASTER.md §4's structural rules live here, and together they are
 * what stops this reading as the sibling branch with different colours:
 *
 *   - a dense tick field divides sections, instead of whitespace alone
 *   - sections carry a plate index (I / II / III) and a right-aligned reading
 *   - the display title sits UNDER a hairline rule at the FOOT of the band,
 *     not above its content
 *
 * Lit Paper sets every section title top-first above a centred column. The
 * inversion is the point.
 */
export default function Band({ index, reading, title, id, children, className = '' }) {
  return (
    <section id={id} className={`shell py-24 md:py-32 ${className}`}>
      <div className="band-ticks" aria-hidden="true" data-reveal />

      <div className="mt-5 flex items-baseline justify-between gap-6">
        <span className="label">{index}</span>
        <span className="label text-right">{reading}</span>
      </div>

      <hr className="mt-4 border-0 border-t border-white/12" />

      {title && (
        <h2 className="mt-6 max-w-[20ch] text-title" data-reveal>
          {title}
        </h2>
      )}

      {children}
    </section>
  )
}
