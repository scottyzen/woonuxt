// const colors = require('tailwindcss/colors')
module.exports = {
  // mode: 'jit',
  // darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  //   plugins: [require('@tailwindcss/typography')],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    safelist: ['layout-enter-active', 'layout-leave-active', 'layout-enter'],
  },
}
