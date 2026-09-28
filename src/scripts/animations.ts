import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Smooth scroll with Lenis + GSAP ticker integration
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Scroll progress bar (no motion preference needed - purely informational)
const progress = document.getElementById('scroll-progress')
if (progress) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const ratio = max > 0 ? window.scrollY / max : 0
    progress.style.transform = `scaleX(${ratio})`
  }
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
}

// All scroll motion behind reduced-motion gate
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero headline word stagger
  const heroWords = gsap.utils.toArray<HTMLElement>('[data-hero-title] .hero-word')
  if (heroWords.length) {
    gsap.from(heroWords, {
      yPercent: 115,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      delay: 0.1,
    })
  }

  // Generic scroll-reveal elements
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  // Staggered children inside a reveal-stagger wrapper
  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((container) => {
    const children = container.querySelectorAll(':scope > *')
    gsap.from(children, {
      y: 30,
      opacity: 0,
      duration: 0.65,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: container, start: 'top 85%', once: true },
    })
  })

  // Stat count-up
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.getAttribute('data-count')) || 0
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(obj.val)) },
    })
  })

  // Timeline: draw the vertical line as you scroll
  const timelineContainer = document.querySelector<HTMLElement>('.timeline-container')
  const timelineLine = document.querySelector<HTMLElement>('.timeline-line')
  if (timelineContainer && timelineLine) {
    gsap.from(timelineLine, {
      scaleY: 0,
      ease: 'none',
      scrollTrigger: { trigger: timelineContainer, start: 'top 70%', end: 'bottom 40%', scrub: 0.5 },
    })
  }

  // Timeline items
  gsap.utils.toArray<HTMLElement>('[data-timeline-item]').forEach((el) => {
    gsap.from(el, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  // Hero aura parallax
  const aura = document.querySelector<HTMLElement>('#hero-aura')
  if (aura) {
    gsap.to(aura, {
      y: -80,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    })
  }
})

// Magnetic buttons - subtle, no motion preference needed
document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.18
    const y = (e.clientY - rect.top - rect.height / 2) * 0.18
    el.style.transform = `translate(${x}px, ${y}px)`
    el.style.transition = 'transform 0.12s ease'
  })
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)'
    el.style.transition = 'transform 0.45s ease'
  })
})

// 3D card tilt - precise pointer only
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`
      card.style.transition = 'transform 0.08s ease'
    })
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
      card.style.transition = 'transform 0.45s ease'
    })
  })
}

// Active section state for both top nav and side dots
const sections = document.querySelectorAll<HTMLElement>('section[id]')
const navLinks = document.querySelectorAll<HTMLElement>('.nav-link')
const dotLinks = document.querySelectorAll<HTMLElement>('.dot-link')

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        })
        dotLinks.forEach((dot) => {
          dot.classList.toggle('active', dot.getAttribute('data-dot') === id)
        })
      }
    })
  },
  { rootMargin: '-45% 0px -45% 0px' }
)

sections.forEach((s) => sectionObserver.observe(s))
