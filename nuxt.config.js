// import { defineNuxtConfig } from '@nuxt/bridge'

export default {
  target: "static",
  components: true,
  head: {
    title: "WooNuxt",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Next generation front end for WooCommerce thats build with Nuxt.",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.svg" },
      // { rel: "apple-touch-icon", sizes: "512x512", href: "/icon_maskable.png" }
    ],
  },

  buildModules: ["@nuxtjs/pwa", '@nuxtjs/composition-api/module' ,'nuxt-windicss', "@nuxt/image", "nuxt-graphql-request", '@vueuse/core/nuxt'],

  // css: [ 'virtual:windi.css' ],

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
      crossorigin: "use-credentials"
    },
    meta: {
      mobileAppIOS: true,
      theme_color: "#ffffff",
      nativeUI: true
    }
  },

  publicRuntimeConfig: {
    perPage: 12,
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
}