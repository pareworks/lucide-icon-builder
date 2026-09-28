/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#dedede',
        black: '#212121',
        panel: '#212121',
        'panel-2': '#2a2a2a',
        'panel-3': '#373737',
        line: '#3f3f3f',
        muted: '#a2a2a2',
      },
    },
  },
  plugins: [],
}
