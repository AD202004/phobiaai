/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          base: {
            900: '#0C1116',
            800: '#0F1720',
            700: '#131C26',
            600: '#1B2733',
            500: '#243447',
          },
          accent: {
            500: '#1BA39C',
            600: '#15847F',
          }
        },
        boxShadow: {
          soft: '0 10px 30px rgba(0,0,0,0.35)'
        },
        borderRadius: {
          xl2: '1.25rem'
        }
      },
    },
    plugins: [],
  }