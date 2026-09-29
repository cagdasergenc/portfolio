/**
 * A section header: tick field, index on the left, reading on the right, and
 * the title under a hairline rule at the foot.
 *
 * Used by: routes/CaseStudy.jsx
 * Uses: nothing
 *
 * How it works: takes index, reading, title and children, and wraps them in
 * one section with its own id so the nav and the sidebar can link to it.
 * titleAs lets the case study render the title as an h1 while other uses get
 * an h2, so heading order stays correct on every page.
 */
export default function Band({ index, reading, title, id, titleAs = 'h2', children, className = '' }) {
  const TitleTag = titleAs
  return (
    <section id={id} className={`shell py-24 md:py-32 ${className}`}>
      <div className="band-ticks" aria-hidden="true" data-reveal />

      <div className="mt-5 flex items-baseline justify-between gap-6">
        <span className="label">{index}</span>
        <span className="label text-right">{reading}</span>
      </div>

      <hr className="mt-4 border-0 border-t border-white/12" />

      {title && (
        <TitleTag className="mt-6 max-w-[20ch] text-title" data-reveal>
          {title}
        </TitleTag>
      )}

      {children}
    </section>
  )
}
