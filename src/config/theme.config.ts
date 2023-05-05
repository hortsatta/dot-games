const defaultTheme = require('tailwindcss/defaultTheme');

export const theme = {
  extend: {
    fontFamily: {
      sans: ['var(--font-main)', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      backdrop: '#181818',
      primary: '#ff0000',
    },
    maxWidth: {
      main: '1440px',
    },
    keyframes: {
      glitter: {
        '0%, 100%': {
          transform: 'scale(0.9)',
          opacity: 0.9,
        },
        '25%': {
          transform: 'scale(1)',
          opacity: 0.7,
        },
        '50%': {
          transform: 'scale(0.8)',
          opacity: 0.9,
        },
        '75%': {
          transform: 'scale(1)',
          opacity: 0.8,
        },
      },
    },
    animation: {
      glitter: 'glitter 0.6s ease-in-out infinite',
    },
    // backgroundImage: {
    //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    //   'gradient-conic':
    //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    // },
  },
};
