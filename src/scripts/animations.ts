import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const header = document.getElementById('site-header')
const progress = document.getElementById('scroll-progress')

function setProgress(scroll: number, limit: number) {
  if (progress) progress.style.transform = `scaleX(${limit > 0 ? scroll / limit : 0})`
  if (header) header.classList.toggle('scrolled', scroll > 8)
}

if (!reduce) {
  const lenis = new Lenis({ duration: 1.05 })
  lenis.on('scroll', (e: { scroll: number; limit: number }) => {
    ScrollTrigger.update()
    setProgress(e.scroll, e.limit)
  })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
} else {
  const onScroll = () =>
    setProgress(window.scrollY, document.documentElement.scrollHeight - window.innerHeight)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Masthead line-mask reveal
  const lines = gsap.utils.toArray<HTMLElement>('[data-ed-title] .ed-line > span')
  if (lines.length) {
    gsap.set(lines, { yPercent: 110 })
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.1,
      delay: 0.15,
    })
  }

  // Generic scroll reveals
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
})

// Reduced motion: show everything immediately
if (reduce) {
  gsap.set('[data-reveal]', { opacity: 1, y: 0 })
}

// Active nav state
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

// Magnetic buttons (fine pointer only)
if (!reduce && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.28
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) * strength
      const y = (e.clientY - r.top - r.height / 2) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
    })
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)'
    })
  })
}
