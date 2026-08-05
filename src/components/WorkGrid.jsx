import { Link } from 'react-router-dom'

/**
 * No `p.cover` exists for any project yet. Rather than an empty box or a
 * placeholder image, the cover slot becomes a typographic poster — title,
 * tagline, year, role — set on lit paper with the sun-derived shadow. The
 * `p.cover` ternary below is the only thing that changes once a real cover
 * lands: no restructuring, just the truthy branch taking over.
 */
export default function WorkGrid({ projects }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((p) => (
        <li key={p.slug} data-reveal>
          <Link to={`/work/${p.slug}`} className="group block">
            {p.cover ? (
              <>
                <div className="shadow-sun-lg overflow-hidden bg-paper-lit transition-transform duration-500 ease-out group-hover:-translate-y-1" data-reveal-mask>
                  <img
                    src={p.cover}
                    alt={`Cover of the ${p.title} case study`}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="text-3xl">
                    {p.title}
                    {p.live_url && (
                      <span className="label ml-3 align-middle text-accent">Live</span>
                    )}
                  </h3>
                  <span className="label shrink-0">{p.year}</span>
                </div>
                <p className="mt-1 text-muted">{p.tagline}</p>
                <p className="label mt-3">{p.role}</p>
              </>
            ) : (
              <div className="shadow-sun-lg flex aspect-[4/5] w-full flex-col justify-between bg-paper-lit p-8 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="label">{p.role}</span>
                  <span className="label">{p.year}</span>
                </div>
                <div>
                  <h3 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05]">
                    {p.title}
                    {p.live_url && (
                      <span className="label ml-3 align-middle text-accent">Live</span>
                    )}
                  </h3>
                  <p className="mt-4 max-w-[38ch] text-muted">{p.tagline}</p>
                </div>
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
