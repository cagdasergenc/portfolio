import ProjectCard from './ProjectCard'

export default function ProjectGrid({ title, items, imageOnly, dense, onOpen }) {
  return (
    <section
      id="portfolio"
      className="w-full py-[42px] px-20 md:px-10 sm:px-6 flex flex-col items-center gap-11"
    >
      <h2
        style={{ fontFamily: 'Epilogue, sans-serif', fontSize: 32, fontWeight: 600, lineHeight: '42px', margin: 0 }}
        className="text-white text-center"
      >
        {title}
      </h2>
      <div className={`w-full grid gap-4 ${dense ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item, i) => (
          <ProjectCard
            key={i}
            {...item}
            imageOnly={imageOnly}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  )
}
