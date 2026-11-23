/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FBF4F5',
          100: '#F6E6E9',
          200: '#ECCDD3',
          300: '#DDA4AF',
          400: '#C77083',
          500: '#AD475F',
          600: '#8E2F46',
          700: '#721E33',
          800: '#5C1527',
          900: '#460C1B',
          950: '#28040C',
        },
        gold: {
          50: '#FDFCF6',
          100: '#FAF6E6',
          200: '#F4ECC7',
          300: '#ECDDA0',
          400: '#E2CA70',
          500: '#D4AF37', // Classic Rich Gold
          600: '#BA9423',
          700: '#947217',
          800: '#785A16',
          900: '#644A16',
          950: '#3A2808',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FDF9F0',
          200: '#FAF4E4',
          300: '#F5ECCE',
          400: '#EDE0B2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        tamil: ['"Noto Sans Tamil"', '"Mukta Malar"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'burgundy-glow': '0 4px 20px -2px rgba(92, 21, 39, 0.35)',
        'card-hover': '0 12px 28px -5px rgba(70, 12, 27, 0.12), 0 8px 10px -6px rgba(70, 12, 27, 0.08)',
      }
    },
  },
  plugins: [],
}
