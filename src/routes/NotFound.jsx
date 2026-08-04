import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="shell py-40">
      <p className="label">404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,8vw,6rem)]">This page moved or never existed.</h1>
      <Link className="mt-8 inline-block underline underline-offset-4" to="/">Back to the work</Link>
    </section>
  )
}
