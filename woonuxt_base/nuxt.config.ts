import pkg from './package.json';
import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: `%s | ${process.env.SITE_TITLE ?? 'WooNuxt'}`,
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  experimental: {
    sharedPrerenderData: true,
  },

  plugins: [resolve('./plugins/init.ts')],

  components: [{ path: resolve('./components'), pathPrefix: false }],

  modules: ['woonuxt-settings', 'nuxt-graphql-client', '@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt/image', '@nuxtjs/i18n'],

  image: {
    domains: process.env.NUXT_IMAGE_DOMAINS ? process.env.NUXT_IMAGE_DOMAINS.replace(/ /g, '').split(',') : [],
  },

  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'product-page-pager',
        path: '/products/page/:pageNumber',
        file: resolve('./pages/products.vue'),
      });
      pages.push({
        name: 'product-category-page',
        path: '/product-category/:categorySlug',
        file: resolve('./pages/product-category/[slug].vue'),
      });
      pages.push({
        name: 'product-category-page-pager',
        path: '/product-category/:categorySlug/page/:pageNumber',
        file: resolve('./pages/product-category/[slug].vue'),
      });
      pages.push({
        name: 'order-received',
        path: '/checkout/order-received/:orderId',
        file: resolve('./pages/order-summary.vue'),
      });
      pages.push({
        name: 'order-summary',
        path: '/order-summary/:orderId',
        file: resolve('./pages/order-summary.vue'),
      });
    },
  },

  nitro: {
    routeRules: {
      '/checkout/order-received/**': { ssr: false },
      '/order-summary/**': { ssr: false },
    },
  },

  runtimeConfig: {
    public: {
      version: pkg.version || '0.0.0',
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },

  // Multilingual support
  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'de', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'es', file: 'es-ES.json', name: 'Español 🇪🇸' },
      { code: 'fr', file: 'fr-FR.json', name: 'Français 🇫🇷' },
      { code: 'it', file: 'it-IT.json', name: 'Italiano 🇮🇹' },
      { code: 'pt', file: 'pt-BR.json', name: 'Português 🇧🇷' },
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
});
