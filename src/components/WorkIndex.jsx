import { useRef } from 'react'
import { getProjects } from '../lib/content'
import { useReveal } from '../hooks/useReveal'
import { useLowFi } from '../hooks/useLowFi'
import GlassCard from './GlassCard'
import WorkGridFlat from './WorkGridFlat'
import Band from './Band'

export default function WorkIndex() {
  const ref = useRef(null)
  useReveal(ref)
  const projects = getProjects()
  const lowFi = useLowFi()

  // Decided here, not left for GlassCard to bail out of: Suspense does not
  // fire for a component that renders null, so a canvas-less path has to be
  // chosen before render, not discovered after.
  const showGlass = !lowFi && projects.some((p) => p.cover)

  return (
    <div ref={ref}>
      <Band
        id="work"
        index="I — III"
        reading={`${projects.length} specimens · research to build`}
        title={`${projects.length} projects, start to finish.`}
      >
        {showGlass ? (
        <>
          <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2" aria-hidden="true">
            {projects.map((p) => (
              <li key={p.slug} data-reveal>
                <GlassCard project={p} />
              </li>
            ))}
          </ul>
          {/* The grid above depends on WebGL and is hidden from assistive
              tech and tab order (GlassCard sets tabIndex={-1} on its own
              link). This flat, always-focusable duplicate is the real
              keyboard path — it never depends on the shader. */}
          <div className="sr-only focus-within:not-sr-only">
            <WorkGridFlat projects={projects} />
          </div>
        </>
        ) : (
          <WorkGridFlat projects={projects} />
        )}
      </Band>
    </div>
  )
}
