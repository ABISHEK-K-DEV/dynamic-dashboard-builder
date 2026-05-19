/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#111111',
          panel: '#1a1a1a',
          sidebar: '#141414',
          border: '#2a2a2a',
          active: '#2c2c2c',
          text: '#a0a0a0',
          textHover: '#ffffff',
          accent: '#007fd4',
          input: '#222222'
        }
      },
      fontSize: {
        'xxs': '0.65rem',
      }
    },
  },
  plugins: [],
}
