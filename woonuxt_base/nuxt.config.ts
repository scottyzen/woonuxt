import { createResolver } from '@nuxt/kit';
import { defineNuxtConfig } from 'nuxt/config';
import { validateEnv } from './app/utils/envGuard';
const { resolve } = createResolver(import.meta.url);

validateEnv();

export default defineNuxtConfig({
  compatibilityDate: '2025-08-10',

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: [
    'woonuxt-settings',
    [
      'nuxt-graphql-client',
      {
        clients: {
          default: {
            host: process.env.GQL_HOST,
            corsOptions: { mode: 'cors', credentials: 'include' },
            headers: { Origin: process.env.APP_HOST || 'http://localhost:3000' },
          },
        },
      },
    ],
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],

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
      '/checkout/order-received/**': { prerender: false },
      '/order-summary/**': { prerender: false },
    },
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
    restructureDir: false,
  },
});
