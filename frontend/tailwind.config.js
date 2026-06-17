/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626', // Primary Red
          dark: '#B91C1C',
          light: '#EF4444',
          subtle: '#FEE2E2',
        },
        secondary: {
          DEFAULT: '#111827', // Secondary Dark
          dark: '#030712',
          light: '#1F2937',
          gray: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#F59E0B', // Accent Amber
          dark: '#D97706',
          light: '#FBBF24',
          subtle: '#FEF3C7',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
