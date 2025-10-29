import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // 🌐 Basisthema van Woonuxt
  extends: ['./woonuxt_base'],

  // 🔑 Publieke keys (WooCommerce API)
  runtimeConfig: {
    public: {
      wcKey: process.env.WC_KEY,
      wcSecret: process.env.WC_SECRET,
    },
  },

  // ⚙️ Componentmap
  components: [{ path: './components', pathPrefix: false }],

  // ⚡️ Volledige SPA-modus voor Netlify (geen SSR)
  ssr: false,

  // 🏗️ Nitro build instellingen voor Netlify
  nitro: {
    preset: 'netlify-static', // ✅ bouwt correct voor Netlify hosting
    minify: true,
    prerender: {
      routes: ['/'],      // alleen homepage genereren
      crawlLinks: false,  // voorkom crawling van WP routes
      failOnError: false, // build stopt niet bij dynamische fouten
    },
  },

  // ⚡️ Vite plugin voor .gql import
  vite: {
    plugins: [require('@rollup/plugin-graphql')()],
  },

  // 🧠 App instellingen (optioneel, maar netjes)
  app: {
    head: {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
