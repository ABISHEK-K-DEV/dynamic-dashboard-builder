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
          bg: '#1e1e1e',
          panel: '#252526',
          border: '#333333',
          active: '#37373d',
          text: '#cccccc',
          textHover: '#ffffff',
          accent: '#007fd4'
        }
      }
    },
  },
  plugins: [],
}
