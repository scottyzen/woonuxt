import { $fetch } from 'ofetch';
import { defineNuxtModule } from '@nuxt/kit';

const getVersionQuery = `query getVersion {
  woonuxtSettings {
    wooCommerceSettingsVersion
  }
}`;

export default defineNuxtModule({
  meta: {
    name: 'woonuxt-bridge',
    configKey: 'woonuxtBridge',
  },
  async setup(_, nuxt) {
    // Ensure GQL_HOST is set
    const GQL_HOST = process.env.GQL_HOST ?? null;
    let WOONUXT_SETTINGS_PLUGIN_VERSION = 0;

    if (!GQL_HOST) {
      console.log('\u001B[1;35mGQL_HOST is missing. Make sure you have the GQL_HOST environment variable set.');
      return;
    }

    // Get the version of the woonuxt-settings plugin
    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query: getVersionQuery }),
        headers: { Origin: process.env.APP_HOST || 'http://localhost:3000' },
      });
      const stringVersion = data.woonuxtSettings?.wooCommerceSettingsVersion.replace(/\D/g, '');
      WOONUXT_SETTINGS_PLUGIN_VERSION = parseFloat(stringVersion);
    } catch (error) {}

    const wooNuxtSEO = WOONUXT_SETTINGS_PLUGIN_VERSION > 1043 ? 'wooNuxtSEO { provider url handle }' : '';
    const currencyCode = WOONUXT_SETTINGS_PLUGIN_VERSION > 1055 ? 'currencyCode' : '';
    const currencySymbol = WOONUXT_SETTINGS_PLUGIN_VERSION > 1055 ? 'currencySymbol' : '';

    const woonuxtSettings = `{
        primary_color
        logo
        publicIntrospectionEnabled
        frontEndUrl
        productsPerPage
        maxPrice
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
        ${wooNuxtSEO}
        ${currencyCode}
        ${currencySymbol}
    }`;

    const query = `
    query getWooNuxtSettings {
      woonuxtSettings ${woonuxtSettings}
      generalSettings { title }
      allSettings { generalSettingsUrl }
    }`;

    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { Origin: process.env.APP_HOST || 'http://localhost:3000' },
      });

      // Default env variables
      process.env.PRIMARY_COLOR = data.woonuxtSettings?.primary_color || '#7F54B2';

      // Default runtimeConfig
      nuxt.options.runtimeConfig.public.LOGO = data.woonuxtSettings?.logo || null;
      nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = data.woonuxtSettings?.productsPerPage || process.env.PRODUCTS_PER_PAGE || 24;
      nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = data.woonuxtSettings?.global_attributes || [];
      nuxt.options.runtimeConfig.public.MAX_PRICE = data.woonuxtSettings?.maxPrice || 1000;
      nuxt.options.runtimeConfig.public.FRONT_END_URL = data.woonuxtSettings?.frontEndUrl || null;
      nuxt.options.runtimeConfig.public.BACKEND_URL = data.allSettings?.generalSettingsUrl || null;
      nuxt.options.runtimeConfig.public.CURRENCY_CODE = data.woonuxtSettings?.currencyCode || null;
      nuxt.options.runtimeConfig.public.CURRENCY_SYMBOL = data.woonuxtSettings?.currencySymbol || null;
      nuxt.options.runtimeConfig.public.WOO_NUXT_SEO = data.woonuxtSettings?.wooNuxtSEO || null;
      // Site title
      process.env.SITE_TITLE = data.generalSettings?.title || 'WooNuxt';

      // Stripe
      if (data.woonuxtSettings?.stripeSettings?.enabled) {
        nuxt.options.runtimeConfig.public.STRIPE_PUBLISHABLE_KEY =
          data.woonuxtSettings?.stripeSettings?.testmode === 'yes'
            ? data.woonuxtSettings?.stripeSettings?.test_publishable_key
            : data.woonuxtSettings?.stripeSettings?.publishable_key;
      }
    } catch (error) {
      console.error(error);
      console.log(
        '\u001B[1;35mError fetching woonuxt settings. Make sure you have the latest version woonuxt-settings plugin installed on WordPress. https://github.com/scottyzen/woonuxt-settings',
      );
    }
  },
});
