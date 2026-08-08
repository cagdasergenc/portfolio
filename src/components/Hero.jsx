import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Plate 00 — the opening.
 *
 * MASTER.md §4's fourth structural rule: the display line is BOTTOM-anchored,
 * sitting under a hairline rule at the foot of a tall silent field, rather
 * than top-set above a column. The sibling branch opens with the h1 near the
 * top of a centred measure; this one makes you fall through empty plate to
 * reach it.
 *
 * The copy is the owner's own confirmed words and ships byte-identical.
 */
export default function Hero() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section
      ref={ref}
      className="shell relative flex min-h-[94vh] flex-col justify-end pb-20 pt-40"
    >
      {/* Plate header: the annotation runs first, as a reading, not a title. */}
      <div className="flex items-baseline justify-between gap-6" data-reveal>
        <p className="label">Çağdaş Ergenç — Product and UX Design</p>
        <p className="label hidden text-right sm:block">41°23′N 2°10′E</p>
      </div>

      {/* The silent field. Nothing happens here on purpose — it is what makes
          the display line land. */}
      <div className="min-h-[16vh] flex-1" aria-hidden="true" />

      <div className="band-ticks mb-5" aria-hidden="true" data-reveal />
      <hr className="border-0 border-t border-white/12" />

      <h1
        className="mt-8 max-w-[22ch] text-hero tracking-[-0.02em]"
        data-reveal
        data-reveal-delay="0.08"
      >
        I work from research through to something people can actually click.
      </h1>

      <p
        className="mt-8 max-w-[48ch] text-lg text-text-dim"
        data-reveal
        data-reveal-delay="0.16"
      >
        Five years across industrial, digital, and AI-assisted design.
        Turkey, Poland, Germany, now Barcelona.
      </p>
    </section>
  )
}
