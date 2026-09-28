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
const labels = panels.map((p) => p.querySelector('.h-eyebrow')?.textContent?.split('—').pop()?.trim() || p.id)

const mm = gsap.matchMedia()

// Horizontal cinematic pin: desktop + motion allowed
mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
  if (!track || !outer) return

  const getMax = () => track.scrollWidth - window.innerWidth

  const tween = gsap.to(track, {
    x: () => -getMax(),
    ease: 'none',
  })

  const st = ScrollTrigger.create({
    animation: tween,
    trigger: outer,
    start: 'top top',
    end: () => '+=' + getMax(),
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress
      if (bar) bar.style.transform = `scaleX(${p})`
      const idx = Math.min(panels.length - 1, Math.round(p * (panels.length - 1)))
      if (cur) cur.textContent = String(idx + 1).padStart(2, '0')
      if (label) label.textContent = labels[idx]
    },
  })

  // Nav jump: map a panel's horizontal offset to a page scroll position
  document.querySelectorAll<HTMLElement>('.h-nav button, .h-brand a').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target') || btn.getAttribute('href')?.replace('#', '')
      const el = targetId ? document.getElementById(targetId) : null
      if (!el) return
      e.preventDefault()
      const max = getMax()
      const ratio = max > 0 ? Math.min(1, el.offsetLeft / max) : 0
      const y = st.start + ratio * (st.end - st.start)
      gsap.to(window, { scrollTo: y, duration: 0.8, ease: 'power2.inOut' })
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

  if (!reduced) {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  panels.forEach((p) => {
    gsap.from(p.children, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: p, start: 'top 80%', once: true },
    })
  })

  document.querySelectorAll<HTMLElement>('.h-nav button, .h-brand a').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target') || btn.getAttribute('href')?.replace('#', '')
      const el = targetId ? document.getElementById(targetId) : null
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    })
  })
})
