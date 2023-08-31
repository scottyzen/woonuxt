import pkg from './package.json';
import { resolve } from 'pathe';

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  nitro: {
    prerender: {
      failOnError: false,
    },
  },

  components: [{ path: '~/components', pathPrefix: false }],

  modules: ['woonuxt-settings', 'nuxt-graphql-client', '@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt/image', '@nuxtjs/i18n'],

  plugins: ['~/plugins/init.ts'],

  image: {
    domains: process.env.NUXT_IMAGE_DOMAINS ? process.env.NUXT_IMAGE_DOMAINS.replace(/ /g, '').split(',') : [],
  },

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  hooks: {
    'pages:extend'(pages) {
      pages.push({ name: 'product-page-pager', path: '/products/page/:pageNumber', file: resolve(__dirname, './pages/products.vue') });
      pages.push({ name: 'product-category-page', path: '/product-category/:categorySlug', file: resolve(__dirname, './pages/products.vue') });
      pages.push({ name: 'product-category-page-pager', path: '/product-category/:categorySlug/page/:pageNumber', file: resolve(__dirname, './pages/products.vue') });
      pages.push({ name: 'order-received', path: '/checkout/order-received/:orderId', file: resolve(__dirname, './pages/order-summary.vue') });
      pages.push({ name: 'order-summary', path: '/order-summary/:orderId', file: resolve(__dirname, './pages/order-summary.vue') });
    },
  },

  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json', name: 'English' },
      { code: 'de', file: 'de-DE.json', name: 'Deutsch' },
      { code: 'es', file: 'es-ES.json', name: 'Español' },
      { code: 'fr', file: 'fr-FR.json', name: 'Français' },
    ],
    // lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },

  routeRules: {
    '/checkout/order-received/**': { ssr: false },
    '/order-summary/**': { ssr: false },
  },
});
