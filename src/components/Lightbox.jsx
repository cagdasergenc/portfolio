import { useEffect, useRef, useState } from 'react'

/**
 * One overlay doing two jobs: enlarging a figure, and reading a deck PDF.
 *
 * Used by: routes/CaseStudy.jsx, which passes whatever is in its `zoom` state
 * Uses: nothing
 *
 * How it works:
 * - Built on the native <dialog> element and showModal(). That gives focus
 *   trapping, an inert page behind it, Escape to close and focus restored to
 *   whatever opened it, without writing any of that by hand. What is left to
 *   add is the close button and closing on a backdrop click.
 * - item.type decides the content: "image" shows the figure, "pdf" embeds the
 *   deck in an iframe.
 * - Below 768px the PDF iframe is a postage stamp and iOS Safari only renders
 *   its first page, so narrow screens get the cover plus a link to open the
 *   file instead.
 */
export default function Lightbox({ item, onClose }) {
  const ref = useRef(null)
  // An embedded PDF at phone width is a postage stamp, and iOS Safari
  // renders only the first page of one in an iframe. Below this width the
  // deck opens as its cover plus the two real actions instead.
  const [cramped, setCramped] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setCramped(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (item && !el.open) el.showModal()
    if (!item && el.open) el.close()
  }, [item])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Covers Escape and any other native close path, so state can never
    // disagree with what the browser is actually showing.
    const handle = () => onClose()
    el.addEventListener('close', handle)
    return () => el.removeEventListener('close', handle)
  }, [onClose])

  const isPdf = item?.type === 'pdf'

  return (
    <dialog
      ref={ref}
      aria-label={item?.title || 'Preview'}
      onClick={(e) => {
        // Backdrop click. The backdrop is the dialog element itself, so a
        // click that lands on it rather than on the panel means outside.
        if (e.target === ref.current) ref.current.close()
      }}
      className="lightbox"
    >
      {item && (
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label text-text">{item.title}</p>
            <div className="flex items-center gap-2">
              {isPdf && (
                <>
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-pill border border-white/20 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-text transition-colors hover:bg-text hover:text-void"
                  >
                    Open original
                  </a>
                  <a
                    href={item.src}
                    download
                    className="rounded-pill border border-white/20 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-text transition-colors hover:bg-text hover:text-void"
                  >
                    Download
                  </a>
                </>
              )}
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="rounded-pill bg-text px-4 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-void transition-opacity hover:opacity-80"
              >
                Close
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            {isPdf && !cramped && (
              <iframe
                src={item.src}
                title={item.title}
                className="h-full w-full rounded-panel border border-white/12 bg-white/5"
              />
            )}

            {isPdf && cramped && (
              <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                {item.poster && (
                  <img
                    src={item.poster}
                    alt=""
                    className="max-h-[46vh] w-full rounded-panel border border-white/12 object-contain"
                  />
                )}
                <p className="max-w-[34ch] text-text-dim">
                  {item.pages ? `${item.pages} landscape pages. ` : ''}
                  Easier to read in your own PDF viewer on a phone.
                </p>
                <a
                  href={item.src}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-pill bg-text px-6 py-4 font-mono text-[12px] uppercase tracking-[0.08em] text-void"
                >
                  Open the PDF
                </a>
              </div>
            )}

            {!isPdf && (
              <div className="flex h-full items-center justify-center">
                <img
                  src={item.src}
                  alt={item.alt || ''}
                  className="max-h-full max-w-full rounded-panel object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
