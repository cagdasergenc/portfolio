import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ponytail: flat sheets, no corner curl. Upgrade path is a segmented
// PlaneGeometry with an onBeforeCompile vertex displacement if the flat
// version reads too CG once real covers are in.

// Stable identity across renders (module scope) so useTexture's onLoad
// effect doesn't re-run on every hover-state re-render. Mutating via the
// callback rather than the hook's return value keeps the react-hooks
// immutability lint rule happy.
const toSRGB = (tex) => { tex.colorSpace = THREE.SRGBColorSpace }

/** One printed sheet. Matte paper, real thickness, lit by the page's sun. */
export default function Sheet({ cover, position, rotation, onOpen }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(cover, toSRGB)

  useFrame((_, delta) => {
    if (!ref.current) return
    const targetY = position[1] + (hovered ? 0.22 : 0)
    const targetZ = position[2] + (hovered ? 0.18 : 0)
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 5, delta)
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, targetZ, 5, delta)
  })

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      castShadow
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
      onClick={onOpen}
    >
      <boxGeometry args={[1.5, 1.9, 0.008]} />
      <meshStandardMaterial map={texture} roughness={0.94} metalness={0} />
    </mesh>
  )
}
