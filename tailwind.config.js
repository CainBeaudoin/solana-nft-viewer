/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0B0B',
          surface: '#121212',
          card: '#1A1A1A',
          border: '#2A2A2A',
          hover: '#252525',
        },
        accent: {
          green: '#22C55E',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
