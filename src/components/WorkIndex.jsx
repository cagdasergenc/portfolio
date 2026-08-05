import { getProjects } from '../lib/content'
import WorkGrid from './WorkGrid'

export default function WorkIndex() {
  const projects = getProjects()

  return (
    <section id="work" className="shell py-24 md:py-32">
      <p className="label">Case studies</p>
      <h2 className="mb-16 mt-4 text-[clamp(2rem,5vw,3.5rem)]">
        {projects.length} projects, start to finish.
      </h2>
      {/* Task 9: swap for `useLowFi() ? <WorkGrid /> : <Suspense fallback={<WorkGrid />}><WorkScene /></Suspense>`
          once src/three/WorkScene.jsx exists. Forced to the grid path until then. */}
      <WorkGrid projects={projects} />
    </section>
  )
}
