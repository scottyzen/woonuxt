import { defineNuxtConfig } from '@nuxt/bridge'
import pkg from './package.json'

export default defineNuxtConfig({
  bridge: false,
  target: "static",

  components: {
    dirs: [
      "~/components",
      "~/components/elements",
      "~/components/forms",
    ]
  },

  head: {
    titleTemplate: '%s - WooNuxt',
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },
      { hid: "description", name: "description", content: "Next generation front end for WooCommerce thats build with Nuxt." },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.svg" },
      { rel: "apple-touch-icon", sizes: "512x512", href: "/icon_maskable.png" },
      { rel: "preconnect", href: process.env.WORDPRESS_URL },
      { rel: "dns-prefetch", href: process.env.WORDPRESS_URL },
    ],
  },

  pageTransition: { name: 'page' },

  modules: [
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    ["nuxt-cookie-control", {
      barPosition: "bottom-left",
      blockIframe: true,
      controlButton: false,
      css: false,
      optional: [{
        name: 'Google Analitycs',
        identifier: 'ga',
        initialState: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_TAG_MANAGER_ID}`,
        async: true,
        cookies: ['_ga', '_gat', '_gid'],
        accepted: () => {
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', process.env.GOOGLE_TAG_MANAGER_ID);
        }
      }],
    }],
    '@nuxtjs/sitemap',
  ],


  buildModules: [
    "@nuxtjs/pwa",
    'nuxt-windicss',
    "@nuxt/image",
    "nuxt-graphql-request",
    // '@vueuse/core/nuxt',
    '@nuxtjs/composition-api/module',
    // 'nuxt-delay-hydration'
  ],

  plugins: [
    { src: "~/plugins/vuex-persist", ssr: false },
  ],


  graphql: {
    clients: {
      default: {
        endpoint: `${process.env.WORDPRESS_URL}/graphql`,
        options: { credentials: "include", mode: "cors" },
      },
    },
  },

  sitemap: { hostname: 'https://woonuxt.com', gzip: true },
  image: { provider: "static", domains: [process.env.WORDPRESS_URL] },

  pwa: {
    manifest: {
      name: "WooNuxt",
      short_name: "WooNuxt",
      display: "standalone",
      lang: "en",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      crossorigin: "use-credentials",
      startURL: '/',
    },
    meta: {
      mobileAppIOS: true,
      theme_color: "#ffffff",
      nativeUI: true
    }
  },

  publicRuntimeConfig: {
    perPage: 12,
    clientVersion: pkg.version,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    domain: process.env.DOMAIN,
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/products/page/:pageNumber",
        component: resolve(__dirname, "pages/products"),
      });
      routes.push({
        path: "/product-category/:categorySlug",
        component: resolve(__dirname, "pages/products"),
      });
      routes.push({
        path: "/product-category/:categorySlug/page/:pageNumber",
        component: resolve(__dirname, "pages/products"),
      });
    },
  },

  build: {
    aggressiveCodeRemoval: true
  }
})