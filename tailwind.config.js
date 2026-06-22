/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokeny BUDGETO
        bg: '#F1F2F5',
        card: '#FFFFFF',
        elevated: '#FFFFFF',
        ink: {
          DEFAULT: '#1A1D1A', // primární text
          soft: '#5C626B', // sekundární text
          mute: '#9AA0A8', // terciární text
        },
        accent: {
          DEFAULT: '#E6E22A', // primární žlutá
          dark: '#C6C200',
          light: '#F6F2A0',
          ink: '#1F231C', // text na akcentu
        },
        income: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        expense: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        line: {
          DEFAULT: '#E8E8EC',
          soft: '#F0F0F3',
        },
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        fab: '0 6px 16px rgba(198,194,0,0.35)',
        sheet: '0 -4px 24px rgba(16,24,40,0.08)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
