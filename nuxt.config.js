import { defineNuxtConfig } from '@nuxt/bridge'
import pkg from './package.json'

export default defineNuxtConfig({
  bridge: false,
  target: "static",
  dev: process.env.NODE_ENV !== 'production',
  
  components: {
    dirs: [
      "~/components",
      "~/components/elements",
    ]
  },

  head: {
    titleTemplate: '%s - WooNuxt',
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },
      {
        hid: "description",
        name: "description",
        content: "Next generation front end for WooCommerce thats build with Nuxt.",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.svg" },
      { rel: "apple-touch-icon", sizes: "512x512", href: "/icon_maskable.png"}
    ],
  },

  router: {
    middleware: 'pages',
  },

  pageTransition:{
    name: 'page',
  },

  modules: [
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    [ "nuxt-cookie-control", { 
      barPosition: "bottom-left",
      blockIframe: true,
      controlButton: true,
      css: false,
      optional: [
        {
          name: 'Google Analitycs',
          identifier: 'ga',
          initialState: false,
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_TAG_MANAGER_ID}`,
          async: true,
          cookies: ['_ga', '_gat', '_gid'],
          accepted: () => {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
          },
        }
      ],
    }],
 ],

  buildModules: [
    "@nuxtjs/pwa",
    'nuxt-windicss',
    "@nuxt/image",
    "nuxt-graphql-request", 
    '@vueuse/core/nuxt',
    '@nuxtjs/composition-api/module'
  ],

  graphql: {
    clients: {
      default: {
        endpoint: `${process.env.WORDPRESS_URL}/graphql`,
        options: { credentials: "include", mode: "cors" },
      },
    },
  },

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
      start_url: 'https://woonuxt.com',
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
    extend (config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      })
    }
  }
})