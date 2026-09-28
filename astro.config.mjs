import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

// PREVIEW_BASE lets the deploy workflow build the same site under a subpath
// (e.g. /preview/cyan-ink/) so several colour schemes can be hosted side by side.
const base = process.env.PREVIEW_BASE || '/'

export default defineConfig({
  base,
  integrations: [
    react(),
    tailwind({ config: './tailwind.config.mjs' }),
  ],
  output: 'static',
})
