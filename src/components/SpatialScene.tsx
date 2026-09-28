import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Stars, Sparkles, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import ContactForm from './ContactForm'

const PAGES = 5

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

const skills = [
  { k: 'Languages', v: ['Java', 'C#', 'Python', 'JavaScript', 'SQL', 'Dart', 'Rust'] },
  { k: 'Web', v: ['HTML', 'CSS', 'Node.js', 'REST APIs'] },
  { k: 'Mobile', v: ['Flutter', 'Dart', 'Kivy'] },
  { k: 'Cloud / DB', v: ['Azure', 'Firebase'] },
  { k: 'Tools', v: ['Git', 'CI/CD', 'pytest', 'Agile'] },
]

const projects = [
  { n: '01', title: 'FFP', desc: 'Fleet Failure Predictor: web dashboard, REST API, database, and an offline-first Flutter app.', href: 'https://www.echosoftware.co.za/products/ffp' },
  { n: '02', title: 'BruvTorrent', desc: 'A BitTorrent client built from scratch in Python with a PySide6 desktop UI.', href: 'https://github.com/Ronan-R-R/BruvTorrent' },
  { n: '03', title: 'yt-mp3', desc: 'Cross-platform audio downloader for desktop and Android, built via GitHub Actions.', href: 'https://github.com/Ronan-R-R/yt-mp3' },
  { n: '04', title: 'Echo Software', desc: 'Live company website for a Pretoria-based software studio.', href: 'https://echosoftware.co.za' },
  { n: '05', title: 'SkyCast', desc: 'Real-time weather dashboard with a 5-day forecast and interactive maps.', href: 'https://ronan-r-r.github.io/SkyCast/' },
]

const record = [
  { year: '2026 -', role: 'Junior Software Engineer', org: 'Coast IT · Full-time' },
  { year: '2025', role: 'Junior Software Engineer', org: 'Coast IT · Internship' },
  { year: '2025', role: 'Intern', org: 'Open Vantage' },
  { year: '2025 - 26', role: 'Freelance Web Developer', org: 'Self-employed' },
  { year: '2023 -', role: 'Software Engineering (NQF 6)', org: 'CTU Training Solutions' },
]

const certs = [
  'Software Engineer NQF 6 - MICT SETA (2025)',
  'IT Systems Development NQF 5 - MICT SETA (2024)',
  'AI-900: Azure AI Fundamentals - Microsoft (2024)',
  'IT Specialist: JavaScript - Certiport (2023)',
  'IT Specialist: HTML & CSS - Certiport (2023)',
]

function Content() {
  return (
    <div className="sp-content">
      <section className="sp-section sp-section--center" id="sp-0">
        <div>
          <div className="sp-eyebrow">Full-stack Developer - Germiston, ZA</div>
          <h1 className="sp-title font-display font-bold">
            Ronan <span className="gradient-text">Roberts</span>
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '48ch', margin: '1.4rem auto 0', fontSize: '1.05rem' }}>
            I build across the stack: web front-ends and back-ends in Java, C#, Python and
            Node.js, and cross-platform mobile in Flutter and Dart.
          </p>
        </div>
      </section>

      <section className="sp-section" id="sp-1">
        <div className="sp-panel" style={{ maxWidth: '760px' }}>
          <div className="sp-eyebrow">01 - About</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', marginBottom: '1rem' }}>
            I build the whole product, front to back.
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.8rem' }}>
            Completing a Software Engineer qualification (NQF 6) with CTU, backed by MICT SETA and
            Microsoft certifications. Currently a Junior Software Engineer at Coast IT. Open to
            full-time, part-time, contract, and freelance work.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.4rem' }}>
            {skills.map((g) => (
              <div className="sp-skill-col" key={g.k}>
                <h4>{g.k}</h4>
                <ul>{g.v.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-section" id="sp-2">
        <div className="sp-panel" style={{ maxWidth: '620px' }}>
          <div className="sp-eyebrow">02 - Selected Work</div>
          <div className="sp-work">
            {projects.map((p) => (
              <a className="sp-work-card" href={p.href} target="_blank" rel="noopener noreferrer" key={p.n}>
                <span className="num">{p.n}</span>
                <h3 className="font-display font-bold" style={{ fontSize: '1.25rem', margin: '0.2rem 0 0.3rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-section" id="sp-3">
        <div className="sp-panel" style={{ maxWidth: '860px', width: '100%' }}>
          <div className="sp-eyebrow">03 - Record</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 className="font-display font-bold" style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>Experience &amp; Education</h3>
              {record.map((r) => (
                <div key={r.role + r.year} style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr', gap: '0.8rem', padding: '0.6rem 0', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>{r.year}</span>
                  <span>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.92rem' }}>{r.role}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{r.org}</span>
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-display font-bold" style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>Certifications</h3>
              {certs.map((c) => (
                <div key={c} style={{ padding: '0.6rem 0', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section" id="sp-4">
        <div className="sp-panel" style={{ maxWidth: '560px', width: '100%' }}>
          <div className="sp-eyebrow">04 - Contact</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1.2rem' }}>
            Let&apos;s work together.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.6rem', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
            <a href="mailto:ronanr2003@gmail.com" style={{ color: 'var(--accent)' }}>ronanr2003@gmail.com</a>
            <a href="https://www.linkedin.com/in/rr-roberts/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>linkedin.com/in/rr-roberts</a>
            <a href="https://github.com/Ronan-R-R" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>github.com/Ronan-R-R</a>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

function Crystal({ position, palette, seed }: { position: [number, number, number]; palette: Palette; seed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * (0.1 + seed * 0.03)
    ref.current.rotation.y = t * (0.14 + seed * 0.02)
  })
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.5 + (seed % 3) * 0.25, 0]} />
      <meshBasicMaterial color={seed % 2 === 0 ? palette.accent : palette.accent2} wireframe transparent opacity={0.4} />
    </mesh>
  )
}

function Rig({ palette, mouseRef }: { palette: Palette; mouseRef: React.MutableRefObject<[number, number]> }) {
  const scroll = useScroll()
  const flyRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const isVisible = useRef(true)
  const { camera, gl } = useThree()

  useEffect(() => {
    const onVis = () => { isVisible.current = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis)

    // Wire nav dots + scroll hint to the drei scroll element
    const el = scroll.el
    const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('.sp-dot'))
    const handlers: Array<() => void> = []
    dots.forEach((dot, i) => {
      const h = () => {
        const top = (i / (PAGES - 1)) * (el.scrollHeight - el.clientHeight)
        el.scrollTo({ top, behavior: 'smooth' })
      }
      dot.addEventListener('click', h)
      handlers.push(() => dot.removeEventListener('click', h))
    })

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      handlers.forEach((fn) => fn())
    }
  }, [scroll, gl])

  const crystals = useRef(
    Array.from({ length: 14 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        -4 - Math.random() * 60,
      ] as [number, number, number],
      seed: i,
    }))
  )

  const dotsRef = useRef<HTMLButtonElement[]>([])
  const hintRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    dotsRef.current = Array.from(document.querySelectorAll<HTMLButtonElement>('.sp-dot'))
    hintRef.current = document.querySelector<HTMLElement>('.sp-hint')
  }, [])

  useFrame((state) => {
    if (!isVisible.current) return
    const o = scroll.offset
    const t = state.clock.elapsedTime

    if (flyRef.current) flyRef.current.position.z = o * 66

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.08
      coreRef.current.rotation.y = t * 0.12
      coreRef.current.position.z = -2 + o * 66
    }

    // Camera parallax from pointer
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current[0] * 0.6, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseRef.current[1] * 0.6, 0.04)
    camera.lookAt(0, 0, camera.position.z - 5)

    // Active dot + hint fade (DOM writes, no React state churn)
    const active = Math.min(PAGES - 1, Math.round(o * (PAGES - 1)))
    dotsRef.current.forEach((d, i) => d.classList.toggle('active', i === active))
    if (hintRef.current) hintRef.current.style.opacity = o > 0.02 ? '0' : '1'
  })

  return (
    <>
      <Stars radius={80} depth={50} count={1400} factor={3} saturation={0} fade speed={0.6} />
      <group ref={flyRef}>
        {crystals.current.map((c, i) => (
          <Crystal key={i} position={c.pos} palette={palette} seed={c.seed} />
        ))}
      </group>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={coreRef} position={[0, 0, -2]}>
          <icosahedronGeometry args={[1.4, 5]} />
          <MeshDistortMaterial color={palette.accent} distort={0.42} speed={2} roughness={0.08} metalness={0.2} transparent opacity={0.92} />
        </mesh>
      </Float>
      <Sparkles count={120} size={1.4} scale={16} color={palette.accent2} speed={0.3} opacity={0.5} />
    </>
  )
}

function Overlays() {
  return (
    <>
      <div className="sp-brand">RR<span style={{ color: 'var(--accent)' }}>.</span></div>
      <div className="sp-dots" aria-label="Section navigation">
        {Array.from({ length: PAGES }).map((_, i) => (
          <button className={'sp-dot' + (i === 0 ? ' active' : '')} key={i} aria-label={`Go to section ${i + 1}`} />
        ))}
      </div>
      <div className="sp-hint">Scroll to explore</div>
    </>
  )
}

export default function SpatialScene() {
  const [mode, setMode] = useState<'loading' | '3d' | 'fallback'>('loading')
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

    let webgl = false
    try {
      const c = document.createElement('canvas')
      webgl = !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      webgl = false
    }

    const use3D = webgl && !reducedMotion && !smallViewport && !lowCPU && !lowMemory
    const root = document.documentElement
    root.classList.add(use3D ? 'spatial-mode' : 'spatial-fallback')
    setMode(use3D ? '3d' : 'fallback')

    if (use3D) {
      const onMouse = (e: MouseEvent) => {
        mouseRef.current = [
          (e.clientX / window.innerWidth) * 2 - 1,
          -((e.clientY / window.innerHeight) * 2 - 1),
        ]
      }
      window.addEventListener('mousemove', onMouse, { passive: true })
      return () => {
        window.removeEventListener('mousemove', onMouse)
        root.classList.remove('spatial-mode')
      }
    }
    return () => { root.classList.remove('spatial-fallback') }
  }, [])

  if (mode === 'fallback') {
    return (
      <div className="spatial-root">
        <div className="sp-brand">RR<span style={{ color: 'var(--accent)' }}>.</span></div>
        <Content />
      </div>
    )
  }

  if (mode === 'loading') return <div className="spatial-root" />

  return (
    <div className="spatial-root">
      <Canvas
        dpr={[1, Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 2)]}
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 6]} intensity={0.9} color={palette.accent2} />
        <pointLight position={[-4, -3, -3]} intensity={0.5} color={palette.accent} />
        <ScrollControls pages={PAGES} damping={0.28}>
          <Rig palette={palette} mouseRef={mouseRef} />
          <Scroll html>
            <Content />
          </Scroll>
        </ScrollControls>
      </Canvas>
      <Overlays />
    </div>
  )
}
