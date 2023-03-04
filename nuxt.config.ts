export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  components: [{ path: '~/components', pathPrefix: false }],

  modules: [
    './woonuxt-settings-module/woonuxt-settings.ts',
    'nuxt-graphql-client',
    'nuxt-windicss',
    'nuxt-icon',
    '@nuxt/image-edge'
  ],

  image: {
    domains: process.env.NUXT_IMAGE_DOMAINS ? process.env.NUXT_IMAGE_DOMAINS.replace(/ /g, '').split(',') : [],
  },

  'graphql-client': {
    codegen: process.env.PUBLIC_INTROSPECTION_ENABLED !== 'on' ? false : {
      silent: true,
      skipTypename: true,
      useTypeImports: true,
      dedupeFragments: true,
      onlyOperationTypes: true,
      disableOnBuild: false
    }
  },

  hooks: {
    'pages:extend'(pages) {
      pages.push({ name: 'product-page-pager', path: '/products/page/:pageNumber', file: '~/pages/products.vue' });
      pages.push({ name: 'product-category-page', path: '/product-category/:categorySlug', file: '~/pages/products.vue' });
      pages.push({ name: 'product-category-page-pager', path: '/product-category/:categorySlug/page/:pageNumber', file: '~/pages/products.vue' });
      pages.push({ name: 'order-received', path: '/checkout/order-received/:orderId', file: '~/pages/order-summary.vue' });
      pages.push({ name: 'order-summary', path: '/order-summary/:orderId', file: '~/pages/order-summary.vue' });
    }
  },

  routeRules: {
    '/checkout/order-received/**': { ssr: false },
    '/order-summary/**': { ssr: false },
  }

})
