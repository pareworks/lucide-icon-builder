/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#1a1a1a',
        'panel-2': '#242424',
        'panel-3': '#2e2e2e',
        line: '#363636',
        muted: '#8a8a8a',
      },
    },
  },
  plugins: [],
}
