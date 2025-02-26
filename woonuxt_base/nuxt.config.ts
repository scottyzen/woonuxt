import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  experimental: {
    sharedPrerenderData: true,
    buildCache: true,
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: { visibility: false },
      },
    },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: ['woonuxt-settings', 'nuxt-graphql-client', '@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n'],

  // Fix GraphQL client configuration
  'graphql-client': {
    codegen: {
      skipTypesGeneration: true,
      // Add proper codegen configuration
      generates: {
        './types/graphql.ts': {
          plugins: ['typescript', 'typescript-operations']
        }
      }
    },
    clients: {
      default: {
        host: process.env.GQL_HOST || 'https://modaprimeusa.com/graphql',
        corsOptions: { mode: 'cors', credentials: 'include' },
        headers: {
          'Origin': process.env.APP_HOST || 'https://store.modaprimeusaa.com',
          'X-WP-Guest-Access': 'true'
        },
        proxyCookies: false
      },
    },
  },

  alias: {
    '#constants': resolve('./app/constants'),
    '#woo': '../.nuxt/gql/default',
  },

  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(`./app/pages/${file}`) });
      };

      addPage('product-page-pager', '/products/page/:pageNumber', 'products.vue');
      addPage('product-category-page', '/product-category/:categorySlug', 'product-category/[slug].vue');
      addPage('product-category-page-pager', '/product-category/:categorySlug/page/:pageNumber', 'product-category/[slug].vue');
      addPage('order-received', '/checkout/order-received/:orderId', 'order-summary.vue');
      addPage('order-summary', '/order-summary/:orderId', 'order-summary.vue');
    },
  },

  nitro: {
    routeRules: {
      '/': { prerender: true },
      '/products/**': { swr: 3600 },
      '/checkout/order-received/**': { ssr: false },
      '/order-summary/**': { ssr: false },
      '/api/**': { cors: true }
    },
  },

  // Handle 404 and other errors gracefully
  routeRules: {
    '/products': { static: false },
    '/products/**': { static: false }
  },

  // Multilingual support
  i18n: {
    locales: [
      { code: 'en_US', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'de_DE', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'es_ES', file: 'es-ES.json', name: 'Español 🇪🇸' },
      { code: 'fr_FR', file: 'fr-FR.json', name: 'Français 🇫🇷' },
      { code: 'it_IT', file: 'it-IT.json', name: 'Italiano 🇮🇹' },
      { code: 'pt_BR', file: 'pt-BR.json', name: 'Português 🇧🇷' },
    ],
    langDir: 'locales',
    defaultLocale: 'en_US',
    strategy: 'no_prefix',
  },

  runtimeConfig: {
    public: {
      GRAPHQL_URL: 'https://modaprimeusa.com/graphql',
      FRONT_END_URL: 'https://store.modaprimeusa.com',
      PRODUCTS_PER_PAGE: 15,
      "graphql-client": {
        clients: {
          default: {
            host: "https://modaprimeusa.com/graphql",
            headers: {
              Origin: "https://store.modaprimeusa.com",
              "X-WP-Guest-Access": "true"
            },
            proxyCookies: false
          }
        }
      }
    }
  }
});
