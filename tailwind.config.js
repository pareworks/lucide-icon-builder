/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#deded9',
        black: '#202120',
        panel: '#202120',
        'panel-2': '#292b29',
        'panel-3': '#353834',
        line: '#3d403b',
        muted: '#a0a39b',
      },
    },
  },
  plugins: [],
}
