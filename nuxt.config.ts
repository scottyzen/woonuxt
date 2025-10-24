// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['./woonuxt_base'],
  components: [{ path: './components', pathPrefix: false }],

  modules: ['@nuxt/image'],

  // Geen Netlify Image CDN: directe URLs
  image: {
    provider: 'static'
  },

  // Zorg dat je WP/GraphQL host beschikbaar is voor de app
  runtimeConfig: {
    public: {
      // Zet dit óók als env var in Netlify; dit is de fallback
      GQL_HOST: process.env.GQL_HOST || 'https://wp.kledingzoeken.nl'
      // Als jouw endpoint '/graphql' vereist, zet dan de volle URL hier:
      // GQL_HOST: process.env.GQL_HOST || 'https://wp.kledingzoeken.nl/graphql'
    }
  },

  nitro: {
    prerender: { concurrency: 10, interval: 1000, failOnError: false },
    minify: true
  }
})

