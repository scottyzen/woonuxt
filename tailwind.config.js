const colors = require("tailwindcss/colors");
module.exports = {
  mode: "jit",
  // darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        violet: colors.purple,
      },
    },
  },
  variants: {
    extend: {},
  },
};
