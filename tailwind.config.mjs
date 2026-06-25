/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08080D',
        surface: '#111118',
        'surface-2': '#181826',
        border: '#262636',
        text: '#ECECF4',
        muted: '#8B8BA3',
        accent: '#7C5CFF',
        'accent-2': '#A78BFA',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(124,92,255,0.35)',
        'glow-sm': '0 0 15px rgba(124,92,255,0.20)',
        'glow-lg': '0 0 60px rgba(124,92,255,0.25)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #7C5CFF, #A78BFA)',
        'surface-gradient': 'linear-gradient(135deg, #111118, #181826)',
      },
    },
  },
  plugins: [],
}
