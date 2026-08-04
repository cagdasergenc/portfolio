import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { useSun } from './hooks/useSun'

function Probe() {
  useSun()
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <main className="min-h-[300vh] p-16">
        <p className="label">Sun probe</p>
        <h1 className="text-[12vw]">Lit paper</h1>
        <div className="shadow-sun-lg mt-16 h-64 w-80 bg-paper-lit" />
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Probe /></StrictMode>,
)
