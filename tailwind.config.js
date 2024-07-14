/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1600px',
      '3xl': '1920px',
    },
    extend: {
      backgroundSize: {
        '0_100'  : '0% 100%',
        '100_100': '100% 100%',
      },
      zIndex:{
        'menu'  : 500,
        'dialog': 1000,
        'max'   : 10000,
      },
      aspectRatio: {
        '16/9' : '16/9'
      },
      maxWidth: {
        '1920p': '1920px',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        fadeOut: 'fadeOut 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      }
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.glass': {
          '--tw-ring-color': 'rgb(71 85 105 / 0.6)',
          backdropFilter   : "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
          boxShadow        : '0 0 40px 20px var(--tw-ring-color)',
        },
        '.glass-sm': {
          '--tw-ring-color': 'rgb(71 85 105 / 0.6)',
          backdropFilter   : "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
          boxShadow        : '0 0 4px 2px var(--tw-ring-color)',
        },
        '.screen-1920p' : {
          maxWidth: '1920px',
          maxHeight: '100vh',
          aspectRatio: '16/9',
        },
      })
    }),
  ],

}