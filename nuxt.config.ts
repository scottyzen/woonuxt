export default defineNuxtConfig({
  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  // Depending on your servers capabilities, you may need to adjust the following settings.
  // It will affect the build time but also increase the reliability of the build process.
  // If you have a server with a lot of memory and CPU, you can remove the following settings.
  nitro: {
    prerender: {
      concurrency: 10, // How many pages to prerender at once
      interval: 1000, // How long to wait between prerendering pages
      failOnError: false,
    },
  },
});
