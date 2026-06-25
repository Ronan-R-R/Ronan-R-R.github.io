import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function Core({ mouseRef }: { mouseRef: React.MutableRefObject<[number, number]> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
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
    if (!isVisible.current || !meshRef.current || !groupRef.current) return

    meshRef.current.rotation.x = state.clock.elapsedTime * 0.07
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.11

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
          <icosahedronGeometry args={[1.75, 4]} />
          <MeshDistortMaterial
            color="#7C5CFF"
            distort={0.38}
            speed={2.2}
            roughness={0.08}
            metalness={0.18}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[1.84, 2]} />
          <meshBasicMaterial
            color="#A78BFA"
            wireframe
            transparent
            opacity={0.11}
          />
        </mesh>
      </Float>
    </group>
  )
}

function StaticPoster() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,92,255,0.28) 0%, rgba(124,92,255,0.06) 55%, transparent 75%)',
          boxShadow: '0 0 80px rgba(124,92,255,0.35)',
        }}
      />
    </div>
  )
}

export default function HeroScene() {
  const [canRender3D, setCanRender3D] = useState(false)
  const mouseRef = useRef<[number, number]>([0, 0])

  useEffect(() => {
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

  if (!canRender3D) return <StaticPoster />

  return (
    <Canvas
      dpr={[1, Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 2)]}
      camera={{ position: [0, 0, 5], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 4]} intensity={0.9} color="#A78BFA" />
      <pointLight position={[-4, -3, -3]} intensity={0.5} color="#7C5CFF" />
      <pointLight position={[3, -2, 2]} intensity={0.3} color="#ECECF4" />
      <Core mouseRef={mouseRef} />
      <Sparkles
        count={180}
        size={1.2}
        scale={9}
        color="#A78BFA"
        speed={0.25}
        opacity={0.55}
      />
    </Canvas>
  )
}
