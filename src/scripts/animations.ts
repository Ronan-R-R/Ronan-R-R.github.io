import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const track = document.getElementById('h-track')
const outer = document.getElementById('h-outer')
const panels = gsap.utils.toArray<HTMLElement>('.h-panel')

const bar = document.getElementById('h-bar')
const cur = document.getElementById('h-cur')
const label = document.getElementById('h-label')
const navBtns = Array.from(document.querySelectorAll<HTMLElement>('.h-nav button'))
const labels = panels.map((p) => p.dataset.label || p.id)

function startLenis() {
  const lenis = new Lenis({ duration: 1.05 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

function setActive(idx: number) {
  if (cur) cur.textContent = String(idx + 1).padStart(2, '0')
  if (label) label.textContent = labels[idx]
  const id = panels[idx]?.id
  navBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-target') === id))
}

const mm = gsap.matchMedia()

// Horizontal cinematic pin: desktop + motion allowed
mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
  if (!track || !outer) return
  startLenis()

  const getMax = () => track.scrollWidth - window.innerWidth

  const tween = gsap.to(track, { x: () => -getMax(), ease: 'none' })

  const st = ScrollTrigger.create({
    animation: tween,
    trigger: outer,
    start: 'top top',
    end: () => '+=' + getMax(),
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (bar) bar.style.transform = `scaleX(${self.progress})`
      setActive(Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1))))
    },
  })

  // Intro panel: reveal on load
  const intro = panels[0].querySelectorAll<HTMLElement>('[data-hr]')
  gsap.from(intro, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.15 })

  // Later panels: reveal as they pan into view (tween as containerAnimation)
  panels.slice(1).forEach((panel) => {
    const items = panel.querySelectorAll<HTMLElement>('[data-hr]')
    if (!items.length) return
    gsap.from(items, {
      y: 44,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: panel,
        containerAnimation: tween,
        start: 'left 72%',
        toggleActions: 'play none none reverse',
      },
    })
  })

  // Nav + hero buttons jump to a panel by mapping its x-offset to page scroll
  const jump = (targetId: string | null) => {
    const el = targetId ? document.getElementById(targetId) : null
    if (!el) return
    const max = getMax()
    const ratio = max > 0 ? Math.min(1, el.offsetLeft / max) : 0
    const y = (st.start as number) + ratio * ((st.end as number) - (st.start as number))
    gsap.to(window, { scrollTo: y, duration: 0.9, ease: 'power3.inOut' })
  }
  document.querySelectorAll<HTMLElement>('[data-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      jump(btn.getAttribute('data-target'))
    })
  })

  return () => {
    st.kill()
    tween.kill()
    gsap.set(track, { clearProps: 'x' })
  }
})

// Vertical fallback: smooth scroll + in-view reveals + anchor nav
mm.add('(max-width: 860px), (prefers-reduced-motion: reduce)', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) startLenis()

  panels.forEach((panel) => {
    const items = panel.querySelectorAll<HTMLElement>('[data-hr]')
    if (!items.length || reduced) return
    gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: panel, start: 'top 80%', once: true },
    })
  })

  document.querySelectorAll<HTMLElement>('[data-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const el = document.getElementById(btn.getAttribute('data-target') || '')
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    })
  })
})
