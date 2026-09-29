import { Link } from 'react-router-dom'
import { getProjects } from '../lib/content'
import resume from '../assets/resume.pdf?url'

/** A readable introduction and every project available without scroll staging. */
export default function Intro() {
  const projects = getProjects()
  const featured = projects[0]

  return (
    <section className="portfolio-intro shell" aria-labelledby="intro-title">
      <div className="intro-layout">
        <div className="intro-copy">
          <p className="label text-text">Çağdaş Ergenç · Product & UX designer</p>
          <h1 id="intro-title" className="intro-title">Making complex tasks feel simple.</h1>
          <p className="intro-description">I turn research into clear interfaces and working prototypes. My work spans healthcare, AI interactions, and e-commerce.</p>
          <p className="intro-location">Based in Barcelona · Open to Product / UX roles across the EU</p>
          <div className="intro-actions">
            <Link className="action-primary" to={`/work/${featured.slug}`} data-analytics="case_study_select" data-project={featured.slug} data-placement="hero">View featured case study <span aria-hidden="true">↗</span></Link>
            <a className="action-secondary" href={resume} download="Cagdas-Ergenc-CV.pdf" data-analytics="cv_click" data-placement="hero">Download CV <span aria-hidden="true">↓</span></a>
          </div>
          <p className="intro-proof"><strong>14 caregivers. 5 tested flows.</strong><br />A working healthcare prototype, developed with a four-designer team at IED Barcelona for a Fujitsu brief.</p>
        </div>
        <Link className="featured-visual" to={`/work/${featured.slug}`} data-analytics="case_study_select" data-project={featured.slug} data-placement="hero_image" aria-label={`View ${featured.title} case study`}>
          <img src={featured.cover} alt="Pocket Pediatrics: a care dashboard, visit summaries, and follow-up tools for families." fetchPriority="high" decoding="async" />
          <div className="featured-caption"><span>{featured.title}</span><span className="label text-text">Working prototype ↗</span></div>
        </Link>
      </div>
      <div id="work" className="selected-work">
        <div className="selected-heading"><h2 className="label">Selected work</h2><span className="label">01 — {String(projects.length).padStart(2, '0')}</span></div>
        <ul className="project-choices">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link className="project-choice" to={`/work/${project.slug}`} data-analytics="case_study_select" data-project={project.slug} data-placement="selected_work">
                <div className="project-choice-top"><span className="label">{String(index + 1).padStart(2, '0')} / {project.card_type || project.role}</span><span aria-hidden="true">↗</span></div>
                <h3>{project.title}</h3>
                <p>{project.card_description || project.tagline}</p>
                <span className="project-proof">{project.card_evidence}</span>
                <span className="project-read">Read case study <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
