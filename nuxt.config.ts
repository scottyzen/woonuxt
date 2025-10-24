export default defineNuxtConfig({
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  image: {
    provider: 'static',
    screens: {},
    providers: {
      static: {}
    }
  },

  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    minify: true
  },
});
