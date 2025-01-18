/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        hovering: {
          '0%, 100%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.025)' },
        }
      },
      animation: {
        hovering_anim: 'hovering 1s ease-in infinite',
      }
    }
  },
  plugins: [],
}

