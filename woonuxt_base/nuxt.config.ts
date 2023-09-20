import pkg from './package.json';
import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  plugins: [resolve('./plugins/init.ts')],

  components: [{ path: resolve('./components'), pathPrefix: false }],

  modules: ['woonuxt-settings', 'nuxt-graphql-client', '@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt/image', '@nuxtjs/i18n'],

  image: {
    domains: process.env.NUXT_IMAGE_DOMAINS ? process.env.NUXT_IMAGE_DOMAINS.replace(/ /g, '').split(',') : [],
  },
  pages: true,

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
        file: resolve('./pages/products.vue'),
      });
      pages.push({
        name: 'product-category-page-pager',
        path: '/product-category/:categorySlug/page/:pageNumber',
        file: resolve('./pages/products.vue'),
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

  routeRules: {
    '/checkout/order-received/**': { ssr: false },
    '/order-summary/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      version: pkg.version || '0.0.0',
    },
  },
});
