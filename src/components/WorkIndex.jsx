import { useRef } from 'react'
import { getProjects } from '../lib/content'
import { useReveal } from '../hooks/useReveal'
import WorkGrid from './WorkGrid'

// Task 1 (Behind Glass): the three.js WorkScene canvas is gone with
// src/three/. Task 5 rebuilds this view on the raw WebGL2 shader; until
// then this always renders the flat grid.
// import WorkScene from '../three/WorkScene'

export default function WorkIndex() {
  const ref = useRef(null)
  useReveal(ref)
  const projects = getProjects()

  return (
    <section ref={ref} id="work" className="shell py-24 md:py-32">
      <p className="label" data-reveal>Case studies</p>
      <h2 className="mb-16 mt-4 text-title" data-reveal>
        {projects.length} projects, start to finish.
      </h2>
      <WorkGrid projects={projects} />
    </section>
  )
}
