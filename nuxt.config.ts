export default defineNuxtConfig({
  // Get all the pages, components, composeables and plugins from the parent theme
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

  // Multilingual support
  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json', name: 'English' },
      { code: 'de', file: 'de-DE.json', name: 'Deutsch' },
      { code: 'es', file: 'es-ES.json', name: 'Español' },
      { code: 'fr', file: 'fr-FR.json', name: 'Français' },
      { code: 'it', file: 'it-IT.json', name: 'Italiano' }
    ],
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
});
