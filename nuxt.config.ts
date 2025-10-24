// nuxt.config.ts
export default defineNuxtConfig({
  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  // Gebruik @nuxt/image, maar zonder Netlify-proxy
  modules: ['@nuxt/image'],

  // ⛔ Geen Netlify Image CDN: gebruik directe image-URL's
  image: {
    provider: 'static'
  },

  // Maak GQL_HOST beschikbaar voor je app (voor o.a. vertalingen/menus etc.)
  // Zet dezelfde env var ook in Netlify → Site settings → Environment variables
  runtimeConfig: {
    public: {
      // Kies precies wat jouw theme verwacht:
      // 1) Alleen host:
      GQL_HOST: process.env.GQL_HOST || 'https://wp.kledingzoeken.nl'
      // of, als jouw theme de volledige endpoint wil:
      // GQL_HOST: process.env.GQL_HOST || 'https://wp.kledingzoeken.nl/graphql'
    }
  },

  /**
   * Depending on your servers capabilities, you may need to adjust the following settings.
   * It will affect the build time but also increase the reliability of the build process.
   * If you have a server with a lot of memory and CPU, you can remove the following settings.
   * @property {number} concurrency - How many pages to prerender at once
   * @property {number} interval - How long to wait between prerendering pages
   * @property {boolean} failOnError - This stops the build from failing but the page will not be statically generated
   */
  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false
    },
    minify: true
  }
})
