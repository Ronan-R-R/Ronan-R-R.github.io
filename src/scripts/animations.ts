import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Scroll progress bar
const progress = document.getElementById('scroll-progress')
if (progress) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
  }
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
}

// Editorial reveals behind reduced-motion gate
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const title = document.querySelector<HTMLElement>('[data-ed-title]')
  if (title) {
    gsap.from(title.children, {
      yPercent: 108,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.12,
    })
  }

  gsap.utils.toArray<HTMLElement>('[data-ed-row]').forEach((row) => {
    gsap.from(row, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: row, start: 'top 92%', once: true },
    })
  })

  gsap.utils.toArray<HTMLElement>('section').forEach((sec) => {
    const heading = sec.querySelector<HTMLElement>('h2')
    if (!heading) return
    gsap.from(heading, {
      opacity: 0,
      x: -24,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
    })
  })
})

// Active nav state
const sections = document.querySelectorAll<HTMLElement>('section[id]')
const navLinks = document.querySelectorAll<HTMLElement>('.nav-link')
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        })
      }
    })
  },
  { rootMargin: '-45% 0px -45% 0px' }
)
sections.forEach((s) => sectionObserver.observe(s))
