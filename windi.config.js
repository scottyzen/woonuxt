const colors = require('windicss/colors')
module.exports = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        violet: colors.purple,
        primary: {
          light: "#AE7DDD",
          DEFAULT: "#7F54B2"
        },
      },
    },
  }
};
