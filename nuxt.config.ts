export default defineNuxtConfig({
  modules: [
    // haal de image module weg als je die niet meer wilt gebruiken
    // '@nuxt/image',
  ],

  image: {
    // forceer dat de image module géén externe optimalisatie doet
    provider: 'static',
    // optioneel: leeg de screens/configs
    screens: {},
    // of: zet alle provider settings uit
    providers: {
      static: {
        // geen baseURL instellen
      }
    }
  }
});
