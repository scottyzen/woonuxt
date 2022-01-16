const colors = require('windicss/colors')
module.exports = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        primary: {
          light: "#AE7DDD",
          DEFAULT: "#7F54B2",
          dark: '#754fa3',
        },
      },
      animation: {
        'spin-fast': 'spin 600ms linear infinite',
      }
    },
  }
};
