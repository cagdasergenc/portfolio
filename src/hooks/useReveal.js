import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveals [data-reveal] and [data-reveal-mask] descendants as they enter.
 * Entry only — nothing pins, nothing scrubs, nothing hijacks the scroll.
 *
 * A [data-reveal] element may carry `data-reveal-delay="0.1"` for a small
 * per-element stagger without a timeline (three elements don't justify one).
 *
 * No-ops entirely under prefers-reduced-motion: reduce — the matching CSS
 * pre-hide rule in index.css is scoped to the same query, so a
 * reduced-motion visitor is simply never hidden in the first place.
 */
export function useReveal(scope) {
  useLayoutEffect(() => {
    /**
     * Watchdog. The pre-hide CSS sets opacity:0 and waits for GSAP, which
     * runs on requestAnimationFrame — so anything that stops rAF (a page
     * opened in a background tab, a throttled renderer, GSAP failing to
     * load at all) leaves the entire page permanently blank.
     *
     * This is not theoretical: with rAF throttled to zero the hero h1 and
     * standfirst rendered invisible while the rest of the plate drew fine.
     *
     * setTimeout does not depend on rAF, so it still fires in exactly the
     * situations that break the animation. After 1.6s the pre-hide is
     * disarmed and everything is simply visible. Content beats choreography.
     */
    const watchdog = setTimeout(() => {
      document.documentElement.setAttribute('data-reveal-failsafe', '')
    }, 1600)

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: Number(el.dataset.revealDelay) || 0,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        gsap.utils.toArray('[data-reveal-mask]').forEach((el) => {
          gsap.to(el, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
      }, scope)
      return () => ctx.revert()
    })

    return () => {
      clearTimeout(watchdog)
      mm.revert()
    }
  }, [scope])
}
