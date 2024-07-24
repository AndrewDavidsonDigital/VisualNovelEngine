/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'animate-ripple',
  ],
  theme: {
    screens: {
      'sm': '600px',
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
        effectWarning: 'effectWarning 5s ease-in-out forwards infinite',
        effectGoodBad: 'effectGoodBad 5s linear forwards infinite',
        ripple: 'ripple 0.5s linear',
      },
      keyframes: {
        ripple: {
          '0%': { 
            opacity: 0,
          },
          '20%': { 
            opacity: 1,
          },
          '60%': { 
            opacity: 0.8,
          },
          '80%': { 
            opacity: 0.5,
          },
          '100%': { 
            opacity: 0,
            scale: '150%',
          },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        effectWarning: {
          '0%' : {
            boxShadow: 'inset 0 0 20px 15px rgb(255 0 0)',
          },
          '30%' : {
            boxShadow: 'inset 0 0 20px 0px rgb(255 0 0)',
          },
          '45%' : {
            boxShadow: 'inset 0 0 20px 25px rgb(255 0 0)',
          },
          '85%' : {
            boxShadow: 'inset 0 0 20px 0px rgb(255 0 0)',
          },
          '100%' : {
            boxShadow: 'inset 0 0 20px 15px rgb(255 0 0)',
          },
        },
        effectGoodBad: {
          '0%' : {
            opacity: 0.5,
          },
          '30%' : {
            opacity: 1,
          },
          '45%' : {
            opacity: 0.5,
          },
          '85%' : {
            opacity: 0.8,
          },
          '100%' : {
            opacity: 0.5,
          },
        }
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