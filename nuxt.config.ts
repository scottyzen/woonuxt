import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['./woonuxt_base'],

  runtimeConfig: {
    public: {
      wcKey: process.env.WC_KEY,
      wcSecret: process.env.WC_SECRET,
    },
  },

  components: [{ path: './components', pathPrefix: false }],

  nitro: {
    preset: 'netlify', // ✅ laat Netlify als runtime werken
    minify: true,
    prerender: {
      failOnError: false,
    },
  },

  vite: {
    plugins: [require('@rollup/plugin-graphql')()],
  },
})
