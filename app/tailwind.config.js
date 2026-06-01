/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#E9FBF3',
          100: '#C7F6E2',
          200: '#96D9C0',
          300: '#5BE8BE',
          400: '#07F2B0',
          500: '#07D99D',
          600: '#06BF8B',
          700: '#059B72',
          800: '#047855',
          900: '#0A3D2E',
          950: '#06251C',
        },
        neutral: {
          0: '#FFFFFF',
          25: '#FAFCFB',
          50: '#F5F8F7',
          100: '#EDF2F0',
          200: '#E4EAE8',
          300: '#CFD9D5',
          400: '#A7B4AF',
          500: '#76847E',
          600: '#46554F',
          700: '#2C3A34',
          800: '#18241F',
          900: '#0B211A',
        },
        brand: {
          DEFAULT: '#06BF8B',
          strong: '#059B72',
          bright: '#07D99D',
          ink: '#0A3D2E',
        },
        danger: {
          DEFAULT: '#E5484D',
          bg: '#FCE9E9',
          fg: '#B42A2F',
        },
        warning: {
          DEFAULT: '#D98A00',
          bg: '#FBF1DC',
          fg: '#8A5A00',
        },
        success: {
          DEFAULT: '#06BF8B',
          bg: '#E9FBF3',
          fg: '#04785A',
        },
        info: {
          DEFAULT: '#2D7FF9',
          bg: '#E6EFFE',
          fg: '#1B5FCB',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        brand: '0 10px 28px rgba(6, 191, 139, 0.28)',
        xs: '0 1px 2px rgba(11, 33, 26, 0.05)',
        sm: '0 2px 6px rgba(11, 33, 26, 0.06)',
        md: '0 6px 18px rgba(11, 33, 26, 0.08)',
        lg: '0 16px 40px rgba(11, 33, 26, 0.10)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #07F2B0 0%, #06BF8B 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, #5BE8BE 0%, #07D99D 100%)',
        'gradient-dark': 'linear-gradient(160deg, #0A3D2E 0%, #06251C 100%)',
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
