const colors = require('windicss/colors')
const typography = require('windicss/plugin/typography')
module.exports = {
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          light: '#AE7DDD',
          DEFAULT: '#7F54B2',
          dark: '#754fa3',
        },
      },
      animation: {
        'spin-fast': 'spin 600ms linear infinite',
      }
    },
    boxShadow: {
      'DEFAULT': '0 1px 4px rgb(0 0 0 / 5%)', // If a DEFAULT shadow is provided, it will be used for the non-suffixed shadow utility.
    },
  },
  plugins: [ 
    typography
  ]
};
