export default defineNuxtConfig({
  // Get all the pages, components, composeables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  // Multilingual support
  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json', name: 'English' },
      { code: 'de', file: 'de-DE.json', name: 'Deutsch' },
      { code: 'es', file: 'es-ES.json', name: 'Español' },
      { code: 'fr', file: 'fr-FR.json', name: 'Français' },
    ],
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
});
