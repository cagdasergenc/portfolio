import { useParams } from 'react-router-dom'
import { getProject } from '../lib/content'
import NotFound from './NotFound'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />
  return <article className="px-6 py-40 md:px-12"><h1>{project.title}</h1></article>
}
