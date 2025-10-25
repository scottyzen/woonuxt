import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'

export default defineNuxtConfig({
  // Base theme
  extends: ['./woonuxt_base'],

  // API keys & public config
  runtimeConfig: {
    public: {
      wcKey: process.env.WC_KEY,
      wcSecret: process.env.WC_SECRET,
    },
  },

  // Componentenmap (voorkomt dubbele importen)
  components: [
    { path: './components', pathPrefix: false },
  ],

  // Nitro build settings (voor Netlify etc.)
  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    minify: true,
  },


})
