import { webWork } from '../data/web'

export default function WebBand() {
  return (
    <section id="web" className="shell py-24">
      <p className="label">Web and e-commerce</p>
      <h2 className="mb-12 mt-4 text-[clamp(2rem,5vw,3.5rem)]">Shops I designed and built.</h2>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {webWork.map((w) => {
          const inner = (
            <div className="flex items-baseline justify-between gap-6 py-6">
              <span className="text-2xl">{w.title}</span>
              <span className="label">{w.status === 'archived' ? 'Offline' : w.role}</span>
            </div>
          )
          return (
            <li key={w.title}>
              {w.href ? (
                <a href={w.href} target="_blank" rel="noreferrer" className="block transition-opacity hover:opacity-60">{inner}</a>
              ) : (
                <div className="opacity-50">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
