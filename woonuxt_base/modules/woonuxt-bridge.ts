import { defineNuxtModule, useLogger } from '@nuxt/kit';

import { $fetch } from 'ofetch';

type EnvSpec = {
  key: string;
  validate?: (v: string) => boolean;
  hint?: string;
};

const REQUIRED_ENV: EnvSpec[] = [
  {
    key: 'GQL_HOST',
    hint: 'Format: https://your-site.com/graphql',
  },
  {
    key: 'NUXT_IMAGE_DOMAINS',
    hint: 'Format: domain.com (single domain, comma separated if multiple)',
  },
];

function validateEnvironment() {
  const errs: string[] = [];
  for (const { key, validate, hint } of REQUIRED_ENV) {
    const val = process.env[key]?.trim();
    if (!val) {
      errs.push(`Missing env: ${key}${hint ? ` (${hint})` : ''}`);
      continue;
    }
    if (validate && !validate(val)) {
      errs.push(`Invalid env: ${key}${hint ? ` (${hint})` : ''}`);
    }
  }
  if (errs.length) {
    const logger = useLogger('woonuxt-bridge');
    logger.error('\nEnvironment validation failed:\n- ' + errs.join('\n- '));
    logger.error('\nFix your .env (see .env.example) and rerun.\n');
    process.exit(1);
  }
}

// Validate environment variables before module setup
validateEnvironment();

export default defineNuxtModule({
  meta: {
    name: 'woonuxt-bridge',
    configKey: 'woonuxtBridge',
  },
  async setup(_, nuxt) {
    const logger = useLogger('woonuxt-bridge');

    // Environment variables are guaranteed to be valid at this point
    const GQL_HOST = process.env.GQL_HOST!;

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
        wooNuxtSEO { provider url handle }
        currencyCode
        currencySymbol
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

      const configuredMaxPrice = Number(data.woonuxtSettings?.maxPrice);
      const resolvedMaxPrice = Number.isFinite(configuredMaxPrice) && configuredMaxPrice > 0 ? Math.ceil(configuredMaxPrice) : 1000;

      // Default runtimeConfig
      nuxt.options.runtimeConfig.public.PRIMARY_COLOR = data.woonuxtSettings?.primary_color || '#7F54B2';
      nuxt.options.runtimeConfig.public.LOGO = data.woonuxtSettings?.logo || null;
      nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = data.woonuxtSettings?.productsPerPage || process.env.PRODUCTS_PER_PAGE || 24;
      nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = data.woonuxtSettings?.global_attributes || [];
      nuxt.options.runtimeConfig.public.MAX_PRICE = resolvedMaxPrice;
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
      logger.error(error);
      logger.warn(
        'Error fetching woonuxt settings. Make sure you have the latest version woonuxt-settings plugin installed on WordPress. https://github.com/scottyzen/woonuxt-settings',
      );
    }
  },
});
