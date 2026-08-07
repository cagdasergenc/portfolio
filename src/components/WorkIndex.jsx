import { Suspense, lazy, useRef } from 'react'
import { getProjects } from '../lib/content'
import { useLowFi } from '../hooks/useLowFi'
import { useReveal } from '../hooks/useReveal'
import WorkGrid from './WorkGrid'

// Lazy, so three + drei (~890kB raw) land in their own chunk and are only
// fetched by visitors who actually get the canvas. A static import here put
// them in the entry bundle and took it from 284kB to 1173kB — paid for by
// every phone and every reduced-motion visitor that renders the grid instead.
const WorkScene = lazy(() => import('../three/WorkScene'))

export default function WorkIndex() {
  const ref = useRef(null)
  useReveal(ref)
  const projects = getProjects()
  const lowFi = useLowFi()
  // No `p.cover` exists until the site owner supplies content/<slug>/cover.jpg.
  // React Suspense only shows a fallback while a descendant suspends — a
  // component that simply returns null (WorkScene with no covers) does not
  // trigger it — so the "nothing to texture" case is decided here, not left
  // to the fallback.
  const showScene = !lowFi && projects.some((p) => p.cover)

  return (
    <section ref={ref} id="work" className="shell py-24 md:py-32">
      <p className="label" data-reveal>Case studies</p>
      <h2 className="mb-16 mt-4 text-title" data-reveal>
        {projects.length} projects, start to finish.
      </h2>
      {showScene ? (
        <>
          <Suspense fallback={<WorkGrid projects={projects} />}>
            <WorkScene projects={projects} />
          </Suspense>
          <div className="sr-only focus-within:not-sr-only">
            <WorkGrid projects={projects} />
          </div>
        </>
      ) : (
        <WorkGrid projects={projects} />
      )}
    </section>
  )
}
