# Ronan Roberts - Portfolio

Personal portfolio site. Built with Astro + React islands, deployed to GitHub Pages.

## Stack

- Astro 4 (static output)
- React 18 (islands only: 3D hero, contact form)
- React Three Fiber + Three.js (WebGL hero, desktop only)
- GSAP + Lenis (scroll animations, smooth scroll)
- Tailwind CSS 3
- Fontsource Variable (Inter + Space Grotesk, self-hosted via npm)
- FormSubmit.co (contact form, no backend)

## Local dev

```
npm install
npm run dev
```

## Build

```
npm run build
npm run preview
```

## Deploy

Pushes to `main` trigger the GitHub Actions workflow at `.github/workflows/deploy.yml`, which builds Astro and deploys the `dist/` output to GitHub Pages.

One-time setup: go to **Settings > Pages**, set **Source** to **GitHub Actions**.

## Adding a project

Edit `src/components/ProjectsSection.astro`. Add an entry to the `projects` array at the top of the file. Drop a preview image (AVIF/WebP/SVG preferred) into `public/images/` and reference it in the `image` field.

## Replacing placeholder images

The four placeholder SVGs in `public/images/` are branded stand-ins. Replace them with real screenshots named identically:

- `echo-software.svg` (or `.avif`, `.webp`)
- `ffp.svg`
- `portfolio-app.svg`
- `skycast.svg`

If you switch to AVIF/WebP, update the `src` paths in `ProjectsSection.astro`.

## Contact form

FormSubmit.co delivers messages to `ronanr2003@gmail.com`. The first submission after a fresh activation will trigger a confirmation email from FormSubmit - click Activate to start receiving messages.

## Live site

https://ronan-r-r.github.io
