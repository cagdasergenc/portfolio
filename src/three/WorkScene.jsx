import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import Sheet from './Sheet'

/** Reads the page's sun from CSS so the scene can never disagree with
 *  the shadows in the HTML around it. */
function SunLight() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const style = getComputedStyle(document.documentElement)
    const x = parseFloat(style.getPropertyValue('--sun-x')) || -0.35
    const y = parseFloat(style.getPropertyValue('--sun-y')) || 0.92
    ref.current.position.set(x * 6, y * 6, 4)
  })
  return <directionalLight ref={ref} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
}

export default function WorkScene({ projects }) {
  const navigate = useNavigate()
  const withCovers = projects.filter((p) => p.cover)

  // No covers supplied yet — the caller renders WorkGrid instead of
  // mounting this component at all in that case, but bail defensively
  // rather than hand useTexture an undefined src.
  if (withCovers.length === 0) return null

  return (
    <div className="h-[70vh] w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 5], fov: 38 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.1} />
        <SunLight />
        <Suspense fallback={null}>
          {withCovers.map((p, i) => (
            <Sheet
              key={p.slug}
              cover={p.cover}
              position={[(i - (withCovers.length - 1) / 2) * 1.9, 0, 0]}
              rotation={[0, (i - (withCovers.length - 1) / 2) * -0.12, 0]}
              onOpen={() => navigate(`/work/${p.slug}`)}
            />
          ))}
        </Suspense>
        <ContactShadows position={[0, -1.15, 0]} opacity={0.42} scale={12} blur={2.6} far={3} />
      </Canvas>
    </div>
  )
}
