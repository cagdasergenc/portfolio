// src/assets/about.jpg does not exist yet — the site owner needs to supply a
// portrait. import.meta.glob (rather than a static `import portrait from
// '../assets/about.jpg'`) resolves to an empty object when no file matches,
// so its absence doesn't fail the build. Once the file is added, this picks
// it up automatically with no code change.
const PORTRAIT_FILES = import.meta.glob('../assets/about.jpg', { eager: true, query: '?url', import: 'default' })
const portrait = PORTRAIT_FILES['../assets/about.jpg']

export default function About() {
  return (
    <section id="about" className="shell py-24">
      <p className="label">About</p>
      <div className="mt-4 grid gap-12 md:grid-cols-[1fr_1.2fr]">
        {/* Photo stays in the left column: it's lit from frame-right, and by
            this point in the scroll --sun-x has travelled right too — so on
            the left, the portrait's light falls into the page in the same
            direction as every shadow around it. */}
        {portrait ? (
          <img
            src={portrait}
            alt="Çağdaş Ergenç, photographed against a warm wall in afternoon light"
            className="shadow-sun-lg aspect-[4/5] w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="shadow-sun-lg aspect-[4/5] bg-paper-lit" aria-hidden="true" />
        )}
        <div className="max-w-[52ch] space-y-6 text-lg text-muted">
          <p>
            Bio placeholder — site owner to supply two or three short
            paragraphs: background and years of experience, how the work
            happens end to end, current status and availability. Replace
            before shipping.
          </p>
        </div>
      </div>
    </section>
  )
}
