export default {
  target: 'static',
  components: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'woonuxt',
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

  buildModules: ['@nuxtjs/tailwindcss', '@nuxt/image', 'nuxt-graphql-request'],

  image: {
    provider: 'static',
    domains: [process.env.WORDPRESS_URL],
  },

  graphql: {
    clients: {
      default: {
        endpoint: `${process.env.WORDPRESS_URL}/graphql`,
      },
    },
  },

  modules: ['@nuxtjs/pwa'],

  // https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
}
