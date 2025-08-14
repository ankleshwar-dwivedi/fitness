/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#050443', // Darker blue for more contrast
        'secondary': '#00b8ff',
        'accent': '#00ffff',
        'light': '#f0f4f8', // Off-white for a softer background
        'dark': '#111827',
        'muted': '#6b7280',
        'success': '#10b981',
        'danger': '#ef4444',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}