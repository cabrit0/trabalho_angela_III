/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff41',
        'alert-red': '#ff0055',
        'deep-black': '#050505',
        'cyber-blue': '#00f3ff',
        'void-black': '#000000',
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
      },
    },
  },
  plugins: [],
}
