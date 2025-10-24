// nuxt.config.ts
export default defineNuxtConfig({
  // Erft alles uit je base theme
  extends: ['./woonuxt_base'],

  // Auto-import eigen componenten
  components: [{ path: './components', pathPrefix: false }],

  // Modules
  modules: ['@nuxt/image'],

  // Afbeeldingen: GEEN Netlify CDN, gebruik directe URLs
  image: {
    provider: 'static', // <-- zet op 'ipx' als je Nuxt-optimalisatie wilt zonder Netlify
    // Bij 'static' zijn domains/providers niet nodig
  },

  // Build / prerender instellingen
  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false
    },
    minify: true
  }
})
