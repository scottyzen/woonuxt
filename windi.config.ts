// const colors = require('windicss/colors')
import { defineConfig } from 'windicss/helpers';
const typography = require('windicss/plugin/typography');

export default defineConfig({
  attributify: false,
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          light: '#AE7DDD',
          DEFAULT: process.env.PRIMARY_COLOR || '#7F54B2',
          dark: '#754fa3',
        },
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [typography],
});
