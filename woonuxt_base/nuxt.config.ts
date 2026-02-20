import { createResolver } from '@nuxt/kit';
import { defineNuxtConfig } from 'nuxt/config';

const { resolve } = createResolver(import.meta.url);

// Environment variables with fallbacks
const GQL_HOST = process.env.GQL_HOST || 'http://localhost:4000/graphql';
const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

// ISR configuration for large catalogs
const parsedCatalogIsrTtl = Number.parseInt(process.env.CATALOG_ISR_TTL || '3600', 10);
const catalogIsrTtl = Number.isFinite(parsedCatalogIsrTtl) && parsedCatalogIsrTtl > 0 ? parsedCatalogIsrTtl : 3600;

export default defineNuxtConfig({
  compatibilityDate: '2026-01-18',

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: [resolve('./modules/woonuxt-bridge.ts'), 'nuxt-graphql-client', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/color-mode'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  css: [resolve('./app/assets/css/main.css')],

  runtimeConfig: {
    public: {
      'graphql-client': {
        clients: {
          default: {
            host: GQL_HOST,
            headers: { Origin: APP_HOST },
            fetchOptions: {
              mode: 'cors',
              credentials: 'include',
            },
          },
        },
      },
    },
  },

  alias: {
    '#constants': resolve('./app/constants'),
    '#types': resolve('./app/types'),
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
      // Disable prerendering for dynamic checkout/order pages
      '/checkout/order-received/**': { prerender: false },
      '/order-summary/**': { prerender: false },
      // ISR for large catalogs:
      // - First request renders and caches the response
      // - Requests during TTL serve cached content
      // - After TTL, next request serves stale content and triggers background regeneration
      // Override with CATALOG_ISR_TTL environment variable (in seconds)
      '/product/**': { isr: catalogIsrTtl },
      '/product-category/**': { isr: catalogIsrTtl },
      '/products/**': { isr: catalogIsrTtl },
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
  },
});
