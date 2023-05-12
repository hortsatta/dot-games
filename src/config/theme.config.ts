const defaultTheme = require('tailwindcss/defaultTheme');

export const theme = {
  extend: {
    fontFamily: {
      sans: ['var(--font-main)', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      current: {
        dark: 'rgba(255,255,255,0.8)',
        DEFAULT: 'rgba(0,0,0,0.8)',
      },
      primary: '#ff0000',
      secondary: '#9750dd',
      backdrop: '#181818',
      surface: '#242424',
      border: 'rgba(255,0,0,0.2)',
    },
    maxWidth: {
      main: '1440px',
      full: '1920px',
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
  },
};
