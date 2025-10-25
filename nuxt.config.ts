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
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    minify: true,
  },
})
