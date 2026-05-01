export default function ProjectCard({ image, title, subtitle, fileUrl, fileType, imageOnly, cardBg, href, fill, onOpen }) {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else if (fileUrl && fileType && onOpen) {
      onOpen(fileUrl, fileType)
    }
  }

  const clickable = href || fileUrl

  return (
    <div
      className={`flex flex-col gap-6 ${clickable ? 'cursor-pointer group' : ''}`}
      onClick={handleClick}
    >
      <div className={`relative overflow-hidden ${imageOnly ? 'bg-transparent' : 'bg-white'}`} style={cardBg ? { background: cardBg } : undefined}>
        <img
          src={image || 'https://placehold.co/411x330/111111/444444'}
          alt={title || ''}
          className={`w-full transition-transform duration-300 group-hover:scale-105 ${imageOnly || fill ? 'object-cover' : 'object-contain p-8'}`}
          style={{ aspectRatio: '411/330' }}
        />
        {clickable && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded">
              View
            </span>
          </div>
        )}
      </div>
      {!imageOnly && (
        <div className="flex flex-col gap-2">
          <p
            style={{ fontFamily: 'Epilogue, sans-serif', fontSize: 20, fontWeight: 600, lineHeight: '30px', margin: 0 }}
            className="text-white"
          >
            {title}
          </p>
          {subtitle && (
            <p
              style={{ fontFamily: 'Epilogue, sans-serif', fontSize: 17, fontWeight: 400, lineHeight: '27px', margin: 0 }}
              className="text-white"
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
