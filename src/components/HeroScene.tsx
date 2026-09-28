import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Palette {
  accent: string
  accent2: string
  text: string
}

function readPalette(): Palette {
  if (typeof window === 'undefined') {
    return { accent: '#22d3ee', accent2: '#2dd4bf', text: '#eaf2ff' }
  }
  const s = getComputedStyle(document.documentElement)
  return {
    accent: s.getPropertyValue('--accent').trim() || '#22d3ee',
    accent2: s.getPropertyValue('--accent-2').trim() || '#2dd4bf',
    text: s.getPropertyValue('--text').trim() || '#eaf2ff',
  }
}

function Core({ mouseRef, palette }: { mouseRef: React.MutableRefObject<[number, number]>; palette: Palette }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const isVisible = useRef(true)
  const { gl } = useThree()

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { isVisible.current = e.isIntersecting },
      { threshold: 0 }
    )
    obs.observe(gl.domElement)

    const onVisibility = () => { isVisible.current = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      obs.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [gl])

  useFrame((state) => {
    if (!isVisible.current || !meshRef.current || !groupRef.current || !orbitRef.current) return
    const t = state.clock.elapsedTime

    meshRef.current.rotation.x = t * 0.07
    meshRef.current.rotation.y = t * 0.11

    orbitRef.current.rotation.z = t * 0.35
    orbitRef.current.rotation.y = t * 0.2

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseRef.current[1] * 0.22,
      0.04
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseRef.current[0] * 0.22,
      0.04
    )
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.7, 5]} />
          <MeshDistortMaterial
            color={palette.accent}
            distort={0.4}
            speed={2.1}
            roughness={0.06}
            metalness={0.22}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[1.82, 2]} />
          <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={0.12} />
        </mesh>

        {/* Orbiting ring of nodes */}
        <group ref={orbitRef} rotation={[Math.PI / 3, 0, 0]}>
          <mesh>
            <torusGeometry args={[2.7, 0.012, 8, 120]} />
            <meshBasicMaterial color={palette.accent2} transparent opacity={0.35} />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 2.7, Math.sin(a) * 2.7, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={i % 2 === 0 ? palette.accent : palette.accent2} />
              </mesh>
            )
          })}
        </group>
      </Float>
    </group>
  )
}

function StaticPoster({ palette }: { palette: Palette }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${palette.accent}44 0%, ${palette.accent}12 55%, transparent 75%)`,
          boxShadow: `0 0 80px ${palette.accent}55`,
        }}
      />
    </div>
  )
}

export default function HeroScene() {
  const [canRender3D, setCanRender3D] = useState(false)
  const [palette, setPalette] = useState<Palette>(readPalette)
  const mouseRef = useRef<[number, number]>([0, 0])

  useEffect(() => {
    setPalette(readPalette())

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallViewport = window.innerWidth < 768
    const lowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2
    const lowMemory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4) < 2

    if (!reducedMotion && !smallViewport && !lowCPU && !lowMemory) {
      setCanRender3D(true)
    }

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ]
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  if (!canRender3D) return <StaticPoster palette={palette} />

  return (
    <Canvas
      dpr={[1, Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 2)]}
      camera={{ position: [0, 0, 5], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 4]} intensity={0.9} color={palette.accent2} />
      <pointLight position={[-4, -3, -3]} intensity={0.5} color={palette.accent} />
      <pointLight position={[3, -2, 2]} intensity={0.3} color={palette.text} />
      <Core mouseRef={mouseRef} palette={palette} />
      <Sparkles count={180} size={1.2} scale={9} color={palette.accent2} speed={0.25} opacity={0.55} />
    </Canvas>
  )
}
