import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = window.matchMedia('(pointer: fine)').matches
const header = document.getElementById('site-header')
const progress = document.getElementById('scroll-progress')

function setProgress(scroll: number, limit: number) {
  if (progress) progress.style.transform = `scaleX(${limit > 0 ? scroll / limit : 0})`
  if (header) header.classList.toggle('scrolled', scroll > 8)
}

// ---- Smooth scroll + scroll-velocity skew on the marquee ----
let lenis: Lenis | null = null
const skewTargets = gsap.utils.toArray<HTMLElement>('.marquee')
const setSkew = skewTargets.length ? gsap.quickTo(skewTargets, 'skewX', { duration: 0.4, ease: 'power3' }) : null

if (!reduce) {
  lenis = new Lenis({ duration: 1.05 })
  lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number }) => {
    ScrollTrigger.update()
    setProgress(e.scroll, e.limit)
    if (setSkew) setSkew(gsap.utils.clamp(-10, 10, (e.velocity || 0) * 0.4))
  })
  gsap.ticker.add((t) => lenis!.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
} else {
  const onScroll = () =>
    setProgress(window.scrollY, document.documentElement.scrollHeight - window.innerHeight)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

// Anchor navigation routed through Lenis
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (!id || id === '#') return
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -70 })
    else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' })
  })
})

// ---- Load intro ----
const loader = document.getElementById('ed-loader')
const hasLoader = !!loader && !reduce
if (loader && reduce) loader.remove()

function revealHeroName() {
  const lines = gsap.utils.toArray<HTMLElement>('.ed-name .ed-line > span')
  if (lines.length) gsap.to(lines, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
}

if (hasLoader && loader) {
  lenis?.stop()
  document.documentElement.classList.add('ed-loading')
  const count = document.getElementById('ed-count')
  const o = { v: 0 }
  gsap.timeline()
    .to(o, {
      v: 100, duration: 1.3, ease: 'power2.inOut',
      onUpdate: () => { if (count) count.textContent = String(Math.round(o.v)).padStart(3, '0') },
    })
    .to('.ed-loader__bar', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
    .to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.1')
    .add(() => {
      lenis?.start()
      document.documentElement.classList.remove('ed-loading')
      loader.remove()
    })
    .add(revealHeroName, '-=0.55')
}

// ---- Reduced motion: everything visible, static ----
if (reduce) {
  gsap.set('[data-reveal]', { opacity: 1, y: 0 })
  gsap.set('.ed-panel', { opacity: 1, y: 0 })
}

// ---- Motion (no-preference) ----
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Generic scroll reveals
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  // Contact title line-mask reveal on scroll
  const cLines = gsap.utils.toArray<HTMLElement>('.ed-contact-title .ed-line > span')
  if (cLines.length) {
    gsap.set(cLines, { yPercent: 110 })
    gsap.to(cLines, {
      yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1,
      scrollTrigger: { trigger: '.ed-contact-title', start: 'top 82%', once: true },
    })
  }

  // Word-by-word fill on the profile statement
  const fill = document.querySelector<HTMLElement>('[data-fill]')
  if (fill) {
    const words = fill.textContent!.trim().split(/\s+/)
    fill.textContent = ''
    words.forEach((w, i) => {
      const s = document.createElement('span')
      s.className = 'ed-w'
      s.textContent = w
      fill.appendChild(s)
      if (i < words.length - 1) fill.appendChild(document.createTextNode(' '))
    })
    const spans = fill.querySelectorAll<HTMLElement>('.ed-w')
    gsap.set(spans, { opacity: 0.16 })
    gsap.to(spans, {
      opacity: 1, ease: 'none', stagger: 0.03,
      scrollTrigger: { trigger: fill, start: 'top 78%', end: 'bottom 62%', scrub: true },
    })
  }
})

// ---- Work: horizontal-pinned act on desktop ----
mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
  const section = document.querySelector<HTMLElement>('#work')
  const track = document.querySelector<HTMLElement>('.ed-work-track')
  const vp = document.querySelector<HTMLElement>('.ed-work-viewport')
  if (!section || !track || !vp) return

  section.classList.add('is-horizontal')
  const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth)
  const tween = gsap.to(track, { x: () => -dist(), ease: 'none' })
  const st = ScrollTrigger.create({
    trigger: section, start: 'top top', end: () => '+=' + dist(),
    pin: true, scrub: 1, animation: tween, invalidateOnRefresh: true,
  })

  const panels = gsap.utils.toArray<HTMLElement>('.ed-panel')
  gsap.set(panels, { opacity: 0, y: 40 })
  const reveals = panels.map((p) =>
    gsap.to(p, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 88%', once: true },
    })
  )

  return () => {
    reveals.forEach((r) => { r.scrollTrigger?.kill(); r.kill() })
    st.kill()
    tween.kill()
    gsap.set([panels, track], { clearProps: 'all' })
    section.classList.remove('is-horizontal')
  }
})

// Work vertical stack reveals (mobile / no pin)
mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
  const panels = gsap.utils.toArray<HTMLElement>('.ed-panel')
  gsap.set(panels, { opacity: 0, y: 30 })
  const trs = panels.map((p) =>
    gsap.to(p, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: p, start: 'top 88%', once: true },
    })
  )
  return () => trs.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
})

// ---- Rotating role word ----
if (!reduce) {
  const list = document.querySelector<HTMLElement>('[data-rotate]')
  if (list) {
    const items = Array.from(list.children) as HTMLElement[]
    const real = items.length - 1
    let i = 0
    setInterval(() => {
      i++
      const h = items[0].offsetHeight
      gsap.to(list, {
        y: -i * h, duration: 0.6, ease: 'power3.inOut',
        onComplete: () => { if (i >= real) { i = 0; gsap.set(list, { y: 0 }) } },
      })
    }, 2100)
  }
}

// ---- Live clock (South Africa) ----
const clock = document.getElementById('ed-clock')
if (clock) {
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Johannesburg', hour12: false })
    clock.textContent = `Germiston ZA, ${t}`
  }
  tick()
  setInterval(tick, 1000)
}

// ---- Active nav state ----
const sections = document.querySelectorAll<HTMLElement>('section[id]')
const navLinks = document.querySelectorAll<HTMLElement>('.nav-link')
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        )
      }
    })
  },
  { rootMargin: '-45% 0px -45% 0px' }
)
sections.forEach((s) => sectionObserver.observe(s))

// ---- Magnetic buttons (fine pointer only) ----
if (!reduce && fine) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.28
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) * strength
      const y = (e.clientY - r.top - r.height / 2) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
    })
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0, 0)' })
  })
}

// ---- Custom cursor (fine pointer only) ----
if (!reduce && fine) {
  const dot = document.getElementById('ed-cursor')
  const ring = document.getElementById('ed-cursor-ring')
  const label = document.getElementById('ed-cursor-label')
  if (dot && ring) {
    document.body.classList.add('has-custom-cursor')
    let rx = -100, ry = -100, mx = -100, my = -100
    const dotX = gsap.quickSetter(dot, '--x', 'px')
    const dotY = gsap.quickSetter(dot, '--y', 'px')
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY
      dotX(mx); dotY(my)
    })
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ring.style.setProperty('--x', rx + 'px')
      ring.style.setProperty('--y', ry + 'px')
    })
    document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover')
        const l = el.getAttribute('data-cursor-label')
        if (l && label) { label.textContent = l; document.body.classList.add('cursor-labeled') }
      })
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-labeled')
      })
    })
  }
}
