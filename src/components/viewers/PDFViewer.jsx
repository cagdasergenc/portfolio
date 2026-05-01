import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PDFViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState(null)

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded overflow-auto max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm cursor-pointer border-0 hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
        {error ? (
          <div className="p-8 text-red-600 font-mono text-sm">{error}</div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1) }}
            onLoadError={(err) => setError(err.message)}
          >
            <Page pageNumber={pageNumber} width={Math.min(window.innerWidth * 0.85, 900)} />
          </Document>
        )}
      </div>

      {numPages && (
        <div
          className="mt-4 flex items-center gap-4 bg-black/70 text-white px-4 py-2 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="cursor-pointer bg-transparent border-0 text-white disabled:opacity-40 hover:opacity-70 transition-opacity text-lg"
          >
            ‹
          </button>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="cursor-pointer bg-transparent border-0 text-white disabled:opacity-40 hover:opacity-70 transition-opacity text-lg"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
