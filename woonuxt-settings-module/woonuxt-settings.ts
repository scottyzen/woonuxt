import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';
import { $fetch } from 'ohmyfetch';

const query = `
query getWooNuxtSettings {
  woonuxtSettings {
    primary_color
    logo
    publicIntrospectionEnabled
    frontEndUrl
    maxPrice
    productsPerPage
    global_attributes {
      slug
      showCount
      openByDefault
      label
      hideEmpty
    }
    stripeSettings {
      enabled
      testmode
      test_publishable_key
      publishable_key
    }
  }
}
`;

// Module options TypeScript inteface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: { name: 'woonuxt', configKey: 'woonuxt' },
  defaults: {},
  async setup(_, nuxt) {
    const resolver = createResolver(import.meta.url)

    const GQL_HOST = process.env.GQL_HOST || null;

    if (!GQL_HOST) {
      console.log('\u001B[1;35mGQL_HOST is missing. Make sure you have the GQL_HOST environment variable set.');
      return;
    }

    try {
      const { data } = await $fetch(GQL_HOST, { method: 'POST', body: JSON.stringify({ query }) });

      // Default env variables
      process.env.PRIMARY_COLOR = data.woonuxtSettings?.primary_color || '#7F54B2';
      process.env.PUBLIC_INTROSPECTION_ENABLED = data.woonuxtSettings?.publicIntrospectionEnabled === 'on' ? 'on' : 'false';

      // Default runtimeConfig
      nuxt.options.runtimeConfig.public.LOGO = data.woonuxtSettings?.logo || null;
      nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = data.woonuxtSettings?.productsPerPage || process.env.PRODUCTS_PER_PAGE || 24;
      nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = data.woonuxtSettings?.global_attributes || [];
      nuxt.options.runtimeConfig.public.MAX_PRICE = data.woonuxtSettings?.maxPrice || 1000;
      nuxt.options.runtimeConfig.public.FRONT_END_URL = data.woonuxtSettings?.frontEndUrl || null;

      // Stripe
      if (data.woonuxtSettings?.stripeSettings?.enabled) {
        nuxt.options.runtimeConfig.public.STRIPE_PUBLISHABLE_KEY = data.woonuxtSettings?.stripeSettings?.testmode ? data.woonuxtSettings?.stripeSettings?.test_publishable_key : data.woonuxtSettings?.stripeSettings?.publishable_key;
      }

    } catch (error) {
      console.log(
        '\u001B[1;35mError fetching woonuxt settings. Make sure you have the latest version woonuxt-settings plugin installed and activated on your WordPress site. You can download it from https://github.com/scottyzen/woonuxt-settings'
      );
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
