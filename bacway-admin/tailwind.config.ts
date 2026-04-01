import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bw-bg': '#0a0a0a',
        'bw-card': '#111111',
        'bw-border': '#1f1f1f',
        'bw-cyan': '#00c8ff',
        'bw-cyan-dim': '#0099cc',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      }
    }
  },
  plugins: []
}
export default config
