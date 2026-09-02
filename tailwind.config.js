/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        v4red:      '#E50914',
        v4redsoft:  '#FF4D4D',
        graphite:   '#282C37',
        deep:       '#0F1115',
        mid:        '#161920',
        snow:       '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,.28)',
        lift:  '0 18px 48px rgba(0,0,0,.45)',
      },
    },
  },
  plugins: [],
}
