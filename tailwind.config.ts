import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff', 100: '#eaefff', 200: '#c9d6ff', 300: '#a7bdff',
          400: '#6f8eff', 500: '#3f62ff', 600: '#2f49cc', 700: '#223699',
          800: '#172466', 900: '#0d1438'
        }
      }
    }
  },
  plugins: []
}
export default config
