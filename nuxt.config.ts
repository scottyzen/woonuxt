export default defineNuxtConfig({
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    minify: true
  }
});
