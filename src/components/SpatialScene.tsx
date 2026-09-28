import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import ContactForm from './ContactForm'
import Lenis from 'lenis'

const PAGES = 5

const sections = [
  { i: 0, id: 'sp-0', label: 'Home' },
  { i: 1, id: 'sp-1', label: 'About' },
  { i: 2, id: 'sp-2', label: 'Work' },
  { i: 3, id: 'sp-3', label: 'Record' },
  { i: 4, id: 'sp-4', label: 'Contact' },
]

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

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Nav() {
  return (
    <header className="sp-header">
      <button className="sp-brand-btn" data-sp="0" aria-label="Back to top">
        RR<span style={{ color: 'var(--accent)' }}>.</span>
      </button>
      <nav className="sp-nav" aria-label="Sections">
        {sections.slice(1).map((s) => (
          <button className="sp-nav-link" data-sp={s.i} key={s.i}>{s.label}</button>
        ))}
      </nav>
      <span className="sp-pill"><i />Available for work</span>
    </header>
  )
}

function Content() {
  return (
    <div className="sp-content">
      <section className="sp-section sp-section--center" id="sp-0">
        <div className="sp-hero sp-reveal">
          <p className="sp-kicker">Full-stack Developer, Germiston ZA</p>
          <h1 className="sp-title font-display font-bold">
            Ronan <span style={{ color: 'var(--accent)' }}>Roberts</span>
          </h1>
          <p className="sp-lede">
            I build across the stack: web front-ends and back-ends in Java, C#, Python and
            Node.js, and cross-platform mobile in Flutter and Dart.
          </p>
          <div className="sp-hero-cta">
            <button className="btn-primary sp-magnetic" data-sp="2">View work</button>
            <button className="btn-ghost sp-magnetic" data-sp="4">Get in touch</button>
          </div>
        </div>
      </section>

      <section className="sp-section" id="sp-1">
        <div className="sp-panel sp-reveal" style={{ maxWidth: '760px' }}>
          <p className="sp-kicker">About</p>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', marginBottom: '1rem', lineHeight: 1.05 }}>
            I build the whole product, front to back.
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.8rem', maxWidth: '60ch' }}>
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
        <div className="sp-panel sp-reveal" style={{ maxWidth: '640px', width: '100%' }}>
          <p className="sp-kicker">Selected Work</p>
          <div className="sp-work">
            {projects.map((p) => (
              <a className="sp-work-card" href={p.href} target="_blank" rel="noopener noreferrer" key={p.n}>
                <div className="sp-work-top">
                  <span className="num">{p.n}</span>
                  <span className="sp-work-arrow"><ArrowIcon /></span>
                </div>
                <h3 className="font-display font-bold" style={{ fontSize: '1.25rem', margin: '0.2rem 0 0.3rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{p.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-section" id="sp-3">
        <div className="sp-panel sp-reveal" style={{ maxWidth: '860px', width: '100%' }}>
          <p className="sp-kicker">Record</p>
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
        <div className="sp-panel sp-reveal" style={{ maxWidth: '560px', width: '100%' }}>
          <p className="sp-kicker">Contact</p>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1.2rem', lineHeight: 1.02 }}>
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

function Shard({ position, palette, seed }: { position: [number, number, number]; palette: Palette; seed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * (0.1 + seed * 0.02)
    ref.current.rotation.y = t * (0.13 + seed * 0.015)
  })
  const geo = seed % 3
  return (
    <mesh ref={ref} position={position}>
      {geo === 0 && <icosahedronGeometry args={[0.5 + (seed % 4) * 0.18, 0]} />}
      {geo === 1 && <octahedronGeometry args={[0.55 + (seed % 3) * 0.2, 0]} />}
      {geo === 2 && <tetrahedronGeometry args={[0.6 + (seed % 3) * 0.22, 0]} />}
      <meshBasicMaterial color={seed % 2 === 0 ? palette.accent : palette.accent2} wireframe transparent opacity={0.32} />
    </mesh>
  )
}

function Rig({ palette, mouseRef }: { palette: Palette; mouseRef: React.MutableRefObject<[number, number]> }) {
  const scroll = useScroll()
  const flyRef = useRef<THREE.Group>(null)
  const isVisible = useRef(true)
  const { camera } = useThree()
  const navRef = useRef<HTMLElement[]>([])
  const dotRef = useRef<HTMLElement[]>([])
  const panelRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    const onVis = () => { isVisible.current = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis)

    const el = scroll.el
    const jump = (i: number) => {
      const top = (i / (PAGES - 1)) * (el.scrollHeight - el.clientHeight)
      el.scrollTo({ top, behavior: 'smooth' })
    }
    const jumpers = Array.from(document.querySelectorAll<HTMLElement>('[data-sp]'))
    const cleanups = jumpers.map((node) => {
      const i = Number(node.dataset.sp)
      const h = () => jump(i)
      node.addEventListener('click', h)
      return () => node.removeEventListener('click', h)
    })

    navRef.current = Array.from(document.querySelectorAll<HTMLElement>('.sp-nav-link'))
    dotRef.current = Array.from(document.querySelectorAll<HTMLElement>('.sp-dot'))
    panelRef.current = Array.from(document.querySelectorAll<HTMLElement>('.sp-reveal'))

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      cleanups.forEach((fn) => fn())
    }
  }, [scroll])

  const shards = useRef(
    Array.from({ length: 22 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 11,
        -3 - Math.random() * 62,
      ] as [number, number, number],
      seed: i,
    }))
  )

  useFrame((state) => {
    if (!isVisible.current) return
    const o = scroll.offset
    const t = state.clock.elapsedTime

    if (flyRef.current) {
      flyRef.current.position.z = o * 66
      flyRef.current.rotation.z = Math.sin(t * 0.05) * 0.06
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current[0] * 0.7, 0.045)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseRef.current[1] * 0.7, 0.045)
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, mouseRef.current[0] * -0.03, 0.04)
    camera.lookAt(0, 0, camera.position.z - 5)

    const active = Math.min(PAGES - 1, Math.round(o * (PAGES - 1)))
    navRef.current.forEach((n) => n.classList.toggle('active', Number(n.dataset.sp) === active))
    dotRef.current.forEach((d, i) => d.classList.toggle('active', i === active))
    panelRef.current.forEach((p, i) => {
      if (o >= i / PAGES - 0.12) p.classList.add('is-in')
    })
  })

  return (
    <>
      <Stars radius={80} depth={50} count={1600} factor={3} saturation={0} fade speed={0.7} />
      <group ref={flyRef}>
        {shards.current.map((c, i) => (
          <Shard key={i} position={c.pos} palette={palette} seed={c.seed} />
        ))}
      </group>
      <Sparkles count={140} size={1.4} scale={18} color={palette.accent2} speed={0.32} opacity={0.5} />
      <Sparkles count={70} size={2.2} scale={12} color={palette.accent} speed={0.2} opacity={0.35} />
    </>
  )
}

function Overlays() {
  return (
    <>
      <Nav />
      <div className="sp-dots" aria-label="Section navigation">
        {sections.map((s) => (
          <button className={'sp-dot' + (s.i === 0 ? ' active' : '')} data-sp={s.i} key={s.i} aria-label={`Go to ${s.label}`} />
        ))}
      </div>
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

  // Fallback path: smooth scroll, anchor nav, scroll reveals
  useEffect(() => {
    if (mode !== 'fallback') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis: Lenis | null = null
    let rafId = 0
    if (!reduced) {
      lenis = new Lenis({ duration: 1.05 })
      const raf = (time: number) => { lenis?.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)
    }

    const jump = (i: number) => {
      const target = document.getElementById('sp-' + i)
      if (!target) return
      if (lenis) lenis.scrollTo(target, { offset: -72 })
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }
    const jumpers = Array.from(document.querySelectorAll<HTMLElement>('[data-sp]'))
    const cleanups = jumpers.map((node) => {
      const i = Number(node.dataset.sp)
      const h = () => jump(i)
      node.addEventListener('click', h)
      return () => node.removeEventListener('click', h)
    })

    const navLinks = Array.from(document.querySelectorAll<HTMLElement>('.sp-nav-link'))
    const secEls = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const active = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const idx = secEls.indexOf(e.target as HTMLElement)
          navLinks.forEach((n) => n.classList.toggle('active', Number(n.dataset.sp) === idx))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    secEls.forEach((el) => active.observe(el))

    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.sp-reveal'))
    const revObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); revObs.unobserve(e.target) } }),
      { rootMargin: '0px 0px -12% 0px' }
    )
    reveals.forEach((el) => revObs.observe(el))

    return () => {
      cleanups.forEach((fn) => fn())
      active.disconnect()
      revObs.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [mode])

  // Magnetic buttons (both 3D and fallback), pointer-fine only
  useEffect(() => {
    if (mode === 'loading') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const strength = 0.28
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.sp-magnetic'))
    const cleanups = nodes.map((el) => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) * strength
        const y = (e.clientY - (r.top + r.height / 2)) * strength
        el.style.transform = `translate(${x}px, ${y}px)`
      }
      const reset = () => { el.style.transform = '' }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', reset)
      return () => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', reset)
        el.style.transform = ''
      }
    })
    return () => cleanups.forEach((fn) => fn())
  }, [mode])

  if (mode === 'fallback') {
    return (
      <div className="spatial-root">
        <Nav />
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
