/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f6fb',
          100: '#e6ebf5',
          200: '#c4d0e6',
          300: '#93a6cc',
          400: '#5e76a8',
          500: '#3a5188',
          600: '#283d6e',
          700: '#1f3059',
          800: '#16233f',
          900: '#101a30',
          950: '#0a1120',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faedca',
          200: '#f4d98c',
          300: '#eec259',
          400: '#e7ad36',
          500: '#d9982a',
          600: '#bd7d20',
          700: '#98601d',
          800: '#7d4d1e',
          900: '#6a411c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.8s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
