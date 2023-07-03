import pkg from './package.json';
import { createResolver, logger, defineNuxtModule } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  plugins: [
    // './plugins/init.ts'
    resolve('./plugins/init.ts'),
  ],

  components: [{ path: './components', pathPrefix: false }],

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
        // file: '~/parent/pages/products.vue',
        file: resolve('./pages/products.vue'),
      });
      pages.push({
        name: 'product-category-page',
        path: '/product-category/:categorySlug',
        // file: '~/parent/pages/products.vue',
        file: resolve('./pages/products.vue'),
      });
      pages.push({
        name: 'product-category-page-pager',
        path: '/product-category/:categorySlug/page/:pageNumber',
        // file: '~/parent/pages/products.vue',
        file: resolve('./pages/products.vue'),
      });
      pages.push({
        name: 'order-received',
        path: '/checkout/order-received/:orderId',
        // file: '~/parent/pages/order-summary.vue',
        file: resolve('./pages/order-summary.vue'),
      });
      pages.push({
        name: 'order-summary',
        path: '/order-summary/:orderId',
        // file: '~/parent/pages/order-summary.vue',
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
      version: pkg.version,
    },
  },
});
