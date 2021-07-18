export default {
  target: 'static',
  components: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'WooNuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Next generation front end for WooCommerce thats build with Nuxt.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  modules: ['@nuxtjs/pwa', '@nuxtjs/apollo'],
  buildModules: ['@nuxtjs/tailwindcss', '@nuxt/image'],

  image: {
    provider: 'static',
    domains: [process.env.WORDPRESS_URL],
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${process.env.WORDPRESS_URL}/graphql`,
      },
    },
  },

  // https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  publicRuntimeConfig: {
    perPage: 12,
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/products/page/:pageNumber',
        component: resolve(__dirname, 'pages/products'),
      })
      routes.push({
        path: '/product-category/:categorySlug',
        component: resolve(__dirname, 'pages/products'),
      })
      routes.push({
        path: '/product-category/:categorySlug/page/:pageNumber',
        component: resolve(__dirname, 'pages/products'),
      })
    },
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
  },
}
